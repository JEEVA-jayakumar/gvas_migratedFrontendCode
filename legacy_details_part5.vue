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
