<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 text-purple-9 q-mb-lg text-center">Existing M-ATM Plan</div>

      <q-form @submit="fnsubmitPlans" class="q-gutter-md">
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-md-5">
            <q-input
              outlined
              dense
              v-model.trim="formData.planName"
              label="Name of the Plan*"
              :error="v$.formData.planName.$error"
              color="purple-9"
            />
          </div>
          
          <div class="col-12 col-md-5">
            <q-input
              outlined
              dense
              type="number"
              v-model.trim="formData.incentivePercentage"
              label="Incentive Percentage *"
              :error="v$.formData.incentivePercentage.$error"
              color="purple-9"
            />
          </div>
         
          <div class="col-12 col-md-5">
            <q-input
              outlined
              dense
              type="number"
              v-model.trim="formData.minTxnVal"
              label="Minimum Transaction Value*"
              :error="v$.formData.minTxnVal.$error"
              color="purple-9"
            />
          </div>

          <div class="col-12 col-md-5">
            <q-input
              outlined
              dense
              type="number"
              v-model.trim="formData.maxIncPerTxn"
              label="Maximum Incentive Per Transaction *"
              :error="v$.formData.maxIncPerTxn.$error"
              color="purple-9"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-xl q-gutter-x-md">
          <q-btn flat label="Cancel" color="grey-7" @click="GoToUsers" />
          <q-btn unelevated label="Submit" color="purple-9" type="submit" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditMatmPlans",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      propRowDetails: {},
      formData: {
        planName: "",
        incentivePercentage: "",
        minTxnVal: "",
        maxIncPerTxn: ""
      }
    };
  },
  validations() {
    return {
      formData: {
        planName: { required },
        incentivePercentage: { required },
        minTxnVal: { required },
        maxIncPerTxn: { required }
      }
    };
  },
  beforeMount() {
    this.propRowDetails = this.$route.params.data || {};
    if (this.propRowDetails.planName) {
      this.formData.planName = this.propRowDetails.planName;
      this.formData.incentivePercentage = this.propRowDetails.incentivePercentage;
      this.formData.minTxnVal = this.propRowDetails.minTxnVal;
      this.formData.maxIncPerTxn = this.propRowDetails.maxIncPerTxn;
    }
  },
  created() {
    this.ajaxLoadLeadSource();
    this.INSTITUTIONCODE_FROM_FROM_MARS();
    this.FETCH_ALL_MATM_PLAN_DETAILS();
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("getMatmDatas", ["FETCH_ALL_MATM_PLAN_DETAILS"]),
    ...mapActions("InstitutionCode", ["INSTITUTIONCODE_FROM_FROM_MARS"]),
    ...mapActions("updatePlanDetails", ["UPDATE_PLAN_DETAILS_DATAS"]),

    async ajaxLoadLeadSource() {
      await this.LEAD_SOURCE_ACTIVE_LIST();
    },

    async fnsubmitPlans() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "warning", message: "Please review fields again." });
        return;
      }

      this.$q.loading.show();
      let requestParams = {
        params: {
          id: this.propRowDetails.deviceId?.id
        },
        formData: {
          planName: this.formData.planName,
          incentivePercentage: this.formData.incentivePercentage,
          minTxnVal: this.formData.minTxnVal,
          maxIncPerTxn: this.formData.maxIncPerTxn
        }
      };

      this.UPDATE_PLAN_DETAILS_DATAS(requestParams)
        .then(() => {
          this.$q.notify({ color: "positive", message: "Plan has been updated successfully" });
          this.GoToUsers();
        })
        .catch(() => {
          this.$q.notify({ color: "negative", message: "Please try again" });
        })
        .finally(() => this.$q.loading.hide());
    },

    GoToUsers() {
      this.$router.push("/super/admin/manage/existingmATMplan/");
    }
  }
};
</script>
