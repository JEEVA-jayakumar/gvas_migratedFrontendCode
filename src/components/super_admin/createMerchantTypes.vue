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
              <div class="text-h6 text-weight-regular">Add Merchant Type</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.merchantTypeName"
                @blur="v$.formData.merchantTypeName.$touch"
                :error="v$.formData.merchantTypeName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Merchant Type"
                placeholder="Merchant Type"
                @keyup.enter="submitMerchantTypeData()"
              />
            </div>
            <div class="col-md-12 full-width q-mt-md">
              <q-input
                v-model="formData.marsAgreementId"
                @blur="v$.formData.marsAgreementId.$touch"
                :error="v$.formData.marsAgreementId.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Mars Agreement Id"
                placeholder="Mars Agreement Id"
                @keyup.enter="submitMerchantTypeData()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="toggleModal()"
            >Cancel</q-btn>
            <q-btn @click="submitMerchantTypeData()" color="purple-9" label="Save" />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { integer, required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  props: ["propShowCreateMerchantTypes"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      propToggleModal: this.propShowCreateMerchantTypes,
      formData: {
        marsAgreementId: 0,
        merchantTypeName: ""
      }
    };
  },
  validations() {
    return {
      formData: {
        marsAgreementId: { required, integer },
        merchantTypeName: { required }
      }
    }
  },
  methods: {
    ...mapActions("merchantTypes", ["ADD_NEW_MERCHANT_TYPE"]),
    toggleModal() {
      this.$emit("emitfnshowMerchantTypes");
    },
    submitMerchantTypeData() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
          this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        this.ADD_NEW_MERCHANT_TYPE(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnshowMerchantTypes", "refresh");
            this.$q.notify({
              color: "positive",
              message: "Merchant type successfully created!",
              icon: "thumb_up"
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>
