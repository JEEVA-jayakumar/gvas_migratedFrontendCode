<template>
  <q-page>
    <form>
      <div class="q-px-md">
        <div class="q-pa-sm">
          <div class="row gutter-sm q-py-sm items-center bottom-border">
            <div>
              <div class="text-h6 text-weight-regular">Update User</div>
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
          <div class="row q-col-gutter-sm q-py-sm">
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
              <q-input disable v-model.trim="formData.addUserDetails.email" class="text-weight-regular text-grey-8"
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
          <div class="row group items-center q-my-sm" v-for="(item, index) in getAllHierarchiesAndRolesData" :key="index">
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
              <q-select :disable="!item.checked" color="grey-9"
                :placeholder="item.predecessor && item.predecessor.length == 0 ? 'No data available to display' : 'Choose a predecessor'"
                v-model="item.predecessorChecked" :options="item.predecessor"
                emit-value
                map-options />
            </div>
          </div>
          <div v-if="formData.showBankOpsList" class="row q-col-gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-select multiple color="grey-9" label="Choose bank (can be multiple)"
                v-model="formData.addUserDetails.banksList" :error="v$.formData.addUserDetails.banksList.$error"
                @blur="v$.formData.addUserDetails.banksList.$touch" :options="leadSourceOptions"
                emit-value
                map-options />
            </div>
          </div>
          <div v-if="getAllUserByUserIdData.roles && getAllUserByUserIdData.roles[0].id == 25" class="row q-col-gutter-sm q-py-sm" :disabled="getAllUserByUserIdData.serviceReqClients && getAllUserByUserIdData.serviceReqClients.sourceId != null">
            <div class="col-12"><label> Lead Source Enable? </label></div>
            <div class="col-md-9">
              <q-radio v-for="(item, index) in LeadSourceOptions1" :key="index" color="grey-9"
                v-model.trim="formData.addUserDetails.leadSource" :val="item.value" :label="item.label" />
            </div>
          </div>
          <div v-if="getAllUserByUserIdData.roles && getAllUserByUserIdData.roles[0].hierarchy.hierarchyCode == 'SC'"
            class="row q-col-gutter-sm q-py-sm">
            <div class="col-md-6">
              <q-input label="Please enter authMethod....."
                v-model="formData.addUserDetails.serviceReqClients.authMethod"
                :error="v$.formData.addUserDetails.serviceReqClients.authMethod.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.authMethod.$touch" />
            </div>
            <div class="col-md-6">
              <q-input label="Please enter authKey....."
                v-model="formData.addUserDetails.serviceReqClients.authKey"
                :error="v$.formData.addUserDetails.serviceReqClients.authKey.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.authKey.$touch" />
            </div>
            <div class="col-md-6">
              <q-input label="Please enter authValue....."
                v-model="formData.addUserDetails.serviceReqClients.authValue"
                :error="v$.formData.addUserDetails.serviceReqClients.authValue.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.authValue.$touch" />
            </div>
            <div class="col-md-6">
              <q-input label="Please enter callBackUrl....."
                v-model="formData.addUserDetails.serviceReqClients.callBackUrl"
                :error="v$.formData.addUserDetails.serviceReqClients.callBackUrl.$error"
                @blur="v$.formData.addUserDetails.serviceReqClients.callBackUrl.$touch" />
            </div>
          </div>
        </div>
      </div>

      <div class="full-width q-gutter-sm q-pa-md" align="right">
        <q-btn flat class="bg-white text-weight-regular text-grey-8" @click="GoToUsers()">Cancel</q-btn>
        <q-btn class="text-weight-regular" color="amber-9" @click="refreshData()">Reset</q-btn>
        <q-btn type="button" color="purple-9" @click="fnSubmitShowEditUser(formData.addUserDetails)">Submit</q-btn>
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
  name: "EditUserPage",
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
        disableRegionSelection: false,
        addUserDetails: {
          hasReadPermission: false,
          hasWritePermission: false,
          hasDeletePermission: false,
          hasEditPermission: false,
          hasDownloadPermission: false,
          banksList: [],
          region: { id: "" },
          leadSource: "No",
          serviceReqClients: {
            authMethod: "",
            authKey: "",
            authValue: "",
            callBackUrl: ""
          },
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
          userMapSets: [],
          latitude: 13.25,
          longitude: 80.25
        }
      }
    };
  },

  validations() {
    return {
      formData: {
        addUserDetails: {
          region: {
            id: {
              required: requiredIf(() => {
                return this.formData.disableRegionSelection === false;
              })
            }
          },
          name: { required, minLength: minLength(2) },
          employeeID: { required, alphaNum, minLength: minLength(2) },
          email: { required, email },
          contactNumber: { required, minLength: minLength(7), maxLength: maxLength(10), numeric },
          alternateContactNumber: { minLength: minLength(7), maxLength: maxLength(10), numeric },
          userAddress: { required, minLength: minLength(2) },
          pincodeTemp: { required },
          banksList: {
            required: requiredIf(() => {
              return this.formData.showBankOpsList;
            }),
            minLength: minLength(1)
          },
          leadSource: {
            required: requiredIf(() => {
              return this.getAllUserByUserIdData.roles && this.getAllUserByUserIdData.roles[0].id == 25;
            })
          },
          serviceReqClients: {
            authMethod: {
              required: requiredIf(() => {
                return this.getAllUserByUserIdData.roles && this.getAllUserByUserIdData.roles[0].hierarchy.hierarchyCode == 'SC';
              }),
            },
            authKey: {
              required: requiredIf(() => {
                return this.getAllUserByUserIdData.roles && this.getAllUserByUserIdData.roles[0].hierarchy.hierarchyCode == 'SC';
              }),
            },
            authValue: {
              required: requiredIf(() => {
                return this.getAllUserByUserIdData.roles && this.getAllUserByUserIdData.roles[0].hierarchy.hierarchyCode == 'SC';
              }),
            },
            callBackUrl: {
              required: requiredIf(() => {
                return this.getAllUserByUserIdData.roles && this.getAllUserByUserIdData.roles[0].hierarchy.hierarchyCode == 'SC';
              }),
            },
          }
        }
      }
    }
  },

  created() {
    this.ajaxLoadUserInfo();
    this.ajaxLoadDataForAllStatesList();
    this.ajaxLoadDataForRegionsFilter();
    this.ajaxLoadDataForBankListFilter();
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllUserByUserIdData",
      "getAllRegionsData",
      "getAllStatesData",
      "getAllHierarchiesAndRolesData",
      "getPredecessorByRoleHierarchyData"
    ]),
    ...mapGetters("BankOpsShortLead", ["getSelectOptionsLeadSourceInfo"]),
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_USERS_BY_USER_ID_DATA",
      "FEED_UPDATE_USER_DATA",
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

    refreshData() {
      this.ajaxLoadUserInfo();
    },

    ajaxLoadUserInfo() {
      let innerSelf = this;
      this.$q.loading.show({ message: "Fetching user info..." });
      innerSelf
        .FETCH_ALL_USERS_BY_USER_ID_DATA(innerSelf.$route.params.id)
        .then(() => {
          const user = innerSelf.getAllUserByUserIdData;
          if (!user) return;

          let formData = {
            showBankOpsList: !!user.bankOpsUser,
            disableRegionSelection: user.serviceReqClients != null || user.roles[0].hierarchy.hierarchyCode == "CU",
            addUserDetails: {
              hasReadPermission: user.user.hasReadPermission,
              hasWritePermission: user.user.hasWritePermission,
              hasDeletePermission: user.user.hasDeletePermission,
              hasEditPermission: user.user.hasEditPermission,
              hasDownloadPermission: user.user.hasDownloadPermission,
              banksList: user.bankOpsUser || [],
              userId: user.user.id,
              region: { id: user.region ? user.region.id : "" },
              name: user.user.name,
              employeeID: user.user.employeeID,
              email: user.user.email,
              contactNumber: user.user.contactNumber,
              alternateContactNumber: user.user.alternateContactNumber,
              leadSource: user.serviceReqClients != null ? (user.serviceReqClients.sourceId == null ? "No" : "Yes") : null,
              serviceReqClients: user.serviceReqClients ? {
                authMethod: user.serviceReqClients.authMethod,
                authKey: user.serviceReqClients.authKey,
                authValue: user.serviceReqClients.authValue,
                callBackUrl: user.serviceReqClients.callBackUrl,
              } : { authMethod: "", authKey: "", authValue: "", callBackUrl: "" },
              userAddress: user.user.userAddress,
              city: user.user.city,
              state: user.user.state,
              pincode: user.user.pincode,
              pincodeTemp: String(user.user.pincode),
              userMapSets: []
            }
          };
          
          innerSelf.formData = formData;

          this.FETCH_ALL_HIERARCHIES_ROLES_DATA().then(() => {
            user.roles.forEach(o => {
              const idx = innerSelf.getAllHierarchiesAndRolesData.findIndex(oo => oo.id === o.hierarchy.id);
              if (idx !== -1) {
                innerSelf.getAllHierarchiesAndRolesData[idx].checked = true;
                innerSelf.getAllHierarchiesAndRolesData[idx].roleChecked = o.id;

                let predReq = {
                  region: { id: innerSelf.formData.addUserDetails.region.id },
                  role: { id: o.id }
                };

                innerSelf.FETCH_PREDECESSOR_ON_ROLE(predReq).then(() => {
                  innerSelf.getAllHierarchiesAndRolesData[idx].predecessor = innerSelf.getPredecessorByRoleHierarchyData.map(v => ({
                    label: v.user.name, value: v.user.id
                  }));
                  innerSelf.getAllHierarchiesAndRolesData[idx].predecessorChecked = o.predecessor ? o.predecessor.id : null;
                });
              }
            });
            innerSelf.$q.loading.hide();
          });
        })
        .catch(() => {
          this.$q.notify({ type: "negative", message: `Oops! Something went wrong` });
          innerSelf.$q.loading.hide();
        });
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
          label: oo.sourceName, value: oo.id
        }));
      });
    },

    fnGetCityAndState() {
      this.formData.addUserDetails.pincode = "";
      this.formData.addUserDetails.state = "";
      this.formData.addUserDetails.city = "";
    },

    GoToUsers() {
      this.$router.push("/super/admin/users/");
    },

    getRoleCheckedItem() {
      const hData = this.getAllHierarchiesAndRolesData;
      const boh = hData.find(oo => oo.hierarchyCode == "BOH" && oo.checked);
      const cu = hData.find(oo => oo.hierarchyCode == "CU" && oo.checked);
      const sc = hData.find(oo => oo.hierarchyCode == "SC" && oo.checked);

      this.formData.showBankOpsList = !!boh;
      this.formData.disableRegionSelection = !!(boh || cu || sc);
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
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },

    fnSubmitShowEditUser(requestParams) {
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

      this.v$.formData.addUserDetails.$touch();
      if (this.v$.formData.addUserDetails.$error) {
        this.$q.notify("Please review fields again.");
        return;
      }

      this.$q.loading.show({ message: "Please Wait" });
      let finalParams = _.cloneDeep(requestParams);
      finalParams.banksList = finalParams.banksList.map(id => ({ id }));

      const checkSum = _.find(finalParams.userMapSets, oo => [9, 10, 11].includes(oo.hierarchy.id));
      if (checkSum) {
        finalParams.userMapSets[0].predecessor = null;
        finalParams.userMapSets[0].region = null;
      }

      if (this.getAllUserByUserIdData.serviceReqClients != null) {
        const sourceId = this.getAllUserByUserIdData.serviceReqClients.sourceId;
        finalParams.leadSource = this.formData.addUserDetails.leadSource === "Yes" ? {
          sourceName: this.formData.addUserDetails.name,
          sourceCode: this.formData.addUserDetails.name,
          id: sourceId ? sourceId.id : 0
        } : null;
      }

      this.FEED_UPDATE_USER_DATA(finalParams)
        .then(() => {
          this.$q.notify({ color: "positive", message: "User successfully updated" });
          this.$router.push("/super/admin/users/");
        })
        .catch(error => {
          this.$q.notify({ color: "amber-9", message: error.data?.message || "Error occurred" });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
};
</script>
