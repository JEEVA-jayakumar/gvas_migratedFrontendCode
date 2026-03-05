<template>
  <div>
    <div class="col-12 q-title q-my-lg text-weight-regular"><strong>Notifications</strong></div>
    <q-form @submit.prevent="fnSaveMerchant(formData)">
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm q-py-sm">
            <div class="col-md-6 col-12">
              <q-select
                v-model.trim="formData.categoryType"
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
            <div class="col-md-6 col-12">
               <q-select
                  v-model="formData.tids"
                  use-input
                  use-chips
                  multiple
                  input-debounce="500"
                  label="TID"
                  placeholder="Search TID"
                  :options="tidOptions"
                  @filter="tidsearch"
                  @blur="v$.formData.tids.$touch"
                  :error="v$.formData.tids.$error"
                  class="text-weight-regular text-grey-8"
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

            <div class="col-md-7 col-12">
              <q-input
                v-model.trim="formData.notificationText"
                @blur="v$.formData.notificationText.$touch"
                :error="v$.formData.notificationText.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="*Notification Text"
              />
            </div>
            <div class="col-md-5 col-12 self-center">
              <q-btn
                size="md"
                type="submit"
                color="purple-9"
              >Submit</q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-form>

  </div>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "NotificationsPage",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      tidOptions: [],
      leadSourceOptions: [
        {
         label:"Offers",
         value:3
        },
        {
         label:"Risk Hold",
         value:1
        },
        {
         label:"Paper Roll",
         value:2
        }
      ],

      formData: {
        categoryType: "",
        tids: [],
        notificationText: "",
      }
    };
  },

  validations() {
    return {
      formData: {
        categoryType: { required },
        tids: { required },
        notificationText: { required },
      }
    };
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("Merchant", ["getMerchantTid"]),
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("Merchant", ["FETCH_ALL_MERCHANTTID", "SAVE_MERCHANT"]),

    async fnSaveMerchant(formData) {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
        return;
      } else {
        // Prepare payload: extract values from tids if they are objects
        const payload = {
          ...formData,
          tids: formData.tids.map(t => (t && typeof t === 'object' ? t.value : t))
        };

        this.SAVE_MERCHANT(payload)
          .then(response => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: response.data.message,
              icon: "thumb_up"
            });
            this.formData.categoryType = "";
            this.formData.tids = [];
            this.formData.notificationText = "";
            this.v$.formData.$reset();
          }).catch(() => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "warning",
              color: "amber-9",
              position: "bottom",
              message: error.data?.message || "Something went wrong"
            });
          });
      }
    },

    tidsearch(terms, update, abort) {
      if (terms.length < 1) {
        abort();
        return;
      }
      this.FETCH_ALL_MERCHANTTID(terms)
        .then(() => {
          update(() => {
            this.tidOptions = _.map(this.getMerchantTid, item => {
              return {
                label: item.label || item,
                value: item.value || item
              };
            });
          });
        })
        .catch(() => {
          abort();
        });
    }
  }
};
</script>
