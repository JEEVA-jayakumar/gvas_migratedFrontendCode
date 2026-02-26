<template>
  <q-page>
    <div>
      <q-tabs
        v-model="activeTab"
        class="shadow-1 bg-grey-1"
        active-color="purple-9"
        indicator-color="purple-9"
        @update:model-value="goToCompleteTab"
      >
        <q-tab
          name="tab-1"
          label="PPE Service Request"
        />
        <q-tab
          name="tab-2"
          label="Completed Tickets"
        />
        <q-tab
          name="tab-3"
          label="Phonepe Paper Roll"
        />
      </q-tabs>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="tab-1" class="no-padding">
          <div class="row items-center q-pa-md">
            <div class="col-auto q-mr-md">
              <strong>
                Open For
              </strong>
            </div>
            <q-select
              class="col"
              v-model="formData.date"
              :options="dateType"
              color="grey"
              emit-value
              map-options
              @update:model-value="dateClick"
            >
            </q-select>
            <div class="col-md-3">
              <q-btn
                square
                icon="fa fa-download"
                color="purple-9"
                label="Download"
                class="q-mr-lg q-py-sm float-right"
                size="md"
                @click="downloadPhonepeCallback()"
              />
            </div>
            <div class="col-4"></div>
            <q-input
              class="col-3"
              clearable
              color="grey-9"
              v-model="filter"
              placeholder="Type.."
              label="Search By Ticket No, Merchant No..."
            />
          </div>
          <q-table
            table-class="customTableClass"
            class="q-py-none shadow-0"
            :rows="tableData"
            :columns="columns"
            :filter="filter"
            :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl"
            :loading="toggleAjaxLoadFilter"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                  v-if="props.row.serviceRequestTicketStatus != 5 && props.row.serviceRequestTicketStatus != 3 && props.row.serviceRequestTicketStatus != 8 && props.row.serviceRequestTicketStatus != 2"
                    color="purple-9"
                    icon="assignment_turned_in"
                    label="Pick Ticket"
                    @click="toggleActionBar(props.row)"
                    size="sm"
                    no-wrap
                  />
                  <span
                  class="label text-orange"
                  v-if="props.row.serviceRequestTicketStatus == 5"
                  ><b>Moved to SAT</b></span>
                  <span
                  class="label text-green"
                  v-if="props.row.serviceRequestTicketStatus == 3"
                  ><b>Completed</b></span>
                  <span
                  class="label text-secondary"
                  v-if="props.row.serviceRequestTicketStatus == 2"
                  ><b>Assigned</b></span>
                  <q-btn
                    v-if="props.row.serviceRequestTicketStatus == 8"
                    color="primary"
                    icon="arrow_forward"
                    label="Continue"
                    @click="toggleActionBar(props.row)"
                    size="sm"
                    no-wrap
                  />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-updateRemarks="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding items-center">
                  <q-btn
                    :disable="props.row.serviceRequestTicketStatus != 1"
                    no-caps
                    icon="edit"
                    color="purple-9"
                    size="xs"
                    round
                    @click="toggleAddremarks(props.row)"
                  />
                  <span
                    class="q-ma-sm"
                    v-if="props.row.crmRemark != null"
                    v-html="props.row.crmRemark"
                  ></span>
                  <span class="q-ma-sm" v-else>NA</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-createdDate="props">
              <q-td :props="props">{{
                  props.row == null
                    ? "NA"
                    : $moment(props.row.createdDate).format("Do MMM Y")
                }}</q-td>
            </template>
            <template v-slot:body-cell-tat="props">
              <q-td :props="props">
                <span :style="getHoursAgoColor(props.row.createdDate)">{{
                  getHoursAgo(props.row.createdDate)
                }}</span>
              </q-td>
            </template>

          </q-table>
        </q-tab-panel>
        <q-tab-panel name="tab-2" class="no-padding">
          <div class="row q-pa-md">
            <q-input
              class="col-4"
              clearable
              color="grey-9"
              v-model="filter1"
              placeholder="Type.."
              label="Search By Ticket No, Merchant No..."
            />
            <div class="col-md-6">
              <q-btn
                square
                icon="fa fa-download"
                color="purple-9"
                label="Download"
                class="q-mr-lg q-py-sm float-right"
                size="md"
                @click="downloadPhonepeCompletedTicket()"
              />
            </div>
          </div>
          <q-table
            table-class="customTableClass"
            class="q-py-none shadow-0"
            :rows="tableData1"
            :columns="columns2"
            :filter="filter1"
            :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl1"
            :loading="toggleAjaxLoadFilter1"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-updateRemarks="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <span
                    class="q-ma-sm"
                    v-if="props.row.crmRemark != null"
                    v-html="props.row.crmRemark"
                  ></span>
                  <span class="q-ma-sm" v-else>NA</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-createdDate="props">
              <q-td :props="props">{{
                  props.row == null
                    ? "NA"
                    : $moment(props.row.createdDate).format("Do MMM Y")
                }}</q-td>
            </template>
            <template v-slot:body-cell-updatedDate="props">
              <q-td :props="props">{{
                  props.row == null
                    ? "NA"
                    : $moment(props.row.updatedDate).format("Do MMM Y")
                }}</q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="tab-3" class="no-padding">
          <q-tabs
            v-model="paperRollActiveTab"
            class="shadow-1 bg-grey-1"
            active-color="purple-9"
            indicator-color="purple-9"
            @update:model-value="goToPaperRollActiveTab"
          >
            <q-tab
              name="tab-4"
              label="Pending Tickets"
            />
            <q-tab
              name="tab-5"
              label="Completed Tickets"
            />
          </q-tabs>
          <q-tab-panels v-model="paperRollActiveTab" animated>
            <q-tab-panel name="tab-4" class="no-padding">
              <div class="row items-center q-pa-md">
                <div class="col-auto q-mr-md">
                  <strong>
                    Open For
                  </strong>
                </div>
                <q-select
                  class="col"
                  v-model="formData.date1"
                  :options="dateTypePaperRoll"
                  color="grey"
                  emit-value
                  map-options
                  @update:model-value="dateClickPaperRoll"
                >
                </q-select>
                <div class="col-5"></div>
                <q-input
                  class="col-5"
                  clearable
                  color="grey-9"
                  v-model="filter3"
                  placeholder="Type.."
                  label="Search By Ticket No, Merchant No..."
                />
              </div>
              <q-table
                table-class="customTableClass"
                class="q-py-none shadow-0"
                :rows="tableData3"
                :columns="columns3"
                :filter="filter3"
                :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl3"
                :loading="toggleAjaxLoadFilter3"
                @request="ajaxLoadAllLeadInfo3"
              >
                <template v-slot:body-cell-createdDate="props">
                  <q-td :props="props">{{
                      props.row == null
                        ? "NA"
                        : $moment(props.row.createdDate).format("Do MMM Y")
                    }}</q-td>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel name="tab-5" class="no-padding">
              <div class="row q-pa-md">
                <q-input
                  class="col-4"
                  clearable
                  color="grey-9"
                  v-model="filter4"
                  placeholder="Type.."
                  label="Search By Ticket No, Merchant No..."
                />
              </div>
              <q-table
                table-class="customTableClass"
                class="q-py-none shadow-0"
                :rows="tableData4"
                :columns="columns4"
                :filter="filter4"
                :rows-per-page-options="[5, 10, 15]" v-model:pagination="paginationControl4"
                :loading="toggleAjaxLoadFilter4"
                @request="ajaxLoadAllLeadInfo4"
              >
                <template v-slot:body-cell-createdDate="props">
                  <q-td :props="props">{{
                      props.row == null
                        ? "NA"
                        : $moment(props.row.createdDate).format("Do MMM Y")
                    }}</q-td>
                </template>
                <template v-slot:body-cell-updatedDate="props">
                  <q-td :props="props">{{
                      props.row == null
                        ? "NA"
                        : $moment(props.row.updatedDate).format("Do MMM Y")
                    }}</q-td>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <phonepeRemarks
      v-if="propToggleRemarks"
      :remarksInfo="addBasicInformation"
      :propToggleRemarksPop="propToggleRemarks"
      @reloadPhonepePendingDetails="
        loadingData({
          pagination: paginationControl,
          filter: filter,
          date: formData.date
        })
      "
      @closeRemarksInfo="toggleAddremarks"
    />

    <ticketActionBar
      v-if="propToggleActionBar"
      :ActionBarInfo="addActionBarInformation"
      :propToggleActionBarPop="propToggleActionBar"
      @reloadPhonepePendingDetails="
        loadingData({
          pagination: paginationControl,
          filter: filter,
          date: formData.date
        })
      "
      @closeActionBarInfo="toggleActionBar"
    />

    <PhonepeEscalateToSat
      v-if="propToggleEscalateToSat"
      :escalateToSatData="escalateToSatInfo"
      :propToggleEscalatetoSatPop="propToggleEscalateToSat"
      @closeEscalateToSat="fnEscalateToSat"
    />
    <PhonepeTicketResolve
      v-if="proptoggleTicketResolve"
      :resolveData="resolveInfo"
      :propToggleResolve="proptoggleTicketResolve"
      @closeResolve="fnResolve"
    />
    <PhonepeTicketCallback
      v-if="proptoggleTicketCallback"
      :resolveDataCallback="resolveInfoppe"
      :propToggleResolveCallback="proptoggleTicketCallback"
      @closeResolveCallback="fnPPE"
    />
    <DownloadPhonepeCrmReport
      v-if="propPhonepeCrmCallback"
      :propPhonepeCrmCallback="propPhonepeCrmCallback"
      @emitfnshowPhonepeCrmCallback="downloadPhonepeCallback"
    />
    <DownloadPhonepeCrmCompletedReport
      v-if="propPhonepeCompletedTicket"
      :propPhonepeCompletedTicket="propPhonepeCompletedTicket"
      @emitfnshowPhonepeCrmComplete="downloadPhonepeCompletedTicket"
    />
    <div
      v-if="
        toggleAjaxLoadFilter ||
          toggleAjaxLoadFilter1 ||
          toggleAjaxLoadFilter3 ||
          toggleAjaxLoadFilter4
      "
      class="fullscreen spinner-overlay"
    >
      <q-spinner-bars
        class="absolute-center"
        style="color:#61116a"
        :size="35"
      />
    </div>
  </q-page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import phonepeRemarks from "../../components/crm/phonepeRemarks.vue";
