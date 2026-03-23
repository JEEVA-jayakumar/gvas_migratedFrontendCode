<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Device Recovery Tracker
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              use-input
              input-debounce="0"
              @filter="fnFilterAssignTo"
              clearable
              v-model="formData.assignTo"
              :options="assignToOptionsFiltered"
              label="Assign To"
              color="grey-9"
              emit-value
              map-options
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0"
              label="Assign"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        align="left"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
      </q-tabs>
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="no-padding">
          <q-table
            :rows="tableData"
            :columns="columnDataAssigned"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || props.row.qrLeadInformation?.qrLeadNumber || "NA" }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">
                {{ props.row.leadInformation?.submitToMarsDate ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : (props.row.qrLeadInformation?.submitMarsDate ? $moment(props.row.qrLeadInformation.submitMarsDate).format("Do MMM Y") : "NA") }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch" label="Search By TID, MID, Merchant Name .." class="q-mr-lg q-py-sm" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="unAssigned" class="no-padding">
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch1"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || props.row.qrLeadInformation?.qrLeadNumber || "NA" }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">
                {{ props.row.leadInformation?.submitToMarsDate ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : (props.row.qrLeadInformation?.submitMarsDate ? $moment(props.row.qrLeadInformation.submitMarsDate).format("Do MMM Y") : "NA") }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}
              </q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch1" label="Search By TID, MID, Merchant Name .." class="q-mr-lg q-py-sm" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DeviceRecoveryTracker",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "assigned",
      assignToOptions: [],
      assignToOptionsFiltered: [],
      tableData: [],
      tableData1: [],
      paginationControl: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      formData: { marsDeviceIdsCooked: [], marsDeviceIdsCookedUnAssinged: [], triggerWelcomeMail: false, assignTo: "" },
      columnDataAssigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || row.qrLeadInformation?.qrLeadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: row => row.tid, sortable: true },
        { name: "mid", label: "MID", align: "left", field: row => row.mid, sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || row.qrLeadInformation?.merchantName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || row.qrLeadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || row.qrLeadInformation?.leadSource?.sourceName || "NA" },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.recoveredBy ? (row.recoveredBy.name + " | " + row.recoveredBy.employeeID) : "NA" },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName || row.qrLeadInformation?.device?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || row.qrLeadInformation?.submitMarsDate || "NA", sortable: true }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || row.qrLeadInformation?.qrLeadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: row => row.tid, sortable: true },
        { name: "mid", label: "MID", align: "left", field: row => row.mid, sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || row.qrLeadInformation?.merchantName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || row.qrLeadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName || row.qrLeadInformation?.device?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || row.qrLeadInformation?.leadSource?.sourceName || "NA" },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || row.qrLeadInformation?.submitMarsDate || "NA", sortable: true }
      ]
    };
  },
  computed: {
    ...mapGetters("DeviceRecovery", ["getDeviceRecoveryAssignedList", "getDeviceRecoveryUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    this.FETCH_ALL_STATES_DATA();
  },
  methods: {
    ...mapActions("DeviceRecovery", ["DEVICE_RECOVERY_ASSIGNED_LIST", "DEVICE_RECOVERY_UNASSIGNED_LIST", "DEVICE_RECOVERY_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    fnFilterAssignTo(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToOptionsFiltered = this.assignToOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.DEVICE_RECOVERY_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getDeviceRecoveryUnassignedList.totalElements;
        this.tableData1 = this.getDeviceRecoveryUnassignedList.content;
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name + " | " + v.employeeID + " | " + v.email, value: v.id }));
          this.assignToOptionsFiltered = this.assignToOptions;
        });
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.tableAjaxLoading = true;
      this.DEVICE_RECOVERY_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getDeviceRecoveryAssignedList.totalElements;
        this.tableData = this.getDeviceRecoveryAssignedList.content;
        this.tableAjaxLoading = false;
      }).catch(() => { this.tableAjaxLoading = false; });
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length === 0 || !this.formData.assignTo) return;
      let postValues = { marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id), userId: this.formData.assignTo };
      this.DEVICE_RECOVERY_SUBMIT(postValues).then(() => {
        this.goToUnassignedTab(this.selectedTab);
        this.formData.marsDeviceIdsCooked = [];
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!", icon: "thumb_up" });
      });
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-break: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
</style>
