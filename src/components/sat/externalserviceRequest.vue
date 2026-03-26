<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Service Request
      </div>

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
            class="col-md-3 col-sm-6 col-xs-6"
            style="flex: 1; max-width: 200px;"
            align="right"
          >
            <q-select
              use-input
              clearable
              v-model="formData.assignTo.region"
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length == 0"
              :options="assignToRegionOptions"
              placeholder="Assign To Region"
              emit-value
              map-options
            />
          </div>
          <div
            class="col-md-3 col-sm-6 col-xs-6 q-ml-md"
            align="right"
          >
            <q-btn
              no-caps
              :disabled="!formData.assignTo.region"
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
          label="Opened"
        />
        <q-tab
          name="assigned"
          label="Resolved Tickets"
        />
        <q-tab
          name="Ticket"
          label="Ticket Bulk Assign/Reassign"
        />
      </q-tabs>

      <q-tab-panels
        v-model="selectedTab"
        animated
      >
        <q-tab-panel name="assigned">
          <q-table
            :rows="tableData"
            :columns="columnDataAssigned"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                class="bottom-border"
              >
                <q-td
                  key="merchant_name"
                  :props="props"
                > {{ props.row.meName }}</q-td>
                <q-td
                  key="tid"
                  :props="props"
                > {{ props.row.tid }}</q-td>
                <q-td
                  key="actionContact"
                  :props="props"
                >
                  <q-btn
                    class="q-mx-sm"
                    color="blue"
                    size="sm"
                    @click="fnContactDetails(props.row)"
                  >Click to View</q-btn>
                </q-td>
                <q-td
                  key="dateCreated"
                  :props="props"
                >
                  {{ $moment(props.row.createdDate).format("Do MMM YYYY") }}
                </q-td>
                <q-td
                  key="tat"
                  :props="props"
                >
                  <span :style="getHoursAgoColor(props.row.createdDate)">{{ getHoursAgo(props.row.createdDate) }}</span>
                </q-td>
                <q-td
                  key="actionLog"
                  :props="props"
                >
                  <q-btn
                    class="q-mx-sm"
                    color="blue"
                    size="sm"
                    @click="fnCrmLogsView(props.row)"
                  >Click to View</q-btn>
                </q-td>
                <q-td
                  key="actionClosed"
                  :props="props"
                >
                  <q-btn
                    class="q-mx-sm"
                    color="negative"
                    size="sm"
                    @click="fnReslovedClose(props.row)"
                  >Closed</q-btn>
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
                  label="Search By TID ..."
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

        <q-tab-panel name="unAssigned">
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch1"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="serviceReqTicketId"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-serviceReqTicketId="props">
              <q-td :props="props"> {{ props.row.serviceReqTicketId }}</q-td>
            </template>
            <template v-slot:body-cell-merchant_name="props">
              <q-td :props="props"> {{ props.row.meName }}</q-td>
            </template>
            <template v-slot:body-cell-assignedTo="props">
              <q-td :props="props"> {{ props.row.assignedTo == null ? "NA" : props.row.assignedTo.name }}</q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td :props="props"> {{ props.row.tid }}</q-td>
            </template>
            <template v-slot:body-cell-actionContact="props">
              <q-td :props="props">
                <q-btn
                  class="q-mx-sm"
                  color="blue"
                  size="sm"
                  @click="fnContactDetails(props.row)"
                >Click to View</q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-dateCreated="props">
              <q-td :props="props">
                {{ $moment(props.row.createdDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-tat="props">
              <q-td :props="props">
                <span :style="getHoursAgoColor(props.row.createdDate)">{{ getHoursAgo(props.row.createdDate) }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-actionLog="props">
              <q-td :props="props">
                <q-btn
                  class="q-mx-sm"
                  color="blue"
                  size="sm"
                  @click="fnCrmLogsView(props.row)"
                >Click to View</q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-actionPickTickets="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.serviceRequestTicketStatus == 5"
                  class="q-mx-sm"
                  color="positive"
                  size="sm"
                  @click="fnPickTicket(props.row)"
                >Pick Ticket</q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-actionReassign="props">
              <q-td :props="props">
                <q-btn
                  v-if="props.row.serviceRequestTicketStatus == 2"
                  class="q-mx-sm"
                  color="negative"
                  size="sm"
                  @click="fnReassignTicket(props.row)"
                >Re-Assign</q-btn>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch1"
                  placeholder="Type.."
                  label="Search By Ticket ID, TID ..."
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

        <q-tab-panel name="Ticket">
          <ticketAssign />
        </q-tab-panel>
      </q-tab-panels>

      <pickTicketpopup
        v-if="propShowUpdatePickTicket"
        :propShowUpdatePickTicket="propShowUpdatePickTicket"
        :propRowDetails="propRowDetails"
        @emitfnshowUpdateOpenedExternal="fnPickTicket"
      />
      <reassignTicketPopup
        v-if="propShowUpdateReassignTicket"
        :propShowUpdateReassignTicket="propShowUpdateReassignTicket"
        :propRowDetails="propRowDetails"
        @emitfnshowUpdateOpenedExternal="fnReassignTicket"
      />
      <contactDetailsPopup
        v-if="propShowUpdateContactDetails"
        :propShowUpdateContactDetails="propShowUpdateContactDetails"
        :propRowDetails="propRowDetails"
        @emitfnshowUpdateOpenedExternal="fnContactDetails"
      />
      <crmLogsView
        v-if="propShowUpdateCrmLogsView"
        :propShowUpdateCrmLogsView="propShowUpdateCrmLogsView"
        :propRowDetails="propRowDetails"
        @emitfnshowUpdateOpenedExternal="fnCrmLogsView"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import pickTicketpopup from '../../components/sat/pickTicketpopup.vue'
import reassignTicketPopup from '../../components/sat/reassignTicketPopup.vue'
import contactDetailsPopup from '../../components/sat/contactDetailsPopup.vue'
import crmLogsView from '../../components/sat/crmLogsView.vue'
import ticketAssign from 'src/components/sat/ticketAssign.vue'

export default {
  name: 'externalserviceRequest',
  components: {
    pickTicketpopup,
    reassignTicketPopup,
    contactDetailsPopup,
    crmLogsView,
    ticketAssign
  },
  data () {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,

      filterSearch: '',
      filterSearch1: '',
      propShowUpdatePickTicket: false,
      propShowUpdateReassignTicket: false,
      propShowUpdateContactDetails: false,
      propShowUpdateCrmLogsView: false,
      selectedTab: 'unAssigned',
      assignTo: '',
      assignToOptions: [],
      assignToRegionOptions: [],
      externalClosedTableData: [],
      tableData: [],
      tableData1: [],
      propRowDetails: null,
      // Defining columns for table
      columnDataAssigned: [
        {
          name: 'merchant_name',
          required: true,
          label: 'Merchant Name',
          align: 'left',
          field: row => row.meName ?? 'NA',
          sortable: false
        },
        {
          name: 'tid',
          required: true,
          label: 'TID',
          align: 'left',
          field: row => row.tid ?? 'NA',
          sortable: true
        },
        {
          name: 'actionContact',
          required: true,
          label: 'Contact Details',
          align: 'center',
          field: 'actionContact',
          sortable: false
        },
        {
          name: 'dateCreated',
          required: true,
          label: 'Created Date',
          align: 'left',
          field: 'createdDate',
          sortable: false
        },
        {
          name: 'tat',
          required: true,
          label: 'TAT',
          align: 'left',
          field: 'createdDate',
          sortable: false
        },
        {
          name: 'actionLog',
          required: true,
          label: 'CRM Logs',
          align: 'center',
          field: 'actionLog',
          sortable: false
        },
        {
          name: 'actionClosed',
          required: true,
          label: 'Status',
          align: 'center',
          field: 'action',
          sortable: false
        }
      ],

      columnDataUnassigned: [
        {
          name: 'serviceReqTicketId',
          required: true,
          label: 'Ticket ID',
          align: 'left',
          field: row => row.serviceReqTicketId ?? 'NA',
          sortable: false
        },
        {
          name: 'merchant_name',
          required: true,
          label: 'Merchant Name',
          align: 'left',
          field: row => row.meName ?? 'NA',
          sortable: false
        },
        {
          name: 'assignedTo',
          required: true,
          label: 'Assigned SO',
          align: 'left',
          field: row => row.assignedTo?.name ?? 'NA',
          sortable: false
        },
        {
          name: 'tid',
          required: true,
          label: 'TID',
          align: 'left',
          field: row => row.tid ?? 'NA',
          sortable: true
        },
        {
          name: 'actionContact',
          required: true,
          label: 'Contact Details',
          align: 'center',
          field: 'actionContact',
          sortable: false
        },
        {
          name: 'dateCreated',
          required: true,
          label: 'Created Date',
          align: 'left',
          field: 'createdDate',
          sortable: false
        },
        {
          name: 'tat',
          required: true,
          label: 'TAT',
          align: 'left',
          field: 'createdDate',
          sortable: false
        },
        {
          name: 'actionLog',
          required: true,
          label: 'CRM Logs',
          align: 'center',
          field: 'actionLog',
          sortable: false
        },
        {
          name: 'actionPickTickets',
          required: true,
          label: 'Action Bar',
          align: 'center',
          field: 'action',
          sortable: false
        },
        {
          name: 'actionReassign',
          required: true,
          label: '',
          align: 'center',
          field: 'action',
          sortable: false
        }
      ],

      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: {
          id: '',
          region: ''
        }
      },
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
    ...mapGetters('serviceRequestPhonepeSat', [
      'getphonepeOpenedTickets',
      'getphonepeResolvedTickets'
    ]),
    ...mapGetters('ImplementationExecutive', [
      'getImplementationExecutiveList'
    ]),
    ...mapGetters('SuperAdminUsers', ['getAllStatesData'])
  },
  watch: {
    selectedTab (newVal) {
      this.goToUnassignedTab(newVal)
    }
  },
  mounted () {
    this.getPincodeInformations()
    this.fnAjaxGetAllRegionList()
    this.implementationExecutiveList()
    this.goToUnassignedTab(this.selectedTab)
  },
  methods: {
    ...mapActions('serviceRequestPhonepeSat', [
      'FETCH_PHONEPE_OPENED_TICKETS',
      'FETCH_PHONEPE_RESOLVED_TICKET',
      'PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION'
    ]),
    ...mapActions('generateQR', ['FETCH_REGION_LIST']),
    ...mapActions('ImplementationExecutive', ['IMPLEMENTATION_EXECUTIVE_LIST']),
    ...mapActions('SuperAdminUsers', ['FETCH_ALL_STATES_DATA']),

    getPincodeInformations () {
      this.FETCH_ALL_STATES_DATA()
    },

    fnPickTicket (rowDetails) {
      this.propShowUpdatePickTicket = !this.propShowUpdatePickTicket
      this.ajaxLoadAllLeadInfo1({
        pagination: this.paginationControl1,
        filter: this.filterSearch1
      })
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails
      }
    },
    fnReassignTicket (rowDetails) {
      this.propShowUpdateReassignTicket = !this.propShowUpdateReassignTicket
      this.ajaxLoadAllLeadInfo1({
        pagination: this.paginationControl1,
        filter: this.filterSearch1
      })
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails
      }
    },
    fnContactDetails (rowDetails) {
      this.propShowUpdateContactDetails = !this.propShowUpdateContactDetails
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails
      }
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
      } else if (self.formData.assignTo.region != null) {
        this.$q.loading.show({
          delay: 100,
          spinnerColor: 'purple-9',
          message: 'Please wait..'
        })
        const marsDeviceIdsCooked = []
        self.formData.marsDeviceIdsCooked.map(function (value) {
          marsDeviceIdsCooked.push({
            serviceReqTicketId: value.serviceReqTicketId,
            bpRegion: {
              regionAreaName: self.formData.assignTo.region
            }
          })
        })
        self.PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION(marsDeviceIdsCooked)
          .then(res => {
            this.formData.marsDeviceIdsCooked = []
            this.formData.assignTo.region = ''
            this.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: res.data.data,
              icon: 'thumb_up'
            })
            this.$q.loading.hide()
            this.ajaxLoadAllLeadInfo1({
              pagination: this.paginationControl1,
              filter: this.filterSearch1
            })
          })
          .catch((error) => {
            self.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: error.data?.data ?? 'Error',
              icon: 'thumb_down'
            })
            this.$q.loading.hide()
          })
      }
    },

    fnAjaxGetAllRegionList () {
      this.FETCH_REGION_LIST()
        .then(res => {
          const Region = res.data.data
          const assumeArr = []
          Region.map(function (value) {
            assumeArr.push({
              label: value.regionAreaName,
              value: value.regionAreaName
            })
          })
          this.assignToRegionOptions = assumeArr
        })
        .catch(() => {
          this.assignToRegionOptions = []
        })
    },
    fnCrmLogsView (rowDetails) {
      this.propShowUpdateCrmLogsView = !this.propShowUpdateCrmLogsView
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails
      }
    },
    implementationExecutiveList () {
      this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
        const assumeArr = []
        this.getImplementationExecutiveList.map(function (value) {
          assumeArr.push({
            label: value.name + ' | ' + value.employeeID + ' | ' + value.email,
            value: value.id
          })
        })
        this.assignToOptions = assumeArr
      })
    },
    ajaxLoadAllLeadInfo1 ({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      })
      this.FETCH_PHONEPE_OPENED_TICKETS({ pagination, filter })
        .then(() => {
          this.paginationControl1 = pagination
          this.paginationControl1.rowsNumber = this.getphonepeOpenedTickets.totalElements
          this.paginationControl1.page = this.getphonepeOpenedTickets.number + 1
          this.tableData1 = this.getphonepeOpenedTickets.content
          if (this.getphonepeOpenedTickets.sort != null) {
            this.paginationControl1.sortBy = this.getphonepeOpenedTickets.sort[0].property
            this.paginationControl1.descending = this.getphonepeOpenedTickets.sort[0].ascending
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
      this.FETCH_PHONEPE_RESOLVED_TICKET({ pagination, filter })
        .then(() => {
          this.paginationControl = pagination
          this.paginationControl.rowsNumber = this.getphonepeResolvedTickets.totalElements
          this.paginationControl.page = this.getphonepeResolvedTickets.number + 1
          this.tableData = this.getphonepeResolvedTickets.content
          if (this.getphonepeResolvedTickets.sort != null) {
            this.paginationControl.sortBy = this.getphonepeResolvedTickets.sort[0].property
            this.paginationControl.descending = this.getphonepeResolvedTickets.sort[0].ascending
          }
          this.$q.loading.hide()
        })
        .catch(() => {
          this.$q.loading.hide()
        })
    },

    goToUnassignedTab (tab) {
      if (tab == 'unAssigned') {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 })
      } else if (tab == 'assigned') {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
      }
    },

    getHoursAgo (dateInMilliseconds) {
      const currentTime = Date.now()
      const differenceInMilliseconds = currentTime - dateInMilliseconds
      const hoursAgo = differenceInMilliseconds / (1000 * 60 * 60)
      return 72 - Math.floor(hoursAgo)
    },

    getHoursAgoColor (dateInMilliseconds) {
      const currentTime = Date.now()
      const differenceInMilliseconds = currentTime - dateInMilliseconds
      const hoursAgo = differenceInMilliseconds / (1000 * 60 * 60)
      const colorData = 72 - Math.floor(hoursAgo)
      if (colorData > 0) {
        return 'color: green; font-weight: bold;'
      } else if (colorData < 0) {
        return 'color: red; font-weight: bold;'
      } else {
        return 'color: gray; font-weight: normal;'
      }
    },

    toggleLeadInformation (leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails
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
