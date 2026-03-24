<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!--START: table title -->
        <div class="col-md-8 q-title text-weight-regular text-grey-9">Aggregator Add Device Recovery- Scan & Upload</div>
        <!--END: table title -->
      </div>
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-4">
          <q-select v-model="formData.device.id" label="Select Device Type" radio color="grey-9"
            :options="deviceOptions" />
        </div>
        <div class="col-md-4">
          <q-select :disabled="formData.device.id == ''" v-model="action" label="Select Device Status" radio
            color="grey-9" :options="actionOptions" @update:model-value="fnDisableDeviceTypeSelection" />
        </div>
        <!-- Final upload button toggle -->
        <div class="col-12 col-lg-4 group" align="right">
          <q-btn :disabled="formData.device.id == ''" v-if="scanningActive" color="primary" label="Start scan"
            @click="fnStartScanner" />
          <q-btn v-if="tempTableData.length > 0" class="common-btn q-py-xs" label="Upload" @click="finalSubmit" />
          <q-btn v-else class="disabled common-btn q-py-xs no-pointer-events" label="Upload" @click="finalSubmit" />
        </div>
        <!--ENDv-model: table title -->
      </div>
      <!--START: table Data -->
      <q-table :rows="tempTableData" :columns="columnData" table-class="customTableClass shadow-0"
        :filter="filterSearch" v-model:pagination="paginationControl" row-key="index" :loading="tableAjaxLoading"
        color="light-blue">
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
          <q-btn @click="removeScannedItems(props)" label="Remove" icon="close" color="red-6" size="sm" />
        </q-td>
        </template>
        <template v-slot:top>
          <!--START: table filter,search -->
          <div class="col-md-5">
            <q-input dense clearable color="grey-9" v-model="filterSearch" placeholder="Type.." label="Search .."
              class="q-mr-lg q-py-sm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
          </div>
          <!--END: table filter,search -->
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "DeviceRecoveryUpload",
  props: ["propInventoryWithSo"],
  data() {
    return {
      filterSearch: "",
      scanningActive: true,
      deviceOptions: [],
      columnData: [
        {
          name: "deviceSerialNumbers",
          required: true,
          label: "Serial Number",
          align: "left",
          field: "deviceSerialNumbers",
          sortable: true
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action"
        }
      ],
      tempTableData: [],
      action: "",
      actionOptions: [
        { label: "Good", value: 1 },
        { label: "Fault", value: 2 }
      ],
      formData: {
        device: {
          id: "",
          isDisable: false
        },
        deviceSerialNumbers: []
      },
      paginationControl: {
        rowsPerPage: 10
      },
      tableAjaxLoading: false
    };
  },
  computed: {
    ...mapGetters("InventoryScanAddDevice", [
      "getAddDeviceScannedItems",
      "getAllInventoryDevicesTypesData", "getAllPhonepeInventoryDevicesTypesData"
    ]),
    ...mapGetters("PhonepeDeviceRecovery", ["getPhonepeDeviceAfterScannedToSubmit"]),
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"]),
    ...mapGetters("superAdminAggregatorsDevice", ["getCreatedActiveDeviceList"])
  },
  created() {
    this.AggregatorsDevice();
  },
  methods: {
    ...mapActions("InventoryScanAddDevice", [
      "REACTIVE_ADD_SCANNED_DEVICE_DATA",
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
      "FEED_DEVICE_SCAN_BY_ID_DATA", "FEED_PHONE_PE_DEVICE_SCAN_BY_ID_DATA"
    ]),
    ...mapActions("VerifyDevice", [
      "VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY", "AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY"
    ]),
    ...mapActions("PhonepeDeviceRecovery", ["PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY", "FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT"]),
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
    ...mapActions("superAdminAggregatorsDevice", ["GET_ACTIVE_CREATED_DEVICE_LIST"]),
    AggregatorsDevice() {
      let self = this;
      let cookedArr1 = [];
      self.GET_ACTIVE_CREATED_DEVICE_LIST()
        .then(() => {
          return _.map(this.getCreatedActiveDeviceList, (item) => {
            cookedArr1.push({
              value: item.id,
              label: item.deviceName
            });
            self.deviceOptions = cookedArr1;
          })
        })
    },
    fnDisableDeviceTypeSelection() {
      if (!this.scanningActive) {
        this.scanningActive = true;
      }
      this.$barcodeScanner.destroy();
    },
    fnStartScanner() {
      this.$barcodeScanner.init(this.onBarcodeScanned);
      this.scanningActive = false;
    },
    onBarcodeScanned(barcode) {
      let duplicatecheckSum = _.find(this.tempTableData, function (oo) {
        return oo.deviceSerialNumbers == barcode;
      });
      if (duplicatecheckSum == undefined) {
        this.PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY({
          device: this.formData.device.id,
          barcode: barcode
        }).then(response => {
            this.tempTableData.push({
              deviceSerialNumbers: barcode
            });
          })
          .catch(() => {
            this.$q.notify({
              color: "primary",
              position: "bottom",
              message: barcode + " - device already available in the inventory",
              icon: "info"
            });
          });
      } else {
        this.$q.notify({
          color: "primary",
          position: "bottom",
          message: barcode + " - device already scanned",
          icon: "info"
        });
      }
    },
    removeScannedItems(props) {
      this.tempTableData.splice(props.rowIndex, 1);
      if (this.tempTableData.length == 0) {
        this.scanningActive = true;
      }
    },
    finalSubmit() {
      this.formData.deviceSerialNumbers = this.tempTableData[0].deviceSerialNumbers;
      let param = {
        deviceId: this.formData.device.id,
        action: this.action,
        request: {
          serialNumber: this.formData.deviceSerialNumbers
        }
      };
      this.FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT(param)
        .then(response => {
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Devices are added successfully!",
            icon: "thumb_up"
          });
          this.formData.device.id = "";
          this.tempTableData = [];
          this.action = ""
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Error in updating devices!",
            icon: "thumb_down"
          });
        });
    }
  }
};
</script>
