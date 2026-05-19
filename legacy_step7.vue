          <q-step error-icon="warning" name="seventh" :error="error.tab.bankInformation" title="Bank & Collection"
            subtitle="Details">
            <div class="row q-mb-md gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input upper-case color="grey-9" :error="$v.merchant.bankInformation.bankDetails.ifsc.$error"
                  @blur="populateBankDetails" v-model.trim="merchant.bankInformation.bankDetails.ifsc"
                  float-label="IFSC Code*" placeholder="Enter IFSC*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.ifsc.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.ifsc
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.bankInformation.bankDetails.ifsc.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Once entered and moved to the next field, bank details will
                    be populated automatically.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable @blur="
                    $v.merchant.bankInformation.bankDetails.branchName.$touch
                  " :error="
                    $v.merchant.bankInformation.bankDetails.branchName.$error
                  " v-model.trim="merchant.bankInformation.bankDetails.branchName" float-label="Branch Name*"
                  placeholder="Branch Name* " />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.branchName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .branchName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.bankInformation.bankDetails.branchName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="merchant.bankInformation.bankDetails.branchCode"
                  float-label="Branch Code" placeholder="Branch Code" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="merchant.bankInformation.bankDetails.branchZone"
                  float-label="Branch Zone" placeholder="Branch Zone" />
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below" color="grey-9"
                  v-model.trim="merchant.bankInformation.bankDetails.feeType" float-label="Fee Type"
                  :options="feeTypeOptions" @input="
                    merchant.bankInformation.bankDetails.settlementOrNeftFee =
                      ''
                  " />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.feeType
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.feeType
                    " />
                </div>
              </div>
              <div v-if="
                  merchant.bankInformation.bankDetails.feeType == 'N' ||
                  merchant.bankInformation.bankDetails.feeType == 'S'
                " class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    $v.merchant.bankInformation.bankDetails.settlementOrNeftFee
                      .$touch;
                  " :error="
                    $v.merchant.bankInformation.bankDetails.settlementOrNeftFee
                      .$error
                  " v-model.trim="
                    merchant.bankInformation.bankDetails.settlementOrNeftFee
                  " float-label="NEFT/Settlement Fee Inclusive of Tax*"
                  placeholder="NEFT/Settlement Fee Inclusive of Tax*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .settlementOrNeftFee.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .settlementOrNeftFee
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="$v.merchant.bankInformation.bankDetails.micr.$touch"
                  :error="$v.merchant.bankInformation.bankDetails.micr.$error"
                  v-model.trim="merchant.bankInformation.bankDetails.micr" float-label="MICR*" placeholder="MICR*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.micr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.micr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.bankInformation.bankDetails.micr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable @blur="
                    $v.merchant.bankInformation.bankDetails.bankName.$touch
                  " :error="
                    $v.merchant.bankInformation.bankDetails.bankName.$error
                  " v-model.trim="merchant.bankInformation.bankDetails.bankName" float-label="Bank Name*"
                  placeholder="Bank Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.bankName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.bankName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.bankInformation.bankDetails.bankName.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below" color="grey-9" v-model.trim="
                    merchant.bankInformation.bankDetails.paymentMode
                  " float-label="Payment mode" :options="paymnentModeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.paymentMode
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .paymentMode
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    $v.merchant.bankInformation.bankDetails.bankCityRefCode
                      .$touch;
                  " :error="
                    autoCompleteError(
                      $v.merchant.bankInformation.bankDetails.bankCityName,
                      $v.merchant.bankInformation.bankDetails.bankCityRefCode
                    )
                  " v-model.trim="
                    merchant.bankInformation.bankDetails.bankCityName
                  " float-label="City (type min 3 characters)*" placeholder="Start typing ..*">
                  <q-autocomplete separator @search="residentCitySearch" :debounce="10" :min-characters="3"
                    @selected="bankCitySelected" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .bankCityRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .bankCityRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.bankInformation.bankDetails.bankCityRefCode
                      .$error ||
                    $v.merchant.bankInformation.bankDetails.bankCityName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    $v.merchant.bankInformation.bankDetails.bankStateRefCode
                      .$touch
                  " :error="
                    autoCompleteError(
                      $v.merchant.bankInformation.bankDetails.bankStateName,
                      $v.merchant.bankInformation.bankDetails.bankStateRefCode
                    )
                  " v-model.trim="
                    merchant.bankInformation.bankDetails.bankStateName
                  " float-label="State (type min 3 characters)*" placeholder="Start typing ..*">
                  <q-autocomplete separator @search="residentStateSearch" :debounce="10" :min-characters="1"
                    @selected="bankStateSelected" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .bankStateRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .bankStateRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.bankInformation.bankDetails.bankStateRefCode
                      .$error ||
                    $v.merchant.bankInformation.bankDetails.bankStateName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <p class="q-caption">Current Account details Available ?*</p>
                <div class="group">
                  <q-radio @blur="
                      $v.merchant.bankInformation.bankDetails.accountdetails
                        .$touch
                    " :error="
                      $v.merchant.bankInformation.bankDetails.accountdetails
                        .$error
                    " v-for="(item, index) in viewBinding.accountdetails" :key="index" color="grey-9" v-model.trim="
                      merchant.bankInformation.bankDetails.accountdetails
                    " :val="item.value" :label="item.label" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .accountdetails.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountdetails
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.bankInformation.bankDetails.accountdetails
                      .$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select :class="{
    'readonly-select': propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'
  }" :disabled="this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'" placeholder="Choose from the below"
                  color="grey-9" v-model="
                    merchant.bankInformation.bankDetails.accountType
                  " float-label="Account Type" :options="accountTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.accountType
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountType
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    $v.merchant.bankInformation.bankDetails.accountNumber.$touch
                  " :error="
                    $v.merchant.bankInformation.bankDetails.accountNumber.$error
                  " v-model.trim="
                    merchant.bankInformation.bankDetails.accountNumber
                  " float-label="Bank A/c Number*" placeholder="Bank A/c Number*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .accountNumber.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountNumber
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.bankInformation.bankDetails.accountNumber
                      .$anyError
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid account number
                  </div>
                  <div v-if="
                      $v.merchant.bankInformation.bankDetails.accountNumber
                        .$params.minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.bankInformation.bankDetails.accountNumber
                    .$params.minLength.min
                    }}
                    and
                    {{
                    $v.merchant.bankInformation.bankDetails.accountNumber
                    .$params.maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-checkbox color="grey-9" true-value="Y" false-value="N" v-model.trim="
                    merchant.bankInformation.bankDetails.bankStatementAttached
                  " label="Bank Statement Attached" />
                <q-checkbox color="grey-9" true-value="Y" false-value="N" v-model.trim="
                    merchant.bankInformation.bankDetails.cancelChequeAttached
                  " label="Cancelled Cheque Lead Attached" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .accountNumber.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountNumber
                    " />
                </div>
              </div>
            </div>
            <div class="row gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Payment Collection Details</div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 1" class="col-md-12">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeNumber.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeNumber.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.chequeNumber
                      " float-label="Cheque/UTR No*" placeholder="Cheque/UTR No*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeNumber.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeNumber
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeNumber.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                      <div v-if="
                          $v.merchant.bankInformation.collectionDetails
                            .chequeNumber.$params.minLength
                        ">
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be between
                        {{
                        $v.merchant.bankInformation.collectionDetails
                        .chequeNumber.$params.minLength.min
                        }}
                        and
                        {{
                        $v.merchant.bankInformation.collectionDetails
                        .chequeNumber.$params.maxLength.max
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 4" class="col-md-12">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        $v.merchant.bankInformation.collectionDetails.upiLink
                          .$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails.upiLink
                          .$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.upiLink
                      " float-label="UPI Link*" placeholder="UPI Link*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .upiLink.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .upiLink
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails.upiLink
                          .$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                      <div v-if="
                          $v.merchant.bankInformation.collectionDetails.upiLink
                            .$params.minLength
                        ">
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be between
                        {{
                        $v.merchant.bankInformation.collectionDetails.upiLink
                        .$params.minLength.min
                        }}
                        and
                        {{
                        $v.merchant.bankInformation.collectionDetails.upiLink
                        .$params.maxLength.max
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 3" class="col-md-12">
                <div class="row">
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .swipeAmount.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .swipeAmount.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.swipeAmount
                      " float-label="Swipe Amount*" placeholder="Swipe Amount*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .swipeAmount.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .swipeAmount
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .swipeAmount.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-datetime format="DD/MM/YYYY" format-model="number" color="grey-9" modal @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .collectedDate.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .collectedDate.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.collectedDate
                      " float-label="Swipe Date*" placeholder="Swipe Date*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .collectedDate.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .collectedDate
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .collectedDate.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .swipeTerminal.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .swipeTerminal.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.swipeTerminal
                      " float-label="Swiped on the terminal of*" placeholder="Swiped on the terminal of*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .swipeTerminal.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .swipeTerminal
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .swipeTerminal.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 2" class="col-md-12">
                <div class="row">
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeAmount.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeAmount.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.chequeAmount
                      " float-label="Cheque Amount*" placeholder="Cheque Amount*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeAmount.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeAmount
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeAmount.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <q-datetime format="DD/MM/YYYY" format-model="number" color="grey-9" modal @blur="
                        $v.merchant.bankInformation.collectionDetails.chequeDate
                          .$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails.chequeDate
                          .$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.chequeDate
                      " float-label="Cheque Date*" placeholder="Cheque Date*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeDate.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeDate
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails.chequeDate
                          .$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-datetime format="DD/MM/YYYY" format-model="number" color="grey-9" modal @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails
                          .chequeDepositedDate
                      " float-label="Cheque Deposited Date*" placeholder="Cheque Deposited Date*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeDepositedDate
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeNumber.$touch;
                      " :error="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeNumber.$error
                      " v-model.trim="
                        merchant.bankInformation.collectionDetails.chequeNumber
                      " float-label="Cheque/UTR No*" placeholder="Cheque/UTR No*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeNumber.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeNumber
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        $v.merchant.bankInformation.collectionDetails
                          .chequeNumber.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                      <div v-if="
                          $v.merchant.bankInformation.collectionDetails
                            .chequeNumber.$params.minLength
                        ">
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be between
                        {{
                        $v.merchant.bankInformation.collectionDetails
                        .chequeNumber.$params.minLength.min
                        }}
                        and
                        {{
                        $v.merchant.bankInformation.collectionDetails
                        .chequeNumber.$params.maxLength.max
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <q-select clearable placeholder="Choose from the below" color="grey-9" v-model.trim="
                    merchant.bankInformation.collectionDetails.acquirerBank
                  " float-label="Bank Name" :options="bankListSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.collectionDetails
                      .acquirerBank.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.collectionDetails
                        .acquirerBank
                    " />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('bank')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
