<template>
  <div>
    <q-dialog
      class="customModalOverlay"
      v-model="toggleModel"
      @hide="$emit('emitAddLeadSOurceVasDevice')"
    >
      <q-card style="padding:30px;min-width: 30vw">
        <div class="column">
          <div class="q-py-sm text-subtitle1 bottom-border">LeadSource And Vas,Device Config</div>
          <div class="q-py-sm">
            <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
            <q-card style="width:100%" flat bordered>
              <q-card-section>
                <q-item class="no-padding">
                <q-item-section>
                  <q-select color="grey-9" v-model="formData.leadSourceDeviceVasMapping.leadSource" :options="dropDown.leadSourceOptions"
                    label="Select lead source" placeholder="Lead source" />
                </q-item-section>
              </q-item>
              <q-item class="no-padding q-mt-md">
                <q-item-section>
                  <q-select color="grey-9" v-model="formData.leadSourceDeviceVasMapping.device" :options="dropDown.deviceOptions"
                    label="Select Device" placeholder="Select Device" />
                </q-item-section>
              </q-item>
              <q-item class="no-padding q-mt-md">
                <q-item-section>
                  <q-select multiple color="grey-9" v-model="formData.vasList" :options="dropDown.vasOptions"
                    label="Select VAS" placeholder="Select VAS" />
                </q-item-section>
              </q-item>
              </q-card-section>
              <q-card-actions vertical align="right">
               <q-btn label="submit" @click="fnsubmit(formData)" color="purple-9" />
              </q-card-actions>
            </q-card>
          </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShowAddLeadSOurceVasDevice"],
  name: "MDRdetails",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddLeadSOurceVasDevice,
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
    };
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
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("leadSourceVasDeviceConfig", ["CREATE_LS_VAS_DEVICE_CONFIG"]),

    ajaxLoadDataForDeviceTypeTable() {
      let self = this;
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => {
          this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
              value: item,
              label: item.sourceName
          }));
      });
      this.FETCH_DEVICES_DATA().then(() => {
          this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
              value: item,
              label: item.deviceName
          }));
      });
      this.GET_ALL_VAS_DETAILS().then(() => {
          this.dropDown.vasOptions = this.getAllVasDetails.map(item => ({
              value: item,
              label: item.name
          }));
      });
    },
    async fnsubmit(request) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
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
        // Construct payload manually to ensure correct structure
        let payload = {
            leadSourceDeviceVasMapping: {
                leadSource: request.leadSourceDeviceVasMapping.leadSource,
                device: request.leadSourceDeviceVasMapping.device
            },
            vasList: request.vasList
        };
        this.CREATE_LS_VAS_DEVICE_CONFIG(payload)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Created",
              icon: "thumb_up",
            });
            this.resetForm();
            this.$emit('emitAddLeadSOurceVasDevice');
          })
          .catch((error) => {
            this.$q.loading.hide();
            if(error.status == 409){
                this.$q.notify({
                    type: "warning",
                    color: "amber-9",
                    position: "bottom",
                    message: error.data?.message || "Please Try Again Later !",
                    icon: "thumb_down",
                });
                this.resetForm();
            }
          });
      }
    },
    resetForm() {
        this.formData = {
            leadSourceDeviceVasMapping: { leadSource: "", device: "" },
            vasList: []
        };
    }
  },
};
</script>
<style scoped>
label {
  padding: 10px;
  display: table;
}

input[type="file"] {
  display: none;
}
</style>
