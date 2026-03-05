<template>
    <div>
        <q-dialog
        v-model="toggleModel"  
        persistent
        @hide="emitfnshowRegionsGroup" 
        @escape-key="emitfnshowRegionsGroup"  
        class="customModalOverlay" 
        >
            <q-card style="min-width: 30vw">
            <form> 
                <div class="row q-pa-md items-center border-bottom">
                    <div class="col-md-12">
                        <div class="text-h6 text-weight-regular">Modify Region Info</div>
                    </div>
                </div>
                <div class="row q-pa-md items-center">
                    <div class="col-md-12 full-width">
                        <q-input v-model="formData.regionArea" 
                          @blur="v$.formData.regionArea.$touch"
                          :error="v$.formData.regionArea.$error"
                          class="text-weight-regular text-grey-8" 
                          color="grey-9" 
                          label="Region"
                          placeholder="Region" 
                        />
                    </div>
                </div>
                <div class="row q-pa-md items-center justify-end">
                        <q-btn flat class="bg-white text-weight-regular text-grey-8 q-mr-sm" @click="emitfnshowRegionsGroup()">Cancel</q-btn>
                        <q-btn @click="fnfinalsubmitRegionGroup(formData)" color="purple-9">Save</q-btn>
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
    props: ["propShowEditRegionGroup", "propShowRegionGroupData"],
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            toggleModel: this.propShowEditRegionGroup,
            formData: {
                id: this.propShowRegionGroupData.id,
                regionArea: this.propShowRegionGroupData.regionName
            }
        };
    },
    validations() {
        return {
            formData: {
                regionArea: { required }
            }
        }
    },
    methods: {
        ...mapActions("RegionGroup", ["UPDATE_REGION_GROUP_DATA"]),

        emitfnshowRegionsGroup() {
            this.$emit("emitfnshowRegionsGroup");
        },

        fnfinalsubmitRegionGroup(formData) {
            this.v$.formData.$touch();
            if (this.v$.formData.$error) {
                this.$q.notify("Please review fields again.");
            } else {
                this.$q.loading.show({ message: "Saving..." });
                let payload = {
                    id: formData.id,
                    regionName: formData.regionArea,
                    active: true
                };
                this.UPDATE_REGION_GROUP_DATA(payload).then(response => {
                    this.$q.notify({ color: "positive", message: "Successfully updated!" });
                    this.$emit("emitfnForRegionGroupTable");
                    this.emitfnshowRegionsGroup();
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
