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
                    :error="v$.formData.leadSource.$error"
                    emit-value
                    map-options
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
                    :error="v$.formData.device.$error"
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
                    :error="v$.formData.marsDeviceModel.$error"
                    emit-value
                    map-options
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
                    @update:model-value="fnCategoryBasedMdr(formData)"
                    :error="v$.formData.merchantType.$error"
                    emit-value
                    map-options
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
                    :error="v$.formData.mdrPlanName.$error"
                  />
                </q-item-section>
              </q-item>
              <div v-if="deviceId == 1">
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.debitLessthanAmount"
                      placeholder="Debit <= 2000 %"
                      label="Debit <= 2000 %"
                      :error="v$.formData.debitLessthanAmount.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.debitGreaterthanAmount"
                      label="Debit > 2000 %"
                      placeholder="Debit > 2000 %"
                      :error="v$.formData.debitGreaterthanAmount.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.stdCC"
                      label="Std CC %"
                      placeholder="Std CC %"
                      :error="v$.formData.stdCC.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.premiumCC"
                      label="Premium CC %"
                      placeholder="Premium CC %"
                      :error="v$.formData.premiumCC.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.corpCC"
                      label="Corp Pre CC %"
                      placeholder="Corp Pre CC %"
                      :error="v$.formData.corpCC.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.intlCC"
                      label="Intl Pre CC %"
                      placeholder="Intl Pre CC %"
                      :error="v$.formData.intlCC.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.superPremiumlCC"
                      label="Super Pre CC %"
                      placeholder="Super Pre CC %"
                      :error="v$.formData.superPremiumlCC.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.amexDomestic"
                      label="amex Domestic %"
                      placeholder="amex Domestic %"
                      :error="v$.formData.amexDomestic.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.amexInternational"
                      label="amex International %"
                      placeholder="amex International %"
                      :error="v$.formData.amexInternational.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.upiDebitCardUpTo2000"
                      label="UPI Debit Card UpTo 2000 %"
                      placeholder="UPI Debit Card UpTo 2000 %"
                      :error="v$.formData.upiDebitCardUpTo2000.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.upiDebitCardAbove2000"
                      label="UPI Debit Card Above 2000 %"
                      placeholder="UPI Debit Card Above 2000 %"
                      :error="v$.formData.upiDebitCardAbove2000.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.upiPrepaidCreditCardsUpTo2000"
                      label="UPI Prepaid Credit Cards UpTo 2000 %"
                      placeholder="UPI Prepaid Credit Cards UpTo 2000 %"
                      :error="v$.formData.upiPrepaidCreditCardsUpTo2000.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.upiPrepaidCreditCardsAbove2000"
                      label="UPI Prepaid Credit Cards Above 2000 %"
                      placeholder="UPI Prepaid Credit Cards Above 2000 %"
                      :error="v$.formData.upiPrepaidCreditCardsAbove2000.$error"
                    />
                  </q-item-section>
                </q-item>
              </div>

              <div v-else>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.smallMerchantLessThanTwoDebit"
                      label="Small Merchant < 2000 % debit Card"
                      placeholder="Small Merchant < 2000 % debit Card"
                      :error="v$.formData.smallMerchantLessThanTwoDebit.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.smallMerchantGreaterThanTwoDebit"
                      label="Small Merchant > 2000 % debit Card"
                      placeholder="Small Merchant > 2000 % debit Card"
                      :error="v$.formData.smallMerchantGreaterThanTwoDebit.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.smallMerchantLessThanTwoCreditAndPrepaid"
                      label="Small Merchant < 2000 % credit and prepaid card"
                      placeholder="Small Merchant < 2000 % credit and prepaid card"
                      :error="v$.formData.smallMerchantLessThanTwoCreditAndPrepaid.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.smallMerchantGreaterThanTwoCreditAndPrepaid"
                      label="Small Merchant > 2000 % credit and prepaid card"
                      placeholder="Small Merchant > 2000 % credit and prepaid card"
                      :error="v$.formData.smallMerchantGreaterThanTwoCreditAndPrepaid.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.largeMerchantLessThanTwoDebit"
                      label="Large Merchant < 2000 % debit Card"
                      placeholder="Large Merchant < 2000 % debit Card"
                      :error="v$.formData.largeMerchantLessThanTwoDebit.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.largeMerchantGreaterThanTwoDebit"
                      label="Large Merchant > 2000 % debit Card"
                      placeholder="Large Merchant > 2000 % debit Card"
                      :error="v$.formData.largeMerchantGreaterThanTwoDebit.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.largeMerchantLessThanTwoCreditandPrepaid"
                      label="Large Merchant < 2000 % credit and prepaid card"
                      placeholder="Large Merchant < 2000 % credit and prepaid card"
                      :error="v$.formData.largeMerchantLessThanTwoCreditandPrepaid.$error"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.largeMerchantGreaterThanTwoCreditandPrepaid"
                      label="Large Merchant > 2000 % credit and prepaid card"
                      placeholder="Large Merchant > 2000 % credit and prepaid card"
                      :error="v$.formData.largeMerchantGreaterThanTwoCreditandPrepaid.$error"
                    />
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="side">
            <q-btn
              :disabled="Submitdata"
              label="submit"
              @click="fnsubmit(formData)"
              color="purple-9"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Modals -->
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      ></showLeadSourceModalComponent>
      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      ></showDeviceDetailModalComponent>
      <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="fnManageMerchantType"
      ></showMerchantModalComponent>
    </div>
  </q-page>
