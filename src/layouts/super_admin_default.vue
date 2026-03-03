<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="margin-left:0px" class="shadow-0 z-top" flat>
      <q-toolbar
        class="bg-custom-light-grey bottom-border"
        color="grey-9"
        flat
      >
        <q-btn
          flat
          dense
          round
          @click="triggerSideMenu"
          aria-label="Menu"
          color="grey-9"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title class="">
          <div class="row items-center vertical-middle">
            <div class="col-auto">
              <img v-if="leftDrawerOpen" class="cursor-pointer" src="~assets/images/logo.png" style="height:38px;">
            </div>
            <div class="col float-right" align="right">
              <q-btn flat color="grey-9" icon="far fa-bell"/>
              <q-btn flat color="grey-9" class="vertical-middle">
                <span class="mobile-hide capitalize text-weight-regular">{{getUserName}}</span>
                <img src="https://pdc.techinasia.com/wp-content/uploads/2018/03/user60.png" style="height:30px;width:30px" class="vertical-middle">
                <!-- Direct child of target -->
                <q-menu class="shadow-8" anchor="bottom middle" self="top middle" style="min-width:350px">
                  <q-list separator class="no-padding">
                    <q-item clickable v-close-popup @click="showNotification">
                      <q-item-section avatar>
                        <q-icon name="fas fa-user" color="dark" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>My Account</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="logout">
                      <q-item-section avatar>
                        <q-icon name="fas fa-sign-out-alt" color="dark" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Logout</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="no-shadow shadow-9"
      :width="250"
      :breakpoint="500"
      :style="{background: '#531b64'}"
    >
      <q-scroll-area class="fit" style="padding-top:65px">
        <q-list class="menu-list">
          <q-item
            v-for="menu in menus"
            :key="menu.id"
            :to="menu.to"
            clickable
            class="menu-main-item-color"
            active-class="active-menu-item"
          >
            <q-item-section class="menu-item-color">
              {{ menu.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          v-on:before-enter="beforeEnter"
          v-on:after-enter="afterEnter"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DefaultLayoutSuperAdmin",
  data() {
    return {
      leftDrawerOpen: false,
      menus: [
        {
          id: 1,
          to: "/super/admin/dashboard/",
          name: "Dashboard",
        },
        {
          id: 2,
          to: "/super/admin/users/",
          name: "Users",
        },
        {
          id: 3,
          to: "/super/admin/hierarchy/",
          name: "Hierarchy",
        },
        {
          id: 4,
          to: "/super/admin/roles/permissions/",
          name: "Roles & Permissions",
        },
        {
          id: 5,
          to: "/super/admin/permissions/",
          name: "Permissions",
        },
        {
          id: 6,
          to: "/super/admin/regions/",
          name: "Regions",
        },
        {
          id: 7,
          to: "/super/admin/manage/rental/charges",
          name: "Manage Rental Charges",
        },
        {
          id: 8,
          to: "/super/admin/manage/mdr/charges",
          name: "Manage MDR Charges",
        },
      ],
    };
  },
  computed: {
    getUserName() {
      try {
        const userInfoStr = localStorage.getItem("u_i");
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          return userInfo.user?.name || "User";
        }
      } catch (e) {
        console.error("Error parsing user info", e);
      }
      return "User";
    },
  },
  created() {
    const savedState = localStorage.getItem("leftDrawerOpen");
    this.leftDrawerOpen = savedState === null ? true : savedState === "true";
  },
  methods: {
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    triggerSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      localStorage.setItem("leftDrawerOpen", this.leftDrawerOpen);
    },
    beforeEnter(el) {
      this.TOGGLE_COMMON_LOADER(true);
    },
    afterEnter(el) {
      this.TOGGLE_COMMON_LOADER(false);
    },
    showNotification() {
      // Placeholder for My Account logic if any
    },
    logout() {
      localStorage.removeItem("u_i");
      localStorage.removeItem("auth_token");
      this.$q.notify({
        color: "positive",
        position: "bottom",
        message: "Succesfully Logged Out",
        icon: "thumb_up"
      });
      this.$router.push({ name: "login" });
    }
  },
};
</script>

<style scoped>
.menu-item-color {
  color: #e3e4e5;
  font-size: 14px;
}
.menu-main-item-color:hover {
  color: #e3e4e5;
  font-size: 14px;
  background: #531a65 !important;
}
.menu-main-item-color:active {
  color: #e3e4e5;
  font-size: 14px;
  background: #531a65 !important;
}

.menu-main-item-color:focus {
  color: #e3e4e5;
  font-size: 14px;
  background: #531a65 !important;
}

.active-menu-item {
  background: #3b084b !important;
}
.active-menu-item .menu-item-color {
  color: #e3e4e5;
}
</style>
