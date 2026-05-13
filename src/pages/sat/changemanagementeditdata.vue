<template>
  <q-page padding>
    <q-stepper flat ref="stepper" v-model="step" color="primary">
      <q-step default name="campaign" title="Edit Rental Details">
        {{ this.info.datainfo1 }}

        <b>Edit Rental Details</b>
        <br />
        <br />
        <b>Device Count : {{ formdata.deviceCount }}</b>

        <!-- {{this.getMidBasedList.tids}} -->
        <!-- {{formdata.mid}} -->
        <br />
        <br />
        <div>
          <div class="row q-col-gutter-sm q-my-xs" v-if="check == false">
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input disable
                v-model="formdata.deviceCount"
                class="no-margin"
                label="Device Count"
              />
            </div>-->
            <!-- data: {{getRsmReason.reason}} -->
            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                emit-value
                map-options
                :disable="
                  this.getImplementedQueue.leadInformation.cmsLeadStatus == 15
                "
                @update:model-value="fnPlan1"
              />
              <!-- @update:model-value="planSelected" -->
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select
                clearable
                :disable="
                  formdata.plan !=
                    this.getImplementedQueue.leadInformation.plan.id ||
                  this.getImplementedQueue.leadInformation.cmsLeadStatus ==
                    15 ||
                  this.getImplementedQueue.leadInformation.cmsLeadStatus == 21
                "
                @blur="v$.formdata?.paymentOption?.$touch"
                :error="v$.formdata?.paymentOption?.$error"
                v-model="formdata.paymentOption"
                class="no-margin"
                label="select Payment"
                :options="payment"
                emit-value
                map-options
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                disable
                v-model="formdata.setupFees"
                class="no-margin"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                disable
                v-model="formdata.recurringFees"
                class="no-margin"
                label="Recurring fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select
                @blur="v$.formdata?.cmsCategoryType?.$touch"
                :error="v$.formdata?.cmsCategoryType?.$error"
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.cmsCategoryType"
                label="Category Type*"
                emit-value
                map-options
                v-if="this.getAllMarsData.mdrPlan.code != 8 || this.getAllMarsData.mdrPlan.code != 9"
                :disable="
                  this.getAllMarsData.mdrPlan.code == 8 ||
                  this.getAllMarsData.mdrPlan.code == 9
                "
                :options="cmsCategoryTypeOptions"
              />
              <div
                class="text-negative"
                v-if="error.formdata.cmsCategoryType.alert"
              ></div>
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Payment Ref Number!(this.getAllMarsData.mdrPlan.code) ||" />
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Amount" />
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <!-- <p class="caption">Pricing Exception</p> -->
              <q-checkbox
                v-model="check"
                :disable="
                  this.getImplementedQueue.leadInformation.cmsLeadStatus == 15
                "
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-my-xs" v-else>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input disable
                v-model="formdata1.deviceCount"
                class="no-margin"
                label="Device Count"
              />
            </div>-->

            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata1.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                emit-value
                map-options
                @update:model-value="fnPlan"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-select clearable
               @blur="v$.formdata?.paymentOption?.$touch"
              :error="v$.formdata?.paymentOption?.$error"
              v-model="formdata.paymentOption"
                class="no-margin"
                label="select Payment"
                :options="payment"
              />
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.setupFees"
                class="no-margin"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.recurringFees"
                class="no-margin"
                label="Recurring fees"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Payment Ref Number" />
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Amount" />
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <!-- <p class="caption">Pricing Exception</p> -->
              <q-checkbox
                v-model="check"
                :disable="
                  this.getImplementedQueue.leadInformation.cmsLeadStatus == 15
                    ? false
                    : true
                "
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>
        </div>
        <div v-if="formdata.paymentOption == 2" class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <p></p>
            <q-item>
              <q-item-section>Upload the Cheque File :</q-item-section>
              <q-item-section side>
              <label
                class="cursor-pointer text-white q-pa-xs"
                style="background-color: #202c3f"
              >
                <span>Attach</span>
                <input
                  type="file"
                  name="file"
                  @change="fnUploadApplicationForm($event)"
                  accept=".png, .jpg, .pdf"
                />
              </label>
              </q-item-section>
              &nbsp;{{ this.formdata.paymentDocumentFile }}
            </q-item>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata?.paymentMadeon?.$touch"
              :error="v$.formdata?.paymentMadeon?.$error"
              v-model="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              placeholder="Transaction Made ON"
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
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';

import { LocalStorage } from "quasar";
import _ from "lodash";
global.jQuery = require("jquery");
var $ = global.jQuery;
window.$ = $;

import {
  required,
  minLength,
  maxLength,
} from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

import MarsErrorResponse from "../../components/MarsErrorResponseHandler.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";

import { helpers } from "@vuelidate/validators";
const panCard = helpers.regex(
  "panCard",
  /^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/
);

