<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-md bottom-border"></div>
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"><strong>MARS API SYNC - LEAD FORM</strong>
        </div>
        <q-card style="width:1047px">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                 <q-input
                   type="textarea"
                   disable
                   id="textboxid"
                   name="textboxid"
                   v-model="formData.tokenLeadForm"
                   class="text-weight-regular text-grey-8"
                 />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <div class="text-center">
              <q-btn class="common-btn"
                color="purple-9" :disable="this.formData.tokenLeadForm == ''" size="15px" label="Submit"
                @click="fnFinalSubmit(formData)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LeadFormApiSync',
  setup() {
    return { v$: useVuelidate() }
  },
  props: ["info"],
  data() {
    return {
      formData: {
        tokenLeadForm: "Token " + localStorage.getItem("auth_token"),
      }
    };
  },
  validations() {
    return {
      formData: {
        tokenLeadForm: { required },
      }
    }
  },
  computed: {
    ...mapGetters("MarsApiSync", ["getdeviceMars"]),
  },
  methods: {
    ...mapActions("MarsApiSync", ["LEAD_FORM_MARS"]),
    async fnFinalSubmit(request) {
      const isValid = await this.v$.$validate()
      if (!isValid) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          delay: 0,
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
          })
          .catch(error => {
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
#textboxid {
  height: 119px;
  width: 97%;
  font-size: 14pt;
}
</style>
