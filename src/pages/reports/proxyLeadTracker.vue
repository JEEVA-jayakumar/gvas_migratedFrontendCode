<template>
  <q-page>
    <div>
      <!--START: table title -->
      <div class="col-md-12 text-h6 q-px-md q-py-md text-weight-regular bottom-border text-grey-9">Proxy Lead Miselling Tracker</div>
      <div class="row q-pa-md">
        <div class="col-12 col-md-6 group">
          <p>Choose one from the below or you can choose start and end date manually</p>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="1" label="Past 6 months"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="2" label="Past 3 months"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="3" label="Past 1 month"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="4" label="Past 4 weeks"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="5" label="Past 3 weeks"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="6" label="Past 2 weeks"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="7" label="Past 1 week"/>
          <q-radio color="grey-9" v-model="formData.option" @update:model-value="calculateDate" :val="8" label="Today"/>
        </div>
      </div>
      <div class="row q-pa-md q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-input filled v-model="formattedFrom" label="Start date" color="grey-9" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.from" mask="YYYY-MM-DD" />
                </q-menu>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-input filled v-model="formattedTo" label="End date" color="grey-9" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.to" mask="YYYY-MM-DD" />
                </q-menu>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 group q-mt-md">
          <q-btn class="common-dark-blue" @click="downloadReport()" label="Download" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { date } from "quasar";

export default {
  name: "proxyLeadTracker",
  data() {
    return {
      formData: {
        option: 8,
        from: date.formatDate(new Date(), 'YYYY-MM-DD'),
        to: date.formatDate(new Date(), 'YYYY-MM-DD'),
      },
    };
  },
  computed: {
    formattedFrom() {
      return this.$moment(this.formData.from).format("Do MMM Y");
    },
    formattedTo() {
      return this.$moment(this.formData.to).format("Do MMM Y");
    }
  },
  methods: {
    ...mapActions("reports", ["REPORT_PROXY_LEAD_MISSELLING"]),
    calculateDate() {
      let now = new Date();
      let newDate = new Date();
      if (this.formData.option == 1) {
        newDate = date.subtractFromDate(now, { month: 6 });
      } else if (this.formData.option == 2) {
        newDate = date.subtractFromDate(now, { month: 3 });
      } else if (this.formData.option == 3) {
        newDate = date.subtractFromDate(now, { month: 1 });
      } else if (this.formData.option == 4) {
        newDate = date.subtractFromDate(now, { days: 28 });
      } else if (this.formData.option == 5) {
        newDate = date.subtractFromDate(now, { days: 21 });
      } else if (this.formData.option == 6) {
        newDate = date.subtractFromDate(now, { days: 14 });
      } else if (this.formData.option == 7) {
        newDate = date.subtractFromDate(now, { days: 7 });
      } else {
        newDate = new Date();
      }
      this.formData.from = date.formatDate(newDate, 'YYYY-MM-DD');
      this.formData.to = date.formatDate(now, 'YYYY-MM-DD');
    },
    downloadReport() {
      this.$q.loading.show({ delay: 100 });
      this.REPORT_PROXY_LEAD_MISSELLING(this.formData)
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", position: "bottom", message: "Success, file has been downloaded", icon: "check" });
        })
        .catch(() => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", position: "bottom", message: "Please try again", icon: "thumb_down" });
        });
    },
  },
};
</script>
