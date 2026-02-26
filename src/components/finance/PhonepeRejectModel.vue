<template>
  <q-dialog
    v-model="showModel"
    persistent
    @hide="emitToggleReject"
  >
    <q-card style="min-width: 350px; padding: 20px;">
      <q-card-section>
        <div class="text-h6">Reject Phonepe Request</div>
        <q-input
          type="textarea"
          filled
          placeholder="Phonepe Remarks"
          label="Reject Remarks"
          class="q-my-md"
          color="purple-9"
          v-model="formData.regionalInventory.lostOrStolenRemarks"
          :error="$v.formData.regionalInventory.lostOrStolenRemarks.$error"
          error-message="Remarks are required"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey-9" @click="showModel = false" />
        <q-btn label="Reject" color="negative" @click="financeRejectSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  setup() {
    return { $v: useVuelidate() };
  },
  props: ["showRejectModel", "propShowRejectComponent"],

  data() {
    return {
      showModel: this.showRejectModel,
      formData: {
        regionalInventory: {
          id: this.propShowRejectComponent.regionalInventory.id,
          serialNumber: this.propShowRejectComponent.regionalInventory.serialNumber,
          lostOrStolenRemarks: ""
        }
      }
    };
  },

  validations() {
    return {
      formData: {
        regionalInventory: {
          lostOrStolenRemarks: { required }
        }
      }
    };
  },

  methods: {
    ...mapActions("LostFinance", ["REJECT_PHONEPE_LOST_STOLEN_EXCEPTION"]),
    emitToggleReject() {
      this.$emit("closeRejectModel");
    },
    async financeRejectSubmit() {
      const isCorrect = await this.$v.formData.$validate();
      if (!isCorrect) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to reject the lead?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({
            delay: 0,
            spinnerColor: "purple-9",
            message: "Processing .."
          });
          this.REJECT_PHONEPE_LOST_STOLEN_EXCEPTION(this.formData.regionalInventory)
            .then(() => {
              this.$emit("reloadPaymentTrackerData");
              this.$q.loading.hide();
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: "Successfully Rejected",
                icon: "clear"
              });
              this.showModel = false;
            })
            .catch(error => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: error.body?.message || "Please Try Again Later !",
                icon: "thumb_down"
              });
            });
        });
      }
    }
  }
};
</script>
