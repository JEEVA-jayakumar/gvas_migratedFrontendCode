<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            active-color="primary"
            indicator-color="primary"
            class="shadow-1"
          >
            <q-tab name="internal" label="Bijlipay Global Serial" />
            <q-tab name="external" label="Phonepe Global Serial" />
          </q-tabs>

          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="internal">
              <InternalGlobalSearchFilter/>
            </q-tab-panel>

            <q-tab-panel name="external">
              <AggregatorGlobalSearchFilter/>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
 import InternalGlobalSearchFilter from "../../pages/sat/InternalGlobalSearchFilter.vue";
 import AggregatorGlobalSearchFilter from "../../pages/sat/AggregatorGlobalSearchFilter.vue";

export default {
  name: "GlobalSearchFilter",
  components: {
    InternalGlobalSearchFilter,
    AggregatorGlobalSearchFilter
  },
  data() {
    return {
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