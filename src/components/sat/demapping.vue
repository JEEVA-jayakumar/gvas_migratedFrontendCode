<template>
  <div class="q-pa-none">
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      DE-Mapping
    </div>

    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

    <q-card class="group q-pa-md">
      <div class="row items-center gutter-y-sm">
        <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium" align="left">
          <span class="q-display-2">{{ formData.marsDeviceIdsDemapping.length }}</span>/ selected
        </div>
      </div>
    </q-card>

    <q-table table-class="customTableClass" :rows="tableData" :columns="columns" :filter="filter"
      v-model:pagination="paginationControl" selection="multiple" v-model:selected="formData.marsDeviceIdsDemapping"
      row-key="id" :loading="toggleAjaxLoadFilter" :rows-per-page-options="[5, 10, 15, 20, 25]" color="dark"
      @request="ajaxLoadAllLeadInfo">

      <template v-slot:top>
        <div class="col-5">
          <q-input clearable v-model="filter" color="grey-9" label="Search By Device Serial Number"
            class="q-mr-lg q-py-sm" />
        </div>
        <div class="col row justify-end">
          <q-btn no-caps :disabled="formData.marsDeviceIdsDemapping.length == 0" label="De-Mapping"
            class="common-dark-blue" @click="fnDemappingData" />
        </div>
      </template>
    </q-table>

    <demappingRemarks v-if="propShowUpdateDemapping" :propShowUpdateDemapping="propShowUpdateDemapping"
      :propRowDetails="propRowDetails" @emitfnshowUpdateDemapping="fnDemappingData" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import demappingRemarks from "../../components/sat/demappingRemarks.vue";

export default {
  name: "demapping",
  components: { generalLeadInformation, demappingRemarks },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      propShowUpdateDemapping: false,
      toggleAjaxLoadFilter: false,
      paginationControl: { rowsNumber: 10, page: 1, rowsPerPage: 10 },
      formData: { marsDeviceIdsDemapping: [] },
      tableData: [],
      filter: "",
      propRowDetails: null,
      columns: [
        { name: "deviceSerialNumber", label: "Device Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA" },
        { name: "deviceStatusDate", label: "Status", align: "left", field: row => row.deviceStatus == 5 ? "Scanned Picked" : "Scheduled for Deployment" }
      ]
    };
  },
  computed: {
    ...mapGetters("deMapping", ["getdemappingStatusList"])
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("deMapping", ["DEMAPPING_STATUS_LIST"]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ message: "Fetching data .." });
      this.DEMAPPING_STATUS_LIST({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getdemappingStatusList.totalElements;
        this.tableData = this.getdemappingStatusList.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    },
    fnDemappingData() {
      this.propShowUpdateDemapping = !this.propShowUpdateDemapping;
      if (this.propShowUpdateDemapping) {
        this.propRowDetails = this.formData.marsDeviceIdsDemapping.map(v => v.aggregatorRegionalInventory.id);
      } else {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
        this.formData.marsDeviceIdsDemapping = [];
      }
    }
  }
};
</script>