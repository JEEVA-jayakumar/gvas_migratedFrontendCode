<template>
  <q-dialog
    v-model="showCreateHierarchyToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 400px; padding: 20px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-purple-9">Create Hierarchy</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="closeModal" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="fnCreateHierarchySubmit" class="q-gutter-md">
          <q-input
            outlined
            dense
            v-model="formData.hierarchy"
            label="Hierarchy*"
            :error="v$.formData.hierarchy.$error"
            color="purple-9"
          />
          <q-input
            outlined
            dense
            v-model="formData.hierarchyCode"
            label="Hierarchy Code*"
            :error="v$.formData.hierarchyCode.$error"
            color="purple-9"
          />

          <div class="row justify-end q-mt-md q-gutter-x-sm">
            <q-btn flat label="Cancel" color="grey-7" @click="closeModal" />
            <q-btn unelevated label="Save" color="purple-9" type="submit" />
          </div>
        </q-form>
      </q-card-section>
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
      this.FEED_NEW_HIERARCHY_DATA(this.formData)
        .then(() => {
          this.FETCH_ALL_HIERARCHIES_DATA();
          this.$emit("emitCreateHierarchyDetails", false);
          this.$q.notify({ color: "positive", message: "Successfully created!" });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.body?.message || "Please Try Again Later !"
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
};
</script>
