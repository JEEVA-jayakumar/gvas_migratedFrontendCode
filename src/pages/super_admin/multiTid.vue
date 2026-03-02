<template>
  <q-page padding>
    <q-tabs
      v-model="selectedTab"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
    >
      <q-tab name="active" label="Active TID Configurations" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated keep-alive class="bg-transparent">
      <q-tab-panel name="active" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="getlsVasHostInstanceDetails"
          :columns="columns"
          row-key="id"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          color="purple-9"
          :loading="loading"
        >
          <template v-slot:top>
            <div class="full-width row items-center justify-between">
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  clearable
                  color="purple-9"
                  v-model="filterSearch"
                  placeholder="Search configurations..."
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
                  label="Add New Configuration"
                  color="purple-9"
                  icon="add"
                  @click="propShowAddNewConfigurarions = true"
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <AddNewConfigurarions
      v-if="propShowAddNewConfigurarions"
      :propShowAddNewConfigurarions="propShowAddNewConfigurarions"
      @emitfnshowAddConfiguration="propShowAddNewConfigurarions = false; ajaxLoadAllLeadInfo()"
    />
  </q-page>
</template>

<script>
import AddNewConfigurarions from "../../pages/super_admin/addMultiTidConfiguration.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "MultiTidManagement",
  components: {
    AddNewConfigurarions,
  },
  data() {
    return {
      selectedTab: "active",
      propShowAddNewConfigurarions: false,
      filterSearch: "",
      loading: false,
      paginationControl: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "institutionName",
          required: true,
          label: "Institution Name",
          align: "left",
          field: row => row.institution?.institutionName || "NA",
          sortable: true,
        },
        {
          name: "leadSource",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => row.leadSource?.sourceName || "NA",
          sortable: true,
        },
        {
          name: "masterHost",
          required: true,
          label: "Master Host",
          align: "left",
          field: row => row.masterHost?.name || "NA",
          sortable: true,
        },
        {
          name: "vas",
          required: true,
          label: "VAS",
          align: "left",
          field: row => row.vas?.name || "NA",
          sortable: true,
        }
      ],
    };
  },

  computed: {
    ...mapGetters("lsVasHostInstance", ["getlsVasHostInstanceDetails"])
  },

  created() {
    this.ajaxLoadAllLeadInfo();
  },

  methods: {
    ...mapActions("lsVasHostInstance", ["GET_LS_VAS_HOST_INSTANCE_DETAILS"]),

    ajaxLoadAllLeadInfo() {
      this.loading = true;
      this.GET_LS_VAS_HOST_INSTANCE_DETAILS()
        .finally(() => {
          this.loading = false;
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
