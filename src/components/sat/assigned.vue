<template>
  <q-page>
    <!-- content -->
    <div>
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center gutter-y-sm">
          <div
            class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md"
            align="left"
          >
            <span class="q-display-2">{{
              formData.marsDeviceIdsCookedUnAssinged.length
            }}</span
            >/ selected
          </div>
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6">
                <q-select
                  use-input
                  @filter="filterAssignToOptions"
                  clearable
                  v-model="formData.assignTo"
                  color="grey-9"
                  :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                  :options="filteredAssignToOptions"
                  placeholder="Assign To"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-6">
                <q-checkbox
                  v-model="formData.triggerWelcomeMail"
                  color="dark"
                  label="Trigger welcome email"
                />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-6 group">
                <div>
                  <q-btn
                    no-caps
                    :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0 || !this.formData.assignTo"
                    label="Re-Assign"
                    class="common-dark-blue"
                    @click="reAssignImplementationUser"
                  />
                </div>
                <div>
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
        </div>
      </q-card>

      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          color="dark"
          name="assigned"
          label="Normal"
        />
        <q-tab color="dark" name="courier" label="Courier" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="q-pa-none">
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
            :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-LeadSource="props">
              <q-td :props="props" v-if="props.row && props.row.leadInformation && props.row.leadInformation.leadSource">
                <span
                  :class="{
                    'text-red': props.row.leadInformation.leadSource.sourceName === 'LS_TOHANDS'
                  }"
                >
                  {{ props.row.leadInformation.leadSource.sourceName }}
                </span>
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props" v-if="props.row">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd" v-if="props.row">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength" v-if="props.row">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props" v-if="props.row && props.row.leadInformation">
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By MID, Merchant Name.."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="courier" class="q-pa-none">
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
            :loading="tableAjaxLoading1"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary">
                  # {{ props.row.leadInformation ? props.row.leadInformation.leadNumber : "NA" }}
                </span>
              </q-td>
            </template>
            <template v-slot:body-cell-LeadSource="props">
              <q-td :props="props" v-if="props.row && props.row.leadInformation && props.row.leadInformation.leadSource">
                <span
                  :class="{
                    'text-red': props.row.leadInformation.leadSource.sourceName === 'LS_TOHANDS'
                  }"
                >
                  {{ props.row.leadInformation.leadSource.sourceName }}
                </span>
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props" v-if="props.row">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd" v-if="props.row">
                <div class="text-primary">{{ props.row.mid || "NA" }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength" v-if="props.row">
                <div>
                  <q-btn
                    no-caps
                    icon="edit"
                    color="purple-9"
                    size="xs"
                    round
                    @click="UpdateDeviceAddress(props.row)"
                  />
                  {{ props.row.deviceAddress || "NA" }}
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch1"
                  placeholder="Type.."
                  label="Search By MID, Merchant Name.."
                  class="q-mr-lg q-py-sm"
                />
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
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "implementationQueueAssigned",
  components: {
    DeviceAddressModal,
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "assigned",
      assignToOptions: [],
      filteredAssignToOptions: [],
      tableData: [],
      tableData1: [],
      columnDataAssigned: [
        { name: "leadNumber", required: true, label: "Lead Number", align: "left", field: row => row.leadInformation.leadNumber, sortable: false },
        { name: "LeadSource", required: true, label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource.sourceName, sortable: false },
        { name: "createdAt", required: true, label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: row => row.mid, sortable: true },
        { name: "merchant_name", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation.leadName, sortable: false },
        { name: "mobile_number", required: true, label: "Mobile Number", align: "center", field: row => row.leadInformation.contactNumber, sortable: false },
        { name: "deviceAddress", required: true, label: "Address", align: "left", field: row => row.deviceAddress, sortable: false },
        { name: "assigned_to", required: true, label: "Assigned To", align: "left", field: row => row.assignedTo ? row.assignedTo.name + " | " + row.assignedTo.employeeID : "NA", sortable: false },
        { name: "leadInformation", required: true, label: "Device Type", align: "left", field: row => row.leadInformation.device ? row.leadInformation.device.deviceName : (row.leadInformation.aggregatorDevice ? row.leadInformation.aggregatorDevice.deviceName : "NA"), sortable: false },
        { name: "serial_number", required: true, label: "Serial Number", align: "left", field: row => row.regionalInventory ? row.regionalInventory.serialNumber : "NA", sortable: true },
        { name: "submitToMarsDate", required: true, label: "Date of Submission", align: "left", field: row => row.leadInformation.submitToMarsDate, sortable: true }
      ],
      columnDataUnassigned: [
        { name: "leadNumber", required: true, label: "Lead Number", align: "left", field: row => row.leadInformation ? row.leadInformation.leadNumber : "NA", sortable: false },
        { name: "LeadSource", required: true, label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource.sourceName, sortable: false },
        { name: "createdAt", required: true, label: "Date of TID Generation", align: "left", field: row => row.createdAt || "NA", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: row => row.mid || "NA", sortable: true },
        { name: "merchant_name", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation ? row.leadInformation.leadName : "NA", sortable: false },
        { name: "mobile_number", required: true, label: "Mobile Number", align: "center", field: row => row.leadInformation ? row.leadInformation.contactNumber : "NA", sortable: false },
        { name: "deviceAddress", required: true, label: "Address", align: "left", field: row => row.deviceAddress || "NA", sortable: false },
        { name: "leadInformation", required: true, label: "Device Type", align: "left", field: row => row.leadInformation.device ? row.leadInformation.device.deviceName : (row.leadInformation.aggregatorDevice ? row.leadInformation.aggregatorDevice.deviceName : "NA"), sortable: false },
        { name: "serial_number", required: true, label: "Serial Number", align: "left", field: row => row.regionalInventory ? row.regionalInventory.serialNumber : "NA", sortable: true }
      ],
      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        courierDevice: false,
        assignTo: ""
      },
      paginationControl: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10, rowsNumber: 0 },
      paginationControl1: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10, rowsNumber: 0 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    };
  },
  computed: {
    ...mapGetters("ImplementationQueue", ["getImplementationQueueAssignedList", "getImplementationQueueCourierList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    this.getPincodeInformations();
  },
  methods: {
    ...mapActions("ImplementationQueue", ["IMPLEMENTATION_QUEUE_ASSIGNED_LIST", "IMPLEMENTATION_QUEUE_COURIER_LIST", "IMPLEMENTATION_QUEUE_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    getPincodeInformations() {
      this.FETCH_ALL_STATES_DATA();
    },
    filterAssignToOptions(val, update) {
      if (val === '') {
        update(() => { this.filteredAssignToOptions = this.assignToOptions; });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.filteredAssignToOptions = this.assignToOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.IMPLEMENTATION_QUEUE_COURIER_LIST({ pagination, filter }).then(() => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getImplementationQueueCourierList.totalElements;
          this.paginationControl1.page = this.getImplementationQueueCourierList.number + 1;
          this.tableData1 = this.getImplementationQueueCourierList.content;
          if (this.getImplementationQueueCourierList.sort != null) {
            this.paginationControl1.sortBy = this.getImplementationQueueCourierList.sort[0].property;
            this.paginationControl1.descending = !this.getImplementationQueueCourierList.sort[0].ascending;
          }
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.IMPLEMENTATION_QUEUE_ASSIGNED_LIST({ pagination, filter }).then(() => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            this.assignToOptions = this.getImplementationExecutiveList.map(value => ({
              label: value.name + " | " + value.employeeID + " | " + value.email,
              value: value.id
            }));
            this.filteredAssignToOptions = this.assignToOptions;
          });
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getImplementationQueueAssignedList.totalElements;
          this.paginationControl.page = this.getImplementationQueueAssignedList.number + 1;
          this.tableData = this.getImplementationQueueAssignedList.content;
          if (this.getImplementationQueueAssignedList.sort != null) {
            this.paginationControl.sortBy = this.getImplementationQueueAssignedList.sort[0].property;
            this.paginationControl.descending = !this.getImplementationQueueAssignedList.sort[0].ascending;
          }
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
      if (tab == "courier") {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      } else {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      }
      this.formData.marsDeviceIdsCookedUnAssinged = [];
      this.formData.assignTo = "";
    },
    UpdateDeviceAddress(row) {
      this.currentDeviceInfo = {
        id: row.id,
        marsDeviceAddress: {
          deviceAddress: row.deviceAddress,
          pincode: row.pincode,
          city: row.city,
          state: row.state
        }
      };
      this.showDeviceAddressModal = true;
    },
    UpdateDeviceAddressAfterEmit() {
      this.showDeviceAddressModal = false;
      this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    },
    unAssignImplementationUser() {
      if (this.formData.marsDeviceIdsCookedUnAssinged.length == 0) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Select atleast one item" });
        return;
      }
      this.$q.loading.show({ message: "Processing ..." });
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_TID_GENERATED,
        marsDeviceIds: this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id),
        userId: this.$SEND_ZERO_FOR_UNASSIGING
      };
      this.IMPLEMENTATION_QUEUE_SUBMIT(postValues).then(() => {
          this.formData.marsDeviceIdsCookedUnAssinged = [];
          this.$q.notify({ color: "positive", message: "Successfully Unassigned!" });
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    reAssignImplementationUser() {
      if (this.formData.marsDeviceIdsCookedUnAssinged.length == 0 || !this.formData.assignTo) {
        this.$q.notify({ color: "negative", message: "Select items and user" });
        return;
      }
      this.$q.loading.show({ message: "Processing ..." });
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
        marsDeviceIds: this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id),
        triggerWelcomeMail: this.formData.triggerWelcomeMail,
        userId: this.formData.assignTo
      };
      this.IMPLEMENTATION_QUEUE_SUBMIT(postValues).then(() => {
          this.formData.marsDeviceIdsCookedUnAssinged = [];
          this.$q.notify({ color: "positive", message: "Successfully Re-assigned !" });
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    }
  }
};
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}
.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>
