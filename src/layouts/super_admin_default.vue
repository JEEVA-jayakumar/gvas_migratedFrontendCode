<template>
  <q-layout view="lHh Lpr lFf">
    <q-header flat>
      <customHeader
        :getUserName="getUserName"
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
      <q-list
        no-border
        inset-delimiter
        highlight
        style="padding-top:65px"
      >
        <q-item clickable v-for="menu in menus" :key="menu.id" :to="menu.to" class="menu-main-item-color-SA">
          <q-item-section class="menu-item-color-SA">{{menu.name}}</q-item-section>
        </q-item>
      </q-list>
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
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import customHeader from "../components/customHeader.vue";

export default {
  name: "DefaultLayoutSuperAdmin",
  components: {
    customHeader,
  },
  data() {
    return {
      leftDrawerOpen: false,
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
.menu-item-color-SA {
  color: #e3e4e5 !important;
  font-size: 14px;
}
.menu-main-item-color-SA:hover {
  color: #e3e4e5 !important;
  font-size: 14px;
  background: #7d428f !important;
}
.menu-main-item-color-SA:active {
  color: #e3e4e5 !important;
  font-size: 14px;
  background: #7d428f !important;
}

.menu-main-item-color-SA:focus {
  color: #e3e4e5 !important;
  font-size: 14px;
  background: #7d428f !important;
}

.q-item.q-router-link--active,
.q-item--active,
.q-item:focus {
  background: #3b084b !important;
  color: #e3e4e5 !important;
}
</style>
