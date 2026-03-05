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
        <q-tab name="tab-1" label="Active Issue Mapping" />
        <q-tab name="tab-2" label="Deactive Issue Mapping" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated keep-alive class="bg-transparent">
        <q-tab-panel name="tab-1" class="no-padding q-mt-md">
          <q-table
            :rows="tableData"
            table-class="customSATableClass"
            :columns="columns1"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter1"
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
                    @click="fnShowEditIssueMapping(props.row)"
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
                    @click="fnDeleteIssueMapping(props.row)"
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
                    label="Add Issue Mapping"
                    @click="fnShowAddNewIssueMapping()"
                    color="purple-9"
                    icon="add"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2" class="no-padding q-mt-md">
          <q-table
            :rows="tableData1"
            table-class="customSATableClass"
            :columns="columns2"
            :filter="filterSearch1"
            v-model:pagination="paginationControl2"
            :filter-method="myCustomSearchFilter2"
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
                    @click="fnShowActiveIssueMapping(props.row)"
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
                  v-model="filterSearch1"
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

      <ShowEditIssueMapping
        v-if="propShowEditIssueMapping"
        :propShowEditIssueMapping="propShowEditIssueMapping"
        :propRowDetails2="propRowDetails2"
        @emitfnshowEditIssueMapping="fnShowEditIssueMapping"
      />
      <ShowAddIssueMapping
        v-if="propShowAddIssueMapping"
        :propShowAddIssueMapping="propShowAddIssueMapping"
        @emitfnShowAddNewIssueMapping="fnShowAddNewIssueMapping"
      />
    </div>
  </q-page>
</template>

<script>
import ShowAddIssueMapping from "../../components/super_admin/ShowAddIssueMapping.vue";
import ShowEditIssueMapping from "../../components/super_admin/ShowEditIssueMapping.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "IssueMapping",
  components: {
    ShowAddIssueMapping,
    ShowEditIssueMapping
  },
  data() {
    return {
      activeTab: "tab-1",
      propShowAddIssueMapping: false,
      propShowEditIssueMapping: false,
      propRowDetails2: null,
      filterSearch: "",
      filterSearch1: "",
      paginationControl: { rowsPerPage: 10 },
      paginationControl2: { rowsPerPage: 10 },
      columns1: [
        { name: "name", required: true, label: "Issue Name", align: "left", field: "name", sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      columns2: [
        { name: "name", required: true, label: "Issue Name", align: "left", field: "name", sortable: true },
        { name: "action1", required: true, label: "", align: "left", field: "action1", sortable: false }
      ],
      tableData: [],
      tableData1: []
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
    ...mapGetters("serviceRequest", ["getactiveIssueMapping", "getdeactiveIssueMapping"])
  },
  methods: {
    ...mapActions("serviceRequest", ["FETCH_ACTIVE_ISSUE_MAPPING", "FETCH_DEACTIVE_ISSUE_MAPPING", "ACTIVE_ISSUE_MAPPING", "DELETE_ISSUE_MAPPING"]),
    fnShowActiveIssueMapping(reqData) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to active this issue?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.ACTIVE_ISSUE_MAPPING({ id: reqData.id, request: reqData })
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
    fnDeleteIssueMapping(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to disable?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_ISSUE_MAPPING(rowDetails).then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Successfully Removed" });
          this.ajaxSpareData();
        }).catch(() => { this.$q.loading.hide(); });
      });
    },
    ajaxSpareData() {
      this.$q.loading.show({ message: "Loading..." });
      Promise.all([
          this.FETCH_ACTIVE_ISSUE_MAPPING(),
          this.FETCH_DEACTIVE_ISSUE_MAPPING()
      ]).then(() => {
          this.tableData = this.getactiveIssueMapping;
          this.tableData1 = this.getdeactiveIssueMapping;
          this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    fnShowAddNewIssueMapping(token) {
      if (token === 'refresh') {
          this.propShowAddIssueMapping = false;
          this.ajaxSpareData();
      } else {
          this.propShowAddIssueMapping = !this.propShowAddIssueMapping;
      }
    },
    fnShowEditIssueMapping(rowDetails) {
        if (this.propShowEditIssueMapping) {
            this.propShowEditIssueMapping = false;
            this.ajaxSpareData();
        } else {
            this.propRowDetails2 = rowDetails;
            this.propShowEditIssueMapping = true;
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
