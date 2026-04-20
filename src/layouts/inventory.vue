<template>
  <q-layout view="hHh Lpr lFf">
     <q-header style="margin-left:0px" class="shadow-0 z-top bg-custom-light-grey" flat>
      <customHeader
        :leftDrawerOpen="leftDrawerOpen"
        @fnToggleSideMenu="fnMainToggleSideMenu"
      />
    </q-header>

    <q-drawer
      class="shadow-9"
      v-model="leftDrawerOpen"
      content-class="no-shadow"
      style="background-color: #531b64 !important;"
      :width="250"
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
    SidebarMenu
  },
  name: "LayoutDefault",
  data() {
    return {
      leftDrawerOpen: this.$q.localStorage.getItem("leftDrawerOpen") !== null ? this.$q.localStorage.getItem("leftDrawerOpen") : this.$q.platform.is.desktop,
      menus: [
        {
          id: 1,
          to: "/inventory/home",
          name: "Inventory Table",
        },
        {
          id: 2,
          to: "/inventory/central",
          name: "Central Inventory",
        },
        // {
        //   id: 3,
        //   to: "/inventory/regional",
        //   name: "Regional Inventory",
        // },
        // {
        //   id: 4,
        //   to: "/inventory/transit",
        //   name: "Inventory in Transit",
        // },
        // {
        //   id: 5,
        //   to: "/inventory/merchant",
        //   name: "Inventory with Merchant",
        // },
        {
          id: 6,
          to: "/inventory/faulty",
          name: "Faulty Inventory",
        },
        {
          id: 6,
          to: "/inventory/master/inventory",
          name: "Master Inventory",
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
