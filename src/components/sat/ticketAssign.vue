<template>
  <div class="q-pa-md">
    <div class="row text-center justify-center">
      <div class="col-md-12 q-py-sm bottom-border custom-background">
        <div class="q-title text-grey-9 text-h6">Ticket Assign/Reassign - Bulk Upload</div>
      </div>
      <div class="col-md-8 q-py-md">
        <a href="/files/Assign_Ticket.xlsx" class="text-primary text-decoration-none">
          Click here to download the template
        </a>
      </div>
      <div class="col-md-8 q-py-md">
        <div v-if="formData.fileSelected.length == 0" :class="[uploaderHovered0 ? 'border-primary' : 'border-grey-4']"
          class="drop cursor-pointer flex flex-center" style="border: 2px dashed; min-height: 200px; background: #f9f9f9"
          @dragover.prevent="uploaderHovered0 = true" @dragleave.prevent="uploaderHovered0 = false" @drop.prevent="onDrop">
          <label class="cursor-pointer full-width full-height flex flex-center">
            Drag & Drop or click here to open a file
            <input type="file" class="hidden" @change="onChange" accept=".xlsx, .xls, .csv" />
          </label>
        </div>
        <q-card v-else flat bordered class="q-pa-sm">
          <q-card-section class="row items-center q-gutter-sm">
            <q-icon name="attach_file" size="sm" />
            <div class="col text-subtitle2">{{ formData.fileSelected[0].name }}</div>
            <q-btn flat round color="negative" icon="close" @click="formData.fileSelected = []" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 q-mt-md">
        <q-btn color="purple-9" :disabled="formData.fileSelected.length == 0" label="Upload" @click="uploadlist" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ticketAssign",
  data() {
    return {
      formData: { fileSelected: [] },
      uploaderHovered0: false
    };
  },
  methods: {
    ...mapActions("SatRegionalInventory", ["TICKET_ASSIGN_BULK_UPLOAD"]),
    onDrop(e) {
      this.uploaderHovered0 = false;
      this.formData.fileSelected = Array.from(e.dataTransfer.files);
    },
    onChange(e) {
      this.formData.fileSelected = Array.from(e.target.files);
    },
    uploadlist() {
      this.$q.loading.show({ message: "Uploading..." });
      let fd = new FormData();
      fd.append("file", this.formData.fileSelected[0]);
      this.TICKET_ASSIGN_BULK_UPLOAD({ file: fd }).then((res) => {
        let blob = new Blob([res.data], { type: res.headers["content-type"] });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Assign_Status.xlsx";
        link.click();
        this.$q.notify({ color: "positive", message: "Successfully Assigned!", icon: "thumb_up" });
        this.formData.fileSelected = [];
        this.$q.loading.hide();
      }).catch(err => {
        this.$q.notify({ color: "negative", message: err.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        this.$q.loading.hide();
      });
    }
  }
};
</script>