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
        <q-tab name="tab-1" label="Active Service Request" />
        <q-tab name="tab-2" label="Deactive Service Request" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated keep-alive class="bg-transparent">
        <q-tab-panel name="tab-1" class="no-padding q-mt-md">
          <q-table
            :rows="ActivetableData"
            table-class="customSATableClass"
            :columns="columns2"
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
                    @click="fnShowEditServiceType(props.row)"
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
                    @click="fnDeleteServiceType(props.row)"
                    flat
                    class="text-negative"
                  />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-serviceReqIssueTypeSets="props">
              <q-td :props="props">
                <div class="row q-gutter-xs">
                  <q-chip
                    v-for="(menu, idx) in props.row.serviceReqIssueTypeSets"
                    :key="idx"
                    color="grey-2"
                    text-color="dark"
                    dense
                  >
                    {{ menu.serviceReqIssueType.name }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-serviceRequestStatusSets="props">
              <q-td :props="props">
                <div class="row q-gutter-xs">
                  <q-chip
                    v-for="(menu, idx) in props.row.serviceRequestStatusSets"
                    :key="idx"
                    color="grey-2"
                    text-color="dark"
                    dense
                  >
                    {{
                      menu.serviceRequestStatus
                        ? menu.serviceRequestStatus.name
                        : "NA"
                    }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="row full-width justify-end">
                <q-btn
                  no-caps
                  class="text-weight-regular"
                  label="Add Service Type"
                  @click="fnShowAddNewServiceType()"
                  color="purple-9"
                  icon="add"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2" class="no-padding q-mt-md">
          <q-table
            :rows="DeactivetableData"
            table-class="customSATableClass"
            :columns="columns1"
            :filter="filterSearch1"
            v-model:pagination="paginationControl2"
            :filter-method="myCustomSearchFilter2"
            row-key="id"
            color="grey-9"
            flat
            bordered
          >
            <template v-slot:body-cell-serviceReqIssueTypeSets="props">
              <q-td :props="props">
                <div class="row q-gutter-xs">
                  <q-chip
                    v-for="(menu, idx) in props.row.serviceReqIssueTypeSets"
                    :key="idx"
                    color="grey-2"
                    text-color="dark"
                    dense
                  >
                    {{ menu.serviceReqIssueType.name }}
                  </q-chip>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-serviceRequestStatusSets="props">
              <q-td :props="props">
                <div class="row q-gutter-xs">
                  <q-chip
                    v-for="(menu, idx) in props.row.serviceRequestStatusSets"
                    :key="idx"
                    color="grey-2"
                    text-color="dark"
                    dense
                  >
                    {{
                      menu.serviceRequestStatus
                        ? menu.serviceRequestStatus.name
                        : "NA"
                    }}
                  </q-chip>
                </div>
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
                    @click="fnShowActiveServiceType(props.row)"
                    flat
                    class="text-light-blue"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <showEditServiceType
        v-if="propShowEditServiceType"
        :propShowEditServiceType="propShowEditServiceType"
        :propRowDetails2="propRowDetails2"
        @emitfnshowEditServiceType="fnShowEditServiceType"
      />
      <showEditSubTaskType
        v-if="propShowEditSubTaskType"
        :propShowEditSubTaskType="propShowEditSubTaskType"
        :propRowDetails1="propRowDetails1"
        @emitfnshowEditSubTaskType="fnShowEditSubTaskType"
      />
      <ShowAddServiceType
        v-if="propShowAddServiceType"
        :propShowAddServiceType="propShowAddServiceType"
        @emitfnShowAddNewServiceType="fnShowAddNewServiceType"
      />
    </div>
  </q-page>
</template>

<script>
import ShowAddServiceType from "../../components/super_admin/ShowAddServiceType.vue";
import showEditServiceType from "../../components/super_admin/showEditServiceType.vue";
import showEditSubTaskType from "../../components/super_admin/showEditSubTaskType.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ServiceRequest",
  components: {
    ShowAddServiceType,
    showEditServiceType,
    showEditSubTaskType,
  },
  data() {
    return {
      activeTab: "tab-1",
      propShowAddServiceType: false,
      propShowEditServiceType: false,
      propShowEditSubTaskType: false,
      propRowDetails: null,
      propRowDetails1: null,
      propRowDetails2: null,
      filterSearch: "",
      filterSearch1: "",
      paginationControl: { rowsPerPage: 10 },
      paginationControl2: { rowsPerPage: 10 },
      columns1: [
        { name: "service_req_data", required: true, label: "Service Req Data", align: "left", field: row => row.serviceReqType.name, sortable: true },
        { name: "serviceReqIssueTypeSets", required: true, label: "Service Req Issue TypeSets", align: "left", sortable: true },
        { name: "serviceRequestStatusSets", required: true, label: "Service Status", align: "left", sortable: true },
        { name: "action1", required: true, label: "", align: "left", sortable: false }
      ],
      columns2: [
        { name: "service_req_data", required: true, label: "Service Req Data", align: "left", field: row => row.serviceReqType.name, sortable: true },
        { name: "serviceReqIssueTypeSets", required: true, label: "Service Req Issue TypeSets", align: "left", sortable: true },
        { name: "serviceRequestStatusSets", required: true, label: "Service Status", align: "left", sortable: true },
        { name: "action", required: true, label: "", align: "left", sortable: false }
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
    ...mapGetters("serviceRequest", ["getserviceRequestGetTypes"]),
  },
  methods: {
    ...mapActions("serviceRequest", ["FETCH_ALL_SERVICE_REQUEST_GET_TYPES", "DELETE_SERVICE_REQUEST_TYPES", "EDIT_SERVICE_REQUEST_TYPES"]),
    fnShowActiveServiceType(reqData) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to activate?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.EDIT_SERVICE_REQUEST_TYPES({ id: reqData.serviceReqType.id, request: reqData })
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
    fnDeleteServiceType(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_SERVICE_REQUEST_TYPES(rowDetails).then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Successfully removed" });
          this.ajaxSpareData();
        }).catch(() => { this.$q.loading.hide(); });
      });
    },
    ajaxSpareData() {
      this.$q.loading.show({ message: "Loading..." });
      this.FETCH_ALL_SERVICE_REQUEST_GET_TYPES()
        .then(() => {
          this.ActivetableData = this.getserviceRequestGetTypes.filter(s => s.serviceReqType.active === true);
          this.DeactivetableData = this.getserviceRequestGetTypes.filter(s => s.serviceReqType.active === false);
          this.$q.loading.hide();
        }).catch(() => { this.$q.loading.hide(); });
    },
    fnShowAddNewServiceType(token) {
        if (token === 'refresh') {
            this.propShowAddServiceType = false;
            this.ajaxSpareData();
        } else {
            this.propShowAddServiceType = !this.propShowAddServiceType;
        }
    },
    fnShowEditServiceType(rowDetails) {
        if (this.propShowEditServiceType) {
            this.propShowEditServiceType = false;
            this.ajaxSpareData();
        } else {
            this.propRowDetails2 = rowDetails;
            this.propShowEditServiceType = true;
        }
    },
    fnShowEditSubTaskType(rowDetails) {
      this.propRowDetails1 = rowDetails;
      this.propShowEditSubTaskType = true;
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
