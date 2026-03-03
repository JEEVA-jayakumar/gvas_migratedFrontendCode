<template>
    <q-page>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              v-model="MarsApiOptionSelected"
              color="dark"
              align="left"
              class="shadow-1"
            >
              <q-tab name="DeviceModelApiSync" label="DeviceModel" />
              <q-tab name="CityApiSync" label="City" />
              <q-tab name="RegionApiSync" label="Region" />
              <q-tab name="RentalPlanApiSync" label="RentalPlan" />
              <q-tab name="LeadFormApiSync" label="LeadForm" />
              <q-tab name="StateApiSync" label="State" />
            </q-tabs>

            <q-tab-panels v-model="MarsApiOptionSelected" animated keep-alive>
              <q-tab-panel name="DeviceModelApiSync" class="no-padding">
                <DeviceModelApiSync />
              </q-tab-panel>
              <q-tab-panel name="CityApiSync" class="no-padding">
                <CityApiSync />
              </q-tab-panel>
              <q-tab-panel name="RegionApiSync" class="no-padding">
                <RegionApiSync />
              </q-tab-panel>
              <q-tab-panel name="RentalPlanApiSync" class="no-padding">
                <RentalPlanApiSync />
              </q-tab-panel>
              <q-tab-panel name="LeadFormApiSync" class="no-padding">
                <LeadFormApiSync />
              </q-tab-panel>
              <q-tab-panel name="StateApiSync" class="no-padding">
                <StateApiSync />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </q-page>
  </template>

  <script>
  import DeviceModelApiSync from "../../pages/super_admin/DeviceModelApiSync.vue";
  import CityApiSync from "../../pages/super_admin/CityApiSync.vue";
  import RegionApiSync from "../../pages/super_admin/RegionApiSync.vue";
  import RentalPlanApiSync from "../../pages/super_admin/RentalPlanApiSync.vue";
  import LeadFormApiSync from "../../pages/super_admin/LeadFormApiSync.vue";
  import StateApiSync from "../../pages/super_admin/StateApiSync.vue";

  export default {
    name: "MarsApiSync",
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
        MarsApiOptionSelected: "DeviceModelApiSync"
      };
    },
    methods: {}
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