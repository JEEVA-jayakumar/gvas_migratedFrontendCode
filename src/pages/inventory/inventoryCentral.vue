<template>
  <q-page>
    <!-- content -->
    <div>
      <!--START: table title -->
      <div class="row bottom-border q-px-md q-py-sm items-center">
        <!--START: table title -->
        <div class="col-12 col-lg-4 text-h6 text-weight-regular text-grey-9">Bijlipay Central Inventory </div>
        <div class="col-12 col-lg-8 group" align="right">
          <q-btn
            outline
            no-caps
            class="text-weight-regular q-ma-xs"
            label="Allocate to SO"
            to="/inventory/central/allocate/device/so"
          ></q-btn>

          <q-btn
            outline
            no-caps
            class="text-weight-regular q-ma-xs"
            label="Allocate to Region"
            to="/inventory/central/allocate/device/region"
          />
          <q-btn
            outline
            no-caps
            class="text-weight-regular q-ma-xs"
            label="Allocate to Reseller"
            to="/inventory/central/allocate/device/resellar"
          />

          <q-btn
            outline
            no-caps
            class="text-weight-regular q-ma-xs"
            label="Add Faulty Device"
            @click="fnShowAddDevice"
          />
          <q-btn-dropdown
            outline
            no-caps
            class="text-weight-regular q-ma-xs"
            label="Add new device from manufacturer"
          >
            <!-- dropdown content -->
            <q-list>
              <q-item clickable to="/inventory/central/add/device/scan">
                <q-item-section avatar>
                  <q-icon name="search" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Scan and Upload</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="fnOpenBulkUploadModal">
                <q-item-section avatar>
                  <q-icon name="attach_file" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Bulk upload</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
         </div>
        <!--END: table title -->
      </div>
      <!--END: table title -->
      <div class="row">
        <div class="col-md-3 group q-pa-md">
          <div
            class="q-pa-md q-ma-xs cursor-pointer border-radius-10"
            :class="[activeItemId === index ? 'shadow-5 bg-grey-5' : 'shadow-0']"
            @click="ajaxLoadDataForCentralInventoryByDeviceIdFilter(index,deviceInfo)"
            v-for="(deviceInfo,index) in getAllInventoryDevicesTypesWithCountData"
            :key="index"
            :style="'background:'+deviceInfo.device.colorCode"
            align="center"
          >
            <div>
              <big class="text-weight-bold">{{deviceInfo.count}}</big>
            </div>
            <div class="text-caption">{{deviceInfo.device.deviceName}}</div>
          </div>
        </div>
        <div class="col-md-9">
          <div>
            <!--START: table Data -->
            <q-table
              :rows="getAllInventoryDevicesData"
              :columns="columnData"
              table-class="customTableClass shadow-0"
              :filter="filterSearch"
              v-model:pagination="paginationControl"
              row-key="index"
              :loading="tableAjaxLoading"
              color="primary"
            >
              <template v-slot:top>
                <!--START: table filter,search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    dense
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search By Device Serial Number.."
                    class="q-mr-lg q-py-sm"
                  />
                </div>

                <div class="col-md-5">
                  <downloadExcel
                    :data="getAllInventoryDevicesData"
                    :fields="json_fields"
                    name="CentralInventory.xls"
                  >
                    <q-btn outline color="grey-9" label="Download as excel"/>
                  </downloadExcel>
                </div>
                <!--END: table filter,search -->
              </template>
            </q-table>
            <!--END: table Data -->
          </div>
        </div>
      </div>
      <!--START: Open openAddBulkDeviceModelComp model -->
      <openAddBulkDeviceModelComp
        v-if="openBulkUploadModal"
        :propOpenBulkUploadModal="openBulkUploadModal"
        :propAllDevicestypes="getAllInventoryDevicesTypesData"
        @closeModel="fnOpenBulkUploadModal"
        @emitToggleinventoryBulkUploadOnSuccess="fnReloadPageInformation"
      ></openAddBulkDeviceModelComp>
      <!--END: Open openAddBulkDeviceModelComp model -->

      <showAddDamagedDevices
        v-if="faultyInventoryComponent"
        :faultyInventoryComponent="faultyInventoryComponent"
        @emitRefreshList="fnAjaxPopulateAllDevicesWithCount"
        @closeModel="fnShowAddDevice"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import downloadExcel from "vue-json-excel3";
