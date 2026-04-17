<template>
  <q-page class="login-page flex flex-center">
    <div class="login-card-container">
      <q-card class="login-card q-pa-xl">
        <div class="text-center q-mb-lg">
          <img src="~assets/images/logo.png" class="login-logo" />
          <h1 class="text-h5 text-weight-bold q-mt-md q-mb-xs">Welcome Back</h1>
          <p class="text-subtitle2 text-grey-7">Please enter your details to sign in</p>
        </div>

        <q-form @submit="fuSubmitLoginDetails(formData)" class="q-gutter-y-md">
          <q-input
            v-model.trim="formData.email"
            @blur="v$.formData.email.$touch"
            :error="v$.formData.email.$error"
            label="Email"
            outlined
            rounded
            bg-color="white"
            placeholder="Enter your email"
            @keyup.enter="fuSubmitLoginDetails(formData)"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="grey-7" />
            </template>
          </q-input>

          <q-input
            v-model="formData.password"
            @blur="v$.formData.password.$touch"
            :error="v$.formData.password.$error"
            placeholder="Enter your password"
            @keyup.enter="fuSubmitLoginDetails(formData)"
            type="password"
            label="Password"
            outlined
            rounded
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-7" />
            </template>
          </q-input>

          <div class="row items-center justify-between q-mt-sm">
            <q-checkbox v-model="formData.rememberPassword" color="primary" label="Remember me" class="text-grey-8" />
            <q-btn
              flat
              no-caps
              padding="none"
              color="primary"
              class="text-weight-medium"
              @click="fnShowForgetPasswordModal"
            >
              Forgot password?
            </q-btn>
          </div>

          <q-btn
            class="full-width q-py-md q-mt-lg submit-btn"
            no-caps
            color="primary"
            unelevated
            type="submit"
            label="Sign In"
          />
        </q-form>
      </q-card>

      <div class="text-center q-mt-lg">
        <p class="text-grey-6 text-caption">© {{ new Date().getFullYear() }} Bijlipay. All rights reserved.</p>
      </div>
    </div>

    <showForgetPasswordComp
      v-if="showForgetPassword"
      :propShowForgetPassword="showForgetPassword"
      @emitfnShowForgetPasswordModal="fnShowForgetPasswordModal"
    ></showForgetPasswordComp>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  email
} from "@vuelidate/validators";
import showForgetPasswordComp from "../components/forgetPassword.vue";
import * as CryptoJS from "crypto-js";
import _ from "lodash";

let AesUtil = function (keySize, iterationCount) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function (salt, passPhrase) {
  var key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    keySize: this.keySize,
    iterations: this.iterationCount,
    hasher: CryptoJS.algo.SHA1
  });
  return key;
};

AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
  var key = this.generateKey(salt, passPhrase);
  var encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: CryptoJS.enc.Hex.parse(iv)
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

export default {
  name: "LoginPage",
  components: {
    showForgetPasswordComp
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      showForgetPassword: false,
      formData: {
        email: "",
        password: "",
        rememberPassword: false
      }
    };
  },

  validations: {
    formData: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },

  computed: {
    ...mapGetters("Authentication", ["getUserAuthInfo"])
  },

  methods: {
    ...mapActions("Authentication", [
      "FEED_LOGIN_DATA",
      "FETCH_LOGGEDIN_USER_DATA"
    ]),

    fnNavigate(routeName, fallbackPath) {
      if (this.$router && typeof this.$router.hasRoute === "function") {
        if (this.$router.hasRoute(routeName)) {
          return this.$router.push({ name: routeName });
        }
      }
      return this.$router.push(fallbackPath);
    },

    fuSubmitLoginDetails(request) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
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
          this.formData.password
        );
        let aesPassword = iv + "::" + salt + "::" + ciphertext;
        let password = btoa(aesPassword);
        let requestParams = {
          url: {
            email: request.email,
            password: password,
            rememberPassword: request.rememberPassword
          }
        };
        this.$q.loading.show({
          delay: 100,
          spinnerColor: "primary",
          message: "Authenticating..."
        });
        this.FEED_LOGIN_DATA(requestParams)
          .then(response => {
            this.FETCH_LOGGEDIN_USER_DATA()
              .then((userInfo) => {
                let menuArr = [];
                const roles = (userInfo && Array.isArray(userInfo.roles)) ? userInfo.roles : [];
                _.map(roles, function (oo) {
                  if (oo && oo.hierarchyRoleLevel) {
                    menuArr.push(oo.hierarchyRoleLevel);
                  }
                });
                if (menuArr.includes(this.$ROLE_HIERARCHY_OPERATION_SAT)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("BijlipaySat", "/sat/master/BijlipaySat");
                } else if (menuArr.includes(this.$ROLE_BIJLIPAY_MANAGER)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("adminDashboard", "/super/admin/dashboard");
                } else if (
                  menuArr.includes(this.$ROLE_HIERARCHY_SALES_RSM) ||
                  menuArr.includes(this.$ROLE_HIERARCHY_SALES_ASM) ||
                  menuArr.includes(this.$ROLE_HIERARCHY_SALES_NATIONAL_HEAD)
                ) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("leadAllocation", "/sales/manager/lead/allocation/tracker");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_BANK_OPS)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("assignShortLead", "/bank/ops/assign/short/lead");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_OPERATIONS_HEAD)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("exceptions", "/ops/head/exceptions");
                } else if (
                  menuArr.includes(this.$ROLE_HIERARCHY_FINANCE_HEAD) ||
                  menuArr.includes(this.$ROLE_HIERARCHY_FINANCE_MANAGER) ||
                  menuArr.includes(this.$ROLE_HIERARCHY_FINANCE_EXECUTIVE)
                ) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("paymentVerificationTracker", "/finance/payment/verification/tracker");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("Bijlipay", "/inventory/master/Bijlipay");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_KSN)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("Ksn", "/inventory/master/Ksn");
                } else if (menuArr.includes(this.$HIERARCHY_CRM1)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Successfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("phonepePendingCrm", "/crm/phonepePendingCrm");
                } else {
                  this.$q.notify({
                    type: "warning",
                    position: "bottom",
                    message: "Permission denied.",
                  });
                }
                this.$q.loading.hide();
              })
              .catch((error) => {
                this.$q.loading.hide();
                this.$q.notify({
                  color: "negative",
                  position: "bottom",
                  message: "Something went wrong! Contact administrator",
                  icon: "thumb_down",
                });
              });
          })
          .catch((error) => {
            this.$q.loading.hide();
            if (error.response && error.response.status == 401) {
              this.$q.notify({
                type: "warning",
                position: "bottom",
                message: "Oops! Incorrect credentials",
              });
            } else if (error.response && error.response.status == 423) {
              this.$q.notify({
                type: "warning",
                position: "bottom",
                message: "Your Account is Locked, Please Contact Admin",
              });
            } else {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message:
                  (error.response && error.response.data && error.response.data.message) ||
                  "Please Try Again Later !",
                icon: "thumb_down",
              });
            }
          });
      }
    },
    fnShowForgetPasswordModal() {
      this.showForgetPassword = !this.showForgetPassword;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.login-card-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.login-card {
  border-radius: 24px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.login-logo {
  height: 50px;
  margin-bottom: 8px;
}

.submit-btn {
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px !important;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(97, 17, 106, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

::v-deep(.q-field--outlined.q-field--rounded .q-field__control) {
  border-radius: 12px !important;
  background-color: #f8fafc;

  &:hover {
    background-color: #fff;
  }
}
</style>
