<template>
  <q-dialog
    v-model="visible"
    @hide="onDialogHide"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="forgot-password-card shadow-premium">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold text-primary">Forgot Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <p class="text-subtitle2 text-grey-7 q-mb-lg">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div class="input-group">
          <label class="text-subtitle2 text-weight-bold text-grey-8 q-mb-xs block">Email Address</label>
          <q-input
            v-model.trim="formData.email"
            @blur="v$.formData.email.$touch"
            :error="v$.formData.email.$error"
            outlined
            bg-color="grey-1"
            placeholder="e.g. name@company.com"
            class="premium-input"
            @keyup.enter="fnSendforgetPasswordSubmit"
          >
            <template v-slot:prepend>
              <q-icon name="o_email" color="primary" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancel"
          color="grey-7"
          v-close-popup
          class="text-weight-bold"
          no-caps
        />
        <q-btn
          unelevated
          label="Send Reset Link"
          color="primary"
          @click="fnSendforgetPasswordSubmit"
          class="submit-btn-sm"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: 'ForgetPasswordModal',
  props: {
    propShowForgetPassword: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      visible: this.propShowForgetPassword,
      formData: {
        email: ""
      }
    };
  },
  watch: {
    propShowForgetPassword(val) {
      this.visible = val;
    }
  },
  validations: {
    formData: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    ...mapActions("Authentication", ["SEND_FORGOT_PASSWORD_LINK_MAIL"]),
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),

    onDialogHide() {
      this.$emit("emitfnShowForgetPasswordModal");
    },

    fnSendforgetPasswordSubmit() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify({
          message: "Please enter a valid email address.",
          color: "warning",
          icon: "warning"
        });
        return;
      }

      this.$q.loading.show({
        delay: 100,
        spinnerColor: "primary",
        message: "Sending email..."
      });

      this.TOGGLE_COMMON_LOADER(true);
      this.SEND_FORGOT_PASSWORD_LINK_MAIL(this.formData)
        .then(() => {
          this.$q.loading.hide();
          this.visible = false;
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "An email has been sent to you!",
            icon: "thumb_up"
          });
        })
        .catch(error => {
          this.$q.loading.hide();
          const message = error.response?.data?.message || "Please try again later!";
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: message,
            icon: "thumb_down"
          });
        })
        .finally(() => {
          this.TOGGLE_COMMON_LOADER(false);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.forgot-password-card {
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
}

.premium-input {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    border: 1.5px solid #f1f5f9;

    &:before {
      border: none !important;
    }

    &:after {
      border-width: 1.5px !important;
    }
  }
}

.submit-btn-sm {
  padding: 8px 24px;
  border-radius: 10px !important;
  font-weight: 700;
}

.shadow-premium {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.block {
  display: block;
}
</style>
