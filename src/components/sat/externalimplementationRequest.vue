<template>
  <div class="q-pa-none">
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Implementation Queue
    </div>
    <div>
      <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

      <changeRegionModal v-if="propToggleRegionChange" :regionInformation="addRegionInformation"
        :propToggleRegionInfoPop="propToggleRegionChange" @closeRegionInformation="changeRegion" />

      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select use-input @filter="filterAssignToOptions" clearable v-model="formData.assignTo" separator
              color="grey-9" :disable="formData.marsDeviceIdsCooked.length == 0" :options="filteredAssignToOptions"
              placeholder="Assign To" emit-value map-options />
            <q-checkbox v-model="formData.courier" color="dark" label="Courier Device" />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn no-caps :disabled="formData.marsDeviceIdsCooked.length == 0 || !formData.assignTo" label="Assign"
              class="common-dark-blue" @click="assignImplementationUser" />
          </div>
          <div v-if="id==3" class="col-md-2 col-sm-6 col-xs-6" align="right">
            <q-btn no-caps :disabled="formData.marsDeviceIdsCooked.length == 0" label="Re-Assign Region"
              class="common-dark-blue" @click="changeRegion(formData.marsDeviceIdsCooked)" />
          </div>
        </div>
      </q-card>

      <q-card class="group q-pa-md" v-if="selectedTab == 'cancelledMerchants'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCookedCancelled.length }}</span>/ selected
          </div>
          <div class="col row q-gutter-md justify-end">
            <q-btn no-caps :disabled="formData.marsDeviceIdsCookedCancelled.length == 0" label="Cancel"
              class="common-dark-blue" @click="cancelImplementationUser" />
            <q-btn no-caps :disabled="formData.marsDeviceIdsCookedCancelled.length == 0" label="Re assign"
              class="common-dark-blue" @click="reAssignImplementationUser" />
          </div>
        </div>
      </q-card>

      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
        <q-tab color="dark" name="unAssigned" label="Unassigned" />
        <q-tab color="dark" name="assigned" label="Assigned" />
        <q-tab color="dark" name="cancelledMerchants" label="Cancelled Merchants" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="no-padding">
          <Phonepeassigned />
        </q-tab-panel>

        <q-tab-panel name="unAssigned" class="no-padding">
          <q-table :rows="tableData1" :columns="columnDataUnassigned" table-class="customTableClass"
            :filter="filterSearch" selection="multiple" v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1" row-key="id" :loading="tableAjaxLoading1"
            :rows-per-page-options="[10, 20, 50, 100]" color="dark" @request="ajaxLoadAllLeadInfo1">
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">{{ $moment(props.row.leadInformation?.submitToMarsDate).format("Do MMM Y") }}</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid }}</div></q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <q-btn no-caps icon="edit" color="purple-9" size="xs" round @click="UpdateDeviceAddress(props.row)" />
                {{ props.row.deviceAddress }}
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch" label="Search By MID, Merchant Name.." class="q-mr-lg q-py-sm" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="cancelledMerchants" class="no-padding">
          <q-table :rows="tableData2" :columns="columnDataMerchants" table-class="customTableClass"
            :filter="filterSearch2" v-model:pagination="paginationControl2" selection="multiple"
            v-model:selected="formData.marsDeviceIdsCookedCancelled" row-key="id" :loading="tableAjaxLoading2"
            :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo2">
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">{{ $moment(props.row.leadInformation?.submitToMarsDate).format("Do MMM Y") }}</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch2" placeholder="Type.."
                  label="Search By MID, Merchant Name.." class="q-mr-lg q-py-sm" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <DeviceAddressModal v-if="showDeviceAddressModal" :showDeviceAddressModal="showDeviceAddressModal"
        :currentDeviceInfo="currentDeviceInfo" :stateInformation="getAllStatesData"
        :paginationControl="paginationControl1" :selectedLeadItems="formData.marsDeviceIdsCooked"
        @toggleModal="UpdateDeviceAddressAfterEmit" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import Phonepeassigned from "../../components/sat/Phonepeassigned.vue";
import changeRegionModal from "../../components/changeRegionModal.vue";

