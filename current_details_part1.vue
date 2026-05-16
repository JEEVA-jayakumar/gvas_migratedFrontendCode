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
