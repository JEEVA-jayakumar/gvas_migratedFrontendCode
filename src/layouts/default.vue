<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white border-bottom" flat>
      <customHeader
        :leftDrawerOpen="leftDrawerOpen"
        @fnToggleSideMenu="fnMainToggleSideMenu"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="260"
      :mini-width="80"
      :breakpoint="500"
      class="sidebar-drawer text-white"
    >
      <q-scroll-area class="fit" :thumb-style="thumbStyle">
        <div class="q-px-md q-pt-md" v-if="showAggregatorSelect && !miniState">
          <q-select
            filled
            v-model="selectedValue"
            label="Module View"
            color="white"
            dark
            dense
            :options="aggregatorOptions"
            emit-value
            map-options
            @update:model-value="handleAggregatorChange"
            class="aggregator-select"
          />
        </div>

        <div class="q-py-md" v-if="miniState">
           <div class="flex flex-center q-mb-md">
             <q-icon name="dashboard" size="24px" color="white" />
           </div>
        </div>

        <SidebarMenu :menus="currentMenus" :mini="miniState" />
      </q-scroll-area>

      <!-- Mini toggle footer -->
      <div class="absolute-bottom q-pa-sm flex flex-center" v-if="!$q.platform.is.mobile">
        <q-btn
          flat
          round
          dense
          :icon="miniState ? 'chevron_right' : 'chevron_left'"
          @click="miniState = !miniState"
          color="white"
          class="mini-toggle-btn"
        />
      </div>
    </q-drawer>

    <q-page-container class="bg-slate-50">
      <customBody :key="$route.fullPath" />
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
        ? (this.$q.localStorage.getItem("leftDrawerOpen") === true || this.$q.localStorage.getItem("leftDrawerOpen") === 'true')
        : (this.$q.platform.is.desktop && this.$route.name != 'leadDataEntry'),
      miniState: false,
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: '4px',
        opacity: 0.75,
      },
      menuListName: 'Bijlipay',
      menuListNameSat: 'Bijlipay',
      aggregatorOptions: [],
      showMenu: [],
      selectedValue: "Bijlipay",
      selectedValueSat: "Bijlipay",
      menus: {
        varaneekSat: [
        {
            id: 3,
            to: '/sat/lead/lead/dataentry',
            name: 'Lead Creation',
            icon: 'add_circle'
          },
          {
            id: 1,
            to: '/sat/lead/validation',
            name: 'Lead Validation',
            icon: 'rule'
          },
          {
            id: 8,
            to: '/sat/varaneekimplementationRequest',
            name: 'Lead Status',
            icon: 'hourglass_empty',
            subItems: []
          }
        ],
        sat: [
          {
            id: 1,
            to: "/sat/master/BijlipaySat",
            name: "Bijlipay",
            icon: 'business',
            subItems: [
              {
                id: 0,
                to: "/sat/dashboard",
                name: "Dashboard",
                icon: 'dashboard',
              },
              {
                id: 1,
                to: "/sat/lead/validation",
                name: "Lead Validation",
                icon: 'fact_check',
              },
              {
                id: 21,
                to: "/sat/additionalTid",
                name: "Additional Terminals",
                icon: 'app_registration',
              },
              {
                id: 15,
                to: "/sat/change/management",
                name: "Change Management",
                icon: 'edit_note',
              },
              {
                id: 20,
                to: "/sat/internalLostOrStolen",
                name: "Lost/Stolen",
                icon: 'report_off',
              },
              {
                id: 22,
                to: "/sat/InternalGlobalSearchFilter",
                name: "Global Search",
                icon: 'search',
              },

              {
                id: 2,
                to: "/sat/exception/queue",
                name: "Exception Queue",
                icon: 'error_outline',
              },
              {
                id: 3,
                to: "/sat/open/merchant/tracker",
                name: "Open Merchant Tracker",
                icon: 'track_changes',
              },
              {
                id: 7,
                to: "/sat/internalRegionalInventory",
                name: "Regional Inventory",
                icon: 'inventory_2',
              },
              {
                id: 8,
                to: "/sat/internalimplementationRequest",
                name: "Implementation Queue",
                icon: 'queue',
              },
              {
                id: 9,
                to: "/sat/master/tracker",
                name: "Master Tracker",
                icon: 'assignment_turned_in',
              },
              {
                id: 10,
                to: "/sat/device/recovery/tracker",
                name: "Recovery Tracker",
                icon: 'settings_backup_restore',
              },
              {
                id: 12,
                to: "/sat/lead/lead/dataentry",
                name: "Lead Creation",
                icon: 'person_add',
              },
              {
                id: 13,
                to: "/sat/lead/lead/view/audocuments",
                name: "Verification Queue",
                icon: 'verified',
              },
              {
               id: 78,
               to: "/sat/deactivelist",
               name: "De-Active List ",
               icon: 'person_off'
              },
              {
                id: 14,
                to: "/sat/device/replacement",
                name: "Device Replacement",
                icon: 'swap_horiz',
              },
              {
                id: 1001,
                to: "/sat/hitachiDetails",
                name: "Hitachi - U/D",
                icon: 'cloud_sync',
              },
              {
                id: 16,
                to: "/sat/staticQrLeads",
                name: "Static QR Leads",
                icon: 'qr_code_2',
              },
              {
                id: 17,
                to: "/sat/staticQRinventory",
                name: "Static QR Inventory",
                icon: 'qr_code',
              },
              {
                id: 19,
                to: "/sat/OnboardingExistingMerchants",
                name: "Existing Merchants",
                icon: 'group_add',
              },

              {
                id: 27,
                to: "/sat/hitachiIndianBankOnboarding",
                name: "Indian Bank Onboarding",
                icon: 'account_balance',
              },
              {
                id:28,
                to:"/sat/equitasSoundboxOnboarding",
                name: "Equitas SoundBox",
                icon: 'speaker',
              }
            ],
          },

          {
            id: 28,
            to: "/sat/master/Other",
            name: "Other",
            icon: 'more_horiz',
            subItems: [
              {
                id: 30,
                to: "/sat/dashboardPhonepe",
                name: "Dashboard",
                icon: 'dashboard',
              },
              {
                id: 31,
                to: "/sat/aggregator/lead/validation",
                name: "Lead Validation",
                icon: 'fact_check',
              },
              {
                id: 32,
                to: "/sat/AggregatorsLostOrStolen",
                name: "Lost/Stolen",
                icon: 'report_off',
              },
              {
                id: 33,
                to: "/sat/AggregatorGlobalSearchFilter",
                name: "Global Search",
                icon: 'search',
              },
              {
                id: 3,
                to: "/sat/aggOpenMerchantTracker",
                name: "Open Merchant Tracker",
                icon: 'track_changes',
              },
              {
                id: 34,
                to: "/sat/AggregatorInventory",
                name: "Regional Inventory",
                icon: 'inventory_2',
              },
              {
                id: 41,
                to: "/sat/TestingRecovery",
                name: "PhonePe Recovery",
                icon: 'history',
              },
              {
                id: 14,
                to: "/sat/AggregatorDeviceRecovery",
                name: "Mobikwik Recovery",
                icon: 'restore',
              },
              {
                id: 35,
                to: "/sat/externalimplementationRequest",
                name: "Implementation Queue",
                icon: 'queue',
              },
              {
                id: 9,
                to: "/sat/AggregatorMasterTracker",
                name: "Master Tracker",
                icon: 'assignment_turned_in',
              },
              {
                id: 88,
                to: "/sat/AggregatorServiceTicket",
                name: "Service Verification",
                icon: 'verified',
              },
              {
                id: 13,
                to: "/sat/AggregatorVerificationQueue",
                name: "Verification Queue",
                icon: 'rule',
              },
              {
                id: 73,
                to: "/sat/AggregatorDeactiveList",
                name: "De-Active List ",
                icon: 'person_off'
              },
              {
                id: 36,
                to: "/sat/externalserviceRequest",
                name: "Service Request",
                icon: 'support_agent',
              },
              {
                id: 14,
                to: "/sat/AggregatorDeviceReplacement",
                name: "Device Replacement",
                icon: 'swap_horiz',
              },
              {
                id: 38,
                to: "/sat/demapping",
                name: "DE-Mapping",
                icon: 'link_off',
              },
            ],
          },
        ],
        finance: [
          {
            id: 1,
            to: "/finance/payment/verification/tracker",
            name: "Payment Verification",
            icon: "verified_user",
          },
          {
            id: 2,
            to: "/finance/finance/approved/tracker",
            name: "Approved Tracker",
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
            icon: 'warehouse',
            subItems: [
              {
                id: 1,
                to: "/inventory/home",
                name: "Dashboard",
                icon: 'dashboard',
              },
              {
                id: 2,
                to: "/inventory/central",
                name: "Central Inventory",
                icon: 'hub',
              },
              {
                id: 23,
                to: "/inventory/staticQrBankPortalInventory",
                name: "Static QR - Bank",
                icon: 'qr_code_scanner',
              },
              {
                id: 3,
                to: "/inventory/master/SendToRepair",
                name: "Send To Repair",
                icon: 'build',
              },
              {
                id: 64,
                to: "/inventory/master/spareParts",
                name: "Spare Parts",
                icon: 'settings_input_component',
              },
              {
                id: 4,
                to: "/inventory/master/MovedToScrap",
                name: "Moved To Scrap",
                icon: 'delete_sweep',
              },
              {
                id: 15,
                to: "/inventory/master/Lost",
                name: "Lost/Stolen",
                icon: 'report_off',
              },
              {
                id: 16,
                to: "/inventory/master/GlobalSearch",
                name: "Global Search",
                icon: 'search',
              },
              {
                id: 21,
                to: "/inventory/master/InventoryRegion",
                name: "Regional Inventory",
                icon: 'location_city',
              },
              {
                id: 5,
                to: "/inventory/merchant",
                name: "Merchant Inventory",
                icon: 'storefront',
              },
              {
                id: 6,
                to: "/inventory/faulty",
                name: "Faulty Inventory",
                icon: 'error',
              },

              {
                id: 8,
                to: "/inventory/podlist",
                name: "POD Updated List",
                icon: 'list_alt',
              },
              {
                id: 9,
                to: "/inventory/inventorywithso",
                name: "Inventory with SO",
                icon: 'groups',
              },
              {
                id: 10,
                to: "/inventory/inventorywithresellar",
                name: "Inventory with Resellar",
                icon: 'handshake',
              },
              {
                id: 12,
                to: "/inventory/master/Reports",
                name: "Reports",
                icon: 'analytics',
              },
              {
                id: 13,
                to: "/inventory/master/generateQR",
                name: "Generate QR",
                icon: 'qr_code',
              },

              {
                id: 14,
                to: "/inventory/master/simStatus",
                name: "Sim Status",
                icon: 'sim_card',
              },
            ],
          },
          {
            id: 2,
            to: "/inventory/master/Others",
            name: "Others",
            icon: 'more_horiz',
            subItems: [
              {
                id: 1,
                to: "/inventory/Phonepehome",
                name: "Dashboard",
                icon: 'dashboard',
              },
              {
                id: 2,
                to: "/inventory/PhonepeInventory",
                name: "Central Inventory",
                icon: 'hub',
              },
              {
                id: 3,
                to: "/inventory/AggregatorsSendToRepair",
                name: "Send To Repair",
                icon: 'build',
              },
              {
                id: 64,
                to: "/inventory/master/AggregatorsspareParts",
                name: "Spare Parts",
                icon: 'settings_input_component',
              },
              {
                id: 4,
                to: "/inventory/AggregatorsMovedToScrap",
                name: " Moved To Scrap",
                icon: 'delete_sweep',
              },

              {
                id: 15,
                to: "/inventory/AggregatorsLost",
                name: "Lost/Stolen",
                icon: 'report_off',
              },

              {
                id: 16,
                to: "/inventory/master/PhonepeGlobalSearch",
                name: "Global Search",
                icon: 'search',
              },
              {
                id: 21,
                to: "/inventory/master/PhonepeInventoryRegion",
                name: "Regional Inventory",
                icon: 'location_city',
              },
              {
                id: 5,
                to: "/inventory/Aggregatorsmerchant",
                name: "Merchant Inventory",
                icon: 'storefront',
              },
              {
                id: 38,
                to: "/inventory/AggregatorInventoryFaulty",
                name: "Faulty Inventory",
                icon: 'error',
              },

              {
                id: 36,
                to: "/inventory/Aggregatorpodlist",
                name: "POD Updated List",
                icon: 'list_alt',
              },
              {
                id: 37,
                to: "/inventory/AggregatorInventoryWithSO",
                name: "Inventory with SO",
                icon: 'groups',
              },
              {
                id: 25,
                to: "/inventory/master/PhonepeDeviceHistory",
                name: " Device History",
                icon: 'history',
              },
              {
                id: 26,
                to: "/inventory/master/phonepePaperRoll",
                name: "Paper Roll",
                icon: 'scroll',
              },
            ],
          },

        ],
        ksn: [
          {
            id: 77,
            to: "/inventory/ksn",
            name: "KSN Enable",
            icon: 'key',
          },
        ],
        bankOps: [
          {
            id: 1,
            to: "/bank/ops/assign/short/lead",
            name: "Assign Short Lead",
            icon: 'assignment_ind',
          },
          {
            id: 2,
            to: "/bank/ops/bank/merchant/tracker",
            name: "Merchant Tracker",
            icon: 'track_changes',
          },
        ],
        crm: [
          {
            id: 1,
            to: "/crm/phonepePendingCrm",
            name: "Phonepe Request",
            icon: "contact_support",
          },
          {
            id: 2,
            to: "/crm/bijlipayCrm",
            name: "Bijlipay Request",
            icon: "support_agent",
          },
          {
            id: 3,
            to: "/crm/globalTicketSearch",
            name: "Ticket Search",
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
                name: "Approval Tracker",
                to: "/ops/head/lead/approval/tracker",
                icon: 'check_circle'
              },
              {
                id: 2,
                name: "Sourcewise Tracker",
                to: "/ops/head/sourcewise/lead/tracker",
                icon: 'query_stats'
              },
              {
                id: 3,
                name: "Region Tracker",
                to: "/ops/head/source/region/lead/tracker",
                icon: 'public'
              },
              {
                id: 4,
                name: "Inactive Merchant",
                to: "/ops/head/inactive/merchant/tracker",
                icon: 'person_off'
              },
              {
                id: 5,
                name: "Month-old Inactive ",
                to: "/ops/head/month/old/inactive/merchant/tracker",
                icon: 'history'
              },
              {
                id: 6,
                name: "Proxy Lead",
                to: "/ops/head/proxy/lead/tracker",
                icon: 'warning'
              },
            ],
          },
        ],
        salesManager: [
          {
            id: 1,
            to: "/sales/manager/lead/allocation/tracker",
            name: "Allocation Tracker",
            icon: 'assignment_ind'
          },
          {
            id: 2,
            to: "/sales/manager/leads/status",
            name: "Leads Status",
            icon: 'hourglass_empty'
          },
          {
            id: 3,
            to: "/sales/manager/revenue/trackers",
            name: "Revenue Trackers",
            icon: 'payments'
          },
          {
            id: 4,
            to: "/sales/manager/pricing/exception/verification",
            name: "Exception Approval",
            icon: 'rule'
          },
          {
            id: 5,
            to: "/sales/manager/leads/pending/assignment",
            name: "Pending Assignment",
            icon: 'pending_actions'
          },
          {
            id: 6,
            to: "/sales/manager/aging/tracker/pending/leads",
            name: "Aging Tracker",
            icon: 'history'
          },
        ],
        superAdmin: [
          {
            id: 1,
            to: "/super/admin/dashboard/",
            name: "Dashboard",
            icon: 'dashboard'
          },
          {
            id: 2,
            to: "/super/admin/users/",
            name: "Users",
            icon: 'people'
          },
          {
            id: 3,
            to: "/super/admin/hierarchy/",
            name: "Hierarchy",
            icon: 'account_tree'
          },
          {
            id: 4,
            to: "/super/admin/roles/permissions/",
            name: "Roles & Permissions",
            icon: 'security'
          },
          {
            id: 5,
            to: "/super/admin/permissions/",
            name: "Permissions",
            icon: 'vpn_key'
          },
          {
            id: 6,
            to: "/super/admin/regions/",
            name: "Regions",
            icon: 'public'
          },
          {
            id: 22,
            to: "/super/admin/regionGroup/",
            name: "Region Group",
            icon: 'layers'
          },
          {
            id: 8,
            to: "/super/admin/pincodes",
            name: "Pincodes",
            icon: 'pin_drop'
          },
          {
            id: 9,
            to: "/super/admin/manage/merchant/types",
            name: "Merchant/Doc Types",
            icon: 'description'
          },
          {
            id: 10,
            to: "/super/admin/manage/mdrCharges",
            name: "MDR Charges",
            icon: 'currency_rupee'
          },
          {
            id: 11,
            to: "/super/admin/manage/newRentalCharges",
            name: "Rental Charges",
            icon: 'receipt'
          },
          {
            id: 14,
            to: "/super/admin/manage/mdr/bankSO",
            name: "Bank SO",
            icon: 'account_balance'
          },
          {
            id: 16,
            to: "/super/admin/manage/notifications",
            name: "Notifications",
            icon: 'notifications'
          },
          {
            id: 17,
            to: "/super/admin/manage/QR/Sticker",
            name: "QR Sticker",
            icon: 'qr_code'
          },
          {
            id: 19,
            to: "/super/admin/manage/existingmATMplan",
            name: "M-ATM",
            icon: 'atm'
          },
          {
            id: 20,
            to: "/super/admin/manage/multiTid",
            name: "Multi-TID",
            icon: 'vignette'
          },
          {
            id: 21,
            to: "/super/admin/manage/prefixConfig",
            name: "Prefix Config",
            icon: 'settings_input_component'
          },
          {
            id: 30,
            to: "/super/admin/sparePartsTypes",
            name: "Spare Parts Types",
            icon: 'settings'
          },
          {
            id: 31,
            to: "/super/admin/manage/serviceRequest",
            name: "Service Request",
            icon: 'support_agent'
          },
          {
            id: 25,
            to: "/super/admin/manage/aggregators",
            name: "Aggregators",
            icon: 'business'
          },
          {
            id: 26,
            to: "/super/admin/manage/aggregatorsDevice",
            name: "Aggregator Devices",
            icon: 'devices'
          },
          {
            id: 38,
            to: "/super/admin/manage/APISync",
            name: "MARS API Sync",
            icon: 'sync'
          },
        ],
      },
    };
  },

  created() {
    this.findMenuAuth();
    const selectedTab = this.$q.localStorage.getItem("selectedTab");
    if (selectedTab) {
      this.selectedValue = selectedTab;
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_OPERATION_SAT)) {
        this.selectedValueSat = (selectedTab === "Bijlipay" || selectedTab === "Other") ? selectedTab : "Bijlipay";
        this.menuListNameSat = this.selectedValueSat;
      }
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER)) {
        this.menuListName = selectedTab === "Bijlipay" ? "Bijlipay" : "Others";
      }
    }
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
          if (satMenu && satMenu.subItems) {
            menuItems = menuItems.concat(satMenu.subItems);
          }
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
        const invMenu = this.menus.inventory.find(m => m.name === this.menuListName) || this.menus.inventory[0];
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
      this.$q.localStorage.set("selectedTab", val);
      this.selectedValue = val;
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_OPERATION_SAT)) {
        this.selectedValueSat = (val === "Bijlipay" || val === "Other") ? val : "Other";
        this.menuListNameSat = this.selectedValueSat;
        if (val === "Bijlipay") this.$router.push("/sat/dashboard");
        else if (val === 3) this.$router.push("/sat/dashboardPhonepe");
        else if (val === 4) this.$router.push("/sat/dashboardMobikwik");
        else this.$router.push("/sat/dashboard");
      }
      if (this.showMenu.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER)) {
        this.menuListName = val === "Bijlipay" ? "Bijlipay" : "Others";
        if (val === "Bijlipay") this.$router.push("/inventory/home");
        else if (val === 3) this.$router.push("/inventory/Phonepehome");
        else this.$router.push("/inventory/Mobikwikhome");
      }
    },
    fnMainToggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      this.$q.localStorage.set("leftDrawerOpen", this.leftDrawerOpen);
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
.sidebar-drawer {
  background: #531b64 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.aggregator-select {
  ::v-deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.12);
    }
  }
}

.mini-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.bg-slate-50 {
  background-color: #f8fafc;
}

.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
</style>
