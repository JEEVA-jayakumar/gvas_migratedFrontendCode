<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-container shadow-1 bg-white border-radius-16 overflow-hidden">
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Premium Page Header -->
      <div class="q-pa-lg border-bottom bg-white">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-overline text-purple-9 text-weight-bold">SAT Module</div>
            <h1 class="text-h5 text-weight-bold text-slate-900 q-ma-none">Lead Validation Queue</h1>
          </div>
          <div class="flex gap-sm">
             <q-btn flat color="slate-600" icon="refresh" @click="PullToRefresh()" class="premium-btn" />
          </div>
        </div>

        <!-- Sticky Persistent Filter -->
        <div class="row q-col-gutter-md items-center">
          <div class="col-md-6 col-sm-12">
            <q-input
              clearable
              v-model="filter"
              outlined
              placeholder="Search by Merchant, Lead ID, or Source..."
              class="premium-search"
              dense
              bg-color="slate-50"
              debounce="600"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="slate-400" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
        <!-- Premium Table -->
        <q-table
          flat
          class="premium-table sticky-header-table"
          :rows="tableData"
          :columns="columns"
          row-key="leadId"
          :filter="filter"
          v-model:pagination="paginationControl"
          :rows-per-page-options="[10, 20, 50]"
          :loading="toggleAjaxLoadFilter"
          @request="ajaxLoadAllLeadInfo"
        >
          <!-- Skeletons Loading -->
          <template v-slot:loading>
            <q-inner-loading showing color="purple-9">
              <div class="full-width q-pa-md">
                <div v-for="i in 8" :key="i" class="row q-mb-md q-col-gutter-md">
                  <div v-for="j in 10" :key="j" class="col"><div class="skeleton-box" style="width: 100%; height: 20px;"></div></div>
                </div>
              </div>
            </q-inner-loading>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props" v-if="props && props.row">
               <div class="text-slate-500">{{ $moment(props.row.date).format("DD MMM YYYY") }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)" v-if="props && props.row">
              <q-badge :color="props.row.priority ? 'red-1' : 'purple-1'" :text-color="props.row.priority ? 'red-9' : 'purple-9'" class="q-pa-xs text-weight-bold">
                # {{props.row.leadNumber}}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-leadName="props">
            <q-td :props="props" v-if="props && props.row">
              <div class="text-weight-bold text-slate-900">{{props.row.merchantName}}</div>
              <div class="text-caption text-slate-400">{{props.row.state}}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-assignedTo_name="props">
            <q-td :props="props" v-if="props && props.row">
              <div class="text-slate-600 font-medium">{{props.row.salesOfficerName || 'NA'}}</div>
              <div class="text-caption text-slate-400">ID: {{props.row.salesOfficerEmpId || 'NA'}}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-leadSource="props">
            <q-td :props="props" v-if="props && props.row">
              <q-badge outline :color="props.row.leadSource === 'LS_TOHANDS' ? 'red-8' : 'slate-400'" :label="props.row.leadSource" />
            </q-td>
          </template>

          <template v-slot:body-cell-verifiedFinanceStatus="props">
            <q-td :props="props" v-if="props && props.row">
              <q-badge
                rounded
                :color="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS ? 'green-1' : (props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT ? 'red-1' : 'amber-1')"
                :text-color="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS ? 'green-9' : (props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT ? 'red-9' : 'amber-9')"
                :label="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS ? 'Approved' : (props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT ? 'Rejected' : 'Pending')"
                class="q-px-sm"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-leadStatus="props">
            <q-td :props="props" v-if="props && props.row">
              <div class="text-weight-medium" :class="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING ? 'text-blue-7' : (props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS ? 'text-orange-8' : 'text-slate-600')">
                {{ props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING ? 'WIP' : (props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS ? 'With Ops' : 'Pending') }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props" v-if="props && props.row" class="text-right">
              <div class="flex items-center justify-end gap-sm">
                <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING" unelevated
                  color="purple-9" size="sm" class="action-btn"
                  @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')" label="Data Entry" />

                <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS" flat disable
                  color="slate-400" size="sm" label="With MARS" />

                <q-btn
                  v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS"
                  unelevated color="purple-9" size="sm" class="action-btn"
                  :to="'/sat/lead/validation/'+ props.row.leadId" label="Validate" />

                <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_REFER_BACK" unelevated color="amber-9"
                  size="sm" class="action-btn" @click="$router.push('/sat/lead/validation/'+ props.row.leadId)" label="Referred Back" />

                <q-btn v-else disable flat color="slate-300" size="sm" label="Validate" />

                <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD" flat round
                  color="red-8" @click="openRejectLead(props.row)" size="sm" icon="delete_outline">
                  <q-tooltip>Reject Lead</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width q-pa-xl text-center text-slate-400">
               <q-icon name="assignment_late" size="64px" class="q-mb-md opacity-20" />
               <div class="text-h6 opacity-50">No leads currently in queue</div>
            </div>
          </template>
        </q-table>
      </q-pull-to-refresh>

      <openRejectLeadComp v-if="showRejectLeadModel" :showRejectLeadModel="showRejectLeadModel"
        :propShowRejectLeadComponent="propsRejectLeadAppend" @closeRejectLeadModel="openRejectLead" />
    </div>
  </q-page>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import generalLeadInformation from "../../components/generalLeadInformation.vue";
  import openRejectLeadComp from "../../components/sat/openRejectLeadComp.vue";
  export default {
    name: "leadValidation",
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
        columns: [
          { name: "createdAt", label: "Created", align: "left", field: "date", sortable: true },
          { name: "leadNumber", label: "Lead ID", align: "left", field: "leadNumber", sortable: true },
          { name: "leadName", label: "Merchant Info", align: "left", field: "merchantName", sortable: true },
          { name: "assignedTo_name", label: "Sales Officer", align: "left", field: row => row.salesOfficerName, sortable: true },
          { name: "leadSource", label: "Source", align: "left", field: "leadSource", sortable: true },
          { name: "verifiedFinanceStatus", label: "Finance", align: "left", field: "verifiedFinanceStatus", sortable: true },
          { name: "leadStatus", label: "Status", align: "left", field: "leadStatus", sortable: true },
          { name: "action", label: "Actions", align: "right", field: "action" }
        ],
        tableData: []
      };
    },
    computed: {
      ...mapGetters("SatLeadValidation", ["getAllLeadsValidationInfo", "getShortLeadInfo"])
    },
    mounted() {
      this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
    },
    methods: {
      ...mapActions("SatLeadValidation", ["FETCH_ALL_LEAD_VALIDATIONS_DATA"]),
      ajaxLoadAllLeadInfo({ pagination, filter }) {
        this.toggleAjaxLoadFilter = true;
        this.FETCH_ALL_LEAD_VALIDATIONS_DATA({ pagination, filter })
          .then(res => {
            this.paginationControl = pagination;
            this.paginationControl.rowsNumber = this.getAllLeadsValidationInfo.totalElements;
            this.paginationControl.page = this.getAllLeadsValidationInfo.number + 1;
            this.tableData = this.getAllLeadsValidationInfo.content;
            if (this.getAllLeadsValidationInfo.sort != null) {
              this.paginationControl.sortBy = this.getAllLeadsValidationInfo.sort[0].property;
              this.paginationControl.descending = !this.getAllLeadsValidationInfo.sort[0].ascending;
            }
            this.toggleAjaxLoadFilter = false;
          })
          .catch(() => { this.toggleAjaxLoadFilter = false; });
      },
      openRejectLead(exceptionDetails) {
        this.showRejectLeadModel = !this.showRejectLeadModel;
        this.propsRejectLeadAppend = exceptionDetails;
      },
      PullToRefresh(done) {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
        if (done) done();
      },
      toggleLeadInformation(leadDetails) {
        this.propToggleLeadInformation = !this.propToggleLeadInformation;
        if (leadDetails != undefined) this.addtnLeadInformation = leadDetails;
      }
    }
  };
