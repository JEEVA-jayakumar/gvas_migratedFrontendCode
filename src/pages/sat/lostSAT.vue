<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            align="justify"
            class="shadow-1"
          >
            <q-tab name="internal" label="Bijlipay Lost Or Stolen" />
            <q-tab name="external" label="Phonepe Lost Or Stolen" />
          </q-tabs>

          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="internal">
              <internalLostOrStolen/>
            </q-tab-panel>
            <q-tab-panel name="external">
              <AggregatorsLostOrStolen/>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import internalLostOrStolen from "../../pages/sat/internalLostOrStolen.vue";
import AggregatorsLostOrStolen from "../../pages/sat/AggregatorsLostOrStolen.vue";

export default {
  name: "lostSAT",
  components: {
    internalLostOrStolen,
    AggregatorsLostOrStolen
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
