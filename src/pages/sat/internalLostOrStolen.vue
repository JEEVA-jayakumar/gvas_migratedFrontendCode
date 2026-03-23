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

    <div class="q-pa-md">
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
          <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
            <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mobileNumber="props">
          <q-td :props="props">
            {{ props.row.leadInformation?.contactNumber || "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td :props="props">
            {{ props.row.leadInformation?.leadAddress || "NA" }}
          </q-td>
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
            <q-btn highlight push class="q-mx-sm" color="positive" size="sm" @click="lostStolenDevice(props.row)">Lost/Stolen</q-btn>
          </q-td>
        </template>
        <template v-slot:top>
          <div class="col-5">
            <q-input clearable v-model="filter" color="grey-9" placeholder="Type.." label="Search Using TID, MID, Lead ID, Merchant Name" class="q-mr-lg q-py-sm" />
          </div>
        </template>
      </q-table>

      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9 q-mt-lg">
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
          <q-td :props="props">
            {{ props.row.updatedAt ? $moment(props.row.updatedAt).format("Do MMM Y") : "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-Status="props">
          <q-td :props="props">
            <span class="label text-positive" v-if="props.row.regionalInventory?.deviceStatus == 8">Waiting for Approval</span>
            <span class="label text-amber" v-else-if="props.row.regionalInventory?.deviceStatus == 7">Submitted By SO</span>
            <span class="label text-purple" v-else-if="props.row.regionalInventory?.deviceStatus == 10">Rejected By Finance</span>
            <span v-else>NA</span>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <template v-if="props.row.regionalInventory?.deviceStatus == 8">
              <q-btn disable push color="purple-9" size="sm">Waiting for Approval</q-btn>
              <q-btn highlight push color="purple-9" size="sm" @click="lostStolenDevice(props.row)" class="q-ml-sm">Lost/Stolen</q-btn>
            </template>
            <template v-else-if="props.row.regionalInventory?.deviceStatus == 7">
              <q-btn disable push color="blue" size="sm">Submitted By SO</q-btn>
              <q-btn highlight push color="positive" size="sm" @click="lostStolenDevice(props.row)" class="q-ml-sm">Lost/Stolen</q-btn>
            </template>
            <template v-else-if="props.row.regionalInventory?.deviceStatus == 10">
              <q-btn disable push color="red" size="sm">Rejected By Finance</q-btn>
              <q-btn highlight push color="red" size="sm" @click="lostStolenDevice(props.row)" class="q-ml-sm">Lost/Stolen</q-btn>
            </template>
          </q-td>
        </template>
        <template v-slot:top>
          <div class="col-md-5">
            <q-input clearable color="grey-9" v-model="filter1" placeholder="Type.." label="Search Using TID, MID" class="q-mr-lg q-py-sm" />
          </div>
          <div class="col-md-6 text-right">
            <q-btn outline color="purple-9" label="Download as Excel" @click="downloadLostDatas" />
          </div>
        </template>
      </q-table>
    </div>

    <DownloadLostOrStolen v-if="propLostStolenDatas" :propLostStolenDatas="propLostStolenDatas" @emitfnshowLostOrStolen="downloadLostDatas" />
    <lostStolenDeviceComp v-if="showLostModel" :showLostModel="showLostModel" :propShowLostComponent="propsLostAppend" @closeLostModel="lostStolenDevice" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DownloadLostOrStolen from "../../components/sat/DownloadLostOrStolen.vue";
import lostStolenDeviceComp from "../../components/sat/lostStolenDeviceComp.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "internalLostOrStolen",
  components: {
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
      filter: "",
      filter1: "",
      paginationControl: { rowsNumber: 10, page: 1, sortBy: "tid", descending: false, rowsPerPage: 10 },
      paginationControl1: { rowsNumber: 10, page: 1, sortBy: "tid", descending: false, rowsPerPage: 10 },
      tableData: [],
      tableData1: [],
      columns: [
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", label: "Lead Id", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "leadInformation", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "leadAddress", label: "Merchant Address", align: "center", field: row => row.leadInformation?.leadAddress },
        { name: "deviceName", label: "Device type", align: "right", field: row => row.leadInformation?.device?.deviceName },
        { name: "device_serial_number", label: "Device Serial Number", align: "left", field: row => row.regionalInventory?.serialNumber || "NA" },
        { name: "deviceStatusDate", label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", label: "Implemented by", align: "left", field: row => row.assignedTo ? (row.assignedTo.name + " | " + row.assignedTo.employeeID) : "NA" },
        { name: "deviceAddress", label: "Implemented Address", align: "left", field: "deviceAddress" },
        { name: "mobileNumber", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber },
        { name: "action", label: "", align: "center", field: "action" }
      ],
      columns1: [
        { name: "leadName", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "Address", label: "Address", align: "left", field: row => row.leadInformation?.leadAddress },
        { name: "Device", label: "Device", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "updated_at", label: "Receive Date", align: "center", field: "updatedAt" },
        { name: "lostOrStolenRemarks", label: "Remarks", align: "left", field: row => row.regionalInventory?.lostOrStolenRemarks },
        { name: "Status", label: "Status", align: "left", field: row => row.regionalInventory?.deviceStatus },
        { name: "action", label: "", align: "left", field: "action" }
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
      this.toggleAjaxLoadFilter = true;
      this.MASTER_TRACKER_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getMasterTrackerList.totalElements;
        this.paginationControl.page = this.getMasterTrackerList.number + 1;
        this.tableData = this.getMasterTrackerList.content;
        this.toggleAjaxLoadFilter = false;
      }).catch(() => { this.toggleAjaxLoadFilter = false; });
    },
    lostOrStolenLoadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_ALL_LOST_DEVICES_DATAS({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getLostOrStolenDatas.totalElements;
        this.paginationControl1.page = this.getLostOrStolenDatas.number + 1;
        this.tableData1 = this.getLostOrStolenDatas.content;
        this.toggleAjaxLoadFilter1 = false;
      }).catch(() => { this.toggleAjaxLoadFilter1 = false; });
    },
    downloadLostDatas() { this.propLostStolenDatas = !this.propLostStolenDatas; },
    lostStolenDevice(details) {
      this.showLostModel = !this.showLostModel;
      this.propsLostAppend = details;
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    }
  }
};
</script>
