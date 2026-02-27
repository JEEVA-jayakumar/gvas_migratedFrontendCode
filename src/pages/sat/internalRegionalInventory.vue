<template>
    <q-page>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              no-pane-border
              v-model="inventoryOptionSelected"
              color="dark"
              filled
              class="shadow-1"
            >
              <q-tab name="spare" label="Spare Parts" />
              <!-- <q-tab name="spareSo" label="Spare Parts So" /> -->
              <q-tab name="count" label="Inventory Count" />
              <!-- <q-tab name="Socount" label="Inventory So Count" /> -->
              <q-tab name="dispatch" label="Disptached Inventory" />
              <q-tab name="damage" label="Add Damaged Devices" />
              <!-- <q-tab name="faulty" label="Add Faulty Devices" /> -->
              <q-tab name="allocatetoso" label="Allocate to So" />
              <q-tab name="AllocateSotoSo" label="Allocate SO to SO" />
              <q-tab
                name="inventorywithResellar"
                label="Allocate to Reseller"
              />
              <q-tab
                name="inventorywithSo"
                label="Inventory with SO"
              />
              <q-tab
                name="inventorywithResellarDetails"
                label="Inventory with Reseller"
              />
                <q-tab name="simStatus" label="Sim Status" />
              <q-tab name="deviceAllocationRequest" label="REQUEST" />
              <!-- -->
              <!-- -->
</q-tabs>
<q-tab-panels v-model="inventoryOptionSelected" animated>
<q-tab-panel name="spare">
                <spareParts
                  @emittedForTotalSerialNumbers="
                    fnAjaxFetchAllDeviceDetailsWithCount
                  "
                />
              </q-tab-panel>
<q-tab-panel name="spareSo">
                <sparePartsSo
                  @emittedForTotalSerialNumbers="
                    fnAjaxFetchAllDeviceDetailsWithCount
                  "
                />
              </q-tab-panel>
<q-tab-panel name="count">
                <inventoryCount
                  @emittedForTotalSerialNumbers="
                    fnAjaxFetchAllDeviceDetailsWithCount
                  "
                />
              </q-tab-panel>
<q-tab-panel name="Socount">
                <inventoryCount
                  @emittedForTotalSerialNumbers="
                    fnAjaxFetchAllDeviceDetailsWithCount
                  "
                />
              </q-tab-panel>
<q-tab-panel name="dispatch">
                <dispatchedInventory
                  @fetchDeviceDetailsWithCount="
                    fnAjaxFetchAllDeviceDetailsWithCount
                  "
                />
              </q-tab-panel>
<q-tab-panel name="damage">
                <showAddDamagedDevices
                  :propDeviceTypes="getAllRegionalInventoryDeviceDetailsWithCount"
                />
              </q-tab-panel>
<q-tab-panel name="faulty">
                <inventoryFaulty />
              </q-tab-panel>
<q-tab-panel name="allocatetoso">
                <inventoryallocatetoso />
              </q-tab-panel>
<q-tab-panel name="inventorywithSo">
                <inventorywithso />
              </q-tab-panel>
<q-tab-panel name="inventorywithResellar">
                <inventorywithResellar />
              </q-tab-panel>
<q-tab-panel name="inventorywithResellarDetails">
                <inventorywithResellarDetails />
              </q-tab-panel>
<q-tab-panel name="AllocateSotoSo">
                <allocateSOtoSO />
              </q-tab-panel>
<q-tab-panel name="simStatus">
                <simStatus/>
              </q-tab-panel>
<q-tab-panel name="deviceAllocationRequest">
                <deviceAllocationRequest />
              </q-tab-panel>
</q-tab-panels>
          </div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
  import spareParts from "../../components/sat/spareParts.vue";
  // import sparePartsSo from "../../components/sat/sparePartsSo.vue";
  import inventoryCount from "../../components/sat/regionalInventory/inventoryCount.vue";
  import dispatchedInventory from "../../components/sat/regionalInventory/dispatchedInventory.vue";
  import showAddDamagedDevices from "../../components/sat/showAddDamagedDevices.vue";
  import allocateSOtoSO from "../../pages/sat/allocateSOtoSO.vue"
  import inventorywithso from "../../components/inventory/inventorywithso.vue";
  import inventoryallocatetoso from "../../pages/sat/allocateSo.vue";
  // import inventoryFaulty from "../../pages/sat/satFaulty.vue";
  import inventorySOCount from "../../components/sat/regionalInventory/SOinventoryCount.vue";
  import inventorywithResellar from "../../pages/inventory/inventorywithsellar.vue";
  import inventorywithResellarDetails from "../../pages/inventory/inventorywithresellar.vue";
  import deviceAllocationRequest from "../../pages/sat/deviceAllocationRequest.vue"
  import simStatus from "../../pages/sat/simStatus.vue"
  import { mapGetters, mapActions } from "vuex";
  export default {
    name: "inventoryAllocation",
  
    components: {
      inventoryCount,
      spareParts,
      // sparePartsSo,
      showAddDamagedDevices,
      dispatchedInventory,
      inventorywithso,
      // inventoryFaulty,
      inventoryallocatetoso,
      inventorywithResellar,
      inventorywithResellarDetails,
      allocateSOtoSO,
      deviceAllocationRequest,
      simStatus
    },
  
    data() {
      return {
        enableUploadInventoryBtn: true,
        toggleScanButton: true,
        inventoryOptionSelected: "count",
        toggleAjaxLoadFilter: false,
      };
    },
  
    computed: {
      ...mapGetters("SAT_RegionalInventoryAllocation", [
        "getAllRegionalInventoryDeviceDetailsWithCount",
        "getCurrentPODNumber",
        "getCurrentDeviceId",
        "getAllInventorywithsoDeviceDetailsWithCount"
      ]),
      ...mapGetters("InventoryWithSo", ["getAllInventoryWithSo"])
    },
  
    created() {
      this.fnAjaxFetchAllDeviceDetailsWithCount();
    },
  
    methods: {
      ...mapActions("SAT_RegionalInventoryAllocation", [
        "FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT",
        "FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE",
        "FETCH_INVENTORY_WITH_SO_DEVICE_DETAIL_WITH_COUNT"
      ]),
      ...mapActions("InventoryWithSo", ["FETCH_INVENTORY_WITH_SO"]),
      fnAjaxFetchAllDeviceDetailsWithCount() {
        this.toggleAjaxLoadFilter = true;
        this.FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT(
          JSON.parse(localStorage.getItem("u_i")).region.id
        )
          // this.FETCH_INVENTORY_WITH_SO_DEVICE_DETAIL_WITH_COUNT(
          //   JSON.parse(localStorage.getItem("u_i")).region.id
          // )
          .then(() => {
            let requestParams = {
              region: JSON.parse(localStorage.getItem("u_i")).region.id,
              action: this.$REGIONAL_INVENTORY_FILTER_ACTION_DEVICE
            };
            this.FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE(requestParams);
            this.toggleAjaxLoadFilter = false;
          })
          .catch(error => {
            this.toggleAjaxLoadFilter = false;
          });
      }
    }
  };
  </script>
  
  <style>
  .border-1 {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .border-2 {
    border: 3px solid rgba(48, 48, 48, 0.5);
  }
  </style>
  
