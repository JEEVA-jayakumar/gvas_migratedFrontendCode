<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-card shadow-1 bg-white border-radius-16 overflow-hidden fade-up">
      <!-- Header Section -->
      <div class="q-pa-lg border-bottom">
        <div class="row items-center justify-between">
          <div>
            <div class="text-overline text-purple-9 text-weight-bold">Operational Support</div>
            <h1 class="text-h5 text-weight-bold text-slate-900 q-ma-none">Service Request Management</h1>
          </div>
          <q-tabs
            v-model="selectedTab"
            @update:model-value="goToUnassignedTab"
            class="premium-tabs"
            active-color="purple-9"
            indicator-color="purple-9"
            align="left"
            no-caps
          >
            <q-tab name="unAssigned" label="Unassigned" icon="assignment_late" />
            <q-tab name="assigned" label="Assigned" icon="assignment_ind" />
            <q-tab name="closed" label="Resolved" icon="task_alt" />
          </q-tabs>
        </div>
      </div>

      <!-- Action Bar for Unassigned -->
      <div v-if="selectedTab == 'unAssigned'" class="q-pa-lg bg-slate-50 border-bottom fade-up">
        <div class="row q-col-gutter-md items-center">
          <div class="col-md-3 col-sm-6">
            <div class="text-caption text-slate-500 q-mb-xs">Selected Tickets</div>
            <div class="row items-baseline">
              <span class="text-h4 text-weight-bold text-purple-9">{{ formData.marsDeviceIdsCooked.length }}</span>
              <span class="text-slate-400 q-ml-sm">items in queue</span>
            </div>
          </div>

          <div class="col-md-3 col-sm-6">
            <div class="text-caption text-slate-500 q-mb-xs">Assignment Mode</div>
            <div class="flex gap-md">
              <q-radio v-for="(item, index) in requestOptions" :key="index"
                v-model="formData.requestMode" :val="item.value" :label="item.label" color="purple-9" dense />
            </div>
          </div>

          <template v-if="formData.requestMode == 1">
            <div class="col-md-2 col-sm-6">
              <q-input v-model="formData.podNumber" outlined dense label="POD Number *" class="premium-input bg-white" />
            </div>
          </template>

          <div class="col-md-3 col-sm-6">
            <q-select
              v-model="formData.assignTo"
              outlined
              dense
              label="Assign Implementation Officer *"
              :options="assignToOptions"
              use-input
              @filter="filterAssignTo"
              emit-value
              map-options
              clearable
              class="premium-select bg-white"
            >
              <template v-slot:prepend><q-icon name="person_add_alt" color="slate-400" /></template>
            </q-select>
          </div>

          <div class="col-md-1 col-sm-12 text-right">
            <q-btn
              unelevated
              round
              color="purple-9"
              icon="send"
              :disabled="formData.marsDeviceIdsCooked.length == 0"
              @click="assignImplementationUser"
              class="shadow-2"
            >
              <q-tooltip>Submit Assignment</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Data Tables -->
      <q-tab-panels v-model="selectedTab" animated class="bg-white">
        <!-- Unassigned Panel -->
        <q-tab-panel name="unAssigned" class="q-pa-none">
          <q-table
            flat
            class="premium-table"
            :rows="tableData1"
            :columns="columnDataUnassigned"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold">
                  # {{ props.row.leadInformation.leadNumber }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-tid="props">
              <q-td :props="props"><div class="text-weight-bold text-slate-900">{{ props.row.tid }}</div></q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width q-pa-xl text-center text-slate-300">
                 <q-icon name="check_circle" size="64px" class="opacity-20 q-mb-md" />
                 <div class="text-h6 opacity-50">No unassigned service requests</div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Assigned Panel -->
        <q-tab-panel name="assigned" class="q-pa-none">
          <q-table
            flat
            class="premium-table"
            :rows="tableData"
            :columns="columnDataAssigned"
            v-model:pagination="paginationControl"
            row-key="id"
            :loading="tableAjaxLoading"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold">
                  # {{ props.row.leadInformation.leadNumber }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="text-right">
                <div class="flex items-center justify-end gap-sm">
                  <q-btn unelevated color="green-7" size="sm" label="Approve" @click="financeApproveSubmit(props.row.leadId)" class="action-btn" />
                  <q-btn flat color="red-7" size="sm" label="Reject" @click="openRejectModel(props.row)" />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Closed Panel -->
        <q-tab-panel name="closed" class="q-pa-none">
          <q-table
            flat
            class="premium-table"
            :rows="closedDatas"
            :columns="columns"
            v-model:pagination="paginationControl2"
            row-key="id"
            @request="ajaxLoadAllLeadInfoClosed"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props">
                <q-badge color="slate-100" text-color="slate-500" class="text-weight-bold">
                  # {{ props.row.leadInformation.leadNumber }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Common lead information in popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "serviceRequest",
  components: {
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      selectedTab: "unAssigned",
      assignToOptions: [],
      assignToOptions_bk: [],
      tableData: [],
      tableData1: [],
      closedDatas: [],
      formData: {
        marsDeviceIdsCooked: [],
        assignTo: "",
        requestMode: 1,
        podNumber: ""
      },
      requestOptions: [
        { label: "Direct Dispatch", value: 1 },
        { label: "SO Assignment", value: 0 },
      ],
      paginationControl: { page: 1, rowsPerPage: 10, rowsNumber: 0 },
      paginationControl1: { page: 1, rowsPerPage: 10, rowsNumber: 0 },
      paginationControl2: { page: 1, rowsPerPage: 10, rowsNumber: 0 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,

      columnDataUnassigned: [
        { name: "leadNumber", label: "Ticket No", align: "left", field: row => row.leadInformation.leadNumber },
        { name: "createdAt", label: "Generation Date", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "mid", label: "Device Type", align: "left", field: "mid" },
        { name: "merchant_name", label: "Service Type", align: "left", field: row => row.leadInformation.leadName },
        { name: "deviceAddress", label: "Location", align: "left", field: "deviceAddress" },
      ],
      columnDataAssigned: [
        { name: "leadNumber", label: "Ticket No", align: "left", field: row => row.leadInformation.leadNumber },
        { name: "createdAt", label: "Generation Date", align: "left", field: "createdAt" },
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "mid", label: "MID", align: "left", field: "mid" },
        { name: "merchant_name", label: "Merchant", align: "left", field: row => row.leadInformation.leadName },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.replacedBy ? row.replacedBy.name : "NA" },
        { name: "action", label: "Actions", align: "right" }
      ],
      columns: [
        { name: "leadNumber", label: "Lead ID", align: "left", field: row => row.leadInformation.leadNumber },
        { name: "createdAt", label: "TID Generated", align: "left", field: "createdAt" },
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "merchant_name", label: "Merchant", align: "left", field: row => row.leadInformation.leadName },
        { name: "assigned_to", label: "Resolved By", align: "left", field: row => row.replacedBy ? row.replacedBy.name : "NA" },
      ]
    };
  },
  computed: {
    ...mapGetters("DeviceReplacement", ["getDeviceReplacementQueueAssignedList", "getDeviceReplacementQueueUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1 });
  },
  methods: {
    ...mapActions("DeviceReplacement", ["DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", "DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", "DEVICE_REPLACEMENT_QUEUE_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Loading unassigned queue..." });
      this.DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name, value: v.id }));
          this.assignToOptions_bk = [...this.assignToOptions];
        });
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getDeviceReplacementQueueUnassignedList.totalElements;
        this.paginationControl1.page = this.getDeviceReplacementQueueUnassignedList.number + 1;
        this.tableData1 = this.getDeviceReplacementQueueUnassignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Loading assigned queue..." });
      this.DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getDeviceReplacementQueueAssignedList.totalElements;
        this.paginationControl.page = this.getDeviceReplacementQueueAssignedList.number + 1;
        this.tableData = this.getDeviceReplacementQueueAssignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfoClosed({ pagination, filter }) {
      this.ajaxLoadAllLeadInfo({ pagination, filter });
    },
    goToUnassignedTab(tab) {
      if (tab == "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1 });
      else if (tab == "assigned") this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl });
      else if (tab == "closed") this.ajaxLoadAllLeadInfoClosed({ pagination: this.paginationControl2 });
    },
    filterAssignTo(val, update) {
      update(() => {
        if (val === '') this.assignToOptions = this.assignToOptions_bk;
        else this.assignToOptions = this.assignToOptions_bk.filter(v => v.label.toLowerCase().includes(val.toLowerCase()));
      });
    },
    assignImplementationUser() {
      if (this.formData.assignTo == "") return this.$q.notify({ color: "red-9", message: "Implementation officer required" });
      let ids = this.formData.marsDeviceIdsCooked.map(v => v.id);
      this.DEVICE_REPLACEMENT_QUEUE_SUBMIT({ marsDeviceIds: ids, userId: this.formData.assignTo }).then(() => {
        this.goToUnassignedTab("unAssigned");
        this.formData.marsDeviceIdsCooked = [];
        this.$q.notify({ color: "positive", message: "Assignment successful" });
      });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    }
  }
};
</script>

<style lang="scss" scoped>
.premium-tabs {
  background: #f8fafc;
  border-radius: 12px;
  padding: 4px;
  ::v-deep(.q-tab) {
    border-radius: 8px;
    margin: 0 4px;
    min-height: 40px;
    transition: all 0.3s ease;
  }
  ::v-deep(.q-tab--active) {
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
}
.border-bottom { border-bottom: 1px solid #f1f5f9; }
.action-btn { border-radius: 8px !important; font-weight: 600; min-width: 90px; }
.bg-purple-1 { background-color: #faf5ff; }
.opacity-20 { opacity: 0.2; }
.opacity-50 { opacity: 0.5; }
</style>
