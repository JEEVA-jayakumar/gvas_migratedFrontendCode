<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-card shadow-1 bg-white border-radius-16 overflow-hidden fade-up">
      <!-- Premium Header: Merchant Summary -->
      <div class="q-pa-xl border-bottom bg-white">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-md-3 col-sm-6">
            <div class="text-overline text-purple-9 text-weight-bold">Merchant Identity</div>
            <div class="text-h5 text-weight-bold text-slate-900 q-mt-xs capitalize">{{formData.shortLead.leadName}}</div>
            <div class="cursor-pointer q-mt-sm" @click="toggleLeadInformation(formData.shortLead)">
               <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold q-px-md q-py-xs">
                 # {{formData.shortLead.leadNumber}}
               </q-badge>
            </div>
          </div>

          <div class="col-md-3 col-sm-6">
            <div class="text-overline text-slate-400 text-weight-bold">Primary Contact</div>
            <div class="text-subtitle1 text-slate-700 text-weight-bold q-mt-xs">{{formData.shortLead.contactNumber}}</div>
            <div class="text-caption text-slate-400">{{formData.shortLead.alternateContactNumber || 'No Alt Number'}}</div>
          </div>

          <div class="col-md-3 col-sm-6">
            <div class="text-overline text-slate-400 text-weight-bold">Business Location</div>
            <div class="text-subtitle1 text-slate-700 q-mt-xs capitalize line-clamp-1" v-if="formData.shortLead.leadAddress">
              {{formData.shortLead.leadAddress}}
            </div>
            <div class="text-caption text-slate-500 capitalize">{{formData.shortLead.city}}, {{formData.shortLead.state}}</div>
          </div>

          <div class="col-md-3 col-sm-6">
            <div class="text-overline text-slate-400 text-weight-bold">Operational Status</div>
            <div class="q-mt-xs">
              <q-badge
                v-if="formData.shortLead.marsReason"
                color="red-1"
                text-color="red-9"
                class="q-pa-sm text-weight-bold rounded-8"
              >
                <q-icon name="warning" class="q-mr-xs" />
                {{formData.shortLead.marsReason}}
              </q-badge>
              <q-badge v-else color="green-1" text-color="green-9" class="q-pa-sm text-weight-bold rounded-8">
                <q-icon name="check_circle" class="q-mr-xs" />
                No Active Remarks
              </q-badge>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Tabs/Expansion -->
      <div class="q-pa-lg">
        <q-list class="premium-expansion-list">
          <!-- Lead Configuration Details -->
          <q-expansion-item
            default-opened
            icon="settings_suggest"
            label="Service & Billing Configuration"
            header-class="text-h6 text-slate-700 q-py-lg"
            class="premium-expansion-item q-mb-md"
          >
            <div class="q-pa-lg">
              <div class="row q-col-gutter-lg">
                <!-- Device Details -->
                <div class="col-md-3">
                  <q-card flat class="premium-inner-card full-height">
                    <div class="q-pa-md bg-slate-50 border-bottom flex items-center">
                      <q-icon name="devices" color="purple-9" size="20px" class="q-mr-sm" />
                      <div class="text-weight-bold text-slate-700">Device Selection</div>
                    </div>
                    <div class="q-pa-md">
                      <div class="text-h4 text-weight-bold text-slate-900 q-mb-xs">{{formData.shortLead.deviceCount}}</div>
                      <div class="text-caption text-purple-9 text-weight-bold uppercase letter-spacing-1">{{formData.shortLead.device.deviceName}}</div>

                      <q-list class="q-mt-lg dense-info-list">
                        <q-item dense class="q-px-none">
                          <q-item-section class="text-slate-400">Plan</q-item-section>
                          <q-item-section side class="text-slate-700 text-weight-bold">{{formData.shortLead.plan.planName}}</q-item-section>
                        </q-item>
                        <q-item dense class="q-px-none">
                          <q-item-section class="text-slate-400">Setup</q-item-section>
                          <q-item-section side class="text-slate-700 text-weight-bold">₹{{formData.shortLead.setupFees}}</q-item-section>
                        </q-item>
                        <q-item dense class="q-px-none">
                          <q-item-section class="text-slate-400">Recurring</q-item-section>
                          <q-item-section side class="text-slate-700 text-weight-bold">₹{{formData.shortLead.recurringFees}}</q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </q-card>
                </div>

                <!-- Exception History -->
                <div class="col-md-3">
                   <q-card flat class="premium-inner-card full-height">
                    <div class="q-pa-md bg-slate-50 border-bottom flex items-center">
                      <q-icon name="rule" color="amber-9" size="20px" class="q-mr-sm" />
                      <div class="text-weight-bold text-slate-700">Exception Profiling</div>
                    </div>
                    <div class="q-pa-md">
                       <template v-if="formData.shortLead.leadCategory == 2">
                         <div v-if="formData.shortLead.kyc" class="q-mb-md">
                           <div class="text-caption text-weight-bold text-blue-7 uppercase">KYC Exception</div>
                           <div class="text-slate-600 text-caption">{{formData.shortLead.reason || 'Manual review required'}}</div>
                         </div>
                         <div v-if="formData.shortLead.bankSubvention" class="q-mb-md">
                           <div class="text-caption text-weight-bold text-green-7 uppercase">Bank Subvention</div>
                           <div class="text-slate-600 text-caption">{{formData.shortLead.reason || 'Channel approval pending'}}</div>
                         </div>
                         <div v-if="formData.shortLead.pricing">
                           <div class="text-caption text-weight-bold text-red-5 uppercase">Pricing Exception</div>
                           <div class="text-slate-600 text-caption">{{formData.shortLead.reason || 'Commercial override'}}</div>
                         </div>
                       </template>
                       <div v-else class="flex flex-center full-height opacity-50 q-pa-md text-center">
                          <q-icon name="verified_user" color="green-7" size="32px" />
                          <div class="text-caption q-mt-sm">Standard Lead Profile - No Exceptions</div>
                       </div>
                    </div>
                  </q-card>
                </div>

                <!-- Payment Info -->
                <div class="col-md-3">
                   <q-card flat class="premium-inner-card full-height">
                    <div class="q-pa-md bg-slate-50 border-bottom flex items-center">
                      <q-icon name="account_balance_wallet" color="green-7" size="20px" class="q-mr-sm" />
                      <div class="text-weight-bold text-slate-700">Financial Setup</div>
                    </div>
                    <div class="q-pa-md">
                      <div class="text-caption text-slate-400">Payment Channel</div>
                      <div class="text-h6 text-slate-900 q-mb-md">
                         <template v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT Transfer</template>
                         <template v-else-if="formData.shortLead.paymentOption == 2">Physical Cheque</template>
                         <template v-else-if="formData.shortLead.paymentOption == 3">Card Swipe</template>
                         <template v-else-if="formData.shortLead.paymentOption == 4">UPI Digital Link</template>
                      </div>

                      <div class="text-caption text-slate-400 q-mb-xs">Reference Number</div>
                      <div class="text-weight-bold text-slate-700 q-mb-lg">{{formData.shortLead.referenceNumber || 'Awaiting ID'}}</div>

                      <template v-if="formData.shortLead.paymentOption == 2">
                        <q-btn
                          unelevated
                          color="slate-900"
                          icon="visibility"
                          label="Review Document"
                          class="full-width premium-btn"
                          size="sm"
                          @click="formData.shortLead.paymentDocumentMimeType?.includes('pdf') ? fnPDFViewModal(formData.shortLead.paymentDocumentFile,'CHEQUE') : fnOpenPaymentChequeInfo(formData.shortLead.paymentDocumentFile)"
                        />
                      </template>
                    </div>
                  </q-card>
                </div>

                <!-- MDR Stack -->
                <div class="col-md-3">
                   <q-card flat class="premium-inner-card full-height">
                    <div class="q-pa-md bg-slate-50 border-bottom flex items-center">
                      <q-icon name="percent" color="blue-7" size="20px" class="q-mr-sm" />
                      <div class="text-weight-bold text-slate-700">Commercial Stack (MDR)</div>
                    </div>
                    <div class="q-pa-none">
                      <q-list dense separator class="mdr-list">
                        <q-item class="q-py-sm">
                          <q-item-section class="text-slate-500">Debit (≤ 2k)</q-item-section>
                          <q-item-section side class="text-weight-bold text-slate-900">{{formData.shortLead.debitLessthanAmount}}%</q-item-section>
                        </q-item>
                        <q-item class="q-py-sm">
                          <q-item-section class="text-slate-500">Credit (Std)</q-item-section>
                          <q-item-section side class="text-weight-bold text-slate-900">{{formData.shortLead.stdCC}}%</q-item-section>
                        </q-item>
                        <q-item class="q-py-sm">
                          <q-item-section class="text-slate-500">Amex (Dom)</q-item-section>
                          <q-item-section side class="text-weight-bold text-slate-900">{{formData.shortLead.amexDomestic}}%</q-item-section>
                        </q-item>
                        <q-item class="q-py-sm bg-purple-50" v-if="formData.shortLead.posEnable">
                          <q-item-section class="text-purple-9 text-weight-bold">Cash@POS</q-item-section>
                          <q-item-section side><q-icon name="check_circle" color="purple-9" /></q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </q-expansion-item>

          <!-- Digital Assets/Documents -->
          <q-expansion-item
            icon="folder_zip"
            label="Digital Verification Assets"
            header-class="text-h6 text-slate-700 q-py-lg"
            class="premium-expansion-item"
          >
            <div class="q-pa-lg">
               <showMarsForm :propLeadDeatils="formData.shortLead"></showMarsForm>
            </div>
          </q-expansion-item>
        </q-list>
      </div>

      <!-- Action Footer -->
      <div class="q-pa-lg border-top bg-slate-50 flex justify-end gap-md">
         <q-btn flat color="slate-500" label="Return to Queue" to="/sat/lead/validation" icon="arrow_back" no-caps />
         <q-btn unelevated color="purple-9" label="Validate & Continue" class="premium-btn-primary q-px-xl" no-caps icon-right="chevron_right" />
      </div>
    </div>

    <!-- Modals -->
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />

    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Image Preview Modal -->
    <q-dialog v-model="showOpenPaymentChequeInfo">
       <q-card style="width: 700px; max-width: 90vw; border-radius: 16px;">
          <div class="q-pa-md border-bottom flex justify-between items-center">
             <div class="text-weight-bold">Payment Document Preview</div>
             <q-btn flat round icon="close" v-close-popup />
          </div>
          <q-card-section class="q-pa-md flex flex-center bg-slate-100">
             <img :src="GLOBAL_FILE_FETCH_URL+ '/'+formData.shortLead.paymentDocumentFile" style="max-width:100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1)" />
          </q-card-section>
       </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import showMarsForm from "../../components/sat/showMarsFormComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "leadDataEntry",
  components: {
    generalLeadInformation,
    showPdfModalComponent,
    showMarsForm
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      showOpenPaymentChequeDocumentInfo: false,
      PDFDetails: null,
      toggleshowPDFModal: false,
      showOpenPaymentChequeInfo: false,
      formData: { shortLead: "" }
    };
  },
  computed: {
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("SatLeadValidation", ["getShortLeadInfo"])
  },
  created() {
    this.ajaxLoadLeadDataEntryInfo();
  },
  methods: {
    ...mapActions("SatLeadValidation", ["FETCH_SHORT_LEAD_DATA"]),
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    },
    ajaxLoadLeadDataEntryInfo() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching deep lead intelligence..." });
      this.FETCH_SHORT_LEAD_DATA(this.$route.params.id)
        .then(() => {
          this.formData.shortLead = this.getShortLeadInfo;
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },
    fnOpenPaymentChequeInfo() { this.showOpenPaymentChequeInfo = !this.showOpenPaymentChequeInfo; },
    fnPDFViewModal(documentUrl, viewChequeFlag) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    }
  }
};
</script>

<style lang="scss" scoped>
.premium-inner-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  &:hover {
    border-color: #61116a;
    box-shadow: 0 4px 12px rgba(97, 17, 106, 0.05);
  }
}

.premium-expansion-item {
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  background: white;
  ::v-deep(.q-item) { border-radius: 12px; }
}

.mdr-list {
  .q-item {
    border-bottom: 1px solid #f8fafc;
    &:last-child { border-bottom: none; }
  }
}

.letter-spacing-1 { letter-spacing: 0.1em; }
.bg-purple-50 { background-color: #faf5ff; }
.rounded-8 { border-radius: 8px; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>
