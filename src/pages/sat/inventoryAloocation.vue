<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            filled
            class="shadow-1"
          >
            <q-tab name="internal" label="Bijlipay Regional Inventory" />
            <q-tab name="external" label="Phonepe Regional Inventory" />
          </q-tabs>


          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="internal">
              <internalRegionalInventory/>
            </q-tab-panel>
            <q-tab-panel name="external">
              <AggregatorInventory/>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
 import internalRegionalInventory from "../../pages/sat/internalRegionalInventory.vue";
 import AggregatorInventory from "../../pages/sat/AggregatorInventory.vue";

export default {
  name: "inventoryAllocation",

  components: {
    internalRegionalInventory,
    AggregatorInventory
  },

  data() {
    return {
      enableUploadInventoryBtn: true,
      toggleScanButton: true,
      inventoryOptionSelected: "internal"
    };
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