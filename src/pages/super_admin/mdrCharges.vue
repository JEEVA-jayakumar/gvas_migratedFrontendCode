<template>
  <q-page>
    <!-- content -->
    <div>
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        active-bg-color="grey-1"
        active-color="dark"
        indicator-color="transparent"
        align="left"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          name="active"
          label="Active MDR"
        />
        <q-tab
          name="deactive"
          label="Deactived MDR"
        />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated class="bg-transparent">
        <q-tab-panel name="active" class="no-padding">
          <!--START: table Data -->
          <q-table
            :rows="activetableData"
            :columns="columns"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body-cell-leadSource="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadSource.sourceName)"
              >
                <span class="label text-primary">{{
                  props.row.leadSource.sourceName
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnDeleteMDR(props.row)"
                    flat
                    class="text-negative"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-device="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.device.deviceName)"
              >
                <span class="label text-primary">{{
                  props.row.device.deviceName
                }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.marsDeviceModel == null
                    ? "NA"
                    : props.row.marsDeviceModel.name
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-mdrPlanName="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.mdrPlanName == null ? "NA" : props.row.mdrPlanName
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantLessThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantLessThanTwoDebit == null
                    ? "NA"
                    : props.row.smallMerchantLessThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantGreaterThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantGreaterThanTwoDebit == null
                    ? "NA"
                    : props.row.smallMerchantGreaterThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantLessThanTwoCreditAndPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantLessThanTwoCreditAndPrepaid == null
                    ? "NA"
                    : props.row.smallMerchantLessThanTwoCreditAndPrepaid
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantGreaterThanTwoCreditAndPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantGreaterThanTwoCreditAndPrepaid == null
                    ? "NA"
                    : props.row.smallMerchantGreaterThanTwoCreditAndPrepaid
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantLessThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantLessThanTwoDebit == null
                    ? "NA"
                    : props.row.largeMerchantLessThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantGreaterThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantGreaterThanTwoDebit == null
                    ? "NA"
                    : props.row.largeMerchantGreaterThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantLessThanTwoCreditandPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantLessThanTwoCreditandPrepaid == null
                    ? "NA"
                    : props.row.largeMerchantLessThanTwoCreditandPrepaid
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantGreaterThanTwoCreditandPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantGreaterThanTwoCreditandPrepaid == null
                    ? "NA"
                    : props.row.largeMerchantGreaterThanTwoCreditandPrepaid
                }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-merchantCategory="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <q-btn
                  align="left"
                  dense
                  flat
                  no-wrap
                  no-caps
                  icon="fas fa-pencil-alt"
                  color="primary"
                  @click="editMerchantDetails(props.row)"
                  :label="props.row.merchantCategory?.merchantCategoryName"
                  class="capitalize"
                />
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
                  @click="$router.push('/super/admin/manage/mdr/charges')"
                  label="Add New Mdr Charges"
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
            :rows="deActivetableData"
            :columns="columnDataDiabled"
            table-class="customTableClass"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-leadSource="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadSource.sourceName)"
              >
                <span class="label text-primary">{{
                  props.row.leadSource.sourceName
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Enable"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnEnableMDR(props.row)"
                    flat
                    class="text-positive"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-device="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.device.deviceName)"
              >
                <span class="label text-primary">{{
                  props.row.device.deviceName
                }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-marsDeviceModel="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.marsDeviceModel == null
                    ? "NA"
                    : props.row.marsDeviceModel.name
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-mdrPlanName="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.mdrPlanName == null ? "NA" : props.row.mdrPlanName
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantLessThanTwoDebit="props">
              <q-td
                align="center"
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantLessThanTwoDebit == null
                    ? "NA"
                    : props.row.smallMerchantLessThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantGreaterThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantGreaterThanTwoDebit == null
                    ? "NA"
                    : props.row.smallMerchantGreaterThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantLessThanTwoCreditAndPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantLessThanTwoCreditAndPrepaid == null
                    ? "NA"
                    : props.row.smallMerchantLessThanTwoCreditAndPrepaid
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-smallMerchantGreaterThanTwoCreditAndPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.smallMerchantGreaterThanTwoCreditAndPrepaid == null
                    ? "NA"
                    : props.row.smallMerchantGreaterThanTwoCreditAndPrepaid
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantLessThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantLessThanTwoDebit == null
                    ? "NA"
                    : props.row.largeMerchantLessThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantGreaterThanTwoDebit="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantGreaterThanTwoDebit == null
                    ? "NA"
                    : props.row.largeMerchantGreaterThanTwoDebit
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantLessThanTwoCreditandPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantLessThanTwoCreditandPrepaid == null
                    ? "NA"
                    : props.row.largeMerchantLessThanTwoCreditandPrepaid
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-largeMerchantGreaterThanTwoCreditandPrepaid="props">
              <q-td
                :props="props"
                class="cursor-pointer"
              >
                <span class="label">{{
                  props.row.largeMerchantGreaterThanTwoCreditandPrepaid == null
                    ? "NA"
                    : props.row.largeMerchantGreaterThanTwoCreditandPrepaid
                }}</span>
              </q-td>
            </template>
            <!-- mdrPlanName -->
            <template v-slot:body-cell-merchantCategory="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.merchantCategory.merchantCategoryName)"
              >
                <span class="label text-primary">{{
                  props.row.merchantCategory.merchantCategoryName
                }}</span>
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
      <div class="row items-center gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center"></div>
        </div>
      </div>
      <EditMDRCharges
        v-if="propShoweditMerchantDetails"
        :propShoweditMerchantDetails="propShoweditMerchantDetails"
        :propRowDetails="propRowDetails"
        @emitfnshowEditMDR="editMerchantDetails"
      ></EditMDRCharges>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import EditMDRCharges from "../../pages/super_admin/editMDRCharges.vue";

export default {
  name: "MdrChargesList",
  components: {
    EditMDRCharges
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      propShoweditMerchantDetails: false,

      propRowDetails: "",
      filterSearch: "",
      filterSearch1: "",
      selectedTab: "active",
      assignTo: "",
      assignToOptions: [],
      tableData: [],
      activetableData: [],
      deActivetableData: [],
      tableData1: [],

      columns: [
        {
          name: "mdrPlanName",
          required: true,
          label: "Mdr Plan Name",
          align: "left",
          field: row => row.mdrPlanName,
          sortable: true
        },
        {
          name: "merchantCategory",
          required: true,
          label: "Selected Merchant Category",
          align: "left",
          field: row => row.merchantCategory?.merchantCategoryName,
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

        // mdrPlanName
        {
          name: "debitLessthanAmount",
          required: true,
          label: "Debit Less Amount",
          align: "left",
          field: "debitLessthanAmount",
          sortable: true
        },
        {
          name: "debitGreaterthanAmount",
          required: true,
          label: "Debit Greater Amount",
          align: "left",
          field: "debitGreaterthanAmount",
          sortable: true
        },
        {
          name: "stdCC",
          required: true,
          label: "stdCC",
          align: "left",
          field: "stdCC",
          sortable: true
        },
        {
          name: "premiumCC",
          required: true,
          label: "premiumCC",
          align: "left",
          field: "premiumCC",
          sortable: true
        },
        {
          name: "corpCC",
          required: true,
          label: "corpCC",
          align: "left",
          field: "corpCC",
          sortable: true
        },
        {
          name: "intlCC",
          required: true,
          label: "intlCC",
          align: "left",
          field: "intlCC",
          sortable: true
        },
        {
          name: "superPremiumlCC",
          required: true,
          label: "superPremiumlCC",
          align: "left",
          field: "superPremiumlCC",
          sortable: true
        },

        {
          name: "amexDomestic",
          required: true,
          label: "Amex Domestic",
          align: "left",
          field: "amexDomestic",
          sortable: true
        },

        {
          name: "amexInternational",
          required: true,
          label: "Amex International",
          align: "left",
          field: "amexInternational",
          sortable: true
        },
        {
          name: "upiDebitCardUpTo2000",
          required: true,
          label: "UPI Debit Card UpTo 2000",
          align: "left",
          field: "upiDebitCardUpTo2000",
          sortable: true
        },
        {
          name: "upiDebitCardAbove2000",
          required: true,
          label: "UPI Debit Card Above 2000",
          align: "left",
          field: "upiDebitCardAbove2000",
          sortable: true
        },
        {
          name: "upiPrepaidCreditCardsUpTo2000",
          required: true,
          label: "UPI Prepaid Credit Cards UpTo 2000",
          align: "left",
          field: "upiPrepaidCreditCardsUpTo2000",
          sortable: true
        },
        {
          name: "upiPrepaidCreditCardsAbove2000",
          required: true,
          label: "UPI Prepaid Credit Cards Above 2000",
          align: "left",
          field: "upiPrepaidCreditCardsAbove2000",
          sortable: true
        },
        {
          name: "smallMerchantLessThanTwoDebit",
          required: true,
          label: "Small merchant < 2000 debit",
          align: "left",
          field: row => row.smallMerchantLessThanTwoDebit,
          sortable: true
        },
        {
          name: "smallMerchantGreaterThanTwoDebit",
          required: true,
          label: "Small merchant > 2000 debit",
          align: "left",
          field: row => row.smallMerchantGreaterThanTwoDebit,
          sortable: true
        },
        {
          name: "smallMerchantLessThanTwoCreditAndPrepaid",
          required: true,
          label: "Small merchant < 2000 credit and prepaid",
          align: "left",
          field: row => row.smallMerchantLessThanTwoCreditAndPrepaid,
          sortable: true
        },
        {
          name: "smallMerchantGreaterThanTwoCreditAndPrepaid",
          required: true,
          label: "small Merchant > 2000 Credit and Prepaid",
          align: "left",
          field: row => row.smallMerchantGreaterThanTwoCreditAndPrepaid,
          sortable: true
        },
        {
          name: "largeMerchantLessThanTwoDebit",
          required: true,
          label: "large merchant < 2000 debit ",
          align: "left",
          field: row => row.largeMerchantLessThanTwoDebit,
          sortable: true
        },
        {
          name: "largeMerchantGreaterThanTwoDebit",
          required: true,
          label: "Large merchant > 2000 debit ",
          align: "left",
          field: row => row.largeMerchantGreaterThanTwoDebit,
          sortable: true
        },
        {
          name: "largeMerchantLessThanTwoCreditandPrepaid",
          required: true,
          label: "Large merchant < 2000 credit and prepaid",
          align: "left",
          field: row => row.largeMerchantLessThanTwoCreditandPrepaid,
          sortable: true
        },
        {
          name: "largeMerchantGreaterThanTwoCreditandPrepaid",
          required: true,
          label: "Large merchant > 2000 credit and prepaid",
          align: "left",
          field: row => row.largeMerchantGreaterThanTwoCreditandPrepaid,
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

      columnDataDiabled: [
        {
          name: "mdrPlanName",
          required: true,
          label: "Mdr Plan Name",
          align: "left",
          field: row => row.mdrPlanName,
          sortable: true
        },
        {
          name: "merchantCategory",
          required: true,
          label: "Selected Merchant Category",
          align: "left",
          field: row => row.merchantCategory?.merchantCategoryName,
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

        // mdrPlanName
        {
          name: "debitLessthanAmount",
          required: true,
          label: "Debit Less Amount",
          align: "left",
          field: "debitLessthanAmount",
          sortable: true
        },
        {
          name: "debitGreaterthanAmount",
          required: true,
          label: "Debit Greater Amount",
          align: "left",
          field: "debitGreaterthanAmount",
          sortable: true
        },
        {
          name: "stdCC",
          required: true,
          label: "stdCC",
          align: "left",
          field: "stdCC",
          sortable: true
        },
        {
          name: "premiumCC",
          required: true,
          label: "premiumCC",
          align: "left",
          field: "premiumCC",
          sortable: true
        },
        {
          name: "corpCC",
          required: true,
          label: "corpCC",
          align: "left",
          field: "corpCC",
          sortable: true
        },
        {
          name: "intlCC",
          required: true,
          label: "intlCC",
          align: "left",
          field: "intlCC",
          sortable: true
        },
        {
          name: "superPremiumlCC",
          required: true,
          label: "superPremiumlCC",
          align: "left",
          field: "superPremiumlCC",
          sortable: true
        },
         {
          name: "upiDebitCardUpTo2000",
          required: true,
          label: "UPI Debit Card UpTo 2000",
          align: "left",
          field: "upiDebitCardUpTo2000",
          sortable: true
        },
        {
          name: "upiDebitCardAbove2000",
          required: true,
          label: "UPI Debit Card Above 2000",
          align: "left",
          field: "upiDebitCardAbove2000",
          sortable: true
        },
        {
          name: "upiPrepaidCreditCardsUpTo2000",
          required: true,
          label: "UPI Prepaid Credit Cards UpTo 2000",
          align: "left",
          field: "upiPrepaidCreditCardsUpTo2000",
          sortable: true
        },
        {
          name: "upiPrepaidCreditCardsAbove2000",
          required: true,
          label: "UPI Prepaid Credit Cards Above 2000",
          align: "left",
          field: "upiPrepaidCreditCardsAbove2000",
          sortable: true
        },
        {
          name: "smallMerchantLessThanTwoDebit",
          required: true,
          label: "Small merchant < 2000 debit",
          align: "left",
          field: row => row.smallMerchantLessThanTwoDebit,
          sortable: true
        },
        {
          name: "smallMerchantGreaterThanTwoDebit",
          required: true,
          label: "Small merchant > 2000 debit",
          align: "left",
          field: row => row.smallMerchantGreaterThanTwoDebit,
          sortable: true
        },
        {
          name: "smallMerchantLessThanTwoCreditAndPrepaid",
          required: true,
          label: "Small merchant < 2000 credit and prepaid",
          align: "left",
          field: row => row.smallMerchantLessThanTwoCreditAndPrepaid,
          sortable: true
        },
        {
          name: "smallMerchantGreaterThanTwoCreditAndPrepaid",
          required: true,
          label: "small Merchant > 2000 Credit and Prepaid",
          align: "left",
          field: row => row.smallMerchantGreaterThanTwoCreditAndPrepaid,
          sortable: true
        },
        {
          name: "largeMerchantLessThanTwoDebit",
          required: true,
          label: "large merchant < 2000 debit ",
          align: "left",
          field: row => row.largeMerchantLessThanTwoDebit,
          sortable: true
        },
        {
          name: "largeMerchantGreaterThanTwoDebit",
          required: true,
          label: "Large merchant > 2000 debit ",
          align: "left",
          field: row => row.largeMerchantGreaterThanTwoDebit,
          sortable: true
        },
        {
          name: "largeMerchantLessThanTwoCreditandPrepaid",
          required: true,
          label: "Large merchant < 2000 credit and prepaid",
          align: "left",
          field: row => row.largeMerchantLessThanTwoCreditandPrepaid,
          sortable: true
        },
        {
          name: "largeMerchantGreaterThanTwoCreditandPrepaid",
          required: true,
          label: "Large merchant > 2000 credit and prepaid",
          align: "left",
          field: row => row.largeMerchantGreaterThanTwoCreditandPrepaid,
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

      currentDeviceInfo: {},
      showDeviceAddressModal: false,
      formData: {
        marsDeviceIdsCooked: [],
        marsDeviceIdsCookedUnAssinged: [],
        triggerWelcomeMail: false,
        assignTo: ""
      },
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
      tableAjaxLoading: false,
      tableAjaxLoading1: false
    };
  },

  computed: {
    ...mapGetters("mdrCharges", [
      "getAllMdrPlanDetails",
      "getAllMdrPlanEditDetails"
    ]),
    ...mapGetters("mdrChargesDeactive", ["getMdrChargesDeactive"]),
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
  methods: {
    ...mapActions("mdrCharges", [
      "FETCH_ALL_MDR_PLAN_DETAILS",
      "FETCH_ALL_MDR_PLAN_EDIT_DETAILS"
    ]),
    ...mapActions("mdrChargesDeactive", [
      "FETCH_ALL_DEACTIVATED_MDR_PLAN_DETAILS"
    ]),
    ...mapActions("CategoryBasedMdr", [
      "ENABLE_OR_DISABLE_MDR_PLAN"
    ]),
    //Load all short lead info while page loading

    editMerchantDetails(rowDetails) {
      this.propShoweditMerchantDetails = !this.propShoweditMerchantDetails;
      // eslint-disable-next-line eqeqeq
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails;
        this.ajaxLoadAllLeadInfo({
               pagination: this.paginationControl,
               filter: this.filterSearch
        });
      }
    },

    fnEnableMDR(request) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure, do you want to enable this MDR?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .onOk(() => {
          this.$q.loading.show({
            delay: 100, // ms
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          request.active = request.active == false ? true : request.active;
          this.ENABLE_OR_DISABLE_MDR_PLAN(request).then(response => {
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
    fnDeleteMDR(request) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to delete MDR?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .onOk(() => {
          this.$q.loading.show({
            delay: 100, // ms
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          request.active = request.active == true ? false : request.active;
          this.ENABLE_OR_DISABLE_MDR_PLAN(request).then(response => {
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
    ajaxLoadAllLeadInfo1(props) {
      const { pagination, filter } = props;
      // we set QTable to "loading" state
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_ALL_DEACTIVATED_MDR_PLAN_DETAILS({ pagination, filter })
        .then(res => {
          // updating pagination to reflect in the UI
          this.paginationControl1 = pagination;

          // we also set (or update) rowsNumber
          this.paginationControl1.rowsNumber = this.getMdrChargesDeactive.totalElements;
          this.paginationControl1.page = this.getMdrChargesDeactive.number + 1;

          // then we update the rows with the fetched ones
          this.deActivetableData = this.getMdrChargesDeactive.content;

          if (this.getMdrChargesDeactive.sort != null) {
            this.paginationControl1.sortBy = this.getMdrChargesDeactive.sort[0].property;
            this.paginationControl1.descending = !this.getMdrChargesDeactive.sort[0].ascending;
          }

          // finally we tell QTable to exit the "loading" state
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    ajaxLoadAllLeadInfo(props) {
      const { pagination, filter } = props;
      // we set QTable to "loading" state
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_ALL_MDR_PLAN_DETAILS({ pagination, filter })
        .then(res => {
          // updating pagination to reflect in the UI
          this.paginationControl = pagination;
          // we also set (or update) rowsNumber
          this.paginationControl.rowsNumber = this.getAllMdrPlanDetails.totalElements;
          this.paginationControl.page = this.getAllMdrPlanDetails.number + 1;

          // then we update the rows with the fetched ones
          this.activetableData = this.getAllMdrPlanDetails.content;

          if (this.getAllMdrPlanDetails.sort != null) {
            this.paginationControl.sortBy = this.getAllMdrPlanDetails.sort[0].property;
            this.paginationControl.descending = !this.getAllMdrPlanDetails.sort[0].ascending;
          }

          // finally we tell QTable to exit the "loading" state
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },

    // Load all short lead info while page loading
    goToUnassignedTab(tab) {
      if (tab == "deactive") {
        this.filterSearch1= ""
        let request = {
          pagination: this.paginationControl1,
          filter: this.filterSearch1
        };
        this.ajaxLoadAllLeadInfo1(request);
      } else {
        this.filterSearch= ""
        this.ajaxLoadAllLeadInfo({
          pagination: this.paginationControl,
          filter: this.filterSearch
        });
      }
    },

    // Function to toggle lead information pop up screen
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    }
  }
};
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}

.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>
