<template>
  <q-dialog
    :model-value="showChequeImage"
    @update:model-value="emitToggleCheque"
  >
    <q-card style="max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Cheque Image</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-img
          :src="chequeImagevalue"
          style="max-width: 100%;"
          spinner-color="purple-9"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: ["showChequeImage", "chequeImagevalue"],

  data() {
    return {
    };
  },

  methods: {
    emitToggleCheque() {
      this.$emit("closeChequeImage");
    }
  }
};
</script>
