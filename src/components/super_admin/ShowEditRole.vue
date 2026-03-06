<template>
  <q-dialog
    v-model="showEditRoleToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <div class="column group q-py-sm bottom-border">
        <div>
          <div class="q-title text-weight-regular">Update Role/Permissions</div>
        </div>
      </div>

      <div class="column group q-py-sm">
        <div class="col-md-8">
          <q-select
            disable
            v-model="formData.rolePermissions.hierarchyId"
            @blur="v$.formData.rolePermissions.hierarchyId.$touch"
            :error="v$.formData.rolePermissions.hierarchyId.$error"
            label="Hierarchy"
            placeholder="Select Hierarchy"
            class="text-weight-regular text-grey-8" color="grey-9"
            :options="propGetAllHierarchiesData"
            emit-value map-options
          />
        </div>
      </div>

      <div class="column group q-py-sm">
        <div class="col-md-8">
          <q-input v-model="formData.rolePermissions.role"
            @blur="v$.formData.rolePermissions.role.$touch"
            :error="v$.formData.rolePermissions.role.$error"
            class="text-weight-regular text-grey-8" color="grey-9" label="Role" placeholder="Role" />
        </div>
      </div>

      <div class="column group q-py-sm">
        <div class="col-md-8">
          <q-input
            v-model="formData.rolePermissions.roleColor"
            @blur="v$.formData.rolePermissions.roleColor.$touch"
            :error="v$.formData.rolePermissions.roleColor.$error"
            label="Choose a role color" color="grey-9"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="formData.rolePermissions.roleColor" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="group" align="right">
        <q-btn flat size="md" align="right" class="bg-white text-weight-regular text-grey-8" @click="emitfnEditrolePermissions(false)">Cancel
        </q-btn>
        <q-btn size="md" align="right" @click="fnEditRoleSubmit(formData.rolePermissions)" color="purple-9">Save
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import {
  helpers,
  required,
  minLength,
} from "@vuelidate/validators";
const custom = helpers.regex(/^[a-zA-Z\s]*$/);
import { mapActions } from "vuex";

export default {
  name: "ShowEditRole",
  props: [
    "propGetAllHierarchiesData",
    "proprolePermissions",
    "propRowDetails",
    "propFilterRolesPermissions",
  ],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      showEditRoleToggle: this.proprolePermissions,
      formData: {
        rolePermissions: {
          roleId: this.propRowDetails.id,
          role: this.propRowDetails.role,
          hierarchyId: this.propRowDetails.hierarchy.id,
          roleColor: this.propRowDetails.roleColor,
        },
      },
    };
  },

  validations: {
    formData: {
      rolePermissions: {
        role: {
          custom,
          required,
          minLength: minLength(2),
        },
        hierarchyId: {
          required,
        },
        roleColor: {
          required,
        },
      },
    },
  },
  created() {},
  computed: {
    $v() { return this.v$; }
  },
  methods: {
    ...mapActions("SuperAdminUsers", [
      "FEED_ROLE_ORIGINAL_DATA",
      "FETCH_ALL_ROLES_PERMISSIONS_DATA",
    ]),

    //Emit functions
    emitfnEditrolePermissions(showEditRoleToggle) {
      this.$emit("emitfnEditrolePermissions", showEditRoleToggle);
    },

    //Role creation final submit
    async fnEditRoleSubmit(formData) {
      const isValid = await this.v$.$validate();

      if (!isValid) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100, // ms
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none",
        });
        this.FEED_ROLE_ORIGINAL_DATA(formData)
          .then(response => {
            this.FETCH_ALL_ROLES_PERMISSIONS_DATA();
            this.$q.loading.hide();
            this.emitfnEditrolePermissions(this.showEditRoleToggle);
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
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
  },
};
</script>