import openAddBulkDeviceModelComp from "../../components/inventory/openAddBulkDeviceModelComp.vue";
import showAddDamagedDevices from "../../components/inventory/showAddDamagedDevices.vue";

export default {
  name: "InventoryCentral",
  components: {
    openAddBulkDeviceModelComp,
    showAddDamagedDevices,
    downloadExcel
  },
  data() {
    return {
      faultyInventoryComponent: false,
      sideInnerDeviceMenu: {},
      activeItemId: 0,
      openBulkUploadModal: false,
      tableAjaxLoading: false,
      filterSearch: "",
      json_fields: {
        SerialNumber: "serialNumber",
        DeviceType: "device.deviceName"
      },
      columnData: [
        {
          name: "serialNumber",
          required: true,
          label: "Device Serial Number",
          align: "left",
          field: "serialNumber",
          sortable: true
        },
        {
          name: "device",
          required: true,
          label: "Device Type",
          align: "center",
          field: row => row.device.deviceName,
          sortable: true
        },
      ],
      paginationControl: {
        rowsPerPage: 10
      }
    };
  },
  computed: {
    ...mapGetters("InventoryCentral", [
      "getAllInventoryDevicesData",
      "getAllInventoryDevicesTypesData",
      "getAllInventoryDevicesTypesWithCountData"
    ])
  },
  created() {
    this.fnAjaxPopulateAllDevicesWithCount();
    this.fnAjaxPopulateAllDevices();
    this.fnAjaxPopulateAllDevicesList();
  },
  methods: {
    ...mapActions("InventoryCentral", [
      "FETCH_ALL_INVENTORY_DEVICES_BY_DEVICE_TYPE",
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_WITH_COUNT_DATA"
    ]),
    ajaxLoadDataForCentralInventoryByDeviceIdFilter(itemIndex, deviceInfo) {
      this.activeItemId = itemIndex;
      this.fnAjaxPopulateAllDevicesList(deviceInfo);
    },
    fnOpenBulkUploadModal() {
      this.openBulkUploadModal = !this.openBulkUploadModal;
    },
    fnAjaxPopulateAllDevicesWithCount() {
      this.tableAjaxLoading = true;
      this.FETCH_ALL_INVENTORY_DEVICES_TYPES_WITH_COUNT_DATA().then(() => {
        this.FETCH_ALL_INVENTORY_DEVICES_BY_DEVICE_TYPE().then(() => {
          if (this.getAllInventoryDevicesTypesWithCountData[0]?.device?.deviceName !== "Total") {
            let allDevicesCount = {
              count: this.getAllInventoryDevicesData.length,
              device: {
                deviceName: "Total",
                colorCode: "#eee"
              }
            };
            this.getAllInventoryDevicesTypesWithCountData.unshift(allDevicesCount);
          }
        });
      });
      this.tableAjaxLoading = false;
      this.faultyInventoryComponent = false;
    },
    fnAjaxPopulateAllDevicesList(deviceInfo) {
      this.tableAjaxLoading = true;
      this.FETCH_ALL_INVENTORY_DEVICES_BY_DEVICE_TYPE(deviceInfo);
      this.tableAjaxLoading = false;
    },
    fnReloadPageInformation() {
      this.fnAjaxPopulateAllDevicesWithCount();
      this.fnAjaxPopulateAllDevices();
    },
    fnAjaxPopulateAllDevices() {
      this.tableAjaxLoading = true;
      this.FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA();
      this.tableAjaxLoading = false;
    },
    fnShowAddDevice() {
      this.faultyInventoryComponent = !this.faultyInventoryComponent;
    }
  }
};
</script>

<style scoped>
.border-radius-10 {
  border-radius: 10px;
}
</style>
