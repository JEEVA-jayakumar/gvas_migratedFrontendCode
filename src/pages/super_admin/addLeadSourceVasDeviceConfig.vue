<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">
        LeadSource And Vas,Device Config
      </div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-list>

              <!-- Lead Source -->
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    color="grey-9" v-model="formData.leadSourceDeviceVasMapping.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select lead source"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <!-- Device -->
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    color="grey-9" v-model="formData.leadSourceDeviceVasMapping.device"
                    :options="dropDown.deviceOptions"
                    label="Select Device"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <!-- VAS -->
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    multiple
                    color="grey-9" v-model="formData.vasList"
                    :options="dropDown.vasOptions"
                    label="Select VAS"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

          <q-card-actions vertical align="end">
            <q-btn
              label="Submit"
              color="purple-9" @click="fnsubmit"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "MDRdetails",

  data() {
    return {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: null,
          device: null
        },
        vasList: []
      },

      dropDown: {
        leadSourceOptions: [],
        deviceOptions: [],
        vasOptions: []
      }
    };
  },

  validations() {
    return {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: { required },
          device: { required }
        },
        vasList: { required }
      }
    };
  },

  created() {
    this.ajaxLoadDataForDeviceTypeTable();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("vasCreation", ["getAllVasDetails"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("leadSourceVasDeviceConfig", [
      "CREATE_LS_VAS_DEVICE_CONFIG"
    ]),

    async ajaxLoadDataForDeviceTypeTable() {
      try {
        this.dropDown.leadSourceOptions = [];
        this.dropDown.deviceOptions = [];
        this.dropDown.vasOptions = [];

        await this.LEAD_SOURCE_ACTIVE_LIST();
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          label: item.sourceName,
          value: item
        }));

        await this.FETCH_DEVICES_DATA();
        this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
          label: item.deviceName,
          value: item
        }));

        await this.GET_ALL_VAS_DETAILS();
        this.dropDown.vasOptions = this.getAllVasDetails.map(item => ({
          label: item.name,
          value: item
        }));

      } catch (error) {
        console.error(error);
      }
    },

    async fnsubmit() {
      this.v$.$touch();

      if (this.v$.$invalid) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info"
        });
        return;
      }

      this.$q.loading.show({
        spinnerColor: "purple-9",
        message: "Validating..."
      });

      try {
        await this.CREATE_LS_VAS_DEVICE_CONFIG(this.formData);

        this.$q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Created",
          icon: "thumb_up"
        });

        this.resetForm();

      } catch (error) {
        this.$q.notify({
          color: "amber-9",
          position: "bottom",
          message:
            error?.body?.message || "Please Try Again Later !",
          icon: "thumb_down"
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    resetForm() {
      this.formData = {
        leadSourceDeviceVasMapping: {
          leadSource: null,
          device: null
        },
        vasList: []
      };
      this.v$.$reset();
    }
  }
};
</script>

<style>
</style>
