<template>
  <q-page>
    <div>
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Aggregator Master Tracker-Implemented</div>
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
        :rows-per-page-options="[5,10,15,20,25]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-tid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{props.row.tid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{props.row.mid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadNumber="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            <span class="label text-primary"># {{props.row.leadInformation?.leadNumber}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mobileNumber="props">
          <q-td :props="props">
            {{props.row.leadInformation == null? 'NA':props.row.leadInformation.contactNumber}}
          </q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td :props="props">
            {{props.row.leadInformation == null? 'NA':props.row.leadInformation.leadAddress}}
          </q-td>
        </template>
        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td :props="props">
            <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
          </q-td>
        </template>
        <template v-slot:top>
          <div class="col-5">
            <q-input
              dense
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search by MID, TID, Merchant Name"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6">
            <q-btn
              square 
              outline 
              color="purple-9" 
              label="Download as Excel" 
              class="q-mr-lg q-py-sm float-right" 
              size="md" 
              @click="downloadAggrmastertrackerlist()" />
          </div>
        </template>
      </q-table>
      <DownloadAggrMasterTracker
        v-if="propAggrMasterTrackerList"
        :propAggrMasterTrackerList="propAggrMasterTrackerList"
        @emitfnshowAggrMasterTrackerList="downloadAggrmastertrackerlist"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import DownloadAggrMasterTracker from "../../components/sat/DownloadAggrMasterTracker.vue";

export default {
  name: "AggregatorMasterTracker",
  components: {
    generalLeadInformation,
    DownloadAggrMasterTracker,
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propAggrMasterTrackerList: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "tid",
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      filter: "",
      columns: [
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: "tid",
          sortable: true
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: "mid",
          sortable: true
        },
        {
          name: "leadNumber",
          required: true,
          label: "Lead Id",
          align: "left",
          field: row => row.leadInformation?.leadNumber,
          sortable: false
        },
        {
          name: "leadInformation",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.leadInformation?.leadName,
          sortable: false
        },
        {
          name: "leadAddress",
          required: true,
          label: "Merchant Address",
          align: "left",
          field: row => row.leadInformation?.leadAddress,
          sortable: false
        },
        {
          name: "deviceName",
          required: true,
          label: "Device type",
          align: "left",
          field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA",
          sortable: false
        },
        {
          name: "device_serial_number",
          required: true,
          label: "Device Serial Number",
          align: "left",
          field: (row) => row.aggregatorRegionalInventory?.serialNumber || "NA",
          sortable: true
        },
        {
          name: "deviceStatusDate",
          required: true,
          label: "Implementation Date",
          align: "left",
          field: "deviceStatusDate",
          sortable: true
        },
        {
          name: "assignedTo",
          required: true,
          label: "Implemented by",
          align: "left",
          field: row => row.assignedTo ? (row.assignedTo.name + " | " + row.assignedTo.employeeID) : "NA",
          sortable: true
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Implemented Address",
          align: "left",
          field: "deviceAddress",
          sortable: true
        },
        {
          name: "mobileNumber",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: row => row.leadInformation?.contactNumber,
          sortable: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters("MasterTracker", ["getAggregatorsMasterTrackerList"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("MasterTracker", ["AGGREGATORS_MASTER_TRACKER_LIST"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.AGGREGATORS_MASTER_TRACKER_LIST({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getAggregatorsMasterTrackerList.totalElements;
          this.paginationControl.page = this.getAggregatorsMasterTrackerList.number + 1;
          this.tableData = this.getAggregatorsMasterTrackerList.content;
          if (this.getAggregatorsMasterTrackerList.sort != null) {
            this.paginationControl.sortBy = this.getAggregatorsMasterTrackerList.sort[0].property;
            this.paginationControl.descending = !this.getAggregatorsMasterTrackerList.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    downloadAggrmastertrackerlist(){
      this.propAggrMasterTrackerList=!this.propAggrMasterTrackerList;
    }
  }
};
</script>

<style>
</style>
