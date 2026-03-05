<template>
  <div>
    <q-dialog
    no-backdrop-dismiss
    class="customModalOverlay"
    :model-value="propShowCreatePermission"
    @hide="emitfnshowAddPermissions"
    @escape-key="emitfnshowAddPermissions"
    persistent
    >
      <q-card style="min-width: 30vw">
      <form> 
        <div class="row q-pa-md bottom-border">
          <div class="col-md-12">
            <div class="text-h6 text-weight-regular">Add Permission</div>
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-md-12">
            <q-input 
            @keyup.enter="fnEditPermissionSubmit(formData.permissionDetails)"
            v-model="formData.permissionDetails.permission" 
            :error="v$.formData.permissionDetails.permission.$error"
            class="text-weight-regular text-grey-8 q-my-sm" color="grey-9" label="Permission" placeholder="Permission" />
          </div>
        </div>
        <div class="row gutter-sm q-pa-md">
          <div class="col-md-12" align="right">
            <q-btn flat size="md" align="right" class="bg-white q-mr-sm text-weight-regular text-grey-8" @click="emitfnshowAddPermissions">Cancel
            </q-btn>
            <q-btn size="md" align="right" @click="fnEditPermissionSubmit(formData.permissionDetails)" color="purple-9">Save
            </q-btn>
          </div>
        </div>
      </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propGetAllPermissionData", "propShowCreatePermission"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        permissionDetails: {
          permission: ""
        }
      }
    };
  },
  validations() {
      return {
          formData: {
              permissionDetails: {
                  permission: { required }
              }
          }
      }
  },
  methods: {
    ...mapActions("SuperAdminUsers", ["FEED_PERMISSION_DATA"]),

    emitfnshowAddPermissions() {
      this.$emit("emitfnshowAddPermissions");
    },

    fnEditPermissionSubmit(permissionDetails) {
      this.v$.formData.permissionDetails.$touch();
      if (this.v$.formData.permissionDetails.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        });

        this.FEED_PERMISSION_DATA({ label: permissionDetails.permission })
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully added!",
              icon: "thumb_up"
            });
            this.emitfnshowAddPermissions();
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
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
