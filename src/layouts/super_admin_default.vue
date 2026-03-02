<template>
  <q-layout view="lHh Lpr lFf">
    <customHeader
      :getUserName="getUserName"
      :leftDrawerOpen="leftDrawerOpen"
      @toggleSideMenu="toggleSideMenu"
    />

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :breakpoint="500"
      class="bg-dark text-white shadow-1"
    >
      <div class="drawer-header q-pa-md row items-center justify-center">
        <img src="~assets/images/logo.png" style="height: 45px" />
      </div>

      <q-scroll-area class="fit drawer-scroll-area">
        <SidebarMenu :menus="menus" />
      </q-scroll-area>

      <div class="drawer-footer q-pa-md text-center text-grey-5 text-caption">
        Version 2.0.0
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import customHeader from "../components/customHeader.vue";
import SidebarMenu from "../components/SidebarMenu.vue";

export default {
  name: "DefaultLayoutSuperAdmin",
  components: {
    customHeader,
    SidebarMenu,
  },
  data() {
    return {
      leftDrawerOpen: false,
      menus: [
        { id: 1, to: "/super/admin/dashboard", name: "Dashboard", icon: "dashboard" },
        {
          id: 2,
          name: "User Management",
          icon: "people",
          subItems: [
            { id: 21, to: "/super/admin/users", name: "Users", icon: "person" },
            { id: 22, to: "/super/admin/hierarchy", name: "Hierarchy", icon: "account_tree" },
            { id: 23, to: "/super/admin/roles/permissions", name: "Roles & Permissions", icon: "security" },
            { id: 24, to: "/super/admin/permissions", name: "Permissions", icon: "vpn_key" },
          ],
        },
        {
          id: 3,
          name: "Location Settings",
          icon: "location_on",
          subItems: [
            { id: 31, to: "/super/admin/regions", name: "Regions", icon: "map" },
            { id: 32, to: "/super/admin/regionGroup", name: "Region Groups", icon: "layers" },
            { id: 33, to: "/super/admin/subregions", name: "Sub Regions", icon: "location_city" },
            { id: 34, to: "/super/admin/pincodes", name: "Pincodes", icon: "pin_drop" },
          ],
        },
        {
          id: 4,
          name: "Financial Config",
          icon: "payments",
          subItems: [
            { id: 41, to: "/super/admin/manage/rental/charges", name: "Rental Charges", icon: "receipt_long" },
            { id: 42, to: "/super/admin/manage/mdr/charges", name: "MDR Charges", icon: "request_quote" },
            { id: 43, to: "/super/admin/manage/mdr/bankSO", name: "Bank SO", icon: "account_balance" },
          ],
        },
        {
          id: 5,
          name: "Device & Service",
          icon: "devices",
          subItems: [
            { id: 51, to: "/super/admin/device/types", name: "Device Types", icon: "devices_other" },
            { id: 52, to: "/super/admin/manage/serviceRequest", name: "Service Requests", icon: "support_agent" },
            { id: 53, to: "/super/admin/manage/mATMplan", name: "mATM Plans", icon: "payment" },
            { id: 54, to: "/super/admin/manage/existingmATMplan", name: "Existing mATM Plans", icon: "history" },
            { id: 55, to: "/super/admin/manage/QR/Sticker", name: "QR Stickers", icon: "qr_code" },
            { id: 56, to: "/super/admin/manage/aggregators", name: "Aggregators", icon: "business" },
            { id: 57, to: "/super/admin/manage/prefixConfig", name: "Prefix Config", icon: "settings_input_component" },
            { id: 58, to: "/super/admin/manage/multiTid", name: "Multi TID", icon: "dynamic_feed" },
          ],
        },
        { id: 6, to: "/super/admin/manage/notifications", name: "Notifications", icon: "notifications" },
        { id: 7, to: "/super/admin/manage/APISync", name: "API Sync", icon: "sync" },
      ],
    };
  },
  computed: {
    ...mapGetters("commonLoader", ["getToggleCommonLoader"]),
    getUserName() {
      try {
        const userInfo = JSON.parse(localStorage.getItem("u_i"));
        return userInfo?.user?.name || "Super Admin";
      } catch (e) {
        return "Super Admin";
      }
    },
  },
  created() {
    const savedState = localStorage.getItem("leftDrawerOpen");
    this.leftDrawerOpen = savedState === null ? true : savedState === "true";
  },
  methods: {
    toggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      localStorage.setItem("leftDrawerOpen", this.leftDrawerOpen);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-scroll-area {
  height: calc(100% - 150px);
  margin-top: 20px;
}
.drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}
.drawer-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.1);
}
</style>
