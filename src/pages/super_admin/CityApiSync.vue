<template>
  <q-page padding>
    <MarsApiSyncBase title="CITY" :syncAction="CITY_MARS" />
  </q-page>
</template>

<script>
import MarsApiSyncBase from "../../components/super_admin/MarsApiSyncBase.vue";
import { mapActions } from "vuex";

export default {
  name: "CityApiSync",
  components: { MarsApiSyncBase },
  methods: {
    ...mapActions("MarsApiSync", ["CITY_MARS"])
  }
};
</script>
