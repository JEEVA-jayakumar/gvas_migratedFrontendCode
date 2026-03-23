<template>
  <div class="q-pa-none">
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Bijlipay Implementation Queue
    </div>
    <div>
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>

          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              filter
              clearable
              v-model="formData.assignTo"
              separator
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length == 0"
              :options="assignToOptions"
              placeholder="Assign To"
              emit-value
              map-options
            />
            <q-checkbox v-model="formData.courier" color="dark" label="Courier Device" />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-checkbox v-model="formData.triggerWelcomeMail" color="dark" label="Trigger welcome email" />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6 text-right">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0"
              label="Assign"
              class="common-dark-blue"
              style="width: 90px"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>

      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
        <q-tab color="dark" name="unAssigned" label="Unassigned" />
        <q-tab color="dark" name="assigned" label="Assigned" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="no-padding">
          <assigned />
        </q-tab-panel>
        <q-tab-panel name="unAssigned" class="no-padding">
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="id"
            :rows-per-page-options="[10, 20, 50, 100]"
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
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">{{ props.row.leadInformation?.submitToMarsDate ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid }}</div></q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <div>
                  <q-btn no-caps icon="edit" color="purple-9" size="xs" round @click="UpdateDeviceAddress(props.row)" />
                  {{ props.row.deviceAddress }}
                </div>
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
        :paginationControl="paginationControl1"
        :selectedLeadItems="formData.marsDeviceIdsCooked"
        @toggleModal="UpdateDeviceAddressAfterEmit"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import assigned from "../../components/sat/assigned.vue";

export default {
  name: "internalimplementationRequest",
  components: {
    DeviceAddressModal,
    generalLeadInformation,
    assigned
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      selectedTab: "assigned",
      assignToOptions: [],
      tableData1: [],
      showDeviceAddressModal: false,
      currentDeviceInfo: {},
      paginationControl1: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading1: false,
      formData: { marsDeviceIdsCooked: [], triggerWelcomeMail: false, courier: false, assignTo: "" },
      columnDataUnassigned: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "LeadSource", label: "Lead Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber },
        { name: "deviceAddress", label: "Address", align: "left", field: "deviceAddress" },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate }
      ]
    };
  },
  computed: {
    ...mapGetters("ImplementationQueue", ["getImplementationQueueUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  created() {
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
    this.FETCH_ALL_STATES_DATA();
  },
  methods: {
    ...mapActions("ImplementationQueue", ["IMPLEMENTATION_QUEUE_UNASSIGNED_LIST", "IMPLEMENTATION_QUEUE_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.IMPLEMENTATION_QUEUE_UNASSIGNED_LIST({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name + " | " + v.employeeID + " | " + v.email, value: v.id }));
        });
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getImplementationQueueUnassignedList.totalElements;
        this.tableData1 = this.getImplementationQueueUnassignedList.content;
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    goToUnassignedTab(tab) {
      if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
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
      const postValues = { action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED, marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id), triggerWelcomeMail: this.formData.triggerWelcomeMail, courier: this.formData.courier, userId: this.formData.assignTo };
      this.IMPLEMENTATION_QUEUE_SUBMIT(postValues).then(() => {
        this.formData.marsDeviceIdsCooked = [];
        this.formData.assignTo = "";
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!", icon: "thumb_up" });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
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