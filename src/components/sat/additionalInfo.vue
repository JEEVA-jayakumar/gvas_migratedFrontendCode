<template>
  <div>
    <q-dialog
      class="customModalOverlay"
      v-model="toggleModel"
      @hide="emitToggleReject"
      @escape-key="emitToggleReject"
      persistent
    >
      <q-card style="min-width: 70vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="q-title q-px-lg q-py-md text-center justify-center text-weight-regular bottom-border text-grey-9 full-width">
            <div class="col q-title">Additional Info</div>
          </div>
        </q-card-section>

        <q-card-section class="q-px-md q-pa-md">
          <div class="row q-col-gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                @blur="v$.formdata.branchZone.$touch"
                :error="v$.formdata.branchZone.$error"
                v-model="formdata.branchZone"
                label="Zone*"
                :options="getAllZone"
                clearable
                @clear="fnClearZone"
                @update:model-value="fnFetchZone"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                @blur="v$.formdata.iaDistrict.$touch"
                :error="v$.formdata.iaDistrict.$error"
                v-model="formdata.iaDistrict"
                label="IA_District*"
                :options="getAllDistrict"
                @update:model-value="fnFetchBranchName"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                disable
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.raDistrict"
                label="RA_District*"
                :options="getAllDistrict"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                disable
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.od1District"
                label="OD1_District*"
                :options="getAllDistrict"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                disable
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.od2District"
                label="OD2_District*"
                :options="getAllDistrict"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                @blur="v$.formdata.installationBranchCode.$touch"
                :error="v$.formdata.installationBranchCode.$error"
                v-model="formdata.installationBranchCode"
                label="InstallationBranchName*"
                :options="getAllBranchName"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                use-input
                fill-input
                hide-selected
                color="grey-9"
                @blur="v$.formdata.lorState.$touch"
                :error="v$.formdata.lorState.$error"
                v-model="formdata.lorState"
                label="IOR_STATE(type min 3 characters)*"
                placeholder="Start typing ..*"
                :options="iorStateOptions"
                @filter="searchIorState"
              />
            </div>
            <div class="col-md-6">
              <q-select
                use-input
                fill-input
                hide-selected
                color="grey-9"
                @blur="v$.formdata.pin.$touch"
                :error="v$.formdata.pin.$error"
                v-model="formdata.pin"
                label="Pincode"
                placeholder="Start typing ..*"
                @update:model-value="pincodeBasedDistrict"
                :options="axisBankPincodeOptions"
                @filter="searchAxisBankPincode"
              />
            </div>

            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.state"
                label="State*"
                @update:model-value="pincodeandDistrictBasedCity"
                :options="getPincodeBasedDistrict"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                @blur="v$.formdata.city.$touch"
                :error="v$.formdata.city.$error"
                v-model="formdata.city"
                label="City*"
                :options="getPincodeDistrict"
                @update:model-value="citybasedlocation"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.iaLocation"
                label="IA_LOCATION*"
                :options="getCityBasedLocation"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.iaSalutation"
                label="IA_Salution*"
                :options="iaSalutationOptions"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.iaGender"
                label="IA_Gender*"
                :options="iaGenderOptions"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.od1Salutation"
                label="OD1_Salutation*"
                :options="od1SalutationOptions"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.od1Gender"
                label="OD1_Gender*"
                :options="od1GenderOptions"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.od2Salutation"
                label="OD2_Salutation*"
                :options="od2SalutationOptions"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                placeholder="Choose from the below*"
                color="grey-9"
                v-model="formdata.od2Gender"
                label="OD2_Gender*"
                :options="od2GenderOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey-9"
            @click="emitToggleReject"
          />
          <q-btn
            label="Submit To Mars"
            color="positive"
            @click="finalFormSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  props: ["showRejectAdditionalInfo", "propToggleadditionalInfo"],

  data() {
    return {
      toggleModel: this.showRejectAdditionalInfo,
      formdata: {
        installationBranchCode: "",
        iaLocation: "",
        iaDistrict: "",
        branchZone: "",
        raDistrict: "",
        od1District: "",
        od2District: "",
        lorState: "",
        iaSalutation: "",
        iaGender: "",
        od1Salutation: "",
        od1Gender: "",
        od2Salutation: "",
        od2Gender: "",
        state: "",
        city: "",
        pin: "",
      },
      iorStateOptions: [],
      axisBankPincodeOptions: [],
      iaSalutationOptions: [
        { label: "MR", value: "Mr" },
        { label: "MRS", value: "Mrs" },
        { label: "Ms", value: "Ms" },
      ],
      iaGenderOptions: [
        { label: "Male", value: "M" },
        { label: "FeMale", value: "F" },
        { label: "Transgender", value: "T" },
      ],
      od1SalutationOptions: [
        { label: "MR", value: "Mr" },
        { label: "MRS", value: "Mrs" },
        { label: "MS", value: "Ms" },
      ],
      od1GenderOptions: [
        { label: "Male", value: "M" },
        { label: "FeMale", value: "F" },
        { label: "Transgender", value: "T" },
      ],
      od2SalutationOptions: [
        { label: "MR", value: "Mr" },
        { label: "MRS", value: "Mrs" },
        { label: "MS", value: "Ms" },
      ],
      od2GenderOptions: [
        { label: "Male", value: "M" },
        { label: "FeMale", value: "F" },
        { label: "Transgender", value: "T" },
      ],
      merchant: null,
      propLeadDeatils: null,
    };
  },
  validations() {
    return {
      formdata: {
        branchZone: { required },
        city: { required },
        iaDistrict: { required },
        installationBranchCode: { required },
        lorState: { required },
        pin: { required },
      }
    };
  },
  computed: {
    ...mapGetters("District", ["getAllDistrict"]),
    ...mapGetters("BranchName", ["getAllBranchName"]),
    ...mapGetters("PincodeBasedDistrict", ["getPincodeBasedDistrict"]),
    ...mapGetters("AllZone", ["getAllZone"]),
    ...mapGetters("StateBasedDistrict", ["getPincodeDistrict"]),
    ...mapGetters("StateName", ["getiorState"]),
    ...mapGetters("AxisBankPincode", ["getAxisBankPincode"]),
    ...mapGetters("CityBasedLocation", ["getCityBasedLocation"]),
  },
  beforeMount() {
    const info = this.propToggleadditionalInfo;
    this.merchant = info.merchant;
    this.propLeadDeatils = info.propLeadDeatils;
    this.formdata.pin = this.merchant.companyInformation.registeredPin;
  },
  created() {
    this.FETCH_ALL_ZONE();
    this.FETCH_ALL_DISTRICT();
  },
  methods: {
    ...mapActions("District", ["FETCH_ALL_DISTRICT"]),
    ...mapActions("BranchName", ["FECTCH_ALL_BRANCH"]),
    ...mapActions("PincodeBasedDistrict", ["FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT"]),
    ...mapActions("StateBasedDistrict", ["FETCH_AXIS_BANK_PINCODE_DISTRICT"]),
    ...mapActions("CityBasedLocation", ["FETCH_AXIS_BANK_CITY_LOCATION"]),
    ...mapActions("StateName", ["FETCH_IOR_STATE"]),
    ...mapActions("AxisBankPincode", ["FETCH_AXIS_BANK_PINCODE_LOCATION"]),
    ...mapActions("mars_dataSubmit", ["MARS_DATA_SUBMIT_INTERNAL", "MARS_DATA_SUBMIT_EXTERNAL", "MARS_DATA_EXTERNAL_SUBMIT_RESPONSE", "SUBMIT_SUB_TID_MERCHANT_REF_CODE_DETAILS"]),
    ...mapActions("AllZone", ["FETCH_ALL_ZONE"]),
    ...mapActions("leadInformationVasMapping", ["SAVEING_THE_LEAD_STATUS_DETAILS"]),

    emitToggleReject() {
      this.$emit("closeRejectModel");
    },
    pincodeBasedDistrict() {
      this.FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT(this.formdata.pin);
    },
    searchIorState(val, update, abort) {
      if (val.length < 3) { abort(); return; }
      this.FETCH_IOR_STATE(val).then(() => {
        update(() => { this.iorStateOptions = this.getiorState; });
      });
    },
    citybasedlocation() {
      this.FETCH_AXIS_BANK_CITY_LOCATION(this.formdata.city);
    },
    searchAxisBankPincode(val, update, abort) {
      if (val.length < 3) { abort(); return; }
      this.FETCH_AXIS_BANK_PINCODE_LOCATION(val).then(() => {
        update(() => { this.axisBankPincodeOptions = this.getAxisBankPincode; });
      });
    },
    pincodeandDistrictBasedCity() {
      this.FETCH_AXIS_BANK_PINCODE_DISTRICT(this.formdata.pin + "/" + this.formdata.state);
    },
    fnFetchZone() {
      this.FETCH_ALL_DISTRICT(this.formdata.branchZone);
    },
    fnClearZone() {
      this.formdata.branchZone = "";
    },
    fnFetchBranchName() {
      this.FECTCH_ALL_BRANCH(this.formdata.iaDistrict);
      this.formdata.raDistrict = this.formdata.iaDistrict;
      this.formdata.od1District = this.formdata.iaDistrict;
      this.formdata.od2District = this.formdata.iaDistrict;
    },
    async finalFormSubmit() {
      const isCorrect = await this.v$.formdata.$validate();
      if (!isCorrect) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
        return;
      }

      this.$q.loading.show({ message: "Validating .." });

      let finalRequest = {
        action: 2,
        merchant: {
          ...this.merchant,
          leadId: this.$route.params.id,
          additionalInfo: this.formdata
        }
      };

      this.MARS_DATA_SUBMIT_INTERNAL(finalRequest)
        .then(() => {
          this.$q.loading.show({ message: "Sending data to mars" });

          this.MARS_DATA_SUBMIT_EXTERNAL({
            params: finalRequest,
            leadStatus: this.propLeadDeatils.leadStatus,
            refNumber: this.propLeadDeatils.merchantRefCode,
          })
          .then((response) => {
            let feed_paramaters = response.data || {
              applicationNumber: this.propLeadDeatils.applicationNumber,
              merchantRefCode: this.propLeadDeatils.merchantRefCode,
            };

            if (this.propLeadDeatils.leadSource.multiTidEnabled) {
              this.SUBMIT_SUB_TID_MERCHANT_REF_CODE_DETAILS({
                merchantRefCode: feed_paramaters.merchantRefCode,
                marsDeviceId: this.propToggleadditionalInfo.data.id,
              });
              this.SAVEING_THE_LEAD_STATUS_DETAILS({ leadId: this.$route.params.id, status: 104 });
            }

            this.MARS_DATA_EXTERNAL_SUBMIT_RESPONSE({
              request: feed_paramaters,
              leadId: this.$route.params.id,
            }).then(() => {
              this.$q.notify({
                color: "positive",
                message: "Successfully submitted to MARS",
                icon: "thumb_up",
              });
              this.$emit("closeRejectModel", "refresh");
              this.$q.loading.hide();
            });
          })
          .catch((error) => {
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Submission failed",
              icon: "thumb_down",
            });
            this.$q.loading.hide();
          });
        })
        .catch(() => this.$q.loading.hide());
    }
  }
};
</script>
