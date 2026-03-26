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
      <q-card
        class="group q-pa-md"
        v-if="selectedTab == 'unAssigned'"
      >
        <div class="row items-center gutter-y-sm">
          <div
            class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium"
            align="left"
          >
            <span class="text-h4">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div
            class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium"
            align="auto"
          >
            <b>
              <label>Request Mode</label>
            </b>
            <div class="col-md-2 col-sm-6 col-xs-6">
              <q-radio
                v-for="(item, index) in requestOptions"
                :key="index"
                color="grey-9"
                v-model="formData.serviceRequestMode"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          <div
            v-if="formData.serviceRequestMode == 'Direct Dispatch'"
            class="col-md-3 col-sm-6 col-xs-6"
          >
            <q-select
              use-input
              clearable
              v-model="formData.assignTo.id"
              color="grey-9"
              :options="assignToOptions"
              placeholder="Assign To"
              emit-value
              map-options
            />
          </div>
          <div
            v-if="formData.serviceRequestMode == 'SO'"
            class="col-md-3 col-sm-6 col-xs-6"
          >
            <q-select
              use-input
              clearable
              v-model="formData.assignTo.id"
              color="grey-9"
              :options="assignToOptions"
              placeholder="Assign To"
              emit-value
              map-options
            />
          </div>
          <div
            class="col-md-3 col-sm-6 col-xs-6"
            align="right"
          >
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0"
              label="Assign"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>
      <q-card
        class="group q-pa-md"
        v-if="selectedTab == 'assigned'"
      >
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
        active-color="dark"
        indicator-color="dark"
        align="justify"
      >
        <q-tab
          name="unAssigned"
          label="Unassigned"
        />
        <q-tab
          name="assigned"
          label="Assigned"
        />
      </q-tabs>

      <q-tab-panels
        v-model="selectedTab"
        animated
      >
        <q-tab-panel name="unAssigned">
          <q-table
            :rows="internalUnAssignedTableData"
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
                <span class="label text-primary"># {{ props.row.serviceReqTicketId }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-createdDate="props">
              <q-td :props="props">
                {{ $moment(props.row.createdDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updatedDate="props">
              <q-td :props="props">
                {{ $moment(props.row.updatedDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-serviceRequestSubTicketStatus="props">
              <q-td :props="props">
                <span
                  class="label text-positive"
                  v-if="props.row.serviceRequestSubTicketStatus == 1"
                >SR_TICKET_RAISED</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 2"
                >SR_TICKET_ESCALATED_TO_SAT</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 3"
                >SR_ASSIGNED_TO_ENGINEER</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 4"
                >SR_ISSUE_RESOLVED_COURIERED</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 5"
                >SR_DEVICE_COURIERED</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 6"
                >SR_ISSUE_RESOLVED_REMOTELY</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 7"
                >SR_SCHEDULED_ENGINEER_VISIT</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 8"
                >SR_ISSUE_RESOLVED</span>
                <span
                  class="label text-positive"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 9"
                >SR_MERCHANT_NOT_REACHABLE</span>
                <span
                  class="label text-negative"
                  v-else-if="props.row.serviceRequestSubTicketStatus == 10"
                >SR_CANCELLED</span>
                <span
                  class="label"
                  v-else
                >NA</span>
              </q-td>
            </template>
            <template v-slot:body-cell-serviceRequestTicketStatus="props">
              <q-td :props="props">
                <span
                  class="label text-positive"
                  v-if="props.row.serviceRequestTicketStatus == 1"
                >REQUEST_UNASSIGNED</span>
                <span
                  class="label text-negative"
                  v-else-if="props.row.serviceRequestTicketStatus == 2"
                >REQUEST_ASSIGNED</span>
                <span
                  class="label text-negative"
                  v-else-if="props.row.serviceRequestTicketStatus == 3"
                >REQUEST_CLOSED</span>
                <span
                  class="label"
                  v-else
                >NA</span>
              </q-td>
            </template>
            <template v-slot:body-cell-kaptureDueDate="props">
              <q-td :props="props">
                {{ props.row.kaptureDueDate == null ? "NA" : $moment(props.row.kaptureDueDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-appointmentDate="props">
              <q-td :props="props">
                {{ props.row.appointmentDate == null ? "NA" : $moment(props.row.appointmentDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-courierDueDate="props">
              <q-td :props="props">
                {{ props.row.courierDueDate == null ? "NA" : $moment(props.row.courierDueDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-scheduleDate="props">
              <q-td :props="props">
                {{ props.row.scheduleDate == null ? "NA" : $moment(props.row.scheduleDate).format("Do MMM YYYY") }}
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
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="assigned">
          <q-table
            :rows="internalAssignedTableData"
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
            <!--START: Table body -->
            <template v-slot:body="props">
              <q-tr
                :props="props"
                class="bottom-border"
              >
                <q-td key="serviceReqTicketId">
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
                <q-td
                  key="tid"
                  :props="props"
                > {{ props.row.tid }}</q-td>
                <q-td
                  key="mid"
                  :props="props"
                >
                  <span v-if="props.row.mid != null">{{ props.row.mid }}</span>
                  <span v-else>NA</span>
                </q-td>
                <q-td
                  key="createdDate"
                  :props="props"
                > {{ $moment(props.row.createdDate).format("Do MMM YYYY") }}
                </q-td>
                <q-td
                  key="updatedDate"
                  :props="props"
                > {{ $moment(props.row.updatedDate).format("Do MMM YYYY") }}
                </q-td>
                <q-td
                  key="meName"
                  :props="props"
                > {{ props.row.meName }}</q-td>
                <q-td
                  key="bpRegion"
                  :props="props"
                > {{ props.row.bpRegion?.regionAreaName }} </q-td>
                <q-td
                  key="assignedTo"
                  :props="props"
                > {{ props.row.assignedTo?.name }} </q-td>
                <q-td
                  key="crmRemark"
                  :props="props"
                >
                  <span
                    v-if="props.row.crmRemark != null"
                    v-html="props.row.crmRemark"
                  ></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td
                  key="deviceType"
                  :props="props"
                > {{ props.row.deviceType }}</q-td>

                <q-td
                  key="serviceRequestTicketStatus"
                  :props="props"
                >
                  <span
                    class="label text-positive"
                    v-if="props.row.serviceRequestTicketStatus == 1"
                  >REQUEST_UNASSIGNED</span>
                  <span
                    class="label text-negative"
                    v-else-if="props.row.serviceRequestTicketStatus == 2"
                  >REQUEST_ASSIGNED</span>
                  <span
                    class="label text-negative"
                    v-else-if="props.row.serviceRequestTicketStatus == 3"
                  >REQUEST_CLOSED</span>
                  <span
                    class="label"
                    v-else
                  >NA</span>
                </q-td>
                <q-td
                  key="serviceRequestMode"
                  :props="props"
                > {{ props.row.serviceRequestMode }}</q-td>
                <q-td
                  key="serviceRequestSubTicketStatus"
                  :props="props"
                >
                  <span
                    class="label text-positive"
                    v-if="props.row.serviceRequestSubTicketStatus == 1"
                  >SR_TICKET_RAISED</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 2"
                  >SR_TICKET_ESCALATED_TO_SAT</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 3"
                  >SR_ASSIGNED_TO_ENGINEER</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 4"
                  >SR_ISSUE_RESOLVED_COURIERED</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 5"
                  >SR_DEVICE_COURIERED</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 6"
                  >SR_ISSUE_RESOLVED_REMOTELY</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 7"
                  >SR_SCHEDULED_ENGINEER_VISIT</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 8"
                  >SR_ISSUE_RESOLVED</span>
                  <span
                    class="label text-positive"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 9"
                  >SR_MERCHANT_NOT_REACHABLE</span>
                  <span
                    class="label text-negative"
                    v-else-if="props.row.serviceRequestSubTicketStatus == 10"
                  >SR_CANCELLED</span>
                  <span
                    class="label"
                    v-else
                  >NA</span>
                </q-td>
              </q-tr>
              <!-- START: table expand values -->
              <q-tr
                v-show="props.row.expand"
                :props="props"
                class="wordWrapCustom bottom-border"
              >
                <q-td colspan="100%">
                  <div class="row q-col-gutter-sm">
                    <div class="col-3">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">Request Type</div>
                      <div
                        class="text-left"
                        v-if="props.row.subTicketsList?.length > 0"
                      >
                        <div
                          v-for="col in props.row.subTicketsList"
                          :key="col.serviceRequestType?.id"
                        >
                          <span>{{ col.serviceRequestType != null ? col.serviceRequestType.name : "NA" }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">IssueType</div>
                      <div
                        class="text-left"
                        v-if="props.row.subTicketsList?.length > 0"
                      >
                        <div
                          v-for="col in props.row.subTicketsList"
                          :key="col.serviceRequestType?.id"
                        >
                          <span>{{ col.serviceRequestIssueType != null ? col.serviceRequestIssueType : "NA" }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                      <div
                        class="text-left"
                        v-if="props.row.subTicketsList?.length > 0"
                      >
                        <div
                          v-for="col in props.row.subTicketsList"
                          :key="col.serviceRequestType?.id"
                        >
                          <span>{{ col.serviceRequestSubTicketStatus != null ? col.serviceRequestSubTicketStatus.name : "NA" }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">Schedule Date</div>
                      <div
                        class="text-left"
                        v-if="props.row.subTicketsList?.length > 0"
                      >
                        <div
                          v-for="col in props.row.subTicketsList"
                          :key="col.serviceRequestType?.id"
                        >
                          <span>{{ col.scheduleDate != null ? col.scheduleDate : "NA" }}</span>
                        </div>
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
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import internalServiceRequestPopup from '../../components/sat/internalServiceRequestPopup.vue'

export default {
  name: 'opened',
  components: {
    internalServiceRequestPopup
  },
  data () {
    return {
      propToggleLeadInformation: false,
      propToggleServiceRequest: false,
      addtnLeadInformation: null,
      addtnServiceRequest: null,

      filterSearch: '',
      filterSearch1: '',
      filterSearch2: '',
      selectedTab: 'assigned',
      assignTo: '',
      assignToOptions: [],
      tableData: [],
      tableData1: [],
      internalUnAssignedTableData: [],
      internalAssignedTableData: [],
      internalClosedTableData: [],
      tableData2: [],
      formData: {
        serviceRequestMode: '',
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: {
          id: ''
        },
        podNumber: ''
      },
      requestOptions: [
        {
          label: 'SO',
          value: 'SO'
        }
      ],
      // Defining columns for table
      columnDataAssigned: [
        {
          name: 'serviceReqTicketId',
          required: true,
          label: 'ServiceReqTicketId',
          align: 'left',
          field: (row) => row.serviceReqTicketId ?? 'NA',
          sortable: false
        },
        {
          name: 'tid',
          required: true,
          label: 'TID',
          align: 'left',
          field: (row) => row.tid ?? 'NA',
          sortable: false
        },
        {
          name: 'mid',
          required: true,
          label: 'MID',
          align: 'left',
          field: (row) => row.mid ?? 'NA',
          sortable: false
        },
        {
          name: 'createdDate',
          required: true,
          label: 'CreatedDate',
          align: 'left',
          field: (row) => row.createdDate,
          sortable: true
        },
        {
          name: 'updatedDate',
          required: true,
          label: 'UpdatedDate',
          align: 'left',
          field: (row) => row.updatedDate,
          sortable: false
        },
        {
          name: 'meName',
          required: true,
          label: 'ME Name',
          align: 'left',
          field: (row) => row.meName ?? 'NA',
          sortable: false
        },
        {
          name: 'bpRegion',
          required: true,
          label: 'BpRegion',
          align: 'left',
          field: (row) => row.bpRegion?.regionAreaName ?? 'NA',
          sortable: false
        },
        {
          name: 'assignedTo',
          required: true,
          label: 'AssignedTo',
          align: 'left',
          field: (row) => row.assignedTo?.name ?? 'NA',
          sortable: false
        },
        {
          name: 'crmRemark',
          required: true,
          label: 'CRM Remark',
          align: 'left',
          field: (row) => row.crmRemark ?? 'NA',
          sortable: false
        },
        {
          name: 'deviceType',
          required: true,
          label: 'DeviceType',
          align: 'left',
          field: (row) => row.deviceType ?? 'NA',
          sortable: false
        },
        {
          name: 'serviceRequestSubTicketStatus',
          required: true,
          label: 'ServiceReqIssueStatus',
          align: 'left',
          field: (row) => row.serviceRequestSubTicketStatus,
          sortable: false
        },
        {
          name: 'serviceRequestMode',
          required: true,
          label: 'RequestMode',
          align: 'left',
          field: (row) => row.serviceRequestMode ?? 'NA',
          sortable: false
        },
        {
          name: 'serviceRequestTicketStatus',
          required: true,
          label: 'TicketStatus',
          align: 'left',
          field: (row) => row.serviceRequestTicketStatus,
          sortable: false
        }
      ],

      columnDataUnassigned: [
        {
          name: 'serviceReqTicketId',
          required: true,
          label: 'ServiceReqTicketId',
          align: 'left',
          field: row => row.serviceReqTicketId,
          sortable: false
        },
        {
          name: 'tid',
          required: true,
          label: 'TID',
          align: 'left',
          field: (row) => row.tid ?? 'NA',
          sortable: false
        },
        {
          name: 'mid',
          required: true,
          label: 'MID',
          align: 'left',
          field: (row) => row.mid ?? 'NA',
          sortable: false
        },
        {
          name: 'createdDate',
          required: true,
          label: 'CreatedDate',
          align: 'left',
          field: (row) => row.createdDate,
          sortable: true
        },
        {
          name: 'updatedDate',
          required: true,
          label: 'UpdatedDate',
          align: 'left',
          field: (row) => row.updatedDate,
          sortable: false
        },
        {
          name: 'meName',
          required: true,
          label: 'ME Name',
          align: 'left',
          field: (row) => row.meName ?? 'NA',
          sortable: false
        },
        {
          name: 'bpRegion',
          required: true,
          label: 'BpRegion',
          align: 'left',
          field: (row) => row.bpRegion?.regionAreaName ?? 'NA',
          sortable: false
        },
        {
          name: 'assignedTo',
          required: true,
          label: 'AssignedTo',
          align: 'left',
          field: (row) => row.assignedTo?.name ?? 'NA',
          sortable: false
        },
        {
          name: 'crmRemark',
          required: true,
          label: 'CRM Remark',
          align: 'left',
          field: (row) => row.crmRemark ?? 'NA',
          sortable: false
        },
        {
          name: 'deviceType',
          required: true,
          label: 'DeviceType',
          align: 'left',
          field: (row) => row.deviceType ?? 'NA',
          sortable: false
        },
        {
          name: 'serviceRequestSubTicketStatus',
          required: true,
          label: 'ServiceReqIssueStatus',
          align: 'left',
          field: (row) => row.serviceRequestSubTicketStatus,
          sortable: false
        },
        {
          name: 'serviceRequestMode',
          required: true,
          label: 'RequestMode',
          align: 'left',
          field: (row) => row.serviceRequestMode ?? 'NA',
          sortable: false
        },
        {
          name: 'serviceRequestTicketStatus',
          required: true,
          label: 'TicketStatus',
          align: 'left',
          field: (row) => row.serviceRequestTicketStatus,
          sortable: false
        }
      ],
      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      paginationControl: {
        sortBy: 'createdDate',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      paginationControl1: {
        sortBy: 'createdDate',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    }
  },

  computed: {
    ...mapGetters('DeviceReplacement', [
      'getDeviceReplacementQueueAssignedList',
      'getDeviceReplacementQueueUnassignedList'
    ]),
    ...mapGetters('ImplementationExecutive', [
      'getImplementationExecutiveList'
    ]),
    ...mapGetters('serviceRequestSat', ['getserviceRequestUnassignedDatas', 'getserviceRequestassignedDatas', 'getserviceRequestClosedDatas']),
    ...mapGetters('SuperAdminUsers', ['getAllStatesData'])
  },
  watch: {
    selectedTab (newVal) {
      this.goToUnassignedTab(newVal)
    }
  },
  created () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filterSearch
    })
    this.ajaxLoadAllLeadInfo1({
      pagination: this.paginationControl1,
      filter: this.filterSearch1
    })
    this.getPincodeInformations()
  },
  methods: {
    ...mapActions('DeviceReplacement', [
      'DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST',
      'DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST',
      'DEVICE_REPLACEMENT_QUEUE_SUBMIT'
    ]),
    ...mapActions('serviceRequestSat', ['FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS', 'SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE', 'FETCH_ASSIGNED_SERVICE_REQUEST_DATAS', 'FETCH_CLOSED_SERVICE_REQUEST_DATAS']),
    ...mapActions('ImplementationExecutive', ['IMPLEMENTATION_EXECUTIVE_LIST']),
    ...mapActions('SuperAdminUsers', ['FETCH_ALL_STATES_DATA']),

    getPincodeInformations () {
      this.FETCH_ALL_STATES_DATA()
    },
    ajaxLoadAllLeadInfo1 ({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      })
      this.FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS({ pagination, filter })
        .then(() => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            const assumeArr = []
            this.getImplementationExecutiveList.map(function (value) {
              assumeArr.push({ label: value.name, value: value.id })
            })
            this.assignToOptions = assumeArr
          })
          this.paginationControl1 = pagination
          this.paginationControl1.rowsNumber = this.getserviceRequestUnassignedDatas.totalElements
          this.paginationControl1.page = this.getserviceRequestUnassignedDatas.number + 1

          this.tableData1 = this.getserviceRequestUnassignedDatas.content
          this.internalUnAssignedTableData = this.tableData1.filter(service => service.source == true)
          if (this.getserviceRequestUnassignedDatas.sort != null) {
            this.paginationControl1.sortBy = this.getserviceRequestUnassignedDatas.sort[0].property
            this.paginationControl1.descending = this.getserviceRequestUnassignedDatas.sort[0].ascending
          }
          this.$q.loading.hide()
        })
        .catch(() => {
          this.$q.loading.hide()
        })
    },
    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      })

      this.FETCH_ASSIGNED_SERVICE_REQUEST_DATAS({ pagination, filter })
        .then(() => {
          this.paginationControl = pagination
          this.paginationControl.rowsNumber = this.getserviceRequestassignedDatas.totalElements
          this.paginationControl.page = this.getserviceRequestassignedDatas.number + 1
          this.tableData = this.getserviceRequestassignedDatas.content
          this.internalAssignedTableData = this.tableData.filter(service => service.source == true)
          if (this.getserviceRequestassignedDatas.sort != null) {
            this.paginationControl.sortBy = this.getserviceRequestassignedDatas.sort[0].property
            this.paginationControl.descending = this.getserviceRequestassignedDatas.sort[0].ascending
          }
          this.$q.loading.hide()
        })
        .catch(() => {
          this.$q.loading.hide()
        })
    },

    goToUnassignedTab (tab) {
      if (tab == 'unAssigned') {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
      } else {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 })
      }
    },

    UpdateDeviceAddress (currentDeviceInfo) {
      this.currentDeviceInfo = []
      this.showDeviceAddressModal = !this.showDeviceAddressModal
      if (this.formData.marsDeviceIdsCooked.length == 0) {
        let assumeObj = {
          id: [currentDeviceInfo.id],
          marsDeviceAddress: {
            deviceAddress: currentDeviceInfo.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: currentDeviceInfo.pincode,
            city: currentDeviceInfo.city,
            state: currentDeviceInfo.state
          }
        }
        this.currentDeviceInfo = assumeObj
      } else {
        const marsDeviceIdsCooked = []
        this.formData.marsDeviceIdsCooked.map(function (value) {
          marsDeviceIdsCooked.push(value.id)
        })
        let assumeObj = {
          id: marsDeviceIdsCooked,
          marsDeviceAddress: {
            deviceAddress: currentDeviceInfo.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: currentDeviceInfo.pincode,
            city: currentDeviceInfo.city,
            state: currentDeviceInfo.state
          }
        }
        this.currentDeviceInfo = assumeObj
      }
    },
    UpdateDeviceAddressAfterEmit (pagination) {
      this.showDeviceAddressModal = !this.showDeviceAddressModal
      this.paginationControl = pagination
    },

    assignImplementationUser () {
      const self = this
      if (self.formData.marsDeviceIdsCooked.length == 0) {
        self.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to assign',
          icon: 'thumb_down'
        })
      } else if (self.formData.assignTo == '') {
        self.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Request Mode cannot be empty!',
          icon: 'thumb_down'
        })
      } else {
        const marsDeviceIdsCooked = []
        self.formData.marsDeviceIdsCooked.map(function (value) {
          value.serviceRequestMode = self.formData.serviceRequestMode
          marsDeviceIdsCooked.push(value)
        })
        const postValues = {
          request: marsDeviceIdsCooked,
          userId: self.formData.assignTo.id
        }
        self.SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE(postValues)
          .then((res) => {
            if (res.status == 200 && (res.data.data.serviceRequest != null || res.data.data.Success != null)) {
              this.formData.marsDeviceIdsCooked = []
              this.formData.assignTo = ''
              this.$q.notify({
                color: 'positive',
                position: 'bottom',
                message: 'Successfully assigned!',
                icon: 'thumb_up'
              })
              this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl, filter: this.filterSearch })
            } else if (res.status == 200 && res.data.data.Failed != null) {
              this.$router.push({ name: 'internalServiceAddressFetch', params: { data: res } })
            } else {
              self.$q.notify({
                color: 'negative',
                position: 'bottom',
                message: 'INTERNAL SERVER ERROR !!',
                icon: 'thumb_down'
              })
            }
          })
          .catch(() => {
            self.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again',
              icon: 'thumb_down'
            })
          })
      }
    },

    unAssignImplementationUser () {
      const self = this
      if (self.formData.marsDeviceIdsCookedUnAssinged.length == 0) {
        self.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to Unassign',
          icon: 'thumb_down'
        })
      } else {
        const marsDeviceIdsCookedUnAssinged = []
        self.formData.marsDeviceIdsCookedUnAssinged.map(function (value) {
          marsDeviceIdsCookedUnAssinged.push(value.id)
        })

        const postValues = {
          action: this.$MARS_DEVICE_STATUS_TID_GENERATED,
          marsDeviceIds: marsDeviceIdsCookedUnAssinged,
          userId: this.$SEND_ZERO_FOR_UNASSIGING
        }
        self.DEVICE_REPLACEMENT_QUEUE_SUBMIT(postValues)
          .then(() => {
            this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
            this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 })
            self.formData.marsDeviceIdsCookedUnAssinged = []
            self.formData.assignTo = ''
            self.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully Unassigned!',
              icon: 'thumb_up'
            })
          })
          .catch(() => {
            self.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again',
              icon: 'thumb_down'
            })
          })
      }
    },

    reAssignImplementationUser () {
      const self = this
      if (self.formData.marsDeviceIdsCookedUnAssinged.length == 0) {
        self.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to assign',
          icon: 'thumb_down'
        })
      } else if (self.formData.assignTo == '') {
        self.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Implementation officer cannot be empty!',
          icon: 'thumb_down'
        })
      } else {
        const marsDeviceIdsCookedUnAssinged = []
        self.formData.marsDeviceIdsCookedUnAssinged.map(function (value) {
          marsDeviceIdsCookedUnAssinged.push(value.id)
        })

        const postValues = {
          action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
          marsDeviceIds: marsDeviceIdsCookedUnAssinged,
          triggerWelcomeMail: self.formData.triggerWelcomeMail,
          serviceRequestMode: self.formData.serviceRequestMode,
          userId: self.formData.assignTo
        }
        self.DEVICE_REPLACEMENT_QUEUE_SUBMIT(postValues)
          .then(() => {
            self.DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST()
            self.ajaxLoadAllLeadInfo()
            self.formData.marsDeviceIdsCookedUnAssinged = []
            self.formData.assignTo = ''
            self.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully re assigned !',
              icon: 'thumb_up'
            })
          })
          .catch(() => {
            self.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again',
              icon: 'thumb_down'
            })
          })
      }
    },
    expandRowPlease (value) { },
    toggleLeadInformation (leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails
      }
    },

    toggleServiceRequest (leadDetails) {
      this.propToggleServiceRequest = !this.propToggleServiceRequest
      if (leadDetails != undefined) {
        this.addtnServiceRequest = leadDetails
      }
    }
  }
}
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
