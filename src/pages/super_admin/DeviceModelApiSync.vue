<template>
  <q-page padding>
    <MarsApiSyncBase title="DEVICE MODEL" :syncAction="DEVICE_MARS" />
  </q-page>
</template>

<script>
import MarsApiSyncBase from "../../components/super_admin/MarsApiSyncBase.vue";
import { mapActions } from "vuex";

export default {
  name: "DeviceModelApiSync",
  components: { MarsApiSyncBase },
  methods: {
    ...mapActions("MarsApiSync", ["DEVICE_MARS"])
  }
};
</script>
