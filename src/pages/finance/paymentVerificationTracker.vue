<template>
  <q-page>
    <div class="q-pa-md">
      <q-pull-to-refresh :handler="PullToRefresh" inline>
        <!--START: table title -->
        <div
          class="col-md-12 capitalize text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >Finance</div>
        <q-tabs v-model="activeTab" class="shadow-1 bg-grey-1" active-color="purple-9" indicator-color="purple-9" @update:model-value="goToQrMerchant">
          <q-tab name="tab-1" label="Pos Merchant" />
          <q-tab name="tab-2" label="QR Merchant" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <!-- table payment verification tracker -->
          <q-tab-panel name="tab-1" class="no-padding overflow-hidden">
            <q-table
              table-class="customTableClass"
              :rows="tableData"
              :columns="columns"
              :filter="filter"
              row-key="leadId"
              color="grey-9" v-model:pagination="paginationControl"
              :rows-per-page-options="[5,10,15,20]"
              @request="ajaxLoadAllPaymentTrackerInfo"
              table-style="word-break: break-all"
              class="payment_verification_table capitalize shadow-0"
            >
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
                          v-if="props.row.planName == '' || props.row.planName == null"
                        >NA</div>
                        <div class="text-left" v-else>{{ props.row.planName }}</div>
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
                        <div v-else-if="props.row.paymentOption == 1" class="text-left">IMPS/NEFT</div>
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
                        <div class="text-left text-caption text-grey-8 text-weight-medium">Ref.No Count</div>
                        <div
                          class="text-left"
                          v-if="props.row.referenceNumbercount == '' || props.row.referenceNumbercount == null"
                        >
                          <q-chip square color="purple" text-color="white">NA</q-chip>
                        </div>
                        <div class="text-left" v-else>
                          <q-chip square color="purple" text-color="white">{{ props.row.referenceNumbercount }}</q-chip>
                        </div>
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
              <template v-slot:top>
                <!--START: table search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filter"
                    placeholder="Type.."
                    label="Search .. "
                    class="q-mr-lg q-py-sm"
                  />
                </div>
                <!--END: table search -->
              </template>
              <!--END: table search, filter -->
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2" class="no-padding">
            <q-table
              table-class="customTableClass"
              :rows="tableData1"
              :columns="columns1"
              :filter="filter1"
              row-key="id"
              color="grey-9" v-model:pagination="paginationControl1"
              :rows-per-page-options="[5,10,15,20]"
              @request="ajaxLoadAllPaymentTrackerInfo1"
              table-style="word-break: break-all"
              class="payment_verification_table capitalize shadow-0"
            >
              <!--START: Table body -->
              <template v-slot:body="props">
                <!--START: table rows -->
                <q-tr :props="props" class="bottom-border">
                  <!--START: table expand button :Checkbox -->
                  <q-td key="qrLeadNumber" :props="props">
                    <q-checkbox
                      color="grey-9"
                      v-model="props.row.expand"
                      checked-icon="fas fa-chevron-up"
                      unchecked-icon="fas fa-chevron-down"
                      class="q-mr-md"
                      @update:model-value="expandQrRowPlease(props.row)"
                    />
                    <span
                      class="cursor-pointer"
                      :class="[props.row.priority?'text-negative text-weight-bolder':'text-primary']"
                      @click="toggleQrLeadInformation(props.row)"
                    ># {{ props.row.qrLeadNumber }}</span>
                  </q-td>
                  <!--END: table expand button :Checkbox -->
                  <!--START: table other data -->
                  <q-td key="createdBy.name" :props="props">{{ props.row.createdBy.name }}</q-td>
                  <q-td key="leadInformation.marketingName" :props="props">{{ props.row.marketingName }}</q-td>
                  <q-td key="leadInformation.contactAddress" :props="props">{{props.row.contactAddress }}</q-td>
                  <q-td key="state" :props="props">{{ props.row.state }}</q-td>
                  <q-td key="leadSource.sourceName" :props="props">{{props.row.leadSource.sourceName}}</q-td>
                  <q-td
                    key="deviceCount"
                    :props="props"
                  >{{ props.row.device == null   ? "NA" :props.row.device.deviceName }}</q-td>

                  <q-td key="action" :props="props">
                    <q-btn
                      push
                      outline
                      class="q-mx-sm"
                      color="negative"
                      @click="openQrRejectModel(props.row)"
                      size="sm"
                    >Reject</q-btn>
                    <q-btn
                      push
                      outline
                      class="q-mx-sm"
                      color="purple-9"
                      size="sm"
                      @click="qrFinanceApproveSubmit(props.row.id)"
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
                          v-if="props.row.plan == '' || props.row.plan == null"
                        >NA</div>
                        <div class="text-left" v-else>{{ props.row.plan.planName }}</div>
                      </div>
                      <div class="col-md-2">
                        <div class="text-left text-caption text-grey-8 text-weight-medium">Payment Type</div>
                        <div v-if="props.row.neftId == '' || props.row.neftId == null " class="text-left">
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
                              <div @click="fnViewHandedOverFileImageCheque()">
                                <div v-viewer class="hidden">
                                  <img
                                  :src="GLOBAL_FILE_FETCH_URL+ '/'+  props.row.paymentDocumentFile"
                                  ref="handedOverImageViewerCheque"
                                  />
                                </div>
                                <q-icon name="fas fa-image" color="amber-9" />
                                &nbsp;{{props.row.paymentDocumentFile}}
                              </div>
                            </div>
                            <div v-else>No document attached</div>
                          </div>
                        </div>
                        <div v-else-if="props.row.paymentDocumentMimeType == null ||props.row.paymentDocumentMimeType== '' " class="text-left">NEFT</div>
                        <div v-else class="text-left">NA</div>
                      </div>
                      <div class="col-md-2">
                        <div class="text-left text-caption text-grey-8 text-weight-medium">Payment Reference</div>
                        <div
                          class="text-left"
                          v-if="(props.row.chequeNumber == '' || props.row.chequeNumber == null) && (props.row.neftId == '' || props.row.neftId == null)"
                        >NA</div>
                        <div class="text-left" v-else>{{ props.row.chequeNumber || props.row.neftId || 'NA' }}</div>
                      </div>
                    </div>
                  </q-td>
                </q-tr>
                <!--END: table expand values -->
              </template>
              <!--END: Table body -->
              <!--START: table search, filter -->
              <template v-slot:top>
                <!--START: table search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filter1"
                    placeholder="Type.."
                    label="Search .. "
                    class="q-mr-lg q-py-sm"
                  />
                </div>
                <!--END: table search -->
              </template>
              <!--END: table search, filter -->
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-pull-to-refresh>
     
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
      <!--START: Open Reject model -->
      <openRejectModelComp
        v-if="showRejectModel"
        :showRejectModel="showRejectModel"
        :propShowRejectComponent="propsRejectAppend"
        @reloadPaymentTrackerData="ajaxLoadAllPaymentTrackerInfo({ pagination: paginationControl,filter: filter })"
        @closeRejectModel="openRejectModel"
      ></openRejectModelComp>
      <!--END: Open Reject model -->

      <openQrRejectModelComp
        v-if="showQrRejectModel"
        :showQrRejectModel="showQrRejectModel"
        :propShowQrRejectComponent="propsQRRejectAppend"
        @reloadQrPaymentTrackerData="ajaxLoadAllPaymentTrackerInfo1({ pagination: paginationControl1,filter: filter1 })"
        @closeQrRejectModel="openQrRejectModel"
      ></openQrRejectModelComp>

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
import openQrRejectModelComp from "../../components/finance/openQrRejectModelComp.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import generalQrLeadInformation from "../../components/generalQrLeadInformation.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PaymentVerificationTracker",
  components: {
    openRejectModelComp,
    openQrRejectModelComp,
    showPdfModalComponent,
    generalLeadInformation,
    generalQrLeadInformation
  },
  data() {
    return {
      activeTab: 'tab-1',
      propToggleLeadInformation: false,
      propToggleQrLeadInformation: false,
      addtnLeadInformation: null,
      addQrLeadInformation: null,
      toggleshowPDFModal: false,
      PDFDetails: "",
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "leadNumber",
        descending: true,
        rowsPerPage: 10
      },
      paginationControl1: {
        rowsNumber: 10,
        page: 1,
        sortBy: "qrLeadNumber",
        descending: true,
        rowsPerPage: 10
      },
      propsRejectAppend: [],
      propsQRRejectAppend: [],
      showRejectModel: false,
      showQrRejectModel: false,
      showChequeImage: false,
      filter: "",
      filter1: "",
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
      columns1: [
        { name: "qrLeadNumber", required: true, label: "Lead Number", align: "left", field: row => "# " + row.qrLeadNumber, sortable: true },
        { name: "createdBy.name", required: true, label: "SO Name", align: "left", field: "name", sortable: false },
        { name: "leadInformation.marketingName", required: true, label: "Merchant Name", align: "left", field: "marketingName", sortable: false },
        { name: "leadInformation.contactAddress", required: true, label: "Address", align: "left", field: "contactAddress", sortable: false },
        { name: "state", required: true, label: "State", align: "left", field: "state", sortable: false },
        { name: "leadSource.sourceName", required: true, label: "Lead Source/Bank Name", align: "left", field: "sourceName", sortable: false },
        { name: "deviceCount", required: true, label: "Device Type", align: "left", field: "DeviceName", sortable: false },
        { name: "action", required: true, label: "", align: "center", field: "action", sortable: false }
      ],
      tableData: [],
      tableData1: []
    };
  },
  computed: {
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
    ...mapGetters("Finance", ["getPaymentTrackerInfo"]),
    ...mapGetters("qrFinance", ["getstaticQrPaymentTrackerData"]),
  },
  mounted() {
    this.ajaxLoadAllPaymentTrackerInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("Finance", ["FETCH_ALL_PAYMENT_TRACKER_DATA", "APPROVE_FINANCE_EXCEPTION", "REJECT_FINANCE_EXCEPTION"]),
    ...mapActions("qrFinance", ["FETCH_ALL_QR_PAYMENT_TRACKER_DATA", "QR_APPROVE_FINANCE_EXCEPTION"]),
    PullToRefresh(done) {
      if (this.activeTab === 'tab-1') {
        this.ajaxLoadAllPaymentTrackerInfo({ pagination: this.paginationControl, filter: this.filter });
      } else {
        this.ajaxLoadAllPaymentTrackerInfo1({ pagination: this.paginationControl1, filter: this.filter1 });
      }
      done();
    },
    goToQrMerchant(tab) {
      if (tab == "tab-2") {
        this.ajaxLoadAllPaymentTrackerInfo1({ pagination: this.paginationControl1, filter: this.filter1 });
      } else {
        this.ajaxLoadAllPaymentTrackerInfo({ pagination: this.paginationControl, filter: this.filter });
      }
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) this.addtnLeadInformation = leadDetails;
    },
    toggleQrLeadInformation(qrLeadDetails) {
      this.propToggleQrLeadInformation = !this.propToggleQrLeadInformation;
      if (qrLeadDetails != undefined) this.addQrLeadInformation = qrLeadDetails;
    },
    ajaxLoadAllPaymentTrackerInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_PAYMENT_TRACKER_DATA({ pagination, filter }).then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getPaymentTrackerInfo.totalElements;
          this.paginationControl.page = this.getPaymentTrackerInfo.number + 1;
          this.tableData = this.getPaymentTrackerInfo.content;
          if (this.getPaymentTrackerInfo.sort != null) {
            this.paginationControl.sortBy = this.getPaymentTrackerInfo.sort[0].property;
            this.paginationControl.descending = !this.getPaymentTrackerInfo.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    ajaxLoadAllPaymentTrackerInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_QR_PAYMENT_TRACKER_DATA({ pagination, filter }).then(() => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getstaticQrPaymentTrackerData.totalElements;
          this.paginationControl1.page = this.getstaticQrPaymentTrackerData.number + 1;
          this.tableData1 = this.getstaticQrPaymentTrackerData.content;
          if (this.getstaticQrPaymentTrackerData.sort != null) {
            this.paginationControl1.sortBy = this.getstaticQrPaymentTrackerData.sort[0].property;
            this.paginationControl1.descending = !this.getstaticQrPaymentTrackerData.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    openRejectModel(exceptionDetails) {
      this.showRejectModel = !this.showRejectModel;
      this.propsRejectAppend = exceptionDetails;
    },
    openQrRejectModel(exceptionDetails) {
      this.showQrRejectModel = !this.showQrRejectModel;
      this.propsQRRejectAppend = exceptionDetails;
    },
    fnViewHandedOverFileImageCheque() {
      if (this.$refs.handedOverImageViewerCheque) {
        this.$refs.handedOverImageViewerCheque.click();
      }
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
    qrFinanceApproveSubmit(exceptionDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to approve the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Processing .." });
        let qrUsersSelectSync = {
          qrLeadInformation: { verifiedFinanceStatus: 1 },
          qrLeadVerificationStatus: { status: 1, fieldName: "Finance" },
          leadId: exceptionDetails
        };
        this.QR_APPROVE_FINANCE_EXCEPTION(qrUsersSelectSync)
          .then(() => {
            this.ajaxLoadAllPaymentTrackerInfo1({ pagination: this.paginationControl1, filter: this.filter1 });
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
    expandQrRowPlease(data){
      data.expand = !data.expand;
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
    }
  }
};
</script>
