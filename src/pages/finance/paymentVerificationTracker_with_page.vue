<template>
  <q-page>
    <div class="q-pa-none">
      <q-pull-to-refresh :handler="PullToRefresh" inline>
        <!--START: table title -->
        <div
          class="col-md-12 capitalize text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >Finance</div>
        <!--END: table title -->
        <!-- table payment verification tracker -->
        <q-table
          table-class="customTableClass"
          :rows="tableData"
          :columns="columns"
          row-key="field"
          color="grey-9"
          :filter="filter" v-model:pagination="paginationControl"
          :rows-per-page-options="[5,10,15,20]"
          @request="ajaxLoadAllPaymentTrackerInfo"
          table-style="word-break: break-all"
          class="payment_verification_table capitalize shadow-0"
        >
          <!--START: table header -->
          <template v-slot:top-row="props">
            <q-tr>
              <q-th v-for="col in props.columns" :key="col.name" :props="props">{{ col.label }}</q-th>
            </q-tr>
          </template>
          <!--END: table header -->
          <!--START: Table body -->
          <template v-slot:body="props">
            <!--START: table rows -->
            <q-tr :props="props" class="bottom-border">
              <!--START: table expand button :Checkbox -->
              <q-td key="leadInformation.leadNumber" :props="props">
                <q-checkbox
                  color="grey-9"
                  v-model="props.row.expand"
                  checked-icon="fas fa-chevron-up"
                  unchecked-icon="fas fa-chevron-down"
                  class="q-mr-md"
                  @update:model-value="expandRowPlease(props.row)"
                />
                <span
                  class="cursor-pointer"
                  :class="[props.row.priority?'text-negative text-weight-bolder':'text-primary']"
                  @click="toggleLeadInformation(props.row)"
                ># {{ props.row.leadNumber }}</span>
              </q-td>
              <!--END: table expand button :Checkbox -->
              <!--START: table other data -->
              <q-td key="assignedTo.name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="leadInformation.leadName" :props="props">{{ props.row.leadName }}</q-td>
              <q-td key="leadInformation.leadAddress" :props="props">{{props.row.leadAddress }}</q-td>
              <q-td key="state" :props="props">{{ props.row.state }}</q-td>
              <q-td key="leadSource.sourceName" :props="props">{{props.row.leadSource}}</q-td>
              <q-td
                key="deviceCount"
                :props="props"
              >{{ props.row.deviceCount }}-{{ props.row.deviceName }}</q-td>

              <q-td key="action" :props="props">
                <q-btn
                  push
                  outline
                  class="q-mx-sm"
                  color="negative"
                  @click="openRejectModel(props.row)"
                  size="sm"
                >Reject</q-btn>
                <q-btn
                  push
                  outline
                  class="q-mx-sm"
                  color="purple-9"
                  size="sm"
                  @click="financeApproveSubmit(props.row.leadId)"
                >Approve</q-btn>
              </q-td>
              <!--END: table other data -->
            </q-tr>
            <!--END: table rows -->
            <!-- START: table expand values -->
            <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
              <q-td colspan="100%">
                <div class="row q-col-gutter-md">
                  <div class="col-md-2">
                    <div class="text-left text-caption text-grey-8 text-weight-medium">Rental Plan</div>
                    <div
                      class="text-left"
                      v-if="props.row.plan.planName == '' || props.row.plan.planName == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ props.row.plan.planName }}</div>
                  </div>
                  <div class="col-md-2">
                    <div class="text-left text-caption text-grey-8 text-weight-medium">Amount Collected</div>
                    <div class="text-left" v-if="props.row.amountCollected == null">NA</div>
                    <div class="text-left" v-else>{{ props.row.amountCollected }}</div>
                  </div>
                  <div class="col-md-2">
                    <div class="text-left text-caption text-grey-8 text-weight-medium">Payment Type</div>
                    <div v-if="props.row.paymentOption == 2" class="text-left">
                      <div>Cheque</div>
                      <div v-if="props.row.paymentDocumentMimeType != null">
                        <div
                          v-if="props.row.paymentDocumentMimeType.includes('pdf')"
                          class="cursor-pointer"
                        >
                          <div @click="fnPDFViewModal(props.row.paymentDocumentFile)">
                            <q-icon name="fas fa-file-pdf" color="primary" />
                            &nbsp;{{props.row.paymentDocumentFile}}
                          </div>
                        </div>
                        <div
                          v-else-if="props.row.paymentDocumentMimeType.includes('image')"
                          class="cursor-pointer"
                        >
                          <div @click="fnViewMultiAttachedFileImage(props.row)">
                            <div v-viewer class="hidden">
                              <img
                                :src="GLOBAL_FILE_FETCH_URL+ '/'+props.row.paymentDocumentFile"
                                ref="multiAttachedImageViewer"
                                style="max-width:100%"
                              />
                            </div>
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{props.row.paymentDocumentFile}}
                          </div>
                        </div>
                        <div v-else>No document attached</div>
                      </div>
                    </div>
                    <div v-else-if="props.row.paymentOption == 3" class="text-left">Swipe</div>
                    <div v-else-if="props.row.paymentOption == 1" class="text-left">NEFT</div>
                    <div v-else-if="props.row.paymentOption == 4" class="text-left">UPI LINK</div>
                    <div v-else class="text-left">NA</div>
                  </div>
                  <div class="col-md-2">
                    <div class="text-left text-caption text-grey-8 text-weight-medium">Payment Date</div>
                    <div
                      class="text-left"
                      v-if="props.row.paymentMadeon == '' || props.row.paymentMadeon == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ $moment(props.row.paymentMadeon).format("Do MMM Y") }}</div>
                  </div>
                  <div class="col-md-2">
                    <div class="text-left text-caption text-grey-8 text-weight-medium">Payment Reference</div>
                    <div
                      class="text-left"
                      v-if="props.row.referenceNumber == '' || props.row.referenceNumber == null"
                    >NA</div>
                    <div class="text-left" v-else>{{ props.row.referenceNumber }}</div>
                  </div>
                  <div class="col-md-2">
                    <div class="text-left text-caption text-grey-8 text-weight-medium">Document Uploaded by SAT</div>
                    <div
                      class="text-left"
                      v-if="props.row.leadVerificationStatusMimeType != '' && props.row.leadVerificationStatusMimeType != null"
                    >
                      <div
                        v-if="props.row.leadVerificationStatusMimeType.includes('pdf')"
                        class="cursor-pointer"
                      >
                        <div @click="fnPDFViewModal(props.row.leadVerificationStatusBankAttachedFile)">
                          <q-icon name="fas fa-file-pdf" color="primary" />
                          &nbsp;{{props.row.leadVerificationStatusBankAttachedFile}}
                        </div>
                      </div>
                      <div
                        v-else-if="props.row.leadVerificationStatusMimeType.includes('image')"
                        class="cursor-pointer"
                      >
                        <div @click="fnViewMultiAttachedFileImageUploadedBySat()">
                          <div v-viewer class="hidden">
                            <img
                              :src="GLOBAL_FILE_FETCH_URL+ '/'+props.row.leadVerificationStatusBankAttachedFile"
                              ref="multiAttachedImageViewerUploadedBySAT"
                              style="max-width:100%"
                            />
                          </div>
                          <q-icon name="fas fa-image" color="amber-9" />
                          &nbsp;{{props.row.leadVerificationStatusBankAttachedFile}}
                        </div>
                      </div>
                      <div v-else>No document attached</div>
                    </div>
                    <div v-else class="text-left">NA</div>
                  </div>
                </div>
              </q-td>
            </q-tr>
            <!--END: table expand values -->
          </template>
          <!--END: Table body -->
          <!--START: table search, filter -->
          <template v-slot:top="props">
            <!--START: table search -->
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Type.."
                label="Search"
                class="q-mr-lg q-py-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <!--END: table search -->
          </template>
          <!--END: table search, filter -->
        </q-table>
      </q-pull-to-refresh>

      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <!--START: Open Reject model -->
      <openRejectModelComp
        v-if="showRejectModel"
        :showRejectModel="showRejectModel"
        :propShowRejectComponent="propsRejectAppend"
        @reloadPaymentTrackerData="ajaxLoadAllPaymentTrackerInfo({ pagination: paginationControl,filter: filter })"
        @closeRejectModel="openRejectModel"
      ></openRejectModelComp>
      <!--END: Open Reject model -->

      <!-- START >> COMPONENT: View PDF  -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      ></showPdfModalComponent>
      <!-- END >> COMPONENT: View PDF -->
    </div>
  </q-page>
