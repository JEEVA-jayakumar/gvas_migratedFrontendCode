<template>
  <q-page>
    <!--START: content -->
    <div class="q-pa-md">
      <!-- START: Dashboard wrapper -->
      <div class="row q-col-gutter-md">
        <div class="col-lg-8 col-md-12 col-sm-12">
          <div class="row q-col-gutter-md items-stretch">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="full-height">
                <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white shadow-2">
                  <div class="row items-center no-wrap">
                    <div class="col-auto">
                      <div class="q-headline">{{ exceptionCount.totalExceptionCount }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-md gt-xs" />
                    <div class="col">
                      <div class="lg-q-title text-weight-light">Exception</div>
                    </div>
                  </div>
                </q-card>
                <q-card class="q-mt-sm q-py-sm shadow-1 border-radius-10">
                  <div class="row items-center text-center no-wrap overflow-hidden" style="min-height:75px">
                    <div class="col-4 q-px-xs">
                      <div class="q-caption text-grey-10 text-no-wrap">KYC</div>
                      <q-chip dense clickable @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)"
                        class="bg-purple-9 text-white q-mt-xs">{{ exceptionCount.kycPendingCount }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs">
                      <div class="q-caption text-grey-10 text-no-wrap">Bank</div>
                      <q-chip dense clickable
                        @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)" class="bg-purple-9 text-white q-mt-xs">{{
                          exceptionCount.banksubventionPendingCount
                        }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs">
                      <div class="q-caption text-grey-10 text-no-wrap">Pricing</div>
                      <q-chip dense clickable @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)"
                        class="bg-purple-9 text-white q-mt-xs">{{ exceptionCount.pricingPendingCount }}</q-chip>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="full-height">
                <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white shadow-2">
                  <div class="row items-center no-wrap">
                    <div class="col-auto">
                      <div class="q-headline">{{ regionalInventoryCount.totalDevice }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-md gt-xs" />
                    <div class="col">
                      <div class="lg-q-title text-weight-light">Stock (Bijlipay)</div>
                    </div>
                  </div>
                </q-card>
                <q-card class="q-mt-sm q-py-sm shadow-1 border-radius-10">
                  <div class="row items-center text-center no-wrap overflow-hidden" style="min-height:75px">
                    <div class="col-4 q-px-xs">
                      <div class="q-caption text-grey-10 text-no-wrap">Allocated</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ regionalInventoryCount.allocatedDeviceCount }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs">
                      <div class="q-caption text-grey-10 text-no-wrap">Pending</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ regionalInventoryCount.pendingDeviceCount }}</q-chip>
                    </div>
                    <div class="col-4 q-px-xs">
                      <div class="q-caption text-grey-10 text-no-wrap">Damaged</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ regionalInventoryCount.damagedDeviceCount }}</q-chip>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>

            <div class="col-lg-4 col-md-12 col-sm-12">
              <div class="full-height">
                <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white shadow-2">
                  <div class="row items-center no-wrap">
                    <div class="col-auto">
                      <div class="q-headline">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
                    </div>
                    <q-separator vertical dark class="q-mx-md gt-xs" />
                    <div class="col">
                      <div class="lg-q-title text-weight-light">Implementation</div>
                    </div>
                  </div>
                </q-card>
                <q-card class="q-mt-sm q-py-sm shadow-1 border-radius-10">
                  <div class="row items-center text-center no-wrap overflow-hidden" style="min-height:75px">
                    <div class="col-6 q-px-xs">
                      <div class="q-caption text-grey-10">Assigned</div>
                      <div class="text-subtitle1 text-weight-bold">{{ marsDeviceCount.assignedDeviceCount }}</div>
                    </div>
                    <q-separator vertical class="q-my-sm" />
                    <div class="col-6 q-px-xs">
                      <div class="q-caption text-negative">
                        <q-icon color="amber-9" name="notifications" size="16px" />
                        Unassigned
                      </div>
                      <div class="text-subtitle1 text-weight-bold text-negative">{{ marsDeviceCount.unassignedDeviceCount }}</div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>
          <q-card class="q-my-md border-radius-10 shadow-1 bg-grey-1 text-purple-9 overflow-hidden">
            <q-card-section class="q-pb-none">
              <div class="lg-q-title text-weight-bold">Stock Inventory (Aggregator)</div>
            </q-card-section>
            <div class="row q-col-gutter-sm q-pa-sm items-stretch">
              <div class="col-lg-4 col-md-12">
                <q-card class="border-radius-10 bg-purple-9 text-white q-pa-md flex flex-center full-height">
                  <div class="text-center">
                    <div class="q-headline">{{ aggregatorCount.totalDevice }}</div>
                    <div class="q-caption text-white opacity-80">Total</div>
                  </div>
                </q-card>
              </div>
              <div class="col-lg-8 col-md-12">
                <div class="row q-col-gutter-sm text-center">
                  <div class="col-4">
                    <div class="q-pa-sm bg-white border-radius-10 shadow-1">
                      <div class="q-caption text-grey-10">Pending</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ aggregatorCount.pendingDeviceCount }}</q-chip>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="q-pa-sm bg-white border-radius-10 shadow-1">
                      <div class="q-caption text-grey-10">Allocated</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ aggregatorCount.allocatedDeviceCount }}</q-chip>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="q-pa-sm bg-white border-radius-10 shadow-1">
                      <div class="q-caption text-grey-10">Damaged</div>
                      <q-chip dense class="bg-purple-9 text-white q-mt-xs">{{ aggregatorCount.damagedDeviceCount }}</q-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>

          <div class="row q-mt-md">
            <div class="col-12">
              <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white shadow-2">
                <div class="row items-center no-wrap">
                  <div class="col-auto">
                    <div class="q-headline">{{ serviceRequestCount.total }}</div>
                  </div>
                  <q-separator vertical dark class="q-mx-md gt-xs" />
                  <div class="col">
                    <div class="lg-q-title text-weight-light">Service Request</div>
                  </div>
                </div>
              </q-card>

              <q-card class="q-mt-sm border-radius-10 shadow-1">
                <div class="row q-col-gutter-sm q-pa-sm">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="text-center q-py-sm bg-grey-2 border-radius-10">
                      <div class="text-weight-bold text-purple-9">Internal</div>
                      <div class="row q-mt-xs text-center justify-center">
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Closed</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.internal.closed || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Assigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.internal.assigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Unassigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.internal.unassigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Re-Assigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.internal.ReOpenAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Re-Unassigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.internal.ReOpenedUnAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Total</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.intTotal || 0 }}</q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="text-center q-py-sm bg-grey-2 border-radius-10">
                      <div class="text-weight-bold text-purple-9">External</div>
                      <div class="row q-mt-xs text-center justify-center">
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Closed</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.external.closed || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Assigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.external.assigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Unassigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.external.unassigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Re-Assigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.external.ReOpenAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Re-Unassigned</div>
                          <q-chip dense class="bg-purple-9 text-white">{{ serviceRequestCount.external.ReOpenedUnAssigned || 0 }}</q-chip>
                        </div>
                        <div class="col-4 q-py-xs">
                          <div class="q-caption text-grey-10">Total</div>
                          <q-chip dense outline color="purple-9">{{ serviceRequestCount.extTotal || 0 }}</q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

          </div>

          <div class="row q-col-gutter-x-xs">
            <div class="col-lg-12">
              <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
                <q-card-section>
                  <div class="q-subheading text-bold">Aging Tracker</div>
                </q-card-section>
                <q-card-section>
                  <chartSATagingTracker :options="{ responsive: false, maintainAspectRatio: false }" :height="150"
                    class="bg-white q-pa-md round-borders"></chartSATagingTracker>
                </q-card-section>
              </q-card>
              <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col-12 col-lg-9">
                      <div class="q-subheading text-bold">Merchant Tracker</div>
                    </div>
                    <div class="col-12 col-lg-3">
                      <div class="q-subheading text-bold">
                        <q-select dark filled color="purple-9" v-model="dateSelection" @update:model-value="changeMerchantTrackerData"
                          :options="[{ label: 'Days', value: 'DAYS' }, { label: 'Week', value: 'WEEK' }, { label: 'Month', value: 'MONTH' }, { label: 'Year', value: 'YEAR' }]"
                          emit-value map-options />
                      </div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <chartMerchantTracker v-if="renderMerchantGraph" :borderWidth="1" :height="150"
                    :merchantTrackerData="getSatDashboardGraphData" class="bg-white q-pa-md round-borders">
                  </chartMerchantTracker>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-12 col-sm-12">
          <div class="row q-col-gutter-sm items-stretch">
            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
              <q-card class="full-height bg-orange text-white border-radius-10 shadow-2 flex flex-center q-pa-md">
                <div class="text-center">
                  <div class="q-headline cursor-pointer"
                    @click="retrieveLeadsList(applicationPendingCount.totalApplicationPendingLeadIds)">
                    {{ applicationPendingCount.totalApplicationPendingCount }}</div>
                  <q-separator color="white" class="q-my-sm" />
                  <div class="lg-q-title text-weight-light">Application Pending</div>
                </div>
              </q-card>
            </div>
            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-card class="q-pa-sm bg-negative text-white border-radius-10 text-center shadow-1">
                    <div class="q-caption opacity-100">Fin rejects</div>
                    <div class="text-h6 cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.financeRejectLeadIds)">
                      {{ applicationPendingCount.financeRejectCount }}
                    </div>
                  </q-card>
                </div>
                <div class="col-6">
                  <q-card class="q-pa-sm bg-amber-9 text-white border-radius-10 text-center shadow-1">
                    <div class="q-caption opacity-100">Fin pending</div>
                    <div class="text-h6 cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.financePendingLeadIds)">
                      {{ applicationPendingCount.financePendingCount }}
                    </div>
                  </q-card>
                </div>
                <div class="col-4">
                  <q-card class="q-pa-sm bg-blue-6 text-white border-radius-10 text-center shadow-1">
                    <div class="q-caption opacity-100">WIP</div>
                    <div class="text-h6 cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.wipLeadIds)">
                      {{ applicationPendingCount.wipCount }}
                    </div>
                  </q-card>
                </div>
                <div class="col-4">
                  <q-card class="q-pa-sm bg-positive text-white border-radius-10 text-center shadow-1">
                    <div class="q-caption opacity-100">New</div>
                    <div class="text-h6 cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.withSatLeadIds)">
                      {{ applicationPendingCount.withSatCount }}
                    </div>
                  </q-card>
                </div>
                <div class="col-4">
                  <q-card class="q-pa-sm bg-purple-9 text-white border-radius-10 text-center shadow-1">
                    <div class="q-caption opacity-100">Ops</div>
                    <div class="text-h6 cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.withOPSLeadIds)">
                      {{ applicationPendingCount.withOPSHead }}
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>

          <div class="q-mt-md">
            <q-card class="border-radius-10 shadow-1">
              <q-card-section class="q-pb-none">
                <div class="lg-q-title text-weight-bold">
                  Aging Tracker - <span class="text-amber-9">Pending</span>
                </div>
              </q-card-section>
              <q-card-section>
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
      </div>
      <!-- END: Dashboard wrapper -->
      <!-- //Common lead information in popup -->
      <leadList v-if="dashboardAgingTrackerLeads" :propLeadInformation="rowDetails"
        :propToggleModal="dashboardAgingTrackerLeads" @closeLeadsList="retrieveLeadsList" />
    </div>
  </q-page>
  <!--END: content -->
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
      paginationControl: {
        rowsPerPage: 10
      },
      flag: false,
      aggregator: "",
      exceptionCount: {
        banksubventionPendingCount: 0,
        kycPendingCount: 0,
        pricingPendingCount: 0,
        totalExceptionCount: 0
      },
      aggregatorCount: {
        totalDevice: 0,
        pendingDeviceCount: 0,
        damagedDeviceCount: 0,
        allocatedDeviceCount: 0
      },
      marsDeviceCount: {
        assignedDeviceCount: 0,
        totalMarsDeviceCount: 0,
        unassignedDeviceCount: 0
      },
      regionalInventoryCount: {
        allocatedDeviceCount: 0,
        damagedDeviceCount: 0,
        pendingDeviceCount: 0,
        totalDevice: 0
      },
      serviceRequestCount: {
        external: {
          closed: 0,
          assigned: 0,
          unassigned: 0
        },
        internal: {
          closed: 0,
          assigned: 0,
          unassigned: 0
        },
        total: 0,
        intTotal: 0,
        extTotal: 0
      },
      applicationPendingCount: {
        financePendingCount: 0,
        financeRejectCount: 0,
        wipCount: 0,
        withOPSHead: 0
      },
      agingTrackerPendingColumns: [
        {
          name: "name",
          required: false,
          label: "Stage",
          align: "left",
          field: "name",
          sortable: false
        },
        {
          name: "greaterThanOneDay",
          required: false,
          label: ">1",
          align: "left",
          field: "greaterThanOneDay",
          sortable: true
        },
        {
          name: "greaterThanTwoDays",
          required: false,
          label: ">2",
          align: "left",
          field: "greaterThanTwoDays",
          sortable: true
        },
        {
          name: "greaterThanFiveDays",
          required: false,
          label: ">5",
          align: "left",
          field: "greaterThanFiveDays",
          sortable: true
        }
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
    ...mapGetters("SAT_Dashboard", [
      "getSatDashboard", "getAggregatorsSatDashboard",
      "getSatAgingTrackerdata",
      "getSatDashboardGraphData"
    ]),
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"]),
    ...mapGetters("serviceRequestSat", ["getserviceRequestCountDatas"]),
    ...mapGetters("serviceRequestPhonepeSat", ["getserviceRequestPhonepeCountDatas"]),
  },
  methods: {
    ...mapActions("SAT_Dashboard", [
      "FETCH_DASHBOARD_CHART_DATA",
      "FETCH_DASHBOARD_COUNT", "FETCH_AGGREGATORS_DASHBOARD_COUNT",
      "FETCH_SAT_AGING_TRACKER_DATA"
    ]),
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
    ...mapActions("serviceRequestSat", ["FETCH_SERVICE_REQUEST_COUNT_DETAILS"]),
    ...mapActions("serviceRequestPhonepeSat", ["FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS"]),

    fetchCountInformation() {
      this.$q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      const userInfo = localStorage.getItem("u_i");
      if (!userInfo) return;
      const regionId = JSON.parse(userInfo).region.id;
      this.FETCH_DASHBOARD_COUNT(regionId)
        .then(() => {
          this.applicationPendingCount = this.getSatDashboard.applicationPendingCount;
          this.exceptionCount = this.getSatDashboard.exceptionCount;
          this.marsDeviceCount = this.getSatDashboard.marsDeviceCount;
          this.regionalInventoryCount = this.getSatDashboard.regionalInventoryCount;
          this.FETCH_SAT_AGING_TRACKER_DATA(regionId).then(() => {
            this.agingTrackerPendingTableData = this.getSatAgingTrackerdata;
          });
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    fetchAggregatorsCountInformation() {
      this.$q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      const userInfo = localStorage.getItem("u_i");
      if (!userInfo) return;
      let param = {
        region: JSON.parse(userInfo).region.id
      };
      this.FETCH_AGGREGATORS_DASHBOARD_COUNT(param)
        .then(() => {
          console.log("getAggregatorsSatDashboard ------->", JSON.stringify(this.getAggregatorsSatDashboard));
          this.aggregatorCount = this.getAggregatorsSatDashboard.regionalInventoryCount;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    fetchServiceRequestCounts() {
      this.$q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_SERVICE_REQUEST_COUNT_DETAILS()
        .then(() => {
          console.log("SERVICE REQUEST COUNT------>", JSON.stringify(this.getserviceRequestCountDatas))
          this.serviceRequestCount = this.getserviceRequestCountDatas;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
      this.FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS()
        .then(() => {
          this.serviceRequestCount = this.getserviceRequestPhonepeCountDatas;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    changeMerchantTrackerData(value) {
      this.renderMerchantGraph = false;
      this.$q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.dateSelection = value;
      const userInfo = localStorage.getItem("u_i");
      if (!userInfo) return;
      this.FETCH_DASHBOARD_CHART_DATA({
        region: JSON.parse(userInfo).region.id,
        action: value
      }).then(() => {
          this.renderMerchantGraph = true;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.renderMerchantGraph = false;
          this.$q.loading.hide();
        });
    },
    retrieveLeadsList(props) {
      this.dashboardAgingTrackerLeads = !this.dashboardAgingTrackerLeads;
      if (props != undefined) {
        if (props.length > 0) {
          this.rowDetails = props;
        } else {
          this.$q.notify({
            color: "amber-9",
            position: "bottom",
            message: "Oops, no lead available to display",
            icon: "info"
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.border-radius-10 {
  border-radius: 8px !important;
}

.q-chip.row.no-wrap.inline.items-center.custom_chip_progress.bg-purple-9.text-white {
  height: 35px;
  background: #fff !important;
  color: #333 !important;
  border: 3px solid #691b9a;
  border-radius: 30px;
  width: 35px;
  text-align: center;
  margin: 2px;
}

.customTabActive {
  background: #212c3f;
  color: #fff;
}
</style>
