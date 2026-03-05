<template>
  <div>
    <q-dialog
        class="customModalOverlay"
        v-model="showEditRoleToggle"  
        persistent
        @hide="emitfnEditrolePermissions"
        @escape-key="emitfnEditrolePermissions"
      >
        <q-card style="min-width: 40vw">
        <div class="column group q-pa-md bottom-border">
          <div>
            <div class="text-h6 text-weight-regular">Update Role/Permissions</div>
          </div>
        </div>

        <div class="q-pa-md">
            <div class="column group q-py-sm ">
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
                emit-value
                map-options
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
                    label="Choose a role color"
                    class="text-weight-regular text-grey-8"
                    color="grey-9"
                >
                    <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                            <q-menu>
                                <q-color v-model="formData.rolePermissions.roleColor" />
                            </q-menu>
                        </q-icon>
                    </template>
                </q-input>
            </div>
            </div>

            <div class="q-py-md">
                <div class="row gutter-sm items-center">
                    <div class="col-md-12">
                        <div class="text-h6 text-weight-regular">Permission*</div>
                    </div>
                    <div v-for="propGetAllPermission in propGetAllPermissionData" :key="propGetAllPermission.value">
                        <q-checkbox
                        v-model="formData.rolePermissions.tempPermission"
                        @update:model-value="v$.formData.rolePermissions.tempPermission.$touch"
                        :val="propGetAllPermission.label"
                        color="purple-9">
                        <q-chip color="blue-grey-2" class="text-weight-regular text-grey-8">
                            {{propGetAllPermission.label}}
                        </q-chip>
                        </q-checkbox>
                    </div>
                </div>
                 <div class="col-md-12 text-red text-weight-medium text-caption"
                  v-if="v$.formData.rolePermissions.tempPermission.$error">*Permission is mandatory</div>
            </div>

            <div class="row justify-end q-mt-md">
                <q-btn flat label="Cancel" @click="emitfnEditrolePermissions" class="q-mr-sm" />
                <q-btn color="purple-9" label="Save" @click="fnSubmitShowAddUser(formData.rolePermissions)" />
            </div>
        </div>
        </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: [
    "propShowEditRole",
    "propGetAllPermissionData",
    "propGetAllHierarchiesData",
    "propExistingRoleItems"
  ],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      showEditRoleToggle: this.propShowEditRole,
      formData: {
        rolePermissions: {
          hierarchyId: this.propExistingRoleItems.hierarchy.id,
          role: this.propExistingRoleItems.role,
          roleColor: this.propExistingRoleItems.roleColor || "#61116a",
          tempPermission: [],
          permission: []
        }
      }
    };
  },
  validations() {
      return {
          formData: {
              rolePermissions: {
                  hierarchyId: { required },
                  role: { required },
                  tempPermission: { required, minLength: minLength(1) }
              }
          }
      }
  },
  computed: {
    ...mapGetters("SuperAdminUsers", ["getAPIStatusLog"])
  },
  created() {
    this.makeTempPermissionArr();
  },
  methods: {
    ...mapActions("SuperAdminUsers", ["FEED_UPDATE_ROLE_DATA"]),

    emitfnEditrolePermissions() {
      this.$emit("emitfnEditrolePermissions");
    },

    fnSubmitShowAddUser(rolePermissions) {
      this.v$.formData.rolePermissions.$touch();
      if (this.v$.formData.rolePermissions.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        let arr = [];
        this.formData.rolePermissions.tempPermission.forEach(item => {
          arr.push({ permission: item });
        });
        this.formData.rolePermissions.permission = arr;

        let payload = {
            id: this.propExistingRoleItems.id,
            hierarchy: { id: rolePermissions.hierarchyId },
            role: rolePermissions.role,
            roleColor: rolePermissions.roleColor,
            permission: rolePermissions.permission,
            active: true
        };

        this.$q.loading.show({ message: "Saving..." });
        this.FEED_UPDATE_ROLE_DATA(payload)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up"
            });
            this.emitfnEditrolePermissions();
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
    },

    makeTempPermissionArr() {
      this.formData.rolePermissions.tempPermission = this.propExistingRoleItems.permission.map(
        item => item.permission
      );
    }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #dcdcdc;
}
</style>
