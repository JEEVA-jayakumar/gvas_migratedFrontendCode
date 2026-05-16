 <q-step error-icon="warning" name="second" :error="error.tab.companyInformation" title="Details">
 <div class="row q-col-gutter-sm">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="text" @blur="v$.merchant.companyInformation?.legalName?.$touch"
 :error="v$.merchant.companyInformation?.legalName?.$error" color="grey-9"
 v-model.trim="merchant.companyInformation.legalName" label="Legal Name*"
 placeholder="Legal Name*" />
 <div class="text-negative" v-if="error.field.merchant.companyInformation.legalName?.alert">
 <MarsErrorResponse :error="error.field.merchant.companyInformation.legalName" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant.companyInformation.legalName?.$error">
 <div v-if="
 v$.merchant.companyInformation.legalName?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant.companyInformation.legalName?.minLength?.$invalid ||
 v$.merchant.companyInformation.legalName?.maxLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant.companyInformation.legalName?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant.companyInformation.legalName?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant.companyInformation?.dbaName?.$touch"
 :error="v$.merchant.companyInformation?.dbaName?.$error" color="grey-9"
 v-model.trim="merchant.companyInformation.dbaName" label="DBA Name*" placeholder="DBA Name*" />
 <div class="text-negative" v-if="error.field.merchant.companyInformation.dbaName?.alert">
 <MarsErrorResponse :error="error.field.merchant.companyInformation.dbaName" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.companyInformation.dbaName?.$error">
 <div v-if="
 v$.merchant.companyInformation.dbaName?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant.companyInformation.dbaName?.minLength?.$invalid ||
 v$.merchant.companyInformation.dbaName?.maxLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant.companyInformation.dbaName?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant.companyInformation.dbaName?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="q-caption">SMS Enable or Disable?</p>
 <div class="group">
 <q-radio @blur="v$.merchant?.companyInformation?.smsFlag?.$touch"
 :error="v$.merchant.companyInformation?.smsFlag?.$error" v-for="(item, index) in smsFlagOptions"
 :key="index" color="grey-9" v-model.trim="merchant.companyInformation.smsFlag" :val="item.value"
 :label="item.label" />
 <div class="text-negative" v-if="error.field.merchant?.companyInformation?.smsFlag?.alert">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.smsFlag" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.smsFlag?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" label="Registered Address* (max 120 characters)"
 placeholder="Registered Address*" v-model.trim="merchant.companyInformation.registeredAddress" @blur="
 v$.merchant?.companyInformation?.registeredAddress?.$touch
 " :error="
 v$.merchant?.companyInformation?.registeredAddress?.$error
 " />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.registeredAddress
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.registeredAddress
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.registeredAddress?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.registeredAddress?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Only digits and alphabets are allowed
 </div>
 <div v-if="
 v$.merchant?.companyInformation?.registeredAddress?.minLength?.$invalid ||
 v$.merchant?.companyInformation?.registeredAddress?.maxLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.registeredAddress?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.registeredAddress?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="text" @blur="v$.merchant.companyInformation.cityzone?.$touch"
 :error="v$.merchant.companyInformation.cityzone?.$error"
 v-model.trim="merchant.companyInformation.cityzone" label="Merchant City Zone"
 placeholder="Merchant City Zone" />
 <div class="text-negative" v-if="error.field.merchant.companyInformation.cityzone?.alert">
 <MarsErrorResponse :error="error.field.merchant.companyInformation.cityzone" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant.companyInformation.cityzone?.$error">
 <div v-if="
 !/^[a-zA-Z\s]*$/.test(
 merchant.companyInformation.cityzone
 )
 ">
 <q-icon color="negative" name="warning" />&nbsp;Only
 Alphabets and spaces are allowed.
 </div>
 <div v-if="
 v$.merchant.companyInformation.cityzone?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options use-input fill-input hide-selected @blur="fnClrRegisteredCity" :error="
 autoCompleteError(
 v$.merchant?.companyInformation?.registeredCityRefCode,
 v$.merchant?.companyInformation?.registeredCityName
 )
 " color="grey-9" :model-value="merchant.companyInformation.registeredCityName"
 @input-value="val => { merchant.companyInformation.registeredCityName = val; fninputTyping(val, 1); }"
 @update:model-value="val => registeredCitySelected(val)" label="Registered city (type min 3 characters)*"
 placeholder="Start typing .*"
 :options="cityOptionsFiltered" @filter="residentCitySearch" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation
 .registeredCityRefCode.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation
 .registeredCityRefCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.companyInformation?.registeredCityRefCode
 .$error ||
 v$.merchant?.companyInformation?.registeredCityName?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Type and choose from the suggestions
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="v$.merchant?.companyInformation?.statezone?.$touch"
 :error="v$.merchant.companyInformation?.statezone?.$error" placeholder="Choose from the below*"
 color="grey-9" v-model.trim="merchant.companyInformation.statezone"
 label=" Merchant State Zone*" :options="statezoneOptions" />

 <div class="text-negative" v-if="error.field.merchant?.companyInformation?.statezone?.alert">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.statezone" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.statezone?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.statezone?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options use-input fill-input hide-selected @blur="fnClrRegisteredState" :error="
 autoCompleteError(
 v$.merchant?.companyInformation?.registeredStateRefCode,
 v$.merchant?.companyInformation?.registeredStateName
 )
 " color="grey-9" :model-value="merchant.companyInformation.registeredStateName"
 @input-value="val => { merchant.companyInformation.registeredStateName = val; fninputTyping(val, 2); }"
 @update:model-value="val => registeredStateSelected(val)" label="Registered state (type min 3 characters)*"
 placeholder="Start typing .*"
 :options="stateOptionsFiltered" @filter="residentStateSearch" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation
 .registeredStateRefCode.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation
 .registeredStateRefCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.companyInformation?.registeredStateRefCode
 .$error ||
 v$.merchant?.companyInformation?.registeredStateName?.$error
