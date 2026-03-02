<template>
  <q-page padding>
    <MarsApiSyncBase title="RENTAL PLAN" :syncAction="RENTAL_PLAN_MARS" />
  </q-page>
</template>

<script>
import MarsApiSyncBase from "../../components/super_admin/MarsApiSyncBase.vue";
import { mapActions } from "vuex";

export default {
  name: "RentalPlanApiSync",
  components: { MarsApiSyncBase },
  methods: {
    ...mapActions("MarsApiSync", ["RENTAL_PLAN_MARS"])
  }
};
</script>
