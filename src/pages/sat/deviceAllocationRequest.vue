<template>
  <q-page>
    <div class="q-pa-md">
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      > Device Request</div>

      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-soName="props">
          <q-td v-if="props.row" :props="props">
            {{ props.row.soName == null ? "NA" : props.row.soName }}
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td v-if="props.row" :props="props">
            <q-btn
              v-if="props.row.status == 0"
              push
              class="q-mx-sm"
              color="positive"
              size="sm"
              @click="approveDeviceReques(props.row)"
              label="Approve"
            />
            <q-btn
              v-if="props.row.status == 0"
              push
              class="q-mx-sm"
              color="negative"
              size="sm"
              @click="deviceRequest(props.row)"
              label="Reject"
            />
            <span class="label text-green" v-if="props.row.status == 1"> Device Allocated SuccesFully</span>
            <div v-if="props.row.status == 2">
              <span class="label text-red"> Rejected</span>
              <br>
              <span class="label text">Remarks: {{ props.row.remarks == null ? "NA": props.row.remarks }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:top>
          <div class="col-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search Using POD,Serial No, Merchant Name"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>

      <deviceAllocationRequest
        v-if="showRequestModal"
        :showRequestModal="showRequestModal"
        :showRequestComponent="propsLostAppend"
        @closeLostModel="deviceRequest"
      ></deviceAllocationRequest>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import deviceAllocationRequest from "../../components/sat/rejectDeviceRequest.vue";

export default {
  name: "deviceAllocationRequest",
  components: {
    deviceAllocationRequest,
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propLostStolenDatas: false,
      propsLostAppend: [],
      showRequestModal: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "id",
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      filter: "",
      columns: [
        {
          name: "soName",
          required: true,
          label: "SO Name",
          align: "left",
          field: "soName",
          sortable: true
        },
        {
          name: "serialNumber",
          required: true,
          label: "Serial Number",
          align: "left",
          field: row => row.regionalInventory?.serialNumber,
          sortable: true
        },
        {
          name: "podNumber",
          required: true,
          label: "POD",
          align: "left",
          field: row => row.podNumber == null ? "NA" : row.podNumber,
          sortable: false
        },
        {
          name: "requestedAt",
          required: true,
          label: "Requested Date",
          align: "left",
          field: row => row.requestedAt ? moment(row.requestedAt).format("DD/MM/YYYY") : "NA",
          sortable: false
        },
        {
          name: "actionedAt",
          required: true,
          label: "Actioned Date",
          align: "center",
          field: row => row.actionedAt == null ? "NA" : moment(row.actionedAt).format("DD/MM/YYYY"),
          sortable: false
        },
        {
          name: "action",
          required: true,
          label: "Action",
          align: "center",
          field: "action",
          sortable: false
        }
      ]
    };
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("VerifyDevice", [
      "BIJLIPAY_SELF_ASSIGNMENT_TRACKER",
      "APPROVE_BIJLIPAY_SELF_ASSIGNMENT"
    ]),
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.BIJLIPAY_SELF_ASSIGNMENT_TRACKER({ pagination, filter })
        .then(res => {
          let responseData = res.data;
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = responseData.data.totalElements;
          this.paginationControl.page = responseData.data.number + 1;
          this.tableData = responseData.data.content;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    deviceRequest(exceptionDetails) {
      this.showRequestModal = !this.showRequestModal;
      this.propsLostAppend = exceptionDetails;
      if(this.showRequestModal == false){
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filter
        });
      }
    },
    approveDeviceReques(request){
      let param ={
        selfAssignmentId:request.id,
        serialNumber:request.regionalInventory.serialNumber
      };
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to Approve the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing .."
        });
        this.APPROVE_BIJLIPAY_SELF_ASSIGNMENT(param)
          .then(() => {
            this.ajaxLoadAllLeadInfo({
              pagination: this.paginationControl,
              filter: this.filter
            });
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Approved Succesfully",
              icon: "clear"
            });
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      });
    }
  }
};
</script>
