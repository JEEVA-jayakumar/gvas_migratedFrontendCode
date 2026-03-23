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
                <div class="row items-center gutter-y-sm justify-between">
                    <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
                        <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-6" align="right">
                        <q-select filter clearable v-model="formData.assignTo.id" separator color="grey-9"
                            :disable="formData.marsDeviceIdsCooked.length == 0" :options="assignToOptions"
                            placeholder="Assign To" />
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-6" align="right">
                        <q-select filter clearable v-model="formData.assignTo.region" separator color="grey-9"
                            :disable="formData.marsDeviceIdsCooked.length == 0" :options="assignToRegionOptions"
                            placeholder="Assign To Region" />
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-6" align="right">
                        <q-btn no-caps
                            :disabled="!formData.assignTo.id && !formData.assignTo.region"
                            label="Assign" class="common-dark-blue" @click="assignImplementationUser" />
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
                    <q-table :rows="tableData3" :columns="columnDataUnassigned"
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
                            <q-td :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
                        </template>
                        <template v-slot:body-cell-updatedDate="props">
                            <q-td :props="props">{{ $moment(props.row.updatedDate).format("Do MMM Y") }}</q-td>
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
                    <q-table :rows="tableData1" :columns="columnDataAssigned"
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
                                <q-td key="tid" :props="props">{{ props.row.tid }}</q-td>
                                <q-td key="mid" :props="props">{{ props.row.mid || "NA" }}</q-td>
                                <q-td key="createdDate" :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
                                <q-td key="updatedDate" :props="props">{{ $moment(props.row.updatedDate).format("Do MMM Y") }}</q-td>
                                <q-td key="meName" :props="props">{{ props.row.meName }}</q-td>
                                <q-td key="address" :props="props">{{ props.row.address }}</q-td>
                                <q-td key="contactNumber" :props="props">{{ props.row.contactNumber }}</q-td>
                                <q-td key="pincode" :props="props">{{ props.row.pincode }}</q-td>
                                <q-td key="bpRegion" :props="props">{{ props.row.bpRegion?.regionAreaName || "NA" }}</q-td>
                                <q-td key="assignedTo" :props="props">{{ props.row.assignedTo ? props.row.assignedTo.name + " | " + props.row.assignedTo.employeeID : "NA" }}</q-td>
                                <q-td key="crmRemark" :props="props"><span v-html="props.row.crmRemark || 'NA'"></span></q-td>
                                <q-td key="deviceType" :props="props">{{ props.row.deviceType }}</q-td>
                                <q-td key="serviceRequestSubTicketStatus" :props="props">
                                    {{ props.row.subTicketsList[0]?.serviceRequestSubTicketStatus?.name || "NA" }}
                                </q-td>
                                <q-td key="serviceRequestMode" :props="props">{{ props.row.serviceRequestMode }}</q-td>
                                <q-td key="serviceRequestTicketStatus" :props="props">{{ props.row.serviceRequestTicketStatus }}</q-td>
                                <q-td key="remarks" :props="props">{{ props.row.reAssignRemark || "NA" }}</q-td>
                                <q-td key="action" :props="props">
                                    <q-btn highlight push color="positive" size="sm" @click="fnReassignData(props.row)">Re-Assign</q-btn>
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
        <UpdateOpenedExternal v-if="propShowUpdateOpenedExternal" :propShowUpdateOpenedExternal="propShowUpdateOpenedExternal"
            :propRowDetails="propRowDetails" @emitfnshowUpdateOpenedExternal="fnReassignData" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import internalServiceRequestPopup from "../../components/sat/internalServiceRequestPopup.vue";
import UpdateOpenedExternal from "../../components/sat/UpdateOpenedExternal.vue";

