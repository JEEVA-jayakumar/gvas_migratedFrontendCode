<template>
  <q-page>
    <!-- content -->
    <div>
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <q-card
        class="group q-pa-md"
        v-if="selectedTab == 'assigned'"
      >
        <div class="row items-center gutter-y-sm">
          <div
            class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md"
            align="left"
          >
            <span class="text-h4">{{ formData.marsDeviceIdsCookedUnAssinged.length }}</span>/ selected
          </div>
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6">
                <q-select
                  use-input
                  clearable
                  v-model="formData.assignTo"
                  color="grey-9"
                  :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                  :options="assignToOptions"
                  placeholder="Assign To"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-6">
                <q-checkbox
                  v-model="formData.triggerWelcomeMail"
                  color="dark"
                  label="Trigger welcome email"
                />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-6 group">
                <div>
                  <q-btn
                    no-caps
                    :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0 || this.formData.assignTo == ''"
                    label="Re-Assign"
                    class="common-dark-blue"
                    @click="reAssignImplementationUser"
                  />
                </div>
                <div>
                  <q-btn
                    no-caps
                    :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                    label="Un-Assign"
                    class="common-dark-blue"
                    @click="unAssignImplementationUser"
                  />
                </div>
              </div>
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
          name="assigned"
          label="Normal"
        />
        <q-tab
          name="courier"
          label="Courier"
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
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props" v-if="props.row && props.row.leadInformation">
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props" v-if="props.row">
                {{ $moment(props.row.createdAt).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td v-if="props.row" :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td v-if="props.row" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By MID, Merchant Name.."
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

        <q-tab-panel name="courier">
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl1"
            row-key="id"
            :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
            :loading="tableAjaxLoading1"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation != null ? props.row.leadInformation.leadNumber : "NA" }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props" v-if="props.row">
                {{ $moment(props.row.createdAt).format("Do MMM YYYY") }}
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td v-if="props.row" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid != null ? props.row.mid : "NA" }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td v-if="props.row" :props="props" class="customTd customCellLength">
                <div>
                  <q-btn
                    no-caps
                    icon="edit"
                    color="purple-9"
                    size="xs"
                    round
                    @click="UpdateDeviceAddress(props.row)"
                  />
                  {{ props.row.deviceAddress != null ? props.row.deviceAddress : "NA" }}
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By MID, Merchant Name.."
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

      <!-- START >> COMPONENT: Update device address  -->
      <DeviceAddressModal
        v-if="showDeviceAddressModal"
        :showDeviceAddressModal="showDeviceAddressModal"
        :currentDeviceInfo="currentDeviceInfo"
        :stateInformation="getAllStatesData"
        :paginationControl="paginationControl"
        :selectedLeadItems="formData.marsDeviceIdsCooked"
        @toggleModal="UpdateDeviceAddressAfterEmit"
      />
      <!-- END >> COMPONENT: Update device address -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DeviceAddressModal from '../../components/sat/DeviceAddressModal.vue'
import generalLeadInformation from '../../components/generalLeadInformation.vue'

