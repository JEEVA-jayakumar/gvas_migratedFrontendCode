<template>
  <q-page>
    <!-- content -->
    <div>
      <q-tabs v-model="selectedTab" class="shadow-1" active-color="purple-9" indicator-color="purple-9" align="justify" @update:model-value="changeTabs">
        <q-tab name="active" label="Active Roles" />
        <q-tab name="deactive" label="Deactive Roles" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="active" class="no-padding">
           <q-table :rows="activeTableData" table-class="customSATableClass" :columns="columns" :filter="filterSearch" v-model:pagination="paginationControl" :filter-method="myCustomSearchFilter" row-key="id" color="grey-9">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn dense no-caps no-wrap label="Modify Role/Permissions" icon="far fa-plus-square" size="md" @click="fnShowEditRole(props.row)" flat class="text-light-blue">
                  </q-btn>

                  <q-btn dense no-caps no-wrap label="Disable Role" icon="far fa-minus-square" size="md" @click="fnDisableRole(props.row)" flat class="text-negative">
                  </q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:top="props">
              <div class="col-6">
                <q-input
                  clearable
                  dense
                  outlined
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  class="q-mr-lg"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-6" align="right">
                <q-btn
                  no-caps
                  class="text-weight-regular"
                  @click="fnshowAddRole(props.row)"
                  label="Add New Role"
                  color="purple-9"
                  size="md"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="deactive" class="no-padding">
           <q-table :rows="deactivatedTableData" table-class="customSATableClass" :columns="columns1" :filter="filterSearch1" v-model:pagination="paginationControl1" :filter-method="myCustomSearchFilter" row-key="id" color="grey-9">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn dense no-caps no-wrap label="Active" icon="far fa-minus-square" size="md" @click="fnActiveRoles(props.row)" flat class="text-negative">
                  </q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:top="props">
              <div class="col-6">
                <q-input
                  clearable
                  dense
                  outlined
                  color="grey-9"
                  v-model="filterSearch1"
                  placeholder="Type.."
                  class="q-mr-lg"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

       <!--START: Show create role -->
      <showCreateRole 
      v-if="propShowCreateRole" 
      :propGetAllHierarchiesData="getAllHierarchiesData"
      :propShowCreateRole="propShowCreateRole"
      :propGetAllPermissionData="getAllPermissionData"
      @emitfnCreaterolePermissions="fnshowCreateRole"
      ></showCreateRole>
      <!--END: Show create role -->

      <!--START: Show edit role -->
      <showEditRole 
      v-if="propShowEditRole" 
      :propShowEditRole="propShowEditRole"
      :propExistingRoleItems="propRowDetails"
      :propGetAllPermissionData="getAllPermissionData"
      :propGetAllHierarchiesData="getAllHierarchiesData"
      @emitfnEditrolePermissions="fnShowEditRole"
      ></showEditRole>
      <!--END: Show edit role -->

      <showAddRole
        v-if="showAddRole"
        :propShowAddRole="showAddRole"
        @emitfnShowAddRole="fnshowAddRole"
        @emitfnForRoleTable="ajaxLoadDataForRolesPermissions"
      />
    </div>
  </q-page>
</template>

