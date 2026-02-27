<template>
  <q-page padding>
    <q-stepper
      flat
      ref="stepper"
      v-model="step"
      color="primary"
      animated
    >
      <q-step name="campaign" title="Edit Rental Details" icon="settings" :done="step > 'campaign'">
        {{ info.datainfo1 }}
        
        <div class="text-subtitle1 q-mb-md">
          <b>Device Count : {{ formdata1.deviceCount }}</b>
        </div>
        <div class="text-subtitle1 q-mb-md">
          <b>Reason : </b>
          <span class="text-negative">{{ getRsmReason ? getRsmReason.reason : 'NA' }}</span>
        </div>

        <div v-if="!check">
          <div class="row q-col-gutter-sm q-my-xs">
            <div class="col-xs-12 col-sm-6">
              <q-select
                disable
                v-model="formdata.plan"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                emit-value
                map-options
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select
                clearable
                :disable="((formdata.plan != (getImplementedQueue.leadInformation && getImplementedQueue.leadInformation.plan ? getImplementedQueue.leadInformation.plan.id : '')) || (getImplementedQueue.leadInformation && (getImplementedQueue.leadInformation.cmsLeadStatus == 15 || getImplementedQueue.leadInformation.cmsLeadStatus == 21)))"
                v-model="formdata.paymentOption"
                label="select Payment"
                :options="payment"
                emit-value
                map-options
                :error="v$.formdata.paymentOption.$error"
                @blur="v$.formdata.paymentOption.$touch"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                disable
                v-model="formdata.setupFees"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                disable
                v-model="formdata.recurringFees"
                label="Recurring fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-checkbox
                v-model="check"
                :disable="getImplementedQueue.leadInformation && getImplementedQueue.leadInformation.cmsLeadStatus == 15"
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>
        </div>

        <div v-else>
          <div class="row q-col-gutter-sm q-my-xs">
            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata1.plan"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                emit-value
                map-options
                @update:model-value="planSelected"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.setupFees"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.recurringFees"
                label="Recurring fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-checkbox
                v-model="check"
                :disable="getImplementedQueue.leadInformation && getImplementedQueue.leadInformation.cmsLeadStatus == 15"
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>
        </div>

        <div v-if="formdata.paymentOption == 2" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-item>
              <q-item-section>Upload the Cheque File :</q-item-section>
              <q-item-section side>
                <label class="cursor-pointer text-white q-pa-xs" style="background-color: #202c3f; border-radius: 4px;">
                  <span>Attach</span>
                  <input
                    type="file"
                    class="hidden"
                    @change="fnUploadApplicationForm"
                    accept=".png, .jpg, .pdf"
                  />
                </label>
              </q-item-section>
              <q-item-section v-if="formdata.paymentDocumentFile" class="q-ml-sm">
                {{ formdata.paymentDocumentFile }}
              </q-item-section>
            </q-item>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="formdata.paymentMadeon"
              label="*Transaction Made ON"
              placeholder="YYYY-MM-DD"
              :error="v$.formdata.paymentMadeon.$error"
              @blur="v$.formdata.paymentMadeon.$touch"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formdata.paymentMadeon" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="formdata.referenceNumber"
              label="Cheque Reference Number"
              :error="v$.formdata.referenceNumber.$error"
              @blur="v$.formdata.referenceNumber.$touch"
            />
          </div>
        </div>

        <div v-else-if="formdata.paymentOption == 1" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="formdata.referenceNumber"
              label="*NEFT Reference Number"
              :error="v$.formdata.referenceNumber.$error"
              @blur="v$.formdata.referenceNumber.$touch"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="formdata.paymentMadeon"
              label="*Transaction Made ON"
              placeholder="YYYY-MM-DD"
              :error="v$.formdata.paymentMadeon.$error"
              @blur="v$.formdata.paymentMadeon.$touch"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formdata.paymentMadeon" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div v-else-if="formdata.paymentOption == 3" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="formdata.referenceNumber"
              label="*Swipe Reference Number"
              :error="v$.formdata.referenceNumber.$error"
              @blur="v$.formdata.referenceNumber.$touch"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="formdata.paymentMadeon"
              label="*Transaction Made ON"
              placeholder="YYYY-MM-DD"
              :error="v$.formdata.paymentMadeon.$error"
              @blur="v$.formdata.paymentMadeon.$touch"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formdata.paymentMadeon" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <q-stepper-navigation>
          <div v-if="getImplementedQueue.leadInformation && formdata.plan == getImplementedQueue.leadInformation.plan.id && !check && (getImplementedQueue.leadInformation.cmsLeadStatus == 15 || getImplementedQueue.leadInformation.cmsLeadStatus == 21)">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="getImplementedQueue.leadInformation && formdata.plan == getImplementedQueue.leadInformation.plan.id && !check && (getImplementedQueue.leadInformation.cmsLeadStatus == 19 || getImplementedQueue.leadInformation.cmsLeadStatus == 17)">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)">Send to RSM</q-btn>
          </div>
          <div v-else-if="getImplementedQueue.leadInformation && formdata.plan != getImplementedQueue.leadInformation.plan.id && !check">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoFinance(formdata)">Send to Finance</q-btn>
          </div>
          <div v-else-if="check">
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)">Send to RSM</q-btn>
          </div>
          <div v-else>
            <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step name="ad_group" title="Edit KYC Fields" icon="assignment" :done="step > 'ad_group'">
        <p class="text-subtitle1"><strong>Edit KYC Details</strong></p>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.legalName" label="Legal Name" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactName" label="Contact Name" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactPhone" label="Contact Number" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              v-model="merchant.companyinformation.pan"
              label="Pan Number"
              :error="v$.merchant.companyinformation.pan.$error"
              @blur="v$.merchant.companyinformation.pan.$touch"
            />
            <div class="text-negative" v-if="error.field.merchant.companyinformation.pan.alert">
              <MarsErrorResponse :error="error.field.merchant.companyinformation.pan" />
            </div>
            <div class="text-negative q-py-xs text-caption" v-if="v$.merchant.companyinformation.pan.$error">
              <div><q-icon color="negative" name="warning" />&nbsp;Required - Provide valid PAN Number</div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              v-model="merchant.businessInformation.gstId"
              label="Gst Number"
              :error="v$.merchant.businessInformation.gstId.$error"
              @blur="v$.merchant.businessInformation.gstId.$touch"
              @change="marsRequiredFormattingofGST"
            />
            <div class="text-negative" v-if="error.field.merchant.businessInformation.gstId.alert">
              <MarsErrorResponse :error="error.field.merchant.businessInformation.gstId" />
            </div>
            <div class="text-negative q-py-xs text-caption" v-if="v$.merchant.businessInformation.gstId.$error">
              <div><q-icon color="negative" name="warning" />&nbsp;Required - Provide valid GST Number</div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              @blur="populateBankDetails"
              v-model.trim="merchant.bankInformation.bankDetails.ifsc"
              label="IFSC Code*"
              placeholder="Enter IFSC*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              upper-case
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.bankName"
              label="Bank Name*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.paymentMode"
              label="Payment mode"
              :options="paymnentModeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.accountType"
              label="Account Type"
              :options="accountTypeOptions"
              emit-value
              map-options
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.bankInformation.bankDetails.accountNumber" label="Account Numbers" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.dbaName" label="DBA Name" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.registeredAddress" label="Address" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              color="grey-9"
              v-model.trim="merchant.companyinformation.registeredCityName"
              label="City (type min 3 characters)*"
            >
              <q-autocomplete @search="residentCitySearch" @selected="registeredCitySelected" />
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              color="grey-9"
              v-model.trim="merchant.companyinformation.registeredStateName"
              label="state (type min 3 characters)*"
            >
              <q-autocomplete @search="residentStateSearch" @selected="registeredStateSelected" />
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.registeredPin" label="Pincode" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactMobile" label="Mobile Number" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.contactEmail" label="Email Id" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.statementEmail" label="Statement Email ID" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="merchant.companyinformation.businessNature" label="Nature of Business Change" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-subtitle2">Auto or Manual Settlement?</div>
            <div class="row q-gutter-md">
              <q-radio
                v-for="item in autoormanualOptions"
                :key="item.value"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.settlementType"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-subtitle2">Pre Auth Enable?</div>
            <div class="row q-gutter-md">
              <q-radio
                v-for="item in preauthOptions"
                :key="item.value"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.preAuth"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-subtitle2">Cash/POS Activation?</div>
            <div class="row q-gutter-md">
              <q-radio
                v-for="item in cashandposOptions"
                :key="item.value"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.cashAtPosEnabled"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-subtitle2">Internation Card Acceptance?</div>
            <div class="row q-gutter-md">
              <q-radio
                v-for="item in internationalcardOptions"
                :key="item.value"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.intlCardAcceptance"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="text-subtitle2">Tip Enable?</div>
            <div class="row q-gutter-md">
              <q-radio
                v-for="item in tipOptions"
                :key="item.value"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.tipEnabled"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
        </div>
        
        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="nextStep">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="$refs.stepper.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step name="mdrdetails" title="MDR Changes" icon="money" :done="step > 'mdrdetails'">
        <div class="column q-gutter-md">
          <MdrInputRow label="Domestic Debit Card below 2000" v-model="merchant.mdrPlan.domesticDebitUpTo2000" />
          <MdrInputRow label="Domestic Debit Card above 2000" v-model="merchant.mdrPlan.domesticDebitAbove2000" />
          <MdrInputRow label="Standard/Classic (1st Stab)" v-model="merchant.mdrPlan.standardOrClassic" />
          <MdrInputRow label="Premium/Platinum (2nd Stab)" v-model="merchant.mdrPlan.premiumOrPlatinum" />
          <MdrInputRow label="Super Premium/Signature (3rd Stab)" v-model="merchant.mdrPlan.superPremiumOrSignature" />
          <MdrInputRow label="Commercial/Coporate 4th Stab" v-model="merchant.mdrPlan.commercialOrCorporate" />
          <MdrInputRow label="International Debit Card" v-model="merchant.mdrPlan.internationalDebitCard" />
          <MdrInputRow label="International Credit Card" v-model="merchant.mdrPlan.internationalCreditCard" />
          <MdrInputRow label="Onus" v-model="merchant.mdrPlan.onus" />
          <MdrInputRow label="mVISA" v-model="merchant.mdrPlan.mVisa" />
          <MdrInputRow label="Master Pass" v-model="merchant.mdrPlan.masterPass" />
          <MdrInputRow label="Cash at POS" v-model="merchant.mdrPlan.cashAtPos" />
          <MdrInputRow label="Convenience fees" v-model="merchant.mdrPlan.convenientFee" />
        </div>
        
        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="$refs.stepper.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step name="zata" title="Attach Documents" icon="attach_file">
        <q-list class="q-mb-md">
          <q-item>
            <q-item-section>
              <q-item-label>Merchant type: <span class="text-weight-bold">{{ merchantTypeSelection }}</span></q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="bg-grey-4 text-weight-medium">
            <q-item-section>Application Form</q-item-section>
            <q-item-section side>
              <label class="cursor-pointer text-white q-pa-xs" style="background-color: #202c3f; border-radius: 4px;">
                <span class="text-caption">Attach</span>
                <input type="file" class="hidden" @change="fnUploadApplicationForm1" accept=".png, .jpg, .pdf" />
              </label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div v-if="getShortLeadInfo.applicationFileMimeType && getShortLeadInfo.applicationFileMimeType.includes('pdf')">
                <q-btn flat dense icon="fas fa-file-pdf" color="primary" :label="getShortLeadInfo.applicationFile" @click="fnPDFViewModal(getShortLeadInfo.applicationFile)" />
              </div>
              <div v-else-if="getShortLeadInfo.applicationFileMimeType && getShortLeadInfo.applicationFileMimeType.includes('image')">
                <div v-viewer class="hidden">
                  <img :src="GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.applicationFile" ref="handedOverImageViewer" />
                </div>
                <q-btn flat dense icon="fas fa-image" color="amber-9" :label="getShortLeadInfo.applicationFile" @click="fnViewHandedOverFileImage" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="merchantTypeSelection && getShortLeadInfoDocumentTypes">
          <div v-for="(singleDocument, idx) in getShortLeadInfoDocumentTypes.uploadedDocuments.forSingleDocument" :key="idx">
            <div v-for="(document, dIdx) in singleDocument.documents" :key="dIdx">
              <q-item class="bg-grey-4 q-pa-sm">
                <q-item-section>{{ document.subDocumentType }}</q-item-section>
                <q-item-section side>
                  <label class="cursor-pointer text-white q-pa-xs" style="background-color: #202c3f; border-radius: 4px;">
                    <span class="text-caption">Attach</span>
                    <input type="file" class="hidden" @change="fnVerificationDocumentUploadSingleUpload($event, document)" accept=".png, .jpg, .pdf" />
                  </label>
                </q-item-section>
              </q-item>
              <div v-if="getShortLeadInfo.leadDocuments && getShortLeadInfo.leadDocuments[document.documentType]">
                <div v-for="attachedSubFile in getShortLeadInfo.leadDocuments[document.documentType]" :key="attachedSubFile.id">
                  <div v-if="attachedSubFile.subDocumentType == document.subDocumentType">
                    <q-item v-for="(file, fIdx) in attachedSubFile.uploadedDocuments" :key="fIdx">
                      <q-item-section>
                        <q-btn v-if="file.mimeType.includes('pdf')" flat dense color="negative" icon="fas fa-file-pdf" :label="file.fileName" @click="fnPDFViewModal(file.fileName)" />
                        <div v-else-if="file.mimeType.includes('image')">
                          <div v-viewer class="hidden">
                            <img :src="GLOBAL_FILE_FETCH_URL + '/' + file.fileName" ref="attachedImageViewer" />
                          </div>
                          <q-btn flat dense color="amber-9" icon="fas fa-image" :label="file.fileName" @click="fnViewAttachedFileImage(fIdx)" />
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn size="xs" icon="clear" color="negative" round @click="fnDeleteAlreadyAttachedFile(file)" />
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn class="q-ml-sm" color="secondary" @click="finalFormSubmitKyc(merchant)">Submit to Mars</q-btn>
          <q-btn class="q-ml-sm" color="primary" flat @click="$refs.stepper.previous()">Back</q-btn>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, maxLength, minLength, helpers } from "@vuelidate/validators";
