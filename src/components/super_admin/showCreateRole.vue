<template>
  <div>
    <q-dialog
       class="customModalOverlay"
        v-model="showCreateRoleToggle"  
        persistent
        @hide="emitfnCreaterolePermissions"
        @escape-key="emitfnCreaterolePermissions"
      >
        <q-card style="min-width: 40vw">
        <form> 
          <div class="q-px-md">
              <div class="q-pa-sm">
                <div class="row q-col-gutter-sm q-py-sm items-center bottom-border">
                  <div class="col-md-8">
                    <div class="text-h6 text-weight-regular">Create Role/Permissions</div>
                  </div>
                  <div class="col-md-2">
                    <q-btn flat size="md" align="right" class="bg-white text-weight-regular text-grey-8" @click="emitfnCreaterolePermissions">Cancel
                    </q-btn>
                  </div>
                  <div class="col-md-2">
                    <q-btn size="md" align="right" type="button" @click="fnCreateRoleSubmit(formData.rolePermissions)" color="purple-9">Save
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>

          <div class="q-px-md">
            <div class="q-pa-sm">
              <div class="column gutter-sm q-py-sm items-center">
                <div class="col-md-8 full-width">
                  <q-select
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
            </div>  

            <div class="q-pa-sm">
              <div class="column gutter-sm q-py-sm items-center">
                <div class="col-md-8 full-width">
                  <q-input
                    v-model.trim="formData.rolePermissions.role"
                    @blur="v$.formData.rolePermissions.role.$touch"
                    :error="v$.formData.rolePermissions.role.$error"
                    label="Role"
                    placeholder="Role"
                    class="text-weight-regular text-grey-8" color="grey-9"
                  />
                </div>
              </div>
            </div>  

             <div class="q-pa-md">
                <div class="row gutter-sm q-py-md items-center">
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
          </div>

        </form>
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
    "propShowCreateRole",
    "propGetAllHierarchiesData",
    "propGetAllPermissionData"
  ],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      showCreateRoleToggle: this.propShowCreateRole,
      formData: {
        rolePermissions: {
          hierarchyId: "",
          role: "",
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

  methods: {
    ...mapActions("SuperAdminUsers", ["FEED_ROLE_DATA"]),

    emitfnCreaterolePermissions() {
      this.$emit("emitfnCreaterolePermissions");
    },

    fnCreateRoleSubmit(rolePermissions) {
      this.v$.formData.rolePermissions.$touch();
      if (this.v$.formData.rolePermissions.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        let arr = [];
        this.formData.rolePermissions.tempPermission.forEach(function(item) {
          arr.push({ permission: item });
        });
        this.formData.rolePermissions.permission = arr;

        let payload = {
            hierarchy: { id: this.formData.rolePermissions.hierarchyId },
            role: this.formData.rolePermissions.role,
            permission: this.formData.rolePermissions.permission,
            active: true
        };

        this.$q.loading.show({ message: "Saving..." });
        this.FEED_ROLE_DATA(payload)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully created!",
              icon: "thumb_up"
            });
            this.emitfnCreaterolePermissions();
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
