<template>
  <q-page>
    <div>
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-2">
          <q-select map-options emit-value filter clearable  v-model="formData.so" label="Select SO" radio color="grey-9"
            :options="assignToOptions" @update:model-value="SelectedSo" />
        </div>
        <div class="col-12 col-lg-4 group" align="right">
          <q-btn :disabled="formData.so == ''" @click="openScannerComp"
            v-if="scannerToggleOption" color="light-blue" class="q-py-xs" label="Start scan" />
          <q-btn icon="shopping_cart" outline class="q-py-xs" label="Re-Assign" @click="fnAllocateDeviceToSO" />
        </div>
        <!--END: table title -->
      </div>
      <div class="row text-weight-regular text-grey-9">
        <div class="col group" v-for="(item, index) in formData.scannedItems" :key="index">
          <q-card class="shadow-4"
            :style="'border:' + [formData.device_type.id == item.device.id ? '2px solid #61116a' : 'unset']">
            <q-list highlight separator class="q-pa-none"
              :class="[formData.device_type.id == item.device.id ? 'activeDeviceTab' : '']">
              <q-item-label header style="border-bottom: 1px solid #ccc;">
                <q-icon :style="'color:' + [formData.device_type.id == item.device.id ? '#fff' : '#202c3f']"
                  name="fas fa-tablet-alt" />
                {{ item.device.deviceName }}
              </q-item-label>
              <q-scroll-area style="height:400px" :thumb-style="{
                right: '4px',
                borderRadius: '5px',
                background: 'grey',
                width: '5px',
                opacity: 0.5
              }" :delay="1500">
                <div v-if="item.deviceSerialNumbers.length > 0">
                  <q-item separator class="text-light-blue" v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                    :key="subIndex">
                    <q-item-section class="q-body-1">{{ subItem }}</q-item-section>
                    <q-item-section class="q-body-1">{{item.userName[subIndex]}}</q-item-section>
                    <q-item-section side>
                      <q-btn round size="sm" color="negative" icon="clear"
                        @click="fnRemoveScannedItems(index, subIndex)" />
                    </q-item-section>
                  </q-item>
                </div>
                <div v-else>
                  <q-item>
                    <q-item-section class="q-body-1">No data to display</q-item-section>
                    <q-item-section side>
                      <q-btn round size="sm" color="negative" @click="fnRemoveDeviceTypeFromList(index)" icon="clear" />
                    </q-item-section>
                  </q-item>
                </div>
              </q-scroll-area>
            </q-list>
          </q-card>
        </div>
      </div>
      <!--START: Open showPDOmodal model -->
      <showAggregatorsPDOSotoSO v-if="showAggregatorsPDOSotoSO"
        :propshowRegionBasedSo="showAggregatorsPDOSotoSO"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToSO" @emittedAfterPODsubmission="fnClearingDeviceTypeSelection">
      </showAggregatorsPDOSotoSO>
      <!--END: Open showPDOmodal model -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showAggregatorsPDOSotoSO from "../../components/inventory/showAggregatorsPDOSotoSO.vue";
import _ from 'lodash';

