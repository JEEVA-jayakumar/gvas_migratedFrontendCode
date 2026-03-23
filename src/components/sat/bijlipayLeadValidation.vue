<template>
  <div class="q-pa-none">
    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Lead Validation
    </div>

    <q-table table-class="customTableClass" :rows="tableData" :columns="columns" row-key="id" :filter="filter"
      v-model:pagination="paginationControl" :rows-per-page-options="[5, 10, 15, 20]" :loading="toggleAjaxLoadFilter"
      color="dark" @request="ajaxLoadAllLeadInfo">
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">{{ $moment(props.row.date).format("Do MMM Y") }}</q-td>
      </template>
      <template v-slot:body-cell-leadNumber="props">
        <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
          <span class="label" :class="[props.row.priority ? 'text-negative text-weight-bolder' : 'text-primary']">
            # {{ props.row.leadNumber }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-leadName="props">
        <q-td :props="props" class="capitalize">{{ props.row.merchantName }}</q-td>
      </template>
      <template v-slot:body-cell-state="props">
        <q-td :props="props" class="capitalize">{{ props.row.state }}</q-td>
      </template>
      <template v-slot:body-cell-soName="props">
        <q-td :props="props" class="capitalize">{{ props.row.salesOfficerName }}</q-td>
      </template>
      <template v-slot:body-cell-verifiedFinanceStatus="props">
        <q-td :props="props">
          <span class="label text-positive" v-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS">Approved</span>
          <span class="label text-negative" v-else-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_PENDING">Pending</span>
          <span class="label text-negative" v-else-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT">Rejected</span>
          <span class="label" v-else>NA</span>
        </q-td>
      </template>
      <template v-slot:body-cell-leadStatus="props">
        <q-td :props="props">
          <span class="label text-positive" v-if="props.row.verifiedFinanceStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS">New</span>
          <span class="label text-negative" v-if="props.row.verifiedFinanceStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_DOCUMENT_STATUS_REJECT">Rejected</span>
          <span class="label text-primary" v-else-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING">WIP</span>
          <span class="label text-orange" v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS">With ops</span>
          <span class="label text-negative" v-else>Pending</span>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING" outline color="purple-9" size="sm"
            @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')">Data Entry</q-btn>
          <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS" class="disabled" color="purple-9" size="sm">Pending with MARS</q-btn>
          <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS"
            outline color="purple-9" size="sm" :to="'/sat/lead/validation/' + props.row.leadId">Validate</q-btn>
          <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_REFER_BACK" outline color="amber-9" size="sm"
            @click="$router.push('/sat/lead/validation/' + props.row.leadId)">Referred Back</q-btn>
          <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING" outline color="amber-9" size="sm"
            @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')">RB - data entry</q-btn>
          <q-btn v-else class="disabled" outline color="grey-9" size="sm">Validate</q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-rejectLead="props">
        <q-td :props="props">
          <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD" outline class="q-mx-sm" color="negative"
            @click="openRejectLead(props.row)" size="sm">Reject Lead</q-btn>
        </q-td>
      </template>
      <template v-slot:top>
        <div class="col-md-5">
          <q-input clearable color="grey-9" v-model="filter" placeholder="Type.." :debounce="600" class="q-mr-lg q-py-sm"
            label="Search .. " />
        </div>
      </template>
    </q-table>

    <openRejectLeadComp v-if="showRejectLeadModel" :showRejectLeadModel="showRejectLeadModel"
      :propShowRejectLeadComponent="propsRejectLeadAppend" @closeRejectLeadModel="openRejectLead" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import openRejectLeadComp from "../../components/sat/openRejectLeadComp.vue";

export default {
  name: "bijlipayLeadValidation",
  components: { generalLeadInformation, openRejectLeadComp },
  data() {
    return {
      propToggleLeadInformation: false,
      showRejectLeadModel: false,
      addtnLeadInformation: null,
      propsRejectLeadAppend: null,
      filter: "",
      toggleAjaxLoadFilter: false,
      paginationControl: { rowsNumber: 10, page: 1, sortBy: "leadNumber", descending: false, rowsPerPage: 10 },
      columns: [
        { name: "createdAt", label: "Date(C)", align: "left", field: "date", sortable: true },
        { name: "leadNumber", label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
        { name: "leadName", label: "Merchant Name", align: "left", field: "merchantName", sortable: true },
        { name: "state", label: "State", align: "left", field: "state", sortable: true },
        { name: "soName", label: "SO Name", align: "left", field: "salesOfficerName", sortable: true },
        { name: "verifiedFinanceStatus", label: "Finance Approval", align: "left", sortable: true },
        { name: "leadStatus", label: "Status", align: "left", field: "leadStatus", sortable: true },
        { name: "action", label: "Action", align: "left" },
        { name: "rejectLead", label: "Reject", align: "left" }
      ],
      tableData: []
    };
  },
  computed: {
    ...mapGetters("SatLeadValidation", ["getAllLeadsValidationInfo"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("SatLeadValidation", ["FETCH_ALL_LEAD_VALIDATIONS_DATA"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true;
      this.FETCH_ALL_LEAD_VALIDATIONS_DATA({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getAllLeadsValidationInfo.totalElements;
        this.tableData = this.getAllLeadsValidationInfo.content;
        this.toggleAjaxLoadFilter = false;
      }).catch(() => { this.toggleAjaxLoadFilter = false; });
    },
    openRejectLead(details) {
      this.showRejectLeadModel = !this.showRejectLeadModel;
      if (details) this.propsRejectLeadAppend = details;
      if (!this.showRejectLeadModel) this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    }
  }
};
</script>