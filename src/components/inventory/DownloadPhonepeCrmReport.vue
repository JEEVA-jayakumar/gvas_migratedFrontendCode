<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <q-card-section>
        <div class="q-title text-weight-regular text-center">
          <strong>Download Pending Tickets Reports</strong>
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-input filled v-model="formData.from" label="From Date" color="grey-9" >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.from" mask="YYYY-MM-DD" />
                </q-menu>
              </q-icon>
            </template>
          </q-input>

        <q-input filled v-model="formData.to" label="To Date" color="grey-9" >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.to" mask="YYYY-MM-DD" />
                </q-menu>
              </q-icon>
            </template>
          </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="bg-white text-weight-regular text-grey-8"
          @click="emitfnshowPhonepeCrmCallback"
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
  props: ["propPhonepeCrmCallback"],
  emits: ["emitfnshowPhonepeCrmCallback"],
  data() {
    return {
      toggleModel: this.propPhonepeCrmCallback,
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
      return !(this.formData.from != 0 || this.formData.to != 0);
    }
  },

  watch: {
    propPhonepeCrmCallback(val) {
      this.toggleModel = val;
    },
    toggleModel(val) {
      if (!val) {
        this.emitfnshowPhonepeCrmCallback();
      }
    }
  },

  methods: {
    ...mapActions("DownloadPhonepeCrmCallbackReport", ["FETCH_PHONEPE_CRM_CALLBACK_REPORT"]),
    emitfnshowPhonepeCrmCallback() {
      this.$emit("emitfnshowPhonepeCrmCallback");
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
      this.FETCH_PHONEPE_CRM_CALLBACK_REPORT(params)
        .then(() => {
          this.$emit("emitfnshowPhonepeCrmCallback");
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
          const message = (error.response.data && error.response.data.message) ? error.response.data.message : "Error occurred";

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
