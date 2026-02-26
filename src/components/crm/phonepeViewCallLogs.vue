<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      class="q-mt-lg capitalize"
      @hide="handleHide"

    >
      <q-card style="min-width: 45vw; padding: 10px;">
        <q-card-section>
          <div class="row items-center bottom-border q-py-sm">
            <div class="col text-h6">View Call Logs</div>
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
          <q-table
            :rows="callLogs"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-inputDate="props">
              <q-td :props="props">
                {{ $moment(props.row.inputDate).format("Do MMM Y HH:mm") }}
              </q-td>
            </template>
            <template v-slot:body-cell-remarks="props">
              <q-td :props="props" class="wrap-text">
                {{ props.row.remarks }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PhonepeViewCallLogs",
  props: ["propToggleViewCallLogs", "propToggleViewCallLogsPop", "callInfo"],
  data() {
    return {
      toggleModal: this.propToggleViewCallLogsPop,
      callLogs: [],
      columns: [
        {
          name: "inputDate",
          label: "Date",
          align: "left",
          field: "inputDate",
          sortable: true
        },
        {
          name: "remarks",
          label: "Remarks",
          align: "left",
          field: "remarks",
          sortable: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters("phonePeCrm", ["getviewlogs"])
  },
  created() {
    this.fetchLogs();
  },
  methods: {
    ...mapActions("phonePeCrm", ["PHONE_PE_VIEW_CALL_LOGS"]),

    fetchLogs() {
      const payload = {
        serviceTicketId: this.callInfo.subTicketsList[0].id
      };
      this.PHONE_PE_VIEW_CALL_LOGS(payload)
        .then(() => {
          this.callLogs = this.getviewlogs || [];
        })
        .catch(error => {
          console.error("Fetch logs error:", error);
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Failed to fetch logs.",
            icon: "thumb_down"
          });
        });
    },
    closeDialog() {
      this.toggleModal = false;
    },
    handleHide() {
      this.$emit("closeViewCallLogs");
    }
  }
};
</script>

<style scoped>
.wrap-text {
  white-space: normal;
  word-wrap: break-word;
  max-width: 300px;
}
</style>
