<template>
  <q-page padding>
    <q-tabs
      v-model="selectedTab"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
      @update:model-value="goToUnassignedTab"
    >
      <q-tab name="active" label="Active Rental Charges" />
      <q-tab name="deactive" label="Deactivated Rental Charges" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated keep-alive class="bg-transparent">
      <!-- ================= ACTIVE TAB ================= -->
      <q-tab-panel name="active" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="tableData"
          :columns="columns"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          row-key="id"
          :loading="toggleAjaxLoadFilter"
          color="purple-9"
          @request="ajaxLoadAllLeadInfo"
        >
          <template v-slot:body-cell-plan="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                icon="edit"
                @click="editPlanDetails(props.row)"
                :label="props.row.plan?.planName"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                dense
                unelevated
                no-caps
                label="Disable"
                icon="block"
                color="negative"
                @click="fnDeleteRental(props.row)"
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
                  label="Add New Rental Charges"
                  color="purple-9"
                  icon="add"
                  @click="$router.push('/super/admin/manage/rental/charges')"
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
          :rows="deactiveTableData"
          :columns="columnsDeactive"
          table-class="customSATableClass"
          :filter="filterSearch1"
          v-model:pagination="paginationControl1"
          row-key="id"
          :loading="toggleAjaxLoadFilter1"
          color="purple-9"
          @request="ajaxLoadAllLeadInfo1"
        >
          <template v-slot:body-cell-action1="props">
            <q-td :props="props">
              <q-btn
                dense
                unelevated
                no-caps
                label="Enable"
                icon="check_circle"
                color="positive"
                @click="fnEnableRental(props.row)"
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
                  placeholder="Search by Plan Name..."
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

    <EditRentalCharges
      v-if="propShoweditPlanDetails"
      :propShoweditPlanDetails="propShoweditPlanDetails"
      :propRowDetails="propRowDetails"
      @emitfnshowEditRental="propShoweditPlanDetails = false; goToUnassignedTab(selectedTab)"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EditRentalCharges from "../../pages/super_admin/editRentalCharges.vue";
import _ from "lodash";

export default {
  name: "NewRentalChargesList",
  components: {
    EditRentalCharges
  },
  data() {
    return {
      selectedTab: "active",
      propShoweditPlanDetails: false,
      propRowDetails: null,
      filterSearch: "",
      filterSearch1: "",
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      tableData: [],
      deactiveTableData: [],
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
      columns: [
        { name: "plan", label: "Plan Name", align: "left", field: row => row.plan?.planName, sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: row => row.leadSource?.sourceName, sortable: true },
        { name: "device", label: "Device Type", align: "left", field: row => row.device?.deviceName, sortable: true },
        { name: "marsDeviceModel", label: "Mars Model", align: "left", field: row => row.marsDeviceModel?.name, sortable: true },
        { name: "setupFees", label: "Setup Fee", align: "right", field: "setupFees", sortable: true },
        { name: "monthlyFees", label: "Recurring Fee", align: "right", field: "monthlyFees", sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ],
      columnsDeactive: [
        { name: "plan", label: "Plan Name", align: "left", field: row => row.plan?.planName, sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: row => row.leadSource?.sourceName, sortable: true },
        { name: "device", label: "Device Type", align: "left", field: row => row.device?.deviceName, sortable: true },
        { name: "setupFees", label: "Setup Fee", align: "right", field: "setupFees", sortable: true },
        { name: "monthlyFees", label: "Recurring Fee", align: "right", field: "monthlyFees", sortable: true },
        { name: "action1", label: "Actions", align: "center" }
      ]
    };
  },

  computed: {
    ...mapGetters("rentalCharges", ["getAllRentalPlanDetails", "getDeactivatedRentalPlanDetails"])
  },

  created() {
    this.goToUnassignedTab("active");
  },

  methods: {
    ...mapActions("rentalCharges", [
      "FETCH_ALL_RENTAL_PLAN_DETAILS",
      "FETCH_DEACTIVATED_RENTAL_PLAN_DETAILS"
    ]),
    ...mapActions("categoryBasedRental", ["ENABLE_OR_DISABLE_RENTAL_PLAN"]),

    goToUnassignedTab(tab) {
      if (tab === "deactive") {
        this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: this.filterSearch1 });
      } else {
        this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
      }
    },

    ajaxLoadAllLeadInfo(props) {
      const { page, rowsPerPage } = props.pagination;
      this.toggleAjaxLoadFilter = true;
      this.FETCH_ALL_RENTAL_PLAN_DETAILS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.tableData = this.getAllRentalPlanDetails.content || [];
          this.paginationControl.rowsNumber = this.getAllRentalPlanDetails.totalElements;
          this.paginationControl.page = page;
          this.paginationControl.rowsPerPage = rowsPerPage;
          this.toggleAjaxLoadFilter = false;
        }).catch(() => { this.toggleAjaxLoadFilter = false; });
    },

    ajaxLoadAllLeadInfo1(props) {
      const { page, rowsPerPage } = props.pagination;
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_DEACTIVATED_RENTAL_PLAN_DETAILS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.deactiveTableData = this.getDeactivatedRentalPlanDetails.content || [];
          this.paginationControl1.rowsNumber = this.getDeactivatedRentalPlanDetails.totalElements;
          this.paginationControl1.page = page;
          this.paginationControl1.rowsPerPage = rowsPerPage;
          this.toggleAjaxLoadFilter1 = false;
        }).catch(() => { this.toggleAjaxLoadFilter1 = false; });
    },

    editPlanDetails(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShoweditPlanDetails = true;
    },

    fnEnableRental(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Enable this rental plan?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        let payload = { ...row, active: true };
        this.ENABLE_OR_DISABLE_RENTAL_PLAN(payload).then(() => {
          this.$q.notify({ color: "positive", message: "Enabled successfully" });
          this.goToUnassignedTab("deactive");
          this.$q.loading.hide();
        });
      });
    },

    fnDeleteRental(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Deactivate this rental plan?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        let payload = { ...row, active: false };
        this.ENABLE_OR_DISABLE_RENTAL_PLAN(payload).then(() => {
          this.$q.notify({ color: "positive", message: "Deactivated successfully" });
          this.goToUnassignedTab("active");
          this.$q.loading.hide();
        });
      });
    }
  }
};
</script>
