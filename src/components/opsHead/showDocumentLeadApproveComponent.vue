<template>
  <div>
       <!-- Approve model -->
        <q-dialog
        persistent
        :model-value="propToggleDocumentApproveModal"
        @hide="emitToggleRemarks()" 
        @escape-key="emitToggleRemarks()"  
        > 
          <q-card style="min-width: 40vw;">
            <q-card-section>
              <div class="text-h6">{{propDocumentDetails.documentType}}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                  placeholder="Type.."
                  label="Reason"
                  color="grey-9"
                  v-model="formData.leadDetails.reason"
                  autofocus
                  @keyup.enter="fnApproveLeadFinal(formData)"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn icon="block" color="grey-5" @click="emitToggleRemarks()" class="text-dark" v-close-overlay label="Cancel" />
              <q-btn icon="done" color="positive" @click="fnApproveLeadFinal(formData)" label="Approve" />
            </q-card-actions>
          </q-card>
        </q-dialog>
  </div>
</template>

<script>
import {
  required,
  requiredIf,
  email,
  minLength,
  maxLength,
  alpha,
  alphaNum,
  numeric
} from "@vuelidate/validators";
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["propDocumentDetails", "propToggleDocumentApproveModal"],

  data() {
    return {
      formData: {
        lead: {
          id: this.propDocumentDetails.leadId,
          documentId: this.propDocumentDetails.id
        },
        leadDetails: {
          fieldName: "Document",
          reason: "",
          status: 1
        }
      }
    };
  },
  methods: {
    ...mapActions("OPSHead", [
      "FETCH_ALL_EXCEPTION_KYC_BY_ID_DATA",
      "VERIFY_DOCUMENT_FULL_LEAD"
    ]),

    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),

    emitToggleRemarks() {
      this.$emit("toggleDocumentModal");
    },

    fnApproveLeadFinal(formData) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Processing .."
      });
      this.VERIFY_DOCUMENT_FULL_LEAD(formData)
        .then(response => {
           this.$q.loading.hide()
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully approved",
            icon: "thumb_up"
          });
          this.$emit("toggleDocumentModalHotReload");
          this.emitToggleRemarks();
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Error in approving document!",
            icon: "thumb_down"
          });
        });
    }
  }
};
</script>
