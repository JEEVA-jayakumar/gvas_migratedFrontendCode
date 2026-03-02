<template>
  <q-page padding>
    <q-tabs
      v-model="selectedTab"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
      @update:model-value="changeTabs"
    >
      <q-tab name="active" label="Active MDR" />
      <q-tab name="deactive" label="Deactivated MDR" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated keep-alive class="bg-transparent">
      <!-- ================= ACTIVE TAB ================= -->
      <q-tab-panel name="active" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="activetableData"
          :columns="columns"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          row-key="id"
          :loading="tableAjaxLoading"
          color="purple-9"
          @request="ajaxLoadAllLeadInfo"
        >
          <template v-slot:body-cell-leadSource="props">
            <q-td :props="props">
              <span class="text-purple-9 text-weight-medium">{{ props.row.leadSource?.sourceName }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                dense
                unelevated
                no-caps
                label="Modify"
                icon="edit"
                color="primary"
                @click="editMerchantDetails(props.row)"
              />
              <q-btn
                dense
                unelevated
                no-caps
                label="Disable"
                icon="block"
                color="negative"
                @click="fnDeleteMDR(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="full-width row items-center justify-between">
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  clearable
                  color="purple-9"
                  v-model="filterSearch"
                  placeholder="Search by Plan Name..."
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-auto">
                <q-btn
                  unelevated
                  no-caps
                  label="Add New MDR Charges"
                  color="purple-9"
                  icon="add"
                  @click="$router.push('/super/admin/manage/mdr/charges')"
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- ================= DEACTIVE TAB ================= -->
      <q-tab-panel name="deactive" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="deActivetableData"
          :columns="columnDataDisabled"
          table-class="customSATableClass"
          :filter="filterSearch1"
          v-model:pagination="paginationControl1"
          row-key="id"
          :loading="tableAjaxLoading1"
          color="purple-9"
          @request="ajaxLoadAllLeadInfo1"
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                dense
                unelevated
                no-caps
                label="Enable"
                icon="check_circle"
                color="positive"
                @click="fnEnableMDR(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="full-width row items-center">
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  clearable
                  color="purple-9"
                  v-model="filterSearch1"
                  placeholder="Search deactivated..."
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <EditMDRCharges
      v-if="propShoweditMerchantDetails"
      :propShoweditMerchantDetails="propShoweditMerchantDetails"
      :propRowDetails="propRowDetails"
      @emitfnshowEditMDR="propShoweditMerchantDetails = false; ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch })"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EditMDRCharges from "../../pages/super_admin/editMDRCharges.vue";
import _ from "lodash";

export default {
  name: "MDRChargesList",
  components: {
    EditMDRCharges
  },
  data() {
    return {
      selectedTab: "active",
      propShoweditMerchantDetails: false,
      propRowDetails: null,
      filterSearch: "",
      filterSearch1: "",
      activetableData: [],
      deActivetableData: [],
      paginationControl: {
        rowsNumber: 0,
        page: 1,
        rowsPerPage: 10
      },
      paginationControl1: {
        rowsNumber: 0,
        page: 1,
        rowsPerPage: 10
      },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      columns: [
        { name: "mdrPlanName", label: "Plan Name", align: "left", field: "mdrPlanName", sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: row => row.leadSource?.sourceName, sortable: true },
        { name: "device", label: "Device Type", align: "left", field: row => row.device?.deviceName, sortable: true },
        { name: "marsDeviceModel", label: "Mars Model", align: "left", field: row => row.marsDeviceModel?.name, sortable: true },
        { name: "merchantCategory", label: "Merchant Category", align: "left", field: row => row.merchantCategory?.merchantCategoryName, sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ],
      columnDataDisabled: [
        { name: "mdrPlanName", label: "Plan Name", align: "left", field: "mdrPlanName", sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: row => row.leadSource?.sourceName, sortable: true },
        { name: "device", label: "Device Type", align: "left", field: row => row.device?.deviceName, sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ]
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

    changeTabs(tab) {
      if (tab === "active") {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      } else {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      }
    },

    editMerchantDetails(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShoweditMerchantDetails = true;
    },

    fnEnableMDR(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Enable this MDR plan?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        let payload = { ...row, active: true };
        this.ENABLE_OR_DISABLE_MDR_PLAN(payload).then(() => {
          this.$q.notify({ color: "positive", message: "Enabled successfully" });
          this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
          this.$q.loading.hide();
        });
      });
    },

    fnDeleteMDR(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Deactivate this MDR plan?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        let payload = { ...row, active: false };
        this.ENABLE_OR_DISABLE_MDR_PLAN(payload).then(() => {
          this.$q.notify({ color: "positive", message: "Deactivated successfully" });
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
          this.$q.loading.hide();
        });
      });
    },

    ajaxLoadAllLeadInfo(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      this.tableAjaxLoading = true;
      this.FETCH_ALL_MDR_PLAN_DETAILS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.activetableData = this.getAllMdrPlanDetails.content || [];
          this.paginationControl.rowsNumber = this.getAllMdrPlanDetails.totalElements;
          this.paginationControl.page = page;
          this.paginationControl.rowsPerPage = rowsPerPage;
          this.tableAjaxLoading = false;
        }).catch(() => { this.tableAjaxLoading = false; });
    },

    ajaxLoadAllLeadInfo1(props) {
      const { page, rowsPerPage } = props.pagination;
      this.tableAjaxLoading1 = true;
      this.FETCH_ALL_DEACTIVATED_MDR_PLAN_DETAILS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.deActivetableData = this.getMdrChargesDeactive.content || [];
          this.paginationControl1.rowsNumber = this.getMdrChargesDeactive.totalElements;
          this.paginationControl1.page = page;
          this.paginationControl1.rowsPerPage = rowsPerPage;
          this.tableAjaxLoading1 = false;
        }).catch(() => { this.tableAjaxLoading1 = false; });
    }
  }
};
</script>
