<template>
  <div>
    <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Service Request
    </div>
    <!--START: table Footer -->
    <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
      <div class="row items-center gutter-y-sm">
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
          <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
        </div>
        <div class="col-md-3 col-sm-6 col-xs-6" style="flex: 1; max-width: 200px;" align="right">
          <q-select
            use-input
            @filter="filterAssignToRegion"
            clearable
            v-model="formData.assignTo.region"
            color="grey-9"
            :disable="formData.marsDeviceIdsCooked.length == 0"
            :options="assignToRegionOptions"
            placeholder="Assign To Region"
            emit-value
            map-options
          />
        </div>
        <div class="col-md-3 col-sm-6 col-xs-6" align="right">
          <q-btn
            no-caps
            :disabled="!formData.assignTo.region"
            label="Assign"
            class="common-dark-blue"
            @click="assignImplementationUser"
          />
        </div>
      </div>
    </q-card>
    <!--END: table Footer -->
    <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" active-color="dark" @update:model-value="goToUnassignedTab">
      <q-tab name="unAssigned" label="Opened" />
      <q-tab name="assigned" label="Resolved Tickets" />
      <q-tab name="Ticket" label="Ticket Bulk Assign/Reassign" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="assigned" class="no-padding">
        <q-table :rows="tableData" :columns="columnDataAssigned" table-class="customTableClass" :filter="filterSearch" v-model:pagination="paginationControl" row-key="id" :loading="tableAjaxLoading" :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo">
          <template v-slot:body="props">
            <q-tr :props="props" class="bottom-border">
              <q-td key="merchant_name" :props="props">{{ props.row.meName }}</q-td>
              <q-td key="tid" :props="props">{{ props.row.tid }}</q-td>
              <q-td key="actionContact" :props="props">
                <q-btn push color="blue" size="sm" @click="fnContactDetails(props.row)">Click to View</q-btn>
              </q-td>
              <q-td key="dateCreated" :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
              <q-td key="tat" :props="props"><span :style="getHoursAgoColor(props.row.createdDate)">{{ getHoursAgo(props.row.createdDate) }}</span></q-td>
              <q-td key="actionLog" :props="props">
                <q-btn push color="blue" size="sm" @click="fnCrmLogsView(props.row)">Click to View</q-btn>
              </q-td>
              <q-td key="actionClosed" :props="props">
                <q-btn push color="negative" size="sm" @click="fnReslovedClose(props.row)">Closed</q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="unAssigned" class="no-padding">
        <q-table :rows="tableData1" :columns="columnDataUnassigned" table-class="customTableClass" :filter="filterSearch1" v-model:pagination="paginationControl1" selection="multiple" v-model:selected="formData.marsDeviceIdsCooked" row-key="serviceReqTicketId" :loading="tableAjaxLoading1" :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo1">
          <template v-slot:body-cell-serviceReqTicketId="props">
            <q-td :props="props">{{ props.row.serviceReqTicketId }}</q-td>
          </template>
          <template v-slot:body-cell-merchant_name="props">
            <q-td :props="props">{{ props.row.meName }}</q-td>
          </template>
          <template v-slot:body-cell-assignedTo="props">
            <q-td :props="props">{{ props.row.assignedTo?.name || "NA" }}</q-td>
          </template>
          <template v-slot:body-cell-tid="props">
            <q-td :props="props">{{ props.row.tid }}</q-td>
          </template>
          <template v-slot:body-cell-actionContact="props">
            <q-td :props="props">
              <q-btn push color="blue" size="sm" @click="fnContactDetails(props.row)">Click to View</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-dateCreated="props">
            <q-td :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:body-cell-tat="props">
            <q-td :props="props"><span :style="getHoursAgoColor(props.row.createdDate)">{{ getHoursAgo(props.row.createdDate) }}</span></q-td>
          </template>
          <template v-slot:body-cell-actionLog="props">
            <q-td :props="props">
              <q-btn push color="blue" size="sm" @click="fnCrmLogsView(props.row)">Click to View</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-actionPickTickets="props">
            <q-td :props="props">
              <q-btn v-if="props.row.serviceRequestTicketStatus == 5" push color="positive" size="sm" @click="fnPickTicket(props.row)">Pick Ticket</q-btn>
              <span v-else>NA</span>
            </q-td>
          </template>
          <template v-slot:body-cell-actionReassign="props">
            <q-td :props="props">
              <q-btn v-if="props.row.serviceRequestTicketStatus == 2" push color="negative" size="sm" @click="fnReassignTicket(props.row)">Re-Assign</q-btn>
              <span v-else>NA</span>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="Ticket" class="no-padding">
        <ticketAssign />
      </q-tab-panel>
    </q-tab-panels>

    <pickTicketpopup v-if="propShowUpdatePickTicket" :propShowUpdatePickTicket="propShowUpdatePickTicket" :propRowDetails="propRowDetails" @emitfnshowUpdateOpenedExternal="fnPickTicket" />
    <reassignTicketPopup v-if="propShowUpdateReassignTicket" :propShowUpdateReassignTicket="propShowUpdateReassignTicket" :propRowDetails="propRowDetails" @emitfnshowUpdateOpenedExternal="fnReassignTicket" />
    <contactDetailsPopup v-if="propShowUpdateContactDetails" :propShowUpdateContactDetails="propShowUpdateContactDetails" :propRowDetails="propRowDetails" @emitfnshowUpdateOpenedExternal="fnContactDetails" />
    <crmLogsView v-if="propShowUpdateCrmLogsView" :propShowUpdateCrmLogsView="propShowUpdateCrmLogsView" :propRowDetails="propRowDetails" @emitfnshowUpdateOpenedExternal="fnCrmLogsView" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import pickTicketpopup from "../../components/sat/pickTicketpopup.vue";
