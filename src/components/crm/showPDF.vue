<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      @hide="handleHide"

    >
      <q-card style="min-width: 60vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Document Viewer</div>
          <q-spacer />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section style="max-height: 70vh; overflow: auto;">
          <vue-pdf-embed
            v-if="pdfUrl"
            :source="pdfUrl"
          />
          <div v-else class="text-center q-pa-lg">
            Loading PDF...
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="Download" color="purple-9" label="Download" icon="download" />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import VuePdfEmbed from "vue-pdf-embed";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ShowPDF",
  components: {
    VuePdfEmbed,
  },
  props: ["propToggleshowPDFModal", "propPDFDetails"],
  data() {
    return {
      toggleModal: this.propToggleshowPDFModal,
    };
  },
  computed: {
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    pdfUrl() {
        return this.GLOBAL_FILE_FETCH_URL + '/' + this.propPDFDetails;
    }
  },
  methods: {
    ...mapActions("globalSearchSerialNumber", ["DOC_DOWNLOAD"]),
    Download() {
      this.$q.loading.show({ message: "Preparing download.." });
      this.DOC_DOWNLOAD(this.propPDFDetails)
        .then((response) => {
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = this.propPDFDetails || "document.pdf";
          a.click();
          window.URL.revokeObjectURL(url);
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Download started" });
        })
        .catch((error) => {
          this.$q.loading.hide();
          console.error("Download failed:", error);
          this.$q.notify({ color: "negative", message: "Download failed" });
        });
    },
    handleHide() {
      this.$emit("togglePDFModal");
    }
  },
};
</script>
