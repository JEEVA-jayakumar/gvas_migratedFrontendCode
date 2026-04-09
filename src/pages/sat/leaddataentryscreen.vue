<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs class="shadow-1" color="white" align="justify" v-model="shortlead" @update:model-value="goToSelectedTab">
            <q-tab name="shortlead" color="black" label="Short Lead" />
            <q-tab name="wiplead" color="black" label="WIP Lead" />
          </q-tabs>

          <q-tab-panels v-model="shortlead" animated>
            <q-tab-panel name="shortlead" class="q-pa-none">
              <div class="q-pa-md" v-if="shortlead === 'shortlead' && formData && typeof formData === 'object'">
                <div class="col-md-6 q-my-md" align="right">
                  <div class="col group"></div>
                </div>
                <div class="col-12 q-title q-my-lg text-weight-regular">
                  Lead Information
                </div>
                <div v-if="!formData">Loading...</div>
                <form v-if="formData">
                  <div class="q-px-md">
                    <div class="q-pa-md">
                      <div class="row q-col-gutter-md q-py-sm">
                        <div class="col-md-6">
                          <q-input v-model="formData.leadName" @blur="v$.formData.leadName.$touch"
                            :error="v$.formData.leadName.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="*Merchant Name" placeholder="Merchant Name" />
                        </div>
                        <div class="col-md-6">
                          <q-input v-model="formData.contactName" @blur="v$.formData.contactName.$touch"
                            :error="v$.formData.contactName.$error" class="text-weight-regular text-grey-8"
                            label="*Contact Name" placeholder="Contact Name" />
                        </div>
                        <div class="col-md-6">
                          <q-input type="number" onkeydown="javascript: return event.keyCode === 8 ||
                            event.keyCode === 46 ? true : !isNaN(Number(event.key))"
                            v-model="formData.contactNumber" class="text-weight-regular text-grey-8" color="grey-9"
                            @blur="v$.formData.contactNumber.$touch" :error="v$.formData.contactNumber.$error"
                            label="*Contact Number" placeholder="Contact Number" />
                        </div>

                        <div class="col-md-6">
                          <q-input type="number" onkeydown="javascript: return event.keyCode === 8 ||
                             event.keyCode === 46 ? true : !isNaN(Number(event.key))"
                            v-model="formData.alternateContactNumber" class="text-weight-regular text-grey-8"
                            color="grey-9" label="*Alternate Contact Number"
                            placeholder="Alternate Contact Number" />
                        </div>

                        <div class="col-md-6">
                          <q-input v-model="formData.email" @blur="v$.formData.email.$touch"
                            :error="v$.formData.email.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="*Mail_Id" placeholder="Mail_Id" />
                        </div>
                        <div class="col-md-6">
                          <q-input v-model="formData.leadAddress" @blur="v$.formData.leadAddress.$touch"
                            :error="v$.formData.leadAddress.$error" class="text-weight-regular text-grey-8"
                            color="grey-9" label="*Merchant Address" placeholder="Merchant Address" />
                        </div>
                        <div class="col-md-6">
                          <q-select
                            :error="v$.formData.pincodeTemp.$error"
                            @blur="fnClrPin"
                            clearable
                            color="grey-9"
                            v-model="formData.pincodeTemp"
                            label="Pincode"
                            placeholder="Pincode"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="500"
                            :options="pincodeOptionsSearch"
                            @filter="fnPincodeSearch"
                            @update:model-value="pincodeSelected"
                          />
                        </div>
                        <div class="col-md-6">
                          <q-input disable v-model="formData.state" @blur="v$.formData.state.$touch"
                            :error="v$.formData.state.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="State" placeholder="State" />
                        </div>
                        <div class="col-md-6">
                          <q-input disable v-model="formData.city" @blur="v$.formData.city.$touch"
                            :error="v$.formData.city.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="City/Down" placeholder="City/Down" />
                        </div>
                        <div class="col-md-6">
                          <q-select v-model="formData.region" @blur="v$.formData.region.$touch"
                            :error="v$.formData.region.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="Select Region" placeholder="Select Region" :options="dropDown.regionOptions" emit-value map-options />
                        </div>
                        <div class="col-md-6">
                          <q-select v-model="formData.leadSource" @blur="v$.formData.leadSource.$touch"
                            :error="v$.formData.leadSource.$error" class="text-weight-regular text-grey-8"
                            color="grey-9" label="Lead Source" placeholder="Lead Source"
                            :options="dropDown.leadSourceOptions" @update:model-value="getDevice" emit-value map-options />
                        </div>
                        <div class="col-md-6">
                          <q-select v-model="formData.device" @update:model-value="devSelected"
                            :error="v$.formData.device.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="Device Type" placeholder="Device Type" :options="dropDown.deviceOptions" emit-value map-options />
                        </div>

                        <div class="col-md-6">
                          <q-option-group inline type="checkbox" :model-value="selectedVas"
                              @update:model-value="handleVasChange" :disable="vasDisableFlag"
                            class="text-weight-regular text-grey-8" color="grey-9" label="VAS"
                            :options="selectBankEnableOptions" />
                        </div>
                        <div v-if="selectedVas.includes('AMEX')" class="col-md-6">
                          <q-input v-model="formData.ownerFirstName" @blur="v$.formData.ownerFirstName.$touch"
                            :error="v$.formData.ownerFirstName.$error" class="text-weight-regular text-grey-8"
                            color="grey-9" label="Owner 1 First Name*" placeholder="Owner 1 First Name*" />
                        </div>
                        <div v-if="selectedVas.includes('AMEX')" class="col-md-6">
                          <q-input v-model="formData.ownerLastName" @blur="v$.formData.ownerLastName.$touch"
                            :error="v$.formData.ownerLastName.$error" class="text-weight-regular text-grey-8"
                            color="grey-9" label="Owner 1 Last Name*" placeholder="Owner 1 Last Name*" />
                        </div>
                        <div v-if="selectedVas.includes('AMEX')" class="col-md-6">
                          <q-input type="date" v-model="formData.ownerDOB" @blur="v$.formData.ownerDOB.$touch"
                            :error="v$.formData.ownerDOB.$error" class="text-weight-regular text-grey-8" color="grey-9"
                            label="Owner 1 DOB*" placeholder="Owner 1 DOB*" />
                        </div>

                        <div class="col-md-6">
                          <q-input v-model="formData.deviceCount" @blur="v$.formData.deviceCount.$touch"
                          :disable="deviceFlag"
                            :error="v$.formData.deviceCount.$error" class="text-weight-regular text-grey-8"
                            color="grey-9" @keydown="nameKeydown($event)" @keyup="trackChange" label="Device Count" placeholder="Device Count" />
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="full-width group" align="center">
                    <q-btn size="md" type="button" color="purple-9" @click="fnSubmitBankDetails(formData)">Submit
                    </q-btn>
                  </div>
                </form>
              </div>
            </q-tab-panel>

            <q-tab-panel name="wiplead" class="q-pa-none">
              <div class="q-pa-md" v-if="shortlead === 'wiplead'">
                <q-table class="my-sticky-header-table" title="Wip Lead Information" :rows="getShortLead || []"
                  :columns="columns" row-key="id">
                  <template v-slot:body-cell-update="props">
                    <q-td v-if="props.row" :props="props">
                      <div class="row no-wrap no-padding" v-if="props && props.row">
                        <q-btn dense no-caps no-wrap label="update" icon="far fa-plus-square" size="md"
                          @click="fnShowConvertToSat(props.row)" flat class="text-light-blue"></q-btn>
                      </div>
                    </q-td>
                  </template>
                </q-table>
                <editShortLead v-if="propShowEditShortLead && propRowDetails" :propShowEditShortLead="propShowEditShortLead"
                  :propRowDetails="propRowDetails" @emitfnshowEditShortLead="fnShowEditShortLead"></editShortLead>
                <convertToSat 
                  v-if="propShowConvertToSat && propRowDetails"
                  :propShowConvertToSat="propShowConvertToSat"
                  :propRowDetails="propRowDetails" 
                  @emitEditshowConvertToSat="fnShowConvertToSat"
                ></convertToSat>
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