import reassignTicketPopup from "../../components/sat/reassignTicketPopup.vue";
import contactDetailsPopup from "../../components/sat/contactDetailsPopup.vue";
import crmLogsView from "../../components/sat/crmLogsView.vue";
import ticketAssign from 'src/components/sat/ticketAssign.vue';

export default {
  name: "externalserviceRequest",
  components: { pickTicketpopup, reassignTicketPopup, contactDetailsPopup, crmLogsView, ticketAssign },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      propShowUpdatePickTicket: false,
      propShowUpdateReassignTicket: false,
      propShowUpdateContactDetails: false,
      propShowUpdateCrmLogsView: false,
      selectedTab: "unAssigned",
      assignToRegionOptions: [],
      assignToRegionOptions_bk: [],
      tableData: [],
      tableData1: [],
      paginationControl: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: "createdDate", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      propRowDetails: null,
      formData: { marsDeviceIdsCooked: [], assignTo: { id: "", region: "" } },
      columnDataAssigned: [
        { name: "merchant_name", label: "Merchant Name", align: "left", field: "meName" },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "actionContact", label: "Contact Details", align: "center" },
        { name: "dateCreated", label: "Created Date", align: "left", field: "createdDate" },
        { name: "tat", label: "TAT", align: "left" },
        { name: "actionLog", label: "CRM Logs", align: "center" },
        { name: "actionClosed", label: "Status", align: "center" }
      ],
      columnDataUnassigned: [
        { name: "serviceReqTicketId", label: "Ticket ID", align: "left", field: "serviceReqTicketId" },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: "meName" },
        { name: "assignedTo", label: "Assigned SO", align: "left", field: row => row.assignedTo?.name },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "actionContact", label: "Contact Details", align: "center" },
        { name: "dateCreated", label: "Created Date", align: "left", field: "createdDate" },
        { name: "tat", label: "TAT", align: "left" },
        { name: "actionLog", label: "CRM Logs", align: "center" },
        { name: "actionPickTickets", label: "Action Bar", align: "center" },
        { name: "actionReassign", label: "", align: "center" }
      ]
    };
  },
  computed: {
    ...mapGetters("serviceRequestPhonepeSat", ["getphonepeOpenedTickets", "getphonepeResolvedTickets"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"])
  },
  mounted() {
    this.fnAjaxGetAllRegionList();
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
  },
  methods: {
    ...mapActions("serviceRequestPhonepeSat", ["FETCH_PHONEPE_OPENED_TICKETS", "FETCH_PHONEPE_RESOLVED_TICKET", "PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION"]),
    ...mapActions('generateQR', ['FETCH_REGION_LIST']),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.FETCH_PHONEPE_OPENED_TICKETS({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getphonepeOpenedTickets.totalElements;
        this.tableData1 = this.getphonepeOpenedTickets.content;
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.tableAjaxLoading = true;
      this.FETCH_PHONEPE_RESOLVED_TICKET({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getphonepeResolvedTickets.totalElements;
        this.tableData = this.getphonepeResolvedTickets.content;
        this.tableAjaxLoading = false;
      }).catch(() => { this.tableAjaxLoading = false; });
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      else if (tab === "assigned") this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
    },
    fnAjaxGetAllRegionList() {
      this.FETCH_REGION_LIST().then(res => {
        this.assignToRegionOptions = res.data.data.map(v => ({ label: v.regionAreaName, value: v.regionAreaName }));
        this.assignToRegionOptions_bk = this.assignToRegionOptions;
      });
    },
    filterAssignToRegion(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToRegionOptions = this.assignToRegionOptions_bk.filter(v => v.label.toLowerCase().includes(needle));
      });
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length === 0 || !this.formData.assignTo.region) return;
      const payload = this.formData.marsDeviceIdsCooked.map(v => ({ serviceReqTicketId: v.serviceReqTicketId, bpRegion: { regionAreaName: this.formData.assignTo.region } }));
      this.$q.loading.show();
      this.PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION(payload).then(res => {
        this.$q.notify({ color: "positive", position: "bottom", message: res.body.data, icon: "thumb_up" });
        this.formData.marsDeviceIdsCooked = [];
        this.formData.assignTo.region = "";
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
        this.$q.loading.hide();
      }).catch(err => {
        this.$q.notify({ color: "negative", position: "bottom", message: err.body.data, icon: "thumb_down" });
        this.$q.loading.hide();
      });
    },
    getHoursAgo(dateStr) {
      const diff = Date.now() - new Date(dateStr).getTime();
      return 72 - Math.floor(diff / (1000 * 60 * 60));
    },
    getHoursAgoColor(dateStr) {
      const tat = this.getHoursAgo(dateStr);
      if (tat > 0) return "color: green; font-weight: bold;";
      if (tat < 0) return "color: red; font-weight: bold;";
      return "color: gray;";
    },
    fnPickTicket(details) { this.propShowUpdatePickTicket = !this.propShowUpdatePickTicket; if (details) this.propRowDetails = details; },
    fnReassignTicket(details) { this.propShowUpdateReassignTicket = !this.propShowUpdateReassignTicket; if (details) this.propRowDetails = details; },
    fnContactDetails(details) { this.propShowUpdateContactDetails = !this.propShowUpdateContactDetails; if (details) this.propRowDetails = details; },
    fnCrmLogsView(details) { this.propShowUpdateCrmLogsView = !this.propShowUpdateCrmLogsView; if (details) this.propRowDetails = details; }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
</style>