<script>
import showCreateRole from "../../components/super_admin/showCreateRole.vue";
import showEditRole from "../../components/super_admin/ShowEditRole.vue";
import showAddRole from "../../components/super_admin/showAddRole.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "rolesPermissions",
  components: {
    showCreateRole,
    showEditRole,
    showAddRole,
  },
  data() {
    return {
      propGetAllRegionData: [],
      propGetAllHierarchyData: [],
      propShowCreateRole: false,
      propShowEditRole: false,
      propRowDetails: "",
      selectedTab: "active",
      showAddRole: false,
      propShowAddRole: false,

      filterSearch: "",
      filterSearch1: "",

      paginationControl: {
        rowsPerPage: 10,
      },
      paginationControl1:{
        rowsPerPage: 10,
      },

      //table information
      columns: [
        {
          name: "hierarchy",
          required: true,
          label: "Hierarchy",
          align: "left",
          field: row => {
            if (row.hierarchy) {
              return row.hierarchy.hierarchy;
            } else {
              return "NA";
            }
          },
          sortable: false,
        },
        {
          name: "role",
          required: true,
          label: "Role",
          align: "left",
          field: "role",
          sortable: false,
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false,
        },
      ],
      
      columns1: [
        {
          name: "hierarchy",
          required: true,
          label: "Hierarchy",
          align: "left",
          field: row => {
            if (row.hierarchy) {
              return row.hierarchy.hierarchy;
            } else {
              return "NA";
            }
          },
          sortable: false,
        },
        {
          name: "role",
          required: true,
          label: "Role",
          align: "left",
          field: "role",
          sortable: false,
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false,
        },
      ],

      tableData: [], 
      activeTableData: [],
      deactivatedTableData: [],
    };
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllRolesPermissions",
      "getAllFilterRoles",
      "getAllHierarchiesData",
      "getAllPermissionData"
    ]),
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_ROLES_PERMISSIONS_DATA",
      "FETCH_ALL_HIERARCHIES_DATA",
      "DELETE_ROLE_BY_ROLE_ID_DATA",
      "ACTIVATE_ROLE_BY_ROLE_ID_DATA",
      "FETCH_ALL_PERMISSION_DATA"
    ]),

    changeTabs(tab) {
      this.ajaxLoadDataForRolesPermissions();
    },

    fnshowCreateRole() {
      this.propShowCreateRole = !this.propShowCreateRole;
      if (!this.propShowCreateRole) {
          this.ajaxLoadDataForRolesPermissions();
      }
    },

    fnshowAddRole(rowDetails) {
      this.propRowDetails = rowDetails;
      this.showAddRole = !this.showAddRole;
    },

    fnShowEditRole(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditRole = !this.propShowEditRole;
    },

    fnActiveRoles(roleId){
        this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to active role?",
          ok: "Continue",
          cancel: "Cancel",
          persistent: true
        }).onOk(() => {
          let param = {
            id: roleId.id,
            role: roleId.role,
            roleColor:roleId.roleColor,
            hierarchyId: roleId.hierarchy.id,
          };
          this.$q.loading.show({ message: "Activating..." });
          this.ACTIVATE_ROLE_BY_ROLE_ID_DATA(param)
            .then(response => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully Activated!",
                icon: "thumb_up",
              });
              this.ajaxLoadDataForRolesPermissions();
            })
            .catch((error) => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: error.data?.message || "Please Try Again Later !",
                icon: "thumb_down",
              });
            });
        });
    },

    fnDisableRole(roleId) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to delete role?",
          ok: "Continue",
          cancel: "Cancel",
          persistent: true
        }).onOk(() => {
          this.$q.loading.show({ message: "Deleting..." });
          this.DELETE_ROLE_BY_ROLE_ID_DATA(roleId)
            .then(response => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully Deleted!",
                icon: "thumb_up",
              });
              this.ajaxLoadDataForRolesPermissions();
            })
            .catch((error) => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: error.data?.message || "Please Try Again Later !",
                icon: "thumb_down",
              });
            });
        });
    },

    //API for table filter using role permissions
    ajaxLoadDataForRolesPermissions() {
      this.$q.loading.show({
        delay: 100, // ms
        message: "Please Wait",
        spinnerColor: "purple-9",
      });
      this.FETCH_ALL_ROLES_PERMISSIONS_DATA()
        .then(response => {
          this.tableData = this.getAllRolesPermissions;
          this.activeTableData = this.getAllRolesPermissions.filter(service => service.active == true);
          this.deactivatedTableData = this.getAllRolesPermissions.filter(service => service.active == false);
          this.$q.loading.hide();
        })
        .catch((error) => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.data?.message || "Please Try Again Later !",
            icon: "thumb_down",
          });
        });
    },

    ajaxLoadDataForHierarchyData() {
      this.FETCH_ALL_HIERARCHIES_DATA();
      this.FETCH_ALL_PERMISSION_DATA();
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(
          col =>
            (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
        )
      );
    },
  },

  created() {
    this.ajaxLoadDataForRolesPermissions();
    this.ajaxLoadDataForHierarchyData();
  },
};
</script>

<style scoped>
.no-padding {
    padding: 0 !important;
}
</style>
