<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw" class="q-pa-md">
      <q-card-section>
        <div class="q-title text-weight-regular text-center q-mb-md">
          <strong>Download Tracker File</strong>
        </div>
        <div class="column q-gutter-md">
          <q-input
            v-model="formData.fromDate"
            label="From Date"
            color="grey-9"
            mask="####-##-##"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.fromDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-model="formData.toDate"
            label="To Date"
            color="grey-9"
            mask="####-##-##"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.toDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="grey-8"
          @click="emitfnshowAggrMasterTrackerList"
        />
        <q-btn
          label="Download"
          color="purple-9"
          :disabled="submitDisabled"
          @click="downloadAggrmastertrackerlist(formData)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DownloadAggrMasterTracker",
  props: ["propAggrMasterTrackerList"],
  data() {
    return {
      toggleModel: this.propAggrMasterTrackerList,
      formData: {
        fromDate: "",
        toDate: ""
      }
    };
  },
  computed: {
    submitDisabled() {
      return !this.formData.fromDate || !this.formData.toDate;
    }
  },
  methods: {
    ...mapActions("DownloadMasterTrackerData", ["AGGREGATOR_MASTER_TRACKER_LIST_ALL_DATAS"]),
    emitfnshowAggrMasterTrackerList() {
      this.$emit("emitfnshowAggrMasterTrackerList");
    },
    downloadAggrmastertrackerlist(request) {
      let params = {
        fromDate: this.toTimestamp(request.fromDate),
        toDate: this.toTimestamp(request.toDate)
      };
      this.$q.loading.show({
        message: "Please wait.."
      });
      this.AGGREGATOR_MASTER_TRACKER_LIST_ALL_DATAS(params)
        .then(() => {
          this.$emit("emitfnshowAggrMasterTrackerList");
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Downloaded",
            icon: "thumb_up"
          });
          this.formData.fromDate = "";
          this.formData.toDate = "";
        })
        .catch(error => {
          this.$q.loading.hide();
          let msg = "Please select the field";
          if (error.status === 400) msg = "Output file size is high, Select smaller date range";
          else if (error.status === 500) msg = "INTERNAL_SERVER_ERROR";
          else if (error.status === 403 || error.status === 404) msg = "please choose some another date";

          this.$q.notify({
            color: "amber",
            position: "bottom",
            message: msg,
            icon: "thumb_down"
          });
          this.formData.fromDate = "";
          this.formData.toDate = "";
        });
    },
    toTimestamp(strDate) {
      if (!strDate) return null;
      var datePart = strDate.split("T")[0];
      var curDate = new Date();
      var mnth = curDate.getMonth() + 1;
      var chDate = curDate.getFullYear() + "-" + (mnth < 10 ? "0" + mnth : mnth) + "-" + (curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate());

      if (chDate === datePart) return Date.now();
      return Date.parse(strDate);
    }
  }
};
</script>
