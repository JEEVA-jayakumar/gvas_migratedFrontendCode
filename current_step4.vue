 <q-step error-icon="warning" name="fourth" :error="error.tab.businessInformation" title="Business"
 subtitle="Info">
 <div class="row q-col-gutter-sm">
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value color="grey-9" @blur="
 v$.merchant?.businessInformation?.weekdayStartHour?.$touch
 " :error="
 v$.merchant?.businessInformation?.weekdayStartHour?.$error
 " v-model.trim="merchant.businessInformation.weekdayStartHour"
 label="Weekday start hour (00.00)*" :options="BusinessHourFromOptions"
 placeholder="Weekday start hour" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.weekdayStartHour
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.weekdayStartHour
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value color="grey-9" @blur="v$.merchant?.businessInformation?.weekdayEndHour?.$touch"
 :error="v$.merchant?.businessInformation?.weekdayEndHour?.$error"
 v-model.trim="merchant.businessInformation.weekdayEndHour" label="Weekday end hour (00.00)*"
 :options="BusinessHourToOptions" placeholder="Weekday end hour" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.weekdayEndHour
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.weekdayEndHour
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value color="grey-9" @blur="
 v$.merchant?.businessInformation?.weekendStartHour?.$touch
 " :error="
 v$.merchant?.businessInformation?.weekendStartHour?.$error
 " v-model.trim="merchant.businessInformation.weekendStartHour"
 label="Weekend start hour (00.00)*" :options="BusinessHourFromOptions"
 placeholder="Weekend start hour" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.weekendStartHour
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.weekendStartHour
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.businessInformation?.weekendStartHour?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Provide valid start hour
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value color="grey-9" @blur="v$.merchant?.businessInformation?.weekendEndHour?.$touch"
 :error="v$.merchant?.businessInformation?.weekendEndHour?.$error"
 v-model.trim="merchant.businessInformation.weekendEndHour" label="Weekend end hour (00.00)*"
 :options="BusinessHourToOptions" placeholder="Weekend end hour" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.weekendEndHour
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.weekendEndHour
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.businessInformation?.weekendEndHour?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Provide valid end hour
 </div>
 </div>
 </div>
 <!--<div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="number" v-model.trim="merchant.businessInformation.weekdayStartHour" label="Business Income" placeholder="Business Income" />
 </div>-->

 <div class="col-md-6 col-sm-12 col-xs-12 col-xs-12">
 <q-input color="grey-9" @blur="
 v$.merchant?.businessInformation?.lastTurnoverYear?.$touch
 " :error="
 v$.merchant?.businessInformation?.lastTurnoverYear?.$error
 " v-model.trim="merchant.businessInformation.lastTurnoverYear" label="Last turnover year"
 placeholder="Last turnover year" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.lastTurnoverYear
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.lastTurnoverYear
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.businessInformation?.lastTurnoverYear?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Provide valid year
 </div>
 </div>
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.businessInformation?.maximumMonthlyUsage?.$touch
 " :error="
 v$.merchant?.businessInformation?.maximumMonthlyUsage?.$error
 " v-model.trim="
 merchant.businessInformation.maximumMonthlyUsage
 " label="Maximum Monthly Usage*" placeholder="Maximum Monthly Usage*" />

 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.maximumMonthlyUsage
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation
 .maximumMonthlyUsage
 " />
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value @blur="
 v$.merchant?.businessInformation?.merchantTypeCode?.$touch
 " :error="
 v$.merchant?.businessInformation?.merchantTypeCode?.$error
 " placeholder="Choose from the below*" color="grey-9"
 v-model.trim="merchant.businessInformation.merchantTypeCode" label="merchant Category*"
 :options="merchantTypeCodeOptions" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.merchantTypeCode
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.merchantTypeCode
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.businessInformation?.merchantTypeCode?.$error">
 <div v-if="
 v$.merchant?.businessInformation?.merchantTypeCode?.required?.$invalid
 ">
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.businessInformation?.lastTurnoverAmount?.$touch
 " :error="
 v$.merchant?.businessInformation?.lastTurnoverAmount?.$error
 " v-model.trim="merchant.businessInformation.lastTurnoverAmount"
 label="Turnover during last year" placeholder="Turnover during last year" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.lastTurnoverAmount
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation
 .lastTurnoverAmount
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.businessInformation?.lastTurnoverAmount?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div>
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.businessInformation?.lastTurnoverAmount?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.businessInformation?.lastTurnoverAmount?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.businessInformation?.expectedCardBusiness?.$touch
 " :error="
 v$.merchant?.businessInformation?.expectedCardBusiness?.$error
 " v-model.trim="
 merchant.businessInformation.expectedCardBusiness
 " label="Expected Card Business*" placeholder="Expected Card Business*" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation
 .expectedCardBusiness.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation
 .expectedCardBusiness
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.businessInformation?.expectedCardBusiness?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div>
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.businessInformation?.expectedCardBusiness?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.businessInformation?.expectedCardBusiness?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.businessInformation?.averageBillAmount?.$touch
 " :error="
 v$.merchant?.businessInformation?.averageBillAmount?.$error
 " v-model.trim="merchant.businessInformation.averageBillAmount" label="Average Bill Amount"
 placeholder="Average Bill Amount" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.averageBillAmount
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.averageBillAmount
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="
 v$.merchant?.businessInformation?.averageBillAmount?.$error
 ">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div>
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.businessInformation?.averageBillAmount?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.businessInformation?.averageBillAmount?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input @update:model-value="val => { merchant.businessInformation.gstId = val.toUpperCase(); }" color="grey-9" @blur="v$.merchant.businessInformation?.gstId?.$touch"
 :error="v$.merchant?.businessInformation?.gstId?.$error"
 v-model.trim="merchant.businessInformation.gstId" @update:model-value="val => { merchant.businessInformation.gstId = val.toUpperCase(); }"
 label="GST ID" placeholder="GST ID" />
 <div class="text-negative" v-if="error.field.merchant?.businessInformation?.gstId?.alert">
 <MarsErrorResponse :error="error.field.merchant?.businessInformation?.gstId" />
 </div>
 <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant?.businessInformation?.gstId?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required -
 Provide valid GST Number
 </div>
 <div v-if="
 v$.merchant?.businessInformation?.gstId?.minLength?.$invalid
 ">
 <q-icon color="negative" name="warning" />
 &nbsp;Length should be between
 {{
 v$.merchant?.businessInformation?.gstId?.minLength?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.businessInformation?.gstId?.maxLength?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-select map-options emit-value placeholder="Choose from the below*" color="grey-9"
 :error="v$.merchant.businessInformation?.currentPosName?.$error" @blur="v$.merchant.businessInformation?.currentPosName?.$touch" v-model.trim="merchant.businessInformation.currentPosName" label="Already having a mPOS/POS*"
 :options="currentPosOptions" />
 </div>

 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="v$.merchant?.businessInformation?.debitCardMdr?.$touch"
 :error="v$.merchant?.businessInformation?.debitCardMdr?.$error"
 v-model.trim="merchant.businessInformation.debitCardMdr" label="Debit Card MDR"
 placeholder="Debit Card MDR" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.debitCardMdr?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.debitCardMdr
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.businessInformation?.debitCardMdr?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div>
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.businessInformation?.debitCardMdr?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.businessInformation?.debitCardMdr?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input color="grey-9" @blur="v$.merchant?.businessInformation?.creditCardMdr?.$touch"
 :error="v$.merchant?.businessInformation?.creditCardMdr?.$error"
 v-model.trim="merchant.businessInformation.creditCardMdr" label="Credit Card MDR"
 placeholder="Credit Card MDR" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.creditCardMdr?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.creditCardMdr
 " />
 </div>
 <div class="text-negative q-py-xs group q-caption"
 v-if="v$.merchant?.businessInformation?.creditCardMdr?.$error">
 <div>
 <q-icon color="negative" name="warning" />&nbsp;Required
 </div>
 <div>
 <q-icon color="negative" name="warning" />
 &nbsp;Value should be between
 {{
 v$.merchant?.businessInformation?.creditCardMdr?.minValue?.$invalid?.min
 }}
 and
 {{
 v$.merchant?.businessInformation?.creditCardMdr?.maxValue?.$invalid?.max
 }}
 </div>
 </div>
 </div>
 <div class="col-md-6 col-sm-12 col-xs-12">
 <q-input type="date"
 @blur="v$.merchant?.businessInformation?.memberSince?.$touch"
 :error="v$.merchant.businessInformation?.memberSince?.$error" color="grey-9"
 v-model.trim="merchant.businessInformation.memberSince" label="Member since*"
 placeholder="Member since*" />
 <div class="text-negative" v-if="
 error.field.merchant?.businessInformation?.memberSince?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.businessInformation?.memberSince
 " />
 </div>
 </div>
 </div>
 <q-stepper-navigation>
 <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('businessInformation')"
 label="Continue" />
 <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
