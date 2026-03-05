<template>
  <q-page>
    <div class="q-pa-md">
      <q-tabs
        v-model="activeTab"
        class="bg-white text-grey-7 shadow-1"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
      >
        <q-tab name="tab-3" label="Active CS Sub Issue" />
        <q-tab name="tab-4" label="Deactive CS Sub Issue" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated keep-alive class="bg-transparent">
        <q-tab-panel name="tab-3" class="no-padding q-mt-md">
          <q-table
            :rows="ActivetableData"
            table-class="customSATableClass"
            :columns="columns1"
            :filter="filterSearch1"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter1"
            row-key="id"
            color="grey-9"
            flat
            bordered
          >
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updatedAt="props">
              <q-td :props="props">
                {{ $moment(props.row.updatedAt).format("Do MMM Y") }}
              </q-td>
            </template>

            <template v-slot:body-cell-action1="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Modify"
                    icon="far fa-plus-square"
                    size="sm"
                    @click="fnShowEditCsSubIssue(props.row)"
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
                    @click="fnDeleteCsSubIssue(props.row)"
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
                    v-model="filterSearch1"
                    placeholder="Search by Issue Name"
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
                    label="Add Sub Task"
                    @click="fnShowAddNewCsSubIssue()"
                    color="purple-9"
                    icon="add"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-4" class="no-padding q-mt-md">
          <q-table
            :rows="DeactivetableData"
            table-class="customSATableClass"
            :columns="columns4"
            :filter="filterSearch3"
            v-model:pagination="paginationControl2"
            :filter-method="myCustomSearchFilter2"
            row-key="id"
            color="grey-9"
            flat
            bordered
          >
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{ $moment(props.row.createdAt).format("Do MMM Y") }}
              </q-td>
            </template>
            <template v-slot:body-cell-updatedAt="props">
              <q-td :props="props">
                {{ $moment(props.row.updatedAt).format("Do MMM Y") }}
              </q-td>
            </template>

            <template v-slot:body-cell-action2="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Active"
                    icon="far fa-plus-square"
                    size="sm"
                    @click="fnShowActiveCsSubIssue(props.row)"
                    flat
                    class="text-light-blue"
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
                  v-model="filterSearch3"
                  placeholder="Search by Issue Name"
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

      <ShowEditCSSubIssue
        v-if="propShowEditCsSubIssue"
        :propShowEditCsSubIssue="propShowEditCsSubIssue"
        :propRowDetails1="propRowDetails1"
        @emitfnshowEditCsSubIssue="fnShowEditCsSubIssue"
      />

      <ShowAddCSSubIssue
        v-if="propShowAddCsSubIssue"
        :propShowAddCsSubIssue="propShowAddCsSubIssue"
        @emitfnShowAddNewCsSubIssue="fnShowAddNewCsSubIssue"
      />
    </div>
  </q-page>
</template>

<script>
import ShowEditCSSubIssue from "../../components/super_admin/ShowEditCSSubIssue.vue";
import ShowAddCSSubIssue from "../../components/super_admin/ShowAddCSSubIssue.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CsSubIssue",
  components: {
    ShowEditCSSubIssue,
    ShowAddCSSubIssue,
  },
  data() {
    return {
      activeTab: "tab-3",
      propShowEditCsSubIssue: false,
      propShowAddCsSubIssue: false,
      propRowDetails1: null,
      filterSearch1: "",
      filterSearch3: "",
      paginationControl: { rowsPerPage: 10 },
      paginationControl2: { rowsPerPage: 10 },
      columns1: [
        { name: "name", required: true, label: "Issue Name", align: "left", field: "name", sortable: true },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "createdAt", sortable: true },
        { name: "updatedAt", required: true, label: "Updated Date", align: "left", field: "updatedAt", sortable: true },
        { name: "action1", required: true, label: "", align: "left", field: "action1", sortable: false }
      ],
      columns4: [
        { name: "name", required: true, label: "Issue Name", align: "left", field: "name", sortable: true },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "createdAt", sortable: true },
        { name: "updatedAt", required: true, label: "Updated Date", align: "left", field: "updatedAt", sortable: true },
        { name: "action2", required: true, label: "", align: "left", field: "action2", sortable: false }
      ],
      ActivetableData: [],
      DeactivetableData: [],
    };
  },
  created() {
    this.ajaxSpareData();
  },
  watch: {
    activeTab() {
        this.ajaxSpareData();
    }
  },
  computed: {
    ...mapGetters("serviceRequest", ["getcsActiveSubIssueDetails", "getcsDeactiveSubIssueDetails"]),
  },
  methods: {
    ...mapActions("serviceRequest", ["FETCH_ACTIVE_CS_SUB_ISSUE_DATAS", "FETCH_DEACTIVE_CS_SUB_ISSUE_DATAS", "DELETE_CS_SUB_ISSUE", "ACTIVE_CS_SUB_ISSUE"]),
    fnShowActiveCsSubIssue(reqData) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to active this issue?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.ACTIVE_CS_SUB_ISSUE({ id: reqData.id, request: reqData })
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", message: "Successfully Updated!" });
            this.ajaxSpareData();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({ color: "negative", message: error.data?.message || "Error" });
          });
      });
    },
    fnDeleteCsSubIssue(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_CS_SUB_ISSUE(rowDetails).then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Successfully removed" });
          this.ajaxSpareData();
        }).catch(() => { this.$q.loading.hide(); });
      });
    },
    ajaxSpareData() {
      this.$q.loading.show({ message: "Loading..." });
      Promise.all([
          this.FETCH_ACTIVE_CS_SUB_ISSUE_DATAS(),
          this.FETCH_DEACTIVE_CS_SUB_ISSUE_DATAS()
      ]).then(() => {
          this.ActivetableData = this.getcsActiveSubIssueDetails.filter(s => s.active === true);
          this.DeactivetableData = this.getcsDeactiveSubIssueDetails.filter(s => s.active === false);
          this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    fnShowAddNewCsSubIssue(token) {
        if (token === 'refresh') {
            this.propShowAddCsSubIssue = false;
            this.ajaxSpareData();
        } else {
            this.propShowAddCsSubIssue = !this.propShowAddCsSubIssue;
        }
    },
    fnShowEditCsSubIssue(rowDetails) {
        if (this.propShowEditCsSubIssue) {
            this.propShowEditCsSubIssue = false;
            this.ajaxSpareData();
        } else {
            this.propRowDetails1 = rowDetails;
            this.propShowEditCsSubIssue = true;
        }
    },
    myCustomSearchFilter1(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => cols.some(col => (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1));
    },
    myCustomSearchFilter2(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => cols.some(col => (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1));
    }
  }
};
</script>
