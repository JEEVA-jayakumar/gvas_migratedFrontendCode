<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs v-model="QRselected" color="dark" align="left" class="shadow-1">
            <q-tab name="createQRSticker" label="Create QR Ref No" />
            <q-tab name="downloadQRcodes" label="Download QR Codes" />
            <q-tab
              name="implementQRleadsources"
              label="Implement QR for Lead Sources"
            />
          </q-tabs>

          <q-tab-panels v-model="QRselected" animated keep-alive>
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
import createQRSticker from "../../components/super_admin/createQRSticker.vue";
import downloadQRcodes from "../../components/super_admin/downloadQRcodes.vue";
import implementQRleadsources from "../../components/super_admin/implementQRleadsources.vue";

export default {
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

<style>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>