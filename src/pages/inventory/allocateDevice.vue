<template>
  <q-page>
    <!-- content -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <q-radio class="radio" v-for="(item, index) in formData.flagOptions" :key="index" color="grey-9" v-model="formData.flag"
          :val="item.value" :label="item.label" />
    </div>
    <div>
    <div  v-if="formData.flag == 1">
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!--START: table title -->
        <div class="col-6 col-sm-4 col-md-8 text-h6 text-weight-regular text-grey-9">Bijlipay Allocate Device</div>
         <div class="col-md-12 col-md-6 q-pt-md group" align="right">
          <q-btn
            @click="$router.push('/inventory/central')"
            outline
            label="Cancel Allocation"
            color="negative"
          />
        </div>
        <!--END: table title -->
      </div>
      <div
        class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9"
      >
        <div class="col-md-4">
          <q-select
            filled
            :disable="formData.device_type != ''"
            :class="[formData.device_type != '' ? 'no-pointer-events' : '']"
            v-model="formData.region"
            label="Select Region"
            color="grey-9"
            :options="regionOptions"
            emit-value
            map-options
          />
          
        </div>
        <div class="col-md-4">
          <q-select
            filled
            clearable
            :disable="formData.region == ''"
            @clear="fnClearingDeviceTypeSelection"
            @update:model-value="fnSetDevicesByDeviceId"
            v-model="formData.device_type"
            label="Select Device Type"
            color="grey-9"
            :options="deviceOptions"
          />
        </div>

        <div class="col-12 col-lg-4 group" align="right">
          <q-btn
            :disabled="formData.device_type == '' || formData.region == ''"
            @click="openScannerComp"
            v-if="scannerToggleOption"
            color="light-blue"
            class="q-py-xs"
            label="Start scan"
          />
          <q-btn
            icon="shopping_cart"
            outline
            class="q-py-xs q-ml-sm"
            label="Add to cart"
            @click="fnAllocateDeviceToRegion"
          />
        </div>
        <!--END: table title -->
      </div>

      <div class="row text-weight-regular text-grey-9">
        <div class="col-md-4 q-pa-sm" v-for="(item,index) in formData.scannedItems" :key="index">
          <q-card
            class="shadow-4"
            :style="'border:'+(formData.device_type && formData.device_type.id == item.device.id ? '2px solid #61116a' : 'unset')"
          >
            <q-list
              separator
              class="q-pa-none"
              :class="[formData.device_type && formData.device_type.id == item.device.id ? 'activeDeviceTab' : '']"
            >
              <q-item-label header class="bottom-border">
                <q-icon
                  :style="'color:'+(formData.device_type && formData.device_type.id == item.device.id ? '#fff' : '#202c3f')"
                  name="fas fa-tablet-alt"
                />
                {{item.device.deviceName}}
              </q-item-label>
              <q-scroll-area
                style="height:400px"
                :thumb-style="{
                    right: '4px',
                    borderRadius: '5px',
                    background: 'grey',
                    width: '5px',
                    opacity: 0.5
                  }"
                :delay="1500"
              >
                <div v-if="item.deviceSerialNumbers.length > 0">
                  <q-item
                    clickable
                    class="text-light-blue"
                    v-for="(subItem,subIndex) in item.deviceSerialNumbers"
                    :key="subIndex"
                  >
                    <q-item-section>{{subItem}}</q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        size="sm"
                        color="negative"
                        icon="clear"
                        @click="fnRemoveScannedItems(index,subIndex)"
                      />
                    </q-item-section>
                  </q-item>
                </div>
                <div v-else>
                  <q-item>
                    <q-item-section>No data to display</q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        size="sm"
                        color="negative"
                        @click="fnRemoveDeviceTypeFromList(index)"
                        icon="clear"
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </q-scroll-area>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
    <div v-if="formData.flag == 2">
      
          <div class="col-md-3">
            <div  class="col-md-9 col-sm-12 col-xs-12">
              <div class="row bottom-border q-px-md q-py-md items-center">
              <div class="col-6 col-sm-4 col-md-8 text-h6 text-weight-regular text-grey-9 align1"
              >Bijlipay Allocate QR</div>
            </div>
              <div v-if="formData.count != null" class="row">
                <q-card class="card bg-purple-9 text-white" align="center">
                  <div>
                    <big class="alignbtn">{{ remainingCount || 0 }} </big>
                  </div>
                  <p>{{ label }}</p>
                </q-card>

              </div>
              <div v-else class="row group">
                <div>
                  <q-banner class="bg-purple-9 text-white" icon="info">No data available to display</q-banner>
                </div>
              </div>
            </div>
           
            <div class="row items-center q-my-sm">
              <label class="qrlabel"><b>Select Bank</b></label>
              <div class="col-md-3">
                <q-select class="sizeBank" filled clearable label="Select Bank"  @update:model-value="showChannel($event)" v-model="formData.bank" :error="$v.formData.bank.$error"
                  color="grey-9" :options="bankListOptions" emit-value map-options />
              </div>
            </div>
            <div class="row items-center q-my-sm">
              <label class="qrlabel" ><b>Select Region</b></label>
              <div class="col-md-3">
                <q-select class="sizeRegion" filled clearable :disable="!formData.bank" label="Select Region" v-model="formData.regionList" :error="$v.formData.regionList.$error" color="grey-9"
                  :options="RegionOptionIcici" emit-value map-options />
              </div>
            </div>
        
          </div>
          <div class="row items-center q-my-sm">
            <label class="qrlabel" for="input-id"><b>Enter No Of QR</b></label>
            <q-input class="sizeQR" filled type="number" :disable="!formData.regionList" label="Enter no of QR" min="1" @update:model-value="val => formData.count = Math.abs(val)"  v-model="formData.count" :error="$v.formData.count.$error"  @blur="$v.formData.count.$touch" color="grey-9" />
          </div>
          <div class="row items-center q-my-sm">
            <label class="qrlabel" for="input-id"><b>Enter POD</b></label>
            <q-input class="alignPOD" filled disable label="Enter POD" v-model="formData.podNumber" :error="$v.formData.podNumber.$error"  @blur="$v.formData.podNumber.$touch"  color="grey-9" />
          </div>
          <div class="row q-my-md">
            <div class="col-md-6" align="right">
              <q-btn color="purple-9" :disable="!formData.count" label="Assign" @click="fnAssignsubmit()" />
            </div>
          </div>

          <div class="col-12">
            <q-tabs v-model="activeTab" class="shadow-1 bg-grey-1" active-color="purple-9" indicator-color="purple-9">
              <q-tab name="tab-1" label="Pending QR" />
              <q-tab name="tab-2" label="Approved QR" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated>
              <q-tab-panel name="tab-1">
                <div>
                  <q-input class="col-5 search q-mb-md" filled clearable color="grey-9" placeholder="Type.." v-model="filter"
                    label="Search By POD Number" />
                </div>
                <q-table table-class="customTableClass" :rows="tableData" :columns="columns"
                  v-model:pagination="paginationControl2" :filter="filter" row-key="id" :loading="toggleAjaxLoadFilter1"
                  :rows-per-page-options="[5, 10, 15, 20]" @request="ajaxLoadAllRegionList">
                  <template v-slot:body-cell-createdAt="props">
                    <q-td :props="props">{{
                      props.row.createdAt == null ? 'NA' :
                      $moment(props.row.createdAt).format("Do MMM Y")
                    }}</q-td>
                  </template>
                  <template v-slot:body-cell-Action="props">
                    <q-td :props="props">
                      <q-btn no-caps icon="edit" color="primary" @click="editCount(props.row)" size="xs" round />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-Action2="props">
                    <q-td :props="props">
                      <div v-if="props.row.updated == true">
                        <q-btn no-caps icon="priority_high" color="orange" size="xs" round />
                      </div>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="tab-2">
                <q-input class="col-5 search q-mb-md" filled clearable color="grey-9" placeholder="Type.." v-model="filter1"
                  label="Search By POD Number" />
                <q-table table-class="customTableClass" :rows="tableData1" :columns="columns1"
                  v-model:pagination="paginationControl1" :filter="filter1" row-key="id" :loading="toggleAjaxLoadFilter1"
                  :rows-per-page-options="[5, 10, 15, 20]" @request="ajaxLoadAllRegionList1">
                </q-table>
              </q-tab-panel>
            </q-tab-panels>

          </div>
        </div>
      <!--START: Open showPDOmodal model -->
      <showPDOmodal
        v-if="showPDOmodal"
        :propshowPDOmodal="showPDOmodal"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"
      ></showPDOmodal>
      <editCountModal v-if="editCountModal" :propseditCountModal="editCountModal" :propsAllPendingQrItem="Data"
      @closeModel="editCount">
    </editCountModal>
      <!--END: Open showPDOmodal model -->
    </div>
  </q-page>
