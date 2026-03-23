<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Device Recovery Tracker
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              use-input
              input-debounce="0"
              @filter="fnFilterAssignTo"
              clearable
              v-model="formData.assignTo"
              :options="assignToOptionsFiltered"
              label="Assign To"
              color="grey-9"
              emit-value
              map-options
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0"
              label="Assign"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>
      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        active-color="primary"
        indicator-color="primary"
        align="left"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
      </q-tabs>

          <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="tableData"
            :columns="columnDataAssigned"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
              >
                <span class="label text-primary">#
                  {{
                    props.row.leadInformation == null
                      ? props.row.qrLeadInformation.qrLeadNumber
                      : props.row.leadInformation.leadNumber
                  }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
              >
                {{
                  props.row.leadInformation != null &&
                  props.row.leadInformation.submitToMarsDate != null
                    ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y")
                    : props.row.qrLeadInformation != null &&
                      props.row.qrLeadInformation.submitMarsDate != null
                    ? $moment(props.row.qrLeadInformation.submitMarsDate).format("Do MMM Y")
                    : "NA"
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
              >
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="customTd customCellLength"
              >
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="customTd"
              >
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
                  label="Search By TID, MID, Merchant Name .."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
<q-tab-panel name="unAssigned" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch1"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadNumber="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
              >
                <span class="label text-primary">#
                  {{
                    props.row.leadInformation == null
                      ? props.row.qrLeadInformation.qrLeadNumber
                      : props.row.leadInformation.leadNumber
                  }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
              >
                {{
                  props.row.leadInformation != null &&
                  props.row.leadInformation.submitToMarsDate != null
                    ? $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y")
                    : props.row.qrLeadInformation != null &&
                      props.row.qrLeadInformation.submitMarsDate != null
                    ? $moment(props.row.qrLeadInformation.submitMarsDate).format("Do MMM Y")
                    : "NA"
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
              >
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
                :props="props"
                class="customTd customCellLength"
              >
                <div>
                  {{ props.row.deviceAddress }}
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch1"
                  placeholder="Type.."
                  label="Search By TID, MID, Merchant Name .."
                  class="q-mr-lg q-py-sm"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
          </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "implementationQueue",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "assigned",
      assignToOptions: [],
      assignToOptionsFiltered: [],
      tableData: [],
      tableData1: [],
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: "",
      },
      paginationControl: {
        sortBy: "createdAt",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      paginationControl1: {
        sortBy: "createdAt",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      columnDataAssigned: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: (row) => {
            return row.leadInformation != null && row.leadInformation.leadNumber != null
              ? row.leadInformation.leadNumber
              : row.qrLeadInformation != null && row.qrLeadInformation.qrLeadNumber != null
              ? row.qrLeadInformation.qrLeadNumber
              : "NA";
          },
          sortable: false,
        },
        {
          name: "createdAt",
          required: true,
          label: "Date of TID Generation",
          align: "left",
          field: "createdAt",
          sortable: true,
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: (row) => row.tid,
          sortable: true,
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: (row) => row.mid,
          sortable: true,
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: (row) => {
            return row.leadInformation != null && row.leadInformation.leadName != null
              ? row.leadInformation.leadName
              : row.qrLeadInformation != null && row.qrLeadInformation.merchantName != null
              ? row.qrLeadInformation.merchantName
              : "NA";
          },
          sortable: false,
        },
        {
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: (row) => {
            return row.leadInformation != null && row.leadInformation.contactNumber != null
              ? row.leadInformation.contactNumber
              : row.qrLeadInformation != null && row.qrLeadInformation.contactNumber != null
              ? row.qrLeadInformation.contactNumber
              : "NA";
          },
          sortable: false,
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Address",
          align: "left",
          field: (row) => row.deviceAddress,
          sortable: false,
        },
        {
          name: "source",
          required: true,
          label: "Source",
          align: "left",
          field: (row) => {
            return row.leadInformation != null &&
              row.leadInformation.leadSource != null &&
              row.leadInformation.leadSource.sourceName != null
              ? row.leadInformation.leadSource.sourceName
              : row.qrLeadInformation != null &&
                row.qrLeadInformation.leadSource != null &&
                row.qrLeadInformation.leadSource.sourceName != null
              ? row.qrLeadInformation.leadSource.sourceName
              : "NA";
          },
          sortable: false,
        },
        {
          name: "assigned_to",
          required: true,
          label: "Assigned To",
          align: "left",
          field: (row) => {
            return row.recoveredBy == null ? "NA" : row.recoveredBy.name + " | " + row.recoveredBy.employeeID;
          },
          sortable: false,
        },
        {
          name: "leadInformation",
          required: true,
          label: "Device Type",
          align: "left",
          field: (row) => {
            return row.leadInformation != null &&
              row.leadInformation.device != null &&
              row.leadInformation.device.deviceName != null
              ? row.leadInformation.device.deviceName
              : row.qrLeadInformation != null &&
                row.qrLeadInformation.device != null &&
                row.qrLeadInformation.device.deviceName != null
              ? row.qrLeadInformation.device.deviceName
              : "NA";
          },
          sortable: false,
        },
        {
          name: "serial_number",
          required: true,
          label: "Serial Number",
          align: "left",
          field: (row) => (row.regionalInventory == null ? "NA" : row.regionalInventory.serialNumber),
          sortable: true,
        },
        {
          name: "submitToMarsDate",
          required: true,
          label: "Date of Submission",
          align: "left",
          field: (row) => {
            if (row.leadInformation != null && row.leadInformation.submitToMarsDate != null) {
              return row.leadInformation.submitToMarsDate;
            } else if (row.qrLeadInformation != null && row.qrLeadInformation.submitMarsDate != null) {
              return row.qrLeadInformation.submitMarsDate;
            }
            return "NA";
          },
          sortable: true,
        },
      ],
      columnDataUnassigned: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: (row) => {
            return row.leadInformation != null && row.leadInformation.leadNumber != null
              ? row.leadInformation.leadNumber
              : row.qrLeadInformation != null && row.qrLeadInformation.qrLeadNumber != null
              ? row.qrLeadInformation.qrLeadNumber
              : "NA";
          },
          sortable: false,
        },
        {
          name: "createdAt",
          required: true,
          label: "Date of TID Generation",
          align: "left",
          field: "createdAt",
          sortable: true,
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: (row) => row.tid,
          sortable: true,
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: (row) => row.mid,
          sortable: true,
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: (row) => {
            return row.leadInformation != null && row.leadInformation.leadName != null
              ? row.leadInformation.leadName
              : row.qrLeadInformation != null && row.qrLeadInformation.merchantName != null
              ? row.qrLeadInformation.merchantName
              : "NA";
          },
          sortable: false,
        },
        {
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: (row) => {
            return row.leadInformation != null && row.leadInformation.contactNumber != null
              ? row.leadInformation.contactNumber
              : row.qrLeadInformation != null && row.qrLeadInformation.contactNumber != null
              ? row.qrLeadInformation.contactNumber
              : "NA";
          },
          sortable: false,
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Address",
          align: "left",
          field: (row) => row.deviceAddress,
          sortable: false,
        },
        {
          name: "leadInformation",
          required: true,
          label: "Device Type",
          align: "left",
          field: (row) => {
            return row.leadInformation != null &&
              row.leadInformation.device != null &&
              row.leadInformation.device.deviceName != null
              ? row.leadInformation.device.deviceName
              : row.qrLeadInformation != null &&
                row.qrLeadInformation.device != null &&
                row.qrLeadInformation.device.deviceName != null
              ? row.qrLeadInformation.device.deviceName
              : "NA";
          },
          sortable: false,
        },
        {
          name: "serial_number",
          required: true,
          label: "Serial Number",
          align: "left",
          field: (row) => (row.regionalInventory == null ? "NA" : row.regionalInventory.serialNumber),
          sortable: true,
        },
        {
          name: "source",
          required: true,
          label: "Source",
          align: "left",
          field: (row) => {
            return row.leadInformation != null &&
              row.leadInformation.leadSource != null &&
              row.leadInformation.leadSource.sourceName != null
              ? row.leadInformation.leadSource.sourceName
              : row.qrLeadInformation != null &&
                row.qrLeadInformation.leadSource != null &&
                row.qrLeadInformation.leadSource.sourceName != null
              ? row.qrLeadInformation.leadSource.sourceName
              : "NA";
          },
          sortable: false,
        },
        {
          name: "submitToMarsDate",
          required: true,
          label: "Date of Submission",
          align: "left",
          field: (row) => {
            if (row.leadInformation != null && row.leadInformation.submitToMarsDate != null) {
              return row.leadInformation.submitToMarsDate;
            } else if (row.qrLeadInformation != null && row.qrLeadInformation.submitMarsDate != null) {
              return row.qrLeadInformation.submitMarsDate;
            }
            return "NA";
          },
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("DeviceRecovery", ["getDeviceRecoveryAssignedList", "getDeviceRecoveryUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
  },
  mounted() {
    this.getPincodeInformations();
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filterSearch,
    });
    this.ajaxLoadAllLeadInfo1({
      pagination: this.paginationControl1,
      filter: this.filterSearch1,
    });
  },
  methods: {
    ...mapActions("DeviceRecovery", ["DEVICE_RECOVERY_ASSIGNED_LIST", "DEVICE_RECOVERY_UNASSIGNED_LIST", "DEVICE_RECOVERY_SUBMIT"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),

    fnFilterAssignTo(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.assignToOptionsFiltered = this.assignToOptions.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    getPincodeInformations() {
      this.FETCH_ALL_STATES_DATA();
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.DEVICE_RECOVERY_UNASSIGNED_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getDeviceRecoveryUnassignedList.totalElements;
          this.paginationControl1.page = this.getDeviceRecoveryUnassignedList.number + 1;
          this.tableData1 = this.getDeviceRecoveryUnassignedList.content;

          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            let assumeArr = [];
            this.getImplementationExecutiveList.map(function (value) {
              assumeArr.push({
                label: value.name + " | " + value.employeeID + " | " + value.email,
                value: value.id,
              });
            });
            this.assignToOptions = assumeArr;
            this.assignToOptionsFiltered = assumeArr;
          });

          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.DEVICE_RECOVERY_ASSIGNED_LIST({ pagination, filter })
        .then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getDeviceRecoveryAssignedList.totalElements;
          this.paginationControl.page = this.getDeviceRecoveryAssignedList.number + 1;
          this.tableData = this.getDeviceRecoveryAssignedList.content;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    goToUnassignedTab(tab) {
      if (tab == "unAssigned") {
        this.ajaxLoadAllLeadInfo1({
          pagination: this.paginationControl1,
          filter: this.filterSearch1,
        });
      } else {
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filterSearch,
        });
      }
    },

    assignImplementationUser() {
      let self = this;
      if (self.formData.marsDeviceIdsCooked.length == 0) {
        self.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Select atleast one item to assign",
          icon: "thumb_down",
        });
      } else if (self.formData.assignTo == "") {
        self.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Implementation officer cannot be empty!",
          icon: "thumb_down",
        });
      } else {
        let marsDeviceIdsCooked = self.formData.marsDeviceIdsCooked.map((v) => v.id);
        let postValues = {
          marsDeviceIds: marsDeviceIdsCooked,
          userId: self.formData.assignTo,
        };
        self.DEVICE_RECOVERY_SUBMIT(postValues)
          .then(() => {
            this.ajaxLoadAllLeadInfo({
              pagination: this.paginationControl,
              filter: this.filterSearch,
            });
            this.ajaxLoadAllLeadInfo1({
              pagination: this.paginationControl1,
              filter: this.filterSearch1,
            });
            self.formData.marsDeviceIdsCooked = [];
            self.formData.assignTo = "";
            self.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully assigned!",
              icon: "thumb_up",
            });
          })
          .catch(() => {
            self.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Please try again",
              icon: "thumb_down",
            });
          });
      }
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
  },
};
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-break: break-word;
  white-space: normal;
}
.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>