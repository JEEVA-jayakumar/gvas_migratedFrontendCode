<template>
    <q-page>
        <!-- content -->
        <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      > Bijlipay Service Request</div>
        <div>
            <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
               <q-tab color="dark" name="opened" label="Opened" />
                <q-tab color="dark" name="closed" label="Closed" />
                <q-tab color="dark" name="cancel" label="cancelled" />
            </q-tabs>

          <q-tab-panels v-model="selectedTab" animated>
            <q-tab-panel name="opened">
              <opened/>
            </q-tab-panel>
            <q-tab-panel name="cancel">
              <cancelledInternal/>
            </q-tab-panel>
            <q-tab-panel name="closed">
                    <!--STARTv-model: table Data -->
                    <q-table :rows="internalClosedTableData" :columns="columnDataclosed" table-class="customTableClass"
                        :filter="filterSearch" v-model:pagination="paginationControl2"
                        v-model:selected="formData.marsDeviceIdsCookedUnAssinged" row-key="id" :loading="tableAjaxLoading"
                        :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo2">

                        <!--START: table header -->
                        <template v-slot:top-row="props">
                            <q-tr>
                                <q-th auto-width></q-th>
                                <q-th v-for="col in props.columns" :key="col.name" :props="props">{{ col.label }}</q-th>
                            </q-tr>
                        </template>
                        <!--END: table header -->
                        <!--START: Table body -->
                        <template v-slot:body="props">
                            <!--START: table rows -->
                            <q-tr :props="props" class="bottom-border">
                                
                                <q-td key="serviceReqTicketId">
                                    <q-checkbox checked-icon="fas fa-chevron-up" unchecked-icon="fas fa-chevron-down"
                                        color="grey-9" v-model="props.row.expand" class="q-mr-md"
                                        @update:model-value="expandRowPlease(props.row)" />
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
                                <q-td key="bpRegion" :props="props"> {{ props.row.bpRegion.regionAreaName }} </q-td>
                                <q-td key="assignedTo" :props="props">  {{ props.row.assignedTo == null ? "NA" : props.row.assignedTo.name  }} </q-td>
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
                                <q-td key="serviceRequestMode" :props="props"> {{ props.row.serviceRequestMode == null ? "NA" : props.row.serviceRequestMode }}</q-td>
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
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Request Type
                                    </div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                                            <span>
                                                {{ col.serviceRequestType != null ? col.serviceRequestType.name : "NA"}}
                                            </span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">IssueType</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.serviceRequestIssueType != null ? col.serviceRequestIssueType : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>
                                            {{ col.serviceRequestSubTicketStatus != null ? col.serviceRequestSubTicketStatus.name : "NA" }}
                                            </span><br/>                                   
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Schedule Date</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.scheduleDate != null ? col.scheduleDate : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Pod Number</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.podNumber != null ? col.podNumber : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Service Remarks
                                    </div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                                            <span>{{ col.serviceRemarks != null ? col.serviceRemarks : "NA"}}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Cancel Reason</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.cancelReason != null ? col.cancelReason : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Issue Remark</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.issueRemark != null ? col.issueRemark : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Remark</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.remark != null ? col.remark : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Latitude</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.latitude != null ? col.latitude : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Longitude</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.longitude != null ? col.longitude : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Implementation Form</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.implementationForm != null ? col.implementationForm : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Picture Of Shop</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.pictureOfShop != null ? col.pictureOfShop : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Old Sim Number</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.oldSimNumber != null ? col.oldSimNumber : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Old Sim Network</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.oldSimNetwork != null ? col.oldSimNetwork : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">New Sim Number</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.newSimNumber != null ? col.newSimNumber : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">New Sim Network</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.newSimNetwork != null ? col.newSimNetwork : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Scan Sim Number</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.scanSimNumber != null ? col.scanSimNumber : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Scan Device</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.scanDeviceSerialNumber != null ? col.scanDeviceSerialNumber : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Part Type</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.partType != null ? col.partType : "NA" }}</span><br/>
                                        </div>
                                    </div>
                                </q-td>
                                <q-td>
                                    <div class="text-left q-caption text-grey-8 text-weight-medium">Paper Roll Count</div>
                                    <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                                        <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id"
                                            :props="props">
                                            <span>{{ col.paperRollCount != null ? col.paperRollCount : "NA" }}</span><br/>
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
                    <!--END: table Data -->
                </q-tab-panel>
          </q-tab-panels>
            <div class="row items-center gutter-y-sm">
                <div class="col-md-9 col-sm-12 col-xs-12">
                    <div class="row items-center"></div>
                </div>
            </div>
           </div>
    </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import opened from "../../components/sat/opened.vue";
