<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      class="q-mt-lg capitalize"
      @hide="handleHide"
      :content-css="{ minWidth: '48vw', padding: '20px' }"
    >
      <q-card style="min-width: 48vw; padding: 20px;">
        <q-card-section>
          <div class="row items-center bottom-border q-py-sm">
            <div class="col text-h6">Escalate To SAT</div>
            <div class="col-auto">
              <q-btn
                round
                size="sm"
                @click="closeDialog"
                outline
                color="dark"
                icon="clear"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-select
                label="Issues"
                filled
                color="purple-9"
                v-model="formData.issue"
                :options="dropDown.issueOptions"
                emit-value
                map-options
                @update:model-value="issueDocumentType"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                :disable="!formData.issue"
                label="Sub Issues"
                filled
                color="purple-9"
                v-model="formData.subIssue"
                :options="dropDown.subIssueOptions"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="row q-mt-md justify-end">
            <q-btn color="purple-9" :disable="!formData.subIssue" label="Submit" @click="fnEscalateToSat" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import _ from 'lodash';

export default {
  name: "PhonepeEscalateToSat",
  props: ["escalateToSatData","propToggleEscalatetoSatPop","propToggleEscalateToSat" ],
  data() {
    return {
      toggleModal: this.propToggleEscalatetoSatPop,
      formData: {
        issue: null,
        subIssue: null,
      },
      dropDown: {
        issueOptions: [],
        subIssueOptions: [],
      }
    };
  },
  computed: {
    ...mapGetters("crmAction", [
      "getissueDatasDetails",
      "getsubIssueDatasDetails"
    ]),
  },
  created() {
    this.issueLoadData();
  },
  methods: {
    ...mapActions("crmAction", [
      "FETCH_ISSUE_DATAS",
      "FETCH_SUB_ISSUE_DATAS"
    ]),
    ...mapActions("phonePeCrm", ["ESCALATE_TO_SAT"]),

    issueLoadData() {
      this.FETCH_ISSUE_DATAS().then(() => {
        this.dropDown.issueOptions = this.getissueDatasDetails.map(item => ({
          value: item,
          label: item.name
        }));
      });
    },

    issueDocumentType(val) {
      if (!val) return;
      this.FETCH_SUB_ISSUE_DATAS(val.id).then(() => {
        this.dropDown.subIssueOptions = this.getsubIssueDatasDetails.map(item => ({
          value: item,
          label: item.name
        }));
        this.formData.subIssue = null;
      });
    },
  
    fnEscalateToSat() {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure ?",
          ok: "Yes",
          cancel: "Cancel",
      }).onOk(() => {
        this.$q.loading.show({ message: "Processing .." });
        let payload = {
            ticketId: this.escalateToSatData.serviceReqTicketId,
            issue : this.formData.issue,
            subIssue : this.formData.subIssue,
        };
        this.ESCALATE_TO_SAT(payload)
          .then(() => {
              this.$q.notify({
                  color: "positive",
                  message: "Escalated To SAT!",
                  icon: "thumb_up",
              });
              this.$q.loading.hide();
              this.toggleModal = false;
          })
          .catch(error => {
              const message = (error.body && error.body.message) ? error.body.message : "Error escalating.";
              this.$q.notify({ color: "negative", message: message });
              this.$q.loading.hide();
          });
      });
    },
    closeDialog() {
      this.toggleModal = false;
    },
    handleHide() {
      this.$emit("closeEscalateToSat");
    }
  }
};
</script>