import _ from "lodash";
import MarsErrorResponse from "../../components/MarsErrorResponseHandler.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import MdrInputRow from "../../components/sat/MdrInputRow.vue";

const panCard = helpers.regex("panCard", /^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/);
const gstn = helpers.regex("gstn", /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/);

export default {
  name: "ChangeManagementEditDataFinanceReject",
  components: { showPdfModalComponent, MarsErrorResponse, MdrInputRow },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      step: 'campaign',
      PDFDetails: null,
      toggleshowPDFModal: false,
      check: false,
      merchantTypeSelection: "",
      stateOptions: [],
      cityOptions: [],
      dropDown: {
        deviceOptions: [],
        planOptions: [],
        leadSourceOptions: []
      },
      info: { datainfo1: "" },
      formdata: {
        paymentOption: "",
        referenceNumber: "",
        paymentMadeon: "",
        leadSourceId: "",
        deviceId: "",
        setupFees: "",
        recurringFees: "",
        verifiedCmsPricingStatus: 1,
        plan: "",
        planCode: "",
        contactName: "",
        contactNumber: "",
        alternateContactNumber: "",
        city: "",
        device: "",
        deviceCount: "",
        leadAddress: "",
        latitude: "",
        longitude: "",
        state: "",
        leadCategory: 2,
        kyc: false,
        verifiedBanksubventionStatus: "",
        reason: "",
        merchantCategory: "",
        pricing: 1,
        leadStatus: "",
        submittoRSMDate: "",
        posIncentive: "",
        posEnable: "",
        leadName: "",
        paymentDocumentFile: "",
        paymentDocumentMimeType: ""
      },
      formdata1: {
        deviceCount: "",
        plan: "",
        setupFees: "",
        recurringFees: ""
      },
      merchant: {
        salesInformation: { institutionCode: "" },
        companyinformation: {
          pan: "",
          contactPhone: "",
          legalName: "",
          dbaName: "",
          registeredAddress: "",
          registeredPin: "",
          registeredCityRefCode: "",
          registeredStateRefCode: "",
          registeredCityName: "",
          registeredStateName: "",
          businessNature: "",
          contactMobile: "",
          contactName: "",
          statementEmail: "",
          applicationNumber: ""
        },
        bankInformation: {
          bankDetails: {
            accountNumber: "",
            ifsc: "",
            bankName: "",
            paymentMode: "",
            accountType: ""
          }
        },
        businessInformation: { gstId: "" },
        kyc: { documents: [] },
        paymentDetails: {
          cashAtPosEnabled: "",
          intlCardAcceptance: "",
          preAuth: "",
          rentalPlanCode: "",
          settlementType: "",
          tipEnabled: ""
        },
        mdrPlan: this.initialMdrPlan()
      },
      error: {
        field: {
          merchant: {
            businessInformation: { gstId: { alert: false, issue: "", value: "" } },
            companyinformation: { pan: { alert: false, issue: "", value: "" } }
          }
        }
      },
      payment: [
        { label: "Cheque", value: 2 },
        { label: "Swipe", value: 3 },
        { label: "Neft", value: 1 }
      ],
      autoormanualOptions: [
        { label: "Auto Settlement", value: "A" },
        { label: "Manual Settlement", value: "M" }
      ],
      preauthOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" },
      ],
      cashandposOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" }
      ],
      internationalcardOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" }
      ],
      tipOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" }
      ],
      paymnentModeOptions: [
        { label: "Direct credit", value: "D" },
        { label: "NEFT", value: "N" }
      ],
      accountTypeOptions: [
        { label: "Saving account", value: "S" },
        { label: "Current account", value: "C" },
        { label: "Overdraft account", value: "O" },
        { label: "Cash credit account", value: "R" }
      ]
    };
  },
  computed: {
    ...mapGetters("SatLeadValidation", ["getShortLeadInfo", "getShortLeadInfoDocumentTypes"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("plan", ["getActivePlan"]),
    ...mapGetters("GetMarsData", ["getAllMarsData", "getImplementedQueue"]),
    ...mapGetters("mars_city", ["cityFromMars"]),
    ...mapGetters("mars_state", ["stateFromMars"]),
    ...mapGetters("mars_ifsc", ["ifscFromMars"]),
    getRsmReason() {
      if (!this.getImplementedQueue || !this.getImplementedQueue.leadInformation) return null;
      return _.find(this.getImplementedQueue.leadInformation.leadVerificationStatus, oo => oo.verificationType == 6 && !oo.status);
    }
  },
  validations() {
    return {
      formdata: {
        referenceNumber: { required: requiredIf(() => this.formdata.paymentOption) },
        paymentOption: { required },
        paymentMadeon: { required: requiredIf(() => this.formdata.paymentOption) }
      },
      merchant: {
        companyinformation: {
          pan: { required, panCard, maxLength: maxLength(10), minLength: minLength(10) }
        },
        businessInformation: {
          gstId: { required, gstn, maxLength: maxLength(15), minLength: minLength(15) }
        }
      }
    };
  },
  created() {
    this.ajaxLoadDataForDeviceTypeTable1();
    this.ajaxLoadMarsData();
    this.ajaxLoadShortLeadInfoForDocumentTypes();
    this.fetchAllDropdownValuesFromMARSapi();
  },
  methods: {
    ...mapActions("SatLeadValidation", ["FETCH_SHORT_LEAD_DATA", "FEED_HAND_OVER_TO_SAT_DOCUMENT", "FEED_CHEQUE_FORM", "FEED_FULL_APPLICATION_FORM", "DELETE_DOCUMENT_FROM_BY_SAT", "FETCH_LEAD_DOCUMENT_TYPE_DATA"]),
    ...mapActions("mars_city", ["CITY_FROM_MARS"]),
    ...mapActions("mars_state", ["STATE_FROM_MARS"]),
    ...mapActions("mars_ifsc", ["IFSC_FROM_MARS"]),
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("GetMarsData", ["FETCH_MARS_DATA", "IMPLEMENTED_QUEUE"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
    ...mapActions("SendTORSMCMS", ["SEND_TO_RSM_CMS"]),
    ...mapActions("CMS_EDIT_MDR", ["CMS_EDIT_MERCHANT", "CMS_EDIT_TERMINAL", "CMS_STATUS_CHANGE"]),

    initialMdrPlan() {
      const keys = ["domesticDebitUpTo2000", "domesticDebitAbove2000", "standardOrClassic", "premiumOrPlatinum", "superPremiumOrSignature", "commercialOrCorporate", "internationalDebitCard", "internationalCreditCard", "onus", "mVisa", "masterPass", "cashAtPos", "convenientFee"];
      let plan = { code: 1 };
      keys.forEach(k => { plan[k] = { fixed: 0.0, percentage: 0.0, minimum: 0.0 }; });
      return plan;
    },
    planSelected(val) {
      const plan = _.find(this.dropDown.planOptions, o => o.value === val);
      if (plan) this.formdata1.planCode = plan.label;
    },
    async sendtoFinance(request) {
      const isCorrect = await this.v$.formdata.$validate();
      if (!isCorrect) {
        this.$q.notify("Please review fields again.");
        return;
      }
      if (this.formdata.paymentOption == 2 && !this.formdata.paymentDocumentFile) {
        this.$q.notify({ color: "amber", position: "bottom", message: "Please attach the Cheque File", icon: "attachment" });
        return;
      }
      this.executeSendToRSM(request, false);
    },
    sendtoNH(request) {
      this.executeSendToRSM(request, true);
    },
    executeSendToRSM(request, isRSM) {
      let params = { ...request };
      params.leadCategory = this.check ? 2 : 1;
      params.pricing = this.check ? 1 : 0;
      params.plan1 = request.plan;

      this.SEND_TO_RSM_CMS({ url: { id: this.getShortLeadInfo.id }, params })
        .then(res => {
          this.$q.notify({ color: "positive", position: "bottom", message: res.data.message, icon: "thumb_up" });
          this.$router.push("/sat/change/management");
        })
        .catch(err => {
          this.$q.notify({ color: "negative", position: "bottom", message: err.data.message, icon: "thumb_down" });
        });
    },
    fnUploadApplicationForm(event) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Uploading file .." });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("fileNameOriginal", "Cheque");
      this.FEED_CHEQUE_FORM({ files: formData, fileNameOriginal: "Cheque" })
        .then(res => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", position: "bottom", message: "File Successfully Uploaded - " + res.fileName, icon: "thumb_up" });
          this.formdata.paymentDocumentFile = res.fileName;
          this.formdata.paymentDocumentMimeType = res.mimeType;
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Failed to upload document", icon: "thumb_down" });
        });
    },
    ajaxLoadMarsData() {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.IMPLEMENTED_QUEUE(this.$route.params.id).then(() => {
        const lead = this.getImplementedQueue.leadInformation;
        this.FETCH_SHORT_LEAD_DATA(lead.id).then(() => {
          this.marsInfo();
          this.formdata = { ...this.formdata, ...lead, plan: lead.plan.id, planCode: lead.plan.planName };
          this.formdata1 = { ...lead, plan: lead.plan.id, planCode: lead.plan.planName };
          this.merchantTypeSelection = lead.merchantType.merchantTypeName;
          this.$q.loading.hide();
        });
      }).catch(() => { this.$q.loading.hide(); });
    },
    marsInfo() {
      this.FETCH_MARS_DATA(this.getImplementedQueue.leadInformation.id).then(() => {
        const mars = this.getAllMarsData;
        this.merchant.companyinformation = { ...this.merchant.companyinformation, ...mars.companyInformation, applicationNumber: mars.salesInformation.applicationNumber };
        this.merchant.bankInformation.bankDetails = { ...mars.bankInformation.bankDetails };
        this.merchant.paymentDetails = { ...mars.paymentDetails };
        this.merchant.salesInformation.institutionCode = mars.salesInformation.institutionCode;
      });
    },
    fnVerificationDocumentUploadSingleUpload(event, document) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Uploading file .." });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      this.FEED_HAND_OVER_TO_SAT_DOCUMENT({ files: formData, leadId: this.getShortLeadInfo.id, documentId: document.id })
        .then(() => {
          this.FETCH_SHORT_LEAD_DATA(this.getShortLeadInfo.id);
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Failed to upload document", icon: "thumb_down" });
        });
    },
    async nextStep() {
      const isCorrect = await this.v$.merchant.$validate();
      if (!isCorrect) {
        this.$q.notify("Please review the KYC information fields again.");
      } else {
        this.$refs.stepper.next();
      }
    },
    fnPDFViewModal(url) {
      this.PDFDetails = url;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnViewHandedOverFileImage() { this.$refs.handedOverImageViewer.click(); },
    fnViewAttachedFileImage(idx) { this.$refs.attachedImageViewer[idx].click(); },
    marsRequiredFormattingofGST(val) { this.merchant.businessInformation.gstId = val === "" ? null : val; },
    populateBankDetails() {
      this.IFSC_FROM_MARS(this.merchant.bankInformation.bankDetails.ifsc).then(res => {
        if (res.status == 200) this.merchant.bankInformation.bankDetails.bankName = this.ifscFromMars.bankName;
        else {
          this.$q.notify({ color: "negative", position: "bottom-left", message: "Invalid IFSC code", icon: "clear" });
          this.merchant.bankInformation.bankDetails.ifsc = "";
          this.merchant.bankInformation.bankDetails.bankName = "";
        }
      });
    },
    residentCitySearch(terms, done) { done(this.COMMON_FILTER_FUNCTION(this.cityOptions, terms)); },
    registeredCitySelected(item) {
      this.merchant.companyinformation.registeredCityName = item.label;
      this.merchant.companyinformation.registeredCityRefCode = item.value;
    },
    residentStateSearch(terms, done) { done(this.COMMON_FILTER_FUNCTION(this.stateOptions, terms)); },
    registeredStateSelected(item) {
      this.merchant.companyinformation.registeredStateName = item.label;
      this.merchant.companyinformation.registeredStateRefCode = item.value;
    },
    COMMON_FILTER_FUNCTION(arr, terms) {
      return _.filter(arr, o => o.label.toLowerCase().includes(terms.toLowerCase()) || o.value.toString().includes(terms.toString()));
    },
    fetchAllDropdownValuesFromMARSapi() {
      this.CITY_FROM_MARS().then(() => {
        this.cityOptions = this.cityFromMars.items.map(o => ({ label: o.name, value: o.code }));
      });
      this.STATE_FROM_MARS().then(() => {
        this.stateOptions = this.stateFromMars.items.map(o => ({ label: o.name, value: o.code }));
      });
    },
    ajaxLoadShortLeadInfoForDocumentTypes() {
      this.FETCH_LEAD_DOCUMENT_TYPE_DATA().then(() => {
        this.fnGetMerchantTypeValue(this.getImplementedQueue.leadInformation.merchantType.merchantTypeName);
      });
    },
    fnGetMerchantTypeValue(val) {
      let cat = _.find(this.getShortLeadInfoDocumentTypes, o => o.merchantType === val);
      let arr = { forSingleDocument: [], forMutipleDocument: [] };
      let leadDocs = this.getShortLeadInfo.leadDocuments;
      cat.documentsApplicable.forEach(doc => {
        if (doc.viewType == 1) arr.forSingleDocument.push(doc);
        else {
          if (doc.documentType in leadDocs) {
            let found = _.find(doc.documents, o => leadDocs.hasOwnProperty(o.documentType) && (o.subDocumentType == leadDocs[o.documentType][0].subDocumentType || leadDocs[o.documentType][0].documentType == leadDocs[o.documentType][0].subDocumentType));
            doc.subDocumentTypeSelection = found || 0;
          } else doc.subDocumentTypeSelection = 0;
          arr.forMutipleDocument.push(doc);
        }
      });
      this.getShortLeadInfoDocumentTypes.uploadedDocuments = arr;
    },
    finalFormSubmitKyc(req) {
      this.$q.loading.show({ message: "Submitting..." });
      this.CMS_EDIT_MERCHANT({ url: { id: this.getImplementedQueue.mid }, params: { merchant: req } })
        .then(() => {
          this.CMS_STATUS_CHANGE(this.getImplementedQueue.leadInformation.id);
          this.$q.notify({ color: "positive", position: "bottom", message: "Merchant Details successfully Updated" });
          this.$router.push("/sat/change/management");
          this.$q.loading.hide();
        })
        .catch(err => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: err.data.message });
        });
    }
  }
};
</script>

<style scoped>
.hidden { display: none; }
</style>
