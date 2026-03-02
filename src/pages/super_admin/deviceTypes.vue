<template>
  <q-page padding>
    <q-table
      flat
      bordered
      title="Device Types"
      :rows="getAllDevicesInfo"
      :columns="columns"
      table-class="customSATableClass"
      :filter="filterSearch"
      v-model:pagination="paginationControl"
      :filter-method="myCustomSearchFilter"
      row-key="id"
      color="purple-9"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn
            dense
            unelevated
            no-caps
            label="Modify"
            icon="edit"
            color="primary"
            @click="fnShowEditDeviceTypes(props.row)"
          />
          <q-btn
            dense
            unelevated
            no-caps
            label="Disable"
            icon="block"
            color="negative"
            @click="fnDeleteDeviceType(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:top>
        <div class="full-width row items-center justify-between">
          <div class="text-h6 text-purple-9">Device Types</div>
          <div class="row q-gutter-sm items-center">
            <div class="col-auto">
              <q-input
                dense
                filled
                clearable
                color="purple-9"
                v-model="filterSearch"
                placeholder="Search device types..."
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
                @click="fnshowCreateDeviceType()"
              />
            </div>
          </div>
        </div>
      </template>
    </q-table>

    <!-- Modals -->
    <showCreateDeviceType
      v-if="propShowCreateDeviceTypes"
      :propShowCreateDeviceTypes="propShowCreateDeviceTypes"
      @emitfnshowDeviceTypes="propShowCreateDeviceTypes = false; ajaxLoadDataForDeviceTypeTable()"
      @emitfnForDeviceTypeTable="ajaxLoadDataForDeviceTypeTable"
    />

    <showEditDeviceType
      v-if="propShowEditDeviceTypes"
      :propShowEditDeviceTypes="propShowEditDeviceTypes"
      :propRowDetails="propRowDetails"
      @emitfnshowDeviceTypes="propShowEditDeviceTypes = false; ajaxLoadDataForDeviceTypeTable()"
      @emitfnForDeviceTypeTable="ajaxLoadDataForDeviceTypeTable"
    />
  </q-page>
</template>

<script>
import showCreateDeviceType from "../../components/super_admin/showCreateDeviceTypes.vue";
import showEditDeviceType from "../../components/super_admin/showEditDeviceTypes.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DeviceTypesManagement",
  components: {
    showCreateDeviceType,
    showEditDeviceType,
  },
  data() {
    return {
      propShowCreateDeviceTypes: false,
      propShowEditDeviceTypes: false,
      propRowDetails: null,
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "deviceType",
          required: true,
          label: "Device Type",
          align: "left",
          field: "deviceName",
          sortable: true,
        },
        {
          name: "action",
          required: true,
          label: "Actions",
          align: "center",
        },
      ],
    };
  },

  created() {
    this.ajaxLoadDataForDeviceTypeTable();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo"]),
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "DELETE_DEVICE_DATA"]),

    ajaxLoadDataForDeviceTypeTable() {
      this.$q.loading.show({ message: "Loading device types..." });
      this.FETCH_DEVICES_DATA().finally(() => {
        this.$q.loading.hide();
      });
    },

    fnshowCreateDeviceType() {
      this.propShowCreateDeviceTypes = true;
    },

    fnShowEditDeviceTypes(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditDeviceTypes = true;
    },

    fnDeleteDeviceType(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete this device type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Processing..." });
        this.DELETE_DEVICE_DATA(row.id)
          .then(() => {
            this.$q.notify({ color: "positive", message: "Successfully removed", icon: "thumb_up" });
            this.ajaxLoadDataForDeviceTypeTable();
          })
          .catch((err) => {
            this.$q.notify({ color: "negative", message: err.data?.message || "Operation failed" });
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      });
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    },
  },
};
</script>
