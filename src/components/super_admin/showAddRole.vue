<template>
  <q-dialog
    persistent
    v-model="toggleModal1"
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <div
        class="
          row
          items-center
          q-px-lg q-py-md
          text-weight-regular
          bottom-border
          text-grey-9
        ">
        <div class="col q-title">Add Role/Permissions</div>
      </div>

      <div class="column group q-py-sm">
        <div class="col-md-8">
          <q-select
            v-model="formData.hierarchyId"
            label="Hierarchy"
            placeholder="Select Hierarchy"
            class="text-weight-regular text-grey-8" color="grey-9"
            :options="getAllHierarchiesData"
            emit-value map-options
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
            @blur="v$.formData.roleColor.$touch"
            :error="v$.formData.roleColor.$error"
            label="Choose a role color" color="grey-9"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="formData.roleColor" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="group" align="right">
        <q-btn flat size="md" align="right" class="bg-white text-weight-regular text-grey-8" @click="emitToggleMyAccount()">Cancel
        </q-btn>
        <q-btn size="md" align="right" @click="fnAddRoleSubmit(formData)" color="purple-9">Save
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import { required } from "@vuelidate/validators";

export default {
  name: "ShowAddRole",
  setup() {
    return { v$: useVuelidate() };
  },
  props: ["propsToggleModal1"],
  data() {
    return {
      toggleModal1: this.propsToggleModal1,
      currentPasswordMatched: false,
      formData: {
          roleColor: "",
          role: "",
          hierarchyId: "",
          // roleId: this.propRowDetails.id,
          // role: this.propRowDetails.role,
          // hierarchyId: this.propRowDetails.hierarchy.id,
          // roleColor: this.propRowDetails.roleColor,
      },
      propGetAllHierarchiesData: [],
    };

    
  },
   validations: {
    formData: {
        roleColor: { required },
        role: { required }
    }
  },
   error: {
    formData: {
    
        roleColor: {
          alert: false,
          issue: "",
          value: ""
        },
         role: {
          alert: false,
          issue: "",
          value: ""
        }
    }
    
  },

 
  beforeMount() {
   
  },
  computed: {
     ...mapGetters("SuperAdminUsers", [
      "getAllRolesPermissions",
      "getAllFilterRoles",
      "getAllHierarchiesData",
    ]),
   
    // ...mapGetters("NotificationDatas", ["getnotificationDatas"]),
   
  },

  created() {
     this.ajaxLoadAllLeadInfo();
  },
  methods: {
    // ...mapActions("Authentication", ["CHANGE_PASSWORD"]),
    // ...mapActions("NotificationDatas", ["FETCH_NOTIFICATION_DATAS"]),
    ...mapActions("addRole", ["UPDATE_ROLE_DATA"]),
     ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_ROLES_PERMISSIONS_DATA",
      "FETCH_ALL_HIERARCHIES_DATA",
      "DELETE_ROLE_BY_ROLE_ID_DATA",
    ]),

    emitToggleMyAccount() {
      this.$emit("propsToggleModal1");
    },

    async fnAddRoleSubmit(formData){
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
        this.UPDATE_ROLE_DATA(formData)
          .then(() => {
            console.log("POST store >> AFTER >>");
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up"
            });
            this.$router.push("/super/admin/roles/permissions/");          
          //  this.FETCH_ALL_USERS_DATA();
          //   this.$emit("emitfnShowEditUser", showEditUser);
            this.$emit("propsToggleModal1");
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
    },
    // getNotificationTitle(){
    //  <q-item v-for = "nofication in this.">
    //  </q-item>
    // },
    ajaxLoadAllLeadInfo() {
      this.FETCH_ALL_HIERARCHIES_DATA();
    },
 
  },
};
</script>

<style>
.error1 {
  color: grey;
}
</style>
