<template>
  <div class="q-pa-none">
    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

    <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
      <div class="row items-center gutter-y-sm">
        <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md" align="left">
          <span class="q-display-2">{{ formData.marsDeviceIdsCookedUnAssinged.length }}</span>/ selected
        </div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center q-col-gutter-sm">
            <div class="col-md-4 col-sm-6 col-xs-6">
              <q-select filter clearable v-model="formData.assignTo" separator color="grey-9"
                :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0" :options="assignToOptions"
                placeholder="Assign To" emit-value map-options />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6">
              <q-checkbox v-model="formData.triggerWelcomeMail" color="dark" label="Trigger welcome email" />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6 row q-gutter-xs justify-end">
              <q-btn no-caps :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0 || !formData.assignTo"
                label="Re-Assign" class="common-dark-blue" @click="reAssignImplementationUser" />
              <q-btn no-caps :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0" label="Un-Assign"
                class="common-dark-blue" @click="unAssignImplementationUser" />
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
      <q-tab-panel name="assigned">
        <q-table :rows="tableData" :columns="columnDataAssigned" table-class="customTableClass" :filter="filterSearch"
          v-model:pagination="paginationControl" selection="multiple"
          v-model:selected="formData.marsDeviceIdsCookedUnAssinged" row-key="id" :loading="tableAjaxLoading"
          :rows-per-page-options="[10, 20, 50, 100]" color="dark" @request="ajaxLoadAllLeadInfo">
          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
              <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.."
                label="Search By MID, Merchant Name.." class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="courier">
        <q-table :rows="tableData1" :columns="columnDataUnassigned" table-class="customTableClass"
          :filter="filterSearch" v-model:pagination="paginationControl1" row-key="id" :loading="tableAjaxLoading1"
          color="dark" @request="ajaxLoadAllLeadInfo1">
          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
              <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:body-cell-deviceAddress="props">
            <q-td :props="props" class="customTd customCellLength">
              <q-btn no-caps icon="edit" color="purple-9" size="xs" round @click="UpdateDeviceAddress(props.row)" />
              {{ props.row.deviceAddress || "NA" }}
            </q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.."
                label="Search By MID, Merchant Name.." class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <DeviceAddressModal v-if="showDeviceAddressModal" :showDeviceAddressModal="showDeviceAddressModal"
      :currentDeviceInfo="currentDeviceInfo" :stateInformation="getAllStatesData"
      :paginationControl="paginationControl" :selectedLeadItems="formData.marsDeviceIdsCooked"
      @toggleModal="UpdateDeviceAddressAfterEmit" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "Phonepeassigned",
  components: {
    DeviceAddressModal,
    generalLeadInformation,
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      selectedTab: "assigned",
      assignToOptions: [],
      tableData: [],
      tableData1: [],
      columnDataAssigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation.leadNumber },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation.leadName },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation.contactNumber },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : "NA" },
        { name: "device_type", label: "Device Type", align: "left", field: row => row.leadInformation.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA" },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation.submitToMarsDate },
        { name: "lead_source", label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource?.sourceName || "NA" }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "device_type", label: "Device Type", align: "left", field: row => row.leadInformation.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA" },
        { name: "lead_source", label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource?.sourceName || "NA" }
      ],
      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: ""
      },
      paginationControl: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    };
  },
  computed: {
    ...mapGetters("phonepeImplementationQueue", ["getPhonepeImplementationQueueCourierList", "getPhonepeImplementationQueueassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
    this.FETCH_ALL_STATES_DATA();
  },
  methods: {
    ...mapActions("phonepeImplementationQueue", ["PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST", "PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT", "PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ message: "Fetching data .." });
      this.PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getPhonepeImplementationQueueCourierList.totalElements;
        this.paginationControl1.page = this.getPhonepeImplementationQueueCourierList.number + 1;
        this.tableData1 = this.getPhonepeImplementationQueueCourierList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ message: "Fetching data .." });
      this.PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }));
        });
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getPhonepeImplementationQueueassignedList.totalElements;
        this.paginationControl.page = this.getPhonepeImplementationQueueassignedList.number + 1;
        this.tableData = this.getPhonepeImplementationQueueassignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
      if (tab == "courier") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    },
    UpdateDeviceAddress(info) {
      this.showDeviceAddressModal = true;
      let ids = this.formData.marsDeviceIdsCookedUnAssinged.length ? this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id) : [info.id];
      this.currentDeviceInfo = {
        id: ids,
        marsDeviceAddress: {
          deviceAddress: info.deviceAddress, latitude: 0, longitude: 0, pincode: info.pincode, city: info.city, state: info.state
        }
      };
    },
    UpdateDeviceAddressAfterEmit(pagination) {
      this.showDeviceAddressModal = false;
      this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
    },
    unAssignImplementationUser() {
      const ids = this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id);
      this.$q.loading.show({ message: "Unassigning.." });
      this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT({ action: this.$MARS_DEVICE_STATUS_TID_GENERATED, marsDeviceIds: ids, userId: this.$SEND_ZERO_FOR_UNASSIGING }).then(() => {
        this.formData.marsDeviceIdsCookedUnAssinged = [];
        this.$q.notify({ color: "positive", message: "Successfully Unassigned!" });
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      }).catch(() => this.$q.loading.hide());
    },
    reAssignImplementationUser() {
      const ids = this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id);
      this.$q.loading.show({ message: "Re-assigning.." });
      this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT({ action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED, marsDeviceIds: ids, triggerWelcomeMail: this.formData.triggerWelcomeMail, userId: this.formData.assignTo }).then(() => {
        this.formData.marsDeviceIdsCookedUnAssinged = [];
        this.formData.assignTo = "";
        this.$q.notify({ color: "positive", message: "Successfully Re-assigned!" });
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      }).catch(() => this.$q.loading.hide());
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    }
  }
};
</script>