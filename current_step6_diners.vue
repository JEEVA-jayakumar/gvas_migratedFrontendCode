 </div>
 </div>
 <div class="row items-center">
 <div class="col-3">
 <div class="q-caption text-weight-medium">Diners</div>
 </div>
 <div class="col">
 <div class="row group bg-green-2">
 <div class="col">
 <q-input color="grey-9" type="number" @blur="v$.merchant?.mdrPlan?.diners?.fixed?.$touch"
 :error="v$.merchant.mdrPlan?.diners?.fixed?.$error" v-model.trim="merchant.mdrPlan.diners.fixed"
 placeholder="Fixed" />
 <div class="text-negative" v-if="error.field.merchant?.mdrPlan?.diners?.fixed?.alert">
 <MarsErrorResponse :error="error.field.merchant?.mdrPlan?.diners?.fixed" />
 </div>
 </div>
 <div class="col">
 <q-input color="grey-9" type="number" @blur="v$.merchant?.mdrPlan?.diners?.percentage?.$touch"
 :error="v$.merchant?.mdrPlan?.diners?.percentage?.$error"
 v-model.trim="merchant.mdrPlan.diners.percentage" placeholder="%" />
 <div class="text-negative" v-if="
 error.field.merchant?.mdrPlan?.diners?.percentage?.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.mdrPlan?.diners?.percentage
 " />
 </div>
 </div>
 <div class="col">
 <q-input color="grey-9" type="number" @blur="v$.merchant?.mdrPlan?.diners?.minimum?.$touch"
 :error="v$.merchant?.mdrPlan?.diners?.minimum?.$error"
 v-model.trim="merchant.mdrPlan.diners.minimum" placeholder="Max" />
 <div class="text-negative" v-if="
 error.field.merchant?.mdrPlan?.diners?.minimum?.alert
 ">
 <MarsErrorResponse :error="error.field.merchant?.mdrPlan?.diners?.minimum" />
 </div>
 </div>
 </div>
 </div>
 <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
 <div class="row group bg-yellow-2">
 <div class="col">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.SharingDiscountFee?.diners?.fixed?.$touch
 " :error="
 v$.merchant?.SharingDiscountFee?.diners?.fixed?.$error
 " v-model.trim="
 merchant.SharingDiscountFee.diners.fixed
 " placeholder="Fixed" />
 <div class="text-negative" v-if="
 error.field.merchant?.SharingDiscountFee?.diners?.fixed
 .alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.SharingDiscountFee?.diners
 .fixed
 " />
 </div>
 </div>
 <div class="col">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.SharingDiscountFee?.diners?.percentage
 .$touch;
 " :error="
 v$.merchant?.SharingDiscountFee?.diners?.percentage
 .$error
 " v-model.trim="
 merchant.SharingDiscountFee.diners.percentage
 " placeholder="%" />
 <div class="text-negative" v-if="
 error.field.merchant?.SharingDiscountFee?.diners
 .percentage.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.SharingDiscountFee?.diners
 .percentage
 " />
 </div>
 </div>
 <div class="col">
 <q-input color="grey-9" type="number" @blur="
 v$.merchant?.SharingDiscountFee?.diners?.minimum?.$touch
 " :error="
 v$.merchant?.SharingDiscountFee?.diners?.minimum?.$error
 " v-model.trim="
 merchant.SharingDiscountFee.diners.minimum
 " placeholder="Max" />
 <div class="text-negative" v-if="
 error.field.merchant?.SharingDiscountFee?.diners
 .minimum.alert
 ">
 <MarsErrorResponse :error="
 error.field.merchant?.SharingDiscountFee?.diners
 .minimum
 " />
 </div>
 </div>
 </div>
 </div>
 </div>
