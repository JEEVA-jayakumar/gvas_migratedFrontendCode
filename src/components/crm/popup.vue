<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowservice"
      class="customModalOverlay"
    >
      <q-card style="min-width: 40vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">DOC Viewer</div>
          <q-spacer />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="text-center">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            style="max-width: 100%; max-height: 60vh; border: 1px solid #ccc;"
          />
          <div v-else class="q-pa-lg">No image details provided.</div>
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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PopupViewer",
  props: ["propShowPopup", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowPopup,
    };
  },
  computed: {
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    imageUrl() {
        return this.propRowDetails ? (this.GLOBAL_FILE_FETCH_URL + '/' + this.propRowDetails) : null;
    }
  },
  methods: {
    ...mapActions("globalSearchSerialNumber", ["DOC_DOWNLOAD"]),
    emitfnshowservice() {
      this.$emit("emitfnshowservice");
    },
    Download() {
      if (!this.propRowDetails) return;
      this.$q.loading.show({ message: "Preparing download.." });

      this.DOC_DOWNLOAD(this.propRowDetails)
        .then((response) => {
          const contentType = response.headers['content-type'];
          const blob = new Blob([response.data], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = this.propRowDetails;
          a.click();
          window.URL.revokeObjectURL(url);
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Download Successful", icon: "thumb_up" });
        })
        .catch((error) => {
          console.error("Download failed:", error);
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", message: "Download failed", icon: "error" });
        });
    },
  },
};
</script>
