<template>
  <q-page>
    <div>
      <!--START: table title -->
      <div
          class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >Bijlipay Changing Management</div>
        <!--END: table title -->
      <q-table
        title="Change Management"
        table-class="customTableClass" 
        class="q-py-none"
        :rows="tableData"
        :columns="columns"
        row-key="id"
        :filter="filter1"
        v-model:pagination="paginationControlchange"
        :rows-per-page-options="[5,10,15]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllCMS"
      >
        <template v-slot:body-cell-updatedAt="props">
          <q-td :props="props">{{ $moment(props.row.leadInformation.updatedAt).format("Do MMM Y") }}</q-td>
        </template>
        <template v-slot:body-cell-Status="props">
          <q-td :props="props">
            <span class="label text-positive" v-if="props.row.leadInformation.cmsLeadStatus == 23">submitted to Mars</span>
            <span class="label text-amber" v-else-if="props.row.leadInformation.cmsLeadStatus == 11">Mars Approved</span>
            <span class="label text-positive" v-else-if="props.row.leadInformation.cmsLeadStatus == 15">NH Approved</span>
            <span class="label text-purple" v-else-if="props.row.leadInformation.cmsLeadStatus == 16">CMS RSM Pending</span>
            <span class="label text-negative" v-else-if="props.row.leadInformation.cmsLeadStatus == 17">CMS RSM Reject</span>
            <span class="label text-negative" v-else-if="props.row.leadInformation.cmsLeadStatus == 25">MARS Reject</span>
            <span class="label text-amber" v-else-if="props.row.leadInformation.cmsLeadStatus == 18">CMS NH Pending</span>
            <span class="label text-negative" v-else-if="props.row.leadInformation.cmsLeadStatus == 19">CMS NH Reject</span>
            <span class="label text-purple" v-else-if="props.row.leadInformation.cmsLeadStatus == 20">CMS Finance Pending</span>
            <span class="label text-negative" v-else-if="props.row.leadInformation.cmsLeadStatus == 21">CMS Finance Rejected</span>
            <span class="label text-positive" v-else-if="props.row.leadInformation.cmsLeadStatus == 22">CMS Finance Approved</span>
            <span class="label text-negative" v-else>Pending</span>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.leadInformation.cmsLeadStatus== 22 || props.row.leadInformation.cmsLeadStatus==15 || props.row.leadInformation.cmsLeadStatus==25 "
              highlight
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data')"
            >Data Entry</q-btn>
            <q-btn
              v-else-if="props.row.leadInformation.cmsLeadStatus== 21"
              highlight
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data/rejectfinance')"
            >Data Entry</q-btn>
            <q-btn
              v-else-if="props.row.leadInformation.cmsLeadStatus== 17"
              highlight
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data/reject')"
            >Data Entry</q-btn>
            <q-btn
              v-else-if="props.row.leadInformation.cmsLeadStatus== 19"
              highlight
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data/rejectrsm')"
            >Data Entry</q-btn>
            <q-btn
              disable
              v-else-if="props.row.leadInformation.cmsLeadStatus== 23"
              highlight
              push
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data')"
            >Submitted To Mars</q-btn>
            <q-btn
              disabled
              v-else
              highlight
              outline
              push
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data')"
            >Data Entry</q-btn>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input
            clearable
            color="grey-9"
            v-model="filter1"
            placeholder="Type.."
            debounce="600"
            class="q-mr-lg q-py-sm"
            label="Search By MID/TID/Merchant Name "
            dense
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">Enter TID/MID for changing merchant data name</div>
      <q-table
        class="q-py-none"
        :rows="tableData1"
        :columns="columns1"
        row-key="id"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5,10,15,20]"
        :loading="toggleAjaxLoadFilter1"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-tid="props">
          <q-td :props="props">{{ props.row.deviceStatus != 6 ? "NA" : props.row.tid }}</q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-btn highlight
            push
            outline
            color="purple-9"
            size="sm"
            @click="$router.push('/sat/change/management/'+ props.row.tid+'/edit/data')"
          >Data Entry</q-btn>
        </template>
        <template v-slot:top-right>
          <q-input
            clearable
            color="grey-9"
            v-model="filter"
            placeholder="Type.."
            debounce="600"
            class="q-mr-lg q-py-sm"
            label="Search By MID/TID/Merchant Name"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "changemanagement",
  data() {
    return {
      filter: "",
      filter1: "",
      toggleAjaxLoadFilter1: false,
      toggleAjaxLoadFilter: false,
      paginationControlchange: { rowsNumber: 5, page: 1, sortBy: "mid", descending: false, rowsPerPage: 5 },
      paginationControl: { rowsNumber: 5, page: 1, sortBy: "mid", descending: false, rowsPerPage: 5 },
      columns: [
        { name: "leadInformation.leadName", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName, sortable: true },
        { name: "Address", required: true, label: "Address", align: "left", field: row => row.leadInformation?.leadAddress, sortable: false },
        { name: "leadInformation.device.deviceName", required: true, label: "Device", align: "left", field: row => row.leadInformation?.device?.deviceName, sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "updatedAt", required: true, label: "Updated Date", align: "left", field: row => row.leadInformation?.updatedAt, sortable: true },
        { name: "Status", required: true, label: "Status", align: "left", field: row => row.leadInformation?.leadStatus, sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false },
      ],
      columns1: [
        { name: "leadInformation.leadName", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "Address", required: true, label: "Address", align: "left", field: row => row.leadInformation?.leadAddress, sortable: true },
        { name: "leadInformation.device.deviceName", required: true, label: "Device", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "action", required: true, label: "Select", align: "center", field: "action", sortable: false },
      ],
      tableData: [],
      tableData1: [],
    };
  },
  computed: {
    ...mapGetters("ChangeManagementList", ["getChangeManagementList"]),
    ...mapGetters("CMSList", ["getCMSList"]),
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
    this.ajaxLoadAllCMS({ pagination: this.paginationControlchange, filter: this.filter1 });
  },
  methods: {
    ...mapActions("ChangeManagementList", ["CHANGE_MANAGEMENT_LIST"]),
    ...mapActions("CMSList", ["CMS_LIST"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.CHANGE_MANAGEMENT_LIST({ pagination, filter }).then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getChangeManagementList.totalElements;
          this.paginationControl.page = this.getChangeManagementList.number + 1;
          this.tableData1 = this.getChangeManagementList.content;
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllCMS({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.CMS_LIST({ pagination, filter }).then(() => {
          this.paginationControlchange = pagination;
          this.paginationControlchange.rowsNumber = this.getCMSList.totalElements;
          this.paginationControlchange.page = this.getCMSList.number + 1;
          this.tableData = this.getCMSList.content;
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
  },
};
</script>
