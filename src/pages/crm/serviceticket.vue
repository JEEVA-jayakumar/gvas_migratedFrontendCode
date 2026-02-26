<template>
  <q-page>
    <div class="q-pa-md">
      <q-tabs
        v-model="activeTab"
        class="shadow-1 bg-grey-1"
        active-color="purple-9"
        indicator-color="purple-9"
        @update:model-value="handleTabChange"
      >
        <q-tab name="tab-1" label="Create Bulk Ticket" />
        <q-tab name="tab-2" label="Close Bulk Ticket" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Create Bulk Ticket -->
        <q-tab-panel name="tab-1">
          <div class="q-pa-md">
            <div class="row text-center justify-center">
              <div class="col-md-12 q-py-sm bottom-border bg-grey-2">
                <div class="text-h6 text-grey-9">Ticket Creation - Bulk Upload</div>
              </div>
              <div class="col-md-8 q-py-md">
                <a href="/files/Create_Ticket.xlsx" class="text-primary text-weight-bold" download>
                  Click here to download the template
                </a>
              </div>
              <div class="col-md-8 q-py-md">
                <div
                  v-if="formData.fileSelected.length == 0"
                  class="drop-zone cursor-pointer q-pa-xl text-grey-7"
                  :class="{ 'drop-zone--hover': uploaderHovered0 }"
                  @dragover.prevent="uploaderHovered0 = true"
                  @dragleave.prevent="uploaderHovered0 = false"
                  @drop.prevent="onDrop($event, 0)"
                  @click="$refs.fileInput0.click()"
                >
                  <q-icon name="cloud_upload" size="3rem" />
                  <div>Drag & Drop or click here to open a file</div>
                  <input
                    type="file"
                    class="hidden"
                    ref="fileInput0"
                    @change="onChange($event, 0)"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                </div>
                <div v-else>
                  <q-card flat bordered class="q-pa-sm bg-grey-1">
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="insert_drive_file" color="purple-9" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ formData.fileSelected[0].name }}</q-item-label>
                        <q-item-label caption>{{ (formData.fileSelected[0].size / 1024).toFixed(2) }} KB</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn round flat icon="clear" color="negative" @click="formData.fileSelected = []" />
                      </q-item-section>
                    </q-item>
                  </q-card>
                </div>
              </div>
              <div class="col-md-12 q-mt-md">
                <q-btn
                  color="purple-9"
                  :disabled="formData.fileSelected.length == 0"
                  label="Upload & Create"
                  @click="uploadlist"
                  icon="upload"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- Close Bulk Ticket -->
        <q-tab-panel name="tab-2">
          <div class="q-pa-md">
            <div class="row text-center justify-center">
              <div class="col-md-12 q-py-sm bottom-border bg-grey-2">
                <div class="text-h6 text-grey-9">Ticket Closing - Bulk Upload</div>
              </div>
              <div class="col-md-8 q-py-md">
                <a href="/files/close_Ticket.xlsx" class="text-primary text-weight-bold" download>
                  Click here to download the template
                </a>
              </div>
              <div class="col-md-8 q-py-md">
                <div
                  v-if="formData1.fileSelected.length == 0"
                  class="drop-zone cursor-pointer q-pa-xl text-grey-7"
                  :class="{ 'drop-zone--hover': uploaderHovered1 }"
                  @dragover.prevent="uploaderHovered1 = true"
                  @dragleave.prevent="uploaderHovered1 = false"
                  @drop.prevent="onDrop($event, 1)"
                  @click="$refs.fileInput1.click()"
                >
                  <q-icon name="cloud_done" size="3rem" />
                  <div>Drag & Drop or click here to open a file</div>
                  <input
                    type="file"
                    class="hidden"
                    ref="fileInput1"
                    @change="onChange($event, 1)"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                </div>
                <div v-else>
                  <q-card flat bordered class="q-pa-sm bg-grey-1">
                    <q-item>
                      <q-item-section avatar>
                        <q-icon name="insert_drive_file" color="purple-9" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ formData1.fileSelected[0].name }}</q-item-label>
                        <q-item-label caption>{{ (formData1.fileSelected[0].size / 1024).toFixed(2) }} KB</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn round flat icon="clear" color="negative" @click="formData1.fileSelected = []" />
                      </q-item-section>
                    </q-item>
                  </q-card>
                </div>
              </div>
              <div class="col-md-12 q-mt-md">
                <q-btn
                  color="purple-9"
                  :disabled="formData1.fileSelected.length == 0"
                  label="Upload & Close"
                  @click="uploadlist1"
                  icon="upload"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ServiceTicket",
  data() {
    return {
      activeTab: "tab-1",
      formData: { fileSelected: [] },
      formData1: { fileSelected: [] },
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      uploaderHovered0: false,
      uploaderHovered1: false,
    };
  },
  methods: {
    ...mapActions("SatRegionalInventory", [
      "TICKET_CREATION_BULK_UPLOAD",
      "TICKET_CLOSE_BULK_UPLOAD"
    ]),
    onDrop(event, target) {
      this.uploaderHovered0 = false;
      this.uploaderHovered1 = false;
      const files = Array.from(event.dataTransfer.files);
      if (target === 0) {
        this.formData.fileSelected = files;
      } else {
        this.formData1.fileSelected = files;
      }
    },
    onChange(event, target) {
      const files = Array.from(event.target.files);
      if (target === 0) {
        this.formData.fileSelected = files;
      } else {
        this.formData1.fileSelected = files;
      }
    },
    handleTabChange(tab) {
      if (tab === "tab-1") {
        this.formData1.fileSelected = [];
      } else {
        this.formData.fileSelected = [];
      }
    },
    uploadlist() {
      if (this.formData.fileSelected.length === 0) return;
      this.toggleAjaxLoadFilter = true;
      let fd = new FormData();
      fd.append("file", this.formData.fileSelected[0]);

      this.TICKET_CREATION_BULK_UPLOAD({ file: fd })
        .then((response) => {
          this.handleUploadResponse(response, "Updated_Tickets.xlsx");
          this.formData.fileSelected = [];
          this.toggleAjaxLoadFilter = false;
        })
        .catch((error) => {
          this.toggleAjaxLoadFilter = false;
          this.handleUploadError(error);
        });
    },
    uploadlist1() {
      if (this.formData1.fileSelected.length === 0) return;
      this.toggleAjaxLoadFilter1 = true;
      let fd = new FormData();
      fd.append("file", this.formData1.fileSelected[0]);

      this.TICKET_CLOSE_BULK_UPLOAD({ file: fd })
        .then((response) => {
          this.handleUploadResponse(response, "Updated_Closing_Tickets.xlsx");
          this.formData1.fileSelected = [];
          this.toggleAjaxLoadFilter1 = false;
        })
        .catch((error) => {
          this.toggleAjaxLoadFilter1 = false;
          this.handleUploadError(error);
        });
    },
    handleUploadResponse(response, fileName) {
        try {
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            this.$q.notify({ color: "positive", message: "Upload Successful!", icon: "thumb_up" });
        } catch (e) {
            console.error("Error processing download:", e);
            this.$q.notify({ color: "positive", message: "Upload Successful! (Download failed)" });
        }
    },
    handleUploadError(error) {
        console.error("Upload error:", error);
        const message = (error.body && error.body.message) ? error.body.message : "Upload failed. Please try again.";
        this.$q.notify({ color: "negative", message: message, icon: "thumb_down" });
    }
  }
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.drop-zone--hover {
  border-color: #61116a;
  background-color: #f3e5f5;
}
.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>
