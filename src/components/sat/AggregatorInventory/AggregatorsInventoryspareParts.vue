<template>
    <div class="q-pa-none">
        <div class="row bottom-border q-ma-md q-py-md items-center">
            <div class="col-12 text-weight-regular text-grey-9 q-title" align="left">Spare Counts</div>
            <div class="col-md-9 col-sm-12 col-xs-12 q-mt-md">
                <div v-if="regionSpareCount.length > 0" class="row">
                    <q-card class="border-radius-10 q-pa-md q-ma-sm"
                        style="background-color: #531b64; color: white; min-width: 100px" v-for="menu in regionSpareCount"
                        :key="menu.label">
                        <div class="text-h6">{{ menu.value.count }}</div>
                        <div class="text-caption">{{ menu.value.spareParts.spare_parts_types }}</div>
                    </q-card>
                </div>
                <div v-else class="row">
                    <q-banner class="bg-primary text-white" icon="info">No data available to display</q-banner>
                </div>
            </div>
        </div>

        <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToSelectedTab">
            <q-tab color="dark" name="incomingPods" label="Incoming Pod's" />
            <q-tab color="dark" name="stocks" label="Stocks" />
            <q-tab color="dark" name="SoPodList" label="So Pod List" />
            <q-tab color="dark" name="createSoPod" label="Create So Pod" />
        </q-tabs>

        <q-tab-panels v-model="selectedTab" animated>
            <q-tab-panel name="SoPodList" class="no-padding">
                <PhonepeSoPodList />
            </q-tab-panel>

            <q-tab-panel name="incomingPods" class="no-padding">
                <q-table :rows="tableData" table-class="customSATableClass" :columns="columns" :filter="filterSearch"
                    v-model:pagination="paginationControl" row-key="id" color="grey-9" @request="ajaxLoadAllLeadInfo">
                    <template v-slot:body-cell-createdAt="props">
                        <q-td :props="props">{{ props.row.created_date ? $moment(props.row.created_date).format("Do MMM Y") : "NA" }}</q-td>
                    </template>
                    <template v-slot:body-cell-updated_date="props">
                        <q-td :props="props">{{ props.row.updated_date ? $moment(props.row.updated_date).format("Do MMM Y") : "NA" }}</q-td>
                    </template>
                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <div class="row no-wrap q-gutter-xs">
                                <q-btn dense no-caps label="Reject" icon="close" size="sm" @click="fnRejectPodDetails(props.row)"
                                    flat class="text-negative" />
                                <q-btn dense no-caps label="Approve" icon="check" size="sm" @click="fnApprovePodDetails(props.row)"
                                    flat class="text-primary" />
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:top>
                        <div class="col-3">
                            <q-input dense clearable color="grey-9" v-model="filterSearch" label="Search By POD Number"
                                placeholder="Type.." />
                        </div>
                    </template>
                </q-table>
            </q-tab-panel>

            <q-tab-panel name="stocks" class="no-padding">
                <q-table :rows="tableData1" table-class="customSATableClass" :columns="columns1" :filter="filterSearch1"
                    v-model:pagination="paginationControl1" row-key="id" color="grey-9" @request="ajaxLoadAllLeadInfo1">
                    <template v-slot:body-cell-createdAt="props">
                        <q-td :props="props">{{ props.row.created_date ? $moment(props.row.created_date).format("Do MMM Y") : "NA" }}</q-td>
                    </template>
                    <template v-slot:body-cell-updated_date="props">
                        <q-td :props="props">{{ props.row.updated_date ? $moment(props.row.updated_date).format("Do MMM Y") : "NA" }}</q-td>
                    </template>
                    <template v-slot:top>
                        <div class="col-3">
                            <q-input dense clearable color="grey-9" v-model="filterSearch1" label="Search By POD Number"
                                placeholder="Type.." />
                        </div>
                    </template>
                </q-table>
            </q-tab-panel>

            <q-tab-panel name="createSoPod">
                <div class="q-pa-md">
                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-4">
                            <q-select filter clearable v-model="formData.allocate_so" label="Select SO" color="grey-9"
                                :options="regionBasedSo" emit-value map-options />
                        </div>
                    </div>

                    <div class="q-mt-md">
                        <div class="text-subtitle2 q-mb-sm">Spare Parts Type*</div>
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-sm-4" v-for="menu in sparePartsTypes" :key="menu.value.id">
                                <q-checkbox :model-value="isSpareSelected(menu.value.id)"
                                    @update:model-value="val => toggleSpareSelection(val, menu.value)" :label="menu.label" />
                                <q-input v-if="isSpareSelected(menu.value.id)" type="number" dense label="Count"
                                    :model-value="getSpareCount(menu.value.id)"
                                    @update:model-value="val => updateSpareCount(val, menu.value)" class="q-ml-md"
                                    style="max-width: 100px" />
                            </div>
                        </div>
                    </div>

                    <div class="row q-mt-md q-col-gutter-md">
                        <div class="col-12 col-md-4">
                            <q-input disable v-model="formData.pod_number" label="Pod Number" color="grey-9" />
                        </div>
                        <div class="col-12 col-md-4">
                            <q-input disable v-model="formData.total_count" label="Total Count" color="grey-9" />
                        </div>
                    </div>

                    <div class="row justify-center q-mt-lg">
                        <q-btn :disable="formData.total_count === 0 || !formData.allocate_so" label="Submit"
                            color="purple-9" @click="fnSubmitBankDetails(formData)" />
                    </div>
                </div>
            </q-tab-panel>
        </q-tab-panels>

        <PhonepeRejectPodDetails v-if="showRejectModel" :showRejectModel="showRejectModel"
            :propShowRejectComponent="propsRejectAppend"
            @reloadPaymentTrackerData="ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch })"
            @closeRejectModel="fnRejectPodDetails" />
    </div>
