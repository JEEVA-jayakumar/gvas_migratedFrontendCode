<template>
  <q-page>
    <div class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <!-- Top Stats Row -->
        <div class="col-lg-8 col-md-12 col-sm-12">
          <div class="row q-col-gutter-sm items-stretch">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <q-card class="border-radius-10 bg-purple-9 text-white shadow-2">
                <q-card-section class="q-pa-sm text-center">
                  <div class="row items-center justify-center no-wrap">
                    <div class="col-auto">
                      <div class="text-h4 text-weight-bolder">{{ exceptionCount.totalExceptionCount }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-sm gt-xs" />
                    <div class="col">
                      <div class="text-subtitle2 text-weight-light">Exception</div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-none bg-white text-grey-10">
                  <div class="row items-center text-center no-wrap border-top-grey" style="min-height:65px">
                    <div class="col-4 q-px-xs border-right-grey">
                      <div class="text-caption text-weight-medium">KYC</div>
                      <q-chip dense clickable @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)"
                        class="bg-purple-9 text-white q-mt-xs">{{ exceptionCount.kycPendingCount }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs border-right-grey">
                      <div class="text-caption text-weight-medium">Bank</div>
                      <q-chip dense clickable
                        @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)" class="bg-purple-9 text-white q-mt-xs">{{
                          exceptionCount.banksubventionPendingCount
                        }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs">
                      <div class="text-caption text-weight-medium">Pricing</div>
                      <q-chip dense clickable @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)"
                        class="bg-purple-9 text-white q-mt-xs">{{ exceptionCount.pricingPendingCount }}</q-chip>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-lg-4 col-md-6 col-sm-12">
              <q-card class="border-radius-10 bg-purple-9 text-white shadow-2">
                <q-card-section class="q-pa-sm text-center">
                  <div class="row items-center justify-center no-wrap">
                    <div class="col-auto">
                      <div class="text-h4 text-weight-bolder">{{ regionalInventoryCount.totalDevice }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-sm gt-xs" />
                    <div class="col">
                      <div class="text-subtitle2 text-weight-light">Stock (Bijlipay)</div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-none bg-white text-grey-10">
                  <div class="row items-center text-center no-wrap border-top-grey" style="min-height:65px">
                    <div class="col-4 q-px-xs border-right-grey">
                      <div class="text-caption text-weight-medium">Allocated</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ regionalInventoryCount.allocatedDeviceCount }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs border-right-grey">
                      <div class="text-caption text-weight-medium">Pending</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ regionalInventoryCount.pendingDeviceCount }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs">
                      <div class="text-caption text-weight-medium">Damaged</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ regionalInventoryCount.damagedDeviceCount }}</q-chip>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-lg-4 col-md-12 col-sm-12">
              <q-card class="border-radius-10 bg-purple-9 text-white shadow-2">
                <q-card-section class="q-pa-sm text-center">
                  <div class="row items-center justify-center no-wrap">
                    <div class="col-auto">
                      <div class="text-h4 text-weight-bolder">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-sm gt-xs" />
                    <div class="col">
                      <div class="text-subtitle2 text-weight-light">Implementation</div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-none bg-white text-grey-10">
                  <div class="row items-center text-center no-wrap border-top-grey" style="min-height:65px">
                    <div class="col-6 q-px-xs border-right-grey">
                      <div class="text-caption">Assigned</div>
                      <div class="text-h6 text-weight-bold">{{ marsDeviceCount.assignedDeviceCount }}</div>
                    </div>
                    <div class="col-6 q-px-xs">
                      <div class="text-caption text-negative">Unassigned</div>
                      <div class="text-h6 text-weight-bold text-negative">{{ marsDeviceCount.unassignedDeviceCount }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Aggregator Stock Card -->
          <q-card class="q-mt-sm border-radius-10 shadow-2 overflow-hidden">
            <q-card-section class="bg-purple-9 text-white q-pa-sm text-center">
              <div class="row items-center justify-center no-wrap">
                <div class="col-auto">
                  <div class="text-h4 text-weight-bolder">{{ aggregatorCount.totalDevice }}</div>
                </div>
                <q-separator vertical dark class="q-mx-sm gt-xs" />
                <div class="col">
                  <div class="text-subtitle2 text-weight-light">Stock Inventory (Aggregator)</div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-none bg-grey-1 text-grey-10">
              <div class="row items-center text-center no-wrap" style="min-height:65px">
                <div class="col-4 q-px-xs border-right-grey">
                  <div class="text-caption">Pending</div>
                  <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ aggregatorCount.pendingDeviceCount }}</q-chip>
                </div>
                <div class="col-4 q-px-xs border-right-grey">
                  <div class="text-caption">Allocated</div>
                  <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ aggregatorCount.allocatedDeviceCount }}</q-chip>
                </div>
                <div class="col-4 q-px-xs">
                  <div class="text-caption">Damaged</div>
                  <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ aggregatorCount.damagedDeviceCount }}</q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <div class="row q-mt-sm">
            <div class="col-12">
              <q-card class="border-radius-10 shadow-2 overflow-hidden">
                <q-card-section class="bg-purple-9 text-white q-pa-sm text-center">
                  <div class="row items-center justify-center no-wrap">
                    <div class="col-auto">
                      <div class="text-h4 text-weight-bolder">{{ serviceRequestCount.total }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-sm gt-xs" />
                    <div class="col">
                      <div class="text-subtitle2 text-weight-light">Service Request</div>
                    </div>
                  </div>
                </q-card-section>

                <div class="row q-col-gutter-none">
                  <div class="col-lg-6 col-md-6 col-sm-12 border-right-grey">
                    <div class="text-center q-pa-sm">
                      <div class="text-weight-bolder text-purple-9 q-mb-xs">INTERNAL</div>
                      <div class="row text-center justify-center q-col-gutter-xs">
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Closed</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.internal.closed || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Assigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.internal.assigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Unassigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.internal.unassigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Re-Assigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.internal.ReOpenAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Re-Unassigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.internal.ReOpenedUnAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Total</div>
                          <q-chip dense color="purple-9" text-white class="text-weight-bold">{{ serviceRequestCount.intTotal || 0 }}</q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="text-center q-pa-sm">
                      <div class="text-weight-bolder text-purple-9 q-mb-xs">EXTERNAL</div>
                      <div class="row text-center justify-center q-col-gutter-xs">
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Closed</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.external.closed || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Assigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.external.assigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Unassigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.external.unassigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Re-Assigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.external.ReOpenAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Re-Unassigned</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.external.ReOpenedUnAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4">
                          <div class="text-caption text-grey-7">Total</div>
                          <q-chip dense color="purple-9" text-white class="text-weight-bold">{{ serviceRequestCount.extTotal || 0 }}</q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mt-xs">
            <div class="col-lg-12">
              <q-card class="bg-grey-2 border-radius-10 shadow-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-subtitle1 text-weight-bold text-grey-9">Aging Tracker</div>
                  <chartSATagingTracker :options="{ responsive: true, maintainAspectRatio: false }" :height="200"
                    class="bg-white q-pa-sm q-mt-xs round-borders shadow-1"></chartSATagingTracker>
                </q-card-section>
              </q-card>

              <q-card class="bg-grey-2 border-radius-10 shadow-1 q-mt-sm">
                <q-card-section class="q-pa-sm">
                  <div class="row items-center justify-between">
                    <div class="text-subtitle1 text-weight-bold text-grey-9">Merchant Tracker</div>
                    <div style="width: 120px">
                      <q-select dense outlined bg-color="white" v-model="dateSelection" @update:model-value="changeMerchantTrackerData"
                        :options="[{ label: 'Days', value: 'DAYS' }, { label: 'Week', value: 'WEEK' }, { label: 'Month', value: 'MONTH' }, { label: 'Year', value: 'YEAR' }]"
                        emit-value map-options />
                    </div>
                  </div>
                  <chartMerchantTracker v-if="renderMerchantGraph" :borderWidth="1" :height="200"
                    :merchantTrackerData="getSatDashboardGraphData" class="bg-white q-pa-sm q-mt-xs round-borders shadow-1">
                  </chartMerchantTracker>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Right Side Panel -->
        <div class="col-lg-4 col-md-12 col-sm-12">
          <div class="row q-col-gutter-sm items-stretch">
            <div class="col-lg-12 col-md-6 col-sm-12">
              <q-card class="bg-orange text-white border-radius-10 shadow-2 q-pa-md text-center">
                <div class="text-h3 text-weight-bolder cursor-pointer"
                  @click="retrieveLeadsList(applicationPendingCount.totalApplicationPendingLeadIds)">
                  {{ applicationPendingCount.totalApplicationPendingCount }}</div>
                <q-separator color="white" class="q-my-sm" inset />
                <div class="text-subtitle1 text-weight-light">Application Pending</div>
              </q-card>
            </div>

            <div class="col-lg-12 col-md-6 col-sm-12">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-card class="bg-negative text-white border-radius-10 text-center shadow-1 q-pa-xs clickable"
                    @click="retrieveLeadsList(applicationPendingCount.financeRejectLeadIds)">
                    <div class="text-caption">Fin Rejects</div>
                    <div class="text-h6 text-weight-bold">{{ applicationPendingCount.financeRejectCount }}</div>
                  </q-card>
                </div>
                <div class="col-6">
                  <q-card class="bg-amber-9 text-white border-radius-10 text-center shadow-1 q-pa-xs clickable"
                    @click="retrieveLeadsList(applicationPendingCount.financePendingLeadIds)">
                    <div class="text-caption">Fin Pending</div>
                    <div class="text-h6 text-weight-bold">{{ applicationPendingCount.financePendingCount }}</div>
                  </q-card>
                </div>
                <div class="col-4">
                  <q-card class="bg-blue-6 text-white border-radius-10 text-center shadow-1 q-pa-xs clickable"
                    @click="retrieveLeadsList(applicationPendingCount.wipLeadIds)">
                    <div class="text-caption">WIP</div>
                    <div class="text-h6 text-weight-bold">{{ applicationPendingCount.wipCount }}</div>
                  </q-card>
                </div>
                <div class="col-4">
                  <q-card class="bg-positive text-white border-radius-10 text-center shadow-1 q-pa-xs clickable"
                    @click="retrieveLeadsList(applicationPendingCount.withSatLeadIds)">
                    <div class="text-caption">New</div>
                    <div class="text-h6 text-weight-bold">{{ applicationPendingCount.withSatCount }}</div>
                  </q-card>
                </div>
                <div class="col-4">
                  <q-card class="bg-purple-9 text-white border-radius-10 text-center shadow-1 q-pa-xs clickable"
                    @click="retrieveLeadsList(applicationPendingCount.withOPSLeadIds)">
                    <div class="text-caption">Ops</div>
                    <div class="text-h6 text-weight-bold">{{ applicationPendingCount.withOPSHead }}</div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>

          <q-card class="q-mt-sm border-radius-10 shadow-1 overflow-hidden">
            <q-card-section class="bg-grey-1 q-pa-sm border-bottom-grey">
              <div class="text-subtitle2 text-weight-bold text-grey-9">
                Aging Tracker - <span class="text-amber-9">Pending</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-none">
              <q-table dense hide-bottom :rows="agingTrackerPendingTableData"
                :columns="agingTrackerPendingColumns" v-model:pagination="paginationControl" row-key="name" flat>
                <template v-slot:body-cell-greaterThanOneDay="props">
                  <q-td v-if="props.row" :props="props" class="cursor-pointer text-purple-9 text-weight-bold"
                    @click="retrieveLeadsList(props.row.greaterThanOneDayLeadIdList)">
                    {{ props.row.greaterThanOneDay }}
                  </q-td>
                </template>
                <template v-slot:body-cell-greaterThanTwoDays="props">
                  <q-td v-if="props.row" :props="props" class="cursor-pointer text-purple-9 text-weight-bold"
                    @click="retrieveLeadsList(props.row.greaterThanTwoDaysLeadIdList)">
                    {{ props.row.greaterThanTwoDays }}
                  </q-td>
                </template>
                <template v-slot:body-cell-greaterThanFiveDays="props">
                  <q-td v-if="props.row" :props="props" class="cursor-pointer text-purple-9 text-weight-bold"
                    @click="retrieveLeadsList(props.row.greaterThanFiveDaysLeadIdList)">
                    {{ props.row.greaterThanFiveDays }}
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <leadList v-if="dashboardAgingTrackerLeads" :propLeadInformation="rowDetails"
        :propToggleModal="dashboardAgingTrackerLeads" @closeLeadsList="retrieveLeadsList" />
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
      paginationControl: {
        rowsPerPage: 10
      },
      exceptionCount: {
        banksubventionPendingCount: 0,
        kycPendingCount: 0,
        pricingPendingCount: 0,
        totalExceptionCount: 0,
        kycPendingLeadIds: [],
        banksubventionPendingLeadIds: [],
        pricingPendingLeadIds: []
      },
      aggregatorCount: {
        totalDevice: 0,
        pendingDeviceCount: 0,
        damagedDeviceCount: 0,
        allocatedDeviceCount: 0
      },
      regionalInventoryCount: {
        allocatedDeviceCount: 0,
        damagedDeviceCount: 0,
        pendingDeviceCount: 0,
        totalDevice: 0
      },
      marsDeviceCount: {
        assignedDeviceCount: 0,
        totalMarsDeviceCount: 0,
        unassignedDeviceCount: 0
      },
      serviceRequestCount: {
        external: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
        internal: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
        total: 0,
        intTotal: 0,
        extTotal: 0
      },
      applicationPendingCount: {
        financePendingCount: 0,
        financeRejectCount: 0,
        wipCount: 0,
        withOPSHead: 0,
        totalApplicationPendingCount: 0,
        totalApplicationPendingLeadIds: [],
        financeRejectLeadIds: [],
        financePendingLeadIds: [],
        withSatCount: 0,
        withSatLeadIds: [],
        withOPSLeadIds: [],
        wipLeadIds: []
      },
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
      this.FETCH_DASHBOARD_COUNT(userInfo.region.id)
        .then(() => {
          this.applicationPendingCount = this.getSatDashboard.applicationPendingCount;
          this.exceptionCount = this.getSatDashboard.exceptionCount;
          this.marsDeviceCount = this.getSatDashboard.marsDeviceCount;
          this.regionalInventoryCount = this.getSatDashboard.regionalInventoryCount;
          this.FETCH_SAT_AGING_TRACKER_DATA(userInfo.region.id).then(() => {
            this.agingTrackerPendingTableData = this.getSatAgingTrackerdata;
          });
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },
    fetchAggregatorsCountInformation() {
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (!userInfo) return;
      this.FETCH_AGGREGATORS_DASHBOARD_COUNT({ region: userInfo.region.id })
        .then(() => {
          this.aggregatorCount = this.getAggregatorsSatDashboard.regionalInventoryCount;
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
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (!userInfo) return;
      this.FETCH_DASHBOARD_CHART_DATA({ region: userInfo.region.id, action: value })
        .then(() => { this.renderMerchantGraph = true; })
        .catch(() => { this.renderMerchantGraph = false; });
    },
    retrieveLeadsList(props) {
      if (props && props.length > 0) {
        this.rowDetails = props;
        this.dashboardAgingTrackerLeads = true;
      } else {
        this.$q.notify({ color: "amber-9", position: "bottom", message: "No lead available", icon: "info" });
      }
    }
  }
};
</script>

<style scoped>
.border-radius-10 { border-radius: 8px !important; }
.round-borders { border-radius: 8px; }
.border-top-grey { border-top: 1px solid #e0e0e0; }
.border-right-grey { border-right: 1px solid #e0e0e0; }
.border-bottom-grey { border-bottom: 1px solid #e0e0e0; }
.clickable { cursor: pointer; transition: transform 0.2s; }
.clickable:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }
</style>
