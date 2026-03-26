<template>
  <q-dialog
    v-model="toggleModal"
    persistent
  >
    <q-card style="min-width: 40vw" class="q-pa-md">
      <q-card-section>
        <div class="column">
          <div class="col-md-12 bottom-border">
            <div class="q-title text-weight-regular q-py-sm">POD Number</div>
          </div>
          <div class="col-md-8 q-pt-md" align="left">
            <q-list dense separator>
              <q-item v-for="(item, index) in formData.scannedDevices" :key="index">
                <q-item-section>{{ item.device.deviceName }}</q-item-section>
                <q-item-section side>{{ item.deviceSerialNumbers.length }} nos</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-md-8 q-pt-md" align="left">
            <q-input
              color="grey-9"
              v-model="formData.podNumber"
              label="Enter POD Number"
              placeholder="POD Number"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pt-md">
        <q-btn icon="block" outline label="Cancel" color="grey-9" @click="emitToggleCheque" />
        <q-btn icon="check" class="common-btn" label="Submit" @click="submitDamagedDevices" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["propShowPDOmodal", "propAllScannedItemArr"],
  data() {
    return {
      toggleModal: this.propShowPDOmodal,
      formData: {
        region: this.propAllScannedItemArr.region,
        podNumber: "",
        scannedDevices: this.propAllScannedItemArr.scannedItems
      }
    };
  },
  methods: {
    ...mapActions("SAT_RegionalInventoryAllocation", [
      "PHONEPE_FEED_REGIONAL_INVENTORY_DAMAGED_DEVICE_SERIAL_NUMBER"
    ]),
    emitToggleCheque() {
      this.$emit("closeModel");
    },
    submitDamagedDevices() {
      if (!this.formData.region) {
        this.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Region cannot be empty!",
          icon: "warning"
        });
      } else if (!this.formData.podNumber) {
        this.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "POD number cannot be empty!",
          icon: "warning"
        });
      } else if (!this.formData.scannedDevices || this.formData.scannedDevices.length === 0) {
        this.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Scanned devices cannot be empty!",
          icon: "warning"
        });
      } else {
        this.$q.loading.show({
          message: "Processing ..."
        });
        let param = {
          region: this.formData.region,
          podNumber: this.formData.podNumber,
          scannedDevices: [{
            aggregatorDevice: {
              deviceName: this.formData.scannedDevices[0].device.deviceName,
              id: this.formData.scannedDevices[0].device.id
            },
            deviceSerialNumbers: this.formData.scannedDevices[0].deviceSerialNumbers
          }]
        };
        this.PHONEPE_FEED_REGIONAL_INVENTORY_DAMAGED_DEVICE_SERIAL_NUMBER(param)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Devices successfully aded to damaged inventory",
              icon: "thumb_up"
            });
            this.$emit("emittedAfterPODsubmission", "closeModal");
            this.$emit("closeModel");
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>
