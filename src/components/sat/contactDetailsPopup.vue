<template>
  <q-dialog persistent v-model="toggleModel">
    <q-card style="min-width: 400px">
      <q-card-section class="q-title text-center text-weight-regular bottom-border text-custom-color q-pa-md">
        <div class="text-h6">CONTACT DETAILS</div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="q-mb-sm"><span class="text-weight-bold">Address:</span> {{ propRowDetails?.address || "NA" }}</div>
        <div class="q-mb-sm"><span class="text-weight-bold">City:</span> {{ propRowDetails?.city || "NA" }}</div>
        <div class="q-mb-sm"><span class="text-weight-bold">Pincode:</span> {{ propRowDetails?.pincode || "NA" }}</div>
        <div class="q-mb-sm"><span class="text-weight-bold">Mobile Number:</span> {{ propRowDetails?.contactNumber || "NA" }}</div>
      </q-card-section>
      <q-card-actions align="center" class="q-pb-md">
        <q-btn label="Close" @click="emitfnshowUpdateOpenedExternal" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "contactDetailsPopup",
  props: ["propShowUpdateContactDetails", "propRowDetails"],
  data() {
    return { toggleModel: this.propShowUpdateContactDetails };
  },
  methods: {
    emitfnshowUpdateOpenedExternal() { this.$emit("emitfnshowUpdateOpenedExternal"); }
  }
};
</script>

<style scoped>
.text-custom-color { color: #530750; }
</style>