import cancelledInternal from "../../components/sat/cancelledInternal.vue";
export default {
    name: "implementationQueue",
     components: {
      opened,
      cancelledInternal
    },
    data() {
        return {
            propToggleLeadInformation: false,
            addtnLeadInformation: null,

            filterSearch: "",
            filterSearch1: "",
            filterSearch2: "",
            selectedTab: "assigned",
            assignTo: "",
            assignToOptions: [],
            tableData: [],
            tableData1: [],
            internalUnAssignedTableData: [],
            internalAssignedTableData: [],
            internalClosedTableData: [],
            tableData2: [],
            requestOptions: [
                {
                    label: "Direct Dispatch",
                    value: "Direct Dispatch",
                },
                {
                    label: "SO",
                    value: "SO",
                },
            ],
            //Defining columns for table
            columnDataclosed: [
            {
                    name: "serviceReqTicketId",
                    required: true,
                    label: "ServiceReqTicketId",
                    align: "left",
                    field: row => {
                        return row.serviceReqTicketId;
                    },
                    sortable: false
                },
                {
                    name: "tid",
                    required: true,
                    label: "TID",
                    align: "left",
                    field: (row) => {
                        return row.tid == null
                            ? "NA"
                            : row.tid;
                    },
                    sortable: false,
                },
                {
                    name: "mid",
                    required: true,
                    label: "MID",
                    align: "left",
                    field: (row) => {
                        return row.mid == null
                            ? "NA"
                            : row.mid;
                    },
                    sortable: false,
                },
                {
                    name: "createdDate",
                    required: true,
                    label: "CreatedDate",
                    align: "left",
                    field: (row) => {
                        return row.createdDate
                    },
                    sortable: true,
                },
                {
                    name: "updatedDate",
                    required: true,
                    label: "UpdatedDate",
                    align: "left",
                    field: (row) => {
                        return row.updatedDate
                    },
                    sortable: false,
                },

                {
                    name: "meName",
                    required: true,
                    label: "ME Name",
                    align: "left",
                    field: (row) => {
                        return row.meName == null
                            ? "NA"
                            : row.meName;
                    },
                    sortable: false,
                },
                {
                    name: "bpRegion",
                    required: true,
                    label: "BpRegion",
                    align: "left",
                    field: (row) => {
                        return row.bpRegion == null
                            ? "NA"
                            : row.bpRegion.regionAreaName;
                    },
                    sortable: false,
                },
                {
                    name: "assignedTo",
                    required: true,
                    label: "AssignedTo",
                    align: "left",
                    field: (row) => {
                        return row.assignedTo == null
                            ? "NA"
                            : row.assignedTo.name;
                    },
                    sortable: false,
                },
                {
                    name: "crmRemark",
                    required: true,
                    label: "CRM Remark",
                    align: "left",
                    field: (row) => {
                        return row.crmRemark == null
                            ? "NA"
                            : row.crmRemark;
                    },
                    sortable: false,
                },
                {
                    name: "deviceType",
                    required: true,
                    label: "DeviceType",
                    align: "left",
                    field: (row) => {
                        return row.deviceType == null
                            ? "NA"
                            : row.deviceType;
                    },
                    sortable: false,
                },
                {
                    name: "serviceRequestSubTicketStatus",
                    required: true,
                    label: "ServiceReqIssueStatus",
                    align: "left",
                    field: (row) => {
                        return row.serviceRequestSubTicketStatus
                    },
                    sortable: false,
                },
                {
                    name: "serviceRequestMode",
                    required: true,
                    label: "RequestMode",
                    align: "left",
                    field: (row) => {
                        return row.serviceRequestMode == null
                            ? "NA"
                            : row.serviceRequestMode;
                    },
                    sortable: false,
                },
                {
                    name: "serviceRequestTicketStatus",
                    required: true,
                    label: "TicketStatus",
                    align: "left",
                    field: (row) => {
                        return row.serviceRequestTicketStatus
                    },
                    sortable: false,
                },
            ],
            
            currentDeviceInfo: {},
            showDeviceAddressModal: false,
            formData: {
                marsDeviceIdsCooked: [],
                marsDeviceIdsCookedUnAssinged: [],
                triggerWelcomeMail: false,
                assignTo: {
                    id: ""
                },
                podNumber: "",
            },
            paginationControl: {
                sortBy: "createdDate",
                descending: false,
                page: 1,
                rowsPerPage: 10,
            },
            paginationControl1: {
                sortBy: "createdDate",
                descending: false,
                page: 1,
                rowsPerPage: 10,
            },
            paginationControl2: {
                sortBy: "createdDate",
                descending: false,
                page: 1,
                rowsPerPage: 10,
            },
            tableAjaxLoading: false,
            tableAjaxLoading1: false,
        };
    },

    computed: {
        ...mapGetters("ImplementationExecutive", [
            "getImplementationExecutiveList",
        ]),
        ...mapGetters("serviceRequestSat", ["getserviceRequestUnassignedDatas", "getserviceRequestassignedDatas", "getserviceRequestClosedDatas"]),
        ...mapGetters("SuperAdminUsers", ["getAllStatesData"]),
    },
    created() {
        this.ajaxLoadAllLeadInfo2({
            pagination: this.paginationControl2,
            filter: this.filterSearch2,
        })
        this.getPincodeInformations();
    },
    methods: {
        ...mapActions("serviceRequestSat", ["FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS", "SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE", "FETCH_ASSIGNED_SERVICE_REQUEST_DATAS", "FETCH_CLOSED_SERVICE_REQUEST_DATAS"]),
        ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
        ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

        getPincodeInformations() {
            this.FETCH_ALL_STATES_DATA();
        },
        ajaxLoadAllLeadInfo2({ pagination, filter }) {
            this.$q.loading.show({
                delay: 0,
                spinnerColor: "purple-9",
                message: "Fetching data ..",
            });
            this.FETCH_CLOSED_SERVICE_REQUEST_DATAS({ pagination, filter }).then((res) => {
                    this.paginationControl2 = pagination;
                    this.paginationControl2.rowsNumber =
                        this.getserviceRequestClosedDatas.totalElements;
                    this.paginationControl2.page =
                        this.getserviceRequestClosedDatas.number + 1;
                    this.tableData2 = this.getserviceRequestClosedDatas.content;
                    this.internalClosedTableData = this.tableData2.filter(service => service.source == true);
                    if (this.getserviceRequestClosedDatas.sort != null) {
                        this.paginationControl2.sortBy =
                            this.getserviceRequestClosedDatas.sort[0].property;
                        this.paginationControl2.descending =
                            this.getserviceRequestClosedDatas.sort[0].ascending;
                    }
                    this.$q.loading.hide();
                })
                .catch(() => {
                    this.$q.loading.hide();
                });
        },
        goToUnassignedTab(tab) {
            if (tab == "unAssigned") {
                this.ajaxLoadAllLeadInfo1({
                    pagination: this.paginationControl1,
                    filter: this.filterSearch1,
                });
            }
            else if (tab == "assigned") {
                this.ajaxLoadAllLeadInfo({
                    pagination: this.paginationControl,
                    filter: this.filterSearch,
                });
            } else {
                this.ajaxLoadAllLeadInfo2({
                    pagination: this.paginationControl2,
                    filter: this.filterSearch2,
                });
            }
        },
        expandRowPlease(row) {
            row.expand = !row.expand;
        }
    },
};
</script>

<style scoped>
.customTd {
    text-align: left !important;
    word-wrap: break-word;
    white-space: normal;
}
.customTd.customCellLength {
    min-width: 300px !important;
    overflow-x: auto;
}
</style>