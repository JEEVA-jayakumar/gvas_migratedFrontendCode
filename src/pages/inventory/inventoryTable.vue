<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-lg">
      <div class="row items-center q-mb-lg">
        <div class="text-h5 text-weight-bold text-grey-9">Inventory Dashboard</div>
        <q-space />
        <q-btn color="primary" icon="add" label="Bulk Upload" @click="openBulkUploadModal = true" class="shadow-2" />
      </div>

      <!-- Central Inventory -->
      <q-card flat bordered class="q-mb-lg overflow-hidden">
        <q-card-section class="bg-white border-bottom q-py-md">
          <div class="text-subtitle1 text-weight-bold text-grey-8 uppercase ls-1">Central Inventory</div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div v-if="inventoryData.centralItems.length > 0" class="row q-col-gutter-md">
            <div
              class="col-12 col-sm-4 col-md-2"
              v-for="(device,index) in inventoryData.centralItems"
              :key="index"
            >
              <div class="q-pa-md rounded-md text-center bg-grey-1 shadow-subtle border-left-brand" :style="'border-left: 4px solid '+device.device.colorCode">
                <div class="text-h4 text-weight-bolder" :style="'color:'+device.device.colorCode">{{device.count}}</div>
                <div class="text-caption text-grey-7 text-weight-medium uppercase q-mt-xs">{{device.device.deviceName}}</div>
              </div>
            </div>
          </div>
          <div v-else class="row q-pa-md justify-center">
             <q-banner rounded dense class="bg-grey-2 text-grey-7">
               <template v-slot:avatar><q-icon name="info" color="grey-6" /></template>
               No central inventory data available.
             </q-banner>
          </div>
        </q-card-section>
      </q-card>

      <!-- Inventory with Regions -->
      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-12 col-lg-8">
           <q-card flat bordered class="full-height overflow-hidden">
              <q-card-section class="bg-white border-bottom q-py-md row items-center">
                <div class="text-subtitle1 text-weight-bold text-grey-8 uppercase ls-1">Inventory with regions</div>
                <q-space />
                <q-select
                  dense
                  outlined
                  v-model="inventoryData.region"
                  :options="inventoryData.regionFilterOptions"
                  placeholder="Select Region"
                  style="width: 200px"
                  @update:model-value="filterInventoryCountByRegion"
                  emit-value
                  map-options
                />
              </q-card-section>
              <q-card-section class="q-pa-md">
                <div v-if="inventoryData.regionalItems.length > 0" class="row q-col-gutter-sm q-mb-md">
                  <div
                    class="col-6 col-md-3 cursor-pointer"
                    @click="ajaxLoadDataForCentralInventoryByDeviceIdFilter(index,deviceInfo)"
                    v-for="(deviceInfo,index) in inventoryData.regionalItems"
                    :key="index"
                  >
                    <div class="q-pa-sm rounded-md text-center transition-hover" :class="activeItemId === index ? 'bg-primary text-white' : 'bg-grey-1 text-grey-9'" style="border: 1px solid #eee">
                      <div class="text-h6 text-weight-bold">{{deviceInfo.count}}</div>
                      <div class="text-caption uppercase" style="font-size: 10px">{{deviceInfo.device.deviceName}}</div>
                    </div>
                  </div>
                </div>

                <q-table
                  flat
                  bordered
                  :rows="getAllRegionalInventorySerialNumbersByDevice"
                  :columns="columnData"
                  :filter="filterSearch"
                  :pagination="paginationControl"
                  row-key="index"
                  :loading="tableAjaxLoading"
                  class="bg-white q-mt-md"
                >
                  <template v-slot:top-right>
                    <q-input dense outlined debounce="300" v-model="filterSearch" placeholder="Search Serial Number">
                      <template v-slot:append><q-icon name="search" /></template>
                    </q-input>
                    <downloadExcel
                      class="q-ml-sm"
                      :rows="getAllRegionalInventorySerialNumbersByDevice"
                      :fields="json_fields"
                      name="Regional Inventory.xls"
                    >
                      <q-btn flat dense color="primary" icon="download" label="Excel" />
                    </downloadExcel>
                  </template>
                </q-table>
              </q-card-section>
           </q-card>
        </div>

        <div class="col-12 col-lg-4">
           <!-- Inventory with SO -->
           <q-card flat bordered class="q-mb-md overflow-hidden">
              <q-card-section class="bg-white border-bottom q-py-md">
                <div class="text-subtitle1 text-weight-bold text-grey-8 uppercase ls-1">Inventory with SO</div>
              </q-card-section>
              <q-card-section class="q-pa-md">
                <q-select
                  dense
                  outlined
                  v-model="inventoryData.so"
                  :options="inventoryData.SOFilterOptions"
                  placeholder="Filter By SO"
                  class="q-mb-md"
                  @update:model-value="filterInventoryCountBySO"
                  emit-value
                  map-options
                />
                <div v-if="inventoryData.billPartnerInventory.length > 0" class="row q-col-gutter-sm">
                   <div class="col-6" v-for="(device,index) in inventoryData.billPartnerInventory" :key="index">
                      <div class="q-pa-sm rounded-md text-center bg-grey-1" style="border: 1px solid #eee">
                        <div class="text-h6 text-weight-bold text-primary">{{device.count}}</div>
                        <div class="text-caption text-grey-7" style="font-size: 10px">{{device.device.deviceName}}</div>
                      </div>
                   </div>
                </div>
                <div v-else class="text-center text-grey-6 q-pa-md">No SO inventory data</div>
              </q-card-section>
           </q-card>

           <!-- Quick Links or Other Stats -->
            <q-card flat bordered class="bg-brand text-white">
              <q-card-section>
                <div class="text-subtitle2 uppercase ls-1 opacity-80">Total Value (Est.)</div>
                <div class="text-h4 text-weight-bolder">--</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                 <div class="text-caption opacity-70">Inventory tracked across all regions and partners.</div>
              </q-card-section>
            </q-card>
        </div>
      </div>

      <!-- Other Inventory Categories -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6" v-for="(items, title) in {'Reseller': inventoryData.resellarItems, 'Merchant': inventoryData.merchantItems, 'Faulty': inventoryData.faultyInventory, 'Repair': inventoryData.sendtoRepair}" :key="title">
           <q-card flat bordered class="overflow-hidden">
              <q-card-section class="bg-white border-bottom q-py-sm">
                <div class="text-weight-bold text-grey-8 uppercase ls-1" style="font-size: 12px">Inventory with {{ title }}</div>
              </q-card-section>
              <q-card-section class="q-pa-md row q-col-gutter-sm">
                 <template v-if="items && items.length > 0">
                    <div class="col-4 col-md-3" v-for="(device,index) in items" :key="index">
                        <div class="q-pa-sm rounded-md text-center bg-grey-1" style="border: 1px solid #eee">
                          <div class="text-subtitle1 text-weight-bold text-grey-9">{{device.count}}</div>
                          <div class="text-caption text-grey-6" style="font-size: 10px">{{device.device.deviceName}}</div>
                        </div>
                    </div>
                 </template>
                 <div v-else class="col-12 text-center text-grey-5 q-pa-sm">No data</div>
              </q-card-section>
           </q-card>
        </div>
      </div>
    </div>
    <!--START: Open openAddBulkDeviceModelComp model -->
    <openAddBulkDeviceModelComp
      v-if="openBulkUploadModal"
      :propOpenBulkUploadModal="openBulkUploadModal"
      @closeModel="fnOpenBulkUploadModal"
    ></openAddBulkDeviceModelComp>
    <!--END: Open openAddBulkDeviceModelComp model -->
  </q-page>
