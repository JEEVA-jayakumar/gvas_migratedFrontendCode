<template>
  <q-layout view="hHh Lpr lFf">
     <q-header style="margin-left:0px" class="shadow-0 z-top" flat>
      <customHeader
        :leftDrawerOpen="leftDrawerOpen"
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

    <q-page-container class="bg-grey-1">
      <customBody></customBody>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import customHeader from "../components/customHeader.vue";
import customBody from "../components/customBody.vue";
import SidebarMenu from "../components/SidebarMenu.vue";
export default {
  components: {
    customHeader,
    customBody,
    SidebarMenu,
  },
  name: "LayoutDefault",
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
          to: "/sales/manager/revenue/approval",
          name: "Exception Approval",
        },
        {
          id: 5,
          to: "/sales/manager/leads/pending/assignment",
          name: "Leads Pending Assignment",
        },
        {
          id: 6,
          to: "/sales/manager/aging/tracker/pending/leads",
          name: "Aging Tracker for Pending Leads",
        },
      ],
    };
  },
  created() {
    const savedState = localStorage.getItem("leftDrawerOpen");
    this.leftDrawerOpen = savedState === null ? true : savedState === "true";
  },
  methods: {
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

