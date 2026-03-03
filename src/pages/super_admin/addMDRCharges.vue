<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">Add MDR details</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-10">
                <q-select
                  color="grey-9"
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select lead source"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-2 flex items-center justify-center">
                <q-btn round @click="fnManageLeadSource" size="sm" icon="add" color="purple-9" />
              </div>

              <div class="col-10">
                <q-select
                  color="grey-9"
                  v-model="formData.device"
                  :options="dropDown.deviceOptions"
                  label="Select device"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-2 flex items-center justify-center">
                <q-btn round @click="fnManageDevice" size="sm" icon="add" color="purple-9" />
              </div>

              <div class="col-12">
                <q-select
                  color="grey-9"
                  v-model="formData.marsDevice"
                  :options="dropDown.marsDeviceOptions"
                  label="Mars Device Model"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-12">
                <q-select
                  color="grey-9"
                  v-model="formData.merchantType"
                  :options="dropDown.merchantTypesOptions"
                  label="Select merchant category type"
                  @update:model-value="fnCategoryBasedMdr(formData)"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.debitLessthanAmount"
                  placeholder="Debit <= 2000 %"
                  label="Debit <= 2000 %"
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.debitGreaterthanAmount"
                  label="Debit > 2000 %"
                  placeholder="Debit > 2000 %"
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.stdCC"
                  label="Std CC %"
                  placeholder="Std CC %"
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.premiumCC"
                  label="Premium CC %"
                  placeholder="Premium CC %"
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.corpCC"
                  label="Corp Pre CC %"
                  placeholder="Corp Pre CC %"
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.intlCC"
                  label="Intl Pre CC %"
                  placeholder="Intl Pre CC %"
                />
              </div>

              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.superPremiumlCC"
                  label="Super Pre CC %"
                  placeholder="Super Pre CC %"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="submit" @click="fnsubmit(formData)" color="purple-9" />
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup MDR details -->

      <!--START: Show lead source -->
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      ></showLeadSourceModalComponent>
      <!--END: Show lead source -->
      <!--START: Show device details -->
      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      ></showDeviceDetailModalComponent>
      <!--END: Show device details-->
      <!--START: Show lead source -->
      <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="fnManageMerchantType"
      ></showMerchantModalComponent>
      <!--END: Show lead source -->
    </div>
  </q-page>
</template>

<script>
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "AddMDRCharges",
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
      formData: {
        leadSource: "",
        device: "",
        marsDevice:"",
        merchantType: "",
        debitLessthanAmount: "",
        debitGreaterthanAmount: "",
        stdCC: "",
        premiumCC: "",
        corpCC: "",
        intlCC: "",
        superPremiumlCC: ""
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions: [],
        merchantTypesOptions: []
      },
    };
  },

  created() {
    this.ajaxLoadDataForDeviceTypeTable();
    this.marsDeviceModelDatasLoading();
  },

  computed: {
     ...mapGetters("SA_Devices", ["getAllDevicesInfo","getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("merchantCategory", ["getActiveMerchantCategory"]),
    ...mapGetters("CategoryBasedMdr", ["categoryBasedMdr"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA","FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("merchantCategory", ["MERCHANT_CATEGORY_ACTIVE_LIST"]),
    ...mapActions("MdrPlan", ["MDR_PLAN"]),
    ...mapActions("CategoryBasedMdr", [
      "CATEGORY_BASED_MDR_PLAN",
      "EDIT_MDR_PLAN"
    ]),

    marsDeviceModelDatasLoading(){
      let self = this;
      self.FETCH_MARS_DEVICE_MODEL()
          .then(() => {
            return _.map(self.getMarsDeviceModel, item => {
              item.map(oo => {
                self.dropDown.marsDeviceOptions.push({
                  label: oo.name,
                  value: oo.code
                });
              });
            });
          });
    },

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      self.FETCH_DEVICES_DATA()
        .then(() => {
          this.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, item => {
            return { value: item.id, label: item.deviceName };
          });
        });
      self.LEAD_SOURCE_ACTIVE_LIST()
        .then(() => {
          this.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
            return { value: item.id, label: item.sourceName };
          });
        });
      self.MERCHANT_CATEGORY_ACTIVE_LIST()
        .then(() => {
          this.dropDown.merchantTypesOptions = _.map(self.getActiveMerchantCategory, item => {
            return { value: item.id, label: item.merchantCategoryName };
          });
        });
    },

    fnsubmit(request) {
      let requestParams = {
        url: {
          leadSource: request.leadSource,
          device: request.device,
          merchantType: request.merchantType
        },
        params: {
          debitLessthanAmount: request.debitLessthanAmount,
          debitGreaterthanAmount: request.debitGreaterthanAmount,
          stdCC: request.stdCC,
          premiumCC: request.premiumCC,
          corpCC: request.corpCC,
          intlCC: request.intlCC,
          superPremiumlCC: request.superPremiumlCC
        }
      };

      this.$q.loading.show({ message: "Please Wait" });
      this.MDR_PLAN(requestParams)
        .then(response => {
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: response.data.message,
            icon: "thumb_up"
          });
          this.resetForm();
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            icon: "warning",
            message: error.data?.message || "Operation failed"
          });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    resetForm() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = "";
      });
    },

    fnCategoryBasedMdr(request) {
      let formData = {
        leadSource: request.leadSource,
        device: request.device,
        merchantType: request.merchantType
      };
      let self = this;
      self.CATEGORY_BASED_MDR_PLAN(formData).then(response => {
        if (response.status == 200) {
          this.formData.debitLessthanAmount = self.categoryBasedMdr.debitLessthanAmount;
          this.formData.debitGreaterthanAmount = self.categoryBasedMdr.debitGreaterthanAmount;
          this.formData.stdCC = self.categoryBasedMdr.stdCC;
          this.formData.premiumCC = self.categoryBasedMdr.premiumCC;
          this.formData.corpCC = self.categoryBasedMdr.corpCC;
          this.formData.intlCC = self.categoryBasedMdr.intlCC;
          this.formData.superPremiumlCC = self.categoryBasedMdr.superPremiumlCC;
        } else {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: "Invalid MDR details",
            icon: "clear"
          });
          this.formData.debitLessthanAmount = "";
          this.formData.debitGreaterthanAmount = "";
          this.formData.stdCC = "";
          this.formData.premiumCC = "";
          this.formData.corpCC = "";
          this.formData.intlCC = "";
          this.formData.superPremiumlCC = "";
        }
      });
    },

    fnManageLeadSource() {
      this.showLeadSourceModal = !this.showLeadSourceModal;
    },
    fnManageDevice() {
      this.showDeviceDetailModal = !this.showDeviceDetailModal;
    },
    fnManageMerchantType() {
      this.showMerchantModal = !this.showMerchantModal;
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(
          col =>
            (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
        )
      );
    }
  }
};
</script>

<style>
</style>