</template>

<script>
import openRejectModelComp from "../../components/finance/openRejectModelComp.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PaymentVerificationTrackerWithPage",
  components: {
    openRejectModelComp,
    showPdfModalComponent,
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      toggleshowPDFModal: false,
      PDFDetails: "",
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "leadNumber",
        descending: true,
        rowsPerPage: 10
      },
      propsRejectAppend: [],
      showRejectModel: false,
      filter: "",
      columns: [
        { name: "leadInformation.leadNumber", required: true, label: "Lead Number", align: "left", field: row => "# " + row.leadNumber, sortable: true },
        { name: "assignedTo.name", required: true, label: "SO Name", align: "left", field: "name", sortable: true },
        { name: "leadInformation.leadName", required: true, label: "Merchant Name", align: "left", field: "leadName", sortable: true },
        { name: "leadInformation.leadAddress", required: true, label: "Address", align: "left", field: "leadAddress", sortable: true },
        { name: "state", required: true, label: "State", align: "left", field: "state", sortable: true },
        { name: "leadSource.sourceName", required: true, label: "Lead Source/Bank Name", align: "left", field: "leadSource", sortable: true },
        { name: "deviceCount", required: true, label: "Device Type & Count", align: "left", field: "device", sortable: true },
        { name: "action", required: true, label: "", align: "center", field: "action", sortable: false }
      ],
      tableData: []
    };
  },
  computed: {
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("Finance", ["getPaymentTrackerInfo"]),
  },
  mounted() {
    this.ajaxLoadAllPaymentTrackerInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("Finance", ["FETCH_ALL_PAYMENT_TRACKER_DATA", "APPROVE_FINANCE_EXCEPTION", "REJECT_FINANCE_EXCEPTION"]),
    PullToRefresh(done) {
      this.ajaxLoadAllPaymentTrackerInfo({ pagination: this.paginationControl, filter: this.filter });
      done();
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) this.addtnLeadInformation = leadDetails;
    },
    ajaxLoadAllPaymentTrackerInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_PAYMENT_TRACKER_DATA({ pagination, filter }).then(response => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getPaymentTrackerInfo.totalElements;
          this.paginationControl.page = this.getPaymentTrackerInfo.number + 1;
          this.tableData = this.getPaymentTrackerInfo.content;
          if (this.getPaymentTrackerInfo.sort != null) {
            this.paginationControl.sortBy = this.getPaymentTrackerInfo.sort[0].property;
            this.paginationControl.descending = this.getPaymentTrackerInfo.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    openRejectModel(exceptionDetails) {
      this.showRejectModel = !this.showRejectModel;
      this.propsRejectAppend = exceptionDetails;
    },
    financeApproveSubmit(exceptionDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to approve the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Processing .." });
        let usersSelectSync = {
          leadInformation: { verifiedFinanceStatus: 1 },
          leadVerificationStatus: { status: 1, fieldName: "Finance" },
          leadId: exceptionDetails
        };
        this.APPROVE_FINANCE_EXCEPTION(usersSelectSync)
          .then(() => {
            this.ajaxLoadAllPaymentTrackerInfo({ pagination: this.paginationControl, filter: this.filter });
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Approved!", icon: "thumb_up" });
          }).catch(error => {
            this.$q.loading.hide();
            this.$q.notify({ color: "negative", position: "bottom", message: error.body && error.body.message ? error.body.message : "Please Try Again Later !", icon: "thumb_down" });
          });
      });
    },
    expandRowPlease(value) {
      value.expand = !value.expand;
    },
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnViewMultiAttachedFileImage() {
      if (this.$refs.multiAttachedImageViewer) {
        this.$refs.multiAttachedImageViewer.click();
      }
    },
    fnViewMultiAttachedFileImageUploadedBySat() {
      if (this.$refs.multiAttachedImageViewerUploadedBySAT) {
        this.$refs.multiAttachedImageViewerUploadedBySAT.click();
      }
    },
    fnShowCellIfBankSubvention(rowDetails) {
      const self = this;
      const returnValue = _.filter(rowDetails, function(value) {
        return (
          value.verificationType === self.$VERIFICATION_TYPE_BANKSUBVENTION
        );
      });
      return returnValue.length > 0;
    },
    fnShowBankUploadedDocumentBySat(rowDetails) {
      const self = this;
      const returnValue = _.filter(rowDetails, function(value) {
        return (
          value.verificationType === self.$VERIFICATION_TYPE_BANKSUBVENTION &&
          value.status
        );
      });
      return returnValue;
    }
  }
};
</script>

<style>
.payment_verification_table i {
  transition: none !important;
}
.q-table tbody td {
  word-wrap: break-word !important;
}
</style>
