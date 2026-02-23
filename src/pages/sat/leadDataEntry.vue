<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-lg">
      <!-- Header / Summary Section -->
      <q-card flat bordered class="q-mb-lg overflow-hidden">
        <q-card-section class="row items-center q-pa-lg">
           <div class="col-12 col-md-4">
              <div class="row items-center no-wrap">
                 <q-avatar color="primary-1" text-color="primary" icon="business" size="56px" rounded class="q-mr-md" />
                 <div>
                    <div class="text-h5 text-weight-bolder text-grey-9 capitalize">{{formData.shortLead.leadName}}</div>
                    <div class="text-primary text-weight-bold cursor-pointer ls-1" @click="toggleLeadInformation(formData.shortLead)">
                      #{{formData.shortLead.leadNumber}}
                    </div>
                 </div>
              </div>
           </div>
           <q-separator vertical inset class="gt-sm q-mx-lg" />
           <div class="col-12 col-md-3 q-mt-md q-mt-md-none">
              <div class="text-caption text-grey-6 uppercase ls-1 text-weight-bold">Contact</div>
              <div class="text-body1 text-grey-8">{{formData.shortLead.contactNumber}}</div>
              <div class="text-body2 text-grey-5">{{formData.shortLead.alternateContactNumber || 'No Alt Contact'}}</div>
           </div>
           <q-separator vertical inset class="gt-sm q-mx-lg" />
           <div class="col-12 col-md-3 q-mt-md q-mt-md-none">
              <div class="text-caption text-grey-6 uppercase ls-1 text-weight-bold">Location</div>
              <div class="text-body1 text-grey-8 capitalize">{{formData.shortLead.city}}, {{formData.shortLead.state}}</div>
              <div class="text-body2 text-grey-5 ellipsis">{{formData.shortLead.leadAddress || 'No Address'}}</div>
           </div>
        </q-card-section>

        <q-banner v-if="formData.shortLead.marsReason" class="bg-negative-1 text-negative q-px-lg">
           <template v-slot:avatar><q-icon name="warning" /></template>
           <span class="text-weight-bold">Remarks:</span> {{formData.shortLead.marsReason}}
        </q-banner>
      </q-card>

      <!-- Main Content Tabs/Sections -->
      <div class="row q-col-gutter-lg">
        <!-- Details Column -->
        <div class="col-12 col-lg-4">
           <div class="column q-gutter-md">
              <!-- Device Details Card -->
              <q-card flat bordered>
                <q-card-section class="bg-grey-1 border-bottom q-py-sm">
                   <div class="text-subtitle2 text-weight-bold text-grey-8 uppercase ls-1">Device & Plan</div>
                </q-card-section>
                <q-card-section class="q-pa-none">
                   <q-list separator dense>
                      <q-item class="q-py-md">
                         <q-item-section>
                            <q-item-label caption class="uppercase ls-1">Device Model</q-item-label>
                            <q-item-label class="text-weight-bold text-grey-9 text-body1">{{formData.shortLead.device.deviceName}}</q-item-label>
                         </q-item-section>
                         <q-item-section side>
                            <q-badge color="primary" class="q-pa-sm">Qty: {{formData.shortLead.deviceCount}}</q-badge>
                         </q-item-section>
                      </q-item>
                      <q-item v-for="(val, label) in { 'Plan': formData.shortLead.plan.planName, 'Setup Fees': 'Rs. ' + formData.shortLead.setupFees, 'Recurring': 'Rs. ' + formData.shortLead.recurringFees, 'Category': formData.shortLead.merchantCategory.merchantCategoryName }" :key="label">
                         <q-item-section>
                            <q-item-label caption>{{ label }}</q-item-label>
                         </q-item-section>
                         <q-item-section side class="text-weight-medium text-grey-8">{{ val }}</q-item-section>
                      </q-item>
                   </q-list>
                </q-card-section>
              </q-card>

              <!-- Payment Details Card -->
              <q-card flat bordered>
                <q-card-section class="bg-grey-1 border-bottom q-py-sm">
                   <div class="text-subtitle2 text-weight-bold text-grey-8 uppercase ls-1">Payment Info</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                   <div class="row q-col-gutter-sm items-center q-mb-md">
                      <div class="col-6">
                        <div class="text-caption text-grey-6 uppercase ls-1">Mode</div>
                        <q-chip dense color="blue-1" text-color="blue-9" class="text-weight-bold no-margin">
                           <template v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</template>
                           <template v-else-if="formData.shortLead.paymentOption == 2">Cheque</template>
                           <template v-else-if="formData.shortLead.paymentOption == 3">Swipe</template>
                           <template v-else-if="formData.shortLead.paymentOption == 4">UPI Link</template>
                        </q-chip>
                      </div>
                      <div class="col-6">
                        <div class="text-caption text-grey-6 uppercase ls-1">Reference</div>
                        <div class="text-body2 text-weight-bold text-grey-8">{{formData.shortLead.referenceNumber || 'N/A'}}</div>
                      </div>
                   </div>

                   <div v-if="formData.shortLead.paymentOption == 2">
                      <q-btn
                        v-if="formData.shortLead.paymentDocumentMimeType"
                        unelevated
                        color="primary"
                        icon="attachment"
                        label="View Document"
                        class="full-width"
                        @click="formData.shortLead.paymentDocumentMimeType.includes('pdf') ? fnPDFViewModal(formData.shortLead.paymentDocumentFile,'CHEQUE') : fnOpenPaymentChequeInfo()"
                      />
                      <div v-else class="text-negative text-caption text-center">
                        <q-icon name="error_outline" /> No document attached
                      </div>
                   </div>
                </q-card-section>
              </q-card>
           </div>
        </div>

        <!-- Documents and MDR Column -->
        <div class="col-12 col-lg-8">
           <q-card flat bordered class="q-mb-lg">
             <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="documents" label="Documents" />
                <q-tab name="mdr" label="MDR Rates" />
                <q-tab name="exceptions" label="Exceptions" v-if="formData.shortLead.leadCategory == 2" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="documents" class="q-pa-none">
                   <showMarsForm :propLeadDeatils="formData.shortLead"></showMarsForm>
                </q-tab-panel>

                <q-tab-panel name="mdr">
                   <div class="row q-col-gutter-md">
                      <div v-for="(val, label) in { 'Debit <= 2000': formData.shortLead.debitLessthanAmount, 'Debit > 2000': formData.shortLead.debitGreaterthanAmount, 'Std CC': formData.shortLead.stdCC, 'Premium CC': formData.shortLead.premiumCC, 'Amex Domestic': formData.shortLead.amexDomestic }" :key="label" class="col-6 col-md-4">
                         <div class="q-pa-md bg-grey-1 rounded-md text-center">
                            <div class="text-caption text-grey-6">{{ label }}</div>
                            <div class="text-h6 text-weight-bold text-grey-9">{{ val }}%</div>
                         </div>
                      </div>
                   </div>
                </q-tab-panel>

                <q-tab-panel name="exceptions">
                   <div class="column q-gutter-md">
                      <q-banner v-if="formData.shortLead.kyc" rounded class="bg-amber-1 text-amber-9">
                         <template v-slot:avatar><q-icon name="warning" /></template>
                         <div class="text-weight-bold">KYC Exception</div>
                         {{ formData.shortLead.reason || 'Reason not specified' }}
                      </q-banner>
                      <q-banner v-if="formData.shortLead.bankSubvention" rounded class="bg-blue-1 text-blue-9">
                         <template v-slot:avatar><q-icon name="account_balance" /></template>
                         <div class="text-weight-bold">Bank Subvention Exception</div>
                         {{ formData.shortLead.reason || 'Reason not specified' }}
                      </q-banner>
                   </div>
                </q-tab-panel>
              </q-tab-panels>
           </q-card>
        </div>
      </div>
      <!-- START >> COMPONENT: View PDF  -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      ></showPdfModalComponent>
      <!-- END >> COMPONENT: View PDF -->
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
    </div>
  </q-page>
