<template>
  <div>
    <form>
      <div class="q-px-md">
        <!-- Header -->
        <div class="q-pa-sm">
          <div class="row q-py-sm items-center bottom-border">
            <div class="text-h6 text-weight-regular">Add New User</div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="q-pa-md">
          <div class="group">
            <div class="q-mb-sm">Permissions</div>
            <q-checkbox v-model="formData.addUserDetails.hasReadPermission" label="Read" color="purple-9"/>
            <q-checkbox v-model="formData.addUserDetails.hasWritePermission" label="Write" color="purple-9"/>
            <q-checkbox v-model="formData.addUserDetails.hasEditPermission" label="Update" color="purple-9"/>
            <q-checkbox v-model="formData.addUserDetails.hasDeletePermission" label="Delete" color="purple-9"/>
            <q-checkbox v-model="formData.addUserDetails.hasDownloadPermission" label="Download" color="purple-9"/>
          </div>
        </div>

        <!-- Basic Details -->
        <div class="q-pa-md">
          <div class="row q-col-gutter-md">

            <div class="col-md-6">
              <q-select
                outlined
                label="Choose a region"
                v-model="formData.addUserDetails.region.id"
                :options="getAllRegionsData"
                :disable="formData.disableRegionSelection"
                :error="v$.formData.addUserDetails.region.id.$error"
                @blur="v$.formData.addUserDetails.region.id.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input
                outlined
                label="*Name"
                v-model.trim="formData.addUserDetails.name"
                :error="v$.formData.addUserDetails.name.$error"
                @blur="v$.formData.addUserDetails.name.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input
                outlined
                label="*Employee ID"
                v-model.trim="formData.addUserDetails.employeeID"
                :error="v$.formData.addUserDetails.employeeID.$error"
                @blur="v$.formData.addUserDetails.employeeID.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input
                outlined
                label="*Email"
                v-model.trim="formData.addUserDetails.email"
                :error="v$.formData.addUserDetails.email.$error"
                @blur="v$.formData.addUserDetails.email.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input
                outlined
                label="*Contact Number"
                v-model.trim="formData.addUserDetails.contactNumber"
                :error="v$.formData.addUserDetails.contactNumber.$error"
                @blur="v$.formData.addUserDetails.contactNumber.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input
                outlined
                label="Alt Contact Number"
                v-model.trim="formData.addUserDetails.alternateContactNumber"
                :error="v$.formData.addUserDetails.alternateContactNumber.$error"
                @blur="v$.formData.addUserDetails.alternateContactNumber.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input
                outlined
                label="*Address"
                v-model.trim="formData.addUserDetails.userAddress"
                :error="v$.formData.addUserDetails.userAddress.$error"
                @blur="v$.formData.addUserDetails.userAddress.$touch"
              />
            </div>

            <!-- Pincode -->
            <div class="col-md-6">
              <q-input
                outlined
                label="Pincode"
                v-model="formData.addUserDetails.pincodeTemp"
                :error="v$.formData.addUserDetails.pincodeTemp.$error"
                @blur="v$.formData.addUserDetails.pincodeTemp.$touch"
              />
            </div>

            <div class="col-md-6">
              <q-input outlined label="State" v-model="formData.addUserDetails.state" disable/>
            </div>

            <div class="col-md-6">
              <q-input outlined label="City" v-model="formData.addUserDetails.city" disable/>
            </div>

          </div>
        </div>

        <!-- Hierarchy + Roles -->
        <div
          class="row items-center q-col-gutter-md q-px-md"
          v-for="(item,index) in getAllHierarchiesAndRolesData"
          :key="index"
        >
          <div class="col">
            <q-checkbox v-model="item.checked" :label="item.hierarchy" @update:model-value="getRoleCheckedItem(item)" />
          </div>

          <div class="col">
            <q-select
              outlined
              label="Choose a role"
              v-model="item.roleChecked"
              :options="item.roles"
              :disable="!item.checked"
              @update:model-value="getPredecessorList(item)"
            />
          </div>

          <div class="col">
            <q-select
              outlined
              label="Choose a predecessor"
              v-model="item.predecessorChecked"
              :options="item.predecessor"
              :disable="item.id > 7"
            />
          </div>
        </div>

        <!-- Bank List -->
        <div v-if="formData.showBankOpsList" class="q-pa-md">
          <q-select
            outlined
            multiple
            label="Choose bank"
            v-model="formData.addUserDetails.banksList"
            :options="leadSourceOptions"
            :error="v$.formData.addUserDetails.banksList.$error"
            @blur="v$.formData.addUserDetails.banksList.$touch"
          />
        </div>

        <!-- Lead Source -->
        <div v-if="formData.showAllRoleDetails == 25" class="q-pa-md">
          <div class="q-mb-sm">Lead Source Enable?</div>
          <q-radio
            v-for="opt in LeadSourceOptions1"
            :key="opt.value"
            v-model="formData.addUserDetails.leadSource.sourceName"
            :val="opt.value"
            :label="opt.label"
          />
        </div>

        <!-- Service Client -->
        <div v-if="formData.showLeadSource" class="q-pa-md row q-col-gutter-md">
          <div class="col-md-6">
            <q-input outlined label="Auth Method" v-model="formData.addUserDetails.serviceReqClients.authMethod"/>
          </div>
          <div class="col-md-6">
            <q-input outlined label="Auth Key" v-model="formData.addUserDetails.serviceReqClients.authKey"/>
          </div>
          <div class="col-md-6">
            <q-input outlined label="Auth Value" v-model="formData.addUserDetails.serviceReqClients.authValue"/>
          </div>
          <div class="col-md-6">
            <q-input outlined label="URL" v-model="formData.addUserDetails.serviceReqClients.callBackUrl"/>
          </div>
        </div>

        <!-- Actions -->
        <div class="q-pa-md text-right">
          <q-btn flat label="Cancel" @click="$router.go(-1)" class="q-mr-sm"/>
          <q-btn color="purple-9" label="Submit" @click="fnSubmitShowAddUser(formData.addUserDetails)" />
        </div>

      </div>
    </form>
  </div>
