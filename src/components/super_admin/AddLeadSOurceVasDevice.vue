<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitToggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <div class="q-pa-md border-bottom">
          <div class="text-h6 text-weight-regular">
            LeadSource And Vas, Device Config
          </div>
        </div>
        <div class="q-pa-md">
          <q-card flat bordered style="width: 100%">
            <q-card-section>
              <div class="column q-gutter-md">
                <q-select
                  color="grey-9"
                  v-model="formData.leadSourceDeviceVasMapping.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select lead source"
                  placeholder="Lead source"
                  emit-value
                  map-options
                  @blur="v$.formData.leadSourceDeviceVasMapping.leadSource.$touch"
                  :error="v$.formData.leadSourceDeviceVasMapping.leadSource.$error"
                />
                <q-select
                  color="grey-9"
                  v-model="formData.leadSourceDeviceVasMapping.device"
                  :options="dropDown.deviceOptions"
                  label="Select Device"
                  placeholder="Select Device"
                  emit-value
                  map-options
                  @blur="v$.formData.leadSourceDeviceVasMapping.device.$touch"
                  :error="v$.formData.leadSourceDeviceVasMapping.device.$error"
                />
                <q-select
                  multiple
                  use-chips
                  color="grey-9"
                  v-model="formData.vasList"
                  :options="dropDown.vasOptions"
                  label="Select VAS"
                  placeholder="Select VAS"
                  emit-value
                  map-options
                  @blur="v$.formData.vasList.$touch"
                  :error="v$.formData.vasList.$error"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="q-pa-md row justify-end">
          <q-btn
            flat
            class="text-weight-regular text-grey-8 q-mr-sm"
            @click="emitToggleModal"
            label="Cancel"
          />
          <q-btn label="Submit" @click="fnsubmit()" color="purple-9" />
        </div>
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
  name: "AddLeadSourceVasDevice",
  props: ["propShowAddLeadSOurceVasDevice"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: null,
          device: null,
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
    toggleModel: {
      get() {
        return this.propShowAddLeadSOurceVasDevice;
      },
      set(val) {
        if (!val) this.emitToggleModal();
      },
    },
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
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
  created() {
    this.ajaxLoadData();
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSourceVasDeviceConfig", ["CREATE_LS_VAS_DEVICE_CONFIG"]),
    emitToggleModal() {
      this.$emit("emitAddLeadSOurceVasDevice");
    },
    async ajaxLoadData() {
      this.$q.loading.show();
      try {
        await Promise.all([
          this.LEAD_SOURCE_ACTIVE_LIST(),
          this.FETCH_DEVICES_DATA(),
          this.GET_ALL_VAS_DETAILS(),
        ]);
        this.dropDown.leadSourceOptions = _.map(
          this.getActiveLeadSource,
          (item) => ({
            value: item,
            label: item.sourceName,
          })
        );
        this.dropDown.deviceOptions = _.map(this.getAllDevicesInfo, (item) => ({
          value: item,
          label: item.deviceName,
        }));
        this.dropDown.vasOptions = _.map(this.getAllVasDetails, (item) => ({
          value: item,
          label: item.name,
        }));
      } catch (e) {
        console.error(e);
      } finally {
        this.$q.loading.hide();
      }
    },
    fnsubmit() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify({
          color: "negative",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
      } else {
        this.$q.loading.show({
          message: "Validating...",
        });
        this.CREATE_LS_VAS_DEVICE_CONFIG(this.formData)
          .then((response) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully Created",
              icon: "thumb_up",
            });
            this.emitToggleModal();
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
