<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-lg">
      <!-- //Common lead information in popup -->
      <generalLeadInformation v-if="propToggleLeadInformation" v-model:leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

      <q-pull-to-refresh :distance="30" :handler="PullToRefresh">
        <q-card flat bordered class="overflow-hidden">
          <q-card-section class="row items-center q-pb-none">
             <div class="text-h6 text-weight-bold text-grey-8 uppercase ls-1">Lead Validation</div>
             <q-space />
             <q-input dense outlined debounce="600" v-model="filter" placeholder="Search Merchants..." style="min-width: 300px">
                <template v-slot:append><q-icon name="search" /></template>
             </q-input>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <q-table
              flat
              :rows="tableData"
              :columns="columns"
              row-key="name"
              :filter="filter"
              :pagination="paginationControl"
              :rows-per-page-options="[5,10,15,20]"
              :loading="toggleAjaxLoadFilter"
              @request="ajaxLoadAllLeadInfo"
              class="bg-transparent"
            >
              <!--START: table body modification -->
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props" class="text-grey-7">{{ props.row.date | moment("Do MMM Y") }}</q-td>
              </template>

              <template v-slot:body-cell-leadNumber="props">
                <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
                  <span class="text-weight-bold" :class="[props.row.priority?'text-negative':'text-primary']">
                    #{{props.row.leadNumber}}
                    <q-tooltip v-if="props.row.priority">High Priority</q-tooltip>
                  </span>
                </q-td>
              </template>

              <template v-slot:body-cell-leadName="props">
                <q-td :props="props">
                  <div class="text-weight-bold text-grey-9 capitalize">{{props.row.merchantName}}</div>
                  <div class="text-caption text-grey-5">{{props.row.state}}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-assignedTo.name="props">
                <q-td :props="props">
                   <div class="text-body2 text-grey-8">{{props.row.salesOfficerName}}</div>
                   <div class="text-caption text-grey-5">{{props.row.salesOfficerEmpId}}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-leadSource="props">
                <q-td :props="props">
                  <q-badge outline :color="props.row.leadSource === 'LS_TOHANDS' ? 'negative' : 'grey-7'" class="q-pa-xs">
                    {{ props.row.leadSource }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-verifiedFinanceStatus="props">
                <q-td :props="props">
                  <q-badge v-if="props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_SUCCESS" color="positive" class="q-pa-xs">Approved</q-badge>
                  <q-badge v-else-if="props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_PENDING" color="warning" class="q-pa-xs">Pending</q-badge>
                  <q-badge v-else-if="props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_REJECT" color="negative" class="q-pa-xs">Rejected</q-badge>
                  <q-badge v-else color="grey-4" text-color="grey-8">NA</q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-leadStatus="props">
                <q-td :props="props">
                  <q-chip dense v-if="props.row.verifiedFinanceStatus== $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus== $VERIFIED_FINANCE_STATUS_SUCCESS" color="green-1" text-color="green-9" label="New" />
                  <q-chip dense v-else-if="props.row.leadStatus== $LEAD_STATUS_DATA_ENTRY_PENDING" color="blue-1" text-color="blue-9" label="WIP" />
                  <q-chip dense v-else-if="props.row.leadStatus== $LEAD_STATUS_SUBMITED_TO_MARS" color="orange-1" text-color="orange-9" label="With Ops" />
                  <q-chip dense v-else color="grey-2" text-color="grey-7" label="Pending" />
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING" unelevated color="primary" size="sm" label="Data Entry" @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')" />
                  <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS" flat color="grey-6" size="sm" label="Pending MARS" disable />
                  <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS" unelevated color="primary" size="sm" label="Validate" :to="'/sat/lead/validation/'+ props.row.leadId" />
                  <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_REFER_BACK" outline color="warning" size="sm" label="Referred Back" @click="$router.push('/sat/lead/validation/'+ props.row.leadId)" />
                  <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_MARS_SUB_TID_PENDING || props.row.leadStatus == $LEAD_STATUS_BASE_TID_PENDING" outline color="primary" size="sm" label="Sub Tid Validation" @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')" />
                  <q-btn v-else-if="props.row.leadStatus == $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING" outline color="warning" size="sm" label="RB - Data Entry" @click="$router.push('/sat/lead/validation/'+ props.row.leadId+'/data/entry')" />
                  <q-btn v-else flat color="grey-4" size="sm" label="Validate" disable />
                </q-td>
              </template>

              <template v-slot:body-cell-rejectLead="props">
                <q-td :props="props">
                  <q-btn v-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD" flat round color="negative" icon="delete_outline" @click="openRejectLead(props.row)">
                    <q-tooltip>Reject Lead</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
              <!-- END: table body modification -->
            </q-table>
          </q-card-section>
        </q-card>
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
import { required, or } from '@vuelidate/validators';
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
        propsRejectAppend: [],
        columns: [
          {
            name: "createdAt",
            required: true,
            label: "Date(C)",
            align: "left",
            field: "date",
            sortable: true
          },
          {
            name: "leadNumber",
            required: true,
            label: "Lead ID",
            align: "center",
            field: row => {
              return "# " + row.leadNumber;
            },
            sortable: true
          },
          {
            name: "leadName",
            required: true,
            label: "Merchant Name",
            align: "left",
            field: "merchantName",
            sortable: true
          },
          // {
          //   name: "deviceCount",
          //   required: true,
          //   label: "Device Count",
          //   align: "left",
          //   field: "deviceCount",
          //   sortable: true
          // },
          // {
          //   name: "subTid",
          //   required: true,
          //   label: "Sub Tid",
          //   align: "left",
          //   field: "subTid",
          //   sortable: true
          // },
          {
            name: "state",
            required: true,
            label: "State",
            align: "left",
            field: "state",
            sortable: true
          },
          {
            name: "assignedTo.name",
            required: true,
            label: "SO Name",
            align: "left",
            field: row => {
              return row.salesOfficerName + " | " + row.salesOfficerEmpId;
            },
            sortable: true
          },
          {
            name: "leadSource",
            required: true,
            label: "Lead Source",
            align: "left",
            field: row => {
              return row.leadSource;
            },
            sortable: true
          },
          {
            name: "verifiedFinanceStatus",
            required: true,
            label: "Finance Approval",
            align: "left",
            field: row => {
              return row.verifiedFinanceStatus ==
                this.$VERIFIED_FINANCE_STATUS_SUCCESS
                ? "Success"
                : row.verifiedFinanceStatus ==
                  this.$VERIFIED_FINANCE_STATUS_PENDING
                  ? "Pending"
                  : row.verifiedFinanceStatus ==
                    this.$VERIFIED_FINANCE_STATUS_REJECT
                    ? "Rejected"
                    : "NA";
            },
            sortable: true
          },
          {
            name: "leadStatus",
            required: true,
            label: "Status",
            align: "left",
            field: "leadStatus",
            sortable: true
          },
          {
            name: "action",
            required: true,
            label: "",
            align: "left",
            field: "action",
            sortable: false
          },
          {
            name: "rejectLead",
            required: true,
            label: "",
            align: "left",
            field: "rejectLead",
            sortable: false
          },
        ],
        tableData: []
      };
    },
    computed: {
      ...mapGetters("SatLeadValidation", ["getAllLeadsValidationInfo"]),
      ...mapGetters("SatLeadValidation", ["getShortLeadInfo"])
    },
    mounted() {
      this.ajaxLoadAllLeadInfo({
        pagination: this.paginationControl,
        filter: this.filter
      });

    },
    // created(){
    //   this.ajaxLoadAllLeadInfo1();
    // },
    methods: {
      ...mapActions("SatLeadValidation", ["FETCH_ALL_LEAD_VALIDATIONS_DATA"]),
      ...mapActions("SatLeadValidation", ["FETCH_SHORT_LEAD_DATA"]),
      //Load all short lead info while page loading

      // ajaxLoadAllLeadInfo1(){

      //   //  this.tableData = this.getShortLeadInfo;
      //   //   console.log("FETCH_ALL_LEAD_VALIDATIONS_DATA ---->",JSON.stringify(this.getAllLeadsValidationInfo))
      //   // this.FETCH_SHORT_LEAD_DATA(
      //   //   this.getAllLeadsValidationInfo.id
      //   // )
      //   // .then(response => {
      //   //   console.log("response FETCH_ALL_LEAD_VALIDATIONS_DATA  ---->",JSON.stringify(response))
      //   //   console.log("FETCH_ALL_LEAD_VALIDATIONS_DATA 123 ---->",JSON.stringify(this.getShortLeadInfo))
      //   //     // this.propLeadInformation = this.getShortLeadInfo;
      //   //     // this.$q.loading.hide();
      //   //   })
      //   //   .catch(() => {
      //   //     this.$q.loading.hide();
      //   //   });
      // },

      ajaxLoadAllLeadInfo({ pagination, filter }) {
        // we set QTable to "loading" state
        this.$q.loading.show({
          delay: 0, // ms
          spinnerColor: "purple-9",
          message: "Fetching data .."
        });
        this.FETCH_ALL_LEAD_VALIDATIONS_DATA({ pagination, filter })
          .then(res => {
            // updating pagination to reflect in the UI
            this.paginationControl = pagination;

            // we also set (or update) rowsNumber
            this.paginationControl.rowsNumber = this.getAllLeadsValidationInfo.totalElements;
            this.paginationControl.page =
              this.getAllLeadsValidationInfo.number + 1;

            // then we update the rows with the fetched ones
            this.tableData = this.getAllLeadsValidationInfo.content;
            if (this.getAllLeadsValidationInfo.sort != null) {
              this.paginationControl.sortBy = this.getAllLeadsValidationInfo.sort[0].property;
              this.paginationControl.descending = this.getAllLeadsValidationInfo.sort[0].ascending;
            }

            // finally we tell QTable to exit the "loading" state
            this.$q.loading.hide();
          })
          .catch(() => {
            this.$q.loading.hide();
          });
      },
      openRejectLead(exceptionDetails) {
        this.showRejectLeadModel = !this.showRejectLeadModel;
        this.propsRejectLeadAppend = exceptionDetails;
      },

      //Function pull to refresh
      PullToRefresh(done) {
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter
        });
      },

      // Function to toggle lead information pop up screen
      toggleLeadInformation(leadDetails) {
        console.log(leadDetails);
        this.propToggleLeadInformation = !this.propToggleLeadInformation;
        if (leadDetails != undefined) {
          this.addtnLeadInformation = leadDetails;
        }
      }
    }
  };
</script>

<style scoped>
  .ls-1 { letter-spacing: 0.05em; }
  .uppercase { text-transform: uppercase; }
</style>
