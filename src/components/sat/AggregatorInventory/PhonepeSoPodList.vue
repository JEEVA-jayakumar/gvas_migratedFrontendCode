<template>
    <q-page>
        <div>
            <q-tabs no-pane-border v-model="selectedTab" color="dark" filled class="shadow-1"
                @click="goToSelectedTab">
                <q-tab color="dark" name="tab-1" label="Approved Pod" />
                <q-tab color="dark" name="tab-2" label="Rejected Pod" />
                <q-tab color="dark" name="tab-3" label=" Allocated Pod" />
            </q-tabs>
        </div>

        <q-tab-panels v-model="selectedTab" animated>
            <q-tab-panel name="tab-1">
                <q-table :rows="tableData" table-class="customSATableClass" :columns="columns"
                    :filter="filterSearch" v-model:pagination="paginationControl"
                    :filter-method="myCustomSearchFilter" row-key="name" color="grey-9"
                    @request="ajaxLoadAllLeadInfo">
                    <template v-slot:body-cell-createdAt="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.created_date == null
                                ? "NA"
                                : $moment(props.row.created_date).format("Do MMM Y")
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-updated_date="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.updated_date == null
                                ? "NA"
                                : $moment(props.row.updated_date).format("Do MMM Y")
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-status="props">
                        <q-td v-if="props.row" :props="props">
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
                        <q-td v-if="props.row" :props="props">
                            <span class="label text-positive" v-if="props.row.owner == 1">Central Inventory</span>
                            <span class="label text-primary" v-else-if="props.row.owner == 2">Regional Inventory</span>
                            <span class="label text-primary" v-else-if="props.row.owner == 3">SO</span>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-regionAreaName="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.allocate_region == null
                                ? "NA"
                                : props.row.allocate_region.regionAreaName
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                        </q-td>
                    </template>
                    <template v-slot:top="props">
                        <div class="col-3">
                            <q-input clearable color="grey-9" v-model="filterSearch" label="Search By POD Number" placeholder="Type.."
                                class="q-mr-lg" />
                        </div>
                    </template>
                </q-table>
            </q-tab-panel>

            <q-tab-panel name="tab-2">
                <q-table :rows="tableData1" table-class="customSATableClass" :columns="columns1"
                    :filter="filterSearch1" v-model:pagination="paginationControl1"
                    :filter-method="myCustomSearchFilter" row-key="name" color="grey-9"
                    @request="ajaxLoadAllLeadInfo1">
                    <template v-slot:body-cell-createdAt="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.created_date == null
                                ? "NA"
                                : $moment(props.row.created_date).format("Do MMM Y")
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-updated_date="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.updated_date == null
                                ? "NA"
                                : $moment(props.row.updated_date).format("Do MMM Y")
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-status="props">
                        <q-td v-if="props.row" :props="props">
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
                        <q-td v-if="props.row" :props="props">
                            <span class="label text-positive" v-if="props.row.owner == 1">Central Inventory</span>
                            <span class="label text-primary" v-else-if="props.row.owner == 2">Regional Inventory</span>
                            <span class="label text-primary" v-else-if="props.row.owner == 3">SO</span>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-regionAreaName="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.allocate_region == null
                                ? "NA"
                                : props.row.allocate_region.regionAreaName
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-name="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.allocate_so == null
                                ? "NA"
                                : props.row.allocate_so.name+" | "+props.row.allocate_so.employeeID
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-action1="props">
                        <q-td v-if="props.row" :props="props">
                            <div class="row no-wrap no-padding">
                                <q-btn dense no-caps no-wrap label="Update" icon="far fa-plus-square" size="md"
                                    @click="fnUpdateRejectedPodDetails(props.row)" flat class="text-light-blue"></q-btn>
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:top="props">
                        <div class="col-3">
                            <q-input clearable color="grey-9" v-model="filterSearch1" label="Search By POD Number" placeholder="Type.."
                                class="q-mr-lg" />
                        </div>
                    </template>
                </q-table>
            </q-tab-panel>

            <q-tab-panel name="tab-3">
                <q-table :rows="tableData2" table-class="customSATableClass" :columns="columns2"
                    :filter="filterSearch2" v-model:pagination="paginationControl2"
                    :filter-method="myCustomSearchFilter" row-key="name" color="grey-9"
                    @request="ajaxLoadAllLeadInfo2">
                    <template v-slot:body-cell-createdAt="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.created_date == null
                                ? "NA"
                                : $moment(props.row.created_date).format("Do MMM Y")
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-updated_date="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.updated_date == null
                                ? "NA"
                                : $moment(props.row.updated_date).format("Do MMM Y")
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-status="props">
                        <q-td v-if="props.row" :props="props">
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
                        <q-td v-if="props.row" :props="props">
                            <span class="label text-positive" v-if="props.row.owner == 1">Central Inventory</span>
                            <span class="label text-primary" v-else-if="props.row.owner == 2">Regional Inventory</span>
                            <span class="label text-primary" v-else-if="props.row.owner == 3">SO</span>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-regionAreaName="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.allocate_region == null
                                ? "NA"
                                : props.row.allocate_region.regionAreaName
                        }}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-name="props">
                        <q-td v-if="props.row" :props="props">
                        {{
                            props.row.allocate_so == null
                                ? "NA"
                                : props.row.allocate_so.name+" | "+props.row.allocate_so.employeeID
                        }}
                        </q-td>
                    </template>
                    <template v-slot:top="props">
                        <div class="col-3">
                            <q-input clearable color="grey-9" v-model="filterSearch2" label="Search By POD Number" placeholder="Type.."
                                class="q-mr-lg" />
                        </div>
                    </template>
                </q-table>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import { required, or } from '@vuelidate/validators';
