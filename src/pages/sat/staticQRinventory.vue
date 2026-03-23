<template>
  <q-page>
    <div class="q-pa-md">
      <div class="col-md-9 col-sm-12 col-xs-12">
        <div v-if="RegionalInventoryQrCount.length > 0" class="row">
          <q-card class="border-radius-10 q-pa-md q-ma-sm" style="background-color: #531b64; color: white; min-width: 120px" v-for="menu in RegionalInventoryQrCount" :key="menu.label.id">
            <div class="text-h6">{{ menu.label.requestCount || 0 }}</div>
            <div class="text-caption">{{ menu.value }}</div>
          </q-card>
        </div>
        <div v-else class="row">
          <q-banner class="bg-primary text-white" icon="info">No data available to display</q-banner>
        </div>
      </div>

      <div class="q-mt-lg">
        <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" @update:model-value="goToCompleteTab">
          <q-tab color="dark" name="tab-1" label="Pending QR" />
          <q-tab color="dark" name="tab-2" label="Approved QR" />
          <q-tab color="dark" name="tab-3" label="Allocate To SO" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <div class="row items-center q-mb-md">
              <q-space />
              <q-input class="col-12 col-sm-4" clearable color="grey-9" placeholder="Type.." v-model="filter" label="Search By POD Number" />
            </div>
            <q-table :rows="tableData" :columns="columns" :filter="filter" v-model:pagination="paginationControl" row-key="id" :loading="toggleAjaxLoadFilter" @request="ajaxLoadAllLeadInfo">
              <template v-slot:body-cell-updatedAt="props">
                <q-td :props="props">{{ props.row.updatedAt ? $moment(props.row.updatedAt).format("Do MMM Y") : "NA" }}</q-td>
              </template>
              <template v-slot:body-cell-Action="props">
                <q-td :props="props">
                  <q-btn dense no-caps label="Approve" icon="edit" size="sm" @click="ApproveIncomingData(props.row)" flat class="text-primary" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2">
            <div class="row items-center q-mb-md">
              <q-space />
              <q-input class="col-12 col-sm-4" v-model="filter1" clearable color="grey-9" placeholder="Type.." label="Search By POD Number" />
            </div>
            <q-table :rows="tableData1" :columns="columns2" :filter="filter1" v-model:pagination="paginationControl1" row-key="id" :loading="toggleAjaxLoadFilter1" @request="ajaxLoadAllLeadInfo1">
              <template v-slot:body-cell-updatedAt="props">
                <q-td :props="props">{{ props.row.updatedAt ? $moment(props.row.updatedAt).format("Do MMM Y") : "NA" }}</q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-3">
            <div class="q-gutter-md">
              <div class="row items-center q-col-gutter-md">
                <div class="col-12 col-md-2"><strong>Select Bank</strong></div>
                <div class="col-12 col-md-3">
                  <q-select clearable label="Select Bank" v-model="formData.id" :error="$v.formData.id.$error" color="grey-9" :options="bankListOptions" emit-value map-options />
                </div>
              </div>
              <div class="row items-center q-col-gutter-md">
                <div class="col-12 col-md-2"><strong>Select SO</strong></div>
                <div class="col-12 col-md-3">
                  <q-select :disable="!formData.id" filter clearable label="Select SO" v-model="formData.soList" :error="$v.formData.soList.$error" color="grey-9" :options="SoListData" emit-value map-options />
                </div>
              </div>
              <div class="row items-center q-col-gutter-md">
                <div class="col-12 col-md-2"><strong>Enter no of QR</strong></div>
                <div class="col-12 col-md-3">
                  <q-input type="number" min="1" :disable="!formData.soList" label="Enter no of QR" v-model.number="formData.count" :error="$v.formData.count.$error" color="grey-9" />
                </div>
              </div>
              <div class="row items-center q-col-gutter-md">
                <div class="col-12 col-md-2"><strong>Enter POD</strong></div>
                <div class="col-12 col-md-3">
                  <q-input disable label="Enter POD" v-model="formData.podNumber" :error="$v.formData.podNumber.$error" color="grey-9" />
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-5 text-right">
                  <q-btn class="common-dark-blue" :disabled="!formData.count" label="Assign" @click="fnAssignsubmit" />
                </div>
              </div>

              <div class="q-mt-xl">
                <q-tabs v-model="tab" class="shadow-1" color="grey" @update:model-value="goToApproveTab">
                  <q-tab color="dark" name="tab-4" label="Pending List" />
                  <q-tab color="dark" name="tab-5" label="Approved List" />
                  <q-tab color="dark" name="tab-6" label="Rejected List" />
                </q-tabs>
                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab-4">
                    <q-table :rows="tableData4" :columns="columns4" :filter="filter4" v-model:pagination="paginationControl4" row-key="id" @request="ajaxLoadAllLeadInfo4">
                      <template v-slot:body-cell-createdAt="props">
                        <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
                      </template>
                    </q-table>
                  </q-tab-panel>
                  <q-tab-panel name="tab-5">
                    <q-table :rows="tableData5" :columns="columns5" :filter="filter5" v-model:pagination="paginationControl5" row-key="id" @request="ajaxLoadAllLeadInfo5">
                      <template v-slot:body-cell-createdAt="props">
                        <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
                      </template>
                    </q-table>
                  </q-tab-panel>
                  <q-tab-panel name="tab-6">
                    <q-table :rows="tableData6" :columns="columns6" :filter="filter6" v-model:pagination="paginationControl6" row-key="id" @request="ajaxLoadAllLeadInfo6">
                      <template v-slot:body-cell-createdAt="props">
                        <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
                      </template>
                    </q-table>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <staticQrRegionApprove v-if="staticQrRegionApproveModal" :propsApproveRegionModal="staticQrRegionApproveModal" :propsApproveRegion="Data" @closeModel="ApproveIncomingData" />
  </q-page>
