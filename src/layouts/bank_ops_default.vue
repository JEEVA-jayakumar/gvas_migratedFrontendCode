<template>
  <q-layout view="hHh Lpr lFf">
    <q-header flat>
      <customHeader
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
    <q-page-container>
      <customBody></customBody>
    </q-page-container>
  </q-layout>
</template>

<script>
import customHeader from "../components/customHeader.vue";
import customBody from "../components/customBody.vue";
import SidebarMenu from "../components/SidebarMenu.vue";

export default {
  components: {
    customHeader,
    customBody,
    SidebarMenu,
  },
  name: "LayoutBankOps",
  data() {
    return {
      leftDrawerOpen: false,
      menus: [
        {
          id: 1,
          to: "/bank/ops/assign/short/lead",
          name: "Assign Short Lead",
        },
        {
          id: 2,
          to: "/bank/ops/bank/merchant/tracker",
          name: "Merchant Tracker",
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
