<template>
  <q-page>
    <q-dialog minimized persistent class="customModalOverlay" v-model="toggleModel"
      :content-css="{ padding: '10px', minWidth: '63vw' }">
      <q-card style="width:100%; min-width: 60vw;">
        <q-card-section>
          <div class="row">
            <!-- START >> Setup MDR details -->
            <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm" style="width: 100%">
                <q-list no-border>
                  <div class="col-md-12">
                    <q-input label="Device Purchase Cost" placeholder="Device Purchase Cost"
                      class="q-my-md" color="grey-9" align="left" @blur="v$.formData.devicePurchaseCost.$touch()"
                      :error="v$.formData.devicePurchaseCost.$error" v-model="formData.devicePurchaseCost" />
                  </div>
                  <div class="col-md-12">
                    <q-input label="Total Life of Device in Days"
                      placeholder="Total Life of Device in Days" class="q-my-md" color="grey-9" align="left"
                      @blur="v$.formData.deviceLife.$touch()" :error="v$.formData.deviceLife.$error"
                      v-model="formData.deviceLife" />
                  </div>
                  <div class="col-md-12">
                    <q-input label="Invoice Number" placeholder="Invoice Number" class="q-my-md"
                      color="grey-9" align="left" @blur="v$.formData.invoiceNumbers.$touch()"
                      :error="v$.formData.invoiceNumbers.$error" v-model="formData.invoiceNumbers" />
                  </div>
                  <div class="col">
                    <b>Placeholder Invoice Copy</b>
                  </div>
                  <div class="col-md-3 q-py-md" align="center">
                    <div v-if="formData.fileSelected.length === 0" :class="[
                          uploaderHovered
                            ? 'toggleBulkUploadDisable'
                            : 'toggleBulkUploadActive'
                        ]" class="drop display-inline align-center cursor-pointer"
                      @dragover.prevent="dragAndDropCustomAnimate(true)"
                      @dragleave.prevent="dragAndDropCustomAnimate(false)" @drop="onDrop">
                      <q-card class="q-pa-xs bg-green-3">
                        <label class="btn display-inline cursor-pointer">
                          Drag & Drop or click here to open a file
                          <input type="file" name="image" @change="onChange" ref="deviceBulkUpload"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .pdf, image/png, image/jpeg, image/jpg"
                            multiple />
                        </label>
                      </q-card>
                    </div>
                    <div v-else align="left">
                      <q-card dense class="q-pa-xs">
                        <q-card-section class="q-pa-xs bg-green-3">
                          Uploaded Files
                        </q-card-section>
                        <q-separator />
                        <q-card-section>
                          <div v-for="(file, index) in formData.fileSelected" :key="index">
                            <q-item dense>
                              <q-item-section avatar>
                                <q-icon name="attach_file" />
                              </q-item-section>
                              <q-item-section>{{ file.name }}</q-item-section>
                              <q-item-section side>
                                <q-btn class="fa fa-close" size="sm" color="negative" @click="removeUploadedFiles(index)"
                                  label="Remove" icon="clear" />
                              </q-item-section>
                            </q-item>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-list>
            </div>
            <!-- END >> Setup MDR details -->
          </div>
        </q-card-section>
        <q-card-actions align="end">
          <q-btn push label="Cancel" align="right" color="negative" @click="emitfnshowPosInventory()" />
          <q-btn push label="Submit" @click="PosFinanceSubmit(formData)" color="purple-9" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  /* START >> Modal components Lead source, device, merchant type */
  import { useVuelidate } from '@vuelidate/core';
  import { required } from "@vuelidate/validators";
  import { mapActions } from "vuex";
  // import financeInvoiceCopy from "../../components/inventory/financeInvoiceCopy.vue";
  export default {
    setup() {
      return { v$: useVuelidate() };
    },
    props: ["propShowPosInventory", "propRowDetails"],
    name: "MDRdetails",
    components: {
      // financeInvoiceCopy
    },
    data() {
      return {
        toggleModel: this.propShowPosInventory,
        //   openBulkModal: false,
        formData: {
          id: JSON.stringify(this.propRowDetails.id),
          devicePurchaseCost: "",
          deviceLife: "1460",
          invoiceNumbers: "",
          fileSelected: []
        },
        uploaderHovered: false
      };
    },
    validations() {
      return {
        formData: {
          devicePurchaseCost: { required },
          deviceLife: { required },
          invoiceNumbers: { required },
        }
      };
    },

    created() {
      this.getInvoiceNumber(JSON.stringify(this.propRowDetails.id));
    },
    beforeMount() {
      console.log("propRowDetails ------->", JSON.stringify(this.propRowDetails));
    },
    mounted() {
      // console.log("FormData:", assumeFormDataValue);
    },

    computed: {
      // ...mapGetters("posInventoryFinance", ["getreassignReasonList"])
    },

    methods: {
      ...mapActions("posInventoryFinance", ["FETCH_POS_FINANCE_SUBMIT"]),
      ...mapActions("VerifyDevice", [
        "GET_INVOICE_NUMBER_FROM_INVENTORY"
      ]),
      emitfnshowPosInventory() {
        this.$emit("emitfnshowPosInventory");
      },
      getInvoiceNumber(res){
        this.GET_INVOICE_NUMBER_FROM_INVENTORY(res)
          .then((response) => {
            const invoiceNumber = response.data && response.data.InvoiceNumber ? response.data.InvoiceNumber : "";
            this.formData.invoiceNumbers = invoiceNumber;
          })
          .catch(() => {
            // this.$q.notify({
            //   color: "primary",
            //   position: "bottom",
            //   message: "invalid",
            //   icon: "info"
            // });
          });
      },
      dragAndDropCustomAnimate(action) {
        this.uploaderHovered = action;
      },
      onDrop: function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.formData.fileSelected = Array.from(e.dataTransfer.files);
        this.fileCheckSum(this.formData.fileSelected);
        console.log("fileCheckSum", this.fileCheckSum);
      },

      fileCheckSum(file) {
        let re = /(\.csv|\.xlsx|\.xls|\.pdf|\.png|\.jpg|\.jpeg)$/i;
        if (!re.exec(file[0].name)) {
          this.formData.fileSelected = [];
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "File format not supported",
            icon: "clear"
          });
          return false;
        }
      },
      onChange(e) {
        this.formData.fileSelected = Array.from(e.target.files); // Convert FileList to array
        console.log("onChange--------->>>>", this.formData.fileSelected);
      },
      removeUploadedFiles(index) {
        this.formData.fileSelected.splice(index, 1); // Remove file at given index
      },

      async PosFinanceSubmit(request) {
        this.$q.loading.show({
          delay: 0, // ms
          spinnerColor: "purple-9",
          message: "Validating .."
        });
        const isCorrect = await this.v$.formData.$validate();
        if (!isCorrect || this.formData.fileSelected.length == 0) {
          this.$q.notify({
            color: "amber-9",
            position: "bottom",
            message: "Please fill all mandatory fields and upload a file",
            icon: "warning"
          });
          this.$q.loading.hide();
        } else {
          let assumeFormData = new FormData();
          for (let i = 0; i < this.formData.fileSelected.length; i++) {
            assumeFormData.append("file", this.formData.fileSelected[i]);
          }

          let assumeFormDataValue = {
            file: assumeFormData,
            id: this.formData.id,
            devicePurchaseCost: request.devicePurchaseCost,
            deviceLife: request.deviceLife,
            invoiceNumbers: request.invoiceNumbers
          };

          this.FETCH_POS_FINANCE_SUBMIT(assumeFormDataValue)
            .then(response => {
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Devices Successfully added!",
                icon: "thumb_up"
              });
              this.$emit("emitfnshowPosInventory");
              this.$q.loading.hide();
              this.formData.fileSelected = [];
            })
            .catch(error => {
              const msg = error.data && error.data.message ? error.data.message : "Error submitting";
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: msg,
                icon: "thumb_down"
              });
              this.$q.loading.hide();
            });
        }
      },
    }
  };
</script>

<style></style>
