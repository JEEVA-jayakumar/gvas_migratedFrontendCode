<template>
  <q-page>
    <div>
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!--START: table title -->
      <div class="row bottom-border items-center">
        <div
          class="col q-title q-px-lg q-py-md text-weight-regular text-grey-9"
        >Lead Allocation Tracker</div>
        <div class="col-auto q-px-lg q-py-sm">
          <q-btn
            color="dark"
            label="Lead Allocation"
            icon="add"
            @click="$router.push('/sales/manager/lead/allocation/tracker/add/new')"
          />
        </div>
      </div>
      <!--END: table title -->
      <!--START: table lead validation -->
      <q-table
        title="Lead Validation"
        table-class="customTableClass"
        class="q-py-none"
        :rows="getAllLeadAllocationData.assignedLeads || []"
        :columns="columns"
        :filter="filter" v-model:pagination="paginationControl"
        row-key="id"
      >
        <template v-slot:body-cell-dateCreated="props">
          <q-td :props="props">
            {{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : 'NA' }}
          </q-td>
        </template>
        <template v-slot:body-cell-shortleadDate="props">
          <q-td :props="props">
            {{ props.row.shortleadDate ? $moment(props.row.shortleadDate).format("Do MMM Y") : 'NA' }}
          </q-td>
        </template>
        <template v-slot:body-cell-leadId="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row)"
          >
            <span class="text-primary cursor-pointer"># {{ props.row.leadNumber}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td
            class="breakAll"
            :props="props"
          >
            {{props.row.leadAddress}}
          </q-td>
        </template>
        <template v-slot:body-cell-assignedTo="props">
          <q-td :props="props">
            {{props.row.assignedTo == null? 'NA':props.row.assignedTo.name}}
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn label="Edit" color="amber-9" icon="edit" @click="navigateToEditScreen(props.row)"/>
          </q-td>
        </template>

        <template v-slot:top>
          <div class="col-md-5">
            <q-input
              clearable
              color="grey-9"
              v-model="filter"
              placeholder="Type.."
              label="Search by SO name, Merchant Name, Lead ID"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>
      </q-table>
      <!--END: table lead validation -->
      <!--START >>  Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35"/>
      </div>
      <!--END >>  Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators';
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: "SalesManagerLeadAllocationTracker",
  components: {
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,

      filter: "",
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsPerPage: 10
      },
      columns: [
        {
          name: "dateCreated",
          required: true,
          label: "Date Created",
          align: "left",
          field: row => row?.createdAt || "NA",
          sortable: true
        },
        {
          name: "shortleadDate",
          required: true,
          label: "Submitted On",
          align: "center",
          field: row => row?.shortleadDate || "NA",
          sortable: true
        },
        {
          name: "leadId",
          required: true,
          label: "Lead ID",
          align: "left",
          field: row => {
            return row?.leadNumber ? "# " + row.leadNumber : "NA";
          },
          sortable: true
        },
        {
          name: "leadName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row?.leadName || "NA",
          sortable: false
        },
        {
          name: "leadAddress",
          required: true,
          label: "Location",
          align: "left",
          field: row => row?.leadAddress || "NA",
          sortable: false
        },
        {
          name: "assignedTo",
          required: true,
          label: "SO Name",
          align: "left",
          field: row => row?.assignedTo?.name || "NA",
          sortable: false
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: row => row?.id || "NA",
          sortable: false
        }
      ],
      loading: true,
      tableData: [],
      lazy: [],
      select: "fb",
      multipleSelect: ["goog", "twtr"],
      error: true,
      warning: false,
      options: [
        {
          label: "Google",
          value: "goog"
        },
        {
          label: "Facebook",
          value: "fb"
        },
        {
          label: "Twitter",
          value: "twtr"
        },
        {
          label: "Apple Inc.",
          value: "appl"
        },
        {
          label: "Oracle",
          value: "ora"
        }
      ]
    };
  },

  created() {
    this.fnAjaxRequestPopulateTrackerData();
  },

  computed: {
    $v() {
      return this.v$;
    },
    ...mapGetters("SalesManager_LeadAllocation", ["getAllLeadAllocationData"])
  },

  methods: {
    ...mapActions("SalesManager_LeadAllocation", [
      "FETCH_ALL_LEAD_ALLOCATION_DATA"
    ]),
    //  Function to populate all lead allocation tracker
    fnAjaxRequestPopulateTrackerData() {
      this.FETCH_ALL_LEAD_ALLOCATION_DATA();
    },
    navigateToEditScreen(item) {
      this.$router.push({
        name: "leadAllocationEdit",
        params: { id: item.id }
      });
    },
    // Function to toggle lead information pop up screen
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    }
  }
};
</script>

<style>
</style>
