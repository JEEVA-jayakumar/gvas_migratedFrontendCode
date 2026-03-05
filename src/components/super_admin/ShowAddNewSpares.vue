<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewSpares"
      @escape-key="emitfnShowAddNewSpares"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add New Spares</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.spareName"
                @blur="v$.formData.spareName.$touch"
                :error="v$.formData.spareName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Enter Spare Parts Name*"
                placeholder="Enter Spare Parts Name*"
                @keyup.enter="fnfinalsubmitAddNewRegion()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewSpares()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddNewRegion()"
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
  props: ["propShowAddNewSpares", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddNewSpares,
      formData: {
        spareName: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        spareName: { required },
      },
    };
  },
  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FEED_EXISTING_REGION_DATA",
    ]),
    emitfnShowAddNewSpares() {
      this.$emit("emitfnShowAddNewSpares");
    },
    fnfinalsubmitAddNewRegion() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        this.FEED_EXISTING_REGION_DATA(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.FETCH_ALL_REGIONS_DATA();
            this.emitfnShowAddNewSpares();
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
