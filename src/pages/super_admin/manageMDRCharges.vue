<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="bg-purple-9 text-white">
            <div class="text-h6">Add MDR Details</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="fnsubmit(formData)" class="q-gutter-md">
              <!-- Selection Row 1 -->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="row items-center no-wrap">
                    <q-select
                      outlined
                      dense
                      v-model="formData.leadSource"
                      :options="dropDown.leadSourceOptions"
                      label="Select lead source"
                      class="full-width"
                      emit-value
                      map-options
                      :error="v$.formData.leadSource.$error"
                    />
                    <q-btn flat round color="purple-9" icon="add" @click="fnManageLeadSource" class="q-ml-xs" />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="row items-center no-wrap">
                    <q-select
                      outlined
                      dense
                      v-model="formData.device"
                      @update:model-value="onChange"
                      :options="dropDown.deviceOptions"
                      label="Select device"
                      class="full-width"
                      :error="v$.formData.device.$error"
                    />
                    <q-btn flat round color="purple-9" icon="add" @click="fnManageDevice" class="q-ml-xs" />
                  </div>
                </div>
              </div>

              <!-- Selection Row 2 -->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    dense
                    v-model="formData.marsDeviceModel"
                    :options="dropDown.marsDeviceOptions"
                    label="Mars Device Model"
                    emit-value
                    map-options
                    :error="v$.formData.marsDeviceModel.$error"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    dense
                    v-model="formData.merchantType"
                    :options="dropDown.merchantTypesOptions"
                    label="Select merchant category type"
                    @update:model-value="fnCategoryBasedMdr(formData)"
                    emit-value
                    map-options
                    :error="v$.formData.merchantType.$error"
                  />
                </div>
              </div>

              <q-input
                outlined
                dense
                v-model.trim="formData.mdrPlanName"
                label="Mdr Plan Name"
                :error="v$.formData.mdrPlanName.$error"
              />

              <!-- Rates Grid -->
              <div class="q-mt-lg" v-if="deviceId == 1">
                <div class="text-subtitle2 q-mb-md text-purple-9 border-bottom-soft">Card Rates (%)</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.debitLessthanAmount" label="Debit <= 2000" :error="v$.formData.debitLessthanAmount.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.debitGreaterthanAmount" label="Debit > 2000" :error="v$.formData.debitGreaterthanAmount.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.stdCC" label="Std CC" :error="v$.formData.stdCC.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.premiumCC" label="Premium CC" :error="v$.formData.premiumCC.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.corpCC" label="Corp Pre CC" :error="v$.formData.corpCC.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.intlCC" label="Intl Pre CC" :error="v$.formData.intlCC.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.superPremiumlCC" label="Super Pre CC" :error="v$.formData.superPremiumlCC.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.amexDomestic" label="Amex Domestic" :error="v$.formData.amexDomestic.$error" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.amexInternational" label="Amex Intl" :error="v$.formData.amexInternational.$error" />
                  </div>
                </div>

                <div class="text-subtitle2 q-mt-lg q-mb-md text-purple-9 border-bottom-soft">UPI Rates (%)</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.upiDebitCardUpTo2000" label="UPI Debit <= 2000" :error="v$.formData.upiDebitCardUpTo2000.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.upiDebitCardAbove2000" label="UPI Debit > 2000" :error="v$.formData.upiDebitCardAbove2000.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.upiPrepaidCreditCardsUpTo2000" label="UPI CC/Prepaid <= 2000" :error="v$.formData.upiPrepaidCreditCardsUpTo2000.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.upiPrepaidCreditCardsAbove2000" label="UPI CC/Prepaid > 2000" :error="v$.formData.upiPrepaidCreditCardsAbove2000.$error" />
                  </div>
                </div>
              </div>

              <!-- Other device type rates -->
              <div class="q-mt-lg" v-else>
                <div class="text-subtitle2 q-mb-md text-purple-9 border-bottom-soft">Merchant Rates (%)</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.smallMerchantLessThanTwoDebit" label="Small Merch < 2000 Debit" :error="v$.formData.smallMerchantLessThanTwoDebit.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.smallMerchantGreaterThanTwoDebit" label="Small Merch > 2000 Debit" :error="v$.formData.smallMerchantGreaterThanTwoDebit.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.smallMerchantLessThanTwoCreditAndPrepaid" label="Small Merch < 2000 CC" :error="v$.formData.smallMerchantLessThanTwoCreditAndPrepaid.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.smallMerchantGreaterThanTwoCreditAndPrepaid" label="Small Merch > 2000 CC" :error="v$.formData.smallMerchantGreaterThanTwoCreditAndPrepaid.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.largeMerchantLessThanTwoDebit" label="Large Merch < 2000 Debit" :error="v$.formData.largeMerchantLessThanTwoDebit.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.largeMerchantGreaterThanTwoDebit" label="Large Merch > 2000 Debit" :error="v$.formData.largeMerchantGreaterThanTwoDebit.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.largeMerchantLessThanTwoCreditandPrepaid" label="Large Merch < 2000 CC" :error="v$.formData.largeMerchantLessThanTwoCreditandPrepaid.$error" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined dense type="number" step="0.01" v-model="formData.largeMerchantGreaterThanTwoCreditandPrepaid" label="Large Merch > 2000 CC" :error="v$.formData.largeMerchantGreaterThanTwoCreditandPrepaid.$error" />
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-xl">
                <q-btn unelevated label="Submit" :disabled="Submitdata" type="submit" color="purple-9" class="q-px-lg" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modals -->
    <showLeadSourceModalComponent
      v-if="showLeadSourceModal"
      :propToggleModal="showLeadSourceModal"
      @emitToggleModal="fnManageLeadSource"
    />
    <showDeviceDetailModalComponent
      v-if="showDeviceDetailModal"
      :propToggleModal="showDeviceDetailModal"
      @emitToggleModal="fnManageDevice"
    />
    <showMerchantModalComponent
      v-if="showMerchantModal"
      :propToggleModal="showMerchantModal"
      @emitToggleModal="fnManageMerchantType"
    />
  </q-page>
