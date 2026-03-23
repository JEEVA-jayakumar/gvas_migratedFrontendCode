<template>
  <q-page>
    <div>
      <q-tabs v-model="selectedTab" color="dark" class="shadow-1" @update:model-value="goToSelectedTab">
        <q-tab name="tab-1" label="Approved Pod" />
        <q-tab name="tab-2" label="Rejected Pod" />
        <q-tab name="tab-3" label="Allocated Pod" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="tab-1">
          <q-table :rows="tableData" :columns="columns" :filter="filterSearch" v-model:pagination="paginationControl" row-key="id" @request="ajaxLoadAllLeadInfo">
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">{{ props.row.created_date ? $moment(props.row.created_date).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <span class="label text-positive" v-if="props.row.status == 1">Created</span>
                <span class="label text-primary" v-else-if="props.row.status == 2">Assigned to R.I</span>
                <span class="label text-orange" v-else-if="props.row.status == 3">Approved By R.I</span>
                <span class="label text-orange" v-else-if="props.row.status == 4">Assigned To SO</span>
                <span class="label text-orange" v-else-if="props.row.status == 5">Approved By So</span>
                <span class="label text-orange" v-else-if="props.row.status == 6">Rejected</span>
                <span v-else>NA</span>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2">
          <q-table :rows="tableData1" :columns="columns1" :filter="filterSearch1" v-model:pagination="paginationControl1" row-key="id" @request="ajaxLoadAllLeadInfo1">
            <template v-slot:body-cell-action1="props">
              <q-td :props="props">
                <q-btn dense no-caps label="Update" icon="edit" size="sm" @click="fnUpdateRejectedPodDetails(props.row)" flat class="text-primary" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-3">
          <q-table :rows="tableData2" :columns="columns2" :filter="filterSearch2" v-model:pagination="paginationControl2" row-key="id" @request="ajaxLoadAllLeadInfo2" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PhonepeSparePartsSoPodList",
  data() {
    return {
      selectedTab: "tab-1",
      filterSearch: "",
      filterSearch1: "",
      filterSearch2: "",
      tableData: [],
      tableData1: [],
      tableData2: [],
      paginationControl: { page: 1, rowsPerPage: 5 },
      paginationControl1: { page: 1, rowsPerPage: 5 },
      paginationControl2: { page: 1, rowsPerPage: 5 },
      columns: [
        { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number" },
        { name: "regionAreaName", label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
        { name: "status", label: "Status", align: "left", field: "status" },
        { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
        { name: "createdAt", label: "Created Date", align: "left", field: "created_date" }
      ],
      columns1: [
        { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number" },
        { name: "name", label: "SO", align: "left", field: row => row.allocate_so ? (row.allocate_so.name + " | " + row.allocate_so.employeeID) : "NA" },
        { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
        { name: "action1", label: "Action", align: "left", field: "action1" }
      ],
      columns2: [
        { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number" },
        { name: "name", label: "SO Name", align: "left", field: row => row.allocate_so?.name || "NA" },
        { name: "total_count", label: "Total Count", align: "left", field: "total_count" }
      ]
    };
  },
  computed: {
    ...mapGetters("soPodListDatas", ["getapprovedSoPodListDatas", "getrejectedSoPodListDatas"]),
    ...mapGetters("regionalInventoryDetails", ["getregionalInventoryAllocatedSoPodDetails"]),
    ...mapGetters("getInventoryUpdatedPodDetails", ["getInventoryUpdatedPodDetails"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("soPodListDatas", ["FETCHING_APPROVED_POD_LIST_DETAILS", "FETCHING_REJECTED_POD_LIST_DETAILS"]),
    ...mapActions("regionalInventoryDetails", ["FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS"]),
    ...mapActions("getInventoryUpdatedPodDetails", ["FETCH_INVENTORY_UPDATED_POD_DETAILS"]),

    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.FETCHING_APPROVED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getapprovedSoPodListDatas.totalElements;
        this.tableData = this.getapprovedSoPodListDatas.content;
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.FETCHING_REJECTED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getrejectedSoPodListDatas.totalElements;
        this.tableData1 = this.getrejectedSoPodListDatas.content;
      });
    },
    ajaxLoadAllLeadInfo2({ pagination, filter }) {
      this.FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS({ pagination, filter }).then(() => {
        this.paginationControl2 = pagination;
        this.paginationControl2.rowsNumber = this.getregionalInventoryAllocatedSoPodDetails.totalElements;
        this.tableData2 = this.getregionalInventoryAllocatedSoPodDetails.content;
      });
    },
    goToSelectedTab(tab) {
      if (tab === "tab-1") this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
      else if (tab === "tab-2") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      else if (tab === "tab-3") this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: "" });
    },
    fnUpdateRejectedPodDetails(row) {
      this.FETCH_INVENTORY_UPDATED_POD_DETAILS({ podNumber: row.pod_number }).then(() => {
        this.$router.push({ name: "updateRegionalRejectPods", params: { data: this.getInventoryUpdatedPodDetails } });
      });
    }
  }
};
</script>
