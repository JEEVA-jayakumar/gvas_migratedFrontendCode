<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-custom-light-grey" flat>
      <customHeader
        :propGetUserName="getUserName"
        :leftDrawerOpen="leftDrawerOpen"
        @fnToggleSideMenu="toggleSideMenu"
      />
    </q-header>

    <q-drawer
      class="shadow-9"
      v-model="leftDrawerOpen"
      @update:model-value="updateLeftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="500"
      style="background-color: #531b64 !important;"
    >
      <q-scroll-area style="height: 100%" :thumb-style="thumbStyle">
        <SidebarMenu :menus="menus" />
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <router-view v-slot="{ Component }">
        <transition
          appear
          v-on:before-enter="beforeEnter"
          v-on:after-enter="afterEnter"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <div :key="$route.fullPath">
            <component :is="Component" />
          </div>
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
    SidebarMenu
  },
  data() {
    return {
      leftDrawerOpen: false,
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#61116a",
        width: "5px",
        opacity: 0.75,
      },
      menus: [
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
        },
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
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    beforeEnter(el) {
      this.TOGGLE_COMMON_LOADER(true);
    },
    afterEnter(el) {
      this.TOGGLE_COMMON_LOADER(false);
    },
    toggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      localStorage.setItem("leftDrawerOpen", this.leftDrawerOpen);
    },
    updateLeftDrawerOpen(val) {
      this.leftDrawerOpen = val;
      localStorage.setItem("leftDrawerOpen", val);
    },
  },
};
</script>

<style scoped>
</style>
