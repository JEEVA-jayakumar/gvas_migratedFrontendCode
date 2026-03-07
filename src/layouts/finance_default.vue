<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white" flat>
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
      leftDrawerOpen: false,
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

