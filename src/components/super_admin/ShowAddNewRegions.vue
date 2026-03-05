<template>
    <div>
        <q-dialog
        v-model="toggleModel"  
        persistent
        @hide="emitfnShowAddNewRegions" 
        @escape-key="emitfnShowAddNewRegions"  
        class="customModalOverlay" 
        >
            <q-card style="min-width: 30vw">
            <form> 
                <div class="row q-pa-md items-center border-bottom">
                    <div class="col-md-12">
                        <div class="text-h6 text-weight-regular">Add New Regions</div>
                    </div>
                </div>
                <div class="row q-pa-md items-center">
                     <div class="col-md-12 full-width">
                        <q-select
                          v-model="formData.regionGroup"   
                          :error="v$.formData.regionGroup.$error"
                          :options="regionGroupOptions"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Region Group"
                          placeholder="Region Group" 
                          emit-value
                          map-options
                        />
                    </div>
                    <div class="col-md-12 full-width">
                        <q-input 
                        v-model="formData.regionAreaName" 
                          :error="v$.formData.regionAreaName.$error"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Region"
                          placeholder="Region" 
                        />
                    </div>
                </div>
                <div class="row q-pa-md items-center justify-end">
                        <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="emitfnShowAddNewRegions()">Cancel</q-btn>
                        <q-btn @click="fnfinalsubmitAddNewRegion(formData)" color="purple-9">Save</q-btn>
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
import _ from "lodash";

export default {
    props: ["propShowAddNewRegions"],
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            toggleModel: this.propShowAddNewRegions,
            formData: {
                regionGroup: "",
                regionAreaName: ""
            },
            regionGroupOptions: []
        };
    },
    validations() {
        return {
            formData: {
                regionGroup: { required },
                regionAreaName: { required }
            }
        }
    },
    created() {
        this.ajaxLoadInitialData();
    },
    computed: {
        ...mapGetters("RegionGroup", ["getAllRegionGroupData"])
    },
    methods: {
        ...mapActions("RegionGroup", ["FETCH_REGION_GROUP_DATA"]),
        ...mapActions("Region", ["SUBMIT_REGION_DATA"]),

        ajaxLoadInitialData() {
            this.FETCH_REGION_GROUP_DATA().then(() => {
                this.regionGroupOptions = this.getAllRegionGroupData.map(item => ({ label: item.regionName, value: item.id }));
            });
        },

        emitfnShowAddNewRegions() {
            this.$emit("emitfnShowAddNewRegions");
        },

        fnfinalsubmitAddNewRegion(formData) {
            this.v$.formData.$touch();
            if (this.v$.formData.$error) {
                this.$q.notify("Please review fields again.");
            } else {
                this.$q.loading.show({ message: "Saving..." });
                let payload = {
                    regionGroup: { id: formData.regionGroup },
                    regionName: formData.regionAreaName,
                    active: true
                };
                this.SUBMIT_REGION_DATA(payload).then(response => {
                    this.$q.notify({ color: "positive", message: "Successfully added!" });
                    this.$emit("emitfnForRegionTable");
                    this.emitfnShowAddNewRegions();
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
