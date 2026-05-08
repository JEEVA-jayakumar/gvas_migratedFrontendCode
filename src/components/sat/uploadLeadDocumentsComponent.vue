<template>
  <div>
    <q-item separator class="q-body-1">
      <q-item-section>
        <q-item-label>
          <div class="q-body-1">
            Merchant Type:
            <span class="text-weight-medium">{{merchantTypeSelection}}</span>
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- START >> (Mandatory) General application form -->
    <q-item separator class="q-body-1 text-dark bg-grey-4 text-weight-medium">
      <q-item-section>Application Form</q-item-section>
      <q-item-section>
        <label id="attach" class="cursor-pointer text-white" style="background-color: #202c3f;">
          <span  class="q-caption text-weight-light">Attach</span>
          <input
            type="file"
            name="file"
            @change="fnUploadApplicationForm($event,document)"
            accept=".png, .jpg, .pdf"
          />
        </label>
      </q-item-section>
    </q-item>
    <q-item separator class="q-body-1">
      <q-item-section>
        <div class="full-width" v-if="getShortLeadInfo">
          <div
            class="cursor-pointer"
            v-if="getShortLeadInfo.applicationFileMimeType && getShortLeadInfo.applicationFileMimeType.includes('pdf')"
          >
            <div @click="fnPDFViewModal(getShortLeadInfo.applicationFile)" class="ellipsis">
              <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
              &nbsp;{{getShortLeadInfo.applicationFile}}
            </div>
          </div>
          <div
            class="cursor-pointer"
            v-else-if="getShortLeadInfo.applicationFileMimeType && getShortLeadInfo.applicationFileMimeType.includes('image')"
          >
            <viewer
              :images="[GLOBAL_FILE_FETCH_URL+ '/'+getShortLeadInfo.applicationFile]"
              class="hidden"
            >
              <img
                :src="[GLOBAL_FILE_FETCH_URL+ '/'+getShortLeadInfo.applicationFile]"
                ref="handedOverImageViewer"
                style="max-width:100%"
              />
            </viewer>
            <div @click="fnViewHandedOverFileImage()" class="ellipsis">
              <q-icon name="fas fa-image" color="amber-9" />
              &nbsp;{{getShortLeadInfo.applicationFile}}
            </div>
          </div>
          <div v-else-if="!getShortLeadInfo.applicationFileMimeType">No document available</div>
          <div v-else>Invalid document type</div>
        </div>
      </q-item-section>
    </q-item>
    <!-- END >> (Mandatory) Application form  -->
    <!-- START >> (Optional) payment document file == bank subvention  -->
    <q-item
      v-if="getShortLeadInfo && getShortLeadInfo.paymentDocumentFile && getShortLeadInfo.paymentDocumentFile != ''"
      separator
      class="q-body-1 text-dark bg-grey-4 text-weight-medium"
    >
      <q-item-section>Bank Letter</q-item-section>
    </q-item>
    <q-item v-if="getShortLeadInfo && getShortLeadInfo.paymentDocumentFile && getShortLeadInfo.paymentDocumentFile != ''" separator class="q-body-1">
      <q-item-section>
        <div class="full-width">
          <div
            class="cursor-pointer"
            v-if="getShortLeadInfo.paymentDocumentMimeType && getShortLeadInfo.paymentDocumentMimeType.includes('pdf')"
          >
            <div @click="fnPDFViewModal(getShortLeadInfo.paymentDocumentFile)" class="ellipsis">
              <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
              &nbsp;{{getShortLeadInfo.paymentDocumentFile}}
            </div>
          </div>
          <div
            class="cursor-pointer"
            v-else-if="getShortLeadInfo.paymentDocumentMimeType && getShortLeadInfo.paymentDocumentMimeType.includes('image')"
          >
            <viewer
              :images="[GLOBAL_FILE_FETCH_URL+ '/'+getShortLeadInfo.paymentDocumentFile]"
              class="hidden"
            >
              <img
                :src="[GLOBAL_FILE_FETCH_URL+ '/'+getShortLeadInfo.paymentDocumentFile]"
                ref="bankUploadedLetter"
                style="max-width:100%"
              />
            </viewer>
            <div @click="fnViewbankUploadedLetterImage()" class="ellipsis">
              <q-icon name="fas fa-image" color="amber-9" />
              &nbsp;{{getShortLeadInfo.paymentDocumentFile}}
            </div>
          </div>
          <div v-else>Invalid document type/ No document available</div>
        </div>
      </q-item-section>
    </q-item>
    <!-- END >> (Mandatory) payment document file == bank subvention  -->
    <div v-if="merchantTypeSelection == 0" class="full-width q-body-1 q-pa-sm">
      <p>No documents available to display</p>
    </div>

    <!-- START >> Handover to SAT, document upload -->
    <div v-else-if="uploadedDocuments" class="group">
      <template v-for="(singleDocument,singleDocumentIndex) in uploadedDocuments.forSingleDocument"
        :key="singleDocumentIndex">
      <q-list
        class="no-padding"
        dense
        v-if="singleDocument && singleDocument.isQr != 1"
      >
        <template
          v-for="(document,documentIndex) in singleDocument.documents"
          :key="documentIndex"
        >
        <div
          class="border-bottom"
        >
        <!-- <p>Document Type: {{ document.documentType }}</p> -->
      <!-- <p>Subdocument Type: {{ document.subDocumentType }}</p> -->
        <!-- <p>Is QR: {{ document.isQr }}</p> -->
          <q-item separator dense class="q-body-1 bg-grey-4 q-pa-sm">
          
            <q-item-section>
              {{document.subDocumentType}}
              
              </q-item-section>
          
            <!-- <q-item-section>
               @update:model-value="docuValue(document)"
              </q-item-section> -->

            <q-item-section>
              <label  id="attach" class="cursor-pointer text-white" style="background-color: #202c3f;">
                <span class="q-caption text-weight-light">Attach</span>
                <input
                  type="file"
                  name="file"
                  @change="fnVerificationDocumentUploadSingleUpload($event,document)"
                  accept=".png, .jpg, .pdf"
                />
              </label>
            </q-item-section>
          </q-item>

          <template
            v-for="(displayAttachedFile, displayAttachedFileIndex) in (getShortLeadInfo && getShortLeadInfo.leadDocuments)"
            :key="displayAttachedFileIndex"
          >
            <div v-if="document && displayAttachedFileIndex == document.documentType">
              <template
                v-for="attachedSubFile in displayAttachedFile"
                :key="attachedSubFile.id"
              >
                <div v-if="attachedSubFile.subDocumentType == document.subDocumentType">
                  <q-item
                    dense
                    v-for="(filesAttachedEarlier,filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                    :key="filesAttachedEarlierIndex"
                    class="q-body-1"
                    separator
                  >
                <q-item-section>
                  <q-item-label class="q-body-1">
                    <div
                      class="cursor-pointer"
                      v-if="filesAttachedEarlier.mimeType.includes('pdf')"
                    >
                      <div
                        ref="attachedImageViewer"
                        @click="fnPDFViewModal(filesAttachedEarlier.fileName)"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-file-pdf" color="negative" />
                        &nbsp;{{filesAttachedEarlier.fileName}}
                      </div>
                    </div>
                    <div
                      class="cursor-pointer"
                      v-else-if="filesAttachedEarlier.mimeType.includes('image')"
                    >
                      <viewer
                        :images="[GLOBAL_FILE_FETCH_URL+ '/'+filesAttachedEarlier.fileName]"
                        class="hidden"
                      >
                        <img
                          :src="[GLOBAL_FILE_FETCH_URL+ '/'+filesAttachedEarlier.fileName]"
                          ref="attachedImageViewer"
                          style="max-width:100%"
                        />
                      </viewer>
                      <div
                        @click="fnViewAttachedFileImage(filesAttachedEarlierIndex)"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{filesAttachedEarlier.fileName}}
                      </div>
                    </div>
                  </q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-btn
                    size="xs"
                    icon="clear"
                    @click="fnDeleteAlreadyAttachedFile(filesAttachedEarlier)"
                    round
                    color="negative"
                    label="Remove"
                  />
                </q-item-section>
                  </q-item>
                </div>
              </template>
            </div>
          </template>
        </div>
        </template>
      </q-list>
      </template>
      <div>
      <template v-for="multipleDocument in uploadedDocuments.forMutipleDocument"
        :key="multipleDocument.id">
      <q-list
        class="no-padding"
        dense
        v-if="multipleDocument && multipleDocument.isQr != 1"
      >   
        <q-item-label header v-if="multipleDocument.isQr != 1" class="q-mb-sm bg-grey-4">{{multipleDocument.documentType}}
        </q-item-label>
         
        <div>
          <q-item separator dense class="q-body-1 q-pa-sm">
            <q-item-section>
              <!-- <pre>{{multipleDocument.subDocumentTypeSelection}}</pre> -->
              <select
                v-if="multipleDocument.isQr != 1" 
                class="full-width customQuasarSelect"
                v-model="multipleDocument.subDocumentTypeSelection"
                @change="fnGetSubDocuments(multipleDocument.subDocumentTypeSelection)"
              >
                <option disabled value="0">Choose from below</option>
               <template v-for="type in multipleDocument.documents" :key="type.id">
                <option
                    v-if= "type.isQr!= 1"
                    :value="type"
                  >{{type.subDocumentType}}</option>
               </template>

              </select>
              
            </q-item-section>
            
            <q-item-section
              v-if="fn_________GetEntryPermissionToUploadSubDocuments(multipleDocument)"
              ref="subDocumentUploadParent"
            >
              <label  id="attach" class="cursor-pointer text-white" style="background-color: #202c3f;">
                <span class="q-caption text-weight-light">Attach</span>
                <input
                  type="file"
                  ref="subDocumentUpload"
                  @change="fnVerificationDocumentUpload($event,multipleDocument.subDocumentTypeSelection)"
                  name="file"
                  accept=".png, .jpg, .pdf"
                />
              </label>
            </q-item-section>
          </q-item>
        </div>
      
        <q-separator />
        
        <template
            v-for="(displayAttachedFile, displayAttachedFileIndex) in (getShortLeadInfo && getShortLeadInfo.leadDocuments)"
            :key="displayAttachedFileIndex"
          >
        <div v-if="multipleDocument && displayAttachedFileIndex == multipleDocument.documentType">
          <template
            v-for="attachedSubFile in displayAttachedFile"
            :key="attachedSubFile.id"
          >
          <div>
            <q-item
              v-for="(filesAttachedEarlier,filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
              :key="filesAttachedEarlierIndex"
              class="q-body-1"
              separator
              dense
            >
              <q-item-section>
                <q-item-label class="q-body-1">
                  <div class="cursor-pointer" v-if="filesAttachedEarlier.mimeType.includes('pdf')">
                    <div
                      ref="multiAttachedImageViewer"
                      @click="fnPDFViewModal(filesAttachedEarlier.fileName)"
                      class="ellipsis"
                    >
                      <q-icon name="fas fa-file-pdf" color="negative" />
                      &nbsp;{{filesAttachedEarlier.fileName}}
                    </div>
                  </div>
                  <div
                    class="cursor-pointer"
                    v-else-if="filesAttachedEarlier.mimeType.includes('image')"
                  >
                    <viewer
                      :images="[GLOBAL_FILE_FETCH_URL+ '/'+filesAttachedEarlier.fileName]"
                      class="hidden"
                    >
                      <img
                        :src="[GLOBAL_FILE_FETCH_URL+ '/'+filesAttachedEarlier.fileName]"
                        ref="multiAttachedImageViewer"
                        style="max-width:100%"
                      />
                    </viewer>
                    <div
                      @click="fnViewMultiAttachedFileImage(filesAttachedEarlierIndex)"
                      class="ellipsis"
                    >
                      <q-icon name="fas fa-image" color="amber-9" />
                      &nbsp;{{filesAttachedEarlier.fileName}}
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-btn
                  size="xs"
                  icon="clear"
                  @click="fnDeleteAlreadyAttachedFile(filesAttachedEarlier)"
                  round
                  color="negative"
                  label="Remove"
                />
              </q-item-section>
            </q-item>
            <q-separator />
          </div>
          </template>
        </div>
        </template>
      </q-list>
      </template>
    </div>
    </div>
    <!-- END >> Handover to SAT, document upload -->
    <!-- START >> COMPONENT: View PDF  -->
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    ></showPdfModalComponent>
    <!-- END >> COMPONENT: View PDF -->
  </div>
