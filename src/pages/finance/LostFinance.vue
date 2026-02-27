<template>
  <q-page>
    <div class="q-pa-none">
      <!--START: table title -->
      <div
        class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Lost Finance Approval Tracker</div>
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
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
        class="shadow-0"
      >
        <template v-slot:body-cell-tid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{ props.row.tid }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-mid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{ props.row.mid }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
            <span class="label text-primary"># {{ props.row.leadInformation ? props.row.leadInformation.leadNumber : 'NA' }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-mobileNumber="props">
          <q-td :props="props">
            {{ props.row.leadInformation == null ? 'NA' : props.row.leadInformation.contactNumber }}
          </q-td>
        </template>

        <template v-slot:body-cell-leadAddress="props">
          <q-td :props="props">
            {{ props.row.leadInformation == null ? 'NA' : props.row.leadInformation.leadAddress }}
          </q-td>
        </template>

        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td :props="props">
            <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              push
              class="q-mx-sm"
              color="positive"
              @click="openReject(props.row)"
              size="sm"
            >Reject</q-btn>
            <q-btn
              push
              class="q-mx-sm"
              color="negative"
              @click="openAccept(props.row)"
              size="sm"
            >Approve</q-btn>
          </q-td>
        </template>

        <template v-slot:top="props">
          <div class="col-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search Using Device Serial Number/TID"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>

      <!--START: Open Reject model -->
      <openRejectModel
        v-if="showRejectModel"
        :showRejectModel="showRejectModel"
        :propShowRejectComponent="propsRejectAppend"
        @reloadPaymentTrackerData="ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter })"
        @closeRejectModel="openReject"
      ></openRejectModel>
      <!--END: Open Reject model -->

      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      ></showMerchantTransactionLevelDetails>

      <!--START >> Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
      <!--END >> Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import openRejectModel from "../../components/finance/openRejectModel.vue";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "LostFinance",
  components: {
    openRejectModel,
    showMerchantTransactionLevelDetails,
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "tid",
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      showRejectModel: false,
      valueToggleMerchantTransaction: false,
      filter: "",
      propsRejectAppend: null,
      columns: [
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", required: true, label: "Lead Id", align: "left", field: row => row.leadInformation ? row.leadInformation.leadNumber : 'NA', sortable: false },
        { name: "leadInformation", required: true, label: "ME Name", align: "left", field: row => row.leadInformation ? row.leadInformation.leadName : 'NA', sortable: false },
        { name: "leadAddress", required: true, label: "Merchant Address", align: "center", field: row => row.leadInformation ? row.leadInformation.leadAddress : 'NA', sortable: false },
        { name: "deviceName", required: true, label: "Device type", align: "right", field: row => row.leadInformation && row.leadInformation.device ? row.leadInformation.device.deviceName : 'NA', sortable: false },
        { name: "device_serial_number", required: true, label: "Device Serial Number", align: "left", field: row => row.regionalInventory == null ? "NA" : row.regionalInventory.serialNumber, sortable: true },
        { name: "deviceStatusDate", required: true, label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", required: true, label: "Implemented by", align: "left", field: row => row.assignedTo == null ? "NA" : row.assignedTo.name, sortable: true },
        { name: "deviceAddress", required: true, label: "Implemented Address", align: "left", field: row => row.deviceAddress, sortable: true },
        { name: "mobileNumber", required: true, label: "Mobile Number", align: "center", field: row => row.leadInformation ? row.leadInformation.contactNumber : 'NA', sortable: false },
        { name: "lostOrStolenRemarks", required: true, label: "Remarks", align: "right", field: row => row.regionalInventory ? row.regionalInventory.lostOrStolenRemarks : '', sortable: false },
        { name: 'action', required: true, label: '', align: 'center', field: 'action', sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters("LostFinance", ["getlostDatas"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("LostFinance", ["FETCH_LOST_FINANCE_DATAS", "APPROVE_LOST_STOLEN_EXCEPTION"]),
    PullToRefresh(done) {
      this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
      done();
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_LOST_FINANCE_DATAS({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getlostDatas.totalElements;
        this.paginationControl.page = this.getlostDatas.number + 1;
        this.tableData = this.getlostDatas.content;
        if (this.getlostDatas.sort != null) {
          this.paginationControl.sortBy = this.getlostDatas.sort[0].property;
          this.paginationControl.descending = this.getlostDatas.sort[0].ascending;
        }
        this.$q.loading.hide();
      }).catch(() => {
        this.$q.loading.hide();
      });
    },
    openAccept(reqData) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to Move Lost/Stolen?',
        ok: 'Continue',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$q.loading.show({ delay: 0, spinnerColor: 'purple-9', message: 'Processing ..' });
        let obj = {
          id: reqData.regionalInventory.id,
          serialNumber: reqData.regionalInventory.serialNumber,
          lostOrStolenRemarks: ""
        };
        this.APPROVE_LOST_STOLEN_EXCEPTION(obj).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
          this.$q.loading.hide();
          this.$q.notify({ color: 'positive', position: "bottom", message: 'Successfully Approved!', icon: 'thumb_up' });
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({ color: 'negative', position: "bottom", message: error.body && error.body.message ? error.body.message : 'Please try again later!', icon: 'thumb_down' });
        });
      });
    },
    openReject(exceptionDetails) {
      this.showRejectModel = !this.showRejectModel;
      if (exceptionDetails) {
        this.propsRejectAppend = exceptionDetails;
      }
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    }
  }
};
</script>
