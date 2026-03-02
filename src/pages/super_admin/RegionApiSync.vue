<template>
  <q-page padding>
    <MarsApiSyncBase title="REGION" :syncAction="REGION_MARS" />
  </q-page>
</template>

<script>
import MarsApiSyncBase from "../../components/super_admin/MarsApiSyncBase.vue";
import { mapActions } from "vuex";

export default {
  name: "RegionApiSync",
  components: { MarsApiSyncBase },
  methods: {
    ...mapActions("MarsApiSync", ["REGION_MARS"])
  }
};
</script>
