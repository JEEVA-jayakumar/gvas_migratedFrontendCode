<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl fade-up">
      <div>
        <h1 class="text-h4 text-weight-bold text-slate-900 q-ma-none">SAT Intelligence Dashboard</h1>
        <p class="text-subtitle1 text-slate-500 q-ma-none">Real-time operational tracking and analytics</p>
      </div>
      <div class="flex gap-md">
        <q-btn flat color="slate-600" icon="refresh" label="Refresh Metrics" @click="fetchCountInformation" no-caps class="premium-btn bg-white shadow-1" />
        <q-btn unelevated color="purple-9" icon="add" label="Create New Lead" to="/sat/lead/lead/dataentry" no-caps class="premium-btn-primary" />
      </div>
    </div>

    <!-- Top Stats Row -->
    <div class="row q-col-gutter-lg q-mb-lg fade-up" style="animation-delay: 0.1s">
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="kpi-card hover-lift clickable" @click="retrieveLeadsList(applicationPendingCount.totalApplicationPendingLeadIds)">
          <div class="flex justify-between items-start">
             <div>
               <div class="kpi-label">Pending Applications</div>
               <div class="kpi-value text-orange-9">{{ applicationPendingCount.totalApplicationPendingCount }}</div>
             </div>
             <q-icon name="pending_actions" size="32px" color="orange-8" class="bg-orange-1 q-pa-md rounded-16" />
          </div>
          <div class="q-mt-md text-caption text-slate-500 flex items-center">
            <q-icon name="trending_up" color="green" class="q-mr-xs" />
            Active operational queue
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="kpi-card hover-lift">
          <div class="flex justify-between items-start">
             <div>
               <div class="kpi-label">Exceptions Detected</div>
               <div class="kpi-value text-red-9">{{ exceptionCount.totalExceptionCount }}</div>
             </div>
             <q-icon name="report_problem" size="32px" color="red-8" class="bg-red-1 q-pa-md rounded-16" />
          </div>
          <div class="row q-gutter-x-sm q-mt-md">
            <q-badge rounded color="red-1" text-color="red-9" class="q-px-sm" :label="'KYC: ' + exceptionCount.kycPendingCount" />
            <q-badge rounded color="red-1" text-color="red-9" class="q-px-sm" :label="'Bank: ' + exceptionCount.banksubventionPendingCount" />
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="kpi-card hover-lift">
          <div class="flex justify-between items-start">
             <div>
               <div class="kpi-label">Inventory Level</div>
               <div class="kpi-value text-purple-9">{{ regionalInventoryCount.totalDevice }}</div>
             </div>
             <q-icon name="inventory_2" size="32px" color="purple-8" class="bg-purple-1 q-pa-md rounded-16" />
          </div>
          <div class="q-mt-md text-caption text-slate-500">
            <strong>{{ regionalInventoryCount.pendingDeviceCount }}</strong> units in transit
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="kpi-card hover-lift">
          <div class="flex justify-between items-start">
             <div>
               <div class="kpi-label">Mars Deployment</div>
               <div class="kpi-value text-blue-9">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
             </div>
             <q-icon name="rocket_launch" size="32px" color="blue-8" class="bg-blue-1 q-pa-md rounded-16" />
          </div>
          <div class="q-mt-md flex items-center" v-if="marsDeviceCount.unassignedDeviceCount > 0">
            <q-badge color="amber-1" text-color="amber-9" class="q-px-sm text-weight-bold">
              {{ marsDeviceCount.unassignedDeviceCount }} Unassigned
            </q-badge>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Bento Grid -->
    <div class="row q-col-gutter-lg fade-up" style="animation-delay: 0.2s">
      <!-- High-Impact Charts Column -->
      <div class="col-lg-8 col-md-12">
        <!-- Aging Tracker - The Primary Focus -->
        <q-card class="premium-card q-mb-lg no-border shadow-2 overflow-hidden">
          <div class="bg-white q-pa-lg border-bottom flex justify-between items-center">
            <div>
              <div class="text-h6 text-slate-900">Aging Analytics</div>
              <div class="text-caption text-slate-500">Processing lag across critical stages</div>
            </div>
            <q-icon name="analytics" color="slate-300" size="24px" />
          </div>
          <q-card-section class="bg-white q-pa-none" style="height: 350px">
            <chartSATagingTracker :options="{ responsive: true, maintainAspectRatio: false }" :height="350" class="q-pa-md" />
          </q-card-section>
        </q-card>

        <!-- Merchant Tracker & Service Requests -->
        <div class="row q-col-gutter-lg">
          <div class="col-md-7 col-sm-12">
            <q-card class="premium-card no-border shadow-2">
              <div class="bg-white q-pa-lg border-bottom flex justify-between items-center">
                <div>
                  <div class="text-h6 text-slate-900">Merchant Acquisition</div>
                  <div class="text-caption text-slate-500">New merchant onboarding trends</div>
                </div>
                <q-select
                  dense
                  outlined
                  v-model="dateSelection"
                  @update:model-value="changeMerchantTrackerData"
                  :options="[{ label: 'Days', value: 'DAYS' }, { label: 'Week', value: 'WEEK' }, { label: 'Month', value: 'MONTH' }, { label: 'Year', value: 'YEAR' }]"
                  emit-value
                  map-options
                  class="premium-select"
                />
              </div>
              <q-card-section class="bg-white" style="height: 250px">
                <chartMerchantTracker v-if="renderMerchantGraph" :borderWidth="2" :height="250"
                  :merchantTrackerData="getSatDashboardGraphData" />
                <div v-else class="flex flex-center full-height">
                  <q-spinner-dots color="purple-9" size="40px" />
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-5 col-sm-12">
             <q-card class="premium-card no-border shadow-2 full-height bg-purple-9 text-white">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 opacity-80">Service Summary</div>
                  <div class="text-h3 text-weight-bolder q-mt-md">{{ serviceRequestCount.total }}</div>
                  <div class="text-caption opacity-70">Total active requests</div>

                  <div class="q-mt-xl">
                    <div class="flex justify-between q-mb-sm">
                      <span class="opacity-80">Internal Ops</span>
                      <span class="text-weight-bold">{{ serviceRequestCount.intTotal }}</span>
                    </div>
                    <q-linear-progress :value="serviceRequestCount.intTotal / serviceRequestCount.total" color="white" class="q-mb-lg" />

                    <div class="flex justify-between q-mb-sm">
                      <span class="opacity-80">External Support</span>
                      <span class="text-weight-bold">{{ serviceRequestCount.extTotal }}</span>
                    </div>
                    <q-linear-progress :value="serviceRequestCount.extTotal / serviceRequestCount.total" color="white" />
                  </div>
                </q-card-section>
             </q-card>
          </div>
        </div>
      </div>

      <!-- Operational Controls Column -->
      <div class="col-lg-4 col-md-12">
        <!-- Operational Funnel -->
        <q-card class="premium-card q-mb-lg no-border shadow-2">
          <q-card-section class="q-pa-lg border-bottom">
            <div class="text-h6 text-slate-900">Operational Funnel</div>
            <div class="text-caption text-slate-500">Quick access to pending queues</div>
          </q-card-section>
          <q-card-section class="q-pa-lg">
            <div class="funnel-list">
              <div class="funnel-row clickable" @click="retrieveLeadsList(applicationPendingCount.financeRejectLeadIds)">
                <div class="row items-center full-width">
                  <div class="col-auto"><q-avatar icon="close" color="red-1" text-color="red-9" size="40px" /></div>
                  <div class="col q-px-md">
                    <div class="text-weight-bold text-slate-700">Finance Reject</div>
                    <div class="text-caption text-slate-400">Requires immediate review</div>
                  </div>
                  <div class="col-auto text-h6 text-weight-bold text-red-9">{{ applicationPendingCount.financeRejectCount }}</div>
                </div>
              </div>
              <div class="funnel-row clickable" @click="retrieveLeadsList(applicationPendingCount.financePendingLeadIds)">
                <div class="row items-center full-width">
                  <div class="col-auto"><q-avatar icon="hourglass_empty" color="amber-1" text-color="amber-9" size="40px" /></div>
                  <div class="col q-px-md">
                    <div class="text-weight-bold text-slate-700">Finance Pending</div>
                    <div class="text-caption text-slate-400">Awaiting verification</div>
                  </div>
                  <div class="col-auto text-h6 text-weight-bold text-amber-9">{{ applicationPendingCount.financePendingCount }}</div>
                </div>
              </div>
              <div class="funnel-row clickable" @click="retrieveLeadsList(applicationPendingCount.wipLeadIds)">
                <div class="row items-center full-width">
                  <div class="col-auto"><q-avatar icon="sync" color="blue-1" text-color="blue-9" size="40px" /></div>
                  <div class="col q-px-md">
                    <div class="text-weight-bold text-slate-700">Work in Progress</div>
                    <div class="text-caption text-slate-400">Active processing</div>
                  </div>
                  <div class="col-auto text-h6 text-weight-bold text-blue-9">{{ applicationPendingCount.wipCount }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Threshold Table -->
        <q-card class="premium-card no-border shadow-2">
          <q-card-section class="q-pa-lg border-bottom">
            <div class="text-h6 text-slate-900">Aging Thresholds</div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-table
              dense
              hide-bottom
              flat
              :rows="agingTrackerPendingTableData"
              :columns="agingTrackerPendingColumns"
              row-key="name"
              class="premium-table no-border"
            >
              <template v-slot:body-cell="props">
                <q-td :props="props" v-if="props.col.name !== 'name'"
                  class="cursor-pointer text-weight-bold"
                  :class="props.value > 0 ? 'text-purple-9 bg-purple-1' : 'text-slate-300'"
                  @click="props.value > 0 ? retrieveLeadsList(props.row[props.col.name + 'LeadIdList']) : null"
                >
                  {{ props.value }}
                </q-td>
                <q-td v-else :props="props" class="text-slate-600 font-medium">
                  {{ props.value }}
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lead Information Popup -->
    <leadList v-if="dashboardAgingTrackerLeads" :propLeadInformation="rowDetails"
      :propToggleModal="dashboardAgingTrackerLeads" @closeLeadsList="retrieveLeadsList" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import chartDailyVolume from "../../components/sat/chartDailyVolume.js";
import chartMerchantTracker from "../../components/sat/chartMerchantTracker.js";
import chartSATagingTracker from "../../components/sat/chartSATagingTracker.js";
import leadList from "../../components/sat/leadList.vue";

export default {
  name: "dashoboard",
  components: {
    leadList,
    chartDailyVolume,
    chartSATagingTracker,
    chartMerchantTracker
  },
  data() {
    return {
      dateSelection: "DAYS",
      renderMerchantGraph: true,
      dashboardAgingTrackerLeads: false,
      rowDetails: {},
      exceptionCount: {
        banksubventionPendingCount: 0,
        kycPendingCount: 0,
        totalExceptionCount: 0
      },
      marsDeviceCount: {
        totalMarsDeviceCount: 0,
        unassignedDeviceCount: 0
      },
      regionalInventoryCount: {
        totalDevice: 0,
        pendingDeviceCount: 0
      },
      serviceRequestCount: {
        total: 0, intTotal: 0, extTotal: 0
      },
      applicationPendingCount: {
        financePendingCount: 0, financeRejectCount: 0, wipCount: 0, withOPSHead: 0,
        totalApplicationPendingCount: 0, totalApplicationPendingLeadIds: []
      },
      agingTrackerPendingColumns: [
        { name: "name", label: "Stage", align: "left", field: "name" },
        { name: "greaterThanOneDay", label: ">1d", align: "center", field: "greaterThanOneDay" },
        { name: "greaterThanTwoDays", label: ">2d", align: "center", field: "greaterThanTwoDays" },
        { name: "greaterThanFiveDays", label: ">5d", align: "center", field: "greaterThanFiveDays" }
      ],
      agingTrackerPendingTableData: []
    };
  },
  created() {
    this.fetchCountInformation();
    this.fetchServiceRequestCounts();
    this.changeMerchantTrackerData("DAYS");
  },
  computed: {
    ...mapGetters("SAT_Dashboard", ["getSatDashboard", "getSatAgingTrackerdata", "getSatDashboardGraphData"]),
    ...mapGetters("serviceRequestSat", ["getserviceRequestCountDatas"]),
    ...mapGetters("serviceRequestPhonepeSat", ["getserviceRequestPhonepeCountDatas"])
  },
  methods: {
    ...mapActions("SAT_Dashboard", ["FETCH_DASHBOARD_CHART_DATA", "FETCH_DASHBOARD_COUNT", "FETCH_SAT_AGING_TRACKER_DATA"]),
    ...mapActions("serviceRequestSat", ["FETCH_SERVICE_REQUEST_COUNT_DETAILS"]),
    ...mapActions("serviceRequestPhonepeSat", ["FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS"]),

    fetchCountInformation() {
      const regionId = JSON.parse(localStorage.getItem("u_i")).region.id;
      this.FETCH_DASHBOARD_COUNT(regionId).then(() => {
        this.applicationPendingCount = this.getSatDashboard.applicationPendingCount;
        this.exceptionCount = this.getSatDashboard.exceptionCount;
        this.marsDeviceCount = this.getSatDashboard.marsDeviceCount;
        this.regionalInventoryCount = this.getSatDashboard.regionalInventoryCount;
        this.FETCH_SAT_AGING_TRACKER_DATA(regionId).then(() => {
          this.agingTrackerPendingTableData = this.getSatAgingTrackerdata;
        });
      });
    },
    fetchServiceRequestCounts() {
      this.FETCH_SERVICE_REQUEST_COUNT_DETAILS().then(() => {
        this.serviceRequestCount = this.getserviceRequestCountDatas;
      });
      this.FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS().then(() => {
        this.serviceRequestCount = this.getserviceRequestPhonepeCountDatas;
      });
    },
    changeMerchantTrackerData(value) {
      this.renderMerchantGraph = false;
      this.FETCH_DASHBOARD_CHART_DATA({
        region: JSON.parse(localStorage.getItem("u_i")).region.id,
        action: value
      }).then(() => { this.renderMerchantGraph = true; });
    },
    retrieveLeadsList(props) {
      if (props && props.length > 0) {
        this.rowDetails = props;
        this.dashboardAgingTrackerLeads = true;
      } else {
        this.$q.notify({ color: "amber-9", message: "No leads available in this category", icon: "info" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rounded-16 { border-radius: 16px; }
.bg-orange-1 { background-color: #fff7ed; }
.bg-red-1 { background-color: #fef2f2; }
.bg-purple-1 { background-color: #faf5ff; }
.bg-blue-1 { background-color: #eff6ff; }
.border-bottom { border-bottom: 1px solid #f1f5f9; }

.funnel-list {
  .funnel-row {
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;

    &:hover {
      background: #f8fafc;
      transform: translateX(4px);
    }

    &:last-child { margin-bottom: 0; }
  }
}

.premium-select {
  width: 120px;
  ::v-deep(.q-field__control) {
    border-radius: 10px !important;
    height: 40px;
    min-height: 40px;
  }
}

.premium-btn {
  border-radius: 10px !important;
  font-weight: 600;
}
</style>