import editShortLead from '../../components/sat/editShortLead.vue'
import convertToSat from '../../components/sat/convertToSat.vue'
import _ from 'lodash'
import {
  required,
  requiredIf,
  minLength,
  maxLength,
  email
} from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: 'inventoryAllocation',
  components: {
    editShortLead,
    convertToSat
  },
  data() {
    return {
      propShowEditShortLead: false,
      propShowConvertToSat: false,
      vasDisableFlag: false,
      propRowDetails: '',
      shortlead: 'shortlead',
      deviceFlag: false,
      pinSelected: false,
      pincodeOptionsSearch: [],
      selectedVas: [],
      formData: {
        leadName: '',
        contactName: '',
        contactNumber: '',
        alternateContactNumber: '',
        email: '',
        deviceSelected: '',
        leadAddress: '',
        region: '',
        pincode: '',
        pincodeTemp: '',
        state: '',
        city: '',
          leadSource: { id: '', sourceName: '', multiTidEnabled: false },
          device: { id: '', deviceName: '' },
        vasInstanceMapping: '',
        deviceCount: '',
        ownerFirstName: '',
        ownerLastName: '',
        ownerDOB: '',
      },
      columns: [
        { name: 'leadName', label: 'leadName', field: row => row?.leadName || 'NA', align: 'center', sortable: true },
        { name: 'leadNumber', label: 'leadNumber', field: row => row?.leadNumber || 'NA', align: 'center', sortable: true },
        { name: 'contactNumber', label: 'contactNumber', field: row => row?.contactNumber || 'NA', align: 'center', sortable: true },
        { name: 'shortleadDate', label: 'shortleadDate', field: row => row?.shortleadDate || 'NA', align: 'center', sortable: true },
        { name: 'update', required: true, label: 'submit to sat', align: 'left', field: row => row?.id || '', sortable: false }
      ],
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        regionOptions: [],
      },
      selectBankEnableOptions: []
    }
  },
  validations: {
    formData: {
      leadName: { required },
      contactName: { required },
      region: { required },
      contactNumber: { required, minLength: minLength(10), maxLength: maxLength(10) },
      email: { email, required },
      leadAddress: { required },
      pincodeTemp: { required, minLength: minLength(6), maxLength: maxLength(6) },
      state: { required },
      city: { required },
      leadSource: { required },
      device: { required },
      ownerFirstName: {
        required: requiredIf(function () {
          return this.selectedVas.includes('AMEX');
        })
      },
      ownerDOB: {
        required: requiredIf(function () {
          return this.selectedVas.includes('AMEX');
        })
      },
      ownerLastName: {
        required: requiredIf(function () {
          return this.selectedVas.includes('AMEX');
        })
      },
      deviceCount: { required }
    }
  },

  computed: {
    ...mapGetters('appDevice', ['getAllAppDevicesInfo']),
    ...mapGetters('Appvas', ['getVasDeviceMapping']),
    ...mapGetters('appLeadSource', ['getAllAppLeadSource']),
    ...mapGetters('shortLeadInfo', ['getShortLead']),
    ...mapGetters('SuperAdminUsers', ['getAllStatesData']),
    ...mapGetters("InventoryCentral", ["getAllRegionsData"])
  },

  created() {
    this.appLoadData()
    this.fetchappData()
  },

  methods: {
    ...mapActions('appDevice', ['FETCH_APP_DEVICES_DATA']),
    ...mapActions('Appvas', ['FETCH_VAS_DATAS']),
    ...mapActions('appLeadSource', ['FETCH_APP_LEADSOURCE_DATA']),
    ...mapActions('shortLead', ['STATE_SHORT_LEAD']),
    ...mapActions('shortLeadInfo', ['FETCH_SHORT_LEAD']),
    ...mapActions('SuperAdminUsers', ['FETCH_ALL_STATES_DATA', 'FETCH_PINCODE_WITH_TERM']),
    ...mapActions("InventoryCentral", ["FETCH_ALL_REGIONS_DATA"]),
    
    trackChange() {
      this.formData.deviceCount = parseInt(this.formData.deviceCount) === 0 ? null : this.formData.deviceCount
    },
    handleVasChange(newVal) {
      let updated = [...newVal];
      const has = val => updated.includes(val);
      const had = val => this.selectedVas.includes(val);

      if (had('EMI') && !has('EMI')) {
        updated = updated.filter(v => v !== 'Bank EMI' && v !== 'Brand EMI');
      }
      if (has('EMI') && !has('Bank EMI')) {
        updated.push('Bank EMI');
      }
      if (has('Bank EMI') && !has('EMI')) {
        updated.push('EMI');
      }
      if (has('Brand EMI') && !has('EMI')) {
        updated.push('EMI');
      }
      this.selectedVas = [...new Set(updated)];
    },

    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault();
      }
    },

    getDevice(val) {
      let self = this;
      self.FETCH_APP_DEVICES_DATA(val.id)
        .then(() => {
          self.dropDown.deviceOptions = self.getAllAppDevicesInfo.map(item => ({
            value: item,
            label: item.deviceName
          }));
        })
    },
    fnSubmitBankDetails(formData) {
      this.v$.formData.$touch()
      if (this.v$.formData.$error) {
        this.$q.notify('Please review fields again.')
      } else {
        let submissionData = _.cloneDeep(formData);
        if (submissionData.leadSource.multiTidEnabled == true) {
          submissionData.deviceCount = 1;
        }
        submissionData.vasInstanceMapping = JSON.stringify(this.selectedVas)
        submissionData.region = typeof submissionData.region === 'string' ? JSON.parse(submissionData.region) : submissionData.region;

        this.STATE_SHORT_LEAD(submissionData)
        this.shortlead = 'wiplead'
        this.fetchappData()
      }
    },
    devSelected(val) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..' })
      let self = this
      this.FETCH_VAS_DATAS(val.id).then((response) => {
        if (response.status == 200) {
          this.$q.loading.hide()
          this.selectBankEnableOptions = self.getVasDeviceMapping.map(value => ({
            label: value.vas.name,
            value: value.vas.name
          }));

          if (val.deviceName == "Q161_PRO_DQR") {
            const upiOption = this.selectBankEnableOptions.find(opt => opt.label === "UPI QR");
            this.vasDisableFlag = true
            if (upiOption) {
              this.selectedVas = [upiOption.value];
            }
          } else {
            this.selectedVas = [];
            this.vasDisableFlag = false
          }
          if (val.deviceName == "Q161_PRO_SQR") {
            this.formData.deviceCount = 1
            this.deviceFlag = true
          } else {
            this.deviceFlag = false
          }
        } else {
          this.$q.loading.hide()
          this.$q.notify({ color: 'negative', position: 'bottom-left', message: 'Invalid VAS!', icon: 'clear' })
          this.formData.device = ''
        }
      })
    },

    fnPincodeSearch(val, update) {
      if (val.length < 1) {
        update(() => { this.pincodeOptionsSearch = []; });
        return;
      }
      this.FETCH_PINCODE_WITH_TERM(val)
        .then(() => {
          update(() => {
            this.pincodeOptionsSearch = this.COMMON_FILTER_FUNCTION(this.getAllStatesData, val);
          });
        })
        .catch(() => {
          update(() => { this.pincodeOptionsSearch = []; });
        });
    },
    pincodeSelected(item) {
      if (item) {
        this.pinSelected = true;
        this.formData.state = item.value.stateName;
        this.formData.city = item.value.cityName;
        this.formData.pincode = item.value.pincode;
        this.formData.pincodeTemp = item.value.pincode;
      }
    },
    fnClrPin() {
      if (!this.pinSelected) this.formData.pincodeTemp = ''
    },
    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, function (oo) {
        return oo.label.toString().includes(terms.toLowerCase())
      })
    },
    fnShowEditShortLead(rowDetails) {
      this.propShowEditShortLead = !this.propShowEditShortLead
      if (rowDetails) this.propRowDetails = rowDetails
    },
    fnShowConvertToSat(rowDetails) {
      this.propShowConvertToSat = !this.propShowConvertToSat
      if (rowDetails) this.propRowDetails = rowDetails
    },
    appLoadData() {
      let self = this
      self.FETCH_ALL_REGIONS_DATA().then(() => {
        self.dropDown.regionOptions = self.getAllRegionsData.map(item => ({
          value: JSON.stringify(item),
          label: item.regionAreaName
        }));
      })

      self.FETCH_APP_LEADSOURCE_DATA().then(() => {
        let userRegion = JSON.parse(localStorage.getItem("u_i")).region.regionAreaName;
        self.dropDown.leadSourceOptions = self.getAllAppLeadSource
          .filter(item => item.active && (userRegion !== 'VARANEEK' || item.sourceName === 'VARANEEK'))
          .map(item => ({ value: item, label: item.sourceName }));
      })
    },
    fetchappData() { this.FETCH_SHORT_LEAD() },
    goToSelectedTab(tab) {
      if (tab == "wiplead") {
        this.fetchappData()
      } else if (tab == "shortlead") {
        this.formData = {
          leadName: '',
          contactName: '',
          contactNumber: '',
          alternateContactNumber: '',
          email: '',
          deviceSelected: '',
          leadAddress: '',
          region: '',
          pincode: '',
          pincodeTemp: '',
          state: '',
          city: '',
          leadSource: { id: '', sourceName: '', multiTidEnabled: false },
          device: { id: '', deviceName: '' },
          vasInstanceMapping: '',
          deviceCount: '',
          ownerFirstName: '',
          ownerLastName: '',
          ownerDOB: '',
        };
        this.selectedVas = [];
      }
    }
  }
}
</script>

<style>
.border-1 { border: 1px solid rgba(0, 0, 0, 0.1); }
.border-2 { border: 3px solid rgba(48, 48, 48, 0.5); }
</style>
