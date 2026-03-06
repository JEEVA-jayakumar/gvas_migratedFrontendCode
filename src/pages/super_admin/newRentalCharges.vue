<template>
  <q-page>
    <div>
      <!--@update:model-value="goToUnassignedTab"-->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        active-bg-color="grey-1"
        active-color="dark"
        indicator-color="transparent"
        align=""
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          name="active"
          label="Active Rental Charges"
        />
        <q-tab
          name="deactive"
          label="DeActived Rental Charges"
        />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated class="bg-transparent">
        <q-tab-panel name="active" class="no-padding">
          <!--START: table Data -->
          <q-table
            table-class="customTableClass"
            :rows="tableData"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            :loading="toggleAjaxLoadFilter"
            :rows-per-page-options="[5, 10, 15, 20]"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadSource="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadSource.sourceName)"
              >
                <span class="label text-primary">
                  {{ props.row.leadSource.sourceName }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-device="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.device.deviceName)"
              >
                <span class="label text-primary">
                  {{ props.row.device.deviceName }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{ props.row.marsDeviceModel == null ? "NA" : props.row.marsDeviceModel.name }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-plan="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <q-btn
                  align=""

                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="editPlanDetails(props.row)"
                  :label="props.row.plan?.planName"
                  class="capitalize"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn

                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnDeleteRental(props.row)"
                    flat
                    class="text-negative"
                  ></q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <!--START: table filter,search -->
              <div class="col-md-12 group">
                <div class="row">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch"
                      placeholder="Type.."
                      label="Search by Plan Name"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-md-12" align="right">
                <q-btn
                  no-caps
                  class="text-weight-regular"
                  @click="$router.push('/super/admin/manage/rental/charges')"
                  label="Add New Rental Charges"
                  color="purple-9"
                  size="md"
                />
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>

        <q-tab-panel name="deactive" class="no-padding">
          <!--START: table Data -->
          <q-table
            table-class="customTableClass"
            :rows="deactiveTableData"
            :columns="columnsDeactive"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="toggleAjaxLoadFilter1"
            :rows-per-page-options="[5, 10, 15, 20]"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadSource="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadSource.sourceName)"
              >
                <span class="label text-primary">
                  {{ props.row.leadSource.sourceName }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-device="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.device.deviceName)"
              >
                <span class="label text-primary">
                  {{ props.row.device.deviceName }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-action1="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn

                    no-caps
                    no-wrap
                    label="Enable"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnEnableRental(props.row)"
                    flat
                    class="text-positive"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{ props.row.marsDeviceModel == null ? "NA" : props.row.marsDeviceModel.name }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-plan="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.plan.planName)"
              >
                <span class="label text-primary"> {{ props.row.plan.planName }}</span>
              </q-td>
            </template>

            <template v-slot:top>
              <!--START: table filter,search -->
              <div class="col-md-12 group">
                <div class="row">
                  <div class="col-md-6">
                    <q-input
                      clearable
                      color="grey-9"
                      v-model.trim="filterSearch1"
                      placeholder="Type.."
                      label="Search by Plan Name"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tab-panels>

      <EditRentalCharges
        v-if="propShoweditPlanDetails"
        :propShoweditPlanDetails="propShoweditPlanDetails"
        :propRowDetails="propRowDetails"
        @emitfnshowEditRental="editPlanDetails"
      ></EditRentalCharges>
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import EditRentalCharges from "../../pages/super_admin/editRentalCharges.vue";
export default {
  setup() { return { v$: useVuelidate() } },
  name: "NewRentalChargesList",
  components: {
    EditRentalCharges
  },
  data() {
    return {
      propShoweditPlanDetails: false,
      propRowDetails: "",
      selectedTab: "active",
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,

      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: "id",
        descending: false,
        rowsPerPage: 10
      },
      paginationControl1: {
        rowsNumber: 10,
        page: 1,
        sortBy: "id",
        descending: false,
        rowsPerPage: 10
      },

      filterSearch: "",
      filterSearch1: "",

      //Defining columns for table
      columns: [
        {
          name: "plan",
          required: true,
          label: "Plan Name",
          align: "left",
          field: row => row.plan?.planName,
          sortable: true
        },
        {
          name: "leadSource",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => row.leadSource?.sourceName,
          sortable: true
        },
        {
          name: "device",
          required: true,
          label: "Device Type",
          align: "left",
          field: row => row.device?.deviceName,
          sortable: true
        },
        {
          name: "marsDeviceModel",
          required: true,
          label: "Mars Device Model",
          align: "left",
          field: row => row.marsDeviceModel?.name,
          sortable: true
        },
        {
          name: "setupFees",
          required: true,
          label: "setupFees",
          align: "left",
          field: "setupFees",
          sortable: true
        },
        {
          name: "monthlyFees",
          required: true,
          label: "Recurring Fees",
          align: "left",
          field: "monthlyFees",
          sortable: true
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false
        }
      ],
      columnsDeactive: [
        {
          name: "plan",
          required: true,
          label: "Plan Name",
          align: "left",
          field: row => row.plan?.planName,
          sortable: true
        },
        {
          name: "leadSource",
          required: true,
          label: "Lead Source",
          align: "left",
          field: row => row.leadSource?.sourceName,
          sortable: true
        },
        {
          name: "device",
          required: true,
          label: "Device Type",
          align: "left",
          field: row => row.device?.deviceName,
          sortable: true
        },
        {
          name: "marsDeviceModel",
          required: true,
          label: "Mars Device Model",
          align: "left",
          field: row => row.marsDeviceModel?.name,
          sortable: true
        },
        {
          name: "setupFees",
          required: true,
          label: "setupFees",
          align: "left",
          field: "setupFees",
          sortable: true
        },
        {
          name: "monthlyFees",
          required: true,
          label: "Recurring Fees",
          align: "left",
          field: "monthlyFees",
          sortable: true
        },
        {
          name: "action1",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false
        }
      ],
      tableData: [],
      deactiveTableData: []
    };
  },

  created() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filterSearch
    });
    this.ajaxLoadAllLeadInfo1({
      pagination: this.paginationControl1,
      filter: this.filterSearch1
    });
  },

  computed: {
    ...mapGetters("rentalCharges", ["getAllRentalPlanDetails", "getDeactivatedRentalPlanDetails"])
  },

  methods: {
    ...mapActions("rentalCharges", [
      "FETCH_ALL_RENTAL_PLAN_DETAILS", "FETCH_DEACTIVATED_RENTAL_PLAN_DETAILS",
      "FETCH_ALL_RENTAl_PLAN_EDIT_DETAILS", "ENABLE_OR_DISABLE_RENTAL_PLAN",
    ]),
    ...mapActions("categoryBasedRental", ["ENABLE_OR_DISABLE_RENTAL_PLAN"]),
    fnEnableRental(request) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure, do you want to enable this Rental?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .then(() => {
          this.$q.loading.show({
            delay: 100, // ms
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          request.active = request.active == false ? true : request.active;
          this.ENABLE_OR_DISABLE_RENTAL_PLAN(request)
            .then((response) => {
              this.ajaxLoadAllLeadInfo1({
                pagination: this.paginationControl1,
                filter: this.filterSearch1
              });
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully Enabled",
                icon: "thumb_up"
              });

            }).finally(() => {
              this.$q.loading.hide();
            });
        });
    },
    fnDeleteRental(request) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to delete Rental?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .then(() => {
          this.$q.loading.show({
            delay: 100, // ms
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          request.active = request.active == true ? false : request.active;
          this.ENABLE_OR_DISABLE_RENTAL_PLAN(request)
            .then(response => {
              this.ajaxLoadAllLeadInfo({
                pagination: this.paginationControl,
                filter: this.filterSearch
              });
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
    goToUnassignedTab(tab) {
      if (tab == "deactive") {
        this.filterSearch1 = "";
        this.ajaxLoadAllLeadInfo1({
          pagination: this.paginationControl1,
          filter: this.filterSearch1,
        });
      } else {
        this.filterSearch = "";
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filterSearch,
        });
      }
    },

    ajaxLoadAllLeadInfo1(props) {
      const { pagination, filter } = props;
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_DEACTIVATED_RENTAL_PLAN_DETAILS({ pagination, filter })
        .then(res => {
          this.paginationControl1 = pagination;
          this.paginationControl1.rowsNumber = this.getDeactivatedRentalPlanDetails.totalElements;
          this.paginationControl1.page = this.getDeactivatedRentalPlanDetails.number + 1;
          this.deactiveTableData = this.getDeactivatedRentalPlanDetails.content;
          if (this.getDeactivatedRentalPlanDetails.sort != null) {
            this.paginationControl1.sortBy = this.getDeactivatedRentalPlanDetails.sort[0].property;
            this.paginationControl1.descending = !this.getDeactivatedRentalPlanDetails.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    ajaxLoadAllLeadInfo(props) {
      const { pagination, filter } = props;
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_ALL_RENTAL_PLAN_DETAILS({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getAllRentalPlanDetails.totalElements;
          this.paginationControl.page = this.getAllRentalPlanDetails.number + 1;
          this.tableData = this.getAllRentalPlanDetails.content;
          if (this.getAllRentalPlanDetails.sort != null) {
            this.paginationControl.sortBy = this.getAllRentalPlanDetails.sort[0].property;
            this.paginationControl.descending = !this.getAllRentalPlanDetails.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    editPlanDetails(rowDetails) {
      this.propShoweditPlanDetails = !this.propShoweditPlanDetails;
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails;
      }
    },
    toggleLeadInformation(leadDetails) {
      // implementation if needed
    }
  }
};
</script>

<style>
.customTabActive {
  background: purple;
  color: #fff;
}
</style>
