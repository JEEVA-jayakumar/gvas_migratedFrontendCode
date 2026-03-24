<template>
  <q-page>
    <div class="q-pa-md">
      <div class="col-md-9 col-sm-12 col-xs-12">
        <div v-if="RegionalInventoryQrCount.length > 0" class="row">
          <q-card class="border-radius-10 q-pa-md q-ma-md" color="purple-9" v-for="menu in RegionalInventoryQrCount" :key="menu.value">
            <div>
              <big>{{ menu.label.requestCount || 0 }} </big>
            </div>
            <div>
              <label>{{ menu.value }}</label>
            </div>
          </q-card>
        </div>
        <div v-else class="row group">
          <div class="full-width">
            <q-banner class="bg-purple-9 text-white" icon="info">No data available to display</q-banner>
          </div>
        </div>
      </div>

      <div class="q-mt-md">
        <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" @update:model-value="goToCompleteTab">
          <q-tab name="tab-1" label="Pending QR" />
          <q-tab name="tab-2" label="Approved QR" />
          <q-tab name="tab-3" label="Allocate To SO" />
        </q-tabs>

        <q-tab-panells v-model="activeTab" animated>
          <q-tab-panell name="tab-1" class="q-pa-none">
            <div class="row items-center q-pa-sm">
              <div class="col-8"></div>
              <q-input class="col-4" clearable color="grey-9" placeholder="Type.." v-model="filter"
                label="Search By POD Number" />
            </div>
            <q-table table-class="customTableClass" class="q-py-none" :rows="tableData" :columns="columns"
              :filter="filter" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl"
              :loading="toggleAjaxLoadFilter" @request="ajaxLoadAllLeadInfo">
              <template v-slot:body-cell-updatedAt="props">
                <q-td :props="props">
                  {{ props.row ? $moment(props.row.updatedAt).format("Do MMM Y") : "NA" }}
                </q-td>
              </template>
              <template v-slot:body-cell-Action="props">
                <q-td :props="props">
                  <q-btn dense no-caps no-wrap label="Approve" icon="edit" size="md" @click="ApproveIncomingData(props.row)"
                    flat class="text-primary" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panell>

          <q-tab-panell name="tab-2" class="q-pa-none">
            <div class="row q-pa-sm">
              <div class="col-8"></div>
              <q-input class="col-4" v-model="filter1" clearable color="grey-9" placeholder="Type.."
                label="Search By POD Number" />
            </div>
            <q-table table-class="customTableClass" class="q-py-none" :rows="tableData1" :columns="columns2"
              :filter="filter1" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl1"
              :loading="toggleAjaxLoadFilter1" @request="ajaxLoadAllLeadInfo1">
              <template v-slot:body-cell-updatedAt="props">
                <q-td :props="props">
                  {{ $moment(props.row.updatedAt).format("Do MMM Y") }}
                </q-td>
              </template>
            </q-table>
          </q-tab-panell>

          <q-tab-panell name="tab-3" class="q-pa-md">
            <div class="row q-col-gutter-md items-center">
              <div class="col-md-2">
                <strong>Select Bank</strong>
              </div>
              <div class="col-md-3">
                <q-select clearable label="Select Bank" v-model="formData.id" :error="$v.formData.id.$error"
                  color="grey-9" :options="bankListOptions" map-options emit-value />
              </div>
            </div>

            <div class="row q-col-gutter-md items-center q-mt-sm">
              <div class="col-md-2">
                <strong>Select SO</strong>
              </div>
              <div class="col-md-3">
                <q-select :disable="!formData.id" use-input fill-input hide-selected clearable label="Select SO" v-model="formData.soList" :error="$v.formData.soList.$error"  color="grey-9"
                  :options="SoListData" map-options emit-value />
              </div>
            </div>

            <div class="row q-col-gutter-md items-center q-mt-sm">
              <div class="col-md-2">
                <strong>Enter no of QR </strong>
              </div>
              <div class="col-md-3">
                <q-input type="number" min="1" :disable="!formData.soList" oninput="this.value = Math.abs(this.value)"  :error="$v.formData.count.$error"  label="Enter no of QR" v-model.trim="formData.count" color="grey-9" />
              </div>
            </div>

            <div class="row q-col-gutter-md items-center q-mt-sm">
              <div class="col-md-2">
                <strong>Enter POD</strong>
              </div>
              <div class="col-md-3">
                <q-input disable label="Enter POD" :error="$v.formData.podNumber.$error" v-model.trim="formData.podNumber" color="grey-9" />
              </div>
            </div>

            <div class="row q-mt-md">
              <div class="col-md-5" align="right">
                <q-btn type="button" class="common-dark-blue" :disable="!formData.count" label="Assign" @click="fnAssignsubmit()" />
              </div>
            </div>

            <div class="q-mt-xl">
              <q-tabs v-model="innerTab" class="shadow-1" color="grey" @update:model-value="goToApproveTab">
                <q-tab name="tab-4" label="Pending List" />
                <q-tab name="tab-5" label="Approved List" />
                <q-tab name="tab-6" label="Rejected List" />
              </q-tabs>

              <q-tab-panells v-model="innerTab" animated>
                <q-tab-panell name="tab-4" class="q-pa-none">
                  <div class="row q-pa-sm">
                    <div class="col-8"></div>
                    <q-input class="col-4" v-model="filter4" clearable color="grey-9" placeholder="Type.."
                      label="Search By POD Number" />
                  </div>
                  <q-table table-class="customTableClass" class="q-py-none" :rows="tableData4" :columns="columns4"
                    :filter="filter4" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl4"
                    :loading="toggleAjaxLoadFilter4" @request="ajaxLoadAllLeadInfo4">
                    <template v-slot:body-cell-createdAt="props">
                      <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
                    </template>
                  </q-table>
                </q-tab-panell>

                <q-tab-panell name="tab-5" class="q-pa-none">
                  <div class="row q-pa-sm">
                    <div class="col-8"></div>
                    <q-input class="col-4" v-model="filter5" clearable color="grey-9" placeholder="Type.."
                      label="Search By POD Number" />
                  </div>
                  <q-table table-class="customTableClass" class="q-py-none" :rows="tableData5" :columns="columns5"
                    :filter="filter5" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl5"
                    :loading="toggleAjaxLoadFilter5" @request="ajaxLoadAllLeadInfo5">
                    <template v-slot:body-cell-createdAt="props">
                      <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
                    </template>
                  </q-table>
                </q-tab-panell>

                <q-tab-panell name="tab-6" class="q-pa-none">
                  <div class="row q-pa-sm">
                    <div class="col-8"></div>
                    <q-input class="col-4" v-model="filter6" clearable color="grey-9" placeholder="Type.."
                      label="Search By POD Number" />
                  </div>
                  <q-table table-class="customTableClass" class="q-py-none" :rows="tableData6" :columns="columns6"
                    :filter="filter6" :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl6"
                    :loading="toggleAjaxLoadFilter6" @request="ajaxLoadAllLeadInfo6">
                    <template v-slot:body-cell-createdAt="props">
                      <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
                    </template>
                  </q-table>
                </q-tab-panell>
              </q-tab-panells>
            </div>
          </q-tab-panell>
        </q-tab-panells>
      </div>
      <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
    </div>
    <staticQrRegionApprove v-if="staticQrRegionApproveModal" :propsApproveRegionModal="staticQrRegionApproveModal"
      :propsApproveRegion="Data" @closeModel="ApproveIncomingData" />
  </q-page>
