<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!--START: table title -->
        <div class="col-md-8 text-h6 text-weight-regular text-grey-9">Bijlipay Add New Devices - Scan & Upload</div>
        <div class="col-md-12 col-md-6 q-pt-md group" align="right">
          <q-btn @click="$router.push('/inventory/central')" outline label="Cancel Allocation" color="negative" />
        </div>
        <!--END: table title -->
      </div>
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <!--START: table title -->
        <div class="col" ref="clickHeretoStartParent">
          <q-select
            filled
            ref="clickHeretoStartChild"
            @update:model-value="fnDisableDeviceTypeSelection"
            :disable="tempTableData.length > 0"
            v-model="formData.device.id"
            label="Select Device Type"
            color="grey-9"
            :options="deviceOptions"
            emit-value
            map-options
          />
        </div>
        <!-- Invoice Number Field with margin -->
        <div class="col q-ml-md">
          <q-input
            filled
            type="text"
            :disable="tempTableData.length > 0"
            label="Invoice Number"
            color="grey-9"
            @blur="$v.formData.invoiceNumber.$touch"
            :error="$v.formData.invoiceNumber.$error"
            v-model="formData.invoiceNumber"
          />
        </div>
        <!-- Final upload button toggle -->
        <div class="col group" align="right">
          <q-btn :disable="!isScanButtonEnabled"  v-if="scanningActive" color="primary" label="Start scan"
            @click="fnStartScanner" />
          <q-btn v-if="tempTableData.length > 0" class="common-btn q-py-xs" color="purple-9" label="Upload" @click="finalSubmit" />
          <q-btn v-else disable class="common-btn q-py-xs" label="Upload" color="grey-7" />
        </div>
        <!--END: table title -->
      </div>
      <!--START: table Data -->
      <q-table
        :rows="tempTableData"
        :columns="columnData"
        table-class="customTableClass shadow-0"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        row-key="index"
        :loading="tableAjaxLoading"
        color="light-blue"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn @click="removeScannedItems(props.rowIndex)" label="Remove" icon="close" color="red-6" size="sm" />
          </q-td>
        </template>
        <template v-slot:top>
          <!--START: table filter,search -->
          <div class="col-md-5">
            <q-input clearable dense color="grey-9" v-model="filterSearch" placeholder="Type.." label="Search .."
              class="q-mr-lg q-py-sm" />
          </div>
          <!--END: table filter,search -->
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
  import { required } from "@vuelidate/validators";
  import { useVuelidate } from '@vuelidate/core'
  import { mapGetters, mapActions } from "vuex";
  import _ from "lodash";

  export default {
    name: "AddDeviceScan",
    setup() {
      return { $v: useVuelidate() }
    },
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
        formData: {
          device: {
            id: "",
            isDisable: false
          },
          invoiceNumber: '',
          deviceSerialNumbers: []
        },
        paginationControl: {
          rowsPerPage: 10
        },
        tableAjaxLoading: false
      };
    },
    validations: {
      formData: {
        invoiceNumber: {
          required
        },
      }
    },
    computed: {
      ...mapGetters("InventoryScanAddDevice", [
        "getAddDeviceScannedItems",
        "getAllInventoryDevicesTypesData"
      ]),
      isScanButtonEnabled() {
        return this.formData.device.id !== "" && this.formData.invoiceNumber.trim() !== "";
      }
    },
    created() {
      this.fnAjaxPopulateAllDevicesTypes();
    },
    unmounted() {
      this.$barcodeScanner.destroy();
    },
    methods: {
      ...mapActions("InventoryScanAddDevice", [
        "REACTIVE_ADD_SCANNED_DEVICE_DATA",
        "FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
        "FEED_DEVICE_SCAN_BY_ID_DATA"
      ]),
      ...mapActions("VerifyDevice", [
        "VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY"
      ]),
      fnAjaxPopulateAllDevicesTypes() {
        this.FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA().then(() => {
          this.deviceOptions = this.getAllInventoryDevicesTypesData.map(v => ({ label: v.deviceName, value: v.id }));
        });
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
        let duplicate = _.find(this.tempTableData, o => o.deviceSerialNumbers == barcode);
        if (!duplicate) {
          this.VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY({
            device: this.formData.device.id,
            barcode: barcode
          }).then(() => {
              this.tempTableData.push({ deviceSerialNumbers: barcode });
            })
            .catch(() => {
              this.$q.notify({ color: "primary", message: barcode + " - device already available in the inventory" });
            });
        } else {
          this.$q.notify({ color: "primary", message: barcode + " - device already scanned" });
        }
      },
      removeScannedItems(index) {
        this.tempTableData.splice(index, 1);
        if (this.tempTableData.length == 0) {
          this.scanningActive = true;
        }
      },
      finalSubmit() {
        this.$v.formData.$touch();
        if (this.$v.formData.$error) {
          this.$q.notify("Please fill all mandatory fields.");
          return;
        }
        this.formData.deviceSerialNumbers = this.tempTableData.map(v => v.deviceSerialNumbers);
        let param = {
          request: {
            device: this.formData.device,
            deviceSerialNumbers: this.formData.deviceSerialNumbers
          },
          invoiceNumber: this.formData.invoiceNumber
        };
        this.FEED_DEVICE_SCAN_BY_ID_DATA(param)
          .then(() => {
            this.$q.notify({ color: "positive", message: "Devices are added successfully!" });
            this.$router.push("/inventory/central");
          })
          .catch(() => {
            this.$q.notify({ color: "negative", message: "Error in updating devices!" });
          });
      }
    }
  };
</script>
