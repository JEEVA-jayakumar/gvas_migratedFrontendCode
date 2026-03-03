<template>
  <q-page>
    <!-- content -->
    <div>
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        align="left"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          color="dark"
          name="active"
          label="Active MDR"
        />
        <q-tab
          color="dark"
          name="deactive"
          label="Deactived MDR"
        />
      </q-tabs>
      <q-tab-panels v-model="selectedTab" animated keep-alive>
        <q-tab-panel name="active" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="activetableData"
            :columns="columns"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadSource="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadSource.sourceName)">
                <span class="label text-primary">{{ props.row.leadSource.sourceName }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnDeleteMDR(props.row)"
                    flat
                    class="text-negative"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-device="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.device.deviceName)">
                <span class="label text-primary">{{ props.row.device.deviceName }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.marsDeviceModel == null ? "NA" : props.row.marsDeviceModel.name }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-mdrPlanName="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.mdrPlanName == null ? "NA" : props.row.mdrPlanName }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-merchantCategory="props">
              <q-td :props="props">
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="editMerchantDetails(props.row)"
                  :label="props.row.merchantCategory ? props.row.merchantCategory.merchantCategoryName : 'NA'"
                  class="capitalize"
                />
              </q-td>
            </template>

            <template v-slot:top>
              <!--START: table filter,search -->
              <div class="col-md-12 group">
                <div class="row q-col-gutter-sm">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Plan Name"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-md-12 text-right">
                <q-btn
                  no-caps
                  class="text-weight-regular"
                  @click="$router.push('/super/admin/manage/mdr/charges')"
                  label="Add New Mdr Charges"
                  color="purple-9"
                  size="md"
                />
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
        <q-tab-panel name="deactive" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="deActivetableData"
            :columns="columnDataDisabled"
            table-class="customTableClass"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadSource="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.leadSource.sourceName)">
                <span class="label text-primary">{{ props.row.leadSource.sourceName }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Enable"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnEnableMDR(props.row)"
                    flat
                    class="text-positive"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-device="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row.device.deviceName)">
                <span class="label text-primary">{{ props.row.device.deviceName }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.marsDeviceModel == null ? "NA" : props.row.marsDeviceModel.name }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-mdrPlanName="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label">{{ props.row.mdrPlanName == null ? "NA" : props.row.mdrPlanName }}</span>
              </q-td>
            </template>

            <template v-slot:top>
              <!--START: table filter,search -->
              <div class="col-md-12 group">
                <div class="row q-col-gutter-sm">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch1"
                      placeholder="Type.."
                      label="Search by Plan Name"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tab-panels>
      <div class="row items-center gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center"></div>
        </div>
      </div>
      <EditMDRCharges
        v-if="propShoweditMerchantDetails"
        :propShoweditMerchantDetails="propShoweditMerchantDetails"
        :propRowDetails="propRowDetails"
        @emitfnshowEditMDR="editMerchantDetails"
      ></EditMDRCharges>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EditMDRCharges from "../../pages/super_admin/editMDRCharges.vue";

export default {
  name: "MdrChargesList",
  components: {
    EditMDRCharges
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      propShoweditMerchantDetails: false,
      propRowDetails: "",
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "active",
      activetableData: [],
      deActivetableData: [],
      columns: [
        { name: "mdrPlanName", label: "Mdr Plan Name", align: "left", field: "mdrPlanName", sortable: true },
        { name: "merchantCategory", label: "Selected Merchant Category", align: "left", field: row => row.merchantCategory ? row.merchantCategory.merchantCategoryName : 'NA', sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: row => row.leadSource ? row.leadSource.sourceName : 'NA', sortable: true },
        { name: "device", label: "Device Type", align: "left", field: row => row.device ? row.device.deviceName : 'NA', sortable: true },
        { name: "marsDeviceModel", label: "Mars Device Model", align: "left", field: row => row.marsDeviceModel ? row.marsDeviceModel.name : 'NA', sortable: true },
        { name: "debitLessthanAmount", label: "Debit Less Amount", align: "left", field: "debitLessthanAmount", sortable: true },
        { name: "debitGreaterthanAmount", label: "Debit Greater Amount", align: "left", field: "debitGreaterthanAmount", sortable: true },
        { name: "stdCC", label: "stdCC", align: "left", field: "stdCC", sortable: true },
        { name: "premiumCC", label: "premiumCC", align: "left", field: "premiumCC", sortable: true },
        { name: "corpCC", label: "corpCC", align: "left", field: "corpCC", sortable: true },
        { name: "intlCC", label: "intlCC", align: "left", field: "intlCC", sortable: true },
        { name: "superPremiumlCC", label: "superPremiumlCC", align: "left", field: "superPremiumlCC", sortable: true },
        { name: "amexDomestic", label: "Amex Domestic", align: "left", field: "amexDomestic", sortable: true },
        { name: "amexInternational", label: "Amex International", align: "left", field: "amexInternational", sortable: true },
        { name: "upiDebitCardUpTo2000", label: "UPI Debit Card UpTo 2000", align: "left", field: "upiDebitCardUpTo2000", sortable: true },
        { name: "upiDebitCardAbove2000", label: "UPI Debit Card Above 2000", align: "left", field: "upiDebitCardAbove2000", sortable: true },
        { name: "upiPrepaidCreditCardsUpTo2000", label: "UPI Prepaid Credit Cards UpTo 2000", align: "left", field: "upiPrepaidCreditCardsUpTo2000", sortable: true },
        { name: "upiPrepaidCreditCardsAbove2000", label: "UPI Prepaid Credit Cards Above 2000", align: "left", field: "upiPrepaidCreditCardsAbove2000", sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ],
      columnDataDisabled: [
        { name: "mdrPlanName", label: "Mdr Plan Name", align: "left", field: "mdrPlanName", sortable: true },
        { name: "merchantCategory", label: "Selected Merchant Category", align: "left", field: row => row.merchantCategory ? row.merchantCategory.merchantCategoryName : 'NA', sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: row => row.leadSource ? row.leadSource.sourceName : 'NA', sortable: true },
        { name: "device", label: "Device Type", align: "left", field: row => row.device ? row.device.deviceName : 'NA', sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ],
      paginationControl: { rowsNumber: 10, page: 1, sortBy: "id", descending: false, rowsPerPage: 10 },
      paginationControl1: { rowsNumber: 10, page: 1, sortBy: "id", descending: false, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    };
  },

  computed: {
    ...mapGetters("mdrCharges", ["getAllMdrPlanDetails"]),
    ...mapGetters("mdrChargesDeactive", ["getMdrChargesDeactive"]),
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
  },
  methods: {
    ...mapActions("mdrCharges", ["FETCH_ALL_MDR_PLAN_DETAILS"]),
    ...mapActions("mdrChargesDeactive", ["FETCH_ALL_DEACTIVATED_MDR_PLAN_DETAILS"]),
    ...mapActions("CategoryBasedMdr", ["ENABLE_OR_DISABLE_MDR_PLAN"]),

    editMerchantDetails(rowDetails) {
      this.propShoweditMerchantDetails = !this.propShoweditMerchantDetails;
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails;
      } else {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      }
    },

    fnEnableMDR(request) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure, do you want to enable this MDR?",
        ok: "Continue", cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });
        let payload = { ...request, active: true };
        this.ENABLE_OR_DISABLE_MDR_PLAN(payload).then(() => {
          this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
          this.$q.notify({ color: "positive", message: "Successfully activated", icon: "thumb_up" });
        }).finally(() => { this.$q.loading.hide(); });
      });
    },
    fnDeleteMDR(request) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete MDR?",
        ok: "Continue", cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" });
        let payload = { ...request, active: false };
        this.ENABLE_OR_DISABLE_MDR_PLAN(payload).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
          this.$q.notify({ color: "positive", message: "Successfully deactivated", icon: "thumb_up" });
        }).finally(() => { this.$q.loading.hide(); });
      });
    },
    ajaxLoadAllLeadInfo1(props) {
      this.tableAjaxLoading1 = true;
      this.FETCH_ALL_DEACTIVATED_MDR_PLAN_DETAILS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.paginationControl1 = props.pagination;
          this.paginationControl1.rowsNumber = this.getMdrChargesDeactive.totalElements;
          this.deActivetableData = this.getMdrChargesDeactive.content || [];
          this.tableAjaxLoading1 = false;
        }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    ajaxLoadAllLeadInfo(props) {
      this.tableAjaxLoading = true;
      this.FETCH_ALL_MDR_PLAN_DETAILS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.paginationControl = props.pagination;
          this.paginationControl.rowsNumber = this.getAllMdrPlanDetails.totalElements;
          this.activetableData = this.getAllMdrPlanDetails.content || [];
          this.tableAjaxLoading = false;
        }).catch(() => { this.tableAjaxLoading = false; });
    },

    goToUnassignedTab(tab) {
      if (tab == "deactive") {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      } else {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      }
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    }
  }
};
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}
</style>
