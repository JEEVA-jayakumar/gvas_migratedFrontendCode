<template>
  <div>
    <q-tabs
      v-model="selectedTab"
      color="dark"
      class="shadow-1"
      @update:model-value="goToSelectedTab"
    >
      <q-tab color="dark" name="tab-1" label="Approved Pod" />
      <q-tab color="dark" name="tab-2" label="Rejected Pod" />
      <q-tab color="dark" name="tab-3" label=" Allocated Pod" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="tab-1">
        <q-table
          :rows="tableData"
          table-class="customSATableClass"
          :columns="columns"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          row-key="id"
          color="grey-9"
          @request="ajaxLoadAllLeadInfo"
        >
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ props.row.created_date == null ? "NA" : $moment(props.row.created_date).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-updated_date="props">
            <q-td :props="props">
              {{ props.row.updated_date == null ? "NA" : $moment(props.row.updated_date).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <span class="label text-positive" v-if="props.row.status == 1">Created</span>
              <span class="label text-primary" v-else-if="props.row.status == 2">Assigned to R.I</span>
              <span class="label text-orange" v-else-if="props.row.status == 3">Approved By R.I</span>
              <span class="label text-orange" v-else-if="props.row.status == 4">Assigned To SO</span>
              <span class="label text-orange" v-else-if="props.row.status == 5">Approved By So</span>
              <span class="label text-orange" v-else-if="props.row.status == 6">Rejected</span>
              <span class="label text-negative" v-else>NA</span>
            </q-td>
          </template>
          <template v-slot:body-cell-owner="props">
            <q-td :props="props">
              <span class="label text-positive" v-if="props.row.owner == 1">Central Inventory</span>
              <span class="label text-primary" v-else-if="props.row.owner == 2">Regional Inventory</span>
              <span class="label text-primary" v-else-if="props.row.owner == 3">SO</span>
            </q-td>
          </template>
          <template v-slot:body-cell-regionAreaName="props">
            <q-td :props="props">
              {{ props.row.allocate_region == null ? "NA" : props.row.allocate_region.regionAreaName }}
            </q-td>
          </template>
          <template v-slot:top>
            <div class="col-3">
              <q-input clearable color="grey-9" v-model="filterSearch" label="Search By POD Number" placeholder="Type.." class="q-mr-lg" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="tab-2">
        <q-table
          :rows="tableData1"
          table-class="customSATableClass"
          :columns="columns1"
          :filter="filterSearch1"
          v-model:pagination="paginationControl1"
          row-key="id"
          color="grey-9"
          @request="ajaxLoadAllLeadInfo1"
        >
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ props.row.created_date == null ? "NA" : $moment(props.row.created_date).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-updated_date="props">
            <q-td :props="props">
              {{ props.row.updated_date == null ? "NA" : $moment(props.row.updated_date).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <span class="label text-positive" v-if="props.row.status == 1">Created</span>
              <span class="label text-primary" v-else-if="props.row.status == 2">Assigned to R.I</span>
              <span class="label text-orange" v-else-if="props.row.status == 3">Approved By R.I</span>
              <span class="label text-orange" v-else-if="props.row.status == 4">Assigned To SO</span>
              <span class="label text-orange" v-else-if="props.row.status == 5">Approved By So</span>
              <span class="label text-orange" v-else-if="props.row.status == 6">Rejected</span>
              <span class="label text-negative" v-else>NA</span>
            </q-td>
          </template>
          <template v-slot:body-cell-owner="props">
            <q-td :props="props">
              <span class="label text-positive" v-if="props.row.owner == 1">Central Inventory</span>
              <span class="label text-primary" v-else-if="props.row.owner == 2">Regional Inventory</span>
              <span class="label text-primary" v-else-if="props.row.owner == 3">SO</span>
            </q-td>
          </template>
          <template v-slot:body-cell-regionAreaName="props">
            <q-td :props="props">
              {{ props.row.allocate_region == null ? "NA" : props.row.allocate_region.regionAreaName }}
            </q-td>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              {{ props.row.allocate_so == null ? "NA" : props.row.allocate_so.name + " | " + props.row.allocate_so.employeeID }}
            </q-td>
          </template>
          <template v-slot:body-cell-action1="props">
            <q-td :props="props">
              <div class="row no-wrap no-padding">
                <q-btn dense no-caps no-wrap label="Update" icon="far fa-plus-square" size="md" @click="fnUpdateRejectedPodDetails(props.row)" flat class="text-light-blue"></q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:top>
            <div class="col-3">
              <q-input clearable color="grey-9" v-model="filterSearch1" label="Search By POD Number" placeholder="Type.." class="q-mr-lg" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="tab-3">
        <q-table
          :rows="tableData2"
          table-class="customSATableClass"
          :columns="columns2"
          :filter="filterSearch2"
          v-model:pagination="paginationControl2"
          row-key="id"
          color="grey-9"
          @request="ajaxLoadAllLeadInfo2"
        >
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ props.row.created_date == null ? "NA" : $moment(props.row.created_date).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-updated_date="props">
            <q-td :props="props">
              {{ props.row.updated_date == null ? "NA" : $moment(props.row.updated_date).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <span class="label text-positive" v-if="props.row.status == 1">Created</span>
              <span class="label text-primary" v-else-if="props.row.status == 2">Assigned to R.I</span>
              <span class="label text-orange" v-else-if="props.row.status == 3">Approved By R.I</span>
              <span class="label text-orange" v-else-if="props.row.status == 4">Assigned To SO</span>
              <span class="label text-orange" v-else-if="props.row.status == 5">Approved By So</span>
              <span class="label text-orange" v-else-if="props.row.status == 6">Rejected</span>
              <span class="label text-negative" v-else>NA</span>
            </q-td>
          </template>
          <template v-slot:body-cell-owner="props">
            <q-td :props="props">
              <span class="label text-positive" v-if="props.row.owner == 1">Central Inventory</span>
              <span class="label text-primary" v-else-if="props.row.owner == 2">Regional Inventory</span>
              <span class="label text-primary" v-else-if="props.row.owner == 3">SO</span>
            </q-td>
          </template>
          <template v-slot:body-cell-regionAreaName="props">
            <q-td :props="props">
              {{ props.row.allocate_region == null ? "NA" : props.row.allocate_region.regionAreaName }}
            </q-td>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              {{ props.row.allocate_so == null ? "NA" : props.row.allocate_so.name + " | " + props.row.allocate_so.employeeID }}
            </q-td>
          </template>
          <template v-slot:top>
            <div class="col-3">
              <q-input clearable color="grey-9" v-model="filterSearch2" label="Search By POD Number" placeholder="Type.." class="q-mr-lg" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "allocatedSo",
  data() {
    return {
      selectedTab: "tab-1",
      filterSearch: "",
      filterSearch1: "",
      filterSearch2: "",
      paginationControl: { sortBy: "updated_date", descending: false, page: 1, rowsPerPage: 5 },
      paginationControl1: { sortBy: "updated_date", descending: false, page: 1, rowsPerPage: 5 },
      paginationControl2: { sortBy: "updated_date", descending: false, page: 1, rowsPerPage: 5 },
      columns: [
        { name: "pod_number", required: true, label: "Pod Number", align: "left", field: "pod_number", sortable: true },
        { name: "regionAreaName", required: true, label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
        { name: "status", required: true, label: "Status", align: "left", field: "status", sortable: false },
        { name: "owner", required: true, label: "Owner", align: "left", field: "owner", sortable: false },
        { name: "total_count", required: true, label: "Total Count", align: "left", field: "total_count", sortable: false },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "created_date", sortable: false },
        { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      columns1: [
        { name: "pod_number", required: true, label: "Pod Number", align: "left", field: "pod_number", sortable: true },
        { name: "regionAreaName", required: true, label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
        { name: "name", required: true, label: "SO", align: "left", field: row => row.allocate_so ? (row.allocate_so.name + " | " + row.allocate_so.employeeID) : "NA" },
        { name: "status", required: true, label: "Status", align: "left", field: "status", sortable: false },
        { name: "owner", required: true, label: "Owner", align: "left", field: "owner", sortable: false },
        { name: "total_count", required: true, label: "Total Count", align: "left", field: "total_count", sortable: false },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "created_date", sortable: false },
        { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
        { name: "action1", required: true, label: "", align: "left", field: "action1", sortable: false }
      ],
      columns2: [
        { name: "pod_number", required: true, label: "Pod Number", align: "left", field: "pod_number", sortable: true },
        { name: "regionAreaName", required: true, label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
        { name: "name", required: true, label: "SO Name", align: "left", field: row => row.allocate_so?.name || "NA" },
        { name: "status", required: true, label: "Status", align: "left", field: "status", sortable: false },
        { name: "owner", required: true, label: "Owner", align: "left", field: "owner", sortable: false },
        { name: "total_count", required: true, label: "Total Count", align: "left", field: "total_count", sortable: false },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "created_date", sortable: false },
        { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      tableData: [],
      tableData1: [],
      tableData2: []
    };
  },
  computed: {
    ...mapGetters("soPodListDatas", ["getapprovedSoPodListDatas", "getrejectedSoPodListDatas"]),
    ...mapGetters("regionalInventoryDetails", ["getregionalInventoryAllocatedSoPodDetails", "getsinglePodDetails"]),
    ...mapGetters("getInventoryUpdatedPodDetails", ["getInventoryUpdatedPodDetails"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
  },
  methods: {
    ...mapActions("soPodListDatas", ["FETCHING_APPROVED_POD_LIST_DETAILS", "FETCHING_REJECTED_POD_LIST_DETAILS"]),
    ...mapActions("regionalInventoryDetails", ["FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS", "FETCH_SINGLE_POD_DETAILS", "APPROVE_INCOMING_POD_DETAILS"]),
    ...mapActions("getInventoryUpdatedPodDetails", ["FETCH_INVENTORY_UPDATED_POD_DETAILS"]),

    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCHING_APPROVED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getapprovedSoPodListDatas.totalElements;
        this.paginationControl.page = this.getapprovedSoPodListDatas.number + 1;
        this.tableData = this.getapprovedSoPodListDatas.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCHING_REJECTED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getrejectedSoPodListDatas.totalElements;
        this.paginationControl1.page = this.getrejectedSoPodListDatas.number + 1;
        this.tableData1 = this.getrejectedSoPodListDatas.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo2({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS({ pagination, filter }).then(() => {
        this.paginationControl2 = pagination;
        this.paginationControl2.rowsNumber = this.getregionalInventoryAllocatedSoPodDetails.totalElements;
        this.paginationControl2.page = this.getregionalInventoryAllocatedSoPodDetails.number + 1;
        this.tableData2 = this.getregionalInventoryAllocatedSoPodDetails.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    goToSelectedTab(tab) {
      if (tab == "tab-2") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      else if (tab == "tab-3") this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    },
    fnUpdateRejectedPodDetails(reqData) {
      this.$q.dialog({ title: "Confirm", message: "Are you sure want to Update?", ok: "Continue", cancel: "Cancel" }).onOk(() => {
        this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Processing .." });
        this.FETCH_INVENTORY_UPDATED_POD_DETAILS({ podNumber: reqData.pod_number }).then(() => {
          this.$q.loading.hide();
          this.$router.push({ name: "updateRegionalRejectPods", params: { data: this.getInventoryUpdatedPodDetails } });
        });
      });
    }
  }
};
</script>
