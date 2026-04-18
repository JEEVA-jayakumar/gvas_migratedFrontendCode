<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-card shadow-1 bg-white border-radius-16 overflow-hidden fade-up">
      <!-- Header Section -->
      <div class="q-pa-lg border-bottom">
        <div class="row items-center justify-between">
          <div>
            <div class="text-overline text-purple-9 text-weight-bold">Lead Management</div>
            <h1 class="text-h5 text-weight-bold text-slate-900 q-ma-none">Lead Acquisition Portal</h1>
          </div>
          <q-tabs
            v-model="shortlead"
            @update:model-value="goToSelectedTab"
            class="premium-tabs"
            active-color="purple-9"
            indicator-color="purple-9"
            align="left"
            no-caps
          >
            <q-tab name="shortlead" label="New Lead Entry" icon="add_circle_outline" />
            <q-tab name="wiplead" label="Active WIP Queue" icon="hourglass_top" />
          </q-tabs>
        </div>
      </div>

      <q-tab-panels v-model="shortlead" animated class="bg-white">
        <!-- Short Lead (Data Entry) Panel -->
        <q-tab-panel name="shortlead" class="q-pa-none">
          <div class="q-pa-xl" v-if="shortlead === 'shortlead' && formData && typeof formData === 'object'">
            <div class="row items-center q-mb-lg">
              <div class="col-auto q-mr-md">
                <q-avatar color="purple-1" text-color="purple-9" icon="business" size="48px" />
              </div>
              <div class="col">
                <div class="text-h6 text-slate-900">Merchant Information</div>
                <div class="text-caption text-slate-500">Enter primary business and contact details</div>
              </div>
            </div>

            <form @submit.prevent="fnSubmitBankDetails(formData)">
              <div class="row q-col-gutter-lg">
                <!-- Row 1 -->
                <div class="col-md-6 col-sm-12">
                  <q-input
                    v-model="formData.leadName"
                    @blur="v$.formData.leadName.$touch"
                    :error="v$.formData.leadName.$error"
                    outlined
                    dense
                    label="Merchant Name *"
                    placeholder="Legal business name"
                    class="premium-input"
                  />
                </div>
                <div class="col-md-6 col-sm-12">
                  <q-input
                    v-model="formData.contactName"
                    @blur="v$.formData.contactName.$touch"
                    :error="v$.formData.contactName.$error"
                    outlined
                    dense
                    label="Primary Contact Person *"
                    placeholder="Full name of representative"
                    class="premium-input"
                  />
                </div>

                <!-- Row 2 -->
                <div class="col-md-6 col-sm-12">
                  <q-input
                    type="number"
                    v-model="formData.contactNumber"
                    @blur="v$.formData.contactNumber.$touch"
                    :error="v$.formData.contactNumber.$error"
                    outlined
                    dense
                    label="Contact Number *"
                    placeholder="10-digit mobile number"
                    class="premium-input"
                    prefix="+91"
                  />
                </div>
                <div class="col-md-6 col-sm-12">
                  <q-input
                    type="number"
                    v-model="formData.alternateContactNumber"
                    outlined
                    dense
                    label="Alternate Number"
                    placeholder="Optional secondary number"
                    class="premium-input"
                  />
                </div>

                <!-- Row 3 -->
                <div class="col-md-6 col-sm-12">
                  <q-input
                    v-model="formData.email"
                    @blur="v$.formData.email.$touch"
                    :error="v$.formData.email.$error"
                    outlined
                    dense
                    label="Official Email ID *"
                    placeholder="merchant@example.com"
                    class="premium-input"
                  />
                </div>
                <div class="col-md-6 col-sm-12">
                  <q-input
                    v-model="formData.leadAddress"
                    @blur="v$.formData.leadAddress.$touch"
                    :error="v$.formData.leadAddress.$error"
                    outlined
                    dense
                    label="Merchant Business Address *"
                    placeholder="Full street address, shop number"
                    class="premium-input"
                  />
                </div>

                <!-- Row 4 - Location -->
                <div class="col-md-4 col-sm-12">
                  <q-select
                    :error="v$.formData.pincodeTemp.$error"
                    @blur="fnClrPin"
                    v-model="formData.pincodeTemp"
                    outlined
                    dense
                    label="Pincode *"
                    placeholder="6-digit PIN"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="500"
                    :options="pincodeOptionsSearch"
                    @filter="fnPincodeSearch"
                    @update:model-value="pincodeSelected"
                    class="premium-select"
                  >
                    <template v-slot:prepend><q-icon name="location_on" color="slate-400" /></template>
                  </q-select>
                </div>
                <div class="col-md-4 col-sm-6">
                  <q-input disable v-model="formData.city" outlined dense label="City" class="premium-input bg-slate-50" />
                </div>
                <div class="col-md-4 col-sm-6">
                  <q-input disable v-model="formData.state" outlined dense label="State" class="premium-input bg-slate-50" />
                </div>

                <!-- Row 5 - Configuration -->
                <div class="col-md-4 col-sm-12">
                  <q-select
                    v-model="formData.region"
                    @blur="v$.formData.region.$touch"
                    :error="v$.formData.region.$error"
                    outlined
                    dense
                    label="Operational Region *"
                    :options="dropDown.regionOptions"
                    emit-value
                    map-options
                    class="premium-select"
                  />
                </div>
                <div class="col-md-4 col-sm-12">
                  <q-select
                    v-model="formData.leadSource"
                    @blur="v$.formData.leadSource.$touch"
                    :error="v$.formData.leadSource.$error"
                    outlined
                    dense
                    label="Lead Source *"
                    :options="dropDown.leadSourceOptions"
                    @update:model-value="getDevice"
                    emit-value
                    map-options
                    class="premium-select"
                  />
                </div>
                <div class="col-md-4 col-sm-12">
                  <q-select
                    v-model="formData.device"
                    @update:model-value="devSelected"
                    :error="v$.formData.device.$error"
                    outlined
                    dense
                    label="Preferred Device Type *"
                    :options="dropDown.deviceOptions"
                    emit-value
                    map-options
                    class="premium-select"
                  />
                </div>

                <!-- VAS & Special Params -->
                <div class="col-12 q-mt-md">
                   <div class="text-subtitle2 text-slate-700 q-mb-sm">Value Added Services (VAS)</div>
                   <div class="q-pa-md bg-slate-50 border-radius-12 border-1">
                      <q-option-group
                        inline
                        type="checkbox"
                        :model-value="selectedVas"
                        @update:model-value="handleVasChange"
                        :disable="vasDisableFlag"
                        color="purple-9"
                        :options="selectBankEnableOptions"
                      />
                   </div>
                </div>

                <!-- Conditional Amex Fields -->
                <template v-if="selectedVas.includes('AMEX')">
                  <div class="col-md-4 col-sm-12">
                    <q-input v-model="formData.ownerFirstName" outlined dense label="Owner First Name *" class="premium-input" />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-input v-model="formData.ownerLastName" outlined dense label="Owner Last Name *" class="premium-input" />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-input type="date" v-model="formData.ownerDOB" outlined dense label="Owner Date of Birth *" stack-label class="premium-input" />
                  </div>
                </template>

                <div class="col-md-4 col-sm-12">
                  <q-input
                    v-model="formData.deviceCount"
                    @blur="v$.formData.deviceCount.$touch"
                    :disable="deviceFlag"
                    :error="v$.formData.deviceCount.$error"
                    outlined
                    dense
                    label="Required Device Count *"
                    class="premium-input"
                    type="number"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-xl">
                <q-btn
                  unelevated
                  color="purple-9"
                  icon="check_circle"
                  label="Initialize Lead Creation"
                  @click="fnSubmitBankDetails(formData)"
                  class="premium-btn-primary q-px-xl"
                  size="lg"
                />
              </div>
            </form>
          </div>
        </q-tab-panel>

        <!-- WIP Lead Panel -->
        <q-tab-panel name="wiplead" class="q-pa-none">
          <div class="q-pa-md">
            <q-table
              flat
              class="premium-table"
              title="Active Work-In-Progress Queue"
              :rows="getShortLead || []"
              :columns="columns"
              row-key="id"
              :rows-per-page-options="[10, 20, 50]"
            >
              <template v-slot:body-cell-leadNumber="props">
                <q-td :props="props">
                  <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold">
                    # {{ props.row.leadNumber }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-shortleadDate="props">
                <q-td :props="props">
                  <div class="text-slate-500">{{ $moment(props.row.shortleadDate).format("DD MMM YYYY") }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-update="props">
                <q-td :props="props" class="text-right">
                  <q-btn
                    unelevated
                    no-caps
                    label="Continue to SAT"
                    icon-right="arrow_forward"
                    size="sm"
                    color="purple-9"
                    @click="fnShowConvertToSat(props.row)"
                    class="premium-btn"
                  />
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="full-width q-pa-xl text-center text-slate-400">
                   <q-icon name="playlist_add_check" size="64px" class="opacity-20 q-mb-md" />
                   <div class="text-h6 opacity-50">All caught up! No pending WIP leads.</div>
                </div>
              </template>
            </q-table>

            <editShortLead
              v-if="propShowEditShortLead && propRowDetails"
              :propShowEditShortLead="propShowEditShortLead"
              :propRowDetails="propRowDetails"
              @emitfnshowEditShortLead="fnShowEditShortLead"
            />
            <convertToSat
              v-if="propShowConvertToSat && propRowDetails"
              :propShowConvertToSat="propShowConvertToSat"
              :propRowDetails="propRowDetails"
              @emitEditshowConvertToSat="fnShowConvertToSat"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import editShortLead from '../../components/sat/editShortLead.vue'
import convertToSat from '../../components/sat/convertToSat.vue'
import _ from 'lodash'
import { required, requiredIf, minLength, maxLength, email } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: 'LeadDataEntryScreen',
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
        { name: 'leadNumber', label: 'Lead ID', field: 'leadNumber', align: 'left', sortable: true },
        { name: 'leadName', label: 'Merchant Name', field: 'leadName', align: 'left', sortable: true },
        { name: 'contactNumber', label: 'Contact', field: 'contactNumber', align: 'left', sortable: true },
        { name: 'shortleadDate', label: 'Created On', field: 'shortleadDate', align: 'left', sortable: true },
        { name: 'update', label: 'Actions', align: 'right', field: 'id', sortable: false }
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
    
    handleVasChange(newVal) {
      let updated = [...newVal];
      const has = val => updated.includes(val);
      const had = val => this.selectedVas.includes(val);
      if (had('EMI') && !has('EMI')) updated = updated.filter(v => v !== 'Bank EMI' && v !== 'Brand EMI');
      if (has('EMI') && !has('Bank EMI')) updated.push('Bank EMI');
      if (has('Bank EMI') && !has('EMI')) updated.push('EMI');
      if (has('Brand EMI') && !has('EMI')) updated.push('EMI');
      this.selectedVas = [...new Set(updated)];
    },
    getDevice(val) {
      this.FETCH_APP_DEVICES_DATA(val.id).then(() => {
        this.dropDown.deviceOptions = this.getAllAppDevicesInfo.map(item => ({ value: item, label: item.deviceName }));
      })
    },
    fnSubmitBankDetails(formData) {
      this.v$.formData.$touch()
      if (this.v$.formData.$error) {
        this.$q.notify({ color: 'red-9', message: 'Please complete all required fields correctly.', icon: 'warning' })
      } else {
        let submissionData = _.cloneDeep(formData);
        if (submissionData.leadSource.multiTidEnabled == true) submissionData.deviceCount = 1;
        submissionData.vasInstanceMapping = JSON.stringify(this.selectedVas)
        submissionData.region = typeof submissionData.region === 'string' ? JSON.parse(submissionData.region) : submissionData.region;
        this.STATE_SHORT_LEAD(submissionData)
        this.shortlead = 'wiplead'
        this.fetchappData()
      }
    },
    devSelected(val) {
      this.$q.loading.show({ spinnerColor: 'purple-9', message: 'Configuring VAS profiles...' })
      this.FETCH_VAS_DATAS(val.id).then((response) => {
        this.$q.loading.hide()
        if (response.status == 200) {
          this.selectBankEnableOptions = this.getVasDeviceMapping.map(value => ({ label: value.vas.name, value: value.vas.name }));
          if (val.deviceName == "Q161_PRO_DQR") {
            const upiOption = this.selectBankEnableOptions.find(opt => opt.label === "UPI QR");
            this.vasDisableFlag = true;
            if (upiOption) this.selectedVas = [upiOption.value];
          } else {
            this.selectedVas = [];
            this.vasDisableFlag = false;
          }
          this.deviceFlag = (val.deviceName == "Q161_PRO_SQR");
          if (this.deviceFlag) this.formData.deviceCount = 1;
        } else {
          this.$q.notify({ color: 'negative', message: 'Invalid VAS configuration for this device', icon: 'error' })
          this.formData.device = ''
        }
      })
    },
    fnPincodeSearch(val, update) {
      if (val.length < 1) { update(() => { this.pincodeOptionsSearch = []; }); return; }
      this.FETCH_PINCODE_WITH_TERM(val).then(() => {
        update(() => { this.pincodeOptionsSearch = _.filter(this.getAllStatesData, oo => oo.label.toString().includes(val.toLowerCase())); });
      })
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
    fnClrPin() { if (!this.pinSelected) this.formData.pincodeTemp = '' },
    fnShowEditShortLead(rowDetails) {
      this.propShowEditShortLead = !this.propShowEditShortLead
      if (rowDetails) this.propRowDetails = rowDetails
    },
    fnShowConvertToSat(rowDetails) {
      this.propShowConvertToSat = !this.propShowConvertToSat
      if (rowDetails) this.propRowDetails = rowDetails
    },
    appLoadData() {
      this.FETCH_ALL_REGIONS_DATA().then(() => {
        this.dropDown.regionOptions = this.getAllRegionsData.map(item => ({ value: JSON.stringify(item), label: item.regionAreaName }));
      })
      this.FETCH_APP_LEADSOURCE_DATA().then(() => {
        let userRegion = JSON.parse(localStorage.getItem("u_i")).region.regionAreaName;
        this.dropDown.leadSourceOptions = this.getAllAppLeadSource
          .filter(item => item.active && (userRegion !== 'VARANEEK' || item.sourceName === 'VARANEEK'))
          .map(item => ({ value: item, label: item.sourceName }));
      })
    },
    fetchappData() { this.FETCH_SHORT_LEAD() },
    goToSelectedTab(tab) {
      if (tab == "wiplead") this.fetchappData()
      else if (tab == "shortlead") {
        this.formData = {
          leadName: '', contactName: '', contactNumber: '', alternateContactNumber: '', email: '',
          deviceSelected: '', leadAddress: '', region: '', pincode: '', pincodeTemp: '', state: '', city: '',
          leadSource: { id: '', sourceName: '', multiTidEnabled: false },
          device: { id: '', deviceName: '' },
          vasInstanceMapping: '', deviceCount: '', ownerFirstName: '', ownerLastName: '', ownerDOB: '',
        };
        this.selectedVas = [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.premium-tabs {
  background: #f8fafc;
  border-radius: 12px;
  padding: 4px;
  ::v-deep(.q-tab) {
    border-radius: 8px;
    margin: 0 4px;
    min-height: 40px;
    transition: all 0.3s ease;
  }
  ::v-deep(.q-tab--active) {
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
}

.border-bottom { border-bottom: 1px solid #f1f5f9; }
.border-radius-12 { border-radius: 12px; }
.border-1 { border: 1px solid #e2e8f0; }
.bg-purple-1 { background-color: #faf5ff; }
.opacity-20 { opacity: 0.2; }
.opacity-50 { opacity: 0.5; }
</style>
