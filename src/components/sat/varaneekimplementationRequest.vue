<template>
  <div class="q-pa-md">
    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

    <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
      <q-tab color="dark" name="statusTab" label="TID & MID STATUS" />
      <q-tab color="dark" name="rejectedTab" label="Rejected Leads" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="rejectedTab" class="no-padding">
        <varaneekRejectedLead />
      </q-tab-panel>
      <q-tab-panel name="statusTab" class="no-padding">
        <q-table :rows="tableData1" :columns="columnData" table-class="customTableClass" :filter="filterSearch"
          v-model:pagination="paginationControl1" row-key="id" :rows-per-page-options="[10, 20, 50, 100]"
          :loading="tableAjaxLoading1" color="dark" @request="ajaxLoadAllLeadInfo1">
          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
              <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-submitToMarsDate="props">
            <q-td :props="props">{{ props.row.leadInformation?.submitToMarsDate ?
              $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : "NA" }}</q-td>
          </template>
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
          </template>
          <template v-slot:body-cell-mid="props">
            <q-td :props="props" class="customTd">
              <div class="text-primary">{{ props.row.mid }}</div>
            </q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch" label="Search By MID, TID"
                class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import varaneekRejectedLead from "../../components/sat/varaneekRejectedLead.vue";

export default {
  name: "varaneekimplementationRequest",
  components: {
    generalLeadInformation,
    varaneekRejectedLead
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      selectedTab: "statusTab",
      tableData1: [],
      paginationControl1: { sortBy: "deviceStatusDate", descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading1: false,
      columnData: [
        { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation?.device?.deviceName },
        { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation?.submitToMarsDate, sortable: true }
      ]
    };
  },
  computed: {
    ...mapGetters("varaneekImplementationQueue", ["getleadStatusList"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
  },
  methods: {
    ...mapActions("varaneekImplementationQueue", ["LEAD_STATUS_LIST"]),
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.LEAD_STATUS_LIST({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getleadStatusList.totalElements;
        this.tableData1 = this.getleadStatusList.content;
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    goToUnassignedTab(tab) {
      if (tab === "statusTab") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    }
  }
};
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}
</style>