</template>

<script>
import { required } from '@vuelidate/validators';
import { mapGetters, mapActions } from "vuex";
import downloadExcel from "vue-json-excel";
import openAddBulkDeviceModelComp from "../../components/inventory/openAddBulkDeviceModelComp.vue";

export default {
  components: {
    downloadExcel,
    openAddBulkDeviceModelComp
  },
  name: "inventory",
  data() {
    return {
      devicedata:"",
       json_fields: {
        DeviceType: "device.deviceName",
        SerialNumber: "serialNumber"
      },
         activeItemId: 0,
       tableAjaxLoading: false,
       filterSearch: "",
          paginationControl: {
        rowsPerPage: 10
      },
            columnData: [
        {
          name: "serialNumber",
          required: true,
          label: "Device Serial Number",
          align: "left",
          field: "serialNumber",
          sortable: true
        }
      ],
      //Toggle bulk upload modal
      openBulkUploadModal: false,
      inventoryData: {
        region:"",
        so: "",
        regionFilterOptions: [],
        SOFilterOptions: [],

        regionalItems: [],

        billPartnerInventory: [],

        central: "",
        centralItems: [],

        merchant: "",
        merchantItems: [],
        resellarItems: [],
        faultyInventory: [],
        sendtoRepair: []
      }
    };
  },
  computed: {
      ...mapGetters("SAT_RegionalInventoryAllocation", ["getAllRegionalInventorySerialNumbersByDevice",
      ]),
    ...mapGetters("InventoryCentral", ["getCentralInventoryDashboardCount", "getAllInventoryDevicesData",
      "getAllInventoryDevicesTypesData",
      "getAllInventoryDevicesTypesWithCountData"]),
    ...mapGetters("SuperAdminUsers", ["getAllRegionsData", "getAllSOsData"]),
    ...mapGetters("SAT_RegionalInventoryAllocation", [
      "getAllRegionalInventoryDeviceDetailsWithCount",
      "getAllSoInventoryDeviceDetailsWithCount"
    ])
  },

  created() {
    this.getAllInventoryData();
    this.getAllSOData();
     this.fnAjaxPopulateAllDevicesList();
  },

  methods: {
    ...mapActions("InventoryCentral", [
      "FETCH_CENTRAL_INVENTORY_DASHBOARD_COUNT","FETCH_ALL_INVENTORY_DEVICES_BY_DEVICE_TYPE",
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_WITH_COUNT_DATA"
    ]),

    ...mapActions("SAT_RegionalInventoryAllocation", [
      "FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT",
      "FETCH_SO_INVENTORY_DEVICE_DETAIL_WITH_COUNT",
       "FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE"
    ]),
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_ALL_SO_DATA"
    ]),
     ajaxLoadDataForCentralInventoryByDeviceIdFilter(itemIndex, deviceInfo) {
      this.activeItemId = itemIndex;
      this.fnAjaxPopulateAllDevicesList(deviceInfo);
    },
     fnAjaxPopulateAllDevicesList(deviceInfo) {
      this.tableAjaxLoading = false;
      if (!deviceInfo) return;
      let requestParams = {
          // TODO Please
          region: this.inventoryData.region,
          action: this.$REGIONAL_INVENTORY_FILTER_ACTION_DEVICE,
          device: deviceInfo.device.id
        };
      this.FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE(requestParams);
     
    },
    fnOpenBulkUploadModal() {
      this.openBulkUploadModal = !this.openBulkUploadModal;
    },

    getAllInventoryData() {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_CENTRAL_INVENTORY_DASHBOARD_COUNT().then(() => {
        this.inventoryData.centralItems = this.getCentralInventoryDashboardCount.centralInventory;
        this.inventoryData.merchantItems = this.getCentralInventoryDashboardCount.merchantInventory;
        this.inventoryData.regionalItems = this.getCentralInventoryDashboardCount.regionalInventory;
        this.inventoryData.billPartnerInventory = this.getCentralInventoryDashboardCount.billPartnerInventory;
        this.inventoryData.resellarItems = this.getCentralInventoryDashboardCount.resellerInventory;
        this.inventoryData.faultyInventory = this.getCentralInventoryDashboardCount.faultyInventory;
        this.inventoryData.sendtoRepair = this.getCentralInventoryDashboardCount.faultySentToRepair;
        this.FETCH_ALL_REGIONS_DATA()
          .then(() => {
            this.inventoryData.regionFilterOptions = this.getAllRegionsData;
            
            this.$q.loading.hide();
          })
          .catch(() => {
            this.$q.loading.hide();
          });
      });
    },
    getAllSOData() {
      this.FETCH_ALL_SO_DATA()
        .then(() => {
          this.inventoryData.SOFilterOptions = this.getAllSOsData;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
   
    filterInventoryCountByRegion(value) {
      this.inventoryData.regionalItems = [];
    
      this.FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT(value)
        .then(() => {
        
          this.inventoryData.regionalItems = this.getAllRegionalInventoryDeviceDetailsWithCount.inventryCount;
          
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    filterInventoryCountBySO(value) {
      this.inventoryData.billPartnerInventory = [];
      this.FETCH_SO_INVENTORY_DEVICE_DETAIL_WITH_COUNT(value)
        .then(() => {
          this.inventoryData.billPartnerInventory = this.getAllSoInventoryDeviceDetailsWithCount.inventryCount;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    }
  }
};
</script>

<style scoped>
.ls-1 { letter-spacing: 0.05em; }
.border-bottom { border-bottom: 1px solid #edf2f7; }
.border-left-brand { border-left-width: 4px; }
.transition-hover { transition: all 0.2s ease-in-out; }
.transition-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.uppercase { text-transform: uppercase; }
</style>
