<template>
  <div>
    <q-dialog v-model="toggleModal" class="q-mt-lg capitalize" @hide="emitToggleRemarks"
      >
      <q-card style="min-width: 40vw; padding: 20px;">
        <q-card-section>
          <div class="row items-center bottom-border q-py-sm">
            <div class="col text-h6">Add Remarks</div>
            <div class="col-auto">
              <q-btn round size="sm" @click="emitToggleRemarks" outline color="dark" icon="clear" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <form>
            <div class="column group">
              <div>
                <q-editor
                  v-model="formData.crmRemark"
                  min-height="5rem"
                  @blur="$v.formData.crmRemark.$touch"
                  :error="$v.formData.crmRemark.$error"
                />
                <p v-if="$v.formData.crmRemark.$error" class="text-negative text-caption">Remarks are required</p>
              </div>
            </div>

            <div class="group q-mt-md" align="right">
              <q-btn @click="fnsubmit(formData)" color="positive" icon="check" label="Save" />
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
    
<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from '@vuelidate/core'
import { required } from "@vuelidate/validators";

export default {
  name: "bijlipayAddRemarks",
  setup () {
    return { $v: useVuelidate() }
  },
  props: ["remarksInfo", "propToggleRemarksPop", "propToggleRemarks"],
  data() {
    return {
      toggleModal: this.propToggleRemarksPop,
      formData: {
        serviceRequest: this.remarksInfo.remarks.serviceReqTicketId,
        crmRemark: this.remarksInfo.remarks.crmRemark,
        action: this.remarksInfo.action
      },      
    };
  },

  validations() {
    return {
      formData: {
        crmRemark: { required },
      }
    }
  },
  computed : {
    ...mapGetters("bijlipayCrm", ["getupdateRemarks"])
  },

  methods: {
    ...mapActions("bijlipayCrm", ["UPDATE_CRM_REMARKS"]),
    async fnsubmit(formData) {
      const isFormCorrect = await this.$v.$validate();
      if (!isFormCorrect) {
        this.$q.notify("Please review fields again.");
      } else {
        this.UPDATE_CRM_REMARKS(formData)
          .then(() => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Remarks updated successfully",
              icon: "thumb_up"
            });
            this.emitToggleRemarks()
            this.$emit("reloadBijlipayPendingDetails", this.formData.action);
          })
          .catch(error => {
            console.error("Update remarks error:", error);
            const message = (error.body && error.body.message) ? error.body.message : "Please Try Again Later !";
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: message,
              icon: "thumb_down"
            });
          });
      }
    },
    emitToggleRemarks() {
      this.$emit("closeRemarksInfo");
    }
  }
};
</script>
