                    :label="item.label" />
                  <div class="text-negative" v-if="error.field.merchant.companyInformation.smsFlag.alert">
                    <MarsErrorResponse :error="error.field.merchant.companyInformation.smsFlag" />
                  </div>
                  <div class="text-negative q-py-xs group q-caption"
                    v-if="$v.merchant.companyInformation.smsFlag.$error">
                    <div>
                      <q-icon color="negative" name="warning" />&nbsp;Required
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" float-label="Registered Address* (max 120 characters)"
                  placeholder="Registered Address*" v-model.trim="merchant.companyInformation.registeredAddress" @blur="
                    $v.merchant.companyInformation.registeredAddress.$touch
                  " :error="
                    $v.merchant.companyInformation.registeredAddress.$error
                  " />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.registeredAddress
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.registeredAddress
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.registeredAddress.$error">
                  <div v-if="
                      $v.merchant.companyInformation.registeredAddress.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Only digits and alphabets are allowed
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.registeredAddress.$params
                        .minLength ||
                      $v.merchant.companyInformation.registeredAddress.$params
                        .maxLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.registeredAddress.$params
                    .minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.registeredAddress.$params
                    .maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="text" @blur="$v.merchant.companyInformation.cityzone.$touch"
                  :error="$v.merchant.companyInformation.cityzone.$error"
                  v-model.trim="merchant.companyInformation.cityzone" float-label="Merchant City Zone"
                  placeholder="Merchant City Zone" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.cityzone.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.cityzone" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.cityzone.$error">
                  <div v-if="
                      !/^[a-zA-Z\s]*$/.test(
                        merchant.companyInformation.cityzone
                      )
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Only
                    Alphabets and spaces are allowed.
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.cityzone.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="fnClrRegisteredCity" :error="
                    autoCompleteError(
                      $v.merchant.companyInformation.registeredCityRefCode,
                      $v.merchant.companyInformation.registeredCityName
                    )
                  " color="grey-9" v-model.trim="merchant.companyInformation.registeredCityName"
                  @input="fninputTyping($event, 1)" float-label="Registered city (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <q-autocomplete separator @search="residentCitySearch" :debounce="10" :min-characters="3"
                    @selected="registeredCitySelected" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .registeredCityRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .registeredCityRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.companyInformation.registeredCityRefCode
                      .$error ||
                    $v.merchant.companyInformation.registeredCityName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.companyInformation.statezone.$touch"
                  :error="$v.merchant.companyInformation.statezone.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model.trim="merchant.companyInformation.statezone"
                  float-label=" Merchant State Zone*" :options="statezoneOptions" />

                <div class="text-negative" v-if="error.field.merchant.companyInformation.statezone.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.statezone" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.statezone.$error">
                  <div v-if="
                      $v.merchant.companyInformation.statezone.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="fnClrRegisteredState" :error="
                    autoCompleteError(
                      $v.merchant.companyInformation.registeredStateRefCode,
                      $v.merchant.companyInformation.registeredStateName
                    )
                  " color="grey-9" v-model.trim="merchant.companyInformation.registeredStateName"
                  @input="fninputTyping($event, 2)" float-label="Registered state (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <q-autocomplete separator @search="residentStateSearch" :debounce="10" :min-characters="1"
                    @selected="registeredStateSelected" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .registeredStateRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .registeredStateRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.companyInformation.registeredStateRefCode
                      .$error ||
                    $v.merchant.companyInformation.registeredStateName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.registeredPin.$touch"
                  :error="$v.merchant.companyInformation.registeredPin.$error" color="grey-9" type="number"
                  v-model.trim="merchant.companyInformation.registeredPin" float-label="PIN*" placeholder="PIN*" />
                <div class="text-negative" v-if="
