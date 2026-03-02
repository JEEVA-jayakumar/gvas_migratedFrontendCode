<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 450px; padding: 20px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-purple-9">LeadSource And Vas Device Config</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="$emit('emitAddLeadSOurceVasDevice')" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="fnsubmit" class="q-gutter-md">
          <q-select
            outlined
            dense
            v-model="formData.leadSourceDeviceVasMapping.leadSource"
            :options="dropDown.leadSourceOptions"
            label="Select lead source"
            :error="v$.formData.leadSourceDeviceVasMapping.leadSource.$error"
            color="purple-9"
            emit-value
            map-options
          />

          <q-select
            outlined
            dense
            v-model="formData.leadSourceDeviceVasMapping.device"
            :options="dropDown.deviceOptions"
            label="Select Device"
            :error="v$.formData.leadSourceDeviceVasMapping.device.$error"
            color="purple-9"
            emit-value
            map-options
          />

          <q-select
            outlined
            dense
            multiple
            use-chips
            v-model="formData.vasList"
            :options="dropDown.vasOptions"
            label="Select VAS"
            :error="v$.formData.vasList.$error"
            color="purple-9"
            emit-value
            map-options
          />

          <div class="row justify-end q-mt-md">
            <q-btn unelevated label="Submit" color="purple-9" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AddLeadSourceVasDevice",
  props: ["propShowAddLeadSOurceVasDevice"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddLeadSOurceVasDevice,
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
    this.ajaxLoadData();
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
    ...mapActions("leadSourceVasDeviceConfig", ["CREATE_LS_VAS_DEVICE_CONFIG"]),

    async ajaxLoadData() {
      this.$q.loading.show();
      try {
        await Promise.all([
          this.LEAD_SOURCE_ACTIVE_LIST(),
          this.FETCH_DEVICES_DATA(),
          this.GET_ALL_VAS_DETAILS()
        ]);

        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          label: item.sourceName, value: item
        }));
        this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
          label: item.deviceName, value: item
        }));
        this.dropDown.vasOptions = this.getAllVasDetails.map(item => ({
          label: item.name, value: item
        }));
      } catch (e) {
        console.error(e);
      } finally {
        this.$q.loading.hide();
      }
    },

    async fnsubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "negative", message: "Please fill all mandatory fields" });
        return;
      }

      this.$q.loading.show({ message: "Validating..." });
      this.CREATE_LS_VAS_DEVICE_CONFIG(this.formData)
        .then(() => {
          this.$q.notify({ color: "positive", message: "Successfully Created" });
          this.$emit("emitAddLeadSOurceVasDevice");
        })
        .catch(error => {
          this.$q.notify({
            color: "amber-9",
            message: error.body?.message || "Please Try Again Later !"
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
};
</script>
