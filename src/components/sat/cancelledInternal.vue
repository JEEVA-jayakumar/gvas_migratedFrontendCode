<template>
    <div class="q-pa-none">
        <q-table :rows="tableData" :columns="columnData" table-class="customTableClass" :filter="filterSearch"
            v-model:pagination="paginationControl" row-key="id" :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo">

            <template v-slot:body="props">
                <q-tr :props="props" class="bottom-border">
                    <q-td key="serviceReqTicketId">
                        <q-checkbox checked-icon="fas fa-chevron-up" unchecked-icon="fas fa-chevron-down" color="grey-9"
                            v-model="props.row.expand" class="q-mr-md" />
                        <span>{{ props.row.serviceReqTicketId }}</span>
                    </q-td>
                    <q-td key="tid" :props="props">{{ props.row.tid }}</q-td>
                    <q-td key="mid" :props="props">{{ props.row.mid || "NA" }}</q-td>
                    <q-td key="createdDate" :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
                    <q-td key="updatedDate" :props="props">{{ $moment(props.row.updatedDate).format("Do MMM Y") }}</q-td>
                    <q-td key="meName" :props="props">{{ props.row.meName }}</q-td>
                    <q-td key="bpRegion" :props="props">{{ props.row.bpRegion?.regionAreaName || "NA" }}</q-td>
                    <q-td key="assignedTo" :props="props">{{ props.row.assignedTo?.name || "NA" }}</q-td>
                    <q-td key="crmRemark" :props="props"><span v-html="props.row.crmRemark || 'NA'"></span></q-td>
                    <q-td key="deviceType" :props="props">{{ props.row.deviceType }}</q-td>
                    <q-td key="serviceRequestTicketStatus" :props="props">
                        <span class="label text-negative" v-if="props.row.serviceRequestTicketStatus == 10">SR_CANCELLED</span>
                        <span class="label" v-else>NA</span>
                    </q-td>
                    <q-td key="serviceRequestMode" :props="props">{{ props.row.serviceRequestMode || "NA" }}</q-td>
                    <q-td key="serviceRequestSubTicketStatus" :props="props">
                        <span class="label text-negative" v-if="props.row.serviceRequestSubTicketStatus == 10">SR_CANCELLED</span>
                        <span class="label" v-else>NA</span>
                    </q-td>
                </q-tr>
                <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                    <q-td colspan="100%">
                        <div class="row q-col-gutter-sm">
                            <div class="col-2">
                                <div class="text-left q-caption text-grey-8 text-weight-medium">Request Type</div>
                                <div v-for="col in props.row.subTicketsList" :key="'type-'+col.id">
                                    {{ col.serviceRequestType?.name || "NA" }}
                                </div>
                            </div>
                            <div class="col-2">
                                <div class="text-left q-caption text-grey-8 text-weight-medium">Issue Type</div>
                                <div v-for="col in props.row.subTicketsList" :key="'issue-'+col.id">
                                    {{ col.serviceRequestIssueType || "NA" }}
                                </div>
                            </div>
                            <div class="col-2">
                                <div class="text-left q-caption text-grey-8 text-weight-medium">Cancel Reason</div>
                                <div v-for="col in props.row.subTicketsList" :key="'cancel-'+col.id">
                                    {{ col.cancelReason || "NA" }}
                                </div>
                            </div>
                            <div class="col-2">
                                <div class="text-left q-caption text-grey-8 text-weight-medium">Service Remarks</div>
                                <div v-for="col in props.row.subTicketsList" :key="'remark-'+col.id">
                                    {{ col.serviceRemarks || "NA" }}
                                </div>
                            </div>
                        </div>
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:top>
                <div class="col-md-5">
                    <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.."
                        label="Search By ServiceReqTicketId, TID .." class="q-mr-lg q-py-sm" />
                </div>
            </template>
        </q-table>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: "cancelledInternal",
    data() {
        return {
            filterSearch: "",
            tableData: [],
            paginationControl: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
            tableAjaxLoading: false,
            columnData: [
                { name: "serviceReqTicketId", label: "ServiceReqTicketId", align: "left", field: "serviceReqTicketId" },
                { name: "tid", label: "TID", align: "left", field: "tid" },
                { name: "mid", label: "MID", align: "left", field: "mid" },
                { name: "createdDate", label: "CreatedDate", align: "left", field: "createdDate", sortable: true },
                { name: "updatedDate", label: "UpdatedDate", align: "left", field: "updatedDate" },
                { name: "meName", label: "ME Name", align: "left", field: "meName" },
                { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName },
                { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo?.name },
                { name: "crmRemark", label: "CRM Remark", align: "left", field: "crmRemark" },
                { name: "deviceType", label: "DeviceType", align: "left", field: "deviceType" },
                { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus" },
                { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode" },
                { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus" }
            ]
        };
    },
    computed: {
        ...mapGetters("serviceRequestSat", ["getserviceRequestCancelledDatas"]),
    },
    created() {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
    },
    methods: {
        ...mapActions("serviceRequestSat", ["FETCH_CANCELLED_SERVICE_REQUEST_DATAS"]),
        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCH_CANCELLED_SERVICE_REQUEST_DATAS({ pagination, filter }).then(() => {
                this.paginationControl = pagination;
                this.paginationControl.rowsNumber = this.getserviceRequestCancelledDatas.totalElements;
                this.paginationControl.page = this.getserviceRequestCancelledDatas.number + 1;
                this.tableData = (this.getserviceRequestCancelledDatas.content || []).filter(s => s.source === true);
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        }
    }
};
</script>