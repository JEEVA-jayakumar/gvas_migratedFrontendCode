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
