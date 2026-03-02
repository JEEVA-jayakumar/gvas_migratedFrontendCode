<template>
  <div>
    <q-dialog
      v-model="opened"
      class="capitalize"
      @hide="emitToggleRemarks"
    >
      <q-card style="min-width: 30vw; padding: 20px;">
        <div class="row items-center bottom-border q-py-sm">
          <div class="col text-h6">Lead Information</div>
          <div class="col-auto">
            <q-btn round size="sm" @click="emitToggleRemarks" outline color="dark" icon="clear" v-close-overlay/>
          </div>
        </div>

        <q-card-section class="no-padding">
          <q-scroll-area style="height: 400px;">
            <q-list multiline separator class="text-body1">
              <q-item>
                <q-item-section>
                  <q-item-label>Category</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.leadCategory == 1 ? 'Normal' : propLeadInformation.leadCategory == 2 ? 'Exception' : propLeadInformation.leadCategory == 3 ? 'Aggregator' : 'NA' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="propLeadInformation.leadCategory == 2">
                <q-item-section side v-if="propLeadInformation.kyc">
                  <q-chip icon="warning" color="primary">KYC</q-chip>
                </q-item-section>
                <q-item-section side v-if="propLeadInformation.bankSubvention">
                  <q-chip icon="warning" color="primary">Bank Subvention</q-chip>
                </q-item-section>
                <q-item-section side v-if="propLeadInformation.pricing">
                  <q-chip icon="warning" color="primary">Pricing</q-chip>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Document upload type</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.documentUploadedType == 1 ? 'Handover to SAT' : 'Full document upload' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>SO Name</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.assignedTo == null ? 'NA' : propLeadInformation.assignedTo.name + ' | ' + propLeadInformation.assignedTo.employeeID }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Merchant Name</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.leadName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="'leadSource' in propLeadInformation">
                <q-item-section>
                  <q-item-label>Source</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.leadSource.sourceName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Contact Name</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.contactName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Contact Number</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.contactNumber }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Alternate Contact Number</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.alternateContactNumber || 'NA' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Contact Email</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.email || 'NA' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Address</q-item-label>
                  <q-item-label caption lines="5">{{ (propLeadInformation.leadAddress || '') + ', ' + (propLeadInformation.city || '') + ', ' + (propLeadInformation.state || '') + ', ' + (propLeadInformation.pincode || '') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="'device' in propLeadInformation && propLeadInformation.device">
                <q-item-section>
                  <q-item-label>Device Count</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.device.deviceName + '-' + propLeadInformation.deviceCount }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Plan</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.plan == null ? 'NA' : propLeadInformation.plan.planName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Setup Fees</q-item-label>
                  <q-item-label caption>Rs. {{ propLeadInformation.setupFees }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Recurring Fees</q-item-label>
                  <q-item-label caption>Rs. {{ propLeadInformation.recurringFees }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Amount Collected</q-item-label>
                  <q-item-label caption>Rs. {{ propLeadInformation.amountCollected }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="propLeadInformation.merchantType != null && 'merchantTypeName' in propLeadInformation.merchantType">
                <q-item-section>
                  <q-item-label>Merchant Type</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.merchantType.merchantTypeName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Debit &lt;= 2000</q-item-label>
                  <q-item-label caption>Rs. {{ propLeadInformation.debitLessthanAmount }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Debit > 2000</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.debitGreaterthanAmount }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Std CC</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.stdCC }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Premium CC</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.premiumCC }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Corp CC</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.corpCC }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>SuperPremium CC</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.superPremiumlCC }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>amex Domestic</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.amexDomestic }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>amex International</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.amexInternational }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>upi Debit Card UpTo 2000</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.upiDebitCardUpTo2000 }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>upi Debit Card Above 2000</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.upiDebitCardAbove2000 }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>upi Prepaid Credit Cards UpTo 2000</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.upiPrepaidCreditCardsUpTo2000 }} %</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>upi Prepaid Credit Cards Above 2000</q-item-label>
                  <q-item-label caption>{{ propLeadInformation.upiPrepaidCreditCardsAbove2000 }} %</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["propLeadInformationProp", "propToggleLeadInformationPop", "leadInformation"],
  data() {
    return {
      search: "",
      propLeadInformation: {},
      opened: this.propToggleLeadInformationPop
    };
  },
  created() {
    this.ajaxLoadShortLeadInfo();
  },
  computed: {
    ...mapGetters("SatLeadValidation", ["getShortLeadInfo"])
  },
  // beforeMount(){
  // },

  methods: {
    ...mapActions("SatLeadValidation", ["FETCH_SHORT_LEAD_DATA"]),
    //Function to load all lead details
    ajaxLoadShortLeadInfo() {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      const leadInfo = this.propLeadInformationProp || this.leadInformation;
      this.FETCH_SHORT_LEAD_DATA(
        leadInfo.leadId || leadInfo.id
      )
        .then(response => {
          this.propLeadInformation = this.getShortLeadInfo;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    emitToggleRemarks() {
      this.$emit("closeLeadInformation");
    }
  }
};
</script>

<style>
</style>
