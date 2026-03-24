<template>
  <q-page>
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Implementation Verification Queue
      </div>
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
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
          <q-td :props="props" class="cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)">
            <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-LeadSource="props">
          <q-td :props="props">
            <span :class="{ 'text-red': props.row.leadInformation?.leadSource?.sourceName === 'LS_TOHANDS' }">
              {{ props.row.leadInformation?.leadSource?.sourceName }}
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-mobileNumber="props">
          <q-td :props="props">{{
            props.row.assignedTo == null ? "NA" : props.row.assignedTo.contactNumber
            }}</q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td :props="props">{{
            props.row.leadInformation == null ? "NA" : props.row.leadInformation.leadAddress
            }}</q-td>
        </template>
        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td :props="props">
            <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-viewDocument="props">
          <q-td :props="props">
            <div v-if="props.row.implementationFormMimeType == null || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.implementationForm)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.implementationForm }}
              </div>
            </div>
            <div v-else-if="props.row.implementationFormMimeType != null && props.row.implementationFormMimeType.includes('image/')" class="cursor-pointer">
              <div @click="fnViewMultiAttachedFileImageUploadedBySat()">
                <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]">
                  <img :src="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]" style="max-width: 15%" />
                </viewer>
              </div>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-pictureOfShop="props">
          <q-td :props="props">
            <div v-if="props.row.pictureOfShopMimeType == null || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.pictureOfShop)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.pictureOfShop }}
              </div>
            </div>
            <div v-else-if="props.row.pictureOfShopMimeType != null && props.row.pictureOfShopMimeType.includes('image/')" class="cursor-pointer">
              <div @click="fnViewMultiAttachedFileImageUploadedByPictureShop()">
                <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]">
                  <img :src="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]" style="max-width: 15%" />
                </viewer>
              </div>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-cpvForm="props">
          <q-td :props="props">
            <div v-if="props.row.cpvFormMimeType == null || props.row.cpvFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.cpvForm)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.cpvForm }}
              </div>
            </div>
            <div v-else-if="props.row.cpvFormMimeType != null && props.row.cpvFormMimeType.includes('image/')" class="cursor-pointer">
              <div @click="fnViewMultiAttachedFileImageUploadedByCpvForm()">
                <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]">
                  <img :src="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]" style="max-width: 15%" />
                </viewer>
              </div>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <span class="label text-positive" v-if="props.row.deviceStatus == 6">Approved</span>
            <span class="label text-negative" v-else-if="props.row.deviceStatus == 7">Pending</span>
            <span class="label text-amber" v-else>NA</span>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div v-if="props.row.deviceStatus == 6">
              <q-btn disable dense no-caps no-wrap label="Already Approved" icon="block" size="md" @click="fnShowConvertToSat(props.row)"></q-btn>
            </div>
            <div v-else>
              <q-btn dense no-caps no-wrap label="Approve" icon="done" size="md" @click="fnShowConvertToSat(props.row)" color="green-5"></q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-data="props">
          <q-td :props="props">
            <div v-if="props.row.deviceStatus == 6">
              <q-btn disable dense no-caps no-wrap label="Reject" icon="block" size="md" @click="fnShowConvertToSat(props.row)"></q-btn>
            </div>
            <div v-else>
              <q-btn dense no-caps no-wrap label="Reject" icon="close" size="md" @click="fnShowConvertReject(props.row)" color="red-5"></q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:top>
          <div class="col-5">
            <q-input dense clearable v-model="filter" color="grey-9" placeholder="Type.." label="Search by MID, TID, Merchant Name" class="q-mr-lg q-py-sm">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-2">
            <q-input type="date" class="q-mr-lg q-py-sm" v-model="formData.fromDate" label="From Date" />
          </div>
          <div class="col-2">
            <q-input type="date" class="q-mr-lg q-py-sm" v-model="formData.toDate" label="To Date" />
          </div>
          <div class="col-2">
            <q-btn align="right" color="purple-9" :disabled="!formData.fromDate || !formData.toDate" style="margin-right: 10px" @click="SubmitData(formData)">Submit</q-btn>
            <q-btn color="red" v-if="selectedRow" @click="DeleteData">
              <q-icon name="delete" />
            </q-btn>
          </div>
        </template>
      </q-table>
      <showMerchantTransactionLevelDetails v-if="valueToggleMerchantTransaction" :valueToggleMerchantTransaction="valueToggleMerchantTransaction" @revertRowClick="rowClick">
      </showMerchantTransactionLevelDetails>
    </div>
    <showPdfModalComponent v-if="toggleshowPDFModal" :propToggleshowPDFModal="toggleshowPDFModal" :propPDFDetails="PDFDetails" @togglePDFModal="fnPDFViewModal"></showPdfModalComponent>
    <viewDocumentApprove v-if="propShowConvertToSat" :propShowConvertToSat="propShowConvertToSat" :propRowDetails="propRowDetails" @emitfnshowConvertToSat="fnShowConvertToSat"></viewDocumentApprove>
    <viewDocumentReject v-if="propShowViewReject" :propShowViewReject="propShowViewReject" :propRowDetails="propRowDetails" @emitfnshowConvertToSat="fnShowConvertReject"></viewDocumentReject>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import viewDocumentApprove from "../../components/sat/viewDocumentApprove.vue";
import viewDocumentReject from "../../components/sat/viewRejectDocument.vue";

