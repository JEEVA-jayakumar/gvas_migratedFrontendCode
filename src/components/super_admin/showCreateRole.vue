<template>
  <q-dialog
    v-model="showCreateRoleToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <form>
        <div class="q-px-md">
          <div class="q-pa-sm">
            <div class="row gutter-sm q-py-sm items-center bottom-border">
              <div class="col-md-8">
                <div class="q-title text-weight-regular">Create Role/Permissions</div>
              </div>
              <div class="col-md-2" align="right">
                <q-btn flat size="md" class="bg-white text-weight-regular text-grey-8" @click="emitfnCreaterolePermissions(false)">Cancel
                </q-btn>
              </div>
              <div class="col-md-2" align="right">
                <q-btn size="md" @click="fnCreateRoleSubmit(formData.rolePermissions)" color="purple-9">Save
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <div class="q-px-md">
          <div class="q-pa-sm">
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-8">
                <q-select
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
          </div>

          <div class="q-pa-sm">
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-8">
                 <q-input v-model.trim="formData.rolePermissions.name"
                  @blur="v$.formData.rolePermissions.name.$touch"
                  :error="v$.formData.rolePermissions.name.$error"
                  class="text-weight-regular text-grey-8" color="grey-9" label="Role" placeholder="Role" />
              </div>
            </div>
          </div>

          <div class="q-pa-sm">
            <div class="row gutter-sm q-py-sm items-center">
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
          </div>
        </div>
      </form>
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
  name: "ShowCreateRole",
  props: [
    "propFilterRoles",
    "propFilterRolesPermissions",
    "propGetAllHierarchiesData",
    "proprolePermissions"
  ],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      showCreateRoleToggle: this.proprolePermissions,
      formData: {
        rolePermissions: {
          name: "",
          hierarchyId: "",
          roleColor: "",
        },
      },
    };
  },

  validations: {
    formData: {
      rolePermissions: {
        name: {
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

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FEED_NEW_ROLE_WITH_PERMISSIONS",
      "FETCH_ALL_ROLES_PERMISSIONS_DATA",
    ]),

    //Emit functions
    emitfnCreaterolePermissions(showCreateRoleToggle) {
      this.$emit("emitCreaterolePermissions", showCreateRoleToggle);
    },

    //Role creation final submit
    async fnCreateRoleSubmit(formData) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify("Please review fields again.");
      } else {
        let cookedRole = formData.name.toUpperCase().replace(/ /g, "_");
        this.$q.loading.show({
          delay: 100, // ms
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none",
        });

        formData.role = cookedRole;

        this.FEED_NEW_ROLE_WITH_PERMISSIONS(formData)
          .then(response => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully created!",
              icon: "thumb_up",
            });
            this.emitfnCreaterolePermissions(this.showCreateRoleToggle);
            this.FETCH_ALL_ROLES_PERMISSIONS_DATA();
            this.$q.loading.hide();
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Something went wrong",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
