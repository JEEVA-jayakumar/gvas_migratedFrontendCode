<template>
  <q-page>
    <!-- content -->
    <div class="row items-center window-height">
      <div class="col-md-5 gt-sm bg-grey-4" align="center">
        <div class="row items-center window-height full-width inline" align="center">
          <div class="col-auto no-padding full-width" align="center">
            <img src="~assets/images/logo.png" class="responsive vertical-align" style="width:200px" />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-7 q-px-xl">
        <div class="row justify-center q-col-gutter-md">
          <div class="col-12 col-sm-10 col-md-8" align="center">
            <div class="text-h4 text-grey-9 text-weight-medium q-py-lg">Please Log In </div>
          </div>
          <div class="col-12 col-sm-10 col-md-8">
            <q-input v-model.trim="formData.email" @blur="v$.formData.email.$touch" :error="v$.formData.email.$error"
              label="Email" color="grey-9" class="placeholder="Enter your email id"
              @keyup.enter="fuSubmitLoginDetails(formData)" />
          </div>
          <div class="col-12 col-sm-10 col-md-8">
            <q-input v-model="formData.password" @blur="v$.formData.password.$touch"
              :error="v$.formData.password.$error" placeholder="Enter your password"
              @keyup.enter="fuSubmitLoginDetails(formData)" type="password" label="Password" color="grey-9" class="/>
          </div>
          <div class="col-12 col-sm-10 col-md-8">
            <q-checkbox v-model="formData.rememberPassword" color="purple-9" class="label="Remember Password" />
          </div>
          <div class="col-12 col-sm-10 col-md-8" align="center">
            <q-btn class="full-width text-weight-regular q-pa-md" no-caps color="purple-9" @click="fuSubmitLoginDetails(formData)" style="max-width:300px">Log In</q-btn>
          </div>
          <div class="col-12 col-sm-10 col-md-8" align="center">
            <q-btn flat no-caps class="text-purple-9 text-weight-regular" color="white" @click="fnShowForgetPasswordModal">Forgot your password?</q-btn>
          </div>
        </div>
      </div>

      <showForgetPasswordComp v-if="showForgetPassword" :propShowForgetPassword="showForgetPassword"
        @emitfnShowForgetPasswordModal="fnShowForgetPasswordModal"></showForgetPasswordComp>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  email,
  minLength,
  maxLength,
  alpha,
  alphaNum,
  numeric
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
    // IMPORTANT: backend expects PBKDF2(HMAC-SHA1), not the CryptoJS default in some versions.
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

AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
  var key = this.generateKey(salt, passPhrase);
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  });
  var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: CryptoJS.enc.Hex.parse(iv)
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export default {
  name: "login",
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
        required
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
      // Vue Router 4: named route may be missing if route registration changed during migration.
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
          "BijliWeAreMakers", // Correct passphrase
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
          spinnerColor: "purple-9",
          message: "Please wait.."
        });
        this.FEED_LOGIN_DATA(requestParams)
          .then(response => {
            this.FETCH_LOGGEDIN_USER_DATA()
              .then((userInfo) => {
                /* variables:
                authUserRoles => contains user info, which is saved in local storage of browser
                hierarchyRoleLevel =>  contains current object of roles array */
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
                    message: "Succesfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("BijlipaySat", "/sat/master/BijlipaySat");
                } else if (menuArr.includes(this.$ROLE_BIJLIPAY_MANAGER)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Succesfully Logged In",
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
                    message: "Succesfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("leadAllocation", "/sales/manager/lead/allocation/tracker");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_BANK_OPS)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Succesfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("assignShortLead", "/bank/ops/assign/short/lead");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_OPERATIONS_HEAD)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Succesfully Logged In",
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
                    message: "Succesfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("paymentVerificationTracker", "/finance/payment/verification/tracker");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_INVENTORY_OFFICER)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Succesfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("Bijlipay", "/inventory/master/Bijlipay");
                } else if (menuArr.includes(this.$ROLE_HIERARCHY_KSN)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Succesfully Logged In",
                    icon: "thumb_up",
                  });
                  this.fnNavigate("Ksn", "/inventory/master/Ksn");
                } else if (menuArr.includes(this.$HIERARCHY_CRM1)) {
                  this.$q.notify({
                    color: "positive",
                    position: "bottom",
                    message: "Succesfully Logged In",
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
                  message:
                    (error && error.response && error.response.data && (error.response.data.message || error.response.data.error)) ||
                    (error && error.message) ||
                    "Something went wrong! Contact administrator",
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
                message: "Your Accout is Locked, Please Contact Admin",
              });
            } else {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message:
                  (error.response && error.response.data && error.response.data.message) == null
                    ? "Please Try Again Later !"
                    : error.response.data.message,
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
