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
               <span v-if="props.row.leadSourceId.active==true" class="label text-positive">Active</span>
                <span v-else-if="props.row.leadSourceId.active==false" class="label text-negative">DeActive</span>
                <span v-else>NA</span>
          </q-td>
        </template>
        <template v-slot:body-cell-lock="props">
          <q-td class="group" :props="props">
            <q-btn v-if="props.row.leadSourceId.active==false" flat color="blue" @click="activateMatmUser(props.row.id)"><img src="lock.png" style="height:35px;width:35px"></q-btn>
            <q-btn v-else-if="props.row.leadSourceId.active==true" flat color="blue" @click="deactivateMatmUser(props.row.id)"><img src="unlock.png" style="height:35px;width:35px"></q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-sourceName="props">
          <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadSourceId.sourceName)">
            <span class="label text-primary"> {{props.row.leadSourceId.sourceName}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-deviceName="props">
         <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.deviceId.deviceName)">
            <span class="label text-primary"> {{props.row.deviceId.deviceName}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-planName="props">
          <q-td :props="props">
            <q-btn
              align="left"
              dense
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
              unelevated
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
            <div class="row q-col-gutter-sm">
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
          <div class="col-md-12 text-right">
                <q-btn no-caps class="text-weight-regular" @click="$router.push('/super/admin/manage/mATMplan')"
                  label="Add M-ATM Plan" color="purple-9" size="md" />
              </div>
        </template>
      </q-table>
    </div>
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ExistingMATMPlans",
  data() {
    return {
      toggleAjaxLoadFilter: false,
      filterSearch: "",
      tableData: [],
      paginationControl: {
        rowsNumber: 5,
        page: 1,
        rowsPerPage: 10
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
    };
  },

  computed: {
    ...mapGetters("getMatmDatas", ["getMatmDatas"]),
  },

  created() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filterSearch
    });
  },

  methods: {
    ...mapActions("getMatmDatas", ["FETCH_ALL_MATM_DATAS", "FETCH_ALL_MATM_PLAN_DETAILS"]),
    ...mapActions("deletePlanDetails", ["DELETE_PLAN_DETAILS_DATAS"]),
    ...mapActions("deactiveMatmUser", ["DEACTIVATE_MATM_USER_DETAILS"]),
    ...mapActions("activeMatmUser", ["ACTIVATE_MATM_USER_DETAILS"]),

    deactivateMatmUser(id) {
      this.$q.dialog({
          title: "Alert",
          message: "Are You Sure want to Deactive the User?",
          ok: "Ok",
          cancel: "Cancel"
        }).onOk(() => {
          this.DEACTIVATE_MATM_USER_DETAILS(id).then(() => {
            this.FETCH_ALL_MATM_DATAS();
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
            this.FETCH_ALL_MATM_DATAS();
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
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Deleted the Plan",
              icon: "thumb_up"
            });
            this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
          })
          .catch(() => {
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
          this.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Processing ..' });
          this.FETCH_ALL_MATM_PLAN_DETAILS(reqData)
            .then(() => {
              this.$q.loading.hide();
              this.$router.push({ name: "editMatmPlans", params: { id: reqData.id, data: reqData } });
            });
        });
    },

    ajaxLoadAllLeadInfo(props) {
      const pagination = props ? props.pagination : this.paginationControl;
      const filter = props ? props.filter : this.filterSearch;

      this.toggleAjaxLoadFilter = true;
      this.FETCH_ALL_MATM_DATAS({ pagination, filter })
        .then(() => {
          this.tableData = this.getMatmDatas || [];
        })
        .finally(() => {
          this.toggleAjaxLoadFilter = false;
        });
    },

    toggleLeadInformation(leadDetails) {
      // Logic for lead information toggle if needed
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
</style>
