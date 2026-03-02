<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="margin-left:0px" class="shadow-0 z-top" flat>
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu"></customHeader>
    </q-header>

    <q-drawer
      class="shadow-9"
      v-model="leftDrawerOpen"
      :width="250"
      :style="{background: '#202c3f'}"
    >
     <q-list
        class="no-border"
        style="padding-top:65px"
      >
        <template v-for="menu in menus" :key="menu.id">
          <q-item
            v-if="!menu.subItems || menu.subItems.length === 0"
            :to="menu.to"
            clickable
            class="menu-main-item-color"
          >
            <q-item-section class="cursor-pointer menu-item-color">{{ menu.name }}</q-item-section>
          </q-item>
          <q-item v-else class="no-padding">
            <q-item-section class="col-12">
              <q-expansion-item
                dense
                class="no-padding"
                header-class="no-padding menu-item-color"
                header-style="font-size:14px"
                dark
                :label="menu.name"
              >
                <q-item
                  v-for="subItem in menu.subItems"
                  :key="subItem.id"
                  :to="subItem.to"
                  clickable
                  class="menu-main-item-color"
                >
                  <q-item-section class="cursor-pointer menu-item-color q-pl-lg">{{ subItem.name }}</q-item-section>
                </q-item>
              </q-expansion-item>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <customBody></customBody>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      leftDrawerOpen: this.$q.platform.is.desktop,
      menus: [
        {
          id: 1,
          to: "/ops/head/dashboard",
          name: "Dashboard",
          subItems: []
        },
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
  methods: {
    fnMainToggleSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

<style>
</style>
