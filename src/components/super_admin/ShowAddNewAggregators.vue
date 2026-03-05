<template>
    <div>
        <q-dialog
        minimized
        v-model="toggleModel"  
        @hide="emitfnShowAddNewAggregators" 
        @escape-key="emitfnShowAddNewAggregators"  
        class="customModalOverlay" 
        :content-css="{padding:'30px',minWidth: '30vw'}"
        >
<q-card style="min-width: 350px;">

            <form> 
                <div class="row gutter-sm q-py-sm items-center">
                    <div class="col-md-12">
                        <div class="text-h6 text-weight-regular">Add New Aggregators </div>
                    </div>
                </div>
                <div class="row gutter-sm q-py-sm items-center">
                    <div class="col-md-12">
                        <q-input 
                        v-model="formData.name" 
                          :error="$v.formData.name.$error"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Enter Aggregator *"
                          placeholder="Enter Aggregator *" 
                        />
                    </div>
                </div>
                <div class="row gutter-sm q-py-sm items-center">
                    <div class="col-md-12 group" align="side">
                        <q-btn flat align="side" class="bg-white text-weight-regular text-grey-8" @click="emitfnShowAddNewAggregators()">Cancel</q-btn>
                        <q-btn align="side" @click="fnfinalsubmitAddNewAggregators(formData)" color="purple-9">Save</q-btn>
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
import { mapGetters, mapActions } from "vuex";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  props: ["propShowAddNewAggregators", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowAddNewAggregators,
      formData: {
        name: "",
      },
    };
  },

  validations: {
    formData: {
        name: {
        required,
      },
    },
  },
computed:{
     ...mapGetters("SuperAdminUsers", ["getAllRegionsData"]),
     ...mapGetters("regionGroupDatas", ["getAllRegionGroupData"])

},

  computed: {
    () { return this.v$; }
  },
  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FEED_EXISTING_REGION_DATA",
    ]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_REGIONS_DATA","FEED_REGION_DATA"]),
    ...mapActions("regionGroupDatas", ["FETCH_REGION_GROUP_DATAS", "CREATE_NEW_REGION_GROUP"]),
    ...mapActions("superAdminAggregators", ["CREATE_AGGREGATORS"]),
    emitfnShowAddNewAggregators() {
      this.$emit("emitfnShowAddNewAggregators");
    },
    fnfinalsubmitAddNewAggregators(formData){
console.log("FINAL SUBMITTED VALUES--------->",JSON.stringify(formData))
   this.$v.formData.$touch();
      if (this.$v.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show();
        this.CREATE_AGGREGATORS(formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Created!",
              icon: "thumb_up",
            });
            // this.FETCH_ALL_REGIONS_DATA();
            this.emitfnShowAddNewAggregators();
            location.reload();
          }).catch(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message == null ? "Please Try Again Later !" : error.data?.message,
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
