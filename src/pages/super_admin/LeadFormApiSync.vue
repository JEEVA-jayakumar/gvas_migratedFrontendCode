<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border"></div>
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          <strong>MARS API SYNC - LEAD FORM</strong>
        </div>
        <q-card style="width:1047px">
          <q-card-section>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <q-list class="no-border">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <q-item>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <q-item-section>
                  <textarea
                    disabled
                    id="textboxid"
                    name="textboxid"
                    rows="5"
                    cols="50"
                    v-model="formData.tokenLeadForm"
                    class="text-weight-regular text-grey-8"
                  ></textarea>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <div align="center">
              <q-btn
                class="common-btn"
                color="purple-9"
                :disabled="this.formData.tokenLeadForm == ''"
                size="15px"
                label="Submit"
                @click="fnFinalSubmit(formData)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LeadFormApiSync",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        tokenLeadForm: "Token " + localStorage.getItem("auth_token")
      }
    };
  },

  validations() {
    return {
      formData: {
        tokenLeadForm: {
          required
        }
      }
    };
  },

  computed: {
    ...mapGetters("MarsApiSync", ["getdeviceMars"])
  },

  methods: {
    ...mapActions("MarsApiSync", ["LEAD_FORM_MARS"]),

    async fnFinalSubmit(request) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 0, // ms
          spinnerColor: "purple-9",
          message: "Submitting data.."
        });
        this.LEAD_FORM_MARS(this.formData.tokenLeadForm)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully created!",
              icon: "thumb_up"
            });
          }).catch(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Please try again later!",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>

<style scoped>
p {
  text-indent: 30px;
}

label {
  margin-side: 20px;
}

#textboxid {
  height: 119px;
  width: 97%;
  font-size: 14pt;
}

.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
