<template>
  <q-page>
    <!-- content -->
    <div>
      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="changeTabs">
        <q-tab color="dark" name="active" label="Active" />

        <q-tab-panels v-model="selectedTab" animated>
          <q-tab-panel name="active" class="no-padding">
            <q-table :rows="activeTableData" table-class="customSATableClass" :columns="columns" :filter="filterSearch"
              v-model:pagination="paginationControl" :filter-method="myCustomSearchFilter" row-key="id" color="grey-9"
              @request="ajaxLoadData">

              <template v-slot:body-cell-vas="props">
                <q-td :props="props">
                  <div class="row no-wrap group text-dark" v-for="vas in props.row.vasList" :key="vas.id">{{vas.name}}</div>
                </q-td>
              </template>
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn dense no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                      @click="fnEdit(props.row)" flat class="text-light-blue"></q-btn>
                  </div>
                </q-td>
              </template>
              <template v-slot:top>
                <div class="col-md-6">
                  <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.." class="q-mr-lg">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-12 text-right">
                  <q-btn no-caps class="text-weight-regular" @click="fnaddLeadSourceVasDevice()" label="Add New"
                    color="purple-9" size="md" />
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>

      <!--START: Show create Hierarchy -->
      <showAddLeadSOurceVasDevice
      v-if="propShowAddLeadSOurceVasDevice"
      :propShowAddLeadSOurceVasDevice="propShowAddLeadSOurceVasDevice"
        @emitAddLeadSOurceVasDevice="propShowAddLeadSOurceVasDevice = false; ajaxLoadData()" />
      <!--END: Show create Hierarchy -->

      <!--START: Show edit LeadSources -->
      <showEditLsVasDevice v-if="propShowEditLsVasDevice" :propShowEditLsVasDevice="propShowEditLsVasDevice"
        :propRowDetails="propRowDetails" @emitfnshowLsVasDevice="refreshLeadSourceList"></showEditLsVasDevice>
      <!--END: Show edit LeadSources -->
    </div>
  </q-page>
</template>

<script>
import showAddLeadSOurceVasDevice from "./AddLeadSOurceVasDevice.vue";
import showEditLsVasDevice from "./leadSourceVasDeviceModify.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LeadSourceVasDeviceConfig",
  components: {
    showAddLeadSOurceVasDevice,
    showEditLsVasDevice,
  },
  data() {
    return {
      propShowAddLeadSOurceVasDevice: false,
      propShowEditLsVasDevice: false,
      propRowDetails: "",

      filterSearch: "",
      selectedTab: "active",

      paginationControl: {
        rowsPerPage: 10,
      },

      columns: [
        {
          name: "device",
          required: true,
          label: "Device Name",
          align: "left",
          field: row => row.leadSourceDeviceVasMapping?.device?.deviceName || "NA",
          sortable: false,
        },
        {
          name: "leadSource",
          required: true,
          label: "LeadSource",
          align: "left",
          field: row => row.leadSourceDeviceVasMapping?.leadSource?.sourceName || "NA",
          sortable: false,
        },
        {
          name: "vas",
          required: true,
          label: "Vas",
          align: "left",
          field: "vasList",
          sortable: false,
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: true
        }
      ],
      activeTableData: [],
    };
  },

  computed: {
    ...mapGetters("leadSourceVasDeviceConfig", ["getLsVasDeviceDetails"])
  },

  methods: {
    ...mapActions("leadSourceVasDeviceConfig", ["GET_LS_VAS_DEVICE_CONFIG_DETAILS"]),

    fnaddLeadSourceVasDevice() {
      this.propShowAddLeadSOurceVasDevice = true;
    },
    fnEdit(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditLsVasDevice = true;
    },
    refreshLeadSourceList() {
      this.propShowEditLsVasDevice = false;
      this.ajaxLoadData();
    },

    changeTabs() {
      this.ajaxLoadData();
    },

    ajaxLoadData() {
      this.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
      });
      this.GET_LS_VAS_DEVICE_CONFIG_DETAILS()
        .then(() => {
          this.activeTableData = this.getLsVasDeviceDetails;
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.data?.message || "Please Try Again Later !",
            icon: "thumb_down",
          });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(
          col =>
            (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
        )
      );
    },
  },

  created() {
    this.ajaxLoadData();
  },
};
</script>

<style>

</style>
