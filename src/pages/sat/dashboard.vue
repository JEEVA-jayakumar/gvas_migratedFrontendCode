<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-lg">
      <div class="row q-col-gutter-lg">
        <!-- Main Stats and Charts -->
        <div class="col-12 col-lg-8">
          <div class="row q-col-gutter-md">
            <!-- Exception Stat -->
            <div class="col-12 col-md-4">
              <q-card flat bordered class="q-pa-none overflow-hidden">
                <div class="bg-primary q-pa-md text-white">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-subtitle2 text-weight-light opacity-80 uppercase ls-1">Exception</div>
                      <div class="text-h4 text-weight-bold">{{ exceptionCount.totalExceptionCount }}</div>
                    </div>
                    <q-icon name="warning_amber" size="48px" class="opacity-30" />
                  </div>
                </div>
                <div class="q-pa-md bg-white">
                  <div class="row q-col-gutter-xs">
                    <div class="col-4 text-center">
                      <div class="text-caption text-grey-6">KYC</div>
                      <div class="text-weight-bold text-primary cursor-pointer" @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)">{{ exceptionCount.kycPendingCount }}</div>
                    </div>
                    <div class="col-4 text-center">
                      <div class="text-caption text-grey-6">Bank</div>
                      <div class="text-weight-bold text-primary cursor-pointer" @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)">{{ exceptionCount.banksubventionPendingCount }}</div>
                    </div>
                    <div class="col-4 text-center">
                      <div class="text-caption text-grey-6">Price</div>
                      <div class="text-weight-bold text-primary cursor-pointer" @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)">{{ exceptionCount.pricingPendingCount }}</div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Inventory Stat -->
            <div class="col-12 col-md-4">
              <q-card flat bordered class="q-pa-none overflow-hidden">
                <div class="bg-primary q-pa-md text-white">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-subtitle2 text-weight-light opacity-80 uppercase ls-1">Bijlipay Stock</div>
                      <div class="text-h4 text-weight-bold">{{ regionalInventoryCount.totalDevice }}</div>
                    </div>
                    <q-icon name="inventory_2" size="48px" class="opacity-30" />
                  </div>
                </div>
                <div class="q-pa-md bg-white">
                  <div class="row q-col-gutter-xs">
                    <div class="col-4 text-center">
                      <div class="text-caption text-grey-6">Allocated</div>
                      <div class="text-weight-bold text-primary">{{ regionalInventoryCount.allocatedDeviceCount }}</div>
                    </div>
                    <div class="col-4 text-center">
                      <div class="text-caption text-grey-6">Pending</div>
                      <div class="text-weight-bold text-primary">{{ regionalInventoryCount.pendingDeviceCount }}</div>
                    </div>
                    <div class="col-4 text-center">
                      <div class="text-caption text-grey-6">Damaged</div>
                      <div class="text-weight-bold text-primary">{{ regionalInventoryCount.damagedDeviceCount }}</div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Implementation Stat -->
            <div class="col-12 col-md-4">
              <q-card flat bordered class="q-pa-none overflow-hidden">
                <div class="bg-primary q-pa-md text-white">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-subtitle2 text-weight-light opacity-80 uppercase ls-1">Implementation</div>
                      <div class="text-h4 text-weight-bold">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
                    </div>
                    <q-icon name="rocket_launch" size="48px" class="opacity-30" />
                  </div>
                </div>
                <div class="q-pa-md bg-white">
                  <div class="row q-col-gutter-xs">
                    <div class="col-6 text-center" style="border-right: 1px solid #eee">
                      <div class="text-caption text-grey-6">Assigned</div>
                      <div class="text-weight-bold text-primary">{{ marsDeviceCount.assignedDeviceCount }}</div>
                    </div>
                    <div class="col-6 text-center">
                      <div class="text-caption text-grey-6">Unassigned</div>
                      <div class="text-weight-bold text-negative">
                         {{ marsDeviceCount.unassignedDeviceCount }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Service Requests Section -->
            <div class="col-12">
               <q-card flat bordered class="q-mt-md">
                 <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8">Service Requests</div>
                    <q-space />
                    <q-badge color="primary" class="q-pa-sm rounded-md">Total: {{ serviceRequestCount.total }}</q-badge>
                 </q-card-section>

                 <q-card-section class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                       <div class="text-subtitle2 text-weight-bold q-mb-md text-grey-7 uppercase ls-1">Internal Requests</div>
                       <div class="row q-col-gutter-sm">
                          <div v-for="(val, label) in serviceRequestCount.internal" :key="label" class="col-4">
                             <div class="q-pa-sm bg-grey-1 rounded-md text-center">
                                <div class="text-caption text-grey-6">{{ label }}</div>
                                <div class="text-weight-bold text-primary">{{ val || 0 }}</div>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div class="col-12 col-md-6">
                       <div class="text-subtitle2 text-weight-bold q-mb-md text-grey-7 uppercase ls-1">External Requests</div>
                       <div class="row q-col-gutter-sm">
                          <div v-for="(val, label) in serviceRequestCount.external" :key="label" class="col-4">
                             <div class="q-pa-sm bg-grey-1 rounded-md text-center">
                                <div class="text-caption text-grey-6">{{ label }}</div>
                                <div class="text-weight-bold text-primary">{{ val || 0 }}</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </q-card-section>
               </q-card>
            </div>

            <!-- Charts Section -->
            <div class="col-12">
              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section class="row items-center">
                      <div class="text-h6 text-weight-bold text-grey-8">Aging Tracker</div>
                    </q-card-section>
                    <q-card-section>
                      <chartSATagingTracker :options="{ responsive: true, maintainAspectRatio: false }" :height="200"></chartSATagingTracker>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section class="row items-center">
                      <div class="text-h6 text-weight-bold text-grey-8">Merchant Tracker</div>
                      <q-space />
                      <q-select
                        dense
                        outlined
                        v-model="dateSelection"
                        :options="[{ label: 'Days', value: 'DAYS' }, { label: 'Week', value: 'WEEK' }, { label: 'Month', value: 'MONTH' }, { label: 'Year', value: 'YEAR' }]"
                        emit-value
                        map-options
                        @update:model-value="changeMerchantTrackerData"
                        style="width: 120px"
                      />
                    </q-card-section>
                    <q-card-section>
                      <chartMerchantTracker v-if="renderMerchantGraph" :borderWidth="1" :height="200" :merchantTrackerData="getSatDashboardGraphData"></chartMerchantTracker>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Secondary Info -->
        <div class="col-12 col-lg-4">
          <div class="column q-gutter-md">
            <!-- Pending Applications Summary -->
            <q-card flat bordered class="bg-orange-1 border-orange-2">
              <q-card-section class="text-center">
                 <div class="text-subtitle2 text-orange-9 uppercase text-weight-bold ls-1 q-mb-sm">Application Pending</div>
                 <div class="text-h2 text-weight-bolder text-orange-10 cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.totalApplicationPendingLeadIds)">
                   {{ applicationPendingCount.totalApplicationPendingCount }}
                 </div>
              </q-card-section>
              <q-card-section class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="q-pa-md bg-white rounded-md shadow-subtle text-center cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.financeRejectLeadIds)">
                    <div class="text-caption text-grey-6">Fin Rejects</div>
                    <div class="text-h6 text-negative text-weight-bold">{{ applicationPendingCount.financeRejectCount }}</div>
                  </div>
                </div>
                <div class="col-6">
                   <div class="q-pa-md bg-white rounded-md shadow-subtle text-center cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.financePendingLeadIds)">
                    <div class="text-caption text-grey-6">Fin Pending</div>
                    <div class="text-h6 text-warning text-weight-bold">{{ applicationPendingCount.financePendingCount }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="q-pa-sm bg-white rounded-md shadow-subtle text-center cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.wipLeadIds)">
                    <div class="text-caption text-grey-6">WIP</div>
                    <div class="text-subtitle1 text-primary text-weight-bold">{{ applicationPendingCount.wipCount }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="q-pa-sm bg-white rounded-md shadow-subtle text-center cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.withSatLeadIds)">
                    <div class="text-caption text-grey-6">New</div>
                    <div class="text-subtitle1 text-positive text-weight-bold">{{ applicationPendingCount.withSatCount }}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="q-pa-sm bg-white rounded-md shadow-subtle text-center cursor-pointer" @click="retrieveLeadsList(applicationPendingCount.withOPSLeadIds)">
                    <div class="text-caption text-grey-6">Ops</div>
                    <div class="text-subtitle1 text-brand text-weight-bold">{{ applicationPendingCount.withOPSHead }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Table Card -->
            <q-card flat bordered>
              <q-card-section class="row items-center">
                <div class="text-subtitle1 text-weight-bold text-grey-8">Aging Tracker - <span class="text-warning">Pending</span></div>
              </q-card-section>
              <q-card-section class="q-pa-none">
                <q-table
                  flat
                  dense
                  hide-bottom
                  :rows="agingTrackerPendingTableData"
                  :columns="agingTrackerPendingColumns"
                  :pagination="paginationControl"
                  row-key="name"
                  class="bg-transparent"
                >
                  <template v-slot:body-cell-name="props">
                    <q-td :props="props" class="text-weight-medium">{{ props.row.name }}</q-td>
                  </template>
                  <template v-slot:body-cell-greaterThanOneDay="props">
                    <q-td :props="props" class="cursor-pointer text-primary" @click="retrieveLeadsList(props.row.greaterThanOneDayLeadIdList)">
                      {{ props.row.greaterThanOneDay }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-greaterThanTwoDays="props">
                    <q-td :props="props" class="cursor-pointer text-primary" @click="retrieveLeadsList(props.row.greaterThanTwoDaysLeadIdList)">
                      {{ props.row.greaterThanTwoDays }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-greaterThanFiveDays="props">
                    <q-td :props="props" class="cursor-pointer text-primary" @click="retrieveLeadsList(props.row.greaterThanFiveDaysLeadIdList)">
                      {{ props.row.greaterThanFiveDays }}
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- //Common lead information in popup -->
      <leadList v-if="dashboardAgingTrackerLeads" :propLeadInformation="rowDetails"
        :propToggleModal="dashboardAgingTrackerLeads" @closeLeadsList="retrieveLeadsList" />
    </div>
  </q-page>
</template>

<script>
import { required } from '@vuelidate/validators';
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
      // aggregatorOptions: [],
      exceptionCount: {
        banksubventionPendingCount: 0,
        kycPendingCount: 0,
        pricingPendingCount: 0,
        totalExceptionCount: 0
      },
      aggregatorCount: {
        totalDevice: 0,
        damagedDeviceCount: 0,
        pendingDeviceCount: 0,
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
    // this.fetchAggregatorList();
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
        delay: 100, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_DASHBOARD_COUNT(
        JSON.parse(localStorage.getItem("u_i")).region.id
      )
        .then(() => {
          this.applicationPendingCount = this.getSatDashboard.applicationPendingCount;
          this.exceptionCount = this.getSatDashboard.exceptionCount;
          this.marsDeviceCount = this.getSatDashboard.marsDeviceCount;
          this.regionalInventoryCount = this.getSatDashboard.regionalInventoryCount;
          this.FETCH_SAT_AGING_TRACKER_DATA(
            JSON.parse(localStorage.getItem("u_i")).region.id
          ).then(() => {
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
        delay: 100, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      let param = {
        region: JSON.parse(localStorage.getItem("u_i")).region.id
      };
      this.FETCH_AGGREGATORS_DASHBOARD_COUNT(param)
        .then(() => {
          this.aggregatorCount = this.getAggregatorsSatDashboard.regionalInventoryCount;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    fetchServiceRequestCounts() {
      this.$q.loading.show({
        delay: 100, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_SERVICE_REQUEST_COUNT_DETAILS()
        .then(() => {
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
        delay: 100, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.dateSelection = value;
      this.FETCH_DASHBOARD_CHART_DATA({
        region: JSON.parse(localStorage.getItem("u_i")).region.id,
        action: value
      })
        .then(() => {
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
.ls-1 { letter-spacing: 0.05em; }
.opacity-80 { opacity: 0.8; }
.opacity-30 { opacity: 0.3; }
.border-orange-2 { border: 1px solid #ffe8cc !important; }
.uppercase { text-transform: uppercase; }
.lh-1 { line-height: 1; }
</style>
