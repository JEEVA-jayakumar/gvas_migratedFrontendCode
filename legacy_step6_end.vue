                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="
                            merchant.mdrPlan.incentive.minimumTxnValue
                          " placeholder="Max" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center" v-if="
                    merchant.companyInformation.mcc == '5541' ||
                    merchant.companyInformation.mcc == '5542'
                  ">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Convenience fees
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="merchant.mdrPlan.convenientFee.fixed"
                          placeholder="Fixed" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="
                            merchant.mdrPlan.convenientFee.percentage
                          " placeholder="%" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="merchant.mdrPlan.convenientFee.minimum"
                          placeholder="Max" />
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="
                            merchant.SharingDiscountFee.convenientFee.fixed
                          " placeholder="Fixed" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="
                            merchant.SharingDiscountFee.convenientFee.percentage
                          " placeholder="%" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="
                            merchant.SharingDiscountFee.convenientFee.minimum
                          " placeholder="Max" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('mdr')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>

          <q-step error-icon="warning" name="seventh" :error="error.tab.bankInformation" title="Bank & Collection"
            subtitle="Details">
            <div class="row q-mb-md gutter-sm items-center">
