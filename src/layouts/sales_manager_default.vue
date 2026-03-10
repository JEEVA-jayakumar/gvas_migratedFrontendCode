<template>
  <q-layout view="lHh Lpr lFf">
     <q-header style="margin-left:0px" class="shadow-0 z-top" flat>
      <customHeader
        :leftDrawerOpen="leftDrawerOpen"
        :propGetUserName="getUserName"
        @fnToggleSideMenu="fnMainToggleSideMenu"
      />
    </q-header>

    <q-drawer
      class="shadow-9"
      v-model="leftDrawerOpen"
      @update:model-value="updateLeftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="500"
      :content-style="{backgroundColor: '#202c3f', width:'250px'}"
    >
      <SidebarMenu :menus="menus" style="padding-top: 65px" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import customHeader from "../components/customHeader.vue";
import SidebarMenu from "../components/SidebarMenu.vue";

export default {
  components: {
    customHeader,
    SidebarMenu
  },
  name: "SalesManagerLayout",
  data() {
    return {
      leftDrawerOpen: false,
      menus: [
        {
          id: 1,
          to: "/sales/manager/lead/allocation/tracker",
          name: "Lead Allocation Tracker",
        },
        {
          id: 2,
          to: "/sales/manager/leads/status",
          name: "Leads Status",
        },
        {
          id: 3,
          to: "/sales/manager/revenue/trackers",
          name: "Revenue Trackers",
        },
        {
          id: 4,
          to: "/sales/manager/pricing/exception/verification",
          name: "Exception Approval",
        },
        {
          id: 6,
          to: "/sales/manager/aging/tracker/pending/leads",
          name: "Aging Tracker for Pending Leads",
        },
      ],
    };
  },
  computed: {
    getUserName() {
      try {
        const userInfo = JSON.parse(localStorage.getItem("u_i"));
        return userInfo?.user?.name || "Sales Manager";
      } catch (e) {
        return "Sales Manager";
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
    fnMainToggleSideMenu() {
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
/* Standardized Sidebar Identity for Portal Sidebars */
:deep(.menu-list) {
  background-color: #202c3f !important;
}

:deep(.menu-item) {
  color: #e3e4e5 !important;
  font-size: 14px;
  border-radius: 0 !important;
  margin-right: 0 !important;
  padding: 12px 25px;
}

:deep(.menu-item:hover) {
  background: rgba(56, 69, 90, 0.98) !important;
  color: #e3e4e5 !important;
}

:deep(.menu-item-active),
:deep(.q-router-link--active),
:deep(.q-router-link-active) {
  background: rgba(0, 0, 0, 0.4) !important;
  color: #e3e4e5 !important;
}

:deep(.q-item-section--avatar) {
  display: none !important;
}

:deep(.active-indicator) {
  display: none;
}
</style>
