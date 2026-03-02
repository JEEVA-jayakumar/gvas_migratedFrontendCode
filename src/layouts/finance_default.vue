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
        <SidebarMenu :menus="menus" />
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <customBody />
    </q-page-container>
  </q-layout>
</template>

<script>
import customHeader from "../components/customHeader.vue";
import customBody from "../components/customBody.vue";
import SidebarMenu from "../components/SidebarMenu.vue";

export default {
  name: "FinanceLayout",
  components: {
    customHeader,
    customBody,
    SidebarMenu,
  },
  data() {
    return {
      leftDrawerOpen: this.$q.localStorage.getItem("leftDrawerOpen") !== null
        ? this.$q.localStorage.getItem("leftDrawerOpen")
        : this.$q.platform.is.desktop,
      menus: [
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
    };
  },
  methods: {
    fnMainToggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

<style>
</style>
