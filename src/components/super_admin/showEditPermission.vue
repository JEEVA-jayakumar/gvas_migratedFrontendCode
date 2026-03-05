<template>
  <q-dialog
    v-model="propShowEditPermissionToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 30vw; padding: 30px;">
      <form>
        <div class="row q-pa-md bottom-border">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">Edit Permission</div>
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-md-12">
            <q-input
              @keyup.enter="fnEditPermissionSubmit(formData.permissionDetails)"
              v-model="formData.permissionDetails.permission"
              @blur="v$.formData.permissionDetails.permission.$touch"
              :error="v$.formData.permissionDetails.permission.$error"
              class="text-weight-regular text-grey-8 q-my-sm" color="grey-9" label="Permission" placeholder="Permission" />
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-md-12 text-side">
            <q-btn flat size="md" class="bg-white q-mr-sm text-weight-regular text-grey-8" @click="emitfnEditpermissionDetails(false)">Cancel
            </q-btn>
            <q-btn size="md" @click="fnEditPermissionSubmit(formData.permissionDetails)" color="purple-9">Save
            </q-btn>
          </div>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import {
  required,
} from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "ShowEditPermission",
  props: ["propRowDetails", "propShowEditPermission"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      propShowEditPermissionToggle: this.propShowEditPermission,
      formData: {
        permissionDetails: {
          permission: this.propRowDetails.permission,
          permissionId: this.propRowDetails.id
        }
      }
    };
  },

  validations: {
    formData: {
      permissionDetails: {
        permission: required
      }
    }
  },
  computed: {
    $v() { return this.v$; }
  },
  methods: {
    ...mapActions("SuperAdminUsers", [
      "FEED_EXISTING_PERMISSION_DATA",
      "FETCH_ALL_PERMISSIONS_DATA"
    ]),

    //Emit functions
    emitfnEditpermissionDetails(propShowEditPermissionToggle) {
      this.$emit("emitEditpermissionDetails", propShowEditPermissionToggle);
    },

    //Permission creation final submit
    async fnEditPermissionSubmit(formData) {
      const isValid = await this.v$.$validate();

      if (!isValid) {
        this.$q.notify("Please review fields again.");
      } else {
        console.log("formData >> ", formData);
        this.$q.loading.show({
          delay: 100, // ms
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none"
        });

        this.FEED_EXISTING_PERMISSION_DATA(formData)
          .then(response => {
            this.FETCH_ALL_PERMISSIONS_DATA();
            this.emitfnEditpermissionDetails(this.propShowEditPermissionToggle);
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Updated!",
              icon: "thumb_up"
            });
          }).catch(() => {
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
