<template>
    <div>
        <q-dialog
        v-model="showCreateHierarchyToggle"
        @hide="emitfnCreateHierarchyDetails(showCreateHierarchyToggle)"
        persistent
        class="customModalOverlay"
        >
          <q-card style="padding:30px;min-width: 30vw">
            <form>
                <div class="row q-pa-md bottom-border">
                <div class="col-md-12">
                    <div class="text-subtitle1 text-weight-regular">Create Hierarchy</div>
                </div>
                </div>
                <div class="row q-pa-md">
                <div class="col-md-12">
                    <q-input
                    v-model="formData.hierarchy"
                    @blur="v$.formData.hierarchy.$touch"
                    :error="v$.formData.hierarchy.$error"
                    class="text-weight-regular text-grey-8 q-my-sm"
                    color="grey-9"
                    label="Hierarchy"
                    placeholder="Hierarchy"
                    />
                </div>
                <div class="col-md-12">
                    <q-input
                    v-model="formData.hierarchyCode"
                    @blur="v$.formData.hierarchyCode.$touch"
                    :error="v$.formData.hierarchyCode.$error"
                    class="text-weight-regular text-grey-8 q-my-sm"
                    color="grey-9"
                    label="Hierarchy Code"
                    placeholder="Hierarchy Code"
                    />
                </div>
                </div>
                <div class="row q-col-gutter-sm q-pa-md">
                <div class="col-md-12" align="right">
                    <q-btn
                    flat
                    size="md"
                    class="bg-white q-mr-sm text-weight-regular text-grey-8"
                    @click="emitfnCreateHierarchyDetails(showCreateHierarchyToggle)"
                    label="Cancel"
                    />
                    <q-btn
                    size="md"
                    @click="fnCreateHierarchySubmit(formData)"
                    color="purple-9"
                    label="Save"
                    />
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
  props: ["propGetAllHierarchiesData", "propShowCreateHierarchy"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      showCreateHierarchyToggle: this.propShowCreateHierarchy,
      formData: {
        hierarchy: "",
        hierarchyCode: ""
      }
    };
  },

  validations() {
    return {
      formData: {
        hierarchy: { required },
        hierarchyCode: { required }
      }
    };
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_HIERARCHIES_DATA",
      "FEED_NEW_HIERARCHY_DATA"
    ]),

    emitfnCreateHierarchyDetails(showCreateHierarchyToggle) {
      this.$emit("emitCreateHierarchyDetails", showCreateHierarchyToggle);
    },

    async fnCreateHierarchySubmit(formData) {
      this.v$.formData.$touch();

      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
        });

        this.FEED_NEW_HIERARCHY_DATA(formData)
          .then(response => {
            this.FETCH_ALL_HIERARCHIES_DATA();
            this.emitfnCreateHierarchyDetails(this.showCreateHierarchyToggle);
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully created!",
              icon: "thumb_up"
            });
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.body?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>
