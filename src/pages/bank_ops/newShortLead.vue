<template>
  <q-page>
    <div>
      <div
        class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Assign Short Lead</div>
      <div class="q-px-lg">
        <div class="text-body1 uppercase text-weight-medium text-grey-9 q-my-md">Merchant Details</div>
        <div class="row group">
          <div class="col">
            <q-input
              v-model="formData.leadName"
              @blur="$v.formData.leadName.$touch"
              :error="$v.formData.leadName.$error"
              label="Merchant Name"
              placeholder="Merchant Name"
              color="grey-9"
            />
          </div>
          <div class="col">
            <q-input
              v-model="formData.contactName"
              @blur="$v.formData.contactName.$touch"
              :error="$v.formData.contactName.$error"
              label="Contact Name"
              placeholder="Contact Name"
              color="grey-9"
            />
          </div>
          <div class="col">
            <q-input
              v-model="formData.contactNumber"
              @blur="$v.formData.contactNumber.$touch"
              :error="$v.formData.contactNumber.$error"
              label="Contact Number"
              placeholder="Contact Number"
              color="grey-9"
            />
          </div>
          <div class="col">
            <q-input
              @blur="$v.formData.alternateContactNumber.$touch"
              :error="$v.formData.alternateContactNumber.$error"
              v-model="formData.alternateContactNumber"
              label="Alternate Contact Number"
              placeholder="Alternate Contact Number"
              color="grey-9"
            />
          </div>
        </div>

        <div class="row group">
          <div class="col">
            <q-input
              v-model="formData.leadAddress"
              label="Merchant Address"
              placeholder="Merchant Address"
              color="grey-9"
            />
          </div>
          <div class="col">
            <q-select
              outlined
              use-input
              hide-selected
              fill-input
              input-debounce="500"
              label="Pincode"
              v-model="formData.pincode"
              :options="getAllStatesData"
              @filter="pincodeSearch"
              @update:model-value="pincodeSelected"
              @clear="fnClearStateCity"
              clearable
              :error="$v.formData.pincode.$error"
              @blur="$v.formData.pincode.$touch"
            />
          </div>
          <div class="col">
            <q-input
              disable
              v-model="formData.city"
              @blur="$v.formData.city.$touch"
              :error="$v.formData.city.$error"
              label="City/Town"
              placeholder="City/Town"
              color="grey-9"
            />
          </div>
          <div class="col">
            <q-input
              disable
              v-model="formData.state"
              @blur="$v.formData.state.$touch"
              :error="$v.formData.state.$error"
              label="State"
              placeholder="State"
              color="grey-9"
            />
          </div>
        </div>

        <div class="text-body1 uppercase text-weight-medium text-grey-9 q-my-md">Device Details</div>
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-select
              outlined
              use-input
              hide-selected
              fill-input
              input-debounce="500"
              label="Lead Source"
              v-model="formData.leadSource.name"
              :options="leadSourceSelectOptions"
              @filter="leadSourceSearch"
              @update:model-value="leadSourceSelected"
              @clear="fnClearDeviceList"
              clearable
              :error="$v.formData.leadSource.id.$error"
              @blur="$v.formData.leadSource.id.$touch"
            />
            <p class="q-py-sm" v-if="leadSourceSelectOptions.length == 0">No data available</p>
          </div>
          <div class="col">
            <q-select
              outlined
              :disable="deviceSelectOptions.length === 0"
              label="Device Type"
              clearable
              color="grey-9"
              v-model="formData.device.id"
              @blur="$v.formData.device.id.$touch"
              :error="$v.formData.device.id.$error"
              :options="deviceSelectOptions"
              emit-value
              map-options
            />
            <p class="q-py-sm" v-if="deviceSelectOptions.length == 0">No data available</p>
          </div>
          <div class="col">
            <q-input
              v-model="formData.deviceCount"
              @blur="$v.formData.deviceCount.$touch"
              :error="$v.formData.deviceCount.$error"
              type="number"
              label="Count"
              placeholder="Device Count"
              color="grey-9"
            />
          </div>
        </div>
        <div class="text-body1 uppercase text-weight-medium text-grey-9 q-my-md">Assign To</div>
        <div class="row">
          <div class="col-md-6 group">
            <q-radio
              v-model="formData.tempAssignedTo"
              @update:model-value="fnToShowAssignSelect"
              val="1"
              label="RSM"
            />
            <q-radio
              v-model="formData.tempAssignedTo"
              @update:model-value="fnToShowAssignSelect"
              val="2"
              label="ASM"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-xs">
          <div class="col-md-4" v-if="formData.tempAssignedTo == 1">
            <q-select
              outlined
              :disable="RSMselectOptions.length === 0"
              @blur="$v.formData.assignedOpsTo.id.$touch"
              :error="$v.formData.assignedOpsTo.id.$error"
              placeholder="Choose from the below"
              clearable
              color="grey-9"
              v-model="formData.assignedOpsTo.id"
              label="RSM Name"
              :options="RSMselectOptions"
              emit-value
              map-options
            />
            <p class="q-py-sm" v-if="RSMselectOptions.length == 0">No data available</p>
          </div>
          <div class="col-md-4" v-if="formData.tempAssignedTo == 2">
            <q-select
              outlined
              :disable="getAllRegionsData.length === 0"
              placeholder="Choose Region"
              clearable
              color="grey-9"
              v-model="region"
              label="Region"
              :options="getAllRegionsData"
              emit-value
              map-options
              @clear="fnClearASMList"
              @update:model-value="fnFetchASMList()"
            />
          </div>
          <div class="col-md-4" v-if="formData.tempAssignedTo == 2">
            <q-select
              outlined
              :disable="ASMselectOptions.length === 0"
              @blur="$v.formData.assignedOpsTo.id.$touch"
              :error="$v.formData.assignedOpsTo.id.$error"
              placeholder="Choose from the below"
              clearable
              color="grey-9"
              v-model="formData.assignedOpsTo.id"
              label="ASM Name"
              :options="ASMselectOptions"
              emit-value
              map-options
            />
            <p class="q-py-xs" v-if="leadSourceSelectOptions.length == 0">No data available</p>
          </div>
        </div>
        <div class="row">
          <div class="col group" align="right">
            <q-btn icon="block" outline color="dark" label="Cancel"/>
            <q-btn @click="fnSubmibAssignShortLead()" icon="check" color="info" label="Submit"/>
          </div>
        </div>
      </div>
      <!--START >>  Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35"/>
      </div>
      <!--END >>  Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script>