</template>

<script>
import { minValue, required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { mapGetters, mapActions } from 'vuex'
import staticQrRegionApprove from '../../components/sat/staticQrRegionApprove.vue'

export default {
  name: 'staticQRinventory',
  components: {
    staticQrRegionApprove,
  },
  setup() {
    return { $v: useVuelidate() }
  },
  data() {
    return {
      staticQrRegionApproveModal: false,
      RegionalInventoryQrCount: [],
      bankListOptions: [],
      SoListData: [],
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      toggleAjaxLoadFilter4:false,
      toggleAjaxLoadFilter5:false,
      toggleAjaxLoadFilter6:false,
      activeTab: 'tab-1',
      innerTab: 'tab-4',
      filter: '',
      filter1: '',
      filter4:'',
      filter5:'',
      filter6:'',
      Data: [],
      paginationControl: { rowsNumber: 0, page: 1, sortBy: 'updatedAt', descending: true, rowsPerPage: 5 },
      paginationControl1: { rowsNumber: 0, page: 1, sortBy: 'updatedAt', descending: true, rowsPerPage: 5 },
      paginationControl4: { rowsNumber: 0, page: 1, sortBy: 'updatedAt', descending: true, rowsPerPage: 5 },
      paginationControl5: { rowsNumber: 0, page: 1, sortBy: 'updatedAt', descending: true, rowsPerPage: 5 },
      paginationControl6: { rowsNumber: 0, page: 1, sortBy: 'updatedAt', descending: true, rowsPerPage: 5 },
      formData: {
        soList: '',
        id: '',
        count: '',
        podNumber: ''
      },
      columns: [
        { name: 'updatedAt', required: true, label: 'Date', align: 'left', field: 'updatedAt', sortable: true },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank?.name, sortable: false },
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: row => row.podNumber, sortable: false },
        { name: 'requestCount', required: true, label: 'QR Count', align: 'left', field: row => row.requestCount, sortable: false },
        { name: 'Action', required: true, label: 'Action', align: 'left', sortable: false }
      ],
      columns2: [
        { name: 'updatedAt', required: true, label: 'Date', align: 'left', field: 'updatedAt', sortable: true },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank?.name, sortable: false },
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: row => row.podNumber, sortable: false },
        { name: 'requestCount', required: true, label: 'QR Count', align: 'left', field: row => row.requestCount, sortable: false }
      ],
      columns4: [
        { name: 'createdAt', required: true, label: 'Date', align: 'left', field: 'createdAt', sortable: true },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank?.name, sortable: false },
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: row => row.podNumber, sortable: false },
        { name: 'requestCount', required: true, label: 'QR Count', align: 'left', field: row => row.requestCount, sortable: false },
        { name: 'region', required: true, label: 'Region', align: 'left', field: row => row.region?.regionAreaName, sortable: false },
        { name: 'so', required: true, label: 'SO Name', align: 'left', field: row => row.so ? `${row.so.name} | ${row.so.employeeID}` : "NA", sortable: false }
      ],
      columns5: [
        { name: 'createdAt', required: true, label: 'Date', align: 'left', field: 'createdAt', sortable: true },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank?.name, sortable: false },
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: row => row.podNumber, sortable: false },
        { name: 'requestCount', required: true, label: 'QR Count', align: 'left', field: row => row.requestCount, sortable: false },
        { name: 'region', required: true, label: 'Region', align: 'left', field: row => row.region?.regionAreaName, sortable: false },
        { name: 'so', required: true, label: 'SO Name', align: 'left', field: row => row.so ? `${row.so.name} | ${row.so.employeeID}` : "NA", sortable: false }
      ],
      columns6: [
        { name: 'createdAt', required: true, label: 'Date', align: 'left', field: 'createdAt', sortable: true },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank?.name, sortable: false },
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: row => row.podNumber, sortable: false },
        { name: 'requestCount', required: true, label: 'QR Count', align: 'left', field: row => row.requestCount, sortable: false },
        { name: 'region', required: true, label: 'Region', align: 'left', field: row => row.region?.regionAreaName, sortable: false },
        { name: 'so', required: true, label: 'SO Name', align: 'left', field: row => row.so ? `${row.so.name} | ${row.so.employeeID}` : "NA", sortable: false }
      ],
      tableData: [],
      tableData1: [],
      tableData4: [],
      tableData5: [],
      tableData6: [],
    }
  },
  validations: {
    formData: {
      count: { required, min: minValue(1) },
      id: { required },
      soList: { required },
      podNumber: { required }
    }
  },
  computed: {
    ...mapGetters("InventoryCentral", ["getRegionBasedSO"]),
    ...mapGetters('staticQrInventory', ['getpendingQrList','getRejectedQrListOfSo','getApprovedQrListOfSo','getpendingQrListOfSo', 'getApprovedQrList', 'getStaticQrReginolInventory'])
  },
  created() {
    this.podGeneration()
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter })
    this.ajaxLoadAllLeadInfo4({ pagination: this.paginationControl4, filter: this.filter4 })
    this.ajaxLoadAllLeadInfo5({ pagination: this.paginationControl5, filter: this.filter5 })
    this.ajaxLoadAllLeadInfo6({ pagination: this.paginationControl6, filter: this.filter6 })
    this.regionalInventoryCount()
    this.fnAjaxGetAllBankList()
    this.regionBasedSoLoad()
  },
  methods: {
    ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
    ...mapActions('staticQrInventory', ['FETCH_UNAPPROVED_QR_LIST','FETCH_UNAPPROVED_QR_LIST_OF_SO', 'FETCH_APPROVED_QR_LIST_OF_SO','FETCH_REJECTED_QR_LIST_OF_SO','FETCH_APPROVED_QR_LIST', 'FETCH_STATIC_QR_REGIONAL_INVENTORY_COUNT']),
    ...mapActions('generateQR', ['FETCH_BANK_LIST','ASSIGN_SO']), 
    fnAssignsubmit(){
      this.$v.formData.$touch()
      if(this.$v.formData.$error){
        this.$q.notify('Please review fields again.')
      }else{
        const userInfo = JSON.parse(localStorage.getItem('u_i'))
        let request = {
          staticQrBank: { id: this.formData.id },
          so: { id: this.formData.soList },
          region: { id: userInfo.region.id },
          requestedCount: this.formData.count,
          podNumber: this.formData.podNumber
        }
        this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Assigning..' })
        this.ASSIGN_SO(request).then(() => {
          this.$q.notify({ color: 'positive', message: 'Successfully Assigned!', icon: 'thumb_up' })
          this.formData.id = '';
          this.formData.soList = '';
          this.formData.count = '';
          this.podGeneration();
          this.ajaxLoadAllLeadInfo4({ pagination: this.paginationControl4, filter: this.filter4 })
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter }),
          this.ajaxLoadAllLeadInfo5({ pagination: this.paginationControl5, filter: this.filter5 })
          this.$q.loading.hide()
        }).catch(() => {
          this.$q.notify({ color: 'negative', message: 'Failed to assign!', icon: 'thumb_down' })
          this.$q.loading.hide()
        })
      }
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' })
      this.FETCH_UNAPPROVED_QR_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl = pagination
          this.paginationControl.rowsNumber = this.getpendingQrList.totalElements
          this.paginationControl.page = this.getpendingQrList.number + 1
          this.tableData = this.getpendingQrList.content
          this.$q.loading.hide()
        })
        .catch(() => { this.$q.loading.hide() })
    },
    goToCompleteTab(tab) {
      if (tab == 'tab-2') {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filter1 })
      } else if (tab == 'tab-1') {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter })
      }
    },
    goToApproveTab(tab){
      if(tab == 'tab-4') this.ajaxLoadAllLeadInfo4({ pagination: this.paginationControl4, filter: this.filter4 })
      else if(tab == 'tab-5') this.ajaxLoadAllLeadInfo5({ pagination: this.paginationControl5, filter: this.filter5 })
      else if(tab == 'tab-6') this.ajaxLoadAllLeadInfo6({ pagination: this.paginationControl6, filter: this.filter6 })
    },
    ApproveIncomingData(rowData) {
      this.staticQrRegionApproveModal = !this.staticQrRegionApproveModal
      if (rowData) this.Data = rowData
      if (!this.staticQrRegionApproveModal) {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter })
        this.regionalInventoryCount()
      }
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' })
      this.FETCH_APPROVED_QR_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl1 = pagination
          this.paginationControl1.rowsNumber = this.getApprovedQrList.totalElements
          this.paginationControl1.page = this.getApprovedQrList.number + 1
          this.tableData1 = this.getApprovedQrList.content
          this.$q.loading.hide()
        })
        .catch(() => { this.$q.loading.hide() })
    },
    ajaxLoadAllLeadInfo4({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' })
      this.FETCH_UNAPPROVED_QR_LIST_OF_SO({ pagination, filter })
        .then(() => {
          this.paginationControl4 = pagination
          this.paginationControl4.rowsNumber = this.getpendingQrListOfSo.totalElements
          this.paginationControl4.page = this.getpendingQrListOfSo.number + 1
          this.tableData4 = this.getpendingQrListOfSo.content
          this.$q.loading.hide()
        })
        .catch(() => { this.$q.loading.hide() })
    },
    ajaxLoadAllLeadInfo5({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' })
      this.FETCH_APPROVED_QR_LIST_OF_SO({ pagination, filter })
        .then(() => {
          this.paginationControl5 = pagination
          this.paginationControl5.rowsNumber = this.getApprovedQrListOfSo.totalElements
          this.paginationControl5.page = this.getApprovedQrListOfSo.number + 1
          this.tableData5 = this.getApprovedQrListOfSo.content
          this.$q.loading.hide()
        })
        .catch(() => { this.$q.loading.hide() })
    },
    ajaxLoadAllLeadInfo6({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' })
      this.FETCH_REJECTED_QR_LIST_OF_SO({ pagination, filter })
        .then(() => {
          this.paginationControl6 = pagination
          this.paginationControl6.rowsNumber = this.getRejectedQrListOfSo.totalElements
          this.paginationControl6.page = this.getRejectedQrListOfSo.number + 1
          this.tableData6 = this.getRejectedQrListOfSo.content
          this.$q.loading.hide()
        })
        .catch(() => { this.$q.loading.hide() })
    },
    regionalInventoryCount() {
      this.FETCH_STATIC_QR_REGIONAL_INVENTORY_COUNT()
        .then(response => {
          this.RegionalInventoryQrCount = response.map(v => ({ label: v, value: v.qrBank.name }))
        })
        .catch(() => { this.$q.loading.hide() })
    },
    fnAjaxGetAllBankList() {
      this.FETCH_BANK_LIST()
        .then(response => {
          this.bankListOptions = response.data.data.map(v => ({ label: v.name, value: v.id }))
        })
        .catch(() => { this.bankListOptions = [] })
    },
    regionBasedSoLoad() {
      const userInfo = JSON.parse(localStorage.getItem('u_i'))
      if (!userInfo) return;
      this.FETCH_REGION_BASED_SO(userInfo.region.id).then(() => {
        this.SoListData = this.getRegionBasedSO.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }))
      })
    },
    podGeneration(){
      this.formData.podNumber = 'SO' + new Date().getTime()
    }
  }
}
</script>

<style>
.border-radius-10 { border-radius: 10px; }
</style>
