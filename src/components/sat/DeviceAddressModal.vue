<template>
  <q-dialog
    v-model="toggleModal"
    no-backdrop-dismiss
    no-esc-dismiss
  >
    <q-card style="min-width: 40vw; padding: 20px">
      <div class="q-pa-md">
        <div class="q-title q-mb-md">Update Device Address</div>

        <div class="q-gutter-md">
          <q-input
            @blur="v$.formData.marsDeviceAddress.deviceAddress.$touch"
            :error="v$.formData.marsDeviceAddress.deviceAddress.$error"
            color="grey-9"
            v-model="formData.marsDeviceAddress.deviceAddress"
            label="Address"
            placeholder="Address"
          />

          <q-select
            use-input
            fill-input
            hide-selected
            :error="v$.formData.marsDeviceAddress.pincode.$error"
            color="grey-9"
            v-model="formData.marsDeviceAddress.pincode"
            label="Pincode"
            placeholder="Pincode"
            :options="pincodeOptions"
            @filter="pincodeSearch"
            @update:model-value="pincodeSelected"
          />

          <q-input
            color="grey-9"
            disable
            v-model="formData.marsDeviceAddress.state"
            label="State"
            placeholder="State"
          />

          <q-input
            color="grey-9"
            disable
            v-model="formData.marsDeviceAddress.city"
            label="City"
            placeholder="City"
          />

          <div class="q-gutter-sm">
            <q-radio
              v-if="[0, 1].includes(selectedLeadItems?.length || 0)"
              color="grey-9"
              v-model="formData.action"
              :val="1"
              label="Change in current occurrence only"
            />
            <q-radio
              v-if="(selectedLeadItems?.length || 0) > 1"
              color="grey-9"
              v-model="formData.action"
              :val="2"
              label="Change in all selected occurrences"
            />
            <q-radio
              color="grey-9"
              v-model="formData.action"
              :val="3"
              label="Change in all occurrences of this merchant"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-md q-gutter-sm">
          <q-btn
            @click="closeModal"
            color="grey-6"
            icon="block"
            label="Cancel"
          />
          <q-btn
            @click="UpdateDeviceAddress(formData)"
            color="positive"
            icon="check"
            label="Save"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "DeviceAddressModal",
  props: [
    "showDeviceAddressModal",
    "currentDeviceInfo",
    "stateInformation",
    "paginationControl",
    "selectedLeadItems",
  ],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModal: this.showDeviceAddressModal,
      formData: {
        action: 3,
        id: this.currentDeviceInfo.id,
        marsDeviceAddress: {
          deviceAddress: this.currentDeviceInfo.marsDeviceAddress.deviceAddress,
          latitude: 0,
          longitude: 0,
          pincode: this.currentDeviceInfo.marsDeviceAddress.pincode,
          city: this.currentDeviceInfo.marsDeviceAddress.city,
          state: this.currentDeviceInfo.marsDeviceAddress.state,
        },
      },
      pagination: this.paginationControl,
      pincodeOptions: [],
    };
  },

  validations: {
    formData: {
      marsDeviceAddress: {
        deviceAddress: { required },
        pincode: { required },
        state: { required },
        city: { required },
      },
    },
  },

  computed: {
    ...mapGetters("ImplementationQueue", [
      "getImplementationQueueAssignedList",
      "getImplementationQueueCourierList",
      "getImplementationQueueUnassignedList",
    ]),
  },
  methods: {
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    ...mapActions("SatLeadValidation", ["UPDATE_DEVICE_ADDRESS"]),

    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return arraySet.filter((oo) =>
        oo.label.toLowerCase().includes(terms.toLowerCase())
      );
    },

    pincodeSearch(terms, update) {
      update(() => {
        this.pincodeOptions = this.COMMON_FILTER_FUNCTION(
          this.stateInformation || [],
          terms
        );
      });
    },
    pincodeSelected(item) {
      if (item && item.value) {
        this.formData.marsDeviceAddress.state = item.value.stateName;
        this.formData.marsDeviceAddress.city = item.value.cityName;
        this.formData.marsDeviceAddress.pincode = item.value.pincode;
      }
    },

    closeModal() {
      this.$emit("toggleModal", this.pagination);
    },
    UpdateDeviceAddress(formData) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.TOGGLE_COMMON_LOADER(true);
        this.UPDATE_DEVICE_ADDRESS(formData)
          .then(() => {
            this.TOGGLE_COMMON_LOADER(false);
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Address Updated Successfully",
              icon: "thumb_up",
            });
            this.closeModal();
          })
          .catch((error) => {
            this.TOGGLE_COMMON_LOADER(false);
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message:
                error.data?.message == null
                  ? "Please Try Again Later !"
                  : error.data.message,
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
