<template>
  <q-page>
    <div>
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5,10,15,20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-active="props">
          <q-td :props="props">
            <span v-if="props.row.leadSourceId?.active==true" class="label text-positive">Active</span>
            <span v-else-if="props.row.leadSourceId?.active==false" class="label text-negative">DeActive</span>
            <span v-else>NA</span>
          </q-td>
        </template>
        <template v-slot:body-cell-lock="props">
          <q-td class="group" :props="props">
            <q-btn v-if="props.row.leadSourceId?.active==false" flat color="blue" @click="activateMatmUser(props.row.id)">
              <q-img src="/lock.png" style="height:35px;width:35px" />
            </q-btn>
            <q-btn v-else-if="props.row.leadSourceId?.active==true" flat color="blue" @click="deactivateMatmUser(props.row.id)">
              <q-img src="/unlock.png" style="height:35px;width:35px" />
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-sourceName="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row.leadSourceId?.sourceName)"
          >
            <span class="label text-primary"> {{props.row.leadSourceId?.sourceName}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-deviceName="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row.deviceId?.deviceName)"
          >
            <span class="label text-primary"> {{props.row.deviceId?.deviceName}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-planName="props">
          <q-td :props="props">
            <q-btn
              align=""

              flat
              no-wrap
              no-caps
              icon="fas fa-pencil-alt"
              color="primary"
              @click="editPlanDetails(props.row)"
              :label="props.row.planName"
              class="capitalize"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-delete="props">
          <q-td :props="props">
             <q-btn
              highlight
              push
              class="q-mx-sm"
              color="positive"
              size="sm"
              @click="deletePlanDetails(props.row)"
            >Delete Plan Details</q-btn>
          </q-td>
        </template>

        <template v-slot:top>
          <!--START: table filter,search -->
          <div class="col-md-12 group">
            <div class="row">
              <div class="col-md-6">
                <q-input
                  clearable
                  color="grey-9"
                  v-model.trim="filterSearch"
                  placeholder="Type.."
                  label="Search by Plan Name"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
          <div class="col-md-12" align="right">
                <q-btn no-caps class="text-weight-regular" @click="$router.push('/super/admin/manage/mATMplan')"
                  label="Add M-ATM Plan" color="purple-9" size="md" />
              </div>
        </template>
      </q-table>
      <deleteUsersDetails
        v-if="showDeleteUserDetails"
        :propDeteledUsers="deteledUsers"
        :propToggleModal="showDeleteUserDetails"
        @emitToggleDeleteUsersModal="toggleDeleteUsersModal"
      />
    </div>
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import deleteUsersDetails from "../../components/super_admin/deleteUsersDetails.vue";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "ExistingMATMPlans",
  components: {
    deleteUsersDetails
  },
  data() {
    return {
      customizedHirarchyFilter: [],
      activeItemId: 0,
      activeTab: "tab-1",
      deteledUsers: [],
      getData: [],
      showDeleteUserDetails: false,
      bgColorClass: false,
      propShowAddUser: false,
      propShowEditUser: false,
      toggleAjaxLoadFilter: false,
      filterSearch: "",

      paginationControl: {
        rowsNumber: 5,
        page: 1,
      },

      formData: {
        selectedUsersToDelete: []
      },
      columns: [
        {
          name: "planName",
          required: true,
          label: "Plan Name",
          align: "left",
          field: "planName",
          sortable: false
        },
        {
          name: "sourceName",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => row.leadSourceId?.sourceName,
          sortable: false
        },
        {
          name: "deviceName",
          required: true,
          label: "Device Type",
          align: "left",
          field: row => row.deviceId?.deviceName,
          sortable: false
        },
        {
          name: "active",
          required: true,
          label: "Status",
          align: "left",
        },
        {
          name: 'action',
          required: true,
          label: '',
          align: 'center',
          field: 'action',
          sortable: true
        },
        {
          name: 'lock',
          required: true,
          label: 'UserLock',
          align: 'center',
          field: 'lock',
          sortable: true
        },
        {
          name: 'delete',
          required: true,
          label: '',
          align: 'center',
          field: 'delete',
          sortable: true
        },
      ],
      tableData: [],
    };
  },

  created() {
    this.ajaxLoadInitialData();
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllUsers",
      "getAllRoles",
      "getAllRegionsData",
      "getAllHierarchiesData",
      "getAllUserByUserIdData",
      "getAllStatesData"
    ]),
    ...mapGetters("getMatmDatas", ["getMatmDatas", "getMatmPlanDetails"]),
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_ROLES_DATA",
      "FETCH_ALL_HIERARCHIES_DATA",
      "FETCH_ALL_REGIONS_DATA",
    ]),
    ...mapActions("getMatmDatas", ["FETCH_ALL_MATM_DATAS", "FETCH_ALL_MATM_PLAN_DETAILS"]),
    ...mapActions("deletePlanDetails", ["DELETE_PLAN_DETAILS_DATAS"]),
    ...mapActions("deactiveMatmUser", ["DEACTIVATE_MATM_USER_DETAILS"]),
    ...mapActions("activeMatmUser", ["ACTIVATE_MATM_USER_DETAILS"]),

    ajaxLoadInitialData() {
      this.FETCH_ALL_ROLES_DATA();
      this.FETCH_ALL_HIERARCHIES_DATA().then(response => {
        this.customizedHirarchyFilter = this.getAllHierarchiesData;
        this.customizedHirarchyFilter.unshift({ value: 0, label: "All" });
      });
      this.FETCH_ALL_REGIONS_DATA();
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: ""
      });
    },

    toggleDeleteUsersModal() {
      this.showDeleteUserDetails = !this.showDeleteUserDetails;
    },

    deactivateMatmUser(id) {
      this.$q.dialog({
        title: "Alert",
        message: "Are You Sure want to Deactive the User?",
        ok: "Ok",
        cancel: "Cancel"
      }).onOk(() => {
        this.DEACTIVATE_MATM_USER_DETAILS(id).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Deactive Successfully !",
            icon: "thumb_up"
          });
        });
      });
    },

    activateMatmUser(id) {
      this.$q.dialog({
        title: "Alert",
        message: "Are You Sure want to active the User?",
        ok: "Ok",
        cancel: "Cancel"
      }).onOk(() => {
        this.ACTIVATE_MATM_USER_DETAILS(id).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Active Successfully !",
            icon: "thumb_up"
          });
        });
      });
    },

    deletePlanDetails(reqData) {
      let params = { Id: reqData.id };
      this.DELETE_PLAN_DETAILS_DATAS(params)
        .then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Deleted the Plan",
            icon: "thumb_up"
          });
        }).catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again later!!",
            icon: "thumb_down"
          });
        });
    },

    editPlanDetails(reqData) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to Edit Plans?',
        ok: 'Continue',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Processing ..'
        });

        this.FETCH_ALL_MATM_PLAN_DETAILS(reqData)
          .then(() => {
            this.$q.loading.hide();
            this.$router.push({ name: "editMatmPlans", params: { data: reqData } });
          })
          .catch(() => {
            this.$q.loading.hide();
          });
      });
    },

    ajaxLoadAllLeadInfo(props) {
      const { pagination, filter } = props;
      this.toggleAjaxLoadFilter = true;
      this.FETCH_ALL_MATM_DATAS({ pagination, filter })
        .then(res => {
          this.tableData = this.getMatmDatas;
          this.toggleAjaxLoadFilter = false;
        })
        .catch(() => {
          this.toggleAjaxLoadFilter = false;
        });
    },

    toggleLeadInformation(leadDetails) {
      // Implementation if needed
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    }
  }
};
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}
</style>
