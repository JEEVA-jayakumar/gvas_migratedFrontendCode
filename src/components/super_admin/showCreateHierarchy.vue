<template>
  <div>
    <q-dialog
      v-model="showCreateHierarchyToggle"
      persistent
      class="customModalOverlay"
      @hide="emitfnCreateHierarchyDetails"
    >
      <q-card style="min-width: 30vw">
        <div class="row q-pa-md bottom-border items-center">
          <div class="col">
            <div class="text-h6 text-weight-regular">Create Hierarchy</div>
          </div>
        </div>
        <div class="q-pa-md">
          <q-input
            v-model="formData.HierarchyDetails.hierarchy"
            @blur="v$.formData.HierarchyDetails.hierarchy.$touch"
            :error="v$.formData.HierarchyDetails.hierarchy.$error"
            class="text-weight-regular text-grey-8 q-my-sm"
            color="grey-9"
            label="Hierarchy"
            placeholder="Hierarchy"
          />
          <q-input
            v-model="formData.HierarchyDetails.hierarchyCode"
            @blur="v$.formData.HierarchyDetails.hierarchyCode.$touch"
            :error="v$.formData.HierarchyDetails.hierarchyCode.$error"
            class="text-weight-regular text-grey-8 q-my-sm"
            color="grey-9"
            label="Hierarchy Code"
            placeholder="Hierarchy Code"
          />
        </div>
        <div class="row q-pa-md justify-end">
            <q-btn
              flat
              size="md"
              class="bg-white q-mr-sm text-weight-regular text-grey-8"
              @click="emitfnCreateHierarchyDetails"
            >Cancel</q-btn>
            <q-btn
              size="md"
              @click="fnCreateHierarchySubmit(formData.HierarchyDetails)"
              color="purple-9"
            >Save</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propShowCreateHierarchy"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      showCreateHierarchyToggle: this.propShowCreateHierarchy,
      formData: {
        HierarchyDetails: {
          hierarchy: "",
          hierarchyCode: ""
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
    ...mapActions("SuperAdminUsers", ["SUBMIT_NEW_HIERARCHY"]),

    emitfnCreateHierarchyDetails() {
      this.$emit("emitfnCreateHierarchyDetails");
    },

    fnCreateHierarchySubmit(HierarchyDetails) {
      this.v$.formData.HierarchyDetails.$touch();
      if (this.v$.formData.HierarchyDetails.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        });

        this.SUBMIT_NEW_HIERARCHY(HierarchyDetails)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully added!",
              icon: "thumb_up"
            });
            this.emitfnCreateHierarchyDetails();
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
