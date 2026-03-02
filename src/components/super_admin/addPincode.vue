<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 400px; padding: 20px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-purple-9">Add Pincode</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="emitfnshowAddPincode" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="submitPincode" class="q-gutter-md">
          <q-input
            outlined
            dense
            v-model="formData.pincode"
            label="Pincode*"
            :error="v$.formData.pincode.$error"
            color="purple-9"
          />
          <q-input
            outlined
            dense
            v-model="formData.stateName"
            label="State Name*"
            :error="v$.formData.stateName.$error"
            color="purple-9"
          />
          <q-input
            outlined
            dense
            v-model="formData.cityName"
            label="City Name*"
            :error="v$.formData.cityName.$error"
            color="purple-9"
          />

          <div class="row justify-end q-mt-md q-gutter-x-sm">
            <q-btn flat label="Cancel" color="grey-7" @click="emitfnshowAddPincode" />
            <q-btn unelevated label="Save" color="purple-9" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, minLength } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "AddPincode",
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
        pincode: { required, maxLength: maxLength(7), minLength: minLength(5) },
        stateName: { required },
        cityName: { required }
      }
    };
  },
  methods: {
    ...mapActions("pincodes", ["FETCH_ALL_PINCODES", "ADD_NEW_PINCODE"]),

    emitfnshowAddPincode() {
      this.$emit("emitfnshowAddPincodes");
    },

    async submitPincode() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "warning", message: "Please review fields again." });
        return;
      }

      this.$q.loading.show({ message: "Please Wait" });
      this.ADD_NEW_PINCODE(this.formData)
        .then(() => {
          this.FETCH_ALL_PINCODES();
          this.$emit("emitfnshowAddPincodes");
          this.$q.notify({ color: "positive", message: "Pincode successfully created!" });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.body?.message || "Please Try Again Later !"
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
};
</script>
