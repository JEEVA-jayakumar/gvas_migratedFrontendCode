          <q-step error-icon="warning" name="fourth" :error="error.tab.businessInformation" title="Business"
            subtitle="Info">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="
                    $v.merchant.businessInformation.weekdayStartHour.$touch
                  " :error="
                    $v.merchant.businessInformation.weekdayStartHour.$error
                  " v-model.trim="merchant.businessInformation.weekdayStartHour"
                  float-label="Weekday start hour (00.00)*" :options="BusinessHourFromOptions"
                  placeholder="Weekday start hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekdayStartHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekdayStartHour
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="$v.merchant.businessInformation.weekdayEndHour.$touch"
                  :error="$v.merchant.businessInformation.weekdayEndHour.$error"
                  v-model.trim="merchant.businessInformation.weekdayEndHour" float-label="Weekday end hour (00.00)*"
                  :options="BusinessHourToOptions" placeholder="Weekday end hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekdayEndHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekdayEndHour
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="
                    $v.merchant.businessInformation.weekendStartHour.$touch
                  " :error="
                    $v.merchant.businessInformation.weekendStartHour.$error
                  " v-model.trim="merchant.businessInformation.weekendStartHour"
                  float-label="Weekend start hour (00.00)*" :options="BusinessHourFromOptions"
                  placeholder="Weekend start hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekendStartHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekendStartHour
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.businessInformation.weekendStartHour.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid start hour
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="$v.merchant.businessInformation.weekendEndHour.$touch"
                  :error="$v.merchant.businessInformation.weekendEndHour.$error"
                  v-model.trim="merchant.businessInformation.weekendEndHour" float-label="Weekend end hour (00.00)*"
                  :options="BusinessHourToOptions" placeholder="Weekend end hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekendEndHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekendEndHour
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.businessInformation.weekendEndHour.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid end hour
                  </div>
                </div>
              </div>
              <!--<div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" type="number" v-model.trim="merchant.businessInformation.weekdayStartHour" float-label="Business Income" placeholder="Business Income" />
              </div>-->

              <div class="col-md-6 col-sm-12 col-xs-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    $v.merchant.businessInformation.lastTurnoverYear.$touch
                  " :error="
                    $v.merchant.businessInformation.lastTurnoverYear.$error
                  " v-model.trim="merchant.businessInformation.lastTurnoverYear" float-label="Last turnover year"
                  placeholder="Last turnover year" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.lastTurnoverYear
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.lastTurnoverYear
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.businessInformation.lastTurnoverYear.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid year
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    $v.merchant.businessInformation.maximumMonthlyUsage.$touch
                  " :error="
                    $v.merchant.businessInformation.maximumMonthlyUsage.$error
                  " v-model.trim="
                    merchant.businessInformation.maximumMonthlyUsage
                  " float-label="Maximum Monthly Usage*" placeholder="Maximum Monthly Usage*" />

                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.maximumMonthlyUsage
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation
                        .maximumMonthlyUsage
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="
                    $v.merchant.businessInformation.merchantTypeCode.$touch
                  " :error="
                    $v.merchant.businessInformation.merchantTypeCode.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.businessInformation.merchantTypeCode" float-label="merchant Category*"
                  :options="merchantTypeCodeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.merchantTypeCode
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.merchantTypeCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.businessInformation.merchantTypeCode.$error">
                  <div v-if="
                      $v.merchant.businessInformation.merchantTypeCode.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    $v.merchant.businessInformation.lastTurnoverAmount.$touch
                  " :error="
                    $v.merchant.businessInformation.lastTurnoverAmount.$error
                  " v-model.trim="merchant.businessInformation.lastTurnoverAmount"
                  float-label="Turnover during last year" placeholder="Turnover during last year" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.lastTurnoverAmount
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation
                        .lastTurnoverAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.businessInformation.lastTurnoverAmount.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.businessInformation.lastTurnoverAmount.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.businessInformation.lastTurnoverAmount.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    $v.merchant.businessInformation.expectedCardBusiness.$touch
                  " :error="
                    $v.merchant.businessInformation.expectedCardBusiness.$error
                  " v-model.trim="
                    merchant.businessInformation.expectedCardBusiness
                  " float-label="Expected Card Business*" placeholder="Expected Card Business*" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation
                      .expectedCardBusiness.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation
                        .expectedCardBusiness
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.businessInformation.expectedCardBusiness.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.businessInformation.expectedCardBusiness
                    .$params.minValue.min
                    }}
                    and
                    {{
                    $v.merchant.businessInformation.expectedCardBusiness
                    .$params.maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    $v.merchant.businessInformation.averageBillAmount.$touch
                  " :error="
                    $v.merchant.businessInformation.averageBillAmount.$error
                  " v-model.trim="merchant.businessInformation.averageBillAmount" float-label="Average Bill Amount"
                  placeholder="Average Bill Amount" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.averageBillAmount
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.averageBillAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.businessInformation.averageBillAmount.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.businessInformation.averageBillAmount.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.businessInformation.averageBillAmount.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input upper-case color="grey-9" @blur="$v.merchant.businessInformation.gstId.$touch"
                  :error="$v.merchant.businessInformation.gstId.$error"
                  v-model.trim="merchant.businessInformation.gstId" @change="marsRequiredFormattingofGST"
                  float-label="GST ID" placeholder="GST ID" />
                <div class="text-negative" v-if="error.field.merchant.businessInformation.gstId.alert">
                  <MarsErrorResponse :error="error.field.merchant.businessInformation.gstId" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.businessInformation.gstId.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid GST Number
                  </div>
                  <div v-if="
                      $v.merchant.businessInformation.gstId.$params.minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.businessInformation.gstId.$params.minLength
                    .min
                    }}
                    and
                    {{
                    $v.merchant.businessInformation.gstId.$params.maxLength
                    .max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.businessInformation.currentPosName" float-label="Already having a mPOS/POS*"
                  :options="currentPosOptions" />
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="$v.merchant.businessInformation.debitCardMdr.$touch"
                  :error="$v.merchant.businessInformation.debitCardMdr.$error"
                  v-model.trim="merchant.businessInformation.debitCardMdr" float-label="Debit Card MDR"
                  placeholder="Debit Card MDR" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.debitCardMdr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.debitCardMdr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.businessInformation.debitCardMdr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.businessInformation.debitCardMdr.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.businessInformation.debitCardMdr.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="$v.merchant.businessInformation.creditCardMdr.$touch"
                  :error="$v.merchant.businessInformation.creditCardMdr.$error"
                  v-model.trim="merchant.businessInformation.creditCardMdr" float-label="Credit Card MDR"
                  placeholder="Credit Card MDR" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.creditCardMdr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.creditCardMdr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.businessInformation.creditCardMdr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.businessInformation.creditCardMdr.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.businessInformation.creditCardMdr.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime format="DD/MM/YYYY" format-model="number"
                  @blur="$v.merchant.businessInformation.memberSince.$touch"
                  :error="$v.merchant.businessInformation.memberSince.$error" color="grey-9" modal
                  v-model.trim="merchant.businessInformation.memberSince" float-label="Member since*"
                  placeholder="Member since*" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.memberSince.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.memberSince
                    " />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('businessInformation')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
