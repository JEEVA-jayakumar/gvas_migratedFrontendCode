<template>
  <q-page class="login-page">
    <div class="row full-height window-height">
      <!-- Left Branding Panel (Hidden on small screens) -->
      <div class="col-md-5 gt-sm branding-panel flex flex-center relative-position overflow-hidden">
        <div class="absolute-full branding-overlay"></div>
        <div class="branding-content text-center q-pa-xl z-top">
          <div class="logo-wrapper q-mb-xl hover-scale">
            <img src="~assets/images/logo.png" class="branding-logo" />
          </div>
          <div class="branding-text text-white">
            <h2 class="text-h3 text-weight-bolder q-mb-md">Bijlipay</h2>
          </div>
        </div>
        <!-- Decorative Elements -->
        <div class="decor-circle circle-1"></div>
        <div class="decor-circle circle-2"></div>
      </div>

      <!-- Right Login Panel -->
      <div class="col-12 col-md-7 login-panel flex flex-center">
        <div class="login-container q-pa-lg">
          <!-- Mobile Logo -->
          <div class="lt-md text-center q-mb-xl">
            <img src="~assets/images/logo.png" class="mobile-logo" />
          </div>

          <div class="login-header q-mb-xl">
            <h1 class="text-h4 text-weight-bold q-mb-sm text-primary">Welcome Back</h1>
            <p class="text-subtitle1 text-grey-7">Please enter your credentials to access your account.</p>
          </div>

          <q-form @submit="fuSubmitLoginDetails(formData)" class="q-gutter-y-lg">
            <div class="input-group">
              <label class="text-subtitle2 text-weight-bold text-grey-8 q-mb-xs block">Email Address</label>
              <q-input
                v-model.trim="formData.email"
                @blur="v$.formData.email.$touch"
                :error="v$.formData.email.$error"
                outlined
                bg-color="grey-1"
                placeholder="e.g. name@company.com"
                @keyup.enter="fuSubmitLoginDetails(formData)"
                class="premium-input"
              >
                <template v-slot:prepend>
                  <q-icon name="o_email" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="input-group">
              <label class="text-subtitle2 text-weight-bold text-grey-8 q-mb-xs block">Password</label>
              <q-input
                v-model="formData.password"
                @blur="v$.formData.password.$touch"
                :error="v$.formData.password.$error"
                placeholder="Enter your password"
                @keyup.enter="fuSubmitLoginDetails(formData)"
                :type="showPassword ? 'text' : 'password'"
                outlined
                bg-color="grey-1"
                class="premium-input"
              >
                <template v-slot:prepend>
                  <q-icon name="o_lock" color="primary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'o_visibility' : 'o_visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                    color="grey-6"
                  />
                </template>
              </q-input>
            </div>

            <div class="row items-center justify-between q-mt-md">
              <q-checkbox
                v-model="formData.rememberPassword"
                color="primary"
                label="Remember me"
                class="text-grey-8 font-medium"
              />
              <q-btn
                flat
                no-caps
                padding="none"
                color="primary"
                class="text-weight-bold hover-underline"
                @click="fnShowForgetPasswordModal"
              >
                Forgot password?
              </q-btn>
            </div>

            <q-btn
              class="full-width q-py-md q-mt-xl submit-btn shadow-premium"
              no-caps
              color="primary"
              unelevated
              type="submit"
              label="Sign In"
            />
          </q-form>

          <div class="text-center q-mt-xl footer-info">
            <p class="text-grey-6 text-caption">
              By signing in, you agree to our
              <span class="text-primary cursor-pointer">Terms of Service</span> and
              <span class="text-primary cursor-pointer">Privacy Policy</span>.
            </p>
            <p class="text-grey-5 text-caption q-mt-sm font-medium">
              © {{ new Date().getFullYear() }} Bijlipay. All rights reserved.
            </p>
          </div>
        </div>
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
      showPassword: false,
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
        this.$q.notify({
          message: "Please review the fields.",
          color: "warning",
          icon: "warning"
        });
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
  background-color: #ffffff;
  overflow: hidden;
}

.branding-panel {
  background: linear-gradient(135deg, #61116a 0%, #300835 100%);
  color: white;

  .branding-overlay {
    background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
    background-size: 32px 32px;
    opacity: 0.5;
  }

  .branding-logo {
    width: 240px;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2));
  }

  .hover-scale {
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.05);
    }
  }
}

.login-panel {
  background-color: #fff;
}

.login-container {
  width: 100%;
  max-width: 480px;
}

.mobile-logo {
  height: 40px;
}

.premium-input {
  ::v-deep(.q-field__control) {
    border-radius: 12px !important;
    transition: all 0.3s ease;
    border: 1.5px solid #f1f5f9;

    &:before {
      border: none !important;
    }

    &:after {
      border-color: var(--q-primary) !important;
      border-width: 1.5px !important;
    }

    &:hover {
      background-color: #fff !important;
      border-color: #cbd5e1;
    }
  }

  &.q-field--focused {
    ::v-deep(.q-field__control) {
      background-color: #fff !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
  }
}

.submit-btn {
  height: 56px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px !important;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px -5px rgba(97, 17, 106, 0.4) !important;
  }

  &:active {
    transform: translateY(0);
  }
}

.shadow-premium {
  box-shadow: 0 4px 15px rgba(97, 17, 106, 0.2);
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  z-index: 1;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
}

.font-medium {
  font-weight: 500;
}

.hover-underline:hover {
  text-decoration: underline;
}

.block {
  display: block;
}

@media (max-width: $breakpoint-sm-max) {
  .login-container {
    max-width: 400px;
  }
}
</style>
