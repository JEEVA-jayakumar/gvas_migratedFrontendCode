<template>
  <div>
    <q-dialog v-model="toggleModal" no-backdrop-dismiss class="q-mt-lg capitalize" @hide="emitToggleRemarks"
      :content-css="{ minWidth: '50vw', padding: '10px' }">
      <q-card style="min-width: 50vw; padding: 10px;">
        <q-card-section>
          <div class="row items-center bottom-border q-py-sm">
            <div class="col text-h6"><b>Ticket</b></div>
            <div class="col-auto">
              <q-btn round size="sm" @click="emitToggleRemarks" outline color="dark" icon="clear" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="column group">
            <div class="q-pa-sm flex justify-between">
              <div>
                <b>Ticket ID: {{serviceReqTicketId}}</b>
              </div>
              <div>
                <b>Attempts: {{callAttempts}}</b>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-sm-9">
                <q-option-group v-model="selectedOption" :options="optionsData" type="radio" class="radio" inline @update:model-value="getselectedOptionBasedData"
                  color="purple-9" />
              </div>

              <div class="col-sm-3">
                <q-btn icon="call_received" color="purple-9" label="Add Call Log" @click="callLogs()" class="full-width q-mb-sm" />
                <q-btn icon="phone" color="purple-9" label="View Call Logs" @click="viewcallLogs()" class="full-width" />
              </div>
            </div>

            <!-- Issue Resolved Section -->
            <div v-if="selectedOption == 1" class="q-mt-md">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-select label="Resolved Status" filled color="purple-9"
                    v-model="issueResolved.resolvedStatus" :options="resolutionOptionList" emit-value map-options @update:model-value="issueresolvedAction"  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-select label="Actual Issue" filled color="purple-9" v-model="issueResolved.actualIssue"
                    :options="issueOptionList" emit-value map-options />
                </div>
                <div class="col-12 col-sm-6">
                  <q-select label="Action Taken" :disable="!issueResolved.actualIssue" filled color="purple-9" v-model="issueResolved.actionTaken"
                    :options="issueActionList" emit-value map-options />
                </div>
              </div>

              <div class="row q-gutter-sm q-mt-md justify-end">
                <q-btn @click="issueResolveSave" color="purple-9" icon="save" label="Save" />
                <q-btn @click="fnIssueResolveSubmit" :disabled="disableFlag" color="purple-9" icon="send" label="Submit" />
              </div>
            </div>

            <!-- Issue Not Resolved Section -->
            <div v-if="selectedOption == 2" class="q-mt-md">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-select label="Resolved Status" filled color="purple-9"
                    v-model="IssueNotResolved.resolvedStatus" :options="resolutionOptionList" emit-value map-options @update:model-value="issueNotresolvedFetchAction" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-select label="Actual Issue" filled color="purple-9" v-model="IssueNotResolved.actualIssue"
                    :options="issueOptionList" emit-value map-options />
                </div>
                <div class="col-12 col-sm-6">
                  <q-select label="Action Taken" :disable="!IssueNotResolved.actualIssue" filled color="purple-9" v-model="IssueNotResolved.actiontaken"
                    :options="issueActionList" emit-value map-options />
                </div>
              </div>

              <div class="row q-gutter-sm q-mt-md justify-end">
                <q-btn @click="fnIssueNotResolved" color="purple-9" icon="save" label="Save" />
                <q-btn @click="fnIssueNotResolveSubmit" :disabled="disableFlag" color="purple-9" icon="send" label="Submit" />
              </div>
            </div>

            <!-- Move to SAT Section -->
            <div v-if="selectedOption == 3" class="q-mt-md">
              <div class="q-pa-sm">
                <b>Region: {{region}}</b>
              </div>
              <div class="row q-gutter-sm q-mt-md justify-end">
                <q-btn @click="fnMovedToSat" color="purple-9" icon="save" label="Save" />
                <q-btn @click="fnmoveToSatRemarks" color="purple-9" icon="send" :disabled="disableFlag" label="Move to SAT" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <phonepeCallLogs v-if="propToggleCallLogs" :callInfo="formData.data"
      :propToggleCallLogsPop="propToggleCallLogs" @closeCallLogs="callLogs" />

    <phonepeViewCallLogs v-if="propToggleViewCallLogs" :callInfo="formData.data" :propToggleViewCallLogsPop="propToggleViewCallLogs"
       @closeViewCallLogs="viewcallLogs" />

    <issueResolvingRemarks v-if="propToggleResolveRemarks" :resolveRemarksInfo="addResolveRemarksInformation"
      :propToggleResolveRemarksPop="propToggleResolveRemarks" @closeResolveRemarks="handleResolveRemarksClose" />

    <phonepeCrmToSatRemarks v-if="propToggleCrmToSatRemarks" :resolveCrmToSatInfo="addcrmToSatRemarksInformation"
      :propToggleCrmToSatRemarksPop="propToggleCrmToSatRemarks" @closeCrmToSatRemarks="handleSatRemarksClose" />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import { useVuelidate } from '@vuelidate/core';
  import { required } from "@vuelidate/validators";
  import phonepeCallLogs from "./phonepeCallLogs.vue";
  import phonepeViewCallLogs from "./phonepeViewCallLogs.vue";
  import issueResolvingRemarks from "./issueResolvingRemarks.vue";
  import phonepeCrmToSatRemarks from "./phonepeCrmToSatRemarks.vue";
  import _ from 'lodash';

  export default {
    name: "ticketActionBar",
    setup () {
      return { $v: useVuelidate() }
    },
    props: ["ActionBarInfo", "propToggleActionBarPop", "propToggleActionBar"],
    components: {
      phonepeCallLogs,
      issueResolvingRemarks,
      phonepeCrmToSatRemarks,
      phonepeViewCallLogs
    },
    data() {
      return {
        toggleModal: this.propToggleActionBarPop,
        selectedOption: 1,
        callAttempts: 0,
        disableFlag: true,
        serviceReqTicketId: "",
        region: "",
        propToggleCallLogs: false,
        propToggleViewCallLogs: false,
        propToggleResolveRemarks: false,
        propToggleCrmToSatRemarks: false,
        addResolveRemarksInformation: {
          data: null,
          ticketId: null
        },
        addcrmToSatRemarksInformation: {
          data: null
        },
        optionsData: [],
        resolutionOptionList: [],
        issueOptionList: [],
        issueActionList: [],
        formData: {
          data: this.ActionBarInfo.data,
        },
        issueResolved: {
          resolvedStatus: "",
          actionTaken: "",
          actualIssue: "",
        },
        IssueNotResolved: {
          resolvedStatus: "",
          actualIssue: '',
          actiontaken: "",
        }
      };
    },

    validations() {
      return {
        issueResolved: {
          resolvedStatus: { required },
          actionTaken: { required },
          actualIssue: { required },
        },
        IssueNotResolved: {
          resolvedStatus: { required },
          actualIssue: { required },
          actiontaken: { required },
        }
      };
    },

    computed: {
      ...mapGetters("phonePeCrm", ["getattemptLog", "getoptionsList", "getResolutionStatus", "getFetchIssueList", "getIssueAction"])
    },

    mounted() {
      if (this.formData.data) {
        this.serviceReqTicketId = this.formData.data.serviceReqTicketId;
        if (this.formData.data.bpRegion) {
          this.region = this.formData.data.bpRegion.regionAreaName;
        }
        if (this.formData.data.subTicketsList && this.formData.data.subTicketsList.length > 0) {
          this.callLogAttempts(this.formData.data.subTicketsList[0].id);
        }
      }
      this.getOptionList();
      this.resolutionList(this.selectedOption);
    },

    methods: {
      ...mapActions("phonePeCrm", ["PHONEPE_CRM_CALL_LOG_ATTEMPTS", "PHONEPE_CRM_OPTION_LIST_DETAILS", "PHONEPE_CRM_RESOLUTION_STATUS", "PHONEPE_CRM_FETCH_ISSUE_STATUS", "PHONEPE_CRM_ISSUE_ACTION_STATUS", "ISSUE_NOT_RESOLVED_BY_CRM"]),

      callLogAttempts(id) {
        this.$q.loading.show({ message: "Fetching attempts.." });
        this.PHONEPE_CRM_CALL_LOG_ATTEMPTS(id)
          .then(() => {
            this.callAttempts = this.getattemptLog;
            this.disableFlag = this.callAttempts <= 0;
            this.$q.loading.hide();
          })
          .catch(() => { this.$q.loading.hide(); });
      },
     
      getselectedOptionBasedData(val) {
        if (val != 3) {
          this.resolutionList(val);
        }
      },
    
      getOptionList() {
        this.$q.loading.show({ message: "Loading options.." });
        this.PHONEPE_CRM_OPTION_LIST_DETAILS()
          .then(() => {
            let list = this.getoptionsList.map(opt => {
              return { label: opt.issueOptions, value: opt.id };
            });
            list.push({ value: 3, label: "MOVE TO SAT" });
            this.optionsData = list;
            this.$q.loading.hide();
          })
          .catch(() => { this.$q.loading.hide(); });
      },

      resolutionList(opt) {
        this.$q.loading.show({ message: "Loading resolutions.." });
        this.PHONEPE_CRM_RESOLUTION_STATUS(opt)
          .then(() => {
            let cooked = this.getResolutionStatus.map(v => ({ label: v.resolution, value: v.id }));
            if (opt == 1) {
              this.resolutionOptionList = cooked.filter(r => r.value !== 2);
            } else {
              this.resolutionOptionList = cooked;
            }
            this.$q.loading.hide();
          })
          .catch(() => { this.$q.loading.hide(); });
      },

      issueresolvedAction(val) {
        this.fetchIssues(val, 1);
      },

      issueNotresolvedFetchAction(val) {
        this.fetchIssues(val, 2);
      },

      fetchIssues(resId, type) {
        this.$q.loading.show({ message: "Loading issues.." });
        this.PHONEPE_CRM_FETCH_ISSUE_STATUS(resId)
          .then(() => {
            this.issueOptionList = this.getFetchIssueList.map(v => ({ label: v.issue, value: v.id }));
            this.fetchActions(resId, type);
            this.$q.loading.hide();
          })
          .catch(() => { this.$q.loading.hide(); });
      },

      fetchActions(resId, type) {
        this.$q.loading.show({ message: "Loading actions.." });
        this.PHONEPE_CRM_ISSUE_ACTION_STATUS(resId)
          .then(() => {
            this.issueActionList = this.getIssueAction.map(v => ({ label: v.action, value: v.id }));
            this.$q.loading.hide();
          })
          .catch(() => {
            this.issueActionList = [];
            this.$q.loading.hide();
          });
      },
      
      callLogs() {
        this.propToggleCallLogs = !this.propToggleCallLogs;
        if (!this.propToggleCallLogs && this.formData.data.subTicketsList) {
          this.callLogAttempts(this.formData.data.subTicketsList[0].id);
        }
      },
      
      async fnIssueResolveSubmit() {
        const isCorrect = await this.$v.issueResolved.$validate();
        if (!isCorrect) {
          this.$q.notify("Please review fields again.");
        } else {
          this.addResolveRemarksInformation = {
            data: this.issueResolved,
            ticketId: this.formData.data
          };
          this.propToggleResolveRemarks = true;
        }
      },

      async fnIssueNotResolveSubmit() {
        const isCorrect = await this.$v.IssueNotResolved.$validate();
        if (!isCorrect) {
          this.$q.notify("Please review fields again.");
        } else {
          let payload = {
            crmRemark: "",
            issueOptionsId: 2,
            resolutionId: this.IssueNotResolved.resolvedStatus,
            servicingId: this.IssueNotResolved.actualIssue,
            actionsId: this.IssueNotResolved.actiontaken,
            ticketId: this.formData.data.serviceReqTicketId,
          };
          this.$q.loading.show({ message: "Submitting.." });
          this.ISSUE_NOT_RESOLVED_BY_CRM(payload)
            .then(() => {
              this.$q.notify({ color: "positive", message: "Successfully Updated" });
              this.$q.loading.hide();
              this.$emit("closeActionBarInfo");
            })
            .catch(error => {
              const message = (error.body && error.body.message) ? error.body.message : "Error submitting.";
              this.$q.notify({ color: "negative", message: message });
              this.$q.loading.hide();
            });
        }
      },

      fnmoveToSatRemarks() {
        this.addcrmToSatRemarksInformation.data = this.formData.data;
        this.propToggleCrmToSatRemarks = true;
      },
      
      handleResolveRemarksClose(val) {
        this.propToggleResolveRemarks = false;
        if (val == 1) this.$emit("closeActionBarInfo");
      },

      handleSatRemarksClose(val) {
        this.propToggleCrmToSatRemarks = false;
        if (val == 1) this.$emit("closeActionBarInfo");
      },

      emitToggleRemarks() {
        this.$emit("closeActionBarInfo");
      },
    
      viewcallLogs(){
        this.propToggleViewCallLogs = !this.propToggleViewCallLogs;
      },
    
      issueResolveSave(){
        this.$emit("closeActionBarInfo");
      },
      fnIssueNotResolved(){
        this.$emit("closeActionBarInfo");
      },
      fnMovedToSat(){
        this.$emit("closeActionBarInfo");
      }
    }
  };
</script>
