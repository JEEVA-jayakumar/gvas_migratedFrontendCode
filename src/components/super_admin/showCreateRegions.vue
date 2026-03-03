<template>
    <div>
        <q-dialog
        minimized
        :model-value="propShowCreateRegions"
        @hide="emitfnshowAddRegions"
        persistent
        class="customModalOverlay"
        >
          <q-card style="padding:30px;min-width: 30vw">
            <form>
                <div class="row q-col-gutter-sm q-py-sm items-center">
                    <div class="col-md-12">
                        <div class="text-subtitle1 text-weight-regular">Add Region Info</div>
                    </div>
                </div>
                <div class="row q-col-gutter-sm q-py-sm items-center">
                    <div class="col-md-12">
                        <q-input v-model="formData.regionAreaName"
                            @blur="v$.formData.regionAreaName.$touch"
                            :error="v$.formData.regionAreaName.$error"
                            class="text-weight-regular text-grey-8" color="grey-9" label="Region" placeholder="Region"
                        />
                    </div>
                </div>
                <div class="row q-col-gutter-sm q-py-sm items-center">
                    <div class="col-md-12 group" align="right">
                        <q-btn flat class="bg-white text-weight-regular text-grey-8" @click="emitfnshowAddRegions()" label="Cancel" />
                        <q-btn @click="fnfinalsubmitRegion(formData)" color="purple-9" label="Save" />
                    </div>
                </div>
            </form>
          </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  props: ["propShowCreateRegions"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        regionAreaName: "",
      },
    };
  },

  validations() {
    return {
      formData: {
        regionAreaName: { required },
      },
    };
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FEED_REGION_DATA",
    ]),
    emitfnshowAddRegions() {
      this.$emit("emitfnshowRegions", "emitfnForRegionTable");
    },
    async fnfinalsubmitRegion(formData) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show();
        this.FEED_REGION_DATA(formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully created!",
              icon: "thumb_up",
            });
            this.FETCH_ALL_REGIONS_DATA();
            this.emitfnshowAddRegions();
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.body?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
