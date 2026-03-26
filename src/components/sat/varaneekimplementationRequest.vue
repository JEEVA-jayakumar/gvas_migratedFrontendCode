<template>
  <q-page>
    <div class="q-pa-md">
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab color="dark" name="statusTab" label="TID & MID STATUS" />
        <q-tab color="dark" name="rejectedTab" label="Rejected Leads" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="rejectedTab" class="q-pa-none">
          <varaneekRejectedLead />
        </q-tab-panel>

        <q-tab-panel name="statusTab" class="q-pa-none">
          <q-table
            :rows="tableData1"
            :columns="columnData"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl1"
            row-key="id"
            :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
            :loading="tableAjaxLoading1"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
              >
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td :props="props">
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By MID, TID"
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <DeviceAddressModal
        v-if="showDeviceAddressModal"
        :showDeviceAddressModal="showDeviceAddressModal"
        :currentDeviceInfo="currentDeviceInfo"
        :stateInformation="getAllStatesData"
        :paginationControl="paginationControl1"
        :selectedLeadItems="formData.marsDeviceIdsCooked"
        @toggleModal="UpdateDeviceAddressAfterEmit"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import varaneekRejectedLead from "../../components/sat/varaneekRejectedLead.vue";

export default {
  name: "varaneekImplementationQueue",
  components: {
    DeviceAddressModal,
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
      columnData: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: row => row.leadInformation.leadNumber,
          sortable: false
        },
        {
          name: "createdAt",
          required: true,
          label: "Date of TID Generation",
          align: "left",
          field: "createdAt",
          sortable: true
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: row => row.tid,
          sortable: true
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: row => row.mid,
          sortable: true
        },
        {
          name: "leadInformation",
          required: true,
          label: "Device Type",
          align: "left",
          field: row => row.leadInformation.device.deviceName,
          sortable: false
        },
        {
          name: "submitToMarsDate",
          required: true,
          label: "Date of Submission",
          align: "left",
          field: row => row.leadInformation.submitToMarsDate,
          sortable: true
        }
      ],
      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCooked: []
      },
      paginationControl1: {
        sortBy: "deviceStatusDate",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      tableAjaxLoading1: false
    };
  },
  computed: {
    ...mapGetters("varaneekImplementationQueue", ["getleadStatusList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  created() {
    this.ajaxLoadAllLeadInfo1({
      pagination: this.paginationControl1,
      filter: this.filterSearch
    });
    this.getPincodeInformations();
  },
  methods: {
    ...mapActions("varaneekImplementationQueue", ["LEAD_STATUS_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    getPincodeInformations() {
      this.FETCH_ALL_STATES_DATA();
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.LEAD_STATUS_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getleadStatusList.totalElements;
          this.paginationControl1.page = this.getleadStatusList.number + 1;
          this.tableData1 = this.getleadStatusList.content;
          if (this.getleadStatusList.sort != null) {
            this.paginationControl1.sortBy = this.getleadStatusList.sort[0].property;
            this.paginationControl1.descending = !this.getleadStatusList.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    goToUnassignedTab(tab) {
      if (tab == "statusTab") {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
      }
    },
    UpdateDeviceAddressAfterEmit() {
      this.showDeviceAddressModal = false;
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
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
.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>
