<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewAggregators"
      @escape-key="emitfnShowAddNewAggregators"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add New Aggregators</div>
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
                label="Enter Aggregator *"
                placeholder="Enter Aggregator *"
                @keyup.enter="fnfinalsubmitAddNewAggregators()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewAggregators()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddNewAggregators()"
              color="purple-9"
              label="Save"
            />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  props: ["propShowAddNewAggregators"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddNewAggregators,
      formData: {
        name: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        name: { required },
      },
    };
  },
  methods: {
    ...mapActions("superAdminAggregators", ["CREATE_AGGREGATORS"]),
    emitfnShowAddNewAggregators() {
      this.$emit("emitfnShowAddNewAggregators");
    },
    fnfinalsubmitAddNewAggregators() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        this.CREATE_AGGREGATORS(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully Created!",
              icon: "thumb_up",
            });
            this.emitfnShowAddNewAggregators();
            location.reload();
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
