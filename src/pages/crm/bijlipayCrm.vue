<template>
    <q-page>
        <div>
            <q-tabs v-model="activeTab" class="shadow-1 bg-grey-1" active-color="purple-9" indicator-color="purple-9" @update:model-value="goToCompleteTab">
                <q-tab name="tab-1" label="Pending Tickets" />
                <q-tab name="tab-2" label="Completed Tickets" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel name="tab-1" class="no-padding">
                    <div class="row items-center q-pa-md">
                        <div class="col-auto q-mr-md">
                            <strong> Open For </strong>
                        </div>
                        <q-select class="col" v-model="formData.date" :options="dateType"
                            color="grey" emit-value map-options @update:model-value="dateClick">
                        </q-select>
                        <div class="col-5"></div>
                        <q-input class="col-5" clearable color="grey-9" placeholder="Type.." v-model="filter"
                        label="Search By Ticket No, Merchant No..." />
                    </div>
                    <q-table table-class="customTableClass" class="q-py-none shadow-0" :rows="tableData" :columns="columns"
                        :filter="filter" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl"
                        :loading="toggleAjaxLoadFilter" @request="ajaxLoadAllLeadInfo">

                        <template v-slot:body-cell-createdDate="props">
                            <q-td :props="props">{{
                                    props.row == null ? "NA" : $moment(props.row.createdDate).format("Do MMM Y")
                            }}</q-td>
                        </template>

                        <template v-slot:body-cell-action="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <q-btn :disable="props.row.serviceRequestTicketStatus != 1" dense no-caps no-wrap
                                        label="Resolved" icon="far fa-plus-square" size="md" @click="fnResolve(props.row)"
                                        flat class="custom-green">
                                    </q-btn>
                                    <q-btn :disable="props.row.serviceRequestTicketStatus != 1" dense no-caps no-wrap
                                        label="Escalate to Sat" icon="far fa-plus-square" size="md"
                                        @click="fnEscalateToSat(props.row)" flat class="custom-negative">
                                    </q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-updateRemarks="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding items-center">
                                    <q-btn :disable="props.row.serviceRequestTicketStatus != 1" no-caps icon="edit"
                                        color="purple-9" size="xs" round @click="toggleAddremarks(props.row)">
                                    </q-btn>
                                    <span class="q-ma-sm" v-if="props.row.crmRemark != null"
                                        v-html="props.row.crmRemark"></span>
                                    <span class="q-ma-sm" v-else>NA</span>
                                </div>
                            </q-td>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="tab-2" class="no-padding">
                    <div class="row q-pa-md">
                        <q-input class="col-4" v-model="filter1" clearable color="grey-9" placeholder="Type.."
                        label="Search By Ticket No, Merchant No..." />
                    </div>
                    <q-table table-class="customTableClass" class="q-py-none shadow-0" :rows="tableData1" :columns="columns2"
                        :filter="filter1" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl1"
                        :loading="toggleAjaxLoadFilter1" @request="ajaxLoadAllLeadInfo1">

                        <template v-slot:body-cell-updateRemarks="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <span class="q-ma-sm" v-if="props.row.crmRemark != null"
                                        v-html="props.row.crmRemark"></span>
                                    <span class="q-ma-sm" v-else>NA</span>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-createdDate="props">
                            <q-td :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
                        </template>

                        <template v-slot:body-cell-updatedDate="props">
                            <q-td :props="props">{{ $moment(props.row.updatedDate).format("Do MMM Y") }}</q-td>
                        </template>
                    </q-table>
                </q-tab-panel>
            </q-tab-panels>

        </div>
        <bijlipayAddRemarks v-if="propToggleRemarks" :remarksInfo="addBasicInformation"
            :propToggleRemarksPop="propToggleRemarks" @reloadBijlipayPendingDetails="loadingData({ pagination: paginationControl, filter:filter, date:formData.date})"
            @closeRemarksInfo="toggleAddremarks" />

        <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
            <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
        </div>
    </q-page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import bijlipayAddRemarks from '../../components/crm/bijlipayAddRemarks.vue';

