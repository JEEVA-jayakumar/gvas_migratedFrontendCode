<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="shortlead"
            class="shadow-1"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="shortlead" label="Additional Terminals" />
          </q-tabs>

          <q-tab-panels v-model="shortlead" animated>
            <q-tab-panel name="shortlead">
              <div>
                <div class="col-md-6 q-my-md" align="right">
                  <div class="col group"></div>
                </div>
                <form>
                  <div class="q-px-md">
                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm q-py-sm">
                        <div class="col-md-6">
                          <q-input color="grey-9" disable v-model="additionalTerminal.mid" label="MID*" />
                        </div>
                        <div class="col-md-6">
                          <q-input color="grey-9" disable v-model="additionalTerminal.tid" label="TID*" />
                        </div>
                        <div class="col-md-6">
                          <q-input color="grey-9" disable v-model="additionalTerminal.institutionCode"
                            label="Institution code*" />
                        </div>
                        <div class="col-md-6">
                          <q-input color="grey-9" :disable="!!this.propRowDetails.leadInformation?.merchantRefCode"
                            v-model="additionalTerminal.merchantRefCode"
                            :error="v$.additionalTerminal.merchantRefCode.$error"
                            label="Merchant RefCode*" />
                        </div>
                        <div class="col-md-6">
                          <q-input color="grey-9" disable v-model="additionalTerminal.applicationNumber"
                            label="Application Number*" />
                        </div>
                        <div class="col-md-6">
                          <q-input v-model="
                            additionalTerminal.AdditionalTerminalDetails
                              .numberOfTerminals
                          " @blur="
         v$.additionalTerminal.AdditionalTerminalDetails
         .numberOfTerminals.$touch();
       " :error="
           v$.additionalTerminal.AdditionalTerminalDetails
           .numberOfTerminals.$error
           " class="text-weight-regular text-grey-8" color="grey-9" label="*Number Of Terminals"
                            placeholder="Number Of Terminals" />
                        </div>
                        <div class="col-md-6">
                          <q-input color="grey-9" disable v-model="
                            additionalTerminal.AdditionalTerminalDetails
                              .address
                          " label="Address*" />
                        </div>

                        <div class="col-md-6">
                          <q-input color="grey-9" disable v-model="
                            additionalTerminal.AdditionalTerminalDetails
                              .pinCode
                          " label="Pincode*" />
                        </div>

                        <div class="col-md-6">
                          <q-select map-options emit-value
                            @blur="fnClrCity"
                            color="grey-9"
                            v-model="additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="10"
                            label="City (type min 3 characters)*"
                            placeholder="Start typing ..*"
                            :options="cityOptionsSearch"
                            @filter="fnMarsCitySearch"
                            @update:model-value="partnerCitySelected"
                          />
                        </div>
                        <div class="col-md-6">
                          <q-select map-options emit-value
                            @blur="fnClrState"
                            color="black-9"
                            v-model="additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="10"
                            label="state (type min 3 characters)*"
                            placeholder="Start typing ..*"
                            :options="stateOptionsSearch"
                            @filter="fnMarsStateSearch"
                            @update:model-value="partnerStateSelected"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="full-width group q-mt-md" align="center">
                    <q-btn size="md" type="button" color="purple-9" @click="fnSubmitBankDetails(additionalTerminal)">
                      Submit</q-btn>
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
import { useVuelidate } from '@vuelidate/core';

