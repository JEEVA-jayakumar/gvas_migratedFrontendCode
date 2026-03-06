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
      content-class="no-shadow"
      :content-style="{background: '#202c3f',width:'250px'}"
    >
      <q-list
        no-border
        link
        inset-delimiter
        highlight
        style="padding-top:65px"
      >
        <q-item v-for="menu in menus" :key="menu.id" :to="menu.to" class="menu-main-item-color">
          <q-item-section class="menu-item-color">{{menu.name}}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <customBody></customBody>
    </q-page-container>
  </q-layout>
</template>

<script>
import customHeader from "../components/customHeader.vue";
import customBody from "../components/customBody.vue";
export default {
  components: {
    customHeader,
    customBody,
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
