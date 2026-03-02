<template>
  <q-toolbar class="bg-white bottom-border q-px-md" color="grey-9" flat style="height: 65px">
    <q-btn
      flat
      dense
      round
      @click="triggerSideMenu"
      aria-label="Menu"
      v-if="getRole != 'KSN'"
      color="grey-9"
    >
      <q-icon :name="leftDrawerOpen ? 'menu_open' : 'menu'" size="24px" />
    </q-btn>
    <q-toolbar-title>
      <div class="row items-center full-height">
        <div class="col-auto q-ml-sm" v-if="!leftDrawerOpen">
          <img
            class="cursor-pointer"
            src="~assets/images/logo.png"
            style="height:35px;"
          />
        </div>
        <div class="col float-right" align="right">
          <q-btn flat dense color="grey-9" icon="far fa-bell" class="q-mr-md">
            <q-badge color="purple" floating>2</q-badge>
          </q-btn>
          <q-btn flat color="grey-9" class="user-profile-btn no-padding">
            <span class="mobile-hide capitalize text-weight-medium q-mr-sm">{{getUserNAme}}</span>
            <q-avatar size="32px">
              <img src="~assets/images/user.png" />
            </q-avatar>
            <q-menu
              class="shadow-12"
              anchor="bottom right"
              self="top right"
              transition-show="jump-down"
              transition-hide="jump-up"
              style="min-width: 250px; border-radius: 8px;"
            >
              <q-list separator class="no-padding">
                <q-item clickable v-close-popup @click="openMyAccount()">
                  <q-item-section avatar>
                    <q-icon name="fas fa-user" color="dark" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Change Password</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="clearLocalStorageData()">
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
    <toggleMyAccount
      v-if="toggleMyAccount"
      :propsToggleModal="toggleMyAccount"
      @propsToggleModal="openMyAccount"
    />
  </q-toolbar>
</template>
<script>
import toggleMyAccount from "./toggleMyAccount.vue";
export default {
  name: "CustomHeader",
  components: {
    toggleMyAccount
  },
  data() {
    return {
      toggleMyAccount: false,
      leftDrawerOpen: this.$q.localStorage.getItem("leftDrawerOpen") !== null
        ? this.$q.localStorage.getItem("leftDrawerOpen")
        : this.$q.platform.is.desktop,
    };
  },
  methods: {
    triggerSideMenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      this.$q.localStorage.set("leftDrawerOpen", this.leftDrawerOpen);
      this.$emit("fnToggleSideMenu");
    },
    clearLocalStorageData() {
      localStorage.removeItem("u_i");
      localStorage.removeItem("auth_token");
      this.$q.notify({
        color: "positive",
        position: "bottom",
        message: "Succesfully Logged Out",
        icon: "thumb_up"
      });
      this.$router.push({ name: "login" });
    },
    openMyAccount() {
      this.toggleMyAccount = !this.toggleMyAccount;
    }
  },
  computed: {
    getUserNAme() {
      const userInfo = localStorage.getItem("u_i");
      return userInfo ? JSON.parse(userInfo).user.name : '';
    },
    getRole() {
      const userInfo = localStorage.getItem("u_i");
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed.roles && parsed.roles[0].role == "KSN") {
          this.$emit("fnToggleSideMenu");
        }
        return parsed.roles[0].role;
      }
      return '';
    },
  },
};
</script>
