<template>
  <q-page>
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Aggregator Lead Validation</div>

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
        :rows-per-page-options="[5,10,15,20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-leadNumber="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row)"
          >
            <span class="label text-primary"> {{props.row.leadNumber}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-date="props">
          <q-td :props="props">
            {{ $moment(props.row.date).format("Do MMM Y") }}
          </q-td>
        </template>
        <template v-slot:body-cell-verifiedFinanceStatus="props">
          <q-td :props="props">
            <span
              class="label text-positive"
              v-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS"
            >Approved</span>
            <span
              class="label text-negative"
              v-else-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_PENDING"
            >Pending</span>
            <span
              class="label text-negative"
              v-else-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT"
            >Rejected</span>
            <span class="label" v-else>NA</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadStatus="props">
          <q-td :props="props">
            <span
              class="label text-positive"
              v-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS"
            >New</span>
            <span
              class="label text-negative"
              v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus == $VERIFIED_DOCUMENT_STATUS_REJECT"
            >Rejected</span>
            <q-btn
              v-else-if="props.row.leadStatus == $LEAD_STATUS_MARS_APPROVED"
              disable
              color="positive"
              size="sm"
              label="Mars Approved"
            />
            <span
              class="label text-primary"
              v-else-if="props.row.leadStatus == $LEAD_STATUS_DATA_ENTRY_PENDING"
            >WIP</span>
            <q-btn
              v-else-if="props.row.leadStatus == $LEAD_STATUS_SUBMITED_TO_MARS"
              disable
              color="purple-9"
              size="sm"
              label="Submitted To Mars"
            />
            <span class="label text-negative" v-else>Pending</span>
          </q-td>
        </template>
        <template v-slot:top>
          <div class="col-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search By Merchant Name, Lead ID.."
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import generalLeadInformation from '../../components/generalLeadInformation.vue';

export default {
  name: 'getaggregatorLeadValidationData',
  components: {
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propRowDetails: "",
      propShowLeadNumberDetails: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: 'leadNumber',
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      filter: '',
      columns: [
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'date',
          sortable: false
        },
        {
          name: 'leadNumber',
          required: true,
          label: 'leadNumber',
          align: 'left',
          field: 'leadNumber',
          sortable: true
        },
        {
          name: 'leadId',
          required: true,
          label: 'Lead Id',
          align: 'left',
          field: 'leadId',
          sortable: false
        },
        {
          name: 'merchantName',
          required: true,
          label: 'Merchant Name',
          align: 'left',
          field: 'merchantName',
          sortable: false
        },
        {
          name: 'state',
          required: true,
          label: 'State',
          align: 'center',
          field: 'state',
          sortable: false
        },
        {
          name: 'salesOfficerName',
          required: true,
          label: 'SO Name',
          align: 'center',
          field: row => row.salesOfficerName + " | " + row.salesOfficerEmpId,
          sortable: false
        },
        {
          name: "verifiedFinanceStatus",
          required: true,
          label: "Finance Approval",
          align: "left",
          field: row => {
            return row.verifiedFinanceStatus == this.$VERIFIED_FINANCE_STATUS_SUCCESS
              ? "Success"
              : row.verifiedFinanceStatus == this.$VERIFIED_FINANCE_STATUS_PENDING
              ? "Pending"
              : row.verifiedFinanceStatus == this.$VERIFIED_FINANCE_STATUS_REJECT
              ? "Rejected"
              : "NA";
          },
          sortable: true
        },
        {
          name: 'leadStatus',
          required: true,
          label: 'Status',
          align: 'center',
          field: 'leadStatus',
          sortable: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters('aggregatorLeadValidation', ['getaggregatorLeadValidationData']),
  },
  mounted () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions('aggregatorLeadValidation', ['FETCH_AGGREGATOR_LEAD_VALIDATION_DATAS']),
    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });
      this.FETCH_AGGREGATOR_LEAD_VALIDATION_DATAS({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getaggregatorLeadValidationData.totalElements;
          this.paginationControl.page = this.getaggregatorLeadValidationData.number + 1;
          this.tableData = this.getaggregatorLeadValidationData.content;
          if (this.getaggregatorLeadValidationData.sort != null) {
            this.paginationControl.sortBy = this.getaggregatorLeadValidationData.sort[0].property;
            this.paginationControl.descending = !this.getaggregatorLeadValidationData.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    toggleLeadInformation (leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
  } 
};
</script>