export default {
  name: "audocument",
  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    showPdfModalComponent,
    viewDocumentApprove,
    viewDocumentReject,
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      toggleshowPDFModal: false,
      PDFDetails: "",
      propShowConvertToSat: false,
      propShowViewReject: false,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "deviceStatusDate",
        descending: false,
        rowsPerPage: 10,
      },
      tableData: [],
      valueToggleMerchantTransaction: false,
      filter: "",
      formData: { fromDate: "", toDate: "" },
      formData1: { fromDate: "", toDate: "" },
      selectedRow: null,
      propRowDetails: {},
      columns: [
        { name: "tid", required: true, label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", required: true, label: "Lead Id", align: "left", field: row => row.leadInformation?.leadNumber, sortable: false },
        { name: "LeadSource", required: true, label: "Lead Source", align: "left", field: row => row.leadInformation?.leadSource?.sourceName, sortable: true },
        { name: "leadInformation", required: true, label: "ME Name", align: "left", field: (row) => row.leadInformation?.leadName, sortable: false },
        { name: "leadAddress", required: true, label: "Merchant Address", align: "center", field: (row) => row.leadInformation?.leadAddress, sortable: false },
        { name: "deviceName", required: true, label: "Device type", align: "right", field: (row) => row.leadInformation?.device?.deviceName || "NA", sortable: false },
        { name: "regionalInventory.serialNumber", required: true, label: "Device Serial Number", align: "left", field: (row) => {
            if (row.leadInformation?.leadSource?.sourceName === "LS_TOHANDS") return row.toHandsSerialNumber || "NA";
            return row.regionalInventory?.serialNumber || "NA";
          }, sortable: true },
        { name: "deviceStatusDate", required: true, label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", required: true, label: "Implemented by", align: "left", field: (row) => row.assignedTo ? (row.assignedTo.name + " | " + row.assignedTo.employeeID) : "NA", sortable: true },
        { name: "deviceAddress", required: true, label: "Implemented Address", align: "left", field: "deviceAddress", sortable: true },
        { name: "pincode", required: true, label: "Merchants Pincode", align: "left", field: (row) => row.leadInformation?.pincode || "NA", sortable: false },
        { name: "city", required: true, label: "Merchants City Town", align: "left", field: (row) => row.leadInformation?.city || "NA", sortable: false },
        { name: "contactNumber", required: true, label: "FSE Mobile Number", align: "center", field: (row) => row.assignedTo?.contactNumber || "NA", sortable: false },
        { name: "status", required: true, label: "Device Status", align: "center", field: "deviceStatus", sortable: false },
        { name: "viewDocument", required: true, label: "Implementation Form", align: "center", field: "implementationForm", sortable: false },
        { name: "pictureOfShop", required: true, label: "PictureOfShop", align: "center", field: "pictureOfShop", sortable: false },
        { name: "cpvForm", required: true, label: "cpvForm", align: "center", field: "cpvForm", sortable: false },
        { name: "action", required: true, label: "Approve", align: "center", field: "action", sortable: false },
        { name: "data", required: true, label: "Reject", align: "center", field: "data", sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters("equitasImplementedQueue", ["getEquitasReport"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
  },
  methods: {
    ...mapActions("equitasImplementedQueue", ["EQUITAS_TRACKER_LIST"]),
    SubmitData(request) {
      this.formData1 = {
        fromDate: this.toTimestamp(request.fromDate.toString(), true),
        toDate: this.toTimestamp(request.toDate.toString(), false),
      };
      if (this.formData1.fromDate <= this.formData1.toDate) {
        this.selectedRow = request;
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
      } else {
        this.$q.notify({ color: "negative", position: "bottom", message: "TO Date must be greater than From Date", icon: "thumb_down" });
      }
    },
    toTimestamp(strDate, isFromDate = true) {
      if (!strDate) return null;
      const date = strDate.split("T")[0];
      let timeStr = isFromDate ? "00:00:00" : "23:59:59";
      const formattedDate = `${date}T${timeStr}Z`;
      return Date.parse(formattedDate);
    },
    DeleteData() {
      this.formData.fromDate = ""; this.formData.toDate = "";
      this.formData1.fromDate = ""; this.formData1.toDate = "";
      this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
      this.selectedRow = null;
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.EQUITAS_TRACKER_LIST({ pagination, filter, formData: this.formData1 })
        .then((res) => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getEquitasReport.totalElements;
          this.paginationControl.page = this.getEquitasReport.number + 1;
          this.tableData = this.getEquitasReport.content;
          if (this.getEquitasReport.sort != null) {
            this.paginationControl.sortBy = this.getEquitasReport.sort[0].property;
            this.paginationControl.descending = !this.getEquitasReport.sort[0].ascending;
          }
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) this.addtnLeadInformation = leadDetails;
    },
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnShowConvertToSat(rowDetails) {
      this.propShowConvertToSat = !this.propShowConvertToSat;
      if (rowDetails != undefined) this.propRowDetails = rowDetails;
    },
    fnShowConvertReject(rowDetails) {
      this.propShowViewReject = !this.propShowViewReject;
      if (rowDetails != undefined) this.propRowDetails = rowDetails;
    },
    fnViewMultiAttachedFileImageUploadedBySat() {},
    fnViewMultiAttachedFileImageUploadedByPictureShop() {},
    fnViewMultiAttachedFileImageUploadedByCpvForm() {},
  },
};
</script>
