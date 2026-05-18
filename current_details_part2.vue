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
