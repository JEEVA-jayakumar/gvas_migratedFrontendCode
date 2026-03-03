<template>
    <q-page>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              v-model="inventoryOptionSelected"
              color="dark"
              align="left"
              class="shadow-1"
            >
              <q-tab name="prefix" label="Prefix Config" />
              <q-tab name="vasDevLs" label="LeadSource And Vas Device Config" />
            </q-tabs>

            <q-tab-panels v-model="inventoryOptionSelected" animated keep-alive>
              <q-tab-panel name="prefix" class="no-padding">
                <prefix />
              </q-tab-panel>
              <q-tab-panel name="vasDevLs" class="no-padding">
                <vasDevLs />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </q-page>
  </template>

  <script>
  import prefix from "../../components/super_admin/prefixConfig.vue";
  import vasDevLs from "../../components/super_admin/leadSourceVasDeviceConfig.vue";
  import { mapGetters, mapActions } from "vuex";

  export default {
    name: "PrefixConfigPage",
    components: {
        prefix,
        vasDevLs
    },
    data() {
      return {
        inventoryOptionSelected: "prefix"
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
    methods: {
      ...mapActions("SAT_RegionalInventoryAllocation", [
        "FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT",
        "FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE",
        "FETCH_INVENTORY_WITH_SO_DEVICE_DETAIL_WITH_COUNT"
      ]),
      ...mapActions("InventoryWithSo", ["FETCH_INVENTORY_WITH_SO"]),
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