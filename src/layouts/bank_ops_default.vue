<template>
  <q-layout view="hHh Lpr lFf">
    <q-header style="margin-left:0px" class="shadow-0 z-top bg-white" flat>
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
      :content-style="{background: '#202c3f',width:'260px'}"
    >
      <div class="q-py-md q-px-lg flex items-center" style="height: 65px; background: rgba(0,0,0,0.1)">
        <img v-if="leftDrawerOpen" src="~assets/images/logo.png" style="height: 35px" />
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
