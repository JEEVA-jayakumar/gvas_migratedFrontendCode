          <q-step error-icon="warning" :error="error.tab.salesInformation" name="first" title="Sales" subtitle="Info">
            <!-- {{this.merchant.paymentDetails.amountCollected}} -->
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable v-model.trim="leadSourceApp.sourceName" float-label="Lead Source*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable v-model.trim="deviceTypeApp.deviceName" float-label="Device Type*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select :class="{
    'readonly-select': propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'
  }" :disabled="this.propLeadDeatils.leadStatus == 102 || this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'"
                  :error="$v.merchant.salesInformation.institutionCode.$error" placeholder="Choose from the below"
                  color="grey-9" v-model.trim="merchant.salesInformation.institutionCode"
                  float-label="Institution Code*" :options="getinstitutionCode"
                  @input="fetchAllDropdownValuesFromMARSapi" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.institutionCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.institutionCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.institutionCode.$error">
                  <div v-if="
                      $v.merchant.salesInformation.institutionCode.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="merchant.salesInformation.institutionCode == 104" class="row gutter-sm q-my-xs">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.branchZone" float-label="ZONE*" :options="getAllZone"
                    @clear="fnClearZone" @input="fnFetchZone()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.iaDistrict" float-label="IA_District*"
                    :options="getAllDistrict" @input="fnFetchBranchName()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select disable placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.raDistrict" float-label="RA_District*"
                    :options="getAllDistrict" @clear="fnClearZone" @input="fnFetchZone()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select disable placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.od1District" float-label="OD1_District*"
                    :options="getAllDistrict" @clear="fnClearZone" @input="fnFetchZone()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select disable placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.od2District" float-label="OD2_District*"
                    :options="getAllDistrict" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9" v-model.trim="
                      merchant.additionalInfo.installationBranchCode
                    " float-label="InstallationBranchName*" :options="getAllBranchName" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" v-model.trim="merchant.additionalInfo.lorState"
                    float-label="IOR_STATE(type min 3 characters)*" placeholder="Start typing ..*">
                    <q-autocomplete separator @search="searchIorState" :debounce="10" :min-characters="3" />
                  </q-input>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" v-model.trim="merchant.additionalInfo.pin" float-label="Pincode"
                    placeholder="Start typing ..*" @input="pincodeBasedDistrict">
                    <q-autocomplete separator @search="searchAxisBankPincode" :min-characters="3" />
                  </q-input>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.state" float-label="State*"
                    @input="pincodeandDistrictBasedCity" :options="getPincodeBasedDistrict" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.city" float-label="City*" :options="getPincodeDistrict"
                    @input="citybasedlocation" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.iaLocation" float-label="IA_LOCATION*"
                    :options="getCityBasedLocation" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.iaSalutation" float-label="IA_Salution*"
                    :options="iaSalutationOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.iaGender" float-label="IA_Gender*"
                    :options="iaGenderOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.od1Salutation" float-label="OD1_Salutation*"
                    :options="od1SalutationOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.od1Gender" float-label="OD1_Gender*"
                    :options="od1GenderOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.od2Salutation" float-label="OD2_Salutation*"
                    :options="od2SalutationOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model.trim="merchant.additionalInfo.od2Gender" float-label="OD2_Gender*"
                    :options="od2GenderOptions" />
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.salesInformation.applicationType.$touch"
                  :error="$v.merchant.salesInformation.applicationType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model.trim="merchant.salesInformation.applicationType"
                  float-label="Application Type*" :options="applicationTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.applicationType.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.applicationType
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.applicationType.$error">
                  <div v-if="
                      $v.merchant.salesInformation.applicationType.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input readonly @blur="$v.merchant.salesInformation.applicationNumber.$touch"
                  :error="$v.merchant.salesInformation.applicationNumber.$error" color="grey-9"
                  v-model.trim="merchant.salesInformation.applicationNumber" float-label="Application Number*"
                  placeholder="Application Number*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.applicationNumber
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.applicationNumber
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.applicationNumber.$error">
                  <div v-if="
                      $v.merchant.salesInformation.applicationNumber.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime @blur="$v.merchant.salesInformation.applicationDate.$touch"
                  :error="$v.merchant.salesInformation.applicationDate.$error" color="grey-9" format="DD/MM/YYYY"
                  format-model="number" modal v-model.trim="merchant.salesInformation.applicationDate"
                  float-label="Application Date*" placeholder="Application Date*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.applicationDate.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.applicationDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.applicationDate.$error">
                  <div v-if="
                      $v.merchant.salesInformation.applicationDate.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime format="DD/MM/YYYY" format-model="number"
                  @blur="$v.merchant.salesInformation.aggreementDate.$touch"
                  :error="$v.merchant.salesInformation.aggreementDate.$error" color="grey-9" modal
                  v-model.trim="merchant.salesInformation.aggreementDate" float-label="Agreement Date*"
                  placeholder="Agreement Date*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.aggreementDate.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.aggreementDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.aggreementDate.$error">
                  <div v-if="
                      $v.merchant.salesInformation.aggreementDate.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.salesInformation.merchantType.$touch"
                  :error="$v.merchant.salesInformation.merchantType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model.trim="merchant.salesInformation.merchantType" float-label="Merchant Type*"
                  :options="merchantTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.merchantType.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.merchantType" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.merchantType.$error">
                  <div v-if="
                      $v.merchant.salesInformation.merchantType.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.salesInformation.categoryType.$touch"
                  :error="$v.merchant.salesInformation.categoryType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model.trim="merchant.salesInformation.categoryType" float-label="Category Type*"
                  :options="categoryTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.categoryType.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.categoryType" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.categoryType.$error">
                  <div v-if="
                      $v.merchant.salesInformation.categoryType.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="$v.merchant.salesInformation.region.$touch" :error="$v.merchant.salesInformation.region.$error"
                  v-model.trim="merchant.salesInformation.region" float-label="Region*" :options="regionOptions" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.region.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.region" />
                </div>

                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.salesInformation.region.$error">
                  <div v-if="$v.merchant.salesInformation.region.$params.required">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9" filter clearable
                  @blur="$v.merchant.salesInformation.salesPersonName.$touch"
                  :error="$v.merchant.salesInformation.salesPersonName.$error"
                  v-model.trim="merchant.salesInformation.salesPersonName" float-label="Sales Person*"
                  :options="salesPersonOptions" />

                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.salesPersonName.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.salesPersonName
                    " />
                </div>

                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.salesPersonName.$error">
                  <div v-if="
                      $v.merchant.salesInformation.salesPersonName.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="$v.merchant.salesInformation.leadFrom.$touch"
                  :error="$v.merchant.salesInformation.leadFrom.$error"
                  v-model.trim="merchant.salesInformation.leadFrom" float-label="Lead From*" :options="leadFromOptions"
                  :disabled="this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'" :class="{
    'readonly-select': propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'
  }" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.leadFrom.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.leadFrom" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.salesInformation.leadFrom.$error">
                  <div v-if="
                      $v.merchant.salesInformation.leadFrom.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="fillingTypesOptions">
                <p class="q-caption">Sharing Model</p>
                <div v-for="(item, index) in viewBinding.sharingModelCode" :key="index">
                  <q-radio color="grey-9" v-model.trim="merchant.salesInformation.sharingModelCode" :val="item.value"
                    :label="item.label" @input="sharemodebasedonSharingMode()" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.sharingModelCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.sharingModelCode
                    " />
                </div>
              </div>
            </div>
            <!-- T => Transaction value model -->
            <div v-if="merchant.salesInformation.sharingModelCode == 'T'" class="row gutter-sm q-my-xs">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.salesInformation.sharingPartnerCode.$touch" :error="
                    $v.merchant.salesInformation.sharingPartnerCode.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.salesInformation.sharingPartnerCode" float-label="Sharing partner*"
                  :options="sharingPartnerCode" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.sharingPartnerCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.sharingPartnerCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.sharingPartnerCode.$error">
                  <div v-if="
                      $v.merchant.salesInformation.sharingPartnerCode.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.salesInformation.dailyFixedAmount.$touch"
                  :error="$v.merchant.salesInformation.dailyFixedAmount.$error" color="grey-9"
                  v-model.trim="merchant.salesInformation.dailyFixedAmount" float-label="Daily fixed amount*"
                  type="number" placeholder="Daily fixed amount*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.dailyFixedAmount.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.dailyFixedAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.dailyFixedAmount.$error">
                  <div v-if="
                      $v.merchant.salesInformation.dailyFixedAmount.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.salesInformation.dailyFixedAmount.$params
                        .minValue ||
                      $v.merchant.salesInformation.dailyFixedAmount.$params
                        .maxValue
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.salesInformation.dailyFixedAmount.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.salesInformation.dailyFixedAmount.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    $v.merchant.salesInformation.loanDisbursementPercentage
                      .$touch;
                  " :error="
                    $v.merchant.salesInformation.loanDisbursementPercentage
                      .$error
                  " color="grey-9" v-model.trim="
                    merchant.salesInformation.loanDisbursementPercentage
                  " float-label="Percentage*" type="number" placeholder="Percentage*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation
                      .loanDisbursementPercentage.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation
                        .loanDisbursementPercentage
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.salesInformation.loanDisbursementPercentage
                      .$error
                  ">
                  <div v-if="
                      $v.merchant.salesInformation.loanDisbursementPercentage
                        .$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.salesInformation.loanDisbursementPercentage
                        .$params.minValue ||
                      $v.merchant.salesInformation.loanDisbursementPercentage
                        .$params.maxValue
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.salesInformation.loanDisbursementPercentage
                    .$params.minValue.min
                    }}
                    and
                    {{
                    $v.merchant.salesInformation.loanDisbursementPercentage
                    .$params.maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    $v.merchant.salesInformation.loanDisbursementAmount.$touch
                  " :error="
                    $v.merchant.salesInformation.loanDisbursementAmount.$error
                  " color="grey-9" v-model.trim="
                    merchant.salesInformation.loanDisbursementAmount
                  " float-label="Loan disbursement value*" type="number" placeholder="Loan disbursement value*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.loanDisbursementAmount
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation
                        .loanDisbursementAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.salesInformation.loanDisbursementAmount.$error
                  ">
                  <div v-if="
                      $v.merchant.salesInformation.loanDisbursementAmount
                        .$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.salesInformation.loanDisbursementAmount
                        .$params.minValue ||
                      $v.merchant.salesInformation.loanDisbursementAmount
                        .$params.maxValue
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.salesInformation.loanDisbursementAmount
                    .$params.minValue.min
                    }}
                    and
                    {{
                    $v.merchant.salesInformation.loanDisbursementAmount
                    .$params.maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime format="DD/MM/YYYY" format-model="number" @blur="
                    $v.merchant.salesInformation.loanDisbursementDate.$touch
                  " :error="
                    $v.merchant.salesInformation.loanDisbursementDate.$error
                  " color="grey-9" modal v-model.trim="merchant.salesInformation.loanDisbursementDate"
                  float-label="Disbursement Date*" placeholder="Disbursement Date*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.loanDisbursementDate
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.loanDisbursementDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.salesInformation.loanDisbursementDate.$error
                  ">
                  <div v-if="
                      $v.merchant.salesInformation.loanDisbursementDate.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.salesInformation.tenureMonth.$touch"
                  :error="$v.merchant.salesInformation.tenureMonth.$error" color="grey-9"
                  v-model.trim="merchant.salesInformation.tenureMonth" float-label="Tenure (in months)*" type="number"
                  placeholder="Tenure (in months)*" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.tenureMonth.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.tenureMonth" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.tenureMonth.$error">
                  <div v-if="
                      $v.merchant.salesInformation.tenureMonth.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.salesInformation.tenureDay.$touch"
                  :error="$v.merchant.salesInformation.tenureDay.$error" color="grey-9"
                  v-model.trim="merchant.salesInformation.tenureDay" float-label="Tenure (in days)*" type="number"
                  placeholder="Tenure (in days)*" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.tenureDay.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.tenureDay" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.salesInformation.tenureDay.$error">
                  <div v-if="
                      $v.merchant.salesInformation.tenureDay.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime format="DD/MM/YYYY" format-model="number"
                  @blur="$v.merchant.salesInformation.tenureStartDate.$touch"
                  :error="$v.merchant.salesInformation.tenureStartDate.$error" color="grey-9" modal
                  v-model.trim="merchant.salesInformation.tenureStartDate" float-label="Start Date*"
                  placeholder="Tenure Start Date*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.tenureStartDate.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.tenureStartDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.tenureStartDate.$error">
                  <div v-if="
                      $v.merchant.salesInformation.tenureStartDate.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
            </div>
            <!-- M => MDR/cash@pos/rent -->
            <div v-if="merchant.salesInformation.sharingModelCode == 'M'" class="row gutter-sm q-my-xs">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="$v.merchant.salesInformation.sharingPartnerCode.$touch" :error="
                    $v.merchant.salesInformation.sharingPartnerCode.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model.trim="merchant.salesInformation.sharingPartnerCode" float-label="Sharing partner*"
                  :options="sharingPartnerCode" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.sharingPartnerCode
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.sharingPartnerCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.sharingPartnerCode.$error">
                  <div v-if="
                      $v.merchant.salesInformation.sharingPartnerCode.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.salesInformation.rentPercentage.$touch"
                  :error="$v.merchant.salesInformation.rentPercentage.$error" color="grey-9"
                  v-model.trim="merchant.salesInformation.rentPercentage" float-label="Rent %*" type="number"
                  placeholder="Rent %*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.rentPercentage.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.rentPercentage
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.salesInformation.rentPercentage.$error">
                  <div v-if="
                      $v.merchant.salesInformation.rentPercentage.$params
                        .required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.salesInformation.rentPercentage.$params
                        .minValue ||
                      $v.merchant.salesInformation.rentPercentage.$params
                        .maxValue
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.salesInformation.rentPercentage.$params
                    .minValue.min
                    }}
                    and
                    {{
                    $v.merchant.salesInformation.rentPercentage.$params
                    .maxValue.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="$v.merchant.salesInformation.rentFixed.$touch"
                  :error="$v.merchant.salesInformation.rentFixed.$error" color="grey-9"
                  v-model.trim="merchant.salesInformation.rentFixed" float-label="Rent fixed*" type="number"
                  placeholder="Rent fixed*" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.rentFixed.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.rentFixed" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="$v.merchant.salesInformation.rentFixed.$error">
                  <div v-if="
                      $v.merchant.salesInformation.rentFixed.$params.required
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      $v.merchant.salesInformation.rentFixed.$params.minValue ||
                      $v.merchant.salesInformation.rentFixed.$params.maxValue
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    $v.merchant.salesInformation.rentFixed.$params.minValue
                    .min
                    }}
                    and
                    {{
                    $v.merchant.salesInformation.rentFixed.$params.maxValue
                    .max
                    }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Navigation for this step at the end of QStep-->
