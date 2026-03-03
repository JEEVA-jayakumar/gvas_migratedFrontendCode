<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">LeadSource And Vas,Device Config</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <div class="row q-col-gutter-sm">

              <div class="col-12">
                <q-select color="grey-9" v-model="formData.leadSourceDeviceVasMapping.leadSource" :options="dropDown.leadSourceOptions"
                  label="Select lead source" placeholder="Lead source"
                  emit-value
                  map-options />
              </div>
              <div class="col-12">
                <q-select color="grey-9" v-model="formData.leadSourceDeviceVasMapping.device" :options="dropDown.deviceOptions"
                  label="Select Device" placeholder="Select Device"
                  emit-value
                  map-options />
              </div>
              <div class="col-12">
                <q-select multiple color="grey-9" v-model="formData.vasList" :options="dropDown.vasOptions"
                  label="Select VAS" placeholder="Select VAS"
                  emit-value
                  map-options />
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
import { useVuelidate } from '@vuelidate/core'
import {
  required
} from "@vuelidate/validators";

import { mapGetters, mapActions } from "vuex";
export default {
  name: "AddLeadSourceVasDeviceConfig",
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: "",
          device: "",
        },
        vasList: []
      },
      dropDown: {
        leadSourceOptions: [],
        deviceOptions: [],
        vasOptions: [],
      },
    };
  },
  validations() {
    return {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: { required },
          device: { required },
        },
        vasList: { required }
      }
    }
  },
  created() {
    this.ajaxLoadDataForDeviceTypeTable();
  },
  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("vasCreation", ["getAllVasDetails"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("leadSourceVasDeviceConfig", ["CREATE_LS_VAS_DEVICE_CONFIG"]),

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      self.LEAD_SOURCE_ACTIVE_LIST()
        .then(() => {
          this.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
            return { value: item, label: item.sourceName };
          });
        });
      self.FETCH_DEVICES_DATA()
        .then(() => {
          this.dropDown.deviceOptions = _.map(self.getAllDevicesInfo, item => {
            return { value: item.deviceName, label: item.deviceName };
          });
        });
      self.GET_ALL_VAS_DETAILS().then(() => {
        this.dropDown.vasOptions = _.map(self.getAllVasDetails, item => {
          return { value: item, label: item.name };
        });
      });
    },
    fnsubmit(request) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info"
        });
      } else {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Validating..."
        });
        this.CREATE_LS_VAS_DEVICE_CONFIG(request)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Created",
              icon: "thumb_up",
            });
            this.resetForm();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "warning",
              color: "amber-9",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
    resetForm() {
      this.formData = {
        leadSourceDeviceVasMapping: { leadSource: "", device: "" },
        vasList: []
      };
      this.v$.$reset();
    }
  },
};
</script>

<style>
</style>