</template>

<script>
import { required, minValue, maxValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";

export default {
  name: "ManageMDRCharges",
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showMerchantModalComponent
  },
  data() {
    return {
      showLeadSourceModal: false,
      showDeviceDetailModal: false,
      showMerchantModal: false,
      Submitdata: false,
      deviceId: null,
      formData: {
        leadSource: null,
        device: null,
        marsDeviceModel: null,
        merchantType: null,
        mdrPlanName: "",
        debitLessthanAmount: "",
        debitGreaterthanAmount: "",
        stdCC: "",
        premiumCC: "",
        corpCC: "",
        intlCC: "",
        superPremiumlCC: "",
        amexDomestic: "",
        amexInternational: "",
        smallMerchantLessThanTwoDebit: "",
        smallMerchantGreaterThanTwoDebit: "",
        smallMerchantLessThanTwoCreditAndPrepaid: "",
        smallMerchantGreaterThanTwoCreditAndPrepaid: "",
        largeMerchantLessThanTwoDebit: "",
        largeMerchantGreaterThanTwoDebit: "",
        largeMerchantLessThanTwoCreditandPrepaid: "",
        largeMerchantGreaterThanTwoCreditandPrepaid: "",
        upiDebitCardUpTo2000: "",
        upiDebitCardAbove2000: "",
        upiPrepaidCreditCardsUpTo2000: "",
        upiPrepaidCreditCardsAbove2000: "",
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions: [],
        merchantTypesOptions: [],
      },
    };
  },

  validations() {
    const rateRules = { minValue: minValue(0), maxValue: maxValue(100) };
    return {
      formData: {
        leadSource: { required },
        device: { required },
        marsDeviceModel: { required },
        merchantType: { required },
        mdrPlanName: { required },
        debitLessthanAmount: rateRules,
        debitGreaterthanAmount: rateRules,
        stdCC: rateRules,
        premiumCC: rateRules,
        corpCC: rateRules,
        intlCC: rateRules,
        superPremiumlCC: rateRules,
        amexDomestic: rateRules,
        amexInternational: rateRules,
        upiDebitCardUpTo2000: rateRules,
        upiDebitCardAbove2000: rateRules,
        upiPrepaidCreditCardsUpTo2000: rateRules,
        upiPrepaidCreditCardsAbove2000: rateRules,
        smallMerchantLessThanTwoDebit: rateRules,
        smallMerchantGreaterThanTwoDebit: rateRules,
        smallMerchantLessThanTwoCreditAndPrepaid: rateRules,
        smallMerchantGreaterThanTwoCreditAndPrepaid: rateRules,
        largeMerchantLessThanTwoDebit: rateRules,
        largeMerchantGreaterThanTwoDebit: rateRules,
        largeMerchantLessThanTwoCreditandPrepaid: rateRules,
        largeMerchantGreaterThanTwoCreditandPrepaid: rateRules,
      },
    };
  },

  created() {
    this.ajaxLoadDataForDeviceTypeTable();
    this.marsDeviceModelDatasLoading();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("merchantCategory", ["getActiveMerchantCategory"]),
    ...mapGetters("CategoryBasedMdr", ["categoryBasedMdr"]),
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("merchantCategory", ["MERCHANT_CATEGORY_ACTIVE_LIST"]),
    ...mapActions("MdrPlan", ["MDR_PLAN"]),
    ...mapActions("CategoryBasedMdr", ["CATEGORY_BASED_MDR_PLAN"]),

    onChange(val) {
      this.deviceId = val ? val.value.isDevice : null;
    },

    marsDeviceModelDatasLoading() {
      this.FETCH_MARS_DEVICE_MODEL().then(() => {
        this.dropDown.marsDeviceOptions = [];
        this.getMarsDeviceModel.forEach((item) => {
          item.forEach((oo) => {
            this.dropDown.marsDeviceOptions.push({
              label: oo.name,
              value: JSON.stringify(oo),
            });
          });
        });
      });
    },

    ajaxLoadDataForDeviceTypeTable() {
      this.FETCH_DEVICES_DATA().then(() => {
        this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
          value: item,
          label: item.deviceName,
        }));
      });
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          value: item.id,
          label: item.sourceName,
        }));
      });
      this.MERCHANT_CATEGORY_ACTIVE_LIST().then(() => {
        this.dropDown.merchantTypesOptions = this.getActiveMerchantCategory.map(item => ({
          value: item.id,
          label: item.merchantCategoryName,
        }));
      });
    },

    async fnsubmit(request) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "negative", message: "Please check form for errors" });
        return;
      }

      this.$q.loading.show({ message: "Submitting..." });
      this.Submitdata = true;

      let requestParams = {
        url: {
          leadSource: request.leadSource,
          device: request.device.value.id,
          merchantType: request.merchantType,
        },
        params: {
          marsDeviceModel: JSON.parse(request.marsDeviceModel),
          mdrPlanName: request.mdrPlanName,
          ..._.omit(request, ['leadSource', 'device', 'marsDeviceModel', 'merchantType'])
        },
      };

      this.MDR_PLAN(requestParams)
        .then((response) => {
          this.$q.notify({
            color: "positive",
            message: response.data.message || "MDR Details added successfully",
            icon: "thumb_up"
          });
          this.resetForm();
          this.$q.loading.hide();
          this.Submitdata = false;
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            message: error.data?.message || "Submission failed",
            icon: "thumb_down"
          });
          this.$q.loading.hide();
          this.Submitdata = false;
        });
    },

    resetForm() {
      this.formData = {
        leadSource: null,
        device: null,
        marsDeviceModel: null,
        merchantType: null,
        mdrPlanName: "",
        debitLessthanAmount: "",
        debitGreaterthanAmount: "",
        stdCC: "",
        premiumCC: "",
        corpCC: "",
        intlCC: "",
        superPremiumlCC: "",
        amexDomestic: "",
        amexInternational: "",
        smallMerchantLessThanTwoDebit: "",
        smallMerchantGreaterThanTwoDebit: "",
        smallMerchantLessThanTwoCreditAndPrepaid: "",
        smallMerchantGreaterThanTwoCreditAndPrepaid: "",
        largeMerchantLessThanTwoDebit: "",
        largeMerchantGreaterThanTwoDebit: "",
        largeMerchantLessThanTwoCreditandPrepaid: "",
        largeMerchantGreaterThanTwoCreditandPrepaid: "",
        upiDebitCardUpTo2000: "",
        upiDebitCardAbove2000: "",
        upiPrepaidCreditCardsUpTo2000: "",
        upiPrepaidCreditCardsAbove2000: "",
      };
      this.deviceId = null;
    },

    fnCategoryBasedMdr(request) {
      if (!request.leadSource || !request.device || !request.merchantType) return;

      let formData = {
        leadSource: request.leadSource,
        device: request.device.value.id,
        merchantType: request.merchantType,
      };

      this.$q.loading.show({ message: "Fetching existing rates..." });
      this.CATEGORY_BASED_MDR_PLAN(formData).then((response) => {
        if (response.status == 200 && response.data) {
          const data = response.data;
          Object.assign(this.formData, _.pick(data, Object.keys(this.formData)));
        }
        this.$q.loading.hide();
      }).catch(() => {
        this.$q.loading.hide();
      });
    },

    fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; if(!this.showLeadSourceModal) this.ajaxLoadDataForDeviceTypeTable(); },
    fnManageDevice() { this.showDeviceDetailModal = !this.showDeviceDetailModal; if(!this.showDeviceDetailModal) this.ajaxLoadDataForDeviceTypeTable(); },
    fnManageMerchantType() { this.showMerchantModal = !this.showMerchantModal; if(!this.showMerchantModal) this.ajaxLoadDataForDeviceTypeTable(); },
  },
};
</script>

<style scoped>
.border-bottom-soft {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 4px;
}
</style>
