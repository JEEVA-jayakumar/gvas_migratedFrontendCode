 <q-step error-icon="warning" name="seventh" :error="error.tab.bankInformation" title="Bank & Collection"
 subtitle="Details">
 <div class="row q-mb-md gutter-sm items-center">
 <div class="col-md-12">
 <div class="q-title">Merchant Bank Details</div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @update:model-value="val => { merchant.bankInformation.bankDetails.ifsc = val.toUpperCase(); }" color="grey-9" :error="v$.merchant?.bankInformation?.bankDetails?.ifsc?.$error"
 @blur="populateBankDetails" v-model.trim="merchant.bankInformation.bankDetails.ifsc"
 label="IFSC Code*" placeholder="Enter IFSC*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.ifsc?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails?.ifsc
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.bankInformation?.bankDetails?.ifsc?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Once entered and moved to the next field, bank details will
 be populated automatically.
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" disable @blur="
 v$.merchant?.bankInformation?.bankDetails?.branchName?.$touch
 " :error="
 v$.merchant?.bankInformation?.bankDetails?.branchName?.$error
 " v-model.trim="merchant.bankInformation.bankDetails.branchName" label="Branch Name*"
 placeholder="Branch Name* " />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.branchName
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .branchName
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.bankDetails?.branchName?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 will get automatically populated based on IFSC code.
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" v-model.trim="merchant.bankInformation.bankDetails.branchCode"
 label="Branch Code" placeholder="Branch Code" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant?.bankInformation?.bankDetails">
 <q-input color="grey-9" v-model.trim="merchant.bankInformation.bankDetails.branchZone"
 label="Branch Zone" placeholder="Branch Zone" />
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below" color="grey-9"
 v-model.trim="merchant.bankInformation.bankDetails.feeType" label="Fee Type"
 :options="feeTypeOptions" @update:model-value="
 merchant.bankInformation.bankDetails.settlementOrNeftFee =
 ''
 " />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.feeType
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails?.feeType
 " />
 </div>
 </div>
 <div v-if="
 merchant.bankInformation.bankDetails.feeType == 'N' ||
 merchant.bankInformation.bankDetails.feeType == 'S'
 " class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.bankDetails?.settlementOrNeftFee
 .$touch;
 " :error="
 v$.merchant?.bankInformation?.bankDetails?.settlementOrNeftFee
 .$error
 " v-model.trim="
 merchant.bankInformation.bankDetails.settlementOrNeftFee
 " label="NEFT/Settlement Fee Inclusive of Tax*"
 placeholder="NEFT/Settlement Fee Inclusive of Tax*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails
 .settlementOrNeftFee.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .settlementOrNeftFee
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="v$.merchant?.bankInformation?.bankDetails?.micr?.$touch"
 :error="v$.merchant?.bankInformation?.bankDetails?.micr?.$error"
 v-model.trim="merchant.bankInformation.bankDetails.micr" label="MICR*" placeholder="MICR*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.micr?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails?.micr
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.bankInformation?.bankDetails?.micr?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 will get automatically populated based on IFSC code.
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" disable @blur="
 v$.merchant?.bankInformation?.bankDetails?.bankName?.$touch
 " :error="
 v$.merchant?.bankInformation?.bankDetails?.bankName?.$error
 " v-model.trim="merchant.bankInformation.bankDetails.bankName" label="Bank Name*"
 placeholder="Bank Name*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.bankName
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails?.bankName
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.bankInformation?.bankDetails?.bankName?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 will get automatically populated based on IFSC code.
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below" color="grey-9" v-model.trim="
 merchant.bankInformation.bankDetails.paymentMode
 " label="Payment mode" :options="paymnentModeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.paymentMode
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .paymentMode
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.bankDetails?.bankCityRefCode
 .$touch;
 " :error="
 autoCompleteError(
 v$.merchant?.bankInformation?.bankDetails?.bankCityName,
 v$.merchant?.bankInformation?.bankDetails?.bankCityRefCode
 )
 " v-model.trim="
 merchant.bankInformation.bankDetails.bankCityName
 " label="City (type min 3 characters)*" placeholder="Start typing .*"
 :options="bankCityOptionsFiltered" @filter="bankCitySearchFilter" @update:model-value="bankCitySelected" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails
 .bankCityRefCode.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .bankCityRefCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.bankDetails?.bankCityRefCode
 .$error ||
 v$.merchant?.bankInformation?.bankDetails?.bankCityName?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Type and choose from the suggestions
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options  use-input fill-input hide-selected @blur="
 v$.merchant?.bankInformation?.bankDetails?.bankStateRefCode
 .$touch
 " :error="
 autoCompleteError(
 v$.merchant?.bankInformation?.bankDetails?.bankStateName,
 v$.merchant?.bankInformation?.bankDetails?.bankStateRefCode
 )
 " v-model.trim="
 merchant.bankInformation.bankDetails.bankStateName
 " label="State (type min 3 characters)*" placeholder="Start typing .*"
 :options="bankStateOptionsFiltered" @filter="bankStateSearchFilter" @update:model-value="bankStateSelected" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails
 .bankStateRefCode.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .bankStateRefCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.bankDetails?.bankStateRefCode
 .$error ||
 v$.merchant?.bankInformation?.bankDetails?.bankStateName?.$error
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
 v$.merchant?.bankInformation?.bankDetails?.accountdetails
 .$touch
 " :error="
 v$.merchant?.bankInformation?.bankDetails?.accountdetails
 .$error
 " v-for="(item, index) in viewBinding.accountdetails" :key="index" color="grey-9" v-model.trim="
 merchant.bankInformation.bankDetails.accountdetails
 " :val="item.value" :label="item.label" />
 </div>
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails
 .accountdetails.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .accountdetails
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.bankDetails?.accountdetails
 .$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value :class="{
 'readonly-select': propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS'
 }" :disabled="this.propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS'" placeholder="Choose from the below"
 color="grey-9" v-model.trim="
 merchant.bankInformation.bankDetails.accountType
 " label="Account Type" :options="accountTypeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails?.accountType
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .accountType
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.bankDetails?.accountNumber?.$touch
 " :error="
 v$.merchant?.bankInformation?.bankDetails?.accountNumber?.$error
 " v-model.trim="
 merchant.bankInformation.bankDetails.accountNumber
 " label="Bank A/c Number*" placeholder="Bank A/c Number*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.bankDetails
 .accountNumber.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .accountNumber
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.bankDetails?.accountNumber
 .$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 provide valid account number
 </div>
 <div v-if="
 v$.merchant?.bankInformation?.bankDetails?.accountNumber?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.bankInformation?.bankDetails?.accountNumber?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.bankInformation?.bankDetails?.accountNumber?.maxLength?.$invalid?.max
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
 error.field.merchant?.bankInformation?.bankDetails
 .accountNumber.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.bankDetails
 .accountNumber
 " />
 </div>
 </div>
 </div>
 <div class="row gutter-sm items-center">
 <div class="col-md-12">
 <div class="q-title">Payment Collection Details</div>
 </div>
 <div v-show="propLeadDeatils?.paymentOption == 1" class="col-md-12">
 <div class="row">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeNumber.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeNumber.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.chequeNumber
 " label="Cheque/UTR No*" placeholder="Cheque/UTR No*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeNumber.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeNumber
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeNumber.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 - provide valid account number
 </div>
 <div v-if="
 v$.merchant?.bankInformation?.collectionDetails?.chequeNumber?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.bankInformation?.collectionDetails?.chequeNumber?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.bankInformation?.collectionDetails?.chequeNumber?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 </div>
 </div>
 <div v-show="propLeadDeatils?.paymentOption == 4" class="col-md-12">
 <div class="row">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.collectionDetails?.upiLink
 .$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails?.upiLink
 .$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.upiLink
 " label="UPI Link*" placeholder="UPI Link*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .upiLink.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .upiLink
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails?.upiLink
 .$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 - provide valid account number
 </div>
 <div v-if="
 v$.merchant?.bankInformation?.collectionDetails?.upiLink?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.bankInformation?.collectionDetails?.upiLink?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.bankInformation?.collectionDetails?.upiLink?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 </div>
 </div>
 <div v-show="propLeadDeatils?.paymentOption == 3" class="col-md-12">
 <div class="row">
 <div class="col-md-4 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .swipeAmount.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .swipeAmount.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.swipeAmount
 " label="Swipe Amount*" placeholder="Swipe Amount*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .swipeAmount.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .swipeAmount
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .swipeAmount.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 - provide valid account number
 </div>
 </div>
 </div>
 <div class="col-md-4 col-sm-12">
 <q-input type="date"   color="grey-9"  @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .collectedDate.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .collectedDate.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.collectedDate
 " label="Swipe Date*" placeholder="Swipe Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .collectedDate.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .collectedDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .collectedDate.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-4 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .swipeTerminal.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .swipeTerminal.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.swipeTerminal
 " label="Swiped on the terminal of*" placeholder="Swiped on the terminal of*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .swipeTerminal.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .swipeTerminal
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .swipeTerminal.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 </div>
 </div>
 <div v-show="propLeadDeatils?.paymentOption == 2" class="col-md-12">
 <div class="row">
 <div class="col-md-3 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeAmount.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeAmount.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.chequeAmount
 " label="Cheque Amount*" placeholder="Cheque Amount*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeAmount.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeAmount
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeAmount.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-3 col-sm-12">
 <q-input type="date"   color="grey-9"  @blur="
 v$.merchant?.bankInformation?.collectionDetails?.chequeDate
 .$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails?.chequeDate
 .$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.chequeDate
 " label="Cheque Date*" placeholder="Cheque Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeDate.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails?.chequeDate
 .$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-3 col-sm-12 col-xs-12">
 <q-input type="date"   color="grey-9"  @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeDepositedDate.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeDepositedDate.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails
 .chequeDepositedDate
 " label="Cheque Deposited Date*" placeholder="Cheque Deposited Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeDepositedDate.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeDepositedDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeDepositedDate.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-3 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeNumber.$touch;
 " :error="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeNumber.$error
 " v-model.trim="
 merchant.bankInformation.collectionDetails.chequeNumber
 " label="Cheque/UTR No*" placeholder="Cheque/UTR No*" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeNumber.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
 .chequeNumber
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.bankInformation?.collectionDetails
 .chequeNumber.$anyError
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 - provide valid account number
 </div>
 <div v-if="
 v$.merchant?.bankInformation?.collectionDetails?.chequeNumber?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.bankInformation?.collectionDetails?.chequeNumber?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.bankInformation?.collectionDetails?.chequeNumber?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 </div>
 </div>
 <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
 <q-select map-options emit-value clearable placeholder="Choose from the below" color="grey-9" v-model.trim="
 merchant.bankInformation.collectionDetails.acquirerBank
 " label="Bank Name" :options="bankListSet" />
 <div class="text-negative" v-if="
 error.field.merchant?.bankInformation?.collectionDetails
 .acquirerBank.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.bankInformation?.collectionDetails
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
