<template>
  <q-page>
    <q-card class="q-mb-md">
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs v-model="uploadTab" class="shadow-1" color="tertiary" align="justify">
              <q-tab name="upload" class="size1" label="UPLOAD CSV FILE" />
            </q-tabs>
            <q-tab-panels v-model="uploadTab" animated>
              <q-tab-panel name="upload">
                <div class="q-pa-md">
                  <div class="row text-center justify-center">
                    <div class="col-md-8 q-py-md" align="center">
                      <div
                        v-if="formData.fileSelected.length == 0"
                        :class="[uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive']"
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
                            style="display:none"
                          />
                        </label>
                      </div>
                      <div v-else align="left">
                        <q-card dense class="q-pa-xs">
                          <q-card-section>Uploaded File</q-card-section>
                          <q-separator />
                          <q-card-section>
                            <q-item dense>
                              <q-item-section icon="attach_file" />
                              <q-item-section>{{ formData.fileSelected[0].name }}</q-item-section>
                            </q-item>
                          </q-card-section>
                          <q-separator />
                          <q-card-actions align="end">
                            <q-btn size="10px" color="negative" @click="removeBulkUploadFile" label="Remove" icon="clear" />
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                    <div class="col-md-12 group" align="center">
                      <q-btn :disabled="formData.fileSelected.length == 0" color="purple-9" label="Submit" @click="uploadFileForBulkUpload" />
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </q-card>

    <q-card>
      <div class="text-grey-9">
        <div class="row bottom-border q-pa-sm items-center">
          <div class="col">
            <q-tabs class="shadow-1" color="tertiary" align="justify" v-model="selectedTab" @update:model-value="goToUnassignedTab">
              <q-tab class="size1" label="Hitachi Onboarding Merchants" name="unAssigned" />
            </q-tabs>
            <q-tab-panels v-model="selectedTab" animated>
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
                    <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.tid }}</div></q-td>
                  </template>
                  <template v-slot:body-cell-mid="props">
                    <q-td :props="props" class="customTd"><div class="text-primary">{{ props.row.mid }}</div></q-td>
                  </template>
                  <template v-slot:body-cell-createdAt="props">
                    <q-td :props="props">{{ props.row.createdAt ? $moment(props.row.createdAt).format("Do MMM Y") : "NA" }}</q-td>
                  </template>
                  <template v-slot:body-cell-assign="props">
                    <q-td :props="props">
                      <q-btn class="btn1" v-if="props.row.isStatus == 1" disable push color="positive" size="sm">Success</q-btn>
                      <q-btn v-else-if="props.row.isStatus == 2 || props.row.isStatus == 3 || props.row.isStatus == null" push color="negative" size="sm" @click="OGSPendingStatus(props.row)">Re-Submit</q-btn>
                      <q-btn class="btn1" v-else-if="props.row.isStatus == 4" disable push color="purple-9" size="sm">Installed</q-btn>
                    </q-td>
                  </template>
                  <template v-slot:top>
                    <div class="col-md-4">
                      <q-input clearable color="grey-9" v-model="filterSearch1" label="Search by MerchantName, TID, MID..." class="q-mr-lg q-py-sm" />
                    </div>
                    <div class="col-md-6">
                      <q-btn color="purple-9" label="Download as Excel" class="q-mr-lg q-py-sm float-right" @click="downloadHitachiIndianBank" />
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </q-card>
    <downloadIndianBankReports v-if="propHitachiReport" :propHitachiReport="propHitachiReport" @emitfnHitachiIndianBank="downloadHitachiIndianBank" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import downloadIndianBankReports from "../../components/sat/downloadIndianBankReports.vue";

