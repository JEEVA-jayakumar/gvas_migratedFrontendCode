<template>
  <q-page>
    <div>
      <!--STARTv-model: table title -->
      <div
        class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Bijlipay Master Tracker-Implemented</div>
      <!--END: table title -->
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <!-- content -->
      <!--START: table lead validation -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5,10,15,20,25]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-tid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{props.row.tid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{props.row.mid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadNumber="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            <span class="label text-primary"># {{props.row.leadInformation.leadNumber}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mobileNumber="props">
          <q-td :props="props">
            {{props.row.leadInformation == null? 'NA':props.row.leadInformation.contactNumber}}
          </q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td :props="props">
            {{props.row.leadInformation == null? 'NA':props.row.leadInformation.leadAddress}}
          </q-td>
        </template>
        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td :props="props">
            <span class="label">{{ $moment(props.row.deviceStatusDate).format("Do MMM Y") }}</span>
          </q-td>
        </template>

        <template v-slot:top>
          <!--START: table filter,search,excel download -->
          <div class="col-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search by MID, TID, Merchant Name"
              class="q-mr-lg q-py-sm"
            />
          </div>
          <div class="col-md-6">
            <q-btn 
            square 
            outline 
            color="purple-9" 
            label="Download as Excel" 
            class="q-mr-lg q-py-sm float-right" 
            size="md" 
            @click="downloadmastertrackerlist()" />
          </div>
        </template>
      </q-table>
      <!--END: table lead validation -->
      <!--START >>  Download Reports -->
      <DownloadMasterTracker
         v-if="propMasterTrackerList" 
        :propMasterTrackerList="propMasterTrackerList" 
        @emitfnshowMasterTrackerList="downloadmastertrackerlist"
     ></DownloadMasterTracker>
      <!--END:  Download Reports-->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      ></showMerchantTransactionLevelDetails>

      <!--START >>  Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
      <!--END >>  Show Ajax Spinner --> 
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import DownloadMasterTracker from "../../components/sat/DownloadMasterTracker.vue";

export default {
  name: "merchantTransactionLevel",
  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    DownloadMasterTracker,
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propMasterTrackerList: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "tid",
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      valueToggleMerchantTransaction: false,
      filter: "",
      columns: [
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: "tid",
          sortable: true
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: "mid",
          sortable: true
        },
        {
          name: "leadNumber",
          required: true,
          label: "Lead Id",
          align: "left",
          field: row => {
            return row.leadInformation ? row.leadInformation.leadNumber : 'NA';
          },
          sortable: false
        },
        {
          name: "leadInformation",
          required: true,
          label: "ME Name",
          align: "left",
          field: row => {
            return row.leadInformation ? row.leadInformation.leadName : 'NA';
          },
          sortable: false
        },
        {
          name: "leadAddress",
          required: true,
          label: "Merchant Address",
          align: "center",
          field: row => {
            return row.leadInformation ? row.leadInformation.leadAddress : 'NA';
          },
          sortable: false
        },
        {
          name: "deviceName",
          required: true,
          label: "Device type",
          align: "right",
          field: row => {
            return row.leadInformation && row.leadInformation.device ? row.leadInformation.device.deviceName : 'NA';
          },
          sortable: false
        },
        {
          name: "device_serial_number",
          required: true,
          label: "Device Serial Number",
          align: "left",
          field: row => {
            return row.regionalInventory == null
              ? "NA"
              : row.regionalInventory.serialNumber;
          },
          sortable: true
        },
        {
          name: "deviceStatusDate",
          required: true,
          label: "Implementation Date",
          align: "left",
          field: "deviceStatusDate",
          sortable: true
        },
        {
          name: "assignedTo",
          required: true,
          label: "Implemented by",
          align: "left",
          field: row => {
            return row.assignedTo == null ? "NA" : row.assignedTo.name + " | " + row.assignedTo.employeeID;
          },
          sortable: true
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Implemented Address",
          align: "left",
          field: row => {
            return row.deviceAddress;
          },
          sortable: true
        },
        {
          name: "mobileNumber",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: row => {
            return row.leadInformation ? row.leadInformation.contactNumber : 'NA';
          },
          sortable: false
        }
      ],
      loading: true,
      filter_values: ""
    };
  },
  computed: {
    ...mapGetters("MasterTracker", ["getMasterTrackerList"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("MasterTracker", ["MASTER_TRACKER_LIST"]),
   
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.MASTER_TRACKER_LIST({ pagination, filter }).then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getMasterTrackerList.totalElements;
          this.paginationControl.page = this.getMasterTrackerList.number + 1;
          this.tableData = this.getMasterTrackerList.content;
          if (this.getMasterTrackerList.sort != null) {
            this.paginationControl.sortBy = this.getMasterTrackerList.sort[0].property;
            this.paginationControl.descending = this.getMasterTrackerList.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    downloadmastertrackerlist(){
      this.propMasterTrackerList=!this.propMasterTrackerList;
    },
  }
};
</script>

<style>
</style>
