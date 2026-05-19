          <q-step error-icon="warning" name="fifth" :error="error.tab.paymentDetails" title="Payment"
            subtitle="Details">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Device Owned By</p>
                <div class="group">
                  <q-radio @blur="$v.merchant.paymentDetails.deviceOwnedBy.$touch"
                    :error="$v.merchant.paymentDetails.deviceOwnedBy.$error"
                    v-for="(item, index) in deviceOwnedByOptions" :key="index" color="grey-9"
                    v-model.trim="merchant.paymentDetails.deviceOwnedBy" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.deviceOwnedBy.alert
                    ">
                    <MarsErrorResponse :error="error.field.merchant.paymentDetails.deviceOwnedBy" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="VasSelected" placeholder="Choose from the below" color="grey-9"
                  :error="$v.merchant.paymentDetails.terminalModeCode.$error"
                  v-model="merchant.paymentDetails.terminalModeCode" :options="terminalModelSet"
                  float-label="Terminal Model*" />
                <!-- @input="mccbasedSelect" -->
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.terminalModeCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.terminalModeCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.terminalModeCode.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="
                  merchant.salesInformation.institutionCode == 109 ||
                  merchant.salesInformation.institutionCode == 104
                " class="col-md-6 col-sm-12 col-xs-12">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.paymentDetails.cardAcceptance" float-label="Card Acceptance"
                    :options="cardAcceptanceOptions" />
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.paymentDetails.terminalType.$touch"
                  :error="$v.merchant.paymentDetails.terminalType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model.trim="merchant.paymentDetails.terminalType" float-label="Terminal Type*"
                  :options="terminalTypeOptions" />
                <!-- @input="terminalBased" -->
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.terminalType.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.terminalType" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.terminalType.$error">
                  <div v-if="
                      $v.merchant.paymentDetails.terminalType.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.terminalType == 'MPOS'" class="row gutter-sm q-my-xs">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.state" float-label="STATE*" :options="getMposState"
                    @input="fnMposStatebasedCity()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.city" float-label="CITY*" :options="getMposCity" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.fillingType" float-label="FillingTypes*"
                    :options="getAllFillingTypes" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.category" float-label="Category*" :options="getMposCategory"
                    @input="categoryBasedSubCategory" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.subCategory" float-label="SubCategory*"
                    :options="getMposSubCategory" />
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-datetime format="DD/MM/YYYY" format-model="number" color="grey-9" modal
                    v-model.trim="merchant.additionalInfo.ownerDOB" float-label="Date Of Birth*"
                    placeholder="Date Of Birth*" />
                </div>

                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">200 to 999</div>
                    </div>
                    <div class="col">
                      <div class="q-caption text-weight-medium q-py-sm" align="center">
                        customIncentiveRates
                      </div>
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[0].mechantFixed
                            " placeholder="Merchant - A" @input="populateCustom" />
                        </div>

                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[0].sharingFixed
                            " placeholder="Distributor - B" @input="populateCustom" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        1000 to 1999
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[1].mechantFixed
                            " placeholder="Merchant - A" @input="populateCustom1" />
                        </div>
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[1].sharingFixed
                            " placeholder="Distributor - B" @input="populateCustom1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        2000 to 2999
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[2].mechantFixed
                            " placeholder="Merchant - A" @input="populateCustom2" />
                        </div>
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[2].sharingFixed
                            " placeholder="Distributor - B" @input="populateCustom2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        3000 to 3499
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[3].mechantFixed
                            " placeholder="Merchant - A" @input="populateCustom3" />
                        </div>
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[3].sharingFixed
                            " placeholder="Distributor - B" @input="populateCustom3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        3500 to 10000
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[4].mechantFixed
                            " placeholder="Merchant - A" @input="populateCustom4" />
                        </div>

                        <div class="col">
                          <q-input color="grey-9" type="number" v-model.trim="
                              merchant.customIncentiveRates[4].sharingFixed
                            " placeholder="Distributor - B" @input="populateCustom4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" disable
                  @blur="$v.merchant.paymentDetails.numberOfTerminals.$touch"
                  :error="$v.merchant.paymentDetails.numberOfTerminals.$error"
                  v-model.trim="merchant.paymentDetails.numberOfTerminals" float-label="No of Terminals*"
                  placeholder="No of Terminals*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.numberOfTerminals.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.numberOfTerminals
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.numberOfTerminals.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.numberOfTerminals.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.numberOfTerminals.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="group">
                  <q-checkbox @blur="$v.merchant.paymentDetails.omcEnabled.$touch"
                    :error="$v.merchant.paymentDetails.omcEnabled.$error"
                    v-model.trim="merchant.paymentDetails.omcEnabled" color="black" label="1% OMC Convenience fee :"
                    left-label />
                  <div class="text-negative" v-if="error.field.merchant.paymentDetails.omcEnabled.alert">
                    <MarsErrorResponse :error="error.field.merchant.paymentDetails.omcEnabled" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.omcEnabled == true"></div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">International Card Acceptance Enabled?</p>
                <div class="group">
                  <q-radio @blur="$v.merchant.paymentDetails.intlCardAcceptance.$touch" :error="
                      $v.merchant.paymentDetails.intlCardAcceptance.$error
                    " v-for="(item, index) in internationalCardAcceptanceOptions" :key="index" color="grey-9"
                    v-model.trim="merchant.paymentDetails.intlCardAcceptance" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.intlCardAcceptance
                        .alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.paymentDetails.intlCardAcceptance
                      " />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Credit card block Enabled?</p>
                <div class="group">
                  <q-radio @blur="$v.merchant.paymentDetails.creditCardBlock.$touch"
                    :error="$v.merchant.paymentDetails.creditCardBlock.$error"
                    v-for="(item, index) in creditCardBlockOptions" :key="index" color="grey-9"
                    v-model.trim="merchant.paymentDetails.creditCardBlock" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.creditCardBlock.alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.paymentDetails.creditCardBlock
                      " />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="merchant.paymentDetails.tipPercentage"
                  float-label="Tip Percentage" placeholder="Tip Percentage" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" @blur="$v.merchant.paymentDetails.installationFee.$touch"
                  :error="$v.merchant.paymentDetails.installationFee.$error"
                  v-model.trim="merchant.paymentDetails.installationFee" float-label="Installation Fee*"
                  placeholder="Installation Fee*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.installationFee.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.installationFee" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.installationFee.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.installationFee.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.installationFee.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select filter clearable placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.paymentDetails.rentalPlanCode"
                  :error="$v.merchant.paymentDetails.rentalPlanCode.$error" float-label="Rental Plan*"
                  :options="rentalPlanSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.rentalPlanCode.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.rentalPlanCode" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.rentalPlanCode.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input readOnly color="grey-9" v-model.trim="merchant.paymentDetails.recurringFees"
                  float-label="Recurring Fees*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.paymentDetails.rentalMode" float-label="Rental Mode*"
                  :options="rentalModeOptions" @input="handleInputrentalMode" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.rentalMode.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.rentalMode" />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.rentalMode == 'IB'">
                <q-input readOnly color="grey-9" v-model.trim="bankFee" type="number"
                  float-label="Bank rental (Without GST)*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.rentalMode == 'SB'">
                <q-input readOnly color="grey-9" v-model.trim="bankFee" float-label="Rental Amount (Without GST)*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.rentalMode == 'SB'">
                <q-input color="grey-9" v-model.trim="subventionBankFeeData" float-label="Bank rental (Without GST)*"
                  type="text" @input="handleInput" />

                <div class="text-negative" v-if="
                    subventionBankFeeData > propLeadDeatils.recurringFees / 1.18
                  ">
                  {{ "Bank Rental should be lesser than rental amount" }}
                </div>
                <div class="text-negative" v-if="
                    subventionBankFeeData == '' ||
                    this.subventionBankFeeData == undefined ||
                    this.subventionBankFeeData == null
                  ">
                  {{ " Bank rental shouldn't be empty" }}
                </div>
                <div class="text-negative" v-if="/[^0-9]/.test(subventionBankFeeData)">
                  {{ " only numbers are allowed" }}
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Rental Type</p>
                <div class="group">
                  <q-radio @blur="$v.merchant.paymentDetails.rentalType.$touch"
                    :error="$v.merchant.paymentDetails.rentalType.$error" v-for="(item, index) in rentalTypeOptions"
                    :key="index" color="grey-9" v-model="merchant.paymentDetails.rentalType" :val="item.value"
                    :label="item.label" @input="selectCurrentType()" />
                  <div class="text-negative" v-if="error.field.merchant.paymentDetails.rentalType.alert">
                    <MarsErrorResponse :error="error.field.merchant.paymentDetails.rentalType" />
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'E'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.paymentDetails.totalEmiAmount.$touch"
                  :error="$v.merchant.paymentDetails.totalEmiAmount.$error" color="grey-9" type="number"
                  v-model.trim="merchant.paymentDetails.totalEmiAmount" float-label="Total Emi Amount*"
                  placeholder="Total Emi Amount*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.totalEmiAmount.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.totalEmiAmount" />
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'E'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.paymentDetails.emiTenure.$touch"
                  :error="$v.merchant.paymentDetails.emiTenure.$error" color="grey-9" type="number"
                  v-model.trim="merchant.paymentDetails.emiTenure" float-label="Emi Tenure*"
                  placeholder="Emi Tenure*" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.emiTenure.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.emiTenure" />
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'E'" class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime format="DD/MM/YYYY" format-model="number"
                  @blur="$v.merchant.paymentDetails.emiStartDate.$touch"
                  :error="$v.merchant.paymentDetails.emiStartDate.$error" color="grey-9" modal
                  v-model.trim="merchant.paymentDetails.emiStartDate" float-label="Emi Start Date*"
                  placeholder="Emi Start Date*" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.emiStartDate.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.emiStartDate" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.emiStartDate.$error">
                  <div v-if="
                      $v.merchant.paymentDetails.emiStartDate.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'R'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.paymentDetails.gracePeriod.$touch"
                  :error="$v.merchant.paymentDetails.gracePeriod.$error" color="grey-9" type="number"
                  v-model.trim="merchant.paymentDetails.gracePeriod" float-label="Grace period*"
                  placeholder="Grace period*" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.gracePeriod.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.gracePeriod" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.paymentDetails.gracePeriod.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.gracePeriod.$params.minValue
                    .min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.gracePeriod.$params.maxValue
                    .max
                    }}
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="$v.merchant.paymentDetails.advanceRentCollected.$touch"
                  :error="
                    $v.merchant.paymentDetails.advanceRentCollected.$error
                  " v-model.trim="merchant.paymentDetails.advanceRentCollected" float-label="Advance Rent Collected*"
                  placeholder="Advance Rent Collected*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.advanceRentCollected
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.advanceRentCollected
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.advanceRentCollected.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.advanceRentCollected.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.advanceRentCollected.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    $v.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$touch
                  " :error="
                    $v.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error
                  " v-model.trim="
                    merchant.paymentDetails.noOfMonthRentPaidInAdvance
                  " float-label="No. Of Month Rent Paid In Advance*"
                  placeholder="No. Of Month Rent Paid In Advance*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails
                      .noOfMonthRentPaidInAdvance.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails
                        .noOfMonthRentPaidInAdvance
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.noOfMonthRentPaidInAdvance
                    .$params.minValue.min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.noOfMonthRentPaidInAdvance
                    .$params.maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Advanced Rent Mode</p>
                <div class="group">
                  <q-radio @blur="$v.merchant.paymentDetails.advanceRentMode.$touch"
                    :error="$v.merchant.paymentDetails.advanceRentMode.$error"
                    v-for="(item, index) in advanceRentModeOptions" :key="index" color="grey-9"
                    v-model.trim="merchant.paymentDetails.advanceRentMode" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.advanceRentMode.alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.paymentDetails.advanceRentMode
                      " />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="devicePrice" float-label="Device Price*"
                  placeholder="Device Price*" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" @blur="$v.merchant.paymentDetails.otherCharges.$touch"
                  :error="$v.merchant.paymentDetails.otherCharges.$error"
                  v-model.trim="merchant.paymentDetails.otherCharges" float-label="Other Charges"
                  placeholder="Other Charges" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.otherCharges.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.otherCharges" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.otherCharges.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.otherCharges.$params.minValue
                    .min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.otherCharges.$params.maxValue
                    .max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" @blur="$v.merchant.paymentDetails.totalAmountPaid.$touch"
                  :error="$v.merchant.paymentDetails.totalAmountPaid.$error"
                  v-model.trim="merchant.paymentDetails.totalAmountPaid" float-label="Total Amount Paid"
                  placeholder="Total Amount Paid" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.totalAmountPaid.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.totalAmountPaid" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.paymentDetails.totalAmountPaid.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.paymentDetails.totalAmountPaid.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.paymentDetails.totalAmountPaid.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="$v.merchant.paymentDetails.serviceProvider.$touch"
                  :error="$v.merchant.paymentDetails.serviceProvider.$error"
                  v-model.trim="merchant.paymentDetails.serviceProvider" float-label="Service provider*"
                  :options="serviceProviderListSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.serviceProvider.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.serviceProvider" />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="$v.merchant.paymentDetails.networkPreferred.$touch"
                  :error="$v.merchant.paymentDetails.networkPreferred.$error"
                  v-model.trim="merchant.paymentDetails.networkPreferred" float-label="Network provider*"
                  :options="networkProviderListSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.networkPreferred.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.networkPreferred
                    " />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
