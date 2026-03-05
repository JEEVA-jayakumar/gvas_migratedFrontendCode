<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Add MDR details</div>
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
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn round @click="fnManageLeadSource" size="sm" icon="add" color="purple-9" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.device"
                    :options="dropDown.deviceOptions"
                    label="Select device"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn round @click="fnManageDevice" size="sm" icon="add" color="purple-9" />
                </q-item-section>
              </q-item>
                <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.marsDevice"
                    :options="dropDown.marsDeviceOptions"
                    label="Mars Device Model"
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
                    emit-value
                    map-options
                    @update:model-value="fnCategoryBasedMdr(formData)"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.debitLessthanAmount"
                    placeholder="Debit <= 2000 %"
                    label="Debit <= 2000 %"
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
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="side">
            <q-btn label="submit" @click="fnsubmit(formData)" color="purple-9" />
          </q-card-actions>
        </q-card>
      </div>

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
      <!--START: Show merchant type -->
      <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="fnManageMerchantType"
      ></showMerchantModalComponent>
      <!--END: Show merchant type -->
    </div>
  </q-page>
</template>

<script>
/* START >> Modal components Lead source, device, merchant type */
import { useVuelidate } from "@vuelidate/core";
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";
/* END >> Modal components Lead source, device, merchant type */

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "AddMDRCharges",
  components: {
    /* START >> Modal components Lead source, device, merchant type */
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showMerchantModalComponent
    /* END >> Modal components Lead source, device, merchant type */
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
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      }
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
            self.dropDown.marsDeviceOptions = [];
            self.getMarsDeviceModel.forEach(group => {
              group.forEach(oo => {
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
          self.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, item => {
            return { value: item.id, label: item.deviceName };
          });
        });
      self.LEAD_SOURCE_ACTIVE_LIST()
        .then(() => {
          self.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
            return { value: item.id, label: item.sourceName };
          });
        });
      self.MERCHANT_CATEGORY_ACTIVE_LIST()
        .then(() => {
          self.dropDown.merchantTypesOptions = _.map(self.getActiveMerchantCategory, item => {
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

      this.MDR_PLAN(requestParams)
        .then(response => {
          this.$q.notify({
            color: "positive",
            position: "bottom",
            icon: "thumb_up",
            message: response.data.message
          });
          this.resetForm();
        }).catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            icon: "thumb_down",
            message: error.data?.message || "Something went wrong"
          });
          this.resetForm();
        });
    },

    resetForm() {
      var self = this;
      Object.keys(this.formData).forEach(function(key, index) {
        self.formData[key] = "";
      });
    },

    fnCategoryBasedMdr(request) {
      let formData = {
        leadSource: request.leadSource,
        device: request.device,
        merchantType: request.merchantType
      };
      this.CATEGORY_BASED_MDR_PLAN(formData).then(response => {
        if (response.status == 200) {
          this.formData.debitLessthanAmount = this.categoryBasedMdr.debitLessthanAmount;
          this.formData.debitGreaterthanAmount = this.categoryBasedMdr.debitGreaterthanAmount;
          this.formData.stdCC = this.categoryBasedMdr.stdCC;
          this.formData.premiumCC = this.categoryBasedMdr.premiumCC;
          this.formData.corpCC = this.categoryBasedMdr.corpCC;
          this.formData.intlCC = this.categoryBasedMdr.intlCC;
          this.formData.superPremiumlCC = this.categoryBasedMdr.superPremiumlCC;
        } else {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Invalid MDR Plan",
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
    }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