export default {
    name: "BijlipayCrm",
    components: {
        bijlipayAddRemarks,
    },
    data() {
        return {
            activeTab: "tab-1",
            propToggleRemarks: false,
            addBasicInformation: {
                remarks: null,
                action: 0
            },
            toggleAjaxLoadFilter: false,
            toggleAjaxLoadFilter1: false,
            filter: "",
            filter1: "",
            paginationControl1: {
                rowsNumber: 5,
                page: 1,
                sortBy: 'createdDate',
                descending: false,
                rowsPerPage: 5
            },
            paginationControl: {
                rowsNumber: 5,
                page: 1,
                sortBy: 'createdDate',
                descending: false,
                rowsPerPage: 5
            },
            formData: {
                date: 0,
            },
            dateType: [
                { label: "Today", value: 0 },
                { label: "T+1", value: 1 },
                { label: "T+2", value: 2 },
                { label: "All", value: 3 }
            ],
            columns: [
                { name: "serviceReqTicketId", required: true, label: "Ticket No", align: "left", field: row => row.serviceReqTicketId, sortable: false },
                { name: "merchantName", required: true, label: "Merchant Name", align: "left", field: "meName", sortable: false },
                { name: "emailId", required: true, label: "Merchant Email", align: "left", field: "emailId", sortable: false },
                { name: "contactNumber", required: true, label: "Merchant No", align: "left", field: "contactNumber", sortable: false },
                { name: "subTickets", required: true, label: "Issue Reported", align: "left", field: row => {
                    let issues = [];
                    if (row.subTicketsList && row.subTicketsList.length > 0) {
                        row.subTicketsList.forEach((element, index) => {
                            if (element.serviceRequestType != null) {
                                issues.push((index + 1) + "." + element.serviceRequestType.name + "   ");
                            }
                        });
                    }
                    return issues.length > 0 ? issues.join(', ') : "NA";
                }, sortable: false },
                { name: "createdDate", required: true, label: "Date", align: "left", field: "createdDate", sortable: true },
                { name: "Remarks", required: true, label: "Status", align: "left", field: row => {
                    let issues = [];
                    if (row.subTicketsList && row.subTicketsList.length > 0) {
                        row.subTicketsList.forEach((element, index) => {
                            if (element.serviceRequestSubTicketStatus != null) {
                                issues.push((index + 1) + "." + element.serviceRequestSubTicketStatus.name + "   ");
                            }
                        });
                    }
                    return issues.length > 0 ? issues.join(', ') : "NA";
                }, sortable: false },
                { name: "updateRemarks", required: true, label: "Remarks", align: "left", field: "updateRemarks", sortable: false },
                { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: false },
            ],
            columns2: [
                { name: "serviceReqTicketId", required: true, label: "Ticket No", align: "left", field: row => row.serviceReqTicketId, sortable: false },
                { name: "merchantName", required: true, label: "Merchant Name", align: "left", field: "meName", sortable: false },
                { name: "emailId", required: true, label: "Merchant Email", align: "left", field: "emailId", sortable: false },
                { name: "contactNumber", required: true, label: "Merchant Number", align: "left", field: "contactNumber", sortable: false },
                { name: "name", required: true, label: "Status Reported", align: "left", field: row => {
                    let issues = [];
                    if (row.subTicketsList && row.subTicketsList.length > 0) {
                        row.subTicketsList.forEach((element, index) => {
                            if (element.serviceRequestType != null) {
                                issues.push((index + 1) + "." + element.serviceRequestType.name + "   ");
                            }
                        });
                    }
                    return issues.length > 0 ? issues.join(', ') : "NA";
                }, sortable: false },
                { name: "updateRemarks", required: true, label: "Remarks", align: "left", field: "updateRemarks", sortable: false },
                { name: "createdDate", required: true, label: "Open Date ", align: "left", field: "createdDate", sortable: true },
                { name: "updatedDate", required: true, label: "Closed Date", align: "left", field: "updatedDate", sortable: false }
            ],
            tableData: [],
            tableData1: [],
        };
    },
    computed: {
        ...mapGetters("bijlipayCrm", ["getBijlipayMerchantDetails", "getBijlipayCompletedData", "getBijlipayDate"])
    },
    mounted() {
        this.ajaxLoadAllLeadInfo1({
            pagination: this.paginationControl1,
            filter: this.filter1
        });
    },
    created() {
        this.loadingData({
            pagination: this.paginationControl,
            filter: this.filter,
            date: this.formData.date
        });
    },
    methods: {
        ...mapActions("bijlipayCrm", ["FETCH_BIJLIPAY_PENDING_CRM", "FETCH_BIJLIPAY_COMPLETED_DATA", "BIJLIPAY_CRM_DATE", "ASSIGN_TO_COMPLETE", "ESCALATE_TO_SAT"]),
        ajaxLoadAllLeadInfo(request) {
            let req = {
                pagination: request.pagination,
                filter: request.filter,
                date: this.formData.date
            }
            this.loadingData(req);
        },
        loadingData(request) {
            this.toggleAjaxLoadFilter = true;
            this.BIJLIPAY_CRM_DATE(request)
                .then(() => {
                    this.paginationControl = request.pagination;
                    this.paginationControl.rowsNumber = this.getBijlipayDate.totalElements;
                    this.paginationControl.page = this.getBijlipayDate.number + 1;
                    this.tableData = this.getBijlipayDate.content;
                    if (this.getBijlipayDate.sort != null) {
                        this.paginationControl.sortBy = this.getBijlipayDate.sort[0].property;
                        this.paginationControl.descending = !this.getBijlipayDate.sort[0].ascending;
                    }
                    this.toggleAjaxLoadFilter = false;
                })
                .catch(() => { this.toggleAjaxLoadFilter = false; });
        },
        dateClick(request) {
            this.addBasicInformation.action = request;
            this.loadingData({
                pagination: this.paginationControl,
                filter: this.filter,
                date: request
            });
        },
        fnResolve(request) {
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure ?",
                ok: "Yes",
                cancel: "Cancel",
            }).onOk(() => {
                let ticketId = {
                    ticketId: request.serviceReqTicketId,
                    pagination: this.paginationControl,
                    filter: this.filter,
                }
                this.ASSIGN_TO_COMPLETE(ticketId)
                    .then(() => {
                        this.$q.notify({
                            color: "positive",
                            position: "bottom",
                            message: "Successfully Resolved!",
                            icon: "thumb_up",
                        });
                        this.loadingData({
                            pagination: this.paginationControl,
                            filter: this.filter,
                            date: this.formData.date,
                        });
                    }).catch(() => {
                        this.$q.notify({
                            color: "negative",
                            position: "bottom",
                            message: "No changes made!",
                            icon: "thumb_down",
                        });
                    });
            });
        },
        fnEscalateToSat(request) {
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure?",
                ok: "Yes",
                cancel: "Cancel",
            }).onOk(() => {
                let TicketId = { ticketId: request.serviceReqTicketId }
                this.ESCALATE_TO_SAT(TicketId)
                    .then(() => {
                        this.$q.notify({
                            color: "positive",
                            position: "bottom",
                            message: "Escalated To SAT!",
                            icon: "thumb_up",
                        });
                        this.loadingData({
                            pagination: this.paginationControl,
                            filter: this.filter,
                            date: this.formData.date,
                        });
                    }).catch(() => {
                        this.$q.notify({
                            color: "negative",
                            position: "bottom",
                            message: "No changes made!",
                            icon: "thumb_down",
                        });
                    });
            });
        },
        goToCompleteTab(tab) {
            if (tab == "tab-2") {
                this.ajaxLoadAllLeadInfo1({
                    pagination: this.paginationControl1,
                    filter: this.filter1
                });
            } else {
                this.loadingData({
                    pagination: this.paginationControl,
                    filter: this.filter,
                    date: this.formData.date
                });
            }
        },
        ajaxLoadAllLeadInfo1(request) {
            this.toggleAjaxLoadFilter1 = true;
            this.FETCH_BIJLIPAY_COMPLETED_DATA(request).then(() => {
                    this.paginationControl1 = request.pagination;
                    this.paginationControl1.rowsNumber = this.getBijlipayCompletedData.totalElements;
                    this.paginationControl1.page = this.getBijlipayCompletedData.number + 1;
                    this.tableData1 = this.getBijlipayCompletedData.content;
                    if (this.getBijlipayCompletedData.sort != null) {
                        this.paginationControl1.sortBy = this.getBijlipayCompletedData.sort[0].property;
                        this.paginationControl1.descending = !this.getBijlipayCompletedData.sort[0].ascending;
                    }
                    this.toggleAjaxLoadFilter1 = false;
                }).catch(() => { this.toggleAjaxLoadFilter1 = false; });
        },
        toggleAddremarks(remarks) {
            this.propToggleRemarks = !this.propToggleRemarks;
            if (remarks != undefined) {
                this.addBasicInformation.remarks = remarks;
                this.addBasicInformation.action = this.formData.date;
            }
        },
    }
};
</script>
<style scoped>
.custom-green { color: #2e7d32; }
.custom-negative { color: #d32f2f; }
</style>
