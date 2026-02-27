<template>
  <div>
    <q-dialog
      persistent
      :model-value="propFinanceApprovalDatas"
      @update:model-value="emitfnshowFinanceapproval"
    >
      <q-card style="min-width: 40vw; padding: 20px;">
        <form>
          <div class="column group">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">
                <p align="center">
                  <strong>Download Finance Approval Tracker File</strong>
                </p>
              </div>
            </div>
            <div class="col-md-12 q-mb-md">
              <q-input filled v-model="formData.fromDate" label="From Date" color="grey-9" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.fromDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-md-12 q-mb-md">
              <q-input filled v-model="formData.toDate" label="To Date" color="grey-9" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.toDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-md-12 group q-mt-md" align="right">
              <q-btn
                flat
                align="right"
                class="bg-white text-weight-regular text-grey-8 q-mr-sm"
                @click="emitfnshowFinanceapproval()"
              >Cancel</q-btn>
              <q-btn
                align="right"
                @click="downloadApproval(formData)"
                :disabled="submitDisabled"
                color="purple-9"
              >Download</q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
const today = new Date();
const { addToDate, subtractFromDate } = date;
import { mapActions } from "vuex";

export default {
  props: ["propFinanceApprovalDatas"],
  data() {
    return {
      tomorrow: addToDate(today, { days: 0 }),
      yesterday: subtractFromDate(today, { days: 7720 }),
      state: new Date(),
      formData: {
        fromDate: "",
        toDate: ""
      },
    };
  },

  computed: {
    submitDisabled: function () {
      return !this.formData.fromDate || !this.formData.toDate;
    }
  },
  methods: {
    ...mapActions("DownloadMasterTrackerData", ["FINANCE_APPROVAL_TRACKER"]),
    emitfnshowFinanceapproval() {
      this.$emit("emitfnshowFinanceapproval");
    },
    downloadApproval(request) {
      let params = {
        fromDate: this.toTimestamp(request.fromDate.toString()),
        toDate: this.toTimestamp(request.toDate.toString())
      };
      this.$q.loading.show({
        delay: 100,
        spinnerColor: "purple-9",
        message: "Please wait.."
      });
      this.FINANCE_APPROVAL_TRACKER(params)
        .then(() => {
          this.$emit("emitfnshowFinanceapproval");
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Success, file has been downloaded",
            icon: "thumb_up"
          });
          this.formData.fromDate = "";
          this.formData.toDate = "";
        })
        .catch(error => {
          this.$q.loading.hide();
          let message = "Please select the field";
          if (error.status == 400) message = "Output file size is high, Select smaller date range";
          else if (error.status == 500) message = "INTERNAL_SERVER_ERROR";
          else if (error.status == 403 || error.status == 404) message = "please choose some another date";
          
          this.$q.notify({
            color: "amber",
            position: "bottom",
            message: message,
            icon: "thumb_down"
          });
          this.formData.fromDate = "";
          this.formData.toDate = "";
        });
    },
    toTimestamp(strDate) {
      var date = strDate.split("T")[0];
      var curDate = new Date();
      var mnth = curDate.getMonth() + 1;
      var chDate = curDate.getFullYear() + "-" + (mnth < 10 ? "0" + mnth : mnth) + "-" + curDate.getDate();
      var datum = null;
      if (chDate == date)
        datum = Date.now();
      else
        datum = Date.parse(strDate);
      return datum;
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
  position: absolute;
  text-transform: lowercase;
}
</style>
