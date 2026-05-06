<template>
  <q-page>
    <!-- content -->

    <div>

      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <!--START: table title -->
        <div class="col-md-2">
          <q-select map-options emit-value :disable="formData.device_type != ''"
            :class="[formData.device_type != '' ? 'no-pointer-events' : '']" v-model="formData.region"
            label="Select Region" radio color="grey-9" :options="regionOptions" @update:model-value="regionBasedSO" />
        </div>
        <div class="col-md-2">
          <q-select map-options emit-value filter clearable :disable="formData.region == ''" v-model="formData.so" label="Select SO" radio color="grey-9"
            :options="regionBasedSo" @update:model-value="SelectedSo" />
        </div>
        <div class="col-md-2">
          <q-select map-options emit-value clearable :disable="formData.so == ''" @clear="fnClearingDeviceTypeSelection"
            @update:model-value="fnSetDevicesByDeviceId" v-model="formData.device_type" label="Select Device Type" radio
            color="grey-9" :options="deviceOptions" />
        </div>

        <div class="col-12 col-lg-4 group" align="right">
          <q-btn :disabled="formData.device_type == '' || formData.region == ''" @click="openScannerComp"
            v-if="scannerToggleOption" color="light-blue" class="q-py-xs" label="Start scan" />
          <q-btn icon="shopping_cart" outline class="q-py-xs" label="Add to cart" @click="fnAllocateDeviceToRegion" />
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
      <showAggregatorsPDORegionBasedSo v-if="showAggregatorsPDORegionBasedSo"
        :propshowRegionBasedSo="showAggregatorsPDORegionBasedSo" :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion" @emittedAfterPODsubmission="fnClearingDeviceTypeSelection">
      </showAggregatorsPDORegionBasedSo>
      <!--END: Open showPDOmodal model -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showAggregatorsPDORegionBasedSo from "../../components/inventory/showAggregatorsPDORegionBasedSo.vue";
import _ from 'lodash';

export default {
  name: "AggregatorInventoryallocatetoso",
  components: {
    showAggregatorsPDORegionBasedSo
  },
  data() {
    return {
      filterSearch: "",
      scannerToggleOption: true,
      showAggregatorsPDORegionBasedSo: false,
      regionOptions: [],
      deviceOptions: [],
      regionBasedSo: [],
      tempTableData: [],
      formData: {
        region: "",
        device_type: "",
        so: "",
        scannedItems: []
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
    ...mapGetters("superAdminAggregatorsDevice", ["getCreatedActiveDeviceList"]),
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"]),
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
    ...mapActions("superAdminAggregatorsDevice", ["GET_ACTIVE_CREATED_DEVICE_LIST"]),
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
    ...mapActions("VerifyDevice", [
      "AGGREGATORS_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION"
    ]),

    fnSetDevicesByDeviceId() {
      this.scannerToggleOption = true;
      this.$barcodeScanner.destroy();
      let self = this;
      let predictIfDeviceExist = self.formData.scannedItems.filter(function (
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
          deviceSerialNumbers: []
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
      this.AggregatorsDevice();
    },

    AggregatorsDevice() {
      let self = this;
      let cookedArr1 = [];
      self.GET_ACTIVE_CREATED_DEVICE_LIST()
        .then(() => {
          this.getCreatedActiveDeviceList.map((item) => {
            cookedArr1.push({
              value: item,
              label: item.deviceName
            });
            self.deviceOptions = cookedArr1;
          })
        })
    },

    onBarcodeScanned(barcode) {
      let self = this;
      let predictIfDeviceExist = self.formData.scannedItems.find(function (
        value
      ) {
        return value.device.id == self.formData.device_type.id;
      });
      let assumeArr;
      assumeArr = {
        device: {
          deviceName: self.formData.device_type.deviceName,
          id: self.formData.device_type.id
        },
        deviceSerialNumbers: predictIfDeviceExist.deviceSerialNumbers
      };
      let finalAssumation = _.find(assumeArr.deviceSerialNumbers, function (oo) {
        return oo == barcode;
      });
      if (finalAssumation == undefined) {
        this.AGGREGATORS_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION({
          device: self.formData.device_type.id,
          barcode: barcode
        })
          .then(() => {
            assumeArr.deviceSerialNumbers.push(barcode);
          })
          .catch(() => {
            this.$q.notify({
              color: "primary",
              position: "bottom",
              message: barcode + " is invalid",
              icon: "info"
            });
          });
      }
    },

    openScannerComp() {
      this.$q.notify({
        color: "positive",
        position: "bottom",
        message: "Start scanning for " + this.formData.device_type.deviceName,
        icon: "list"
      });

      this.scannerToggleOption = false;

      if (!this.$barcodeScanner.hasListener()) {
        this.$barcodeScanner.init(this.onBarcodeScanned);
      }
    },

    fnRemoveScannedItems(index, subIndex) {
      this.formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
    },

    fnAllocateDeviceToRegion(token) {
      this.showAggregatorsPDORegionBasedSo = !this.showAggregatorsPDORegionBasedSo;
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
      this.FETCH_ALL_REGIONS_DATA()
        .then(() => {
          let assumeArr = [];
          this.getAllRegionsData.map(function (value, index) {
            assumeArr.push({
              label: value.regionAreaName,
              value: value.id
            });
          });
          this.regionOptions = assumeArr;
        })
        .catch(error => {
          this.regionOptions = [];
        });
    },

    fnRemoveDeviceTypeFromList(index) {
      this.formData.scannedItems.splice(index, 1);
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