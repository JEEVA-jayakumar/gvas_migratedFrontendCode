<template>
  <div>
    <q-dialog
      no-backdrop-dismiss
      no-esc-dismiss
      v-model="toggleModal1"
      persistent
    >
      <q-card style="min-width: 40vw">
        <div
            class="
            row
            items-center
            q-px-lg q-py-md
            text-weight-regular
            bottom-border
            text-grey-9
            ">
            <div class="col text-h6">Add Role/Permissions</div>
        </div>
        <div class="q-pa-md">
            <div class="column group q-py-sm">
                <div class="col-md-8">
                <q-select
                    v-model="formData.hierarchyId"
                    label="Hierarchy"
                    placeholder="Select Hierarchy"
                    class="text-weight-regular text-grey-8" color="grey-9"
                    :options="getAllHierarchiesData"
                    emit-value
                    map-options
                    />
                </div>
            </div>

            <div class="column group q-py-sm">
                <div class="col-md-8">
                    <q-input v-model="formData.role"
                    @blur="v$.formData.role.$touch"
                    :error="v$.formData.role.$error"
                    class="text-weight-regular text-grey-8"
                    color="grey-9"
                    label="Role"
                    placeholder="Role" />
                </div>
            </div>

            <div class="column group q-py-sm">
                <div class="col-md-8">
                    <q-input
                    v-model="formData.roleColor"
                    label="Role Color"
                    class="text-weight-regular text-grey-8"
                    color="grey-9"
                    >
                    <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                        <q-menu>
                            <q-color v-model="formData.roleColor" />
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
                    <div v-for="propGetAllPermission in getAllPermissionData" :key="propGetAllPermission.value">
                        <q-checkbox
                        v-model="formData.tempPermission"
                        @update:model-value="v$.formData.tempPermission.$touch"
                        :val="propGetAllPermission.label"
                        color="purple-9">
                        <q-chip color="blue-grey-2" class="text-weight-regular text-grey-8">
                            {{propGetAllPermission.label}}
                        </q-chip>
                        </q-checkbox>
                    </div>
                </div>
                 <div class="col-md-12 text-red text-weight-medium text-caption"
                  v-if="v$.formData.tempPermission.$error">*Permission is mandatory</div>
            </div>

            <div class="row justify-end q-mt-md">
                <q-btn flat label="Cancel" @click="emitModalClose" class="q-mr-sm" />
                <q-btn color="purple-9" label="Save" @click="fnfinalsubmit(formData)" />
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
  props: ["propShowAddRole"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModal1: this.propShowAddRole,
      formData: {
        hierarchyId: "",
        role: "",
        roleColor: "#61116a",
        tempPermission: [],
        permission: []
      }
    };
  },

  validations() {
      return {
          formData: {
              role: { required },
              tempPermission: { required, minLength: minLength(1) }
          }
      }
  },

  created() {
      this.FETCH_ALL_HIERARCHIES_DATA();
      this.FETCH_ALL_PERMISSION_DATA();
  },

  computed: {
    ...mapGetters("SuperAdminUsers", ["getAllHierarchiesData", "getAllPermissionData"])
  },

  methods: {
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_HIERARCHIES_DATA", "FETCH_ALL_PERMISSION_DATA", "FEED_ROLE_DATA"]),

    emitModalClose() {
        this.$emit("emitfnShowAddRole");
    },

    fnfinalsubmit(formData) {
        this.v$.formData.$touch();
        if (this.v$.formData.$error) {
            this.$q.notify("Please review fields again.");
        } else {
            let arr = [];
            this.formData.tempPermission.forEach(item => {
                arr.push({ permission: item });
            });
            this.formData.permission = arr;

            let payload = {
                hierarchy: { id: this.formData.hierarchyId },
                role: this.formData.role,
                roleColor: this.formData.roleColor,
                permission: this.formData.permission,
                active: true
            };

            this.$q.loading.show({ message: "Saving..." });
            this.FEED_ROLE_DATA(payload).then(response => {
                this.$q.loading.hide();
                this.$q.notify({ color: "positive", message: "Successfully added!" });
                this.emitModalClose();
                this.$emit("emitfnForRoleTable");
            }).catch(error => {
                this.$q.loading.hide();
                this.$q.notify({ color: "negative", message: error.data?.message || "Error" });
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
