          <q-step error-icon="warning" name="seventh" :error="error.tab.bankInformation" title="Bank & Collection"
            subtitle="Details">
            <div class="row q-mb-md gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input upper-case color="grey-9" :error="$v.merchant.bankInformation.bankDetails.ifsc.$error"
                  @blur="populateBankDetails" v-model.trim="merchant.bankInformation.bankDetails.ifsc"
                  float-label="IFSC Code*" placeholder="Enter IFSC*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.ifsc.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.ifsc
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.bankInformation.bankDetails.ifsc.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Once entered and moved to the next field, bank details will
                    be populated automatically.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable @blur="
                    $v.merchant.bankInformation.bankDetails.branchName.$touch
                  " :error="
                    $v.merchant.bankInformation.bankDetails.branchName.$error
                  " v-model.trim="merchant.bankInformation.bankDetails.branchName" float-label="Branch Name*"
                  placeholder="Branch Name* " />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.branchName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .branchName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    $v.merchant.bankInformation.bankDetails.branchName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="merchant.bankInformation.bankDetails.branchCode"
                  float-label="Branch Code" placeholder="Branch Code" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model.trim="merchant.bankInformation.bankDetails.branchZone"
                  float-label="Branch Zone" placeholder="Branch Zone" />
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below" color="grey-9"
                  v-model.trim="merchant.bankInformation.bankDetails.feeType" float-label="Fee Type"
                  :options="feeTypeOptions" @input="
                    merchant.bankInformation.bankDetails.settlementOrNeftFee =
                      ''
                  " />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.feeType
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.feeType
                    " />
                </div>
              </div>
              <div v-if="
                  merchant.bankInformation.bankDetails.feeType == 'N' ||
                  merchant.bankInformation.bankDetails.feeType == 'S'
                " class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    $v.merchant.bankInformation.bankDetails.settlementOrNeftFee
                      .$touch;
                  " :error="
                    $v.merchant.bankInformation.bankDetails.settlementOrNeftFee
                      .$error
                  " v-model.trim="
                    merchant.bankInformation.bankDetails.settlementOrNeftFee
                  " float-label="NEFT/Settlement Fee Inclusive of Tax*"
                  placeholder="NEFT/Settlement Fee Inclusive of Tax*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .settlementOrNeftFee.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .settlementOrNeftFee
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="$v.merchant.bankInformation.bankDetails.micr.$touch"
                  :error="$v.merchant.bankInformation.bankDetails.micr.$error"
                  v-model.trim="merchant.bankInformation.bankDetails.micr" float-label="MICR*" placeholder="MICR*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.micr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.micr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="$v.merchant.bankInformation.bankDetails.micr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable @blur="
                    $v.merchant.bankInformation.bankDetails.bankName.$touch
                  " :error="
                    $v.merchant.bankInformation.bankDetails.bankName.$error
                  " v-model.trim="merchant.bankInformation.bankDetails.bankName" float-label="Bank Name*"
                  placeholder="Bank Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.bankName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.bankName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
