<template>
  <q-page>
    <div class="q-pa-md">
      <div class="text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        DOC Viewer
      </div>
      <div class="row q-col-gutter-md q-pt-md justify-around items-end">
        <div class="col-12 col-md-6">
          <q-input
            filled
            clearable
            @clear="fnClearing"
            color="purple-9"
            v-model="formData.searchTerm"
            placeholder="Type.."
            label="Search By Ticket ID / TID..."
          />
        </div>
        <div class="col-12 col-md-3">
          <div class="q-gutter-sm">
            <q-radio v-for="(item, index) in flagOptions" :key="index" color="purple-9" v-model="formData.flag" :val="item.value" :label="item.label"/>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <q-btn class="full-width" :disabled="!formData.searchTerm || !formData.flag" size="md" color="purple-9" @click="globalSubmit" label="Submit" />
        </div>
      </div>
    </div>
  
    <div v-if="tableData && tableData.length != 0" class="q-pa-md">
      <q-table table-class="customTableClass" :rows="tableData" :columns="columns" v-model:pagination="paginationControl" row-key="id" :loading="toggleAjaxLoadFilter" :rows-per-page-options="[5, 10, 15, 20]" @request="ajaxLoadAllLeadInfo">
        <template v-slot:body-cell-tid="props">
          <q-td :props="props">
            <span class="text-primary text-bold"># {{ props.row.tid }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-merchantName="props">
          <q-td :props="props">
            {{ (props.row.leadInformation && props.row.leadInformation.contactName) ? props.row.leadInformation.contactName : "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-regionAreaName="props">
          <q-td :props="props">
            {{ (props.row.aggregatorRegionalInventory && props.row.aggregatorRegionalInventory.region) ? props.row.aggregatorRegionalInventory.region.regionAreaName : "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-viewDocument="props">
          <q-td :props="props">
            <div v-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <q-btn flat round @click="fnPDFViewModal(props.row.implementationForm)" icon="fas fa-file-pdf" color="primary" />
            </div>
            <div v-else-if="props.row.implementationFormMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopuop(props.row.implementationForm)" icon="fa fa-camera" />
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
         <template v-slot:body-cell-pictureOfShop="props">
          <q-td :props="props">
            <div v-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
              <q-btn flat round @click="fnPDFViewModal(props.row.pictureOfShop)" icon="fas fa-file-pdf" color="primary" />
            </div>
            <div v-else-if="props.row.pictureOfShopMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopuop(props.row.pictureOfShop)" icon="fa fa-camera" />
            </div>
            <div v-else>NA Document</div>
          </q-td>
         </template>
         <template v-slot:body-cell-cpvForm="props">
          <q-td :props="props">
            <div v-if="!props.row.cpvFormMimeType || props.row.cpvFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <q-btn flat round @click="fnPDFViewModal(props.row.cpvForm)" icon="fas fa-file-pdf" color="primary" />
            </div>
            <div v-else-if="props.row.cpvFormMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopuop(props.row.cpvForm)" icon="fa fa-camera" />
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
      </q-table>
    </div>

    <div v-else-if="tableData1 && tableData1.length != 0" class="q-pa-md">
      <q-table table-class="customTableClass" :rows="tableData1" :columns="columns1" row-key="id" v-model:pagination="paginationControlchange" :rows-per-page-options="[5,10,15,20]" :loading="toggleAjaxLoadFilter" @request="ajaxLoadAllLeadInfo1">
       <template v-slot:body-cell-tid="props">
          <q-td :props="props">
            <span class="text-primary text-bold"># {{ (props.row.serviceRequestData) ? props.row.serviceRequestData.tid : 'NA' }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-merchantName="props">
          <q-td :props="props">
            {{ (props.row.serviceRequestData && props.row.serviceRequestData.meName) ? props.row.serviceRequestData.meName : "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-regionAreaName="props">
          <q-td :props="props">
            {{ (props.row.serviceRequestData && props.row.serviceRequestData.bpRegion) ? props.row.serviceRequestData.bpRegion.regionAreaName : "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-ticket="props">
          <q-td :props="props">
            {{ (props.row.serviceRequestData) ? props.row.serviceRequestData.serviceReqTicketId : "NA" }}
          </q-td>
        </template>
        <template v-slot:body-cell-pictureOfShop="props">
          <q-td :props="props">
            <div v-if="!props.row.pictureOfShopMimeType || props.row.pictureOfShopMimeType.includes('application/pdf')" class="cursor-pointer">
              <q-btn flat round @click="fnPDFViewModal(props.row.pictureOfShop)" icon="fas fa-file-pdf" color="primary" />
            </div>
            <div v-else-if="props.row.pictureOfShopMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopuop(props.row.pictureOfShop)" icon="fa fa-camera" />
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-viewDocument="props">
          <q-td :props="props">
            <div v-if="!props.row.implementationFormMimeType || props.row.implementationFormMimeType.includes('application/pdf')" class="cursor-pointer">
              <q-btn flat round @click="fnPDFViewModal(props.row.implementationForm)" icon="fas fa-file-pdf" color="primary" />
            </div>
            <div v-else-if="props.row.implementationFormMimeType.includes('image/')" class="cursor-pointer">
              <q-btn flat dense color="green" @click="fnShowPopuop(props.row.implementationForm)" icon="fa fa-camera" />
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
      </q-table>
    </div>

    <div v-else class="row justify-center items-center q-pa-xl" style="min-height: 40vh">
      <div class="text-center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="text-subtitle1 text-bold text-grey-9"> No Data Available </div>
      </div>
    </div>

    <showPDF v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"></showPDF>
    <popup v-if="propShowPopup"
      :propShowPopup="propShowPopup"
      :propRowDetails="propRowDetails"
      @emitfnshowservice="fnShowPopuop"></popup>

    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
    </div>
  </q-page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import popup from 'src/components/crm/popup.vue'
import showPDF from 'src/components/crm/showPDF.vue'

export default {
  name: "DocViewer",
  components: {
    popup,
    showPDF
  },
  data() {
    return {
      propShowPopup: false,
      propRowDetails: null,
      toggleshowPDFModal: false,
      PDFDetails: null,
      toggleAjaxLoadFilter: false,
      tableData: [],
      tableData1: [],
      formData: {
        flag: null,
        searchTerm: "",
      },
      flagOptions: [
        { label: "Tid", value: 1 },
        { label: "Ticket ID", value: 2 }
      ],
      paginationControl: {
        rowsNumber: 0,
        page: 1,
        sortBy: "createdDate",
        descending: false,
        rowsPerPage: 5,
      },
      paginationControlchange: {
        rowsNumber: 0,
        page: 1,
        sortBy: "createdDate",
        descending: false,
        rowsPerPage: 5,
      },
      columns: [
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "merchantName", label: "Merchant Name", align: "left", field: "merchantName" },
        { name: "regionAreaName", label: "Region", align: "left", field: "regionAreaName" },
        { name: "viewDocument", label: "Imp Form", align: "left", field: "implementationForm" },
        { name: "pictureOfShop", label: "Pic of Shop", align: "left", field: "pictureOfShop" },
        { name: "cpvForm", label: "CPV form", align: "left", field: "cpvForm" },
      ],
      columns1: [
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "merchantName", label: "Merchant Name", align: "left", field: "merchantName" },
        { name: "regionAreaName", label: "Region", align: "left", field: "regionAreaName" },
        { name: "ticket", label: "Ticket ID", align: "left", field: "ticket" },
        { name: "pictureOfShop", label: "Pic of Shop", align: "left", field: "pictureOfShop" },
        { name: "viewDocument", label: "Imp Form", align: "left", field: "implementationForm" },
      ],
    };
  },
  computed: {
    ...mapGetters("globalSearchSerialNumber", ["getdocview", "getdocticket"]),
  },
  methods: {
    ...mapActions("globalSearchSerialNumber", ["FETCH_DOC_VIEW", "FETCH_DOC_VIEW_TICKET"]),
    globalSubmit() {
      if (!this.formData.searchTerm || !this.formData.flag) {
          this.$q.notify({ color: 'warning', message: 'Please enter search term and select type' });
          return;
      }
      this.toggleAjaxLoadFilter = true;
      if(this.formData.flag == 1){
          this.FETCH_DOC_VIEW(this.formData).then(() => {
                this.tableData = this.getdocview || [];
                this.tableData1 = [];
                this.toggleAjaxLoadFilter = false;
          }).catch(error => {
                this.toggleAjaxLoadFilter = false;
                const message = (error.body && error.body.message) ? error.body.message : "Fetch failed";
                this.$q.notify({ color: "negative", message: message });
          });
      } else {
          this.FETCH_DOC_VIEW_TICKET(this.formData).then(() => {
                this.tableData1 = this.getdocticket || [];
                this.tableData = [];
                this.toggleAjaxLoadFilter = false;
          }).catch(error => {
                this.toggleAjaxLoadFilter = false;
                const message = (error.body && error.body.message) ? error.body.message : "Fetch failed";
                this.$q.notify({ color: "negative", message: message });
          });
      }
    },
    ajaxLoadAllLeadInfo(request) {
      this.paginationControl = request.pagination;
      if (this.getdocview) {
        this.paginationControl.rowsNumber = this.getdocview.length;
      }
    },
    ajaxLoadAllLeadInfo1(request) {
      this.paginationControlchange = request.pagination;
      if (this.getdocticket) {
        this.paginationControlchange.rowsNumber = this.getdocticket.length;
      }
    },
    fnPDFViewModal(documentUrl) {
      if (!documentUrl) return;
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnShowPopuop(rowDetails) {
      if (!rowDetails) return;
      this.propRowDetails = rowDetails;
      this.propShowPopup = !this.propShowPopup;
    },
    fnClearing() {
      this.tableData = [];
      this.tableData1 = [];
      this.formData.flag = null;
    },
  },
};
</script>
<style scoped>
.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}
</style>
