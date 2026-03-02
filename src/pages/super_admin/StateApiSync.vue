<template>
  <q-page padding>
    <MarsApiSyncBase title="STATE" :syncAction="STATE_MARS" />
  </q-page>
</template>

<script>
import MarsApiSyncBase from "../../components/super_admin/MarsApiSyncBase.vue";
import { mapActions } from "vuex";

export default {
  name: "StateApiSync",
  components: { MarsApiSyncBase },
  methods: {
    ...mapActions("MarsApiSync", ["STATE_MARS"])
  }
};
</script>
