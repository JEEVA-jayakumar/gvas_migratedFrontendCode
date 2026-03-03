<template>
  <q-page>
    <form>
      <div class="q-px-md">
        <div class="q-pa-sm">
          <div class="row gutter-sm q-py-sm items-center bottom-border">
            <div>
              <div class="q-title text-weight-regular">Add New User</div>
            </div>
          </div>
        </div>
        <div class="q-pa-md">
          <div class="row q-py-sm">
            <div class="group">
              <div>Permissions</div>
              <q-checkbox color="purple-9" label="Read" v-model="formData.addUserDetails.hasReadPermission" />
              <q-checkbox color="purple-9" label="Write" v-model="formData.addUserDetails.hasWritePermission" />
              <q-checkbox color="purple-9" label="Update" v-model="formData.addUserDetails.hasEditPermission" />
              <q-checkbox color="purple-9" label="Delete" v-model="formData.addUserDetails.hasDeletePermission" />
              <q-checkbox color="purple-9" label="Download" v-model="formData.addUserDetails.hasDownloadPermission" />
            </div>
          </div>
        </div>
        <div class="q-pa-md">
          <div class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select :disable="formData.disableRegionSelection"
                :class="[formData.disableRegionSelection ? 'no-pointer-events' : '']" color="grey-9"
                label="Choose a region" v-model="formData.addUserDetails.region.id"
                :error="v$.formData.addUserDetails.region.id.$error" @blur="v$.formData.addUserDetails.region.id.$touch"
                :options="getAllRegionsData"
                emit-value
                map-options />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.name" @blur="v$.formData.addUserDetails.name.$touch"
                :error="v$.formData.addUserDetails.name.$error" class="text-weight-regular text-grey-8" color="grey-9"
                label="*Name" placeholder="Name" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.employeeID"
                @blur="v$.formData.addUserDetails.employeeID.$touch"
                :error="v$.formData.addUserDetails.employeeID.$error" class="text-weight-regular text-grey-8"
                color="grey-9" label="*Employee ID" placeholder="Employee ID" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.email" class="text-weight-regular text-grey-8"
                color="grey-9" @blur="v$.formData.addUserDetails.email.$touch"
                :error="v$.formData.addUserDetails.email.$error" label="*Email" placeholder="Email" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.contactNumber"
                @blur="v$.formData.addUserDetails.contactNumber.$touch"
                :error="v$.formData.addUserDetails.contactNumber.$error" class="text-weight-regular text-grey-8"
                color="grey-9" label="*Contact Number" placeholder="Contact Number" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.alternateContactNumber"
                @blur="v$.formData.addUserDetails.alternateContactNumber.$touch"
                :error="v$.formData.addUserDetails.alternateContactNumber.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Alt Contact Number"
                placeholder="Alt Contact Number" />
            </div>

            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.userAddress"
                @blur="v$.formData.addUserDetails.userAddress.$touch"
                :error="v$.formData.addUserDetails.userAddress.$error" class="text-weight-regular text-grey-8"
                color="grey-9" label="*Address" placeholder="Address" />
            </div>

            <div class="col-md-6">
              <q-select
                use-input
                hide-selected
                fill-input
                input-debounce="500"
                label="Pincode"
                v-model="formData.addUserDetails.pincodeTemp"
                :options="pincodeOptions"
                @filter="pincodeSearch"
                @update:model-value="pincodeSelected"
                :error="v$.formData.addUserDetails.pincodeTemp.$error"
                clearable
                @clear="fnGetCityAndState"
                color="grey-9"
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

            <div class="col-md-6">
              <q-input disable v-model.trim="formData.addUserDetails.state" class="text-weight-regular text-grey-8"
                color="grey-9" label="*State" placeholder="State" />
            </div>

            <div class="col-md-6">
              <q-input disable v-model.trim="formData.addUserDetails.city" class="text-weight-regular text-grey-8"
                color="grey-9" label="*City" placeholder="City" />
            </div>
          </div>

          <div class="row group" v-for="(item, index) in getAllHierarchiesAndRolesData" :key="index">
            <div class="col">
              <q-checkbox color="purple-9" v-model="item.checked" @update:model-value="getRoleCheckedItem(item)"
                :label="item.hierarchy" />
            </div>
            <div class="col">
              <q-select :disable="!item.checked" color="grey-9" placeholder="Choose a role" v-model="item.roleChecked"
                :options="item.roles" @update:model-value="getPredecessorList(item)"
                emit-value
                map-options />
            </div>
            <div class="col">
              <q-select :disable="item.id > 7" color="grey-9"
                :placeholder="item.predecessor && item.predecessor.length == 0 ? 'No data available to display' : 'Choose a predecessor'"
                v-model="item.predecessorChecked" :options="item.predecessor"
                emit-value
                map-options />
            </div>
          </div>
          <div v-if="formData.showBankOpsList" class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select multiple color="grey-9" label="Choose bank (can be multiple)"
                v-model="formData.addUserDetails.banksList" :error="v$.formData.addUserDetails.banksList.$error"
                @blur="v$.formData.addUserDetails.banksList.$touch" :options="leadSourceOptions"
                emit-value
                map-options />
            </div>
          </div>

          <div v-if="formData.showAllRoleDetails == 25" class="row gutter-sm q-py-sm">
            <div class="col-12"><label> Lead Source Enable? </label></div>
            <div class="col-md-9">
              <q-radio v-for="(item, index) in LeadSourceOptions1" :key="index" color="grey-9"
                v-model.trim="formData.addUserDetails.leadSource.sourceName"
                :val="item.value"
                :label="item.label" />
            </div>
          </div>
          <div v-if="formData.showLeadSource" class="row gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.authMethod"
                @blur="v$.formData.addUserDetails.serviceReqClients.authMethod.$touch"
                :error="v$.formData.addUserDetails.serviceReqClients.authMethod.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Auth Method"
                placeholder="Auth Method" hint="Token, Basic, Barrier" />
            </div>
            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.authKey"
                @blur="v$.formData.addUserDetails.serviceReqClients.authKey.$touch"
                :error="v$.formData.addUserDetails.serviceReqClients.authKey.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Auth Key " placeholder="Auth Key"
                hint="Authorization" />
            </div>
            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.authValue"
                @blur="v$.formData.addUserDetails.serviceReqClients.authValue.$touch"
                :error="v$.formData.addUserDetails.serviceReqClients.authValue.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="Auth Value" placeholder="Auth Value"
                hint="Encrypted Data" />
            </div>
            <div class="col-md-6">
              <q-input v-model.trim="formData.addUserDetails.serviceReqClients.callBackUrl"
                @blur="v$.formData.addUserDetails.serviceReqClients.callBackUrl.$touch"
                :error="v$.formData.addUserDetails.serviceReqClients.callBackUrl.$error"
                class="text-weight-regular text-grey-8" color="grey-9" label="URL" placeholder="URL"
                hint="callBackUrl" />
            </div>
          </div>
        </div>
        <div class="full-width group" align="right">
          <q-btn flat size="md" class="bg-white text-weight-regular text-grey-8" @click="$router.go(-1)">Cancel</q-btn>
          <q-btn size="md" type="button" color="purple-9" @click="fnSubmitShowAddUser(formData.addUserDetails)">Submit
          </q-btn>
        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  requiredIf,
  email,
  minLength,
  maxLength,
  alphaNum,
  numeric
} from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "AddUserPage",
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      pincodeOptions: [],
      leadSourceOptions: [],
      LeadSourceOptions1: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      formData: {
        showBankOpsList: false,
        showLeadSource: false,
        showAllRoleDetails: false,
        disableRegionSelection: false,
        addUserDetails: {
          hasReadPermission: false,
          hasWritePermission: false,
          hasDeletePermission: false,
          hasEditPermission: false,
          hasDownloadPermission: false,
          banksList: [],
          banksListTitle: [],
          region: { id: "" },
          leadSource: { sourceName: null },
          name: "",
          employeeID: "",
          email: "",
          contactNumber: "",
          alternateContactNumber: "",
          userAddress: "",
          city: "",
          state: "",
          pincode: "",
          pincodeTemp: "",
          latitude: 13.25,
          longitude: 80.25,
          serviceReqClients: {
            authMethod: null,
            authKey: null,
            authValue: null,
            callBackUrl: null,
          },
        }
      }
    };
  },

  validations() {
    return {
      formData: {
        addUserDetails: {
          name: { required, minLength: minLength(2) },
          employeeID: { required, alphaNum, minLength: minLength(2) },
          email: { required, email },
          contactNumber: { required, minLength: minLength(7), maxLength: maxLength(10), numeric },
          alternateContactNumber: { minLength: minLength(7), maxLength: maxLength(10), numeric },
          userAddress: { required, minLength: minLength(2) },
          pincodeTemp: { required },
          region: {
            id: {
              required: requiredIf(() => {
                return this.formData.disableRegionSelection === false;
              })
            }
          },
          banksList: {
            required: requiredIf(() => {
              return this.formData.showBankOpsList;
            }),
            minLength: minLength(1)
          },
          leadSource: {
            sourceName: {
              required: requiredIf(() => {
                return this.formData.showAllRoleDetails == 25;
              })
            }
          },
          serviceReqClients: {
            authMethod: { required: requiredIf(() => this.formData.showLeadSource === true) },
            authKey: { required: requiredIf(() => this.formData.showLeadSource === true) },
            authValue: { required: requiredIf(() => this.formData.showLeadSource === true) },
            callBackUrl: { required: requiredIf(() => this.formData.showLeadSource === true) },
          },
        }
      }
    }
  },

  created() {
    this.ajaxLoadDataForAllStatesList();
    this.ajaxLoadDataForHeirarchyFilter();
    this.ajaxLoadDataForRegionsFilter();
    this.ajaxLoadDataForBankListFilter();
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllRegionsData",
      "getAllStatesData",
      "getAllHierarchiesAndRolesData",
      "getPredecessorByRoleHierarchyData"
    ]),
    ...mapGetters("BankOpsShortLead", ["getSelectOptionsLeadSourceInfo"]),
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FEED_USER_DATA",
      "FETCH_ALL_STATES_DATA",
      "FETCH_PINCODE_WITH_TERM",
      "FETCH_ALL_HIERARCHIES_ROLES_DATA",
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_PREDECESSOR_ON_ROLE"
    ]),
    ...mapActions("BankOpsShortLead", ["FETCH_ALL_LEAD_SOURCE_DATA"]),

    pincodeSearch(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      this.FETCH_PINCODE_WITH_TERM(val)
        .then(() => {
          update(() => {
            this.pincodeOptions = this.getAllStatesData.map(item => ({
              label: item.label,
              value: item.value
            }));
          });
        })
        .catch(() => abort());
    },
    pincodeSelected(item) {
      if (item) {
        this.formData.addUserDetails.state = item.value.stateName;
        this.formData.addUserDetails.city = item.value.cityName;
        this.formData.addUserDetails.pincode = item.value.pincode;
        this.formData.addUserDetails.pincodeTemp = item.label;
      }
    },

    ajaxLoadDataForHeirarchyFilter() {
      this.FETCH_ALL_HIERARCHIES_ROLES_DATA();
    },

    ajaxLoadDataForAllStatesList() {
      this.FETCH_ALL_STATES_DATA();
    },

    ajaxLoadDataForRegionsFilter() {
      this.FETCH_ALL_REGIONS_DATA();
    },
    ajaxLoadDataForBankListFilter() {
      this.FETCH_ALL_LEAD_SOURCE_DATA().then(() => {
        this.leadSourceOptions = this.getSelectOptionsLeadSourceInfo.map(oo => ({
          label: oo.sourceName,
          value: oo.id
        }));
      });
    },

    fnGetCityAndState() {
      this.formData.addUserDetails.pincode = "";
      this.formData.addUserDetails.state = "";
      this.formData.addUserDetails.city = "";
    },

    fnSubmitShowAddUser(reqData) {
      let requestParams = _.cloneDeep(this.formData.addUserDetails);
      let cookedArr = [];
      this.getAllHierarchiesAndRolesData.forEach(value => {
        if (value.checked && value.roleChecked != null) {
          cookedArr.push({
            hierarchy: { id: value.id },
            role: { id: value.roleChecked },
            region: { id: this.formData.addUserDetails.region.id },
            predecessor: { id: value.predecessorChecked || null }
          });
        }
      });

      requestParams.userMapSets = cookedArr;
      if (requestParams.userMapSets.length === 0) {
        this.$q.notify({ color: "amber-9", message: "Role mapping is mandatory", icon: "warning" });
        return;
      }

      let checkSum = _.find(requestParams.userMapSets, oo => {
        return !oo.hierarchy.id || !oo.role.id || (!oo.predecessor.id && ![9, 10, 11].includes(oo.hierarchy.id));
      });

      if (checkSum) {
        this.$q.notify({ color: "amber-9", message: "Missing mandatory mapping fields" });
        return;
      }

      this.v$.formData.addUserDetails.$touch();
      if (this.v$.formData.addUserDetails.$error) {
        this.$q.notify("Please review fields again.");
        return;
      }

      requestParams.banksList = requestParams.banksList.map(id => ({ id }));
      requestParams.leadSource = requestParams.leadSource.sourceName === "Yes" ? {
        sourceName: requestParams.name,
        sourceCode: requestParams.name
      } : null;

      if (!this.formData.showLeadSource) requestParams.serviceReqClients = null;

      this.$q.loading.show({ message: "Please Wait" });
      this.FEED_USER_DATA(requestParams)
        .then(() => {
          this.$q.notify({ color: "positive", message: "User successfully created" });
          this.$router.push("/super/admin/users/");
        })
        .catch(error => {
          this.$q.notify({ color: "amber-9", message: error.data?.message || "Error occurred" });
        })
        .finally(() => this.$q.loading.hide());
    },

    getPredecessorList(item) {
      let formData = {
        region: { id: this.formData.addUserDetails.region.id },
        role: { id: item.roleChecked }
      };
      this.formData.showAllRoleDetails = formData.role.id;
      this.$q.loading.show({ message: "Please Wait" });
      this.FETCH_PREDECESSOR_ON_ROLE(formData)
        .then(() => {
          item.predecessor = this.getPredecessorByRoleHierarchyData.map(v => ({
            label: v.user.name, value: v.user.id
          }));
        })
        .finally(() => this.$q.loading.hide());
    },

    getRoleCheckedItem() {
      let self = this;
      let checksum = _.find(self.getAllHierarchiesAndRolesData, oo => oo.hierarchyCode == "BOH" && oo.checked);
      let checksum1 = _.find(self.getAllHierarchiesAndRolesData, oo => oo.hierarchyCode == "SC" && oo.checked);
      let checksum2 = _.find(self.getAllHierarchiesAndRolesData, oo => oo.hierarchyCode == "CU" && oo.checked);

      this.formData.showBankOpsList = !!checksum;
      this.formData.showLeadSource = !!checksum1;
      this.formData.disableRegionSelection = !!(checksum || checksum1 || checksum2);
    }
  }
};
</script>