export default {
  name: "externalimplementationRequest",
  components: {
    DeviceAddressModal,
    generalLeadInformation,
    Phonepeassigned,
    changeRegionModal
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propToggleRegionChange: false,
      addtnLeadInformation: null,
      addRegionInformation: null,
      filterSearch: "",
      filterSearch2: "",
      selectedTab: "assigned",
      id: null,
      assignToOptions: [],
      filteredAssignToOptions: [],
      tableData1: [],
      tableData2: [],
      showDeviceAddressModal: false,
      currentDeviceInfo: {},
      paginationControl1: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl2: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading1: false,
      tableAjaxLoading2: false,
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedCancelled: [],
        triggerWelcomeMail: false,
        courier: false,
        assignTo: ""
      },
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "deviceType", label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA", sortable: true },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate },
        { name: "status", label: "Status", align: "left", field: row => row.deviceStatus == 3 ? "CANCELLED" : "NA" },
        { name: "lead_source", label: "Lead Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || "NA" }
      ],
      columnDataMerchants: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || "NA" },
        { name: "cancel_reason", label: "Cancel Reason", align: "left", field: "reason" },
        { name: "remarks", label: "Remarks", align: "left", field: "onboardCancelRemarks" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "deviceType", label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA", sortable: true },
        { name: "lead_source", label: "Lead Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || "NA" }
      ]
    };
  },
  computed: {
    ...mapGetters("phonepeImplementationQueue", ["getPhonepeImplementationQueueUnassignedList", "getPhonepeCancelledMerchants"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  beforeMount() {
    const tabStr = localStorage.getItem("selectedTab");
    if (tabStr) this.id = tabStr.split('|')[1];
  },
  created() {
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
    this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: "" });
    this.FETCH_ALL_STATES_DATA();
  },
  methods: {
    ...mapActions("phonepeImplementationQueue", ["PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST", "PHONEPE_CANCELLED_MERCHANTS", "PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT", "PHONEPE_CANCELLED_MERCHANT_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    filterAssignToOptions(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.filteredAssignToOptions = this.assignToOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }));
          this.filteredAssignToOptions = this.assignToOptions;
        });
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getPhonepeImplementationQueueUnassignedList.totalElements;
        this.tableData1 = this.getPhonepeImplementationQueueUnassignedList.content;
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    ajaxLoadAllLeadInfo2({ pagination, filter }) {
      this.tableAjaxLoading2 = true;
      this.PHONEPE_CANCELLED_MERCHANTS({ pagination, filter }).then(() => {
        this.paginationControl2 = pagination;
        this.paginationControl2.rowsNumber = this.getPhonepeCancelledMerchants.totalElements;
        this.tableData2 = this.getPhonepeCancelledMerchants.content;
        this.tableAjaxLoading2 = false;
      }).catch(() => { this.tableAjaxLoading2 = false; });
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      else if (tab === "cancelledMerchants") this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: "" });
    },
    UpdateDeviceAddress(details) {
      const ids = this.formData.marsDeviceIdsCooked.length === 0 ? [details.id] : this.formData.marsDeviceIdsCooked.map(v => v.id);
      this.currentDeviceInfo = { id: ids, marsDeviceAddress: { deviceAddress: details.deviceAddress, latitude: 0, longitude: 0, pincode: details.pincode, city: details.city, state: details.state } };
      this.showDeviceAddressModal = true;
    },
    UpdateDeviceAddressAfterEmit(pagination) {
      this.showDeviceAddressModal = false;
      if (pagination) this.paginationControl1 = pagination;
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length === 0 || !this.formData.assignTo) return;
      this.$q.loading.show({ message: "Validating .." });
      const postValues = { action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED, marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id), triggerWelcomeMail: this.formData.triggerWelcomeMail, courier: this.formData.courier, userId: this.formData.assignTo };
      this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues).then((res) => {
        if (res.status == 200 && (!res.data.data || res.data.data.second[0]?.Success)) {
          this.$q.notify({ color: "positive", message: "Successfully assigned!", icon: "thumb_up" });
          this.formData.marsDeviceIdsCooked = [];
          this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
        } else if (res.data?.data?.second[0]?.Failed) {
          this.$router.push({ name: "externalimplementationAddressFetch", params: { data: res } });
        }
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    reAssignImplementationUser() {
      if (this.formData.marsDeviceIdsCookedCancelled.length === 0) return;
      this.$q.loading.show({ message: "Re-assigning.." });
      const postValues = { action: this.$MARS_DEVICE_STATUS_TID_GENERATED, marsDeviceIds: this.formData.marsDeviceIdsCookedCancelled.map(v => v.id), userId: this.$SEND_ZERO_FOR_UNASSIGING };
      this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues).then(() => {
        this.$q.notify({ color: "positive", message: "Successfully Re-Assigned!", icon: "thumb_up" });
        this.formData.marsDeviceIdsCookedCancelled = [];
        this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: "" });
      }).catch(() => this.$q.loading.hide());
    },
    cancelImplementationUser() {
      if (this.formData.marsDeviceIdsCookedCancelled.length === 0) return;
      this.$q.loading.show({ message: "Cancelling.." });
      const postValues = { leadIdSat: this.formData.marsDeviceIdsCookedCancelled.map(v => v.leadInformation.id) };
      this.PHONEPE_CANCELLED_MERCHANT_SUBMIT(postValues).then(() => {
        this.$q.notify({ color: "positive", message: "Successfully Cancelled!", icon: "thumb_up" });
        this.formData.marsDeviceIdsCookedCancelled = [];
        this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: "" });
      }).catch(() => this.$q.loading.hide());
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    },
    changeRegion(details) {
      this.propToggleRegionChange = !this.propToggleRegionChange;
      if (details) this.addRegionInformation = details;
      if (!this.propToggleRegionChange) {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
        this.formData.marsDeviceIdsCooked = [];
      }
    }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
</style>
