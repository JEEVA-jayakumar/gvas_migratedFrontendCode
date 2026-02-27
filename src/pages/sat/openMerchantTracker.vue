<template>
  <q-page>
    <div class="capitalize">
      <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
        <!-- //Common lead information in popup -->
        <generalLeadInformation
          v-if="propToggleLeadInformation"
          :leadInformation="addtnLeadInformation"
          :propToggleLeadInformationPop="propToggleLeadInformation"
          @closeLeadInformation="toggleLeadInformation"
        />
        <!--START: table title -->
        <div
          class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >Bijlipay Open Merchant Tracker/Lead Tracker</div>
        <!--END: table title -->
        <!--START: table open merchant tracker -->
        <q-table
          table-class="customTableClass"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="id"
        >
          <!--START: table body modification -->
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              <span class="label">{{ $moment(props.row.createdAt).format("Do MMM Y") }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-submitteSATDate="props">
            <q-td :props="props">
              <span class="label">{{ $moment(props.row.submitteSATDate).format("Do MMM Y") }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-applicationNumber="props">
            <q-td :props="props">
              <span class="label capitalize">{{props.row.applicationNumber}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-leadName="props">
            <q-td :props="props">
              <span class="label capitalize">{{props.row.leadName}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-leadNumber="props">
            <q-td
              :props="props"
              class="cursor-pointer"
              @click="toggleLeadInformation(props.row)"
            >
              <span class="label text-primary"># {{props.row.leadNumber}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-createdBy="props">
            <q-td :props="props">
              <span class="label">{{props.row.createdBy ? props.row.createdBy.name + " | " + props.row.createdBy.employeeID : 'NA'}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-leadAddress="props">
            <q-td :props="props">
              <span class="label">{{props.row.leadAddress}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-verifiedStatus="props">
            <q-td :props="props">
              {{props.row.verifiedStatus}}
            </q-td>
          </template>
          <!--END: table body modification -->
          <template v-slot:top>
            <!--START: table filter,search,excel download -->
            <div class="col-5">
              <q-input
                clearable
                v-model="filter"
                color="grey-9"
                placeholder="Type.."
                label="Search by Merchant Name, Lead ID"
                class="q-mr-lg q-py-sm"
              />
            </div>
            <!--END: table filter,search -->
          </template>
        </q-table>
        <!--END: table open merchant tracker -->
      </q-pull-to-refresh>
      <!--START >>  Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35"/>
      </div>
      <!--END >>  Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "openMerchantTracker",
  components: {
    generalLeadInformation
  },
  data: () => ({
    propToggleLeadInformation: false,
    addtnLeadInformation: null,

    toggleAjaxLoadFilter: false,
    paginationControl: {
      rowsPerPage: 10
    },
    filter: "",
    columns: [
      {
        name: "createdAt",
        required: true,
        label: "Created Date",
        align: "left",
        field: "createdAt",
        sortable: true
      },
      {
        name: "submitteSATDate",
        required: true,
        label: "Submitted Date",
        align: "center",
        field: "submitteSATDate",
        sortable: true
      },
      {
        name: "applicationNumber",
        required: true,
        label: "MRL app no",
        align: "left",
        field: row => {
          return row.applicationNumber || "NA";
        },
        sortable: true
      },
      {
        name: "leadNumber",
        required: true,
        label: "Lead ID",
        align: "left",
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
        field: "leadName",
        sortable: false
      },
      {
        name: "leadAddress",
        required: true,
        label: "Location",
        align: "left",
        field: "leadAddress",
        sortable: false
      },
      {
        name: "createdBy",
        required: true,
        label: "SO Name",
        align: "left",
        field: row => row.createdBy ? row.createdBy.name : 'NA',
        sortable: false
      },
      {
        name: "verifiedStatus",
        required: true,
        label: "Status",
        align: "left",
        field: "verifiedStatus",
        sortable: false
      }
    ],
    tableData: [],
  }),

  created() {
    this.ajaLoadDataAllopenAggMerchantTrackerData();
  },

  computed: {
    ...mapGetters("OpenMerchantTracker", ["getAggOpenMerchantTracker"]),
    ...mapGetters("commonLoader", ["getToggleCommonLoader"])
  },
  methods: {
    ...mapActions("OpenMerchantTracker", [
      "FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA"
    ]),
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),

    ajaLoadDataAllopenAggMerchantTrackerData() {
      this.TOGGLE_COMMON_LOADER(true);
      this.FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA()
        .then(response => {
          this.tableData = this.getAggOpenMerchantTracker;
          this.TOGGLE_COMMON_LOADER(false);
        })
        .catch(() => {
          this.TOGGLE_COMMON_LOADER(false);
        });
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },

    PullToRefresh(done) {
      this.FETCH_ALL_AGG_OPEN_MERCHANT_TRACKER_DATA()
        .then(response => {
          this.tableData = this.getAggOpenMerchantTracker;
          done();
        })
        .catch(() => {
          done();
        });
    }
  }
};
</script>

<style>
</style>
