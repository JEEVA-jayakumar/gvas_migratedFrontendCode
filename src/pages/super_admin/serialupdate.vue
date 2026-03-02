<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 text-purple-9 q-mb-md">TID Based SerialNumber</div>

      <q-form @submit="fnSubmitBankDetails" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.bank"
              :options="leadSourceOptions"
              label="*Select TID"
              :error="v$.formData.bank.$error"
              color="purple-9"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              dense
              v-model.trim="formData.emp_id"
              label="*Enter Serial Number"
              :error="v$.formData.emp_id.$error"
              color="purple-9"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <q-btn unelevated label="Submit" color="purple-9" type="submit" />
        </div>
      </q-form>
    </q-card>

    <!-- Redundant components or other features could be added here if parity requires -->
    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="propShowCreateUploadFile = false"
    />
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import uploadFile from "../../components/super_admin/uploadFile.vue";

export default {
  name: "SerialUpdate",
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    uploadFile
  },
  data() {
    return {
      propShowCreateUploadFile: false,
      leadSourceOptions: [],
      formData: {
        location: "",
        bank: "",
        branch_code: "",
        so_name: "",
        mail_id: "",
        emp_id: "",
        bank_enable: ""
      }
    };
  },
  validations() {
    return {
      formData: {
        bank: { required },
        emp_id: { required, email } // Legacy code had email validation for emp_id
      }
    };
  },
  created() {
    this.ajaxLoadLeadSource();
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource"])
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("Bank_SO", ["SAVE_BANK_SO"]),

    async ajaxLoadLeadSource() {
      await this.LEAD_SOURCE_ACTIVE_LIST();
      this.leadSourceOptions = this.getActiveLeadSource.map(item => ({
        label: item.sourceName,
        value: item.sourceName
      }));
    },

    async fnSubmitBankDetails() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "warning", message: "Please review fields again." });
        return;
      }

      this.$q.loading.show();
      const payload = {
        ...this.formData,
        bank: this.formData.bank.value // Mapping back to legacy expected structure
      };

      this.SAVE_BANK_SO(payload)
        .then(response => {
          this.$q.notify({ color: "positive", message: response.data.message });
          this.resetForm();
        })
        .catch(error => {
          this.$q.notify({ color: "amber-9", message: error.data.message || "Error occurred" });
        })
        .finally(() => this.$q.loading.hide());
    },

    resetForm() {
      this.formData = {
        location: "",
        bank: "",
        branch_code: "",
        so_name: "",
        mail_id: "",
        emp_id: "",
        bank_enable: ""
      };
      this.v$.$reset();
    }
  }
};
</script>
