<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 30vw; padding: 30px;">
      <form>
        <div class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">Add New Regions</div>
          </div>
        </div>
        <div class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <q-select
              v-model="formData.regionGroup"
              @blur="v$.formData.regionGroup.$touch"
              :error="v$.formData.regionGroup.$error"
              :options="regionGroupOptions"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Region Group"
              placeholder="Region Group"
              emit-value map-options
            />
          </div>
          <div class="col-md-12">
            <q-input
              v-model="formData.regionAreaName"
              @blur="v$.formData.regionAreaName.$touch"
              :error="v$.formData.regionAreaName.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Region"
              placeholder="Region"
            />
          </div>
        </div>
        <div class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12 group" align="right">
            <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="emitfnShowAddNewRegions()">Cancel</q-btn>
            <q-btn @click="fnfinalsubmitAddNewRegion" color="purple-9">Save</q-btn>
          </div>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ShowAddNewRegions",
  props: ["propShowAddNewRegions", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddNewRegions,
      regionGroupOptions:[],
      formData: {
           regionGroup: "",
           regionAreaName: "",
        //   regionAreaName
        // id: this.propRowDetails.value,
        // regionAreaName: this.propRowDetails.label,
        // regionGroup: this.propRowDetails.group,
      },
    };
  },

  validations: {
    formData: {
      regionAreaName: {
        required,
      },
      regionGroup: {
        required,
      },
    },
  },
computed: {
    $v() { return this.v$; },
     ...mapGetters("SuperAdminUsers", ["getAllRegionsData"]),
     ...mapGetters("regionGroupDatas", ["getAllRegionGroupData"])

},
  created() {
    this.fetchAllRegionGroupData();
  },
  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FEED_EXISTING_REGION_DATA",
    ]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_REGIONS_DATA","FEED_REGION_DATA"]),
    ...mapActions("regionGroupDatas", ["FETCH_REGION_GROUP_DATAS"]),
    emitfnShowAddNewRegions() {
      this.$emit("emitfnShowAddNewRegions");
    },
    async fnfinalsubmitAddNewRegion() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show();
        this.FEED_REGION_DATA(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.FETCH_ALL_REGIONS_DATA();
            this.emitfnShowAddNewRegions();
          }).catch(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
    fetchAllRegionGroupData(){
      this.FETCH_REGION_GROUP_DATAS()
      .then((response)=>{
        console.log("response fetchAllRegionGroupData ====>",JSON.stringify(response))
        console.log("fetchAllRegionGroupData ====>",JSON.stringify(this.getAllRegionGroupData))
        return _.map(this.getAllRegionGroupData, item => {
             console.log("DEVICE GETTING API ITEM VALUES OF PLAN--------->"+JSON.stringify(item))
            this.regionGroupOptions.push({
              value: item,
              label: item.regionName
            });
          });
      })
    },
  },
};
</script>
