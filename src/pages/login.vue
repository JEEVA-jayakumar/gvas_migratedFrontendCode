<template>
  <q-page class="login-layout flex flex-center">
    <div class="login-container row no-wrap shadow-24">
      <!-- Left: Branding (Strictly Logo only) -->
      <div class="login-brand col-md-6 gt-sm flex flex-center relative-position overflow-hidden">
        <div class="brand-content q-pa-xl text-white relative-position flex flex-center">
          <img src="~assets/images/logo.png" style="width: 240px;" class="fade-up" />
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="login-form-container col-md-6 col-sm-12 bg-white q-pa-xl flex flex-center">
        <div class="full-width" style="max-width: 400px">
          <div class="q-mb-xl">
            <h2 class="text-h4 text-weight-bold text-slate-900 q-mb-xs">Welcome Back</h2>
            <p class="text-slate-500">Please enter your credentials to continue</p>
          </div>

          <q-form @submit="onSubmit" class="q-gutter-y-lg">
            <q-input
              v-model="email"
              label="Email Address"
              outlined
              class="premium-input"
              lazy-rules
              :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Please enter a valid email']"
            >
              <template v-slot:prepend>
                <q-icon name="mail_outline" color="slate-400" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              outlined
              class="premium-input"
              lazy-rules
              :rules="[val => !!val || 'Password is required']"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" color="slate-400" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="slate-400"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="row items-center justify-between">
              <q-checkbox v-model="rememberMe" label="Remember me" color="purple-9" dense />
              <q-btn flat no-caps color="purple-9" label="Forgot password?" size="sm" />
            </div>

            <q-btn
              label="Sign In"
              type="submit"
              class="full-width premium-btn-primary q-py-md"
              :loading="loading"
              size="lg"
            />
          </q-form>

          <div class="q-mt-xl text-center">
            <p class="text-caption text-slate-400">
              &copy; {{ new Date().getFullYear() }} Bijlipay. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import AesUtil from "../store/AesUtil";
import * as CryptoJS from "crypto-js";
import { mapActions } from "vuex";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      isPwd: true,
      rememberMe: false,
      loading: false
    };
  },
  methods: {
    ...mapActions("Authentication", ["FEED_LOGIN_DATA", "FETCH_LOGGEDIN_USER_DATA"]),
    onSubmit() {
      this.loading = true;
      let iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
        CryptoJS.enc.Hex
      );
      let salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
        CryptoJS.enc.Hex
      );
      let aesUtil = new AesUtil(128, 1000);
      let ciphertext = aesUtil.encrypt(
        salt,
        iv,
        "BijliWeAreMakers",
        this.password
      );
      let aesPassword = iv + "::" + salt + "::" + ciphertext;
      let password = btoa(aesPassword);

      const payload = {
        url: {
          email: this.email,
          password: password,
          rememberPassword: this.rememberMe
        }
      };

      this.FEED_LOGIN_DATA(payload)
        .then((res) => {
          this.FETCH_LOGGEDIN_USER_DATA().then(() => {
            this.loading = false;
            const userInfoStr = localStorage.getItem("u_i");
            if (userInfoStr) {
              const userInfo = JSON.parse(userInfoStr);
              let roles = [];
              userInfo.roles.map(oo => roles.push(oo.hierarchyRoleLevel));

              if (roles.includes("OH_3")) {
                this.$router.push("/sat/master/BijlipaySat");
              } else if (roles.includes("BM_1")) {
                this.$router.push("/super/admin/dashboard/");
              } else if (roles.includes("BOH_2")) {
                this.$router.push("/bank/ops/assign/short/lead");
              } else if (roles.includes("OH_2")) {
                this.$router.push("/ops/head/exceptions");
              } else if (roles.includes("INH_2")) {
                this.$router.push("/inventory/master/Bijlipay");
              } else {
                this.$router.push("/");
              }
            } else {
              this.$router.push("/");
            }
          }).catch(() => {
            this.loading = false;
            this.$router.push("/");
          });
        })
        .catch((error) => {
          this.loading = false;
          this.$q.notify({
            type: "negative",
            message: error.response?.data?.message || "Login failed. Please check your credentials.",
            position: "top"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-layout {
  background: #f1f5f9;
  min-height: 100vh;
}

.login-container {
  width: 1000px;
  max-width: 95vw;
  height: 650px;
  border-radius: 24px;
  overflow: hidden;
  background: white;
}

.login-brand {
  background: linear-gradient(135deg, #61116a 0%, #3a0b40 100%);
  position: relative;
}

.login-form-container {
  border-left: 1px solid #f1f5f9;
}

@media (max-width: 1024px) {
  .login-container {
    height: auto;
    width: 450px;
  }
}
</style>
