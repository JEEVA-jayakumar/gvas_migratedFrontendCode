<template>
    <div>
        <q-dialog
        v-model="toggleModel"  
        persistent
        @hide="emitfnShowAddNewRegionsGroups" 
        @escape-key="emitfnShowAddNewRegionsGroups"  
        class="customModalOverlay" 
        >
            <q-card style="min-width: 30vw">
            <form> 
                <div class="row q-pa-md items-center border-bottom">
                    <div class="col-md-12">
                        <div class="text-h6 text-weight-regular">Add New Region Group</div>
                    </div>
                </div>
                <div class="row q-pa-md items-center">
                    <div class="col-md-12 full-width">
                        <q-input 
                        v-model="formData.regionName" 
                          :error="v$.formData.regionName.$error"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Region"
                          placeholder="Region" 
                        />
                    </div>
                </div>
                <div class="row q-pa-md items-center justify-end">
                        <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="emitfnShowAddNewRegionsGroups()">Cancel</q-btn>
                        <q-btn @click="fnfinalsubmitAddNewRegionGroup(formData)" color="purple-9">Save</q-btn>
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
    props: ["propShowAddNewRegionsGroups"],
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            toggleModel: this.propShowAddNewRegionsGroups,
            formData: {
                regionName: ""
            }
        };
    },
    validations() {
        return {
            formData: {
                regionName: { required }
            }
        }
    },
    methods: {
        ...mapActions("RegionGroup", ["SUBMIT_REGION_GROUP_DATA"]),

        emitfnShowAddNewRegionsGroups() {
            this.$emit("emitfnShowAddNewRegionsGroups");
        },

        fnfinalsubmitAddNewRegionGroup(formData) {
            this.v$.formData.$touch();
            if (this.v$.formData.$error) {
                this.$q.notify("Please review fields again.");
            } else {
                this.$q.loading.show({ message: "Saving..." });
                let payload = {
                    regionName: formData.regionName,
                    active: true
                };
                this.SUBMIT_REGION_GROUP_DATA(payload).then(response => {
                    this.$q.notify({ color: "positive", message: "Successfully added!" });
                    this.$emit("emitfnForRegionGroupTable");
                    this.emitfnShowAddNewRegionsGroups();
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
