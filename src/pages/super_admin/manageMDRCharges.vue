<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">
        Add MDR Details
      </div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-list class="no-border">
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select lead source"
                    stack-label
                    :error="v$.formData.leadSource.$error"
                    @blur="v$.formData.leadSource.$touch"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    @click="fnManageLeadSource"
                    size="sm"
                    icon="add"
                    color="purple-9"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.device"
                    @update:model-value="onChange"
                    :options="dropDown.deviceOptions"
                    label="Select device"
                    stack-label
                    :error="v$.formData.device.$error"
                    @blur="v$.formData.device.$touch"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    @click="fnManageDevice"
                    size="sm"
                    icon="add"
                    color="purple-9"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.marsDeviceModel"
                    :options="dropDown.marsDeviceOptions"
                    label="Mars Device Model"
                    stack-label
                    :error="v$.formData.marsDeviceModel.$error"
                    @blur="v$.formData.marsDeviceModel.$touch"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.merchantType"
                    :options="dropDown.merchantTypesOptions"
                    label="Select merchant category type"
                    stack-label
                    @update:model-value="fnCategoryBasedMdr(formData)"
                    :error="v$.formData.merchantType.$error"
                    @blur="v$.formData.merchantType.$touch"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="text"
                    v-model="formData.mdrPlanName"
                    placeholder="Mdr Plan Name"
                    label="Mdr Plan Name"
                    stack-label
                    :error="v$.formData.mdrPlanName.$error"
                    @blur="v$.formData.mdrPlanName.$touch"
                  />
                </q-item-section>
              </q-item>

              <div v-if="deviceId == 1">
                <q-item v-for="field in cardFields" :key="field.key" class="relative-position">
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData[field.key]"
                      :label="field.label"
                      :placeholder="field.label"
                      stack-label
                      @blur="v$.formData[field.key].$touch"
                      :error="v$.formData[field.key].$error"
                      hide-bottom-space
                    />
                  </q-item-section>
                  <div
                    v-if="v$.formData[field.key].$error"
                    class="error-tooltip"
                    :class="{
                      'error-highlight': v$.formData[field.key].$error,
                    }"
                  >
                    <span
                      v-if="
                        v$.formData[field.key].$model &&
                        (v$.formData[field.key].$model < 0 ||
                          v$.formData[field.key].$model > 100)
                      "
                    >
                      {{ field.label }} must be between 0 and 100.
                    </span>
                  </div>
                </q-item>
              </div>

              <div v-else>
                <q-item v-for="field in merchantFields" :key="field.key" class="relative-position">
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData[field.key]"
                      :label="field.label"
                      :placeholder="field.label"
                      stack-label
                      @blur="v$.formData[field.key].$touch"
                      :error="v$.formData[field.key].$error"
                      hide-bottom-space
                    />
                  </q-item-section>
                  <div
                    v-if="v$.formData[field.key].$error"
                    class="error-tooltip"
                    :class="{
                      'error-highlight': v$.formData[field.key].$error,
                    }"
                  >
                    <span
                      v-if="
                        v$.formData[field.key].$model &&
                        (v$.formData[field.key].$model < 0 ||
                          v$.formData[field.key].$model > 100)
                      "
                    >
                      {{ field.label }} must be between 0 and 100.
                    </span>
                  </div>
                </q-item>
              </div>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="right">
            <q-btn
              :disabled="Submitdata"
              label="submit"
              @click="fnsubmit(formData)"
              color="purple-9"
            />
          </q-card-actions>
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
import { useVuelidate } from "@vuelidate/core";
import { required, minValue, maxValue } from "@vuelidate/validators";
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
      cardFields: [
        { key: "debitLessthanAmount", label: "Debit <= 2000 %" },
        { key: "debitGreaterthanAmount", label: "Debit > 2000 %" },
        { key: "stdCC", label: "Std CC %" },
        { key: "premiumCC", label: "Premium CC %" },
        { key: "corpCC", label: "Corp Pre CC %" },
        { key: "intlCC", label: "Intl Pre CC %" },
        { key: "superPremiumlCC", label: "Super Pre CC %" },
        { key: "amexDomestic", label: "amex Domestic %" },
        { key: "amexInternational", label: "amex International %" },
        { key: "upiDebitCardUpTo2000", label: "UPI Debit Card UpTo 2000 %" },
        { key: "upiDebitCardAbove2000", label: "UPI Debit Card Above 2000 %" },
        { key: "upiPrepaidCreditCardsUpTo2000", label: "UPI Prepaid Credit Cards UpTo 2000 %" },
        { key: "upiPrepaidCreditCardsAbove2000", label: "UPI Prepaid Credit Cards Above 2000 %" }
      ],
      merchantFields: [
        { key: "smallMerchantLessThanTwoDebit", label: "Small Merchant < 2000 % debit Card" },
        { key: "smallMerchantGreaterThanTwoDebit", label: "Small Merchant > 2000 % debit Card" },
        { key: "smallMerchantLessThanTwoCreditAndPrepaid", label: "Small Merchant < 2000 % credit and prepaid card" },
        { key: "smallMerchantGreaterThanTwoCreditAndPrepaid", label: "Small Merchant > 2000 % credit and prepaid card" },
        { key: "largeMerchantLessThanTwoDebit", label: "Large Merchant < 2000 % debit Card" },
        { key: "largeMerchantGreaterThanTwoDebit", label: "Large Merchant > 2000 % debit Card" },
        { key: "largeMerchantLessThanTwoCreditandPrepaid", label: "Large Merchant < 2000 % credit and prepaid card" },
        { key: "largeMerchantGreaterThanTwoCreditandPrepaid", label: "Large Merchant > 2000 % credit and prepaid card" }
      ],
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
    let dynamicRules = {};
    this.cardFields.forEach(f => dynamicRules[f.key] = rateRules);
    this.merchantFields.forEach(f => dynamicRules[f.key] = rateRules);

    return {
      formData: {
        leadSource: { required },
        device: { required },
        marsDeviceModel: { required },
        merchantType: { required },
        mdrPlanName: { required },
        ...dynamicRules
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
      this.deviceId = val ? val.isDevice : null;
    },

    marsDeviceModelDatasLoading() {
      this.FETCH_MARS_DEVICE_MODEL().then(() => {
        this.dropDown.marsDeviceOptions = [];
        this.getMarsDeviceModel.forEach((item) => {
          item.forEach((oo) => {
            this.dropDown.marsDeviceOptions.push({
              label: oo.name,
              value: oo,
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
          value: item,
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
        this.$q.notify("Please review fields again.");
        return;
      }

      this.$q.loading.show({ message: "Please wait.." });
      this.Submitdata = true;

      let requestParams = {
        url: {
          leadSource: request.leadSource.id || request.leadSource,
          device: request.device.id,
          merchantType: request.merchantType,
        },
        params: {
          marsDeviceModel: request.marsDeviceModel,
          mdrPlanName: request.mdrPlanName,
          ..._.pick(request, this.cardFields.concat(this.merchantFields).map(f => f.key))
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
      this.v$.$reset();
    },

    fnCategoryBasedMdr(request) {
      if (!request.leadSource || !request.device || !request.merchantType) return;

      let formData = {
        leadSource: request.leadSource.id || request.leadSource,
        device: request.device.id,
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

    fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; },
    fnManageDevice() { this.showDeviceDetailModal = !this.showDeviceDetailModal; },
    fnManageMerchantType() { this.showMerchantModal = !this.showMerchantModal; },
  },
};
</script>

<style scoped>
.q-title {
  font-size: 1.25rem;
  line-height: 2rem;
}
.error-tooltip {
  position: absolute;
  top: 10%;
  left: 100%;
  background: #d32f2f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  margin-top: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.error-tooltip::before {
  content: "";
  position: absolute;
  top: 10px;
  left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #d32f2f transparent transparent;
}
</style>
