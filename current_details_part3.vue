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
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Type and choose from the suggestions
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.companyInformation?.registeredPin?.$touch"
 :error="v$.merchant.companyInformation?.registeredPin?.$error" color="grey-9" type="number"
 v-model.trim="merchant.companyInformation.registeredPin" label="PIN*" placeholder="PIN*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.registeredPin?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.registeredPin
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.registeredPin?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.registeredPin?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.companyInformation?.registeredPin?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.registeredPin?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.registeredPin?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options @blur="v$.merchant.companyInformation?.constitutionName?.$touch" :error="
 v$.merchant?.companyInformation?.constitutionName?.$error
 " placeholder="Choose from the below*" color="grey-9"
 :model-value="merchant.companyInformation.constitutionName" label="Type of Business Entity*"
 :options="merchantOptions" @update:model-value="val => { merchant.companyInformation.constitution = val.value; merchant.companyInformation.constitutionName = val.label; }" />

 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.constitutionName
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.constitutionName
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.constitutionName?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.constitutionName?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="date" color="grey-9"
 @blur="v$.merchant?.companyInformation?.establishYear?.$touch"
 :error="v$.merchant?.companyInformation?.establishYear?.$error"
 v-model.trim="merchant.companyInformation.establishYear" label="Year of Establishment*"
 placeholder="Year of Establishment*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.establishYear?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.establishYear
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.establishYear?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.establishYear?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="v$.merchant?.companyInformation?.registerNumber?.$touch"
 :error="v$.merchant?.companyInformation?.registerNumber?.$error"
 v-model.trim="merchant.companyInformation.registerNumber" label="Establish Number*"
 placeholder="Establish Number*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.registerNumber?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.registerNumber
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.registerNumber?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.registerNumber?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Accepts alphanumeric values
 </div>
 <div v-if="
 v$.merchant?.companyInformation?.registerNumber?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.registerNumber?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.registerNumber?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
