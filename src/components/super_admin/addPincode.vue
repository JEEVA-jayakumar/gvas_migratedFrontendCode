<template>
  <div>
    <q-dialog
      minimized
      no-backdrop-dismiss
      class="customModalOverlay"
      v-model="toggleModel"
      @hide="emitfnshowAddPincode()"
    >
      <q-card style="padding:30px;min-width: 40vw">
        <form>
            <div class="column">
            <div class="col-md-12">
                <div class="text-subtitle1 text-weight-regular">Add Pincode</div>
            </div>
            <div class="col-md-12 q-mt-md">
                <q-input
                @keyup.enter="submitPincode(formData)"
                v-model="formData.pincode"
                :error="v$.formData.pincode.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Pincode*"
                placeholder="Pincode*"
                />
            </div>
            <div class="col-md-12 q-mt-md">
                <q-input
                @keyup.enter="submitPincode(formData)"
                v-model="formData.stateName"
                :error="v$.formData.stateName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="State name"
                placeholder="State name"
                />
            </div>
            <div class="col-md-12 q-mt-md">
                <q-input
                @keyup.enter="submitPincode(formData)"
                v-model="formData.cityName"
                :error="v$.formData.cityName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="City name"
                placeholder="City name"
                />
            </div>

            <div class="col-md-12 q-mt-lg" align="right">
                <q-btn
                flat
                class="bg-white text-weight-regular text-grey-8"
                @click="emitfnshowAddPincode()"
                label="Cancel"
                />
                <q-btn @click="submitPincode(formData)" color="purple-9" label="Save" />
            </div>
            </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, minLength } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propShowCreatePincodes"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowCreatePincodes,
      formData: {
        pincode: "",
        stateName: "",
        cityName: ""
      }
    };
  },
  validations() {
    return {
      formData: {
        pincode: {
          required,
          maxLength: maxLength(7),
          minLength: minLength(5)
        },
        stateName: {
          required
        },
        cityName: {
          required
        }
      }
    };
  },

  methods: {
    ...mapActions("pincodes", ["FETCH_ALL_PINCODES", "ADD_NEW_PINCODE"]),

    emitfnshowAddPincode() {
      this.$emit("emitfnshowAddPincodes");
    },
    async submitPincode(formData) {
      this.v$.formData.$touch();

      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
        });

        this.ADD_NEW_PINCODE(formData)
          .then(response => {
            this.FETCH_ALL_PINCODES();
            this.$emit("emitfnshowAddPincodes");
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Pincode successfully created!",
              icon: "thumb_up"
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>
