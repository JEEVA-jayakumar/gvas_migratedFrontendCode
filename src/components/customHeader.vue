<template>
  <q-toolbar class="bg-white q-px-md" style="height: 64px; border-bottom: 1px solid #edf2f7">
    <q-btn
      flat
      dense
      round
      @click="triggerSideMenu"
      aria-label="Menu"
      color="grey-7"
      v-if="getRole != 'KSN'"
    >
      <q-icon name="menu" />
    </q-btn>
    <q-toolbar-title>
      <div class="row items-center no-wrap">
        <div class="col-auto q-ml-sm">
          <img
            v-if="leftDrawerOpen"
            class="cursor-pointer"
            src="~assets/images/logo.png"
            style="height:32px; filter: grayscale(0.2)"
          />
        </div>
        <q-space />
        <div class="col-auto row items-center no-wrap">
          <q-btn flat round dense color="grey-7" icon="notifications_none" class="q-mr-sm">
            <q-badge color="negative" floating rounded style="padding: 3px; min-height: unset;" />
          </q-btn>

          <div class="row items-center cursor-pointer q-pl-md q-ml-md" style="border-left: 1px solid #edf2f7">
            <div class="column q-mr-md text-right gt-xs">
              <span class="text-subtitle2 text-weight-bold text-grey-9 lh-1">{{getUserNAme}}</span>
              <span class="text-caption text-grey-6 lh-1">{{getRoleName}}</span>
            </div>
            <q-avatar size="36px" class="bg-grey-2">
              <img src="~assets/images/user.png" />
            </q-avatar>
            <q-menu
              class="shadow-16 rounded-lg"
              anchor="bottom right"
              self="top right"
              style="min-width: 240px"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <div class="q-pa-md bg-grey-1 text-center">
                <q-avatar size="64px" class="q-mb-sm shadow-2">
                  <img src="~assets/images/user.png" />
                </q-avatar>
                <div class="text-weight-bold">{{getUserNAme}}</div>
                <div class="text-caption text-grey-7">{{getRoleName}}</div>
              </div>
              <q-list padding class="text-grey-8">
                <q-item clickable v-close-popup @click="openMyAccount()">
                  <q-item-section avatar>
                    <q-icon name="lock_outline" size="20px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Change Password</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable v-close-popup @click="clearLocalStorageData()" class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" size="20px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </div>
    </q-toolbar-title>
    <toggleMyAccount
      v-if="toggleMyAccount"
      :propsToggleModal="toggleMyAccount"
      @propsToggleModal="openMyAccount"
    />
  </q-toolbar>
<!-- </q-dialog> -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import toggleMyAccount from "./toggleMyAccount.vue";
export default {
  // props: ["propRowDetails"],
  name: "LayoutDefault",
  components: {
    toggleMyAccount
  },
  data() {
    return {
      toggleMyAccount: false,
      // toggleModel: this.propShowDatas,
      leftDrawerOpen: this.$q.platform.is.desktop,
   
        // fnvalue:"",selectedTab
    };
  },
 
  methods: {
    triggerSideMenu() {
      // this.leftDrawerOpen = !this.leftDrawerOpen;
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
      const ui = localStorage.getItem("u_i");
      return ui ? JSON.parse(ui).user.name : "User";
    },
    getRole() {
      const ui = localStorage.getItem("u_i");
      if (!ui) return "";
      const parsed = JSON.parse(ui);
      if (parsed.roles && parsed.roles.length > 0 && parsed.roles[0].role == "KSN") {
        this.$emit("fnToggleSideMenu");
      }
      return parsed.roles && parsed.roles.length > 0 ? parsed.roles[0].role : "";
    },
    getRoleName() {
      const ui = localStorage.getItem("u_i");
      if (!ui) return "";
      const parsed = JSON.parse(ui);
      return parsed.roles && parsed.roles.length > 0 ? parsed.roles[0].role : "Staff";
    }
  },
};
</script>
