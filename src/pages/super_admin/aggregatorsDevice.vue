<template>
  <q-page padding>
    <q-tabs
      v-model="tab"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
    >
      <q-tab name="active" label="Active Aggregators Devices" />
      <q-tab name="deactive" label="Deactivated Aggregators Devices" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated keep-alive class="bg-transparent">
      <q-tab-panel name="active" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="activeTableData"
          :columns="columns"
          row-key="id"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          color="purple-9"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              {{ props.row.aggregator?.name || "NA" }}
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
                @click="fnShowEditAggregatorDevice(props.row)"
              />
              <q-btn
                dense
                unelevated
                no-caps
                label="Disable"
                icon="block"
                color="negative"
                @click="fnDeleteAggregatorsDevice(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="full-width row items-center justify-between">
              <div class="col-12 col-md-6">
                <q-input
                  dense
                  filled
                  clearable
                  color="purple-9"
                  v-model="filterSearch"
                  placeholder="Search aggregator devices..."
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
                  label="Add New Device"
                  color="purple-9"
                  icon="add"
                  @click="fnShowAddNewAggregatorsDevice()"
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="deactive" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="deActiveTableData"
          :columns="columns1"
          row-key="id"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          color="purple-9"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              {{ props.row.aggregator?.name || "NA" }}
            </q-td>
          </template>

          <template v-slot:body-cell-action1="props">
            <q-td :props="props">
              <q-btn
                dense
                unelevated
                no-caps
                label="Activate"
                icon="check_circle"
                color="positive"
                @click="fnActivate(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="full-width row items-center">
              <div class="col-12 col-md-6">
                <q-input
                  dense
                  filled
                  clearable
                  color="purple-9"
                  v-model="filterSearch"
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

    <!-- Modals -->
    <showEditAggregatorDevice
      v-if="propShowEditAggregatorDevice"
      :propShowEditAggregatorDevice="propShowEditAggregatorDevice"
      :propRowDetails="propRowDetails"
      @emitfnShowEditAggregatorDevice="propShowEditAggregatorDevice = false; ajaxLoadDataForRegionTable()"
    />

    <ShowAddNewAggregatorsDevice
      v-if="propShowAddNewAggregatorsDevice"
      :propShowAddNewAggregatorsDevice="propShowAddNewAggregatorsDevice"
      @emitfnShowAddNewAggregatorsDevice="propShowAddNewAggregatorsDevice = false; ajaxLoadDataForRegionTable()"
    />
  </q-page>
</template>

<script>
import showEditAggregatorDevice from "../../components/super_admin/showEditAggregatorDevice.vue";
import ShowAddNewAggregatorsDevice from "../../components/super_admin/ShowAddNewAggregatorsDevice.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AggregatorDeviceManagement",
  components: {
    showEditAggregatorDevice,
    ShowAddNewAggregatorsDevice,
  },
  data() {
    return {
      tab: 'active',
      propShowEditAggregatorDevice: false,
      propShowAddNewAggregatorsDevice: false,
      propRowDetails: null,
      filterSearch: "",
      paginationControl: { rowsPerPage: 10 },
      columns: [
        { name: "name", required: true, label: "Aggregator", align: "left", field: row => row.aggregator?.name, sortable: true },
        { name: "deviceName", required: true, label: "Device Name", align: "left", field: "deviceName", sortable: true },
        { name: "action", required: true, label: "Actions", align: "center" }
      ],
      columns1: [
        { name: "name", required: true, label: "Aggregator", align: "left", field: row => row.aggregator?.name, sortable: true },
        { name: "deviceName", required: true, label: "Device Name", align: "left", field: "deviceName", sortable: true },
        { name: "action1", required: true, label: "Actions", align: "center" }
      ],
      activeTableData: [],
      deActiveTableData: [],
    };
  },

  computed: {
    ...mapGetters("superAdminAggregatorsDevice", ["getCreatedAggregatorDeviceList"])
  },

  created() {
    this.ajaxLoadDataForRegionTable();
  },

  methods: {
    ...mapActions("superAdminAggregatorsDevice", ["GET_CREATED_AGGREGATORS_DEVICE_LIST", "DELETE_CREATED_AGGREGATORS_DEVICE_LIST", "EDIT_CREATED_AGGREGATORS_DEVICE_LIST"]),

    ajaxLoadDataForRegionTable() {
      this.$q.loading.show({ message: "Loading aggregator devices..." });
      this.GET_CREATED_AGGREGATORS_DEVICE_LIST()
        .then(() => {
          this.activeTableData = this.getCreatedAggregatorDeviceList.filter(d => d.active === true);
          this.deActiveTableData = this.getCreatedAggregatorDeviceList.filter(d => d.active === false);
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", message: "Failed to load devices" });
        });
    },

    fnShowAddNewAggregatorsDevice() {
      this.propShowAddNewAggregatorsDevice = true;
    },

    fnShowEditAggregatorDevice(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditAggregatorDevice = true;
    },

    fnActivate(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Activate this aggregator device?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        let payload = { ...row, active: true };
        this.EDIT_CREATED_AGGREGATORS_DEVICE_LIST(payload).then(() => {
          this.$q.notify({ color: "positive", message: "Activated successfully" });
          this.ajaxLoadDataForRegionTable();
          this.$q.loading.hide();
        });
      });
    },

    fnDeleteAggregatorsDevice(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Deactivate this aggregator device?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        this.DELETE_CREATED_AGGREGATORS_DEVICE_LIST(row).then(() => {
          this.$q.notify({ color: "positive", message: "Deactivated successfully" });
          this.ajaxLoadDataForRegionTable();
          this.$q.loading.hide();
        });
      });
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    }
  }
};
</script>
