<template>
    <q-page>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              v-model="inventoryOptionSelected"
              active-color="dark"
              indicator-color="dark"
              class="shadow-1"
              align="left"
            >
              <q-tab name="prefix" label="Prfix Config" />
              <q-tab name="vasDevLs" label="LeadSource And Vas Device Config" />
            </q-tabs>

            <q-tab-panels v-model="inventoryOptionSelected" animated class="bg-transparent">
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
    name: "PrefixConfig",

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

  <style scoped>
  .bottom-border {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  </style>
