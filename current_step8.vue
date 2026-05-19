 <q-step error-icon="warning" :error="error.tab.revParameters" name="ten" title="Rev Param & Lead"
 subtitle="Info">
 <div class="row q-col-gutter-sm">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="caption">Merchant Requested Vas</p>
 <li v-for="sVas in (soSelectedVas && typeof soSelectedVas === 'string' ? soSelectedVas.split(',') : (Array.isArray(soSelectedVas) ? soSelectedVas : []))" :key="sVas">
 {{ sVas }}
 </li>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="caption">Vas Based Instance*</p>


 <q-option-group inline type="checkbox" @update:model-value="handleVasChange" v-model="tmpVasMapping"
 class="text-weight-regular text-grey-8" color="grey-9" :disable="vasDisableFlag"
 :options="vasBasedOnInstance" />

 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="q-caption">Notification Recipient Enabled?</p>
 <div class="group">
 <q-radio @blur="
 v$.merchant?.revParameters?.notificationRecipient?.$touch
 " :error="
 v$.merchant?.revParameters?.notificationRecipient?.$error
 " v-for="(item, index) in edcOptions" :key="index" color="grey-9"
 v-model.trim="merchant.revParameters.notificationRecipient" :val="item.value" :label="item.label" />
 <div class="text-negative" v-if="
 error.field.merchant?.revParameters?.notificationRecipient
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.revParameters?.notificationRecipient
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.revParameters?.notificationRecipient?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="q-caption">Bijlipay Switch</p>
 <div class="group">
 <q-radio @blur="v$.revParamAndLeadInfo?.bijlipaySwitch?.$touch"
 :error="v$.revParamAndLeadInfo.bijlipaySwitch?.$error" v-for="(item, index) in bijlipaySwitchOptions"
 :key="index" color="grey-9" v-model.trim="revParamAndLeadInfo.bijlipaySwitch" :val="item.value"
 :label="item.label" />
 <div class="text-negative" v-if="error.field.revParamAndLeadInfo.bijlipaySwitch.alert">
 <MarsErrorResponse :error="error.field.revParamAndLeadInfo.bijlipaySwitch" />
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="q-caption">Sale Enabled?</p>
 <div class="group">
 <q-radio @blur="v$.merchant?.revParameters?.saleFlag?.$touch"
 :error="v$.merchant.revParameters?.saleFlag?.$error" v-for="(item, index) in saleFlagOptions"
 :key="index" color="grey-9" v-model.trim="merchant.revParameters.saleFlag" :val="item.value"
 :label="item.label" />
 <div class="text-negative" v-if="error.field.merchant?.revParameters?.saleFlag?.alert">
 <MarsErrorResponse :error="error.field.merchant?.revParameters?.saleFlag" />
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="q-caption">Tip FacilityAcceptance Enabled?</p>
 <div class="group">
 <q-radio @blur="v$.merchant?.revParameters?.tipEnabled?.$touch"
 :error="v$.merchant.revParameters?.tipEnabled?.$error" v-for="(item, index) in tipFaclityOptions"
 :key="index" color="grey-9" v-model.trim="merchant.revParameters.tipEnabled" :val="item.value"
 :label="item.label" />
 <div class="text-negative" v-if="error.field.merchant?.revParameters?.tipEnabled?.alert">
 <MarsErrorResponse :error="error.field.merchant?.revParameters?.tipEnabled" />
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <p class="q-caption">Auto or Manual Settlement?</p>
 <div class="group">
 <q-radio @blur="v$.merchant?.revParameters?.settlementType?.$touch"
 :error="v$.merchant?.revParameters?.settlementType?.$error"
 v-for="(item, index) in autoormanualOptions" :key="index" color="grey-9"
 v-model.trim="merchant.revParameters.settlementType" :val="item.value" :label="item.label" />
 <div class="text-negative" v-if="
 error.field.merchant?.revParameters?.settlementType?.alert
 ">
 <MarsErrorResponse :error="error.field.merchant?.revParameters?.settlementType" />
 </div>
 </div>
 </div>
 </div>

 <q-stepper-navigation>
 <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('revParameters')"
 label="Continue" />
 <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
 <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
 <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
 @click="goBackToDocumentVerificationStage()" />
 </q-stepper-navigation>
 </q-step>
