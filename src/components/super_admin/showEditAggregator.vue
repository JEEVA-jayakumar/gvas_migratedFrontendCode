<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowEditAggregator"
      @escape-key="emitfnShowEditAggregator"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Modify Aggregators</div>
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
                label="Modify Aggregator Name"
                placeholder="Modify Aggregator Name"
                @keyup.enter="fnfinalsubmitEdittedList()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowEditAggregator()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitEdittedList()"
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
  props: ["propShowEditAggregator", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowEditAggregator,
      formData: {
        name: this.propRowDetails.name,
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
    ...mapActions("superAdminAggregators", ["EDIT_CREATED_AGGREGATORS"]),
    emitfnShowEditAggregator(token) {
      this.$emit("emitfnShowEditAggregator", token);
    },
    fnfinalsubmitEdittedList() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        let param = {
          name: this.formData.name,
          id: this.propRowDetails.id,
        };
        this.EDIT_CREATED_AGGREGATORS(param)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.emitfnShowEditAggregator("refresh");
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
