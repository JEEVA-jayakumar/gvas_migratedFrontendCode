<template>
  <q-layout view="hHh Lpr lFf">
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
      style="background-color: #531b64 !important;"
    >
      <SidebarMenu :menus="menus" />
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
        {
          id: 5,
          to: "/sales/manager/leads/pending/assignment",
          name: "Leads Pending Assignment",
          icon: "assignment_ind",
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
::v-deep(.menu-list) {
  background-color: #531b64 !important;
}

::v-deep(.menu-item) {
  color: #e3e4e5 !important;
  font-size: 14px;
  border-radius: 0 !important;
  margin-right: 0 !important;
}

::v-deep(.menu-item:hover) {
  background: #7d428f !important;
  color: #e3e4e5 !important;
}

::v-deep(.menu-item-active),
::v-deep(.q-router-link--active) {
  background: #3b084b !important;
  color: #e3e4e5 !important;
}

::v-deep(.active-indicator) {
  display: none;
}
</style>
