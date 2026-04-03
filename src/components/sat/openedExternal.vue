<template>
  <q-page>
    <!-- content -->
    <div>
      <internalServiceRequestPopup
        v-if="propToggleServiceRequest"
        :ServiceRequest="addtnServiceRequest"
        :propToggleServiceRequestPop="propToggleServiceRequest"
        @closeServiceRequest="toggleServiceRequest"
      />
    </div>
    <div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm" style="display: flex; justify-content: space-between; width: 100%;">
          <div
            class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium"
            align="left"
          >
            <span class="q-display-2">{{
              formData.marsDeviceIdsCooked.length
            }}</span
            >/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" style="flex: 1;  max-width: 200px;" align="right">
            <q-select
              use-input
              @filter="filterAssignTo"
              clearable
              v-model="formData.assignTo.id"
              emit-value
              map-options
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length == 0"
              :options="filteredAssignToOptions"
              placeholder="Assign To"
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" style="flex: 1;  max-width: 200px;" align="right">
            <q-select
              use-input
              @filter="filterAssignToRegion"
              clearable
              v-model="formData.assignTo.region"
              emit-value
              map-options
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length == 0"
              :options="filteredAssignToRegionOptions"
              placeholder="Assign To Region"
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
               :disabled="((this.formData.assignTo.id == '' || this.formData.assignTo.id == null) && (this.formData.assignTo.region == '' || this.formData.assignTo.region == null))"
              label="Assign"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
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
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          color="dark"
          name="unAssigned"
          label="Unassigned"
        />
        <q-tab color="dark" name="assigned" label="Assigned" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="unAssigned" class="q-pa-none">
          <q-table
            :rows="tableData3"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch1"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-serviceReqTicketId="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleServiceRequest(props.row)"
              >
                <span class="label text-primary"
                  ># {{ props.row.serviceReqTicketId }}</span
                >
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

            <template v-slot:body-cell-serviceRequestTicketStatus="props">
              <q-td :props="props">
                <span
                  class="label text-positive"
                  v-if="props.row.serviceRequestTicketStatus == 1"
                  >REQUEST_UNASSIGNED</span
                >
                <span
                  class="label text-negative"
                  v-else-if="props.row.serviceRequestTicketStatus == 2"
                  >REQUEST_ASSIGNED</span
                >
                <span
                  class="label text-negative"
                  v-else-if="props.row.serviceRequestTicketStatus == 3"
                  >REQUEST_CLOSED</span
                >
                <span class="label" v-else>NA</span>
              </q-td>
            </template>

            <template v-slot:body-cell-kaptureDueDate="props">
              <q-td :props="props">
                {{
                  props.row.kaptureDueDate == null
                    ? "NA"
                    : $moment(props.row.kaptureDueDate).format("Do MMM Y")
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-appointmentDate="props">
              <q-td :props="props">
                {{
                  props.row.appointmentDate == null
                    ? "NA"
                    : $moment(props.row.appointmentDate).format("Do MMM Y")
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-courierDueDate="props">
              <q-td :props="props">
                {{
                  props.row.courierDueDate == null
                    ? "NA"
                    : $moment(props.row.courierDueDate).format("Do MMM Y")
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-scheduleDate="props">
              <q-td :props="props">
                {{
                  props.row.scheduleDate == null
                    ? "NA"
                    : $moment(props.row.scheduleDate).format("Do MMM Y")
                }}
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch1"
                  placeholder="Type.."
                  label="Search By ServiceReqTicketId, TID .."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="assigned" class="q-pa-none">
          <q-table
            :rows="tableData1"
            :columns="columnDataAssigned"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="bottom-border">
                <q-td key="serviceReqTicketId" :props="props">
                  <q-checkbox
                    checked-icon="fas fa-chevron-up"
                    unchecked-icon="fas fa-chevron-down"
                    color="grey-9"
                    v-model="props.row.expand"
                    class="q-mr-md"
                    @update:model-value="expandRowPlease(props.row)"
                  />
                  <span>{{ props.row.serviceReqTicketId }}</span>
                </q-td>
                <q-td key="tid" :props="props"> {{ props.row.tid }}</q-td>
                <q-td key="mid" :props="props">
                  <span v-if="props.row.mid != null">{{ props.row.mid }}</span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="createdDate" :props="props">
                  {{ $moment(props.row.createdDate).format("Do MMM Y") }}
                </q-td>
                <q-td key="updatedDate" :props="props">
                  {{ $moment(props.row.updatedDate).format("Do MMM Y") }}
                </q-td>
                <q-td key="meName" :props="props"> {{ props.row.meName }}</q-td>
                <q-td key="address" :props="props"> {{ props.row.address }}</q-td>
                <q-td key="contactNumber" :props="props"> {{ props.row.contactNumber }}</q-td>
                <q-td key="pincode" :props="props"> {{ props.row.pincode }}</q-td>
                <q-td key="bpRegion" :props="props">
                  {{ props.row.bpRegion ? props.row.bpRegion.regionAreaName : 'NA' }}
                </q-td>
                <q-td key="assignedTo" :props="props">
                  {{
                    props.row.assignedTo == null
                      ? "NA"
                      : props.row.assignedTo.name +
                        " | " +
                        props.row.assignedTo.employeeID
                  }}
                </q-td>
                <q-td key="crmRemark" :props="props">
                  <span
                    v-if="props.row.crmRemark != null"
                    v-html="props.row.crmRemark"
                  ></span>
                  <span v-else>NA</span>
                </q-td>

                <q-td key="deviceType" :props="props">
                  {{ props.row.deviceType }}</q-td
                >
                <q-td key="serviceRequestSubTicketStatus" :props="props">
                  {{
                    props.row.subTicketsList[0] == null
                      ? "NA"
                      : props.row.subTicketsList[0]
                          .serviceRequestSubTicketStatus.name
                  }}</q-td
                >

                <q-td key="serviceRequestMode" :props="props">
                  {{ props.row.serviceRequestMode }}</q-td
                >

                <q-td key="serviceRequestTicketStatus" :props="props">
                  <span
                    class="label text-positive"
                    v-if="props.row.serviceRequestTicketStatus == 1"
                    >REQUEST_UNASSIGNED</span
                  >
                  <span
                    class="label text-negative"
                    v-else-if="props.row.serviceRequestTicketStatus == 2"
                    >REQUEST_ASSIGNED</span
                  >
                  <span
                    class="label text-negative"
                    v-else-if="props.row.serviceRequestTicketStatus == 3"
                    >REQUEST_CLOSED</span
                  >
                  <span class="label" v-else>NA</span>
                </q-td>
                <q-td key="remarks" :props="props">
                  <span
                    v-if="props.row.reAssignRemark != null"
                    v-html="props.row.reAssignRemark"
                  ></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="action" :props="props" align="center">
                  <q-btn

                    push
                    class="q-mx-sm"
                    color="positive"
                    size="sm"
                    @click="fnReassignData(props.row)"
                    >Re-Assign</q-btn
                  >
                </q-td>
              </q-tr>
              <!-- START: table expand values -->

              <q-tr
                v-show="props.row.expand"
                :props="props"
                class="wordWrapCustom bottom-border"
              >
                <q-td colspan="100%">
                   <div class="row q-col-gutter-sm q-pa-sm">
                      <div class="col-2">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">Request Type</div>
                        <div v-for="col in props.row.subTicketsList" :key="'type-'+col.id">
                          {{ col.serviceRequestType ? col.serviceRequestType.name : "NA" }}
                        </div>
                      </div>
                      <div class="col-2">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">IssueType</div>
                        <div v-for="col in props.row.subTicketsList" :key="'issue-'+col.id">
                          {{ col.serviceRequestIssueType ? col.serviceRequestIssueType.name : "NA" }}
                        </div>
                      </div>
                      <div class="col-2">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                        <div v-for="col in props.row.subTicketsList" :key="'status-'+col.id">
                          {{ col.serviceRequestSubTicketStatus ? col.serviceRequestSubTicketStatus.name : "NA" }}
                        </div>
                      </div>
                      <div class="col-2">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">Schedule Date</div>
                        <div v-for="col in props.row.subTicketsList" :key="'sched-'+col.id">
                          {{ col.scheduleDate || "NA" }}
                        </div>
                      </div>
                      <div class="col-2">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">Pod Number</div>
                        <div v-for="col in props.row.subTicketsList" :key="'pod-'+col.id">
                          {{ col.podNumber || "NA" }}
                        </div>
                      </div>
                      <div class="col-2">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">Service Remarks</div>
                        <div v-for="col in props.row.subTicketsList" :key="'rem-'+col.id">
                          {{ col.serviceRemarks || "NA" }}
                        </div>
                      </div>
                   </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By ServiceReqTicketId, TID .."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <UpdateOpenedExternal
        v-if="propShowUpdateOpenedExternal"
        :propShowUpdateOpenedExternal="propShowUpdateOpenedExternal"
        :propRowDetails="propRowDetails"
        @emitfnshowUpdateOpenedExternal="fnReassignData"
      ></UpdateOpenedExternal>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import internalServiceRequestPopup from "../../components/sat/internalServiceRequestPopup.vue";
import reOpenExternal from "../../components/sat/reOpenExternal.vue";
import UpdateOpenedExternal from "../../components/sat/UpdateOpenedExternal.vue";

export default {
  name: "openedExternal",
  components: {
    internalServiceRequestPopup,
    reOpenExternal,
    UpdateOpenedExternal
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propToggleServiceRequest: false,
      propShowUpdateOpenedExternal: false,
      addtnLeadInformation: null,
      addtnServiceRequest: null,
      propRowDetails: null,

      filterSearch: "",
      filterSearch1: "",
      filterSearch2: "",
      selectedTab: "assigned",
      assignToOptions: [],
      filteredAssignToOptions: [],
      assignToRegionOptions: [],
      filteredAssignToRegionOptions: [],
      tableData1: [],
      tableData3: [],
      externalUnAssignedTableData: [],
      externalAssignedTableData: [],

      columnDataAssigned: [
        {
          name: "serviceReqTicketId",
          required: true,
          label: "ServiceReqTicketId",
          align: "left",
          field: row => row.serviceReqTicketId || "NA",
          sortable: false
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: row => row.tid || "NA",
          sortable: false
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: row => row.mid || "NA",
          sortable: false
        },
        {
          name: "createdDate",
          required: true,
          label: "CreatedDate",
          align: "left",
          field: row => row.createdDate,
          sortable: true
        },
        {
          name: "updatedDate",
          required: true,
          label: "UpdatedDate",
          align: "left",
          field: row => row.updatedDate,
          sortable: false
        },
        {
          name: "meName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.meName || "NA",
          sortable: false
        },
        {
          name: "address",
          required: true,
          label: "Address",
          align: "left",
          field: row => row.address || "NA",
          sortable: false
        },
        {
          name: "contactNumber",
          required: true,
          label: "Contact Number",
          align: "left",
          field: row => row.contactNumber || "NA",
          sortable: false
        },
        {
          name: "pincode",
          required: true,
          label: "Pincode",
          align: "left",
          field: row => row.pincode || "NA",
          sortable: false
        },
        {
          name: "bpRegion",
          required: true,
          label: "BpRegion",
          align: "left",
          field: row => row.bpRegion ? row.bpRegion.regionAreaName : "NA",
          sortable: false
        },
        {
          name: "assignedTo",
          required: true,
          label: "AssignedTo",
          align: "left",
          field: row => row.assignedTo ? row.assignedTo.name + " | " + row.assignedTo.employeeID : "NA",
          sortable: false
        },
        {
          name: "crmRemark",
          required: true,
          label: "CRM Remark",
          align: "left",
          field: row => row.crmRemark || "NA",
          sortable: false
        },
        {
          name: "deviceType",
          required: true,
          label: "DeviceType",
          align: "left",
          field: row => row.deviceType || "NA",
          sortable: false
        },
        {
          name: "serviceRequestSubTicketStatus",
          required: true,
          label: "ServiceReqIssueStatus",
          align: "left",
          field: row => {
            let issues = [];
            if (row.subTicketsList && row.subTicketsList.length > 0) {
              row.subTicketsList.forEach((element, index) => {
                if (element.serviceRequestSubTicketStatus != null) {
                  issues.push(
                    (index + 1) + "." + element.serviceRequestSubTicketStatus.name
                  );
                }
              });
            }
            return issues.join(", ");
          },
          sortable: false
        },
        {
          name: "serviceRequestMode",
          required: true,
          label: "RequestMode",
          align: "left",
          field: row => row.serviceRequestMode || "NA",
          sortable: false
        },
        {
          name: "serviceRequestTicketStatus",
          required: true,
          label: "TicketStatus",
          align: "left",
          field: row => row.serviceRequestTicketStatus,
          sortable: false
        },
        {
          name: "remarks",
          required: true,
          label: "Re-Assign Remarks",
          align: "left",
          field: row => row.reAssignRemark,
          sortable: false
        },
        {
          name: "action",
          required: true,
          label: "Re-Assign",
          align: "center",
          field: "action",
          sortable: false
        }
      ],

      columnDataUnassigned: [
        {
          name: "serviceReqTicketId",
          required: true,
          label: "ServiceReqTicketId",
          align: "left",
          field: row => row.serviceReqTicketId,
          sortable: false
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: row => row.tid || "NA",
          sortable: false
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: row => row.mid || "NA",
          sortable: false
        },
        {
          name: "createdDate",
          required: true,
          label: "CreatedDate",
          align: "left",
          field: row => row.createdDate,
          sortable: true
        },
        {
          name: "updatedDate",
          required: true,
          label: "UpdatedDate",
          align: "left",
          field: row => row.updatedDate,
          sortable: false
        },
        {
          name: "meName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.meName || "NA",
          sortable: false
        },
        {
          name: "address",
          required: true,
          label: "Address",
          align: "left",
          field: row => row.address || "NA",
          sortable: false
        },
        {
          name: "contactNumber",
          required: true,
          label: "Contact Number",
          align: "left",
          field: row => row.contactNumber || "NA",
          sortable: false
        },
        {
          name: "pincode",
          required: true,
          label: "Pincode",
          align: "left",
          field: row => row.pincode || "NA",
          sortable: false
        },
        {
          name: "bpRegion",
          required: true,
          label: "BpRegion",
          align: "left",
          field: row => row.bpRegion ? row.bpRegion.regionAreaName : "NA",
          sortable: false
        },
        {
          name: "assignedTo",
          required: true,
          label: "AssignedTo",
          align: "left",
          field: row => row.assignedTo ? row.assignedTo.name + " | " + row.assignedTo.employeeID : "NA",
          sortable: false
        },
        {
          name: "crmRemark",
          required: true,
          label: "CRM Remark",
          align: "left",
          field: row => row.crmRemark || "NA",
          sortable: false
        },
        {
          name: "deviceType",
          required: true,
          label: "DeviceType",
          align: "left",
          field: row => row.deviceType || "NA",
          sortable: false
        },
        {
          name: "serviceRequestSubTicketStatus",
          required: true,
          label: "ServiceReqIssueStatus",
          align: "left",
          field: row => (row.subTicketsList && row.subTicketsList[0]) ? row.subTicketsList[0].serviceRequestSubTicketStatus.name : "NA",
          sortable: false
        },
        {
          name: "serviceRequestMode",
          required: true,
          label: "RequestMode",
          align: "left",
          field: row => row.serviceRequestMode || "NA",
          sortable: false
        },
        {
          name: "serviceRequestTicketStatus",
          required: true,
          label: "TicketStatus",
          align: "left",
          field: row => row.serviceRequestTicketStatus,
          sortable: false
        }
      ],
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: {
          id: "",
          region: ""
        },
        podNumber: ""
      },
      paginationControl: {
        sortBy: "createdDate",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      paginationControl1: {
        sortBy: "createdDate",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    };
  },

  computed: {
    ...mapGetters("DeviceReplacement", [
      "getDeviceReplacementQueueAssignedList",
      "getDeviceReplacementQueueUnassignedList"
    ]),
    ...mapGetters("ImplementationExecutive", [
      "getImplementationExecutiveList","getRegionList"
    ]),
    ...mapGetters("serviceRequestPhonepeSat", [
      "getserviceRequestPhonepeUnassignedDatas",
      "getserviceRequestPhonepeAssignedDatas",
      "getPhonepeAssignRegion"
    ]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filterSearch
    });
    this.ajaxLoadAllLeadInfo1({
      pagination: this.paginationControl1,
      filter: this.filterSearch1
    });
    this.getPincodeInformations();
  },

  methods: {
    ...mapActions("DeviceReplacement", [
      "DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST",
      "DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST",
      "DEVICE_REPLACEMENT_QUEUE_SUBMIT"
    ]),
    ...mapActions("serviceRequestPhonepeSat", [
      "FETCH_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS1",
      "PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE",
      "PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION",
      "FETCH_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS"
    ]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST","REGION_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    getPincodeInformations() {
      this.FETCH_ALL_STATES_DATA();
    },

    fnReassignData(rowDetails) {
      this.propShowUpdateOpenedExternal = !this.propShowUpdateOpenedExternal;
      this.ajaxLoadAllLeadInfo({pagination: this.paginationControl, filter: this.filterSearch});
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails;
      }
    },
    filterAssignTo(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.filteredAssignToOptions = this.assignToOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterAssignToRegion(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.filteredAssignToRegionOptions = this.assignToRegionOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS1({
        pagination,
        filter
      })
        .then(res => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            let assumeArr = [];
            this.getImplementationExecutiveList.map(function(value) {
              assumeArr.push({
                label:
                  value.name + " | " + value.employeeID + " | " + value.email,
                value: value.id
              });
            });
            this.assignToOptions = assumeArr;
            this.filteredAssignToOptions = assumeArr;
          });
          this.REGION_LIST().then(() => {
            let assumeArrData = [];
            this.getRegionList.map(function(value) {
              assumeArrData.push({
                label: value.regionAreaName,
                value: value.regionAreaName
              });
            });
            this.assignToRegionOptions = assumeArrData;
            this.filteredAssignToRegionOptions = assumeArrData;
          });

          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getserviceRequestPhonepeUnassignedDatas.totalElements;
          this.paginationControl1.page = this.getserviceRequestPhonepeUnassignedDatas.number + 1;

          this.tableData3 = this.getserviceRequestPhonepeUnassignedDatas.content;

          if (this.getserviceRequestPhonepeUnassignedDatas.sort != null && this.getserviceRequestPhonepeUnassignedDatas.sort.length > 0) {
            this.paginationControl1.sortBy = this.getserviceRequestPhonepeUnassignedDatas.sort[0].property;
            this.paginationControl1.descending = !this.getserviceRequestPhonepeUnassignedDatas.sort[0].ascending;
          }

          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getserviceRequestPhonepeAssignedDatas.totalElements;
          this.paginationControl.page = this.getserviceRequestPhonepeAssignedDatas.number + 1;

          this.tableData1 = this.getserviceRequestPhonepeAssignedDatas.content;

          if (this.getserviceRequestPhonepeAssignedDatas.sort != null && this.getserviceRequestPhonepeAssignedDatas.sort.length > 0) {
            this.paginationControl.sortBy = this.getserviceRequestPhonepeAssignedDatas.sort[0].property;
            this.paginationControl.descending = !this.getserviceRequestPhonepeAssignedDatas.sort[0].ascending;
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
          filter: this.filterSearch1
        });
      } else {
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filterSearch
        });
      }
    },

    assignImplementationUser() {
      let self = this;
      if (self.formData.marsDeviceIdsCooked.length == 0) {
        self.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Select atleast one item to assign",
          icon: "thumb_down"
        });
      } 
      else if (self.formData.assignTo.id == "" && self.formData.assignTo.region == "") {
        self.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Select Any One Request mode",
          icon: "thumb_down"
        });
      }
      else if(self.formData.assignTo.id != null && self.formData.assignTo.id != '' && (self.formData.assignTo.region == null || self.formData.assignTo.region == '')){
        this.$q.loading.show({
          delay: 100,
          spinnerColor: "purple-9",
          message: "Please wait.."
        });
        let marsDeviceIdsCooked = [];
        self.formData.marsDeviceIdsCooked.map(function(value) {
          marsDeviceIdsCooked.push(value);
        });
        let postValues = {
          request: marsDeviceIdsCooked,
          userId: self.formData.assignTo.id
        };
        self.PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE(postValues)
          .then(res => {
            if (res.status == 200) {
              this.formData.marsDeviceIdsCooked = [];
              this.formData.assignTo.id = "";
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully assigned!",
                icon: "thumb_up"
              });
              this.$q.loading.hide();
              this.ajaxLoadAllLeadInfo1({
                pagination: this.paginationControl1,
                filter: this.filterSearch1
              });
            } else {
              self.$q.notify({
                color: "negative",
                position: "bottom",
                message: "INTERNAL SERVER ERROR !!",
                icon: "thumb_down"
              });
              this.$q.loading.hide();
            }
          })
          .catch(() => {
            self.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Please try again",
              icon: "thumb_down"
            });
            this.$q.loading.hide();
          });
      }
      else if(self.formData.assignTo.region != null && self.formData.assignTo.region != '' && (self.formData.assignTo.id == null || self.formData.assignTo.id == '')){
        this.$q.loading.show({
          delay: 100,
          spinnerColor: "purple-9",
          message: "Please wait.."
        });
        let marsDeviceIdsCooked = [];
        self.formData.marsDeviceIdsCooked.map(function(value) {
          marsDeviceIdsCooked.push({
            serviceReqTicketId: value.serviceReqTicketId,
            bpRegion: {
              regionAreaName: self.formData.assignTo.region
            }
          })
        });
        self.PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION(marsDeviceIdsCooked)
          .then(res => {
            if (res.status == 200) {
              this.formData.marsDeviceIdsCooked = [];
              this.formData.assignTo.region = "";
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: res.data.data,
                icon: "thumb_up"
              });
              this.$q.loading.hide();
              this.ajaxLoadAllLeadInfo1({
                pagination: this.paginationControl1,
                filter: this.filterSearch1
              });
            } else {
              self.$q.notify({
                color: "negative",
                position: "bottom",
                message: res.data.data,
                icon: "thumb_down"
              });
              this.$q.loading.hide();
            }
          })
          .catch((error) => {
            self.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.response?.data?.data || "Error",
              icon: "thumb_down"
            });
            this.$q.loading.hide();
          });
      }
      else {
        self.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Select Only One Request mode",
          icon: "thumb_down"
        });
      }
    },

    expandRowPlease(value) {},

    toggleServiceRequest(leadDetails) {
      this.propToggleServiceRequest = !this.propToggleServiceRequest;
      if (leadDetails != undefined) {
        this.addtnServiceRequest = leadDetails;
      }
    }
  }
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
