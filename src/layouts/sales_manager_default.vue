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
      style="background-color: #531b64 !important;"
    >
      <q-scroll-area style="height: 100%" :thumb-style="{
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#61116a',
        width: '5px',
        opacity: 0.75,
      }">
        <SidebarMenu :menus="menus" style="padding-top: 65px" />
      </q-scroll-area>
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
</style>
