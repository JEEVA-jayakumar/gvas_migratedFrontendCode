<template>
  <q-page>
    <!-- content -->
    <q-card>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              v-model="tab"
              class="shadow-1"
              color="tertiary"
              align="justify"
            >
              <q-tab class="size1" name="upload" label="UPLOAD CSV FILE" />
              <q-tab class="size1" name="assigned" label="ASSIGNED" />
              <q-tab class="size1" name="unAssigned" label="UNASSIGNED" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated @update:model-value="goToUnassignedTab">
              <q-tab-panel name="upload">
                <div class="q-pa-md">
                  <div class="row text-center justify-center">
                    <div class="col-md-8 q-py-md" align="center">
                      <div class="col-md-5 align1" align="center">
                        <a
                          href="statics/files/iciciExistingMerchantOnboardingTemplate.xlsx"
                          class="hide-underline"
                          >Click here to download the template</a
                        >
                      </div>
                      <div
                        v-if="formData.fileSelected.length == 0"
                        :class="[
                          uploaderHovered
                            ? 'toggleBulkUploadDisable'
                            : 'toggleBulkUploadActive'
                        ]"
                        class="drop display-inline align-center  cursor-pointer"
                        @dragover.prevent="dragAndDropCustomAnimate(true)"
                        @dragleave.prevent="dragAndDropCustomAnimate(false)"
                        @drop="onDrop"
                      >
                        <label
                          style="width: auto;"
                          class="btn display-inline cursor-pointer "
                        >
                          Drag & Drop Or Click Here To Open A File
                          <input
                            type="file"
                            name="image"
                            @change="onChange"
                            ref="deviceBulkUpload"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          />
                        </label>
                      </div>
                      <div v-else align="left">
                        <q-card dense class="q-pa-xs">
                          <q-card-section>
                            Uploaded File
                          </q-card-section>
                          <q-separator />
                          <q-card-section>
                            <q-item dense>
                              <q-item-section avatar>
                                <q-icon name="attach_file" />
                              </q-item-section>
                              <q-item-section>{{
                                formData.fileSelected[0].name
                              }}</q-item-section>
                            </q-item>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions align="end">
                            <q-btn
                              size="10px"
                              type="button"
                              color="negative"
                              @click="removeBulkUploadFile"
                              label="Remove"
                              icon="clear"
                            />
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                    <div class="col-md-12 group align2" align="center">
                      <q-btn
                        :disabled="formData.fileSelected.length == 0"
                        type="button"
                        class="common-dark-blue"
                        label="Submit"
                        @click="uploadFileForBulkUpload"
                      />
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="assigned">
                <div class="row items-center gutter-y-sm q-mb-md">
                  <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md" align="left">
                    <span class="q-display-2 size2">{{
                      formData.marsDeviceIdsCookedUnAssinged.length
                    }}</span>/ selected
                  </div>
                  <div class="col-md-9 col-sm-12 col-xs-12">
                    <div class="row items-center">
                      <div class="col-md-4 col-sm-6 col-xs-6">
                        <q-select
                          clearable
                          v-model="formData.assignTo"
                          :disable="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                          color="grey-9"
                          :options="assignToOptions"
                          label="Assign To"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-md-4 col-sm-6 col-xs-6 group">
                        <q-btn
                          no-caps
                          :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0 || this.formData.assignTo == ''"
                          label="Re-Assign"
                          class="common-dark-blue q-mr-sm"
                          @click="reAssignImplementationUser"
                        />
                        <q-btn
                          no-caps
                          :disabled="formData.marsDeviceIdsCookedUnAssinged.length == 0"
                          label="Un-Assign"
                          class="common-dark-blue"
                          @click="unAssignImplementationUser"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <q-table
                  :rows="tableData"
                  :columns="columnDataAssigned"
                  table-class="customTableClass"
                  :filter="filterSearch"
                  selection="multiple"
                  v-model:pagination="paginationControl"
                  v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
                  row-key="id"
                  :loading="tableAjaxLoading"
                  :rows-per-page-options="[5, 10, 15, 20]"
                  color="dark"
                  @request="ajaxLoadAllLeadInfo"
                >
                  <template v-slot:body-cell-tid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.tid || "NA" }}</div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-mid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.mid || "NA" }}</div>
                    </q-td>
                  </template>
                  <template v-slot:top>
                    <div class="col-md-5">
                      <q-input dense clearable
                        color="grey-9"
                        v-model="filterSearch"
                        placeholder="Type.."
                        label="Search By Merchant Name, TID, MID ..."
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

              <q-tab-panel name="unAssigned">
                <div class="row items-center gutter-y-sm q-mb-md">
                  <div class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md" align="left">
                    <span class="q-display-2 size2">{{
                      formData.marsDeviceIdsCooked.length
                    }}</span>/ selected
                  </div>
                  <div class="col-md-9 col-sm-12 col-xs-12">
                    <div class="row items-center">
                      <div class="col-md-4 col-sm-6 col-xs-6">
                        <q-select
                          clearable
                          v-model="formData.assignTo"
                          :disable="formData.marsDeviceIdsCooked.length == 0"
                          color="grey-9"
                          :options="assignToOptions"
                          label="Assign To"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-md-4 col-sm-6 col-xs-6">
                        <q-btn
                          :disabled="this.formData.assignTo == '' || formData.marsDeviceIdsCooked.length == 0"
                          type="button"
                          label="Assign"
                          class="common-dark-blue"
                          @click="assignImplementationUser"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                  <template v-slot:body-cell-tid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.tid || "NA" }}</div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-mid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.mid || "NA" }}</div>
                    </q-td>
                  </template>
                  <template v-slot:top>
                    <div class="col-md-5">
                      <q-input dense clearable
                        color="grey-9"
                        v-model="filterSearch1"
                        placeholder="Type.."
                        label="Search By Merchant Name, TID, MID ..."
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
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "OnboardingExistingMerchants",
  data() {
    return {
      tab: 'upload',
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      assignToOptions: [],
      tableData: [],
      tableData1: [],
      uploaderHovered: false,
      columnDataAssigned: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: row => row.leadInformation?.leadNumber || "NA",
          sortable: false
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.leadInformation?.leadName || "NA",
          sortable: false
        },
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
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: row => row.leadInformation?.contactNumber || "NA",
          sortable: false
        },
        {
          name: "assigned_to",
          required: true,
          label: "Assigned To",
          align: "left",
          field: row => row.qrAssignedTo ? (row.qrAssignedTo.name + " | " + row.qrAssignedTo.employeeID) : "NA",
          sortable: false
        }
      ],
      columnDataUnassigned: [
        {
          name: "leadNumber",
          required: true,
          label: "Lead Number",
          align: "left",
          field: row => row.leadInformation?.leadNumber || "NA",
          sortable: false
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.leadInformation?.leadName || "NA",
          sortable: false
        },
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
          name: "mobile_number",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: row => row.leadInformation?.contactNumber || "NA",
          sortable: false
        },
        {
          name: "leadAddress",
          required: true,
          label: "Address",
          align: "left",
          field: row => row.leadInformation?.leadAddress || "NA",
          sortable: false
        }
      ],
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: "",
        fileSelected: []
      },
      paginationControl: {
        sortBy: "createdAt",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
      paginationControl1: {
        sortBy: "createdAt",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    };
  },
  computed: {
    ...mapGetters("OnboardingExistingMerchants", ["getOnboardingMerchantAssignedList", "getOnboardingMerchantUnassignedList"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"])
  },
  mounted() {
    this.getPincodeInformations();
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("OnboardingExistingMerchants", ["ONBOARDING_MERCHANT_ASSIGNED_LIST", "ONBOARDING_MERCHANT_UNASSIGNED_LIST", "ONBOARDING_MERCHANT_SUBMIT", "ONBOARDING_MERCHANT_SUBMIT_UNASSIGN"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("SuperAdminUsers", ["FETCH_ALL_STATES_DATA"]),
    ...mapActions("UploadOnboardingMerchants", ["FEED_ONBOARDING_EXISTING_MERCHANT_DEVICE_BULK_UPLOAD_DATA"]),

    removeBulkUploadFile() { this.formData.fileSelected = []; },
    dragAndDropCustomAnimate(action) { this.uploaderHovered = action; },
    onDrop(e) {
      e.stopPropagation(); e.preventDefault();
      this.formData.fileSelected = e.dataTransfer.files;
      this.fileCheckSum(e.dataTransfer.files);
    },
    fileCheckSum(file) {
      let re = /(\.csv|\.xlsx|\.xls)$/i;
      if (!re.exec(file[0].name)) {
        this.formData.fileSelected = [];
        this.$q.notify({ color: "negative", position: "bottom", message: "File format not supported", icon: "clear" });
        return false;
      }
    },
    onChange(e) { this.formData.fileSelected = e.target.files; },
    uploadFileForBulkUpload() {
      if (this.formData.fileSelected.length == 0) {
        this.$q.notify({ color: "amber-9", position: "bottom", message: "Please upload file", icon: "warning" });
        return;
      }
      this.$q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Please wait.." });
      let fd = new FormData();
      fd.append("file", this.formData.fileSelected[0]);
      this.FEED_ONBOARDING_EXISTING_MERCHANT_DEVICE_BULK_UPLOAD_DATA(fd).then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Added!", icon: "thumb_up" });
          this.ajaxLoadAllLeadInfo1({pagination: this.paginationControl1, filter: this.filterSearch1});
          this.formData.fileSelected = [];
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        });
    },
    getPincodeInformations() { this.FETCH_ALL_STATES_DATA(); },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.ONBOARDING_MERCHANT_UNASSIGNED_LIST({ pagination, filter }).then(() => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getOnboardingMerchantUnassignedList.totalElements;
          this.paginationControl1.page = this.getOnboardingMerchantUnassignedList.number + 1;
          this.tableData1 = this.getOnboardingMerchantUnassignedList.content;
          this.loadImplementationExecutives();
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.ONBOARDING_MERCHANT_ASSIGNED_LIST({ pagination, filter }).then(() => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getOnboardingMerchantAssignedList.totalElements;
          this.paginationControl.page = this.getOnboardingMerchantAssignedList.number + 1;
          this.tableData = this.getOnboardingMerchantAssignedList.content;
          this.loadImplementationExecutives();
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    loadImplementationExecutives() {
      this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
        this.assignToOptions = this.getImplementationExecutiveList.map(v => ({
          label: v.name + " | " + v.employeeID + " | " + v.email,
          value: v.id
        }));
      });
    },
    goToUnassignedTab(tab) {
      if (tab == "unAssigned") {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
        this.formData.marsDeviceIdsCooked = [];
      } else if (tab == "assigned") {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
        this.formData.marsDeviceIdsCookedUnAssinged = [];
      }
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length == 0 || !this.formData.assignTo) return;
      let postValues = {
        marsDeviceIds: this.formData.marsDeviceIdsCooked.map(v => v.id),
        userId: this.formData.assignTo
      };
      this.ONBOARDING_MERCHANT_SUBMIT(postValues).then(() => {
          this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
          this.formData.marsDeviceIdsCooked = [];
          this.formData.assignTo = "";
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Assigned!", icon: "thumb_up" });
        });
    },
    unAssignImplementationUser() {
      if (this.formData.marsDeviceIdsCookedUnAssinged.length == 0) return;
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_TID_GENERATED,
        marsDeviceIds: this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id),
        userId: this.$SEND_ZERO_FOR_UNASSIGING
      };
      this.ONBOARDING_MERCHANT_SUBMIT_UNASSIGN(postValues).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.formData.marsDeviceIdsCookedUnAssinged = [];
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Un-Assigned!", icon: "thumb_up" });
        });
    },
    reAssignImplementationUser() {
      if (this.formData.marsDeviceIdsCookedUnAssinged.length == 0 || !this.formData.assignTo) return;
      let postValues = {
        action: this.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
        marsDeviceIds: this.formData.marsDeviceIdsCookedUnAssinged.map(v => v.id),
        userId: this.formData.assignTo
      };
      this.ONBOARDING_MERCHANT_SUBMIT(postValues).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.formData.marsDeviceIdsCookedUnAssinged = [];
          this.formData.assignTo = "";
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Re-Assigned!", icon: "thumb_up" });
        });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
.size2 { font-size: xx-large; }
.drop { padding: 15px; background-color: #f6f6f6; border-radius: 2px; height: 100%; max-height: 400px; max-width: 600px; width: 100%; border: 4px dashed #ccc; }
</style>