</template>

<script>
import PhonepeRejectPodDetails from "../AggregatorInventory/PhonepeRejectPodDetails.vue";
import PhonepeSoPodList from "../AggregatorInventory/PhonepeSoPodList.vue";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "AggregatorsInventoryspareParts",
    components: { PhonepeSoPodList, PhonepeRejectPodDetails },
    data() {
        return {
            showRejectModel: false,
            propsRejectAppend: [],
            filterSearch: "",
            filterSearch1: "",
            selectedTab: "incomingPods",
            regionBasedSo: [],
            regionSpareCount: [],
            sparePartsTypes: [],
            formData: {
                allocate_region: "",
                allocate_reseller: null,
                total_count: 0,
                allocate_so: null,
                pod_number: "SO" + new Date().getTime(),
                sparePartsSets: [],
            },
            paginationControl: { page: 1, sortBy: "updated_date", descending: false, rowsPerPage: 10 },
            paginationControl1: { page: 1, sortBy: "updated_date", descending: false, rowsPerPage: 10 },
            columns: [
                { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "regionAreaName", label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
                { name: "status", label: "Status", align: "left", field: "status" },
                { name: "owner", label: "Owner", align: "left", field: "owner" },
                { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
                { name: "createdAt", label: "Created Date", align: "left", field: "created_date" },
                { name: "updated_date", label: "Updated Date", align: "left", field: "updated_date", sortable: true },
                { name: "action", label: "Action", align: "left" }
            ],
            columns1: [
                { name: "pod_number", label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "regionAreaName", label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
                { name: "status", label: "Status", align: "left", field: "status" },
                { name: "owner", label: "Owner", align: "left", field: "owner" },
                { name: "total_count", label: "Total Count", align: "left", field: "total_count" },
                { name: "createdAt", label: "Created Date", align: "left", field: "created_date" },
                { name: "updated_date", label: "Updated Date", align: "left", field: "updated_date", sortable: true }
            ],
            tableData: [],
            tableData1: []
        };
    },
    computed: {
        ...mapGetters("InventoryCentral", ["getRegionBasedSO"]),
        ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"]),
        ...mapGetters("regionalInventoryDetails", ["getPhonepeSparePartsSetsAndCounts", "getphonepeRegionalInventoryAllocatedSoPodDetails", "getPhonepeRegionalInventoryStocksPodDetails"])
    },
    created() {
        this.fnSparePartsTypes();
        this.fnregionSpareCount();
        this.regionBasedSoLoad();
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    },
    methods: {
        ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES"]),
        ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
        ...mapActions("sparePartsInventory", ["UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS"]),
        ...mapActions("regionalInventoryDetails", ["FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS", "FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS", "APPROVE_PHONEPE_INCOMING_POD_DETAILS", "FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS"]),
        ...mapActions("singlePodData", ["FETCH_PHONEPE_SINGLE_POD_DETAILS"]),

        fnSparePartsTypes() {
            this.FETCH_SPARE_PARTS_GET_TYPES().then(() => {
                this.sparePartsTypes = this.getsparePartsGetTypes.map(item => ({ value: item, label: item.spare_parts_types }));
            });
        },
        fnregionSpareCount() {
            this.regionSpareCount = [];
            this.FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS().then(() => {
                this.regionSpareCount = this.getPhonepeSparePartsSetsAndCounts.map(item => ({ value: item, label: item.spare_parts_types }));
            });
        },
        regionBasedSoLoad() {
            const regionId = JSON.parse(localStorage.getItem('u_i')).region.id;
            this.FETCH_REGION_BASED_SO(regionId).then(() => {
                this.regionBasedSo = this.getRegionBasedSO.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: JSON.stringify(v) }));
            });
        },
        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ message: 'Fetching data ..' });
            this.FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl = pagination;
                this.paginationControl.rowsNumber = this.getphonepeRegionalInventoryAllocatedSoPodDetails.totalElements;
                this.tableData = this.getphonepeRegionalInventoryAllocatedSoPodDetails.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo1({ pagination, filter }) {
            this.$q.loading.show({ message: 'Fetching data ..' });
            this.FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS({ pagination, filter }).then(() => {
                this.paginationControl1 = pagination;
                this.paginationControl1.rowsNumber = this.getPhonepeRegionalInventoryStocksPodDetails.totalElements;
                this.tableData1 = this.getPhonepeRegionalInventoryStocksPodDetails.content;
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        goToSelectedTab(tab) {
            if (tab == 'stocks') this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
            else if (tab == 'incomingPods') this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        },
        isSpareSelected(id) { return this.formData.sparePartsSets.some(s => s.spareParts.id === id); },
        getSpareCount(id) {
            const item = this.formData.sparePartsSets.find(s => s.spareParts.id === id);
            return item ? item.count : 0;
        },
        toggleSpareSelection(selected, spare) {
            if (selected) this.formData.sparePartsSets.push({ count: 0, spareParts: { id: spare.id } });
            else {
                this.formData.sparePartsSets = this.formData.sparePartsSets.filter(s => s.spareParts.id !== spare.id);
                this.calculateTotal();
            }
        },
        updateSpareCount(val, spare) {
            const item = this.formData.sparePartsSets.find(s => s.spareParts.id === spare.id);
            if (item) { item.count = parseInt(val) || 0; this.calculateTotal(); }
        },
        calculateTotal() { this.formData.total_count = this.formData.sparePartsSets.reduce((sum, s) => sum + s.count, 0); },
        fnSubmitBankDetails(request) {
            const payload = { ...request, allocate_so: JSON.parse(request.allocate_so), allocate_region: JSON.parse(localStorage.getItem('u_i')).region };
            this.$q.loading.show();
            this.UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS(payload).then(() => {
                this.$q.loading.hide();
                this.$q.notify({ color: 'positive', message: 'Successfully updated!', icon: 'thumb_up' });
                this.formData.total_count = 0;
                this.formData.sparePartsSets = [];
                this.formData.pod_number = "SO" + new Date().getTime();
            }).catch(err => {
                this.$q.loading.hide();
                this.$q.notify({ color: 'negative', message: err.body?.message || 'Please Try Again Later !' });
            });
        },
        fnRejectPodDetails(details) { this.showRejectModel = true; this.propsRejectAppend = details; },
        fnApprovePodDetails(reqdata) {
            this.$q.dialog({ title: "Confirm", message: "Are you sure want to Approve?", ok: "Continue", cancel: "Cancel" }).onOk(() => {
                this.FETCH_PHONEPE_SINGLE_POD_DETAILS(reqdata).then(res => {
                    const param = { ...res.data.data, status: reqdata.status, owner: reqdata.owner };
                    this.APPROVE_PHONEPE_INCOMING_POD_DETAILS(param).then(() => {
                        this.$q.notify({ color: 'positive', message: 'Successfully Approved!' });
                        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
                        this.fnregionSpareCount();
                    });
                });
            });
        }
    }
}
</script>