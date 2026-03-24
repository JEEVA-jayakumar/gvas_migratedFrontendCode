<template>
  <q-page>
    <div class="q-pa-md">
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Sim Status</div>
      <q-table
        table-class="customTableClass"
        :columns="columns"
        :filter="filter"
         :rows="tableData" v-model:pagination="paginationControl"
        row-key="id"
         :rows-per-page-options="[5, 10, 15, 20]"
         :loading="toggleAjaxLoadFilter"
         @request="ajaxLoadAllLeadInfo"
      >

        <template v-slot:top="props">
          <div class="col-md-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Sim Number"
              class="q-mr-lg q-py-sm"
            />
          </div>
          <div class="col-md-7" align="right">
            <q-btn
              no-caps
              label="Upload file for Activation"
              class="common-dark-blue q-mx-xs"
              @click="UploadSimActivation()"
            />
            <q-btn
              no-caps
              label="Upload file for De-Activation"
              class="common-dark-blue q-mx-xs"
              @click="SimDeActivation()"
            />
          </div>
        </template>
      </q-table>

      <uploadSimActivation
      v-if="propSimActivationList"
      :propSimActivationList = "propSimActivationList"
      @emitpropSimActivationList = "UploadSimActivation"
      ></uploadSimActivation>

      <uploadSimDeactivation  v-if="propSimDeactivation"
      :propSimDeactivation = "propSimDeactivation"
      @emitpropSimDeactivation = "SimDeActivation"
      ></uploadSimDeactivation>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import uploadSimActivation from "../../components/sat/uploadSimActivation.vue";
import uploadSimDeactivation from "../../components/sat/uploadSimDeactivation.vue";

export default {
  name: "simStatus",
  components: {
  uploadSimActivation,
  uploadSimDeactivation
  },
  data() {
    return {
      propSimActivationList:false,
      propSimDeactivation:false,
      paginationControl: {
        rowsPerPage: 10,
        sortBy: "id",
        descending: false,
        page: 1,
        rowsNumber: 0
      },
      filter: "",
      columns: [
        {
          name: "simNo",
          required: true,
          label: "Sim Number",
          align: "center",
          field: row => row.simNo,
          sortable: true
        },
        {
          name: "activationDate",
          label: "Activation Date",
          align: "center",
           field: row => row.activationDate == null ? "NA" : moment(row.activationDate).format("DD/MM/YYYY"),
          sortable: true
        },
        {
          name: "deactivationDate",
          label: "Deactivation Date",
          align: "center",
            field: row => row.deactivationDate == null ? "NA" : moment(row.deactivationDate).format("DD/MM/YYYY"),
          sortable: true
        },
        {
          name: "deployedDate",
          required: true,
          label: "Sim Card Deployed Date",
          align: "center",
          field: row => row.deployedDate == null ? "NA" : moment(row.deployedDate).format("DD/MM/YYYY")
        },
        {
          name: "simRecoveredDate",
          required: true,
          label: "Sim Recoverd Date ",
          align: "center",
          field: row => row.simRecoveredDate == null ? "NA" : moment(row.simRecoveredDate).format("DD/MM/YYYY")
        },
        {
          name: "logonDate",
          required: true,
          label: "Logon Date",
          align: "center",
          field: row => row.logonDate == null ? "NA" : moment(row.logonDate).format("DD/MM/YYYY"),
          sortable: true
        },
        {
          name: "simStatus",
          required: true,
          label: "Sim Status",
          align: "center",
          field: row => row.simStatus,
          sortable: true
        }
      ],
      tableData: [],
      toggleAjaxLoadFilter: false
    };
  },
  computed: {
    ...mapGetters("Regional", ["getSimStatus"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("Regional", ["FETCH_ALL_SIM_STATUS_BY_REGION"]),
    UploadSimActivation(){
      this.propSimActivationList =! this.propSimActivationList;
      if(this.propSimActivationList == false){
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter
        });
      }
    },  
    SimDeActivation(){
      this.propSimDeactivation =! this.propSimDeactivation;
      if(this.propSimDeactivation == false){
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter
        });
      }
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_ALL_SIM_STATUS_BY_REGION({ pagination, filter }).then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getSimStatus.totalElements;
          this.paginationControl.page = this.getSimStatus.number + 1;
          this.tableData = this.getSimStatus.content;
          if (this.getSimStatus.sort != null) {
            this.paginationControl.sortBy = this.getSimStatus.sort[0].property;
            this.paginationControl.descending = !this.getSimStatus.sort[0].ascending;
          }
          this.$q.loading.hide();
        })  
        .catch(() => {
          this.$q.loading.hide();
        });
    }
  }
};
</script>

<style>
</style>
