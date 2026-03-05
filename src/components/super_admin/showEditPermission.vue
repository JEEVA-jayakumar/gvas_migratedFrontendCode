<template>
  <div>
    <q-dialog
      no-backdrop-dismiss
      class="customModalOverlay"
      v-model="propShowEditPermissionToggle"
      persistent
      @hide="emitfnEditpermissionDetails"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md bottom-border">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Edit Permission</div>
            </div>
          </div>
          <div class="q-pa-md">
            <q-input 
              @keyup.enter="fnEditPermissionSubmit(formData.permissionDetails)"
              v-model="formData.permissionDetails.permission"
              :error="v$.formData.permissionDetails.permission.$error"
              class="text-weight-regular text-grey-8 q-my-sm" color="grey-9" label="Permission" placeholder="Permission" />
          </div>
          <div class="row q-pa-md justify-end">
              <q-btn flat class="bg-white q-mr-sm text-weight-regular text-grey-8" @click="emitfnEditpermissionDetails">Cancel
              </q-btn>
              <q-btn @click="fnEditPermissionSubmit(formData.permissionDetails)" color="purple-9">Save
              </q-btn>
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
  props: ["propRowDetails", "propShowEditPermission"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      propShowEditPermissionToggle: this.propShowEditPermission,
      formData: {
        permissionDetails: {
          permission: this.propRowDetails.label,
          permissionId: this.propRowDetails.id
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
    ...mapActions("SuperAdminUsers", ["FEED_UPDATE_PERMISSION_DATA"]),

    emitfnEditpermissionDetails() {
      this.$emit("emitfnEditpermissionDetails");
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

        this.FEED_UPDATE_PERMISSION_DATA({ id: permissionDetails.permissionId, label: permissionDetails.permission })
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up"
            });
            this.emitfnEditpermissionDetails();
            this.$emit("emitfnForPermissionTable");
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
