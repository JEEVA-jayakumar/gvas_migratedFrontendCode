<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-md bottom-border"></div>
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"><strong>MARS API SYNC - RENTAL PLAN</strong>
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
                   v-model="formData.tokenRentalPlan"
                   class="text-weight-regular text-grey-8"
                 />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <div class="text-center">
              <q-btn class="common-btn"
                color="purple-9" size="15px" label="Submit"
                @click="fnFinalSubmit(formData)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RentalPlanApiSync',
  props: ["info"],
  data() {
    return {
      formData: {
        tokenRentalPlan: "101",
      }
    };
  },
  computed: {
    ...mapGetters("MarsApiSync", ["getdeviceMars"]),
  },
  methods: {
    ...mapActions("MarsApiSync", ["RENTAL_PLAN_MARS"]),
    fnFinalSubmit(request) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Submitting data.."
      });
      this.RENTAL_PLAN_MARS(this.formData.tokenRentalPlan)
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
};
</script>

<style scoped>
#textboxid {
  height: 119px;
  width: 97%;
  font-size: 14pt;
}
</style>
