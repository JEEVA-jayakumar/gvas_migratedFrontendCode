<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" @update:model-value="changeTabs">
        <q-tab name="tab-1" label="Active Users" />
        <q-tab name="tab-2" label="De-activated Users" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated keep-alive>
        <q-tab-panel name="tab-1" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="getAllUsers"
            :columns="columns"
            table-class="customSATableClass"
            :filter="filterSearch"
            selection="multiple"
            v-model:selected="formData.selectedUsersToDelete"
            v-model:pagination="paginationControl"
            :loading="tableAjaxLoading"
            :filter-method="myCustomSearchFilter"
            row-key="userId"
            color="grey-9"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="fnShowEditUser(props.row.userId)"
                  :label="props.row.user.name"
                  class="capitalize"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-role="props">
              <q-td :props="props">
                <div class="row no-wrap group" v-for="role in props.row.roles" :key="role.role">
                  <q-chip color="light" class="text-dark">
                    <span>{{ role.hierarchy.hierarchyCode }}</span>
                    | {{ role.role }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <!--START: table filter,search -->
              <div class="col-12 group q-mb-md">
                <div class="row q-col-gutter-md">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Name, Merchant Name, Lead ID"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-3"></div>
                  <div class="col-md-3">
                    <q-select
                      clearable
                      v-model="filter_values"
                      color="grey-9"
                      placeholder="Select"
                      label="Filter By"
                      @clear="ajaxLoadDataForAllUsersList"
                      @update:model-value="ajaxLoadDataForRoleIdFilter"
                      :options="getAllRoles"
                    />
                  </div>
                </div>
              </div>
              <!--END: table filter,search -->
              <!--START: Tabs -->
              <div class="col-12">
                <div class="row justify-between items-center">
                  <div class="col">
                    <q-btn
                      v-for="(tab, index) in customizedHirarchyFilter"
                      :key="index"
                      class="text-black q-ma-xs"
                      size="sm"
                      :class="[
                        activeItemId === index
                          ? 'customTabActive text-light'
                          : 'bg-blue-grey-2'
                      ]"
                      @click="ajaxLoadDataForHeirarchyIdFilter(index, tab)"
                      rounded
                      :label="tab.label"
                    />
                  </div>
                  <div class="col-auto" align="right">
                    <div class="row justify-evenly items-center">
                      <div class="col-auto q-px-xs">
                        <q-btn
                          :disabled="formData.selectedUsersToDelete.length == 0"
                          flat
                          color="white"
                          class="text-grey-9"
                          @click="activate_deactivate_users(formData.selectedUsersToDelete)"
                          icon="far fa-trash-alt"
                        />
                      </div>
                      <div class="col-auto q-px-xs">
                        <downloadExcel :data="getAllUsers" :fields="json_fields" name="UserDetails.xls">
                          <q-btn outline color="grey-9" label="Download as excel" />
                        </downloadExcel>
                      </div>
                      <div class="col-auto q-px-xs">
                        <q-btn
                          no-caps
                          class="text-weight-regular"
                          @click="$router.push('/super/admin/users/add/user')"
                          label="Add User"
                          color="purple-9"
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--END: Tabs -->
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>

        <q-tab-panel name="tab-2" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="getAllUsers"
            :columns="columns"
            table-class="customSATableClass"
            :filter="filterSearch"
            selection="multiple"
            v-model:selected="formData.selectedUsersToDelete"
            v-model:pagination="paginationControl"
            :loading="tableAjaxLoading"
            :filter-method="myCustomSearchFilter"
            row-key="userId"
            color="grey-9"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="fnShowEditUser(props.row.userId)"
                  :label="props.row.user.name"
                  class="capitalize"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-role="props">
              <q-td :props="props">
                <div class="row no-wrap group" v-for="role in props.row.roles" :key="role.role">
                  <q-chip color="light" class="text-dark">
                    <span>{{ role.hierarchy.hierarchyCode }}</span>
                    | {{ role.role }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <!--START: table filter,search -->
              <div class="col-12 group">
                <div class="row items-center q-col-gutter-md">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Name, Merchant Name, Lead ID"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6" align="right">
                    <q-btn
                      :disabled="formData.selectedUsersToDelete.length == 0"
                      flat
                      color="white"
                      class="text-grey-9 q-mr-md"
                      size="md"
                      @click="activate_deactivate_users(formData.selectedUsersToDelete)"
                      icon="far fa-trash-alt"
                    />
                  </div>
                </div>
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tab-panels>

      <deleteUsersDetails
        v-if="showDeleteUserDetails"
        :propDeteledUsers="deteledUsers"
        :propToggleModal="showDeleteUserDetails"
        @emitToggleDeleteUsersModal="toggleDeleteUsersModal"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import downloadExcel from "vue-json-excel";
import deleteUsersDetails from "../../components/super_admin/deleteUsersDetails.vue";

export default {
  name: "users",
  components: {
    deleteUsersDetails,
    downloadExcel
  },
  data() {
    return {
      customizedHirarchyFilter: [],
      json_fields: {
        Name: "user.name",
        EmployeeID: "user.employeeID",
        ContactNo: "user.contactNumber",
        EmailID: "user.email",
        Role: {
          field: 'roles',
          callback: (value) => {
            let role = "";
            if (value.length > 0) {
              value.map(v => {
                if (role == "")
                  role = v.role;
                else
                  role = role + " | " + v.role;
              })
            }
            return role;
          }
        },
        ReportingTo: {
          field: 'roles',
          callback: (value) => {
            let predecessor = "";
            if (value.length > 0) {
              value.map(v => {
                const predEmail = v.predecessor != null ? v.predecessor.email : "";
                if (predecessor == "")
                  predecessor = predEmail;
                else
                  predecessor = predecessor + " | " + predEmail;
              })
            }
            return predecessor;
          }
        },
        Location: "user.city"
      },
      activeItemId: 0,
      activeTab: "tab-1",
      deteledUsers: [],
      showDeleteUserDetails: false,
      bgColorClass: false,
      propShowAddUser: false,
      propShowEditUser: false,
      filter: "",
      filter_values: "",
      multipleSelect: "",
      filterTabVisiblity: "",
      paginationControl: {
        rowsPerPage: 10,
        page: 1
      },
      formData: {
        selectedUsersToDelete: []
      },
      tableAjaxLoading: false,
      filterSearch: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.user.name,
          sortable: false
        },
        {
          name: "employeeID",
          required: true,
          label: "Employee ID",
          align: "left",
          field: row => row.user.employeeID,
          sortable: true
        },
        {
          name: "contactNumber",
          required: true,
          label: "Contact No",
          align: "left",
          field: row => row.user.contactNumber,
          sortable: false
        },
        {
          name: "email",
          required: true,
          label: "Email ID",
          align: "left",
          field: row => row.user.email,
          sortable: false
        },
        {
          name: "role",
          required: true,
          label: "Role",
          align: "left",
          field: "role",
          sortable: false
        },
        {
          name: "city",
          required: true,
          label: "Location",
          align: "left",
          field: row => row.user.city,
          sortable: false
        }
      ],
      tableData: [],
      filterRoles: [],
      error: true,
      warning: false
    };
  },

  created() {
    this.ajaxLoadDataForAllUsersList();
    this.ajaxLoadDataForRolesFilter();
    this.ajaxLoadDataForHeirarchyFilter();
    this.ajaxLoadDataForRegionsFilter();
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllUsers",
      "getAllRoles",
      "getAllRegionsData",
      "getAllHierarchiesData",
      "getAllUserByUserIdData",
      "getAllStatesData"
    ])
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_USERS_DATA",
      "FETCH_ALL_STATES_DATA",
      "FETCH_ALL_ROLES_DATA",
      "FETCH_ALL_USERS_BY_ROLE_DATA",
      "FETCH_ALL_HIERARCHIES_DATA",
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_ALL_USERS_BY_HIERARCHY_DATA",
      "FETCH_ALL_USERS_BY_USER_ID_DATA",
      "DELETE_SELECTED_USERS",
      "ACTIVATE_SELECTED_USERS"
    ]),

    changeTabs(tab) {
      this.ajaxLoadDataForAllUsersList();
    },

    activate_deactivate_users(selectedUsersToDelete) {
      if (selectedUsersToDelete.length < 1) {
        this.$q.notify({
          color: "warning",
          position: "bottom",
          message: "You must select atleast one item to proceed!",
          icon: "warning"
        });
      } else {
        this.$q.dialog({
          title: "Confirm",
          message:
            this.activeTab == "tab-2"
              ? "Are you sure want to activate users?"
              : "Are you sure want to delete users?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({
            delay: 100,
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });

          let usersSelectSync = selectedUsersToDelete.map(value => value.userId);

          if (this.activeTab == "tab-2") {
            this.ACTIVATE_SELECTED_USERS(usersSelectSync)
              .then(() => {
                this.FETCH_ALL_USERS_DATA(this.$INACTIVE_FLAG_FOR_LIST);
                this.formData.selectedUsersToDelete = [];
                this.$q.loading.hide();
                this.$q.notify({
                  color: "positive",
                  position: "bottom",
                  message: "Successfully Activated!",
                  icon: "thumb_up"
                });
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
          } else {
            this.DELETE_SELECTED_USERS(usersSelectSync)
              .then(response => {
                this.formData.selectedUsersToDelete = [];
                this.$q.loading.hide();
                this.deteledUsers = response.data.data;
                this.toggleDeleteUsersModal();
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
        }).onCancel(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "No changes made!",
            icon: "thumb_down"
          });
        });
      }
    },

    toggleDeleteUsersModal() {
      this.showDeleteUserDetails = !this.showDeleteUserDetails;
    },

    fnShowEditUser(userId) {
      this.$router.push(
        "/super/admin/users/edit/user/" +
        userId +
        "/" +
        this.paginationControl.page +
        "/" +
        this.paginationControl.rowsPerPage
      );
    },

    ajaxLoadDataForAllUsersList() {
      this.$q.loading.show({
        delay: 100,
        message: "Fetching List ..",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });
      this.formData.selectedUsersToDelete = [];
      this.FETCH_ALL_USERS_DATA(
        this.activeTab == "tab-2" ? this.$INACTIVE_FLAG_FOR_LIST : undefined
      )
        .then(() => {
          this.paginationControl.page =
            this.$route.params.page == undefined ? 1 : parseInt(this.$route.params.page);
          this.paginationControl.rowsPerPage =
            this.$route.params.perPage == undefined
              ? 10
              : parseInt(this.$route.params.perPage);
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    ajaxLoadDataForRolesFilter() {
      this.FETCH_ALL_ROLES_DATA();
    },

    ajaxLoadDataForRoleIdFilter(val) {
      if (val != undefined) {
        this.FETCH_ALL_USERS_BY_ROLE_DATA(val);
      }
    },

    ajaxLoadDataForHeirarchyFilter() {
      this.FETCH_ALL_HIERARCHIES_DATA().then(() => {
        this.customizedHirarchyFilter = [...this.getAllHierarchiesData];
        this.customizedHirarchyFilter.unshift({ value: 0, label: "All" });
      });
    },

    ajaxLoadDataForRegionsFilter() {
      this.FETCH_ALL_REGIONS_DATA();
    },

    ajaxLoadDataForHeirarchyIdFilter(itemIndex, tab) {
      this.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });
      this.activeItemId = itemIndex;
      if (tab.value == 0) {
        this.FETCH_ALL_USERS_DATA().then(() => {
          this.$q.loading.hide();
        });
      } else {
        this.FETCH_ALL_USERS_BY_HIERARCHY_DATA(tab.value).then(() => {
          this.$q.loading.hide();
        });
      }
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(
          col =>
            (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
        )
      );
    }
  }
};
</script>

<style>
.customTabActive {
  background: purple;
  color: #fff;
}
</style>