export default {
  name: "hitachiIndianBankOnboarding",
  components: { downloadIndianBankReports },
  data() {
    return {
      uploadTab: 'upload',
      propHitachiReport: false,
      filterSearch1: "",
      selectedTab: "unAssigned",
      tableData1: [],
      uploaderHovered: false,
      paginationControl1: { sortBy: "createdAt", descending: false, page: 1, rowsPerPage: 5 },
      tableAjaxLoading1: false,
      formData: { fileSelected: [] },
      columnData: [
        { name: "createdAt", label: "Upload Date / Time", align: "left", field: "createdAt", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadName || "NA" },
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "mid", label: "MID", align: "left", field: "mid" },
        { name: "device_model", label: "Device Model", align: "center", field: row => row.device || "NA" },
        { name: "device_address", label: "Contact Name", align: "left", field: row => row.contactName || "NA" },
        { name: "contact_number", label: "Contact Number", align: "center", field: row => row.contactNumber || "NA" },
        { name: "status", label: "Status", align: "left", field: row => (row.isStatus == 1 ? "Success" : row.isStatus == 2 ? "Pending" : row.isStatus == 3 ? "OGS Failure" : row.isStatus == 4 ? "Installed" : "Failure") },
        { name: "assign", label: "Action", align: "left", field: "action" }
      ]
    };
  },
  computed: {
    ...mapGetters("HitachiIndianBankOnboarding", ["getHitachiIndianOnboarding"]),
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"])
  },
  created() {
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
  },
  methods: {
    ...mapActions("HitachiIndianBankOnboarding", ["HITACHI_INDIAN_ONBOARDING_LIST", "REASSIGN_HITACHI_MERCHANTS"]),
    ...mapActions("IndianBankUpload", ["FEED_HITACHI_INDIAN_BANK_ONBOARDING_UPLOAD_DATA"]),
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),

    removeBulkUploadFile() { this.formData.fileSelected = []; },
    dragAndDropCustomAnimate(action) { this.uploaderHovered = action; },
    onDrop(e) { e.preventDefault(); this.formData.fileSelected = e.dataTransfer.files; },
    onChange(e) { this.formData.fileSelected = e.target.files; },
    uploadFileForBulkUpload() {
      if (this.formData.fileSelected.length === 0) return;
      this.$q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Please wait.." });
      let fd = new FormData();
      fd.append("file", this.formData.fileSelected[0]);
      this.FEED_HITACHI_INDIAN_BANK_ONBOARDING_UPLOAD_DATA({ file: fd }).then(() => {
        this.$q.loading.hide();
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Uploaded!", icon: "thumb_up" });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
        this.formData.fileSelected = [];
      }).catch(error => {
        this.$q.loading.hide();
        this.$q.notify({ color: "negative", position: "bottom", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
      });
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.HITACHI_INDIAN_ONBOARDING_LIST({ pagination, filter }).then(() => {
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getHitachiIndianOnboarding.totalElements;
        this.tableData1 = this.getHitachiIndianOnboarding.content;
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    goToUnassignedTab() { this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" }); },
    OGSPendingStatus(request) {
      this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });
      this.REASSIGN_HITACHI_MERCHANTS({ tid: request.tid }).then(() => {
        this.$q.loading.hide();
        this.$q.notify({ color: "positive", position: "bottom", message: "Re-Assigned Successfully", icon: "thumb_up" });
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: "" });
      }).catch(err => {
        this.$q.loading.hide();
        this.$q.notify({ color: "negative", position: "bottom", message: err.body?.message || "Please Try Again Later !", icon: "thumb_down" });
      });
    },
    downloadHitachiIndianBank() { this.propHitachiReport = !this.propHitachiReport; }
  }
};
</script>

<style scoped>
.customTd { text-align: left !important; word-wrap: break-word; white-space: normal; }
.customTd.customCellLength { min-width: 300px !important; overflow-x: auto; }
.btn1 { width: 87px; }
.drop { padding: 15px; background-color: #f6f6f6; border-radius: 2px; height: 100%; max-height: 400px; max-width: 600px; width: 100%; border: 4px dashed #ccc; }
</style>
