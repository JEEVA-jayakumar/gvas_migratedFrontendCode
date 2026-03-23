<template>
  <q-dialog persistent v-model="toggleModel" @hide="emitCrmLogsMerchantName(false)">
    <q-card style="min-width: 60vw">
      <q-card-section class="row items-center justify-between q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        <div class="text-h6 q-title">CRM LOGS - {{ propRowDetails?.meName || "Merchant Name" }}</div>
        <q-btn flat color="red" round size="md" icon="close" v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table table-class="customTableClass" flat square :rows="crmLogs" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 10 }">
          <template v-slot:body-cell-attemptno="props">
            <q-td :props="props">{{ props.row.orderId || "NA" }}</q-td>
          </template>
          <template v-slot:body-cell-dateandtime="props">
            <q-td :props="props">{{ formatDateTime(props.row.inputDate) }}</q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "crmLogsView",
  props: ["propShowUpdateCrmLogsView", "propRowDetails"],
  data() {
    return {
      crmLogs: [],
      toggleModel: this.propShowUpdateCrmLogsView,
      columns: [
        { name: "attemptno", label: "Attempt No", align: "left", field: "orderId" },
        { name: "dateandtime", label: "Date & Time", align: "left", field: "inputDate" },
        { name: "crmlogs", label: "CRM Logs", align: "left", field: "remarks" }
      ]
    };
  },
  created() {
    this.crmLogsList();
  },
  computed: {
    ...mapGetters("serviceRequestPhonepeSat", ["getcrmLogsLists"])
  },
  methods: {
    ...mapActions("serviceRequestPhonepeSat", ["CRM_LOGS_LISTS"]),
    formatDateTime(date) {
      return date ? this.$moment.utc(date).local().format("Do MMM YYYY, h:mm A") : "NA";
    },
    crmLogsList() {
      this.CRM_LOGS_LISTS({ subTicketsId: this.propRowDetails.subTicketsList[0].id }).then(() => {
        this.crmLogs = this.getcrmLogsLists.map((item, index) => ({ ...item, orderId: index + 1 }));
      });
    },
    emitCrmLogsMerchantName(val) { this.$emit("emitfnshowUpdateOpenedExternal", val); }
  }
};
</script>