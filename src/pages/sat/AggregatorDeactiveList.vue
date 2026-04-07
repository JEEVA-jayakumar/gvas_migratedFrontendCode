<template>
  <q-page>
    <div>
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Aggregator De-Active List
      </div>

      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="name"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-tid="props">
          <q-td v-if="props.row" :props="props">
            <span class="label text-primary"># {{ props.row.tid }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mid="props">
          <q-td v-if="props.row" :props="props">
            <span class="label text-primary"># {{ props.row.mid }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadNumber="props">
          <q-td
v-if="props.row"             :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row)"
          >
            <span class="label text-primary"
              ># {{ props.row.leadInformation.leadNumber }}</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell-mobileNumber="props">
          <q-td v-if="props.row" :props="props">{{
            props.row.leadInformation == null
              ? "NA"
              : props.row.leadInformation.contactNumber
          }}</q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td v-if="props.row" :props="props">{{
            props.row.leadInformation == null
              ? "NA"
              : props.row.leadInformation.leadAddress
          }}</q-td>
        </template>
        <template v-slot:body-cell-deviceStatusDate="props">
          <q-td v-if="props.row" :props="props">
            <span class="label">{{
              $moment(props.row.deviceStatusDate).format("Do MMM Y")
            }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-viewDocument="props">
          <q-td v-if="props.row" :props="props">
            <div
              v-if="
                props.row.implementationFormMimeType == null ||
                props.row.implementationFormMimeType.includes('application/pdf')
              "
              class="cursor-pointer"
            >
              <div @click="fnPDFViewModal(props.row.implementationForm)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.implementationForm }}
              </div>
            </div>
            <div
              v-else-if="
                props.row.implementationFormMimeType == null ||
                props.row.implementationFormMimeType.includes('image/')
              "
              class="cursor-pointer"
            >
              <div @click="fnViewMultiAttachedFileImageUploadedBySat()">
                <viewer
                  :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]"
                >
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL + '/' + props.row.implementationForm]"
                    style="max-width: 15%"
                  />
                </viewer>
              </div>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-pictureOfShop="props">
          <q-td v-if="props.row" :props="props">
            <div
              v-if="
                props.row.pictureOfShopMimeType == null ||
                props.row.pictureOfShopMimeType.includes('application/pdf')
              "
              class="cursor-pointer"
            >
              <div @click="fnPDFViewModal(props.row.pictureOfShop)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.pictureOfShop }}
              </div>
            </div>
            <div
              v-else-if="
                props.row.pictureOfShopMimeType == null ||
                props.row.pictureOfShopMimeType.includes('image/')
              "
              class="cursor-pointer"
            >
              <div @click="fnViewMultiAttachedFileImageUploadedByPictureShop()">
                <viewer
                  :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]"
                >
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL + '/' + props.row.pictureOfShop]"
                    style="max-width: 15%"
                  />
                </viewer>
              </div>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-cpvForm="props">
          <q-td v-if="props.row" :props="props">
            <div
              v-if="
                props.row.cpvFormMimeType == null ||
                props.row.cpvFormMimeType.includes('application/pdf')
              "
              class="cursor-pointer"
            >
              <div @click="fnPDFViewModal(props.row.cpvForm)">
                <q-icon name="fas fa-file-pdf" color="primary" />
                &nbsp;{{ props.row.cpvForm }}
              </div>
            </div>
            <div
              v-else-if="
                props.row.cpvFormMimeType == null ||
                props.row.cpvFormMimeType.includes('image/')
              "
              class="cursor-pointer"
            >
              <div @click="fnViewMultiAttachedFileImageUploadedByCpvForm()">
                <viewer :img="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]">
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL + '/' + props.row.cpvForm]"
                    style="max-width: 15%"
                  />
                </viewer>
              </div>
            </div>
            <div v-else>NA Document</div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td v-if="props.row" :props="props">
            <span class="label text-positive" v-if="props.row.deviceStatus == 6"
              >Approved</span
            >
            <span class="label text-negative" v-else-if="props.row.deviceStatus == 7"
              >Pending</span
            >
            <span class="label text-amber" v-else>NA</span>
          </q-td>
        </template>

        <template v-slot:top>
          <div class="col-5">
            <q-input
              dense
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search by MID, TID, Merchant Name"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-2">
            <q-input
              type="date"
              class="q-mr-lg q-py-sm"
              v-model="formData.fromDate"
              label="From Date"
            />
          </div>
          <div class="col-2">
            <q-input
              type="date"
              class="q-mr-lg q-py-sm"
              v-model="formData.toDate"
              label="To Date"
            />
          </div>
          <div class="col-2">
            <q-btn
              align="right"
              color="purple-9"
              :disabled="
                formData.fromDate == '' ||
                formData.fromDate == null ||
                formData.toDate == '' ||
                formData.toDate == null
              "
              style="margin-right: 10px"
              @click="SubmitData(formData)"
              >Submit</q-btn
            >
            <q-btn color="red" v-if="selectedRow" @click="DeleteData">
              <q-icon name="delete" />
            </q-btn>
          </div>
        </template>
      </q-table>
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      >
      </showMerchantTransactionLevelDetails>
    </div>
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    ></showPdfModalComponent>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "merchantTransactionLevel",

  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    showPdfModalComponent,
  },

  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      toggleshowPDFModal: false,
      PDFDetails: "",
      propShowConvertToSat: false,
      propShowViewReject: false,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "deviceStatusDate",
        descending: false,
        rowsPerPage: 10,
      },
      tableData: [],
      valueToggleMerchantTransaction: false,
      filter: "",
      formData: {
        fromDate: "",
        toDate: "",
      },
      formData1: {
        fromDate: "",
        toDate: "",
      },
      selectedRow: null,
      columns: [
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: "tid",
          sortable: true,
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: "mid",
          sortable: true,
        },
        {
          name: "leadNumber",
          required: true,
          label: "Lead ID",
          align: "left",
          field: (row) => {
            return "# " + row.leadInformation.leadNumber == null
              ? "NA"
              : row.leadInformation.leadNumber;
          },
          sortable: true,
        },
        {
          name: "leadName",
          required: true,
          label: "Merchant Name",
          align: "left",
          field: (row) => {
            return row.leadInformation.leadName;
          },
          sortable: false,
        },
        {
          name: "leadAddress",
          required: true,
          label: "Merchant Address",
          align: "left",
          field: (row) => {
            row.leadInformation.leadAddress;
          },
          sortable: false,
        },
        {
          name: "deviceName",
          required: true,
          label: "Device type",
          align: "left",
          field: (row) => {
            return row.leadInformation.aggregatorDevice.deviceName == null
              ? "NA"
              : row.leadInformation.aggregatorDevice.deviceName;
          },
          sortable: false,
        },
        {
          name: "aggregatorRegionalInventory.serialNumber",
          required: true,
          label: "Device Serial Number",
          align: "left",
          field: (row) => {
            return row.aggregatorRegionalInventory == null
              ? "NA"
              : row.aggregatorRegionalInventory.serialNumber;
          },
          sortable: true,
        },
        {
          name: "deviceStatusDate",
          required: true,
          label: "Implementation Date",
          align: "left",
          field: "deviceStatusDate",
          sortable: true,
        },
        {
          name: "assignedTo",
          required: true,
          label: "Implemented by",
          align: "left",
          field: (row) => {
            return row.assignedTo == null
              ? "NA"
              : row.assignedTo.name + " | " + row.assignedTo.employeeID;
          },
          sortable: true,
        },
        {
          name: "deviceAddress",
          required: true,
          label: "Implemented Address",
          align: "left",
          field: "deviceAddress",
          sortable: true,
        },
        {
          name: "pincode",
          required: true,
          label: "Merchants Pincode",
          align: "left",
          field: (row) => {
            return row.leadInformation.pincode == null
              ? "NA"
              : row.leadInformation.pincode;
          },
          sortable: false,
        },
        {
          name: "city",
          required: true,
          label: "Merchants City Town",
          align: "left",
          field: (row) => {
            return row.leadInformation.city == null
              ? "NA"
              : row.leadInformation.city;
          },
          sortable: false,
        },
        {
          name: "contactNumber",
          required: true,
          label: "Mobile Number",
          align: "center",
          field: (row) => {
            return row.assignedTo == null ? "NA" : row.assignedTo.contactNumber;
          },
          sortable: false,
        },
        {
          name: "status",
          required: true,
          label: "Device Status",
          align: "center",
          field: "deviceStatus",
          sortable: false,
        },
        {
          name: "viewDocument",
          required: true,
          label: "Implementation Form",
          align: "center",
          field: (row) => {
            return row.implementationForm == null
              ? "NA"
              : row.implementationForm;
          },
          sortable: false,
        },
        {
          name: "pictureOfShop",
          required: true,
          label: "PictureOfShop",
          align: "center",
          field: (row) => {
            return row.pictureOfShop == null ? "NA" : row.pictureOfShop;
          },
          sortable: false,
        },
        {
          name: "cpvForm",
          required: true,
          label: "cpvForm",
          align: "center",
          field: (row) => {
            return row.cpvForm == null ? "NA" : row.cpvForm;
          },
          sortable: false,
        },
      ],
      loading: true,
      filter_values: "",
    };
  },
  computed: {
    ...mapGetters("equitasImplementedQueue", ["getaggdeactivelist"]),
    ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter,
      formData: this.formData,
    });
  },

  methods: {
    ...mapActions("equitasImplementedQueue", ["AGGREGATOR_DEACTIVE_LIST"]),
    toTimestamp(strDate, isFromDate = true) {
      const date = strDate.split("T")[0];
      let timeStr = "00:00:00";
      if (!isFromDate) {
        timeStr = "23:59:00";
      }
      const formattedDate = `${date}T${timeStr}Z`;
      const datum = Date.parse(formattedDate);
      return datum;
    },
    SubmitData(request) {
      this.formData1 = {
        fromDate: this.toTimestamp(request.fromDate.toString(), true),
        toDate: this.toTimestamp(request.toDate.toString(), false),
      };
      if (this.formData1.fromDate <= this.formData1.toDate) {
        this.selectedRow = request;
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter,
          formData: this.formData1,
        });
      } else {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "TO Date must be greather than From Date",
          icon: "thumb_down",
        });
      }
    },
    DeleteData() {
      (this.formData.fromDate = ""),
        (this.formData.toDate = ""),
        (this.formData1.fromDate = ""),
        (this.formData1.toDate = ""),
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter,
          formData: this.formData1,
        });
      this.selectedRow = null;
    },
    ajaxLoadAllLeadInfo({ pagination, filter, formData }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.AGGREGATOR_DEACTIVE_LIST({
        pagination,
        filter: this.filter,
        formData: this.formData1,
      })
        .then((res) => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getaggdeactivelist.totalElements;
          this.paginationControl.page = this.getaggdeactivelist.number + 1;
          this.tableData = this.getaggdeactivelist.content;
          if (this.getaggdeactivelist.sort != null) {
            this.paginationControl.sortBy = this.getaggdeactivelist.sort[0].property;
            this.paginationControl.descending = this.getaggdeactivelist.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    fnPDFViewModal(documentUrl) {
      this.PDFDetails = documentUrl;
      this.toggleshowPDFModal = !this.toggleshowPDFModal;
    },
    fnViewMultiAttachedFileImageUploadedBySat() {
      // Logic from legacy if needed
    },
    fnViewMultiAttachedFileImageUploadedByPictureShop() {
      // Logic from legacy if needed
    },
    fnViewMultiAttachedFileImageUploadedByCpvForm() {
      // Logic from legacy if needed
    },
  },
};
</script>

<style></style>
