<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md">
      <!-- Top Section: Stats Cards -->
      <div class="row q-col-gutter-md">
        <!-- Exception Card -->
        <div class="col-lg-4 col-md-6 col-sm-12">
          <q-card class="dashboard-card shadow-1">
            <q-card-section class="bg-purple-9 text-white q-pa-md">
              <div class="row items-center justify-center no-wrap">
                <div class="col-4 text-center border-right-white">
                  <div class="text-h4 text-weight-bolder">{{ exceptionCount.totalExceptionCount }}</div>
                </div>
                <div class="col-8 q-pl-md">
                  <div class="text-subtitle1 text-weight-light uppercase">Exception</div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-md bg-white">
              <div class="row text-center q-col-gutter-sm">
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">KYC Exception</div>
                  <q-chip clickable color="purple-9" text-color="white" @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)" class="shadow-1">
                    {{ exceptionCount.kycPendingCount }}
                  </q-chip>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">Bank Exception</div>
                  <q-chip clickable color="purple-9" text-color="white" @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)" class="shadow-1">
                    {{ exceptionCount.banksubventionPendingCount }}
                  </q-chip>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">Pricing Sub.</div>
                  <q-chip clickable color="purple-9" text-color="white" @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)" class="shadow-1">
                    {{ exceptionCount.pricingPendingCount }}
                  </q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Stock Inventory Card -->
        <div class="col-lg-4 col-md-6 col-sm-12">
          <q-card class="dashboard-card shadow-1">
            <q-card-section class="bg-purple-9 text-white q-pa-md">
              <div class="row items-center justify-center no-wrap">
                <div class="col-4 text-center border-right-white">
                  <div class="text-h4 text-weight-bolder">{{ regionalInventoryCount.totalDevice }}</div>
                </div>
                <div class="col-8 q-pl-md">
                  <div class="text-subtitle1 text-weight-light uppercase">Stock (Bijlipay)</div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-md bg-white">
              <div class="row text-center q-col-gutter-sm">
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">Allocated</div>
                  <q-chip color="purple-9" text-color="white" class="shadow-1">{{ regionalInventoryCount.allocatedDeviceCount }}</q-chip>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">Pending</div>
                  <q-chip color="purple-9" text-color="white" class="shadow-1">{{ regionalInventoryCount.pendingDeviceCount }}</q-chip>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">Damaged</div>
                  <q-chip color="negative" text-color="white" class="shadow-1">{{ regionalInventoryCount.damagedDeviceCount }}</q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Implementation Card -->
        <div class="col-lg-4 col-md-12 col-sm-12">
          <q-card class="dashboard-card shadow-1">
            <q-card-section class="bg-purple-9 text-white q-pa-md">
              <div class="row items-center justify-center no-wrap">
                <div class="col-4 text-center border-right-white">
                  <div class="text-h4 text-weight-bolder">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
                </div>
                <div class="col-8 q-pl-md">
                  <div class="text-subtitle1 text-weight-light uppercase">Implementation</div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-md bg-white">
              <div class="row text-center q-col-gutter-sm">
                <div class="col-6 border-right-grey">
                  <div class="text-caption text-grey-7 q-mb-xs">Assigned</div>
                  <div class="text-h6 text-weight-bold text-purple-9">{{ marsDeviceCount.assignedDeviceCount }}</div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-negative q-mb-xs">Unassigned</div>
                  <div class="text-h6 text-weight-bold text-negative">{{ marsDeviceCount.unassignedDeviceCount }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Aggregator Stock Card -->
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card class="dashboard-card shadow-1">
            <q-card-section class="bg-purple-9 text-white q-pa-md">
              <div class="row items-center justify-center no-wrap">
                <div class="col-4 text-center border-right-white">
                  <div class="text-h4 text-weight-bolder">{{ aggregatorCount.totalDevice }}</div>
                </div>
                <div class="col-8 q-pl-md">
                  <div class="text-subtitle1 text-weight-light uppercase">Stock Inventory (Aggregator)</div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-md bg-white">
              <div class="row text-center q-col-gutter-sm">
                <div class="col-4 border-right-grey">
                  <div class="text-caption text-grey-7 q-mb-xs">Pending</div>
                  <q-chip color="purple-9" text-color="white" class="shadow-1">{{ aggregatorCount.pendingDeviceCount }}</q-chip>
                </div>
                <div class="col-4 border-right-grey">
                  <div class="text-caption text-grey-7 q-mb-xs">Allocated</div>
                  <q-chip color="purple-9" text-color="white" class="shadow-1">{{ aggregatorCount.allocatedDeviceCount }}</q-chip>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7 q-mb-xs">Damaged</div>
                  <q-chip color="negative" text-color="white" class="shadow-1">{{ aggregatorCount.damagedDeviceCount }}</q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Service Request Section -->
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card class="dashboard-card shadow-1">
            <q-card-section class="bg-purple-9 text-white q-pa-md">
              <div class="row items-center justify-center no-wrap">
                <div class="col-auto text-center q-mr-lg">
                  <div class="text-h4 text-weight-bolder">{{ serviceRequestCount.total }}</div>
                </div>
                <div class="col-auto">
                  <div class="text-subtitle1 text-weight-light uppercase">Service Request</div>
                </div>
              </div>
            </q-card-section>
            <div class="row q-col-gutter-none bg-white">
              <div class="col-md-6 col-sm-12 border-right-grey">
                <div class="q-pa-md">
                  <div class="text-subtitle2 text-weight-bolder text-center q-mb-md text-purple-9">INTERNAL</div>
                  <div class="row text-center q-col-gutter-md">
                    <div class="col-4"><div class="text-caption text-grey-7">Closed</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.internal.closed || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">Assigned</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.internal.assigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">Unassigned</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.internal.unassigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">ReOpen-A</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.internal.ReOpenAssigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">ReOpen-U</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.internal.ReOpenedUnAssigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-weight-bold">Total</div><q-chip color="purple-9" text-color="white" dense>{{ serviceRequestCount.intTotal || 0 }}</q-chip></div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                <div class="q-pa-md">
                  <div class="text-subtitle2 text-weight-bolder text-center q-mb-md text-purple-9">EXTERNAL</div>
                  <div class="row text-center q-col-gutter-md">
                    <div class="col-4"><div class="text-caption text-grey-7">Closed</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.external.closed || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">Assigned</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.external.assigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">Unassigned</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.external.unassigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">ReOpen-A</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.external.ReOpenAssigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-grey-7">ReOpen-U</div><q-chip outline color="purple-9" dense>{{ serviceRequestCount.external.ReOpenedUnAssigned || 0 }}</q-chip></div>
                    <div class="col-4"><div class="text-caption text-weight-bold">Total</div><q-chip color="purple-9" text-color="white" dense>{{ serviceRequestCount.extTotal || 0 }}</q-chip></div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- Charts and Application Pending Section -->
      <div class="row q-col-gutter-md q-mt-md">
        <!-- Left: Charts -->
        <div class="col-lg-8 col-md-12 col-sm-12">
          <q-card class="tracker-wrapper shadow-1 q-mb-md bg-grey-2">
            <q-card-section class="q-pa-sm">
              <div class="text-subtitle2 text-weight-bold text-grey-9 q-ml-sm">Aging Tracker</div>
            </q-card-section>
            <q-card-section class="q-pa-md bg-white q-ma-sm shadow-1 rounded-borders">
              <chartSATagingTracker :options="{ responsive: false, maintainAspectRatio: false }" :height="150" class="full-width" />
            </q-card-section>
          </q-card>

          <q-card class="tracker-wrapper shadow-1 bg-grey-2">
            <q-card-section class="q-pa-sm">
              <div class="row items-center justify-between">
                <div class="text-subtitle2 text-weight-bold text-grey-9 q-ml-sm">Merchant Tracker</div>
                <div style="width: 120px">
                  <q-select dense outlined v-model="dateSelection" @update:model-value="changeMerchantTrackerData"
                    :options="[{ label: 'Days', value: 'DAYS' }, { label: 'Week', value: 'WEEK' }, { label: 'Month', value: 'MONTH' }, { label: 'Year', value: 'YEAR' }]"
                    emit-value map-options bg-color="white" />
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-md bg-white q-ma-sm shadow-1 rounded-borders">
              <chartMerchantTracker v-if="renderMerchantGraph" :borderWidth="1" :height="150"
                :merchantTrackerData="getSatDashboardGraphData" class="full-width" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Right: Application Pending and Table -->
        <div class="col-lg-4 col-md-12 col-sm-12">
          <q-card class="bg-orange text-white shadow-2 q-mb-md text-center border-radius-10 overflow-hidden">
            <q-card-section class="q-pa-md">
              <div class="text-h2 text-weight-bolder cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.totalApplicationPendingLeadIds)">
                {{ applicationPendingCount.totalApplicationPendingCount }}
              </div>
              <q-separator dark class="q-my-sm" inset />
              <div class="text-subtitle1 text-weight-light uppercase">Application Pending</div>
            </q-card-section>
            <div class="q-pa-sm bg-black-opacity-10">
              <div class="row q-col-gutter-xs">
                <div class="col-6"><q-card flat class="bg-negative q-pa-xs clickable" @click="retrieveLeadsList(applicationPendingCount.financeRejectLeadIds)"><div class="text-caption text-white">Fin Rejects</div><div class="text-h6 text-weight-bold text-white">{{ applicationPendingCount.financeRejectCount }}</div></q-card></div>
                <div class="col-6"><q-card flat class="bg-amber-9 q-pa-xs clickable" @click="retrieveLeadsList(applicationPendingCount.financePendingLeadIds)"><div class="text-caption text-white">Fin Pending</div><div class="text-h6 text-weight-bold text-white">{{ applicationPendingCount.financePendingCount }}</div></q-card></div>
                <div class="col-4"><q-card flat class="bg-blue-6 q-pa-xs clickable" @click="retrieveLeadsList(applicationPendingCount.wipLeadIds)"><div class="text-caption text-xs text-white">WIP</div><div class="text-weight-bold text-white">{{ applicationPendingCount.wipCount }}</div></q-card></div>
                <div class="col-4"><q-card flat class="bg-positive q-pa-xs clickable" @click="retrieveLeadsList(applicationPendingCount.withSatLeadIds)"><div class="text-caption text-xs text-white">New</div><div class="text-weight-bold text-white">{{ applicationPendingCount.withSatCount }}</div></q-card></div>
                <div class="col-4"><q-card flat class="bg-purple-9 q-pa-xs clickable" @click="retrieveLeadsList(applicationPendingCount.withOPSLeadIds)"><div class="text-caption text-xs text-white">Ops</div><div class="text-weight-bold text-white">{{ applicationPendingCount.withOPSHead }}</div></q-card></div>
              </div>
            </div>
          </q-card>

          <q-card class="dashboard-card shadow-1 overflow-hidden">
            <q-card-section class="bg-grey-1 q-pa-sm border-bottom-grey">
              <div class="text-subtitle2 text-weight-bold text-grey-9 uppercase">Aging Tracker - <span class="text-amber-9">Pending</span></div>
            </q-card-section>
            <q-card-section class="q-pa-none">
              <q-table dense hide-bottom :rows="agingTrackerPendingTableData" :columns="agingTrackerPendingColumns" v-model:pagination="paginationControl" row-key="name" flat>
                <template v-slot:body-cell-greaterThanOneDay="props">
                  <q-td :props="props" class="cursor-pointer text-purple-9 text-weight-bold" @click="retrieveLeadsList(props.row.greaterThanOneDayLeadIdList)">
                    {{ props.row.greaterThanOneDay }}
                  </q-td>
                </template>
                <template v-slot:body-cell-greaterThanTwoDays="props">
                  <q-td :props="props" class="cursor-pointer text-purple-9 text-weight-bold" @click="retrieveLeadsList(props.row.greaterThanTwoDaysLeadIdList)">
                    {{ props.row.greaterThanTwoDays }}
                  </q-td>
                </template>
                <template v-slot:body-cell-greaterThanFiveDays="props">
                  <q-td :props="props" class="cursor-pointer text-purple-9 text-weight-bold" @click="retrieveLeadsList(props.row.greaterThanFiveDaysLeadIdList)">
                    {{ props.row.greaterThanFiveDays }}
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <leadList v-if="dashboardAgingTrackerLeads" :propLeadInformation="rowDetails" :propToggleModal="dashboardAgingTrackerLeads" @closeLeadsList="retrieveLeadsList" />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import chartDailyVolume from "../../components/sat/chartDailyVolume.js";
import chartMerchantTracker from "../../components/sat/chartMerchantTracker.js";
import chartSATagingTracker from "../../components/sat/chartSATagingTracker.js";
import leadList from "../../components/sat/leadList.vue";

export default {
  name: "dashboardPhonepe",
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
      paginationControl: { rowsPerPage: 10 },
      exceptionCount: { banksubventionPendingCount: 0, kycPendingCount: 0, pricingPendingCount: 0, totalExceptionCount: 0, kycPendingLeadIds: [], banksubventionPendingLeadIds: [], pricingPendingLeadIds: [] },
      aggregatorCount: { totalDevice: 0, pendingDeviceCount: 0, damagedDeviceCount: 0, allocatedDeviceCount: 0 },
      regionalInventoryCount: { allocatedDeviceCount: 0, damagedDeviceCount: 0, pendingDeviceCount: 0, totalDevice: 0 },
      marsDeviceCount: { assignedDeviceCount: 0, totalMarsDeviceCount: 0, unassignedDeviceCount: 0 },
      serviceRequestCount: { external: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 }, internal: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 }, total: 0, intTotal: 0, extTotal: 0 },
      applicationPendingCount: { financePendingCount: 0, financeRejectCount: 0, wipCount: 0, withOPSHead: 0, totalApplicationPendingCount: 0, totalApplicationPendingLeadIds: [], financeRejectLeadIds: [], financePendingLeadIds: [], withSatCount: 0, withSatLeadIds: [], withOPSLeadIds: [], wipLeadIds: [] },
      agingTrackerPendingColumns: [
        { name: "name", label: "Stage", align: "left", field: "name" },
        { name: "greaterThanOneDay", label: ">1", align: "center", field: "greaterThanOneDay" },
        { name: "greaterThanTwoDays", label: ">2", align: "center", field: "greaterThanTwoDays" },
        { name: "greaterThanFiveDays", label: ">5", align: "center", field: "greaterThanFiveDays" }
      ],
      agingTrackerPendingTableData: []
    };
  },
  created() {
    this.fetchCountInformation();
    this.fetchServiceRequestCounts();
    this.changeMerchantTrackerData("DAYS");
    this.fetchAggregatorsCountInformation();
  },
  computed: {
    ...mapGetters("SAT_Dashboard", ["getSatDashboard", "getAggregatorsSatDashboard", "getSatAgingTrackerdata", "getSatDashboardGraphData"]),
    ...mapGetters("serviceRequestSat", ["getserviceRequestCountDatas"]),
    ...mapGetters("serviceRequestPhonepeSat", ["getserviceRequestPhonepeCountDatas"])
  },
  methods: {
    ...mapActions("SAT_Dashboard", ["FETCH_DASHBOARD_CHART_DATA", "FETCH_DASHBOARD_COUNT", "FETCH_AGGREGATORS_DASHBOARD_COUNT", "FETCH_SAT_AGING_TRACKER_DATA"]),
    ...mapActions("serviceRequestSat", ["FETCH_SERVICE_REQUEST_COUNT_DETAILS"]),
    ...mapActions("serviceRequestPhonepeSat", ["FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS"]),

    fetchCountInformation() {
      this.$q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Fetching data .." });
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (!userInfo) return;
      this.FETCH_DASHBOARD_COUNT(userInfo.region.id).then(() => {
        this.applicationPendingCount = this.getSatDashboard.applicationPendingCount;
        this.exceptionCount = this.getSatDashboard.exceptionCount;
        this.marsDeviceCount = this.getSatDashboard.marsDeviceCount;
        this.regionalInventoryCount = this.getSatDashboard.regionalInventoryCount;
        this.FETCH_SAT_AGING_TRACKER_DATA(userInfo.region.id).then(() => {
          this.agingTrackerPendingTableData = this.getSatAgingTrackerdata;
        });
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    fetchAggregatorsCountInformation() {
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (!userInfo) return;
      this.FETCH_AGGREGATORS_DASHBOARD_COUNT({ region: userInfo.region.id }).then(() => { this.aggregatorCount = this.getAggregatorsSatDashboard.regionalInventoryCount; });
    },
    async fetchServiceRequestCounts() {
      try {
        const [internalRes, externalRes] = await Promise.all([
          this.FETCH_SERVICE_REQUEST_COUNT_DETAILS(),
          this.FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS()
        ]);
        const internal = this.getserviceRequestCountDatas;
        const external = this.getserviceRequestPhonepeCountDatas;

        this.serviceRequestCount = {
          internal: internal,
          external: external,
          intTotal: internal.total || 0,
          extTotal: external.total || 0,
          total: (internal.total || 0) + (external.total || 0)
        };
      } catch (error) {
        console.error("Error fetching service request counts:", error);
      }
    },
    changeMerchantTrackerData(value) {
      this.renderMerchantGraph = false;
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (!userInfo) return;
      this.FETCH_DASHBOARD_CHART_DATA({ region: userInfo.region.id, action: value }).then(() => { this.renderMerchantGraph = true; }).catch(() => { this.renderMerchantGraph = false; });
    },
    retrieveLeadsList(props) {
      if (props && props.length > 0) {
        this.rowDetails = props;
        this.dashboardAgingTrackerLeads = true;
      } else if (props === undefined || props === null) {
        // Handle close event from leadList component
        this.dashboardAgingTrackerLeads = false;
      } else {
        this.$q.notify({ color: "amber-9", position: "bottom", message: "No lead available", icon: "info" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-card { border-radius: 10px; overflow: hidden; }
.tracker-wrapper { border-radius: 10px; overflow: hidden; }
.border-right-white { border-right: 1px solid rgba(255,255,255,0.3); }
.border-right-grey { border-right: 1px solid #e0e0e0; }
.border-bottom-grey { border-bottom: 1px solid #e0e0e0; }
.bg-black-opacity-10 { background: rgba(0, 0, 0, 0.1); }
.clickable { cursor: pointer; &:hover { opacity: 0.8; } }
.text-xs { font-size: 0.75rem; }
.full-width { width: 100% !important; }
.uppercase { text-transform: uppercase; }
</style>
