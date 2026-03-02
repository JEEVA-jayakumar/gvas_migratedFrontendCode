<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-purple-9 col">LeadSource And Vas Device Config</div>
        <div class="col-auto">
          <q-btn
            unelevated
            no-caps
            label="Add New"
            color="purple-9"
            @click="fnaddLeadSourceVasDevice"
          />
        </div>
      </div>

      <q-tabs
        v-model="selectedTab"
        class="bg-white text-grey-7 shadow-1"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
      >
        <q-tab name="active" label="Active List" @click="ajaxLoadData" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated class="bg-transparent">
        <q-tab-panel name="active" class="no-padding q-mt-md">
          <q-table
            flat
            bordered
            :rows="activeTableData"
            :columns="columns"
            :filter="filterSearch"
            row-key="id"
            color="purple-9"
          >
            <template v-slot:top-right>
              <q-input
                outlined
                dense
                clearable
                v-model="filterSearch"
                placeholder="Search"
                color="purple-9"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-vas="props">
              <q-td :props="props">
                <div v-for="vas in props.row.vasList" :key="vas.id" class="q-mr-xs inline-block">
                  <q-badge color="purple-2" text-color="purple-9" :label="vas.name" />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  unelevated
                  no-caps
                  label="Modify"
                  icon="edit"
                  color="primary"
                  size="sm"
                  @click="fnEdit(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Modals -->
    <showAddLeadSOurceVasDevice
      v-if="propShowAddLeadSOurceVasDevice"
      :propShowAddLeadSOurceVasDevice="propShowAddLeadSOurceVasDevice"
      @emitAddLeadSOurceVasDevice="propShowAddLeadSOurceVasDevice = false; ajaxLoadData()"
    />

    <showEditLsVasDevice
      v-if="propShowEditLsVasDevice"
      :propShowEditLsVasDevice="propShowEditLsVasDevice"
      :propRowDetails="propRowDetails"
      @emitfnshowLsVasDevice="propShowEditLsVasDevice = false; ajaxLoadData()"
    />
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
    showEditLsVasDevice
  },
  data() {
    return {
      selectedTab: "active",
      propShowAddLeadSOurceVasDevice: false,
      propShowEditLsVasDevice: false,
      propRowDetails: null,
      filterSearch: "",
      activeTableData: [],
      columns: [
        {
          name: "device",
          label: "Device Name",
          align: "left",
          field: row => row.leadSourceDeviceVasMapping?.device?.deviceName || "NA",
          sortable: true
        },
        {
          name: "leadSource",
          label: "Lead Source",
          align: "left",
          field: row => row.leadSourceDeviceVasMapping?.leadSource?.sourceName || "NA",
          sortable: true
        },
        {
          name: "vas",
          label: "Vas",
          align: "left",
          field: row => row.vasList,
          sortable: false
        },
        {
          name: "action",
          label: "Action",
          align: "center"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("leadSourceVasDeviceConfig", ["getLsVasDeviceDetails"])
  },
  created() {
    this.ajaxLoadData();
  },
  methods: {
    ...mapActions("leadSourceVasDeviceConfig", ["GET_LS_VAS_DEVICE_CONFIG_DETAILS"]),

    async ajaxLoadData() {
      this.$q.loading.show({ message: "Please Wait" });
      try {
        await this.GET_LS_VAS_DEVICE_CONFIG_DETAILS();
        this.activeTableData = this.getLsVasDeviceDetails;
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: error.body?.message || "Please Try Again Later !",
          icon: "warning"
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    fnaddLeadSourceVasDevice() {
      this.propShowAddLeadSOurceVasDevice = true;
    },

    fnEdit(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditLsVasDevice = true;
    }
  }
};
</script>