import { mapGetters, mapActions } from "vuex";
export default {
    name: "PhonepeSoPodList",
    data() {
        return {
            filterSearch: "",
            filterSearch1: "",
            filterSearch2: "",
            selectedTab: "tab-1",
            paginationControl: {
                rowsNumber: 10,
                page: 1,
                sortBy: "updated_date",
                descending: false,
                rowsPerPage: 5
            },
            paginationControl1: {
                rowsNumber: 10,
                page: 1,
                sortBy: "updated_date",
                descending: false,
                rowsPerPage: 5
            },
            paginationControl2: {
                rowsNumber: 10,
                page: 1,
                sortBy: "updated_date",
                descending: false,
                rowsPerPage: 5
            },
            columns1: [
                { name: "pod_number", required: true, label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "regionAreaName", required: true, label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
                { name: "name", required: true, label: "SO", align: "left", field: row => row.allocate_so ? `${row.allocate_so.name} | ${row.allocate_so.employeeID}` : 'NA' },
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
                { name: "name", required: true, label: "SO Name", align: "left", field: row => row.allocate_so ? `${row.allocate_so.name} | ${row.allocate_so.employeeID}` : 'NA' },
                { name: "status", required: true, label: "Status", align: "left", field: "status", sortable: false },
                { name: "owner", required: true, label: "Owner", align: "left", field: "owner", sortable: false },
                { name: "total_count", required: true, label: "Total Count", align: "left", field: "total_count", sortable: false },
                { name: "createdAt", required: true, label: "Created Date", align: "left", field: "created_date", sortable: false },
                { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true }
            ],
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
            tableData: [],
            tableData1: [],
            tableData2: [],
            tableDataUpdate: []
        };
    },
    created() {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
        this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
    },
    computed: {
        ...mapGetters("soPodListDatas", ["getPhonepeApprovedSoPodListDatas", "getPhoneperejectedSoPodListDatas"]),
        ...mapGetters("regionalInventoryDetails", ["getPhonePeRegionalInventoryAllocatedSoPodDetails", "getInventoryUpdatedPodDetails"])
    },
    methods: {
        ...mapActions("regionalInventoryDetails", ["FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS", "FETCH_INVENTORY_UPDATED_POD_DETAILS"]),
        ...mapActions("soPodListDatas", ["FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS", "FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS"]),

        fnUpdateRejectedPodDetails(reqData){
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure want to Update?",
                ok: "Continue",
                cancel: "Cancel"
            }).onOk(() => {
                this.$q.loading.show({ spinnerColor: "purple-9", message: "Processing .." });
                let param = { podNumber: reqData.pod_number };
                this.FETCH_INVENTORY_UPDATED_POD_DETAILS(param).then(() => {
                    this.tableDataUpdate = this.getInventoryUpdatedPodDetails;
                    this.$q.loading.hide();
                    this.$router.push({
                        name: "updateRegionalRejectPods",
                        params: { data: this.tableDataUpdate }
                    });
                });
            });
        },
        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl = pagination;
                this.paginationControl.rowsNumber = this.getPhonepeApprovedSoPodListDatas.totalElements;
                this.paginationControl.page = this.getPhonepeApprovedSoPodListDatas.number + 1;
                this.tableData = this.getPhonepeApprovedSoPodListDatas.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo2({ pagination, filter }) {
            this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl2 = pagination;
                this.paginationControl2.rowsNumber = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.totalElements;
                this.paginationControl2.page = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.number + 1;
                this.tableData2 = this.getPhonePeRegionalInventoryAllocatedSoPodDetails.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo1({ pagination, filter }) {
            this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl1 = pagination;
                this.paginationControl1.rowsNumber = this.getPhoneperejectedSoPodListDatas.totalElements;
                this.paginationControl1.page = this.getPhoneperejectedSoPodListDatas.number + 1;
                this.tableData1 = this.getPhoneperejectedSoPodListDatas.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        goToSelectedTab(tab) {
            // Logic handled by q-tab-panels v-model
        },
        myCustomSearchFilter(rows, terms, cols, cellValue) {
            const lowerTerms = terms ? terms.toLowerCase() : "";
            return rows.filter(row =>
                cols.some(col => (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1)
            );
        }
    }
};
</script>