export default {
  name: 'Phonepeassigned',
  components: {
    DeviceAddressModal,
    generalLeadInformation
  },
  data () {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,

      filterSearch: '',
      filterSearch1: '',
      selectedTab: 'assigned',
      assignTo: '',
      assignToOptions: [],
      tableData: [],
      tableData1: [],
      // Defining columns for table
      columnDataAssigned: [
        {
          name: 'leadNumber',
          required: true,
          label: 'Lead Number',
          align: 'left',
          field: row => row.leadInformation.leadNumber,
          sortable: false
        },
        {
          name: 'createdAt',
          required: true,
          label: 'Date of TID Generation',
          align: 'left',
          field: 'createdAt',
          sortable: true
        },
        {
          name: 'mid',
          required: true,
          label: 'MID',
          align: 'left',
          field: row => row.mid,
          sortable: true
        },
        {
          name: 'merchant_name',
          required: true,
          label: 'Merchant Name',
          align: 'left',
          field: row => row.leadInformation.leadName,
          sortable: false
        },
        {
          name: 'mobile_number',
          required: true,
          label: 'Mobile Number',
          align: 'center',
          field: row => row.leadInformation.contactNumber,
          sortable: false
        },
        {
          name: 'deviceAddress',
          required: true,
          label: 'Address',
          align: 'left',
          field: row => row.deviceAddress,
          sortable: false
        },
        {
          name: 'assigned_to',
          required: true,
          label: 'Assigned To',
          align: 'left',
          field: row => row.assignedTo == null ? 'NA' : row.assignedTo.name + ' | ' + row.assignedTo.employeeID,
          sortable: false
        },
        {
          name: 'leadInformation',
          required: true,
          label: 'Device Type',
          align: 'left',
          field: row => row.leadInformation.aggregatorDevice == null ? 'NA' : row.leadInformation.aggregatorDevice.deviceName,
          sortable: false
        },
        {
          name: 'serial_number',
          required: true,
          label: 'Serial Number',
          align: 'left',
          field: row => row.aggregatorRegionalInventory == null ? 'NA' : row.aggregatorRegionalInventory.serialNumber,
          sortable: true
        },
        {
          name: 'submitToMarsDate',
          required: true,
          label: 'Date of Submission',
          align: 'left',
          field: row => row.leadInformation.submitToMarsDate,
          sortable: true
        },
        {
          name: 'lead_source',
          required: true,
          label: 'Lead Source',
          align: 'left',
          field: row => row.leadInformation.leadSource == null ? 'NA' : row.leadInformation.leadSource.sourceName,
          sortable: false
        }
      ],

      columnDataUnassigned: [
        {
          name: 'leadNumber',
          required: true,
          label: 'Lead Number',
          align: 'left',
          field: row => row.leadInformation != null ? row.leadInformation.leadNumber : 'NA',
          sortable: false
        },
        {
          name: 'createdAt',
          required: true,
          label: 'Date of TID Generation',
          align: 'left',
          field: row => row.createdAt != null ? row.createdAt : 'NA',
          sortable: true
        },
        {
          name: 'mid',
          required: true,
          label: 'MID',
          align: 'left',
          field: row => row.mid != null ? row.mid : 'NA',
          sortable: true
        },
        {
          name: 'merchant_name',
          required: true,
          label: 'Merchant Name',
          align: 'left',
          field: row => row.leadInformation != null ? row.leadInformation.leadName : 'NA',
          sortable: false
        },
        {
          name: 'mobile_number',
          required: true,
          label: 'Mobile Number',
          align: 'center',
          field: row => row.leadInformation != null ? row.leadInformation.contactNumber : 'NA',
          sortable: false
        },
        {
          name: 'deviceAddress',
          required: true,
          label: 'Address',
          align: 'left',
          field: row => row.deviceAddress != null ? row.deviceAddress : 'NA',
          sortable: false
        },
        {
          name: 'leadInformation',
          required: true,
          label: 'Device Type',
          align: 'left',
          field: row => row.leadInformation.aggregatorDevice == null ? 'NA' : row.leadInformation.aggregatorDevice.deviceName,
          sortable: false
        },
        {
          name: 'serial_number',
          required: true,
          label: 'Serial Number',
          align: 'left',
          field: row => row.aggregatorRegionalInventory != null ? row.aggregatorRegionalInventory.serialNumber : 'NA',
          sortable: true
        },
        {
          name: 'lead_source',
          required: true,
          label: 'Lead Source',
          align: 'left',
          field: row => row.leadInformation.leadSource == null ? 'NA' : row.leadInformation.leadSource.sourceName,
          sortable: false
        }
      ],

      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        courierDevice: false,
        assignTo: ''
      },
      paginationControl: {
        sortBy: 'deviceStatusDate',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      paginationControl1: {
        sortBy: 'deviceStatusDate',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    }
  },

  computed: {
    ...mapGetters('ImplementationQueue', [
      'getImplementationQueueAssignedList',
      'getImplementationQueueCourierList',
      'getImplementationQueueUnassignedList'
    ]),
    ...mapGetters('phonepeImplementationQueue', [
      'getPhonepeImplementationQueueCourierList'
    ]),
    ...mapGetters('ImplementationExecutive', [
      'getImplementationExecutiveList'
    ]),
    ...mapGetters('SuperAdminUsers', ['getAllStatesData']),
    ...mapGetters('phonepeImplementationQueue', ['getPhonepeImplementationQueueassignedList'])
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
    ...mapActions('ImplementationQueue', [
      'IMPLEMENTATION_QUEUE_ASSIGNED_LIST',
      'IMPLEMENTATION_QUEUE_UNASSIGNED_LIST',
      'IMPLEMENTATION_QUEUE_COURIER_LIST',
      'IMPLEMENTATION_QUEUE_SUBMIT'
    ]),
    ...mapActions('phonepeImplementationQueue', [
      'PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST', 'PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT'
    ]),
    ...mapActions('ImplementationExecutive', ['IMPLEMENTATION_EXECUTIVE_LIST']),
    ...mapActions('SuperAdminUsers', ['FETCH_ALL_STATES_DATA']),
    ...mapActions('phonepeImplementationQueue', ['PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST']),

    getPincodeInformations () {
      this.FETCH_ALL_STATES_DATA()
    },
    ajaxLoadAllLeadInfo1 ({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      })
      this.PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST({ pagination, filter })
        .then((res) => {
          this.paginationControl1 = pagination
          this.paginationControl1.rowsNumber = this.getPhonepeImplementationQueueCourierList.totalElements
          this.paginationControl1.page = this.getPhonepeImplementationQueueCourierList.number + 1
          this.tableData1 = this.getPhonepeImplementationQueueCourierList.content
          if (this.getPhonepeImplementationQueueCourierList.sort != null) {
            this.paginationControl1.sortBy = this.getPhonepeImplementationQueueCourierList.sort[0].property
            this.paginationControl1.descending = this.getPhonepeImplementationQueueCourierList.sort[0].ascending
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
      this.PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST({ pagination, filter })
        .then(() => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            let assumeArr = []
            this.getImplementationExecutiveList.map(function (value) {
              assumeArr.push({ label: value.name + ' | ' + value.employeeID + ' | ' + value.email, value: value.id })
            })
            this.assignToOptions = assumeArr
          })
          this.paginationControl = pagination
          this.paginationControl.rowsNumber = this.getPhonepeImplementationQueueassignedList.totalElements
          this.paginationControl.page = this.getPhonepeImplementationQueueassignedList.number + 1
          this.tableData = this.getPhonepeImplementationQueueassignedList.content
          if (this.getPhonepeImplementationQueueassignedList.sort != null) {
            this.paginationControl.sortBy = this.getPhonepeImplementationQueueassignedList.sort[0].property
            this.paginationControl.descending = this.getPhonepeImplementationQueueassignedList.sort[0].ascending
          }
          this.$q.loading.hide()
        })
        .catch(() => {
          this.$q.loading.hide()
        })
    },
    goToUnassignedTab (tab) {
      if (tab == 'courier') {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 })
      } else {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
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
        let marsDeviceIdsCooked = []
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
      let self = this
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
          message: 'Implementation officer cannot be empty!',
          icon: 'thumb_down'
        })
      } else {
        let marsDeviceIdsCooked = []
        self.formData.marsDeviceIdsCooked.map(function (value) {
          marsDeviceIdsCooked.push(value.id)
        })
        let postValues = {
          action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
          marsDeviceIds: marsDeviceIdsCooked,
          triggerWelcomeMail: self.formData.triggerWelcomeMail,
          userId: self.formData.assignTo
        }
        this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues)
          .then(() => {
            this.formData.marsDeviceIdsCooked = []
            this.formData.assignTo = ''
            this.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully assigned!',
              icon: 'thumb_up'
            })
            this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl, filter: this.filterSearch })
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
      let self = this
      if (self.formData.marsDeviceIdsCookedUnAssinged.length == 0) {
        self.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to Unassign',
          icon: 'thumb_down'
        })
      } else {
        self.$q.loading.show({
          delay: 100,
          spinnerColor: 'purple-9',
          message: 'Fetching Data..'
        })
        let marsDeviceIdsCookedUnAssinged = []
        self.formData.marsDeviceIdsCookedUnAssinged.map(function (value) {
          marsDeviceIdsCookedUnAssinged.push(value.id)
        })

        let postValues = {
          action: this.$MARS_DEVICE_STATUS_TID_GENERATED,
          marsDeviceIds: marsDeviceIdsCookedUnAssinged,
          userId: this.$SEND_ZERO_FOR_UNASSIGING
        }
        self.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues)
          .then(() => {
            self.formData.marsDeviceIdsCookedUnAssinged = []
            self.formData.assignTo = ''
            self.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully Unassigned!',
              icon: 'thumb_up'
            })
            this.filterSearch = ''
            this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
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
      let self = this
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
        self.$q.loading.show({
          delay: 100,
          spinnerColor: 'purple-9',
          message: 'Fetching Data..'
        })
        let marsDeviceIdsCookedUnAssinged = []
        self.formData.marsDeviceIdsCookedUnAssinged.map(function (value) {
          marsDeviceIdsCookedUnAssinged.push(value.id)
        })

        let postValues = {
          action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
          marsDeviceIds: marsDeviceIdsCookedUnAssinged,
          triggerWelcomeMail: self.formData.triggerWelcomeMail,
          userId: self.formData.assignTo
        }
        self.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues)
          .then(() => {
            self.formData.marsDeviceIdsCookedUnAssinged = []
            self.formData.assignTo = ''
            this.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully Re-assigned !',
              icon: 'thumb_up'
            })
            this.filterSearch = ''
            this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch })
          })
          .catch(() => {
            self.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again !',
              icon: 'thumb_down'
            })
          })
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
