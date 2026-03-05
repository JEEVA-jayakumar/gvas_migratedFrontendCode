<template>
  <q-page>
    <div class="q-pa-md">
      <q-tabs
        v-model="tab"
        class="bg-white text-grey-7 shadow-1"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
      >
        <q-tab name="active" label="Active Aggregators" />
        <q-tab name="deactive" label="Deactive Aggregators" />
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
                    @click="fnShowEditAggregator(props.row)"
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
                    @click="fnDeleteAggregators(props.row)"
                    flat
                    class="text-negative"
                  />
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="row full-width items-center">
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
                    label="Add New Aggregators"
                    @click="fnShowAddNewAggregators()"
                    color="purple-9"
                    size="md"
                    icon="add"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="deactive" class="no-padding q-mt-md">
          <q-table
            :rows="deActiveTableData"
            table-class="customSATableClass"
            :columns="columns1"
            :filter="filterSearch"
            v-model:pagination="paginationControl1"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            color="grey-9"
            flat
            bordered
          >
            <template v-slot:body-cell-action1="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Active"
                    icon="far fa-plus-square"
                    size="sm"
                    @click="fnActivate(props.row)"
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

      <showEditAggregator
        v-if="propShowEditAggregator"
        :propShowEditAggregator="propShowEditAggregator"
        :propRowDetails="propRowDetails"
        @emitfnShowEditAggregator="fnShowEditAggregator"
      />

      <ShowAddNewAggregators
        v-if="propShowAddNewAggregators"
        :propShowAddNewAggregators="propShowAddNewAggregators"
        @emitfnShowAddNewAggregators="fnShowAddNewAggregators"
      />
    </div>
  </q-page>
</template>

<script>
import showEditAggregator from "../../components/super_admin/showEditAggregator.vue";
import ShowAddNewAggregators from "../../components/super_admin/ShowAddNewAggregators.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Aggregators",
  components: {
    showEditAggregator,
    ShowAddNewAggregators,
  },
  data() {
    return {
      tab: 'active',
      propShowEditAggregator: false,
      propShowAddNewAggregators: false,
      propRowDetails: null,
      filterSearch: "",
      paginationControl: { rowsPerPage: 10 },
      paginationControl1: { rowsPerPage: 10 },
      columns: [
        { name: "name", required: true, label: "Aggregator", align: "left", field: "name", sortable: true },
        { name: "action", required: true, label: "", align: "left", sortable: false }
      ],
      columns1: [
        { name: "name", required: true, label: "Aggregator", align: "left", field: "name", sortable: true },
        { name: "action1", required: true, label: "", align: "left", sortable: false }
      ],
      activeTableData: [],
      deActiveTableData: [],
    };
  },
  created() {
    this.ajaxLoadData();
  },
  watch: {
      tab() {
          this.ajaxLoadData();
      }
  },
  computed: {
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList"]),
  },
  methods: {
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "DELETE_CREATED_AGGREGATORS", "EDIT_CREATED_AGGREGATORS"]),
    ajaxLoadData() {
      this.$q.loading.show({ message: "Loading..." });
      this.GET_CREATED_AGGREGATORS_LIST()
        .then(() => {
          this.activeTableData = this.getCreatedAggregatorList.filter(a => a.active === true);
          this.deActiveTableData = this.getCreatedAggregatorList.filter(a => a.active === false);
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    fnActivate(request) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to active?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        let payload = { ...request, active: true };
        this.EDIT_CREATED_AGGREGATORS(payload)
          .then(() => {
            this.$q.notify({ color: "positive", message: "Successfully Activated" });
            this.ajaxLoadData();
          })
          .catch(() => {
            this.$q.notify({ color: "negative", message: "Please try again!" });
            this.$q.loading.hide();
          });
      });
    },
    fnDeleteAggregators(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete aggregator?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_CREATED_AGGREGATORS(rowDetails)
          .then(() => {
            this.$q.notify({ color: "positive", message: "Successfully removed" });
            this.ajaxLoadData();
          })
          .catch(() => {
            this.$q.notify({ color: "negative", message: "Please try again!" });
            this.$q.loading.hide();
          });
      });
    },
    fnShowAddNewAggregators(token) {
        if (token === 'refresh') {
            this.propShowAddNewAggregators = false;
            this.ajaxLoadData();
        } else {
            this.propShowAddNewAggregators = !this.propShowAddNewAggregators;
        }
    },
    fnShowEditAggregator(rowDetails, token) {
        if (token === 'refresh') {
            this.propShowEditAggregator = false;
            this.ajaxLoadData();
        } else {
            this.propRowDetails = rowDetails;
            this.propShowEditAggregator = !this.propShowEditAggregator;
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
