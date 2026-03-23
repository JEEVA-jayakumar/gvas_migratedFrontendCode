<template>
    <div class="q-pa-none">
        <!-- content -->
        <div>
            <internalServiceRequestPopup v-if="propToggleServiceRequest" :ServiceRequest="addtnServiceRequest"
                :propToggleServiceRequestPop="propToggleServiceRequest" @closeServiceRequest="toggleServiceRequest" />
        </div>
        <div>
            <!--START: table Footer -->
            <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
                <div class="row items-center gutter-y-sm">
                    <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
                        <span class="q-display-2">{{
                                formData.marsDeviceIdsCooked.length
                        }}</span>/ selected
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="auto">
                        <b>
                            <label>Request Mode</label>
                        </b>
                        <div class="col-md-2 col-sm-6 col-xs-6">
                            <q-radio v-for="(item, index) in requestOptions" :key="index" color="grey-9"
                                v-model.trim="formData.serviceRequestMode" :val="item.value" :label="item.label" />
                        </div>
                    </div>
                    <div v-if="formData.serviceRequestMode == 'Direct Dispatch'" class="col-md-3 col-sm-6 col-xs-6">
                        <q-select filter clearable v-model="formData.assignTo.id" separator color="grey-9" :options="assignToOptions"
                            placeholder="Assign To" />

                    </div>
                    <div v-if="formData.serviceRequestMode == 'SO'" class="col-md-3 col-sm-6 col-xs-6">
                        <q-select filter clearable v-model="formData.assignTo.id" separator color="grey-9" :options="assignToOptions"
                            placeholder="Assign To" />
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-6" align="right">
                        <q-btn no-caps :disabled="
                            formData.marsDeviceIdsCooked.length == 0
                        " label="Assign" class="common-dark-blue" @click="assignImplementationUser" />
                    </div>
                </div>
            </q-card>
            <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
                <div class="row items-center gutter-y-sm">
                    <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="row items-center">
                            <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
                        </div>
                    </div>
                </div>
            </q-card>
            <!--END: table Footer -->
            <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
                <q-tab color="dark" name="unAssigned" label="Unassigned" />
                <q-tab color="dark" name="assigned" label="Assigned" />
            </q-tabs>
            <q-tab-panels v-model="selectedTab" animated>
                <q-tab-panel name="unAssigned">
                    <q-table :rows="internalUnAssignedTableData" :columns="columnDataUnassigned"
                        table-class="customTableClass" :filter="filterSearch1" selection="multiple"
                        v-model:selected="formData.marsDeviceIdsCooked" v-model:pagination="paginationControl1" row-key="id"
                        :loading="tableAjaxLoading1" :rows-per-page-options="[5, 10, 15, 20]" color="dark"
                        @request="ajaxLoadAllLeadInfo1">
                        <template v-slot:body-cell-serviceReqTicketId="props">
                            <q-td :props="props" class="cursor-pointer" @click="toggleServiceRequest(props.row)">
                                <span class="label text-primary"># {{ props.row.serviceReqTicketId }}</span>
                            </q-td>
                        </template>

                        <template v-slot:body-cell-createdDate="props">
                            <q-td :props="props">
                                {{ $moment(props.row.createdDate).format("Do MMM Y") }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-updatedDate="props">
                            <q-td :props="props">
                                {{ $moment(props.row.updatedDate).format("Do MMM Y") }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-serviceRequestSubTicketStatus="props">
                            <q-td :props="props">
                                <span class="label text-positive"
                                    v-if="props.row.serviceRequestSubTicketStatus == 1">SR_TICKET_RAISED</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 2">SR_TICKET_ESCALATED_TO_SAT</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 3">SR_ASSIGNED_TO_ENGINEER</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 4">SR_ISSUE_RESOLVED_COURIERED</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 5">SR_DEVICE_COURIERED</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 6">SR_ISSUE_RESOLVED_REMOTELY</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 7">SR_SCHEDULED_ENGINEER_VISIT</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 8">SR_ISSUE_RESOLVED</span>
                                <span class="label text-positive"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 9">SR_MERCHANT_NOT_REACHABLE</span>
                                <span class="label text-negative"
                                    v-else-if="props.row.serviceRequestSubTicketStatus == 10">SR_CANCELLED</span>
                                <span class="label" v-else>NA</span>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-serviceRequestTicketStatus="props">
                            <q-td :props="props">
                                <span class="label text-positive"
                                    v-if="props.row.serviceRequestTicketStatus == 1">REQUEST_UNASSIGNED</span>
                                <span class="label text-negative"
                                    v-else-if="props.row.serviceRequestTicketStatus == 2">REQUEST_ASSIGNED</span>
                                <span class="label text-negative"
                                    v-else-if="props.row.serviceRequestTicketStatus == 3">REQUEST_CLOSED</span>
                                <span class="label" v-else>NA</span>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-kaptureDueDate="props">
                            <q-td :props="props">
                                {{ props.row.kaptureDueDate ? $moment(props.row.kaptureDueDate).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-appointmentDate="props">
                            <q-td :props="props">
                                {{ props.row.appointmentDate ? $moment(props.row.appointmentDate).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-courierDueDate="props">
                            <q-td :props="props">
                                {{ props.row.courierDueDate ? $moment(props.row.courierDueDate).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-scheduleDate="props">
                            <q-td :props="props">
                                {{ props.row.scheduleDate ? $moment(props.row.scheduleDate).format("Do MMM Y") : "NA" }}
                            </q-td>
                        </template>
                        <template v-slot:top>
                            <div class="col-md-5">
                                <q-input clearable color="grey-9" v-model="filterSearch1" placeholder="Type.."
                                    label="Search By ServiceReqTicketId, TID .." class="q-mr-lg q-py-sm" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>
                <q-tab-panel name="assigned">
                    <q-table :rows="internalAssignedTableData" :columns="columnDataAssigned"
                        table-class="customTableClass" :filter="filterSearch" v-model:pagination="paginationControl"
                        row-key="id" :loading="tableAjaxLoading"
                        :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo">

                        <template v-slot:body="props">
                            <q-tr :props="props" class="bottom-border">
                                <q-td key="serviceReqTicketId">
                                    <q-checkbox checked-icon="fas fa-chevron-up" unchecked-icon="fas fa-chevron-down"
                                        color="grey-9" v-model="props.row.expand" class="q-mr-md" />
                                    <span>{{ props.row.serviceReqTicketId }}</span>
                                </q-td>
                                <q-td key="tid" :props="props"> {{ props.row.tid }}</q-td>
                                <q-td key="mid" :props="props">
                                    <span v-if="props.row.mid != null">{{ props.row.mid }}</span>
                                    <span v-else>NA</span>
                                </q-td>
                                <q-td key="createdDate" :props="props"> {{ $moment(props.row.createdDate).format("Do MMM Y") }}
                                </q-td>
                                <q-td key="updatedDate" :props="props"> {{ $moment(props.row.updatedDate).format("Do MMM Y") }}
                                </q-td>
                                <q-td key="meName" :props="props"> {{ props.row.meName }}</q-td>
                                <q-td key="bpRegion" :props="props"> {{ props.row.bpRegion?.regionAreaName || "NA" }} </q-td>
                                <q-td key="assignedTo" :props="props"> {{ props.row.assignedTo?.name || "NA" }} </q-td>
                                <q-td key="crmRemark" :props="props">
                                    <span v-if="props.row.crmRemark != null" v-html="props.row.crmRemark"></span>
                                    <span v-else>NA</span>
                                </q-td>
                                <q-td key="deviceType" :props="props"> {{ props.row.deviceType }}</q-td>

                                <q-td key="serviceRequestTicketStatus" :props="props">
                                    <span class="label text-positive"
                                        v-if="props.row.serviceRequestTicketStatus == 1">REQUEST_UNASSIGNED</span>
                                    <span class="label text-negative"
                                        v-else-if="props.row.serviceRequestTicketStatus == 2">REQUEST_ASSIGNED</span>
                                    <span class="label text-negative"
                                        v-else-if="props.row.serviceRequestTicketStatus == 3">REQUEST_CLOSED</span>
                                    <span class="label" v-else>NA</span>
                                </q-td>
                                <q-td key="serviceRequestMode" :props="props"> {{ props.row.serviceRequestMode }}</q-td>
                                <q-td key="serviceRequestSubTicketStatus" :props="props">
                                    <span class="label text-positive"
                                        v-if="props.row.serviceRequestSubTicketStatus == 1">SR_TICKET_RAISED</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 2">SR_TICKET_ESCALATED_TO_SAT</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 3">SR_ASSIGNED_TO_ENGINEER</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 4">SR_ISSUE_RESOLVED_COURIERED</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 5">SR_DEVICE_COURIERED</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 6">SR_ISSUE_RESOLVED_REMOTELY</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 7">SR_SCHEDULED_ENGINEER_VISIT</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 8">SR_ISSUE_RESOLVED</span>
                                    <span class="label text-positive"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 9">SR_MERCHANT_NOT_REACHABLE</span>
                                    <span class="label text-negative"
                                        v-else-if="props.row.serviceRequestSubTicketStatus == 10">SR_CANCELLED</span>
                                    <span class="label" v-else>NA</span>
                                </q-td>
                            </q-tr>
                            <!-- START: table expand values -->
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
                                                {{ col.serviceRequestIssueType?.name || "NA" }}
                                            </div>
                                        </div>
                                        <div class="col-2">
                                            <div class="text-left q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                                            <div v-for="col in props.row.subTicketsList" :key="'status-'+col.id">
                                                {{ col.serviceRequestSubTicketStatus?.name || "NA" }}
                                            </div>
                                        </div>
                                        <div class="col-2">
                                            <div class="text-left q-caption text-grey-8 text-weight-medium">Schedule Date</div>
                                            <div v-for="col in props.row.subTicketsList" :key="'date-'+col.id">
                                                {{ col.scheduleDate || "NA" }}
                                            </div>
                                        </div>
                                        <div class="col-2">
                                            <div class="text-left q-caption text-grey-8 text-weight-medium">Remark</div>
                                            <div v-for="col in props.row.subTicketsList" :key="'remark-'+col.id">
                                                {{ col.remark || "NA" }}
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
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import internalServiceRequestPopup from "../../components/sat/internalServiceRequestPopup.vue";

export default {
    name: "opened",
    components: {
        internalServiceRequestPopup,
    },
    data() {
        return {
            propToggleServiceRequest: false,
            addtnServiceRequest: null,
            filterSearch: "",
            filterSearch1: "",
            selectedTab: "assigned",
            assignToOptions: [],
            internalUnAssignedTableData: [],
            internalAssignedTableData: [],
            requestOptions: [
                { label: "SO", value: "SO" },
            ],
            columnDataAssigned: [
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
                { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus" },
                { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode" },
                { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus" },
            ],
            columnDataUnassigned: [
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
                { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus" },
                { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode" },
                { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus" },
            ],
            formData: {
                serviceRequestMode: "",
                marsDeviceIdsCooked: [],
                assignTo: { id: "" },
            },
            paginationControl: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
            paginationControl1: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
            tableAjaxLoading: false,
            tableAjaxLoading1: false,
        };
    },
    computed: {
        ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
        ...mapGetters("serviceRequestSat", ["getserviceRequestUnassignedDatas", "getserviceRequestassignedDatas"]),
    },
    created() {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    },
    methods: {
        ...mapActions("serviceRequestSat", ["FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS", "SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE", "FETCH_ASSIGNED_SERVICE_REQUEST_DATAS"]),
        ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

        ajaxLoadAllLeadInfo1({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS({ pagination, filter }).then(() => {
                this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
                    this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name, value: v.id }));
                });
                this.paginationControl1 = pagination;
                this.paginationControl1.rowsNumber = this.getserviceRequestUnassignedDatas.totalElements;
                this.paginationControl1.page = this.getserviceRequestUnassignedDatas.number + 1;
                this.internalUnAssignedTableData = (this.getserviceRequestUnassignedDatas.content || []).filter(s => s.source === true);
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCH_ASSIGNED_SERVICE_REQUEST_DATAS({ pagination, filter }).then(() => {
                this.paginationControl = pagination;
                this.paginationControl.rowsNumber = this.getserviceRequestassignedDatas.totalElements;
                this.paginationControl.page = this.getserviceRequestassignedDatas.number + 1;
                this.internalAssignedTableData = (this.getserviceRequestassignedDatas.content || []).filter(s => s.source === true);
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        goToUnassignedTab(tab) {
            if (tab == "unAssigned") {
                this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
            } else {
                this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
            }
        },
        assignImplementationUser() {
            if (this.formData.marsDeviceIdsCooked.length == 0) {
                this.$q.notify({ color: "negative", position: "bottom", message: "Select atleast one item to assign" });
                return;
            }
            if (!this.formData.assignTo.id) {
                this.$q.notify({ color: "negative", position: "bottom", message: "Assign To cannot be empty!" });
                return;
            }
            let request = this.formData.marsDeviceIdsCooked.map(v => ({ ...v, serviceRequestMode: this.formData.serviceRequestMode }));
            this.SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE({ request, userId: this.formData.assignTo.id }).then((res) => {
                if (res.status == 200) {
                    this.formData.marsDeviceIdsCooked = [];
                    this.formData.assignTo = { id: "" };
                    this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!" });
                    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
                }
            }).catch(() => {
                this.$q.notify({ color: "negative", position: "bottom", message: "Please try again" });
            });
        },
        toggleServiceRequest(leadDetails) {
            this.propToggleServiceRequest = !this.propToggleServiceRequest;
            if (leadDetails != undefined) {
                this.addtnServiceRequest = leadDetails;
            }
        },
    },
};
</script>