import {
  required,
  maxValue,
  minValue,
  minLength,
  maxLength
} from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "newShortLead",

  data() {
    return {
      toggleAjaxLoadFilter: false,
      region: "",
      deviceSelectOptions: [],
      leadSourceSelectOptions: [],
      RSMselectOptions: [],
      ASMselectOptions: [],
      showAssignSelect: null,
      formData: {
        leadName: "",
        contactName: "",
        contactNumber: "",
        alternateContactNumber: "",
        leadAddress: "",
        latitude: 13.458,
        longitude: 89.236,
        city: "",
        deviceCount: "",
        state: "",
        device: {
          id: ""
        },
        leadSource: {
          id: "",
          name: ""
        },
        tempAssignedTo: "1",
        assignedOpsTo: {
          id: ""
        },
        pincode: ""
      }
    };
  },

  validations: {
    formData: {
      leadName: { required },
      contactName: { required },
      contactNumber: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      alternateContactNumber: {
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      latitude: { required },
      longitude: { required },
      city: { required },
      deviceCount: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(100)
      },
      state: { required },
      device: {
        id: { required }
      },
      leadSource: {
        id: { required }
      },
      assignedOpsTo: {
        id: { required }
      },
      pincode: { required }
    }
  },

  created() {
    /* START: Load all States */
    this.ajaxLoadDataForAllStatesList();
    this.ajaxLoadDataForRSMandASMList();
    /* End: Load all States */
  },

  computed: {
    ...mapGetters("SuperAdminUsers", ["getAllStatesData", "getAllRegionsData"]),
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
    ...mapGetters("BankOpsShortLead", [
      "getSelectOptionsRSMInfo",
      "getSelectOptionsASMInfo",
      "getSelectOptionsLeadSourceBankInfo"
    ]),
    ...mapGetters("DeviceListBasedOnLeadSource", [
      "getDevicesBasedOnLeadSource"
    ])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA"]),
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_STATES_DATA",
      "FETCH_PINCODE_WITH_TERM",
      "FETCH_ALL_REGIONS_DATA"
    ]),
    ...mapActions("DeviceListBasedOnLeadSource", [
      "DEVICE_LIST_BASED_ON_LEAD_SOURCE"
    ]),
    ...mapActions("BankOpsShortLead", [
      "CREATE_SHORT_LEAD",
      "FETCH_RSM_DATA",
      "FETCH_ASM_DATA",
      "FETCH_ALL_LEAD_SOURCE_BANK_DATA"
    ]),

    // Funtion to load states available
    ajaxLoadDataForAllStatesList() {
      this.FETCH_ALL_STATES_DATA();
      this.FETCH_ALL_REGIONS_DATA();

      this.FETCH_ALL_LEAD_SOURCE_BANK_DATA().then(() => {
        let assumeArr = [];
        this.getSelectOptionsLeadSourceBankInfo.map(function(value) {
          assumeArr.push({ label: value.sourceName, value: value.id });
        });
        console.log("assumeArr", this.getSelectOptionsLeadSourceBankInfo);
        this.leadSourceSelectOptions = assumeArr;
      });

      this.FETCH_DEVICES_DATA().then(() => {
        let assumeArr = [];
        this.getAllDevicesInfo.map(function(value) {
          assumeArr.push({ label: value.deviceName, value: value.id });
        });
        this.deviceSelectOptions = assumeArr;
      });

      this.FETCH_RSM_DATA().then(() => {
        let assumeArr = [];
        this.getSelectOptionsRSMInfo.map(function(value) {
          assumeArr.push({ label: value.name, value: value.id });
        });
        this.RSMselectOptions = assumeArr;
      });
    },

    // Funtion to load states available
    ajaxLoadDataForRSMandASMList() {
      this.FETCH_ALL_STATES_DATA();
    },

    //Function clear city and state when pincode is cleared
    fnClearStateCity() {
      this.formData.pincode = "";
      this.formData.state = "";
      this.formData.city = "";
    },

    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, function(oo) {
        return oo.label.toLowerCase().includes(terms.toLowerCase());
      });
    },
    COMMON_FILTER_FUNCTION_PINCODE(arraySet, terms) {
      return _.filter(arraySet, function(oo) {
        return oo.label.toLowerCase().includes(terms.toLowerCase());
      });
    },

    /* Pincode search result */
    pincodeSearch(terms, done) {
      this.formData.cityName = "";
      this.formData.stateName = "";
      this.FETCH_PINCODE_WITH_TERM(terms)
        .then(() => {
          done(
            this.COMMON_FILTER_FUNCTION_PINCODE(this.getAllStatesData, terms)
          );
        })
        .catch(() => {
          done([]);
        });
    },
    pincodeSelected(item) {
      this.formData.state = item.value.stateName;
      this.formData.city = item.value.cityName;
      this.formData.pincode = item.value.pincode;
    },
    /* Pincode search result */

    /* Lead source search result */
    leadSourceSearch(terms, done) {
      done(this.COMMON_FILTER_FUNCTION(this.leadSourceSelectOptions, terms));
    },
    leadSourceSelected(item) {
      this.formData.leadSource.name = item.label;
      this.formData.leadSource.id = item.value;

      this.toggleAjaxLoadFilter = true;
      this.deviceSelectOptions = [];
      let self = this;
      // Calls action in store to get device types
      this.DEVICE_LIST_BASED_ON_LEAD_SOURCE(self.formData.leadSource.id)
        .then(response => {
          this.toggleAjaxLoadFilter = false;
          let assumeArr = [];
          // Function to framing device options
          let currentMappingElement = self.getDevicesBasedOnLeadSource.device;
          currentMappingElement.map(function(value, index) {
            assumeArr.push({ label: value.deviceName, value: value.id });
          });
          self.deviceSelectOptions = assumeArr;
        })
        .catch(error => {
          this.toggleAjaxLoadFilter = false;

          // if any issues throw the below error
          if (error.status == this.$API_SUCCESS) {
            this.$q.notify({
              color: "primary",
              position: "bottom",
              message: "No device type available",
              icon: "info"
            });
          } else {
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.body.message == null ? "Please Try Again Later !" : error.body.message,
              icon: "thumb_down"
            });
          }
        });
    },
    /* Lead source search result */

    // Function to show rsm/asm select box
    fnToShowAssignSelect() {
      this.formData.assignedOpsTo.id = null;
      // this.showAssignSelect = !this.showAssignSelect;
    },

    fnClearASMList() {
      this.ASMselectOptions = [];
    },
    fnClearDeviceList() {
      this.deviceSelectOptions = [];
    },

    fnFetchASMList() {
      this.FETCH_ASM_DATA(this.region).then(() => {
        if (this.getSelectOptionsASMInfo.length > 0) {
          let assumeArr = [];
          this.getSelectOptionsASMInfo.map(function(value) {
            assumeArr.push({ label: value.name, value: value.id });
          });
          this.ASMselectOptions = assumeArr;
        } else {
          this.$q.notify({
            color: "amber-9",
            position: "bottom",
            message: "No ASM available in the selected region ",
            icon: "warning"
          });
        }
      });
    },

    // Function to final submit short lead
    fnSubmibAssignShortLead() {
      this.$v.formData.$touch();
      if (this.$v.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.CREATE_SHORT_LEAD(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$router.push("/bank/ops/assign/short/lead");
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up"
            });
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.body.message == null ? "Please Try Again Later !" : error.body.message,
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>

<style>
</style>
