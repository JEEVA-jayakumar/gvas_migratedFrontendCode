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
            <q-tab name="internal" label="Bijlipay Service Request" />
            <q-tab name="external" label="Aggregator Service Request" />
          </q-tabs>

          <q-tab-panels v-model="inventoryOptionSelected" animated>
            <q-tab-panel name="internal" class="q-pa-none">
              <internalserviceRequest />
            </q-tab-panel>

            <q-tab-panel name="external" class="q-pa-none">
              <externalserviceRequest />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import internalserviceRequest from "../../components/sat/internalserviceRequest.vue";
import externalserviceRequest from "../../components/sat/externalserviceRequest.vue";

export default {
  name: "serviceRequestSat",
  components: {
    internalserviceRequest,
    externalserviceRequest
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
