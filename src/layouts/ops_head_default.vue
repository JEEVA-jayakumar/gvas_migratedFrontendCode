<template>
  <q-layout view="hHh Lpr lFf">
    <q-header flat>
      <customHeader
        :leftDrawerOpen="leftDrawerOpen"
        @fnToggleSideMenu="toggleSideMenu"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      @update:model-value="updateLeftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="500"
      class="shadow-9"
      style="background-color: #531b64 !important;"
    >
      <q-scroll-area style="height: 100%; margin-top: 65px;" :thumb-style="{
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
      leftDrawerOpen: false,
      menus: [
        {
          id: 2,
          to: "/ops/head/exceptions",
          name: "Exceptions",
          subItems: [],
        },
        {
          id: 3,
          to: null,
          name: "Reports",
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
  created() {
    const savedState = localStorage.getItem("leftDrawerOpen");
    this.leftDrawerOpen = savedState === null ? true : savedState === "true";
  },
  methods: {
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
