<template>
  <q-page padding>
    <MarsApiSyncBase title="LEAD FORM" :syncAction="LEAD_FORM_MARS" />
  </q-page>
</template>

<script>
import MarsApiSyncBase from "../../components/super_admin/MarsApiSyncBase.vue";
import { mapActions } from "vuex";

export default {
  name: "LeadFormApiSync",
  components: { MarsApiSyncBase },
  methods: {
    ...mapActions("MarsApiSync", ["LEAD_FORM_MARS"])
  }
};
</script>