export default {
    name: "openedExternal",
    components: {
        internalServiceRequestPopup,
        UpdateOpenedExternal
    },
    data() {
        return {
            propToggleServiceRequest: false,
            propShowUpdateOpenedExternal: false,
            propRowDetails: null,
            addtnServiceRequest: null,
            filterSearch: "",
            filterSearch1: "",
            selectedTab: "assigned",
            assignToOptions: [],
            assignToRegionOptions: [],
            tableData1: [],
            tableData3: [],
            columnDataAssigned: [
                { name: "serviceReqTicketId", label: "ServiceReqTicketId", align: "left", field: "serviceReqTicketId" },
                { name: "tid", label: "TID", align: "left", field: "tid" },
                { name: "mid", label: "MID", align: "left", field: "mid" },
                { name: "createdDate", label: "CreatedDate", align: "left", field: "createdDate", sortable: true },
                { name: "updatedDate", label: "UpdatedDate", align: "left", field: "updatedDate" },
                { name: "meName", label: "Merchant Name", align: "left", field: "meName" },
                { name: "address", label: "Address", align: "left", field: "address" },
                { name: "contactNumber", label: "Contact Number", align: "left", field: "contactNumber" },
                { name: "pincode", label: "Pincode", align: "left", field: "pincode" },
                { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName },
                { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo?.name },
                { name: "crmRemark", label: "CRM Remark", align: "left", field: "crmRemark" },
                { name: "deviceType", label: "DeviceType", align: "left", field: "deviceType" },
                { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus" },
                { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode" },
                { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus" },
                { name: "remarks", label: "Re-Assign Remarks", align: "left", field: "reAssignRemark" },
                { name: "action", label: "Re-Assign", align: "center", field: "action" }
            ],
            columnDataUnassigned: [
                { name: "serviceReqTicketId", label: "ServiceReqTicketId", align: "left", field: "serviceReqTicketId" },
                { name: "tid", label: "TID", align: "left", field: "tid" },
                { name: "mid", label: "MID", align: "left", field: "mid" },
                { name: "createdDate", label: "CreatedDate", align: "left", field: "createdDate", sortable: true },
                { name: "updatedDate", label: "UpdatedDate", align: "left", field: "updatedDate" },
                { name: "meName", label: "Merchant Name", align: "left", field: "meName" },
                { name: "address", label: "Address", align: "left", field: "address" },
                { name: "contactNumber", label: "Contact Number", align: "left", field: "contactNumber" },
                { name: "pincode", label: "Pincode", align: "left", field: "pincode" },
                { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName },
                { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo?.name },
                { name: "crmRemark", label: "CRM Remark", align: "left", field: "crmRemark" },
                { name: "deviceType", label: "DeviceType", align: "left", field: "deviceType" },
                { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus" },
                { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode" },
                { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus" }
            ],
            formData: {
                marsDeviceIdsCooked: [],
                assignTo: { id: "", region: "" },
            },
            paginationControl: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
            paginationControl1: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
            tableAjaxLoading: false,
            tableAjaxLoading1: false
        };
    },
    computed: {
        ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList", "getRegionList"]),
        ...mapGetters("serviceRequestPhonepeSat", ["getserviceRequestPhonepeUnassignedDatas", "getserviceRequestPhonepeAssignedDatas"]),
    },
    created() {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    },
    methods: {
        ...mapActions("serviceRequestPhonepeSat", ["FETCH_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS1", "PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE", "PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION", "FETCH_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS"]),
        ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST", "REGION_LIST"]),

        fnReassignData(rowDetails) {
            this.propShowUpdateOpenedExternal = !this.propShowUpdateOpenedExternal;
            if (rowDetails) this.propRowDetails = rowDetails;
            this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        },
        ajaxLoadAllLeadInfo1({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCH_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS1({ pagination, filter }).then(() => {
                this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
                    this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }));
                });
                this.REGION_LIST().then(() => {
                    this.assignToRegionOptions = this.getRegionList.map(v => ({ label: v.regionAreaName, value: v.regionAreaName }));
                });
                this.paginationControl1 = pagination;
                this.paginationControl1.rowsNumber = this.getserviceRequestPhonepeUnassignedDatas.totalElements;
                this.paginationControl1.page = this.getserviceRequestPhonepeUnassignedDatas.number + 1;
                this.tableData3 = (this.getserviceRequestPhonepeUnassignedDatas.content || []).filter(s => s.source === true);
                this.$q.loading.hide();
            }).catch(() => this.$q.loading.hide());
        },
        ajaxLoadAllLeadInfo({ pagination, filter }) {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.FETCH_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS({ pagination, filter }).then(() => {
                this.paginationControl = pagination;
                this.paginationControl.rowsNumber = this.getserviceRequestPhonepeAssignedDatas.totalElements;
                this.paginationControl.page = this.getserviceRequestPhonepeAssignedDatas.number + 1;
                this.tableData1 = (this.getserviceRequestPhonepeAssignedDatas.content || []).filter(s => s.source === true);
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
            if (this.formData.assignTo.id && this.formData.assignTo.region) {
                this.$q.notify({ color: "negative", position: "bottom", message: "Select Only One Request mode" });
                return;
            }

            this.$q.loading.show({ message: "Please wait.." });
            if (this.formData.assignTo.id) {
                let request = this.formData.marsDeviceIdsCooked.map(v => ({ ...v }));
                this.PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE({ request, userId: this.formData.assignTo.id }).then(res => {
                    if (res.status == 200) {
                        this.formData.marsDeviceIdsCooked = [];
                        this.formData.assignTo = { id: "", region: "" };
                        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!" });
                        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
                    }
                    this.$q.loading.hide();
                }).catch(() => this.$q.loading.hide());
            } else if (this.formData.assignTo.region) {
                let request = this.formData.marsDeviceIdsCooked.map(v => ({
                    serviceReqTicketId: v.serviceReqTicketId,
                    bpRegion: { regionAreaName: this.formData.assignTo.region }
                }));
                this.PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION(request).then(res => {
                    if (res.status == 200) {
                        this.formData.marsDeviceIdsCooked = [];
                        this.formData.assignTo = { id: "", region: "" };
                        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!" });
                        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
                    }
                    this.$q.loading.hide();
                }).catch(() => this.$q.loading.hide());
            }
        },
        toggleServiceRequest(leadDetails) {
            this.propToggleServiceRequest = !this.propToggleServiceRequest;
            if (leadDetails) this.addtnServiceRequest = leadDetails;
        }
    }
};
</script>