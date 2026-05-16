                  <MarsErrorResponse :error="error.field.merchant.companyInformation.pan" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.companyInformation.pan.$error">
                  <div v-if="$v.merchant.companyInformation.pan.$params.required">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid PAN
                  </div>
                  <div v-if="$v.merchant.companyInformation.pan.$params.minLength">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.pan.$params.minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.pan.$params.maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input upper-case @blur="$v.merchant.companyInformation.tan.$touch"
                  :error="$v.merchant.companyInformation.tan.$error" color="grey-9"
                  v-model.trim="merchant.companyInformation.tan" float-label="TAN" placeholder="TAN" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.tan.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.tan" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.companyInformation.tan.$error">
                  <div v-if="$v.merchant.companyInformation.tan.$params.required">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid TAN
                  </div>
                  <div v-if="$v.merchant.companyInformation.tan.$params.minLength">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.tan.$params.minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.tan.$params.maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="merchant.companyInformation.businessNature"
                  float-label="Nature of Business" placeholder="Nature of Business" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.businessNature.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.businessNature
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.companyInformation.businessType" float-label="Type of Business"
                  :options="businessTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.businessType.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.businessType
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.mcc.$touch" :error="
                    autoCompleteError(
                      $v.merchant.companyInformation.mcc,
                      $v.merchant.companyInformation.mccname
                    )
                  " color="grey-9" v-model.trim="merchant.companyInformation.mccname"
                  float-label="MCC (type min 3 characters)" placeholder="Start typing ..*">
                  <q-autocomplete separator @search="mccSearch" :debounce="10" :min-characters="3"
                    @selected="mccSelected" />
                </q-input>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.mcc.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.mcc" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.companyInformation.mcc.$error ||
                    $v.merchant.companyInformation.mccname.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    $v.merchant.companyInformation.residentialAddress.$touch
                  " :error="
                    $v.merchant.companyInformation.residentialAddress.$error
                  " color="grey-9" v-model.trim="merchant.companyInformation.residentialAddress"
                  float-label="Residential Address* (max 120 characters)" placeholder="Residential Address*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.residentialAddress
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.residentialAddress
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.residentialPin.$touch"
                  :error="$v.merchant.companyInformation.residentialPin.$error" color="grey-9" type="number"
                  v-model.trim="merchant.companyInformation.residentialPin" float-label="Pincode*"
                  placeholder="Pincode*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.residentialPin.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.residentialPin
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    $v.merchant.companyInformation.residentialCityRefCode.$touch
                  " :error="
                    autoCompleteError(
                      $v.merchant.companyInformation.residentialCityRefCode,
                      $v.merchant.companyInformation.residentCityName
                    )
                  " color="grey-9" v-model.trim="merchant.companyInformation.residentCityName"
                  float-label="City (type min 3 characters)*" placeholder="Start typing ..*">
                  <q-autocomplete separator @search="residentCitySearch" :debounce="10" :min-characters="3"
                    @selected="residentCitySelected" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .residentialCityRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .residentialCityRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.companyInformation.residentialCityRefCode
                      .$error ||
                    $v.merchant.companyInformation.residentCityName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
