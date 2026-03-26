<template>
  <q-page>
    <!-- content -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Bijlipay Service Request
    </div>
    <div>
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab color="dark" name="opened" label="Opened" />
        <q-tab color="dark" name="closed" label="Closed" />
        <q-tab color="dark" name="cancel" label="cancelled" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="opened" class="q-pa-none">
          <opened />
        </q-tab-panel>

        <q-tab-panel name="cancel" class="q-pa-none">
          <cancelledInternal />
        </q-tab-panel>

        <q-tab-panel name="closed" class="q-pa-none">
          <!--START: table Data -->
          <q-table
            :rows="internalClosedTableData"
            :columns="columnDataclosed"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl2"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo2"
          >
            <!--START: Table body -->
            <template v-slot:body="props">
              <!--START: table rows -->
              <q-tr :props="props" class="bottom-border">
                <q-td key="serviceReqTicketId" :props="props">
                  <q-checkbox
                    checked-icon="fas fa-chevron-up"
                    unchecked-icon="fas fa-chevron-down"
                    color="grey-9"
                    v-model="props.row.expand"
                    class="q-mr-md"
                    @update:model-value="expandRowPlease(props.row)"
                  />
                  <span>{{ props.row.serviceReqTicketId }}</span>
                </q-td>
                <q-td key="tid" :props="props"> {{ props.row.tid }}</q-td>
                <q-td key="mid" :props="props">
                  <span v-if="props.row.mid != null">{{ props.row.mid }}</span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="createdDate" :props="props">
                  {{ $moment(props.row.createdDate).format("Do MMM Y") }}
                </q-td>
                <q-td key="updatedDate" :props="props">
                  {{ $moment(props.row.updatedDate).format("Do MMM Y") }}
                </q-td>
                <q-td key="meName" :props="props"> {{ props.row.meName }}</q-td>
                <q-td key="bpRegion" :props="props">
                  {{ props.row.bpRegion ? props.row.bpRegion.regionAreaName : "NA" }}
                </q-td>
                <q-td key="assignedTo" :props="props">
                  {{ props.row.assignedTo == null ? "NA" : props.row.assignedTo.name }}
                </q-td>
                <q-td key="crmRemark" :props="props">
                  <span v-if="props.row.crmRemark != null" v-html="props.row.crmRemark"></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="deviceType" :props="props"> {{ props.row.deviceType }}</q-td>
                <q-td key="serviceRequestTicketStatus" :props="props">
                  <span class="label text-positive" v-if="props.row.serviceRequestTicketStatus == 1">
                    REQUEST_UNASSIGNED
                  </span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus == 2">
                    REQUEST_ASSIGNED
                  </span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus == 3">
                    REQUEST_CLOSED
                  </span>
                  <span class="label" v-else>NA</span>
                </q-td>
                <q-td key="serviceRequestMode" :props="props">
                  {{ props.row.serviceRequestMode == null ? "NA" : props.row.serviceRequestMode }}
                </q-td>
                <q-td key="serviceRequestSubTicketStatus" :props="props">
                  <span class="label text-positive" v-if="props.row.serviceRequestSubTicketStatus == 1">SR_TICKET_RAISED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 2">SR_TICKET_ESCALATED_TO_SAT</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 3">SR_ASSIGNED_TO_ENGINEER</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 4">SR_ISSUE_RESOLVED_COURIERED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 5">SR_DEVICE_COURIERED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 6">SR_ISSUE_RESOLVED_REMOTELY</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 7">SR_SCHEDULED_ENGINEER_VISIT</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 8">SR_ISSUE_RESOLVED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus == 9">SR_MERCHANT_NOT_REACHABLE</span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestSubTicketStatus == 10">SR_CANCELLED</span>
                  <span class="label" v-else>NA</span>
                </q-td>
              </q-tr>
              <!-- START: table expand values -->
              <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                <q-td colspan="100%">
                   <div class="row q-col-gutter-md q-pa-sm">
                      <div class="col-3">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">Request Type</div>
                        <div v-for="col in props.row.subTicketsList" :key="'type-'+col.id">
                          {{ col.serviceRequestType ? col.serviceRequestType.name : "NA" }}
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="text-left q-caption text-grey-8 text-weight-medium">IssueType</div>
                        <div v-for="col in props.row.subTicketsList" :key="'issue-'+col.id">
                           {{ col.serviceRequestIssueType ? col.serviceRequestIssueType : "NA" }}
                        </div>
                      </div>
                      <div class="col-3">
                         <div class="text-left q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                         <div v-for="col in props.row.subTicketsList" :key="'status-'+col.id">
                            {{ col.serviceRequestSubTicketStatus ? col.serviceRequestSubTicketStatus.name : "NA" }}
                         </div>
                      </div>
                      <div class="col-3">
                         <div class="text-left q-caption text-grey-8 text-weight-medium">Service Remarks</div>
                         <div v-for="col in props.row.subTicketsList" :key="'rem-'+col.id">
                            {{ col.serviceRemarks || "NA" }}
                         </div>
                      </div>
                   </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By ServiceReqTicketId, TID .."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
      <div class="row items-center gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center"></div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import opened from "../../components/sat/opened.vue";
