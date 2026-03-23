<template>
  <q-dialog
    persistent
    v-model="toggleModel"
    @hide="emitAssignHistoryList(false)"
  >
    <q-card style="min-width: 60vw">
      <q-card-section class="row items-center justify-between q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        <div class="text-h6 q-title">Reassign History</div>
        <q-btn flat color="red" round size="md" icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          table-class="customTableClass"
          flat
          square
          :rows="assignHistoryRemarks"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              {{ $moment(props.row.createdAt).format("Do MMM Y") }}
            </q-td>
          </template>
          <template v-slot:body-cell-agentname="props">
            <q-td :props="props">
              {{ props.row.soUser?.name || "NA" }}
            </q-td>
          </template>
          <template v-slot:body-cell-remarks="props">
            <q-td :props="props">
              {{ props.row.remarks || "NA" }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "assignHistoryPopup",
  props: ["propShowUpdateAssignHistoryPopup", "propRowDetails"],
  data() {
    return {
      assignHistoryRemarks: [],
      toggleModel: this.propShowUpdateAssignHistoryPopup,
      columns: [
        { name: "date", label: "Date", align: "left", field: "createdAt" },
        { name: "agentname", label: "Agent Name", align: "left", field: row => row.soUser?.name || "NA" },
        { name: "remarks", label: "Remarks", align: "left", field: "remarks" }
      ]
    };
  },
  created() {
    this.assignHistoryList();
  },
  computed: {
    ...mapGetters("serviceRequestPhonepeSat", ["getassignHistoryLists"])
  },
  methods: {
    ...mapActions("serviceRequestPhonepeSat", ["ASSIGN_HISTORY_REMARKS_LIST"]),
    assignHistoryList() {
      this.$q.loading.show({ message: "Loading history..." });
      this.ASSIGN_HISTORY_REMARKS_LIST({ Id: this.propRowDetails.id })
        .then(() => {
          this.assignHistoryRemarks = this.getassignHistoryLists;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    emitAssignHistoryList(val) {
      this.$emit("emitfnshowUpdateOpenedExternal", val);
    }
  }
};
</script>