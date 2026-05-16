                    error.field.merchant.companyInformation.registeredPin.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.registeredPin
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.registeredPin.$error">
                  <div v-if="
                      $v.merchant.companyInformation.registeredPin.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.registeredPin.$params
                        .minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.registeredPin.$params
                    .minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.registeredPin.$params
                    .maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.companyInformation.constitutionName.$touch" :error="
                    $v.merchant.companyInformation.constitutionName.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.companyInformation.constitutionName" float-label="Type of Business Entity*"
                  :options="merchantOptions" />

                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.constitutionName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.constitutionName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.constitutionName.$error">
                  <div v-if="
                      $v.merchant.companyInformation.constitutionName.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime format="DD/MM/YYYY" format-model="number" color="grey-9" modal
                  @blur="$v.merchant.companyInformation.establishYear.$touch"
                  :error="$v.merchant.companyInformation.establishYear.$error"
                  v-model.trim="merchant.companyInformation.establishYear" float-label="Year of Establishment*"
                  placeholder="Year of Establishment*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.establishYear.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.establishYear
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.establishYear.$error">
                  <div v-if="
                      $v.merchant.companyInformation.establishYear.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="$v.merchant.companyInformation.registerNumber.$touch"
                  :error="$v.merchant.companyInformation.registerNumber.$error"
                  v-model.trim="merchant.companyInformation.registerNumber" float-label="Establish Number*"
                  placeholder="Establish Number*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.registerNumber.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.registerNumber
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.registerNumber.$error">
                  <div v-if="
                      $v.merchant.companyInformation.registerNumber.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Accepts alphanumeric values
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.registerNumber.$params
                        .minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.registerNumber.$params
                    .minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.registerNumber.$params
                    .maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.tin.$touch"
                  :error="$v.merchant.companyInformation.tin.$error" color="grey-9"
                  v-model.trim="merchant.companyInformation.tin" float-label="TIN" placeholder="TIN" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.tin.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.tin" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.companyInformation.tin.$error">
                  <div v-if="$v.merchant.companyInformation.tin.$params.required">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid TIN
                  </div>
                  <div v-if="$v.merchant.companyInformation.tin.$params.minLength">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.tin.$params.minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.tin.$params.maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input upper-case @blur="$v.merchant.companyInformation.pan.$touch"
                  :error="$v.merchant.companyInformation.pan.$error" color="grey-9"
                  v-model.trim="merchant.companyInformation.pan" float-label="Company PAN*"
                  placeholder="Company PAN*" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.pan.alert">
