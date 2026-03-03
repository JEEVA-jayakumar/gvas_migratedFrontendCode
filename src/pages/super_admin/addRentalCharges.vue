<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">Existing Rental charge</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-separator />
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-select
                  color="grey-9"
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select lead source"
                  placeholder="Lead source"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12">
                <q-select
                  color="grey-9"
                  v-model="formData.device"
                  :options="dropDown.deviceOptions"
                  label="Select device"
                  placeholder="Device"
                  emit-value
                  map-options
                />
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
                  v-model="formData.plan"
                  :options="dropDown.planOptions"
                  label="Select plan"
                  placeholder="Plan"
                  @update:model-value="fnCategoryBasedRental(formData)"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.setupFees"
                  placeholder="Setup fee"
                  label="Enter Setup fee"
                />
              </div>
              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="formData.monthlyFees"
                  placeholder="Recurring fee"
                  label="Enter recurring fee"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="submit" @click="fnEditRentalPlan(formData)" color="purple-9" />
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
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showPlanModalComponent from "../../components/super_admin/showPlanModalComponent.vue";

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "AddRentalCharges",
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
        marsDeviceOptions: [],
        planOptions: []
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
            _.map(self.getMarsDeviceModel, item => {
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
      self.PLAN_ACTIVE_LIST()
        .then(() => {
          this.dropDown.planOptions = _.map(self.getActivePlan, item => {
            return { value: item.id, label: item.planName };
          });
        });
    },
    fnCategoryBasedRental(request) {
      let formData = {
        leadSource: request.leadSource,
        device: request.device,
        plan: request.plan
      };
      let self = this;
      self.CATEGORY_BASED_RENTAL_PLAN(formData).then(response => {
        if (response.status == 200) {
          this.formData.setupFees = self.categoryBasedRental.setupFees;
          this.formData.monthlyFees = self.categoryBasedRental.monthlyFees;
        } else if (response.data == null) {
          this.formData.setupFees = 0;
          this.formData.monthlyFees = 0;
        } else {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: "Invalid MDR Plan Code",
            icon: "clear"
          });
          this.formData.setupFees = "";
          this.formData.monthlyFees = "";
        }
      });
    },
    fnEditRentalPlan(request) {
      let requestParams = {
        id: this.categoryBasedRental.id,
        setupFees: request.setupFees,
        monthlyFees: request.monthlyFees
      };
      this.$q.loading.show({ message: "Please Wait" });
      this.EDIT_RENTAL_PLAN(requestParams)
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

    fnManageLeadSource() {
      this.showLeadSourceModal = !this.showLeadSourceModal;
    },
    fnManageDevice() {
      this.showDeviceDetailModal = !this.showDeviceDetailModal;
    },
    fnManagePlan() {
      this.showPlanDetailModal = !this.showPlanDetailModal;
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
