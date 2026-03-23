<template>
  <div class="q-pa-none">
    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

    <q-table :rows="tableData" :columns="columnData" table-class="customTableClass" :filter="filterSearch"
      v-model:pagination="paginationControl" row-key="id" :loading="tableAjaxLoading"
      :rows-per-page-options="[10, 20, 50, 100]" color="dark" @request="ajaxLoadAllLeadInfo">
      <template v-slot:body-cell-leadNumber="props">
        <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
          <span class="label text-primary"># {{ props.row.leadNumber }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-submitToMarsDate="props">
        <q-td :props="props">{{ props.row.submitToMarsDate ? $moment(props.row.submitToMarsDate).format("Do MMM Y") : "NA" }}</q-td>
      </template>
      <template v-slot:top>
        <div class="col-md-5">
          <q-input clearable color="grey-9" v-model="filterSearch" label="Search By Lead Number" class="q-mr-lg q-py-sm" />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "varaneekRejectedLead",
  components: { generalLeadInformation },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      tableData: [],
      columnData: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: "leadNumber" },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: "submitToMarsDate", sortable: true },
        { name: "deviceType", label: "Device Type", align: "left", field: row => row.device?.deviceName || "NA" },
        { name: "rejectedAt", label: "Rejected At", align: "left", field: "marsReason" },
        { name: "reason", label: "Reason", align: "left", field: "marsReason" }
      ],
      paginationControl: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false
    };
  },
  computed: {
    ...mapGetters("varaneekImplementationQueue", ["getrejectStatusList"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("varaneekImplementationQueue", ["REJECT_STATUS_LIST"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.tableAjaxLoading = true;
      this.REJECT_STATUS_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getrejectStatusList.totalElements;
        this.tableData = this.getrejectStatusList.content;
        this.tableAjaxLoading = false;
      }).catch(() => { this.tableAjaxLoading = false; });
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    }
  }
};
</script>