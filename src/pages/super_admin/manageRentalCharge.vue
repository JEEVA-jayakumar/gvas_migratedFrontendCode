<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Add Rental Charge</div>
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
                    placeholder="Lead source"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    no-caps
                    size="md"
                    @click="fnManageLeadSource"
                    color="purple-9"
                    icon="add"
                    class="no-margin"
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
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    no-caps
                    size="md"
                    @click="fnManageDevice"
                    color="purple-9"
                    icon="add"
                    class="no-margin"
                  />
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
                    v-model="formData.plan"
                    :options="dropDown.planOptions"
                    label="Select plan"
                    placeholder="Plan"
                    emit-value
                    map-options
                    @update:model-value="fnCategoryBasedRental(formData)"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    no-caps
                    size="md"
                    @click="fnManagePlan"
                    color="purple-9"
                    icon="add"
                    class="no-margin"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="number"
                    v-model="formData.setupFees"
                    placeholder="Setup fee"
                    label="Enter Setup fee"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.monthlyFees"
                      placeholder="Recurring fee"
                      label="Enter recurring fee"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="right">
            <q-btn label="submit" :disabled="Submitdata" @click="fnsubmit(formData)" color="purple-9" />
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
      <showPlanModalComponent
        v-if="showPlanDetailModal"
        :propToggleModal="showPlanDetailModal"
        @emitToggleModal="fnManagePlan"
      ></showPlanModalComponent>
    </div>
  </q-page>
</template>

<script>
/* START >> Modal components Lead source, device, merchant type */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showPlanModalComponent from "../../components/super_admin/showPlanModalComponent.vue";
/* END >> Modal components Lead source, device, plan */

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "ManageRentalCharge",
  components: {
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showPlanModalComponent
  },
  data() {
    return {
      showLeadSourceModal: false,
      showDeviceDetailModal: false,
      showPlanDetailModal: false,
      activeLeadSourceList: [],
      activeDeviceList: [],
      Submitdata: false,

      formData: {
        leadSource: "",
        device: "",
        marsDevice: "",
        plan: "",
        setupFees: "",
        monthlyFees: ""
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions:[],
        planOptions: []
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
    ...mapGetters("merchantTypes", ["getActiveMerchantTypes"]),
    ...mapGetters("plan", ["getActivePlan"]),
    ...mapGetters("categoryBasedRental", ["categoryBasedRental"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA","FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
    ...mapActions("RentalPlan", ["RENTAL_PLAN"]),
    ...mapActions("categoryBasedRental", [
      "CATEGORY_BASED_RENTAL_PLAN",
      "EDIT_RENTAL_PLAN"
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
      self.PLAN_ACTIVE_LIST()
        .then(() => {
          self.dropDown.planOptions = _.map(self.getActivePlan, item => {
            return { value: item.id, label: item.planName };
          });
        });
    },

    fnsubmit(request) {
        this.$q.loading.show({
          delay: 100, 
          spinnerColor: "purple-9",
          message: "Please wait.."
        });
        this.Submitdata = true;
        let requestParams = {
          url: {
            leadSource: request.leadSource,
            device: request.device,
            plan: request.plan
          },
          params: {
            setupFees: request.setupFees,
            monthlyFees: request.monthlyFees
          }
        };
        this.RENTAL_PLAN(requestParams)
          .then(response => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              icon: "thumb_up",
              message: response.data.message
            });
            this.resetForm();
            this.$q.loading.hide();
            this.Submitdata = false;
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "bottom",
              icon: "thumb_down",
              message: error.data?.message || "Something went wrong"
            });
            this.$q.loading.hide();
            this.Submitdata = false;
          });
    },

    resetForm() {
      var self = this;
      Object.keys(this.formData).forEach(function(key, index) {
        self.formData[key] = "";
      });
    },

    fnCategoryBasedRental(request) {
      if (!request.leadSource || !request.device || !request.plan) return;
      let formData = {
        leadSource: request.leadSource,
        device: request.device,
        plan: request.plan
      };
      this.CATEGORY_BASED_RENTAL_PLAN(formData).then(response => {
        if (response.status == 200) {
          this.formData.setupFees = this.categoryBasedRental.setupFees;
          this.formData.monthlyFees = this.categoryBasedRental.monthlyFees;
        } else {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Invalid Rental Plan",
            icon: "clear"
          });
          this.formData.setupFees = "";
          this.formData.monthlyFees = "";
        }
      });
    },

    fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; },
    fnManageDevice() { this.showDeviceDetailModal = !this.showDeviceDetailModal; },
    fnManagePlan() { this.showPlanDetailModal = !this.showPlanDetailModal; }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
