 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.companyInformation?.tin?.$touch"
 :error="v$.merchant.companyInformation?.tin?.$error" color="grey-9"
 v-model.trim="merchant.companyInformation.tin" label="TIN" placeholder="TIN" />
 <div class="text-negative" v-if="error.field.merchant?.companyInformation?.tin?.alert">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.tin" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.companyInformation?.tin?.$error">
 <div v-if="v$.merchant?.companyInformation?.tin?.required?.$invalid">
 <q-icon color="negative" name="warning" />&nbsp;Required -
 provide valid TIN
 </div>
 <div v-if="v$.merchant?.companyInformation?.tin?.minLength?.$invalid">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.tin?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.tin?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @update:model-value="val => { merchant.companyInformation.pan = val.toUpperCase(); }" @blur="v$.merchant.companyInformation?.pan?.$touch"
 :error="v$.merchant.companyInformation?.pan?.$error" color="grey-9"
 v-model.trim="merchant.companyInformation.pan" label="Company PAN*"
 placeholder="Company PAN*" />
 <div class="text-negative" v-if="error.field.merchant?.companyInformation?.pan?.alert">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.pan" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.companyInformation?.pan?.$error">
 <div v-if="v$.merchant?.companyInformation?.pan?.required?.$invalid">
 <q-icon color="negative" name="warning" />&nbsp;Required -
 provide valid PAN
 </div>
 <div v-if="v$.merchant?.companyInformation?.pan?.minLength?.$invalid">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.pan?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.pan?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @update:model-value="val => { merchant.companyInformation.tan = val.toUpperCase(); }" @blur="v$.merchant.companyInformation?.tan?.$touch"
 :error="v$.merchant.companyInformation?.tan?.$error" color="grey-9"
 v-model.trim="merchant.companyInformation.tan" label="TAN" placeholder="TAN" />
 <div class="text-negative" v-if="error.field.merchant?.companyInformation?.tan?.alert">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.tan" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.companyInformation?.tan?.$error">
 <div v-if="v$.merchant?.companyInformation?.tan?.required?.$invalid">
 <q-icon color="negative" name="warning" />&nbsp;Required -
 provide valid TAN
 </div>
 <div v-if="v$.merchant?.companyInformation?.tan?.minLength?.$invalid">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.companyInformation?.tan?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.companyInformation?.tan?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" v-model.trim="merchant.companyInformation.businessNature"
 label="Nature of Business" placeholder="Nature of Business" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.businessNature?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.businessNature
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.companyInformation.businessType" label="Type of Business"
 :options="businessTypeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.businessType?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.businessType
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options use-input fill-input hide-selected @blur="v$.merchant.companyInformation?.mcc?.$touch" :error="
 autoCompleteError(
 v$.merchant?.companyInformation?.mcc,
 v$.merchant?.companyInformation?.mccname
 )
 " color="grey-9" :model-value="merchant.companyInformation.mccname"
 @input-value="val => { merchant.companyInformation.mccname = val; }"
 @update:model-value="val => mccSelected(val)"
 label="MCC (type min 3 characters)" placeholder="Start typing .*"
 :options="mccOptions" @filter="mccSearchFilter" />
 <div class="text-negative" v-if="error.field.merchant?.companyInformation?.mcc?.alert">
 <MarsErrorResponse :error="error.field.merchant?.companyInformation?.mcc" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.companyInformation?.mcc?.$error ||
 v$.merchant?.companyInformation?.mccname?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Type and choose from the suggestions
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="
 v$.merchant?.companyInformation?.residentialAddress?.$touch
 " :error="
 v$.merchant?.companyInformation?.residentialAddress?.$error
 " color="grey-9" v-model.trim="merchant.companyInformation.residentialAddress"
 label="Residential Address* (max 120 characters)" placeholder="Residential Address*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.residentialAddress
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.residentialAddress
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @blur="v$.merchant?.companyInformation?.residentialPin?.$touch"
 :error="v$.merchant.companyInformation?.residentialPin?.$error" color="grey-9" type="number"
 v-model.trim="merchant.companyInformation.residentialPin" label="Pincode*"
 placeholder="Pincode*" />
 <div class="text-negative" v-if="
 error.field.merchant?.companyInformation?.residentialPin?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.companyInformation?.residentialPin
