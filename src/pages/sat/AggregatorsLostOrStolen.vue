<template>
  <q-page>
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Lost/Stolen
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
        <q-td v-if="props.row" :props="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-mid="props">
        <q-td v-if="props.row" :props="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-leadNumber="props">
        <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
          <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-mobileNumber="props">
        <q-td v-if="props.row" :props="props">{{
          props.row.leadInformation == null ? "NA" : props.row.leadInformation.contactNumber
        }}</q-td>
      </template>
      <template v-slot:body-cell-leadAddress="props">
        <q-td v-if="props.row" :props="props">{{
          props.row.leadInformation == null ? "NA" : props.row.leadInformation.leadAddress
        }}</q-td>
      </template>
      <template v-slot:body-cell-lostOrStolenRemarks="props">
        <q-td v-if="props.row" :props="props">
          <span class="label">{{ props.row.lostOrStolenRemarks }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-deviceStatusDate="props">
        <q-td v-if="props.row" :props="props">
          <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td v-if="props.row" :props="props">
          <q-btn push class="q-mx-sm" color="positive" size="sm" @click="Aggregatorsloststolendevice(props.row)" label="Lost/Stolen" />
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
      Add Your Remarks
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
      <template v-slot:body-cell-updatedAt="props">
        <q-td v-if="props.row" :props="props">{{
          props.row.aggregatorRegionalInventory?.updatedAt == null ? "NA" :
          $moment(props.row.aggregatorRegionalInventory.updatedAt).format("Do MMM Y")
        }}</q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td v-if="props.row" :props="props">
          <q-btn v-if="props.row.aggregatorRegionalInventory?.deviceStatus == 8" disable push color="purple-9" size="sm" label="Waiting for Approval" />
          <q-btn v-else-if="props.row.aggregatorRegionalInventory?.deviceStatus == 7" disable color="blue" size="sm" label="Submitted By SO" />
          <q-btn v-else-if="props.row.aggregatorRegionalInventory?.deviceStatus == 10" disable color="red" size="sm" label="Rejected By Finance" />

          <q-btn v-if="props.row.aggregatorRegionalInventory?.deviceStatus == 10" push color="red" size="sm" @click="Aggregatorsloststolendevice(props.row)" label="Lost/Stolen" />
          <q-btn v-else-if="props.row.aggregatorRegionalInventory?.deviceStatus == 8" push color="purple-9" size="sm" @click="Aggregatorsloststolendevice(props.row)" label="Lost/Stolen" />
          <q-btn v-else-if="props.row.aggregatorRegionalInventory?.deviceStatus == 7" push class="q-mx-sm" color="positive" size="sm" @click="Aggregatorsloststolendevice(props.row)" label="Lost/Stolen" />
        </q-td>
      </template>
      <template v-slot:top>
        <div class="col-md-5">
          <q-input dense clearable color="grey-9" v-model="filter1" placeholder="Type.." label="Search Using TID, MID" class="q-mr-lg q-py-sm">
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

    <DownloadAggregatorsLostOrStolen v-if="propLostStolenDatas" :propLostStolenDatas="propLostStolenDatas" @emitfnshowLostOrStolen="downloadLostDatas" />
    <AggregatorsloststolendeviceComp v-if="showLostModel" :showLostModel="showLostModel" :propShowLostComponent="propsLostAppend" @closeLostModel="Aggregatorsloststolendevice" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DownloadAggregatorsLostOrStolen from "../../components/sat/DownloadAggregatorsLostOrStolen.vue";
import AggregatorsloststolendeviceComp from "../../components/sat/AggregatorsloststolendeviceComp.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "AggregatorsLostOrStolen",
  components: {
    AggregatorsloststolendeviceComp,
    generalLeadInformation,
    DownloadAggregatorsLostOrStolen
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
      filter: "",
      filter1: "",
      columns: [
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", required: true, label: "Lead Id", align: "left", field: row => row.leadInformation?.leadNumber, sortable: false },
        { name: "leadInformation", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName, sortable: false },
        { name: "leadAddress", required: true, label: "Merchant Address", align: "left", field: row => row.leadInformation?.leadAddress, sortable: false },
        { name: "deviceName", required: true, label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA", sortable: false },
        { name: "device_serial_number", required: true, label: "Device Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA", sortable: true },
        { name: "deviceStatusDate", required: true, label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", required: true, label: "Implemented by", align: "left", field: row => row.assignedTo ? (row.assignedTo.name + " | " + row.assignedTo.employeeID) : "NA", sortable: true },
        { name: "deviceAddress", required: true, label: "Implemented Address", align: "left", field: "deviceAddress", sortable: true },
        { name: "mobileNumber", required: true, label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber, sortable: false },
        { name: "action", required: true, label: "", align: "center", field: "action", sortable: false }
      ],
      columns1: [
        { name: "leadInformation.leadName", required: true, label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "Address", required: true, label: "Address", align: "left", field: row => row.leadInformation?.leadAddress, sortable: true },
        { name: "leadInformation.device.deviceName", required: true, label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "updatedAt", required: true, label: "Receive Date", align: "center", field: row => row.aggregatorRegionalInventory?.updatedAt },
        { name: "lostOrStolenRemarks", required: true, label: "Remarks", align: "left", field: row => row.aggregatorRegionalInventory?.lostOrStolenRemarks || "NA" },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters("MasterTracker", ["getAggregatorsMasterTrackerList"]),
    ...mapGetters("lostOrStolenDatas", ["getAggregatorsLostOrStolenDatas"]),
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
    this.lostOrStolenLoadInfo({ pagination: this.paginationControl1, filter: this.filter1 });
  },
  methods: {
    ...mapActions("MasterTracker", ["AGGREGATORS_MASTER_TRACKER_LIST"]),
    ...mapActions("lostOrStolenDatas", ["FETCH_AGGREGATORS_ALL_LOST_DEVICES_DATAS"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      return this.AGGREGATORS_MASTER_TRACKER_LIST({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getAggregatorsMasterTrackerList.totalElements;
          this.paginationControl.page = this.getAggregatorsMasterTrackerList.number + 1;
          this.tableData = this.getAggregatorsMasterTrackerList.content;
          this.$q.loading.hide();
        }).catch(() => { this.$q.loading.hide(); });
    },
    lostOrStolenLoadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      return this.FETCH_AGGREGATORS_ALL_LOST_DEVICES_DATAS({ pagination, filter })
        .then(res => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getAggregatorsLostOrStolenDatas.totalElements;
          this.paginationControl1.page = this.getAggregatorsLostOrStolenDatas.number + 1;
          this.tableData1 = this.getAggregatorsLostOrStolenDatas.content;
          this.$q.loading.hide();
        }).catch(() => { this.$q.loading.hide(); });
    },
    downloadLostDatas() { this.propLostStolenDatas = !this.propLostStolenDatas; },
    Aggregatorsloststolendevice(exceptionDetails) {
      this.showLostModel = !this.showLostModel;
      this.propsLostAppend = exceptionDetails;
      if (!this.showLostModel) {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
          this.lostOrStolenLoadInfo({ pagination: this.paginationControl1, filter: this.filter1 });
      }
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) { this.addtnLeadInformation = leadDetails; }
    }
  }
};
</script>
