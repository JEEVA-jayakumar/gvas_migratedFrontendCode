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
