<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 text-purple-9 q-mb-md">Notifications</div>

      <q-form @submit="fnSaveMerchant" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.categoryType"
              :options="leadSourceOptions"
              label="*Notification Category"
              :error="v$.formData.categoryType.$error"
              color="purple-9"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              dense
              use-input
              use-chips
              multiple
              v-model="formData.tids"
              label="TID"
              placeholder="Search TID"
              :options="tidOptions"
              @filter="tidsearch"
              :error="v$.formData.tids.$error"
              color="purple-9"
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

          <div class="col-12">
            <q-input
              outlined
              dense
              v-model.trim="formData.notificationText"
              label="*Notification Text"
              :error="v$.formData.notificationText.$error"
              color="purple-9"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <q-btn unelevated label="Submit" color="purple-9" type="submit" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Notifications",
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
        categoryType: null,
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

    async fnSaveMerchant() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "warning", message: "Please review fields again." });
        return;
      }

      this.$q.loading.show();
      // Ensure tids are sent as an array of values if needed, legacy might expect specific format
      const payload = {
        ...this.formData,
        tids: this.formData.tids.map(t => t.value || t)
      };

      this.SAVE_MERCHANT(payload)
        .then(response => {
          this.$q.notify({ color: "positive", message: response.data.message });
          this.resetForm();
        })
        .catch(error => {
          this.$q.notify({ color: "amber-9", message: error.data?.message || "Error occurred" });
        })
        .finally(() => this.$q.loading.hide());
    },

    resetForm() {
      this.formData = { categoryType: null, tids: [], notificationText: "" };
      this.v$.$reset();
    }
  }
};
</script>
