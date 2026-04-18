<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-card shadow-1 bg-white border-radius-16 overflow-hidden fade-up">
      <q-pull-to-refresh :distance="30" @refresh="PullToRefresh">
        <generalLeadInformation
          v-if="propToggleLeadInformation"
          :leadInformation="addtnLeadInformation"
          :propToggleLeadInformationPop="propToggleLeadInformation"
          @closeLeadInformation="toggleLeadInformation"
        />

        <!-- Premium Header Section -->
        <div class="q-pa-lg border-bottom bg-white">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-overline text-purple-9 text-weight-bold">SAT Intelligence</div>
              <h1 class="text-h5 text-weight-bold text-slate-900 q-ma-none">Open Merchant Tracker</h1>
            </div>
            <div class="flex gap-sm">
               <q-btn flat color="slate-600" icon="refresh" @click="PullToRefresh()" class="premium-btn" />
            </div>
          </div>

          <!-- Search Bar -->
          <div class="row q-col-gutter-md items-center">
            <div class="col-md-5 col-sm-12">
              <q-input
                dense
                clearable
                v-model="filter"
                outlined
                placeholder="Search by Merchant Name, Lead ID..."
                class="premium-search"
                bg-color="slate-50"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="slate-400" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <!-- Premium Table -->
        <q-table
          flat
          class="premium-table sticky-header-table"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="id"
          :loading="toggleAjaxLoadFilter"
        >
          <!-- Loading Template -->
          <template v-slot:loading>
            <q-inner-loading showing color="purple-9">
              <q-spinner-dots size="40px" />
            </q-inner-loading>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              <div class="text-slate-500">{{ $moment(props.row.createdAt).format("DD MMM YYYY") }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-submitteSATDate="props">
            <q-td :props="props">
              <div class="text-slate-500">{{ $moment(props.row.submitteSATDate).format("DD MMM YYYY") }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-leadNumber="props">
            <q-td class="cursor-pointer" @click="toggleLeadInformation(props.row)" :props="props">
              <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold q-pa-xs">
                # {{ props.row.leadNumber }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-leadName="props">
            <q-td :props="props">
              <div class="text-weight-bold text-slate-900">{{ props.row.leadName }}</div>
              <div class="text-caption text-slate-400">{{ props.row.applicationNumber || 'No App #' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <div class="text-slate-600 font-medium">{{ props.row.createdBy ? props.row.createdBy.name : 'NA' }}</div>
              <div class="text-caption text-slate-400">{{ props.row.createdBy ? props.row.createdBy.employeeID : '' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-verifiedStatus="props">
            <q-td :props="props">
              <q-badge
                rounded
                :color="props.row.verifiedStatus === 'Approved' ? 'green-1' : (props.row.verifiedStatus === 'Rejected' ? 'red-1' : 'amber-1')"
                :text-color="props.row.verifiedStatus === 'Approved' ? 'green-9' : (props.row.verifiedStatus === 'Rejected' ? 'red-9' : 'amber-9')"
                :label="props.row.verifiedStatus"
                class="q-px-sm"
              />
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width q-pa-xl text-center text-slate-400">
               <q-icon name="manage_search" size="64px" class="opacity-20 q-mb-md" />
               <div class="text-h6 opacity-50">No open merchant records found</div>
            </div>
          </template>
        </q-table>
      </q-pull-to-refresh>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "openMerchantTracker",
  components: {
    generalLeadInformation
  },
  data: () => ({
    propToggleLeadInformation: false,
    addtnLeadInformation: null,
    toggleAjaxLoadFilter: false,
    paginationControl: {
      rowsPerPage: 10,
      page: 1,
      rowsNumber: 0
    },
    filter: "",
    columns: [
      { name: "createdAt", label: "Created Date", align: "left", field: "createdAt", sortable: true },
      { name: "submitteSATDate", label: "Submitted Date", align: "left", field: "submitteSATDate", sortable: true },
      { name: "leadNumber", label: "Lead ID", align: "left", field: "leadNumber", sortable: true },
      { name: "leadName", label: "Merchant Info", align: "left", field: "leadName", sortable: false },
      { name: "leadAddress", label: "Location", align: "left", field: "leadAddress", sortable: false },
      { name: "createdBy", label: "Sales Officer", align: "left", field: "createdBy", sortable: false },
      { name: "verifiedStatus", label: "Status", align: "left", field: "verifiedStatus", sortable: false }
    ],
    tableData: [],
  }),
  created() {
    this.ajaLoadDataAllopenAggMerchantTrackerData();
  },
  computed: {
    ...mapGetters("OpenMerchantTracker", ["getAggOpenMerchantTracker"]),
  },
  methods: {
    ...mapActions("OpenMerchantTracker", ["FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA"]),
    ajaLoadDataAllopenAggMerchantTrackerData() {
      this.toggleAjaxLoadFilter = true;
      this.FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA()
        .then(() => {
          this.tableData = this.getAggOpenMerchantTracker;
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
    PullToRefresh(done) {
      this.FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA()
        .then(() => {
          this.tableData = this.getAggOpenMerchantTracker;
          if (done) done();
        })
        .catch(() => {
          if (done) done();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.border-bottom { border-bottom: 1px solid #f1f5f9; }
.premium-btn { border-radius: 10px !important; font-weight: 600; }
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
    padding: 16px !important;
  }
}
.bg-purple-1 { background-color: #faf5ff; }
.opacity-20 { opacity: 0.2; }
.opacity-50 { opacity: 0.5; }
</style>
