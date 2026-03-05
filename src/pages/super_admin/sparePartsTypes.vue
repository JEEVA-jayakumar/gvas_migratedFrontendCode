<template>
  <q-page>
    <div class="q-pa-md">
      <div class="col-12 text-h6 q-my-lg text-weight-regular">Spare Parts Types</div>
      <q-tabs
        v-model="tab"
        class="bg-white text-grey-7 shadow-1"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
      >
        <q-tab name="active" label="Active" />
        <q-tab name="deactive" label="Deactive" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated keep-alive class="bg-transparent">
        <q-tab-panel name="active" class="no-padding q-mt-md">
          <q-table
            :rows="activeTableData"
            table-class="customSATableClass"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            color="grey-9"
            flat
            bordered
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
                    size="sm"
                    @click="fnShowEditSpareParts(props.row)"
                    flat
                    class="text-light-blue q-mr-sm"
                  />
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="sm"
                    @click="fnDeleteSpareParts(props.row)"
                    flat
                    class="text-negative"
                  />
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-6">
                <q-input
                  clearable
                  dense
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
                  label="Search"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-6" align="right">
                <q-btn
                  no-caps
                  class="text-weight-regular"
                  label="Add Spare Type"
                  @click="fnShowAddNewSpareParts()"
                  color="purple-9"
                  icon="add"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="deactive" class="no-padding q-mt-md">
          <q-table
            :rows="deActiveTableData"
            table-class="customSATableClass"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            color="grey-9"
            flat
            bordered
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
                    icon="far fa-check-square"
                    size="sm"
                    @click="fnShowActiveSpareparts(props.row)"
                    flat
                    class="text-positive"
                  />
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-12">
                <q-input
                  clearable
                  dense
                  color="grey-9"
                  v-model="filterSearch"
                  placeholder="Type.."
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

      <showEditSpareParts
        v-if="propShowEditSpareParts"
        :propShowEditSpareParts="propShowEditSpareParts"
        :propRowDetails="propRowDetails"
        @emitfnshowEditSpareParts="fnShowEditSpareParts"
      />

      <ShowAddSpareParts
        v-if="propShowAddSpareParts"
        :propShowAddSpareParts="propShowAddSpareParts"
        @emitfnShowAddNewSpareParts="fnShowAddNewSpareParts"
      />
    </div>
  </q-page>
</template>

<script>
import ShowAddSpareParts from "../../components/super_admin/ShowAddSpareParts.vue";
import showEditSpareParts from "../../components/super_admin/showEditSpareParts.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SparePartsTypes",
  components: {
    ShowAddSpareParts,
    showEditSpareParts,
  },
  data() {
    return {
      tab: 'active',
      propShowAddSpareParts: false,
      propShowEditSpareParts: false,
      propRowDetails: null,
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
      activeTableData: [],
      deActiveTableData: [],
    };
  },
  created() {
    this.ajaxSpareData();
  },
  watch: {
    tab() {
        this.ajaxSpareData();
    }
  },
  computed: {
    ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"]),
  },
  methods: {
    ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES", "DELETE_SPARE_PARTS_TYPES", "ACTIVE_SPARE_PARTS_TYPES"]),

    fnDeleteSpareParts(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete spare type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_SPARE_PARTS_TYPES(rowDetails)
          .then(() => {
            this.ajaxSpareData();
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", message: "Successfully removed" });
          }).catch(() => { this.$q.loading.hide(); });
      });
    },

    fnShowActiveSpareparts(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to Active?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        let payload = { ...rowDetails, is_active: true };
        this.ACTIVE_SPARE_PARTS_TYPES(payload)
          .then(() => {
            this.ajaxSpareData();
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", message: "Successfully Activated" });
          }).catch(() => { this.$q.loading.hide(); });
      });
    },

    ajaxSpareData() {
      this.$q.loading.show({ message: "Loading..." });
      this.FETCH_SPARE_PARTS_GET_TYPES()
        .then(() => {
          this.activeTableData = this.getsparePartsGetTypes.filter(service => service.is_active === true);
          this.deActiveTableData = this.getsparePartsGetTypes.filter(service => service.is_active === false);
          this.$q.loading.hide();
        }).catch(() => { this.$q.loading.hide(); });
    },

    fnShowAddNewSpareParts() {
      this.propShowAddSpareParts = true;
    },

    fnShowEditSpareParts(rowDetails) {
        if (this.propShowEditSpareParts) {
             this.propShowEditSpareParts = false;
             this.ajaxSpareData();
        } else {
             this.propRowDetails = rowDetails;
             this.propShowEditSpareParts = true;
        }
    },

    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1)
      );
    }
  }
};
</script>
