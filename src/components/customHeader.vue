<template>
  <q-toolbar class="bg-custom-light-grey bottom-border" color="grey-9" flat inverted>
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
    <q-toolbar-title class>
      <div class="row items-center vertical-middle">
        <!-- {{localStorage.getItem('selectedTab')}} -->
        <div class="col-auto">
          <img
            v-if="leftDrawerOpen || $route.path.includes('/bank/ops/') || $route.path.includes('/finance/') || $route.path.includes('/sat/')"
            class="cursor-pointer"
            src="~assets/images/logo.png"
            style="height:38px;"
          />
        </div>
        <div class="col float-right" align="right">
          <q-btn flat color="grey-9" icon="far fa-bell" />
          <q-btn flat color="grey-9 vertical-middle">
            <span class="mobile-hide capitalize text-weight-regular">{{propGetUserName || getUserName}}</span>
            <img
              src="~assets/images/user.png"
              style="height:30px; width:30px; padding: 5px"
              class="vertical-middle"
            />
            <!-- Direct child of target -->
            <q-menu
              class="shadow-8"
              anchor="bottom middle"
              self="top middle"
              style="min-width:350px"
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
  props: ["leftDrawerOpen", "propGetUserName"],
  components: {
    toggleMyAccount
  },
  data() {
    return {
      toggleMyAccount: false,
    };
  },

  methods: {
    triggerSideMenu() {
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
    getUserName() {
      const userInfo = localStorage.getItem("u_i");
      if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
        try {
          return JSON.parse(userInfo).user.name;
        } catch (e) {
          return "Super Admin";
        }
      }
      return "Super Admin";
    },
    getRole() {
      const userInfo = localStorage.getItem("u_i");
      if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
        try {
          const parsed = JSON.parse(userInfo);
          if (parsed.roles && parsed.roles.length > 0) {
            if (parsed.roles[0].role == "KSN") {
              this.$emit("fnToggleSideMenu");
            }
            return parsed.roles[0].role;
          }
        } catch (e) {
          return "";
        }
      }
      return "";
    },
  },
};
</script>