</template>

<script>
import { minValue, required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { mapGetters, mapActions } from "vuex";
import showPDOmodal from "../../components/inventory/showPDOmodal.vue";
import editCountModal from '../../components/inventory/editCountModal.vue'
import _ from "lodash";

export default {
  name: "AllocateDevice",
  components: {
    showPDOmodal,
    editCountModal
  },
  setup() {
    return { $v: useVuelidate() }
  },
  data() {
    return {
      activeTab: 'tab-1',
      label: '',
      batchList: [],
      RegionOptionIcici: [],
      inventoryQrCount: [],
      remainingCount: 0,
      bankListOptions: [],
      filterSearch: "",
      scannerToggleOption: true,
      showPDOmodal: false,
      editCountModal: false,
      tableData: [],
      tableData1: [],
      regionOptions: [],
      deviceOptions: [],
      toggleAjaxLoadFilter1: false,
      tempTableData: [],
      filter: '',
      filter1: '',
      Data: null,
      formData: {
        flag: 1,
        region: "",
        device_type: "",
        count: "",
        Batch: '',
        podNumber: '',
        regionList: '',
        bank: '',
        scannedItems: [],
        flagOptions: [
          { label: 'Device', value: 1 },
          { label: 'QR', value: 2 }
        ]
      },
      paginationControl2: {
        rowsNumber: 5,
        page: 1,
        sortBy: 'podNumber',
        descending: false,
        rowsPerPage: 5
      },
      paginationControl1: {
        rowsNumber: 5,
        page: 1,
        sortBy: 'podNumber',
        descending: false,
        rowsPerPage: 5
      },
      paginationControl: {
        rowsPerPage: 10
      },
      tableAjaxLoading: false,
      columns: [
        { name: 'createdAt', required: true, label: 'createdAt', align: 'left', field: 'createdAt', sortable: true },
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: 'podNumber', sortable: true },
        { name: 'count', required: true, label: 'Assigned Count', align: 'left', field: 'count', sortable: false },
        { name: 'receivedCount', required: true, label: 'Received Count', align: 'left', field: row => row.receivedCount == 0 ? "Not Yet Received" : row.receivedCount, sortable: false },
        { name: 'region', required: true, label: 'Region', align: 'left', field: row => row.region.regionAreaName, sortable: false },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank.name, sortable: false },
        { name: 'Action', required: true, label: 'Action', align: 'left', sortable: false },
        { name: 'Action2', required: true, label: 'Updated', align: 'left', sortable: false }
      ],
      columns1: [
        { name: 'podNumber', required: true, label: 'Pod Number', align: 'left', field: 'podNumber', sortable: true },
        { name: 'count', required: true, label: 'Count', align: 'left', field: 'count', sortable: false },
        { name: 'region', required: true, label: 'Region', align: 'left', field: row => row.region.regionAreaName, sortable: false },
        { name: 'qrBank', required: true, label: 'Bank Name', align: 'left', field: row => row.qrBank.name, sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters("InventoryCentral", ["getAllInventoryDevicesTypesData", "getAllRegionsData", "getAllBatchForm"]),
    ...mapGetters('generateQR', ['getAllRegionList', 'getAllBankList', 'getAllRegionBasedQrAllocatedApproveList', 'getAllActiveBatchList', 'getAllRegionBasedQrAllocatedList']),
    ...mapGetters('iciciStaticQr', ['getStaicQrInventoryCount']),
    GLOBAL_FILE_FETCH_URL() {
      return this.$store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'];
    }
  },
  validations: {
    formData: {
      bank: { required },
      regionList: { required },
      count: { required, minValue: minValue(1) },
      podNumber: { required }
    }
  },
  created() {
    this.fnAjaxGetAllDevicesTypesData();
    this.fnAjaxGetAllRegionsData();
    this.fnAjaxGetAllBankList();
    this.fnAjaxGetAllRegionList();
    this.inventoryCount();
    this.podGeneration();
  },
  unmounted() {
    this.$barcodeScanner.destroy();
  },
  methods: {
    ...mapActions("InventoryCentral", ["FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA", "FETCH_ALL_REGIONS_DATA"]),
    ...mapActions("VerifyDevice", ["DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION"]),
    ...mapActions('generateQR', ['FETCH_BANK_LIST', 'FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST', 'FETCH_REGION_LIST', 'ASSIGN_REGION', 'FETCH_REGION_BASED_QR_ALLOCATED_LIST']),
    ...mapActions('iciciStaticQr', ['FETCH_STATIC_QR_INVENTORY_COUNT']),

    ajaxLoadAllRegionList({ pagination, filter }) {
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_REGION_BASED_QR_ALLOCATED_LIST({ pagination, filter }).then(response => {
          this.paginationControl2 = pagination;
          this.paginationControl2.rowsNumber = response.totalElements;
          this.paginationControl2.page = response.number + 1;
          this.tableData = response.content;
          this.toggleAjaxLoadFilter1 = false;
        })
        .catch(() => { this.toggleAjaxLoadFilter1 = false; });
    },
    ajaxLoadAllRegionList1({ pagination, filter }) {
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_REGION_BASED_QR_ALLOCATED_APPROVED_LIST({ pagination, filter }).then(response => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = response.totalElements;
          this.paginationControl1.page = response.number + 1;
          this.tableData1 = response.content;
          this.toggleAjaxLoadFilter1 = false;
        })
        .catch(() => { this.toggleAjaxLoadFilter1 = false; });
    },
    fnAjaxGetAllRegionList() {
      this.FETCH_REGION_LIST()
        .then(res => {
          this.RegionOptionIcici = res.data.data.map(v => ({ label: v.regionAreaName, value: v.id }));
        });
    },
    inventoryCount() {
      this.FETCH_STATIC_QR_INVENTORY_COUNT().then(response => { this.inventoryQrCount = response; });
    },
    showChannel(event) {
      if (this.inventoryQrCount.length > 0) {
        const obj = this.inventoryQrCount.find(o => o.staticQrBank.id === event);
        if (obj) {
          this.remainingCount = obj.count;
          this.label = obj.staticQrBank.name;
        }
      }
    },
    podGeneration() {
      this.formData.podNumber = 'REG' + new Date().getTime();
    },
    fnAssignsubmit() {
      this.$v.formData.$touch();
      if (this.$v.formData.$error) {
        this.$q.notify('Please review fields again.');
      } else {
        let request = {
          staticQrBank: { id: this.formData.bank },
          region: { id: this.formData.regionList },
          requestedCount: this.formData.count,
          podNumber: this.formData.podNumber
        };
        this.$q.loading.show({ message: 'Assigning..' });
        this.ASSIGN_REGION(request).then(() => {
          this.ajaxLoadAllRegionList({ pagination: this.paginationControl2 });
          this.$q.notify({ color: 'positive', message: 'Successfully Assigned!' });
          this.inventoryCount();
          this.formData.bank = '';
          this.formData.regionList = '';
          this.formData.count = '';
          this.remainingCount = 0;
          this.podGeneration();
          this.$q.loading.hide();
        }).catch(() => { this.$q.loading.hide(); });
      }
    },
    fnAjaxGetAllBankList() {
      this.FETCH_BANK_LIST().then(response => {
        this.bankListOptions = response.data.data.map(v => ({ label: v.name, value: v.id }));
      });
    },
    fnSetDevicesByDeviceId() {
      this.scannerToggleOption = true;
      this.$barcodeScanner.destroy();
      if (!this.formData.device_type) return;
      let exist = this.formData.scannedItems.find(v => v.device.id == this.formData.device_type.id);
      if (!exist) {
        this.formData.scannedItems.unshift({
          device: { deviceName: this.formData.device_type.deviceName, id: this.formData.device_type.id },
          deviceSerialNumbers: []
        });
      }
    },
    onBarcodeScanned(barcode) {
      let item = this.formData.scannedItems.find(v => v.device.id == this.formData.device_type.id);
      if (item && !item.deviceSerialNumbers.includes(barcode)) {
        this.DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION({
          device: this.formData.device_type.id,
          barcode: barcode
        }).then(() => {
          item.deviceSerialNumbers.push(barcode);
        }).catch(() => {
          this.$q.notify({ color: 'negative', message: barcode + " is invalid" });
        });
      } else {
        this.$q.notify({ color: 'warning', message: barcode + " already scanned" });
      }
    },
    openScannerComp() {
      this.$q.notify({ color: "positive", message: "Start scanning for " + this.formData.device_type.deviceName });
      this.scannerToggleOption = false;
      if (!this.$barcodeScanner.hasListener()) {
        this.$barcodeScanner.init(this.onBarcodeScanned);
      }
    },
    fnRemoveScannedItems(index, subIndex) {
      this.formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
    },
    fnAllocateDeviceToRegion() {
      this.showPDOmodal = !this.showPDOmodal;
    },
    fnAjaxGetAllDevicesTypesData() {
      this.FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA().then(() => {
        this.deviceOptions = this.getAllInventoryDevicesTypesData.map(v => ({ label: v.deviceName, value: v }));
      });
    },
    fnAjaxGetAllRegionsData() {
      this.FETCH_ALL_REGIONS_DATA().then(() => {
        this.regionOptions = this.getAllRegionsData.map(v => ({ label: v.regionAreaName, value: v.id }));
      });
    },
    fnRemoveDeviceTypeFromList(index) {
      this.formData.scannedItems.splice(index, 1);
    },
    fnClearingDeviceTypeSelection() {
      this.formData.device_type = "";
      this.formData.scannedItems = [];
    },
    editCount(rowDetails) {
      this.editCountModal = !this.editCountModal;
      if (rowDetails) this.Data = rowDetails;
      if (!this.editCountModal) {
        this.ajaxLoadAllRegionList({ pagination: this.paginationControl2 });
      }
    },
    PullToRefresh(done) {
      done();
    }
  }
};
</script>
<style scoped>
.activeDeviceTab .q-item-label--header {
  background: #61116a;
  color: #fff;
}
.qrlabel { padding: 10px 20px; min-width: 150px; display: inline-block; }
.card { padding: 10px; width: 150px; border-radius: 12px; margin: 10px; }
.sizeBank, .sizeRegion, .sizeQR, .alignPOD { width: 300px; max-width: 100%; }
.search { width: 300px; }
</style>
