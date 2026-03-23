<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Service Request
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <b><span>Request Mode</span></b>
            <div class="col-md-2 col-sm-6 col-xs-6">
              <q-radio
                v-for="(item, index) in requestOptions"
                :key="index"
                color="grey-9"
                v-model.trim="formData.requestMode"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          <div v-if="formData.requestMode == 1" class="col-md-2 col-sm-6 col-xs-6">
            <q-input v-model.trim="formData.podNumber" class="text-weight-regular text-grey-8" color="grey-9" label="Enter Pod Number*" placeholder="Enter Pod Number*" />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              v-model="formData.assignTo"
              color="grey-9"
              :options="assignToOptions"
              use-input
              @filter="filterAssignTo"
              emit-value
              map-options
              clearable
              placeholder="Assign To"
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn no-caps :disabled="formData.marsDeviceIdsCooked.length == 0" label="Submit" class="common-dark-blue" @click="assignImplementationUser" />
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->
      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" active-color="dark" @update:model-value="goToUnassignedTab">
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
        <q-tab name="closed" label="Closed" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="unAssigned" class="q-pa-none">
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
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">{{ props.row.leadInformation?.submitToMarsDate ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.tid }}</div></q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid }}</div></q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength"><div>{{ props.row.deviceAddress }}</div></q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="assigned" class="q-pa-none">
          <q-table :rows="tableData" :columns="columnDataAssigned" table-class="customTableClass" :filter="filterSearch" v-model:pagination="paginationControl" row-key="id" :loading="tableAjaxLoading" :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo">
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">{{ props.row.leadInformation?.submitToMarsDate ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength"><div>{{ props.row.deviceAddress }}</div></q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.tid }}</div></q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid }}</div></q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="closed" class="q-pa-none">
          <q-table :rows="closedDatas" :columns="columns" table-class="customTableClass" :filter="filterSearch2" v-model:pagination="paginationControl2" row-key="id" :loading="tableAjaxLoading" :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfoClosed">
            <template v-slot:body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber }}</span>
              </q-td>
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
  name: "serviceRequest",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      filterSearch2: "",
      selectedTab: "assigned",
      assignToOptions: [],
      assignToOptions_bk: [],
      tableData: [],
      tableData1: [],
      closedDatas: [],
      paginationControl: { page: 1, rowsPerPage: 10 },
      paginationControl1: { page: 1, rowsPerPage: 10 },
      paginationControl2: { page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      requestOptions: [{ label: "Direct Dispatch", value: 1 }, { label: "SO", value: 0 }],
      formData: { marsDeviceIdsCooked: [], requestMode: 0, podNumber: "", assignTo: "" },
      columns: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.replacedBy?.name },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate }
      ],
      columnDataAssigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.replacedBy?.name },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", label: "Ticket No", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "createdAt", label: "BP Region", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "Device Type", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Service Type", align: "left", field: row => row.leadInformation?.leadName },
        { name: "mobile_number", label: "Request Mode", align: "center", field: row => row.leadInformation?.contactNumber },
        { name: "deviceAddress", label: "SO Name", align: "left", field: "deviceAddress" }
      ]
    };
  },
  computed: {
    ...mapGetters("DeviceReplacement", ["getDeviceReplacementQueueAssignedList", "getDeviceReplacementQueueUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
    this.ajaxLoadAllLeadInfoClosed({ pagination: this.paginationControl2, filter: "" });
  },
  methods: {
    ...mapActions("DeviceReplacement", ["DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", "DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", "DEVICE_REPLACEMENT_QUEUE_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    filterAssignTo(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToOptions = this.assignToOptions_bk.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name, value: v.id }));
          this.assignToOptions_bk = this.assignToOptions;
        });
        this.paginationControl1 = pagination;
        this.tableData1 = this.getDeviceReplacementQueueUnassignedList.content;
        this.tableAjaxLoading1 = false;
      });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.tableAjaxLoading = true;
      this.DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.tableData = this.getDeviceReplacementQueueAssignedList.content;
        this.tableAjaxLoading = false;
      });
    },
    ajaxLoadAllLeadInfoClosed({ pagination, filter }) {
      this.DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl2 = pagination;
        this.closedDatas = this.getDeviceReplacementQueueAssignedList.content;
      });
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      else if (tab === "assigned") this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
      else if (tab === "closed") this.ajaxLoadAllLeadInfoClosed({ pagination: this.paginationControl2, filter: "" });
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length === 0 || !this.formData.assignTo) return;
      let postValues = { marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id), userId: this.formData.assignTo };
      this.DEVICE_REPLACEMENT_QUEUE_SUBMIT(postValues).then(() => {
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
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
</style>
