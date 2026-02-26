<template>
  <div>
    <q-dialog
      minimized
      no-backdrop-dismiss
      no-esc-dismiss
      v-model="toggleModal"
      :content-css="{padding:'20px',minWidth:'40vw'}"
    >
      <q-card style="min-width: 40vw; padding: 20px;">
        <q-card-section>
          <div class="col-12 text-h6 q-py-md">
            <q-icon name="security" /> Change password
          </div>
        </q-card-section>

        <q-card-section class="column group" v-show="!currentPasswordMatched">
          <div class="col-12">
            <q-input
              type="password"
              color="grey-9"
              v-model="formData.currentPassword"
              @blur="v$.formData.currentPassword.$touch"
              :error="v$.formData.currentPassword.$error"
              label="Current Password*"
            />
          </div>
          <div class="col-12">
            <q-input
              type="password"
              color="grey-9"
              v-model="formData.newpassword"
              @blur="v$.formData.newpassword.$touch"
              :error="v$.formData.newpassword.$error"
              label="New Password*"
            />
            <p
              class="error1"
              v-if="v$.formData.newpassword.strongPassword.$invalid && v$.formData.newpassword.$dirty"
            >Strong passwords need to have a letter, a number, a special character, and be more than 8 characters long.</p>
          </div>
          <br />
          <div class="col-12">
            <q-input
              type="password"
              color="grey-9"
              v-model="formData.retypepassword"
              @blur="v$.formData.retypepassword.$touch"
              :error="v$.formData.retypepassword.$error"
              label="Confirm New Password*"
            />
            <p
              class="error1"
              v-if="v$.formData.retypepassword.strongPassword.$invalid && v$.formData.retypepassword.$dirty"
            >Strong passwords need to have a letter, a number, a special character, and be more than 8 characters long.</p>
          </div>
          <div class="col-12 group q-mt-md">
            <q-btn
              color="primary"
              class="q-ma-sm float-right"
              @click="submitPasswordChangeRequest()"
              align="right"
              label="Submit"
            />
            <q-btn
              outline
              color="dark"
              class="q-ma-sm float-right"
              @click="emitToggleMyAccount()"
              align="right"
              label="Cancel"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "changePassword",
  props: ["propsToggleModal"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModal: this.propsToggleModal,
      currentPasswordMatched: false,
      formData: {
        currentPassword: "",
        newpassword: "",
        retypepassword: ""
      }
    };
  },

  validations() {
    return {
      formData: {
        currentPassword: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(15)
        },
        newpassword: {
          required,
          strongPassword: (value) => {
            return (
              /[a-z]/.test(value) && // checks for a-z
              /[0-9]/.test(value) && // checks for 0-9
              (/\W|_/.test(value)) && // checks for special char
              value.length >= 8
            );
          }
        },
        retypepassword: {
          required,
          strongPassword: (value) => {
            return (
              /[a-z]/.test(value) && // checks for a-z
              /[0-9]/.test(value) && // checks for 0-9
              (/\W|_/.test(value)) && // checks for special char
              value.length >= 8
            );
          }
        }
      }
    };
  },
  methods: {
    ...mapActions("Authentication", ["CHANGE_PASSWORD"]),
    emitToggleMyAccount() {
      this.$emit("propsToggleModal");
    },
    async submitPasswordChangeRequest() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        this.$q.notify("Please review fields again.");
      } else if (
        this.formData.newpassword !== this.formData.retypepassword
      ) {
        this.$q.notify("New and confirm password must be same.");
      } else {
        this.CHANGE_PASSWORD({ password: this.formData.newpassword.toString() })
          .then(() => {
            this.$emit("propsToggleModal");
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Password changed successfully",
              icon: "thumb_up"
            });
            this.$router.push({ name: "login" });
          })
          .catch(error => {
            console.error("Change password error:", error);
            const message = (error.body && error.body.message) ? error.body.message : "Please Try Again Later !";
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: message,
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>

<style>
.error1 {
  color: red;
  font-size: 12px;
}
</style>
