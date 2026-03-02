<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
    @hide="emitfnshowEditMDR"
  >
    <q-card style="min-width: 600px; max-width: 90vw;">
      <q-card-section class="bg-purple-9 text-white">
        <div class="text-h6">Edit MDR Details</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form @submit="fnEditMdrPlan(formData)" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                outlined
                dense
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                label="Select lead source"
                emit-value
                map-options
                @update:model-value="fnleadSource"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined
                dense
                v-model="formData.device"
                :options="dropDown.deviceOptions"
                label="Select device"
                emit-value
                map-options
                @update:model-value="fnDevice"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined
                dense
                v-model="formData.marsDeviceModel"
                :options="dropDown.marsDeviceOptions"
                label="Mars Device Model"
                emit-value
                map-options
                @update:model-value="fnMarsDeviceModel"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined
                dense
                v-model="formData.merchantCategory"
                :options="dropDown.merchantTypesOptions"
                label="Select merchant category type"
                emit-value
                map-options
                @update:model-value="fnMerchantCategory"
              />
            </div>
          </div>

          <q-input
            outlined
            dense
            v-model.trim="formData.mdrPlanName"
            label="Mdr Plan Name"
          />

          <!-- Rates Grid -->
          <div v-if="isDevice == 1">
            <div class="text-subtitle2 q-mb-md text-purple-9 border-bottom-soft">Card Rates (%)</div>
            <div class="row q-col-gutter-sm">
              <div v-for="field in mdrFields" :key="field.model" class="col-12 col-sm-4">
                <q-input
                  outlined
                  dense
                  type="number"
                  step="0.01"
                  v-model="formData[field.model]"
                  :label="field.label"
                  :error="v$.formData[field.model]?.$error"
                />
              </div>
            </div>

            <div class="text-subtitle2 q-mt-lg q-mb-md text-purple-9 border-bottom-soft">UPI Rates (%)</div>
            <div class="row q-col-gutter-sm">
              <div v-for="field in upiFields" :key="field.model" class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="number"
                  step="0.01"
                  v-model="formData[field.model]"
                  :label="field.label"
                  :error="v$.formData[field.model]?.$error"
                />
              </div>
            </div>
          </div>

          <div v-else-if="isDevice == 2">
            <div class="text-subtitle2 q-mb-md text-purple-9 border-bottom-soft">Merchant Rates (%)</div>
            <div class="row q-col-gutter-sm">
              <div v-for="field in merchantRateFields" :key="field.model" class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="number"
                  step="0.01"
                  v-model="formData[field.model]"
                  :label="field.label"
                  :error="v$.formData[field.model]?.$error"
                />
              </div>
            </div>
          </div>

          <div class="row justify-end q-mt-lg q-gutter-sm">
            <q-btn flat label="Cancel" @click="emitfnshowEditMDR" />
            <q-btn unelevated label="Save Changes" color="purple-9" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, minValue, maxValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "EditMDRCharges",
  props: ["propShoweditMerchantDetails", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShoweditMerchantDetails,
      isDevice: this.propRowDetails.device.isDevice,
      formData: {
        leadSource: JSON.stringify(this.propRowDetails.leadSource),
        device: JSON.stringify(this.propRowDetails.device),
        marsDeviceModel: JSON.stringify(this.propRowDetails.marsDeviceModel),
        merchantCategory: JSON.stringify(this.propRowDetails.merchantCategory),
        mdrPlanName: this.propRowDetails.mdrPlanName,
        debitLessthanAmount: this.propRowDetails.debitLessthanAmount,
        debitGreaterthanAmount: this.propRowDetails.debitGreaterthanAmount,
        stdCC: this.propRowDetails.stdCC,
        premiumCC: this.propRowDetails.premiumCC,
        corpCC: this.propRowDetails.corpCC,
        intlCC: this.propRowDetails.intlCC,
        superPremiumlCC: this.propRowDetails.superPremiumlCC,
        amexDomestic: this.propRowDetails.amexDomestic,
        amexInternational: this.propRowDetails.amexInternational,
        upiDebitCardUpTo2000: this.propRowDetails.upiDebitCardUpTo2000,
        upiDebitCardAbove2000: this.propRowDetails.upiDebitCardAbove2000,
        upiPrepaidCreditCardsUpTo2000: this.propRowDetails.upiPrepaidCreditCardsUpTo2000,
        upiPrepaidCreditCardsAbove2000: this.propRowDetails.upiPrepaidCreditCardsAbove2000,
        smallMerchantLessThanTwoDebit: this.propRowDetails.smallMerchantLessThanTwoDebit,
        smallMerchantGreaterThanTwoDebit: this.propRowDetails.smallMerchantGreaterThanTwoDebit,
        smallMerchantLessThanTwoCreditAndPrepaid: this.propRowDetails.smallMerchantLessThanTwoCreditAndPrepaid,
        smallMerchantGreaterThanTwoCreditAndPrepaid: this.propRowDetails.smallMerchantGreaterThanTwoCreditAndPrepaid,
        largeMerchantLessThanTwoDebit: this.propRowDetails.largeMerchantLessThanTwoDebit,
        largeMerchantGreaterThanTwoDebit: this.propRowDetails.largeMerchantGreaterThanTwoDebit,
        largeMerchantLessThanTwoCreditandPrepaid: this.propRowDetails.largeMerchantLessThanTwoCreditandPrepaid,
        largeMerchantGreaterThanTwoCreditandPrepaid: this.propRowDetails.largeMerchantGreaterThanTwoCreditandPrepaid,
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions: [],
        merchantTypesOptions: [],
      },
      mdrFields: [
        { model: "debitLessthanAmount", label: "Debit <= 2000" },
        { model: "debitGreaterthanAmount", label: "Debit > 2000" },
        { model: "stdCC", label: "Std CC" },
        { model: "premiumCC", label: "Premium CC" },
        { model: "corpCC", label: "Corp Pre CC" },
        { model: "intlCC", label: "Intl Pre CC" },
        { model: "superPremiumlCC", label: "Super Pre CC" },
        { model: "amexDomestic", label: "Amex Domestic" },
        { model: "amexInternational", label: "Amex Intl" }
      ],
      upiFields: [
        { model: "upiDebitCardUpTo2000", label: "UPI Debit <= 2000" },
        { model: "upiDebitCardAbove2000", label: "UPI Debit > 2000" },
        { model: "upiPrepaidCreditCardsUpTo2000", label: "UPI CC/Prepaid <= 2000" },
        { model: "upiPrepaidCreditCardsAbove2000", label: "UPI CC/Prepaid > 2000" }
      ],
      merchantRateFields: [
        { model: "smallMerchantLessThanTwoDebit", label: "Small Merch < 2000 Debit" },
        { model: "smallMerchantGreaterThanTwoDebit", label: "Small Merch > 2000 Debit" },
        { model: "smallMerchantLessThanTwoCreditAndPrepaid", label: "Small Merch < 2000 CC" },
        { model: "smallMerchantGreaterThanTwoCreditAndPrepaid", label: "Small Merch > 2000 CC" },
        { model: "largeMerchantLessThanTwoDebit", label: "Large Merch < 2000 Debit" },
        { model: "largeMerchantGreaterThanTwoDebit", label: "Large Merch > 2000 Debit" },
        { model: "largeMerchantLessThanTwoCreditandPrepaid", label: "Large Merch < 2000 CC" },
        { model: "largeMerchantGreaterThanTwoCreditandPrepaid", label: "Large Merch > 2000 CC" }
      ]
    };
  },

  validations() {
    const rateRules = { minValue: minValue(0), maxValue: maxValue(100) };
    let rules = { formData: {} };
    [...this.mdrFields, ...this.upiFields, ...this.merchantRateFields].forEach(f => {
      rules.formData[f.model] = rateRules;
    });
    return rules;
  },

  created() {
    this.ajaxLoadInitialData();
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("merchantCategory", ["MERCHANT_CATEGORY_ACTIVE_LIST"]),
    ...mapActions("CategoryBasedMdr", ["CATEGORY_BASED_MDR_PLAN", "EDIT_MDR_PLAN"]),

    emitfnshowEditMDR() {
      this.$emit("emitfnshowEditMDR");
    },

    async ajaxLoadInitialData() {
      await Promise.all([
        this.FETCH_DEVICES_DATA(),
        this.LEAD_SOURCE_ACTIVE_LIST(),
        this.MERCHANT_CATEGORY_ACTIVE_LIST(),
        this.FETCH_MARS_DEVICE_MODEL()
      ]);

      this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
        label: item.deviceName, value: JSON.stringify(item)
      }));
      this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
        label: item.sourceName, value: JSON.stringify(item)
      }));
      this.dropDown.merchantTypesOptions = this.getActiveMerchantCategory.map(item => ({
        label: item.merchantCategoryName, value: JSON.stringify(item)
      }));
      this.dropDown.marsDeviceOptions = [];
      this.getMarsDeviceModel.forEach(group => {
        group.forEach(device => {
          this.dropDown.marsDeviceOptions.push({ label: device.name, value: JSON.stringify(device) });
        });
      });
    },

    fnleadSource(val) { this.formData.leadSource = val; this.fetchRates(); },
    fnDevice(val) {
      this.formData.device = val;
      const data = JSON.parse(val);
      this.isDevice = data.isDevice;
      this.fetchRates();
    },
    fnMarsDeviceModel(val) { this.formData.marsDeviceModel = val; this.fetchRates(); },
    fnMerchantCategory(val) { this.formData.merchantCategory = val; this.fetchRates(); },

    async fetchRates() {
      const ls = JSON.parse(this.formData.leadSource);
      const dev = JSON.parse(this.formData.device);
      const mc = JSON.parse(this.formData.merchantCategory);

      if (!ls.id || !dev.id || !mc.id) return;

      this.$q.loading.show({ message: "Fetching rates..." });
      try {
        const response = await this.CATEGORY_BASED_MDR_PLAN({
          leadSource: ls.id,
          device: dev.id,
          merchantType: mc.id
        });
        if (response.status === 200 && response.data) {
          Object.assign(this.formData, _.pick(response.data, Object.keys(this.formData)));
        }
      } finally {
        this.$q.loading.hide();
      }
    },

    async fnEditMdrPlan(request) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "negative", message: "Please check form for errors" });
        return;
      }

      this.$q.loading.show({ message: "Updating MDR Plan..." });

      let payload = {
        id: this.propRowDetails.id,
        ..._.omit(request, ['leadSource', 'device', 'marsDeviceModel', 'merchantCategory']),
        leadSource: JSON.parse(request.leadSource),
        device: JSON.parse(request.device),
        marsDeviceModel: JSON.parse(request.marsDeviceModel),
        merchantCategory: JSON.parse(request.merchantCategory),
        active: true
      };

      this.EDIT_MDR_PLAN(payload)
        .then(() => {
          this.$q.notify({ color: "positive", message: "Updated successfully", icon: "thumb_up" });
          this.emitfnshowEditMDR();
        })
        .catch(err => {
          this.$q.notify({ color: "negative", message: err.data?.message || "Update failed" });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    }
  },
  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("merchantCategory", ["getActiveMerchantCategory"]),
  }
};
</script>

<style scoped>
.border-bottom-soft {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 4px;
}
</style>
