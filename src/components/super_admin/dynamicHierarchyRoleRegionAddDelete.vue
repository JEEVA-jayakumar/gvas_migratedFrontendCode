<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnToggleModelCancel"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <div class="column q-pa-md">
          <div class="col-md-12 col-sm-12 col-xs-12 q-py-sm border-bottom">
            <span class="text-h6">User Mapping Information</span>
          </div>
          <div class="column q-gutter-md q-mt-md">
            <q-select
              color="grey-9"
              label="Choose a region"
              v-model="userMapping.region.id"
              :options="propGetAllRegionsData"
              emit-value
              map-options
              @blur="v$.userMapping.region.id.$touch"
              :error="v$.userMapping.region.id.$error"
            />
            <q-select
              color="grey-9"
              @update:model-value="fnPopulateRolesByHeirarchy"
              label="Choose a hierarchy"
              v-model="userMapping.hierarchy.id"
              :options="propGetAllHierarchiesData"
              emit-value
              map-options
              @blur="v$.userMapping.hierarchy.id.$touch"
              :error="v$.userMapping.hierarchy.id.$error"
            />
            <q-select
              color="grey-9"
              :readonly="disableRolesSelection"
              :disable="disableRolesSelection"
              @update:model-value="fnPopulateUsersByRole"
              label="Choose a role"
              v-model="userMapping.role.id"
              :options="filterRoles"
              emit-value
              map-options
              @blur="v$.userMapping.role.id.$touch"
              :error="v$.userMapping.role.id.$error"
            />
            <q-select
              color="grey-9"
              :readonly="disablePreceederSelection"
              :disable="disablePreceederSelection"
              label="Choose a predecessor"
              v-model="userMapping.predecessor.id"
              :options="filterUsers"
              emit-value
              map-options
              @blur="v$.userMapping.predecessor.id.$touch"
              :error="v$.userMapping.predecessor.id.$error"
            />
          </div>
          <div class="row q-mt-lg justify-end q-gutter-sm">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8"
              @click="emitfnToggleModelCancel"
              label="Cancel"
            />
            <q-btn color="purple-9" @click="emitfnToggleModel" label="Done" />
          </div>
        </div>
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
  props: [
    "propDynamicHierarchyRoleRegion",
    "propGetAllRegionsData",
    "propGetAllHierarchiesData",
  ],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModelLocal: this.propDynamicHierarchyRoleRegion,
      filterRoles: [],
      filterUsers: [],
      disableRolesSelection: true,
      disablePreceederSelection: true,
      userMapping: {
        hierarchy: { id: "" },
        role: { id: "" },
        region: { id: "" },
        predecessor: { id: "" },
      },
    };
  },
  computed: {
    toggleModel: {
      get() {
        return this.propDynamicHierarchyRoleRegion;
      },
      set(val) {
        if (!val) this.emitfnToggleModelCancel();
      },
    },
    ...mapGetters("SuperAdminUsers", [
      "getAllRolesForUserCreation",
      "getAllUsersForUserCreation",
    ]),
  },
  validations() {
    return {
      userMapping: {
        hierarchy: { id: { required } },
        role: { id: { required } },
        region: { id: { required } },
        predecessor: { id: { required } },
      },
    };
  },
  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ROLES_BASED_ON_HEIRARCHY_ID_FOR_USER_CREATION",
      "FETCH_ALL_USERS_BY_ROLE_FOR_USER_CREATION_DATA",
    ]),
    emitfnToggleModel() {
      this.v$.userMapping.$touch();
      if (this.v$.userMapping.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$emit("emitfnToggleModelWithParams", this.userMapping);
      }
    },
    emitfnToggleModelCancel() {
      this.$emit("emitfnToggleModelCancel");
    },
    fnPopulateRolesByHeirarchy(hierarchyId) {
      this.disablePreceederSelection = true;
      this.disableRolesSelection = true;
      this.userMapping.role.id = "";
      this.userMapping.predecessor.id = "";
      this.$q.loading.show();
      this.FETCH_ROLES_BASED_ON_HEIRARCHY_ID_FOR_USER_CREATION(hierarchyId)
        .then(() => {
          this.filterRoles = this.getAllRolesForUserCreation
            .filter((o) => o.hierarchy.id == hierarchyId)
            .map((o) => ({ label: o.role, value: o.id }));
          this.disableRolesSelection = this.filterRoles.length === 0;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    fnPopulateUsersByRole() {
      this.disablePreceederSelection = true;
      this.userMapping.predecessor.id = "";
      this.$q.loading.show();
      this.FETCH_ALL_USERS_BY_ROLE_FOR_USER_CREATION_DATA(this.userMapping)
        .then(() => {
          this.filterUsers = this.getAllUsersForUserCreation.map((value) => ({
            label: value.user.name,
            value: value.user.id,
          }));
          if (this.filterUsers.length > 0) {
            this.disablePreceederSelection = false;
          } else {
            this.$q.notify({
              color: "primary",
              message: "Invalid selection! Predecessor is mandatory",
              icon: "info",
            });
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
  },
};
</script>
