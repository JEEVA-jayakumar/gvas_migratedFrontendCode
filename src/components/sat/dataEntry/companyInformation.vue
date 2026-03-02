<template>
  <div>
    <div class="row q-col-gutter-sm">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.legalName.$touch"
          :error="v$.merchant.companyInformation.legalName.$error"
          color="grey-9"
          v-model="merchant.companyInformation.legalName"
          label="Legal Name*"
          placeholder="Legal Name*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.dbaName.$touch"
          :error="v$.merchant.companyInformation.dbaName.$error"
          color="grey-9"
          v-model="merchant.companyInformation.dbaName"
          label="DBA Name*"
          placeholder="DBA Name*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.registeredAddress.$touch"
          :error="v$.merchant.companyInformation.registeredAddress.$error"
          color="grey-9"
          v-model="merchant.companyInformation.registeredAddress"
          label="Registered Address*"
          placeholder="Registered Address*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          @blur="v$.merchant.companyInformation.registeredCityRefCode.$touch"
          :error="v$.merchant.companyInformation.registeredCityRefCode.$anyError|| v$.merchant.companyInformation.registeredCityName.$anyError"
          color="grey-9"
          v-model="merchant.companyInformation.registeredCityName"
          label="Registered city (type min 3 characters)*"
          placeholder="Start typing ..*"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="registeredCityOptions"
          @filter="registeredCityFilterFn"
          @update:model-value="registeredCitySelected"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          @blur="v$.merchant.companyInformation.registeredStateRefCode.$touch"
          :error="v$.merchant.companyInformation.registeredStateRefCode.$anyError|| v$.merchant.companyInformation.registeredStateName.$anyError"
          color="grey-9"
          v-model="merchant.companyInformation.registeredStateName"
          label="Registered state (type min 3 characters)*"
          placeholder="Start typing ..*"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="registeredStateOptions"
          @filter="registeredStateFilterFn"
          @update:model-value="registeredStateSelected"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.registeredPin.$touch"
          :error="v$.merchant.companyInformation.registeredPin.$error"
          color="grey-9"
          type="number"
          v-model="merchant.companyInformation.registeredPin"
          label="PIN*"
          placeholder="PIN*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          disable
          color="grey-9"
          v-model="merchant.companyInformation.constitutionName"
          label="Type of Business Entity"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="v$.merchant.companyInformation.establishYear.$touch"
          :error="v$.merchant.companyInformation.establishYear.$error"
          v-model="merchant.companyInformation.establishYear"
          label="Year of Establishment*"
          placeholder="Year of Establishment*"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="merchant.companyInformation.establishYear" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          @blur="v$.merchant.companyInformation.registerNumber.$touch"
          :error="v$.merchant.companyInformation.registerNumber.$error"
          v-model="merchant.companyInformation.registerNumber"
          label="Establish Number"
          placeholder="Establish Number"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.tin.$touch"
          :error="v$.merchant.companyInformation.tin.$error"
          color="grey-9"
          v-model="merchant.companyInformation.tin"
          label="TIN"
          placeholder="TIN"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          upper-case
          @blur="v$.merchant.companyInformation.pan.$touch"
          :error="v$.merchant.companyInformation.pan.$error"
          color="grey-9"
          v-model="merchant.companyInformation.pan"
          label="Company PAN*"
          placeholder="Company PAN*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          upper-case
          @blur="v$.merchant.companyInformation.tan.$touch"
          :error="v$.merchant.companyInformation.tan.$error"
          color="grey-9"
          v-model="merchant.companyInformation.tan"
          label="TAN"
          placeholder="TAN"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          v-model="merchant.companyInformation.businessNature"
          label="Nature of Business"
          placeholder="Nature of Business"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          placeholder="Choose from the below*"
          color="grey-9"
          v-model="merchant.companyInformation.businessType"
          label="Type of Business"
          :options="businessTypeOptions"
          map-options
          emit-value
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          @blur="v$.merchant.companyInformation.mcc.$touch"
          :error="v$.merchant.companyInformation.mcc.$error || v$.merchant.companyInformation.mccname.$error"
          color="grey-9"
          v-model="merchant.companyInformation.mccname"
          label="MCC (type min 3 characters)"
          placeholder="Start typing ..*"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="mccOptions"
          @filter="mccFilterFn"
          @update:model-value="mccSelected"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.residentialAddress.$touch"
          :error="v$.merchant.companyInformation.residentialAddress.$error"
          color="grey-9"
          v-model="merchant.companyInformation.residentialAddress"
          label="Residential Address*"
          placeholder="Residential Address*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.residentialPin.$touch"
          :error="v$.merchant.companyInformation.residentialPin.$error"
          color="grey-9"
          type="number"
          v-model="merchant.companyInformation.residentialPin"
          label="PIN*"
          placeholder="PIN*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          @blur="v$.merchant.companyInformation.residentialCityRefCode.$touch"
          :error="v$.merchant.companyInformation.residentialCityRefCode.$anyError|| v$.merchant.companyInformation.residentCityName.$anyError"
          color="grey-9"
          v-model="merchant.companyInformation.residentCityName"
          label="City (type min 3 characters)*"
          placeholder="Start typing ..*"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="residentCityOptions"
          @filter="residentCityFilterFn"
          @update:model-value="residentCitySelected"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          @blur="v$.merchant.companyInformation.residentialStateRefCode.$touch"
          :error="v$.merchant.companyInformation.residentialStateRefCode.$anyError|| v$.merchant.companyInformation.residentStateName.$anyError"
          color="grey-9"
          v-model="merchant.companyInformation.residentStateName"
          label="State (type min 3 characters)*"
          placeholder="Start typing ..*"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="residentStateOptions"
          @filter="residentStateFilterFn"
          @update:model-value="residentStateSelected"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.contactName.$touch"
          :error="v$.merchant.companyInformation.contactName.$error"
          color="grey-9"
          v-model="merchant.companyInformation.contactName"
          label="Contact Name*"
          placeholder="Contact Name*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.contactMobile.$touch"
          :error="v$.merchant.companyInformation.contactMobile.$error"
          color="grey-9"
          v-model="merchant.companyInformation.contactMobile"
          label="Contact mobile*"
          placeholder="Contact Mobile*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          type="tel"
          @blur="v$.merchant.companyInformation.contactAlternateMobile.$touch"
          :error="v$.merchant.companyInformation.contactAlternateMobile.$error"
          v-model="merchant.companyInformation.contactAlternateMobile"
          label="Contact Alt Mobile"
          placeholder="Contact Alt Mobile"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          type="tel"
          @blur="v$.merchant.companyInformation.contactPhone.$touch"
          :error="v$.merchant.companyInformation.contactPhone.$error"
          v-model="merchant.companyInformation.contactPhone"
          label="Contact Phone*"
          placeholder="Contact Phone*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          @blur="v$.merchant.companyInformation.contactEmail.$touch"
          :error="v$.merchant.companyInformation.contactEmail.$error"
          color="grey-9"
          type="email"
          v-model="merchant.companyInformation.contactEmail"
          label="Contact Email*"
          placeholder="Contact Email*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div class="text-caption">Statement type</div>
        <div class="group">
          <q-radio
            @blur="v$.merchant.companyInformation.statementType.$touch"
            :error="v$.merchant.companyInformation.statementType.$error"
            v-for="(item,index) in viewBinding.statementType"
            :key="index"
            color="grey-9"
            v-model="merchant.companyInformation.statementType"
            :val="item.value"
            :label="item.label"
          />
        </div>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <p class="text-caption">Statement frequency</p>
        <div class="group">
          <q-radio
            @blur="v$.merchant.companyInformation.statementFrequency.$touch"
            :error="v$.merchant.companyInformation.statementFrequency.$error"
            v-for="(item,index) in viewBinding.statementFrequency"
            :key="index"
            color="grey-9"
            v-model="merchant.companyInformation.statementFrequency"
            :val="item.value"
            :label="item.label"
          />
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          color="grey-9"
          label="Statement Email"
          placeholder="Statement Email"
          @blur="v$.merchant.companyInformation.statementEmail.$touch"
          :error="v$.merchant.companyInformation.statementEmail.$error"
          v-model="merchant.companyInformation.statementEmail"
        />
      </div>
    </div>
    <q-stepper-navigation>
      <q-btn color="primary" class="q-ma-xs" icon="check" @click="validate" label="Continue"/>
      <q-btn
        color="amber-10"
        class="q-ma-xs"
        icon="save"
        label="Save Partial"
        @click="$emit('saveData','companyInformation',merchant)"
      />
      <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="$emit('goBack')" label="Back"/>
    </q-stepper-navigation>
    <div class="hidden">{{makePropsReactive}}</div>
  </div>
