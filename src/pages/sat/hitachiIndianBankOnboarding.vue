<template>
  <q-page>
    <q-card>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs
              v-model="uploadTab"
              class="shadow-1"
              color="tertiary"
              align="justify"
            >
              <q-tab name="upload" class="size1" label="UPLOAD CSV FILE" />
              <q-tab name="unAssigned" class="size1" label="UNASSIGNED" />
            </q-tabs>

            <q-tab-panels v-model="uploadTab" animated @update:model-value="goToUnassignedTab">
              <q-tab-panel name="upload">
                <div class="q-pa-md">
                  <div class="row text-center justify-center">
                    <div class="col-md-8 q-py-md" align="center">
                      <div
                        v-if="formData.fileSelected.length == 0"
                        :class="[
                          uploaderHovered
                            ? 'toggleBulkUploadDisable'
                            : 'toggleBulkUploadActive'
                        ]"
                        class="drop display-inline align-center cursor-pointer"
                        @dragover.prevent="dragAndDropCustomAnimate(true)"
                        @dragleave.prevent="dragAndDropCustomAnimate(false)"
                        @drop="onDrop"
                      >
                        <label style="width: auto;" class="btn display-inline cursor-pointer">
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
                    <div class="col-md-12 group" align="center">
                      <q-btn
                        :disabled="formData.fileSelected.length == 0 "
                        type="button"
                        color="purple-9"
                        label="Submit"
                        @click="uploadFileForBulkUpload"
                      />
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="unAssigned">
                <q-table
                  :rows="tableData1"
                  :columns="columnData"
                  table-class="customTableClass"
                  :filter="filterSearch1"
                  v-model:pagination="paginationControl1"
                  row-key="id"
                  :loading="tableAjaxLoading1"
                  :rows-per-page-options="[5, 10, 15, 20]"
                  color="dark"
                  @request="ajaxLoadAllLeadInfo1"
                >
                  <template v-slot:body-cell-tid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.tid }}</div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-mid="props">
                    <q-td :props="props" class="customTd">
                      <div class="text-primary">{{ props.row.mid }}</div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-createdAt="props">
                    <q-td :props="props">
                      {{ $moment(props.row.createdAt).format("Do MMM Y") }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-assign="props">
                    <q-td :props="props">
                      <q-btn
                        class="btn1"
                        v-if="props.row.isStatus == 1"
                        disable
                        push
                        color="positive"
                        size="sm"
                        >Success</q-btn
                      >
                      <q-btn
                        v-if="props.row.isStatus == 2 || props.row.isStatus == 3 || props.row.isStatus == null"
                        push
                        color="negative"
                        size="sm"
                        @click="OGSPendingStatus(props.row)"
                        >Re-Submit</q-btn
                      >
                      <q-btn
                        class="btn1"
                        v-if="props.row.isStatus == 4"
                        disable
                        push
                        color="purple-9"
                        size="sm"
                        >Installed</q-btn
                      >
                    </q-td>
                  </template>
                  <template v-slot:top>
                    <div class="col-md-4">
                      <q-input
                        clearable
                        color="grey-9"
                        v-model="filterSearch1"
                        placeholder="Type.."
                        label="Search by MerchantName, TID, MID..."
                        class="q-mr-lg q-py-sm"
                      />
                    </div>
                    <div class="col-md-6">
                      <q-btn
                        color="purple-9"
                        label="Download as Excel"
                        class="q-mr-lg q-py-sm float-right"
                        size="md"
                        @click="downloadHitachiIndianBank()"
                      />
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </q-card>
    <downloadIndianBankReports
              v-if="propHitachiReport"
              :propHitachiReport="propHitachiReport"
              @emitfnHitachiIndianBank="downloadHitachiIndianBank"
            ></downloadIndianBankReports>
  </q-page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import downloadIndianBankReports from "../../components/sat/downloadIndianBankReports.vue";
export default {
  name: "hitachiIndianBankOnboarding",
  components: {
    downloadIndianBankReports
  },
  data() {
    return {
      uploadTab: 'upload',
      propToggleLeadInformation: false,
      propHitachiReport:false,
      addtnLeadInformation: null,
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "unAssigned",
      assignTo: "",
      assignToOptions: [],
      tableData: [],
      tableData1: [],
      uploaderHovered: false,

      columnData: [
        {
          name: "createdAt",
          required: true,
          label: "Upload Date / Time",
          align: "left",
          field: row => row.createdAt,
          sortable: true
        },
        {
          name: "merchant_name",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: row => row.leadName || "NA",
          sortable: false
        },
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: row => row.tid,
          sortable: false
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: row => row.mid,
          sortable: false
        },
        {
          name: "device_model",
          required: true,
          label: "Device Model",
          align: "center",
          field: row => row.device || "NA",
          sortable: false
        },
        {
          name: "device_address",
          required: true,
          label: "Contact Name",
          align: "left",
          field: row => row.contactName || "NA",
          sortable: false
        },
        {
          name: "contact_number",
          required: true,
          label: "Contact Number",
          align: "center",
          field: row => row.contactNumber || "NA",
          sortable: false
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "left",
          field: row => {
            if (row.isStatus == 1) return "Success";
            if (row.isStatus == 2) return "Pending";
            if (row.isStatus == 3) return "OGS Failure";
            if (row.isStatus == 4) return "Installed";
            return "Failure";
          },
          sortable: false
        },
        {
          name: "assign",
          required: true,
          label: "Action",
          align: "left",
          field: "action",
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
      paginationControl1: {
        sortBy: "createdAt",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
      tableAjaxLoading1: false
    };
  },
  computed: {
    ...mapGetters("HitachiIndianBankOnboarding", ["getHitachiIndianOnboarding"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"])
  },
  methods: {
    ...mapActions("HitachiIndianBankOnboarding", ["HITACHI_INDIAN_ONBOARDING_LIST", "REASSIGN_HITACHI_MERCHANTS"]),
    ...mapActions("IndianBankUpload", ["FEED_HITACHI_INDIAN_BANK_ONBOARDING_UPLOAD_DATA"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

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
      this.FEED_HITACHI_INDIAN_BANK_ONBOARDING_UPLOAD_DATA({ file: fd }).then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Uploaded!", icon: "thumb_up" });
          this.ajaxLoadAllLeadInfo1({pagination: this.paginationControl1, filter: this.filterSearch1});
          this.formData.fileSelected = [];
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.HITACHI_INDIAN_ONBOARDING_LIST({ pagination, filter }).then(() => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getHitachiIndianOnboarding.totalElements;
          this.paginationControl1.page = this.getHitachiIndianOnboarding.number + 1;
          this.tableData1 = this.getHitachiIndianOnboarding.content;
          this.$q.loading.hide();
        }).catch(() => this.$q.loading.hide());
    },
    goToUnassignedTab(tab) {
        if (tab === "unAssigned") this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
    },
    OGSPendingStatus(request) {
      this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });
      this.REASSIGN_HITACHI_MERCHANTS({ tid: request.tid }).then(() => {
          this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
          this.$q.notify({ color: "positive", position: "bottom", message: "Re-Assigned Successfully", icon: "thumb_up" });
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        });
    },
    downloadHitachiIndianBank() { this.propHitachiReport = !this.propHitachiReport; }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
input[type="file"] { position: absolute; opacity: 0; z-index: -1; }
.btn1 { width: 87px; }
.align-center { text-align: center; }
.display-inline { display: inline-block; vertical-align: middle; }
.drop { padding: 15px; background-color: #f6f6f6; border-radius: 2px; height: 100%; max-height: 400px; max-width: 600px; width: 100%; }
.toggleBulkUploadActive { border: 4px dashed #ccc; }
.toggleBulkUploadDisable { border: 4px dashed #1f2c3fa6; }
</style>