<template>
  <q-page padding>
    <q-table
      flat
      bordered
      title="Existing M-ATM Plans"
      :rows="tableData"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="paginationControl"
      color="purple-9"
      @request="ajaxLoadAllLeadInfo"
    >
      <template v-slot:body-cell-active="props">
        <q-td :props="props">
          <q-badge :color="props.row.leadSourceId?.active ? 'positive' : 'negative'">
            {{ props.row.leadSourceId?.active ? 'Active' : 'De-activated' }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-lock="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            @click="props.row.leadSourceId?.active ? deactivateMatmUser(props.row.id) : activateMatmUser(props.row.id)"
            :icon="props.row.leadSourceId?.active ? 'lock_open' : 'lock'"
            :color="props.row.leadSourceId?.active ? 'positive' : 'negative'"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-planName="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            icon="edit"
            @click="editPlanDetails(props.row)"
            :label="props.row.planName"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete"
            @click="deletePlanDetails(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:top>
        <div class="full-width row items-center justify-between">
          <div class="text-h6 text-purple-9">Existing M-ATM Plans</div>
          <div class="row q-gutter-sm items-center">
            <div class="col-auto">
              <q-input
                dense
                filled
                clearable
                color="purple-9"
                v-model="filterSearch"
                placeholder="Search plan..."
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
                label="Add M-ATM Plan"
                color="purple-9"
                icon="add"
                @click="$router.push('/super/admin/manage/mATMplan')"
              />
            </div>
          </div>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ExistingMATMPlans",
  data() {
    return {
      loading: false,
      filterSearch: "",
      tableData: [],
      paginationControl: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      columns: [
        { name: "planName", label: "Plan Name", align: "left", field: "planName", sortable: true },
        { name: "sourceName", label: "Lead Source", align: "left", field: row => row.leadSourceId?.sourceName, sortable: true },
        { name: "deviceName", label: "Device Type", align: "left", field: row => row.deviceId?.deviceName, sortable: true },
        { name: "active", label: "Status", align: "center" },
        { name: "lock", label: "Lock/Unlock", align: "center" },
        { name: "delete", label: "Delete", align: "center" }
      ]
    };
  },

  computed: {
    ...mapGetters("getMatmDatas", ["getMatmDatas"]),
  },

  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
  },

  methods: {
    ...mapActions("getMatmDatas", ["FETCH_ALL_MATM_DATAS", "FETCH_ALL_MATM_PLAN_DETAILS"]),
    ...mapActions("deletePlanDetails", ["DELETE_PLAN_DETAILS_DATAS"]),
    ...mapActions("deactiveMatmUser", ["DEACTIVATE_MATM_USER_DETAILS"]),
    ...mapActions("activeMatmUser", ["ACTIVATE_MATM_USER_DETAILS"]),

    ajaxLoadAllLeadInfo(props) {
      this.loading = true;
      this.FETCH_ALL_MATM_DATAS({ pagination: props.pagination, filter: props.filter })
        .then(() => {
          this.tableData = this.getMatmDatas || [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    deactivateMatmUser(id) {
      this.$q.dialog({
        title: "Confirm",
        message: "Deactivate this user?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.DEACTIVATE_MATM_USER_DETAILS(id).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.$q.notify({ color: "positive", message: "Deactivated successfully" });
        });
      });
    },

    activateMatmUser(id) {
      this.$q.dialog({
        title: "Confirm",
        message: "Activate this user?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.ACTIVATE_MATM_USER_DETAILS(id).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.$q.notify({ color: "positive", message: "Activated successfully" });
        });
      });
    },

    deletePlanDetails(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete this plan?",
        ok: "Delete", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.DELETE_PLAN_DETAILS_DATAS({ Id: row.id }).then(() => {
          this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: "" });
          this.$q.notify({ color: "positive", message: "Plan deleted successfully" });
        });
      });
    },

    editPlanDetails(row) {
      this.$q.loading.show();
      this.FETCH_ALL_MATM_PLAN_DETAILS(row).then(() => {
        this.$q.loading.hide();
        this.$router.push({ name: "editMatmPlans", params: { id: row.id, data: row } });
      });
    }
  }
};
</script>
