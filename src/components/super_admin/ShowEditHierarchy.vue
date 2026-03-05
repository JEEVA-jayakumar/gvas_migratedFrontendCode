<template>
  <div>
    <q-dialog
        class="customModalOverlay"
        v-model="showEditHierarchyToggle"  
        persistent
        @hide="emitfnEditHierarchyDetails"
        @escape-key="emitfnEditHierarchyDetails"
      >
        <q-card style="min-width: 30vw">
        <form> 
            <div class="row q-pa-md bottom-border">
                <div class="col-md-12">
                    <div class="text-h6 text-weight-regular">Edit Hierarchy</div>
                </div>
            </div>
             <div class="row q-pa-md">
                <div class="col-md-12 full-width">
                    <q-input v-model="formData.HierarchyDetails.hierarchy" 
                    @blur="v$.formData.HierarchyDetails.hierarchy.$touch"
                    :error="v$.formData.HierarchyDetails.hierarchy.$error"
                    class="text-weight-regular text-grey-8 q-my-sm" color="grey-9" label="Hierarchy" placeholder="Hierarchy" />
                </div>
                <div class="col-md-12 full-width">
                    <q-input v-model="formData.HierarchyDetails.hierarchyCode" 
                    @blur="v$.formData.HierarchyDetails.hierarchyCode.$touch"
                    :error="v$.formData.HierarchyDetails.hierarchyCode.$error"
                    class="text-weight-regular text-grey-8 q-my-sm" color="grey-9" label="Hierarchy Code" placeholder="Hierarchy Code" />
                </div>
            </div>
             <div class="row q-pa-md justify-end">
                    <q-btn flat size="md" class="bg-white q-mr-sm text-weight-regular text-grey-8" @click="emitfnEditHierarchyDetails">Cancel
                    </q-btn>
                    <q-btn size="md" @click="fnEditHierarchySubmit(formData.HierarchyDetails)" color="purple-9">Save
                    </q-btn>
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

export default {
  props: ["propShowEditHierarchy", "propExistingHierarchyData"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      showEditHierarchyToggle: this.propShowEditHierarchy,
      formData: {
        HierarchyDetails: {
          id: this.propExistingHierarchyData.id,
          hierarchy: this.propExistingHierarchyData.hierarchy,
          hierarchyCode: this.propExistingHierarchyData.hierarchyCode
        }
      }
    };
  },
  validations() {
      return {
          formData: {
              HierarchyDetails: {
                  hierarchy: { required },
                  hierarchyCode: { required }
              }
          }
      }
  },
  methods: {
    ...mapActions("SuperAdminUsers", ["FEED_UPDATE_HIERARCHY_DATA"]),

    emitfnEditHierarchyDetails() {
      this.$emit("emitfnEditHierarchyDetails");
    },

    fnEditHierarchySubmit(HierarchyDetails) {
      this.v$.formData.HierarchyDetails.$touch();
      if (this.v$.formData.HierarchyDetails.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        });

        this.FEED_UPDATE_HIERARCHY_DATA(HierarchyDetails)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up"
            });
            this.emitfnEditHierarchyDetails();
            this.$emit("emitfnForHierarchyTable");
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Error occurred",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #dcdcdc;
}
</style>
