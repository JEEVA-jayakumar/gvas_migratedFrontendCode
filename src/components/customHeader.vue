<template>
  <q-toolbar class="bg-custom-light-grey bottom-border" color="grey-9" flat>
    <q-btn
      flat
      dense
      round
      @click="triggerSideMenu"
      aria-label="Menu"
      v-if="getRole != 'KSN'"
      color="grey-9"
    >
      <q-icon name="menu" />
    </q-btn>
    <q-toolbar-title>
      <div class="row items-center vertical-middle">
        <div class="col-auto">
          <img
            v-if="leftDrawerOpen"
            class="cursor-pointer"
            src="~assets/images/logo.png"
            style="height:38px;"
          />
        </div>
        <div class="col float-right" align="right">
          <q-btn flat color="grey-9" icon="far fa-bell" />
          <q-btn flat color="grey-9" class="vertical-middle">
            <span class="mobile-hide capitalize text-weight-regular">{{getUserNAme}}</span>
            <img
              src="~assets/images/user.png"
              style="height:30px; width:30px; padding: 5px"
              class="vertical-middle"
            />
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
  components: {
    toggleMyAccount
  },
  data() {
    return {
      toggleMyAccount: false,
      leftDrawerOpen: this.$q.platform.is.desktop,
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
