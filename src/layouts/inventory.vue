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

