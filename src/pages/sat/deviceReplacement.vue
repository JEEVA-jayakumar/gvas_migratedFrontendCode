<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Device Replacement
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
      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <!-- Selected Count -->
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCookedUnAssinged.length }} </span>/ selected
          </div>

          <!-- Select Box -->
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              use-input
              input-debounce="0"
              @filter="fnFilterAssignToReassign"
              clearable
              v-model="formData.assignToReassign"
              :options="assignToOptionsReassignFiltered"
              label="Re-Assign To"
              color="grey-9"
              :disable="isReAssignDropdownDisabled"
              emit-value
              map-options
              @click="handleReAssignDropdownClick"
            />
          </div>

          <!-- Buttons Column -->
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <div class="column items-end">
              <!-- Re-Assign Button -->
              <q-btn
                no-caps
                label="Re-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="isReAssignDisabled"
                :loading="reAssignLoading"
                @click="reAssignImplementationUser"
              />

              <!-- Un-Assign button -->
              <q-btn
                no-caps
                label="Un-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="isUnAssignDisabled"
                :loading="unAssignLoading"
                @click="unAssignImplementationUser"
              />
            </div>
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
            selection="multiple"
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
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
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
                <q-input clearable color="grey-9" v-model="filterSearch" label="Search By TID, MID" class="q-mr-lg q-py-sm" />
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
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid || "NA" }}</div>
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
                <q-input clearable color="grey-9" v-model="filterSearch1" label="Search By TID, MID" class="q-mr-lg q-py-sm" />
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
  name: "DeviceReplacement",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "assigned",
      assignToOptions: [],
      assignToOptionsFiltered: [],
      assignToOptionsReassignFiltered: [],
      tableData: [],
      tableData1: [],
      reAssignLoading: false,
      unAssignLoading: false,
      paginationControl: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      columnDataAssigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || row.qrLeadInformation?.qrLeadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: row => row.tid, sortable: true },
        { name: "mid", label: "MID", align: "left", field: row => row.mid, sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || row.qrLeadInformation?.legalName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || row.qrLeadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: row => row.deviceAddress },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || row.qrLeadInformation?.leadSource?.sourceName || "NA" },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.replacedBy?.name || "NA" },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName || row.qrLeadInformation?.device?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || row.qrLeadInformation?.submitMarsDate || "NA", sortable: true }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || row.qrLeadInformation?.qrLeadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: row => row.tid, sortable: true },
        { name: "mid", label: "MID", align: "left", field: row => row.mid, sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || row.qrLeadInformation?.legalName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || row.qrLeadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: row => row.deviceAddress },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName || row.qrLeadInformation?.device?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || row.qrLeadInformation?.leadSource?.sourceName || "NA" },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || row.qrLeadInformation?.submitMarsDate || "NA", sortable: true }
      ],
      formData: { marsDeviceIdsCooked: [], marsDeviceIdsCookedUnAssinged: [], assignTo: "", assignToReassign: "" }
    };
  },
  computed: {
    ...mapGetters("DeviceReplacement", ["getDeviceReplacementQueueAssignedList", "getDeviceReplacementQueueUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    selectedAssignedCount() { return this.formData.marsDeviceIdsCookedUnAssinged.length; },
    isReAssignDropdownDisabled() { return this.selectedAssignedCount !== 1; },
    isReAssignDisabled() { return this.selectedAssignedCount !== 1 || !this.formData.assignToReassign; },
    isUnAssignDisabled() { return !!this.formData.assignToReassign || this.selectedAssignedCount === 0; }
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
  },
  methods: {
    ...mapActions("DeviceReplacement", ["DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", "DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", "DEVICE_REPLACEMENT_QUEUE_SUBMIT", "DEVICE_REPLACEMENT_QUEUE_REASSIGN", "DEVICE_REPLACEMENT_QUEUE_UNASSIGN"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    fnFilterAssignTo(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToOptionsFiltered = this.assignToOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    fnFilterAssignToReassign(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToOptionsReassignFiltered = this.assignToOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    handleReAssignDropdownClick() {
      if (this.isReAssignDropdownDisabled) {
        this.$q.notify({ color: "warning", position: "bottom", message: this.selectedAssignedCount > 1 ? "Multiple selection not allowed" : "Select at least one device to re-assign", icon: "info" });
      }
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name + " | " + v.employeeID + " | " + v.email, value: v.id }));
          this.assignToOptionsFiltered = this.assignToOptions;
          this.assignToOptionsReassignFiltered = this.assignToOptions;
        });
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getDeviceReplacementQueueUnassignedList.totalElements;
        this.paginationControl1.page = this.getDeviceReplacementQueueUnassignedList.number + 1;
        this.tableData1 = this.getDeviceReplacementQueueUnassignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getDeviceReplacementQueueAssignedList.totalElements;
        this.paginationControl.page = this.getDeviceReplacementQueueAssignedList.number + 1;
        this.tableData = this.getDeviceReplacementQueueAssignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    },
    assignImplementationUser() {
      if (!this.formData.assignTo) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Implementation officer cannot be empty!", icon: "thumb_down" });
        return;
      }
      let postValues = { marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id), userId: this.formData.assignTo };
      this.DEVICE_REPLACEMENT_QUEUE_SUBMIT(postValues).then(() => {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
        this.formData.marsDeviceIdsCooked = [];
        this.formData.assignTo = "";
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!", icon: "thumb_up" });
      });
    },
    unAssignImplementationUser() {
      if (this.unAssignLoading) return;
      this.unAssignLoading = true;
      let postValues = { action: this.$MARS_DEVICE_STATUS_TID_GENERATED, marsDeviceIds: this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id), userId: this.$SEND_ZERO_FOR_UNASSIGING };
      this.DEVICE_REPLACEMENT_QUEUE_UNASSIGN(postValues).then(() => {
        this.goToUnassignedTab("Assigned");
        this.formData.marsDeviceIdsCookedUnAssinged = [];
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Unassigned!", icon: "thumb_up" });
      }).finally(() => this.unAssignLoading = false);
    },
    reAssignImplementationUser() {
      if (this.reAssignLoading) return;
      this.reAssignLoading = true;
      let postValues = { action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED, marsDeviceIds: this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id), userId: this.formData.assignToReassign };
      this.DEVICE_REPLACEMENT_QUEUE_REASSIGN(postValues).then(() => {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.formData.marsDeviceIdsCookedUnAssinged = [];
        this.formData.assignToReassign = "";
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully re-assigned!", icon: "thumb_up" });
      }).finally(() => this.reAssignLoading = false);
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
</style>
