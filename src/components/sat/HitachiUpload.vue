<template>
  <div class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-btn icon="download" class="common-btn" label="Download" @click="downloadhitachidownload" />
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="text-center">
        <div class="q-mb-md">
          <a href="/files/Hitachi_Brand_Emi_Details.xlsx" class="text-primary text-decoration-none">
            Click here to download the template
          </a>
        </div>
        <div class="row justify-center">
          <div class="col-12 col-md-8">
            <div v-if="formData.fileSelected.length == 0"
              class="drop cursor-pointer flex flex-center border-dashed border-grey-4 q-pa-md"
              style="border: 2px dashed #ccc; min-height: 150px; background: #f9f9f9"
              @dragover.prevent @drop.prevent="onDrop">
              <label class="cursor-pointer full-width">
                Drag & Drop or click here to open a file
                <input type="file" class="hidden" @change="onChange" accept=".xlsx, .xls, .csv" />
              </label>
            </div>
            <q-card v-else flat bordered class="q-pa-sm">
              <q-card-section class="row items-center q-gutter-sm">
                <q-icon name="attach_file" size="sm" />
                <div class="col text-left">{{ formData.fileSelected[0].name }}</div>
                <q-btn flat round color="negative" icon="close" @click="removeBulkUploadFile" />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="q-mt-md">
          <q-btn class="common-btn" label="Upload" @click="uploadFileForBulkUpload" :disabled="formData.fileSelected.length == 0" />
        </div>
      </q-card-section>
    </q-card>

    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />

    <q-table :rows="tableData" :columns="columns" :filter="filter" v-model:pagination="paginationControl" row-key="id"
      :loading="toggleAjaxLoadFilter" :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo">
      <template v-slot:body-cell-leadNumber="props">
        <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
          <span class="label text-primary"># {{ props.row.leadInformation?.leadNumber || "NA" }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-HitachiStatus="props">
        <q-td :props="props">{{ props.row.hitachiLeadStatus || "NA" }}</q-td>
      </template>
      <template v-slot:body-cell-deviceSer="props">
        <q-td :props="props">{{ props.row.regionalInventory?.serialNumber || "NA" }}</q-td>
      </template>
      <template v-slot:body-cell-region="props">
        <q-td :props="props">{{ props.row.leadInformation?.region?.regionAreaName || "NA" }}</q-td>
      </template>
      <template v-slot:top>
        <div class="col-md-5">
          <q-input clearable v-model="filter" color="grey-9" label="Search Using MID" class="q-mr-lg q-py-sm" />
        </div>
      </template>
    </q-table>

    <HitachiDownload v-if="propHitachiDownload" v-model:propHitachiDownload="propHitachiDownload" @emitfnshowHitachiDownload="downloadhitachidownload" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import HitachiDownload from "../../components/sat/HitachiDownload.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "HitachiUpload",
  components: { HitachiDownload, generalLeadInformation },
  data() {
    return {
      propHitachiDownload: false,
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      formData: { fileSelected: [] },
      toggleAjaxLoadFilter: false,
      paginationControl: { page: 1, sortBy: "tid", descending: false, rowsPerPage: 10 },
      tableData: [],
      filter: "",
      columns: [
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "leadNumber", label: "Lead Id", align: "left" },
        { name: "HitachiStatus", label: "Hitachi Lead Status", align: "center" },
        { name: "deviceSer", label: "Serial Number", align: "center" },
        { name: "region", label: "Region", align: "center" }
      ]
    };
  },
  computed: {
    ...mapGetters("hitachi", ["gethitachiEmiData"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },
  methods: {
    ...mapActions("hitachi", ["FETCH_HITACHI_EMI_DATAS"]),
    ...mapActions("InventoryBulkUploadDevice", ["UPLOAD_EMI_DATAS"]),
    downloadhitachidownload() { this.propHitachiDownload = !this.propHitachiDownload; },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ message: "Fetching data .." });
      this.FETCH_HITACHI_EMI_DATAS({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.gethitachiEmiData.totalElements;
        this.tableData = this.gethitachiEmiData.content;
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    toggleLeadInformation(details) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (details) this.addtnLeadInformation = details;
    },
    removeBulkUploadFile() { this.formData.fileSelected = []; },
    onDrop(e) { this.formData.fileSelected = Array.from(e.dataTransfer.files); },
    onChange(e) { this.formData.fileSelected = Array.from(e.target.files); },
    uploadFileForBulkUpload() {
      if (this.formData.fileSelected.length == 0) return;
      this.$q.loading.show({ message: "Uploading..." });
      let fd = new FormData();
      fd.append("file", this.formData.fileSelected[0]);
      this.UPLOAD_EMI_DATAS({ file: fd }).then(() => {
        this.formData.fileSelected = [];
        this.$q.notify({ color: "positive", message: "Successfully added!", icon: "thumb_up" });
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
        this.$q.loading.hide();
      }).catch(err => {
        this.$q.notify({ color: "negative", message: err.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        this.$q.loading.hide();
      });
    }
  }
};
</script>