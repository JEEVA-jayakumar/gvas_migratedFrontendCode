<template>
  <q-page>
    <div class="col-12 text-h6 q-my-lg text-weight-regular"><strong>Notifications</strong></div>
    <form>
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row q-col-gutter-md q-py-sm">
            <div class="col-md-6">
              <q-select
                v-model="formData.categoryType"
                @blur="v$.formData.categoryType.$touch"
                :error="v$.formData.categoryType.$error"
                class="text-weight-regular text-grey-8"
                :options="leadSourceOptions"
                label="*Notification Category"
                placeholder="Notification Category"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6">
              <q-select
                use-input
                use-chips
                multiple
                clearable
                color="grey-9"
                v-model="formData.tids"
                label="TID"
                placeholder="Search TID"
                :options="tidOptions"
                @filter="tidsearch"
                @blur="v$.formData.tids.$touch"
                :error="v$.formData.tids.$error"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-md-7 q-mt-md">
              <q-input
                v-model.trim="formData.notificationText"
                @blur="v$.formData.notificationText.$touch"
                :error="v$.formData.notificationText.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Notification Text"
              />
            </div>
            <div class="col-md-5 q-mt-md">
              <q-btn
                size="md"
                type="button"
                color="purple-9"
                @click="fnSaveMerchant(formData)"
                label="Submit"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NotificationsPage",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      tidOptions: [],
      leadSourceOptions: [
        { label: "Offers", value: 3 },
        { label: "Risk Hold", value: 1 },
        { label: "Paper Roll", value: 2 }
      ],
      formData: {
        categoryType: "",
        tids: [],
        notificationText: ""
      }
    };
  },
  validations() {
    return {
      formData: {
        categoryType: { required },
        tids: { required },
        notificationText: { required }
      }
    };
  },
  computed: {
    ...mapGetters("Merchant", ["getMerchantTid"])
  },
  methods: {
    ...mapActions("Merchant", ["FETCH_ALL_MERCHANTTID", "SAVE_MERCHANT"]),
    async fnSaveMerchant(formData) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify("Please review fields again.");
        return;
      } else {
        this.$q.loading.show();
        this.SAVE_MERCHANT(formData)
          .then(response => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: response.data.message,
              icon: "thumb_up"
            });
            this.resetForm();
          })
          .catch(error => {
            this.$q.notify({
              type: "warning",
              color: "amber-9",
              position: "bottom",
              message: error.data?.message || "Error occurred"
            });
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      }
    },
    async tidsearch(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      this.FETCH_ALL_MERCHANTTID(val)
        .then(() => {
          update(() => {
            this.tidOptions = this.getMerchantTid.map(tid => ({
              label: tid.label || tid,
              value: tid.value || tid
            }));
          });
        })
        .catch(() => abort());
    },
    resetForm() {
      this.formData.categoryType = "";
      this.formData.tids = [];
      this.formData.notificationText = "";
      this.v$.$reset();
    }
  }
};
</script>
