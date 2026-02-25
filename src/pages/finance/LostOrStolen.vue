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
              <q-tab name="internal" label="Bijlipay Lost Or Stolen" />
              <!-- <q-tab name="spareSo" label="Spare Parts So" /> -->
              <q-tab name="external" label="Phonepe Lost Or Stolen" />
</q-tabs>
<q-tab-panels v-model="inventoryOptionSelected" animated>
<q-tab-panel name="internal">
                <LostFinance/>
              </q-tab-panel>
<q-tab-panel name="external">
                <PhonePeFinanceLostOrStolen/>
              </q-tab-panel>
</q-tab-panels>
          </div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
   import LostFinance from "../../pages/finance/LostFinance.vue";
   import PhonePeFinanceLostOrStolen from "../../pages/finance/PhonePeFinanceLostOrStolen.vue";
  
  import { mapGetters, mapActions } from "vuex";
  export default {
    name: "inventoryAllocation",
  
    components: {
        LostFinance,
        PhonePeFinanceLostOrStolen
      
    },
  
    data() {
      return {
        enableUploadInventoryBtn: true,
        toggleScanButton: true,
        inventoryOptionSelected: "implementationQueue"
      };
    },
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
  