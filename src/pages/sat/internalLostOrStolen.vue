<template>
  <q-page>
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Bijlipay Lost/Stolen
    </div>

    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="id"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >
      <template v-slot:body-cell-tid="props">
        <q-td :props="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-mid="props">
        <q-td :props="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-leadNumber="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click="toggleLeadInformation(props.row.leadInformation)"
        >
          <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-mobileNumber="props">
        <q-td :props="props">{{
          props.row.leadInformation == null ? "NA" : props.row.leadInformation.contactNumber
        }}</q-td>
      </template>
      <template v-slot:body-cell-leadAddress="props">
        <q-td :props="props">{{
          props.row.leadInformation == null ? "NA" : props.row.leadInformation.leadAddress
        }}</q-td>
      </template>
      <template v-slot:body-cell-lostOrStolenRemarks="props">
        <q-td :props="props">
          <span class="label">{{ props.row.lostOrStolenRemarks }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-deviceStatusDate="props">
        <q-td :props="props">
          <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn push class="q-mx-sm" color="positive" size="sm" @click="lostStolenDevice(props.row)" label="Lost/Stolen" />
        </q-td>
      </template>
      <template v-slot:top>
        <div class="col-5">
          <q-input dense clearable v-model="filter" color="grey-9" placeholder="Type.." label="Search Using TID, MID, Lead ID, Merchant Name" class="q-mr-lg q-py-sm">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
    </q-table>

    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Lost/Stolen Status
    </div>
    <q-table
      table-class="customTableClass"
      :columns="columns1"
      :rows="tableData1"
      row-key="id"
      color="grey-9"
      :filter="filter1"
      :rows-per-page-options="[5, 10, 15, 20, 25]"
      v-model:pagination="paginationControl1"
      :loading="toggleAjaxLoadFilter1"
      @request="lostOrStolenLoadInfo"
      class="payment_verification_table capitalize"
    >
      <template v-slot:body-cell-updated_at="props">
        <q-td :props="props">{{ props.row.updatedAt == null ? "NA" : $moment(props.row.updatedAt).format("Do MMM Y") }}</q-td>
      </template>
      <template v-slot:body-cell-Status="props">
        <q-td :props="props">
          <span class="label text-positive" v-if="props.row.regionalInventory?.deviceStatus == 8">Waiting for Approval</span>
          <span class="label text-amber" v-if="props.row.regionalInventory?.deviceStatus == 7">Submitted By SO</span>
          <span class="label text-purple" v-if="props.row.regionalInventory?.deviceStatus == 10">Rejected By Finance</span>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn v-if="props.row.regionalInventory?.deviceStatus == 8" disable push color="purple-9" size="sm" label="Waiting for Approval" />
          <q-btn v-else-if="props.row.regionalInventory?.deviceStatus == 7" disable color="blue" size="sm" label="Submitted By SO" />
          <q-btn v-else-if="props.row.regionalInventory?.deviceStatus == 10" disable color="red" size="sm" label="Rejected By Finance" />

          <q-btn v-if="props.row.regionalInventory?.deviceStatus == 10" push color="red" size="sm" @click="lostStolenDevice(props.row)" label="Lost/Stolen" />
          <q-btn v-if="props.row.regionalInventory?.deviceStatus == 8" push color="purple-9" size="sm" @click="lostStolenDevice(props.row)" label="Lost/Stolen" />
          <q-btn v-else-if="props.row.regionalInventory?.deviceStatus == 7" push class="q-mx-sm" color="positive" size="sm" @click="lostStolenDevice(props.row)" label="Lost/Stolen" />
        </q-td>
      </template>
      <template v-slot:top>
        <div class="col-md-5">
          <q-input dense clearable color="grey-9" v-model="filter1" placeholder="Type.." label="Search Using TID, MID " class="q-mr-lg q-py-sm">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-md-6">
          <q-btn square outline color="purple-9" label="Download as Excel" class="q-mr-lg q-py-sm float-right" size="md" @click="downloadLostDatas" />
        </div>
      </template>
    </q-table>

    <DownloadLostOrStolen v-if="propLostStolenDatas" :propLostStolenDatas="propLostStolenDatas" @emitfnshowLostOrStolen="downloadLostDatas" />
    <lostStolenDeviceComp v-if="showLostModel" :showLostModel="showLostModel" :propShowLostComponent="propsLostAppend" @closeLostModel="lostStolenDevice" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DownloadLostOrStolen from "../../components/sat/DownloadLostOrStolen.vue";
import lostStolenDeviceComp from "../../components/sat/lostStolenDeviceComp.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";

export default {
  name: "internalLostOrStolen",
  components: {
    showMerchantTransactionLevelDetails,
    lostStolenDeviceComp,
    generalLeadInformation,
    DownloadLostOrStolen
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propLostStolenDatas: false,
      propsLostAppend: [],
      showLostModel: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "tid",
        descending: false,
        rowsPerPage: 10
      },
      paginationControl1: {
        rowsNumber: 10,
        page: 1,
        sortBy: "tid",
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      tableData1: [],
      valueToggleMerchantTransaction: false,
      filter: "",
      filter1: "",
      columns: [
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", required: true, label: "Lead Id", align: "left", field: row => row.leadInformation?.leadNumber, sortable: false },
        { name: "leadInformation", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName, sortable: false },
        { name: "leadAddress", required: true, label: "Merchant Address", align: "center", field: row => row.leadInformation?.leadAddress, sortable: false },
        { name: "deviceName", required: true, label: "Device type", align: "right", field: row => row.leadInformation?.device?.deviceName, sortable: false },
        { name: "device_serial_number", required: true, label: "Device Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA", sortable: true },
        { name: "deviceStatusDate", required: true, label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", required: true, label: "Implemented by", align: "left", field: row => row.assignedTo ? (row.assignedTo.name + " | " + row.assignedTo.employeeID) : "NA", sortable: true },
        { name: "deviceAddress", required: true, label: "Implemented Address", align: "left", field: row => row.deviceAddress, sortable: true },
        { name: "mobileNumber", required: true, label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber, sortable: false },
        { name: "action", required: true, label: "", align: "center", field: "action", sortable: false }
      ],
      columns1: [
        { name: "leadInformation.leadName", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "Address", required: true, label: "Address", align: "left", field: row => row.leadInformation?.leadAddress, sortable: true },
        { name: "leadInformation.device.deviceName", required: true, label: "Device", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "updated_at", required: true, label: "Receive Date", align: "center", field: "updatedAt" },
        { name: "lostOrStolenRemarks", required: true, label: "Remarks", align: "left", field: row => row.regionalInventory?.lostOrStolenRemarks || "NA" },
        { name: "Status", required: true, label: "Status", align: "left", field: row => row.regionalInventory?.deviceStatus, sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters("MasterTracker", ["getMasterTrackerList"]),
    ...mapGetters("lostOrStolenDatas", ["getLostOrStolenDatas"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
    this.lostOrStolenLoadInfo({ pagination: this.paginationControl1, filter: this.filter1 });
  },
  methods: {
    ...mapActions("MasterTracker", ["MASTER_TRACKER_LIST"]),
    ...mapActions("lostOrStolenDatas", ["FETCH_ALL_LOST_DEVICES_DATAS"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.MASTER_TRACKER_LIST({ pagination, filter }).then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getMasterTrackerList.totalElements;
          this.paginationControl.page = this.getMasterTrackerList.number + 1;
          this.tableData = this.getMasterTrackerList.content;
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    lostOrStolenLoadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_LOST_DEVICES_DATAS({ pagination, filter }).then(res => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getLostOrStolenDatas.totalElements;
          this.paginationControl1.page = this.getLostOrStolenDatas.number + 1;
          this.tableData1 = this.getLostOrStolenDatas.content;
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    downloadLostDatas() { this.propLostStolenDatas = !this.propLostStolenDatas; },
    lostStolenDevice(exceptionDetails) {
      this.showLostModel = !this.showLostModel;
      this.propsLostAppend = exceptionDetails;
      if (!this.showLostModel) {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
        this.lostOrStolenLoadInfo({ pagination: this.paginationControl1, filter: this.filter1 });
      }
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) this.addtnLeadInformation = leadDetails;
    }
  }
};
</script>

<style></style>
