<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-container shadow-1 bg-white border-radius-16 overflow-hidden">
      <!-- Header with Breadcrumbs and Persistent Filter -->
      <div class="q-pa-lg border-bottom">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-overline text-purple-9 text-weight-bold">SAT Module</div>
            <h1 class="text-h5 text-weight-bold text-slate-900 q-ma-none">Master Tracker - Implemented</h1>
          </div>
          <div class="flex gap-sm">
             <q-btn
              unelevated
              color="purple-9"
              icon="file_download"
              label="Export to Excel"
              class="premium-btn"
              @click="downloadmastertrackerlist()"
            />
          </div>
        </div>

        <!-- Persistent Top-Bar Filter -->
        <div class="row q-col-gutter-md items-center q-mt-sm">
          <div class="col-md-6 col-sm-12">
            <q-input
              clearable
              v-model="filter"
              outlined
              placeholder="Search by MID, TID, or Merchant Name..."
              class="premium-search"
              dense
              bg-color="slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="slate-400" />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn flat color="slate-500" icon="filter_list" label="Advanced Filters" class="q-px-md" />
          </div>
        </div>
      </div>

      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Premium Intelligent Table -->
      <q-table
        flat
        class="premium-table sticky-header-table"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[10, 20, 50]"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Custom Loading State: Skeleton Skeletons -->
        <template v-slot:loading>
          <q-inner-loading showing color="purple-9">
            <div class="full-width q-pa-md">
              <div v-for="i in 5" :key="i" class="row q-mb-md q-col-gutter-md">
                <div v-for="j in 8" :key="j" class="col">
                  <div class="skeleton-box" style="width: 100%; height: 20px;"></div>
                </div>
              </div>
            </div>
          </q-inner-loading>
        </template>

        <template v-slot:body-cell-tid="props">
          <q-td :props="props" v-if="props && props.row">
            <div class="text-weight-bold text-slate-900">{{props.row.tid}}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-mid="props">
          <q-td :props="props" v-if="props && props.row">
            <div class="text-slate-600">{{props.row.mid}}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <q-td v-if="props.row" :props="props">
            <q-btn
              flat
              dense
              no-caps
              color="purple-9"
              class="text-weight-bold"
              @click="toggleLeadInformation(props.row.leadInformation)"
            >
              # {{props.row.leadInformation.leadNumber}}
            </q-btn>
          </q-td>
          <q-td v-else :props="props">NA</q-td>
        </template>

        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td :props="props" v-if="props && props.row">
            <div class="flex items-center">
              <q-icon name="calendar_today" size="xs" color="slate-400" class="q-mr-xs" />
              <span>{{ $moment(props.row.deviceStatusDate).format("DD MMM YYYY") }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-leadInformation="props">
          <q-td :props="props">
            <div class="text-weight-medium text-slate-900">
               {{ props.row.leadInformation ? props.row.leadInformation.leadName : 'NA' }}
            </div>
          </q-td>
        </template>

        <!-- Empty State -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-xl text-slate-400">
            <q-icon name="search_off" size="48px" />
            <div class="q-ml-md text-h6">No records found matching your criteria</div>
          </div>
        </template>

        <!-- Premium Pagination -->
        <template v-slot:bottom="scope">
          <div class="full-width flex justify-between items-center q-pa-md border-top">
            <div class="text-slate-500 text-caption">
              Showing {{ scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1 }} to {{ Math.min(scope.pagination.rowsPerPage * scope.pagination.page, scope.pagination.rowsNumber) }} of {{ scope.pagination.rowsNumber }} records
            </div>
            <div class="flex gap-sm">
              <q-btn
                icon="chevron_left"
                color="slate-600"
                round
                flat
                dense
                :disable="scope.isFirstPage"
                @click="scope.prevPage"
              />
              <div class="flex items-center q-px-md text-weight-bold text-slate-700">
                Page {{ scope.pagination.page }}
              </div>
              <q-btn
                icon="chevron_right"
                color="slate-600"
                round
                flat
                dense
                :disable="scope.isLastPage"
                @click="scope.nextPage"
              />
            </div>
          </div>
        </template>
      </q-table>

      <DownloadMasterTracker
        v-if="propMasterTrackerList"
        :propMasterTrackerList="propMasterTrackerList" 
        @emitfnshowMasterTrackerList="downloadmastertrackerlist"
      />
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      ></showMerchantTransactionLevelDetails>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import DownloadMasterTracker from "../../components/sat/DownloadMasterTracker.vue";

export default {
  name: "masterTracker",
  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    DownloadMasterTracker,
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propMasterTrackerList: false,
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
      valueToggleMerchantTransaction: false,
      filter: "",
      columns: [
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", label: "Lead Id", align: "left", field: row => row.leadInformation ? row.leadInformation.leadNumber : 'NA', sortable: false },
        { name: "leadInformation", label: "ME Name", align: "left", field: row => row.leadInformation ? row.leadInformation.leadName : 'NA', sortable: false },
        { name: "deviceName", label: "Device type", align: "left", field: row => row.leadInformation && row.leadInformation.device ? row.leadInformation.device.deviceName : 'NA', sortable: false },
        { name: "device_serial_number", label: "Serial Number", align: "left", field: row => row.regionalInventory == null ? "NA" : row.regionalInventory.serialNumber, sortable: true },
        { name: "deviceStatusDate", label: "Implemented On", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", label: "Implemented By", align: "left", field: row => row.assignedTo == null ? "NA" : row.assignedTo.name, sortable: true },
      ]
    };
  },
  computed: {
    ...mapGetters("MasterTracker", ["getMasterTrackerList"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("MasterTracker", ["MASTER_TRACKER_LIST"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true;
      this.MASTER_TRACKER_LIST({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getMasterTrackerList.totalElements;
          this.paginationControl.page = this.getMasterTrackerList.number + 1;
          this.tableData = this.getMasterTrackerList.content;
          if (this.getMasterTrackerList.sort != null) {
            this.paginationControl.sortBy = this.getMasterTrackerList.sort[0].property;
            this.paginationControl.descending = this.getMasterTrackerList.sort[0].ascending;
          }
          this.toggleAjaxLoadFilter = false;
        })
        .catch(() => {
          this.toggleAjaxLoadFilter = false;
        });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    downloadmastertrackerlist(){
      this.propMasterTrackerList=!this.propMasterTrackerList;
    }
  }
};
</script>

<style lang="scss" scoped>
.premium-container {
  border: 1px solid #e2e8f0;
}

.border-bottom { border-bottom: 1px solid #f1f5f9; }
.border-top { border-top: 1px solid #f1f5f9; }

.premium-btn {
  border-radius: 10px !important;
  font-weight: 600;
  padding: 8px 16px;
}

.premium-search {
  ::v-deep(.q-field__control) {
    border-radius: 10px !important;
    &:hover { background: #fff !important; }
  }
}

.premium-table {
  ::v-deep(.q-table__top) { display: none; }

  ::v-deep(thead tr th) {
    background: #f8fafc;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    padding: 16px !important;
  }

  ::v-deep(tbody tr) {
    transition: background 0.2s ease;
    &:hover { background: #fafafa !important; }
    td { padding: 16px !important; border-bottom: 1px solid #f8fafc; }
  }
}

.border-radius-16 { border-radius: 16px; }
.text-slate-900 { color: #0f172a; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc; }
.gap-sm { gap: 8px; }
</style>
