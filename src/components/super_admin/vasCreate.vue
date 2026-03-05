<template>
    <div>
      <q-dialog
        :model-value="propToggleModal"
        @update:model-value="toggleModal"
        @hide="toggleModal"
        @escape-key="toggleModal"
        class="customModalOverlay"
        persistent
      >
        <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add New VAS</div>
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
                label="Enter VAS"
                placeholder="Enter VAS"
                @keyup.enter="submitLeadSourceData(formData)"
              />
            </div>
            <div class="col-md-12 full-width">
            <q-input
              v-model="formData.vasCode"
              @blur="v$.formData.vasCode.$touch"
              :error="v$.formData.vasCode.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Enter VAS Code"
              placeholder="Enter VAS Code"
              @keyup.enter="submitLeadSourceData(formData)"
            />
          </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
                <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="toggleModal">Cancel</q-btn>
                <q-btn color="purple-9" label="Save" @click="submitLeadSourceData(formData)" />
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
  props: ["propToggleModal"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        name: "",
        vasCode: ""
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
    ...mapActions("SA_Devices", ["SUBMIT_VAS_DATA"]),
    toggleModal() {
      this.$emit("emitToggleModal");
    },
    submitLeadSourceData(formData) {
        this.v$.formData.$touch();
        if(this.v$.formData.$error) {
            this.$q.notify("Please review fields again.");
        } else {
            this.$q.loading.show({ message: "Saving..." });
            this.SUBMIT_VAS_DATA({ vasName: formData.name, vasCode: formData.vasCode, active: true }).then(response => {
                this.$q.notify({ color: "positive", message: response.data.message });
                this.toggleModal();
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
