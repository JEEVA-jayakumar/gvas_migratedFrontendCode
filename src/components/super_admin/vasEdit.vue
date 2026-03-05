<template>
    <div>
      <q-dialog
        v-model="propToggleModal"
        @hide="toggleModal"
        @escape-key="toggleModal"
        class="customModalOverlay"
        persistent
      >
        <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Edit VAS</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.name"
                @blur="v$.formData.name.$touch"
                :error="v$.formData.name.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Enter Vas"
                placeholder="Enter VAS"
              />
            </div>
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.vasCode"
                @blur="v$.formData.vasCode.$touch"
                :error="v$.formData.vasCode.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Vas Code"
                placeholder="Vas Code"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
                <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="toggleModal">Cancel</q-btn>
                <q-btn color="purple-9" label="Save" @click="submitUpdatedVas" />
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

export default {
  props: ["propShowEditVas", "propRowDetails"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      propToggleModal: this.propShowEditVas,
      formData: {
        id: this.propRowDetails.id,
        name: this.propRowDetails.name,
        vasCode: this.propRowDetails.vasCode,
        active: this.propRowDetails.active
      }
    };
  },
  validations() {
      return {
          formData: {
              name: { required },
              vasCode: { required }
          }
      }
  },
  methods: {
    ...mapActions("SA_Devices", ["UPDATE_VAS_DATA"]),
    toggleModal() {
      this.$emit("emitToggleModal");
    },
    submitUpdatedVas() {
        this.v$.formData.$touch();
        if (this.v$.formData.$error) {
            this.$q.notify("Please review fields again.");
        } else {
            this.$q.loading.show({ message: "Updating..." });
            this.UPDATE_VAS_DATA({ id: this.formData.id, vasName: this.formData.name, vasCode: this.formData.vasCode, active: this.formData.active }).then(response => {
                this.$q.notify({ color: "positive", message: "VAS successfully updated!" });
                this.$emit("emitToggleModal", "refresh");
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
