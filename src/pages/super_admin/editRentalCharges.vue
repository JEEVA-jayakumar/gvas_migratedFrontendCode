<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
    @hide="emitfnshowEditRental"
  >
    <q-card style="min-width: 500px; max-width: 90vw;">
      <q-card-section class="bg-purple-9 text-white">
        <div class="text-h6">Edit Rental Charge</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form @submit="fnEditRentalPlan(formData)" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                label="Select lead source"
                emit-value
                map-options
                @update:model-value="fetchRates"
              />
            </div>
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="formData.device"
                :options="dropDown.deviceOptions"
                label="Select device"
                emit-value
                map-options
                @update:model-value="fetchRates"
              />
            </div>
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="formData.marsDeviceModel"
                :options="dropDown.marsDeviceOptions"
                label="Mars Device Model"
                emit-value
                map-options
                @update:model-value="fetchRates"
              />
            </div>
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="formData.plan"
                :options="dropDown.planOptions"
                label="Select plan"
                emit-value
                map-options
                @update:model-value="fetchRates"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                outlined
                dense
                type="number"
                v-model="formData.setupFees"
                label="Setup fee"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                outlined
                dense
                type="number"
                v-model="formData.monthlyFees"
                label="Recurring fee"
              />
            </div>
          </div>

          <div class="row justify-end q-mt-lg q-gutter-sm">
            <q-btn flat label="Cancel" @click="emitfnshowEditRental" />
            <q-btn unelevated label="Save Changes" color="purple-9" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "EditRentalCharges",
  props: ["propShoweditPlanDetails", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShoweditPlanDetails,
      formData: {
        leadSource: JSON.stringify(this.propRowDetails.leadSource),
        device: JSON.stringify(this.propRowDetails.device),
        marsDeviceModel: JSON.stringify(this.propRowDetails.marsDeviceModel),
        plan: JSON.stringify(this.propRowDetails.plan),
        setupFees: this.propRowDetails.setupFees,
        monthlyFees: this.propRowDetails.monthlyFees,
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions: [],
        planOptions: []
      }
    };
  },

  created() {
    this.ajaxLoadInitialData();
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
    ...mapActions("categoryBasedRental", ["CATEGORY_BASED_RENTAL_PLAN", "EDIT_RENTAL_PLAN"]),

    emitfnshowEditRental() {
      this.$emit("emitfnshowEditRental");
    },

    async ajaxLoadInitialData() {
      await Promise.all([
        this.FETCH_DEVICES_DATA(),
        this.LEAD_SOURCE_ACTIVE_LIST(),
        this.PLAN_ACTIVE_LIST(),
        this.FETCH_MARS_DEVICE_MODEL()
      ]);

      this.dropDown.deviceOptions = this.getAllDevicesInfo.map(i => ({ label: i.deviceName, value: JSON.stringify(i) }));
      this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(i => ({ label: i.sourceName, value: JSON.stringify(i) }));
      this.dropDown.planOptions = this.getActivePlan.map(i => ({ label: i.planName, value: JSON.stringify(i) }));

      this.dropDown.marsDeviceOptions = [];
      this.getMarsDeviceModel.forEach(group => {
        group.forEach(device => {
          this.dropDown.marsDeviceOptions.push({ label: device.name, value: JSON.stringify(device) });
        });
      });
    },

    async fetchRates() {
      const ls = JSON.parse(this.formData.leadSource);
      const dev = JSON.parse(this.formData.device);
      const plan = JSON.parse(this.formData.plan);

      if (!ls.id || !dev.id || !plan.id) return;

      this.$q.loading.show({ message: "Fetching rates..." });
      try {
        const response = await this.CATEGORY_BASED_RENTAL_PLAN({
          leadSource: ls.id,
          device: dev.id,
          plan: plan.id
        });
        if (response.status === 200 && response.data) {
          this.formData.setupFees = response.data.setupFees;
          this.formData.monthlyFees = response.data.monthlyFees;
        }
      } finally {
        this.$q.loading.hide();
      }
    },

    fnEditRentalPlan(request) {
      this.$q.loading.show({ message: "Updating Rental Plan..." });

      let payload = {
        id: this.propRowDetails.id,
        setupFees: request.setupFees,
        monthlyFees: request.monthlyFees,
        leadSource: JSON.parse(request.leadSource),
        device: JSON.parse(request.device),
        marsDeviceModel: JSON.parse(request.marsDeviceModel),
        plan: JSON.parse(request.plan),
        active: true
      };

      this.EDIT_RENTAL_PLAN(payload)
        .then(() => {
          this.$q.notify({ color: "positive", message: "Updated successfully", icon: "thumb_up" });
          this.emitfnshowEditRental();
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
    ...mapGetters("plan", ["getActivePlan"]),
  }
};
</script>
