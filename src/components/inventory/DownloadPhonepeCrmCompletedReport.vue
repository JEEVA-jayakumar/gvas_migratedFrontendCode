<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <q-card-section>
        <div class="text-h6 text-weight-regular text-center">
          <strong>Download Completed Tickets Reports</strong>
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-input filled v-model="formData.from" label="From Date" color="grey-9" readonly @click="$refs.fromDateProxy.show()">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="fromDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.from" mask="YYYY-MM-DD" @update:model-value="$refs.fromDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input filled v-model="formData.to" label="To Date" color="grey-9" readonly @click="$refs.toDateProxy.show()">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="toDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.to" mask="YYYY-MM-DD" @update:model-value="$refs.toDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="bg-white text-weight-regular text-grey-8"
          @click="emitfnshowPhonepeCrmComplete"
          label="Cancel"
        />
        <q-btn
          :disabled="submitDisabled"
          @click="downloadHistory(formData)"
          color="purple-9"
          label="Download"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
const today = new Date();
const { startOfDate, addToDate, subtractFromDate } = date;
import { mapActions } from "vuex";

export default {
  props: ["propPhonepeCompletedTicket"],
  emits: ["emitfnshowPhonepeCrmComplete"],
  data() {
    return {
      toggleModel: this.propPhonepeCompletedTicket,
      tomorrow: addToDate(today, { days: 0 }),
      yesterday: subtractFromDate(today, { days: 1440 }),
      formData: {
        from: "",
        to: "",
      },
    };
  },

  computed: {
    submitDisabled() {
      return !this.formData.from || !this.formData.to;
    }
  },

  watch: {
    propPhonepeCompletedTicket(val) {
      this.toggleModel = val;
    },
    toggleModel(val) {
      if (!val) {
        this.emitfnshowPhonepeCrmComplete();
      }
    }
  },

  methods: {
    ...mapActions("DownloadPhonepeCrmCallbackReport", ["FETCH_PHONEPE_CRM_COMPLETED_CALLBACK_REPORT"]),
    emitfnshowPhonepeCrmComplete() {
      this.$emit("emitfnshowPhonepeCrmComplete");
    },

    downloadHistory(request) {
      let params = {
        from: this.toTimestamp(request.from),
        to: this.toTimestamp(request.to),
      };
      this.$q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Please wait..",
      });
      this.FETCH_PHONEPE_CRM_COMPLETED_CALLBACK_REPORT(params)
        .then(() => {
          this.$emit("emitfnshowPhonepeCrmComplete");
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Downloaded",
            icon: "thumb_up",
          });
          this.formData.from = "";
          this.formData.to = "";
        })
        .catch((error) => {
          this.$q.loading.hide();
          const status = error.status || (error.response && error.response.status);
          const message = (error.body && error.body.message) ? error.body.message : "Error occurred";

          if (status == 400) {
            this.$q.notify({
              color: "amber",
              position: "bottom",
              message: "Output file size is high, Select smaller date range",
              icon: "thumb_down",
            });
          } else {
             this.$q.notify({
              color: "negative",
              position: "bottom",
              message: message,
              icon: "thumb_down",
            });
          }
          this.formData.from = "";
          this.formData.to = "";
        });
    },
    toTimestamp(strDate) {
      if (!strDate) return null;
      var dateOnly = strDate.split("T")[0];
      var curDate = new Date();
      var mnth = curDate.getMonth() + 1;
      var chDate = curDate.getFullYear() + "-" + (mnth < 10 ? "0" + mnth : mnth) + "-" + (curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate());

      if (chDate === dateOnly) {
        return Date.now();
      } else {
        return Date.parse(strDate);
      }
    }
  },
};
</script>
