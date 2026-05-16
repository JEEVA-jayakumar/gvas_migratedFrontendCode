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
