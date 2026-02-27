<template>
  <q-page>
    <div class="q-pa-none">
      <q-pull-to-refresh :handler="PullToRefresh" inline>
        <!--START: table title -->
        <div
          class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >POS Inventory</div>
        <!--END: table title -->
        <!-- //Common lead information in popup -->
        <generalLeadInformation
          v-if="propToggleLeadInformation"
          :leadInformation="addtnLeadInformation"
          :propToggleLeadInformationPop="propToggleLeadInformation"
          @closeLeadInformation="toggleLeadInformation"
        />
        <!-- content -->
        <!--START: table lead validation -->
        <q-table
          table-class="customTableClass"
          :rows="tableData"
          :columns="columns"
          :filter="filter" v-model:pagination="paginationControl"
          row-key="id"
          :loading="toggleAjaxLoadFilter"
          :rows-per-page-options="[5,10,15,20]"
          @request="ajaxLoadAllLeadInfo"
          class="shadow-0"
        >
          <template v-slot:body-cell-deviceType="props">
            <q-td :props="props">
              <span class="label text-primary">
                {{ props.row.device ? props.row.device.deviceName : 'NA' }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-deviceCount="props">
            <q-td :props="props">
              {{props.row == null? 'NA':props.row.deviceCount}}
            </q-td>
          </template>

          <template v-slot:body-cell-dateofSubmission="props">
            <q-td :props="props">
              <span class="label">{{ $moment(props.row.financeSubmissionDate).format("Do MMM Y") }}</span>
            </q-td>
          </template>

          <template v-slot:top="props">
            <!--START: table search -->
            <div class="col">
              <q-input
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Type.."
                label="Search by Request Number"
                class="q-mr-lg q-py-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-md-6">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download Report"
                class="q-mr-lg q-py-sm float-right"
                size="md"
                @click="downloadPOSReport()" />
            </div>
            <!--END: table filter,search -->
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                v-if ="props.row.status == 0"
                push
                class="q-mx-sm fixed-width-btn"
                color="positive"
                size="sm"
                @click="fnApproveFinance(props.row)"
                >Approve</q-btn
              >
              <q-btn
                v-if ="props.row.status == 0"
                disable
                push
                class="q-mx-sm fixed-width-btn"
                color="purple-9"
                size="sm"
                >View Invoice Copy</q-btn
              >
              <q-btn
                v-if ="props.row.status == 1"
                disable
                push
                class="q-mx-sm fixed-width-btn"
                color="negative"
                size="sm"
                >Already Approved</q-btn
              >
              <q-btn
                v-if ="props.row.status == 1"
                highlight
                push
                class="q-mx-sm fixed-width-btn"
                color="purple-9"
                size="sm"
                @click="fnPDFViewModal(props.row.invoiceCopy)"
                >View Invoice Copy</q-btn
              >
            </q-td>
          </template>
        </q-table>
      </q-pull-to-refresh>

      <!--START >>  Download Reports -->
      <DownloadPOSInventoryReport
        v-if="propDeviceHistoryReport"
        :propDeviceHistoryReport="propDeviceHistoryReport" 
        @emitfnshowDeviceHistory="downloadPOSReport"
      ></DownloadPOSInventoryReport>
      <!--END:  Download Reports-->

      <UpdatePOSInventory
        v-if="propShowPosInventory"
        :propShowPosInventory="propShowPosInventory"
        :propRowDetails="propRowDetails"
        @emitfnshowPosInventory="fnApproveFinance"
      ></UpdatePOSInventory>

      <showPdfFinanceModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      ></showPdfFinanceModalComponent>

      <!--START >>  Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
      <!--END >>  Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UpdatePOSInventory from "../../components/sat/UpdatePOSInventory.vue";
import showPdfFinanceModalComponent from "../../components/sat/showPdfFinanceModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import DownloadPOSInventoryReport from "../../components/inventory/DownloadPOSInventoryReport.vue";

export default {
  name: "PosInventory",
  components: {
    UpdatePOSInventory,
    generalLeadInformation,
    showPdfFinanceModalComponent,
    DownloadPOSInventoryReport
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      showOpenPaymentChequeDocumentInfo: false,
      toggleshowPDFModal: false,
      propDeviceHistoryReport: false,
      propShowPosInventory: false,
      propRowDetails: null,
      PDFDetails: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "financeSubmissionDate",
        descending: true,
        rowsPerPage: 10
      },
      tableData: [],
      filter: ""
    };
  },
  computed: {
    ...mapGetters("LostFinance", ["getPosInventoryDatas"])
  },
  mounted () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("LostFinance", ["FETCH_POS_INVENTORY_FINANCE", "APPROVE_LOST_STOLEN_EXCEPTION"]),
    PullToRefresh(done) {
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: this.filter
      });
      done();
    },
    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_POS_INVENTORY_FINANCE({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getPosInventoryDatas.totalElements;
        this.paginationControl.page = this.getPosInventoryDatas.number + 1;
        this.tableData = this.getPosInventoryDatas.content;
        if (this.getPosInventoryDatas.sort != null) {
          this.paginationControl.sortBy = this.getPosInventoryDatas.sort[0].property;
          this.paginationControl.descending = this.getPosInventoryDatas.sort[0].ascending;
        }
        this.$q.loading.hide();
      }).catch(() => {
        this.$q.loading.hide();
      });
    },
    fnApproveFinance(rowDetails) {
      this.propShowPosInventory = !this.propShowPosInventory;
      this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails;
      }
    },
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    downloadPOSReport(){
      this.propDeviceHistoryReport = !this.propDeviceHistoryReport;
    },
    toggleLeadInformation (leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    }
  }
};
</script>

<style scoped>
.fixed-width-btn {
  width: 121px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
