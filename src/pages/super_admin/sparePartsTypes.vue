<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="col-12 text-h6 q-my-lg text-weight-regular">Spare Parts Types</div>
      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" align="left">
        <q-tab color="dark" name="active" label="Active " />
        <q-tab color="dark" name="deactive" label="Deactive" />
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
            <template v-slot:body-cell-created_date="props">
              <q-td :props="props">
                {{ $moment(props.row.created_date).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updated_date="props">
              <q-td :props="props">
                {{ $moment(props.row.updated_date).format("Do MMM Y") }}
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
                    @click="fnShowEditSpareParts(props.row)"
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
                    @click="fnDeleteSpareParts(props.row)"
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
                  label="Add Spare Type"
                  @click="fnShowAddNewSpareParts()"
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
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            color="grey-9"
          >
            <template v-slot:body-cell-created_date="props">
              <q-td :props="props">
                {{ $moment(props.row.created_date).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updated_date="props">
              <q-td :props="props">
                {{ $moment(props.row.updated_date).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Active"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnShowActiveSpareparts(props.row)"
                    flat
                    class="text-positive"
                  ></q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:top>
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
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!--START: Show edit  Spare Parts -->
      <showEditSpareParts
        v-if="propShowEditSpareParts"
        :propShowEditSpareParts="propShowEditSpareParts"
        :propRowDetails="propRowDetails"
        @emitfnshowEditSpareParts ="fnShowEditSpareParts"
      />
      <!--END: Show edit  Spare Parts -->

       <!--START: Show Add Spare Parts -->
      <ShowAddSpareParts
        v-if="propShowAddSpareParts"
        :propShowAddSpareParts="propShowAddSpareParts"
        :propRowDetails="propRowDetails"
        @emitfnShowAddNewSpareParts="fnShowAddNewSpareParts"
      />
      <!--END: Show Add Spare Parts -->
    </div>
  </q-page>
</template>

<script>
import ShowAddSpareParts from "../../components/super_admin/ShowAddSpareParts.vue";
import showEditSpareParts from "../../components/super_admin/showEditSpareParts.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SparePartsTypesManagement",
   components: {
    ShowAddSpareParts,
    showEditSpareParts,
  },

  data() {
    return {
      selectedTab: 'active',
      propShowAddSpareParts: false,
      propShowEditSpareParts: false,
      propRowDetails: "",
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 10
      },
      columns: [
       { name: "id", required: true, label: "id", align: "left", field: "id", sortable: true },
       { name: "spare_parts_types", required: true, label: "spare_parts_types", align: "left", field: "spare_parts_types", sortable: false },
       { name: "created_date", required: true, label: "Created Date", align: "left", field: "created_date", sortable: true },
       { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
       { name: "is_active", required: true, label: "is_active", align: "left", field: "is_active", sortable: false },
       { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      columns1: [
       { name: "id", required: true, label: "id", align: "left", field: "id", sortable: true },
       { name: "spare_parts_types", required: true, label: "spare_parts_types", align: "left", field: "spare_parts_types", sortable: false },
       { name: "created_date", required: true, label: "Created Date", align: "left", field: "created_date", sortable: true },
       { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
       { name: "is_active", required: true, label: "is_active", align: "left", field: "is_active", sortable: false },
       { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      activeTableData: [],
      deActiveTableData: [],
    };
  },

  created() {
     this.ajaxSpareData();
  },

  computed: {
      ...mapGetters("sparePartsGetTypes", [
      "getsparePartsGetTypes",
    ]),
  },

  methods: {
    ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES","DELETE_SPARE_PARTS_TYPES","ACTIVE_SPARE_PARTS_TYPES"]),

     fnDeleteSpareParts(rowDetails) {
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
          this.DELETE_SPARE_PARTS_TYPES(rowDetails)
            .then(response => {
              this.ajaxSpareData();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully removed",
                icon: "thumb_up"
              });
            }).finally(() => {
              this.$q.loading.hide();
            });
        });
    },

    fnShowActiveSpareparts(rowDetails) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to Active?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({
            delay: 100,
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          let payload = { ...rowDetails, is_active: true };
          this.ACTIVE_SPARE_PARTS_TYPES(payload)
            .then(response => {
              this.ajaxSpareData();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully Activated",
                icon: "thumb_up"
              });
            }).finally(() => {
              this.$q.loading.hide();
            });
        });
    },
    ajaxSpareData(){
      this.$q.loading.show({ message: "Loading..." });
      this.FETCH_SPARE_PARTS_GET_TYPES()
      .then(() => {
          this.activeTableData = this.getsparePartsGetTypes.filter(service => service.is_active == true);
          this.deActiveTableData = this.getsparePartsGetTypes.filter(service => service.is_active == false);
      })
       .finally(() => {
          this.$q.loading.hide();
        });
    },
     fnShowAddNewSpareParts(rowDetails){
      this.propRowDetails = rowDetails;
      this.propShowAddSpareParts = !this.propShowAddSpareParts;
      if(!this.propShowAddSpareParts){
        this.ajaxSpareData()
      }
    },
    fnShowEditSpareParts(rowDetails){
      this.propRowDetails = rowDetails;
      this.propShowEditSpareParts = !this.propShowEditSpareParts;
      if(!this.propShowEditSpareParts){
        this.ajaxSpareData()
      }
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
