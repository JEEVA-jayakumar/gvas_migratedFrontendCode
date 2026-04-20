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
      bordered
      :width="260"
      :breakpoint="500"
      content-class="no-shadow"
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
    <q-page-container class="bg-grey-2">
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
  name: "LayoutDefault",
  data() {
    return {
      leftDrawerOpen: this.$q.localStorage.getItem("leftDrawerOpen") !== null
        ? this.$q.localStorage.getItem("leftDrawerOpen")
        : this.$q.platform.is.desktop,
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
  methods: {
    fnMainToggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      this.$q.localStorage.set("leftDrawerOpen", this.leftDrawerOpen);
    },
  },
};
</script>

<style>
</style>
