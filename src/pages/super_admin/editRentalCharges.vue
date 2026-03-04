<template>
  <q-page>
    <q-dialog
      persistent
      class="customModalOverlay"
      v-model="toggleModel"
    >
      <q-card style="padding: 25px; min-width: 40vw">
        <div class="row">
          <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">
            Existing Rental charge
          </div>
          <!-- START >> Setup MDR details -->
          <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
            <q-card style="width:150%" flat>
              <q-card-section>
                <q-list class="no-border">
                  <div class="col-md-12">
                    <q-select
                      color="grey-9"
                      v-model="formData.leadSource"
                      :options="dropDown.leadSourceOptions"
                      label="Select lead source"
                      @update:model-value="fnleadSource"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-md-12">
                    <q-select
                      color="grey-9"
                      v-model="formData.device"
                      :options="dropDown.deviceOptions"
                      label="Select device"
                      @update:model-value="fnDevice"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-md-12">
                    <q-select
                      color="grey-9"
                      v-model="formData.marsDeviceModel"
                      :options="dropDown.marsDeviceOptions"
                      label="Mars Device Model"
                      @update:model-value="fnMarsDeviceModel"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-md-12">
                    <q-select
                      color="grey-9"
                      v-model="formData.plan"
                      :options="dropDown.planOptions"
                      label="Select plan"
                      placeholder="Plan"
                      @update:model-value="fnCategoryBasedRental"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-md-12">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.setupFees"
                      placeholder="Setup fee"
                      label="Enter Setup fee"
                    />
                  </div>
                  <div class="col-md-12">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model="formData.monthlyFees"
                      placeholder="Recurring fee"
                      label="Enter recurring fee"
                    />
                  </div>
                </q-list>
              </q-card-section>
              <q-card-actions  align="right">
                <q-btn
                flat
                align="right"
                class="bg-white text-weight-regular text-grey-8"
                @click="emitfnshowEditRental()"
                >Cancel</q-btn>
                <q-btn
                  label="submit"
                  @click="fnEditRentalPlan(formData)"
                  color="purple-9"
                />
              </q-card-actions>
            </q-card>
          </div>
          <!-- END >> Setup MDR details -->
          <!-- START >> Table >> MDR details -->
          <div class="col-md-7 col-sm-8 col-xs-12"></div>
          <!-- END >> Table >> MDR details -->
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
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
/* START >> Modal components Lead source, device, merchant type */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";
/* END >> Modal components Lead source, device, merchant type */

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShoweditPlanDetails", "propRowDetails"],
  name: "EditRentalCharges",
  components: {
    /* START >> Modal components Lead source, device, merchant type */
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showMerchantModalComponent
    /* END >> Modal components Lead source, device, merchant type */
  },
  data() {
    return {
      /* START >> Modal props */
      toggleModel: this.propShoweditPlanDetails,
      showLeadSourceModal: false,
      showDeviceDetailModal: false,
      showMerchantModal: false,
      /* END >> Modal props */

      /* START >> Rental charges */
      formData: {
        leadSource: JSON.stringify(this.propRowDetails.leadSource),
        device: JSON.stringify(this.propRowDetails.device),
        marsDeviceModel: JSON.stringify(this.propRowDetails.marsDeviceModel),
        plan: JSON.stringify(this.propRowDetails.plan),
        setupFees: this.propRowDetails.setupFees,
        monthlyFees: this.propRowDetails.monthlyFees,
        leadSource1: this.propRowDetails.leadSource.id,
        deviceId: this.propRowDetails.device.id,
        marsId: "",
        plan1: ""
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions: [],
        planOptions: []
      },
      rentalChargeId: this.propRowDetails.id,
    };
  },

  created() {
    this.LEAD_BASED_RENTAL(this.formData.leadSource1);
    this.ajaxLoadDataForDeviceTypeTable();
    this.marsDeviceModelDatasLoading();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("categoryBasedRental", ["categoryBasedRental"]),
    ...mapGetters("CategoryBasedMdr", ["categoryBasedMdr"]),
    ...mapGetters("LeadSourceBasedRental", ["getLeadSourceRental"]),
    ...mapGetters("plan", ["getActivePlan"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("LeadSourceBasedRental", ["LEAD_BASED_RENTAL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("MdrPlan", ["MDR_PLAN"]),
    ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
    ...mapActions("categoryBasedRental", ["CATEGORY_BASED_RENTAL_PLAN", "EDIT_RENTAL_PLAN"]),
    ...mapActions("CategoryBasedMdr", ["CATEGORY_BASED_MDR_PLAN", "EDIT_MDR_PLAN"]),

    emitfnshowEditRental(){
      this.$emit("emitfnshowEditRental");
    },

    marsDeviceModelDatasLoading() {
      let self = this;
      self.FETCH_MARS_DEVICE_MODEL().then(() => {
        self.dropDown.marsDeviceOptions = [];
        return _.map(self.getMarsDeviceModel, item => {
          item.map(oo => {
            self.dropDown.marsDeviceOptions.push({
              label: oo.name,
              value: JSON.stringify(oo)
            });
          });
        });
      });
    },

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      self.FETCH_DEVICES_DATA().then(() => {
        self.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, item => {
          return { label: item.deviceName, value: JSON.stringify(item) };
        });
      });

      self.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        self.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
          return { label: item.sourceName, value: JSON.stringify(item) };
        });
      });

      self.PLAN_ACTIVE_LIST().then(() => {
        self.dropDown.planOptions = _.map(self.getActivePlan, item => {
          return { value: JSON.stringify(item), label: item.planName };
        });
      });
    },
    fnCategoryBasedRental(itemStr) {
      const item = JSON.parse(itemStr);
      this.formData.plan1 = item.id;
      this.formData.plan = itemStr;
      this.fetchRates();
    },
    fnleadSource(itemStr) {
      const item = JSON.parse(itemStr);
      this.formData.leadSource1 = item.id;
      this.formData.leadSource = itemStr;
      this.LEAD_BASED_RENTAL(this.formData.leadSource1);
      this.fetchRates();
    },
    fnMarsDeviceModel(ooStr) {
      const data = JSON.parse(ooStr);
      this.formData.marsId = data.id;
      this.formData.marsDeviceModel = ooStr;
      this.fetchRates();
    },
    fnDevice(itemStr) {
      const data = JSON.parse(itemStr);
      this.formData.deviceId = data.id;
      this.formData.device = itemStr;
      this.fetchRates();
    },
    fetchRates() {
      if(!this.formData.leadSource1 || !this.formData.deviceId || !this.formData.plan1) return;
      let formData = {
        leadSource: this.formData.leadSource1,
        device: this.formData.deviceId,
        plan: this.formData.plan1
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
          this.formData.setupFees = 0;
          this.formData.monthlyFees = 0;
        }
      });
    },
    fnEditRentalPlan(request) {
      let requestParams = {
        id: this.rentalChargeId,
        marsDeviceModel: JSON.parse(request.marsDeviceModel),
        setupFees: request.setupFees,
        monthlyFees: request.monthlyFees,
        device: JSON.parse(request.device),
        plan: JSON.parse(request.plan),
        leadSource: JSON.parse(request.leadSource),
        active: true
      };

      this.EDIT_RENTAL_PLAN(requestParams)
        .then(response => {
          this.$emit("emitfnshowEditRental");
          this.$q.notify({
            color: "positive",
            position: "bottom",
            icon: "thumb_up",
            message: response.data.message
          });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            icon: "thumb_down",
            message: error.data?.message || "Something went wrong"
          });
        });
    },

    fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; },
    fnManageDevice() { this.showDeviceDetailModal = !this.showDeviceDetailModal; },
    fnManageMerchantType() { this.showMerchantModal = !this.showMerchantModal; }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
