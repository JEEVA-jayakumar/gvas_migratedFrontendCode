<template>
  <div>
    <div
      v-for="(item,index) in partnersArr"
      :key="index"
      class="row q-my-xs q-col-gutter-sm"
      ref="parentElement"
    >
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="row group items-center">
          <div class="col">
            <span class="q-pa-sm bg-light text-dark">
              <q-icon name="people"/>
              Partner 0{{parseInt(index)+1}}
            </span>
          </div>
          <div class="col-auto" v-if="partnersArr.length > 1">
            <q-btn round icon="delete" @click="removePartnerFromArr(item,index)" color="negative"/>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          :error="v$.partnersArr.$each[index].name.$anyError"
          @blur="v$.partnersArr.$each[index].name.$touch()"
          color="grey-9"
          v-model="item.name"
          label="Name*"
          placeholder="Name*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          upper-case
          :error="v$.partnersArr.$each[index].pan.$anyError"
          @blur="v$.partnersArr.$each[index].pan.$touch()"
          color="grey-9"
          v-model="item.pan"
          label="Pan*"
          placeholder="Pan*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          :error="v$.partnersArr.$each[index].address.$anyError"
          @blur="v$.partnersArr.$each[index].address.$touch()"
          color="grey-9"
          v-model="item.address"
          label="Address*"
          placeholder="Address*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          :error="v$.partnersArr.$each[index].pin.$anyError"
          @blur="v$.partnersArr.$each[index].pin.$touch()"
          color="grey-9"
          type="number"
          v-model="item.pin"
          label="Pincode*"
          placeholder="Pincode*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-select
          use-input
          fill-input
          hide-selected
          :error="v$.partnersArr.$each[index].cityRefLabel.$anyError || v$.partnersArr.$each[index].cityRefCode.$anyError"
          @blur="v$.partnersArr.$each[index].cityRefCode.$touch()"
          color="grey-9"
          v-model="item.cityRefLabel"
          label="City (type min 3 characters)*"
          placeholder="Start typing ..*"
          :options="cityFilteredOptions"
          @filter="cityFilterFn"
          @update:model-value="obj => partnerCitySelected(obj,index)"
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
          use-input
          fill-input
          hide-selected
          :error="v$.partnersArr.$each[index].stateRefLabel.$anyError || v$.partnersArr.$each[index].stateRefCode.$anyError"
          @blur="v$.partnersArr.$each[index].stateRefCode.$touch()"
          color="grey-9"
          v-model="item.stateRefLabel"
          label="State (type min 3 characters)*"
          placeholder="Start typing ..*"
          :options="stateFilteredOptions"
          @filter="stateFilterFn"
          @update:model-value="obj => partnerStateSelected(obj,index)"
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
          :error="v$.partnersArr.$each[index].contactMobile.$anyError"
          @blur="v$.partnersArr.$each[index].contactMobile.$touch()"
          color="grey-9"
          type="tel"
          v-model="item.contactMobile"
          label="Mobile*"
          placeholder="Mobile*"
        />
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input
          :error="v$.partnersArr.$each[index].contactEmail.$anyError"
          @blur="v$.partnersArr.$each[index].contactEmail.$touch()"
          color="grey-9"
          type="email"
          v-model="item.contactEmail"
          label="Email*"
          placeholder="Email*"
        />
      </div>
    </div>
    <q-stepper-navigation>
      <q-btn color="primary" class="q-ma-xs" icon="check" @click="validate()" label="Continue"/>
      <q-btn
        color="amber-10"
        class="q-ma-xs"
        icon="save"
        label="Save Partial"
        @click="$emit('saveData','partnerInformation',partnersArr)"
      />
      <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="$emit('goBack')" label="Back"/>
      <q-btn
        color="positive float-right"
        @click="addMorePartnersSet"
        class="q-ma-xs"
        icon="add"
        label="Add More"
      />
    </q-stepper-navigation>
    <div class="hidden">{{makePropsReactive}}</div>
  </div>
</template>

<script>
import {
  helpers,
  required,
  requiredIf,
  integer,
  minLength,
  maxLength,
  email
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
const panCard = helpers.regex(
  "panCard",
  /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
);
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  // name: 'ComponentName',
  props: ["cityOptions", "stateOptions", "constitution", "partnerInformation"],
  data() {
    return {
      partnersArr: [],
      cityFilteredOptions: [],
      stateFilteredOptions: []
    };
  },
  validations: {
    partnersArr: {
      required: requiredIf(function() {
        return this.getPartnersVisiblity;
      }),
      $each: helpers.forEach({
        name: { required },
        address: { required },
        pan: {
          required,
          panCard,
          maxLength: maxLength(10),
          minLength: minLength(10)
        },
        pin: {
          required,
          integer,
          minLength: minLength(6),
          maxLength: maxLength(7)
        },
        stateRefCode: { required, integer },
        stateRefLabel: { required },
        cityRefCode: { required, integer },
        cityRefLabel: { required },
        contactMobile: {
          required,
          integer,
          minLength: minLength(10),
          maxLength: maxLength(10)
        },
        contactEmail: { required, email }
      })
    }
  },
  computed: {
    makePropsReactive() {
      this.partnersArr = this.partnerInformation;
    },
    // Checks for value in partners array => Global variable
    getPartnersVisiblity() {
      return this.$PARTNERS_TAB_ENABLED_ITEMS.includes(this.constitution);
    }
  },
  methods: {
    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, function(oo) {
        return oo.label.toLowerCase().includes(terms.toLowerCase());
      });
    },
    cityFilterFn(val, update) {
      update(() => {
        this.cityFilteredOptions = this.COMMON_FILTER_FUNCTION(this.cityOptions, val);
      });
    },
    stateFilterFn(val, update) {
      update(() => {
        this.stateFilteredOptions = this.COMMON_FILTER_FUNCTION(this.stateOptions, val);
      });
    },
    citySearch(terms, done) {
      done(this.COMMON_FILTER_FUNCTION(this.cityOptions, terms));
    },
    stateSearch(terms, done) {
      done(this.COMMON_FILTER_FUNCTION(this.stateOptions, terms));
    },

    // Partners city selction
    partnerCitySelected(item, index) {
      if (!item) return;
      this.partnersArr[index].cityRefCode = item.value;
      this.partnersArr[index].cityRefLabel = item.label;
    },

    // Partners state selection
    partnerStateSelected(item, index) {
      if (!item) return;
      this.partnersArr[index].stateRefCode = item.value;
      this.partnersArr[index].stateRefLabel = item.label;
    },

    addMorePartnersSet() {
      let partnerObj = {
        name: "",
        address: "",
        pan: "",
        pin: "",
        cityRefCode: "",
        cityRefLabel: "",
        stateRefCode: "",
        stateRefLabel: "",
        contactMobile: "",
        contactEmail: ""
      };
      this.partnersArr.push(partnerObj);
    },

    removePartnerFromArr(item, index) {
      this.partnersArr.splice(index, 1);
    },
    validate() {
      this.v$.partnersArr.$touch();
      if (this.v$.partnersArr.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$emit("goNext", "partnerInformation", {
          partnerInformation: this.partnersArr
        });
      }
    }
  }
};
</script>

<style>
</style>
