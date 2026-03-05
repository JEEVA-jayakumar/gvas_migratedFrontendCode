<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="col-12 q-title q-my-lg text-weight-regular">Spare Parts Types</div>
      <q-tabs
        v-model="tab"
        class="shadow-1"
        active-bg-color="grey-1"
        active-color="dark"
        indicator-color="transparent"
        align=""
      >
        <q-tab name="active" label="Active " />
        <q-tab name="deactive" label="Deactive" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-transparent">
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
                {{ props.row.created_date | moment("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updated_date="props">
              <q-td :props="props">
                {{ props.row.updated_date | moment("Do MMM Y") }}
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
              <div class="col-6">
                <q-input
                  clearable
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
              <div class="col-6" align="side">
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
                {{ props.row.created_date | moment("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updated_date="props">
              <q-td :props="props">
                {{ props.row.updated_date | moment("Do MMM Y") }}
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

      <!-- Modals -->
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
import { useVuelidate } from "@vuelidate/core";
import ShowAddSpareParts from "../../components/super_admin/ShowAddSpareParts.vue";
import showEditSpareParts from "../../components/super_admin/showEditSpareParts.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  setup() { return { v$: useVuelidate() } },
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
      propRowDetails: "",
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 10
      },
      columns: [
        { name: "id", required: true, label: "id", align: "", field: "id", sortable: true },
        { name: "spare_parts_types", required: true, label: "spare_parts_types", align: "", field: "spare_parts_types", sortable: false },
        { name: "created_date", required: true, label: "Created Date", align: "", field: "created_date", sortable: true },
        { name: "updated_date", required: true, label: "Updated Date", align: "", field: "updated_date", sortable: true },
        { name: "is_active", required: true, label: "is_active", align: "", field: "is_active", sortable: false },
        { name: "action", required: true, label: "", align: "", field: "action", sortable: false }
      ],
      columns1: [
        { name: "id", required: true, label: "id", align: "", field: "id", sortable: true },
        { name: "spare_parts_types", required: true, label: "spare_parts_types", align: "", field: "spare_parts_types", sortable: false },
        { name: "created_date", required: true, label: "Created Date", align: "", field: "created_date", sortable: true },
        { name: "updated_date", required: true, label: "Updated Date", align: "", field: "updated_date", sortable: true },
        { name: "is_active", required: true, label: "is_active", align: "", field: "is_active", sortable: false },
        { name: "action", required: true, label: "", align: "", field: "action", sortable: false }
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

    fnDeleteSpareParts(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete spare type?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        });
        this.DELETE_SPARE_PARTS_TYPES(rowDetails)
          .then(response => {
            this.ajaxSpareData();
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully removed",
              icon: "thumb_up"
            });
          })
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
          spinnerColor: "purple-9"
        });
        let payload = { ...rowDetails, is_active: true };
        this.ACTIVE_SPARE_PARTS_TYPES(payload)
          .then(response => {
            this.ajaxSpareData();
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Activated",
              icon: "thumb_up"
            });
          })
      });
    },

    ajaxSpareData() {
      this.FETCH_SPARE_PARTS_GET_TYPES()
        .then(res => {
          this.activeTableData = this.getsparePartsGetTypes.filter(service => service.is_active == true);
          this.deActiveTableData = this.getsparePartsGetTypes.filter(service => service.is_active == false);
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    fnShowAddNewSpareParts() {
      this.propShowAddSpareParts = !this.propShowAddSpareParts;
      if (this.propShowAddSpareParts == false) {
        this.ajaxSpareData();
      }
    },

    fnShowEditSpareParts(rowDetails) {
      this.propShowEditSpareParts = !this.propShowEditSpareParts;
      this.propRowDetails = rowDetails;
      if (this.propShowEditSpareParts == false) {
        this.ajaxSpareData();
      }
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
