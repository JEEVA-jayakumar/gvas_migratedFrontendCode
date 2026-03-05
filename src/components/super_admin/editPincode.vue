<template>
  <div>
    <q-dialog
      no-backdrop-dismiss
      class="customModalOverlay"
      v-model="toggleModel"
      persistent
      @hide="emitfnshowEditPincode"
    >
      <q-card style="min-width: 30vw">
        <div class="column q-pa-md items-center border-bottom">
          <div class="col-md-12 full-width">
            <div class="text-h6 text-weight-regular">Edit Pincode</div>
          </div>
        </div>
        <div class="q-pa-md">
            <q-input
              v-model="formData.pincode"
              :error="v$.formData.pincode.$error"
              class="text-weight-regular text-grey-8"
              type="number"
              color="grey-9"
              label="Pincode"
              placeholder="Pincode"
            />
            <q-input
              v-model="formData.stateName"
              :error="v$.formData.stateName.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="State name"
              placeholder="State name"
            />
            <q-input
              v-model="formData.cityName"
              :error="v$.formData.cityName.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="City name"
              placeholder="City name"
            />
            <q-select
                v-model="formData.region"
                :options="regionOptions"
                label="Region"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                emit-value
                map-options
            />
        </div>
        <div class="row q-pa-md justify-end">
            <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="emitfnshowEditPincode">Cancel</q-btn>
            <q-btn color="purple-9" label="Save" @click="submitPincode(formData)" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propShowEditPincodes", "propShowPincodeData"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowEditPincodes,
      formData: {
        id: this.propShowPincodeData.id,
        pincode: this.propShowPincodeData.pincode,
        stateName: this.propShowPincodeData.state,
        cityName: this.propShowPincodeData.city,
        region: this.propShowPincodeData.region?.id || ""
      },
      regionOptions: []
    };
  },
  validations() {
      return {
          formData: {
              pincode: { required },
              stateName: { required },
              cityName: { required }
          }
      }
  },
  created() {
      this.ajaxLoadInitialData();
  },
  methods: {
    ...mapActions("Region", ["FETCH_REGIONS_DATA"]),
    ...mapActions("SuperAdminUsers", ["UPDATE_PINCODE_DATA"]),

    ajaxLoadInitialData() {
        this.FETCH_REGIONS_DATA().then(response => {
            this.regionOptions = response.data.map(item => ({ label: item.regionName, value: item.id }));
        });
    },

    emitfnshowEditPincode() {
      this.$emit("emitfnShowEditPincode");
    },

    submitPincode(formData) {
        this.v$.formData.$touch();
        if (this.v$.formData.$error) {
            this.$q.notify("Please review fields again.");
        } else {
            this.$q.loading.show({ message: "Saving..." });
            let payload = {
                id: formData.id,
                pincode: formData.pincode,
                state: formData.stateName,
                city: formData.cityName,
                region: { id: formData.region },
                active: true
            };
            this.UPDATE_PINCODE_DATA(payload).then(response => {
                this.$q.notify({ color: "positive", message: "Successfully updated!" });
                this.emitfnshowEditPincode();
                this.$q.loading.hide();
            }).catch(error => {
                this.$q.notify({ color: "negative", message: error.data?.message || "Error" });
                this.$q.loading.hide();
            });
        }
    }
  }
};
</script>
