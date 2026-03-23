<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Device Replacement
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              use-input
              @filter="filterAssignTo"
              clearable
              v-model="formData.assignTo"
              emit-value
              map-options
              color="grey-9"
              :options="assignToOptions"
              placeholder="Assign To"
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
        color="grey-1"
        active-color="dark"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="q-pa-none">
          <!--START: table Data -->
          <q-table
            :rows="tableData"
            :columns="columnDataAssigned"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5,10,15,20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td v-if="props.row.leadInformation != null" :props="props">
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td v-if="props.row.leadInformation != null" :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch" label="Search By TID, MID, Merchant Name .." class="q-mr-lg q-py-sm" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

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
              <q-td v-if="props.row.leadInformation != null" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td v-if="props.row.leadInformation != null" :props="props">
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td v-if="props.row.leadInformation != null" :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td v-if="props.row.leadInformation != null" :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
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
  name: "AggregatorDeviceReplacement",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "assigned",
      assignToOptions: [],
      assignToOptions_bk: [],
      tableData: [],
      tableData1: [],
      paginationControl: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      columnDataAssigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || "NA" },
        { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.replacedBy ? (row.replacedBy.name + " | " + row.replacedBy.employeeID) : "NA" },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA", sortable: true },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || "NA", sortable: true }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber || "NA" },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName || "NA" },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA", sortable: true },
        { name: "source", label: "Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName || "NA" },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate || "NA", sortable: true }
      ],
      formData: { marsDeviceIdsCooked: [], marsDeviceIdsCookedUnAssinged: [], assignTo: "" }
    };
  },
  computed: {
    ...mapGetters("AggregatorDeviceReplacement", ["getAggregatordeviceReplacementQueueAssignedList", "getAggregatorDeviceReplacementQueueUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
  },
  methods: {
    ...mapActions("AggregatorDeviceReplacement", ["AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name + " | " + v.employeeID + " | " + v.email, value: v.id }));
          this.assignToOptions_bk = this.assignToOptions;
        });
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getAggregatorDeviceReplacementQueueUnassignedList.totalElements;
        this.paginationControl1.page = this.getAggregatorDeviceReplacementQueueUnassignedList.number + 1;
        this.tableData1 = this.getAggregatorDeviceReplacementQueueUnassignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getAggregatordeviceReplacementQueueAssignedList.totalElements;
        this.paginationControl.page = this.getAggregatordeviceReplacementQueueAssignedList.number + 1;
        this.tableData = this.getAggregatordeviceReplacementQueueAssignedList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    },
    filterAssignTo(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToOptions = this.assignToOptions_bk.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    assignImplementationUser() {
      if (!this.formData.assignTo) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Implementation officer cannot be empty!", icon: "thumb_down" });
        return;
      }
      let postValues = { marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id), userId: this.formData.assignTo };
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_SUBMIT(postValues).then(() => {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
        this.formData.marsDeviceIdsCooked = [];
        this.formData.assignTo = "";
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
