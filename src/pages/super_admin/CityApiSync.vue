<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 q-pa-md border-bottom"></div>
      <div class="col-md-8 col-sm-10 col-xs-12 q-pa-sm">
        <div class="text-h6 q-px-lg q-py-md border-bottom text-grey-9">
          <strong>MARS API SYNC - CITY</strong>
        </div>
        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="row justify-center">
              <div class="col-12">
                <q-input
                  v-model="formData.tokenCity"
                  type="textarea"
                  outlined
                  readonly
                  label="Authorization Token"
                  rows="5"
                  class="text-weight-regular text-grey-8"
                  bg-color="grey-1"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-pb-lg">
            <q-btn
              unelevated
              color="purple-9"
              :disabled="!formData.tokenCity"
              size="md"
              label="Submit"
              @click="fnFinalSubmit"
              padding="10px 40px"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "CityApiSync",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        tokenCity: "Token " + localStorage.getItem("auth_token"),
      },
    };
  },
  validations() {
    return {
      formData: {
        tokenCity: { required },
      },
    };
  },
  methods: {
    ...mapActions("MarsApiSync", ["CITY_MARS"]),
    fnFinalSubmit() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          spinnerColor: "purple-9",
          message: "Submitting data..",
        });
        this.CITY_MARS(this.formData.tokenCity)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully synchronized!",
              icon: "thumb_up",
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Please try again later!",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
