<template>
  <q-toolbar class="bg-custom-light-grey bottom-border" color="grey-9" flat inverted>
    <q-btn
      flat
      dense
      round
      @click="triggerSideMenu"
      aria-label="Menu"
      v-if="getRole != 'KSN'"
    >
      <q-icon name="menu" />
    </q-btn>
    <q-toolbar-title class>
      <div class="row items-center vertical-middle">
        <!-- {{localStorage.getItem('selectedTab')}} -->
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
          <q-btn flat color="grey-9 vertical-middle">
            <span class="mobile-hide capitalize text-weight-regular">{{getUserNAme}}</span>
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
      try { const ui = JSON.parse(localStorage.getItem("u_i")); return ui?.user?.name || "Super Admin"; } catch(e) { return "Super Admin"; }
    },
    getRole() {
      if (JSON.parse(localStorage.getItem("u_i")).roles[0].role == "KSN") {
        this.$emit("fnToggleSideMenu");
      }
      try { const ui = JSON.parse(localStorage.getItem("u_i")); return ui?.roles[0]?.role || ""; } catch(e) { return ""; }
    },
  },
};
</script>
