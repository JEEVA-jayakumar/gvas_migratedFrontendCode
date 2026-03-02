<template>
  <q-page padding>
    <q-tabs
      v-model="inventoryOptionSelected"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
    >
      <q-tab name="prefix" label="Prefix Config" />
      <q-tab name="vasDevLs" label="LeadSource And Vas Device Config" />
    </q-tabs>

    <q-tab-panels v-model="inventoryOptionSelected" animated keep-alive class="bg-transparent">
      <q-tab-panel name="prefix" class="no-padding q-mt-md">
        <prefix />
      </q-tab-panel>

      <q-tab-panel name="vasDevLs" class="no-padding q-mt-md">
        <vasDevLs />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import prefix from "../../components/super_admin/prefixConfig.vue";
import vasDevLs from "../../components/super_admin/leadSourceVasDeviceConfig.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PrefixConfigManagement",
  components: {
    prefix,
    vasDevLs
  },
  data() {
    return {
      inventoryOptionSelected: "prefix"
    };
  }
};
</script>
