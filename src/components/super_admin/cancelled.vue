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
        <q-tab name="tab-5" label="Active Cancelled" />
        <q-tab name="tab-6" label="Deactive Cancelled" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated keep-alive class="bg-transparent">
        <q-tab-panel name="tab-5" class="no-padding q-mt-md">
          <q-table
            :rows="ActivetableData"
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
                    @click="ShowEditServiceCancelStatus(props.row)"
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
                    @click="fnDeleteServiceRequestCancel(props.row)"
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
                    label="Add Cancel Status"
                    @click="fnShowCancelStatus()"
                    color="purple-9"
                    icon="add"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-6" class="no-padding q-mt-md">
          <q-table
            :rows="DeactivetableData"
            table-class="customSATableClass"
            :columns="columns4"
            :filter="filterSearch"
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
                    @click="fnShowActiveCancelStatus(props.row)"
                    flat
                    class="text-light-blue"
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

      <showCancelStatus
        v-if="propShowCancelStatus"
        :propShowCancelStatus="propShowCancelStatus"
        @emitfnShowCancelStatus="fnShowCancelStatus"
      />

      <ShowEditServiceCancelStatus
        v-if="propShowEditServiceCancelStatus"
        :propShowEditServiceCancelStatus="propShowEditServiceCancelStatus"
        :propRowDetails5="propRowDetails5"
        @emitShowEditServiceCancelStatus="ShowEditServiceCancelStatus"
      />
    </div>
  </q-page>
</template>

<script>
import showCancelStatus from "../../components/super_admin/showCancelStatus.vue";
import ShowEditServiceCancelStatus from "../../components/super_admin/ShowEditServiceCancelStatus.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CancelledStatus",
  components: {
    showCancelStatus,
    ShowEditServiceCancelStatus,
  },
  data() {
    return {
      activeTab: "tab-5",
      propShowCancelStatus: false,
      propShowEditServiceCancelStatus: false,
      propRowDetails5: null,
      filterSearch: "",
      paginationControl: { rowsPerPage: 10 },
      paginationControl2: { rowsPerPage: 10 },
      columns1: [
        { name: "name", required: true, label: "Name", align: "left", field: "name", sortable: true },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "createdAt", sortable: true },
        { name: "updatedAt", required: true, label: "Updated Date", align: "left", field: "updatedAt", sortable: true },
        { name: "action", required: true, label: "", align: "left", sortable: false }
      ],
      columns4: [
        { name: "name", required: true, label: "Name", align: "left", field: "name", sortable: true },
        { name: "createdAt", required: true, label: "Created Date", align: "left", field: "createdAt", sortable: true },
        { name: "updatedAt", required: true, label: "Updated Date", align: "left", field: "updatedAt", sortable: true },
        { name: "action1", required: true, label: "", align: "left", sortable: false }
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
    ...mapGetters("serviceRequestCancelled", ["getserviceRequestCancelReasonDetails"]),
  },
  methods: {
    ...mapActions("serviceRequestCancelled", ["FETCH_SERVICE_REQUEST_CANCELLED_DETAILS", "DELETE_SERVICE_CANCEL_STATUS_TYPES", "EDIT_CANCEL_STATUS_TYPES"]),
    fnShowActiveCancelStatus(reqData) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to activate?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.EDIT_CANCEL_STATUS_TYPES({ id: reqData.id, request: { ...reqData, active: true } })
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({ color: "positive", message: "Successfully updated!" });
            this.ajaxSpareData();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({ color: "negative", message: error.data?.message || "Error" });
          });
      });
    },
    fnDeleteServiceRequestCancel(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_SERVICE_CANCEL_STATUS_TYPES(rowDetails).then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Successfully removed" });
          this.ajaxSpareData();
        }).catch(() => { this.$q.loading.hide(); });
      });
    },
    ajaxSpareData() {
      this.$q.loading.show({ message: "Loading..." });
      this.FETCH_SERVICE_REQUEST_CANCELLED_DETAILS()
        .then(() => {
          this.ActivetableData = this.getserviceRequestCancelReasonDetails.filter(s => s.active === true);
          this.DeactivetableData = this.getserviceRequestCancelReasonDetails.filter(s => s.active === false);
          this.$q.loading.hide();
        }).catch(() => { this.$q.loading.hide(); });
    },
    fnShowCancelStatus(token) {
        if (token === 'refresh') {
            this.propShowCancelStatus = false;
            this.ajaxSpareData();
        } else {
            this.propShowCancelStatus = !this.propShowCancelStatus;
        }
    },
    ShowEditServiceCancelStatus(rowDetails) {
        if (this.propShowEditServiceCancelStatus) {
            this.propShowEditServiceCancelStatus = false;
            this.ajaxSpareData();
        } else {
            this.propRowDetails5 = rowDetails;
            this.propShowEditServiceCancelStatus = true;
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
