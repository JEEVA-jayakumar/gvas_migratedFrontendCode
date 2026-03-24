<template>
  <q-page>
    <q-pull-to-refresh :distance="30" @refresh="PullToRefresh">
      <div class="row">
        <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular text-grey-9 bottom-border">
          Exception Queue
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12">
          <!-- KYC exception queue header -->
          <q-card :class="[$route.params.id == 1 ? 'seriousActive border-blue' : '']" class="shadow-0 q-ma-md">
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-item class="bg-light-blue relative-position">
                  <q-item-section>
                    <q-item-label class="text-grey-12">KYC exceptions queue</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn round color="grey-12" class="shadow-5" style="border: 3px solid rgb(32, 169, 244);" text-color="light-blue">
                      {{ getExceptionQueueInfo.KYCExceptionCount }}
                    </q-btn>
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <!-- KYC exception queue body -->
            <q-scroll-area :style="'height:' + customKycHeight + 'px'" :thumb-style="{ right: '0px', width: '5px', background: 'rgba(0,0,0,0.15)', opacity: 1 }">
              <div v-if="checkExcpetionQueueKyc">
                <div class="bottom-border q-pa-sm cursor-pointer" @mouseover="fnKycHighlighItem(index)" @click="fnViewKycLeadDetails(item)" :class="[kycActiveItemId === index ? 'bg-grey-4' : 'bg-white']" v-for="(item, index) in getExceptionQueueInfo.KYCExceptionQueue" :key="item.id">
                  <div class="row">
                    <div class="col-md-5 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-light-blue cursor-pointer" @click.stop="toggleLeadInformation(item)">
                        #{{ item.leadNumber }}
                      </div>
                      <div class="q-caption no-margin text-dark capitalize">{{ item.leadName }}</div>
                    </div>
                    <div class="col-md-7 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-dark">{{ item.SOName }}</div>
                      <div class="q-caption text-dark">
                        Date of Updation :
                        <span class="text-primary">{{ $moment(item.submitteSATDate).format("MMMM Do YYYY") }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom-border q-ma-sm" v-else>
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12 text-weight-light" align="center">
                    <div class="q-caption text-dark q-pa-md">No data to display</div>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-card>
        </div>

        <div class="col-md-4 col-sm-12 col-xs-12">
          <!-- Bank subvention queue header -->
          <q-card :class="[$route.params.id == 2 ? 'seriousActive border-green' : '']" class="shadow-0 q-ma-md">
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-item class="bg-green-7">
                  <q-item-section>
                    <q-item-label class="text-grey-12">Bank Subvention Queue</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn round color="grey-12" class="shadow-5" style="border: 3px solid rgb(67, 159, 71);" text-color="green-8">
                      {{ getExceptionQueueInfo.BankExceptionCount }}
                    </q-btn>
                  </q-item-section>
                </q-item>
              </div>
            </div>
            <!-- Bank subvention queue body -->
            <q-scroll-area :style="'height:' + customBankSubventionHeight + 'px'" :thumb-style="{ right: '0px', width: '5px', background: 'rgba(0,0,0,0.15)', opacity: 1 }">
              <div v-if="checkExcpetionQueueBankSubvention">
                <div class="bottom-border q-pa-sm cursor-pointer" @mouseover="fnBankHighlighItem(index)" @click="fnViewBankLeadDetails(item)" :class="[bankActiveItemId === index ? 'bg-grey-4' : 'bg-white']" v-for="(item, index) in getExceptionQueueInfo.BankSubventionQueue" :key="index">
                  <div class="row">
                    <div class="col-md-5 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-light-blue cursor-pointer" @click.stop="toggleLeadInformation(item)">
                        #{{ item.leadNumber }}
                      </div>
                      <div class="q-caption no-margin text-dark capitalize">{{ item.leadName }}</div>
                    </div>
                    <div class="col-md-7 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-dark">{{ item.createdBy?.name }}</div>
                      <div class="q-caption text-dark">
                        Date of Updation :
                        <span class="text-primary">{{ $moment(item.submitteSATDate).format("MMMM Do YYYY") }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom-border q-ma-sm" v-else>
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12 text-weight-light" align="center">
                    <div class="q-caption text-dark q-pa-md">No data to display</div>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-card>
        </div>

        <div class="col-md-4 col-sm-12 col-xs-12">
          <!-- Pricing Exception Queue header -->
          <q-card :class="[$route.params.id == 3 ? 'seriousActive border-red' : '']" class="shadow-0 q-ma-md">
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <q-item class="bg-red-7">
                  <q-item-section>
                    <q-item-label class="text-grey-12">Pricing Exception Queue</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn round color="grey-12" class="shadow-5" style="border: 3px solid rgb(244, 67, 55);" text-color="red-6">
                      {{ getExceptionQueueInfo.PricingExceptionCount }}
                    </q-btn>
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <!-- Pricing Exception Queue body -->
            <q-scroll-area :style="'height:' + customPricingHeight + 'px'" :thumb-style="{ right: '0px', width: '5px', background: 'rgba(0,0,0,0.15)', opacity: 1 }">
              <div v-if="checkExcpetionQueuePricing">
                <div class="bottom-border q-pa-sm cursor-pointer" @mouseover="fnPricingHighlighItem(index)" @click="fnViewPricingLeadDetails(item)" :class="[pricingActiveItemId === index ? 'bg-grey-4' : 'bg-white']" v-for="(item, index) in getExceptionQueueInfo.PricingExceptionQueue" :key="item.id">
                  <div class="row">
                    <div class="col-md-5 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-light-blue cursor-pointer" @click.stop="toggleLeadInformation(item)">
                        #{{ item.leadNumber }}
                      </div>
                      <div class="q-caption no-margin text-dark capitalize">{{ item.leadName }}</div>
                    </div>
                    <div class="col-md-7 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-dark capitalize">{{ item.createdBy?.name }}</div>
                      <div class="q-caption text-dark capitalize">Assigned to : RSM {{ item.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom-border q-ma-sm" v-else>
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12 text-weight-light" align="center">
                    <div class="q-caption text-dark q-pa-md">No data to display</div>
                  </div>
                </div>
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
      customPricingHeight: 100,
      customBankSubventionHeight: 100,
      customKycHeight: 100,
      kycActiveItemId: "",
      bankActiveItemId: "",
      pricingActiveItemId: ""
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
      this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_EXCEPTIONS_DATA()
        .then(() => {
          this.calculateHeights();
          this.$q.loading.hide();
        })
        .catch(() => { this.$q.loading.hide(); });
    },
    calculateHeights() {
      const pricingLen = this.getExceptionQueueInfo.PricingExceptionQueue.length;
      this.customPricingHeight = pricingLen > 0 ? Math.min(pricingLen * 100, 500) : 100;

      const bankLen = this.getExceptionQueueInfo.BankSubventionQueue.length;
      this.customBankSubventionHeight = bankLen > 0 ? Math.min(bankLen * 100, 500) : 100;

      const kycLen = this.getExceptionQueueInfo.KYCExceptionQueue.length;
      this.customKycHeight = kycLen > 0 ? Math.min(kycLen * 100, 500) : 100;
    },
    fnKycHighlighItem(index) { this.kycActiveItemId = index; },
    fnBankHighlighItem(index) { this.bankActiveItemId = index; },
    fnPricingHighlighItem(index) { this.pricingActiveItemId = index; },
    fnViewKycLeadDetails(item) { this.$router.push("/sat/exception/queue/kyc/lead/details/" + item.id); },
    fnViewBankLeadDetails(item) { this.$router.push("/sat/exception/queue/bank/subvention/lead/details/" + item.id); },
    fnViewPricingLeadDetails(item) { this.$router.push("/sat/exception/queue/pricing/lead/details/" + item.id); }
  }
};
</script>

<style scoped>
.seriousActive { box-shadow: 0px 0px 15px #3a3a3aa8 !important; }
.border-blue { border: 3px solid #20a9f4; }
.border-green { border: 3px solid #43a047; }
.border-red { border: 3px solid #e53835; }
</style>