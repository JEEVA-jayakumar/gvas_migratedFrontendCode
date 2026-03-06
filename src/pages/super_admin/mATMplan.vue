<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Add M-ATM plan</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-select
                  color="grey-9"
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select lead source"
                  placeholder="Lead source"
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-select
                  color="grey-9"
                  v-model="formData.device"
                  :options="dropDown.deviceOptions"
                  label="Select device"
                  placeholder="Device"
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
                  v-model.trim="formData.planName"
                  placeholder="Enter Your Plan"
                  label="Enter Your Plan"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="col">
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model.trim="formData.incentivePercentage"
                    placeholder="%"
                    label="Incentive Percentage *"
                  />
                </div>
              </q-item-section>
            </q-item>
             <q-item>
              <q-item-section>
                <div class="col">
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model.trim="formData.minTxnVal "
                    placeholder="Minimum Transaction Value*"
                    label="Minimum Transaction Value*"
                  />
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="col">
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model.trim="formData.maxIncPerTxn"
                    placeholder="Maximum Incentive Per Transaction *"
                    label="Maximum Incentive Per Transaction *"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions vertical align="right">
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

      <!--START: Show plan details -->
      <showPlanModalComponent
        v-if="showPlanDetailModal"
        :propToggleModal="showPlanDetailModal"
        @emitToggleModal="fnManagePlan"
      ></showPlanModalComponent>
      <!--END: Show plan details-->
    </div>
  </q-page>
</template>

<script>
/* START >> Modal components Lead source, device, merchant type */
import { useVuelidate } from "@vuelidate/core";
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showPlanModalComponent from "../../components/super_admin/showPlanModalComponent.vue";
/* END >> Modal components Lead source, device, plan */

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "AddMATMPlan",
  components: {
    /* START >> Modal components Lead source, device, plan */
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showPlanModalComponent
    /* END >> Modal components Lead source, device, plan */
  },
  data() {
    return {
      /* START >> Modal props */
      showLeadSourceModal: false,
      showDeviceDetailModal: false,
      showPlanDetailModal: false,
      activeLeadSourceList: [],
      activeDeviceList: [],

      /* END >> Modal props */

      /* START >> Rental charges */
      formData: {
        leadSource: "",
        device: "",
        planName: "",
        incentivePercentage: "",
        minTxnVal: "",
        maxIncPerTxn: "",
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
      },
      /* START >>Table properties */
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      }
    };
  },

  created() {
    this.ajaxLoadDataForDeviceTypeTable();
  },
  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("plan", ["getActivePlan"]),
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
    ...mapActions("mATMSubmitPlan", ["MATM_SUBMIT_PLAN_DETAILS"]),

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      self.FETCH_DEVICES_DATA().then(() => {
        self.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, item => {
          return {
            value: item.id,
            label: item.deviceName
          };
        });
      });
      self.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        self.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
          return {
            value: item.id,
            label: item.sourceName
          };
        });
      });
    },

    fnsubmit(request) {
      let requestParams = {
        url: {
          leadSource: request.leadSource,
          device: request.device,
        },
        params: {
          planName: request.planName,
          incentivePercentage:  request.incentivePercentage,
          minTxnVal:  request.minTxnVal,
           maxIncPerTxn:  request.maxIncPerTxn,
        }
      };
      this.MATM_SUBMIT_PLAN_DETAILS(requestParams)
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

    fnManageLeadSource() {
      this.showLeadSourceModal = !this.showLeadSourceModal;
    },
    activeDevice() {
      this.FETCH_DEVICES_DATA().then(() => {
        this.activeDeviceList = this.getAllDevicesInfo;
      });
    },
    fnManageDevice(token) {
      this.showDeviceDetailModal = !this.showDeviceDetailModal;
      if (token == "refresh") {
        this.activeDevice();
      }
    },
    activePincode() {
      this.PLAN_ACTIVE_LIST().then(() => {
        this.activeLeadSourceList = this.getActivePlan;
      });
    },
    fnManagePlan(token) {
      this.showPlanDetailModal = !this.showPlanDetailModal;
      if (token == "refresh") {
        this.activePincode();
      }
    }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