</template>

<script>
import { not } from '@vuelidate/validators';


import { mapGetters, mapActions } from "vuex";
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
      tab: 'documents',
      propToggleLeadInformation: false,
      addtnLeadInformation: null,

      showOpenPaymentChequeDocumentInfo: false,
      PDFDetails: null,
      toggleshowPDFModal: false,
      showImage: true,
      showDocumentPreview: true,
      populatedDocumentUrl: "",
      text: "",
      fileUrl: "",
      date2: "",
      select: "",
      model: "",
      showOpenPaymentChequeInfo: false,
      checked: false,
      thumbnailsHorizontal: false,

      formData: {
        shortLead: ""
      }
    };
  },
  computed: {
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("SatLeadValidation", [
      "getShortLeadInfo",
      "getDeviceVerificationStatus"
    ])
  },
  created() {
    this.ajaxLoadLeadDataEntryInfo();
  },
  methods: {
    ...mapActions("SatLeadValidation", [
      "FETCH_SHORT_LEAD_DATA",
      "VERIFY_DEVICE_FULL_LEAD"
    ]),
    // Function to toggle lead information pop up screen
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },

    ajaxLoadLeadDataEntryInfo() {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_SHORT_LEAD_DATA(this.$route.params.id)
        .then(response => {
          this.formData.shortLead = this.getShortLeadInfo;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
      this.toggleAjaxLoadFilter = false;
    },
    fnDocumentUrl(documentUrl) {
      this.populatedDocumentUrl = documentUrl;
      this.showDocumentPreview = !this.showDocumentPreview;
    },
    fnCloseDocumentPreview() {
      this.showDocumentPreview = !this.showDocumentPreview;
    },
    fnOpenPaymentChequeInfo() {
      this.showOpenPaymentChequeInfo = !this.showOpenPaymentChequeInfo;
    },

    // Function to show PDF
    fnPDFViewModal(documentUrl, viewChequeFlag) {
      if (viewChequeFlag == "CHEQUE") {
        this.showOpenPaymentChequeDocumentInfo = !this
          .showOpenPaymentChequeDocumentInfo;
        this.PDFDetails = documentUrl;
        this.toggleshowPDFModal = !this.toggleshowPDFModal;
      } else {
        this.PDFDetails = documentUrl;
        this.toggleshowPDFModal = !this.toggleshowPDFModal;
      }
    },

    //Function to et approved by user for payment information
    fnGetVerifiedPerson() {
      let sortedArr = _.orderBy(
        this.getShortLeadInfo.leadVerificationStatus,
        ["id"],
        ["desc"]
      );
      let cookedArr = _.filter(sortedArr, {
        status: true,
        verificationType: this.$VERIFICATION_TYPE_FINANCE
      });
      return cookedArr[0].createdBy.name;
    },

    fnGetVerifiedRSMPerson() {
      let sortedArr = _.orderBy(
        this.getShortLeadInfo.leadVerificationStatus,
        ["id"],
        ["desc"]
      );
      let cookedArr = _.filter(sortedArr, {
        status: true,
        verificationType: this.$VERIFICATION_TYPE_PRICING
      });
      return cookedArr[0].createdBy.name;
    },
    // Function to open handed over image upload
    fnViewHandedOverFileImage() {
      this.$refs.handedOverImageViewer.click();
    }
  }
};
</script>

<style scoped>
.ls-1 { letter-spacing: 0.05em; }
.uppercase { text-transform: uppercase; }
.primary-1 { background-color: rgba(97, 17, 106, 0.1); }
.negative-1 { background-color: rgba(193, 0, 21, 0.05); }
.border-bottom { border-bottom: 1px solid #edf2f7; }
</style>
