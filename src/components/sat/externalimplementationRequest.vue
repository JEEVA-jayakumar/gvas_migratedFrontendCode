<template>
  <q-page>
    <!-- content -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Implementation Queue
    </div>
    <div>
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <changeRegionModal
        v-if="propToggleRegionChange"
        :regionInformation="addRegionInformation"
        :propToggleRegionInfoPop="propToggleRegionChange"
        @closeRegionInformation="changeRegion"
      />

      <!--START: table Footer Cards -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              use-input
              @filter="filterAssignToOptions"
              clearable
              v-model="formData.assignTo"
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length == 0"
              :options="filteredAssignToOptions"
              placeholder="Assign To"
              emit-value
              map-options
            />
            <q-checkbox v-model="formData.courier" color="dark" label="Courier Device" />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0 || !this.formData.assignTo"
              label="Assign"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
          </div>
          <div v-if="id == 3" class="col-md-2 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0"
              label="Re-Assign Region"
              class="common-dark-blue"
              @click="changeRegion(formData.marsDeviceIdsCooked)"
            />
          </div>
        </div>
      </q-card>

      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>

      <q-card class="group q-pa-md" v-if="selectedTab == 'cancelledMerchants'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCookedCancelled.length }}</span>/ selected
          </div>
          <div class="side1 col-auto" align="right" style="margin-left: auto;">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCookedCancelled.length == 0"
              label="Cancel"
              class="common-dark-blue"
              @click="cancelImplementationUser"
            />
          </div>
          <div class="side2 col-auto" style="margin-left: 30px;">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCookedCancelled.length == 0"
              label="Re assign"
              class="common-dark-blue"
              @click="reAssignImplementationUser"
            />
          </div>
        </div>
      </q-card>

      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
        <q-tab color="dark" name="unAssigned" label="Unassigned" />
        <q-tab color="dark" name="assigned" label="Assigned" />
        <q-tab color="dark" name="cancelledMerchants" label="Cancelled Merchants" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="q-pa-none">
          <Phonepeassigned />
        </q-tab-panel>

        <q-tab-panel name="unAssigned" class="q-pa-none">
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="id"
            :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
            :loading="tableAjaxLoading1"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td v-if="props.row" :props="props">
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td v-if="props.row" :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td v-if="props.row" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td v-if="props.row" :props="props" class="customTd customCellLength">
                <div>
                  <q-btn
                    no-caps
                    icon="edit"
                    color="purple-9"
                    size="xs"
                    round
                    @click="UpdateDeviceAddress(props.row)"
                  />
                  {{ props.row.deviceAddress }}
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By MID, Merchant Name.."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="cancelledMerchants" class="q-pa-none">
          <q-table
            :rows="tableData2"
            :columns="columnDataMerchants"
            table-class="customTableClass"
            :filter="filterSearch2"
            v-model:pagination="paginationControl2"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCookedCancelled"
            row-key="id"
            :loading="tableAjaxLoading2"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo2"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td v-if="props.row" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                <span class="label text-primary"># {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td v-if="props.row" :props="props">
                {{ props.row.leadInformation ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") : "NA" }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td v-if="props.row" :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td v-if="props.row" :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td v-if="props.row" :props="props" class="customTd customCellLength">
                <div>
                  <q-btn
                    no-caps
                    icon="edit"
                    color="purple-9"
                    size="xs"
                    round
                    @click="UpdateDeviceAddress(props.row)"
                  />
                  {{ props.row.deviceAddress }}
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch2"
                  placeholder="Type.."
                  label="Search By MID, Merchant Name.."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- START >> COMPONENT: Update device address  -->
      <DeviceAddressModal
        v-if="showDeviceAddressModal"
        :showDeviceAddressModal="showDeviceAddressModal"
        v-model:currentDeviceInfo="currentDeviceInfo"
        :stateInformation="getAllStatesData"
        :paginationControl="paginationControl1"
        :selectedLeadItems="formData.marsDeviceIdsCooked"
        @toggleModal="UpdateDeviceAddressAfterEmit"
      />
      <!-- END >> COMPONENT: Update device address -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import Phonepeassigned from "../../components/sat/Phonepeassigned.vue";
import changeRegionModal from "../../components/changeRegionModal.vue";

export default {
  name: "externalimplementationRequest",
  components: {
    DeviceAddressModal,
    generalLeadInformation,
    Phonepeassigned,
    changeRegionModal
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propToggleRegionChange: false,
      addtnLeadInformation: null,
      addRegionInformation: null,
      filterSearch: "",
      filterSearch1: "",
      filterSearch2: "",
      selectedTab: "assigned",
      assignTo: "",
      id: null,
      assignToOptions: [],
      filteredAssignToOptions: [],
      tableData1: [],
      tableData2: [],
      columnDataUnassigned: [
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
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: row => row.mid,
          sortable: true
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.leadInformation.leadName,
          sortable: false
        },
        {
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: row => row.leadInformation.contactNumber,
          sortable: false
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Address",
          align: "left",
          field: row => row.deviceAddress,
          sortable: false
        },
        {
          name: "leadInformation",
          required: true,
          label: "Device Type",
          align: "left",
          field: row => row.leadInformation.aggregatorDevice ? row.leadInformation.aggregatorDevice.deviceName : "NA",
          sortable: false
        },
        {
          name: "serial_number",
          required: true,
          label: "Serial Number",
          align: "left",
          field: row => row.aggregatorRegionalInventory ? row.aggregatorRegionalInventory.serialNumber : "NA",
          sortable: true
        },
        {
          name: "submitToMarsDate",
          required: true,
          label: "Date of Submission",
          align: "left",
          field: row => row.leadInformation.submitToMarsDate,
          sortable: true
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "left",
          field: row => row.deviceStatus == 3 ? "CANCELLED" : "NA",
          sortable: true
        },
        {
          name: "lead_source",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => row.leadInformation.leadSource ? row.leadInformation.leadSource.sourceName : "NA",
          sortable: false
        }
      ],
      columnDataMerchants: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: row => row.leadInformation ? row.leadInformation.leadNumber : "NA",
          sortable: false
        },
        {
          name: "createdAt",
          required: true,
          label: "Date of TID Generation",
          align: "left",
          field: row => row.createdAt || "NA",
          sortable: true
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: row => row.mid || "NA",
          sortable: true
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.leadInformation ? row.leadInformation.leadName : "NA",
          sortable: false
        },
        {
          name: "cancel_reason",
          required: true,
          label: "Cancel Reason",
          align: "left",
          field: row => row.reason || "NA",
          sortable: false
        },
        {
          name: "remarks",
          required: true,
          label: "Remarks",
          align: "left",
          field: row => row.onboardCancelRemarks || "NA",
          sortable: false
        },
        {
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: row => row.leadInformation ? row.leadInformation.contactNumber : "NA",
          sortable: false
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Address",
          align: "left",
          field: row => row.deviceAddress || "NA",
          sortable: false
        },
        {
          name: "leadInformation",
          required: true,
          label: "Device Type",
          align: "left",
          field: row => (row.leadInformation && row.leadInformation.aggregatorDevice) ? row.leadInformation.aggregatorDevice.deviceName : "NA",
          sortable: false
        },
        {
          name: "serial_number",
          required: true,
          label: "Serial Number",
          align: "left",
          field: row => row.aggregatorRegionalInventory ? row.aggregatorRegionalInventory.serialNumber : "NA",
          sortable: true
        },
        {
          name: "lead_source",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => (row.leadInformation && row.leadInformation.leadSource) ? row.leadInformation.leadSource.sourceName : "NA",
          sortable: false
        }
      ],
      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedCancelled: [],
        courier: false,
        assignTo: ""
      },
      paginationControl1: {
        sortBy: "deviceStatusDate",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      paginationControl2: {
        sortBy: "deviceStatusDate",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      tableAjaxLoading1: false,
      tableAjaxLoading2: false
    };
  },
  computed: {
    ...mapGetters("phonepeImplementationQueue", [
      "getPhonepeImplementationQueueUnassignedList",
      "getPhonepeCancelledMerchants"
    ]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("SuperAdminUsers", ["getAllStatesData"])
  },
  beforeMount() {
    let tabData = localStorage.getItem("selectedTab");
    this.id = tabData ? tabData.split("|")[1] : null;
  },
  created() {
    this.ajaxLoadAllLeadInfo1({
      pagination: this.paginationControl1,
      filter: this.filterSearch
    });
    this.ajaxLoadAllLeadInfo2({
      pagination: this.paginationControl2,
      filter: this.filterSearch2
    });
    this.getPincodeInformations();
  },
  methods: {
    ...mapActions("phonepeImplementationQueue", [
      "PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST",
      "PHONEPE_CANCELLED_MERCHANTS",
      "PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT",
      "PHONEPE_CANCELLED_MERCHANT_SUBMIT"
    ]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    getPincodeInformations() {
      this.FETCH_ALL_STATES_DATA();
    },
    filterAssignToOptions(val, update) {
      if (val === "") {
        update(() => {
          this.filteredAssignToOptions = this.assignToOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.filteredAssignToOptions = this.assignToOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST({ pagination, filter })
        .then(() => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            this.assignToOptions = this.getImplementationExecutiveList.map(value => ({
              label: value.name + " | " + value.employeeID + " | " + value.email,
              value: value.id
            }));
            this.filteredAssignToOptions = this.assignToOptions;
          });
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getPhonepeImplementationQueueUnassignedList.totalElements;
          this.paginationControl1.page = this.getPhonepeImplementationQueueUnassignedList.number + 1;
          this.tableData1 = this.getPhonepeImplementationQueueUnassignedList.content;
          if (this.getPhonepeImplementationQueueUnassignedList.sort != null) {
            this.paginationControl1.sortBy = this.getPhonepeImplementationQueueUnassignedList.sort[0].property;
            this.paginationControl1.descending = !this.getPhonepeImplementationQueueUnassignedList.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo2({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.PHONEPE_CANCELLED_MERCHANTS({ pagination, filter })
        .then(() => {
          this.paginationControl2 = pagination;
          this.paginationControl2.rowsNumber = this.getPhonepeCancelledMerchants.totalElements;
          this.paginationControl2.page = this.getPhonepeCancelledMerchants.number + 1;
          this.tableData2 = this.getPhonepeCancelledMerchants.content;
          if (this.getPhonepeCancelledMerchants.sort != null) {
            this.paginationControl2.sortBy = this.getPhonepeCancelledMerchants.sort[0].property;
            this.paginationControl2.descending = !this.getPhonepeCancelledMerchants.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
      if (tab == "unAssigned") {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
        this.formData.marsDeviceIdsCooked = [];
        this.formData.assignTo = "";
        this.filterSearch = "";
      } else if (tab == "assigned") {
        // Handled by component internal logic or explicit refresh if needed
      } else {
        this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
      }
    },
    UpdateDeviceAddress(row) {
      this.currentDeviceInfo = {
        id: row.id,
        deviceAddress: row.deviceAddress,
        pincode: row.pincode,
        city: row.city,
        state: row.state
      };
      this.showDeviceAddressModal = true;
    },
    UpdateDeviceAddressAfterEmit() {
      this.showDeviceAddressModal = false;
      this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length == 0) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Select atleast one item to assign" });
        return;
      }
      if (!this.formData.assignTo) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Implementation officer cannot be empty!" });
        return;
      }
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Validating .." });
      let marsDeviceIdsCooked = this.formData.marsDeviceIdsCooked.map(v => v.id);
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
        marsDeviceIds: marsDeviceIdsCooked,
        courier: this.formData.courier,
        userId: this.formData.assignTo
      };
      this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues)
        .then(res => {
          if (res.status == 200) {
            if (res.data.data && res.data.data.second && res.data.data.second[0] && res.data.data.second[0].Failed) {
              this.$router.push({ name: "externalimplementationAddressFetch", params: { data: res } });
            } else {
              this.formData.marsDeviceIdsCooked = [];
              this.formData.assignTo = "";
              this.$q.notify({ color: "positive", position: "bottom", message: "Successfully assigned!" });
              this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
            }
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({ color: "negative", position: "bottom", message: "Please try again" });
          this.$q.loading.hide();
        });
    },
    reAssignImplementationUser() {
      if (this.formData.marsDeviceIdsCookedCancelled.length == 0) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Select atleast one item to Re-Assign" });
        return;
      }
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching Data.." });
      let marsDeviceIdsCookedCancelled = this.formData.marsDeviceIdsCookedCancelled.map(v => v.id);
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_TID_GENERATED,
        marsDeviceIds: marsDeviceIdsCookedCancelled,
        userId: this.$SEND_ZERO_FOR_UNASSIGING
      };
      this.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues)
        .then(() => {
          this.formData.marsDeviceIdsCookedCancelled = [];
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Re-Assigned!" });
          this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({ color: "negative", position: "bottom", message: "Please try again" });
          this.$q.loading.hide();
        });
    },
    cancelImplementationUser() {
      if (this.formData.marsDeviceIdsCookedCancelled.length == 0) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Select atleast one item to Cancel" });
        return;
      }
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching Data.." });
      let marsDeviceIdsCookedCancelled = this.formData.marsDeviceIdsCookedCancelled.map(v => v.leadInformation.id);
      let postValues = { leadIdSat: marsDeviceIdsCookedCancelled };
      this.PHONEPE_CANCELLED_MERCHANT_SUBMIT(postValues)
        .then(() => {
          this.formData.marsDeviceIdsCookedCancelled = [];
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Cancelled!" });
          this.ajaxLoadAllLeadInfo2({ pagination: this.paginationControl2, filter: this.filterSearch2 });
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.notify({ color: "negative", position: "bottom", message: "Please try again" });
          this.$q.loading.hide();
        });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    changeRegion(RegionDetails) {
      this.propToggleRegionChange = !this.propToggleRegionChange;
      if (RegionDetails != undefined) {
        this.addRegionInformation = RegionDetails;
      }
      if (this.propToggleRegionChange == false) {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch });
        this.formData.marsDeviceIdsCooked = [];
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
.side1 {
  margin-left: auto;
}
.side2 {
  margin-left: 30px;
}
</style>