const gstn = helpers.regex(
  "gstn",
  /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
);
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: "changemanagementeditdata",
  components: {
    showPdfModalComponent,
    MarsErrorResponse,
  },
  data() {
    return {
      step: "campaign",
      PDFDetails: null,
      toggleshowPDFModal: false,
      formData: {
        shortLead: "",
        documentType: [],
      },
      check: false,
      merchantTypeSelection: "",
      subDocumentTypeSelection: 0,
      stateOptions: [],
      cityOptions: [],
      cityOptionsSearch: [],
      stateOptionsSearch: [],
      rentalPlanSet: [],
      dataCopy: [],
      dropDown: {
        deviceOptions: [],
        planOptions: [],
        leadSourceOptions: [],
        merchantTypesOptions: [],
      },
      info: {
        datainfo1: "",
      },
      formdata: {
        mid: [],
        tid: [],
        sample: "",
        paymentOption: "",
        cmsCategoryType: "",
        referenceNumber: "",
        paymentMadeon: "",
        setupFees: "",
        deviceId: "",
        leadSourceId: "",
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
        amountCollected: "",
        merchantCategory: "",
        corpCC: "",
        debitGreaterthanAmount: "",
        debitLessthanAmount: "",
        premiumCC: "",
        pricing: 1,
        leadStatus: "",
        submittoRSMDate: "",
        posIncentive: "",
        posEnable: "",
        leadName: "",
        paymentDocumentFile: "",
        paymentDocumentMimeType: "",
      },
      forminfo: {
        applicationNumber: "",
      },
      formdata1: {
        paymentOption: "",
        referenceNumber: "",
        paymentMadeon: "",
        setupFees: "",
        deviceId: "",
        leadSourceId: "",
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
        // amountCollected:"",
        merchantCategory: "",
        corpCC: "",
        debitGreaterthanAmount: "",
        debitLessthanAmount: "",
        premiumCC: "",
        pricing: 1,
        leadStatus: "",
        submittoRSMDate: "",
        posIncentive: "",
        posEnable: "",
        leadName: "",
        paymentDocumentFile: "",
        paymentDocumentMimeType: "",
      },
      merchant: {
        salesInformation: {
          institutionCode: "",
        },
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
          contactEmail: "",
          applicationNumber: "",
          remarks: "Company Details Updated",
        },
        bankInformation: {
          bankDetails: {
            accountNumber: "",
            ifsc: "",
            bankName: "",
            paymentMode: "",
            accountType: "",
          },
          remarks: "Bank Details Updated",
        },
        businessInformation: {
          gstId: null,
          remarks: "",
        },
        kyc: {
          remarks: "",
          documents: [],
        },
        paymentDetails: {
          settlementType: "",
          tipEnabled: "",
          cashAtPosEnabled: "",
          intlCardAcceptance: "",
          preAuth: "",
          rentalPlanCode: 1,
          remarks: "Payment Details Updated",
        },
        mdrPlan: {
          remarks: "MDR Value Updated",
          code: 1,
          domesticDebitUpTo2000: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          domesticDebitAbove2000: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          standardOrClassic: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          premiumOrPlatinum: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          superPremiumOrSignature: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          commercialOrCorporate: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          internationalDebitCard: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          internationalCreditCard: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          onus: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          diners: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          masterPass: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          cashAtPos: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
          convenientFee: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        },
      },
      error: {
        formdata: { cmsCategoryType: { alert: false, issue: "", value: "" } },
        field: {
          merchant: {
            businessInformation: { gstId: { alert: false, issue: "", value: "" } },
            companyinformation: { pan: { alert: false, issue: "", value: "" } },
          },
        },
      },
      payment: [
        { label: "Cheque", value: 2 },
        { label: "Swipe", value: 3 },
        { label: "Neft", value: 1 },
      ],
      cmsCategoryTypeOptions: [
        { label: "Small", value: "S" },
        { label: "Other", value: "O" },
      ],
      autoormanualOptions: [
        { label: "Auto Settlement", value: "A" },
        { label: "Manual Settlement", value: "M" },
      ],
      preauthOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" },
      ],
      cashandposOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" },
      ],
      internationalcardOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" },
      ],
      tipOptions: [
        { label: "Enable", value: "Y" },
        { label: "Disable", value: "N" },
      ],
      paymnentModeOptions: [
        { label: "Direct credit", value: "D" },
        { label: "NEFT", value: "N" },
      ],
      accountTypeOptions: [
        { label: "Saving account", value: "S" },
        { label: "Current account", value: "C" },
        { label: "Overdraft account", value: "O" },
        { label: "Cash credit account", value: "R" },
      ],
    };
  },

  computed: {
    ...mapGetters("SatLeadValidation", [
      "getShortLeadInfo",
      "getDeviceVerificationStatus",
      "getShortLeadInfoDocumentTypes",
    ]),
    ...mapGetters("mars_rentalPlans", ["rentalPlanFromMars"]),
    ...mapGetters("categoryBasedRental", ["categoryBasedRental"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("plan", ["getActivePlan"]),
    ...mapGetters("GetMarsData", [
      "getAllMarsData",
      "getImplementedQueue",
      "getMidBasedList",
    ]),
    ...mapGetters("mars_city", ["cityFromMars"]),
    ...mapGetters("mars_state", ["stateFromMars"]),
    ...mapGetters("mars_ifsc", ["ifscFromMars"]),
    getRsmReason() {
      return _.find(
        this.getImplementedQueue.leadInformation.leadVerificationStatus,
        function (oo) {
          return oo.verificationType == 6 && oo.status == false;
        }
      );
    },
  },
  created() {
    this.ajaxLoadDataForDeviceTypeTable1();
    this.ajaxLoadMarsData();
    this.ajaxLoadShortLeadInfoForDocumentTypes();
    this.fetchAllDropdownValuesFromMARSapi();
  },
  validations: {
    formdata: {
      referenceNumber: { required },
      paymentOption: { required },
      cmsCategoryType: { required },
      paymentMadeon: { required },
    },
    merchant: {
      companyinformation: {
        pan: {
          required,
          panCard,
          maxLength: maxLength(10),
          minLength: minLength(10),
        },
      },
      businessInformation: {
        gstId: {
          gstn,
          maxLength: maxLength(15),
          minLength: minLength(15),
        },
      },
    },
  },
  methods: {
    ...mapActions("mars_rentalPlans", ["RENTAL_PLAN_FROM_MARS"]),
    ...mapActions("categoryBasedRental", ["CATEGORY_BASED_RENTAL_PLAN1"]),
    ...mapActions("mars_city", ["CITY_FROM_MARS"]),
    ...mapActions("mars_state", ["STATE_FROM_MARS"]),
    ...mapActions("mars_ifsc", ["IFSC_FROM_MARS"]),
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("GetMarsData", [
      "FETCH_MARS_DATA",
      "IMPLEMENTED_QUEUE",
      "MIDBASEDLIST",
    ]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("CategoryBasedMdr", [
      "CATEGORY_BASED_MDR_PLAN",
      "EDIT_MDR_PLAN",
    ]),
    ...mapActions("mars_final_submit_internal", ["MARS_FINAL_SUBMIT_INTERNAL"]),
    ...mapActions("SatLeadValidation", [
      "FEED_HAND_OVER_TO_SAT_DOCUMENT",
      "FEED_CHEQUE_FORM",
      "FEED_FULL_APPLICATION_FORM",
      "DELETE_DOCUMENT_FROM_BY_SAT",
      "FETCH_LEAD_DOCUMENT_TYPE_DATA",
      "FETCH_SHORT_LEAD_DATA",
      "MOVE_BACK_DOCUMENT_VERIFICATION_STAGE",
    ]),
    ...mapActions("SendTORSMCMS", ["SEND_TO_RSM_CMS"]),
    ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
    ...mapActions("CMS_EDIT_MDR", [
      "CMS_EDIT_MDR",
      "CMS_EDIT_MERCHANT",
      "CMS_EDIT_KYC",
      "CMS_EDIT_TERMINAL",
      "CMS_STATUS_CHANGE",
    ]),

    sendtoFinance(request) {
      this.v$.formdata?.$touch();
      if (this.v$.formdata?.$error) {
        this.$q.notify("Please review fields again.");
      } else if (
        this.formdata.paymentOption == 2 &&
        this.formdata.paymentDocumentFile == ""
      ) {
        this.$q.notify({
          color: "amber",
          position: "bottom",
          icon: "attachment",
          message: "Please attach the Cheque File",
        });
      } else {
        let requestparams = {
          url: { id: this.getShortLeadInfo.id },
          params: {
            setupFees: request.setupFees,
            amountCollected: request.setupFees,
            recurringFees: request.recurringFees,
            planCode: request.planCode,
            verifiedCmsPricingStatus: request.verifiedCmsPricingStatus,
            contactName: request.contactName,
            contactNumber: request.contactNumber,
            alternateContactNumber: request.alternateContactNumber,
            city: request.city,
            device: request.device,
            deviceCount: request.deviceCount,
            leadAddress: request.leadAddress,
            latitude: request.latitude,
            longitude: request.longitude,
            state: request.state,
            leadCategory: request.leadCategory,
            kyc: request.kyc,
            verifiedBanksubventionStatus: request.verifiedBanksubventionStatus,
            reason: request.reason,
            merchantCategory: request.merchantCategory,
            corpCC: request.corpCC,
            debitGreaterthanAmount: request.debitGreaterthanAmount,
            debitLessthanAmount: request.debitLessthanAmount,
            premiumCC: request.premiumCC,
            pricing: request.pricing,
            leadStatus: request.leadStatus,
            submittoRSMDate: request.submittoRSMDate,
            posEnable: request.posEnable,
            posIncentive: request.posIncentive,
            plan1: request.plan,
            leadName: request.leadName,
            paymentMadeon: request.paymentMadeon,
            referenceNumber: request.referenceNumber,
            paymentOption: request.paymentOption,
            cmsCategoryType: request.cmsCategoryType,
            paymentDocumentFile: request.paymentDocumentFile,
            paymentDocumentMimeType: request.paymentDocumentMimeType,
          },
        };
        if (this.check == false) {
          requestparams.params.leadCategory = 1;
          requestparams.params.pricing = 0;
        } else {
          requestparams.params.leadCategory = 2;
          requestparams.params.pricing = 1;
        }
        this.SEND_TO_RSM_CMS(requestparams)
          .then((response) => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              icon: "thumb_up",
              message: response.data.message,
            });
            this.$router.push("/sat/change/management");
          })
          .catch((error) => {
            this.$q.notify({
              color: "negative",
              position: "bottom",
              icon: "thumb_down",
              message: error.data.message,
            });
          });
      }
    },
    fnPlan() {
      let formData = {
        leadSource: this.formdata1.leadSourceId,
        device: this.formdata1.deviceId,
        plan: this.formdata1.plan,
      };
      this.CATEGORY_BASED_RENTAL_PLAN1(formData).then((response) => {
        if (response.status == 200) {
          this.formdata1.setupFees =
            this.categoryBasedRental == null
              ? 0
              : this.getImplementedQueue.leadInformation.deviceCount *
                this.categoryBasedRental.setupFees;
          this.formdata1.recurringFees =
            this.categoryBasedRental == null
              ? 0
              : this.getImplementedQueue.leadInformation.deviceCount *
                this.categoryBasedRental.monthlyFees;
        }
      });
    },
    fnPlan1() {
      let formData = {
        leadSource: this.formdata.leadSourceId,
        device: this.formdata.deviceId,
        plan: this.formdata.plan,
      };
      this.CATEGORY_BASED_RENTAL_PLAN1(formData).then((response) => {
        if (response.status == 200) {
          this.formdata.setupFees =
            this.categoryBasedRental == null
              ? 0
              : this.getImplementedQueue.leadInformation.deviceCount *
                this.categoryBasedRental.setupFees;
          this.formdata.recurringFees =
            this.categoryBasedRental == null
              ? 0
              : this.getImplementedQueue.leadInformation.deviceCount *
                this.categoryBasedRental.monthlyFees;
        }
      });
    },

    sendtoNH(request) {
      let requestparams = {
        url: { id: this.getShortLeadInfo.id },
        params: {
          setupFees: request.setupFees,
          amountCollected: request.setupFees,
          recurringFees: request.recurringFees,
          planCode: request.planCode,
          verifiedCmsPricingStatus: request.verifiedCmsPricingStatus,
          contactName: request.contactName,
          contactNumber: request.contactNumber,
          alternateContactNumber: request.alternateContactNumber,
          city: request.city,
          device: request.device,
          deviceCount: request.deviceCount,
          leadAddress: request.leadAddress,
          latitude: request.latitude,
          longitude: request.longitude,
          state: request.state,
          leadCategory: request.leadCategory,
          kyc: request.kyc,
          verifiedBanksubventionStatus: request.verifiedBanksubventionStatus,
          reason: request.reason,
          merchantCategory: request.merchantCategory,
          corpCC: request.corpCC,
          debitGreaterthanAmount: request.debitGreaterthanAmount,
          debitLessthanAmount: request.debitLessthanAmount,
          premiumCC: request.premiumCC,
          pricing: request.pricing,
          leadStatus: request.leadStatus,
          submittoRSMDate: request.submittoRSMDate,
          posEnable: request.posEnable,
          posIncentive: request.posIncentive,
          plan1: request.plan,
          leadName: request.leadName,
          paymentMadeon: request.paymentMadeon,
          referenceNumber: request.referenceNumber,
          paymentOption: request.paymentOption,
          cmsCategoryType: request.cmsCategoryType,
          paymentDocumentFile: request.paymentDocumentFile,
          paymentDocumentMimeType: request.paymentDocumentMimeType,
        },
      };
      if (this.check == false) {
        requestparams.params.leadCategory = 1;
        requestparams.params.pricing = 0;
      } else {
        requestparams.params.leadCategory = 2;
        requestparams.params.pricing = 1;
      }
      this.SEND_TO_RSM_CMS(requestparams)
        .then((response) => {
          this.$q.notify({
            color: "positive",
            position: "bottom",
            icon: "thumb_up",
            message: response.data.message,
          });
          this.$router.push("/sat/change/management");
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            icon: "thumb_down",
            message: error.data.message,
          });
        });
    },
    fnVerificationDocumentUpload(event, documentDetails) {
      this.merchant.kyc.documents = [];
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Uploading file ." });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);

      let requestParams = {
        files: formData,
        leadId: this.getShortLeadInfo.id,
        documentId: documentDetails.id,
      };

      this.FEED_HAND_OVER_TO_SAT_DOCUMENT(requestParams)
        .then(() => {
          this.shortLeadInfo();
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Failed to upload document", icon: "thumb_down" });
        });
    },
    ajaxLoadDataForDeviceTypeTable1() {
      let self = this;
      self.FETCH_DEVICES_DATA().then(() => {
        self.dropDown.deviceOptions = self.getAllDevicesInfo.map(item => ({ value: item.id, label: item.deviceName }));
      }).then(() => {
        self.LEAD_SOURCE_ACTIVE_LIST().then(() => {
          self.dropDown.leadSourceOptions = self.getActiveLeadSource.map(item => ({ value: item.id, label: item.sourceName }));
        });
      }).then(() => {
        self.PLAN_ACTIVE_LIST().then(() => {
          self.dropDown.planOptions = self.getActivePlan.map(item => ({ value: item.id, label: item.planName }));
        });
      });
    },
    ajaxLoadMarsData() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data ." });
      this.IMPLEMENTED_QUEUE(this.$route.params.id)
        .then(() => {
          this.FETCH_SHORT_LEAD_DATA(this.getImplementedQueue.leadInformation.id);
          this.marsInfo();

          this.formdata.plan = this.getImplementedQueue.leadInformation.plan.id;
          this.formdata.planCode = this.getImplementedQueue.leadInformation.plan.planName;
          this.formdata.deviceId = this.getImplementedQueue.leadInformation.device.id;
          this.formdata.leadSourceId = this.getImplementedQueue.leadInformation.leadSource.id;
          this.formdata.contactName = this.getImplementedQueue.leadInformation.contactName;
          this.formdata.contactNumber = this.getImplementedQueue.leadInformation.contactName;
          this.formdata.alternateContactNumber = this.getImplementedQueue.leadInformation.alternateContactNumber;
          this.formdata.city = this.getImplementedQueue.leadInformation.city;
          this.formdata.device = this.getImplementedQueue.leadInformation.device;
          this.formdata.deviceCount = this.getImplementedQueue.leadInformation.deviceCount;
          this.formdata.leadAddress = this.getImplementedQueue.leadInformation.leadAddress;
          this.formdata.latitude = this.getImplementedQueue.leadInformation.latitude;
          this.formdata.longitude = this.getImplementedQueue.leadInformation.longitude;
          this.formdata.state = this.getImplementedQueue.leadInformation.state;
          this.formdata.kyc = this.getImplementedQueue.leadInformation.kyc;
          this.formdata.verifiedBanksubventionStatus = this.getImplementedQueue.leadInformation.verifiedBanksubventionStatus;
          this.formdata.reason = this.getImplementedQueue.leadInformation.reason;
          this.formdata.merchantCategory = this.getImplementedQueue.leadInformation.merchantCategory;
          this.formdata.pricing = this.getImplementedQueue.leadInformation.pricing;
          this.formdata.leadStatus = this.getImplementedQueue.leadInformation.leadStatus;
          this.formdata.submittoRSMDate = this.getImplementedQueue.leadInformation.submittoRSMDate;
          this.formdata.posIncentive = this.getImplementedQueue.leadInformation.posIncentive;
          this.formdata.posEnable = this.getImplementedQueue.leadInformation.posEnable;
          this.formdata.leadName = this.getImplementedQueue.leadInformation.leadName;

          this.formdata1.plan = this.getImplementedQueue.leadInformation.plan.id;
          this.formdata1.planCode = this.getImplementedQueue.leadInformation.plan.planName;
          this.formdata1.setupFees = this.getImplementedQueue.leadInformation.setupFees;
          this.formdata1.recurringFees = this.getImplementedQueue.leadInformation.recurringFees;
          this.formdata.setupFees = this.getImplementedQueue.leadInformation.setupFees;
          this.formdata.recurringFees = this.getImplementedQueue.leadInformation.recurringFees;
          this.formdata.amountCollected = this.getImplementedQueue.leadInformation.amountCollected;
          this.formdata1.contactName = this.getImplementedQueue.leadInformation.contactName;
          this.formdata1.contactNumber = this.getImplementedQueue.leadInformation.contactName;
          this.formdata1.alternateContactNumber = this.getImplementedQueue.leadInformation.alternateContactNumber;
          this.formdata1.city = this.getImplementedQueue.leadInformation.city;
          this.formdata1.device = this.getImplementedQueue.leadInformation.device;
          this.formdata1.deviceId = this.getImplementedQueue.leadInformation.device.id;
          this.formdata1.leadSourceId = this.getImplementedQueue.leadInformation.leadSource.id;
          this.formdata1.deviceCount = this.getImplementedQueue.leadInformation.deviceCount;
          this.formdata1.leadAddress = this.getImplementedQueue.leadInformation.leadAddress;
          this.formdata1.latitude = this.getImplementedQueue.leadInformation.latitude;
          this.formdata1.longitude = this.getImplementedQueue.leadInformation.longitude;
          this.formdata1.state = this.getImplementedQueue.leadInformation.state;
          this.formdata1.kyc = this.getImplementedQueue.leadInformation.kyc;
          this.formdata1.verifiedBanksubventionStatus = this.getImplementedQueue.leadInformation.verifiedBanksubventionStatus;
          this.formdata1.reason = this.getImplementedQueue.leadInformation.reason;
          this.formdata1.merchantCategory = this.getImplementedQueue.leadInformation.merchantCategory;
          this.formdata1.pricing = this.getImplementedQueue.leadInformation.pricing;
          this.formdata1.leadStatus = this.getImplementedQueue.leadInformation.leadStatus;
          this.formdata1.submittoRSMDate = this.getImplementedQueue.leadInformation.submittoRSMDate;
          this.formdata1.posIncentive = this.getImplementedQueue.leadInformation.posIncentive;
          this.formdata1.posEnable = this.getImplementedQueue.leadInformation.posEnable;
          this.formdata1.leadName = this.getImplementedQueue.leadInformation.leadName;
          this.merchant.mdrPlan.domesticDebitUpTo2000.percentage = this.getImplementedQueue.leadInformation.debitLessthanAmount;
          this.merchant.mdrPlan.domesticDebitAbove2000.percentage = this.getImplementedQueue.leadInformation.debitGreaterthanAmount;
          this.merchant.mdrPlan.standardOrClassic.percentage = this.getImplementedQueue.leadInformation.stdCC;
          this.merchant.mdrPlan.premiumOrPlatinum.percentage = this.getImplementedQueue.leadInformation.premiumCC;
          this.merchant.mdrPlan.superPremiumOrSignature.percentage = this.getImplementedQueue.leadInformation.superPremiumlCC;
          this.merchant.mdrPlan.commercialOrCorporate.percentage = this.getImplementedQueue.leadInformation.corpCC;
          this.merchant.mdrPlan.internationalCreditCard.percentage = this.getImplementedQueue.leadInformation.intlCC;
          this.merchantTypeSelection = this.getImplementedQueue.leadInformation.merchantType.merchantTypeName;

          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    fnUploadApplicationForm(event) {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Uploading file ." });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("fileNameOriginal", "Cheque");

      this.FEED_CHEQUE_FORM({ files: formData, fileNameOriginal: "Cheque" })
        .then((response) => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", position: "bottom", icon: "thumb_up", message: "File Successfully Uploaded - " + response.fileName });
          this.formdata.paymentDocumentFile = response.fileName;
          this.formdata.paymentDocumentMimeType = response.mimeType;
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Failed to upload document", icon: "thumb_down" });
        });
    },
    ajaxLoadShortLeadInfoForDocumentTypes() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching files ." });
      this.FETCH_LEAD_DOCUMENT_TYPE_DATA()
        .then(() => {
          return this.fnGetMerchantTypeValue(this.getImplementedQueue.leadInformation.merchantType.merchantTypeName);
        })
        .then(() => {
          this.formData.documentType = this.getShortLeadInfoDocumentTypes;
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    fnUploadApplicationForm1(event) {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Uploading file ." });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      this.merchant.kyc.documents = [];

      this.FEED_FULL_APPLICATION_FORM({ files: formData, leadId: this.getShortLeadInfo.id })
        .then(() => {
          this.shortLeadInfo();
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Failed to upload document", icon: "thumb_down" });
        });
    },
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnGetSubDocuments(documentDetails) {
      if (typeof documentDetails !== "undefined") {
        documentDetails.selectedSubDocumentType = documentDetails.subDocumentType;
      }
    },
    fn_________GetEntryPermissionToUploadSubDocuments(multipleDocument) {
      return true;
    },
    fnViewHandedOverFileImage() {
      this.$refs.handedOverImageViewer.click();
    },
    fnGetMerchantTypeValue(inputValue) {
      let merchantDocumentCategory = _.find(this.getShortLeadInfoDocumentTypes, (o) => o.merchantType === inputValue);
      let arr = { forSingleDocument: [], forMutipleDocument: [] };
      let leadDocuments = this.getShortLeadInfo.leadDocuments;
      merchantDocumentCategory.documentsApplicable.forEach((value) => {
        if (value.viewType == 1) {
          arr.forSingleDocument.push(value);
        } else {
          if (value.documentType in leadDocuments) {
            let assumeArr = _.find(value.documents, (oo) => {
              return leadDocuments.hasOwnProperty(oo.documentType) && (oo.subDocumentType == leadDocuments[oo.documentType][0].subDocumentType || leadDocuments[oo.documentType][0].documentType == leadDocuments[oo.documentType][0].subDocumentType);
            });
            value.subDocumentTypeSelection = assumeArr || 0;
          } else {
            value.subDocumentTypeSelection = 0;
          }
          arr.forMutipleDocument.push(value);
        }
      });
      this.getShortLeadInfoDocumentTypes.uploadedDocuments = arr;
    },
    fnViewbankUploadedLetterImage() {
      this.$refs.bankUploadedLetter.click();
    },
    fnDeleteAlreadyAttachedFile(documentDetails) {
      this.merchant.kyc.documents = [];
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to delete uploaded document?",
          ok: "Continue",
          cancel: "Cancel",
        }).onOk(() => {
          this.$q.loading.show({ spinnerColor: "purple-9", message: "Processing ." });
          this.DELETE_DOCUMENT_FROM_BY_SAT(documentDetails)
            .then(() => {
              this.shortLeadInfo();
              this.$q.notify({ color: "positive", position: "bottom", message: "Successfully removed!", icon: "thumb_up" });
              this.$q.loading.hide();
            }).catch((error) => {
              this.$q.loading.hide();
              this.$q.notify({ color: "negative", position: "bottom", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
            });
        });
    },
    fnViewMultiAttachedFileImage() {
      this.$refs.multiAttachedImageViewer.click();
    },
    fnVerificationDocumentUploadSingleUpload(event, documentDetails) {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Uploading file ." });
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      this.merchant.kyc.documents = [];

      this.FEED_HAND_OVER_TO_SAT_DOCUMENT({ files: formData, leadId: this.getShortLeadInfo.id, documentId: documentDetails.id })
        .then(() => {
          this.shortLeadInfo();
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Failed to upload document", icon: "thumb_down" });
        });
    },
    fnViewAttachedFileImage() {
      this.$refs.attachedImageViewer.click();
    },
    finalMerchant(request) {
      let terminalparams = {
        terminal: { id: this.getAllMarsData.paymentDetails.terminalModeCode },
        terminalparams: {
          merchant: {
            companyInformation: { applicationNumber: this.getAllMarsData.salesInformation.applicationNumber },
            paymentDetails: request.paymentDetails,
          },
        },
      };

      this.CMS_EDIT_TERMINAL(terminalparams)
        .then((response) => {
          this.$q.notify({ color: "positive", position: "bottom", icon: "thumb_up", message: response.data.message });
        })
        .catch((error) => {
          this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: error.data.message });
        });

      let requestparams = {
        url: { id: this.getAllMarsData.merchantRefCode },
        params: {
          merchant: {
            companyInformation: request.companyinformation,
            businessInformation: request.businessInformation,
            paymentDetails: request.paymentDetails,
            bankInformation: request.bankInformation,
          },
        },
      };

      this.CMS_EDIT_MERCHANT(requestparams)
        .then((response) => {
          this.$q.notify({ color: "positive", position: "bottom", icon: "thumb_up", message: response.data.message });
        })
        .catch((error) => {
          this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: error.data.message });
        });
    },
    finalFormSubmit(request) {
      let requestparams = {
        url: { id: this.getAllMarsData.merchantRefCode },
        params: {
          merchant: {
            companyInformation: { applicationNumber: this.getAllMarsData.salesInformation.applicationNumber },
            mdrPlan: request.mdrPlan,
          },
        },
      };

      this.CMS_EDIT_MDR(requestparams)
        .then((response) => {
          this.$q.notify({ color: "positive", position: "bottom", icon: "thumb_up", message: response.data.message });
        })
        .catch((error) => {
          this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: error.data.message });
        });
    },
    finalFormSubmitKyc(request) {
      this.dataCopy = _.cloneDeep(this.getAllMarsData);
      this.dataCopy.businessInformation.gstId = request.businessInformation.gstId;
      this.dataCopy.companyInformation.legalName = request.companyinformation.legalName;
      this.dataCopy.companyInformation.dbaName = request.companyinformation.dbaName;
      this.dataCopy.companyInformation.contactName = request.companyinformation.contactName;
      this.dataCopy.companyInformation.registeredAddress = request.companyinformation.registeredAddress;
      this.dataCopy.companyInformation.registeredCityName = request.companyinformation.registeredCityName;
      this.dataCopy.companyInformation.registeredStateName = request.companyinformation.registeredStateName;
      this.dataCopy.companyInformation.registeredPin = request.companyinformation.registeredPin;
      this.dataCopy.companyInformation.contactMobile = request.companyinformation.contactMobile;
      this.dataCopy.companyInformation.contactEmail = request.companyinformation.contactEmail;
      this.dataCopy.companyInformation.statementEmail = request.companyinformation.statementEmail;
      this.dataCopy.companyInformation.businessNature = request.companyinformation.businessNature;
      this.dataCopy.companyInformation.pan = request.companyinformation.pan;
      this.dataCopy.bankInformation.bankDetails.ifsc = request.bankInformation.bankDetails.ifsc;
      this.dataCopy.bankInformation.bankDetails.bankName = request.bankInformation.bankDetails.bankName;
      this.dataCopy.bankInformation.bankDetails.paymentMode = request.bankInformation.bankDetails.paymentMode;
      this.dataCopy.bankInformation.bankDetails.accountType = request.bankInformation.bankDetails.accountType;
      this.dataCopy.bankInformation.bankDetails.accountNumber = request.bankInformation.bankDetails.accountNumber;
      this.dataCopy.mdrPlan = _.cloneDeep(request.mdrPlan);
      this.dataCopy.paymentDetails = _.cloneDeep(request.paymentDetails);

      this.dataCopy.leadInformation.leadName = request.companyinformation.legalName;
      this.dataCopy.leadInformation.contactName = request.companyinformation.contactName;
      this.dataCopy.leadInformation.leadAddress = request.companyinformation.registeredAddress;
      this.dataCopy.leadInformation.city = request.companyinformation.registeredCityName;
      this.dataCopy.leadInformation.state = request.companyinformation.registeredStateName;
      this.dataCopy.leadInformation.pincode = request.companyinformation.registeredPin;
      this.dataCopy.leadInformation.contactNumber = request.companyinformation.contactMobile;

      let merchantrequestparams = {
        url: {
          id: this.getImplementedQueue.mid,
          leadId: this.getImplementedQueue.leadInformation.id,
        },
        params: {
          merchant: {
            companyInformation: request.companyinformation,
            businessInformation: { ...request.businessInformation, gstId: this.merchant.businessInformation.gstId },
            paymentDetails: request.paymentDetails,
            bankInformation: request.bankInformation,
            mdrPlan: request.mdrPlan,
            kyc: request.kyc,
          },
        },
      };

      this.CMS_EDIT_MERCHANT(merchantrequestparams)
        .then(() => {
          this.terinalUpdate();
          this.$q.notify({ color: "positive", position: "bottom", icon: "thumb_up", message: "Merchant Details successfully Updated" });
          this.MARS_FINAL_SUBMIT_INTERNAL({ merchant: this.dataCopy, action: 1 })
            .then(() => {
              this.$q.loading.hide();
              this.$q.notify({ color: "positive", position: "bottom", message: "Saved successfully", icon: "thumb_up" });
            })
            .catch((error) => {
              this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: error.data.message });
              this.$q.loading.hide();
            });
        })
        .catch((error) => {
          this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: error.data.message });
          this.$q.loading.hide();
        });
    },
    terinalUpdate() {
      if (this.merchant.paymentDetails.rentalPlanCode != this.getAllMarsData.paymentDetails.rentalPlanCode) this.merchant.paymentDetails.remarks = "Rental Plan updated";
      if (this.merchant.paymentDetails.settlementType != this.getAllMarsData.paymentDetails.settlementType) this.merchant.paymentDetails.remarks = "Settlement Type updated";
      if (this.merchant.paymentDetails.tipEnabled != this.getAllMarsData.paymentDetails.tipEnabled) this.merchant.paymentDetails.remarks = "Tip updated";
      if (this.merchant.paymentDetails.cashAtPosEnabled != this.getAllMarsData.paymentDetails.cashAtPosEnabled) this.merchant.paymentDetails.remarks = "Cash@Pos updated";
      if (this.merchant.paymentDetails.preAuth != this.getAllMarsData.paymentDetails.preAuth) this.merchant.paymentDetails.remarks = "PreAuth updated";
      if (this.merchant.paymentDetails.intlCardAcceptance != this.getAllMarsData.paymentDetails.intlCardAcceptance) this.merchant.paymentDetails.remarks = "Intlcard Acceptance updated";

      for (var i = 0; i < this.formdata.tid.length; i++) {
        let terminalparams = {
          terminal: { id: this.formdata.tid[i] },
          terminalparams: {
            merchant: {
              companyInformation: { applicationNumber: this.forminfo.applicationNumber },
              paymentDetails: this.merchant.paymentDetails,
            },
          },
        };
        this.CMS_EDIT_TERMINAL(terminalparams)
          .then(() => {
            this.CMS_STATUS_CHANGE(this.getImplementedQueue.leadInformation.id);
            this.$q.notify({ color: "positive", position: "bottom", icon: "thumb_up", message: "Terminal Details Successfully Updated" });
            this.$router.push("/sat/change/management");
          })
          .catch((error) => {
            this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: error.data.message });
          });
      }
    },
    fetchAllDropdownValuesFromMARSapi() {
      let self = this;
      self.CITY_FROM_MARS().then(() => {
        self.cityOptions = self.cityFromMars.items.map(oo => ({ label: oo.name, value: oo.code }));
      }).then(() => {
        return self.RENTAL_PLAN_FROM_MARS().then(() => {
          self.rentalPlanSet = self.rentalPlanFromMars.items.map(oo => ({ label: oo.name, value: oo.code }));
        });
      }).then(() => {
        return self.STATE_FROM_MARS().then(() => {
          self.stateOptions = self.stateFromMars.items.map(oo => ({ label: oo.name, value: oo.code }));
        });
      });
    },
    marsInfo() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data ." });
      this.FETCH_MARS_DATA(this.getImplementedQueue.leadInformation.id)
        .then(() => {
          this.shortLeadInfo();
          this.formdata.plan = this.getImplementedQueue.leadInformation.plan.id;
          this.formdata.planCode = this.getImplementedQueue.leadInformation.plan.planName;
          this.formdata.contactName = this.getImplementedQueue.leadInformation.contactName;
          this.formdata.contactNumber = this.getImplementedQueue.leadInformation.contactName;
          this.formdata.alternateContactNumber = this.getImplementedQueue.leadInformation.alternateContactNumber;
          this.formdata.city = this.getImplementedQueue.leadInformation.city;
          this.formdata.device = this.getImplementedQueue.leadInformation.device;
          this.formdata.deviceCount = this.getImplementedQueue.leadInformation.deviceCount;
          this.formdata.leadAddress = this.getImplementedQueue.leadInformation.leadAddress;
          this.formdata.latitude = this.getImplementedQueue.leadInformation.latitude;
          this.formdata.longitude = this.getImplementedQueue.leadInformation.longitude;
          this.formdata.state = this.getImplementedQueue.leadInformation.state;
          this.formdata.kyc = this.getImplementedQueue.leadInformation.kyc;
          this.formdata.verifiedBanksubventionStatus = this.getImplementedQueue.leadInformation.verifiedBanksubventionStatus;
          this.formdata.reason = this.getImplementedQueue.leadInformation.reason;
          this.formdata.merchantCategory = this.getImplementedQueue.leadInformation.merchantCategory;
          this.merchant.companyinformation.pan = this.getAllMarsData.companyInformation.pan;
          this.merchant.companyinformation.contactPhone = this.getAllMarsData.companyInformation.contactPhone;
          this.merchant.companyinformation.legalName = this.getAllMarsData.companyInformation.legalName;
          this.merchant.companyinformation.dbaName = this.getAllMarsData.companyInformation.dbaName;
          this.merchant.companyinformation.registeredAddress = this.getAllMarsData.companyInformation.registeredAddress;
          this.merchant.companyinformation.registeredPin = this.getAllMarsData.companyInformation.registeredPin;
          this.merchant.companyinformation.registeredCityRefCode = this.getAllMarsData.companyInformation.registeredCityRefCode;
          this.merchant.companyinformation.registeredCityName = this.getAllMarsData.companyInformation.registeredCityName;
          this.merchant.companyinformation.registeredStateRefCode = this.getAllMarsData.companyInformation.registeredStateRefCode;
          this.merchant.companyinformation.registeredStateName = this.getAllMarsData.companyInformation.registeredStateName;
          this.merchant.companyinformation.contactName = this.getAllMarsData.companyInformation.contactName;
          this.merchant.companyinformation.statementEmail = this.getAllMarsData.companyInformation.statementEmail;
          this.merchant.companyinformation.applicationNumber = this.getAllMarsData.salesInformation.applicationNumber;
          this.forminfo.applicationNumber = this.getAllMarsData.salesInformation.applicationNumber;
          this.merchant.companyinformation.contactEmail = this.getAllMarsData.companyInformation.contactEmail;
          this.merchant.companyinformation.contactMobile = this.getAllMarsData.leadInformation.contactNumber;
          this.merchant.companyinformation.businessNature = this.getAllMarsData.companyInformation.businessNature;
          this.merchant.bankInformation.bankDetails.accountNumber = this.getAllMarsData.bankInformation.bankDetails.accountNumber;
          this.merchant.bankInformation.bankDetails.ifsc = this.getAllMarsData.bankInformation.bankDetails.ifsc;
          this.merchant.bankInformation.bankDetails.bankName = this.getAllMarsData.bankInformation.bankDetails.bankName;
          this.merchant.bankInformation.bankDetails.paymentMode = this.getAllMarsData.bankInformation.bankDetails.paymentMode;
          this.merchant.bankInformation.bankDetails.accountType = this.getAllMarsData.bankInformation.bankDetails.accountType;
          this.merchant.paymentDetails.settlementType = this.getAllMarsData.paymentDetails.settlementType;
          this.merchant.paymentDetails.tipEnabled = this.getAllMarsData.paymentDetails.tipEnabled;
          this.merchant.paymentDetails.cashAtPosEnabled = this.getAllMarsData.paymentDetails.cashAtPosEnabled;
          this.merchant.paymentDetails.intlCardAcceptance = this.getAllMarsData.paymentDetails.intlCardAcceptance;
          this.merchant.paymentDetails.preAuth = this.getAllMarsData.paymentDetails.preAuth;
          this.merchant.paymentDetails.rentalPlanCode = this.getAllMarsData.paymentDetails.rentalPlanCode;
          this.merchant.salesInformation.institutionCode = this.getAllMarsData.salesInformation.institutionCode;
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    shortLeadInfo() {
      this.FETCH_SHORT_LEAD_DATA(this.getImplementedQueue.leadInformation.id);
      this.MidBasedList();
    },
    MidBasedList() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data ." });
      this.MIDBASEDLIST(this.getImplementedQueue.mid)
        .then(() => {
          this.formdata.mid = this.getMidBasedList.tids;
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    populateBankDetails() {
      let self = this;
      self.IFSC_FROM_MARS(this.merchant.bankInformation.bankDetails.ifsc)
        .then((response) => {
          if (response.status == 200) {
            this.merchant.bankInformation.bankDetails.bankName = self.ifscFromMars.bankName;
          } else {
            this.$q.notify({ color: "negative", position: "bottom-left", message: "Invalid IFSC code", icon: "clear" });
            this.merchant.bankInformation.bankDetails.ifsc = "";
            this.merchant.bankInformation.bankDetails.bankName = "";
          }
        });
    },
    registeredStateSelected(item) {
      if (item) {
        this.merchant.companyinformation.registeredStateName = item.label;
        this.merchant.companyinformation.registeredStateRefCode = item.value;
      }
    },
    fnResidentStateSearch(val, update) {
      update(() => {
        this.stateOptionsSearch = this.COMMON_FILTER_FUNCTION(this.stateOptions, val);
      });
    },
    fnResidentCitySearch(val, update) {
      update(() => {
        this.cityOptionsSearch = this.COMMON_FILTER_FUNCTION(this.cityOptions, val);
      });
    },
    registeredCitySelected(item) {
      if (item) {
        this.merchant.companyinformation.registeredCityName = item.label;
        this.merchant.companyinformation.registeredCityRefCode = item.value;
      }
    },
    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, (oo) => {
        return oo.label.toLowerCase().includes(terms.toLowerCase()) || oo.value.toString().includes(terms.toString());
      });
    },
    goBackToDocumentVerificationStage() {
      let formData = {
        leadId: this.$route.params.id,
        defaultUrlValue:
          this.getShortLeadInfo.leadStatus ==
          this.$LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING
            ? this.$SAT_LEAD_VALIDATION_PROCEED_TO_DATA_ENTRY_WITH_REFERBACK
            : this.$SAT_LEAD_VALIDATION_APPROVE,
      };

      this.$q
        .dialog({
          title: "Confirm",
          message:
            "Are you sure want to proceed to document verification stage?",
          ok: "Continue",
          cancel: "Cancel",
        })
        .onOk(() => {
          this.$q.loading.show({
            delay: 0, // ms
            spinnerColor: "purple-9",
            message: "Processing .",
          });
          this.MOVE_BACK_DOCUMENT_VERIFICATION_STAGE(formData).then(() => {
            this.$router.push("/sat/lead/validation/" + this.$route.params.id);
            this.$q.loading.hide();
          });
        });
    },
    next1() {
      this.$refs.stepper.next();
    },
    next() {
      this.v$.merchant?.$touch();
      if (this.v$.merchant?.$error) {
        this.$q.notify("Please review the KYC information fields again.");
      } else {
        if (
          this.merchant.companyinformation.legalName !=
          this.getAllMarsData.companyInformation.legalName
        ) {
          this.merchant.companyinformation.remarks = "Legal Name";
        }
        if (this.formdata.cmsCategoryType == "O") {
          this.merchant.mdrPlan.code = 9;
        } else if (this.formdata.cmsCategoryType == "") {
          this.merchant.mdrPlan.code = this.getAllMarsData.mdrPlan.code;
        } else {
          this.merchant.mdrPlan.code = 8;
        }
        if (
          this.merchant.companyinformation.dbaName !=
          this.getAllMarsData.companyInformation.dbaName
        ) {
          this.merchant.companyinformation.remarks = "DBA Name";
        }
        if (
          this.merchant.companyinformation.pan !=
          this.getAllMarsData.companyInformation.pan
        ) {
          this.merchant.companyinformation.remarks = "Pan Number";
        }

        this.$refs.stepper.next();
      }
    },
  },
};
</script>

<style>
.customQuasarSelect { padding: 5px; }
label { padding: 5px 10px; display: table; }
input[type="file"] { display: none; }
.bg-dark-custom { background: rgba(0, 0, 0, 0.5); }
</style>