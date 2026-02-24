<template>
    <div>
        <q-dialog
        minimized
        :model-value="propShowCreateRegions"
        @hide="emitfnshowAddRegions" 
        @escape-key="emitfnshowAddRegions"  
        class="customModalOverlay" 
        :content-css="{padding:'30px',minWidth: '30vw'}"
        >
            <q-card class="bg-white border-radius-10" style="min-width: 350px">
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6 text-grey-9 text-weight-bold">Add Region Info</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="emitfnshowAddRegions()" />
              </q-card-section>

              <q-card-section>
                <form @submit.prevent="fnfinalsubmitRegion(formData)">
                  <div class="row q-col-gutter-md">
                    <div class="col-12">
                      <q-input outlined dense v-model="formData.regionAreaName" 
                          @blur="v$.formData.regionAreaName.$touch"
                          :error="v$.formData.regionAreaName.$error"
                          label="Region Name" color="purple-9"
                          class="q-mt-sm"
                      />
                    </div>
                  </div>
                </form>
              </q-card-section>

              <q-card-actions align="right" class="text-purple-9 q-pa-md">
                <q-btn flat label="Cancel" @click="emitfnshowAddRegions()" class="text-grey-7" />
                <q-btn unelevated label="Save Region" color="purple-9" @click="fnfinalsubmitRegion(formData)" class="q-px-lg" />
              </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propShowCreateRegions"],
  data() {
    return {
      model: "",
      formData: {
        regionAreaName: "",
      },
    };
  },

  validations: {
    formData: {
      regionAreaName: {
        required,
      },
    },
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FEED_REGION_DATA",
    ]),
    emitfnshowAddRegions() {
      this.$emit("emitfnshowRegions", "emitfnForRegionTable");
    },
    fnfinalsubmitRegion(formData) {
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
              message: error.body.message == null ? "Please Try Again Later !" : error.body.message,
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
