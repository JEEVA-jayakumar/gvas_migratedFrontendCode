<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">Add M-ATM plan</div>
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
                <q-input
                  color="grey-9"
                  type="text"
                  v-model.trim="formData.planName"
                  placeholder="Enter Your Plan"
                  label="Enter Your Plan"
                />
              </div>
              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model.trim="formData.incentivePercentage"
                  placeholder="%"
                  label="Incentive Percentage *"
                />
              </div>
              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model.trim="formData.minTxnVal"
                  placeholder="Minimum Transaction Value*"
                  label="Minimum Transaction Value*"
                />
              </div>
              <div class="col-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model.trim="formData.maxIncPerTxn"
                  placeholder="Maximum Incentive Per Transaction *"
                  label="Maximum Incentive Per Transaction *"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="submit" @click="fnsubmit(formData)" color="purple-9" />
          </q-card-actions>
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
      }
    };
  },

  created() {
    this.ajaxLoadDataForDeviceTypeTable();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("mATMSubmitPlan", ["MATM_SUBMIT_PLAN_DETAILS"]),

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      self.FETCH_DEVICES_DATA()
        .then(() => {
          this.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, item => {
            return {
              value: item.id,
              label: item.deviceName
            };
          });
        });
      self.LEAD_SOURCE_ACTIVE_LIST()
        .then(() => {
          this.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
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
          incentivePercentage: request.incentivePercentage,
          minTxnVal: request.minTxnVal,
          maxIncPerTxn: request.maxIncPerTxn,
        }
      };
      this.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9"
      });
      this.MATM_SUBMIT_PLAN_DETAILS(requestParams)
        .then(response => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: response.data.message,
            icon: "thumb_up"
          });
          this.resetForm();
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            icon: "warning",
            message: error.data?.message || "Operation failed"
          });
        });
    },

    resetForm() {
      this.formData = {
        leadSource: "",
        device: "",
        planName: "",
        incentivePercentage: "",
        minTxnVal: "",
        maxIncPerTxn: "",
      };
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
