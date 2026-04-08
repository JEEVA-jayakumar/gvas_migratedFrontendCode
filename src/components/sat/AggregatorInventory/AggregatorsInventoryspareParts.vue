<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="row bottom-border q-ma-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9 q-title" align="left">
          Spare Counts
        </div>
        <br />
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="regionSpareCount.length > 0" class="row">
            <q-card
              class="border-radius-10 q-pa-md q-ma-md"
              style="background: #531b64; color: white"
              v-for="(menu, index) in regionSpareCount"
              :key="index"
            >
              <div align="center">
                <span class="text-h6 text-weight-bold">{{ menu.value.count }}</span>
              </div>
              <div align="center">
                <label>{{ menu.value.spareParts.spare_parts_types }}</label>
              </div>
            </q-card>
          </div>
          <div v-else class="row q-pa-md">
            <div class="col-12">
              <q-banner class="bg-primary text-white">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                No data available to display
              </q-banner>
            </div>
          </div>
        </div>
      </div>

      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        active-color="white"
        active-bg-color="dark"
        indicator-color="transparent"
        align="left"
      >
        <q-tab name="incomingPods" label="Incoming Pod's" />
        <q-tab name="stocks" label="Stocks" />
        <q-tab name="SoPodList" label="So Pod List" />
        <q-tab name="createSoPod" label="Create So Pod" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="SoPodList" class="q-pa-none">
          <PhonepeSoPodList />
        </q-tab-panel>

        <q-tab-panel name="incomingPods" class="q-pa-none">
          <q-table
            :rows="tableData"
            :columns="columns"
            table-class="customTableClass"
            v-model:filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-createdAt="props">
              <q-td v-if="props.row" :props="props">
                {{
                  props.row.created_date == null
                    ? "NA"
                    : $moment(props.row.created_date).format("Do MMM Y")
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-updated_date="props">
              <q-td v-if="props.row" :props="props">
                {{
                  props.row.updated_date == null
                    ? "NA"
                    : $moment(props.row.updated_date).format("Do MMM Y")
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td v-if="props.row" :props="props">
                <span class="label text-positive" v-if="props.row.status == 1"
                  >Created</span
                >
                <span
                  class="label text-primary"
                  v-else-if="props.row.status == 2"
                  >Assigned to R.I</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 3"
                  >Approved By R.I</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 4"
                  >Assigned To SO</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 5"
                  >Approved By So</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 6"
                  >Rejected</span
                >
                <span class="label text-negative" v-else>NA</span>
              </q-td>
            </template>
            <template v-slot:body-cell-owner="props">
              <q-td v-if="props.row" :props="props">
                <span class="label text-positive" v-if="props.row.owner == 1"
                  >Central Inventory</span
                >
                <span
                  class="label text-primary"
                  v-else-if="props.row.owner == 2"
                  >Regional Inventory</span
                >
                <span
                  class="label text-primary"
                  v-else-if="props.row.owner == 3"
                  >SO</span
                >
              </q-td>
            </template>
            <template v-slot:body-cell-regionAreaName="props">
              <q-td v-if="props.row" :props="props">
                {{
                  props.row.allocate_region == null
                    ? "NA"
                    : props.row.allocate_region.regionAreaName
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td v-if="props.row" :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Reject"
                    icon="far fa-minus-square"
                    size="sm"
                    @click="fnRejectPodDetails(props.row)"
                    flat
                    class="text-negative"
                  ></q-btn>
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Approve"
                    icon="far fa-plus-square"
                    size="sm"
                    @click="fnApprovePodDetails(props.row)"
                    flat
                    class="text-light-blue"
                  ></q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  dense
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  label="Search By POD Number"
                  placeholder="Type.."
                  class="q-mr-lg q-py-sm"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="stocks" class="q-pa-none">
          <q-table
            :rows="tableData1"
            :columns="columns1"
            table-class="customTableClass"
            v-model:filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-createdAt="props">
              <q-td v-if="props.row" :props="props">
                {{
                  props.row.created_date == null
                    ? "NA"
                    : $moment(props.row.created_date).format("Do MMM Y")
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-updated_date="props">
              <q-td v-if="props.row" :props="props">
                {{
                  props.row.updated_date == null
                    ? "NA"
                    : $moment(props.row.updated_date).format("Do MMM Y")
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td v-if="props.row" :props="props">
                <span class="label text-positive" v-if="props.row.status == 1"
                  >Created</span
                >
                <span
                  class="label text-primary"
                  v-else-if="props.row.status == 2"
                  >Assigned to R.I</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 3"
                  >Approved By R.I</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 4"
                  >Assigned To SO</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 5"
                  >Approved By So</span
                >
                <span class="label text-orange" v-else-if="props.row.status == 6"
                  >Rejected</span
                >
                <span class="label text-negative" v-else>NA</span>
              </q-td>
            </template>
            <template v-slot:body-cell-owner="props">
              <q-td v-if="props.row" :props="props">
                <span class="label text-positive" v-if="props.row.owner == 1"
                  >Central Inventory</span
                >
                <span
                  class="label text-primary"
                  v-else-if="props.row.owner == 2"
                  >Regional Inventory</span
                >
                <span
                  class="label text-primary"
                  v-else-if="props.row.owner == 3"
                  >SO</span
                >
              </q-td>
            </template>
            <template v-slot:body-cell-regionAreaName="props">
              <q-td v-if="props.row" :props="props">
                {{
                  props.row.allocate_region == null
                    ? "NA"
                    : props.row.allocate_region.regionAreaName
                }}
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  dense
                  clearable
                  color="grey-9"
                  v-model="filterSearch1"
                  label="Search By POD Number"
                  placeholder="Type.."
                  class="q-mr-lg q-py-sm"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="createSoPod">
          <div class="col-sm-3 q-pa-md">
            <div class="row">
              <q-select
                use-input
                @filter="filterRegionBasedSo"
                clearable
                v-model="formData.allocate_so"
                label="Select SO"
                class="col-md-4"
                color="grey-9"
                :options="regionBasedSoFiltered"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-7 q-mt-md">
              <p class="q-caption">Spare Parts Type*</p>
              <div class="row">
                <div
                  class="row items-center q-mr-md"
                  v-for="menu in sparePartsTypes"
                  :key="menu.value.id"
                >
                  <q-checkbox
                    v-model="menu.checked"
                    :label="menu.label"
                    @update:model-value="val => getSelectedDetails(val, menu.value)"
                  />
                </div>
              </div>
              <div v-for="menu in sparePartsTypes" :key="'dv' + menu.value.id">
                <div v-if="menu.checked" class="q-mt-sm">
                  <q-input
                    type="number"
                    v-model.number="menu.count"
                    :label="menu.label + ' Count'"
                    style="max-width: 200px"
                    @blur="getAllCounts(menu)"
                  />
                </div>
              </div>
            </div>
            <div class="row q-mt-md">
              <div class="col-md-5">
                <q-input
                  disable
                  v-model="formData.pod_number"
                  label="Pod Number"
                  color="grey-9"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-5">
                <q-input
                  disable
                  v-model="formData.total_count"
                  label="Total Count"
                  color="grey-9"
                />
              </div>
            </div>
            <div class="full-width q-mt-md" align="center">
              <q-btn
                :disabled="this.formData.total_count == 0 || !formData.allocate_so"
                size="md"
                label="Submit"
                color="purple-9"
                @click="fnSubmitBankDetails(formData)"
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <PhonepeRejectPodDetails
        v-if="showRejectModel"
        :showRejectModel="showRejectModel"
        :propShowRejectComponent="propsRejectAppend"
        @reloadPaymentTrackerData="
          ajaxLoadAllLeadInfo({
            pagination: paginationControl,
            filter: filterSearch,
          })
        "
        @closeRejectModel="fnRejectPodDetails"
      />
    </div>
  </q-page>
</template>

<script>
import PhonepeRejectPodDetails from "../AggregatorInventory/PhonepeRejectPodDetails.vue";
import PhonepeSoPodList from "../AggregatorInventory/PhonepeSoPodList.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AggregatorsInventoryspareParts",
  components: {
    PhonepeSoPodList,
    PhonepeRejectPodDetails,
  },
  data() {
    return {
      showRejectModel: false,
      propsRejectAppend: [],
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "incomingPods",
      regionBasedSo: [],
      regionBasedSoFiltered: [],
      regionSpareCount: [],
      sparePartsTypes: [],
      formData: {
        allocate_region: "",
        allocate_reseller: null,
        total_count: 0,
        allocate_so: "",
        pod_number: "",
        sparePartsSets: [],
      },
      paginationControl: {
        rowsNumber: 0,
        page: 1,
        sortBy: "updated_date",
        descending: true,
        rowsPerPage: 5,
      },
      paginationControl1: {
        rowsNumber: 0,
        page: 1,
        sortBy: "updated_date",
        descending: true,
        rowsPerPage: 5,
      },
      columns1: [
        {
          name: "pod_number",
          required: true,
          label: "Pod Number",
          align: "left",
          field: "pod_number",
          sortable: true,
        },
        {
          name: "regionAreaName",
          required: true,
          label: "Region",
          align: "left",
          field: (row) => row.allocate_region?.regionAreaName,
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "left",
          field: "status",
          sortable: false,
        },
        {
          name: "owner",
          required: true,
          label: "Owner",
          align: "left",
          field: "owner",
          sortable: false,
        },
        {
          name: "total_count",
          required: true,
          label: "Total Count",
          align: "left",
          field: "total_count",
          sortable: false,
        },
        {
          name: "createdAt",
          required: true,
          label: "Created Date",
          align: "left",
          field: "created_date",
          sortable: false,
        },
        {
          name: "updated_date",
          required: true,
          label: "Updated Date",
          align: "left",
          field: "updated_date",
          sortable: true,
        },
      ],
      columns: [
        {
          name: "pod_number",
          required: true,
          label: "Pod Number",
          align: "left",
          field: "pod_number",
          sortable: true,
        },
        {
          name: "regionAreaName",
          required: true,
          label: "Region",
          align: "left",
          field: (row) => row.allocate_region?.regionAreaName,
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "left",
          field: "status",
          sortable: false,
        },
        {
          name: "owner",
          required: true,
          label: "Owner",
          align: "left",
          field: "owner",
          sortable: false,
        },
        {
          name: "total_count",
          required: true,
          label: "Total Count",
          align: "left",
          field: "total_count",
          sortable: false,
        },
        {
          name: "createdAt",
          required: true,
          label: "Created Date",
          align: "left",
          field: "created_date",
          sortable: false,
        },
        {
          name: "updated_date",
          required: true,
          label: "Updated Date",
          align: "left",
          field: "updated_date",
          sortable: true,
        },
        {
          name: "action",
          required: true,
          label: "Action",
          align: "left",
          field: "action",
          sortable: false,
        },
      ],
      tableData: [],
      tableData1: [],
    };
  },
  watch: {
    selectedTab(val) {
      this.goToSelectedTab(val);
    },
  },
  created() {
    this.regionBasedSoLoad();
    this.fnSparePartsTypes();
    this.fnregionSpareCount();
    this.podNumberCreation();
    this.goToSelectedTab(this.selectedTab);
  },
  computed: {
    ...mapGetters("InventoryCentral", ["getRegionBasedSO"]),
    ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"]),
    ...mapGetters("regionalInventoryDetails", [
      "getPhonepeSparePartsSetsAndCounts",
      "getphonepeRegionalInventoryAllocatedSoPodDetails",
      "getPhonepeRegionalInventoryStocksPodDetails",
    ]),
  },
  methods: {
    ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES"]),
    ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
    ...mapActions("sparePartsInventory", [
      "UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS",
    ]),
    ...mapActions("regionalInventoryDetails", [
      "FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS",
      "FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS",
      "APPROVE_PHONEPE_INCOMING_POD_DETAILS",
      "FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS",
    ]),
    ...mapActions("singlePodData", ["FETCH_PHONEPE_SINGLE_POD_DETAILS"]),

    filterRegionBasedSo(val, update) {
      if (val === "") {
        update(() => {
          this.regionBasedSoFiltered = this.regionBasedSo;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.regionBasedSoFiltered = this.regionBasedSo.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    fnRejectPodDetails(exceptionDetails) {
      this.showRejectModel = !this.showRejectModel;
      if (exceptionDetails) {
        this.propsRejectAppend = exceptionDetails;
      }
    },
    podNumberCreation() {
      const name = "SO";
      const d = new Date();
      let number = d.getTime();
      this.formData.pod_number = name.concat(number);
    },
    fnregionSpareCount() {
      this.regionSpareCount = [];
      this.FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS().then(() => {
        this.getPhonepeSparePartsSetsAndCounts.forEach((item) => {
          this.regionSpareCount.push({
            value: item,
            label: item.spare_parts_types,
          });
        });
      });
    },
    fnApprovePodDetails(reqdata) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to Approve?",
          ok: "Continue",
          cancel: "Cancel",
        })
        .onOk(() => {
          this.$q.loading.show();
          this.FETCH_PHONEPE_SINGLE_POD_DETAILS(reqdata).then((response) => {
            let param = {
              allocate_region: response.data.data.allocate_region,
              created_by: response.data.data.created_by,
              allocate_reseller: response.data.data.allocate_reseller,
              allocate_so: response.data.data.allocate_so,
              sparePartsSets: response.data.data.sparePartsSets,
              total_count: response.data.data.total_count,
              pod_number: response.data.data.pod_number,
              created_date: response.data.data.created_date,
              updated_date: response.data.data.updated_date,
              status: reqdata.status,
              owner: reqdata.owner,
            };
            this.APPROVE_PHONEPE_INCOMING_POD_DETAILS(param)
              .then(() => {
                this.$q.notify({
                  color: "positive",
                  position: "bottom",
                  message: "Successfully Approved!",
                  icon: "thumb_up",
                });
                this.ajaxLoadAllLeadInfo({
                  pagination: this.paginationControl,
                  filter: this.filterSearch,
                });
                this.fnregionSpareCount();
                this.$q.loading.hide();
              })
              .catch((error) => {
                this.$q.loading.hide();
                this.$q.notify({
                  color: "negative",
                  position: "bottom",
                  message: error.data?.message || "Please Try Again Later !",
                  icon: "thumb_down",
                });
              });
          });
        });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS({ pagination, filter })
        .then((res) => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber =
            this.getphonepeRegionalInventoryAllocatedSoPodDetails.totalElements;
          this.paginationControl.page =
            this.getphonepeRegionalInventoryAllocatedSoPodDetails.number + 1;
          this.tableData =
            this.getphonepeRegionalInventoryAllocatedSoPodDetails.content;
          if (this.getphonepeRegionalInventoryAllocatedSoPodDetails.sort != null) {
            this.paginationControl.sortBy =
              this.getphonepeRegionalInventoryAllocatedSoPodDetails.sort[0].property;
            this.paginationControl.descending =
              this.getphonepeRegionalInventoryAllocatedSoPodDetails.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      this.FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS({
        pagination,
        filter,
      })
        .then((res) => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber =
            this.getPhonepeRegionalInventoryStocksPodDetails.totalElements;
          this.paginationControl1.page =
            this.getPhonepeRegionalInventoryStocksPodDetails.number + 1;
          this.tableData1 =
            this.getPhonepeRegionalInventoryStocksPodDetails.content;
          if (this.getPhonepeRegionalInventoryStocksPodDetails.sort != null) {
            this.paginationControl1.sortBy =
              this.getPhonepeRegionalInventoryStocksPodDetails.sort[0].property;
            this.paginationControl1.descending =
              this.getPhonepeRegionalInventoryStocksPodDetails.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => this.$q.loading.hide());
    },
    goToSelectedTab(tab) {
      if (tab == "stocks") {
        this.ajaxLoadAllLeadInfo1({
          pagination: this.paginationControl1,
          filter: this.filterSearch1,
        });
      } else if (tab == "incomingPods") {
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filterSearch,
        });
      }
    },
    fnSubmitBankDetails(request) {
      let payload = { ...request };
      payload.allocate_region = JSON.parse(localStorage.getItem("u_i")).region;
      payload.allocate_so = JSON.parse(request.allocate_so);

      this.$q.loading.show();
      this.UPDATE_PHONEPE_SPARE_PARTS_INVENTORY_DATAS(payload)
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully updated!",
            icon: "thumb_up",
          });
          this.formData.total_count = 0;
          this.formData.sparePartsSets = [];
          this.formData.allocate_so = "";
          this.sparePartsTypes.forEach(t => {
              t.checked = false;
              t.count = 0;
          });
          this.podNumberCreation();
        })
        .catch((error) => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.data?.message || "Please Try Again Later !",
            icon: "thumb_down",
          });
        });
    },
    fnSparePartsTypes() {
      this.FETCH_SPARE_PARTS_GET_TYPES().then(() => {
        this.sparePartsTypes = this.getsparePartsGetTypes.map((item) => ({
          value: item,
          label: item.spare_parts_types,
          checked: false,
          count: 0
        }));
      });
    },
    getSelectedDetails(val, request) {
      if (!val) {
        this.formData.sparePartsSets = this.formData.sparePartsSets.filter(
          (obj) => obj.spareParts.id != request.id
        );
        this.calculateTotalCount();
      }
    },
    getAllCounts(menu) {
      let val = parseInt(menu.count) || 0;
      let item = this.formData.sparePartsSets.find(
        (obj) => obj.spareParts.id == menu.value.id
      );
      if (item) {
        item.count = val;
      } else {
        this.formData.sparePartsSets.push({
          count: val,
          spareParts: { id: menu.value.id },
        });
      }
      this.calculateTotalCount();
    },
    calculateTotalCount() {
      this.formData.total_count = this.formData.sparePartsSets.reduce(
        (sum, obj) => sum + obj.count,
        0
      );
    },
    regionBasedSoLoad() {
      let regionArea = JSON.parse(localStorage.getItem("u_i")).region.id;
      this.FETCH_REGION_BASED_SO(regionArea).then(() => {
        this.regionBasedSo = this.getRegionBasedSO.map((value) => ({
          label: value.name + " | " + value.employeeID + " | " + value.email,
          value: JSON.stringify(value),
        }));
        this.regionBasedSoFiltered = this.regionBasedSo;
      });
    },
  },
};
</script>
