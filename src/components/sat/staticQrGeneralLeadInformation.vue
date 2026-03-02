<template>
  <div>
    <q-dialog v-model="opened" class="q-mt-lg capitalize" @hide="emitToggleRemarks" @escape-key="emitToggleRemarks"
      :content-css="{ minWidth: '30vw', padding: '20px' }">
      <div class="row items-center bottom-border q-py-sm">
        <div class="col"> QR Lead Information</div>
        <div class="col-auto">
          <q-btn round size="sm" @click="emitToggleRemarks" outline color="dark" icon="clear" />
        </div>
      </div>

      <!-- START >> Lead information -->
      <div class="row">
        <div>
          <q-scroll-area style="width: 400px; height: 375px;">
            <q-list multiline separator class="text-body1">
              <q-item multiline>
                <q-item-section label="Merchant Name"
                  :caption="propLeadInformation.merchantName == null ? 'NA' : propLeadInformation.merchantName " />
              </q-item>
              <q-item multiline>
                <q-item-section label="Address"
                  :caption="propLeadInformation.contactAddress == null ? 'NA' : propLeadInformation.contactAddress " />
              </q-item>
              <q-item multiline>
                <q-item-section label="SO Name"
                  :caption="propLeadInformation.createdBy == null ? 'NA' : propLeadInformation.createdBy.name" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Source" v-if="'leadSource' in propLeadInformation"
                  :caption="propLeadInformation.leadSource.sourceName" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Contact Name" :caption="propLeadInformation.contactName" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Contact Number" :caption="propLeadInformation.contactNumber" />
              </q-item>

              <q-item multiline>
                <q-item-section label="Contact Email" :caption="propLeadInformation.contactEmail || 'NA'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Bank Name"
                  :caption="propLeadInformation.bankName == null ? 'NA' : propLeadInformation.bankName" />
              </q-item>
              <q-item multiline>
                <q-item-section label="QR Lead Number" :caption="propLeadInformation.qrLeadNumber == null ? 'NA' : propLeadInformation.qrLeadNumber" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Merchant Industry" :caption="propLeadInformation.merchantIndustry == null ? 'NA' : propLeadInformation.merchantIndustry.industryName" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Plan" :caption="propLeadInformation.plan == null ? 'NA' : propLeadInformation.plan.planName" />
              </q-item>
              <q-item multiline>
                <q-item-section label="SetUp Fees" :caption="propLeadInformation.setupFees == null ? 'NA' : propLeadInformation.setupFees" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Recurring Fees" :caption="propLeadInformation.recurringFees == null ? 'NA' : propLeadInformation.recurringFees" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Merchant Type " :caption="propLeadInformation.qrMerchantType == null ? 'NA' : propLeadInformation.qrMerchantType.qrMerchantType" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Small Merchant < 2000 % debit Card" :caption="propLeadInformation.smallMerchantLessThanTwoDebit == null ? 'NA' : propLeadInformation.smallMerchantLessThanTwoDebit + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Small Merchant > 2000 % debit Card " :caption="propLeadInformation.smallMerchantGreaterThanTwoDebit == null ? 'NA' : propLeadInformation.smallMerchantGreaterThanTwoDebit + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Small Merchant < 2000 % credit and prepaid card" :caption="propLeadInformation.smallMerchantLessThanTwoCreditAndPrepaid == null ? 'NA' : propLeadInformation.smallMerchantLessThanTwoCreditAndPrepaid + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Small Merchant > 2000 % credit and prepaid card" :caption="propLeadInformation.smallMerchantGreaterThanTwoCreditAndPrepaid == null ? 'NA' : propLeadInformation.smallMerchantGreaterThanTwoCreditAndPrepaid + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Large Merchant < 2000 % debit Card" :caption="propLeadInformation.largeMerchantLessThanTwoDebit == null ? 'NA' : propLeadInformation.largeMerchantLessThanTwoDebit + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Large Merchant > 2000 % debit Card" :caption="propLeadInformation.largeMerchantGreaterThanTwoDebit == null ? 'NA' : propLeadInformation.largeMerchantGreaterThanTwoDebit + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Large Merchant < 2000 % credit and prepaid card " :caption="propLeadInformation.largeMerchantLessThanTwoCreditandPrepaid == null ? 'NA' : propLeadInformation.largeMerchantLessThanTwoCreditandPrepaid + '%'" />
              </q-item>
              <q-item multiline>
                <q-item-section label="Large Merchant > 2000 % credit and prepaid card" :caption="propLeadInformation.largeMerchantGreaterThanTwoCreditandPrepaid == null ? 'NA' : propLeadInformation.largeMerchantGreaterThanTwoCreditandPrepaid + '%'" />
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
      <!-- END >> Lead information -->
    </q-dialog>
  </div>
</template>

<script>
import { and } from '@vuelidate/validators';
import { mapGetters, mapActions } from 'vuex'
import { useVuelidate } from "@vuelidate/core";
export default {
  props: ['leadInformation', 'propToggleLeadInformationPop'],
  data () {
    return {
      search: '',
      propLeadInformation: {},
      opened: this.propToggleLeadInformationPop
    }
  },
  created () {
    this.ajaxLoadShortLeadInfo()
  },
  computed: {
    ...mapGetters('iciciStaticQr', ['getAllStaticQrShortLeadDatas'])
  },
  // beforeMount(){
  //   console.log("leadDetails ---------->",JSON.stringify(this.leadInformation));
  // },

  methods: {
    ...mapActions('iciciStaticQr', ['FETCH_STATIC_QR_SHORT_LEAD_DATA']),
    // Function to load all lead details
    ajaxLoadShortLeadInfo () {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      })
      this.FETCH_STATIC_QR_SHORT_LEAD_DATA(
        this.leadInformation.leadId
      )
        .then(response => {
          this.propLeadInformation = this.getAllStaticQrShortLeadDatas
          this.$q.loading.hide()
        })
        .catch(() => {
          this.$q.loading.hide()
        })
    },
    emitToggleRemarks () {
      this.$emit('closeLeadInformation')
    }
  }
}
</script>

<style>

</style>
