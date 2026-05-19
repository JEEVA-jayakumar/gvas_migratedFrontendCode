saveCurrentChanges()" />
 <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to Document Validation"
 @click="goBackToDocumentVerificationStage()" />
 </q-stepper-navigation>
 </q-step>
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