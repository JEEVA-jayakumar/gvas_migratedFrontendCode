<template>
  <q-page>
    <div class="q-pa-md">
      <!-- //Common lead information in popup -->
      <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

      <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
        <!--START: table title -->
        <div class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"> Lead Validation
        </div>
        <!--END: table title -->
        <!--START: table lead validation -->
        <q-table table-class="customTableClass" class="q-py-none shadow-0" :rows="tableData"
          :columns="columns" v-model:pagination="paginationControl"
          :rows-per-page-options="[5,10,15,20]" :loading="toggleAjaxLoadFilter" @request="ajaxLoadAllLeadInfo">

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">{{ $moment(props.row.date).format("Do MMM Y") }}</q-td>
          </template>

          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
              <span class="label" :class="[props.row.priority?'text-negative text-weight-bolder':'text-primary']">#
                {{props.row.leadNumber}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-leadName="props">
            <q-td :props="props">
              <span class="capitalize">{{props.row.merchantName}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-state="props">
            <q-td :props="props">
              <span class="capitalize">{{props.row.state}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-assignedTo_name="props">
            <q-td :props="props">
              <span class="capitalize">{{props.row.salesOfficerName+" | "+props.row.salesOfficerEmpId}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-leadSource="props">
            <q-td :props="props">
              <span :class="{ 'text-red': props.row.leadSource === 'LS_TOHANDS' }">
                {{ props.row.leadSource }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-verifiedFinanceStatus="props">
            <q-td :props="props">
              <span class="label text-positive"
                v-if="props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_SUCCESS">Approved</span>
              <span class="label text-negative"
                v-else-if="props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_PENDING">Pending</span>
              <span class="label text-negative"
                v-else-if="props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_REJECT">Rejected</span>
              <span class="label" v-else>NA</span>
            </q-td>
          </template>

          <template v-slot:body-cell-leadStatus="props">
            <q-td :props="props">
              <span class="label text-positive"
                v-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS">New</span>
              <span class="label text-negative"
                v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT">Rejected</span>
              <span class="label text-primary"
                v-else-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING">WIP</span>
              <span class="label text-orange" v-else-if="props.row.leadStatus== $LEAD_STATUS_SUBMITED_TO_MARS">With
                ops</span>
              <span class="label text-negative" v-else>Pending</span>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING" push outline
                color="purple-9" size="sm"
                @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')">Data Entry</q-btn>

              <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS" push disable
                color="purple-9" size="sm">Pending with MARS</q-btn>

              <q-btn
                v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS"
                push outline color="purple-9" size="sm"
                :to="'/sat/lead/validation/'+ props.row.leadId">Validate</q-btn>
              <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_REFER_BACK" push outline color="amber-9"
                size="sm" @click="$router.push('/sat/lead/validation/'+ props.row.leadId)">Referred Back</q-btn>
              <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_MARS_SUB_TID_PENDING" push outline
                color="amber-9" size="sm"
                @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')">Sub Tid Validation</q-btn>
              <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_BASE_TID_PENDING " push outline
                color="amber-9" size="sm"
                @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')">Sub Tid Validation</q-btn>
              <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING" push
                outline color="amber-9" size="sm"
                @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')">RB - data entry</q-btn>

              <q-btn v-else disable push outline color="grey-9" size="sm">Validate</q-btn>
            </q-td>
          </template>

          <template v-slot:body-cell-rejectLead="props">
            <q-td :props="props">
              <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD" push outline
                class="q-mx-sm" color="negative" @click="openRejectLead(props.row)" size="sm">Reject Lead</q-btn>
            </q-td>
          </template>

          <template v-slot:top>
            <div class="col-md-5">
              <q-input filled dense clearable color="grey-9" v-model="filter" placeholder="Type.." :debounce="600"
                class="q-mr-lg q-py-sm" label="Search By Merchant Name, Lead ID, Lead Source.." />
            </div>
          </template>
        </q-table>
        <!--END: table lead validation -->
      </q-pull-to-refresh>
      <!--START: Open Reject Lead model -->
      <openRejectLeadComp v-if="showRejectLeadModel" :showRejectLeadModel="showRejectLeadModel"
        :propShowRejectLeadComponent="propsRejectLeadAppend" @closeRejectLeadModel="openRejectLead">
      </openRejectLeadComp>
      <!--END: Open Reject Lead model -->
    </div>
  </q-page>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import generalLeadInformation from "../../components/generalLeadInformation.vue";
  import openRejectLeadComp from "../../components/sat/openRejectLeadComp.vue";

  export default {
    name: "LeadValidation",
    components: {
      generalLeadInformation,
      openRejectLeadComp
    },
    data() {
      return {
        propToggleLeadInformation: false,
        showRejectLeadModel: false,
        addtnLeadInformation: null,
        filter: "",
        toggleAjaxLoadFilter: false,
        paginationControl: {
          rowsNumber: 10,
          page: 1,
          sortBy: "leadNumber",
          descending: false,
          rowsPerPage: 10
        },
        propsRejectLeadAppend: null,
        columns: [
          { name: "createdAt", required: true, label: "Date(C)", align: "left", field: "date", sortable: true },
          { name: "leadNumber", required: true, label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
          { name: "leadName", required: true, label: "Merchant Name", align: "left", field: "merchantName", sortable: true },
          { name: "state", required: true, label: "State", align: "left", field: "state", sortable: true },
          { name: "assignedTo_name", required: true, label: "SO Name", align: "left", field: row => row.salesOfficerName + " | " + row.salesOfficerEmpId, sortable: true },
          { name: "leadSource", required: true, label: "Lead Source", align: "left", field: "leadSource", sortable: true },
          { name: "verifiedFinanceStatus", required: true, label: "Finance Approval", align: "left", field: "verifiedFinanceStatus", sortable: true },
          { name: "leadStatus", required: true, label: "Status", align: "left", field: "leadStatus", sortable: true },
          { name: "action", required: true, label: "", align: "left", field: "action", sortable: false },
          { name: "rejectLead", required: true, label: "", align: "left", field: "rejectLead", sortable: false },
        ],
        tableData: []
      };
    },
    computed: {
      ...mapGetters("SatLeadValidation", ["getAllLeadsValidationInfo"]),
    },
    mounted() {
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: this.filter
      });
    },
    methods: {
      ...mapActions("SatLeadValidation", ["FETCH_ALL_LEAD_VALIDATIONS_DATA"]),
      ajaxLoadAllLeadInfo({ pagination, filter }) {
        this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
        this.FETCH_ALL_LEAD_VALIDATIONS_DATA({ pagination, filter }).then(() => {
            this.paginationControl = pagination;
            this.paginationControl.rowsNumber = this.getAllLeadsValidationInfo.totalElements;
            this.paginationControl.page = this.getAllLeadsValidationInfo.number + 1;
            this.tableData = this.getAllLeadsValidationInfo.content;
            this.$q.loading.hide();
          })
          .catch(() => { this.$q.loading.hide(); });
      },
      openRejectLead(exceptionDetails) {
        this.showRejectLeadModel = !this.showRejectLeadModel;
        if (exceptionDetails) this.propsRejectLeadAppend = exceptionDetails;
      },
      PullToRefresh(done) {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
        done();
      },
      toggleLeadInformation(leadDetails) {
        this.propToggleLeadInformation = !this.propToggleLeadInformation;
        if (leadDetails) this.addtnLeadInformation = leadDetails;
      }
    }
  };
</script>

<style scoped>
  .q-btn-flat,
  .q-btn-outline {
    min-width: 100px !important;
  }
</style>
