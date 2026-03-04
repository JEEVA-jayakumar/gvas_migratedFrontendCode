<template>
  <div>
    <div class="col-md-6 q-my-md" align="right">
      <div class="col group">
      </div>
    </div>
    <div class="col-12 q-title q-my-lg text-weight-regular">TID Based SerialNumber</div>
    <q-form @submit.prevent="fnSubmitBankDetails(formData)">
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm q-py-sm">
            <div class="col-md-6 col-12">
              <q-select
                v-model.trim="formData.bank"
                @blur="v$.formData.bank.$touch"
                :error="v$.formData.bank.$error"
                class="text-weight-regular text-grey-8"
                :options="dropDown.leadSourceOptions"
                label="*Select TID"
                emit-value
                map-options
              />
            </div>
              <div class="col-md-6 col-12">
              <q-input
                v-model.trim="formData.emp_id"
                @blur="v$.formData.emp_id.$touch"
                :error="v$.formData.emp_id.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Enter Serial Number"
              />
              </div>

            </div>
        </div>
      </div>
      <div class="full-width group" align="center">
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
  </div>
</template>

<script>
import uploadFile from "../../components/super_admin/uploadFile.vue";
import { required, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "SerialUpdate",
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
        location: { },
        bank: { required },
        branch_code: { },
        so_name: { },
        mail_id: { },
        emp_id: { required, email },
        bank_enable: { }
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
            this.resetForm();
          })
          .catch(error => {
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
      this.v$.formData.$reset();
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
