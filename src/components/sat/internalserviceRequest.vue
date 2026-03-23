<template>
  <div>
    <!-- content -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Bijlipay Service Request
    </div>
    <div>
      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
        <q-tab color="dark" name="opened" label="Opened" />
        <q-tab color="dark" name="closed" label="Closed" />
        <q-tab color="dark" name="cancel" label="cancelled" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="opened">
          <opened />
        </q-tab-panel>
        <q-tab-panel name="cancel">
          <cancelledInternal />
        </q-tab-panel>
        <q-tab-panel name="closed">
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
            <template v-slot:body="props">
              <q-tr :props="props" class="bottom-border">
                <q-td key="serviceReqTicketId">
                  <q-checkbox
                    checked-icon="fas fa-chevron-up"
                    unchecked-icon="fas fa-chevron-down"
                    color="grey-9"
                    v-model="props.row.expand"
                    class="q-mr-md"
                  />
                  <span>{{ props.row.serviceReqTicketId }}</span>
                </q-td>
                <q-td key="tid" :props="props">{{ props.row.tid }}</q-td>
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
                <q-td key="meName" :props="props">{{ props.row.meName }}</q-td>
                <q-td key="bpRegion" :props="props">{{ props.row.bpRegion?.regionAreaName || "NA" }}</q-td>
                <q-td key="assignedTo" :props="props">{{ props.row.assignedTo?.name || "NA" }}</q-td>
                <q-td key="crmRemark" :props="props">
                  <span v-if="props.row.crmRemark != null" v-html="props.row.crmRemark"></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="deviceType" :props="props">{{ props.row.deviceType }}</q-td>
                <q-td key="serviceRequestTicketStatus" :props="props">
                  <span class="label text-positive" v-if="props.row.serviceRequestTicketStatus == 1">REQUEST_UNASSIGNED</span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus == 2">REQUEST_ASSIGNED</span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus == 3">REQUEST_CLOSED</span>
                  <span class="label" v-else>NA</span>
                </q-td>
                <q-td key="serviceRequestMode" :props="props">{{ props.row.serviceRequestMode || "NA" }}</q-td>
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
              <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                <q-td colspan="100%">
                  <div class="row q-col-gutter-md">
                    <div class="col-2">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">Request Type</div>
                      <div v-for="col in props.row.subTicketsList" :key="'type-'+col.id">
                        {{ col.serviceRequestType?.name || "NA" }}
                      </div>
                    </div>
                    <div class="col-2">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">Issue Type</div>
                      <div v-for="col in props.row.subTicketsList" :key="'issue-'+col.id">
                        {{ col.serviceRequestIssueType || "NA" }}
                      </div>
                    </div>
                    <div class="col-2">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                      <div v-for="col in props.row.subTicketsList" :key="'status-'+col.id">
                        {{ col.serviceRequestSubTicketStatus?.name || "NA" }}
                      </div>
                    </div>
                    <div class="col-2">
                      <div class="text-left q-caption text-grey-8 text-weight-medium">Schedule Date</div>
                      <div v-for="col in props.row.subTicketsList" :key="'date-'+col.id">
                        {{ col.scheduleDate || "NA" }}
                      </div>
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.." label="Search By ServiceReqTicketId, TID .." class="q-mr-lg q-py-sm" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
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
      selectedTab: "opened",
      filterSearch: "",
      filterSearch1: "",
      filterSearch2: "",
      tableAjaxLoading: false,
      internalClosedTableData: [],
      paginationControl2: {
        sortBy: "createdDate",
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      columnDataclosed: [
        { name: "serviceReqTicketId", label: "ServiceReqTicketId", align: "left", field: "serviceReqTicketId" },
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "mid", label: "MID", align: "left", field: "mid" },
        { name: "createdDate", label: "CreatedDate", align: "left", field: "createdDate" },
        { name: "updatedDate", label: "UpdatedDate", align: "left", field: "updatedDate" },
        { name: "meName", label: "ME Name", align: "left", field: "meName" },
        { name: "bpRegion", label: "BpRegion", align: "left", field: row => row.bpRegion?.regionAreaName },
        { name: "assignedTo", label: "AssignedTo", align: "left", field: row => row.assignedTo?.name },
        { name: "crmRemark", label: "CRM Remark", align: "left", field: "crmRemark" },
        { name: "deviceType", label: "DeviceType", align: "left", field: "deviceType" },
        { name: "serviceRequestSubTicketStatus", label: "ServiceReqIssueStatus", align: "left", field: "serviceRequestSubTicketStatus" },
        { name: "serviceRequestMode", label: "RequestMode", align: "left", field: "serviceRequestMode" },
        { name: "serviceRequestTicketStatus", label: "TicketStatus", align: "left", field: "serviceRequestTicketStatus" }
      ]
    };
  },
  computed: {
    ...mapGetters("serviceRequestSat", ["getserviceRequestClosedDatas"])
  },
  created() {
    this.ajaxLoadAllLeadInfo2({
      pagination: this.paginationControl2,
      filter: this.filterSearch
    });
  },
  methods: {
    ...mapActions("serviceRequestSat", ["FETCH_CLOSED_SERVICE_REQUEST_DATAS", "FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS", "FETCH_ASSIGNED_SERVICE_REQUEST_DATAS"]),
    ajaxLoadAllLeadInfo2({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_CLOSED_SERVICE_REQUEST_DATAS({ pagination, filter }).then(() => {
        this.paginationControl2 = pagination;
        this.paginationControl2.rowsNumber = this.getserviceRequestClosedDatas.totalElements;
        this.paginationControl2.page = this.getserviceRequestClosedDatas.number + 1;
        this.internalClosedTableData = (this.getserviceRequestClosedDatas.content || []).filter(s => s.source === true);
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
      if (tab == "closed") {
        this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch });
      }
    }
  }
};
</script>
