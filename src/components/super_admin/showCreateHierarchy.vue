<template>
  <q-dialog
    v-model="showCreateHierarchyToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 30vw; padding: 30px;">
      <form>
        <div class="row q-pa-md bottom-border">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">Create Hierarchy</div>
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-md-12">
            <q-input
              v-model="formData.HierarchyDetails.hierarchy"
              @blur="v$.formData.HierarchyDetails.hierarchy.$touch"
              :error="v$.formData.HierarchyDetails.hierarchy.$error"
              class="text-weight-regular text-grey-8 q-my-sm"
              color="grey-9"
              label="Hierarchy"
              placeholder="Hierarchy"
            />
          </div>
          <div class="col-md-12">
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
        </div>
        <div class="row q-pa-md">
          <div class="col-md-12 text-side">
            <q-btn
              flat
              size="md"
              class="bg-white q-mr-sm text-weight-regular text-grey-8"
              @click="closeModal"
            >Cancel</q-btn>
            <q-btn
              size="md"
              @click="fnCreateHierarchySubmit"
              color="purple-9"
            >Save</q-btn>
          </div>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "ShowCreateHierarchy",
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
    };
  },
  computed: {
    $v() { return this.v$; }
  },
  methods: {
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_HIERARCHIES_DATA", "FEED_NEW_HIERARCHY_DATA"]),

    closeModal() {
      this.$emit("emitCreateHierarchyDetails", false);
    },

    async fnCreateHierarchySubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "warning", message: "Please review fields again." });
        return;
      }

      this.$q.loading.show({ message: "Please Wait" });
      this.FEED_NEW_HIERARCHY_DATA(this.formData.HierarchyDetails)
        .then(() => {
          this.FETCH_ALL_HIERARCHIES_DATA();
          this.$emit("emitCreateHierarchyDetails", false);
          this.$q.notify({ color: "positive", message: "Successfully created!", icon: "thumb_up", position: "bottom" });
        }).catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.data?.message || "Please Try Again Later !",
            icon: "thumb_down"
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
};
</script>
