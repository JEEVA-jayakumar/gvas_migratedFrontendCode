          <q-step error-icon="warning" name="second" :error="error.tab.companyInformation" title="Details">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input type="text" @blur="$v.merchant.companyInformation.legalName.$touch"
                  :error="$v.merchant.companyInformation.legalName.$error" color="grey-9"
                  v-model.trim="merchant.companyInformation.legalName" float-label="Legal Name*"
                  placeholder="Legal Name*" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.legalName.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.legalName" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.legalName.$error">
                  <!-- <div
                    v-if="
                      $v.merchant.companyInformation.legalName.$params.required
                    "
                  >
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Only digits and alphabets are allowed
                  </div> -->
                  <!-- <div v-if="!/^[a-zA-Z\s]*$/.test(merchant.companyInformation.legalName)"> -->
                  <div v-if="
                      !/^[a-zA-Z0-9\s]*$/.test(
                        merchant.companyInformation.legalName
                      )
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Only
                    AlphaNumeric and spaces are allowed.
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.legalName.$params
                        .minLength ||
                      $v.merchant.companyInformation.legalName.$params.maxLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.legalName.$params.minLength
                    .min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.legalName.$params.maxLength
                    .max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.dbaName.$touch"
                  :error="$v.merchant.companyInformation.dbaName.$error" color="grey-9"
                  v-model.trim="merchant.companyInformation.dbaName" float-label="DBA Name*" placeholder="DBA Name*" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.dbaName.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.dbaName" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.companyInformation.dbaName.$error">
                  <div v-if="
                      $v.merchant.companyInformation.dbaName.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Only digits and alphabets are allowed
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.dbaName.$params
                        .minLength ||
                      $v.merchant.companyInformation.dbaName.$params.maxLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.dbaName.$params.minLength
                    .min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.dbaName.$params.maxLength
                    .max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">SMS Enable or Disable?</p>
                <div class="group">
                  <q-radio @blur="$v.merchant.companyInformation.smsFlag.$touch"
                    :error="$v.merchant.companyInformation.smsFlag.$error" v-for="(item, index) in smsFlagOptions"
                    :key="index" color="grey-9" v-model.trim="merchant.companyInformation.smsFlag" :val="item.value"
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
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    $v.merchant.companyInformation.residentialStateRefCode
                      .$touch;
                  " :error="
                    autoCompleteError(
                      $v.merchant.companyInformation.residentialStateRefCode,
                      $v.merchant.companyInformation.residentStateName
                    )
                  " color="grey-9" v-model.trim="merchant.companyInformation.residentStateName"
                  float-label="State (type min 3 characters)*" placeholder="Start typing ..*">
                  <q-autocomplete separator @search="residentStateSearch" :debounce="10" :min-characters="1"
                    @selected="residentStateSelected" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .residentialStateRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .residentialStateRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.companyInformation.residentialStateRefCode
                      .$error ||
                    $v.merchant.companyInformation.residentStateName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.contactName.$touch"
                  :error="$v.merchant.companyInformation.contactName.$error"
                  onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                  color="grey-9" v-model.trim="merchant.companyInformation.contactName" float-label="Contact Name*"
                  placeholder="Contact Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactName.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactName" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.contactName.$error">
                  <div v-if="
                      $v.merchant.companyInformation.contactName.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.contactName.$params
                        .minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.contactName.$params
                    .minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.contactName.$params
                    .maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.contactMobile.$touch"
                  :error="$v.merchant.companyInformation.contactMobile.$error" color="grey-9"
                  v-model.trim="merchant.companyInformation.contactMobile" float-label="Contact mobile*"
                  placeholder="Contact Mobile*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactMobile.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.contactMobile
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.contactMobile.$error">
                  <div v-if="
                      $v.merchant.companyInformation.contactMobile.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.contactMobile.$params
                        .minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.contactMobile.$params
                    .minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.contactMobile.$params
                    .maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="tel" @blur="
                    $v.merchant.companyInformation.contactAlternateMobile.$touch
                  " :error="
                    $v.merchant.companyInformation.contactAlternateMobile.$error
                  " v-model.trim="
                    merchant.companyInformation.contactAlternateMobile
                  " float-label="Contact Alt Mobile" placeholder="Contact Alt Mobile" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .contactAlternateMobile.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .contactAlternateMobile
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.companyInformation.contactAlternateMobile.$error
                  ">
                  <div v-if="
                      $v.merchant.companyInformation.contactAlternateMobile
                        .$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.contactAlternateMobile
                        .$params.minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.contactAlternateMobile
                    .$params.minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.contactAlternateMobile
                    .$params.maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="tel" @blur="$v.merchant.companyInformation.contactPhone.$touch"
                  :error="$v.merchant.companyInformation.contactPhone.$error"
                  v-model.trim="merchant.companyInformation.contactPhone" float-label="Contact Phone* (12 digits)"
                  placeholder="Contact Phone* (12 digits)" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactPhone.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.contactPhone
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.contactPhone.$error">
                  <div v-if="
                      $v.merchant.companyInformation.contactPhone.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.contactPhone.$params
                        .minLength
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    $v.merchant.companyInformation.contactPhone.$params
                    .minLength.min
                    }}
                    and
                    {{
                    $v.merchant.companyInformation.contactPhone.$params
                    .maxLength.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.companyInformation.contactEmail.$touch"
                  :error="$v.merchant.companyInformation.contactEmail.$error" color="grey-9" type="email"
                  v-model.trim="merchant.companyInformation.contactEmail" float-label="Contact Email*"
                  placeholder="Contact Email*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactEmail.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.contactEmail
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.contactEmail.$error">
                  <div v-if="
                      $v.merchant.companyInformation.contactEmail.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.contactEmail.$params.email
                    ">
                    <q-icon color="negative" name="warning" />&nbsp; Invalid
                    email address format
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-caption">Statement type</div>
                <div class="group">
                  <q-radio @blur="$v.merchant.companyInformation.statementType.$touch"
                    :error="$v.merchant.companyInformation.statementType.$error"
                    v-for="(item, index) in viewBinding.statementType" :key="index" color="grey-9"
                    v-model.trim="merchant.companyInformation.statementType" :val="item.value" :label="item.label" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.statementType.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.statementType
                    " />
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <p class="q-caption">Statement frequency</p>
                <div class="group">
                  <q-radio @blur="
                      $v.merchant.companyInformation.statementFrequency.$touch
                    " :error="
                      $v.merchant.companyInformation.statementFrequency.$error
                    " v-for="(item, index) in viewBinding.statementFrequency" :key="index" color="grey-9" v-model.trim="
                      merchant.companyInformation.statementFrequency
                    " :val="item.value" :label="item.label" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.statementFrequency
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.statementFrequency
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" float-label="Statement Email" placeholder="Statement Email"
                  @blur="$v.merchant.companyInformation.statementEmail.$touch"
                  :error="$v.merchant.companyInformation.statementEmail.$error"
                  v-model.trim="merchant.companyInformation.statementEmail" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.statementEmail.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.statementEmail
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.companyInformation.statementEmail.$error">
                  <div v-if="
                      $v.merchant.companyInformation.statementEmail.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.companyInformation.statementEmail.$params
                        .email
                    ">
                    <q-icon color="negative" name="warning" />&nbsp; Invalid
                    email address format
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('companyInformation')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