import cancelledInternal from "../../components/sat/cancelledInternal.vue";

export default {
  name: "internalserviceRequest",
  components: {
    opened,
    cancelledInternal
  },
  data() {
    return {
      filterSearch: "",
      selectedTab: "opened",
      internalClosedTableData: [],
      tableData2: [],
      paginationControl2: {
        sortBy: "createdDate",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      tableAjaxLoading: false,
      columnDataclosed: [
        { name: "serviceReqTicketId", label: "ServiceReqTicketId", align: "left", field: "serviceReqTicketId", sortable: false },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: false },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: false },
        { name: "createdDate", label: "CreatedDate", align: "left", field: "createdDate", sortable: true },
        { name: "updatedDate", label: "UpdatedDate", align: "left", field: "updatedDate", sortable: false },
        { name: "meName", label: "ME Name", align: "left", field: "meName", sortable: false },
        { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName, sortable: false },
        { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo?.name, sortable: false },
        { name: "crmRemark", label: "CRM Remark", align: "left", field: "crmRemark", sortable: false },
        { name: "deviceType", label: "DeviceType", align: "left", field: "deviceType", sortable: false },
        { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus", sortable: false },
        { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode", sortable: false },
        { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus", sortable: false }
      ],
      formData: {
          marsDeviceIdsCookedUnAssinged: []
      }
    };
  },
  computed: {
    ...mapGetters("serviceRequestSat", ["getserviceRequestUnassignedDatas", "getserviceRequestassignedDatas", "getserviceRequestClosedDatas"])
  },
  created() {
    this.ajaxLoadAllLeadInfo2({
      pagination: this.paginationControl2,
      filter: this.filterSearch
    });
  },
  methods: {
    ...mapActions("serviceRequestSat", ["FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS", "FETCH_ASSIGNED_SERVICE_REQUEST_DATAS", "FETCH_CLOSED_SERVICE_REQUEST_DATAS"]),

    ajaxLoadAllLeadInfo2({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_CLOSED_SERVICE_REQUEST_DATAS({ pagination, filter })
        .then(() => {
          this.paginationControl2 = pagination;
          this.paginationControl2.rowsNumber = this.getserviceRequestClosedDatas.totalElements;
          this.paginationControl2.page = this.getserviceRequestClosedDatas.number + 1;

          this.tableData2 = this.getserviceRequestClosedDatas.content;
          this.internalClosedTableData = this.tableData2.filter(service => service.source == true);

          if (this.getserviceRequestClosedDatas.sort != null && this.getserviceRequestClosedDatas.sort.length > 0) {
            this.paginationControl2.sortBy = this.getserviceRequestClosedDatas.sort[0].property;
            this.paginationControl2.descending = !this.getserviceRequestClosedDatas.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    goToUnassignedTab(tab) {
      if (tab == "unAssigned") {
          // Note: tab names might differ from actual components
      } else if (tab == "closed") {
        this.ajaxLoadAllLeadInfo2({
          pagination: this.paginationControl2,
          filter: this.filterSearch
        });
      }
    },
    expandRowPlease(row) {},
  }
};
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}
.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>
