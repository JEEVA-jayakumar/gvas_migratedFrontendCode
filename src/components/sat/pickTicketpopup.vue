<template>
  <q-dialog persistent v-model="toggleModel">
    <q-card style="min-width: 60vw">
      <q-card-section class="q-title text-weight-regular bottom-border q-pa-md">
        Action Bar
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md justify-between">
          <div class="col-12 col-md-6">
            <div class="q-mb-sm">
              <span class="text-weight-bold">Reported Status:</span> {{ propRowDetails?.subTicketsList[0]?.serviceRequestType?.name || "NA" }}
            </div>
            <div class="q-mb-sm">
              <span class="text-weight-bold">TID:</span> {{ propRowDetails?.tid || "NA" }}
            </div>
            <div class="q-mb-sm">
              <span class="text-weight-bold">Ticket ID:</span> {{ propRowDetails?.serviceReqTicketId || "NA" }}
            </div>
            <div class="q-mb-sm">
              <span class="text-weight-bold">SAT forwarded date:</span>
              {{ propRowDetails?.subTicketsList[0]?.moveToSatDate ? $moment(propRowDetails.subTicketsList[0].moveToSatDate).format("Do MMM Y") : "NA" }}
            </div>
          </div>
          <div class="col-12 col-md-5">
            <q-select filter clearable emit-value map-options color="grey-9" v-model="formData.so"
              :options="assignToOptions" label="Select FSE Name*" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="q-pb-md">
        <q-btn :disabled="!formData.so" label="Assign" @click="fnAssignTickets" color="blue" />
        <q-btn label="Close" @click="emitfnshowUpdateOpenedExternal" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "pickTicketpopup",
  props: ["propShowUpdatePickTicket", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowUpdatePickTicket,
      assignToOptions: [],
      formData: { so: "" }
    };
  },
  created() {
    this.implementationExecutiveList();
  },
  computed: {
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
  },
  methods: {
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("serviceRequestPhonepeSat", ["PHONEPE_PICKUP_TICKET_ASSIGNED"]),
    emitfnshowUpdateOpenedExternal() {
      this.$emit("emitfnshowUpdateOpenedExternal");
    },
    fnAssignTickets() {
      if (!this.formData.so) return;
      this.$q.loading.show({ message: "Please wait.." });
      const postValues = { userId: this.formData.so, request: [this.propRowDetails] };
      this.PHONEPE_PICKUP_TICKET_ASSIGNED(postValues).then(() => {
        this.$emit("emitfnshowUpdateOpenedExternal");
        this.$q.notify({ color: "positive", message: "Updated Successfully", icon: "thumb_up" });
        this.$q.loading.hide();
      }).catch(error => {
        this.$q.loading.hide();
        this.$q.notify({ color: "negative", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
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