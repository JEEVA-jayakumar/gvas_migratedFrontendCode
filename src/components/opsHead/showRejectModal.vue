<template>
    <div>
        <q-dialog
        v-model="toggleModal"  
        persistent
        >
          <q-card style="min-width: 50vw;">
            <q-card-section>
              <div class="text-h6 text-weight-regular">Reject Exception</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                type="textarea"
                color="grey-9"
                v-model="formData.leadVerificationStatus.reason"
                label="Enter reason for reject"
                placeholder="type.."
                autofocus
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancel"
                @click="emitModalToggle"
                v-close-overlay
              />
              <q-btn
                color="primary"
                label="Submit"
                @click="fnFinalRejectSubmit(formData)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["propToggleRejectModal", "propExceptionDetails"],

  data() {
    return {
      reason: "",
      toggleModal: this.propToggleRejectModal,
      formData: {
        leadInformation: {
          verifiedKycStatus: 5
        },
        leadVerificationStatus: {
          fieldName: "KYC",
          reason: "",
          leadInformation: {
            id: this.propExceptionDetails.id
          }
        }
      }
    };
  },

  computed: {
    ...mapGetters("commonLoader", ["getToggleCommonLoader"])
  },

  methods: {
    ...mapActions("OPSHead", [
      "FETCH_ALL_EXCEPTION_KYC_DATA",
      "FEED_EQ_KYC_FEEDBACK"
    ]),
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),

    emitModalToggle() {
      this.$emit("emitfnToRejectLeadException");
    },

    fnFinalRejectSubmit(formData) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to reject exception?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.TOGGLE_COMMON_LOADER(true);
          this.FEED_EQ_KYC_FEEDBACK(formData)
            .then(response => {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message:
                  "Rejected lead #" +
                  formData.leadVerificationStatus.leadInformation.id,
                icon: "clear"
              });
              this.FETCH_ALL_EXCEPTION_KYC_DATA();
              this.emitModalToggle();
            }).onCancel(error => {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: "Error in rejecting exception!",
                icon: "thumb_down"
              });
            });
          this.TOGGLE_COMMON_LOADER(false);
        })
        .onCancel(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "No changes made!",
            icon: "thumb_down"
          });
        });
    }
  }
};
</script>
