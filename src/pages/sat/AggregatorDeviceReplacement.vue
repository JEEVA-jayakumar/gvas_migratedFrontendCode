<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Device Replacement
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
              @filter="filterAssignTo"
              clearable
              v-model="formData.assignTo"
              :options="assignToOptions"
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
          <!-- Selected Count -->
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{ formData.marsDeviceIdsCookedUnAssinged.length }} </span>/ selected
          </div>

          <!-- Select Box -->
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              use-input
              input-debounce="0"
              @filter="filterAssignTo"
              clearable
              v-model="formData.assignToReassign"
              :options="assignToOptions"
              label="Re-Assign To"
              color="grey-9"
              :disable="isReAssignDropdownDisabled"
              emit-value
              map-options
              @click="handleReAssignDropdownClick"
            />
          </div>

          <!-- Buttons Column -->
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <div class="column items-end">
              <!-- Re-Assign Button -->
              <q-btn
                no-caps
                label="Re-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="isReAssignDisabled"
                :loading="reAssignLoading"
                @click="reAssignImplementationUser"
              />

              <!-- Un-Assign button -->
              <q-btn
                no-caps
                label="Un-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="isUnAssignDisabled"
                :loading="unAssignLoading"
                @click="unAssignImplementationUser"
              />
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
            selection="multiple"
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
                v-if="props.row.leadInformation != null"
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
              >
                <span class="label text-primary">#
                  {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
              >
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
              >
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
                class="customTd customCellLength"
              >
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">
                  {{ props.row.tid }}
                </div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">
                  {{ props.row.mid }}
                </div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search By TID, MID"
                  class="q-mr-lg q-py-sm"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
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
                v-if="props.row.leadInformation != null"
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
              >
                <span class="label text-primary">#
                  {{ props.row.leadInformation.leadNumber }}</span>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-submitToMarsDate="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
              >
                {{ $moment(props.row.leadInformation.submitToMarsDate).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-createdAt="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
              >
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-tid="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">
                  {{ props.row.tid == null ? "NA" : props.row.tid }}
                </div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-mid="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
                class="customTd"
              >
                <div class="text-primary">
                  {{ props.row.mid }}
                </div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
            </template>
            <template v-slot:body-cell-deviceAddress="props">
              <q-td
                v-if="props.row.leadInformation != null"
                :props="props"
                class="customTd customCellLength"
              >
                <div>
                  {{ props.row.deviceAddress }}
                </div>
              </q-td>
              <q-td v-else :props="props">NA</q-td>
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
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
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
  name: "aggregatorDeviceReplacement",
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "assigned",
      assignToOptions: [],
      assignToOptions_bk: [],
      tableData: [],
      tableData1: [],
      reAssignLoading: false,
      unAssignLoading: false,
      columnDataAssigned: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: (row) => row.leadInformation?.leadNumber,
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
          field: (row) => row.leadInformation != null ? row.leadInformation.leadName : "NA",
          sortable: false,
        },
        {
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: (row) => row.leadInformation != null ? row.leadInformation.contactNumber : "NA",
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
            if (row.leadInformation != null)
              return row.leadInformation.leadSource == null ? "NA" : row.leadInformation.leadSource.sourceName;
            else
              return "NA"
          },
          sortable: false,
        },
        {
          name: "assigned_to",
          required: true,
          label: "Assigned To",
          align: "left",
          field: (row) => (row.replacedBy == null ? "NA" : row.replacedBy.name),
          sortable: false,
        },
        {
          name: "leadInformation",
          required: true,
          label: "Device Type",
          align: "left",
          field: (row) => row.leadInformation?.aggregatorDevice?.deviceName,
          sortable: false,
        },
        {
          name: "serial_number",
          required: true,
          label: "Serial Number",
          align: "left",
          field: (row) => (row.aggregatorRegionalInventory == null ? "NA" : row.aggregatorRegionalInventory.serialNumber),
          sortable: true,
        },
        {
          name: "submitToMarsDate",
          required: true,
          label: "Date of Submission",
          align: "left",
          field: (row) => row.leadInformation?.submitToMarsDate,
          sortable: true,
        },
      ],
      columnDataUnassigned: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: (row) => row.leadInformation?.leadNumber,
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
          field: (row) => row.leadInformation != null ? row.leadInformation.leadName : "NA",
          sortable: false,
        },
        {
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: (row) => row.leadInformation != null ? row.leadInformation.contactNumber : "NA",
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
          field: (row) => row.leadInformation?.aggregatorDevice?.deviceName,
          sortable: false,
        },
        {
          name: "serial_number",
          required: true,
          label: "Serial Number",
          align: "left",
          field: (row) => (row.aggregatorRegionalInventory == null ? "NA" : row.aggregatorRegionalInventory.serialNumber),
          sortable: true,
        },
        {
          name: "source",
          required: true,
          label: "Source",
          align: "left",
          field: (row) => {
            if (row.leadInformation != null)
              return row.leadInformation.leadSource == null ? "NA" : row.leadInformation.leadSource.sourceName;
            else
              return "NA"
          },
          sortable: false,
        },
        {
          name: "submitToMarsDate",
          required: true,
          label: "Date of Submission",
          align: "left",
          field: (row) => row.leadInformation?.submitToMarsDate,
          sortable: true,
        },
      ],
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        assignTo: "",
        assignToReassign: "",
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
    };
  },
  computed: {
    ...mapGetters("aggregatorDeviceReplacement", [
      "getAggregatorDeviceReplacementQueueAssignedList",
      "getAggregatorDeviceReplacementQueueUnassignedList",
    ]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    selectedAssignedCount() {
      return this.formData.marsDeviceIdsCookedUnAssinged.length;
    },
    isReAssignDropdownDisabled() {
      return this.selectedAssignedCount !== 1;
    },
    isReAssignDisabled() {
      return this.selectedAssignedCount !== 1 || !this.formData.assignToReassign;
    },
    isUnAssignDisabled() {
      return !!this.formData.assignToReassign || this.selectedAssignedCount === 0;
    },
  },
  created() {
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
    ...mapActions("aggregatorDeviceReplacement", [
      "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST",
      "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST",
      "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_SUBMIT",
      "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_REASSIGN",
      "AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGN",
    ]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    filterAssignTo (val, update) {
      update(() => {
        if (val === '') {
          this.assignToOptions = this.assignToOptions_bk
        } else {
          const needle = val.toLowerCase()
          this.assignToOptions = this.assignToOptions_bk.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },

    handleReAssignDropdownClick() {
      if (this.isReAssignDropdownDisabled) {
        let message = "Select at least one device to re-assign";
        if (this.selectedAssignedCount > 1) {
          message = "Multiple selection not allowed";
        }
        this.$q.notify({
          color: "warning",
          position: "bottom",
          message,
          icon: "info",
        });
      }
    },

    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST({ pagination, filter })
        .then(() => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            let assumeArr = [];
            this.getImplementationExecutiveList.map(function (value) {
              assumeArr.push({
                label: value.name + " | " + value.employeeID + " | " + value.email,
                value: value.id,
              });
            });
            this.assignToOptions = assumeArr;
            this.assignToOptions_bk = assumeArr;
          });
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getAggregatorDeviceReplacementQueueUnassignedList.totalElements;
          this.paginationControl1.page = this.getAggregatorDeviceReplacementQueueUnassignedList.number + 1;
          this.tableData1 = this.getAggregatorDeviceReplacementQueueUnassignedList.content;
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
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST({ pagination, filter })
        .then(() => {
          this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
            let assumeArr = [];
            this.getImplementationExecutiveList.map(function (value) {
              assumeArr.push({
                label: value.name + " | " + value.employeeID + " | " + value.email,
                value: value.id,
              });
            });
            this.assignToOptions = assumeArr;
            this.assignToOptions_bk = assumeArr;
          });
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getAggregatorDeviceReplacementQueueAssignedList.totalElements;
          this.paginationControl.page = this.getAggregatorDeviceReplacementQueueAssignedList.number + 1;
          this.tableData = this.getAggregatorDeviceReplacementQueueAssignedList.content;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    goToUnassignedTab(tab) {
      if (tab === "unAssigned") {
        this.ajaxLoadAllLeadInfo1({
          pagination: this.paginationControl1,
          filter: this.filterSearch1,
        });
      } else if (tab == "assigned") {
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
        self.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_SUBMIT(postValues)
          .then(() => {
            self.ajaxLoadAllLeadInfo({
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

    unAssignImplementationUser() {
      if (this.unAssignLoading) return;
      this.unAssignLoading = true;
      let marsDeviceIds = this.formData.marsDeviceIdsCookedUnAssinged.map((v) => v.id);
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_TID_GENERATED,
        marsDeviceIds,
        userId: this.$SEND_ZERO_FOR_UNASSIGING,
      };
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGN(postValues)
        .then(() => {
          this.goToUnassignedTab("Assigned");
          this.formData.marsDeviceIdsCookedUnAssinged = [];
          this.formData.assignToReassign = "";
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Unassigned!",
            icon: "thumb_up",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again",
            icon: "thumb_down",
          });
        })
        .finally(() => {
          this.unAssignLoading = false;
        });
    },

    reAssignImplementationUser() {
      if (this.reAssignLoading) return;
      this.reAssignLoading = true;
      let marsDeviceIds = this.formData.marsDeviceIdsCookedUnAssinged.map((v) => v.id);
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
        marsDeviceIds,
        userId: this.formData.assignToReassign,
      };
      this.AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_REASSIGN(postValues)
        .then(() => {
          this.ajaxLoadAllLeadInfo({
            pagination: this.paginationControl,
            filter: this.filterSearch,
          });
          this.ajaxLoadAllLeadInfo1({
            pagination: this.paginationControl1,
            filter: this.filterSearch1,
          });
          this.formData.marsDeviceIdsCookedUnAssinged = [];
          this.formData.assignToReassign = "";
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully re-assigned!",
            icon: "thumb_up",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Please try again",
            icon: "thumb_down",
          });
        })
        .finally(() => {
          this.reAssignLoading = false;
        });
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
  },
  watch: {
    "formData.marsDeviceIdsCookedUnAssinged"() {
      if (this.selectedAssignedCount !== 1) {
        this.formData.assignToReassign = "";
      }
    },
  },
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
