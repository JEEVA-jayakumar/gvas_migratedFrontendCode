<template>
  <q-toolbar class="bg-white border-bottom q-px-lg" style="height: 70px;">
    <q-btn
      flat
      dense
      round
      @click="triggerSideMenu"
      aria-label="Menu"
      color="slate-600"
      class="hover-lift"
    >
      <q-icon name="menu" size="24px" />
    </q-btn>

    <q-toolbar-title>
      <div class="row items-center no-wrap">
        <div class="col-auto q-ml-md">
          <img
            class="cursor-pointer"
            src="~assets/images/logo.png"
            style="height:40px;"
          />
        </div>

        <q-space />

        <div class="col-auto row items-center no-wrap">
          <q-btn flat round color="slate-400" icon="notifications_none" class="q-mr-sm">
             <q-badge floating color="red" rounded />
          </q-btn>

          <div class="user-profile-btn flex items-center cursor-pointer q-pa-sm rounded-12 transition-all">
            <div class="text-right q-mr-md gt-xs">
              <div class="text-weight-bold text-slate-900 leading-tight">
                {{propGetUserName || getUserName}}
              </div>
              <div class="text-caption text-slate-400">{{ getUserRole }}</div>
            </div>

            <q-avatar size="40px" class="shadow-1">
              <img src="~assets/images/user.png" />
            </q-avatar>
            <q-icon name="expand_more" color="slate-400" size="20px" />

            <q-menu
              class="premium-card shadow-12 q-mt-md"
              anchor="bottom right"
              self="top right"
              style="min-width:240px; border-radius: 16px !important;"
            >
              <div class="q-pa-md border-bottom bg-slate-50">
                 <div class="text-weight-bold text-slate-900">{{propGetUserName || getUserName}}</div>
                 <div class="text-caption text-slate-500">{{ getUserEmail }}</div>
              </div>
              <q-list class="q-py-sm">
                <q-item clickable v-close-popup @click="openMyAccount()" class="q-py-md">
                  <q-item-section avatar>
                    <q-avatar color="purple-1" text-color="purple-9" icon="lock_reset" size="32px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium text-slate-700">Change Password</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="clearLocalStorageData()" class="q-py-md text-red-7">
                  <q-item-section avatar>
                    <q-avatar color="red-1" text-color="red-7" icon="logout" size="32px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Logout System</q-item-label>
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
          return "Guest";
        }
      }
      return "Guest";
    },
    getUserRole() {
       const userInfo = localStorage.getItem("u_i");
       if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
         try {
           const info = JSON.parse(userInfo);
           return info.roles[0]?.hierarchyRoleName || info.hierarchy?.hierarchyName || "User";
         } catch (e) {
           return "User";
         }
       }
       return "User";
    },
    getUserEmail() {
      const userInfo = localStorage.getItem("u_i");
      if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
        try {
          return JSON.parse(userInfo).user.email;
        } catch (e) {
          return "";
        }
      }
      return "";
    }
  },
};
</script>

<style lang="scss" scoped>
.border-bottom { border-bottom: 1px solid #f1f5f9; }
.rounded-12 { border-radius: 12px; }
.leading-tight { line-height: 1.25; }

.user-profile-btn {
  &:hover {
    background: #f1f5f9;
  }
}

.transition-all { transition: all 0.2s ease; }
.purple-1 { background-color: #faf5ff; }
.red-1 { background-color: #fef2f2; }
</style>
