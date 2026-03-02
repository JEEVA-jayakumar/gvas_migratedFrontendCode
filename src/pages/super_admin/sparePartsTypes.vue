<template>
  <q-page padding>
    <q-tabs
      v-model="tab"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
      @update:model-value="ajaxSpareData"
    >
      <q-tab name="active" label="Active" />
      <q-tab name="deactive" label="Deactivated" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated keep-alive class="bg-transparent">
      <!-- ================= ACTIVE TAB ================= -->
      <q-tab-panel name="active" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="activeTableData"
          :columns="columns"
          row-key="id"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          color="purple-9"
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
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                dense
                unelevated
                no-caps
                label="Modify"
                icon="edit"
                color="primary"
                @click="fnShowEditSpareParts(props.row)"
              />
              <q-btn
                dense
                unelevated
                no-caps
                label="Disable"
                icon="block"
                color="negative"
                @click="fnDeleteSpareParts(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="full-width row items-center justify-between">
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  clearable
                  color="purple-9"
                  v-model="filterSearch"
                  placeholder="Search spare types..."
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
                  label="Add Spare Type"
                  color="purple-9"
                  icon="add"
                  @click="fnShowAddNewSpareParts()"
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- ================= DEACTIVE TAB ================= -->
      <q-tab-panel name="deactive" class="no-padding q-mt-md">
        <q-table
          flat
          bordered
          :rows="deActiveTableData"
          :columns="columns1"
          row-key="id"
          table-class="customSATableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          color="purple-9"
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
              <q-btn
                dense
                unelevated
                no-caps
                label="Activate"
                icon="check_circle"
                color="positive"
                @click="fnShowActiveSpareparts(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Modals -->
    <showEditSpareParts
      v-if="propShowEditSpareParts"
      :propShowEditSpareParts="propShowEditSpareParts"
      :propRowDetails="propRowDetails"
      @emitfnshowEditSpareParts="propShowEditSpareParts = false; ajaxSpareData()"
    />

    <ShowAddSpareParts
      v-if="propShowAddSpareParts"
      :propShowAddSpareParts="propShowAddSpareParts"
      @emitfnShowAddNewSpareParts="propShowAddSpareParts = false; ajaxSpareData()"
    />
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
      paginationControl: { rowsPerPage: 10 },
      columns: [
        { name: "id", required: true, label: "ID", align: "left", field: "id", sortable: true },
        { name: "spare_parts_types", required: true, label: "Spare Part Type", align: "left", field: "spare_parts_types", sortable: true },
        { name: "created_date", required: true, label: "Created Date", align: "left", field: "created_date", sortable: true },
        { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ],
      columns1: [
        { name: "id", required: true, label: "ID", align: "left", field: "id", sortable: true },
        { name: "spare_parts_types", required: true, label: "Spare Part Type", align: "left", field: "spare_parts_types", sortable: true },
        { name: "created_date", required: true, label: "Created Date", align: "left", field: "created_date", sortable: true },
        { name: "updated_date", required: true, label: "Updated Date", align: "left", field: "updated_date", sortable: true },
        { name: "action", label: "Actions", align: "center" }
      ],
      activeTableData: [],
      deActiveTableData: [],
    };
  },

  created() {
    this.ajaxSpareData();
  },

  computed: {
    ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"]),
  },

  methods: {
    ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES", "DELETE_SPARE_PARTS_TYPES", "ACTIVE_SPARE_PARTS_TYPES"]),

    ajaxSpareData() {
      this.$q.loading.show({ message: "Loading spare parts types..." });
      this.FETCH_SPARE_PARTS_GET_TYPES()
        .then(() => {
          this.activeTableData = this.getsparePartsGetTypes.filter(s => s.is_active === true);
          this.deActiveTableData = this.getsparePartsGetTypes.filter(s => s.is_active === false);
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", message: "Failed to load spare parts types" });
        });
    },

    fnShowAddNewSpareParts() {
      this.propShowAddSpareParts = true;
    },

    fnShowEditSpareParts(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditSpareParts = true;
    },

    fnDeleteSpareParts(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Deactivate this spare part type?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        this.DELETE_SPARE_PARTS_TYPES(row).then(() => {
          this.$q.notify({ color: "positive", message: "Deactivated successfully" });
          this.ajaxSpareData();
          this.$q.loading.hide();
        });
      });
    },

    fnShowActiveSpareparts(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Activate this spare part type?",
        ok: "Continue", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        let payload = { ...row, is_active: true };
        this.ACTIVE_SPARE_PARTS_TYPES(payload).then(() => {
          this.$q.notify({ color: "positive", message: "Activated successfully" });
          this.ajaxSpareData();
          this.$q.loading.hide();
        });
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
