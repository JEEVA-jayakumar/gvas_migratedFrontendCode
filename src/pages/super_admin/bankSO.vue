<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 text-purple-9">Bank SO Details</div>
        <q-btn
          unelevated
          no-caps
          label="Upload Bank List"
          color="purple-9"
          icon="cloud_upload"
          @click="propShowCreateUploadFile = true"
        />
      </div>

      <q-form @submit="fnSubmitBankDetails(formData)" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.trim="formData.location"
              label="Location *"
              :error="v$.formData.location.$error"
              @blur="v$.formData.location.$touch"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.bank"
              :options="dropDown.leadSourceOptions"
              label="Bank *"
              emit-value
              map-options
              :error="v$.formData.bank.$error"
              @blur="v$.formData.bank.$touch"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.trim="formData.branch_code"
              label="Branch Code *"
              :error="v$.formData.branch_code.$error"
              @blur="v$.formData.branch_code.$touch"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.trim="formData.so_name"
              label="SO Name *"
              :error="v$.formData.so_name.$error"
              @blur="v$.formData.so_name.$touch"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.trim="formData.mail_id"
              label="Mail ID *"
              :error="v$.formData.mail_id.$error"
              @blur="v$.formData.mail_id.$touch"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model.trim="formData.emp_id"
              label="Employee ID *"
              :error="v$.formData.emp_id.$error"
              @blur="v$.formData.emp_id.$touch"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="formData.bank_enable"
              label="Bank Enable"
              :options="selectBankEnableOptions"
              emit-value
              map-options
              :error="v$.formData.bank_enable.$error"
              @blur="v$.formData.bank_enable.$touch"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-lg">
          <q-btn
            unelevated
            type="submit"
            color="purple-9"
            label="Submit Bank Details"
            class="q-px-xl"
          />
        </div>
      </q-form>
    </q-card>

    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="propShowCreateUploadFile = false"
    />
  </q-page>
</template>

<script>
import uploadFile from "../../components/super_admin/uploadFile.vue";
import { required, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "BankSO",
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    uploadFile
  },
  data() {
    return {
      propShowCreateUploadFile: false,
      dropDown: {
        leadSourceOptions: []
      },
      selectBankEnableOptions: [
        { label: "Yes", value: "True" },
        { label: "No", value: "False" }
      ],
      formData: {
        location: "",
        bank: null,
        branch_code: "",
        so_name: "",
        mail_id: "",
        emp_id: "",
        bank_enable: null
      }
    };
  },
  validations() {
    return {
      formData: {
        location: { required },
        bank: { required },
        branch_code: { required },
        so_name: { required },
        mail_id: { required, email },
        emp_id: { required },
        bank_enable: { required }
      }
    };
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource"])
  },
  created() {
    this.ajaxLoadLeadSource();
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("Bank_SO", ["SAVE_BANK_SO"]),

    async fnSubmitBankDetails(formData) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "negative", message: "Please review fields again." });
        return;
      }

      this.$q.loading.show({ message: "Submitting..." });
      this.SAVE_BANK_SO(formData)
        .then(response => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            message: response.data.message || "Bank details saved successfully",
            icon: "thumb_up"
          });
          this.resetForm();
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            message: error.data?.message || "Operation failed",
            icon: "warning"
          });
        });
    },

    resetForm() {
      this.formData = {
        location: "",
        bank: null,
        branch_code: "",
        so_name: "",
        mail_id: "",
        emp_id: "",
        bank_enable: null
      };
      this.v$.$reset();
    },

    ajaxLoadLeadSource() {
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          label: item.sourceName,
          value: item.sourceName
        }));
      });
    }
  }
};
</script>
