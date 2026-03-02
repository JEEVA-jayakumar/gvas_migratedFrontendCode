<template>
  <q-page>
    <div>
      <!--START: table title -->
      <div class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Implementation Verification Queue
      </div>
      <!--END: table title -->
      <!-- //Common lead information in popup -->
      <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />
      <!-- content -->
      <!--START: table lead validation -->
      <q-table table-class="customTableClass" :rows="tableData" :columns="columns" :filter="filter"
        v-model:pagination="paginationControl" row-key="name" :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]" @request="ajaxLoadAllLeadInfo" class="shadow-0">

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
            <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-LeadSource="props">
          <q-td :props="props">
            <span :class="{ 'text-red': props.row.leadInformation.leadSource.sourceName === 'LS_TOHANDS' }">
              {{ props.row.leadInformation.leadSource.sourceName }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-mobileNumber="props">
          <q-td :props="props">{{
            props.row.assignedTo == null ? "NA" : props.row.assignedTo.contactNumber
            }}</q-td>
        </template>

        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td :props="props">
            <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-viewDocument="props">
          <q-td :props="props">
            <div v-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.implementationForm)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.implementationForm }}
              </div>
            </div>
            <div v-else-if="props.row.implementationFormMimeType.includes('image/')" class="cursor-pointer">
              <viewer :images="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]">
                <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm" style="max-width: 50px" />
              </viewer>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>

        <template v-slot:body-cell-pictureOfShop="props">
          <q-td :props="props">
            <div v-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.pictureOfShop)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.pictureOfShop }}
              </div>
            </div>
            <div v-else-if="props.row.pictureOfShopMimeType.includes('image/')" class="cursor-pointer">
              <viewer :images="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]">
                <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop" style="max-width: 50px" />
              </viewer>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>

        <template v-slot:body-cell-cpvForm="props">
          <q-td :props="props">
            <div v-if="!props.row.cpvFormMimeType || props.row.cpvFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <div @click="fnPDFViewModal(props.row.cpvForm)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.cpvForm }}
              </div>
            </div>
            <div v-else-if="props.row.cpvFormMimeType.includes('image/')" class="cursor-pointer">
              <viewer :images="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]">
                <img :src="GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm" style="max-width: 50px" />
              </viewer>
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
            <q-btn v-if="props.row.deviceStatus == 6" disable dense no-caps label="Already Approved" icon="block" size="sm" />
            <q-btn v-else dense no-caps label="Approve" icon="done" size="sm" @click="fnShowConvertToSat(props.row)" color="green-5" />
          </q-td>
        </template>

        <template v-slot:body-cell-data="props">
          <q-td :props="props">
            <q-btn v-if="props.row.deviceStatus == 6" disable dense no-caps label="Reject" icon="block" size="sm" />
            <q-btn v-else dense no-caps label="Reject" icon="close" size="sm" @click="fnShowConvertReject(props.row)" color="red-5" />
          </q-td>
        </template>

        <template v-slot:top>
          <div class="row q-col-gutter-md full-width">
            <div class="col-12 col-md-4">
              <q-input filled dense clearable v-model="filter" color="grey-9" placeholder="Type.."
                label="Search by MID, TID, Merchant Name" />
            </div>
            <div class="col-6 col-md-3">
              <q-input filled dense v-model="formData.fromDate" label="From Date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-menu transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.fromDate" mask="YYYY-MM-DD" />
                    </q-menu>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6 col-md-3">
              <q-input filled dense v-model="formData.toDate" label="To Date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-menu transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.toDate" mask="YYYY-MM-DD" />
                    </q-menu>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2 row items-center justify-end">
              <q-btn color="purple-9" :disable="!formData.fromDate || !formData.toDate" @click="SubmitData(formData)">Submit</q-btn>
              <q-btn color="red" v-if="selectedRow" @click="DeleteData" class="q-ml-sm">
                <q-icon name="delete" />
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </div>
    <showPdfModalComponent v-if="toggleshowPDFModal" :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails" @togglePDFModal="fnPDFViewModal"></showPdfModalComponent>
    <viewDocumentApprove v-if="propShowConvertToSat" :propShowConvertToSat="propShowConvertToSat"
      :propRowDetails="propRowDetails" @emitfnshowConvertToSat="fnShowConvertToSat"></viewDocumentApprove>
    <viewDocumentReject v-if="propShowViewReject" :propShowViewReject="propShowViewReject"
      :propRowDetails="propRowDetails" @emitfnshowConvertToSat="fnShowConvertReject"></viewDocumentReject>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import viewDocumentApprove from "../../components/sat/viewDocumentApprove.vue";
import viewDocumentReject from "../../components/sat/viewRejectDocument.vue";
import { date } from "quasar";

import { useVuelidate } from "@vuelidate/core";
export default {
  name: "AuDocument",
  components: {
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
      propRowDetails: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "deviceStatusDate",
        descending: false,
        rowsPerPage: 10,
      },
      tableData: [],
      filter: "",
      formData: {
        fromDate: "",
        toDate: "",
      },
      formData1: {
        fromDate: "",
        toDate: "",
      },
      selectedRow: null,
    };
  },
  computed: {
    ...mapGetters("equitasImplementedQueue", ["getEquitasReport"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter,
      formData: this.formData1,
    });
  },
  methods: {
    ...mapActions("equitasImplementedQueue", ["EQUITAS_TRACKER_LIST"]),
    toTimestamp(strDate, isFromDate = true) {
      if (!strDate) return null;
      const datePart = strDate.split("T")[0];
      let timeStr = isFromDate ? "00:00:00" : "23:59:00";
      const formattedDate = `${datePart}T${timeStr}Z`;
      return Date.parse(formattedDate);
    },
    SubmitData(request) {
      this.formData1 = {
        fromDate: this.toTimestamp(request.fromDate.toString(), true),
        toDate: this.toTimestamp(request.toDate.toString(), false),
      };
      if (this.formData1.fromDate <= this.formData1.toDate) {
        this.selectedRow = request;
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter,
          formData: this.formData1,
        });
      } else {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "To Date must be greater than From Date",
          icon: "thumb_down",
        });
      }
    },
    DeleteData() {
      this.formData.fromDate = "";
      this.formData.toDate = "";
      this.formData1.fromDate = "";
      this.formData1.toDate = "";
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: this.filter,
        formData: this.formData1,
      });
      this.selectedRow = null;
    },
    ajaxLoadAllLeadInfo({ pagination, filter, formData }) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.EQUITAS_TRACKER_LIST({
        pagination,
        filter: this.filter,
        formData: this.formData1,
      }).then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getEquitasReport.totalElements;
          this.paginationControl.page = this.getEquitasReport.number + 1;
          this.tableData = this.getEquitasReport.content;
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    },
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnShowConvertToSat(rowDetails) {
      this.propShowConvertToSat = !this.propShowConvertToSat;
      if (rowDetails) this.propRowDetails = rowDetails;
    },
    fnShowConvertReject(rowDetails) {
      this.propShowViewReject = !this.propShowViewReject;
      if (rowDetails) this.propRowDetails = rowDetails;
    },
  },
};
</script>
