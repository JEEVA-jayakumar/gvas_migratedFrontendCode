<template>
  <div>
    <q-dialog
      persistent
      v-model="toggleModal"
    >
      <q-card style="min-width: 40vw;">
        <q-card-section>
          <div class="text-h6">Approval confirmation</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="formData.leadInformation.reason"
            label="Remarks"
            color="primary"
            autofocus
            @keyup.enter="sendRemarks(formData)"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="block"
            color="grey-5"
            @click="emitToggleRemarks()"
            class="text-dark"
            v-close-overlay
            label="Cancel"
          />
          <q-btn
            icon="done"
            color="positive"
            @click="sendRemarks(formData)"
            label="Approve"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propToggleLeadModal", "propLeadDetails"],
  data() {
    return {
      toggleModal: this.propToggleLeadModal,
      itemDetails: this.propLeadDetails,
      formData: {
        leadInformation: {
          fieldName: "SAT exception queue KYC approve by OPS",
          reason: ""
        },
        leadId: this.propLeadDetails.id,
        defaultUrlValue: this.$EXCEPTION_QUEUE_KYC_OPS_HEAD_APPROVE_URL_PARAM
      }
    };
  },
  computed: {
    ...mapGetters("commonLoader", ["getToggleCommonLoader"])
  },
  methods: {
    ...mapActions("OPSHead", [
      "FEED_EQ_KYC_FEEDBACK",
      "FETCH_ALL_EXCEPTION_KYC_DATA"
    ]),
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),

    emitToggleRemarks() {
      this.$emit("toggleLeadModal");
    },

    sendRemarks(formDataDetails) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Processing .."
      });
      this.FEED_EQ_KYC_FEEDBACK(formDataDetails)
        .then(response => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Approved Lead : #" + formDataDetails.leadId,
            icon: "thumb_up"
          });
          this.$router.push("/ops/head/exceptions");
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Error in approving exception!",
            icon: "thumb_down"
          });
        });
    }
  }
};
</script>
