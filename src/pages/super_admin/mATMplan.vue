<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section class="bg-purple-9 text-white">
            <div class="text-h6">Add M-ATM Plan</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="fnsubmit(formData)" class="q-gutter-md">
              <q-select
                outlined
                dense
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                label="Select lead source"
                emit-value
                map-options
              />

              <q-select
                outlined
                dense
                v-model="formData.device"
                :options="dropDown.deviceOptions"
                label="Select device"
                emit-value
                map-options
              />

              <q-input
                outlined
                dense
                v-model.trim="formData.planName"
                label="Plan Name *"
                placeholder="Enter plan name"
              />

              <q-input
                outlined
                dense
                type="number"
                step="0.01"
                v-model.trim="formData.incentivePercentage"
                label="Incentive Percentage *"
                placeholder="%"
              />

              <q-input
                outlined
                dense
                type="number"
                v-model.trim="formData.minTxnVal"
                label="Minimum Transaction Value *"
                placeholder="Amount"
              />

              <q-input
                outlined
                dense
                type="number"
                v-model.trim="formData.maxIncPerTxn"
                label="Maximum Incentive Per Transaction *"
                placeholder="Amount"
              />

              <div class="row justify-end q-mt-lg">
                <q-btn unelevated label="Submit Plan" type="submit" color="purple-9" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "AddMATMPlan",
  data() {
    return {
      formData: {
        leadSource: null,
        device: null,
        planName: "",
        incentivePercentage: "",
        minTxnVal: "",
        maxIncPerTxn: "",
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
      }
    };
  },

  created() {
    this.ajaxLoadInitialData();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("mATMSubmitPlan", ["MATM_SUBMIT_PLAN_DETAILS"]),

    async ajaxLoadInitialData() {
      this.$q.loading.show({ message: "Loading data..." });
      try {
        await Promise.all([
          this.FETCH_DEVICES_DATA(),
          this.LEAD_SOURCE_ACTIVE_LIST()
        ]);

        this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
          value: item.id,
          label: item.deviceName
        }));
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          value: item.id,
          label: item.sourceName
        }));
      } finally {
        this.$q.loading.hide();
      }
    },

    async fnsubmit(request) {
      if (!request.leadSource || !request.device || !request.planName) {
        this.$q.notify({ color: "negative", message: "Please fill all mandatory fields" });
        return;
      }

      this.$q.loading.show({ message: "Submitting..." });

      let requestParams = {
        url: {
          leadSource: request.leadSource,
          device: request.device,
        },
        params: {
          planName: request.planName,
          incentivePercentage: request.incentivePercentage,
          minTxnVal: request.minTxnVal,
          maxIncPerTxn: request.maxIncPerTxn,
        }
      };

      this.MATM_SUBMIT_PLAN_DETAILS(requestParams)
        .then(response => {
          this.$q.notify({
            color: "positive",
            message: response.data.message || "M-ATM plan added successfully",
            icon: "thumb_up"
          });
          this.resetForm();
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.data?.message || "Submission failed",
            icon: "warning"
          });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    resetForm() {
      this.formData = {
        leadSource: null,
        device: null,
        planName: "",
        incentivePercentage: "",
        minTxnVal: "",
        maxIncPerTxn: "",
      };
    }
  }
};
</script>
