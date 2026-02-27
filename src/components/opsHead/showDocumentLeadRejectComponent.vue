<template>
  <div>
    <!-- Reject model -->
    <q-dialog
      persistent
      :model-value="propToggleDocumentRejectModal"
      @hide="emitToggleRemarks()"
      @escape-key="emitToggleRemarks()"
    >
      <q-card style="min-width: 40vw;">
        <q-card-section>
          <div class="text-h6">{{propDocumentDetails.documentType}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            @blur="v$.formData.leadDetails.reason.$touch"
            :error="v$.formData.leadDetails.reason.$error"
            placeholder="Type.."
            label="Reason"
            color="grey-9"
            v-model="formData.leadDetails.reason"
            autofocus
            @keyup.enter="fnRejectLeadFinal(formData)"
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
            icon="clear"
            color="negative"
            @click="fnRejectLeadFinal(formData)"
            label="Reject"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
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
  props: ["propDocumentDetails", "propToggleDocumentRejectModal"],
  setup() {
    return { v$: useVuelidate() }
  },
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
          status: 0
        }
      }
    };
  },
  validations: {
    formData: {
      leadDetails: {
        reason: {
          required
        }
      }
    }
  },

  methods: {
    ...mapActions("OPSHead", [
      "VERIFY_DOCUMENT_FULL_LEAD",
      "FETCH_ALL_EXCEPTION_KYC_DATA"
    ]),
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),

    emitToggleRemarks() {
      this.$emit("toggleDocumentModal");
    },

    fnRejectLeadFinal(formData) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 0, // ms
          spinnerColor: "purple-9",
          message: "Processing .."
        });
        this.VERIFY_DOCUMENT_FULL_LEAD(formData)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Document rejected",
              icon: "clear"
            });
            this.FETCH_ALL_EXCEPTION_KYC_DATA();
            this.$emit("toggleDocumentModalHotReload");
            this.$emit("toggleDocumentModal");
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Error in rejecting document!",
              icon: "thumb_down"
            });
            this.$q.loading.hide();
          });
      }
    }
  }
};
</script>
