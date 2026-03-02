<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" flat>
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu" />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :breakpoint="500"
      class="bg-dark text-white"
    >
      <div class="q-py-md q-px-lg flex items-center" style="height: 65px; background: rgba(0,0,0,0.1)">
        <img src="~assets/images/logo.png" style="height: 35px" />
      </div>

      <q-scroll-area style="height: calc(100% - 65px)" :thumb-style="{
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#61116a',
        width: '5px',
        opacity: 0.75,
      }">
        <div class="q-px-md q-pt-md" v-if="showAggregatorSelect">
          <q-select
            filled
            v-model="selectedValue"
            label="Module View"
            color="purple"
            dark
            dense
            :options="aggregatorOptions"
            emit-value
            map-options
            @update:model-value="handleAggregatorChange"
            class="aggregator-select"
          />
        </div>

        <SidebarMenu :menus="currentMenus" />
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <customBody />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex"; 
import customHeader from '../components/customHeader.vue';
import customBody from '../components/customBody.vue';
import SidebarMenu from '../components/SidebarMenu.vue';
import _ from "lodash";

export default {
  name: 'MainLayout',
  components: {
    customHeader,
    customBody,
    SidebarMenu
  },
  data() {
    return {
      leftDrawerOpen: this.$q.localStorage.getItem("leftDrawerOpen") !== null
        ? this.$q.localStorage.getItem("leftDrawerOpen")
        : (this.$q.platform.is.desktop && this.$route.name != 'leadDataEntry'),
      propShowDatas: false,
      menuListName: '',
      menuListNameSat: '',
      name:'',
      aggregatorOptions: [],
      showMenu: [],
      array:[],
      selectedValue: "Bijlipay",
      selectedValueSat: "Bijlipay",
      menus: {
        varaneekSat: [
        {
            id: 3,
            to: '/sat/lead/lead/dataentry',
            name: 'Lead Creation'
          },
          {
            id: 1,
            to: '/sat/lead/validation',
            name: 'Lead Validation'
          },
          {
            id: 8,
            to: '/sat/varaneekimplementationRequest',
            name: 'Lead Status',
            subItems: []
          }
        ],
        sat: [
          {
            id: 1,
            to: "/sat/master/BijlipaySat",
            name: "Bijlipay",
            subItems: [
              {
                id: 0,
                to: "/sat/dashboard",
                name: "Dashboard",
                subItems: [],
              },
              {
                id: 1,
                to: "/sat/lead/validation",
                name: "Lead Validation",
                subItems: [],
              },
              {
                id: 21,
                to: "/sat/additionalTid",
                name: "Additional Terminals",
                subItems: [],
              },
              {
                id: 15,
                to: "/sat/change/management",
                name: "Change Management",
                subItems: [],
              },
              {
                id: 20,
                to: "/sat/internalLostOrStolen",
                name: "Lost/Stolen",
                subItems: [],
              },
              {
                id: 22,
                to: "/sat/InternalGlobalSearchFilter",
                name: "Global Serial Number/TID Search",
                subItems: [],
              },

              {
                id: 2,
                to: "/sat/exception/queue",
                name: "Exception Queue",
                subItems: [],
              },
              {
                id: 3,
                to: "/sat/open/merchant/tracker",
                name: "Open Merchant tracker",
                subItems: [],
              },
              {
                id: 7,
                to: "/sat/internalRegionalInventory",
                name: "Regional Inventory",
                subItems: [],
              },
              {
                id: 8,
                to: "/sat/internalimplementationRequest",
                name: "Implementation Queue",
                subItems: [],
              },
              {
                id: 9,
                to: "/sat/master/tracker",
                name: "Master Tracker-Implemented",
                subItems: [],
              },
              {
                id: 10,
                to: "/sat/device/recovery/tracker",
                name: "Device Recovery Tracker",
                subItems: [],
              },
              {
                id: 12,
                to: "/sat/lead/lead/dataentry",
                name: "Lead Creation",
                subItems: [],
              },
              {
                id: 13,
                to: "/sat/lead/lead/view/audocuments",
                name: "Implemented Verification Queue",
                subItems: [],
              },
              {
               id: 78,
               to: "/sat/deactivelist",
               name: "Bijlipay De-Active List ",
               subItems: []
              },
              {
                id: 14,
                to: "/sat/device/replacement",
                name: "Device Replacement",
                subItems: [],
              },
              {
                id: 1001,
                to: "/sat/hitachiDetails",
                name: "Hitachi -Upload & Download",
                subItems: [],
              },
              {
                id: 16,
                to: "/sat/staticQrLeads",
                name: "Static QR Leads",
                subItems: [],
              },
              {
                id: 17,
                to: "/sat/staticQRinventory",
                name: "Static QR Inventory",
                subItems: [],
              },
              {
                id: 19,
                to: "/sat/OnboardingExistingMerchants",
                name: "Onboarding Existing Merchants",
                subItems: [],
              },

              {
                id: 27,
                to: "/sat/hitachiIndianBankOnboarding",
                name: "Hitachi Indian Bank Onboarding",
                subItems: [],
              },
              {
                id:28,
                to:"/sat/equitasSoundboxOnboarding",
                name: "Equitas SoundBox Onboarding",
              }
            ],
          },

          {
            id: 28,
            to: "/sat/master/Other",
            name: "Other",
            subItems: [
              {
                id: 30,
                to: "/sat/dashboardPhonepe",
                name: "Dashboard",
                subItems: [],
              },
              {
                id: 31,
                to: "/sat/aggregator/lead/validation",
                name: "Lead Validation",
                subItems: [],
              },
              {
                id: 32,
                to: "/sat/AggregatorsLostOrStolen",
                name: "Lost/Stolen",
                subItems: [],
              },
              {
                id: 33,
                to: "/sat/AggregatorGlobalSearchFilter",
                name: "Global Serial Number/TID Search",
                subItems: [],
              },
              {
                id: 3,
                to: "/sat/aggOpenMerchantTracker",
                name: "Open Merchant tracker",
                subItems: [],
              },
              {
                id: 34,
                to: "/sat/AggregatorInventory",
                name: "Regional Inventory",
                subItems: [],
              },
              {
                id: 41,
                to: "/sat/TestingRecovery",
                name: "PhonePe Device Recovery",
              },
              {
                id: 14,
                to: "/sat/AggregatorDeviceRecovery",
                name: "Mobikwik Device Recovery",
              },
              {
                id: 35,
                to: "/sat/externalimplementationRequest",
                name: "Implementation Queue",
                subItems: [],
              },
              {
                id: 9,
                to: "/sat/AggregatorMasterTracker",
                name: "Master Tracker-Implemented",
                subItems: [],
              },
              {
                id: 88,
                to: "/sat/AggregatorServiceTicket",
                name: "SAT - Service Verification",
                subItems: [],
              },
              {
                id: 13,
                to: "/sat/AggregatorVerificationQueue",
                name: "Implemented Verification Queue",
                subItems: [],
              },
              {
                id: 73,
                to: "/sat/AggregatorDeactiveList",
                name: "Aggregator De-Active List ",
                subItems: []
              },
              {
                id: 36,
                to: "/sat/externalserviceRequest",
                name: "Service Request",
                subItems: [],
              },
              {
                id: 14,
                to: "/sat/AggregatorDeviceReplacement",
                name: "Device Replacement",
                subItems: [],
              },
              {
                id: 38,
                to: "/sat/demapping",
                name: "DE-Mapping",
                subItems: [],
              },
            ],
          },
        ],
        finance: [
          {
            id: 1,
            to: "/finance/payment/verification/tracker",
            name: "Payment Verification Tracker",
            icon: "verified_user",
          },
          {
            id: 2,
            to: "/finance/finance/approved/tracker",
            name: "Finance Approved Tracker",
            icon: "check_circle",
          },
          {
            id: 3,
            to: "/finance/lost/finance",
            name: "Lost/Stolen",
            icon: "report_problem",
          },
          {
            id: 4,
            to: "/finance/PosInventory",
            name: "Pos Inventory",
            icon: "inventory_2",
          },
        ],
        inventory: [
          {
            id: 1,
            to: "/inventory/master/Bijlipay",
            name: "Bijlipay",
            subItems: [
              {
                id: 1,
                to: "/inventory/home",
                name: "Dashboard",
                subItems: [],
              },
              {
                id: 2,
                to: "/inventory/central",
                name: "Central Inventory",
                subItems: [],
              },
              {
                id: 23,
                to: "/inventory/staticQrBankPortalInventory",
                name: "Static QR - Request from Bank Portal",
                subItems: [],
              },
              {
                id: 3,
                to: "/inventory/master/SendToRepair",
                name: "SendToRepair",
                subItems: [],
              },
              {
                id: 64,
                to: "/inventory/master/spareParts",
                name: "Spare Parts",
                subItems: [],
              },
              {
                id: 4,
                to: "/inventory/master/MovedToScrap",
                name: "MovedToScrap",
                subItems: [],
              },
              {
                id: 15,
                to: "/inventory/master/Lost",
                name: "Lost/Stolen",
                subItems: [],
              },
              {
                id: 16,
                to: "/inventory/master/GlobalSearch",
                name: "Global Serial Number/TID Search",
                subItems: [],
              },
              {
                id: 21,
                to: "/inventory/master/InventoryRegion",
                name: "Inventory With Regions",
                subItems: [],
              },
              {
                id: 5,
                to: "/inventory/merchant",
                name: "Inventory with Merchant",
                subItems: [],
              },
              {
                id: 6,
                to: "/inventory/faulty",
                name: "Regional return & Faulty Inventory",
                subItems: [],
              },

              {
                id: 8,
                to: "/inventory/podlist",
                name: "POD Updated List",
                subItems: [],
              },
              {
                id: 9,
                to: "/inventory/inventorywithso",
                name: "Inventory with SO",
                subItems: [],
              },
              {
                id: 10,
                to: "/inventory/inventorywithresellar",
                name: "Inventory with Resellar",
                subItems: [],
              },
              {
                id: 12,
                to: "/inventory/master/Reports",
                name: "Reports",
                subItems: [],
              },
              {
                id: 13,
                to: "/inventory/master/generateQR",
                name: "Generate QR",
                subItems: [],
              },

              {
                id: 14,
                to: "/inventory/master/simStatus",
                name: "Sim Status",
                subItems: [],
              },
            ],
          },
          {
            id: 2,
            to: "/inventory/master/Others",
            name: "Others",
            subItems: [
              {
                id: 1,
                to: "/inventory/Phonepehome",
                name: "Dashboard",
                subItems: [],
              },
              {
                id: 2,
                to: "/inventory/PhonepeInventory",
                name: "Central Inventory",
                subItems: [],
              },
              {
                id: 3,
                to: "/inventory/AggregatorsSendToRepair",
                name: "Send To Repair",
                subItems: [],
              },
              {
                id: 64,
                to: "/inventory/master/AggregatorsspareParts",
                name: "Spare Parts",
                subItems: [],
              },
              {
                id: 4,
                to: "/inventory/AggregatorsMovedToScrap",
                name: " MovedToScrap",
                subItems: [],
              },

              {
                id: 15,
                to: "/inventory/AggregatorsLost",
                name: "Lost/Stolen",
                subItems: [],
              },

              {
                id: 16,
                to: "/inventory/master/PhonepeGlobalSearch",
                name: "Global Serial Number/TID Search",
                subItems: [],
              },
              {
                id: 21,
                to: "/inventory/master/PhonepeInventoryRegion",
                name: "Inventory With Regions",
                subItems: [],
              },
              {
                id: 5,
                to: "/inventory/Aggregatorsmerchant",
                name: "Inventory with Merchant",
                subItems: [],
              },
              {
                id: 38,
                to: "/inventory/AggregatorInventoryFaulty",
                name: "Regional return & Faulty Inventory",
                subItems: [],
              },

              {
                id: 36,
                to: "/inventory/Aggregatorpodlist",
                name: "POD Updated List",
                subItems: [],
              },
              {
                id: 37,
                to: "/inventory/AggregatorInventoryWithSO",
                name: "Inventory with SO",
                subItems: [],
              },
              {
                id: 25,
                to: "/inventory/master/PhonepeDeviceHistory",
                name: " Device History",
                subItems: [],
              },
              {
                id: 26,
                to: "/inventory/master/phonepePaperRoll",
                name: "Phonepe Paper Roll",
                subItems: [],
              },
            ],
          },

        ],
        ksn: [
          {
            id: 77,
            to: "/inventory/ksn",
            name: "KSN Enable",
          },
        ],
        bankOps: [
          {
            id: 1,
            to: "/bank/ops/assign/short/lead",
            name: "Assign Short Lead",
          },
          {
            id: 2,
            to: "/bank/ops/bank/merchant/tracker",
            name: "Merchant Tracker",
          },
        ],
        crm: [
          {
            id: 1,
            to: "/crm/phonepePendingCrm",
            name: "Phonepe Service Request",
            icon: "contact_support",
          },
          {
            id: 2,
            to: "/crm/bijlipayCrm",
            name: "Bijlipay Service Request",
            icon: "support_agent",
          },
          {
            id: 3,
            to: "/crm/globalTicketSearch",
            name: "Global Ticket Search",
            icon: "search",
          },
          {
            id: 288,
            to: "/crm/docviewer",
            name: "DOC View",
            icon: "visibility",
          },
          {
            id: 888,
            to: "/crm/serviceticket",
            name: "Service Ticket",
            icon: "confirmation_number",
          },
        ],
        opsHead: [
          {
            id: 2,
            to: "/ops/head/exceptions",
            name: "Exceptions",
            icon: "assignment_late",
            subItems: [],
          },
          {
            id: 3,
            to: null,
            name: "Reports",
            icon: "bar_chart",
            subItems: [
              {
                id: 1,
                name: "Lead Approval Tracker",
                to: "/ops/head/lead/approval/tracker",
              },
              {
                id: 2,
                name: "Sourcewise - Lead Tracker",
                to: "/ops/head/sourcewise/lead/tracker",
              },
              {
                id: 3,
                name: "Source & Region - Lead Tracker",
                to: "/ops/head/source/region/lead/tracker",
              },
              {
                id: 4,
                name: "In - active Merchant",
                to: "/ops/head/inactive/merchant/tracker",
              },
              {
                id: 5,
                name: "Month-old Inactive Merchant ",
                to: "/ops/head/month/old/inactive/merchant/tracker",
              },
              {
                id: 6,
                name: "Proxy Lead / Misselling",
                to: "/ops/head/proxy/lead/tracker",
              },
            ],
          },
        ],
        salesManager: [
          {
            id: 1,
            to: "/sales/manager/lead/allocation/tracker",
            name: "Lead Allocation Tracker",
            icon: "assignment",
          },
          {
            id: 2,
            to: "/sales/manager/leads/status",
            name: "Leads Status",
            icon: "query_stats",
          },
          {
            id: 3,
            to: "/sales/manager/revenue/trackers",
            name: "Revenue Trackers",
            icon: "payments",
          },
          {
            id: 4,
            to: "/sales/manager/pricing/exception/verification",
            name: "Pricing Exception Verification",
            icon: "fact_check",
          },
          {
            id: 6,
            to: "/sales/manager/aging/tracker/pending/leads",
            name: "Aging Tracker for Pending Leads",
            icon: "history",
          },
        ],
        superAdmin: [
          {
            id: 1,
            to: "/super/admin/dashboard/",
            name: "Dashboard",
          },
          {
            id: 2,
            to: "/super/admin/users/",
            name: "Users",
          },
          {
            id: 3,
            to: "/super/admin/hierarchy/",
            name: "Hierarchy",
          },
          {
            id: 4,
            to: "/super/admin/roles/permissions/",
            name: "Roles & Permissions",
          },
          {
            id: 5,
            to: "/super/admin/permissions/",
            name: "Permissions",
          },
          {
            id: 6,
            to: "/super/admin/regions/",
            name: "Regions",
          },
          {
            id: 22,
            to: "/super/admin/regionGroup/",
            name: "RegionGroup",
          },
          {
            id: 8,
            to: "/super/admin/pincodes",
            name: "Pincodes",
          },
          {
            id: 9,
            to: "/super/admin/manage/merchant/types",
            name: "Merchant and Document Types",
          },
          {
            id: 10,
            to: "/super/admin/manage/mdrCharges",
            name: "MDR Charges",
          },
          {
            id: 11,
            to: "/super/admin/manage/newRentalCharges",
            name: "Rental Charges",
          },
          {
            id: 14,
            to: "/super/admin/manage/mdr/bankSO",
            name: "Bank SO",
          },
          {
            id: 16,
            to: "/super/admin/manage/notifications",
            name: "Notifications",
          },
          {
            id: 17,
            to: "/super/admin/manage/QR/Sticker",
            name: "QRSticker",
          },
          {
            id: 19,
            to: "/super/admin/manage/existingmATMplan",
            name: "M-ATM",
          },
          {
            id: 20,
            to: "/super/admin/manage/multiTid",
            name: "Multi-TID",
          },
          {
            id: 21,
            to: "/super/admin/manage/prefixConfig",
            name: "prefix Config",
          },
          {
            id: 30,
            to: "/super/admin/sparePartsTypes",
            name: "Spare Parts Types",
          },
          {
            id: 31,
            to: "/super/admin/manage/serviceRequest",
            name: "Service Request",
          },
          {
            id: 25,
            to: "/super/admin/manage/aggregators",
            name: "Aggregators",
          },
          {
            id: 26,
            to: "/super/admin/manage/aggregatorsDevice",
            name: "Aggregators Device",
          },
          {
            id: 38,
            to: "/super/admin/manage/APISync",
            name: "MARS API SYNC",
            subItems: [],
          },
        ],
        Phonepeinventory: [
          {
            id: 1,
            to: "/inventory/master/Bijlipay",
            name: "Bijlipay",
            subItems: [
              {
                id: 1,
                to: "/inventory/home",
                name: "Dashboard",
                subItems: [],
              },
              {
                id: 2,
                to: "/inventory/central",
                name: "Central Inventory",
                subItems: [],
              },
              {
                id: 3,
                to: "/inventory/master/SendToRepair",
                name: "SendToRepair",
                subItems: [],
              },
              {
                id: 64,
                to: "/inventory/master/spareParts",
                name: "Spare Parts",
                subItems: [],
              },
              {
                id: 4,
                to: "/inventory/master/MovedToScrap",
                name: "MovedToScrap",
                subItems: [],
              },
              {
                id: 15,
                to: "/inventory/master/Lost",
                name: "Lost/Stolen",
                subItems: [],
              },
              {
                id: 16,
                to: "/inventory/master/GlobalSearch",
                name: "Global Serial Number/TID Search",
                subItems: [],
              },
              {
                id: 21,
                to: "/inventory/master/InventoryRegion",
                name: "Inventory With Regions",
                subItems: [],
              },
              {
                id: 5,
                to: "/inventory/merchant",
                name: "Inventory with Merchant",
                subItems: [],
              },
              {
                id: 6,
                to: "/inventory/faulty",
                name: "Regional return & Faulty Inventory",
                subItems: [],
              },

              {
                id: 8,
                to: "/inventory/podlist",
                name: "POD Updated List",
                subItems: [],
              },
              {
                id: 9,
                to: "/inventory/inventorywithso",
                name: "Inventory with SO",
                subItems: [],
              },
              {
                id: 10,
                to: "/inventory/inventorywithresellar",
                name: "Inventory with Resellar",
                subItems: [],
              },
              {
                id: 11,
                to: "/inventory/master/serialnumberupdate",
                name: "Serial Number Update",
                subItems: [],
              },
              {
                id: 12,
                to: "/inventory/master/Reports",
                name: "Reports",
                subItems: [],
              },
              {
                id: 13,
                to: "/inventory/master/generateQR",
                name: "Generate QR",
                subItems: [],
              },
            ],
          },
          {
            id: 2,
            to: "/inventory/master/Others",
            name: "Others",
            subItems: [
              {
                id: 1,
                to: "/inventory/Phonepehome",
                name: "Dashboard",
                subItems: [],
              },
              {
                id: 2,
                to: "/inventory/PhonepeInventory",
                name: "Central Inventory",
                subItems: [],
              },
              {
                id: 3,
                to: "/inventory/AggregatorsSendToRepair",
                name: "Send To Repair",
                subItems: [],
              },
              {
                id: 64,
                to: "/inventory/master/AggregatorsspareParts",
                name: "Spare Parts",
                subItems: [],
              },
              {
                id: 4,
                to: "/inventory/AggregatorsMovedToScrap",
                name: " MovedToScrap",
                subItems: [],
              },

              {
                id: 15,
                to: "/inventory/AggregatorsLost",
                name: "Lost/Stolen",
                subItems: [],
              },

              {
                id: 16,
                to: "/inventory/master/PhonepeGlobalSearch",
                name: "Global Serial Number/TID Search",
                subItems: [],
              },
              {
                id: 21,
                to: "/inventory/master/PhonepeInventoryRegion",
                name: "Inventory With Regions",
                subItems: [],
              },
              {
                id: 5,
                to: "/inventory/Aggregatorsmerchant",
                name: "Inventory with Merchant",
                subItems: [],
              },
              {
                id: 38,
                to: "/inventory/AggregatorInventoryFaulty",
                name: "Regional return & Faulty Inventory",
                subItems: [],
              },

              {
                id: 36,
                to: "/inventory/Aggregatorpodlist",
                name: "POD Updated List",
                subItems: [],
              },
              {
                id: 37,
                to: "/inventory/AggregatorInventoryWithSO",
                name: "Inventory with SO",
                subItems: [],
              },
              {
                id: 25,
                to: "/inventory/master/PhonepeDeviceHistory",
                name: " Device History",
                subItems: [],
              },

              {
                id: 26,
                to: "/inventory/master/phonepePaperRoll",
                name: "Phonepe Paper Roll",
                subItems: [],
              },
            ],
          },
        ],
      },
    };
  },

  created() {
    this.findMenuAuth();
  },
  beforeMount() {
    this.fnAjaxGetAllMenuList();
  },
  computed: {
    ...mapGetters("superAdminAggregators", ["getActiveCreatedAggregatorList"]),
    currentMenus() {
      let menuItems = [];
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (!userInfo) return [];

      // SAT Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_OPERATION_SAT)) {
        if (userInfo.region.regionAreaName == "VARANEEK") {
          menuItems = menuItems.concat(this.menus.varaneekSat);
        } else {
          const satMenu = this.menus.sat.find(m => m.name === this.selectedValueSat) || this.menus.sat[0];
          menuItems = menuItems.concat(satMenu.subItems);
        }
      }

      // Finance Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_FINANCE_HEAD) ||
          this.showMenu.includes(this.$ROLE_HIERARCHY_FINANCE_MANAGER) ||
          this.showMenu.includes(this.$ROLE_HIERARCHY_FINANCE_EXECUTIVE)) {
        menuItems = menuItems.concat(this.menus.finance);
      }

      // Inventory Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER)) {
        const invMenu = this.menus.inventory.find(m => m.name === this.selectedValue) || this.menus.inventory[0];
        menuItems = menuItems.concat(invMenu.subItems);
      }

      // KSN Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_KSN)) {
        menuItems = menuItems.concat(this.menus.ksn);
      }

      // Operations Head Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_OPERATIONS_HEAD)) {
        menuItems = menuItems.concat(this.menus.opsHead);
      }

      // Sales Manager Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_SALES_RSM) ||
          this.showMenu.includes(this.$ROLE_HIERARCHY_SALES_ASM) ||
          this.showMenu.includes(this.$ROLE_HIERARCHY_SALES_NATIONAL_HEAD)) {
        menuItems = menuItems.concat(this.menus.salesManager);
      }

      // Bank Ops Module
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_BANK_OPS)) {
        menuItems = menuItems.concat(this.menus.bankOps);
      }

      // CRM Module
      if (this.showMenu.includes(this.$HIERARCHY_CRM1)) {
        menuItems = menuItems.concat(this.menus.crm);
      }

      // Super Admin Module
      if (this.showMenu.includes(this.$ROLE_BIJLIPAY_MANAGER)) {
        menuItems = menuItems.concat(this.menus.superAdmin);
      }

      return menuItems;
    },
    showAggregatorSelect() {
      return (this.showMenu.includes(this.$ROLE_HIERARCHY_OPERATION_SAT) && JSON.parse(localStorage.getItem("u_i")).region.regionAreaName !== "VARANEEK") ||
             this.showMenu.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER);
    }
  },
  methods: {
    ...mapActions("superAdminAggregators", ["GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
    findMenuAuth() {
      const userInfo = localStorage.getItem("u_i");
      if (userInfo) {
        let authUserRoles = JSON.parse(userInfo).roles;
        let menuArr = [];
        _.map(authUserRoles, function (oo) {
          menuArr.push(oo.hierarchyRoleLevel);
        });
        this.showMenu = menuArr;
      }
    },
    handleAggregatorChange(val) {
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_OPERATION_SAT)) {
        this.selectedValueSat = val === "Bijlipay" ? "Bijlipay" : "Other";
        if (val === "Bijlipay") this.$router.push("/sat/dashboard");
        else if (val === 3) this.$router.push("/sat/dashboardPhonepe");
        else this.$router.push("/sat/dashboardMobikwik");
      } else if (this.showMenu.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER)) {
        this.selectedValue = val === "Bijlipay" ? "Bijlipay" : "Others";
        if (val === "Bijlipay") this.$router.push("/inventory/home");
        else if (val === 3) this.$router.push("/inventory/Phonepehome");
        else this.$router.push("/inventory/Mobikwikhome");
      }
    },
    fnMainToggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    fnAjaxGetAllMenuList() {
      this.GET_ACTIVE_CREATED_AGGREGATORS_LIST()
        .then(() => {
          let assumeArr = [{ label: "Bijlipay", value: "Bijlipay" }];
          this.getActiveCreatedAggregatorList.map((value) => {
            assumeArr.push({ label: value.name, value: value.id });
          });
          this.aggregatorOptions = assumeArr;
        })
        .catch(() => {
          this.aggregatorOptions = [];
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.aggregator-select {
  ::v-deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }
}
</style>
