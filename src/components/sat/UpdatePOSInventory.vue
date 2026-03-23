<template>
  <q-dialog persistent v-model="toggleModel">
    <q-card style="min-width: 60vw">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input label="Device Purchase Cost" placeholder="Device Purchase Cost" color="grey-9"
              v-model="formData.devicePurchaseCost" @blur="v$.formData.devicePurchaseCost.$touch()"
              :error="v$.formData.devicePurchaseCost.$error" />
          </div>
          <div class="col-12">
            <q-input label="Total Life of Device in Days" placeholder="Total Life of Device in Days" color="grey-9"
              v-model="formData.deviceLife" @blur="v$.formData.deviceLife.$touch()"
              :error="v$.formData.deviceLife.$error" />
          </div>
          <div class="col-12">
            <q-input label="Invoice Number" placeholder="Invoice Number" color="grey-9"
              v-model="formData.invoiceNumbers" @blur="v$.formData.invoiceNumbers.$touch()"
              :error="v$.formData.invoiceNumbers.$error" />
          </div>
          <div class="col-12">
            <div class="text-subtitle2 q-mb-sm">Invoice Copy</div>
            <div v-if="formData.fileSelected.length === 0"
              class="drop cursor-pointer flex flex-center border-dashed border-grey-4 q-pa-md bg-green-1"
              style="border: 2px dashed #ccc; min-height: 100px" @dragover.prevent @drop.prevent="onDrop">
              <label class="cursor-pointer full-width text-center">
                Drag & Drop or click here to open a file
                <input type="file" class="hidden" @change="onChange" multiple
                  accept=".csv, .xlsx, .xls, .pdf, .png, .jpg, .jpeg" />
              </label>
            </div>
            <div v-else>
              <q-list bordered separator>
                <q-item v-for="(file, index) in formData.fileSelected" :key="index">
                  <q-item-section avatar><q-icon name="attach_file" /></q-item-section>
                  <q-item-section>{{ file.name }}</q-item-section>
                  <q-item-section side>
                    <q-btn flat round color="negative" icon="close" @click="removeUploadedFiles(index)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="end" class="q-pa-md">
        <q-btn flat label="Cancel" color="negative" @click="emitfnshowPosInventory" />
        <q-btn label="Submit" color="purple-9" @click="PosFinanceSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "UpdatePOSInventory",
  props: ["propShowPosInventory", "propRowDetails"],
  setup() { return { v$: useVuelidate() }; },
  data() {
    return {
      toggleModel: this.propShowPosInventory,
      formData: {
        id: JSON.stringify(this.propRowDetails.id),
        devicePurchaseCost: "",
        deviceLife: "1460",
        invoiceNumbers: "",
        fileSelected: []
      }
    };
  },
  validations() {
    return { formData: { devicePurchaseCost: { required }, deviceLife: { required }, invoiceNumbers: { required } } };
  },
  created() {
    this.getInvoiceNumber(JSON.stringify(this.propRowDetails.id));
  },
  methods: {
    ...mapActions("posInventoryFinance", ["FETCH_POS_FINANCE_SUBMIT"]),
    ...mapActions("VerifyDevice", ["GET_INVOICE_NUMBER_FROM_INVENTORY"]),
    emitfnshowPosInventory() { this.$emit("emitfnshowPosInventory"); },
    getInvoiceNumber(id) {
      this.GET_INVOICE_NUMBER_FROM_INVENTORY(id).then(res => {
        this.formData.invoiceNumbers = res.data?.InvoiceNumber || "";
      });
    },
    onDrop(e) { this.formData.fileSelected = Array.from(e.dataTransfer.files); },
    onChange(e) { this.formData.fileSelected = Array.from(e.target.files); },
    removeUploadedFiles(index) { this.formData.fileSelected.splice(index, 1); },
    async PosFinanceSubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid || this.formData.fileSelected.length === 0) {
        this.$q.notify({ color: "amber-9", message: "Please fill all fields and upload a file" });
        return;
      }
      this.$q.loading.show({ message: "Submitting..." });
      let fd = new FormData();
      this.formData.fileSelected.forEach(f => fd.append("file", f));
      const payload = { file: fd, id: this.formData.id, devicePurchaseCost: this.formData.devicePurchaseCost, deviceLife: this.formData.deviceLife, invoiceNumbers: this.formData.invoiceNumbers };
      this.FETCH_POS_FINANCE_SUBMIT(payload).then(() => {
        this.$q.notify({ color: "positive", message: "Successfully updated!" });
        this.emitfnshowPosInventory();
        this.$q.loading.hide();
      }).catch(err => {
        this.$q.notify({ color: "negative", message: err.data?.message || "Error submitting" });
        this.$q.loading.hide();
      });
    }
  }
};
</script>