</template>

<script>
import { url } from '@vuelidate/validators';
import { mapGetters, mapActions } from "vuex";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";

export default {
  props: ["propMerchantTypeFromSO"],

  components: {
    showPdfModalComponent
  },

  data() {
    return {
      PDFDetails: null,
      toggleshowPDFModal: false,
      formData: {
        shortLead: this.propMerchantTypeFromSO,
        documentType: []
      },
      merchantTypeSelection: this.propMerchantTypeFromSO && this.propMerchantTypeFromSO.merchantType ? this.propMerchantTypeFromSO.merchantType.merchantTypeName : '',
      subDocumentTypeSelection: 0,
      uploadedDocuments: null
    };
  },
  computed: {
    ...mapGetters("commonLoader", ["getToggleCommonLoader"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("SatLeadValidation", [
      "getShortLeadInfo",
      "getDeviceVerificationStatus",
      "getShortLeadInfoDocumentTypes"
    ])
  },

  created() {
    this.ajaxLoadShortLeadInfoForDocumentTypes();
  },
  methods: {
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    ...mapActions("SatLeadValidation", [
      "FEED_HAND_OVER_TO_SAT_DOCUMENT",
      "FEED_FULL_APPLICATION_FORM",
      "DELETE_DOCUMENT_FROM_BY_SAT",
      "FETCH_LEAD_DOCUMENT_TYPE_DATA",
      "FETCH_SHORT_LEAD_DATA"
    ]),
    ajaxLoadShortLeadInfoForDocumentTypes() {
      //function to load all lead details
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching files .."
      });
      this.FETCH_LEAD_DOCUMENT_TYPE_DATA()
        .then(response => {
          return this.fnGetMerchantTypeValue(
            this.propMerchantTypeFromSO.merchantType.merchantTypeName
          );
        }).then(response => {
          this.formData.documentType = this.getShortLeadInfoDocumentTypes;
          // console.log("VALUE FOR DOCUMENT------------->>>>",JSON.stringify(this.getShortLeadInfoDocumentTypes.uploadedDocuments.forSingleDocument))
          // console.log("DOCUMENT Deatils------------->>>>",JSON.stringify(this.getShortLeadInfoDocumentTypes.uploadedDocuments)) 
          // console.log("MutipleDocument Document Deatils------------->>>>",JSON.stringify(this.getShortLeadInfoDocumentTypes.uploadedDocuments.forMutipleDocument))
          this.$emit(
            "emitAjaxLoadShortLeadInfo",
            "hotReloadForDocumentsUploadValidation",
            this.merchantTypeSelection
          );
          this.$q.loading.hide();
        })
        .catch(error => {
          this.$q.loading.hide();
        });
      this.toggleAjaxLoadFilter = false;
    },

    fnGetMerchantTypeValue(inputValue) {
      if (!this.getShortLeadInfoDocumentTypes) return;
      let merchantDocumentCategory = _.find(
        this.getShortLeadInfoDocumentTypes,
        o => o.merchantType === inputValue
      );
      if (!merchantDocumentCategory || !merchantDocumentCategory.documentsApplicable) return;

      let arr = {
        forSingleDocument: [],
        forMutipleDocument: []
      };
      let innerSelf = this;
      let leadDocuments = innerSelf.getShortLeadInfo ? innerSelf.getShortLeadInfo.leadDocuments : {};

      merchantDocumentCategory.documentsApplicable.forEach(function(value) {
        if (value.viewType == 1) {
          arr.forSingleDocument.push(value);
        } else {
          if (leadDocuments && leadDocuments[value.documentType]) {
            let assumeArr = _.find(value.documents, function(oo) {
              const leadDocsForType = leadDocuments[oo.documentType];
              if (leadDocsForType && leadDocsForType.length > 0) {
                const firstDoc = leadDocsForType[0];
                if (oo.subDocumentType == firstDoc.subDocumentType ||
                    firstDoc.documentType == firstDoc.subDocumentType) {
                  return true;
                }
              }
              return false;
            });
            if (assumeArr == undefined) {
              value["subDocumentTypeSelection"] = 0;
            } else {
              value["subDocumentTypeSelection"] = assumeArr;
              // Ensure selectedSubDocumentType is set so Attach button appears
              if (!assumeArr.selectedSubDocumentType) {
                assumeArr.selectedSubDocumentType = assumeArr.subDocumentType;
              }
            }
          } else {
            value["subDocumentTypeSelection"] = 0;
          }
          arr.forMutipleDocument.push(value);
        }
      });
      this.uploadedDocuments = arr;
      console.log("POS CHECK", JSON.stringify(arr));
    },

    fnGetSubDocuments(documentDetails) {
      if (typeof documentDetails !== "undefined") {
        if (
          documentDetails.hasOwnProperty("selectedSubDocumentType") &&
          typeof documentDetails.selectedSubDocumentType !== "undefined"
        ) {
          documentDetails.selectedSubDocumentType =
            documentDetails.subDocumentType;
        } else {
          documentDetails["selectedSubDocumentType"] = documentDetails.subDocumentType;
        }
      }
    },
    // docuValue(document)
    // {
    //   let arrays= [];
    //   document=>{

    //   }
    // }

    //TODO default 1 for sat document submission as url params
    fnVerificationDocumentUpload(event, documentDetails) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Uploading file .."
      });
        let formData = new FormData();
      formData.append("file", event.target.files[0]);
      // formData.append("fileNameOriginal", "cheque");

      let requestParams = {
        files: formData,
        leadId: this.$route.params.id,
        documentId: documentDetails.id
      };

      this.FEED_HAND_OVER_TO_SAT_DOCUMENT(requestParams)
        .then(response => {
          this.$q.loading.hide();
          this.$emit(
            "emitAjaxLoadShortLeadInfo",
            "hotReloadForDocumentsUploadValidation",
            this.merchantTypeSelection
          );
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Failed to upload document",
            icon: "thumb_down"
          });
        });
    },

    //TODO default 1 for sat document submission as url params
    fnUploadApplicationForm(event, documentDetails) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Uploading file .."
      });
     let formData = new FormData();
      formData.append("file", event.target.files[0]);

      let requestParams = {
        files: formData,
        leadId: this.$route.params.id
      };

      this.FEED_FULL_APPLICATION_FORM(requestParams)
        .then(response => {
          this.$q.loading.hide();
          this.$emit(
            "emitAjaxLoadShortLeadInfo",
            "hotReloadForDocumentsUploadValidation",
            this.merchantTypeSelection
          );
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Failed to upload document",
            icon: "thumb_down"
          });
        });
    },

    //TODO default 1 for sat document submission as url params
    fnVerificationDocumentUploadSingleUpload(event, documentDetails) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Uploading file .."
      });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);

      let requestParams = {
        files: formData,
        leadId: this.$route.params.id,
        documentId: documentDetails.id
      };
      this.FEED_HAND_OVER_TO_SAT_DOCUMENT(requestParams)
        .then(response => {
          this.$emit(
            "emitAjaxLoadShortLeadInfo",
            "hotReloadForDocumentsUploadValidation",
            this.merchantTypeSelection
          );
          this.$q.loading.hide();
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Failed to upload document",
            icon: "thumb_down"
          });
        });
    },

    fnDeleteAlreadyAttachedFile(documentDetails) {
      let innerSelf = this;
      innerSelf.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to delete uploaded document?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({
            delay: 0, // ms
            spinnerColor: "purple-9",
            message: "Processing .."
          });
          innerSelf
            .DELETE_DOCUMENT_FROM_BY_SAT(documentDetails)
            .then(response => {
              innerSelf.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully removed!",
                icon: "thumb_up"
              });
              // innerSelf.FETCH_SHORT_LEAD_DATA(innerSelf.$route.params.id);
              innerSelf.$emit(
                "emitAjaxLoadShortLeadInfo",
                "hotReloadForDocumentsUploadValidation",
                innerSelf.merchantTypeSelection
              );
              this.$q.loading.hide();
            }).catch(error => {
              this.$q.loading.hide();
              innerSelf.$q.notify({
                color: "negative",
                position: "bot  tom",
                message: error.body.message == null ? "Please Try Again Later !" : error.body.message,
                icon: "thumb_down"
              });
            });
        })
        .catch(() => {
          innerSelf.$q.notify({
            color: "negative",
            position: "bottom",
            message: "No changes made!",
            icon: "thumb_down"
          });
        });
    },

    fn_________GetEntryPermissionToUploadSubDocuments(multipleDocument) {
      if (
        multipleDocument.hasOwnProperty("subDocumentTypeSelection") &&
        typeof multipleDocument.subDocumentTypeSelection !== "undefined" &&
        multipleDocument.subDocumentTypeSelection.hasOwnProperty(
          "selectedSubDocumentType"
        ) &&
        typeof multipleDocument.subDocumentTypeSelection
          .selectedSubDocumentType !== "undefined"
      ) {
        return true;
      } else {
        return false;
      }
    },

    fnViewHandedOverFileImage() {
      this.$refs.handedOverImageViewer.click();
    },

    fnViewbankUploadedLetterImage() {
      this.$refs.bankUploadedLetter.click();
    },

    fnViewAttachedFileImage(attachedImageIndex) {
      this.$refs.attachedImageViewer[attachedImageIndex].click();
    },

    fnViewMultiAttachedFileImage(attachedImageIndex) {
      this.$refs.multiAttachedImageViewer[attachedImageIndex].click();
    },

    // Function to show PDF
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    }
  }
};
</script>

<style>
.customQuasarSelect {
  padding: 5px;
  height: 33px;
}

label {
  padding: 5px 10px;
  display: table;

}

input[type="file"] {
  display: none;
}
.bg-dark-custom {
  background: rgba(0, 0, 0, 0.5);
}
#attach {
height: 33px;
}
</style>