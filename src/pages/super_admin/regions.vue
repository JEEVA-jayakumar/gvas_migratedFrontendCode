<template>
  <q-page>
    <!-- content -->
    <div>

      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" align="left">
        <q-tab color="dark" name="active" label="Active Regions" />
        <q-tab color="dark" name="deactive" label="Deactive Regions" />
      </q-tabs>
      <q-tab-panels v-model="selectedTab" animated keep-alive>
        <q-tab-panel name="active" class="no-padding">
        <q-table
        :rows="activeTableData"
        table-class="customSATableClass"
        :columns="columns"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :filter-method="myCustomSearchFilter"
        row-key="id"
        color="grey-9"
      >
        <template v-slot:body-cell-regionGroup="props">
          <q-td :props="props">
            {{props.row.regionGroup ==null ? "NA" : props.row.regionGroup.regionName}}
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                no-caps
                no-wrap
                label="Modify"
                icon="far fa-plus-square"
                size="md"
                @click="fnShowEditRegions(props.row)"
                flat
                class="text-light-blue"
              ></q-btn>
              <q-btn
                dense
                no-caps
                no-wrap
                label="Disable"
                icon="far fa-minus-square"
                size="md"
                @click="fnDeleteRegion(props.row)"
                flat
                class="text-negative"
              ></q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:top>
          <!--START: table filter,search -->
          <div class="col-6">
            <q-input
              clearable
              color="grey-9"
              v-model="filterSearch"
              placeholder="Type.."
              class="q-mr-lg"
              label="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <!--END: table filter,search -->
           <div class="col-6" align="right">
                <q-btn
                  no-caps
                  class="text-weight-regular"
                  label="Add New Region"
                  @click="fnShowAddNewRegions()"
                  color="purple-9"
                  size="md"
                />
              </div>
        </template>
      </q-table>
        </q-tab-panel>
        <q-tab-panel name="deactive" class="no-padding">
        <q-table
        :rows="deActiveTableData"
        table-class="customSATableClass"
        :columns="columns1"
        :filter="filterSearch1"
        v-model:pagination="paginationControl1"
        :filter-method="myCustomSearchFilter"
        row-key="id"
        color="grey-9"
      >
        <template v-slot:body-cell-regionGroup="props">
          <q-td :props="props">
            {{props.row.regionGroup ==null ? "NA" : props.row.regionGroup.regionName}}
          </q-td>
        </template>
        <template v-slot:body-cell-action1="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                no-caps
                no-wrap
                label="Active"
                icon="far fa-minus-square"
                size="md"
                @click="fnActiveRegion(props.row)"
                flat
                class="text-positive"
              ></q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:top>
          <!--START: table filter,search -->
          <div class="col-6">
            <q-input
              clearable
              color="grey-9"
              v-model="filterSearch1"
              placeholder="Type.."
              class="q-mr-lg"
              label="Search"
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

     <!--START: Show create Regions -->
      <showCreateRegion
        v-if="propShowCreateRegions"
        :propShowCreateRegions="propShowCreateRegions"
        @emitfnshowRegions="fnshowCreateRegions"
        @emitfnForRegionTable="ajaxLoadDataForRegionTable"
      />
      <!--END: Show create Regions -->
      <!--START: Show edit Regions -->
      <showEditRegion
        v-if="propShowEditRegions"
        :propShowEditRegions="propShowEditRegions"
        :propRowDetails="propRowDetails"
        @emitfnshowRegions="fnShowEditRegions"
      />
      <!--END: Show edit Regions -->
       <!--START: Show edit Regions -->
      <ShowAddNewRegions
        v-if="propShowAddNewRegions"
        :propShowAddNewRegions="propShowAddNewRegions"
        :propRowDetails="propRowDetails"
        @emitfnShowAddNewRegions="fnShowAddNewRegions"
      />
      <!--END: Show edit Regions -->
    </div>
  </q-page>
</template>

<script>
import showCreateRegion from "../../components/super_admin/showCreateRegions.vue";
import showEditRegion from "../../components/super_admin/showEditRegions.vue";
import ShowAddNewRegions from "../../components/super_admin/ShowAddNewRegions.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RegionsManagement",
  components: {
    showCreateRegion,
    showEditRegion,
    ShowAddNewRegions
  },
  data() {
    return {
      selectedTab: "active",
      propShowCreateRegions: false,
      propShowEditRegions: false,
      propShowAddNewRegions: false,
      propRowDetails: "",

      filterSearch: "",
      filterSearch1: "",
      paginationControl: {
        rowsPerPage: 10
      },
      paginationControl1: {
        rowsPerPage: 10
      },
      columns: [
        {
          name: "regionGroup",
          required: true,
          label: "Region group",
          align: "left",
          field: row => row.regionGroup?.regionName,
          sortable: false
        },
        {
          name: "label",
          required: true,
          label: "Region",
          align: "left",
          field: "regionAreaName",
          sortable: false
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false
        }
      ],
       columns1: [
        {
          name: "regionGroup",
          required: true,
          label: "Region group",
          align: "left",
          field: row => row.regionGroup?.regionName,
          sortable: false
        },
        {
          name: "label",
          required: true,
          label: "Region",
          align: "left",
          field: "regionAreaName",
          sortable: false
        },
        {
          name: "action1",
          required: true,
          label: "",
          align: "left",
          field: "action1",
          sortable: false
        }
      ],
      activeTableData: [],
      deActiveTableData: [],
    };
  },

  created() {
    this.ajaxLoadDataForRegionTable();
  },

  computed: {
    ...mapGetters("SuperAdminUsers", [
      "getAllRegionsData1"
    ])
  },

  methods: {
    ...mapActions("SuperAdminUsers", [
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_ALL_REGIONS_DATA1",
      "DELETE_REGIONS_BY_REGIONS_ID_DATA"
    ]),
    ajaxLoadDataForRegionTable() {
      this.$q.loading.show({ message: "Loading regions..." });
      this.FETCH_ALL_REGIONS_DATA1()
      .then(() =>{
          this.activeTableData = this.getAllRegionsData1.filter(service => service.active == true);
          this.deActiveTableData = this.getAllRegionsData1.filter(service => service.active == false);
      })
      .finally(() => {
          this.$q.loading.hide();
      });
      this.FETCH_ALL_REGIONS_DATA();
    },
    fnActiveRegion(reqData){
      // Logic for activating region if available in service
    },
    fnshowCreateRegions() {
      this.propShowCreateRegions = !this.propShowCreateRegions;
      if (!this.propShowCreateRegions) this.ajaxLoadDataForRegionTable();
    },

    fnShowEditRegions(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditRegions = !this.propShowEditRegions;
      if (!this.propShowEditRegions) this.ajaxLoadDataForRegionTable();
    },
    fnShowAddNewRegions(rowDetails){
      this.propRowDetails = rowDetails;
      this.propShowAddNewRegions = !this.propShowAddNewRegions;
      if (!this.propShowAddNewRegions) this.ajaxLoadDataForRegionTable();
    },

    fnDeleteRegion(rowDetails) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to delete region?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({
            delay: 100,
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          this.DELETE_REGIONS_BY_REGIONS_ID_DATA(rowDetails)
            .then(response => {
              this.FETCH_ALL_REGIONS_DATA();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully removed",
                icon: "thumb_up"
              });
              this.ajaxLoadDataForRegionTable();
            })
            .catch(error => {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: "Please try again!",
                icon: "thumb_down"
              });
            }).finally(() => {
              this.$q.loading.hide();
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
    }
  }
};
</script>

<style>
</style>
