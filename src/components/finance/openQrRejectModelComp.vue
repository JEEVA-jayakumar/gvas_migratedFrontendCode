<template>
  <q-dialog
    :model-value="showQrRejectModel"
    @update:model-value="emitToggleReject"
    persistent
  >
    <q-card style="min-width: 350px; padding: 20px;">
      <q-card-section>
        <div align="center" class="text-subtitle1 q-mb-md capitalize">{{ propShowQrRejectComponent.merchantName }}</div>
        <div align="center" class="text-h6 text-primary q-mb-md">#{{ propShowQrRejectComponent.qrLeadNumber }}</div>
        <div align="left" class="text-weight-light text-grey-8 q-mb-md">Reason</div>
        <div class="column q-gutter-sm">
          <q-radio
            v-model="formData.qrLeadVerificationStatus.reasonType"
            val="Short Fund"
            color="purple-9"
            label="Short Fund"
          />
          <q-radio
            v-model="formData.qrLeadVerificationStatus.reasonType"
            val="Excess Fund"
            color="purple-9"
            label="Excess Fund"
          />
          <q-radio
            v-model="formData.qrLeadVerificationStatus.reasonType"
            val="Cheque Bounce"
            color="purple-9"
            label="Cheque Bounce"
          />
          <q-radio
            v-model="formData.qrLeadVerificationStatus.reasonType"
            val="No Fund"
            color="purple-9"
            label="No Fund"
          />
          <q-radio
            v-model="formData.qrLeadVerificationStatus.reasonType"
            val="Others"
            color="purple-9"
            label="Others"
          />
        </div>
        <div v-if="v$.formData.qrLeadVerificationStatus.reasonType.$error" class="text-negative text-caption">
          Reason type is required
        </div>
        <q-input
          v-if="formData.qrLeadVerificationStatus.reasonType == 'Others'"
          type="textarea"
          filled
          placeholder="Type.."
          label="Detailed Reason"
          class="q-my-md"
          color="purple-9"
          v-model="formData.qrLeadVerificationStatus.reason"
          :error="v$.formData.qrLeadVerificationStatus.reason.$error"
          error-message="Detailed reason is required for 'Others'"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey-9" @click="emitToggleReject" />
        <q-btn label="Reject" color="negative" @click="financeRejectSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  props: ["showQrRejectModel", "propShowQrRejectComponent"],

  data() {
    return {
      formData: {
        qrLeadInformation: {
          verifiedFinanceStatus: 3
        },
        qrLeadVerificationStatus: {
          status: 0,
          fieldName: "Finance",
          reasonType: "",
          reason: ""
        },
        leadId: this.propShowQrRejectComponent.id
      }
    };
  },

  validations() {
    return {
      formData: {
        qrLeadVerificationStatus: {
          reasonType: { required },
          reason: {
            required: requiredIf(() => this.formData.qrLeadVerificationStatus.reasonType === "Others")
          }
        }
      }
    };
  },

  methods: {
    ...mapActions("qrFinance", ["QR_REJECT_FINANCE_EXCEPTION"]),
    emitToggleReject() {
      this.$emit("closeQrRejectModel");
    },
    async financeRejectSubmit() {
      const isCorrect = await this.v$.formData.$validate();
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
          this.QR_REJECT_FINANCE_EXCEPTION(this.formData)
            .then(() => {
              this.$emit("reloadQrPaymentTrackerData");
              this.$q.loading.hide();
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: "Rejected lead #" + this.formData.leadId,
                icon: "clear"
              });
              this.emitToggleReject();
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
        }).onCancel(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "No changes made!",
            icon: "thumb_down"
          });
        });
      }
    }
  }
};
</script>
