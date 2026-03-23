<template>
    <div class="q-pa-none">
        <div>
            <q-tabs v-model="selectedTab" color="dark" filled class="shadow-1" @update:model-value="goToSelectedTab">
                <q-tab name="tab-1" label="Approved Pod" />
                <q-tab name="tab-2" label="Rejected Pod" />
                <q-tab name="tab-3" label="Allocated Pod" />
            </q-tabs>

            <q-tab-panels v-model="selectedTab" animated>
                <q-tab-panel name="tab-1">
                    <q-table :rows="tableData" table-class="customSATableClass" :columns="columns"
                        :filter="filterSearch" v-model:pagination="paginationControl" row-key="id" color="grey-9"
                        @request="ajaxLoadAllLeadInfo">
                        <template v-slot:body-cell-createdAt="props">
                            <q-td :props="props">
                                {{ props.row.created_date ? $moment(props.row.created_date).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-updated_date="props">
                            <q-td :props="props">
                                {{ props.row.updated_date ? $moment(props.row.updated_date).format("Do MMM Y") : "NA" }}
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
                                {{ props.row.allocate_region?.regionAreaName || "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:top>
                            <div class="col-3">
                                <q-input clearable color="grey-9" v-model="filterSearch" label="Search By POD Number"
                                    placeholder="Type.." class="q-mr-lg" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="tab-2">
                    <q-table :rows="tableData1" table-class="customSATableClass" :columns="columns1"
                        :filter="filterSearch1" v-model:pagination="paginationControl1" row-key="id" color="grey-9"
                        @request="ajaxLoadAllLeadInfo1">
                        <template v-slot:body-cell-createdAt="props">
                            <q-td :props="props">
                                {{ props.row.created_date ? $moment(props.row.created_date).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-updated_date="props">
                            <q-td :props="props">
                                {{ props.row.updated_date ? $moment(props.row.updated_date).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-status="props">
                            <q-td :props="props">
                                <span class="label text-orange" v-if="props.row.status == 6">Rejected</span>
                                <span class="label text-negative" v-else>NA</span>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-name="props">
                            <q-td :props="props">
                                {{ props.row.allocate_so ? props.row.allocate_so.name + " | " + props.row.allocate_so.employeeID : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-action1="props">
                            <q-td :props="props">
                                <q-btn dense no-caps no-wrap label="Update" icon="far fa-plus-square" size="sm"
                                    @click="fnUpdateRejectedPodDetails(props.row)" flat class="text-light-blue"></q-btn>
                            </q-td>
                        </template>
                        <template v-slot:top>
                            <div class="col-3">
                                <q-input clearable color="grey-9" v-model="filterSearch1" label="Search By POD Number"
                                    placeholder="Type.." class="q-mr-lg" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="tab-3">
                    <q-table :rows="tableData2" table-class="customSATableClass" :columns="columns2"
                        :filter="filterSearch2" v-model:pagination="paginationControl2" row-key="id" color="grey-9"
                        @request="ajaxLoadAllLeadInfo2">
                        <template v-slot:body-cell-createdAt="props">
                            <q-td :props="props">
                                {{ props.row.created_date ? $moment(props.row.created_date).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-updated_date="props">
                            <q-td :props="props">
                                {{ props.row.updated_date ? $moment(props.row.updated_date).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-name="props">
                            <q-td :props="props">
                                {{ props.row.allocate_so ? props.row.allocate_so.name + " | " + props.row.allocate_so.employeeID : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:top>
                            <div class="col-3">
                                <q-input clearable color="grey-9" v-model="filterSearch2" label="Search By POD Number"
                                    placeholder="Type.." class="q-mr-lg" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "PhonepeSoPodList",
    data() {
        return {
            selectedTab: "tab-1",
            filterSearch: "",
            filterSearch1: "",
            filterSearch2: "",
            paginationControl: { sortBy: "updated_date", descending: false, page: 1, rowsPerPage: 10 },
            paginationControl1: { sortBy: "updated_date", descending: false, page: 1, rowsPerPage: 10 },
            paginationControl2: { sortBy: "updated_date", descending: false, page: 1, rowsPerPage: 10 },
            columns: [
                { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "regionAreaName", label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
                { name: "status", label: "Status", align: "left", field: "status" },
                { name: "owner", label: "Owner", align: "left", field: "owner" },
                { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
                { name: "createdAt", label: "Created Date", align: "left", field: "created_date" },
                { name: "updated_date", label: "Updated Date", align: "left", field: "updated_date", sortable: true }
            ],
            columns1: [
                { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "name", label: "SO", align: "left", field: row => row.allocate_so?.name },
                { name: "status", label: "Status", align: "left", field: "status" },
                { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
                { name: "createdAt", label: "Created Date", align: "left", field: "created_date" },
                { name: "updated_date", label: "Updated Date", align: "left", field: "updated_date", sortable: true },
                { name: "action1", label: "Action", align: "left" }
            ],
            columns2: [
                { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "name", label: "SO Name", align: "left", field: row => row.allocate_so?.name },
                { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
                { name: "createdAt", label: "Created Date", align: "left", field: "created_date" },
                { name: "updated_date", label: "Updated Date", align: "left", field: "updated_date", sortable: true }
            ],
            tableData: [],
            tableData1: [],
            tableData2: []
        };
    },
    computed: {
        ...mapGetters("soPodListDatas", ["getPhonepeApprovedSoPodListDatas", "getPhoneperejectedSoPodListDatas"]),
        ...mapGetters("regionalInventoryDetails", ["getPhonePeRegionalInventoryAllocatedSoPodDetails"]),
        ...mapGetters("getInventoryUpdatedPodDetails", ["getInventoryUpdatedPodDetails"]),
    },
    created() {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    },
    methods: {
        ...mapActions("soPodListDatas", ["FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS", "FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS"]),
        ...mapActions("regionalInventoryDetails", ["FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS"]),
        ...mapActions("getInventoryUpdatedPodDetails", ["FETCH_INVENTORY_UPDATED_POD_DETAILS"]),

        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl = pagination;
                this.paginationControl.rowsNumber = this.getPhonepeApprovedSoPodListDatas.totalElements;
                this.paginationControl.page = this.getPhonepeApprovedSoPodListDatas.number + 1;
                this.tableData = this.getPhonepeApprovedSoPodListDatas.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo1({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl1 = pagination;
                this.paginationControl1.rowsNumber = this.getPhoneperejectedSoPodListDatas.totalElements;
                this.paginationControl1.page = this.getPhoneperejectedSoPodListDatas.number + 1;
                this.tableData1 = this.getPhoneperejectedSoPodListDatas.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo2({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl2 = pagination;
                this.paginationControl2.rowsNumber = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.totalElements;
                this.paginationControl2.page = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.number + 1;
                this.tableData2 = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        goToSelectedTab(tab) {
            if (tab == "tab-1") this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
            if (tab == "tab-2") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
            if (tab == "tab-3") this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
        },
        fnUpdateRejectedPodDetails(reqData) {
            this.$q.dialog({ title: "Confirm", message: "Are you sure want to Update?", ok: "Continue", cancel: "Cancel" }).onOk(() => {
                this.$q.loading.show({ message: "Processing .." });
                this.FETCH_INVENTORY_UPDATED_POD_DETAILS({ podNumber: reqData.pod_number }).then(() => {
                    this.$q.loading.hide();
                    this.$router.push({ name: "updateRegionalRejectPods", params: { data: this.getInventoryUpdatedPodDetails } });
                });
            });
        }
    }
};
</script>