<template>
  <q-page padding>
    <q-tabs
      v-model="QRselected"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
    >
      <q-tab name="createQRSticker" label="Create QR Ref No" />
      <q-tab name="downloadQRcodes" label="Download QR Codes" />
      <q-tab name="implementQRleadsources" label="Implement QR for Lead Sources" />
    </q-tabs>

    <q-tab-panels v-model="QRselected" animated keep-alive class="bg-transparent">
      <q-tab-panel name="createQRSticker" class="no-padding q-mt-md">
        <createQRSticker />
      </q-tab-panel>
      <q-tab-panel name="downloadQRcodes" class="no-padding q-mt-md">
        <downloadQRcodes />
      </q-tab-panel>
      <q-tab-panel name="implementQRleadsources" class="no-padding q-mt-md">
        <implementQRleadsources />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import createQRSticker from "../../components/super_admin/createQRSticker.vue";
import downloadQRcodes from "../../components/super_admin/downloadQRcodes.vue";
import implementQRleadsources from "../../components/super_admin/implementQRleadsources.vue";

export default {
  name: "QRStickerManagement",
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
