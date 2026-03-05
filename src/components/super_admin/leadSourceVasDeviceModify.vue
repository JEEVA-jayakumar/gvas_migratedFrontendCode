<template>
  <div>
    <q-dialog
      v-model="propToggleModal"
      @hide="toggleModal"
      @escape-key="toggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">
                Edit LeadSource And Vas,Device Config
              </div>
            </div>
          </div>
          <div class="q-pa-md">
            <div class="column q-gutter-md">
              <q-select
                v-model="formData.leadSourceDeviceVasMapping.leadSource"
                @blur="v$.formData.leadSourceDeviceVasMapping.leadSource.$touch"
                :error="v$.formData.leadSourceDeviceVasMapping.leadSource.$error"
                :options="dropDown.leadSourceOptions"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Select Lead Source"
                placeholder="Select Lead Source"
                emit-value
                map-options
              />
              <q-select
                v-model="formData.leadSourceDeviceVasMapping.device"
                @blur="v$.formData.leadSourceDeviceVasMapping.device.$touch"
                :error="v$.formData.leadSourceDeviceVasMapping.device.$error"
                :options="dropDown.deviceOptions"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Select Device"
                placeholder="Select Device"
                emit-value
                map-options
              />
              <q-select
                multiple
                v-model="formData.vasList"
                @blur="v$.formData.vasList.$touch"
                :error="v$.formData.vasList.$error"
                :options="dropDown.vasOptions"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Select Vas"
                placeholder="Select Vas"
                emit-value
                map-options
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="toggleModal"
              label="Cancel"
            />
            <q-btn @click="submitModifiedData()" color="purple-9" label="Save" />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShowEditLsVasDevice", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      propToggleModal: this.propShowEditLsVasDevice,
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: JSON.stringify(
            this.propRowDetails.leadSourceDeviceVasMapping.leadSource
          ),
          device: JSON.stringify(
            this.propRowDetails.leadSourceDeviceVasMapping.device
          ),
        },
        vasList: [],
      },
      dropDown: {
        leadSourceOptions: [],
        deviceOptions: [],
        vasOptions: [],
      },
    };
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("vasCreation", ["getAllVasDetails"]),
  },
  validations() {
    return {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: { required },
          device: { required },
        },
        vasList: { required },
      },
    };
  },
  beforeMount() {
    this.formData.vasList = this.propRowDetails.vasList.map((oo) =>
      JSON.stringify(oo)
    );
  },
  created() {
    this.ajaxLoadData();
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSourceVasDeviceConfig", [
      "UPDATE_LS_VAS_DEVICE_CONFIG_DETAILS",
    ]),
    async ajaxLoadData() {
      this.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
      });
      try {
        await this.LEAD_SOURCE_ACTIVE_LIST();
        this.dropDown.leadSourceOptions = _.map(
          this.getActiveLeadSource,
          (item) => ({
            value: JSON.stringify(item),
            label: item.sourceName,
          })
        );

        await this.FETCH_DEVICES_DATA();
        this.dropDown.deviceOptions = _.map(this.getAllDevicesInfo, (item) => ({
          value: JSON.stringify(item),
          label: item.deviceName,
        }));

        await this.GET_ALL_VAS_DETAILS();
        this.dropDown.vasOptions = _.map(this.getAllVasDetails, (item) => ({
          label: item.name,
          value: JSON.stringify(item),
        }));
      } catch (e) {
        console.error(e);
      } finally {
        this.$q.loading.hide();
      }
    },
    toggleModal() {
      this.$emit("emitfnshowLsVasDevice");
    },
    submitModifiedData() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        let listOfVas = this.formData.vasList.map((oo) => JSON.parse(oo));
        let params = {
          leadSourceDeviceVasMapping: {
            leadSource: JSON.parse(
              this.formData.leadSourceDeviceVasMapping.leadSource
            ),
            device: JSON.parse(this.formData.leadSourceDeviceVasMapping.device),
          },
          vasList: listOfVas,
        };
        this.UPDATE_LS_VAS_DEVICE_CONFIG_DETAILS(params)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnshowLsVasDevice");
            this.$q.notify({
              color: "positive",
              message: "Configuration successfully updated!",
              icon: "thumb_up",
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #dcdcdc;
}
</style>
