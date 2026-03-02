<template>
  <q-page padding>
    <q-tabs
      v-model="MarsApiOptionSelected"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
    >
      <q-tab name="DeviceModel" label="Device Model" />
      <q-tab name="City" label="City" />
      <q-tab name="Region" label="Region" />
      <q-tab name="RentalPlan" label="Rental Plan" />
      <q-tab name="LeadForm" label="Lead Form" />
      <q-tab name="State" label="State" />
    </q-tabs>

    <q-tab-panels v-model="MarsApiOptionSelected" animated keep-alive class="bg-transparent">
      <q-tab-panel name="DeviceModel" class="no-padding q-mt-md">
        <DeviceModelApiSync />
      </q-tab-panel>
      <q-tab-panel name="City" class="no-padding q-mt-md">
        <CityApiSync />
      </q-tab-panel>
      <q-tab-panel name="Region" class="no-padding q-mt-md">
        <RegionApiSync />
      </q-tab-panel>
      <q-tab-panel name="RentalPlan" class="no-padding q-mt-md">
        <RentalPlanApiSync />
      </q-tab-panel>
      <q-tab-panel name="LeadForm" class="no-padding q-mt-md">
        <LeadFormApiSync />
      </q-tab-panel>
      <q-tab-panel name="State" class="no-padding q-mt-md">
        <StateApiSync />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import DeviceModelApiSync from "./DeviceModelApiSync.vue";
import CityApiSync from "./CityApiSync.vue";
import RegionApiSync from "./RegionApiSync.vue";
import RentalPlanApiSync from "./RentalPlanApiSync.vue";
import LeadFormApiSync from "./LeadFormApiSync.vue";
import StateApiSync from "./StateApiSync.vue";

export default {
  name: "MarsApiSyncMain",
  components: {
    DeviceModelApiSync,
    CityApiSync,
    RegionApiSync,
    RentalPlanApiSync,
    LeadFormApiSync,
    StateApiSync
  },
  data() {
    return {
      MarsApiOptionSelected: "DeviceModel"
    };
  }
};
</script>
