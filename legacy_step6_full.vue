          <q-step error-icon="warning" :error="error.tab.mdrPlan || error.SharingDiscountFee" name="sixth"
            title="Discount" subtitle="Rate">
            <div class="row group items-center">
              <div v-if="$v.merchant.mdrPlan.$anyError" class="col-md-12 text-negative">
                <q-icon color="negative" name="warning" />&nbsp; Error in MDR
                plan fields, kindly check it.
              </div>
              <div v-if="$v.merchant.SharingDiscountFee.$anyError" class="col-md-12 text-negative">
                <q-icon color="negative" name="warning" />&nbsp; Error in
                Sharing discount fee fields, kindly check it.
              </div>
              <div class="col-md-12">
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Domestic Debit Card below 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="q-caption text-weight-medium q-py-sm" align="center">
                      Merchant Disc Fee
                    </div>
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.domesticDebitUpTo2000.fixed
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.domesticDebitUpTo2000.fixed
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.domesticDebitUpTo2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitUpTo2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.domesticDebitUpTo2000
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.domesticDebitUpTo2000.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.domesticDebitUpTo2000.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.domesticDebitUpTo2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitUpTo2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.domesticDebitUpTo2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.domesticDebitUpTo2000.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.domesticDebitUpTo2000.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.domesticDebitUpTo2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitUpTo2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.domesticDebitUpTo2000
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="q-caption text-weight-medium q-py-sm" align="center">
                      Sharing Disc Fee
                    </div>
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitUpTo2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitUpTo2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitUpTo2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitUpTo2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitUpTo2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitUpTo2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Domestic Debit Card above 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.domesticDebitAbove2000.fixed
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.domesticDebitAbove2000.fixed
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.domesticDebitAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitAbove2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .domesticDebitAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.domesticDebitAbove2000
                              .percentage.$touch;
                          " :error="
                            $v.merchant.mdrPlan.domesticDebitAbove2000
                              .percentage.$error
                          " v-model.trim="
                            merchant.mdrPlan.domesticDebitAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitAbove2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .domesticDebitAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.domesticDebitAbove2000.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.domesticDebitAbove2000.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.domesticDebitAbove2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitAbove2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .domesticDebitAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.domesticDebitAbove2000
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.domesticDebitAbove2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.domesticDebitAbove2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Standard/Classic (1st Stab)
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.standardOrClassic.fixed.$touch
                          " :error="
                            $v.merchant.mdrPlan.standardOrClassic.fixed.$error
                          " v-model.trim="
                            merchant.mdrPlan.standardOrClassic.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.standardOrClassic.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.standardOrClassic
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.standardOrClassic.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.standardOrClassic.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.standardOrClassic.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.standardOrClassic
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.standardOrClassic
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.standardOrClassic.minimum.$touch
                          " :error="
                            $v.merchant.mdrPlan.standardOrClassic.minimum.$error
                          " v-model.trim="
                            merchant.mdrPlan.standardOrClassic.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.standardOrClassic
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.standardOrClassic
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.standardOrClassic
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.standardOrClassic
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.standardOrClassic.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .standardOrClassic.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .standardOrClassic.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.standardOrClassic
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.standardOrClassic
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.standardOrClassic
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .standardOrClassic.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .standardOrClassic.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.standardOrClassic
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.standardOrClassic
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.standardOrClassic
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .standardOrClassic.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .standardOrClassic.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Premium/Platinum (2nd Stab)
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.premiumOrPlatinum.fixed.$touch
                          " :error="
                            $v.merchant.mdrPlan.premiumOrPlatinum.fixed.$error
                          " v-model.trim="
                            merchant.mdrPlan.premiumOrPlatinum.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.premiumOrPlatinum.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.premiumOrPlatinum
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.premiumOrPlatinum.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.premiumOrPlatinum.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.premiumOrPlatinum.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.premiumOrPlatinum
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.premiumOrPlatinum
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.premiumOrPlatinum.minimum.$touch
                          " :error="
                            $v.merchant.mdrPlan.premiumOrPlatinum.minimum.$error
                          " v-model.trim="
                            merchant.mdrPlan.premiumOrPlatinum.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.premiumOrPlatinum
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.premiumOrPlatinum
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.premiumOrPlatinum
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.premiumOrPlatinum
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.premiumOrPlatinum.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .premiumOrPlatinum.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .premiumOrPlatinum.minimum
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.premiumOrPlatinum
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.premiumOrPlatinum
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.premiumOrPlatinum
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .premiumOrPlatinum.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .premiumOrPlatinum.minimum
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.premiumOrPlatinum
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.premiumOrPlatinum
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.premiumOrPlatinum
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .premiumOrPlatinum.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .premiumOrPlatinum.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Super Premium/Signature (3rd Stab)
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.superPremiumOrSignature.fixed
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.superPremiumOrSignature.fixed
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.superPremiumOrSignature.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.superPremiumOrSignature
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .superPremiumOrSignature.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.superPremiumOrSignature
                              .percentage.$touch;
                          " :error="
                            $v.merchant.mdrPlan.superPremiumOrSignature
                              .percentage.$error
                          " v-model.trim="
                            merchant.mdrPlan.superPremiumOrSignature.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.superPremiumOrSignature
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .superPremiumOrSignature.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.superPremiumOrSignature.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.superPremiumOrSignature.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.superPremiumOrSignature.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.superPremiumOrSignature
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .superPremiumOrSignature.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .superPremiumOrSignature.fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .superPremiumOrSignature.fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.superPremiumOrSignature
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .superPremiumOrSignature.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .superPremiumOrSignature.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .superPremiumOrSignature.percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .superPremiumOrSignature.percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.superPremiumOrSignature
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .superPremiumOrSignature.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .superPremiumOrSignature.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .superPremiumOrSignature.minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .superPremiumOrSignature.minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.superPremiumOrSignature
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .superPremiumOrSignature.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .superPremiumOrSignature.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Commercial/Coporate 4th Stab
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.commercialOrCorporate.fixed
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.commercialOrCorporate.fixed
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.commercialOrCorporate.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.commercialOrCorporate
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.commercialOrCorporate
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.commercialOrCorporate.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.commercialOrCorporate.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.commercialOrCorporate.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.commercialOrCorporate
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.commercialOrCorporate
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.commercialOrCorporate.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.commercialOrCorporate.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.commercialOrCorporate.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.commercialOrCorporate
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.commercialOrCorporate
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.commercialOrCorporate
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.commercialOrCorporate
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.commercialOrCorporate
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .commercialOrCorporate.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .commercialOrCorporate.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.commercialOrCorporate
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.commercialOrCorporate
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.commercialOrCorporate
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .commercialOrCorporate.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .commercialOrCorporate.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.commercialOrCorporate
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.commercialOrCorporate
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.commercialOrCorporate
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .commercialOrCorporate.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .commercialOrCorporate.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      International Debit Card
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.internationalDebitCard.fixed
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.internationalDebitCard.fixed
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.internationalDebitCard.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.internationalDebitCard
                              .percentage.$touch;
                          " :error="
                            $v.merchant.mdrPlan.internationalDebitCard
                              .percentage.$error
                          " v-model.trim="
                            merchant.mdrPlan.internationalDebitCard.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.internationalDebitCard.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.internationalDebitCard.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.internationalDebitCard.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .internationalDebitCard.fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .internationalDebitCard.fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.internationalDebitCard
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalDebitCard.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalDebitCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .internationalDebitCard.percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .internationalDebitCard.percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.internationalDebitCard
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalDebitCard.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalDebitCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .internationalDebitCard.minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .internationalDebitCard.minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.internationalDebitCard
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalDebitCard.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalDebitCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      International Credit Card
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.internationalCreditCard.fixed
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.internationalCreditCard.fixed
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.internationalCreditCard.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.internationalCreditCard
                              .percentage.$touch;
                          " :error="
                            $v.merchant.mdrPlan.internationalCreditCard
                              .percentage.$error
                          " v-model.trim="
                            merchant.mdrPlan.internationalCreditCard.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.internationalCreditCard.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.internationalCreditCard.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.internationalCreditCard.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .internationalCreditCard.fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .internationalCreditCard.fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.internationalCreditCard
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalCreditCard.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalCreditCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .internationalCreditCard.percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .internationalCreditCard.percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.internationalCreditCard
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalCreditCard.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalCreditCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee
                              .internationalCreditCard.minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee
                              .internationalCreditCard.minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.internationalCreditCard
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalCreditCard.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalCreditCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Onus</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.onus.fixed.$touch"
                          :error="$v.merchant.mdrPlan.onus.fixed.$error" v-model.trim="merchant.mdrPlan.onus.fixed"
                          placeholder="Fixed" />
                        <div class="text-negative" v-if="error.field.merchant.mdrPlan.onus.fixed.alert">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.onus.fixed" />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.onus.percentage.$touch"
                          :error="$v.merchant.mdrPlan.onus.percentage.$error"
                          v-model.trim="merchant.mdrPlan.onus.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.onus.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.onus.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.onus.minimum.$touch"
                          :error="$v.merchant.mdrPlan.onus.minimum.$error" v-model.trim="merchant.mdrPlan.onus.minimum"
                          placeholder="Max" />
                        <div class="text-negative" v-if="error.field.merchant.mdrPlan.onus.minimum.alert">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.onus.minimum" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.onus.fixed.$touch
                          " :error="
                            $v.merchant.SharingDiscountFee.onus.fixed.$error
                          " v-model.trim="merchant.SharingDiscountFee.onus.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.onus.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.onus.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.onus.percentage
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.onus.percentage
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.onus.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.onus
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.onus
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.onus.minimum.$touch
                          " :error="
                            $v.merchant.SharingDiscountFee.onus.minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.onus.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.onus.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.onus
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Diners</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.diners.fixed.$touch"
                          :error="$v.merchant.mdrPlan.diners.fixed.$error" v-model.trim="merchant.mdrPlan.diners.fixed"
                          placeholder="Fixed" />
                        <div class="text-negative" v-if="error.field.merchant.mdrPlan.diners.fixed.alert">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.diners.fixed" />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.diners.percentage.$touch"
                          :error="$v.merchant.mdrPlan.diners.percentage.$error"
                          v-model.trim="merchant.mdrPlan.diners.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.diners.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.diners.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.diners.minimum.$touch"
                          :error="$v.merchant.mdrPlan.diners.minimum.$error"
                          v-model.trim="merchant.mdrPlan.diners.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.diners.minimum.alert
                          ">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.diners.minimum" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.diners.fixed.$touch
                          " :error="
                            $v.merchant.SharingDiscountFee.diners.fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.diners.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.diners.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.diners
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.diners.percentage
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.diners.percentage
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.diners.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.diners
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.diners
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.diners.minimum.$touch
                          " :error="
                            $v.merchant.SharingDiscountFee.diners.minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.diners.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.diners
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.diners
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Amex Domestic
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.amexDomestic.fixed.$touch"
                          :error="$v.merchant.mdrPlan.amexDomestic.fixed.$error"
                          v-model.trim="merchant.mdrPlan.amexDomestic.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexDomestic.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexDomestic.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.amexDomestic.percentage.$touch
                          " :error="
                            $v.merchant.mdrPlan.amexDomestic.percentage.$error
                          " v-model.trim="
                            merchant.mdrPlan.amexDomestic.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexDomestic.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexDomestic
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.amexDomestic.minimum.$touch
                          " :error="
                            $v.merchant.mdrPlan.amexDomestic.minimum.$error
                          " v-model.trim="merchant.mdrPlan.amexDomestic.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexDomestic.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexDomestic.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.amexDomestic.fixed
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.amexDomestic.fixed
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.amexDomestic.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.amexDomestic
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexDomestic.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.amexDomestic
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.amexDomestic
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.amexDomestic.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.amexDomestic
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexDomestic.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.amexDomestic.minimum
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.amexDomestic.minimum
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.amexDomestic.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.amexDomestic
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexDomestic.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Amex International
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.amexInternational.fixed.$touch
                          " :error="
                            $v.merchant.mdrPlan.amexInternational.fixed.$error
                          " v-model.trim="
                            merchant.mdrPlan.amexInternational.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexInternational.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexInternational
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.amexInternational.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.amexInternational.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.amexInternational.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexInternational
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexInternational
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.amexInternational.minimum.$touch
                          " :error="
                            $v.merchant.mdrPlan.amexInternational.minimum.$error
                          " v-model.trim="
                            merchant.mdrPlan.amexInternational.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexInternational
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexInternational
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.amexInternational
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.amexInternational
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.amexInternational.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .amexInternational.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexInternational.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.amexInternational
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.amexInternational
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.amexInternational
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .amexInternational.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexInternational.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.amexInternational
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.amexInternational
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.amexInternational
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .amexInternational.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexInternational.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiUpto2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Debit Card UpTo 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.upiUpto2000.fixed.$touch"
                          :error="$v.merchant.mdrPlan.upiUpto2000.fixed.$error"
                          v-model.trim="merchant.mdrPlan.upiUpto2000.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiUpto2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiUpto2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiUpto2000.percentage.$touch;
                          " :error="
                            $v.merchant.mdrPlan.upiUpto2000.percentage.$error
                          " v-model.trim="merchant.mdrPlan.upiUpto2000.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiUpto2000.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiUpto2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.upiUpto2000.minimum.$touch"
                          :error="
                            $v.merchant.mdrPlan.upiUpto2000.minimum.$error
                          " v-model.trim="merchant.mdrPlan.upiUpto2000.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiUpto2000.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiUpto2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiUpto2000.fixed
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiUpto2000.fixed
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiUpto2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiUpto2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiUpto2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiUpto2000
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiUpto2000
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiUpto2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiUpto2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiUpto2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiUpto2000.minimum
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiUpto2000.minimum
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiUpto2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiUpto2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiUpto2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiAbove2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Debit Card Above 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.upiAbove2000.fixed.$touch"
                          :error="$v.merchant.mdrPlan.upiAbove2000.fixed.$error"
                          v-model.trim="merchant.mdrPlan.upiAbove2000.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiAbove2000.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiAbove2000.percentage.$touch;
                          " :error="
                            $v.merchant.mdrPlan.upiAbove2000.percentage.$error
                          " v-model.trim="
                            merchant.mdrPlan.upiAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiAbove2000.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiAbove2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiAbove2000.minimum.$touch
                          " :error="
                            $v.merchant.mdrPlan.upiAbove2000.minimum.$error
                          " v-model.trim="merchant.mdrPlan.upiAbove2000.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiAbove2000.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiAbove2000.fixed
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiAbove2000.fixed
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiAbove2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiAbove2000
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiAbove2000
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiAbove2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiAbove2000.minimum
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiAbove2000.minimum
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiAbove2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiAbove2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiCreditUpto2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Prepaid Credit Cards UpTo 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiCreditUpto2000.fixed.$touch
                          " :error="
                            $v.merchant.mdrPlan.upiCreditUpto2000.fixed.$error
                          " v-model.trim="
                            merchant.mdrPlan.upiCreditUpto2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditUpto2000.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditUpto2000
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiCreditUpto2000.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.upiCreditUpto2000.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.upiCreditUpto2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditUpto2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditUpto2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiCreditUpto2000.minimum.$touch
                          " :error="
                            $v.merchant.mdrPlan.upiCreditUpto2000.minimum.$error
                          " v-model.trim="
                            merchant.mdrPlan.upiCreditUpto2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditUpto2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditUpto2000
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiCreditUpto2000
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiCreditUpto2000
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiCreditUpto2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditUpto2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditUpto2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiCreditUpto2000
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiCreditUpto2000
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiCreditUpto2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditUpto2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditUpto2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiCreditUpto2000
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiCreditUpto2000
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiCreditUpto2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditUpto2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditUpto2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiCreditAbove2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Prepaid Credit Cards Above 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiCreditAbove2000.fixed.$touch
                          " :error="
                            $v.merchant.mdrPlan.upiCreditAbove2000.fixed.$error
                          " v-model.trim="
                            merchant.mdrPlan.upiCreditAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditAbove2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditAbove2000
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiCreditAbove2000.percentage
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.upiCreditAbove2000.percentage
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.upiCreditAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditAbove2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditAbove2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.upiCreditAbove2000.minimum
                              .$touch;
                          " :error="
                            $v.merchant.mdrPlan.upiCreditAbove2000.minimum
                              .$error
                          " v-model.trim="
                            merchant.mdrPlan.upiCreditAbove2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditAbove2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditAbove2000
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiCreditAbove2000
                              .fixed.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiCreditAbove2000
                              .fixed.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiCreditAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditAbove2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiCreditAbove2000
                              .percentage.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiCreditAbove2000
                              .percentage.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiCreditAbove2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditAbove2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.upiCreditAbove2000
                              .minimum.$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.upiCreditAbove2000
                              .minimum.$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.upiCreditAbove2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditAbove2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Master Pass</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.masterPass.fixed.$touch"
                          :error="$v.merchant.mdrPlan.masterPass.fixed.$error"
                          v-model.trim="merchant.mdrPlan.masterPass.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.masterPass.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.masterPass.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.masterPass.percentage.$touch
                          " :error="
                            $v.merchant.mdrPlan.masterPass.percentage.$error
                          " v-model.trim="merchant.mdrPlan.masterPass.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.masterPass.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.masterPass.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.masterPass.minimum.$touch"
                          :error="$v.merchant.mdrPlan.masterPass.minimum.$error"
                          v-model.trim="merchant.mdrPlan.masterPass.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.masterPass.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.masterPass.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.masterPass.fixed
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.masterPass.fixed
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.masterPass.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.masterPass
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.masterPass
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.masterPass.percentage
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.masterPass.percentage
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.masterPass.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.masterPass
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.masterPass
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.masterPass.minimum
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.masterPass.minimum
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.masterPass.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.masterPass
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.masterPass
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Cash at POS</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.cashAtPos.fixed.$touch"
                          :error="$v.merchant.mdrPlan.cashAtPos.fixed.$error"
                          v-model.trim="merchant.mdrPlan.cashAtPos.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.cashAtPos.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.cashAtPos.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.mdrPlan.cashAtPos.percentage.$touch
                          " :error="
                            $v.merchant.mdrPlan.cashAtPos.percentage.$error
                          " v-model.trim="merchant.mdrPlan.cashAtPos.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.cashAtPos.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.cashAtPos.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="$v.merchant.mdrPlan.cashAtPos.minimum.$touch"
                          :error="$v.merchant.mdrPlan.cashAtPos.minimum.$error"
                          v-model.trim="merchant.mdrPlan.cashAtPos.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.cashAtPos.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.cashAtPos.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.cashAtPos.fixed
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.cashAtPos.fixed
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.cashAtPos.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.cashAtPos
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.cashAtPos
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.cashAtPos.percentage
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.cashAtPos.percentage
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.cashAtPos.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.cashAtPos
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.cashAtPos
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            $v.merchant.SharingDiscountFee.cashAtPos.minimum
                              .$touch;
                          " :error="
                            $v.merchant.SharingDiscountFee.cashAtPos.minimum
                              .$error
                          " v-model.trim="
                            merchant.SharingDiscountFee.cashAtPos.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.cashAtPos
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.cashAtPos
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center" v-if="this.plan == 'mATM'">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Plan for MATM
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="merchant.mdrPlan.incentive.percentage"
                          placeholder="%" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model.trim="merchant.mdrPlan.incentive.minimum"
                          placeholder="Min" />
                      </div>
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
