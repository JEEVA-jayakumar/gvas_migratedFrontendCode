<template>
  <q-page padding>
    <div class="row justify-end q-my-md">
      <div class="col-auto">
        <q-btn
          no-caps
          no-wrap
          label="Upload Bank List"
          class="text-weight-regular"
          color="purple-9"
          icon="add"
          size="md"
          @click="fnShowCreateUploadFile()"
        />
      </div>
    </div>
    <div class="q-title q-my-lg text-weight-regular">Bank SO Details</div>
    <q-form @submit.prevent="fnSubmitBankDetails(formData)">
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm q-py-sm">
            <div class="col-md-6 col-12">
              <q-input
                v-model.trim="formData.location"
                @blur="v$.formData.location.$touch"
                :error="v$.formData.location.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Location"
                placeholder="Location"
              />
            </div>
            <div class="col-md-6 col-12">
              <q-select
                v-model.trim="formData.bank"
                @blur="v$.formData.bank.$touch"
                :error="v$.formData.bank.$error"
                class="text-weight-regular text-grey-8"
                :options="dropDown.leadSourceOptions"
                label="*Bank"
                placeholder="Bank"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6 col-12">
              <q-input
                v-model.trim="formData.branch_code"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                @blur="v$.formData.branch_code.$touch"
                :error="v$.formData.branch_code.$error"
                label="*Branch_Code"
                placeholder="Branch_Code"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                v-model.trim="formData.so_name"
                @blur="v$.formData.so_name.$touch"
                :error="v$.formData.so_name.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*So_Name"
                placeholder="So_Name"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                v-model.trim="formData.mail_id"
                @blur="v$.formData.mail_id.$touch"
                :error="v$.formData.mail_id.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Mail_Id"
                placeholder="Mail_Id"
              />
            </div>
            <div class="col-md-6 col-12">
              <q-input
                v-model.trim="formData.emp_id"
                @blur="v$.formData.emp_id.$touch"
                :error="v$.formData.emp_id.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Emp_Id"
                placeholder="Emp_Id"
              />
            </div>
            <div class="col-md-6 col-12">
              <q-select
                v-model.trim="formData.bank_enable"
                @blur="v$.formData.bank_enable.$touch"
                :error="v$.formData.bank_enable.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Bank_Enable"
                placeholder="Bank_Enable"
                :options="selectBankEnableOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>
      <div class="full-width q-gutter-sm" align="center">
        <q-btn
          size="md"
          type="submit"
          color="purple-9"
        >Submit</q-btn>
      </div>
    </q-form>
    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="fnShowCreateUploadFile"
    ></uploadFile>
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
  components: {
    uploadFile
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      propShowCreateUploadFile: false,
      dropDown: {
        leadSourceOptions: []
      },
      selectBankEnableOptions: [
        {
          label: "Yes",
          value: "True"
        },
        {
          label: "No",
          value: "False"
        }
      ],

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
        location: { required },
        bank: { required },
        branch_code: { required },
        so_name: { required },
        mail_id: { required },
        emp_id: { required, email },
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
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
        return;
      } else {
        this.SAVE_BANK_SO(formData)
          .then(response => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: response.data.message,
              icon: "thumb_up"
            });
            this.formData.location = "";
            this.formData.bank = "";
            this.formData.branch_code = "";
            this.formData.so_name = "";
            this.formData.mail_id = "";
            this.formData.emp_id = "";
            this.formData.bank_enable = "";
            this.v$.formData.$reset();
          }).catch(() => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "warning",
              color: "amber-9",
              position: "bottom",
              message: error.data?.message || "Something went wrong"
            });
          });
      }
    },
    ajaxLoadLeadSource() {
      let self = this;
      self.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        self.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
          return {
            value: item.sourceName,
            label: item.sourceName
          };
        });
      });
    },
    fnShowCreateUploadFile() {
      this.propShowCreateUploadFile = !this.propShowCreateUploadFile;
    }
  }
};
</script>