</template>

<script>
/* START >> Modal components Lead source, device, merchant type */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";
/* END >> Modal components Lead source, device, merchant type */

import { required, minValue, maxValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "ManageMDRCharges",
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showMerchantModalComponent,
  },
  data() {
    return {
      showLeadSourceModal: false,
      showDeviceDetailModal: false,
      showMerchantModal: false,
      Submitdata: false,
      deviceId: "",
      formData: {
        leadSource: "",
        device: "",
        marsDeviceModel: "",
        merchantType: "",
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
    ...mapActions("CategoryBasedMdr", ["CATEGORY_BASED_MDR_PLAN", "EDIT_MDR_PLAN"]),

    onChange(request) {
      this.deviceId = request?.value?.isDevice || "";
    },

    marsDeviceModelDatasLoading() {
      let self = this;
      self.FETCH_MARS_DEVICE_MODEL().then(() => {
        self.dropDown.marsDeviceOptions = [];
        return _.map(self.getMarsDeviceModel, (item) => {
          item.map((oo) => {
            self.dropDown.marsDeviceOptions.push({
              label: oo.name,
              value: JSON.stringify(oo),
            });
          });
        });
      });
    },

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      self
        .FETCH_DEVICES_DATA()
        .then(() => {
          self.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, (item) => {
            return { value: item, label: item.deviceName };
          });
        });
      self.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        self.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, (item) => {
          return { value: item.id, label: item.sourceName };
        });
      });
      self.MERCHANT_CATEGORY_ACTIVE_LIST().then(() => {
        self.dropDown.merchantTypesOptions = _.map(self.getActiveMerchantCategory, (item) => {
          return { value: item.id, label: item.merchantCategoryName };
        });
      });
    },

    async fnsubmit(request) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100,
          spinnerColor: "purple-9",
          message: "Please wait..",
        });
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
            debitLessthanAmount: request.debitLessthanAmount,
            debitGreaterthanAmount: request.debitGreaterthanAmount,
            stdCC: request.stdCC,
            premiumCC: request.premiumCC,
            corpCC: request.corpCC,
            intlCC: request.intlCC,
            superPremiumlCC: request.superPremiumlCC,
            amexDomestic: request.amexDomestic,
            amexInternational: request.amexInternational,
            smallMerchantLessThanTwoDebit: request.smallMerchantLessThanTwoDebit,
            smallMerchantGreaterThanTwoDebit: request.smallMerchantGreaterThanTwoDebit,
            smallMerchantLessThanTwoCreditAndPrepaid:
              request.smallMerchantLessThanTwoCreditAndPrepaid,
            smallMerchantGreaterThanTwoCreditAndPrepaid:
              request.smallMerchantGreaterThanTwoCreditAndPrepaid,
            largeMerchantLessThanTwoDebit: request.largeMerchantLessThanTwoDebit,
            largeMerchantGreaterThanTwoDebit: request.largeMerchantGreaterThanTwoDebit,
            largeMerchantLessThanTwoCreditandPrepaid:
              request.largeMerchantLessThanTwoCreditandPrepaid,
            largeMerchantGreaterThanTwoCreditandPrepaid:
              request.largeMerchantGreaterThanTwoCreditandPrepaid,
            upiDebitCardUpTo2000: request.upiDebitCardUpTo2000,
            upiDebitCardAbove2000: request.upiDebitCardAbove2000,
            upiPrepaidCreditCardsUpTo2000: request.upiPrepaidCreditCardsUpTo2000,
            upiPrepaidCreditCardsAbove2000: request.upiPrepaidCreditCardsAbove2000,
          },
        };
        this.MDR_PLAN(requestParams)
          .then((response) => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              icon: "thumb_up",
              message: response.data.message,
            });
            this.Submitdata = false;
            this.resetForm();
            this.$q.loading.hide();
          })
          .catch((error) => {
            this.$q.notify({
              color: "negative",
              position: "bottom",
              icon: "thumb_down",
              message: error.data?.message || "Something went wrong",
            });
            this.resetForm();
            this.$q.loading.hide();
            this.Submitdata = false;
          });
      }
    },

    fnCategoryBasedMdr(request) {
      if (!request.leadSource || !request.device || !request.merchantType) return;
      let formData = {
        leadSource: request.leadSource,
        device: request.device.value.id,
        merchantType: request.merchantType,
      };
      this.CATEGORY_BASED_MDR_PLAN(formData).then((response) => {
        if (response.status == 200) {
          this.formData.debitLessthanAmount = this.categoryBasedMdr.debitLessthanAmount;
          this.formData.debitGreaterthanAmount =
            this.categoryBasedMdr.debitGreaterthanAmount;
          this.formData.stdCC = this.categoryBasedMdr.stdCC;
          this.formData.premiumCC = this.categoryBasedMdr.premiumCC;
          this.formData.corpCC = this.categoryBasedMdr.corpCC;
          this.formData.intlCC = this.categoryBasedMdr.intlCC;
          this.formData.superPremiumlCC = this.categoryBasedMdr.superPremiumlCC;
          this.formData.amexDomestic = this.categoryBasedMdr.amexDomestic;
          this.formData.amexInternational = this.categoryBasedMdr.amexInternational;
          this.formData.upiDebitCardUpTo2000 = this.categoryBasedMdr.upiDebitCardUpTo2000;
          this.formData.upiDebitCardAbove2000 =
            this.categoryBasedMdr.upiDebitCardAbove2000;
          this.formData.upiPrepaidCreditCardsUpTo2000 =
            this.categoryBasedMdr.upiPrepaidCreditCardsUpTo2000;
          this.formData.upiPrepaidCreditCardsAbove2000 =
            this.categoryBasedMdr.upiPrepaidCreditCardsAbove2000;
        } else {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Invalid MDR details",
            icon: "clear",
          });
          this.resetRates();
        }
      });
    },
    resetRates() {
        const rates = ['debitLessthanAmount', 'debitGreaterthanAmount', 'stdCC', 'premiumCC', 'corpCC', 'intlCC', 'superPremiumlCC', 'amexDomestic', 'amexInternational', 'upiDebitCardUpTo2000', 'upiDebitCardAbove2000', 'upiPrepaidCreditCardsUpTo2000', 'upiPrepaidCreditCardsAbove2000'];
        rates.forEach(r => this.formData[r] = "");
    },
    resetForm() {
      var self = this;
      Object.keys(this.formData).forEach(function (key, index) {
        self.formData[key] = "";
      });
      this.deviceId = "";
      this.v$.formData.$reset();
    },
    fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; },
    fnManageDevice() { this.showDeviceDetailModal = !this.showDeviceDetailModal; },
    fnManageMerchantType() { this.showMerchantModal = !this.showMerchantModal; },
  },
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
