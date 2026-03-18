<template>
    <q-page>
        <!-- content -->
        <div>
            <div class="row bottom-border q-ma-md q-py-md">
                <div class="col-12 text-weight-regular text-grey-9 " align="left" width="50px">Spare Counts
                </div>
                <br>
                <div class="col-md-9 col-sm-12 col-xs-12">
                    <div v-if="regionSpareCount.length > 0" class="row">
                        <q-card class="border-radius-10 q-pa-md q-ma-md" color="purple-9"
                            v-for="menu in regionSpareCount" :key="menu" height="35px" width="35px">
                            <div>
                                <big :style="'color'">{{ menu.value.count }} </big>
                            </div>
                            <div>
                                <label>{{ menu.value.spareParts.spare_parts_types }}</label>
                            </div>

                        </q-card>
                    </div>

                    <div v-else class="row group">
                        <div>
                            <q-alert color="primary" icon="info">No data available to display</q-alert>
                        </div>
                    </div>
                </div>
            </div>
            <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToSelectedTab">
                <q-tab default color="dark" name="incomingPods" label="Incoming Pod's" />
                <q-tab color="dark" name="stocks" label="Stocks" />
                <q-tab color="dark" name="SoPodList" label="So Pod List" />
                <q-tab color="dark" name="createSoPod" label="Create So Pod" />
            </q-tabs>

            <q-tab-panels v-model="selectedTab" animated>
                <q-tab-panel name="SoPodList">
                    <PhonepeSoPodList />
                </q-tab-panel>

                <q-tab-panel name="incomingPods">
                    <q-table :rows="tableData" table-class="customSATableClass" :columns="columns"
                        :filter="filterSearch" v-model:pagination="paginationControl"
                        row-key="name" color="grey-9"
                        @request="ajaxLoadAllLeadInfo">
                        <template v-slot:body-cell-createdAt="props">
                            <q-td :props="props">
                                {{
                                    props.row.created_date == null
                                        ? "NA"
                                        : $moment(props.row.created_date).format("Do MMM Y")
                                }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-updated_date="props">
                            <q-td :props="props">
                                {{
                                    props.row.updated_date == null
                                        ? "NA"
                                        : $moment(props.row.updated_date).format("Do MMM Y")
                                }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-status="props">
                            <q-td :props="props">
                                <span class="label text-positive" v-if="props.row.status == 1">Created</span>
                                <span class="label text-primary" v-else-if="props.row.status == 2">Assigned to R.I</span>
                                <span class="label text-orange" v-else-if="props.row.status == 3">Approved By R.I</span>
                                <span class="label text-orange" v-else-if="props.row.status == 4">Assigned To SO</span>
                                <span class="label text-orange" v-else-if="props.row.status == 5">
                                    Approved By So</span>
                                <span class="label text-orange" v-else-if="props.row.status == 6">
                                    Rejected</span>
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
                                {{
                                    props.row.allocate_region == null
                                        ? "NA"
                                        : props.row.allocate_region.regionAreaName
                                }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-action="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <q-btn dense no-caps no-wrap label="Reject" icon="far fa-minus-square" size="md"
                                        @click="fnRejectPodDetails(props.row)" flat class="text-negative"></q-btn>
                                    <q-btn dense no-caps no-wrap label="Approve" icon="far fa-plus-square" size="md"
                                        @click="fnApprovePodDetails(props.row)" flat class="text-light-blue"></q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:top>
                            <div class="col-3">
                                <q-input dense clearable color="grey-9" v-model="filterSearch" label="Search By POD Number" placeholder="Type.."
                                    class="q-mr-lg">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="stocks">
                    <q-table :rows="tableData1" table-class="customSATableClass" :columns="columns1"
                        :filter="filterSearch1" v-model:pagination="paginationControl1"
                        row-key="name" color="grey-9"
                        @request="ajaxLoadAllLeadInfo1">
                        <template v-slot:body-cell-createdAt="props">
                            <q-td :props="props">
                                {{
                                    props.row.created_date == null
                                        ? "NA"
                                        : $moment(props.row.created_date).format("Do MMM Y")
                                }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-updated_date="props">
                            <q-td :props="props">
                                {{
                                    props.row.updated_date == null
                                        ? "NA"
                                        : $moment(props.row.updated_date).format("Do MMM Y")
                                }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-status="props">
                            <q-td :props="props">
                                <span class="label text-positive" v-if="props.row.status == 1">Created</span>
                                <span class="label text-primary" v-else-if="props.row.status == 2">Assigned to R.I</span>
                                <span class="label text-orange" v-else-if="props.row.status == 3">Approved By R.I</span>
                                <span class="label text-orange" v-else-if="props.row.status == 4">Assigned To SO</span>
                                <span class="label text-orange" v-else-if="props.row.status == 5">
                                    Approved By So</span>
                                <span class="label text-orange" v-else-if="props.row.status == 6">
                                    Rejected</span>
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
                                {{
                                    props.row.allocate_region == null
                                        ? "NA"
                                        : props.row.allocate_region.regionAreaName
                                }}
                            </q-td>
                        </template>
                        <template v-slot:top>
                            <div class="col-3">
                                <q-input dense clearable color="grey-9" v-model="filterSearch1" label="Search By POD Number" placeholder="Type.."
                                    class="q-mr-lg">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="createSoPod">
                    <div class="col-sm-3">
                        <div class="row">
                            <q-select filter clearable v-model="formData.allocate_so"
                                label="Select SO" class="col-md-3"
                                radio color="grey-9" :options="regionBasedSo" />
                        </div>
                        <div class="col-md-7">
                            <p class="caption">Spare Parts Type*</p>
                            <div class="row">
                                <div class="row items-center" v-for="menu in sparePartsTypes" :key="menu.value.id">
                                    <input style="width: 18px; height: 18px" type="checkbox"
                                        :id="menu.value.id + '_CB'" :name="menu.value.spare_parts_types"
                                        @click="getSelectedDetails($event, menu.value)" />
                                    <label>{{ menu.value.spare_parts_types }}</label>
                                </div>
                            </div>
                            <div v-for="menu in sparePartsTypes" :key="menu.id">
                                <div :id="menu.value.id + '_DV'" style="display: none">
                                    <label>{{ menu.value.spare_parts_types }}</label>
                                    <input type="number" min="0" max="5000"
                                        @blur="getAllCounts($event, menu)" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <q-input disable v-model="formData.pod_number" label="Pod Number" radio
                                    color="grey-9" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <q-input disable v-model="formData.total_count" label="Total Count" radio
                                    color="grey-9" />
                            </div>
                        </div>
                        <div class="full-width group" align="center" id="formData">
                            <q-btn :disable="this.formData.total_count == 0" size="md" type="button" color="purple-9"
                                @click="fnSubmitBankDetails(formData)">
                                Submit</q-btn>
                        </div>
                    </div>
                </q-tab-panel>
            </q-tab-panels>

            <PhonepeRejectPodDetails v-if="showRejectModel" :showRejectModel="showRejectModel"
                :propShowRejectComponent="propsRejectAppend"
                @reloadPaymentTrackerData="ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch })"
                @closeRejectModel="fnRejectPodDetails" />
        </div>
    </q-page>
</template>

<script>
import PhonepeRejectPodDetails from "../AggregatorInventory/PhonepeRejectPodDetails.vue";
import PhonepeSoPodList from "../AggregatorInventory/PhonepeSoPodList.vue";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "AggregatorsInventoryspareParts",
    components: {
        PhonepeSoPodList,
        PhonepeRejectPodDetails
    },
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
                allocate_so: "",
                pod_number: "",
                sparePartsSets: [],
            },
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
            columns1: [
                { name: "pod_number", required: true, label: "Pod Number", align: "left", field: "pod_number", sortable: true },
                { name: "regionAreaName", required: true, label: "Region", align: "left", field: row => row.allocate_region?.regionAreaName },
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
                { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: false }
            ],
            tableData: [],
            tableData1: []
        };
    },
    created() {
        this.regionBasedSoLoad();
        this.fnSparePartsTypes();
        this.fnregionSpareCount();
        this.podNumberCreation();
        this.ajaxLoadAllLeadInfo({
            pagination: this.paginationControl,
            filter: this.filterSearch,
        });
        this.ajaxLoadAllLeadInfo1({
            pagination: this.paginationControl1,
            filter: this.filterSearch1,
        });
    },
    computed: {
        ...mapGetters("InventoryCentral", ["getRegionBasedSO"]),
        ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"]),
        ...mapGetters("regionalInventoryDetails", ["getPhonepeSparePartsSetsAndCounts", "getphonepeRegionalInventoryAllocatedSoPodDetails", "getPhonepeRegionalInventoryStocksPodDetails"])
    },
    methods: {
        ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES"]),
        ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
        ...mapActions("sparePartsInventory", ["UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS"]),
        ...mapActions("regionalInventoryDetails", ["FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS", "FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS", "APPROVE_PHONEPE_INCOMING_POD_DETAILS", "FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS"]),
        ...mapActions("singlePodData", ["FETCH_PHONEPE_SINGLE_POD_DETAILS"]),

        fnRejectPodDetails(exceptionDetails) {
            this.showRejectModel = !this.showRejectModel;
            this.propsRejectAppend = exceptionDetails;
        },
        podNumberCreation() {
            const name = "SO";
            const d = new Date();
            let number = d.getTime();
            this.formData.pod_number = name.concat(number);
        },
        fnregionSpareCount() {
            this.regionSpareCount = [];
            this.FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS().then(() => {
                this.getPhonepeSparePartsSetsAndCounts.forEach(item => {
                    this.regionSpareCount.push({
                        value: item,
                        label: item.spare_parts_types
                    });
                });
            });
        },
        fnApprovePodDetails(reqdata) {
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure want to Approve?",
                ok: "Continue",
                cancel: "Cancel"
            }).onOk(() => {
                this.FETCH_PHONEPE_SINGLE_POD_DETAILS(reqdata)
                    .then(response => {
                        let param = {
                            allocate_region: response.data.data.allocate_region,
                            created_by: response.data.data.created_by,
                            allocate_reseller: response.data.data.allocate_reseller,
                            allocate_so: response.data.data.allocate_so,
                            sparePartsSets: response.data.data.sparePartsSets,
                            total_count: response.data.data.total_count,
                            pod_number: response.data.data.pod_number,
                            created_date: response.data.data.created_date,
                            updated_date: response.data.data.updated_date,
                            status: reqdata.status,
                            owner: reqdata.owner
                        }
                        this.APPROVE_PHONEPE_INCOMING_POD_DETAILS(param)
                            .then(() => {
                                this.$q.notify({
                                    color: 'positive',
                                    position: 'bottom',
                                    message: 'Successfully Approved!',
                                    icon: 'thumb_up'
                                })
                                this.ajaxLoadAllLeadInfo({
                                    pagination: this.paginationControl,
                                    filter: this.filterSearch
                                })
                                this.fnregionSpareCount()
                            }).catch(error => {
                                this.$q.loading.hide()
                                this.$q.notify({
                                    color: 'negative',
                                    position: 'bottom',
                                    message: error.body?.message || 'Please Try Again Later !',
                                    icon: 'thumb_down'
                                })
                            })
                    })
            })
        },
        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ..' })
            this.FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS({ pagination, filter }).then((res) => {
                this.paginationControl = pagination
                this.paginationControl.rowsNumber = this.getphonepeRegionalInventoryAllocatedSoPodDetails.totalElements
                this.paginationControl.page = this.getphonepeRegionalInventoryAllocatedSoPodDetails.number + 1
                this.tableData = this.getphonepeRegionalInventoryAllocatedSoPodDetails.content
                if (this.getphonepeRegionalInventoryAllocatedSoPodDetails.sort != null) {
                    this.paginationControl.sortBy = this.getphonepeRegionalInventoryAllocatedSoPodDetails.sort[0].property
                    this.paginationControl.descending = this.getphonepeRegionalInventoryAllocatedSoPodDetails.sort[0].ascending
                }
                this.$q.loading.hide()
            }).catch(() => this.$q.loading.hide())
        },
        ajaxLoadAllLeadInfo1({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Fetching data ..' })
            this.FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS({ pagination, filter }).then((res) => {
                this.paginationControl1 = pagination
                this.paginationControl1.rowsNumber = this.getPhonepeRegionalInventoryStocksPodDetails.totalElements
                this.paginationControl1.page = this.getPhonepeRegionalInventoryStocksPodDetails.number + 1
                this.tableData1 = this.getPhonepeRegionalInventoryStocksPodDetails.content
                if (this.getPhonepeRegionalInventoryStocksPodDetails.sort != null) {
                    this.paginationControl1.sortBy = this.getPhonepeRegionalInventoryStocksPodDetails.sort[0].property
                    this.paginationControl1.descending = this.getPhonepeRegionalInventoryStocksPodDetails.sort[0].ascending
                }
                this.$q.loading.hide()
            }).catch(() => this.$q.loading.hide())
        },
        goToSelectedTab(tab) {
            if (tab == 'stocks') {
                this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 })
            } else if (tab == 'incomingPods') {
                this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
            }
        },
        fnSubmitBankDetails(request) {
            this.formData.allocate_region = JSON.parse(localStorage.getItem('u_i')).region
            this.$q.loading.show()
            this.UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS(request)
                .then(() => {
                    this.$q.loading.hide()
                    this.$q.notify({ color: 'positive', position: 'bottom', message: 'Successfully updated!', icon: 'thumb_up' })
                    this.formData.total_count = 0;
                    this.formData.sparePartsSets = [];
                })
                .catch(error => {
                    this.$q.loading.hide()
                    this.$q.notify({ color: 'negative', position: 'bottom', message: error.body?.message || 'Please Try Again Later !', icon: 'thumb_down' })
                })
        },
        fnSparePartsTypes() {
            this.FETCH_SPARE_PARTS_GET_TYPES().then(() => {
                this.getsparePartsGetTypes.forEach(item => {
                    this.sparePartsTypes.push({ value: item, label: item.spare_parts_types })
                })
            })
        },
        getSelectedDetails(event, request) {
            let chFlag = event.target.checked
            if (chFlag) {
                document.getElementById(request.id + '_DV').style.display = 'block'
            } else {
                document.getElementById(request.id + '_DV').style.display = 'none'
                this.formData.sparePartsSets = this.formData.sparePartsSets.filter(obj => obj.spareParts.id != request.id)
                this.calculateTotalCount()
            }
        },
        getAllCounts(event, menu) {
            let val = parseInt(event.target.value) || 0
            let item = this.formData.sparePartsSets.find(obj => obj.spareParts.id == menu.value.id)
            if (item) {
                item.count = val
            } else {
                this.formData.sparePartsSets.push({ count: val, spareParts: { id: menu.value.id } })
            }
            this.calculateTotalCount()
        },
        calculateTotalCount() {
            this.formData.total_count = this.formData.sparePartsSets.reduce((sum, obj) => sum + obj.count, 0)
        },
        regionBasedSoLoad() {
            let regionArea = JSON.parse(localStorage.getItem('u_i')).region.id
            this.FETCH_REGION_BASED_SO(regionArea).then(() => {
                this.regionBasedSo = this.getRegionBasedSO.map(value => ({
                    label: value.name + " | " + value.employeeID + " | " + value.email,
                    value: JSON.stringify(value)
                }))
            })
        }
    }
}
</script>