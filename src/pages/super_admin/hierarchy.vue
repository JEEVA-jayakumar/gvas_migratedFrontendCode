<template>
  <q-page>
    <!-- content -->
    <div>
      <q-tabs v-model="selectedTab" class="shadow-1" active-color="purple-9" indicator-color="purple-9" align="justify" @update:model-value="changeTabs">
        <q-tab name="active" label="Active Hierarchy" />
        <q-tab name="deactive" label="Deactive Hierarchy" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="active" class="no-padding">
          <q-table :rows="activeTableData" table-class="customSATableClass" :columns="columns" :filter="filterSearch"
            v-model:pagination="paginationControl" :filter-method="myCustomSearchFilter" row-key="id" color="grey-9">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn dense no-caps no-wrap label="Disable" icon="far fa-plus-square" size="md"
                    @click="fnDisable(props.row)" flat class="text-light-blue">
                  </q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:top="props">
              <div class="col-md-6">
                 <q-input
                  clearable
                  dense
                  outlined
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  class="q-mr-lg"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6" align="right">
                <q-btn no-caps class="text-weight-regular" @click="fnshowCreateHierarchy"
                  label="Add New Hierarchy" color="purple-9" size="md" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="deactive" class="no-padding">
          <q-table :rows="deActiveTableData" table-class="customSATableClass" :columns="columns1"
            :filter="filterSearch1" v-model:pagination="paginationControl1" :filter-method="myCustomSearchFilter"
            row-key="id" color="grey-9">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn dense no-caps no-wrap label="Active" icon="far fa-plus-square" size="md"
                    @click="fnactive(props.row)" flat class="text-light-blue">
                  </q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:top="props">
              <div class="col-md-6">
                <q-input
                  clearable
                  dense
                  outlined
                  color="grey-9"
                  v-model="filterSearch1"
                  placeholder="Type.."
                  class="q-mr-lg"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!--START: Show create Hierarchy -->
      <showCreateHierarchy v-if="propShowCreateHierarchy"
        :propShowCreateHierarchy="propShowCreateHierarchy"
        @emitfnCreateHierarchyDetails="fnshowCreateHierarchy"
        @emitfnForHierarchyTable="ajaxLoadDataForHierarchyTable"
      />
      <!--END: Show create Hierarchy -->

      <!--START: Show edit Hierarchy -->
      <showEditHierarchy v-if="propShowEditHierarchy" :propShowEditHierarchy="propShowEditHierarchy"
        :propExistingHierarchyData="propRowDetails"
        @emitfnEditHierarchyDetails="fnShowEditHierarchy"
        @emitfnForHierarchyTable="ajaxLoadDataForHierarchyTable"
      />
      <!--END: Show edit Hierarchy -->
    </div>
  </q-page>
</template>

<script>
import showCreateHierarchy from "../../components/super_admin/showCreateHierarchy.vue";
import showEditHierarchy from "../../components/super_admin/ShowEditHierarchy.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "hierarchy",
  components: {
    showCreateHierarchy,
    showEditHierarchy,
  },
  data() {
    return {
      propShowCreateHierarchy: false,
      propShowEditHierarchy: false,
      propRowDetails: "",

      filterSearch: "",
      filterSearch1: "",
      selectedTab: "active",

      paginationControl: {
        rowsPerPage: 10,
      },
      paginationControl1: {
        rowsPerPage: 10,
      },

      //table information
      columns: [
        {
          name: "hierarchy",
          required: true,
          label: "Hierarchy",
          align: "left",
          field: "hierarchy",
          sortable: false,
        },
        {
          name: "hierarchyCode",
          required: true,
          label: "Hierarchy Code",
          align: "left",
          field: "hierarchyCode",
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
      columns1: [
        {
          name: "hierarchy",
          required: true,
          label: "Hierarchy",
          align: "left",
          field: "hierarchy",
          sortable: false,
        },
        {
          name: "hierarchyCode",
          required: true,
          label: "Hierarchy Code",
          align: "left",
          field: "hierarchyCode",
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
      tableData: [],
      activeTableData: [],
      deActiveTableData: [],
    };
  },

  computed: {
    ...mapGetters("SuperAdminUsers", ["getAllHierarchiesData"]),
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_HIERARCHIES_DATA",
      "DELETE_HIERARCHY_DATA",
      "ACTIVATE_HIERARCHY_DATA"
    ]),

    changeTabs(tab) {
      this.ajaxLoadDataForHierarchyTable();
    },

    fnDisable(reqData) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to de-active hierarchy?",
          ok: "Continue",
          cancel: "Cancel",
          persistent: true
        }).onOk(() => {
          this.$q.loading.show({
            message: "Please Wait",
            spinnerColor: "purple-9",
          });
          this.DELETE_HIERARCHY_DATA(reqData.id)
            .then(response => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: "Successfully deactivated",
                icon: "thumb_up"
              });
              this.ajaxLoadDataForHierarchyTable();
            })
            .catch(error => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "warning",
                position: "bottom",
                message: error.data?.message || "Please try again!",
                icon: "thumb_down"
              });
            });
        })
    },

    fnactive(reqData) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to Active hierarchy?",
          ok: "Continue",
          cancel: "Cancel",
          persistent: true
        }).onOk(() => {
          this.$q.loading.show({
            message: "Please Wait",
            spinnerColor: "purple-9",
          });
          this.ACTIVATE_HIERARCHY_DATA(reqData.id)
            .then(response => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully activated",
                icon: "thumb_up"
              });
              this.ajaxLoadDataForHierarchyTable();
            })
            .catch(error => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "warning",
                position: "bottom",
                message: error.data?.message || "Please try again!",
                icon: "thumb_down"
              });
            });
        })
    },

    fnshowCreateHierarchy() {
      this.propShowCreateHierarchy = !this.propShowCreateHierarchy;
    },

    fnShowEditHierarchy(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditHierarchy = !this.propShowEditHierarchy;
    },

    ajaxLoadDataForHierarchyTable() {
      this.$q.loading.show({
        delay: 100, // ms
        message: "Please Wait",
        spinnerColor: "purple-9",
      });
      this.FETCH_ALL_HIERARCHIES_DATA()
        .then(response => {
          this.tableData = this.getAllHierarchiesData;
          this.activeTableData = this.getAllHierarchiesData.filter(service => service.active == true);
          this.deActiveTableData = this.getAllHierarchiesData.filter(service => service.active == false);
          this.$q.loading.hide();
        })
        .catch((error) => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.data?.message || "Please Try Again Later !",
            icon: "thumb_down",
          });
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
    this.ajaxLoadDataForHierarchyTable();
  },
};
</script>

<style scoped>
.no-padding {
    padding: 0 !important;
}
</style>
