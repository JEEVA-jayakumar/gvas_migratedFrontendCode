<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      class="q-mt-lg capitalize"
      @hide="handleHide"

    >
      <q-card style="min-width: 40vw; padding: 10px;">
        <q-card-section>
          <div class="row items-center bottom-border q-py-sm">
            <div class="col text-h6">Closing Remarks</div>
            <div class="col-auto">
              <q-btn
                round
                size="sm"
                @click="closeDialog"
                outline
                color="dark"
                icon="clear"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="fnsubmit">
            <div class="column group">
              <div class="row">
                  <div class="col-12">
                    <q-input
                      filled
                      v-model="formData.crmRemark"
                      label="Enter remarks"
                      type="textarea"
                      rows="5"
                      maxlength="500"
                      counter
                      class="textarea-box"
                      :error="v$.formData.crmRemark.$error"
                    />
                  </div>
              </div>
              <div class="row q-gutter-sm q-mt-md justify-end">
                <q-btn
                  type="submit"
                  color="purple-9"
                  icon="check"
                  label="Confirm"
                />
              </div>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from '@vuelidate/core';
import { required } from "@vuelidate/validators";

export default {
  name: "issueResolvingRemarks",
  setup () {
    return { v$: useVuelidate() }
  },
  props: ["resolveRemarksInfo", "propToggleResolveRemarksPop", "propToggleResolveRemarks"],
  data() {
    return {
      toggleModal: this.propToggleResolveRemarksPop,
      closingStatus: 2, // 1 for success, 2 for cancel/failure
      formData: {
        crmRemark: "",
        issueOptionsId: 1,
        resolutionId: this.resolveRemarksInfo.data.resolvedStatus,
        servicingId: this.resolveRemarksInfo.data.actualIssue,
        actionsId: this.resolveRemarksInfo.data.actionTaken,
        issue: null,
        subIssue: null,
        resolutionRemarks: null,
        ticketId: this.resolveRemarksInfo.ticketId.serviceReqTicketId
      }
    };
  },
  validations() {
    return {
      formData: {
        crmRemark: { required },
      }
    };
  },
  methods: {
    ...mapActions("phonePeCrm", ["ISSUE_RESOLVED_BY_CRM"]),
    async fnsubmit() {
      const isCorrect = await this.v$.formData.$validate();
      if (!isCorrect) {
        this.$q.notify("Please review fields again.");
        return;
      }

      this.$q.loading.show({ message: "Data submitting.." });
      this.ISSUE_RESOLVED_BY_CRM(this.formData)
        .then(() => {
          this.closingStatus = 1;
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Remarks updated successfully",
            icon: "thumb_up"
          });
          this.$q.loading.hide();
          this.toggleModal = false;
        })
        .catch(error => {
          console.error("Submit remarks error:", error);
          const message = (error.body && error.body.message) ? error.body.message : "Please Try Again Later !";
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: message,
            icon: "thumb_down"
          });
          this.$q.loading.hide();
        });
    },
    closeDialog() {
      this.toggleModal = false;
    },
    handleHide() {
      this.$emit("closeResolveRemarks", this.closingStatus);
    }
  }
};
</script>

<style scoped>
.textarea-box {
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
