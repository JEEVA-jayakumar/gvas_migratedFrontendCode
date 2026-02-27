<template>
  <q-page>
    <div class="q-pa-none">
      <!--STARTv-model: table title -->
      <div
        class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Exceptions</div>
      <!--END: table title -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter" v-model:pagination="paginationControl"
        :rows-per-page-options="[5,10,15,20]"
        @request="ajaxLoadDataForAllExceptionList"
        row-key="leadId"
        class="shadow-0"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="fnRowClick(props.row)"
            @mouseover="activeId = props.row.leadId"
            @mouseleave="activeId = ''"
            class="cursor-pointer"
            :class="[props.row.leadId === activeId ? 'bg-grey-3' : '']"
          >
            <q-td key="leadInformation.updatedAt" :props="props">
              <span class="label capitalize">{{ $moment(props.row.updatedAt).format("MMMM Do YYYY") }}</span>
            </q-td>
            <q-td key="leadInformation.leadNumber" :props="props">
              <span
                class="label capitalize text-primary cursor-pointer"
                @click.stop="toggleLeadInformation(props.row)"
              ># {{props.row.leadId }}</span>
            </q-td>
            <q-td key="leadInformation.leadName" :props="props">
              <span class="label capitalize">{{props.row.leadName}}</span>
            </q-td>
            <q-td key="leadInformation.assignedTo.name" :props="props">
              <span class="label capitalize">{{props.row.soName}}</span>
            </q-td>
            <q-td key="leadInformation.reason" :props="props">
              <span class="label capitalize">{{props.row.soRemarks}}</span>
            </q-td>
            <q-td key="leadInformation.createdBy.name" :props="props">
              <span class="label capitalize">{{props.row.satName}}</span>
            </q-td>
            <q-td key="kycSatRemark" :props="props">
              <span class="label capitalize">{{props.row.kycSatRemark}}</span>
            </q-td>
            <q-td key="expectedSubmitDate" :props="props">
              <span class="label capitalize">{{ $moment(props.row.expectedSubmitDate).format("MMMM Do YYYY") }}</span>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:top="props">
          <!--START: table search -->
          <div class="col-md-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search .."
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <!--END: table search -->
        </template>
      </q-table>
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "Exceptions",
  components: {
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      activeId: "",
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "updatedAt",
        descending: true,
        rowsPerPage: 10
      },
      filter: "",
      columns: [
        { name: "leadInformation.updatedAt", required: true, label: "Date of updation", align: "left", field: "updatedAt", sortable: true },
        { name: "leadInformation.leadNumber", required: true, label: "Lead ID", align: "center", field: "leadId", sortable: true },
        { name: "leadInformation.leadName", required: true, label: "Merchant Name", align: "left", field: "leadName", sortable: true },
        { name: "leadInformation.assignedTo.name", required: true, label: "SO Name", align: "left", field: "soName", sortable: true },
        { name: "leadInformation.reason", required: true, label: "SO Remarks", align: "left", field: "soRemarks", sortable: true },
        { name: "leadInformation.createdBy.name", required: true, label: "SAT Name", align: "left", field: "satName", sortable: true },
        { name: "kycSatRemark", required: true, label: "SAT Remarks", align: "left", field: "kycSatRemark", sortable: true },
        { name: "expectedSubmitDate", required: true, label: "Expected date of submission", align: "left", field: "expectedSubmitDate", sortable: true }
      ],
      tableData: []
    };
  },
  computed: {
    ...mapGetters("OPSHead", ["getKycExceptionInfo"]),
  },
  mounted() {
    this.ajaxLoadDataForAllExceptionList({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("OPSHead", ["FETCH_ALL_EXCEPTION_KYC_DATA"]),
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) this.addtnLeadInformation = leadDetails;
    },
    ajaxLoadDataForAllExceptionList({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching list .." });
      this.FETCH_ALL_EXCEPTION_KYC_DATA({ pagination, filter }).then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getKycExceptionInfo.totalElements;
          this.paginationControl.page = this.getKycExceptionInfo.number + 1;
          this.tableData = this.getKycExceptionInfo.content;
          if (this.getKycExceptionInfo.sort != null) {
            this.paginationControl.sortBy = this.getKycExceptionInfo.sort[0].property;
            this.paginationControl.descending = this.getKycExceptionInfo.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    fnRowClick(itemDetails) {
      this.$router.push("/ops/head/exceptions/" + itemDetails.leadId);
    }
  }
};
</script>
