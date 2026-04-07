<template>
  <q-page>
    <div>
      <q-table
        title="Change Management"
        table-class="customTableClass"
        class="q-py-none"
        :rows="tableData"
        :columns="columns"
        row-key="name"
        v-model:pagination="paginationControlchange"
        :filter="filter1"
        :rows-per-page-options="[5, 10, 15]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllCMS"
      >
        <template v-slot:body-cell-updatedAt="props">
          <q-td v-if="props.row" :props="props">
            {{ $moment(props.row.leadInformation.updatedAt).format("Do MMM Y") }}
          </q-td>
        </template>

        <template v-slot:body-cell-Status="props">
          <q-td v-if="props.row" :props="props">
            <span
              class="label text-positive"
              v-if="props.row.leadInformation.cmsLeadStatus == 23"
            >submitted to Mars</span>
            <span
              class="label text-amber"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 11"
            >Mars Approved</span>
            <span
              class="label text-positive"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 15"
            >NH Approved</span>
            <span
              class="label text-purple"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 16"
            >CMS RSM Pending</span>
            <span
              class="label text-negative"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 17"
            >CMS RSM Reject</span>
            <span
              class="label text-negative"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 25"
            >MARS Reject</span>
            <span
              class="label text-amber"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 18"
            >CMS NH Pending</span>
            <span
              class="label text-negative"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 19"
            >CMS NH Reject</span>
            <span
              class="label text-purple"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 20"
            >CMS Finance Pending</span>
            <span
              class="label text-negative"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 21"
            >CMS Finance Rejected</span>
            <span
              class="label text-positive"
              v-else-if="props.row.leadInformation.cmsLeadStatus == 22"
            >CMS Finance Approved</span>
            <span class="label text-negative" v-else>Pending</span>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td v-if="props.row" :props="props">
            <q-btn
              v-if="props.row.leadInformation.cmsLeadStatus == 22 || props.row.leadInformation.cmsLeadStatus == 15 || props.row.leadInformation.cmsLeadStatus == 25"
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data')"
            >Data Entry</q-btn>
            <q-btn
              v-else-if="props.row.leadInformation.cmsLeadStatus == 21"
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data/rejectfinance')"
            >Data Entry</q-btn>
            <q-btn
              v-else-if="props.row.leadInformation.cmsLeadStatus == 17"
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data/reject')"
            >Data Entry</q-btn>
            <q-btn
              v-else-if="props.row.leadInformation.cmsLeadStatus == 19"
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data/rejectrsm')"
            >Data Entry</q-btn>
            <q-btn
              disable
              v-else-if="props.row.leadInformation.cmsLeadStatus == 23"
              push
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data')"
            >Submitted To Mars</q-btn>
            <q-btn
              disabled
              v-else
              outline
              push
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data')"
            >Data Entry</q-btn>
          </q-td>
        </template>

        <template v-slot:top="props">
          <div class="col-md-5">
            <q-input
              clearable
              color="grey-9"
              v-model="filter1"
              placeholder="Type.."
              :debounce="600"
              class="q-mr-lg q-py-sm"
              label="Search By MID/TID/Merchant Name "
            />
          </div>
        </template>
      </q-table>

      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Enter TID/MID for changing merchant data name
      </div>

      <q-table
        title="Change Management"
        class="q-py-none"
        :rows="tableData1"
        :columns="columns1"
        row-key="name"
        v-model:pagination="paginationControl"
        :filter="filter"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="toggleAjaxLoadFilter1"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-action="props">
          <q-td v-if="props.row" :props="props" class="text-center">
            <q-btn
              push
              outline
              color="purple-9"
              size="sm"
              @click="$router.push('/sat/change/management/' + props.row.tid + '/edit/data')"
            >Data Entry</q-btn>
          </q-td>
        </template>

        <template v-slot:top="props">
          <div class="col-md-5">
            <q-input
              clearable
              color="grey-9"
              v-model="filter"
              placeholder="Type.."
              :debounce="600"
              class="q-mr-lg q-py-sm"
              label="Search By MID/TID/Merchant Name"
            />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "leadValidation",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filter: "",
      filter1: "",
      toggleAjaxLoadFilter1: false,
      toggleAjaxLoadFilter: false,
      paginationControlchange: {
        rowsNumber: 5,
        page: 1,
        sortBy: "mid",
        descending: false,
        rowsPerPage: 5,
      },
      paginationControl: {
        rowsNumber: 5,
        page: 1,
        sortBy: "mid",
        descending: false,
        rowsPerPage: 5,
      },

      columns: [
        {
          name: "leadInformation.leadName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: (row) => row.leadInformation.leadName,
          sortable: true,
        },
        {
          name: "Address",
          required: true,
          label: "Address",
          align: "left",
          field: (row) => row.leadInformation.leadAddress,
          sortable: false,
        },
        {
          name: "leadInformation.device.deviceName",
          required: true,
          label: "Device",
          align: "left",
          field: (row) => row.leadInformation.device.deviceName,
          sortable: true,
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: "mid",
          sortable: true,
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: "tid",
          sortable: true,
        },
        {
          name: "updatedAt",
          required: true,
          label: "Updated Date",
          align: "left",
          field: (row) => row.leadInformation.updatedAt,
          sortable: true,
        },
        {
          name: "Status",
          required: true,
          label: "Status",
          align: "left",
          field: (row) => row.leadInformation.leadStatus,
          sortable: true,
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false,
        },
      ],
      columns1: [
        {
          name: "leadInformation.leadName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: (row) => row.leadInformation.leadName,
        },
        {
          name: "Address",
          required: true,
          label: "Address",
          align: "left",
          field: (row) => row.leadInformation.leadAddress,
          sortable: true,
        },
        {
          name: "leadInformation.device.deviceName",
          required: true,
          label: "Device",
          align: "left",
          field: (row) => row.leadInformation.device.deviceName,
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: "tid",
          sortable: true,
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: "mid",
          sortable: true,
        },
        {
          name: "action",
          required: true,
          label: "Select",
          align: "center",
          field: "action",
          sortable: false,
        },
      ],
      tableData: [],
      tableData1: [],
      formdata: {},
      formdata1: {},
      merchant: {
        mdrPlan: {
          domesticDebitUpTo2000: {},
          domesticDebitAbove2000: {},
          standardOrClassic: {},
          premiumOrPlatinum: {},
          superPremiumOrSignature: {},
          commercialOrCorporate: {},
          internationalCreditCard: {},
        }
      },
      merchantTypeSelection: ""
    };
  },
  computed: {
    ...mapGetters("ChangeManagementList", ["getChangeManagementList"]),
    ...mapGetters("CMSList", ["getCMSList"]),
    ...mapGetters("GetMarsData", ["getAllMarsData", "getImplementedQueue"]),
    ...mapGetters("SatLeadValidation", [
      "getShortLeadInfo",
      "getDeviceVerificationStatus",
    ]),
  },
  created() {
    this.$q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Fetching data ..",
    });
    this.IMPLEMENTED_QUEUE("TID2700076")
      .then(() => {
        this.FETCH_SHORT_LEAD_DATA(this.getImplementedQueue.leadInformation.id);
        this.marsInfo();

        this.formdata.plan = this.getImplementedQueue.leadInformation.plan.id;
        this.formdata.planCode = this.getImplementedQueue.leadInformation.plan.planName;
        this.formdata.setupFees = this.getImplementedQueue.leadInformation.setupFees;
        this.formdata.recurringFees = this.getImplementedQueue.leadInformation.recurringFees;
        this.formdata.contactName = this.getImplementedQueue.leadInformation.contactName;
        this.formdata.contactNumber = this.getImplementedQueue.leadInformation.contactName;
        this.formdata.alternateContactNumber = this.getImplementedQueue.leadInformation.alternateContactNumber;
        this.formdata.city = this.getImplementedQueue.leadInformation.city;
        this.formdata.device = this.getImplementedQueue.leadInformation.device;
        this.formdata.deviceCount = this.getImplementedQueue.leadInformation.deviceCount;
        this.formdata.leadAddress = this.getImplementedQueue.leadInformation.leadAddress;
        this.formdata.latitude = this.getImplementedQueue.leadInformation.latitude;
        this.formdata.longitude = this.getImplementedQueue.leadInformation.longitude;
        this.formdata.state = this.getImplementedQueue.leadInformation.state;
        this.formdata.kyc = this.getImplementedQueue.leadInformation.kyc;
        this.formdata.verifiedBanksubventionStatus = this.getImplementedQueue.leadInformation.verifiedBanksubventionStatus;
        this.formdata.reason = this.getImplementedQueue.leadInformation.reason;
        this.formdata.amountCollected = this.getImplementedQueue.leadInformation.amountCollected;
        this.formdata.merchantCategory = this.getImplementedQueue.leadInformation.merchantCategory;
        this.formdata.pricing = this.getImplementedQueue.leadInformation.pricing;
        this.formdata.leadStatus = this.getImplementedQueue.leadInformation.leadStatus;
        this.formdata.submittoRSMDate = this.getImplementedQueue.leadInformation.submittoRSMDate;
        this.formdata.posIncentive = this.getImplementedQueue.leadInformation.posIncentive;
        this.formdata.posEnable = this.getImplementedQueue.leadInformation.posEnable;
        this.formdata.leadName = this.getImplementedQueue.leadInformation.leadName;

        this.formdata1.plan = this.getImplementedQueue.leadInformation.plan.id;
        this.formdata1.planCode = this.getImplementedQueue.leadInformation.plan.planName;
        this.formdata1.setupFees = this.getImplementedQueue.leadInformation.setupFees;
        this.formdata1.recurringFees = this.getImplementedQueue.leadInformation.recurringFees;
        this.formdata1.contactName = this.getImplementedQueue.leadInformation.contactName;
        this.formdata1.contactNumber = this.getImplementedQueue.leadInformation.contactName;
        this.formdata1.alternateContactNumber = this.getImplementedQueue.leadInformation.alternateContactNumber;
        this.formdata1.city = this.getImplementedQueue.leadInformation.city;
        this.formdata1.device = this.getImplementedQueue.leadInformation.device;
        this.formdata1.deviceCount = this.getImplementedQueue.leadInformation.deviceCount;
        this.formdata1.leadAddress = this.getImplementedQueue.leadInformation.leadAddress;
        this.formdata1.latitude = this.getImplementedQueue.leadInformation.latitude;
        this.formdata1.longitude = this.getImplementedQueue.leadInformation.longitude;
        this.formdata1.state = this.getImplementedQueue.leadInformation.state;
        this.formdata1.kyc = this.getImplementedQueue.leadInformation.kyc;
        this.formdata1.verifiedBanksubventionStatus = this.getImplementedQueue.leadInformation.verifiedBanksubventionStatus;
        this.formdata1.reason = this.getImplementedQueue.leadInformation.reason;
        this.formdata1.amountCollected = this.getImplementedQueue.leadInformation.amountCollected;
        this.formdata1.merchantCategory = this.getImplementedQueue.leadInformation.merchantCategory;
        this.formdata1.pricing = this.getImplementedQueue.leadInformation.pricing;
        this.formdata1.leadStatus = this.getImplementedQueue.leadInformation.leadStatus;
        this.formdata1.submittoRSMDate = this.getImplementedQueue.leadInformation.submittoRSMDate;
        this.formdata1.posIncentive = this.getImplementedQueue.leadInformation.posIncentive;
        this.formdata1.posEnable = this.getImplementedQueue.leadInformation.posEnable;
        this.formdata1.leadName = this.getImplementedQueue.leadInformation.leadName;

        this.merchant.mdrPlan.domesticDebitUpTo2000.percentage = this.getImplementedQueue.leadInformation.debitLessthanAmount;
        this.merchant.mdrPlan.domesticDebitAbove2000.percentage = this.getImplementedQueue.leadInformation.debitGreaterthanAmount;
        this.merchant.mdrPlan.standardOrClassic.percentage = this.getImplementedQueue.leadInformation.stdCC;
        this.merchant.mdrPlan.premiumOrPlatinum.percentage = this.getImplementedQueue.leadInformation.premiumCC;
        this.merchant.mdrPlan.superPremiumOrSignature.percentage = this.getImplementedQueue.leadInformation.superPremiumlCC;
        this.merchant.mdrPlan.commercialOrCorporate.percentage = this.getImplementedQueue.leadInformation.corpCC;
        this.merchant.mdrPlan.internationalCreditCard.percentage = this.getImplementedQueue.leadInformation.intlCC;
        this.merchantTypeSelection = this.getImplementedQueue.leadInformation.merchantType.merchantTypeName;

        this.$q.loading.hide();
      })
      .catch(() => {
        this.$q.loading.hide();
      });
    this.toggleAjaxLoadFilter = false;
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter,
    });
    this.ajaxLoadAllCMS({
      pagination: this.paginationControlchange,
      filter: this.filter1,
    });
  },
  methods: {
    ...mapActions("ChangeManagementList", ["CHANGE_MANAGEMENT_LIST"]),
    ...mapActions("CMSList", ["CMS_LIST"]),
    ...mapActions("SuperAdminUsers", ["EDIT_CMS"]),
    ...mapActions("GetMarsData", ["FETCH_MARS_DATA", "IMPLEMENTED_QUEUE"]),
    ...mapActions("SatLeadValidation", [
      "FEED_HAND_OVER_TO_SAT_DOCUMENT",
      "FEED_CHEQUE_FORM",
      "FEED_FULL_APPLICATION_FORM",
      "DELETE_DOCUMENT_FROM_BY_SAT",
      "FETCH_LEAD_DOCUMENT_TYPE_DATA",
      "FETCH_SHORT_LEAD_DATA",
    ]),

    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.CHANGE_MANAGEMENT_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getChangeManagementList.totalElements;
          this.paginationControl.page = this.getChangeManagementList.number + 1;
          this.tableData1 = this.getChangeManagementList.content;
          if (this.getChangeManagementList.sort != null) {
            this.paginationControl.sortBy = this.getChangeManagementList.sort[0].property;
            this.paginationControl.descending = this.getChangeManagementList.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    ajaxLoadAllCMS({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.CMS_LIST({ pagination, filter })
        .then(() => {
          this.paginationControlchange = pagination;
          this.paginationControlchange.rowsNumber = this.getCMSList.totalElements;
          this.paginationControlchange.page = this.getCMSList.number + 1;
          this.tableData = this.getCMSList.content;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    marsInfo() {
      this.FETCH_MARS_DATA(this.getImplementedQueue.leadInformation.id);
    },
    fnEdit(rowDetails) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to Edit Lead?",
          ok: "Continue",
          cancel: "Cancel",
        })
        .onOk(() => {
          this.$q.loading.show({
            delay: 100,
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none",
          });
          this.EDIT_CMS(rowDetails)
            .then(() => {
              this.ajaxLoadAllLeadInfo({
                pagination: this.paginationControl,
                filter: this.filter,
              });
              this.ajaxLoadAllCMS({
                pagination: this.paginationControlchange,
                filter: this.filter1,
              });
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully Edited" + "-" + rowDetails,
                icon: "thumb_up",
              });
            })
            .catch(() => {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: "Please try again!",
                icon: "thumb_down",
              });
            });
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "No changes made!",
            icon: "thumb_down",
          });
        });
    },
    PullToRefresh() {
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: this.filter,
      });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
  },
};
</script>

<style scoped>
.q-btn-flat,
.q-btn-outline {
  min-width: 100px !important;
}
</style>
