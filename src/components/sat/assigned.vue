<template>
  <div class="q-pa-none">
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
      <div class="row items-center gutter-y-sm">
        <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md" align="left">
          <span class="q-display-2">{{ formData.marsDeviceIdsCookedUnAssinged.length }}</span>/ selected
        </div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center q-col-gutter-sm">
            <div class="col-md-4 col-sm-6 col-xs-6">
              <q-select
                use-input
                @filter="filterAssignToOptions"
                clearable
                v-model="formData.assignTo"
                separator
                color="grey-9"
                :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                :options="filteredAssignToOptions"
                placeholder="Assign To"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6">
              <q-checkbox v-model="formData.triggerWelcomeMail" color="dark" label="Trigger welcome email" />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6 row q-gutter-xs justify-end">
              <q-btn
                no-caps
                :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0 || !formData.assignTo"
                label="Re-Assign"
                class="common-dark-blue"
                @click="reAssignImplementationUser"
              />
              <q-btn
                no-caps
                :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                label="Un-Assign"
                class="common-dark-blue"
                @click="unAssignImplementationUser"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
      <q-tab color="dark" name="assigned" label="Normal" />
      <q-tab color="dark" name="courier" label="Courier" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="assigned" class="no-padding">
        <q-table
          :rows="tableData"
          :columns="columnDataAssigned"
          table-class="customTableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          selection="multiple"
          v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
          row-key="id"
          :loading="tableAjaxLoading"
          :rows-per-page-options="[10, 20, 50, 100]"
          color="dark"
          @request="ajaxLoadAllLeadInfo"
        >
          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
              <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-LeadSource="props">
            <q-td :props="props">
              <span :class="{'text-red': props.row.leadInformation?.leadSource?.sourceName === 'LS_TOHANDS'}">
                {{ props.row.leadInformation?.leadSource?.sourceName || "NA" }}
              </span>
            </q-td>
          </template>
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
          </template>
          <template v-slot:body-cell-mid="props">
            <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid }}</div></q-td>
          </template>
          <template v-slot:body-cell-deviceAddress="props">
            <q-td :props="props" class="customTd customCellLength">{{ props.row.deviceAddress }}</q-td>
          </template>
          <template v-slot:body-cell-submitToMarsDate="props">
            <q-td :props="props">{{ props.row.leadInformation?.submitToMarsDate ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : "NA" }}</q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch" label="Search By MID, Merchant Name.." class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="courier" class="no-padding">
        <q-table
          :rows="tableData1"
          :columns="columnDataUnassigned"
          table-class="customTableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl1"
          row-key="id"
          :loading="tableAjaxLoading1"
          color="dark"
          @request="ajaxLoadAllLeadInfo1"
        >
          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
              <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-LeadSource="props">
            <q-td :props="props">
              <span :class="{'text-red': props.row.leadInformation?.leadSource?.sourceName === 'LS_TOHANDS'}">
                {{ props.row.leadInformation?.leadSource?.sourceName || "NA" }}
              </span>
            </q-td>
          </template>
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
          </template>
          <template v-slot:body-cell-mid="props">
            <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid || "NA" }}</div></q-td>
          </template>
          <template v-slot:body-cell-deviceAddress="props">
            <q-td :props="props" class="customTd customCellLength">
              <q-btn no-caps icon="edit" color="purple-9" size="xs" round @click="UpdateDeviceAddress(props.row)" />
              {{ props.row.deviceAddress || "NA" }}
            </q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch" label="Search By MID, Merchant Name.." class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <DeviceAddressModal
      v-if="showDeviceAddressModal"
      :showDeviceAddressModal="showDeviceAddressModal"
      :currentDeviceInfo="currentDeviceInfo"
      :stateInformation="getAllStatesData"
      :paginationControl="paginationControl"
      :selectedLeadItems="formData.marsDeviceIdsCooked"
      @toggleModal="UpdateDeviceAddressAfterEmit"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "assigned",
  components: { DeviceAddressModal, generalLeadInformation },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      selectedTab: "assigned",
      assignToOptions: [],
      filteredAssignToOptions: [],
      tableData: [],
      tableData1: [],
      paginationControl: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      formData: { marsDeviceIdsCooked: [], marsDeviceIdsCookedUnAssinged: [], triggerWelcomeMail: false, assignTo: "" },
      columnDataAssigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || "NA" },
        { name: "LeadSource", label: "Lead Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.assignedTo ? (row.assignedTo.name + " | " + row.assignedTo.employeeID) : "NA" },
        { name: "device_type", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName || row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || "NA", sortable: true }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || "NA" },
        { name: "LeadSource", label: "Lead Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "device_type", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName || row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true }
      ]
    };
  },
  computed: {
    ...mapGetters("ImplementationQueue", ["getImplementationQueueAssignedList", "getImplementationQueueCourierList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
    this.FETCH_ALL_STATES_DATA();
  },
  methods: {
    ...mapActions("ImplementationQueue", ["IMPLEMENTATION_QUEUE_ASSIGNED_LIST", "IMPLEMENTATION_QUEUE_COURIER_LIST", "IMPLEMENTATION_QUEUE_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    filterAssignToOptions(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.filteredAssignToOptions = this.assignToOptions.filter(v => v.label.toLowerCase().includes(needle));
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.IMPLEMENTATION_QUEUE_COURIER_LIST({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getImplementationQueueCourierList.totalElements;
        this.tableData1 = this.getImplementationQueueCourierList.content;
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.tableAjaxLoading = true;
      this.IMPLEMENTATION_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }));
          this.filteredAssignToOptions = this.assignToOptions;
        });
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getImplementationQueueAssignedList.totalElements;
        this.tableData = this.getImplementationQueueAssignedList.content;
        this.tableAjaxLoading = false;
      }).catch(() => { this.tableAjaxLoading = false; });
    },
    goToUnassignedTab(tab) {
      this.formData.marsDeviceIdsCookedUnAssinged = [];
      if (tab === "courier") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
    },
    UpdateDeviceAddress(info) {
      const ids = this.formData.marsDeviceIdsCooked.length === 0 ? [info.id] : this.formData.marsDeviceIdsCooked.map(v => v.id);
      this.currentDeviceInfo = { id: ids, marsDeviceAddress: { deviceAddress: info.deviceAddress, latitude: 0, longitude: 0, pincode: info.pincode, city: info.city, state: info.state } };
      this.showDeviceAddressModal = true;
    },
    UpdateDeviceAddressAfterEmit(pagination) {
      this.showDeviceAddressModal = false;
      if (pagination) this.paginationControl = pagination;
    },
    unAssignImplementationUser() {
      this.$q.loading.show({ message: "Unassigning.." });
      const ids = this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id);
      this.IMPLEMENTATION_QUEUE_SUBMIT({ action: this.$MARS_DEVICE_STATUS_TID_GENERATED, marsDeviceIds: ids, userId: this.$SEND_ZERO_FOR_UNASSIGING }).then(() => {
        this.$q.notify({ color: "positive", message: "Successfully Unassigned!" });
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
        this.$q.loading.hide();
      });
    },
    reAssignImplementationUser() {
      this.$q.loading.show({ message: "Re-assigning.." });
      const ids = this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id);
      this.IMPLEMENTATION_QUEUE_SUBMIT({ action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED, marsDeviceIds: ids, triggerWelcomeMail: this.formData.triggerWelcomeMail, userId: this.formData.assignTo }).then(() => {
        this.$q.notify({ color: "positive", message: "Successfully Re-assigned!" });
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
        this.$q.loading.hide();
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
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
</style>