</template>


<script>
import {
  required,
  requiredIf,
  email,
  minLength,
  maxLength,
  alpha,
  alphaNum,
  numeric
} from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      leadSourceOptions: [],
      LeadSourceOptions1: [
        {
          label: "Yes",
          value: "Yes"
        },
        {
          label: "No",
          value: "No"
        },
      ],
      // showAllRoleDetails: {},


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
          region: {
            id: ""
          },
          leadSource: {
            sourceName: null
          },
          dynamicDataBinding: "",
          profilePicture: "uploads/c7818f74-9652-42f9-a902-9da6a692cdf3.png",
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
          stateTemp: [],
          //**** TODO change it has static values brooo
          latitude: 13.25,
          longitude: 80.25,
          serviceReqClients: {
            authMethod: null,
            authKey: null,
            authValue: null,
            callBackUrl: null,
          },
          //************** */
        }
      }
    };
  },

  validations: {
    formData: {
      addUserDetails: {
        name: {
          required,
          minLength: minLength(2)
        },
        employeeID: {
          required,
          alphaNum,
          minLength: minLength(2)
        },
        email: {
          required,
          email
        },
        contactNumber: {
          required,
          minLength: minLength(7),
          maxLength: maxLength(10),
          numeric
        },
        alternateContactNumber: {
          minLength: minLength(7),
          maxLength: maxLength(10),
          numeric
        },
        userAddress: {
          required,
          minLength: minLength(2)
        },
        pincodeTemp: {
          required
        },
        region: {
          id: {
            required: requiredIf(function () {
              return this.formData.disableRegionSelection === false;
            })
          }
        },
        banksList: {
          required: requiredIf(function () {
            return this.formData.showBankOpsList;
          }),
          minLength: minLength(1)
        },
        leadSource: {
          sourceName: {
            required: requiredIf(function () {
              return (this.formData.showAllRoleDetails == 25) === true;
            })
          }


        },
        serviceReqClients: {
          authMethod: {
            required: requiredIf(function () {
              return this.formData.showLeadSource === true;
            })
          },
          authKey: {
            required: requiredIf(function () {
              return this.formData.showLeadSource === true;
            })
          },
          authValue: {
            required: requiredIf(function () {
              return this.formData.showLeadSource === true;
            })
          },
          callBackUrl: {
            required: requiredIf(function () {
              return this.formData.showLeadSource === true;
            })
          },
        },
      }
    }
  },

  created() {
    /* START: Load all States */
    this.ajaxLoadDataForAllStatesList();
    /* End: Load all States */

    /* START: Load user table data filter > Hierarchy */
    this.ajaxLoadDataForHeirarchyFilter();
    /* End: Load user table data filter > Hierarchy */

    /* START: Load user table data filter > Regions */
    this.ajaxLoadDataForRegionsFilter();
    this.ajaxLoadDataForBankListFilter();
    /* End: Load user table data filter > Regions */
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllRoles",
      "getAllUsers",
      "getAllRegionsData",
      "getAllHierarchiesData",
      "getAllStatesData",
      "getAllHierarchiesAndRolesData",
      "getPredecessorByRoleHierarchyData"
    ]),
    ...mapGetters("BankOpsShortLead", ["getSelectOptionsLeadSourceInfo"]),

    //  fndisable: function(){
    //             console.log("this.getAllHierarchiesAndRolesData --->",JSON.stringify(this.getAllHierarchiesAndRolesData))
    //             let size = this.getAllHierarchiesAndRolesData.length;
    //            console.log("this.getAllHierarchiesAndRolesData.length --------->", JSON.stringify(this.getAllHierarchiesAndRolesData.length))
    //         if(this.getAllHierarchiesAndRolesData.checked == true ){
    //                     console.log("this.enable details --------->", JSON.stringify(this.getAllHierarchiesAndRolesData))
    //                     return false;
    //                 } else{
    //                     console.log("this.disable details --------->", JSON.stringify(this.getAllHierarchiesAndRolesData))
    //                     return true;
    //                       }

            //   for(var i=0; i<this.getAllHierarchiesAndRolesData.length; i++){
            //   console.log("this.getAllHierarchiesAndRolesData.length --------->", JSON.stringify(this.getAllHierarchiesAndRolesData.length))
            //   //  if(this.getAllHierarchiesAndRolesData[i].checked == true){
            //         if(this.getAllHierarchiesAndRolesData[7].checked == true || this.getAllHierarchiesAndRolesData[8].checked == true){
            //             console.log("this.enable details --------->", JSON.stringify(this.getAllHierarchiesAndRolesData[i]))
            //             return true;
            //         } else{
            //             console.log("this.enable details --------->", JSON.stringify(this.getAllHierarchiesAndRolesData[i]))
            //             return false;
            //               }

    //         //     // }else{
    //         //     // console.log("this. disable --------->", JSON.stringify(this.getAllHierarchiesAndRolesData[i]))
    //         //     //     return false
    //         //     // }
    //         // }
    //           //  if(this.item.predecessorChecked > 0){
    //           //   console.log("this.listAllSubTidDetails[i] details --------->", JSON.stringify(this.getAllHierarchiesAndRolesData[i]))
    //           //      return true
    //           //   }else{
    //           //       return false
    //           //   }
            // }
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_USERS_DATA",
      "FEED_USER_DATA",
      "FETCH_ALL_STATES_DATA",
      "FETCH_PINCODE_WITH_TERM",
      "FETCH_ALL_ROLES_DATA",
      "FETCH_ALL_HIERARCHIES_ROLES_DATA",
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_PREDECESSOR_ON_ROLE"
    ]),
    ...mapActions("BankOpsShortLead", ["FETCH_ALL_LEAD_SOURCE_DATA"]),
    /* Pincode search result */
    pincodeSearch(terms, done) {
      this.formData.addUserDetails.cityName = "";
      this.formData.addUserDetails.stateName = "";
      this.FETCH_PINCODE_WITH_TERM(terms)
        .then(() => {
          done(this.COMMON_FILTER_FUNCTION(this.getAllStatesData, terms));
        })
        .catch(() => {
          done([]);
        });
    },
    pincodeSelected(item) {
      this.formData.addUserDetails.state = item.value.stateName;
      this.formData.addUserDetails.city = item.value.cityName;
      this.formData.addUserDetails.pincode = item.value.pincode;
      this.formData.addUserDetails.pincodeTemp = item.value.pincode;
    },
    /* Pincode search result */

    COMMON_FILTER_FUNCTION(arraySet, terms) {
      return _.filter(arraySet, function (oo) {
        return oo.label.toString().includes(terms.toLowerCase());
      });
    },

    /* Pincode search result */
    bankListSearch(terms, done) {
      done(this.COMMON_FILTER_FUNCTION(this.leadSourceOptions, terms));
    },
    bankListSelected(item) {
      let self = this;
      self.formData.addUserDetails.banksListTitle = [];
      self.formData.addUserDetails.banksList.push(item);
      _.map(self.formData.addUserDetails.banksList, function (oo) {
        self.formData.addUserDetails.banksListTitle.push(oo.label);
      });
    },
    /* Pincode search result */

    ajaxLoadDataForHeirarchyFilter() {
      this.FETCH_ALL_HIERARCHIES_ROLES_DATA();
    },

    ajaxLoadDataForAllStatesList() {
      this.FETCH_ALL_STATES_DATA();
    },

    // //API to fetch hierarchy
    ajaxLoadDataForRegionsFilter() {
      this.FETCH_ALL_REGIONS_DATA();
    },
    // //API to fetch hierarchy
    ajaxLoadDataForBankListFilter() {
      this.FETCH_ALL_LEAD_SOURCE_DATA().then(() => {
        let assumeArr = [];
        _.map(this.getSelectOptionsLeadSourceInfo, function (oo) {
          assumeArr.push({ label: oo.sourceName, value: oo.id });
        });
        this.leadSourceOptions = assumeArr;
      });
    },

    fnGetCityAndState() {
      this.formData.addUserDetails.pincode = this.formData.addUserDetails.pincodeTemp.pincode;
      this.formData.addUserDetails.state = this.formData.addUserDetails.pincodeTemp.stateName;
      this.formData.addUserDetails.city = this.formData.addUserDetails.pincodeTemp.cityName;
    },
    //item.predecessor
    fnSubmitShowAddUser(reqData) {
      console.log("fnSubmitShowAddUser--------->", JSON.stringify(reqData));
      let requestParams = this.formData.addUserDetails;
      let cookedArr = [];
      let innerSelf = this;
      let assumeArr = this.getAllHierarchiesAndRolesData.map(function (value) {
        if (
          value.checked == true &&
          value.roleChecked != null &&
          value.predecessorChecked != null
        ) {
          let assumeObj = {
            hierarchy: {
              id: value.id
            },
            role: {
              id: value.roleChecked
            },
            region: {
              id: innerSelf.formData.addUserDetails.region.id
            },
            predecessor: {
              id: value.predecessorChecked
            }
          };
          cookedArr.push(assumeObj);
        }
      });

      requestParams.userMapSets = cookedArr;
      console.log("cookedArr----------->", JSON.stringify(requestParams))
      if (requestParams.userMapSets.length == 0) {
        this.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Role mapping is mandatory",
          icon: "warning"
        });
        return false;
      } else {
        console.log("SUBMITTING THE CHECKSUM VALUES-1234------->", JSON.stringify(requestParams.userMapSets))
        let checkSum = _.find(requestParams.userMapSets, function (oo) {
          // console.log("SUBMITTING THE CHECKSUM VALUES-------->",JSON.stringify(oo))
          return (oo.hierarchy.id == 0 || oo.role.id == 0 || oo.predecessor.id == 0);
        });
        console.log(" THE CHECKSUM VALUES-------->", JSON.stringify(checkSum))
        // UAT SERVICE REQUEST(HIERARCHY ID -- 8) AND CRM USER (HIERARCHY ID -- 10)
        // PRODUCTION SERVICE REQUEST(HIERARCHY ID -- 9) AND CRM USER (HIERARCHY ID -- 10)
        if (checkSum != undefined && checkSum.hierarchy.id != 9 && checkSum.hierarchy.id != 10 && checkSum.hierarchy.id != 11) {
          if (checkSum.hierarchy.id == 0) {
            this.$q.notify({
              type: "negative",
              color: "amber-9",
              position: "bottom",
              message: "Hierarchy is mandatory"
            });
          } else if (checkSum.role.id == 0) {
            this.$q.notify({
              type: "negative",
              color: "amber-9",
              position: "bottom",
              message: "Role is mandatory"
            });
            // UAT SERVICE REQUEST(HIERARCHY ID -- 8) AND CRM USER (HIERARCHY ID -- 10)
        // PRODUCTION SERVICE REQUEST(HIERARCHY ID -- 9) AND CRM USER (HIERARCHY ID -- 10)
          } else if (checkSum.predecessor.id == 0 && checkSum.hierarchy.id != 9 && checkSum.hierarchy.id != 10 && checkSum.hierarchy.id != 11) {
            this.$q.notify({
              type: "negative",
              color: "amber-9",
              position: "bottom",
              message: "Predecessor is mandatory"
            });
          }
          return;

        } else {
          this.v$.formData.addUserDetails.$touch();
          if (this.v$.formData.addUserDetails.$error) {
            this.$q.notify("Please review fields again.");
          } else {
            // let param={
            //   sourceName: this.formData.addUserDetails.name
            // };
            // console.log("SOURCE NAME------------>",JSON.stringify(param))
            // this.CREATE_LEAD_SOURCE(param);
            let banksListArr = [];
            _.map(requestParams.banksList, function (oo) {
              banksListArr.push({ id: oo });
            });
            requestParams.banksList = banksListArr;
            console.log(" before requestParams ----------->", JSON.stringify(requestParams))
            // requestParams.leadSource = requestParams.leadSource.sourceName == "Yes" ? this.formData.addUserDetails.name : null;
            requestParams.leadSource = requestParams.leadSource.sourceName == "Yes" ? {
              sourceName: requestParams.name,
              sourceCode: requestParams.name
            } : null;
            requestParams.serviceReqClients = requestParams.serviceReqClients.authMethod != null && requestParams.serviceReqClients.authKey != null && requestParams.serviceReqClients.authValue != null && requestParams.serviceReqClients.callBackUrl != null ? {
              authMethod: requestParams.serviceReqClients.authMethod,
              authKey: requestParams.serviceReqClients.authKey,
              authValue: requestParams.serviceReqClients.authValue,
              callBackUrl: requestParams.serviceReqClients.callBackUrl,
            } : null;
            console.log(" after requestParams ----------->", JSON.stringify(requestParams))
            //TO-DO Make sure when selecting hierarchy Service Clients, No other Hierarchy is selectable.
             // UAT SERVICE REQUEST(HIERARCHY ID -- 8) AND CRM USER (HIERARCHY ID -- 10)
        // PRODUCTION SERVICE REQUEST(HIERARCHY ID -- 9) AND CRM USER (HIERARCHY ID -- 10)
            let checkSum = _.find(requestParams.userMapSets, function (oo) {
              // console.log("SUBMITTING THE CHECKSUM VALUES-------->",JSON.stringify(oo))
              return (oo.hierarchy.id == 9 || oo.hierarchy.id == 10 || oo.hierarchy.id == 11);
            });
            if (checkSum != undefined)
              requestParams.userMapSets[0].predecessor = null;

            // requestParams.serviceReqClients.name = this.formData.addUserDetails.name;
            // console.log("addUserDetails userMapSets -------->", JSON.stringify(requestParams.userMapSets))
            // requestParams.serviceReqClients.clientType =requestParams.userMapSets[0].role.id == 28 ? "External" : "Internal";
            this.$q.loading.show({
              delay: 100, // ms
              message: "Please Wait",
              spinnerColor: "purple-9",
              customClass: "shadow-none"
            });
            this.FEED_USER_DATA(requestParams)
              .then(() => {
                this.$q.loading.hide();
                this.$q.notify({
                  color: "positive",
                  position: "bottom",
                  message: "User successfully created",
                  icon: "thumb_up"
                });
                this.$router.push("/super/admin/users/");
                this.$q.loading.hide();
              })
              .catch(error => {
                this.$q.loading.hide();
                this.$q.notify({
                  type: "warning",
                  color: "amber-9",
                  position: "bottom",
                  message: error.data.message
                });
              });
          }
        }
      }
    },

    // Function to get all predeccsor list
    getPredecessorList(item) {
      console.log("ROLE DETAILS--------->", JSON.stringify(item))

      let formData = {
        region: {
          id: this.formData.addUserDetails.region.id
        },
        role: {
          id: item.roleChecked
        }
      };
      this.formData.showAllRoleDetails = formData.role.id;
      // this.showAllRoleDetails = formData
      console.log("ROLE formData-------->", JSON.stringify(formData))
      this.$q.loading.show({
        delay: 100, // ms
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });
      this.FETCH_PREDECESSOR_ON_ROLE(formData)
        .then(() => {
          this.$q.loading.hide();
          let cookedArr = [];
          let actualArr = this.getPredecessorByRoleHierarchyData.map(function (
            value
          ) {
            cookedArr.push({ label: value.user.name, value: value.user.id });
          });
          item.predecessor = cookedArr;

        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.body.message == null ? "Please Try Again Later !" : error.body.message,
            icon: "thumb_down"
          });
        });
    },
    getRoleCheckedItem(request) {
       this.$q.loading.hide();
      console.log("checksum request : ---------->", JSON.stringify(request))
      let self = this;
      let checksum = _.find(self.getAllHierarchiesAndRolesData, function (oo) {
        return oo.hierarchyCode == self.$HIERARCHY_BANKS_OPS && oo.checked;
      });
      console.log("checksum : ---------->", JSON.stringify(checksum))
      let checksum1 = _.find(self.getAllHierarchiesAndRolesData, function (oo) {
        console.log("checksum 1  : ---------->", oo)
        return oo.hierarchyCode == self.$HIERARCHY_SERVICE_CLIENTS && oo.checked;
      });
      console.log("checksum 1 : ---------->", JSON.stringify(checksum1))
      let checksum2 = _.find(self.getAllHierarchiesAndRolesData, function (oo) {
        console.log("checksum 2  : ---------->", oo)
        return oo.hierarchyCode == self.$HIERARCHY_CRM && oo.checked;
      });
      console.log("checksum 2 : ---------->", JSON.stringify(checksum2))
      if (checksum == undefined && checksum1 == undefined && checksum2 == undefined) {
        this.formData.showBankOpsList = false;
        this.formData.disableRegionSelection = false;
        this.formData.showLeadSource = false;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
      else if (checksum != undefined && checksum1 == undefined && checksum2 == undefined) {
        this.formData.showBankOpsList = true;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = false;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
       else if (checksum == undefined && checksum1 != undefined && checksum2 == undefined ) {
        this.formData.showBankOpsList = false;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = true;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
      else if (checksum == undefined && checksum1 == undefined && checksum2 != undefined ) {
        this.formData.showBankOpsList = false;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = false;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
      else if (checksum != undefined && checksum1 != undefined && checksum2 == undefined ) {
        this.formData.showBankOpsList = true;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = true;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
      else if (checksum == undefined && checksum1 != undefined && checksum2 != undefined ) {
        this.formData.showBankOpsList = false;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = true;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
      else if (checksum != undefined && checksum1 == undefined && checksum2 != undefined ) {
        this.formData.showBankOpsList = true;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = false;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }
      else if (checksum != undefined && checksum1 != undefined && checksum2 != undefined ) {
        this.formData.showBankOpsList = true;
        this.formData.disableRegionSelection = true;
        this.formData.showLeadSource = true;
         this.$q.loading.hide(this.getRoleCheckedItem);
      }

      // else {
      //   if (checksum != undefined) {
      //      this.$q.loading.hide(this.getRoleCheckedItem);
      //     this.formData.showBankOpsList = true;
      //   } else if (checksum1 != undefined) {
      //      this.$q.loading.hide(this.getRoleCheckedItem);
      //     this.formData.showLeadSource = true;
      //   }
      //    else if (checksum2 != undefined) {

      //     this.formData.disableRegionSelection = true;
      //   }

      //   this.formData.disableRegionSelection = true;
      // }
      // else {
      //     this.formData.disableRegionSelection = false;
      //   }
    }
  }
};
</script>
