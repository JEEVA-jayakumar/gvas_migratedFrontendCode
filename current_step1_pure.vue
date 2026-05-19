 <q-step error-icon="warning" :error="error.tab.salesInformation" name="first" title="Sales" subtitle="Info">

 <div class="row q-col-gutter-sm">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" disable :model-value="leadSourceApp?.sourceName" label="Lead Source*" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" disable :model-value="deviceTypeApp?.deviceName" label="Device Type*" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value :class="{
 'readonly-select': propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS'
 }" :disabled="this.propLeadDeatils?.leadStatus == 102 || this.propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS'"
 :error="v$.merchant.salesInformation?.institutionCode?.$error" placeholder="Choose from the below"
 color="grey-9" v-model.trim="merchant.salesInformation.institutionCode"
 label="Institution Code*" :options="getinstitutionCode"
 @update:model-value="fetchAllDropdownValuesFromMARSapi" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.institutionCode?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.institutionCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.institutionCode?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.institutionCode?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div v-if="merchant && merchant.salesInformation?.institutionCode == 104 && merchant.additionalInfo" class="row gutter-sm q-my-xs">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.branchZone" label="ZONE*" :options="getAllZone"
 @clear="fnClearZone" @update:model-value="fnFetchZone()" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.iaDistrict" label="IA_District*"
 :options="getAllDistrict" @update:model-value="fnFetchBranchName()" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value disable placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.additionalInfo.raDistrict" label="RA_District*"
 :options="getAllDistrict" @clear="fnClearZone" @update:model-value="fnFetchZone()" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value disable placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.additionalInfo.od1District" label="OD1_District*"
 :options="getAllDistrict" @clear="fnClearZone" @update:model-value="fnFetchZone()" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value disable placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.additionalInfo.od2District" label="OD2_District*"
 :options="getAllDistrict" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9" v-model.trim="
 merchant.additionalInfo.installationBranchCode
 " label="InstallationBranchName*" :options="getAllBranchName" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value use-input fill-input hide-selected color="grey-9"
   v-model.trim="merchant.additionalInfo.lorState"
 label="IOR_STATE(type min 3 characters)*" placeholder="Start typing .*"
 :options="iorStateOptions" @filter="searchIorState" />
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value use-input fill-input hide-selected color="grey-9"
 v-model.trim="merchant.additionalInfo.pin" label="Pincode"
 placeholder="Start typing .*" @update:model-value="pincodeBasedDistrict"
 :options="axisBankPincodeOptions" @filter="searchAxisBankPincode" />
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.state" label="State*"
 @update:model-value="pincodeandDistrictBasedCity" :options="getPincodeBasedDistrict" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.city" label="City*" :options="getPincodeDistrict"
 @update:model-value="citybasedlocation" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.iaLocation" label="IA_LOCATION*"
 :options="getCityBasedLocation" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.iaSalutation" label="IA_Salution*"
 :options="iaSalutationOptions" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.iaGender" label="IA_Gender*"
 :options="iaGenderOptions" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.od1Salutation" label="OD1_Salutation*"
 :options="od1SalutationOptions" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.od1Gender" label="OD1_Gender*"
 :options="od1GenderOptions" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.od2Salutation" label="OD2_Salutation*"
 :options="od2SalutationOptions" />
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
   v-model.trim="merchant.additionalInfo.od2Gender" label="OD2_Gender*"
 :options="od2GenderOptions" />
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="v$.merchant?.salesInformation?.applicationType?.$touch"
 :error="v$.merchant.salesInformation?.applicationType?.$error" placeholder="Choose from the below*"
 color="grey-9" v-model.trim="merchant.salesInformation.applicationType"
 label="Application Type*" :options="applicationTypeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.applicationType?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.applicationType
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.applicationType?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.applicationType?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input readonly @blur="v$.merchant?.salesInformation?.applicationNumber?.$touch"
 :error="v$.merchant.salesInformation?.applicationNumber?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.applicationNumber" label="Application Number*"
 placeholder="Application Number*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.applicationNumber
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.applicationNumber
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.applicationNumber?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.applicationNumber?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="date" @blur="v$.merchant?.salesInformation?.applicationDate?.$touch"
 :error="v$.merchant.salesInformation?.applicationDate?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.applicationDate"
 label="Application Date*" placeholder="Application Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.applicationDate?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.applicationDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.applicationDate?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.applicationDate?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="date"
 @blur="v$.merchant?.salesInformation?.aggreementDate?.$touch"
 :error="v$.merchant.salesInformation?.aggreementDate?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.aggreementDate" label="Agreement Date*"
 placeholder="Agreement Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.aggreementDate?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.aggreementDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.aggreementDate?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.aggreementDate?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="v$.merchant?.salesInformation?.merchantType?.$touch"
 :error="v$.merchant.salesInformation?.merchantType?.$error" placeholder="Choose from the below*"
 color="grey-9" v-model.trim="merchant.salesInformation.merchantType" label="Merchant Type*"
 :options="merchantTypeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.merchantType?.alert
 ">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.merchantType" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.merchantType?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.merchantType?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="v$.merchant?.salesInformation?.categoryType?.$touch"
 :error="v$.merchant.salesInformation?.categoryType?.$error" placeholder="Choose from the below*"
 color="grey-9" v-model.trim="merchant.salesInformation.categoryType" label="Category Type*"
 :options="categoryTypeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.categoryType?.alert
 ">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.categoryType" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.categoryType?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.categoryType?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
 @blur="v$.merchant.salesInformation?.region?.$touch" :error="v$.merchant?.salesInformation?.region?.$error"
 v-model.trim="merchant.salesInformation.region" label="Region*" :options="regionOptions" />
 <div class="text-negative" v-if="error.field.merchant?.salesInformation?.region?.alert">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.region" />
 </div>

 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.salesInformation?.region?.$error">
 <div v-if="v$.merchant?.salesInformation?.region?.required?.$invalid">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9" filter clearable
 @blur="v$.merchant?.salesInformation?.salesPersonName?.$touch"
 :error="v$.merchant?.salesInformation?.salesPersonName?.$error"
 v-model.trim="merchant.salesInformation.salesPersonName" label="Sales Person*"
 :options="salesPersonOptions" />

 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.salesPersonName?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.salesPersonName
 " />
 </div>

 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.salesPersonName?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.salesPersonName?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
 @blur="v$.merchant?.salesInformation?.leadFrom?.$touch"
 :error="v$.merchant?.salesInformation?.leadFrom?.$error"
 v-model.trim="merchant.salesInformation.leadFrom" label="Lead From*" :options="leadFromOptions"
 :disabled="this.propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS'" :class="{
 'readonly-select': propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS'
 }" />
 <div class="text-negative" v-if="error.field.merchant?.salesInformation?.leadFrom?.alert">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.leadFrom" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.salesInformation?.leadFrom?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.leadFrom?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>

 <div class="fillingTypesOptions">
 <p class="q-caption">Sharing Model</p>
 <div v-for="(item, index) in viewBinding.sharingModelCode" :key="index">
 <q-radio color="grey-9" v-model.trim="merchant.salesInformation.sharingModelCode" :val="item.value"
 :label="item.label" @update:model-value="sharemodebasedonSharingMode()" />
 </div>
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.sharingModelCode?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.sharingModelCode
 " />
 </div>
 </div>
 </div>

 <div v-if="merchant && merchant.salesInformation?.sharingModelCode == 'T'" class="row gutter-sm q-my-xs">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="v$.merchant.salesInformation?.sharingPartnerCode?.$touch" :error="
 v$.merchant?.salesInformation?.sharingPartnerCode?.$error
 " placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.salesInformation.sharingPartnerCode" label="Sharing partner*"
 :options="sharingPartnerCode" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.sharingPartnerCode?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.sharingPartnerCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.sharingPartnerCode?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.sharingPartnerCode?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.salesInformation?.dailyFixedAmount?.$touch"
 :error="v$.merchant.salesInformation?.dailyFixedAmount?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.dailyFixedAmount" label="Daily fixed amount*"
 type="number" placeholder="Daily fixed amount*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.dailyFixedAmount?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.dailyFixedAmount
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.dailyFixedAmount?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.dailyFixedAmount?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.salesInformation?.dailyFixedAmount?.minValue?.$invalid ||
 v$.merchant?.salesInformation?.dailyFixedAmount?.maxValue?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.salesInformation?.dailyFixedAmount?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.salesInformation?.dailyFixedAmount?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="
 v$.merchant?.salesInformation?.loanDisbursementPercentage
 .$touch;
 " :error="
 v$.merchant?.salesInformation?.loanDisbursementPercentage
 .$error
 " color="grey-9" v-model.trim="
 merchant.salesInformation.loanDisbursementPercentage
 " label="Percentage*" type="number" placeholder="Percentage*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation
 .loanDisbursementPercentage.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation
 .loanDisbursementPercentage
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.salesInformation?.loanDisbursementPercentage
 .$error
 ">
 <div v-if="
 v$.merchant?.salesInformation?.loanDisbursementPercentage?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.salesInformation?.loanDisbursementPercentage?.minValue?.$invalid ||
 v$.merchant?.salesInformation?.loanDisbursementPercentage?.maxValue?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.salesInformation?.loanDisbursementPercentage?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.salesInformation?.loanDisbursementPercentage?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="
 v$.merchant?.salesInformation?.loanDisbursementAmount?.$touch
 " :error="
 v$.merchant?.salesInformation?.loanDisbursementAmount?.$error
 " color="grey-9" v-model.trim="
 merchant.salesInformation.loanDisbursementAmount
 " label="Loan disbursement value*" type="number" placeholder="Loan disbursement value*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.loanDisbursementAmount
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation
 .loanDisbursementAmount
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.salesInformation?.loanDisbursementAmount?.$error
 ">
 <div v-if="
 v$.merchant?.salesInformation?.loanDisbursementAmount?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.salesInformation?.loanDisbursementAmount?.minValue?.$invalid ||
 v$.merchant?.salesInformation?.loanDisbursementAmount?.maxValue?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.salesInformation?.loanDisbursementAmount?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.salesInformation?.loanDisbursementAmount?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="date" @blur="
 v$.merchant?.salesInformation?.loanDisbursementDate?.$touch
 " :error="
 v$.merchant?.salesInformation?.loanDisbursementDate?.$error
 " color="grey-9" v-model.trim="merchant.salesInformation.loanDisbursementDate"
 label="Disbursement Date*" placeholder="Disbursement Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.loanDisbursementDate
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.loanDisbursementDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.salesInformation?.loanDisbursementDate?.$error
 ">
 <div v-if="
 v$.merchant?.salesInformation?.loanDisbursementDate?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.salesInformation?.tenureMonth?.$touch"
 :error="v$.merchant.salesInformation?.tenureMonth?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.tenureMonth" label="Tenure (in months)*" type="number"
 placeholder="Tenure (in months)*" />
 <div class="text-negative" v-if="error.field.merchant?.salesInformation?.tenureMonth?.alert">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.tenureMonth" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.tenureMonth?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.tenureMonth?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.salesInformation?.tenureDay?.$touch"
 :error="v$.merchant.salesInformation?.tenureDay?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.tenureDay" label="Tenure (in days)*" type="number"
 placeholder="Tenure (in days)*" />
 <div class="text-negative" v-if="error.field.merchant?.salesInformation?.tenureDay?.alert">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.tenureDay" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.salesInformation?.tenureDay?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.tenureDay?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="date"
 @blur="v$.merchant?.salesInformation?.tenureStartDate?.$touch"
 :error="v$.merchant.salesInformation?.tenureStartDate?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.tenureStartDate" label="Start Date*"
 placeholder="Tenure Start Date*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.tenureStartDate?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.tenureStartDate
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.tenureStartDate?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.tenureStartDate?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 </div>

 <div v-if="merchant && merchant.salesInformation?.sharingModelCode == 'M'" class="row gutter-sm q-my-xs">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="v$.merchant.salesInformation?.sharingPartnerCode?.$touch" :error="
 v$.merchant?.salesInformation?.sharingPartnerCode?.$error
 " placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.salesInformation.sharingPartnerCode" label="Sharing partner*"
 :options="sharingPartnerCode" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.sharingPartnerCode
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.sharingPartnerCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.sharingPartnerCode?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.sharingPartnerCode?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.salesInformation?.rentPercentage?.$touch"
 :error="v$.merchant.salesInformation?.rentPercentage?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.rentPercentage" label="Rent %*" type="number"
 placeholder="Rent %*" />
 <div class="text-negative" v-if="
 error.field.merchant?.salesInformation?.rentPercentage?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.salesInformation?.rentPercentage
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.salesInformation?.rentPercentage?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.rentPercentage?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.salesInformation?.rentPercentage?.minValue?.$invalid ||
 v$.merchant?.salesInformation?.rentPercentage?.maxValue?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.salesInformation?.rentPercentage?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.salesInformation?.rentPercentage?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.salesInformation?.rentFixed?.$touch"
 :error="v$.merchant.salesInformation?.rentFixed?.$error" color="grey-9"
 v-model.trim="merchant.salesInformation.rentFixed" label="Rent fixed*" type="number"
 placeholder="Rent fixed*" />
 <div class="text-negative" v-if="error.field.merchant?.salesInformation?.rentFixed?.alert">
 <MarsErrorResponse :error="error.field.merchant?.salesInformation?.rentFixed" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.salesInformation?.rentFixed?.$error">
 <div v-if="
 v$.merchant?.salesInformation?.rentFixed?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.salesInformation?.rentFixed?.minValue?.$invalid ||
 v$.merchant?.salesInformation?.rentFixed?.maxValue?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.salesInformation?.rentFixed?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.salesInformation?.rentFixed?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 </div>

 <q-stepper-navigation>
 <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('salesInformation')"
 label="Continue" />
 <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
 <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to Document Validation"
 @click="goBackToDocumentVerificationStage()" />
 </q-stepper-navigation>
 </q-step>
