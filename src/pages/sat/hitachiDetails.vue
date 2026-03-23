<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs v-model="QRselected" color="dark" filled class="shadow-1">
            <q-tab name="HitachiUpload" label="Upload And Download" />
          </q-tabs>
          <q-tab-panels v-model="QRselected" animated>
            <q-tab-panel name="HitachiUpload">
              <HitachiUpload />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import HitachiUpload from "../../components/sat/HitachiUpload.vue";

export default {
  name: "hitachiDetails",
  components: {
    HitachiUpload
  },
  data() {
    return {
      QRselected: "HitachiUpload"
    };
  }
};
</script>

<style>
.border-1 { border: 1px solid rgba(0, 0, 0, 0.1); }
.border-2 { border: 3px solid rgba(48, 48, 48, 0.5); }
</style>
