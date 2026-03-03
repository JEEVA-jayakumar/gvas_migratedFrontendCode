<template>
  <q-page>
    <!-- content -->
    <div>

      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" align="left">
        <q-tab color="dark" name="active" label="Active TID" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated keep-alive>
        <q-tab-panel name="active" class="no-padding">
          <q-table :rows="getlsVasHostInstanceDetails" table-class="customSATableClass" :columns="columns" :filter="filterSearch"
            v-model:pagination="paginationControl" :filter-method="myCustomSearchFilter" row-key="id" color="grey-9"
            @request="ajaxLoadAllLeadInfo">

            <template v-slot:body-cell-institutionName="props">
              <q-td :props="props">
                {{ props.row.institution ? props.row.institution.institutionName : 'NA' }}
              </q-td>
            </template>
            <template v-slot:body-cell-leadSource="props">
              <q-td :props="props">
                {{ props.row.leadSource ? props.row.leadSource.sourceName : 'NA' }}
              </q-td>
            </template>
            <template v-slot:body-cell-masterHost="props">
              <q-td :props="props">
                {{ props.row.masterHost ? props.row.masterHost.name : 'NA' }}
              </q-td>
            </template>
            <template v-slot:body-cell-vas="props">
              <q-td :props="props">
                {{ props.row.vas ? props.row.vas.name : 'NA' }}
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-md-12 group">
                <div class="row">
                  <div class="col-md-6">
                    <q-input clearable color="grey-9" v-model.trim="filterSearch" placeholder="Type.."
                      label="Search by Plan Name">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-md-12 text-right">
                <q-btn no-caps class="text-weight-regular"
                @click="fnaddnewConfigurarions()"
                  label="Add New Configurations"
                  color="purple-9" size="md" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <AddNewConfigurarions
       v-if="propShowAddNewConfigurarions"
       :propShowAddNewConfigurarions="propShowAddNewConfigurarions"
      @emitfnshowAddConfiguration="fnaddnewConfigurarions">
       </AddNewConfigurarions>
    </div>
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
      propShowAddNewConfigurarions: false,
      selectedTab: "active",
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "institutionName",
          required: true,
          label: "Institution Name",
          align: "left",
          field: row => row.institution?.institutionName,
          sortable: false,
        },
        {
          name: "leadSource",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => row.leadSource?.sourceName,
          sortable: false,
        },
        {
          name: "masterHost",
          required: true,
          label: "Master Host",
          align: "left",
          field: row => row.masterHost?.name,
          sortable: false,
        },
        {
          name: "vas",
          required: true,
          label: "vas",
          align: "left",
          field: row => row.vas?.name,
          sortable: false,
        },
      ],
    };
  },

  computed: {
    ...mapGetters("lsVasHostInstance", ["getlsVasHostInstanceDetails"])
  },

  methods: {
    ...mapActions("lsVasHostInstance", ["GET_LS_VAS_HOST_INSTANCE_DETAILS"]),

    fnaddnewConfigurarions(){
      this.propShowAddNewConfigurarions= !this.propShowAddNewConfigurarions;
      if (!this.propShowAddNewConfigurarions) {
        this.ajaxLoadAllLeadInfo();
      }
    },

    ajaxLoadAllLeadInfo() {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.GET_LS_VAS_HOST_INSTANCE_DETAILS()
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
    }
  },

  created() {
    this.ajaxLoadAllLeadInfo();
  },
};
</script>

<style>
</style>
