<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs indicator-color="purple-9" v-model="QRselected" active-color="purple-9" class="shadow-1" align="">
            <q-tab name="createQRSticker" label="Create QR Ref No" />
            <q-tab name="downloadQRcodes" label="Download QR Codes" />
            <q-tab
              name="implementQRleadsources"
              label="Implement QR for Lead Sources"
            />
          </q-tabs>

          <q-tab-panels v-model="QRselected" animated class="bg-transparent">
            <q-tab-panel name="createQRSticker" class="no-padding">
              <createQRSticker />
            </q-tab-panel>

            <q-tab-panel name="downloadQRcodes" class="no-padding">
              <downloadQRcodes />
            </q-tab-panel>

            <q-tab-panel name="implementQRleadsources" class="no-padding">
              <implementQRleadsources />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import createQRSticker from "../../components/super_admin/createQRSticker.vue";
import downloadQRcodes from "../../components/super_admin/downloadQRcodes.vue";
import implementQRleadsources from "../../components/super_admin/implementQRleadsources.vue";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "QRSticker",

  components: {
    createQRSticker,
    downloadQRcodes,
    implementQRleadsources
  },

  data() {
    return {
      QRselected: "createQRSticker"
    };
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