export default {
  name: "AggregatorSOtoso",
  components: {
      showAggregatorsPDOSotoSO
  },
  data() {
    return {
      userName:"",
      filterSearch: "",
      scannerToggleOption: true,
      assignToOptions:[],
      showAggregatorsPDOSotoSO: false,
      regionOptions: [],
      deviceOptions: [],
      regionBasedSo: [],

      tempTableData: [],
      formData: {
        region: "",
        device_type: "",
        so: "",
        scannedItems: [],
        assignedUserId:'',
      },
      paginationControl: {
        rowsPerPage: 10
      },
      tableAjaxLoading: false
    };
  },

  computed: {
    ...mapGetters("InventoryCentral", [
      "getAllInventoryDevicesTypesData",
      "getAllRegionsData",
      "getRegionBasedSO"
    ]),
    ...mapGetters("ImplementationExecutive", [
          "getImplementationExecutiveList"
      ]),
    ...mapGetters("superAdminAggregatorsDevice", ["getCreatedActiveDeviceList"]),
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"]),
  },
  beforeMount(){
    this.implementationExecutiveList()
  },
  created() {
    this.fnAjaxGetAllRegionsData();
  },
  unmounted() {
    this.$barcodeScanner.destroy();
  },

  methods: {
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    ...mapActions("InventoryCentral", [
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_REGION_BASED_SO"
    ]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("superAdminAggregatorsDevice", ["GET_ACTIVE_CREATED_DEVICE_LIST"]),
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
    ...mapActions("VerifyDevice", [
      "AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION"
    ]),

    fnSetDevicesByDeviceId() {
      this.$barcodeScanner.destroy();
      let self = this;
      let predictIfDeviceExist = self.formData.scannedItems.filter(function(
        value
      ) {
        return value.device.id == self.formData.device_type.id;
      });

      if (predictIfDeviceExist.length == 0) {
        self.formData.scannedItems.unshift({
          device: {
            deviceName: self.formData.device_type.deviceName,
            id: self.formData.device_type.id
          },
          deviceSerialNumbers: [],
          userName:[]
        });
      }
    },
    fnClearingDeviceTypeSelection(closeModal) {
      this.formData.device_type = "";
      this.formData.scannedItems = [];
      this.formData.region = "";
      this.formData.so = "";
    },
    SelectedSo() {
      this.scannerToggleOption = true;
      this.$barcodeScanner.destroy();
    },

    implementationExecutiveList() {
      this.IMPLEMENTATION_EXECUTIVE_LIST().then(response => {
        let assumeArr = [];
        this.getImplementationExecutiveList.map(function (value) {
          assumeArr.push({ label: value.name+" | "+value.employeeID+" | "+value.email, value: value.id });
        });
        this.assignToOptions = assumeArr;
      });
    },

    onBarcodeScanned(barcode) {
      let self = this;
      this.AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION({
        device: self.formData.device_type?.id || 0,
        barcode: barcode
      })
      .then(response => {
        let deviceData = response.data.data;
        self.userName = deviceData.user.username;
        let deviceType = deviceData.aggregatorRegionalInventory.aggregatorDevice;

        let predictIfDeviceExist = self.formData.scannedItems.find(val => val.device.id == deviceType.id);
        if (!predictIfDeviceExist) {
            predictIfDeviceExist = {
                device: { deviceName: deviceType.deviceName, id: deviceType.id },
                deviceSerialNumbers: [],
                userName: []
            };
            self.formData.scannedItems.unshift(predictIfDeviceExist);
        }

        if (!predictIfDeviceExist.deviceSerialNumbers.includes(barcode)) {
            predictIfDeviceExist.deviceSerialNumbers.push(barcode);
            predictIfDeviceExist.userName.push(self.userName);
            self.formData.assignedUserId = deviceData.user.id;
            this.scannerToggleOption = false;
        }
      })
      .catch(error => {
        this.$q.notify({
          color: "primary",
          position: "bottom",
          message: barcode +" - "+ (error.data?.message || "Invalid Device"),
          icon: "info"
        });
      });
    },

    openScannerComp() {
      this.$q.notify({
        color: "positive",
        position: "bottom",
        message: "Start scanning",
        icon: "list"
      });

      this.scannerToggleOption = false;

      if (!this.$barcodeScanner.hasListener()) {
        this.$barcodeScanner.init(this.onBarcodeScanned);
      }
    },

    fnRemoveScannedItems(index, subIndex) {
      this.formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
      this.formData.scannedItems[index].userName.splice(subIndex, 1);
      this.scannerToggleOption = true;
    },

    fnAllocateDeviceToSO(token) {
      this.showAggregatorsPDOSotoSO = !this.showAggregatorsPDOSotoSO;
      if (token == 'refresh') {
        this.formData.device_type = "";
        this.formData.scannedItems = [];
        this.formData.region = "";
        this.formData.so = "";
      }
    },

    regionBasedSO() {
      this.FETCH_REGION_BASED_SO(this.formData.region).then(() => {
        let assumeArr = [];
        this.getRegionBasedSO.map(function (value, index) {
          assumeArr.push({
            label: value.name + " | " + value.employeeID+ " | " + value.email,
            value: value.id
          });
        });
        this.regionBasedSo = assumeArr;
      });
    },
    fnAjaxGetAllRegionsData() {
      this.FETCH_ALL_REGIONS_DATA().then(() => {
        let assumeArr = [];
        this.getAllRegionsData.map(function (value, index) {
          assumeArr.push({ label: value.regionAreaName, value: value.id });
        });
        this.regionOptions = assumeArr;
      });
    },

    fnRemoveDeviceTypeFromList(index) {
      this.formData.scannedItems.splice(index, 1);
      this.scannerToggleOption = true;
    },

    fnClearingDeviceTypeSelection() {
      this.formData.device_type = "";
      this.formData.scannedItems = [];
    }
  }
};
</script>
<style scoped>
.activeDeviceTab .q-item-label--header {
  border-bottom: 1px solid rgb(204, 204, 204);
  background: #61116a;
  color: #fff;
}
</style>