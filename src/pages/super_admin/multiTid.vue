<template>
  <q-page>
    <!-- content -->
    <div>

      <q-tabs indicator-color="purple-9" v-model="selectedTab" class="shadow-1" active-color="purple-9" align="">
        <q-tab name="active" label="Active TID" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated class="bg-transparent">
        <q-tab-panel name="active" class="no-padding">
          <q-table
            :rows="getlsVasHostInstanceDetails"
            table-class="customSATableClass"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"

          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn  no-caps no-wrap label="Disable" icon="far fa-plus-square" size="md"
                    @click="fnDisable(props.row)" flat class="text-light-blue">
                  </q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-12 group">
                <div class="row">
                  <div class="col-md-6">
                    <q-input
                      clearable

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
              <div class="col-md-12" align="right">
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
import { useVuelidate } from "@vuelidate/core";
import AddNewConfigurarions from "../../pages/super_admin/addMultiTidConfiguration.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "MultiTid",
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

    fnaddnewConfigurarions(){
      this.propShowAddNewConfigurarions = !this.propShowAddNewConfigurarions;
      if (this.propShowAddNewConfigurarions == false) {
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
        .then(res => {
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    fnDisable(row) {
        // Implementation if needed
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
      );
    }
  },
};
</script>
