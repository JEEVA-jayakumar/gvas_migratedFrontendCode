<template>
  <q-dialog persistent v-model="toggleModel">
    <q-card style="min-width: 60vw">
      <q-card-section class="q-title text-weight-regular bottom-border q-pa-md">
        Action Bar
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md justify-between">
          <div class="col-12 col-md-6">
            <div class="q-mb-sm"><span class="text-weight-bold">Reported Status:</span> {{ propRowDetails?.subTicketsList[0]?.serviceRequestType?.name || "NA" }}</div>
            <div class="q-mb-sm"><span class="text-weight-bold">TID:</span> {{ propRowDetails?.tid || "NA" }}</div>
            <div class="q-mb-sm"><span class="text-weight-bold">Ticket ID:</span> {{ propRowDetails?.serviceReqTicketId || "NA" }}</div>
            <div class="q-mb-sm"><span class="text-weight-bold">SAT forwarded date:</span> {{ propRowDetails?.subTicketsList[0]?.moveToSatDate ? $moment(propRowDetails.subTicketsList[0].moveToSatDate).format("Do MMM Y") : "NA" }}</div>
            <div class="q-mt-md">
              <div class="text-weight-bold">Reassign Remarks:</div>
              <q-input type="textarea" placeholder="Reason Type.." v-model="formData.reason" filled autogrow />
            </div>
          </div>
          <div class="col-12 col-md-5">
            <q-select filter clearable emit-value map-options color="grey-9" v-model="formData.so" :options="assignToOptions" label="Select FSE Name*" />
            <div class="q-mt-lg text-right">
              <span class="text-weight-bold">Reassign Count:</span> {{ count }}
            </div>
            <div class="q-mt-md text-right">
              <q-btn label="Assign History" @click="fnAssignHistoryPopup" color="purple-9" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="q-pb-md">
        <q-btn :disabled="!formData.so || !formData.reason" label="Re-Assign" @click="fnReassignTickets" color="blue" />
        <q-btn label="Close" @click="emitfnshowUpdateOpenedExternal" color="negative" />
      </q-card-actions>
    </q-card>
    <assignHistoryPopup v-if="propShowUpdateAssignHistoryPopup" :propShowUpdateAssignHistoryPopup="propShowUpdateAssignHistoryPopup" :propRowDetails="propRowDetails" @emitfnshowUpdateOpenedExternal="fnAssignHistoryPopup" />
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import assignHistoryPopup from "../../components/sat/assignHistoryPopup.vue";

export default {
  name: "reassignTicketPopup",
  components: { assignHistoryPopup },
  props: ["propShowUpdateReassignTicket", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowUpdateReassignTicket,
      propShowUpdateAssignHistoryPopup: false,
      assignToOptions: [],
      count: 0,
      formData: { so: "", reason: "" }
    };
  },
  created() {
    this.assignHistoryList();
    this.implementationExecutiveList();
  },
  computed: {
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("serviceRequestPhonepeSat", ["getassignHistoryLists"])
  },
  methods: {
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("serviceRequestPhonepeSat", ["PHONEPE_REASSIGNED_MERCHANT_TICKETS", "ASSIGN_HISTORY_REMARKS_LIST"]),
    emitfnshowUpdateOpenedExternal() { this.$emit("emitfnshowUpdateOpenedExternal"); },
    fnReassignTickets() {
      this.$q.dialog({ title: "Confirm", message: "Are you sure want to Re-Assign the lead?", ok: "Continue", cancel: "Cancel" }).onOk(() => {
        this.$q.loading.show({ message: "Processing .." });
        const param = { userId: this.formData.so, request: [{ ...this.propRowDetails, reAssignRemark: this.formData.reason, subTicketsList: null }] };
        this.PHONEPE_REASSIGNED_MERCHANT_TICKETS(param).then(() => {
          this.$emit("emitfnshowUpdateOpenedExternal");
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Updated Successfully", icon: "thumb_up" });
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        });
      });
    },
    fnAssignHistoryPopup() {
      this.propShowUpdateAssignHistoryPopup = !this.propShowUpdateAssignHistoryPopup;
      if (!this.propShowUpdateAssignHistoryPopup) this.assignHistoryList();
    },
    assignHistoryList() {
      this.ASSIGN_HISTORY_REMARKS_LIST({ Id: this.propRowDetails.id }).then(() => {
        this.count = this.getassignHistoryLists.length;
      });
    },
    implementationExecutiveList() {
      this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
        this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }));
      });
    }
  }
};
</script>