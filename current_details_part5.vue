 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options use-input fill-input hide-selected @blur="
 v$.merchant?.companyInformation?.residentialCityRefCode?.$touch
 " :error="
 autoCompleteError(
 v$.merchant?.companyInformation?.residentialCityRefCode,
 v$.merchant?.companyInformation?.residentCityName
 )
 " color="grey-9" :model-value="merchant.companyInformation.residentCityName"
 @input-value="val => { merchant.companyInformation.residentCityName = val; }"
 @update:model-value="val => residentCitySelected(val)"
 label="City (type min 3 characters)*" placeholder="Start typing .*"
 :options="residentCityOptionsFiltered" @filter="residentCitySearchFilter" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation
 .residentialCityRefCode.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation
 .residentialCityRefCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.companyInformation?.residentialCityRefCode
 .$error ||
 v$.merchant?.companyInformation?.residentCityName?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Type and choose from the suggestions
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options use-input fill-input hide-selected @blur="
 v$.merchant?.companyInformation?.residentialStateRefCode
 .$touch;
 " :error="
 autoCompleteError(
 v$.merchant?.companyInformation?.residentialStateRefCode,
 v$.merchant?.companyInformation?.residentStateName
 )
 " color="grey-9" :model-value="merchant.companyInformation.residentStateName"
 @input-value="val => { merchant.companyInformation.residentStateName = val; }"
 @update:model-value="val => residentStateSelected(val)"
 label="State (type min 3 characters)*" placeholder="Start typing .*"
 :options="residentStateOptionsFiltered" @filter="residentStateSearchFilter" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation
 .residentialStateRefCode.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation
 .residentialStateRefCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.companyInformation?.residentialStateRefCode
 .$error ||
 v$.merchant?.companyInformation?.residentStateName?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Type and choose from the suggestions
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant.companyInformation?.contactName?.$touch"
 :error="v$.merchant.companyInformation?.contactName?.$error"
 @keypress="event => { if (!/^[a-zA-Z ]*$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') event.preventDefault(); }"
 color="grey-9" v-model.trim="merchant.companyInformation.contactName" label="Contact Name*"
 placeholder="Contact Name*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.contactName?.alert
 ">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.contactName" />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.contactName?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.contactName?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.companyInformation?.contactName?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.contactName?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.contactName?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.companyInformation?.contactMobile?.$touch"
 :error="v$.merchant.companyInformation?.contactMobile?.$error" color="grey-9"
 v-model.trim="merchant.companyInformation.contactMobile" label="Contact mobile*"
 placeholder="Contact Mobile*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.contactMobile?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.contactMobile
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.companyInformation?.contactMobile?.$error">
 <div v-if="
 v$.merchant?.companyInformation?.contactMobile?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div v-if="
 v$.merchant?.companyInformation?.contactMobile?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.contactMobile?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.contactMobile?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="tel" @blur="
 v$.merchant?.companyInformation?.contactAlternateMobile?.$touch
 " :error="
 v$.merchant?.companyInformation?.contactAlternateMobile?.$error
 " v-model.trim="
 merchant.companyInformation.contactAlternateMobile
 " label="Contact Alt Mobile" placeholder="Contact Alt Mobile" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation
 .contactAlternateMobile.alert
 ">
 <MarsErrorResponse :error="