import PhonepeEscalateToSat from "../../components/crm/phonepeEscalateToSat.vue";
import PhonepeTicketResolve from "../../components/crm/phonepeTicketResolve.vue";
import PhonepeTicketCallback from "../../components/crm/PhonepeTicketCallback.vue";
import DownloadPhonepeCrmReport from "../../components/inventory/DownloadPhonepeCrmReport.vue";
import DownloadPhonepeCrmCompletedReport from "../../components/inventory/DownloadPhonepeCrmCompletedReport.vue";
import ticketActionBar from "../../components/crm/ticketActionBar.vue";
export default {
  name: "phonePeCrm",
  components: {
    phonepeRemarks,
    PhonepeEscalateToSat,
    PhonepeTicketResolve,
    PhonepeTicketCallback,
    DownloadPhonepeCrmReport,
    DownloadPhonepeCrmCompletedReport,
    ticketActionBar
  },
  data() {
    return {
      propToggleRemarks: false,
      propToggleActionBar: false,
      propPhonepeCrmCallback: false,
      propPhonepeCompletedTicket: false,
      propToggleEscalateToSat: false,
      proptoggleTicketResolve: false,
      proptoggleTicketCallback: false,
      propToggleViewRemarks: false,
      escalateToSatInfo: "",
      resolveInfo: "",
      resolveInfoppe: "",
      addBasicInformation: {
        remarks: null,
        action: 0
      },
      addActionBarInformation: {
        data: null
      },
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      toggleAjaxLoadFilter3: false,
      toggleAjaxLoadFilter4: false,
      activeItemId: 0,
      activeTab: "tab-1",
      paperRollActiveTab: "tab-4",
      filter: "",
      filter1: "",
      filter3: "",
      filter4: "",
      paginationControl: {
        rowsNumber: 5,
        page: 1,
        sortBy: "createdDate",
        descending: false,
        rowsPerPage: 5
      },

      paginationControl1: {
        rowsNumber: 5,
        page: 1,
        sortBy: "createdDate",
        descending: false,
        rowsPerPage: 5
      },
      paginationControl3: {
        rowsNumber: 5,
        page: 1,
        sortBy: "createdDate",
        descending: false,
        rowsPerPage: 5
      },
      paginationControl4: {
        rowsNumber: 5,
        page: 1,
        sortBy: "createdDate",
        descending: false,
        rowsPerPage: 5
      },
      formData: {
        date: 1,
        date1: 0
      },
      //table information
      tableAjaxLoading: false,
      dateType: [
        {
          label: "Pending",
          value: 1
        },

        {
          label: "Completed",
          value: 2
        },
        {
          label: "SAT",
          value: 3
        }
      ],
      dateTypePaperRoll: [
        {
          label: "Today",
          value: 0
        },
        {
          label: "T+1",
          value: 1
        },
        {
          label: "T+2",
          value: 2
        },
        {
          label: "All",
          value: 3
        }
      ],
      columns: [
             {
          name: "createdDate",
          required: true,
          label: "Date",
          align: "left",
          field: "createdDate",
          sortable: true
        },
        {
          name: "serviceReqTicketId",
          required: true,
          label: "Ticket No",
          align: "left",
          field: row => {
            return row.serviceReqTicketId;
          },
          sortable: false
        },
        {
          name: "meName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: "meName",
             sortable: false
        },
        {
          name: "emailId",
          required: true,
          label: "Merchant Email",
          align: "left",
          field: "emailId",
               sortable: false
        },
        {
          name: "contactNumber",
          required: true,
          label: "Merchant No",
          align: "left",
          field: "contactNumber",
        sortable: false
        },
        {
          name: "name",
          required: true,
          label: "Status Reported",
          align: "left",
          field: row => {
            let issues = [];
            if (row.subTicketsList && row.subTicketsList.length > 0) {
              row.subTicketsList.forEach((element, index) => {
                if (element.serviceRequestType != null) {
                  issues.push(
                    (index + 1) + "." + element.serviceRequestType.name + "   "
                  );
                }
              });
            }
            return issues.length > 0 ? issues.join(", ") : "NA";
          },
          sortable: false
        },
   
        {
          name: "tat",
          required: true,
          label: "TAT",
          align: "left",
          field: "createdDate",
              sortable: false
        },
        {
          name: "Status",
          required: true,
          label: "Status",
          align: "left",
          field: row => {
            let issues = [];
            if (row.subTicketsList && row.subTicketsList.length > 0) {
              row.subTicketsList.forEach((element, index) => {
                if (element.serviceRequestSubTicketStatus != null) {
                  issues.push(
                    (index + 1) +
                      "." +
                      element.serviceRequestSubTicketStatus.name +
                      "   "
                  );
                }
              });
            }
            return issues.length > 0 ? issues.join(", ") : "NA";
          },
          sortable: false
        },

        {
          name: "action",
          required: true,
          label: "Action",
          align: "left",
          field: "action",
          sortable: false
        }
      ],
      columns2: [
              {
          name: "createdDate",
          required: true,
          label: "Open Date ",
          align: "left",
          field: "createdDate",
          sortable: true
        },
        {
          name: "serviceReqTicketId",
          required: true,
          label: "Ticket No",
          align: "left",
          field: "serviceReqTicketId",
          sortable: false
        },
        {
          name: "meName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: "meName",
         sortable: false
        },
        {
          name: "emailId",
          required: true,
          label: "Merchant Email",
          align: "left",
          field: "emailId",
   sortable: false
        },
        {
          name: "contactNumber",
          required: true,
          label: "Merchant Number",
          align: "left",
          field: "contactNumber",
            sortable: false
        },
        {
          name: "name",
          required: true,
          label: "Status Reported",
          align: "left",
          field: row => {
            let issues = [];
            if (row.subTicketsList && row.subTicketsList.length > 0) {
              row.subTicketsList.forEach((element, index) => {
                if (element.serviceRequestType != null) {
                  issues.push(
                    (index + 1) + "." + element.serviceRequestType.name + "   "
                  );
                }
              });
            }
            return issues.length > 0 ? issues.join(", ") : "NA";
          },
          sortable: false
        },
        {
          name: "updateRemarks",
          required: true,
          label: "Remarks",
          align: "left",
          field: "updateRemarks",
          sortable: false
        },
  
        {
          name: "updatedDate",
          required: true,
          label: "Closed Date",
          align: "left",
          field: "updatedDate",
        sortable: false
        }
      ],
      columns3: [
          {
          name: "createdDate",
          required: true,
          label: "Created Date",
          align: "left",
          field: "createdDate",
          sortable: true
        },
        {
          name: "serviceReqTicketId",
          required: true,
          label: "Ticket No",
          align: "left",
          field: row => {
            return row.serviceReqTicketId;
          },
       sortable: false
        },
        {
          name: "merchantName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => {
            return row.meName;
          },
          sortable: false
        },
        {
          name: "emailId",
          required: true,
          label: "Merchant Email",
          align: "left",
          field: row => {
            return row.emailId;
          },
          sortable: false
        },
        {
          name: "contactNumber",
          required: true,
          label: "Merchant No",
          align: "left",
          field: row => {
            return row.contactNumber;
          },
          sortable: false
        },

        {
          name: "address",
          required: true,
          label: "Merchant Address",
          align: "left",
          field: row => {
            return row.address;
          },
          sortable: false
        },
        {
          name: "count",
          required: true,
          label: "Count",
          align: "left",
          field: row => {
            return (row.subTicketsList && row.subTicketsList.length > 0) ? row.subTicketsList[0].paperRollCount : "NA";
          },
          sortable: false
        },
      ],
      columns4: [
        
        {
          name: "serviceReqTicketId",
          required: true,
          label: "Ticket No",
          align: "left",
          field: row => {
            return row.serviceReqTicketId;
          },
          sortable: true
        },
        {
          name: "merchantName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => {
            return row.meName;
          },
          sortable: false
        },
        {
          name: "emailId",
          required: true,
          label: "Merchant Email",
          align: "left",
          field: row => {
            return row.emailId;
          },
          sortable: false
        },
        {
          name: "contactNumber",
          required: true,
          label: "Merchant No",
          align: "left",
          field: row => {
            return row.contactNumber;
          },
          sortable: false
        },

        {
          name: "address",
          required: true,
          label: "Merchant Address",
          align: "left",
          field: row => {
            return row.address;
          },
          sortable: false
        },
        {
          name: "count",
          required: true,
          label: "Count",
          align: "left",
          field: row => {
            return (row.subTicketsList && row.subTicketsList.length > 0) ? row.subTicketsList[0].paperRollCount : "NA";
          },
          sortable: true
        },
        {
          name: "podNumber",
          required: true,
          label: "POD Number",
          align: "left",
          field: row => {
            return row.podNumber == null ? "NA" : row.podNumber;
          },
          sortable: true
        },
        {
          name: "createdDate",
          required: true,
          label: "Open Date",
          align: "left",
          field: "createdDate",
          sortable: true
        },
        {
          name: "updatedDate",
          required: true,
          label: "Close Date",
          align: "left",
          field: "updatedDate",
          sortable: true
        }
      ],
      tableData: [],
      tableData1: [],
      dataArray: [],
      completedDataArray: [],
      tableData3: [],
      tableData4: [],
    };
  },

  computed: {
    ...mapGetters("phonePeCrm", [
      "getPhonepeMerchantDetails",
      "getPhonepeCompletedData",
      "getphonepeDate",
      "getphonepePaperRoll",
      "getphonepeCompletedPaperRoll"
    ])
  },

  created() {
    this.loadingData({
      pagination: this.paginationControl,
      filter: this.filter,
      date: this.formData.date
    });
  },
  methods: {
    ...mapActions("phonePeCrm", [
      "FETCH_PHONEPE_CLIENT_CRM",
      "FETCH_PHONEPE_COMPLETED_DATA",
      "PHONEPE_CRM_DATE",
      "ASSIGN_TO_COMPLETE",
      "ESCALATE_TO_SAT",
      "PHONEPE_PAPER_ROLL_PENDING",
      "FETCH_PHONEPE_PAPER_ROLL_COMPLETED_DATA"
    ]),
    ajaxLoadAllLeadInfo(request) {
      let req = {
        pagination: request.pagination,
        filter: request.filter,
        date: this.formData.date
      };
      this.loadingData(req);
    },
    ajaxLoadAllLeadInfo3(request) {
      this.loadingData1({
        pagination: request.pagination,
        filter: request.filter,
        date: this.formData.date1
      });
    },

    loadingData(request) {
      this.toggleAjaxLoadFilter = true;
      this.PHONEPE_CRM_DATE(request)
        .then(() => {
          this.paginationControl = request.pagination;
          this.paginationControl.rowsNumber = this.getphonepeDate.totalElements;
          this.paginationControl.page = this.getphonepeDate.number + 1;
          this.tableData = this.getphonepeDate.content;

          if (this.getphonepeDate.sort != null) {
            this.paginationControl.sortBy = this.getphonepeDate.sort[0].property;
            this.paginationControl.descending = !this.getphonepeDate.sort[0].ascending;
          }
          this.toggleAjaxLoadFilter = false;
        })
        .catch(error => {
            this.toggleAjaxLoadFilter = false;
            const message = (error.body && error.body.message) ? error.body.message : "Please Try Again Later !";
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: message,
              icon: "thumb_down"
            });
            this.tableData = []
          });
    },
    dateClick(request) {
      this.filter = "";
      this.addBasicInformation.action = request;
      this.loadingData({
        pagination: this.paginationControl,
        filter: this.filter,
        date: request
      });
    },

    dateClickPaperRoll(request) {
      this.loadingData1({
        pagination: this.paginationControl3,
        filter: this.filter3,
        date: request
      });
    },
    goToPaperRollActiveTab(tab) {
      if (tab == "tab-4") {
        this.loadingData1({
            pagination: this.paginationControl3,
            filter: this.filter3,
            date: this.formData.date1
        });
      } else if (tab == "tab-5") {
        this.ajaxLoadAllLeadInfo4({
          pagination: this.paginationControl4,
          filter: this.filter4
        });
      }
    },

    loadingData1(request) {
      this.toggleAjaxLoadFilter3 = true;
      this.PHONEPE_PAPER_ROLL_PENDING(request)
        .then(() => {
          this.paginationControl3 = request.pagination;
          this.paginationControl3.rowsNumber = this.getphonepePaperRoll.totalElements;
          this.paginationControl3.page = this.getphonepePaperRoll.number + 1;
          this.tableData3 = this.getphonepePaperRoll.content;
          if (this.getphonepePaperRoll.sort != null) {
            this.paginationControl3.sortBy = this.getphonepePaperRoll.sort[0].property;
            this.paginationControl3.descending = !this.getphonepePaperRoll.sort[0].ascending;
          }
          this.toggleAjaxLoadFilter3 = false;
        })
        .catch(() => {
          this.toggleAjaxLoadFilter3 = false;
        });
    },

    fnResolve(request) {
      this.proptoggleTicketResolve = !this.proptoggleTicketResolve;
      this.resolveInfo = request;
      if (this.proptoggleTicketResolve == false) {
        this.loadingData({
          pagination: this.paginationControl,
          filter: this.filter,
          date: this.formData.date
        });
      }
    },

    fnEscalateToSat(request) {
      this.propToggleEscalateToSat = !this.propToggleEscalateToSat;
      this.escalateToSatInfo = request;
      if (this.propToggleEscalateToSat == false) {
        this.loadingData({
          pagination: this.paginationControl,
          filter: this.filter,
          date: this.formData.date
        });
      }
    },
    fnPPE(request) {
      this.proptoggleTicketCallback = !this.proptoggleTicketCallback;
      this.resolveInfoppe = request;
      if (this.proptoggleTicketCallback == false) {
        this.loadingData({
          pagination: this.paginationControl,
          filter: this.filter,
          date: this.formData.date
        });
      }
    },
    goToCompleteTab(tab) {
      if (tab == "tab-2") {
        this.ajaxLoadAllLeadInfo1({
          pagination: this.paginationControl1,
          filter: this.filter1
        });
        this.filter = "";
      } else if (tab == "tab-1") {
        this.loadingData({
          pagination: this.paginationControl,
          filter: this.filter,
          date: this.formData.date
        });
        this.filter1 = "";
      } else if (tab == "tab-3") {
          this.goToPaperRollActiveTab(this.paperRollActiveTab);
      }
    },

    ajaxLoadAllLeadInfo1(request) {
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_PHONEPE_COMPLETED_DATA(request).then(() => {
          this.paginationControl1 = request.pagination;
          this.paginationControl1.rowsNumber = this.getPhonepeCompletedData.totalElements;
          this.paginationControl1.page =
            this.getPhonepeCompletedData.number + 1;
          this.tableData1 = this.getPhonepeCompletedData.content;
          if (this.getPhonepeCompletedData.sort != null) {
            this.paginationControl1.sortBy = this.getPhonepeCompletedData.sort[0].property;
            this.paginationControl1.descending = !this.getPhonepeCompletedData.sort[0].ascending;
          }
          this.toggleAjaxLoadFilter1 = false;
        })
        .catch(() => {
          this.toggleAjaxLoadFilter1 = false;
        });
    },

    ajaxLoadAllLeadInfo4(request) {
      this.toggleAjaxLoadFilter4 = true;
      this.FETCH_PHONEPE_PAPER_ROLL_COMPLETED_DATA(request).then(() => {
          this.paginationControl4 = request.pagination;
          this.paginationControl4.rowsNumber = this.getphonepeCompletedPaperRoll.totalElements;
          this.paginationControl4.page =
            this.getphonepeCompletedPaperRoll.number + 1;
          this.tableData4 = this.getphonepeCompletedPaperRoll.content;
          if (this.getphonepeCompletedPaperRoll.sort != null) {
            this.paginationControl4.sortBy = this.getphonepeCompletedPaperRoll.sort[0].property;
            this.paginationControl4.descending = !this.getphonepeCompletedPaperRoll.sort[0].ascending;
          }
          this.toggleAjaxLoadFilter4 = false;
        })
        .catch(() => {
          this.toggleAjaxLoadFilter4 = false;
        });
    },

    downloadPhonepeCallback() {
      this.propPhonepeCrmCallback = !this.propPhonepeCrmCallback;
    },

    downloadPhonepeCompletedTicket() {
      this.propPhonepeCompletedTicket = !this.propPhonepeCompletedTicket;
    },

    toggleAddremarks(remarks) {
      this.propToggleRemarks = !this.propToggleRemarks;
      if (remarks != undefined) {
        this.addBasicInformation.remarks = remarks;
        this.addBasicInformation.action = this.formData.date;
      }
    },

    toggleActionBar(request) {
      this.propToggleActionBar = !this.propToggleActionBar;
      if (request != undefined) {
        this.addActionBarInformation.data = request;
      }
    },
    getHoursAgo(dateInMilliseconds) {
      const currentTime = Date.now();
      const differenceInMilliseconds = currentTime - dateInMilliseconds;
      const hoursAgo = differenceInMilliseconds / (1000 * 60 * 60);
      return 72 - Math.floor(hoursAgo);
    },
    getHoursAgoColor(dateInMilliseconds){
      const currentTime = Date.now();
      const differenceInMilliseconds = currentTime - dateInMilliseconds;
      const hoursAgo = differenceInMilliseconds / (1000 * 60 * 60);
      const colorData =  72 - Math.floor(hoursAgo);
      if (colorData > 0) {
          return 'color: green; font-weight: bold;'
        } else if (colorData < 0) {
          return 'color: red; font-weight: bold;'
        } else {
          return 'color: gray; font-weight: normal;'
        }
    }
  }
};
</script>
<style>
.customTabActive {
  background: purple;
  color: #fff;
}
.custom-green {
  color: #2e7d32; /* A darker green shade */
}
.custom-purple {
  color: #6a1b9a; /* Customize this with your preferred purple shade */
}
.custom-negative {
  color: #d32f2f; /* Customize this with your preferred shade */
}
</style>
