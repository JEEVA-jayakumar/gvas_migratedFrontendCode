<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <q-pull-to-refresh :distance="30" @refresh="PullToRefresh">
      <!-- Premium Page Header -->
      <div class="row items-center justify-between q-mb-xl fade-up">
        <div>
          <h1 class="text-h4 text-weight-bold text-slate-900 q-ma-none">Exception Resolution</h1>
          <p class="text-subtitle1 text-slate-500 q-ma-none">Manage and resolve critical process blockages</p>
        </div>
      </div>

      <div class="row q-col-gutter-lg fade-up">
        <!-- KYC Exceptions Column -->
        <div class="col-lg-4 col-md-6 col-sm-12">
          <q-card class="premium-card no-border shadow-2 full-height overflow-hidden" :class="{'serious-active': $route.params.id == 1}">
            <div class="bg-blue-6 q-pa-lg text-white flex justify-between items-center">
              <div>
                <div class="text-h6">KYC Exceptions</div>
                <div class="text-caption opacity-80">Identity verification issues</div>
              </div>
              <q-badge rounded color="white" text-color="blue-7" class="text-h6 text-weight-bolder q-pa-md shadow-2">
                {{ getExceptionQueueInfo.KYCExceptionCount }}
              </q-badge>
            </div>

            <q-scroll-area :style="'height:' + customKycHeight + 'px'" class="bg-white">
              <div v-if="checkExcpetionQueueKyc">
                <div
                  v-for="(item, index) in getExceptionQueueInfo.KYCExceptionQueue"
                  :key="item.id"
                  class="exception-item clickable"
                  @click="fnViewKycLeadDetails(item)"
                >
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="flex items-center q-mb-xs">
                        <q-badge outline color="blue-7" class="q-mr-sm" @click.stop="toggleLeadInformation(item)">
                          #{{ item.leadNumber }}
                        </q-badge>
                        <span class="text-weight-bold text-slate-900 capitalize">{{ item.leadName }}</span>
                      </div>
                      <div class="text-caption text-slate-500">{{ item.SOName }}</div>
                    </div>
                    <div class="col-auto text-right">
                       <div class="text-caption text-slate-400">Updated</div>
                       <div class="text-weight-medium text-blue-7">{{ $moment(item.submitteSATDate).format("DD MMM") }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-center q-pa-xl text-slate-300">
                <q-icon name="check_circle_outline" size="48px" />
                <div class="q-mt-sm">KYC Queue Clear</div>
              </div>
            </q-scroll-area>
          </q-card>
        </div>

        <!-- Bank Subvention Column -->
        <div class="col-lg-4 col-md-6 col-sm-12">
          <q-card class="premium-card no-border shadow-2 full-height overflow-hidden" :class="{'serious-active': $route.params.id == 2}">
            <div class="bg-green-6 q-pa-lg text-white flex justify-between items-center">
              <div>
                <div class="text-h6">Bank Subvention</div>
                <div class="text-caption opacity-80">Banking channel approvals</div>
              </div>
              <q-badge rounded color="white" text-color="green-7" class="text-h6 text-weight-bolder q-pa-md shadow-2">
                {{ getExceptionQueueInfo.BankExceptionCount }}
              </q-badge>
            </div>

            <q-scroll-area :style="'height:' + customBankSubventionHeight + 'px'" class="bg-white">
              <div v-if="checkExcpetionQueueBankSubvention">
                <div
                  v-for="(item, index) in getExceptionQueueInfo.BankSubventionQueue"
                  :key="index"
                  class="exception-item clickable"
                  @click="fnViewBankLeadDetails(item)"
                >
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="flex items-center q-mb-xs">
                        <q-badge outline color="green-7" class="q-mr-sm" @click.stop="toggleLeadInformation(item)">
                          #{{ item.leadNumber }}
                        </q-badge>
                        <span class="text-weight-bold text-slate-900 capitalize">{{ item.leadName }}</span>
                      </div>
                      <div class="text-caption text-slate-500">{{ item.createdBy?.name }}</div>
                    </div>
                    <div class="col-auto text-right">
                       <div class="text-caption text-slate-400">Updated</div>
                       <div class="text-weight-medium text-green-7">{{ $moment(item.submitteSATDate).format("DD MMM") }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-center q-pa-xl text-slate-300">
                <q-icon name="task_alt" size="48px" />
                <div class="q-mt-sm">Bank Queue Clear</div>
              </div>
            </q-scroll-area>
          </q-card>
        </div>

        <!-- Pricing Exception Column -->
        <div class="col-lg-4 col-md-6 col-sm-12">
          <q-card class="premium-card no-border shadow-2 full-height overflow-hidden" :class="{'serious-active': $route.params.id == 3}">
            <div class="bg-red-5 q-pa-lg text-white flex justify-between items-center">
              <div>
                <div class="text-h6">Pricing Exceptions</div>
                <div class="text-caption opacity-80">Commercial approvals</div>
              </div>
              <q-badge rounded color="white" text-color="red-5" class="text-h6 text-weight-bolder q-pa-md shadow-2">
                {{ getExceptionQueueInfo.PricingExceptionCount }}
              </q-badge>
            </div>

            <q-scroll-area :style="'height:' + customPricingHeight + 'px'" class="bg-white">
              <div v-if="checkExcpetionQueuePricing">
                <div
                  v-for="(item, index) in getExceptionQueueInfo.PricingExceptionQueue"
                  :key="item.id"
                  class="exception-item clickable"
                  @click="fnViewPricingLeadDetails(item)"
                >
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="flex items-center q-mb-xs">
                        <q-badge outline color="red-5" class="q-mr-sm" @click.stop="toggleLeadInformation(item)">
                          #{{ item.leadNumber }}
                        </q-badge>
                        <span class="text-weight-bold text-slate-900 capitalize">{{ item.leadName }}</span>
                      </div>
                      <div class="text-caption text-slate-500">Assigned to: RSM {{ item.name }}</div>
                    </div>
                    <div class="col-auto text-right">
                       <q-btn flat round icon="chevron_right" color="slate-300" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-center q-pa-xl text-slate-300">
                <q-icon name="verified" size="48px" />
                <div class="q-mt-sm">Pricing Queue Clear</div>
              </div>
            </q-scroll-area>
          </q-card>
        </div>
      </div>
    </q-pull-to-refresh>

    <!-- Common component to view full lead information -->
    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation" :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />
  </q-page>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "exceptionQueue",
  components: {
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      customPricingHeight: 400,
      customBankSubventionHeight: 400,
      customKycHeight: 400,
    };
  },
  created() {
    this.ajaxLoadDataForAllExceptionList();
  },
  computed: {
    ...mapGetters("ExceptionQueue", ["getExceptionQueueInfo"]),
    checkExcpetionQueueKyc() {
      return _.has(this.getExceptionQueueInfo, "KYCExceptionQueue") && this.getExceptionQueueInfo.KYCExceptionQueue.length > 0;
    },
    checkExcpetionQueueBankSubvention() {
      return _.has(this.getExceptionQueueInfo, "BankSubventionQueue") && this.getExceptionQueueInfo.BankSubventionQueue.length > 0;
    },
    checkExcpetionQueuePricing() {
      return _.has(this.getExceptionQueueInfo, "PricingExceptionQueue") && this.getExceptionQueueInfo.PricingExceptionQueue.length > 0;
    }
  },
  methods: {
    ...mapActions("ExceptionQueue", ["FETCH_ALL_EXCEPTIONS_DATA"]),
    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
    PullToRefresh(done) {
      this.FETCH_ALL_EXCEPTIONS_DATA()
        .then(() => { if (done) done(); })
        .catch(() => { if (done) done(); });
    },
    ajaxLoadDataForAllExceptionList() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Synchronizing queues..." });
      this.FETCH_ALL_EXCEPTIONS_DATA()
        .then(() => {
          this.calculateHeights();
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    calculateHeights() {
      const pricingLen = this.getExceptionQueueInfo.PricingExceptionQueue.length;
      this.customPricingHeight = pricingLen > 0 ? Math.min(Math.max(pricingLen * 110, 400), 600) : 400;

      const bankLen = this.getExceptionQueueInfo.BankSubventionQueue.length;
      this.customBankSubventionHeight = bankLen > 0 ? Math.min(Math.max(bankLen * 110, 400), 600) : 400;

      const kycLen = this.getExceptionQueueInfo.KYCExceptionQueue.length;
      this.customKycHeight = kycLen > 0 ? Math.min(Math.max(kycLen * 110, 400), 600) : 400;
    },
    fnViewKycLeadDetails(item) { this.$router.push("/sat/exception/queue/kyc/lead/details/" + item.id); },
    fnViewBankLeadDetails(item) { this.$router.push("/sat/exception/queue/bank/subvention/lead/details/" + item.id); },
    fnViewPricingLeadDetails(item) { this.$router.push("/sat/exception/queue/pricing/lead/details/" + item.id); }
  }
};
</script>

<style lang="scss" scoped>
.exception-item {
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    padding-left: 1.5rem;
  }

  &:last-child { border-bottom: none; }
}

.serious-active {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  transform: translateY(-4px);
  border: 2px solid #61116a !important;
}

.bg-blue-6 { background-color: #2563eb; }
.bg-green-6 { background-color: #16a34a; }
.bg-red-5 { background-color: #ef4444; }
</style>