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
  name: "OpsHeadLayout",
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
              name: "Lead Approval Tracker",
              to: "/ops/head/lead/approval/tracker",
            },
            {
              id: 2,
              name: "Sourcewise - Lead Tracker",
              to: "/ops/head/sourcewise/lead/tracker",
            },
            {
              id: 3,
              name: "Source & Region - Lead Tracker",
              to: "/ops/head/source/region/lead/tracker",
            },
            {
              id: 4,
              name: "In - active Merchant",
              to: "/ops/head/inactive/merchant/tracker",
            },
            {
              id: 5,
              name: "Month-old Inactive Merchant ",
              to: "/ops/head/month/old/inactive/merchant/tracker",
            },
            {
              id: 6,
              name: "Proxy Lead / Misselling",
              to: "/ops/head/proxy/lead/tracker",
            },
          ],
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
