<template>
  <q-dialog v-model="opened">
<q-card style="min-width: 350px;">

    <h4>Basic Modal</h4>
    <q-btn
      color="primary"
      @click="opened = false"
      label="Close"
    />

</q-card>
</q-dialog>
</template>

<script>
export default {
  setup() { return { v$: useVuelidate() } },
  name: "Manage Devices",
  data() {
    return {};
  },
};
</script>

<style>
</style>
