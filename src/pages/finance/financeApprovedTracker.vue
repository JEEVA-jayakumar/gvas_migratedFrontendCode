<template>
  <q-page>
    <div class="q-pa-md">
        <!--START: table title -->
        <div
          class="col-md-12 capitalize text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >
          {{ pageTitle }}
        </div>
        <!--END: table title -->
        <!-- table finance approved tracker -->
        <q-tabs v-model="activeTab" class="shadow-1 bg-grey-1" active-color="purple-9" indicator-color="purple-9" @update:model-value="goToQrMerchant">
          <q-tab name="tab-1" label="Pos Merchant" />
          <q-tab name="tab-2" label="QR Merchant" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated keep-alive>
          <q-tab-panel name="tab-1" class="no-padding overflow-hidden">
            <q-table
              table-class="customTableClass"
              :rows="tableData"
              :columns="columns"
              :filter="filter"
              v-model:pagination="paginationControl"
              :rows-per-page-options="[5, 10, 15, 20]"
              @request="ajaxLoadAllFinanceApprovedData"
              row-key="leadNumber"
              class="shadow-0"
            >
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  <span class="capitalize">{{ $moment(props.row.submissionDate).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-approvedDate="props">
                <q-td :props="props">
                  <span class="label">{{ $moment(props.row.approvedDate).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-submittedToFinanceDate="props">
                <q-td :props="props">
                  <span class="label">{{ $moment(props.row.submittedToFinanceDate).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-leadNumber="props">
                <q-td :props="props">
                  <span
                    class="text-primary cursor-pointer"
                    @click="toggleLeadInformation(props.row)"
                    ># {{ props.row.leadNumber }}</span
                  >
                </q-td>
              </template>

              <template v-slot:body-cell-updatedAt="props">
                <q-td :props="props">
                  <span class="label">{{ $moment(props.row.leadLastUpdated).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <!--START: table search, filter -->
              <template v-slot:top>
                <div class="col-md-5">
                  <q-input
                    clearable
                    v-model="filter"
                    color="grey-9"
                    placeholder="Type.."
                    label="Search .. "
                    class="q-mr-lg q-py-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-3"></div>
                <div class="col-md-4" align="right">
                  <q-btn outline color="dark" label="Download as excel" @click="downloadApproval" />
                </div>
              </template>
              <!--END: table search, filter -->
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2" class="no-padding overflow-hidden">
            <q-table
              table-class="customTableClass"
              :rows="tableData1"
              :columns="columns1"
              :filter="filter1"
              v-model:pagination="paginationControl1"
              :rows-per-page-options="[5, 10, 15, 20]"
              @request="ajaxLoadAllFinanceQrApprovedData"
              row-key="qrLeadNumber"
              class="shadow-0"
            >
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  <span class="capitalize">{{ $moment(props.row.submissionDate).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-approvedDate="props">
                <q-td :props="props">
                  <span class="label">{{ $moment(props.row.approvedDate).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-submittedToFinanceDate="props">
                <q-td :props="props">
                  <span class="label">{{ $moment(props.row.submittedToFinanceDate).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-qrLeadNumber="props">
                <q-td :props="props">
                  <span
                    class="text-primary cursor-pointer"
                    @click="toggleQrLeadInformation(props.row)"
                    ># {{ props.row.qrLeadNumber }}</span
                  >
                </q-td>
              </template>

              <template v-slot:body-cell-updatedAt="props">
                <q-td :props="props">
                  <span class="label">{{ $moment(props.row.leadLastUpdated).format("Do MMM Y") }}</span>
                </q-td>
              </template>

              <!--START: table search, filter -->
              <template v-slot:top>
                <div class="col-md-5">
                  <q-input
                    clearable
                    v-model="filter1"
                    color="grey-9"
                    placeholder="Type.."
                    label="Search .. "
                    class="q-mr-lg q-py-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-3"></div>
                <div class="col-md-4" align="right">
                  <q-btn outline color="dark" label="Download as excel" @click="downloadQrApproval" />
                </div>
              </template>
              <!--END: table search, filter -->
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
    </div>

    <!-- //Common lead information in popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />
    <generalQrLeadInformation
      v-if="propToggleQrLeadInformation"
      :qrLeadInformation="addQrLeadInformation"
      :propToggleQrLeadInformationPop="propToggleQrLeadInformation"
      @closeQrLeadInformation="toggleQrLeadInformation"
    />
    <downloadFinanceapproval
    v-if="propFinanceApprovalDatas"
    :propFinanceApprovalDatas="propFinanceApprovalDatas"
    @emitfnshowFinanceapproval="downloadApproval"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import generalLeadInformation from "../../components/generalLeadInformation.vue";
import generalQrLeadInformation from "../../components/generalQrLeadInformation.vue";
import downloadFinanceapproval from "../../components/finance/downloadFinanceapproval.vue";
export default {
  name: "financeApprovedtracker",
  components: {
    generalLeadInformation,
    downloadFinanceapproval,
    generalQrLeadInformation
  },
  data() {
    return {
      activeTab: "tab-1",
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      propFinanceApprovalDatas: false,
      propToggleQrLeadInformation: false,
      addQrLeadInformation: null,
      excelFields: [],
      columnFields: null,
      formData: {},
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "leadNumber",
        descending: false,
        rowsPerPage: 10,
      },
      paginationControl1: {
        rowsNumber: 10,
        page: 1,
        sortBy: "qrLeadNumber",
        descending: false,
        rowsPerPage: 10
      },
      // To expand table rows
      filter: "",
      filter1: "",
      // Datatable data
      columns: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: (row) => {
            return "# " + row.leadNumber;
          },
          sortable: true,
        },
        {
          name: "leadName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: "merchantName",
          sortable: true,
        },
        {
          name: "assignedTo.name",
          required: true,
          label: "SO Name",
          align: "left",
          field: "soName",
          sortable: true,
        },
        {
          name: "createdAt",
          required: true,
          label: "Submission Date",
          align: "left",
          field: "submissionDate",
          sortable: true,
        },
        {
          name: "submittedToFinanceDate",
          required: true,
          label: "Date",
          align: "center",
          field: "submittedToFinanceDate",
          sortable: true,
        },
        {
          name: "referenceNumber",
          required: true,
          label: "Payment Reference",
          align: "left",
          field: "paymentReference",
          sortable: true,
        },
        {
          name: "setupFees",
          required: true,
          label: "Amount (INR)",
          align: "left",
          field: "amount",
          sortable: true,
        },
        {
          name: "updatedAt",
          required: true,
          label: "TID Activation Date",
          align: "left",
          field: "leadLastUpdated",
          sortable: true
        }
      ],
      columns1: [
        {
          name: "qrLeadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: row => {
            return "# " + row.qrLeadNumber;
          },
          sortable: true
        },
        {
          name: "leadName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: "merchantName",
          sortable: false
        },
        {
          name: "assignedTo.name",
          required: true,
          label: "SO Name",
          align: "left",
          field: "soName",
          sortable: false
        },
        {
          name: "createdAt",
          required: true,
          label: "Submission Date",
          align: "left",
          field: "submissionDate",
          sortable: false
        },
        {
          name: "referenceNumber",
          required: true,
          label: "Payment Reference",
          align: "left",
          field: row => {
            return  row.paymentReference == null ? 'NA' : row.paymentReference;
          },
          sortable: false
        },
        {
          name: "setupFees",
          required: true,
          label: "Amount (INR)",
          align: "left",
          field: "amount",
          sortable: false
        }
      ],
      tableData: [],
      tableData1: []
    };
  },
  computed: {
    ...mapGetters("Finance", ["getAllApprovedFinaceData"]),
    ...mapGetters("commonLoader", ["getToggleCommonLoader"]),
    ...mapGetters("qrFinance", ["getstaticQrApprovedTrackerData"]),
    pageTitle() {
      if (this.$route.name == 'tidRentalTracker') return "Rental Tracker";
      if (this.$route.name == 'invoiceGenerator') return "Invoice Generator";
      return "Finance Approved Tracker";
    }
  },

  mounted() {
    this.ajaxLoadAllFinanceApprovedData({
      pagination: this.paginationControl,
      filter: this.filter
    });
    this.ajaxLoadAllFinanceQrApprovedData({
      pagination: this.paginationControl1,
      filter: this.filter1
    });
  },

  methods: {
    ...mapActions("Finance", ["FETCH_ALL_APPROVED_FINANCE_DATA"]),
    ...mapActions("reports", ["REPORT_FINANCE_APPROVED","REPORT_QR_FINANCE_APPROVED"]),
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    ...mapActions("qrFinance", [ "FETCH_ALL_APPROVED_QR_FINANCE_DATA"]),

    goToQrMerchant(tab) {
      if (tab == "tab-2") {
        this.ajaxLoadAllFinanceQrApprovedData({ pagination: this.paginationControl1, filter: this.filter1 });
      } else {
        this.ajaxLoadAllFinanceApprovedData({ pagination: this.paginationControl, filter: this.filter });
      }
    },

    // Function to toggle lead information pop up screen
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    toggleQrLeadInformation(qrLeadDetails) {
      this.propToggleQrLeadInformation = !this.propToggleQrLeadInformation;
      if (qrLeadDetails != undefined) {
        this.addQrLeadInformation = qrLeadDetails;
      }
    },
    //Function pull to refresh
    PullToRefresh(done) {
      if (this.activeTab === 'tab-1') {
        this.ajaxLoadAllFinanceApprovedData({ pagination: this.paginationControl, filter: this.filter });
      } else {
        this.ajaxLoadAllFinanceQrApprovedData({ pagination: this.paginationControl1, filter: this.filter1 });
      }
      done();
    },

    ajaxLoadAllFinanceApprovedData({ pagination, filter }) {
      // we set QTable to "loading" state
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.FETCH_ALL_APPROVED_FINANCE_DATA({ pagination, filter }).then((res) => {
          // updating pagination to reflect in the UI
          this.paginationControl = pagination;

          // we also set (or update) rowsNumber
          this.paginationControl.rowsNumber = this.getAllApprovedFinaceData.totalElements;
          this.paginationControl.page = this.getAllApprovedFinaceData.number + 1;

          // then we update the rows with the fetched ones
          this.tableData = this.getAllApprovedFinaceData.content;
          if (this.getAllApprovedFinaceData.sort != null) {
            this.paginationControl.sortBy = this.getAllApprovedFinaceData.sort[0].property;
            this.paginationControl.descending = this.getAllApprovedFinaceData.sort[0].ascending;
          }
          // finally we tell QTable to exit the "loading" state
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    ajaxLoadAllFinanceQrApprovedData({ pagination, filter }) {
      // we set QTable to "loading" state
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_ALL_APPROVED_QR_FINANCE_DATA({ pagination, filter }).then(res => {
          // updating pagination to reflect in the UI
          this.paginationControl1 = pagination;
          // we also set (or update) rowsNumber
          this.paginationControl1.rowsNumber = this.getstaticQrApprovedTrackerData.totalElements;
          this.paginationControl1.page =
            this.getstaticQrApprovedTrackerData.number + 1;

          // then we update the rows with the fetched ones
          this.tableData1 = this.getstaticQrApprovedTrackerData.content;
          if (this.getstaticQrApprovedTrackerData.sort != null) {
            this.paginationControl1.sortBy = this.getstaticQrApprovedTrackerData.sort[0].property;
            this.paginationControl1.descending = this.getstaticQrApprovedTrackerData.sort[0].ascending;
          }

          // finally we tell QTable to exit the "loading" state
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    downloadApproval() {
      this.propFinanceApprovalDatas = !this.propFinanceApprovalDatas;
    },

    downloadQrApproval() {
       this.propFinanceApprovalDatas = !this.propFinanceApprovalDatas;
    },

    downloadReport() {
      this.$q.loading.show({
        delay: 100 // ms
      });
      this.REPORT_FINANCE_APPROVED(this.formData)
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Success, file has been downloaded",
            icon: "check"
          });
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again",
            icon: "thumb_down"
          });
        });
    },
    downloadQrReport() {
      this.$q.loading.show({
        delay: 100 // ms
      });
      this.REPORT_QR_FINANCE_APPROVED(this.formData)
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Success, file has been downloaded",
            icon: "check"
          });
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again",
            icon: "thumb_down"
          });
        });
    },
  }
};
</script>

<style></style>
