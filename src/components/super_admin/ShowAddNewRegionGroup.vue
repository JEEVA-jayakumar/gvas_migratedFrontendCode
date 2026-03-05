<template>
    <div>
        <q-dialog
        minimized
        v-model="toggleModel"  
        @hide="emitfnShowAddNewRegionsGroups" 
        @escape-key="emitfnShowAddNewRegionsGroups"  
        class="customModalOverlay" 
        :content-css="{padding:'30px',minWidth: '30vw'}"
        >
<q-card style="min-width: 350px;">

            <form> 
                <div class="row gutter-sm q-py-sm items-center">
                    <div class="col-md-12">
                        <div class="text-h6 text-weight-regular">Add New Region Group</div>
                    </div>
                </div>
                <div class="row gutter-sm q-py-sm items-center">
                     <!-- <div class="col-md-12">
                        <q-select
                          v-model="formData.regionGroup"   
                          :error="$v.formData.regionGroup.$error" 
                        
                          :options="regionGroupOptions"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Region Group"
                          placeholder="Region Group" 
                        />
                    </div> -->
                    <div class="col-md-12">
                        <q-input 
                        v-model="formData.regionName" 
                          :error="$v.formData.regionName.$error"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Region"
                          placeholder="Region" 
                        />
                    </div>
                </div>
                <div class="row gutter-sm q-py-sm items-center">
                    <div class="col-md-12 group" align="side">
                        <q-btn flat align="side" class="bg-white text-weight-regular text-grey-8" @click="emitfnShowAddNewRegionsGroups()">Cancel</q-btn>
                        <q-btn align="side" @click="fnfinalsubmitAddNewRegionGroup(formData)" color="purple-9">Save</q-btn>
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
  setup() { return { v$: useVuelidate() } },
  props: ["propShowAddNewRegionsGroup", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowAddNewRegionsGroup,
    //   regionGroupOptions:[],
      formData: {
        //    regionGroup: "",
           regionName: "",
        //   regionName
        // id: this.propRowDetails.value,
        // regionName: this.propRowDetails.label,
        // regionGroup: this.propRowDetails.group,
      },
    };
  },

  validations: {
    formData: {
      regionName: {
        required,
      },
    //   regionGroup: {
    //     required,
    //   },
    },
  },
computed:{
     ...mapGetters("SuperAdminUsers", ["getAllRegionsData"]),
     ...mapGetters("regionGroupDatas", ["getAllRegionGroupData"])

},
//   created() {
//     this.fetchAllRegionGroupData();
//   },

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
    emitfnShowAddNewRegionsGroups() {
      this.$emit("emitfnShowAddNewRegionsGroups");
    },
    fnfinalsubmitAddNewRegionGroup(formData){
console.log("FINAL SUBMITTED VALUES--------->",JSON.stringify(formData))
   this.$v.formData.$touch();
      if (this.$v.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show();
        this.CREATE_NEW_REGION_GROUP(formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            // this.FETCH_ALL_REGIONS_DATA();
            this.emitfnShowAddNewRegionsGroups();
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
    // fnfinalsubmitAddNewRegion(formData) {
    //   console.log("FINAL SUBMITTED VALUES--------->",JSON.stringify(formData))
    //   this.$v.formData.$touch();
    //   if (this.$v.formData.$error) {
    //     this.$q.notify("Please review fields again.");
    //   } else {
    //     this.$q.loading.show();
    //     this.FEED_REGION_DATA(formData)
    //       .then(() => {
    //         this.$q.loading.hide();
    //         this.$q.notify({
    //           color: "positive",
    //           position: "bottom",
    //           message: "Successfully updated!",
    //           icon: "thumb_up",
    //         });
    //         this.FETCH_ALL_REGIONS_DATA();
    //         this.emitfnShowAddNewRegionsGroups();
    //       })
    //       .onCancel(() => {
    //         this.$q.loading.hide();
    //         this.$q.notify({
    //           color: "negative",
    //           position: "bottom",
    //           message: error.data?.message == null ? "Please Try Again Later !" : error.data?.message,
    //           icon: "thumb_down",
    //         });
    //       });
    //   }
    // },
    // fetchAllRegionGroupData(){
    //   this.FETCH_REGION_GROUP_DATAS()
    //   .then((response)=>{
    //     console.log("response fetchAllRegionGroupData ====>",JSON.stringify(response))
    //     console.log("fetchAllRegionGroupData ====>",JSON.stringify(this.getAllRegionGroupData))
    //     return _.map(this.getAllRegionGroupData, item => {
    //          console.log("DEVICE GETTING API ITEM VALUES OF PLAN--------->"+JSON.stringify(item))
    //         this.regionGroupOptions.push({
    //           value: item,
    //           label: item.regionName
    //         });
    //       });
    //   })
    // },
  },
};
</script>