</template>

<script>
import { minValue, required } from "@vuelidate/validators";
import { mapGetters, mapActions } from 'vuex'
import staticQrRegionApprove from '../../components/sat/staticQrRegionApprove.vue'

export default {
  name: 'staticQRinventory',
  components: { staticQrRegionApprove },
  data() {
    return {
      activeTab: 'tab-1',
      tab: 'tab-4',
      staticQrRegionApproveModal: false,
      RegionalInventoryQrCount: [],
      bankListOptions: [],
      SoListData: [],
      filter: '',
      filter1: '',
      filter4: '',
      filter5: '',
      filter6: '',
      Data: [],
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      paginationControl: { rowsNumber: 5, page: 1, rowsPerPage: 5 },
      paginationControl1: { rowsNumber: 5, page: 1, rowsPerPage: 5 },
      paginationControl4: { rowsNumber: 5, page: 1, rowsPerPage: 5 },
      paginationControl5: { rowsNumber: 5, page: 1, rowsPerPage: 5 },
      paginationControl6: { rowsNumber: 5, page: 1, rowsPerPage: 5 },
      formData: { id: '', soList: '', count: '', podNumber: '' },
      columns: [
        { name: 'updatedAt', label: 'Date', align: 'left', field: 'updatedAt', sortable: true },
        { name: 'qrBank', label: 'Bank Name', align: 'left', field: row => row.qrBank?.name },
        { name: 'podNumber', label: 'Pod Number', align: 'left', field: 'podNumber' },
        { name: 'requestCount', label: 'QR Count', align: 'left', field: 'requestCount' },
        { name: 'Action', label: 'Action', align: 'left' }
      ],
      columns2: [
        { name: 'updatedAt', label: 'Date', align: 'left', field: 'updatedAt', sortable: true },
        { name: 'qrBank', label: 'Bank Name', align: 'left', field: row => row.qrBank?.name },
        { name: 'podNumber', label: 'Pod Number', align: 'left', field: 'podNumber' },
        { name: 'requestCount', label: 'QR Count', align: 'left', field: 'requestCount' }
      ],
      columns4: [
        { name: 'createdAt', label: 'Date', align: 'left', field: 'createdAt', sortable: true },
        { name: 'qrBank', label: 'Bank Name', align: 'left', field: row => row.qrBank?.name },
        { name: 'podNumber', label: 'Pod Number', align: 'left', field: 'podNumber' },
        { name: 'requestCount', label: 'QR Count', align: 'left', field: 'requestCount' },
        { name: 'region', label: 'Region', align: 'left', field: row => row.region?.regionAreaName },
        { name: 'so', label: 'SO Name', align: 'left', field: row => row.so ? (row.so.name + " | " + row.so.employeeID) : "NA" }
      ],
      columns5: [
        { name: 'createdAt', label: 'Date', align: 'left', field: 'createdAt', sortable: true },
        { name: 'qrBank', label: 'Bank Name', align: 'left', field: row => row.qrBank?.name },
        { name: 'podNumber', label: 'Pod Number', align: 'left', field: 'podNumber' },
        { name: 'requestCount', label: 'QR Count', align: 'left', field: 'requestCount' },
        { name: 'region', label: 'Region', align: 'left', field: row => row.region?.regionAreaName },
        { name: 'so', label: 'SO Name', align: 'left', field: row => row.so ? (row.so.name + " | " + row.so.employeeID) : "NA" }
      ],
      columns6: [
        { name: 'createdAt', label: 'Date', align: 'left', field: 'createdAt', sortable: true },
        { name: 'qrBank', label: 'Bank Name', align: 'left', field: row => row.qrBank?.name },
        { name: 'podNumber', label: 'Pod Number', align: 'left', field: 'podNumber' },
        { name: 'requestCount', label: 'QR Count', align: 'left', field: 'requestCount' },
        { name: 'region', label: 'Region', align: 'left', field: row => row.region?.regionAreaName },
        { name: 'so', label: 'SO Name', align: 'left', field: row => row.so ? (row.so.name + " | " + row.so.employeeID) : "NA" }
      ],
      tableData: [], tableData1: [], tableData4: [], tableData5: [], tableData6: []
    }
  },
  validations: {
    formData: {
      count: { required, minValue: minValue(1) },
      id: { required },
      soList: { required },
      podNumber: { required }
    }
  },
  computed: {
    ...mapGetters("InventoryCentral", ["getRegionBasedSO"]),
    ...mapGetters('staticQrInventory', ['getpendingQrList', 'getRejectedQrListOfSo', 'getApprovedQrListOfSo', 'getpendingQrListOfSo', 'getApprovedQrList'])
  },
  created() {
    this.podGeneration();
    this.regionalInventoryCount();
    this.fnAjaxGetAllBankList();
    this.regionBasedSoLoad();
    this.loadingData({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
    ...mapActions('staticQrInventory', ['FETCH_UNAPPROVED_QR_LIST', 'FETCH_UNAPPROVED_QR_LIST_OF_SO', 'FETCH_APPROVED_QR_LIST_OF_SO', 'FETCH_REJECTED_QR_LIST_OF_SO', 'FETCH_APPROVED_QR_LIST', 'FETCH_STATIC_QR_REGIONAL_INVENTORY_COUNT']),
    ...mapActions('generateQR', ['FETCH_BANK_LIST', 'ASSIGN_SO']),

    loadingData(request) {
      this.toggleAjaxLoadFilter = true;
      this.FETCH_UNAPPROVED_QR_LIST(request).then(() => {
        this.paginationControl = request.pagination;
        this.paginationControl.rowsNumber = this.getpendingQrList.totalElements;
        this.tableData = this.getpendingQrList.content;
        this.toggleAjaxLoadFilter = false;
      }).catch(() => { this.toggleAjaxLoadFilter = false; });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_APPROVED_QR_LIST({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getApprovedQrList.totalElements;
        this.tableData1 = this.getApprovedQrList.content;
        this.toggleAjaxLoadFilter1 = false;
      }).catch(() => { this.toggleAjaxLoadFilter1 = false; });
    },
    ajaxLoadAllLeadInfo4({ pagination, filter }) {
      this.FETCH_UNAPPROVED_QR_LIST_OF_SO({ pagination, filter }).then(() => {
        this.paginationControl4 = pagination;
        this.paginationControl4.rowsNumber = this.getpendingQrListOfSo.totalElements;
        this.tableData4 = this.getpendingQrListOfSo.content;
      });
    },
    ajaxLoadAllLeadInfo5({ pagination, filter }) {
      this.FETCH_APPROVED_QR_LIST_OF_SO({ pagination, filter }).then(() => {
        this.paginationControl5 = pagination;
        this.paginationControl5.rowsNumber = this.getApprovedQrListOfSo.totalElements;
        this.tableData5 = this.getApprovedQrListOfSo.content;
      });
    },
    ajaxLoadAllLeadInfo6({ pagination, filter }) {
      this.FETCH_REJECTED_QR_LIST_OF_SO({ pagination, filter }).then(() => {
        this.paginationControl6 = pagination;
        this.paginationControl6.rowsNumber = this.getRejectedQrListOfSo.totalElements;
        this.tableData6 = this.getRejectedQrListOfSo.content;
      });
    },
    goToCompleteTab(tab) {
      if (tab === 'tab-2') this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      else if (tab === 'tab-1') this.loadingData({ pagination: this.paginationControl, filter: "" });
      else if (tab === 'tab-3') this.goToApproveTab(this.tab);
    },
    goToApproveTab(tab) {
      const p = { pagination: this[`paginationControl${tab.slice(-1)}`], filter: "" };
      if (tab === 'tab-4') this.ajaxLoadAllLeadInfo4(p);
      else if (tab === 'tab-5') this.ajaxLoadAllLeadInfo5(p);
      else this.ajaxLoadAllLeadInfo6(p);
    },
    regionalInventoryCount() {
      this.FETCH_STATIC_QR_REGIONAL_INVENTORY_COUNT().then(res => {
        this.RegionalInventoryQrCount = res.map(v => ({ label: v, value: v.qrBank?.name }));
      });
    },
    fnAjaxGetAllBankList() {
      this.FETCH_BANK_LIST().then(res => {
        this.bankListOptions = res.data.data.map(v => ({ label: v.name, value: v.id }));
      });
    },
    regionBasedSoLoad() {
      const regId = JSON.parse(localStorage.getItem('u_i')).region.id;
      this.FETCH_REGION_BASED_SO(regId).then(() => {
        this.SoListData = this.getRegionBasedSO.map(v => ({ label: v.name + " | " + v.employeeID, value: v.id }));
      });
    },
    podGeneration() { this.formData.podNumber = 'SO' + new Date().getTime(); },
    fnAssignsubmit() {
      this.$v.formData.$touch();
      if (this.$v.formData.$error) { this.$q.notify('Please review fields again.'); return; }
      const regId = JSON.parse(localStorage.getItem('u_i')).region.id;
      const req = { staticQrBank: { id: this.formData.id }, so: { id: this.formData.soList }, region: { id: regId }, requestedCount: this.formData.count, podNumber: this.formData.podNumber };
      this.$q.loading.show();
      this.ASSIGN_SO(req).then(() => {
        this.$q.notify({ color: 'positive', position: 'bottom', message: 'Successfully Assigned!', icon: 'thumb_up' });
        this.formData = { id: '', soList: '', count: '', podNumber: '' };
        this.podGeneration();
        this.goToApproveTab(this.tab);
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ApproveIncomingData(rowData) {
      this.staticQrRegionApproveModal = !this.staticQrRegionApproveModal;
      if (rowData) this.Data = rowData;
      if (!this.staticQrRegionApproveModal) {
        this.loadingData({ pagination: this.paginationControl, filter: "" });
        this.regionalInventoryCount();
      }
    }
  }
};
</script>
