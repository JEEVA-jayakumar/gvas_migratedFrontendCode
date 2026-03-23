<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs class="shadow-1" color="tertiary" align="justify" v-model="shortlead">
            <q-tab name="shortlead" label="Additional Terminals" />
          </q-tabs>
          <q-tab-panels v-model="shortlead" animated>
            <q-tab-panel name="shortlead">
              <div class="q-pa-md">
                <form>
                  <div class="row q-col-gutter-md">
                    <div class="col-md-6">
                      <q-input color="grey-9" disable v-model.trim="additionalTerminal.mid" label="MID*" />
                    </div>
                    <div class="col-md-6">
                      <q-input color="grey-9" disable v-model.trim="additionalTerminal.tid" label="TID*" />
                    </div>
                    <div class="col-md-6">
                      <q-input color="grey-9" disable v-model.trim="additionalTerminal.institutionCode" label="Institution code*" />
                    </div>
                    <div class="col-md-6">
                      <q-input
                        color="grey-9"
                        :disable="!!propRowDetails.leadInformation?.merchantRefCode"
                        v-model.trim="additionalTerminal.merchantRefCode"
                        :error="$v.additionalTerminal.merchantRefCode.$error"
                        label="Merchant RefCode*"
                      />
                    </div>
                    <div class="col-md-6">
                      <q-input color="grey-9" disable v-model.trim="additionalTerminal.applicationNumber" label="Application Number*" />
                    </div>
                    <div class="col-md-6">
                      <q-input
                        v-model.trim="additionalTerminal.AdditionalTerminalDetails.numberOfTerminals"
                        @blur="$v.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals.$touch"
                        :error="$v.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals.$error"
                        color="grey-9"
                        label="*Number Of Terminals"
                      />
                    </div>
                    <div class="col-md-6">
                      <q-input color="grey-9" disable v-model.trim="additionalTerminal.AdditionalTerminalDetails.address" label="Address*" />
                    </div>
                    <div class="col-md-6">
                      <q-input color="grey-9" disable v-model.trim="additionalTerminal.AdditionalTerminalDetails.pinCode" label="Pincode*" />
                    </div>
                    <div class="col-md-6">
                      <q-select
                        @blur="fnClrCity"
                        color="grey-9"
                        v-model="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="10"
                        label="City (type min 3 characters)*"
                        :options="cityOptionsSearch"
                        @filter="fnMarsCitySearch"
                        @update:model-value="partnerCitySelected"
                      />
                    </div>
                    <div class="col-md-6">
                      <q-select
                        @blur="fnClrState"
                        color="grey-9"
                        v-model="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="10"
                        label="State (type min 3 characters)*"
                        :options="stateOptionsSearch"
                        @filter="fnMarsStateSearch"
                        @update:model-value="partnerStateSelected"
                      />
                    </div>
                  </div>
                  <div class="row justify-center q-mt-lg">
                    <q-btn label="Submit" color="purple-9" @click="fnSubmitBankDetails" />
                  </div>
                </form>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "additionalTidform",
  data() {
    return {
      cityOptions: [],
      stateOptions: [],
      cityOptionsSearch: [],
      stateOptionsSearch: [],
      propRowDetails: {},
      shortlead: "shortlead",
      companyRegisteredCitySelected: false,
      companyRegisteredStateSelected: false,
      additionalTerminal: {
        institutionCode: "",
        merchantRefCode: "",
        applicationNumber: "",
        mid: "",
        tid: "",
        AdditionalTerminalDetails: {
          numberOfTerminals: "",
          citySerNumber: "",
          citySerNumberLabel: "",
          stateSerNumberLabel: "",
          stateSerNumber: "",
          pinCode: "",
          address: "",
        },
      }
    };
  },
  validations: {
    additionalTerminal: {
      merchantRefCode: { required },
      AdditionalTerminalDetails: {
        numberOfTerminals: { required }
      }
    }
  },
  beforeMount() {
    this.propRowDetails = this.$route.params.data || {};
    this.additionalTerminal.mid = this.propRowDetails.mid;
    this.additionalTerminal.tid = this.propRowDetails.tid;
    this.additionalTerminal.merchantRefCode = this.propRowDetails.leadInformation?.merchantRefCode;
    this.additionalTerminal.applicationNumber = this.propRowDetails.applicationNumber;
    this.additionalTerminal.AdditionalTerminalDetails.address = this.propRowDetails.deviceAddress;
    this.additionalTerminal.institutionCode = this.getadditionalTidVerifyData;
    this.additionalTerminal.AdditionalTerminalDetails.pinCode = this.propRowDetails.pincode;
    this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = this.propRowDetails.city;
    this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = this.propRowDetails.state;
    this.fetchmarsCity(this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel, this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel);
  },
  computed: {
    ...mapGetters("mars_additional_tid", ["additionalTidFromMars", "additionalTidFromBackEnd"]),
    ...mapGetters("mars_additional_city", ["marsAdditionalCity"]),
    ...mapGetters("additionalTid", ["getadditionalTidVerifyData"]),
    ...mapGetters("mars_additional_state", ["marsAdditionalState"]),
  },
  methods: {
    ...mapActions("mars_additional_tid", ["ADDITIONAL_TID_FROM_MARS", "ADDITIONAL_TID_FROM_BACK_END"]),
    ...mapActions("mars_additional_city", ["CITY_FORM_ADDITIONAL_TID"]),
    ...mapActions("additionalTid", ["ADDITIONAL_TID_VERIFY_DATA"]),
    ...mapActions("mars_additional_state", ["STATE_FROM_ADDITIONAL_TID"]),

    fetchmarsCity(cityLabel, stateLabel) {
      this.CITY_FORM_ADDITIONAL_TID(cityLabel).then(() => {
        this.cityOptions = (this.marsAdditionalCity.items || []).map(oo => ({ label: oo.name, value: oo.code }));
        if (this.cityOptions[0]) this.additionalTerminal.AdditionalTerminalDetails.citySerNumber = this.cityOptions[0].value;
      });
      this.STATE_FROM_ADDITIONAL_TID(stateLabel).then(() => {
        this.stateOptions = (this.marsAdditionalState.items || []).map(oo => ({ label: oo.name, value: oo.code }));
        if (this.stateOptions[0]) this.additionalTerminal.AdditionalTerminalDetails.stateSerNumber = this.stateOptions[0].value;
      });
    },
    fnMarsCitySearch(val, update) {
      if (val.length < 3) { update(() => { this.cityOptionsSearch = []; }); return; }
      update(() => { this.cityOptionsSearch = this.cityOptions.filter(v => v.label.toLowerCase().includes(val.toLowerCase())); });
    },
    fnMarsStateSearch(val, update) {
      if (val.length < 3) { update(() => { this.stateOptionsSearch = []; }); return; }
      update(() => { this.stateOptionsSearch = this.stateOptions.filter(v => v.label.toLowerCase().includes(val.toLowerCase())); });
    },
    partnerCitySelected(item) {
      if (item) {
        this.companyRegisteredCitySelected = true;
        this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = item.label;
        this.additionalTerminal.AdditionalTerminalDetails.citySerNumber = item.value;
      }
    },
    fnClrCity() { if (!this.companyRegisteredCitySelected) this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = ""; },
    partnerStateSelected(item) {
      if (item) {
        this.companyRegisteredStateSelected = true;
        this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = item.label;
        this.additionalTerminal.AdditionalTerminalDetails.stateSerNumber = item.value;
      }
    },
    fnClrState() { if (!this.companyRegisteredStateSelected) this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = ""; },
    fnSubmitBankDetails() {
      this.$v.additionalTerminal.$touch();
      if (this.$v.additionalTerminal.$error) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Please fill all mandatory fields", icon: "info" });
        return;
      }
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Validating .." });
      this.$q.localStorage.set("a_t", this.additionalTerminal.institutionCode);
      const finalFormRequest = _.cloneDeep(this.additionalTerminal);
      delete finalFormRequest.AdditionalTerminalDetails.citySerNumberLabel;
      delete finalFormRequest.AdditionalTerminalDetails.stateSerNumberLabel;
      let params = {
        Id: { leadId: this.propRowDetails.leadInformation.id },
        Count: { count: this.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals },
        Datas: { additionalTerminal: finalFormRequest }
      };
      this.ADDITIONAL_TID_FROM_MARS({ additionalTerminal: finalFormRequest }).then(res => {
        if (res.status === 204) {
          this.$q.loading.hide();
          this.$q.notify({ type: "warning", color: "amber-9", position: "bottom", message: res.data?.message || "No content" });
        } else {
          this.ADDITIONAL_TID_FROM_BACK_END({ params }).then(() => {
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", position: "bottom", message: "Saved successfully", icon: "thumb_up" });
            this.$router.go(-1);
          });
        }
      }).catch(err => {
        this.$q.loading.hide();
        this.$q.notify({ color: "negative", position: "bottom", icon: "thumb_down", message: err.data?.message || "Error occurred" });
      });
    }
  }
};
</script>