</script>

<style lang="scss" scoped>
.premium-container {
  border: 1px solid #e2e8f0;
}

.border-bottom { border-bottom: 1px solid #f1f5f9; }

.premium-btn {
  border-radius: 10px !important;
  font-weight: 600;
}

.action-btn {
  border-radius: 8px !important;
  font-weight: 600;
  min-width: 100px;
}

.premium-search {
  ::v-deep(.q-field__control) {
    border-radius: 10px !important;
    &:hover { background: #fff !important; }
  }
}

.premium-table {
  ::v-deep(.q-table__top) { display: none; }

  ::v-deep(thead tr th) {
    background: #f8fafc;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.7rem;
    padding: 16px !important;
  }

  ::v-deep(tbody tr) {
    transition: background 0.2s ease;
    &:hover { background: #fafafa !important; }
    td { padding: 16px !important; border-bottom: 1px solid #f8fafc; }
  }
}

.border-radius-16 { border-radius: 16px; }
.text-slate-900 { color: #0f172a; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.text-purple-1 { background-color: #faf5ff; }
.text-red-1 { background-color: #fef2f2; }
.bg-amber-1 { background-color: #fffbeb; }
.bg-green-1 { background-color: #f0fdf4; }
.gap-sm { gap: 8px; }
.opacity-20 { opacity: 0.2; }
.opacity-50 { opacity: 0.5; }
</style>
