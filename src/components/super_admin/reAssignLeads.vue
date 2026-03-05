<template>
  <q-dialog
    v-model="toggleModal"
    maximized
    persistent
    class="customModalOverlay"
  >
    <q-card>
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :propLeadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <!--START: table title -->
      <div class="row items-center q-px-lg q-py-md text-weight-regular border-bottom text-grey-9">
        <div class="col text-h6">Lead Details</div>
        <div class="col-auto">
          <q-btn size="sm" round @click="emitToggleRemarks" outline color="dark" icon="clear" />
        </div>
      </div>
      <!--END: table title -->
      <!--START: table lead validation -->
      <div class="q-pa-md">
        <q-table
          title="Lead Validation"
          table-class="customTableClass"
          class="q-py-none"
          :rows="tableData"
          :columns="columns"
          selection="multiple"
          v-model:selected="formData.deletedSoLeadIds"
          v-model:filter="filter"
          v-model:pagination="paginationControl"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ $moment(props.row.createdAt).format("Do MMM Y") }}
            </q-td>
          </template>

          <template v-slot:body-cell-lead_id="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
              <span
                class="label"
                :class="[props.row.priority?'text-negative text-weight-bolder':'text-primary']"
              ># {{props.row.leadNumber}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-merchantName="props">
            <q-td :props="props">
              <span class="capitalize">{{props.row.leadName}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-state="props">
            <q-td :props="props">
              <span class="capitalize">{{props.row.state}}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-finance_approval="props">
            <q-td :props="props">
              <span
                class="label text-positive"
                v-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_SUCCESS"
              >Approved</span>
              <span
                class="label text-negative"
                v-else-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_PENDING"
              >Pending</span>
              <span
                class="label text-negative"
                v-else-if="props.row.verifiedFinanceStatus == $VERIFIED_FINANCE_STATUS_REJECT"
              >Rejected</span>
              <span class="label" v-else>NA</span>
            </q-td>
          </template>

          <template v-slot:top="props">
            <div class="row full-width items-center q-col-gutter-sm">
              <div class="col-12 col-lg-5">
                <q-input
                  clearable
                  dense
                  color="grey-9"
                  v-model="filter"
                  placeholder="Type.."
                  label="Search by SO name, Merchant Name, Lead ID"
                />
              </div>
              <div class="col-12 col-lg-5">
                <q-select
                  dense
                  v-model="formData.reassignToNewSo"
                  label="Choose a user from below"
                  :options="dropDown.regionwiseUsers"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-lg-2" align="right">
                <q-btn icon="check" color="positive" label="Assign" @click="fnAssign" dense />
              </div>
            </div>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../generalLeadInformation.vue";
import _ from "lodash";

export default {
  name: "reAssignLeads",
  props: ["propRowDetails", "propToggleModal"],
  components: {
    generalLeadInformation
  },
  data() {
    return {
      toggleModal: this.propToggleModal,
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filter: "",
      paginationControl: {
        rowsPerPage: 6,
        page: 1
      },
      formData: {
        deletedSoLeadIds: [],
        reassignToNewSo: ""
      },
      dropDown: {
        regionwiseUsers: []
      },
      columns: [
        { name: "createdAt", required: true, label: "Date(C)", align: "left", field: "createdAt", sortable: true },
        { name: "lead_id", required: true, label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
        { name: "merchantName", required: true, label: "Merchant Name", align: "left", field: "merchantName", sortable: true },
        { name: "state", required: true, label: "State", align: "left", field: "state", sortable: true },
        { name: "salesOfficerName", required: true, label: "SO Name", align: "left", field: row => row.assignedTo?.name || 'N/A', sortable: true },
        { name: "finance_approval", required: true, label: "Finance Approval", align: "left", field: row => row.verifiedFinanceStatus, sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      tableData: this.propRowDetails.leadsList
    };
  },
  created() {
    this.getRegionWiseUsers();
  },
  methods: {
    ...mapActions("AssignDeleteLeads", ["DELETE_ASSIGN_USER"]),
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    emitToggleRemarks() {
      this.$emit("closeLeadsList");
    },
    getRegionWiseUsers() {
      this.dropDown.regionwiseUsers = _.map(this.propRowDetails.regionwiseusers, oo => ({
        label: oo.name,
        value: oo.id
      }));
    },
    fnAssign() {
      if (this.formData.deletedSoLeadIds.length == 0) {
        this.$q.notify({ color: "negative", message: "Select atleast one item to assign" });
      } else if (this.formData.reassignToNewSo == "") {
        this.$q.notify({ color: "negative", message: "Please Choose User value!" });
      } else {
        let reAssigned = this.formData.deletedSoLeadIds.map(value => value.id);
        let postValues = {
          deletedSoLeadIds: reAssigned,
          reassignToNewSo: this.formData.reassignToNewSo
        };
        this.$q.loading.show({ message: "Assigning..." });
        this.DELETE_ASSIGN_USER(postValues)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", message: "Successfully assigned!" });
            location.reload();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({ color: "negative", message: error.data?.message || "Please try again" });
          });
      }
    }
  }
};
</script>