</template>

<script>
import {
  helpers,
  required,
  requiredIf,
  alphaNum,
  integer,
  numeric,
  minLength,
  maxLength,
  email,
  maxValue,
  minValue,
  decimal,
  between
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
const alphaNumericValidate = helpers.regex(
  "alphaNumericValidate",
  /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/
);
// 4 alphabets, 5 numbers, 1 number
const tanValidate = helpers.regex("tanValidate", /[A-Za-z]{4}\d{5}[A-Za-z]{1}/);
const panCard = helpers.regex(
  "panCard",
  /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
);
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  // name: 'ComponentName',
  props: [
    "propLeadDeatils",
    "cityOptions",
    "stateOptions",
    "mccSearchSet",
    "companyInformation"
  ],
  data() {
    return {
      registeredCityOptions: [],
      registeredStateOptions: [],
      residentCityOptions: [],
      residentStateOptions: [],
      mccOptions: [],
      businessTypeOptions: [
        {
          label: "Rented",
          value: "R"
        },
        {
          label: "Owned",
          value: "O"
        },
        {
          label: "Leased",
          value: "L"
        }
      ],
      viewBinding: {
        statementType: [
          {
            label: "E-Statement",
            value: "E"
          },
          {
            label: "Paper statement",
            value: "P"
          }
        ],
        statementFrequency: [
          {
            label: "Daily",
            value: "D"
          },
          {
            label: "Monthly",
            value: "M"
          },
          {
            label: "Quaterly",
            value: "Q"
          },
          {
            label: "Half yearly",
            value: "H"
          },
          {
            label: "Yearly",
            value: "Y"
          },
          {
            label: "None",
            value: "N"
          }
        ]
      },
      merchant: {
        companyInformation: {}
      }
    };
  },
  validations: {
    merchant: {
      companyInformation: {
        legalName: {
          required,
          alphaNumericValidate
        },
        dbaName: {
          required,
          alphaNumericValidate
        },
        registeredAddress: {
          required
        },
        registeredPin: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(6)
        },
        registeredCityRefCode: { required, integer },
        registeredCityName: { required },
        registeredStateRefCode: { required, integer },
        registeredStateName: { required },
        constitution: { required },
        establishYear: { required },
        registerNumber: {
          alphaNum,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        mccname: { required },
        mcc: { required },
        residentialAddress: { required },
        residentialPin: {
          required,
          integer,
          minLength: minLength(6),
          maxLength: maxLength(6)
        },
        residentCityName: { required },
        residentialCityRefCode: { required, integer },
        residentStateName: { required },
        residentialStateRefCode: { required, integer },
        pan: {
          required,
          panCard,
          maxLength: maxLength(10),
          minLength: minLength(10)
        },
        tin: {
          required: false,
          integer,
          minLength: minLength(9),
          maxLength: maxLength(12)
        },
        tan: {
          required: false,
          maxLength: maxLength(10),
          minLength: minLength(10),
          tanValidate
        },
        contactName: { required },
        contactMobile: {
          numeric,
          required,
          minLength: minLength(10),
          maxLength: maxLength(10)
        },
        contactAlternateMobile: {
          numeric,
          minLength: minLength(10),
          maxLength: maxLength(10)
        },
        contactPhone: {
          numeric,
          required,
          minLength: minLength(12),
          maxLength: maxLength(12)
        },
        contactEmail: { required, email },
        statementEmail: {
          required: requiredIf(function() {
            return this.getStatementType;
          }),
          email
        },
        statementType: { required },
        statementFrequency: { required }
      }
    }
  },
  computed: {
    makePropsReactive() {
      this.merchant.companyInformation = this.companyInformation;
    },
    getStatementType() {
      return this.merchant.companyInformation.statementType == "E";
    }
  },
  methods: {
    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, function(oo) {
        return oo.label.toLowerCase().includes(terms.toLowerCase());
      });
    },
    registeredCityFilterFn(val, update) {
      if (val.length < 3) {
        update(() => {
          this.registeredCityOptions = [];
        });
        return;
      }
      update(() => {
        this.registeredCityOptions = this.COMMON_FILTER_FUNCTION(
          this.cityOptions,
          val
        );
      });
    },
    registeredStateFilterFn(val, update) {
      if (val.length < 1) {
        update(() => {
          this.registeredStateOptions = [];
        });
        return;
      }
      update(() => {
        this.registeredStateOptions = this.COMMON_FILTER_FUNCTION(
          this.stateOptions,
          val
        );
      });
    },
    residentCityFilterFn(val, update) {
      if (val.length < 3) {
        update(() => {
          this.residentCityOptions = [];
        });
        return;
      }
      update(() => {
        this.residentCityOptions = this.COMMON_FILTER_FUNCTION(
          this.cityOptions,
          val
        );
      });
    },
    residentStateFilterFn(val, update) {
      if (val.length < 1) {
        update(() => {
          this.residentStateOptions = [];
        });
        return;
      }
      update(() => {
        this.residentStateOptions = this.COMMON_FILTER_FUNCTION(
          this.stateOptions,
          val
        );
      });
    },
    mccFilterFn(val, update) {
      if (val.length < 3) {
        update(() => {
          this.mccOptions = [];
        });
        return;
      }
      update(() => {
        this.mccOptions = this.COMMON_FILTER_FUNCTION(this.mccSearchSet, val);
      });
    },

    // Registered city selction
    registeredCitySelected(item) {
      if (!item) return;
      this.merchant.companyInformation.registeredCityName = item.label;
      this.merchant.companyInformation.registeredCityRefCode = item.value;
    },

    // Registered state selection
    registeredStateSelected(item) {
      if (!item) return;
      this.merchant.companyInformation.registeredStateName = item.label;
      this.merchant.companyInformation.registeredStateRefCode = item.value;
    },

    // Resident city selection
    residentCitySelected(item) {
      if (!item) return;
      this.merchant.companyInformation.residentCityName = item.label;
      this.merchant.companyInformation.residentialCityRefCode = item.value;
    },
    // Resident state selection
    residentStateSelected(item) {
      if (!item) return;
      this.merchant.companyInformation.residentStateName = item.label;
      this.merchant.companyInformation.residentialStateRefCode = item.value;
    },

    mccSelected(item) {
      if (!item) return;
      this.merchant.companyInformation.mccname = item.label;
      this.merchant.companyInformation.mcc = item.value;
    },
    validate() {
      this.v$.merchant.companyInformation.$touch();
      if (this.v$.merchant.companyInformation.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$emit("goNext", "companyInformation", this.merchant);
      }
    }
  }
};
</script>

<style>
</style>
