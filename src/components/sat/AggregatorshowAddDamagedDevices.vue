<template>
  <div class="q-pa-md group">
    <div class="row items-center q-gutter-sm">
      <div class="col-md-3">
        <q-select
          clearable
          @clear="fnClearingDeviceTypeSelection"
          @update:model-value="fnSetDevicesByDeviceId"
          v-model="formData.device_type"
          label="Select Device Type"
          color="grey-9"
          :options="deviceOptions"
          emit-value
          map-options
        />
      </div>
      <div class="col-auto">
        <q-btn
          :disabled="!formData.device_type"
          @click="openScannerComp"
          v-if="scannerToggleOption"
          color="light-blue"
          label="Start scan"
        />
      </div>
      <div class="col" align="right">
        <q-btn
          icon="check"
          outline
          label="Submit"
          @click="toggleDamagedDevices"
          :disabled="formData.scannedItems.length === 0"
        />
      </div>
    </div>

    <div class="row q-mt-md q-col-gutter-md">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="(item, index) in formData.scannedItems"
        :key="index"
      >
        <q-card class="shadow-4">
          <q-list highlight separator>
            <q-item-label header class="bg-grey-2">
              <q-icon style="color: #202c3f" name="fas fa-tablet-alt" class="q-mr-sm" />
              {{ item.device.deviceName }}
            </q-item-label>
            <q-scroll-area style="height: 400px">
              <div v-if="item.deviceSerialNumbers.length > 0">
                <q-item
                  v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                  :key="subIndex"
                >
                  <q-item-section class="q-body-1 text-light-blue">
                    {{ subItem }}
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      round
                      size="sm"
                      color="negative"
                      icon="clear"
                      @click="fnRemoveScannedItems(index, subIndex)"
                    />
                  </q-item-section>
                </q-item>
              </div>
              <div v-else>
                <q-item>
                  <q-item-section class="q-body-1">
                    No data to display
                  </q-item-section>
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

    <AggregatorShowRegionalInventoryDevicePod
      v-if="showPDOmodal"
      :propShowPDOmodal="showPDOmodal"
      :propAllScannedItemArr="formData"
      @closeModel="toggleDamagedDevices"
      @emittedAfterPODsubmission="fnClearingDeviceTypeSelection"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AggregatorShowRegionalInventoryDevicePod from "./AggregatorShowRegionalInventoryDevicePod.vue";

export default {
  name: "damagedDevices",
  components: {
    AggregatorShowRegionalInventoryDevicePod
  },
  data() {
    return {
      scannerToggleOption: true,
      showPDOmodal: false,
      deviceOptions: [],
      formData: {
        region: JSON.parse(localStorage.getItem("u_i"))?.region?.id,
        device_type: "",
        scannedItems: []
      }
    };
  },
  computed: {
    ...mapGetters("superAdminAggregatorsDevice", ["getCreatedActiveDeviceList"])
  },
  created() {
    this.AggregatorsDevice();
  },
  unmounted() {
    if (this.$barcodeScanner) {
      this.$barcodeScanner.destroy();
    }
  },
  methods: {
    ...mapActions("VerifyDevice", [
      "VERIFY_AGGREGATORS_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY"
    ]),
    ...mapActions("superAdminAggregatorsDevice", ["GET_ACTIVE_CREATED_DEVICE_LIST"]),

    fnSetDevicesByDeviceId(val) {
      if (!val) return;
      this.scannerToggleOption = true;
      if (this.$barcodeScanner) {
        this.$barcodeScanner.destroy();
      }

      const device = typeof val === 'string' ? JSON.parse(val) : val;

      let predictIfDeviceExist = this.formData.scannedItems.filter(
        value => value.device.id == device.id
      );

      if (predictIfDeviceExist.length == 0) {
        this.formData.scannedItems.unshift({
          device: {
            deviceName: device.deviceName,
            id: device.id
          },
          deviceSerialNumbers: []
        });
      }
    },

    AggregatorsDevice() {
      this.GET_ACTIVE_CREATED_DEVICE_LIST().then(() => {
        this.deviceOptions = this.getCreatedActiveDeviceList.map(item => ({
          value: item,
          label: item.deviceName
        }));
      });
    },

    onBarcodeScanned(barcode) {
      const selectedDevice = typeof this.formData.device_type === 'string'
        ? JSON.parse(this.formData.device_type)
        : this.formData.device_type;

      let scannedItem = this.formData.scannedItems.find(
        v => v.device.id == selectedDevice.id
      );

      if (!scannedItem) return;

      if (scannedItem.deviceSerialNumbers.includes(barcode)) {
        this.$q.notify({
          color: "primary",
          position: "bottom",
          message: barcode + " - already exist in list",
          icon: "info"
        });
        return;
      }

      this.VERIFY_AGGREGATORS_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY({
        device: selectedDevice.id,
        barcode: barcode
      }).then(() => {
          scannedItem.deviceSerialNumbers.push(barcode);
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: (error.data?.message || barcode) + " is invalid",
            icon: "error"
          });
        });
    },

    openScannerComp() {
      const device = typeof this.formData.device_type === 'string'
        ? JSON.parse(this.formData.device_type)
        : this.formData.device_type;

      this.$q.notify({
        color: "positive",
        position: "bottom",
        message: "Start scanning for " + device.deviceName,
        icon: "list"
      });
      this.scannerToggleOption = false;
      if (this.$barcodeScanner && !this.$barcodeScanner.hasListener()) {
        this.$barcodeScanner.init(this.onBarcodeScanned);
      }
    },

    fnRemoveScannedItems(index, subIndex) {
      this.formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
    },

    fnRemoveDeviceTypeFromList(index) {
      this.formData.scannedItems.splice(index, 1);
    },

    fnClearingDeviceTypeSelection() {
      this.formData.device_type = "";
      this.formData.scannedItems = [];
      this.scannerToggleOption = true;
      if (this.$barcodeScanner) {
        this.$barcodeScanner.destroy();
      }
    },

    toggleDamagedDevices() {
      this.showPDOmodal = !this.showPDOmodal;
    }
  }
};
</script>
