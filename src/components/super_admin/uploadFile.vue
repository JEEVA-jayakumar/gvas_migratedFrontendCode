<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowUploadFile"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw; padding: 20px">
        <div class="column">
          <div class="q-py-sm text-h6 border-bottom">Upload Bank List</div>
          <div class="q-py-md">
            <div v-if="!uploadFileBoolean" class="row items-center q-gutter-md">
              <label
                class="cursor-pointer q-pa-sm text-white rounded-borders"
                :class="attachedFileName ? 'bg-light-blue' : 'bg-grey-7'"
                style="display: inline-block"
              >
                <span>
                  <q-icon name="attach_file" />
                  {{ attachedFileName ? "Modify" : "Attach" }}
                </span>
                <input
                  type="file"
                  ref="file"
                  name="file"
                  accept=".xlsx"
                  @change="fnGetUploadFileDetails"
                  style="display: none"
                />
              </label>
              <div v-if="attachedFileName" class="text-subtitle2">
                <span class="text-grey-7">Attached File:</span>
                {{ attachedFileName }}
              </div>
            </div>
            <div v-else>
              <q-btn
                dense
                outline
                color="grey-7"
                size="sm"
                class="no-pointer-events"
                >{{ uploadFileName }}</q-btn
              >
            </div>
          </div>
          <div class="q-py-sm row justify-end q-gutter-sm">
            <q-btn
              flat
              color="grey-7"
              @click="emitfnshowUploadFile"
              label="Cancel"
            />
            <q-btn
              v-if="sendForDataEntry"
              color="positive"
              @click="finalFileUploadAndSubmit()"
              label="Submit"
              icon="done"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["propShowUploadFile"],
  data() {
    return {
      uploadFileName: "",
      sendForDataEntry: false,
      uploadFileBoolean: false,
      attachedFileName: "",
      toggleModel: this.propShowUploadFile,
    };
  },
  methods: {
    ...mapActions("BankListUploadFile", ["UPLOAD_BANKLIST_FILE"]),
    emitfnshowUploadFile() {
      this.$emit("uploadFile");
    },
    finalFileUploadAndSubmit() {
      let formData = new FormData();
      let uploadFiles = this.$refs.file;
      formData.append("file", uploadFiles.files[0]);
      this.$q.loading.show({
        spinnerColor: "purple-9",
        message: "Processing ..",
      });
      this.UPLOAD_BANKLIST_FILE(formData)
        .then((response) => {
          this.$q.loading.hide();
          this.$emit("uploadFile");
          this.$q.notify({
            color: "positive",
            message: "Successfully uploaded",
            icon: "thumb_up",
          });
          this.attachedFileName = "";
          this.sendForDataEntry = false;
        })
        .catch((error) => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            message: error.data?.message || "Error occurred",
            icon: "thumb_down",
          });
        });
    },
    fnGetUploadFileDetails() {
      let uploadFiles = this.$refs.file;
      if (uploadFiles.files.length > 0) {
        this.attachedFileName = uploadFiles.files[0].name;
        this.sendForDataEntry = true;
      } else {
        this.attachedFileName = "";
        this.sendForDataEntry = false;
      }
    },
  },
};
</script>