import {
  required,
} from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from 'lodash';

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: "additionalTidFromMars",
  data() {
    return {
      ifscset: [],
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
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
      },
    };
  },
  validations: {
    additionalTerminal: {
      merchantRefCode: {
        required,
      },
      AdditionalTerminalDetails: {
        numberOfTerminals: {
          required,
        },
      },
    },
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
    this.fetchmarsCity(
      this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel,
      this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel
    );
  },

  computed: {
    ...mapGetters("mars_additional_tid", [
      "additionalTidFromMars",
      "additionalTidFromBackEnd",
    ]),
    ...mapGetters("mars_additional_city", ["marsAdditionalCity"]),
    ...mapGetters("additionalTid", ["getadditionalTidVerifyData"]),
    ...mapGetters("mars_additional_state", ["marsAdditionalState"]),
  },

  methods: {
    ...mapActions("mars_additional_tid", [
      "ADDITIONAL_TID_FROM_MARS",
      "ADDITIONAL_TID_FROM_BACK_END",
    ]),
    ...mapActions("mars_additional_city", ["CITY_FORM_ADDITIONAL_TID"]),
    ...mapActions("additionalTid", ["ADDITIONAL_TID_VERIFY_DATA"]),
    ...mapActions("mars_additional_state", ["STATE_FROM_ADDITIONAL_TID"]),

    fninputTyping(event, type) {
      if (type === 1) {
        this.companyRegisteredCitySelected = false;
      } else if (type === 2) {
        this.companyRegisteredStateSelected = false;
      }
      if (this.cityOptions.length <= 0 || this.stateOptions.length <= 0) {
        this.fetchmarsCity(this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel, this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel);
      }
    },

    fetchmarsCity(citySerNumberLabel, stateSerNumberLabel) {
      let self = this;
      self.CITY_FORM_ADDITIONAL_TID(citySerNumberLabel)
        .then(() => {
          self.cityOptions = [];
          self.marsAdditionalCity.items.map((oo) => {
            self.cityOptions.push({ label: oo.name, value: oo.code });
            if (oo.code != "" && oo.code != " ")
              this.additionalTerminal.AdditionalTerminalDetails.citySerNumber = oo.code;
          });
        }).then(() => {
          return self.STATE_FROM_ADDITIONAL_TID(stateSerNumberLabel).then((response) => {
            self.stateOptions = [];
            self.marsAdditionalState.items.map((oo) => {
              self.stateOptions.push({ label: oo.name, value: oo.code });
              if (oo.code != "" && oo.code != " ")
                this.additionalTerminal.AdditionalTerminalDetails.stateSerNumber = oo.code;
            });
          });
        });
    },

    fnMarsCitySearch(val, update) {
      if (val.length < 3) {
        update(() => {
          this.cityOptionsSearch = [];
        });
        return;
      }
      update(() => {
        this.cityOptionsSearch = this.COMMON_FILTER_FUNCTION(
          this.cityOptions,
          val
        );
      });
    },
    fnMarsStateSearch(val, update) {
      if (val.length < 3) {
        update(() => {
          this.stateOptionsSearch = [];
        });
        return;
      }
      update(() => {
        this.stateOptionsSearch = this.COMMON_FILTER_FUNCTION(
          this.stateOptions,
          val
        );
      });
    },
    partnerCitySelected(item) {
      if (item) {
        this.companyRegisteredCitySelected = true;
        this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = item.label;
        this.additionalTerminal.AdditionalTerminalDetails.citySerNumber = item.value;
      }
    },
    fnClrCity() {
      if (!this.companyRegisteredCitySelected)
        this.additionalTerminal.AdditionalTerminalDetails.citySerNumberLabel = "";
    },
    partnerStateSelected(item) {
      if (item) {
        this.companyRegisteredStateSelected = true;
        this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = item.label;
        this.additionalTerminal.AdditionalTerminalDetails.stateSerNumber = item.value;
      }
    },
    fnClrState() {
      if (!this.companyRegisteredStateSelected)
        this.additionalTerminal.AdditionalTerminalDetails.stateSerNumberLabel = "";
    },
    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, function (oo) {
        return (
          oo.label.toLowerCase().includes(terms.toLowerCase()) ||
          oo.value.toString().includes(terms.toString())
        );
      });
    },
    fnSubmitBankDetails(request) {
      this.v$.additionalTerminal.$touch();
      if (this.v$.additionalTerminal.$error) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
      } else {
        let self = this;
        self.$q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Validating ..",
        });
        let key = this.additionalTerminal.institutionCode;
        this.$q.localStorage.set("a_t", key);
        const finalFormRequest = _.cloneDeep(self.additionalTerminal);
        delete finalFormRequest.AdditionalTerminalDetails.citySerNumberLabel;
        delete finalFormRequest.AdditionalTerminalDetails.stateSerNumberLabel;
        let params = {
          Id: { leadId: this.$route.params.data.leadInformation.id },
          Count: {
            count: this.additionalTerminal.AdditionalTerminalDetails.numberOfTerminals,
          },
          Datas: { additionalTerminal: finalFormRequest },
        };
        this.ADDITIONAL_TID_FROM_MARS({ additionalTerminal: finalFormRequest })
          .then((response) => {
            if (response.status == 204) {
              this.$q.loading.hide();
              this.$q.notify({
                type: "warning",
                color: "amber-9",
                position: "bottom",
                message: "No content returned from MARS",
              });
            } else {
              this.$q.notify({
                color: "positive",
                position: "bottom",
                icon: "thumb_up",
                message: "Merchant Details successfully Updated",
              });
              this.ADDITIONAL_TID_FROM_BACK_END({ params }).then((response) => {
                  this.$q.loading.hide();
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Saved successfully",
                    icon: "thumb_up",
                  });
                })
                .catch((error) => {
                  this.$q.notify({
                    color: "negative",
                    position: "bottom",
                    icon: "thumb_down",
                    message: error.data?.message || "Error updating backend",
                  });
                  this.$q.loading.hide();
                });
            }
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              icon: "thumb_down",
              message: error.data?.message || "Error submitting to MARS",
            });
          });
      }
    },
  },
};
</script>

<style>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>