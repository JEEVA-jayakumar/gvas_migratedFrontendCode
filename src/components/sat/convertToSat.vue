<template>
  <q-dialog persistent v-model="toggleModel" @hide="emitfnzEditshowConvertToSat(false)">
    <q-card style="min-width: 60vw">
      <q-card-section class="q-title text-weight-regular bottom-border q-pa-md">
        Edit WIP List
      </q-card-section>
      <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
        <div class="row q-col-gutter-md">
          <div class="col-12"><q-input v-model="formData.id" label="leadId" disable /></div>
          <div class="col-12"><q-input v-model="formData.leadName" label="leadName" :error="v$.formData.leadName.$error" /></div>
          <div class="col-12"><q-input v-model="formData.leadNumber" label="leadNumber" disable /></div>
          <div class="col-12"><q-input v-model="formData.contactNumber" label="contactNumber" :error="v$.formData.contactNumber.$error" /></div>
          <div class="col-12"><q-input v-model="formData.alternateContactNumber" label="alternateContactNumber" /></div>
          <div class="col-12"><q-input v-model="formData.email" label="email" :error="v$.formData.email.$error" /></div>
          <div class="col-12"><q-input v-model="formData.leadAddress" label="leadAddress" :error="v$.formData.leadAddress.$error" /></div>
          <div class="col-12"><q-input v-model="formData.pincode" label="pincode" :error="v$.formData.pincode.$error" /></div>
          <div class="col-12"><q-input v-model="formData.city" label="city" disable /></div>
          <div class="col-12"><q-input v-model="formData.state" label="state" disable /></div>

          <div class="col-12 text-subtitle2">Merchant Tier Mapping</div>
          <div class="col-12"><q-select v-model="formData.merchantState" :options="dropDown.merchantState" label="Select Merchant State*" @update:model-value="getdistrict" emit-value map-options :error="v$.formData.merchantState.$error" /></div>
          <div class="col-12"><q-select v-model="formData.district" :options="dropDown.merchantDistrict" label="Select Merchant District*" @update:model-value="getSubDistrict" emit-value map-options :error="v$.formData.district.$error" /></div>
          <div class="col-12"><q-select v-model="formData.subDistrict" :options="dropDown.merchantSubDistrict" label="Select Merchant Sub District*" @update:model-value="getTownOrVillage" emit-value map-options :error="v$.formData.subDistrict.$error" /></div>
          <div class="col-12"><q-select v-model="formData.village" :options="dropDown.merchantTownOrVillageDetails" label="Select Merchant Town/Village*" @update:model-value="getVillageTier" emit-value map-options :error="v$.formData.village.$error" /></div>
          <div class="col-12"><q-input v-model="formData.tier" label="Merchant Tier" disable /></div>

          <div class="col-12"><q-select v-model="formData.leadSource" :options="dropDown.leadSourceOptions" label="Select lead source" @update:model-value="fnleadSource" :error="v$.formData.leadSource.$error" /></div>
          <div class="col-12"><q-select v-model="formData.device" :options="dropDown.deviceOptions" label="Select device" @update:model-value="fnDevice" :error="v$.formData.device.$error" /></div>
          <div class="col-12"><q-input v-model="formData.deviceCount" label="Device Count" :disable="deviceFlag" :error="v$.formData.deviceCount.$error" /></div>

          <div v-if="plan == 'mATM'" class="col-12">
            <q-select v-model="formData.mAtmOnboardingPlan" :options="dropDown.planNameOptions" label="Select MATM Plans" @update:model-value="fnPlanName" />
            <q-input v-model="formData.incentivePercentage" label="*percentage" disable />
            <q-input v-model="formData.minTxnVal" label="*minimum" disable />
            <q-input v-model="formData.maxIncPerTxn" label="*maximumTxnValue" disable />
          </div>

          <div class="col-12"><q-select v-model="formData.merchantCategory" :options="dropDown.merchantCategory" label="Select merchant category type" @update:model-value="fnMerchantCategory" :error="v$.formData.merchantCategory.$error" /></div>
          <div class="col-12"><q-select v-model="mdrPlan" :options="dropDown.mdrOptions" label="Select MDR Plan" @update:model-value="fnFillMdr" /></div>

          <div class="col-12"><q-input v-model="formData.debitLessthanAmount" label="*debitLessthanAmount" disable /></div>
          <div class="col-12"><q-input v-model="formData.debitGreaterthanAmount" label="*debitGreaterthanAmount" disable /></div>
          <div class="col-12"><q-input v-model="formData.stdCC" label="*stdCC" disable /></div>
          <div class="col-12"><q-input v-model="formData.premiumCC" label="*premiumCC" disable /></div>
          <div class="col-12"><q-input v-model="formData.corpCC" label="*corpCC" disable /></div>
          <div class="col-12"><q-input v-model="formData.intlCC" label="*intlCC" disable /></div>
          <div class="col-12"><q-input v-model="formData.superPremiumlCC" label="*superPremiumlCC" disable /></div>
          <div class="col-12"><q-input v-model="formData.amexDomestic" label="*amexDomestic" disable /></div>
          <div class="col-12"><q-input v-model="formData.amexInternational" label="*amexInternational" disable /></div>
          <div class="col-12"><q-input v-model="formData.upiDebitCardUpTo2000" label="*upiDebitCardUpTo2000" disable /></div>
          <div class="col-12"><q-input v-model="formData.upiDebitCardAbove2000" label="*upiDebitCardAbove2000" disable /></div>
          <div class="col-12"><q-input v-model="formData.upiPrepaidCreditCardsUpTo2000" label="*upiPrepaidCreditCardsUpTo2000" disable /></div>
          <div class="col-12"><q-input v-model="formData.upiPrepaidCreditCardsAbove2000" label="*upiPrepaidCreditCardsAbove2000" disable /></div>

          <div class="col-12"><q-select v-model="formData.plan" :options="getLeadSourceRental" label="Select plan" @update:model-value="fnPlan" :error="v$.formData.plan.$error" /></div>
          <div class="col-12"><q-input v-model="formData.setupFees" label="*setUp fees" disable /></div>
          <div class="col-12"><q-input v-model="formData.recurringFees" label="*Recurring Fees" disable /></div>
          <div class="col-12">
            <q-radio v-model="formData.posEnable" val="true" label="Enable Cash Pos" />
            <q-radio v-model="formData.posEnable" val="false" label="Disable Cash Pos" />
          </div>

          <div class="col-12 text-subtitle2">Payment Option</div>
          <div class="col-12"><q-input v-model="formData.amountCollected" label="*Amount Collected" :error="v$.formData.amountCollected.$error" /></div>
          <div class="col-12"><q-input v-model="formData.paymentMadeon" label="*Transaction Made ON" :error="v$.formData.paymentMadeon.$error" /></div>
          <div class="col-12"><q-select v-model="formData.paymentOption" :options="paymentType" label="Payment Type" emit-value map-options :error="v$.formData.paymentOption.$error" /></div>

          <div class="col-12" v-if="formData.paymentOption == 2">
            <div class="row items-center q-gutter-sm">
              <div>Upload Cheque File:</div>
              <q-btn label="Attach" color="primary" @click="$refs.chequeInput.click()" />
              <input type="file" ref="chequeInput" class="hidden" @change="fnUploadApplicationForm" accept=".png, .jpg, .pdf" />
              <div>{{ formData.paymentDocumentFile }}</div>
            </div>
          </div>
          <div class="col-12" v-if="formData.paymentOption == 1 || formData.paymentOption == 3">
            <q-input v-model="formData.referenceNumber" :label="formData.paymentOption == 1 ? '*NEFT Number' : '*SWIPE Number'" :error="v$.formData.referenceNumber.$error" />
          </div>

          <div class="col-12"><q-select v-model="formData.merchantType" :options="dropDown.merchantType" label="Select merchant type" :error="v$.formData.merchantType.$error" /></div>
        </div>
      </q-card-section>
      <q-card-actions align="end" class="q-pa-md">
        <q-btn flat label="Cancel" @click="emitfnzEditshowConvertToSat(false)" />
        <q-btn label="Submit to SAT" color="purple-9" @click="submitShortLead" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, email, minLength, maxLength, requiredIf } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "convertToSat",
  props: ["propShowConvertToSat", "propRowDetails"],
  setup() { return { v$: useVuelidate() }; },
  data() {
    return {
      toggleModel: this.propShowConvertToSat,
      paymentType: [{ label: "Cheque", value: 2 }, { label: "NEFT", value: 1 }, { label: "SWIPE", value: 3 }],
      mdrPlan: "",
      plan: "",
      deviceFlag: false,
      formData: {
        id: this.propRowDetails.id, leadNumber: this.propRowDetails.leadNumber, leadName: this.propRowDetails.leadName,
        shortleadDate: this.propRowDetails.shortleadDate, contactNumber: this.propRowDetails.contactNumber,
        alternateContactNumber: this.propRowDetails.alternateContactNumber, email: this.propRowDetails.email,
        leadAddress: this.propRowDetails.leadAddress, pincode: this.propRowDetails.pincode, city: this.propRowDetails.city,
        state: this.propRowDetails.state, leadCategory: 1, merchantState: "", district: "", village: "", subDistrict: "", tier: "",
        leadSource: JSON.stringify(this.propRowDetails.leadSource), device: JSON.stringify(this.propRowDetails.device),
        deviceId: this.propRowDetails.device.id, deviceCount: this.propRowDetails.deviceCount, debitLessthanAmount: 0,
        debitGreaterthanAmount: 0, stdCC: 0, premiumCC: 0, corpCC: 0, intlCC: 0, superPremiumlCC: 0, amexDomestic: 0,
        amexInternational: 0, upiDebitCardUpTo2000: 0, upiDebitCardAbove2000: 0, upiPrepaidCreditCardsUpTo2000: 0,
        upiPrepaidCreditCardsAbove2000: 0, plan: "", planId: "", setupFees: 0, recurringFees: 0, posEnable: "",
        amountCollected: "", paymentMadeon: "", paymentOption: 1, applicationFile: "475_FirstPageofApplicationForm_1571124179606",
        applicationFileMimeType: "image/*", documentUploadedType: 1, kyc: false, leadDocuments: [], latitude: 0.0,
        leadVerificationStatus: [], longitude: 0.0, marsDeviceDetails: [], paymentDocumentFile: "", posIncentive: 0,
        pricing: false, priority: false, reason: "", referenceNumber: "", paymentDocumentMimeType: "", tidReleaseDate: 0,
        updatedAt: 0, verificationStatusReason: "", verifiedSATDate: 0, wipLeadDate: 0, branch: "", merchantType: "",
        leadSource1: this.propRowDetails.leadSource.id, merchantCategory1: "", mAtmOnboardingPlan: null, minTxnVal: 0,
        maxIncPerTxn: 0, incentivePercentage: 0, vasInstanceMapping: this.propRowDetails.vasInstanceMapping,
        bijlipaySwitch: this.propRowDetails.bijlipaySwitch, ownerFirstName: this.propRowDetails.ownerFirstName,
        ownerLastName: this.propRowDetails.ownerLastName, ownerDOB: this.propRowDetails.ownerDOB, merchantCategory: ""
      },
      dropDown: {
        deviceOptions: [], leadSourceOptions: [], merchantState: [], merchantDistrict: [], merchantSubDistrict: [],
        merchantTownOrVillageDetails: [], merchantCategory: [], planNameOptions: [], merchantType: [], mdrOptions: []
      }
    };
  },
  validations() {
    return {
      formData: {
        leadNumber: { required }, leadName: { required },
        contactNumber: { required, minLength: minLength(10), maxLength: maxLength(10) },
        email: { email, required }, leadAddress: { required }, pincode: { required }, city: { required },
        state: { required }, merchantState: { required }, district: { required }, village: { required },
        subDistrict: { required }, leadSource: { required }, device: { required }, deviceCount: { required },
        debitLessthanAmount: { required }, debitGreaterthanAmount: { required }, stdCC: { required },
        premiumCC: { required }, corpCC: { required }, intlCC: { required }, superPremiumlCC: { required },
        amexDomestic: { required }, amexInternational: { required }, upiDebitCardUpTo2000: { required },
        upiDebitCardAbove2000: { required }, upiPrepaidCreditCardsUpTo2000: { required },
        upiPrepaidCreditCardsAbove2000: { required }, referenceNumber: { required }, plan: { required },
        setupFees: { required }, recurringFees: { required }, amountCollected: { required },
        paymentMadeon: { required }, paymentOption: { numeric, required }, merchantType: { required },
        merchantCategory: { required }
      }
    };
  },
  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("merchantCategory", ["getActiveMerchantCategory"]),
    ...mapGetters("mAtmPlanDropdown", ["getMatmPlanDropdownDetails", "getMAtmPlanDropdown"]),
    ...mapGetters("CategoryBasedMdr", ["categoryBasedMdr"]),
    ...mapGetters("appMerchantType", ["getappMerchantDocumentType"]),
    ...mapGetters("categoryBasedRental", ["categoryBasedRental"]),
    ...mapGetters("LeadSourceBasedRental", ["getLeadSourceRental"]),
    ...mapGetters("merchantTierMapping", ["getMerchantTierMappingStateDetails", "getMerchantTierMappingVillageTierDetails", "getMerchantTierMappingDistrictDetails", "getMerchantTierMappingTownOrVillageDetails", "getMerchantTierMappingSubDistrictDetails"])
  },
  created() {
    this.ajaxLoadDataForDeviceTypeTable();
    this.ajaxLoadDataForMatmPlanDetails();
    this.plan = (this.propRowDetails.vasInstanceMapping || "").replaceAll('"', "").replace("[", "").replace("]", "");
    if (this.propRowDetails.device?.deviceName == "Q161_PRO_SQR") {
      this.formData.deviceCount = 1;
      this.deviceFlag = true;
    }
    this.LEAD_AND_DEVICE_BASED_RENTAL({ leadSource: this.propRowDetails.leadSource, device: this.propRowDetails.device });
  },
  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("merchantCategory", ["MERCHANT_CATEGORY_ACTIVE_LIST"]),
    ...mapActions("mAtmPlanDropdown", ["MATM_PLAN_DROPDOWN_DETAILS", "FETCH_ALL_PLAN_DETAILS"]),
    ...mapActions("CategoryBasedMdr", ["CATEGORY_BASED_MDR_PLAN"]),
    ...mapActions("LeadSourceBasedRental", ["LEAD_BASED_RENTAL", "LEAD_AND_DEVICE_BASED_RENTAL", "LEAD_AND_DEVICE_BASED_RENTAL1"]),
    ...mapActions("soTosat", ["SO_TO_SAT"]),
    ...mapActions("appMerchantType", ["APP_MERCHANT_DOCUMENT_TYPE"]),
    ...mapActions("shortLeadInfo", ["FETCH_SHORT_LEAD"]),
    ...mapActions("categoryBasedRental", ["CATEGORY_BASED_RENTAL_PLAN"]),
    ...mapActions("SatLeadValidation", ["FEED_CHEQUE_FORM"]),
    ...mapActions("merchantTierMapping", ["MERCHANT_TIER_MAPPING_GET_STATE_DETAILS", "MERCHANT_TIER_MAPPING_SEARCH_DISTRICT", "MERCHANT_TIER_MAPPING_SUB_DISTRICT_DETAILS", "MERCHANT_TIER_MAPPING_TOWN_OR_VILLAGE_DETAILS", "MERCHANT_TIER_MAPPING_VILLAGE_TIER_DETAILS"]),

    emitfnzEditshowConvertToSat(val) { this.$emit("emitEditshowConvertToSat", val); },
    async submitShortLead() {
      const isValid = await this.v$.$validate();
      if (!isValid) { this.$q.notify("Please review fields again."); return; }
      if (this.formData.paymentOption == 2 && !this.formData.paymentDocumentFile) {
        this.$q.notify({ color: "amber", message: "Please attach the Cheque File" });
        return;
      }
      this.$q.loading.show({ message: "Please Wait" });
      const payload = {
        data1: { ...this.formData, leadSource: JSON.parse(this.formData.leadSource), device: JSON.parse(this.formData.device),
          merchantDistrictName: this.formData.district, merchantStateName: this.formData.merchantState,
          merchantVillageName: this.formData.village, merchantSubDistrictName: this.formData.subDistrict, merchantTier: this.formData.tier
        },
        url: { id: this.propRowDetails.id, action: 2 }
      };
      this.SO_TO_SAT(payload).then(() => {
        this.FETCH_SHORT_LEAD();
        this.emitfnzEditshowConvertToSat(false);
        this.$q.notify({ color: "positive", message: "Wip Lead successfully created!" });
        this.$router.push("/sat/lead/validation");
      }).catch(err => {
        this.$q.notify({ color: "negative", message: err.body?.message || "Please Try Again Later !" });
      }).finally(() => this.$q.loading.hide());
    },
    fnUploadApplicationForm(e) {
      this.$q.loading.show({ message: "Uploading file .." });
      let fd = new FormData();
      fd.append("file", e.target.files[0]);
      fd.append("fileNameOriginal", "Cheque");
      this.FEED_CHEQUE_FORM({ files: fd, fileNameOriginal: "Cheque" }).then(res => {
        this.formData.paymentDocumentFile = res.fileName;
        this.formData.paymentDocumentMimeType = res.mimeType;
        this.$q.notify({ color: "positive", message: "File Successfully Uploaded" });
      }).catch(() => {
        this.$q.notify({ color: "negative", message: "Failed to upload document" });
      }).finally(() => this.$q.loading.hide());
    },
    getdistrict(val) {
      this.MERCHANT_TIER_MAPPING_SEARCH_DISTRICT({ Statename: val }).then(() => {
        this.dropDown.merchantDistrict = this.getMerchantTierMappingDistrictDetails.map(v => ({ value: v.districtName, label: v.districtName }));
      });
    },
    getSubDistrict(val) {
      this.MERCHANT_TIER_MAPPING_SUB_DISTRICT_DETAILS({ Statename: this.formData.merchantState, Districtname: val }).then(() => {
        this.dropDown.merchantSubDistrict = this.getMerchantTierMappingSubDistrictDetails.map(v => ({ value: v.subDistrictName, label: v.subDistrictName }));
      });
    },
    getTownOrVillage(val) {
      this.MERCHANT_TIER_MAPPING_TOWN_OR_VILLAGE_DETAILS({ Statename: this.formData.merchantState, Districtname: this.formData.district, SubDistrictname: val }).then(() => {
        this.dropDown.merchantTownOrVillageDetails = this.getMerchantTierMappingTownOrVillageDetails.map(v => ({ value: v.townVillageName, label: v.townVillageName }));
      });
    },
    getVillageTier(val) {
      this.MERCHANT_TIER_MAPPING_VILLAGE_TIER_DETAILS({ Statename: this.formData.merchantState, Districtname: this.formData.district, SubDistrictname: this.formData.subDistrict, Villagename: val }).then(() => {
        this.formData.tier = this.getMerchantTierMappingVillageTierDetails[0] || "";
      });
    },
    ajaxLoadDataForDeviceTypeTable() {
      this.FETCH_DEVICES_DATA().then(() => { this.dropDown.deviceOptions = this.getAllDevicesInfo.map(v => ({ label: v.deviceName, value: JSON.stringify(v) })); });
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => { this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(v => ({ label: v.sourceName, value: JSON.stringify(v) })); });
      this.MERCHANT_TIER_MAPPING_GET_STATE_DETAILS().then(() => { this.dropDown.merchantState = this.getMerchantTierMappingStateDetails.map(v => ({ label: v.stateName, value: v.stateName })); });
      this.MERCHANT_CATEGORY_ACTIVE_LIST().then(() => { this.dropDown.merchantCategory = this.getActiveMerchantCategory.map(v => ({ label: v.merchantCategoryName, value: v })); });
      this.APP_MERCHANT_DOCUMENT_TYPE().then(() => { this.dropDown.merchantType = this.getappMerchantDocumentType.map(v => ({ label: v.merchantTypeName, value: v })); });
    },
    ajaxLoadDataForMatmPlanDetails() {
      this.MATM_PLAN_DROPDOWN_DETAILS().then(() => { this.dropDown.planNameOptions = this.getMatmPlanDropdownDetails.map(v => ({ label: v.planName, value: v })); });
    },
    fnleadSource(val) {
      const data = JSON.parse(val);
      this.formData.leadSource1 = data.id;
      this.LEAD_BASED_RENTAL(data.id);
    },
    fnDevice(val) {
      const data = JSON.parse(val);
      this.formData.deviceId = data.id;
      if (data.deviceName == "Q161_PRO_SQR") { this.formData.deviceCount = 1; this.deviceFlag = true; }
      else { this.deviceFlag = false; }
      this.LEAD_AND_DEVICE_BASED_RENTAL1({ leadSource: this.formData.leadSource1, device: data.id });
    },
    fnPlanName(val) {
      this.FETCH_ALL_PLAN_DETAILS({ leadSource: this.formData.leadSource1, device: this.formData.deviceId, plan: val.id }).then(() => {
        this.formData.incentivePercentage = this.getMAtmPlanDropdown.incentivePercentage;
        this.formData.minTxnVal = this.getMAtmPlanDropdown.minTxnVal;
        this.formData.maxIncPerTxn = this.getMAtmPlanDropdown.maxIncPerTxn;
      });
    },
    fnPlan(val) {
      this.CATEGORY_BASED_RENTAL_PLAN({ leadSource: this.formData.leadSource1, device: this.formData.deviceId, plan: val.id }).then(() => {
        this.formData.setupFees = this.categoryBasedRental.setupFees * this.formData.deviceCount;
        this.formData.recurringFees = this.categoryBasedRental.monthlyFees * this.formData.deviceCount;
      });
    },
    fnMerchantCategory(val) {
      this.formData.merchantCategory1 = val.id;
      this.CATEGORY_BASED_MDR_PLAN({ leadSource: this.formData.leadSource1, device: this.formData.deviceId, merchantType: val.id }).then(() => {
        this.dropDown.mdrOptions = this.categoryBasedMdr.map(v => ({ label: v.mdrPlanName, value: JSON.stringify(v) }));
      });
    },
    fnFillMdr(val) {
      const mdr = JSON.parse(val);
      Object.assign(this.formData, {
        debitLessthanAmount: mdr.debitLessthanAmount, debitGreaterthanAmount: mdr.debitGreaterthanAmount,
        stdCC: mdr.stdCC, premiumCC: mdr.premiumCC, corpCC: mdr.corpCC, intlCC: mdr.intlCC,
        superPremiumlCC: mdr.superPremiumlCC, amexDomestic: mdr.amexDomestic, amexInternational: mdr.amexInternational,
        upiDebitCardUpTo2000: mdr.upiDebitCardUpTo2000, upiDebitCardAbove2000: mdr.upiDebitCardAbove2000,
        upiPrepaidCreditCardsUpTo2000: mdr.upiPrepaidCreditCardsUpTo2000, upiPrepaidCreditCardsAbove2000: mdr.upiPrepaidCreditCardsAbove2000
      });
    }
  }
};
</script>