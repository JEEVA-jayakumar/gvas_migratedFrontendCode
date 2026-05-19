          <q-step error-icon="warning" name="third" :error="error.tab.partnerInformation" title="Partners">
            <div v-for="(v, index) in $v.viewBinding.partnersArr.$each.$iter" :key="index" class="row q-my-xs gutter-sm"
              ref="parentElement">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="row group items-center">
                  <div class="col">
                    <span class="q-pa-sm bg-light text-dark">
                      <q-icon name="people" />
                      Partner 0{{ parseInt(index) + 1 }}
                    </span>
                  </div>
                  <div class="col-auto" v-if="
                      Object.keys($v.viewBinding.partnersArr.$each.$iter)
                        .length > 1
                    ">
                    <q-btn round icon="delete" @click="removePartnerFromArr(v, index)" color="negative" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.name.$anyError" @blur="v.name.$touch()" color="grey-9" v-model.trim="v.$model.name"
                  float-label="Name*" placeholder="Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].name.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.name.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <!-- <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime @blur="$v.merchant.salesInformation.applicationDate.$touch"
                  :error="$v.merchant.salesInformation.applicationDate.$error" color="grey-9" format="DD/MM/YYYY"
                  format-model="number" modal v-model.trim="merchant.salesInformation.applicationDate"
                  float-label="Application Date*" placeholder="Application Date*" />
              </div> -->
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-datetime :min="past" :max="future" format="DD/MM/YYYY" format-model="number" modal
                  :error="v.dob.$anyError" @blur="v.dob.$touch()" color="grey-9" v-model.trim="v.$model.dob"
                  float-label="PAN DOB *" placeholder="PAN DOB *" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input upper-case :error="v.pan.$anyError" @blur="v.pan.$touch()" color="grey-9"
                  v-model.trim="v.$model.pan" float-label="Pan*" placeholder="Pan*" />
                <div class="textf-negative" v-if="
                    error.field.merchant.partnerInformation[index].pan.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.pan.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid PAN
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp; Should be
                    10 digits
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.address.$anyError" @blur="v.address.$touch()" color="grey-9"
                  v-model.trim="v.$model.address" float-label="Address* (max 120 characters)" placeholder="Address*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].address.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.address.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.pin.$anyError" @blur="v.pin.$touch()" color="grey-9" type="number"
                  v-model.trim="v.$model.pin" float-label="Pincode*" placeholder="Pincode*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].pin.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.pin.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid pincode
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp; Should be
                    between 6 and 7 digits
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="autoCompleteError(v.cityRefLabel, v.cityRefCode)" color="grey-9"
                  v-model.trim="v.$model.cityRefLabel" float-label="City (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <q-autocomplete separator @search="partnerCitySearch" :debounce="10" :min-characters="3"
                    @selected="(obj) => partnerCitySelected(obj, index)" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].cityRefCode
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.cityRefLabel.$error || v.cityRefCode.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="autoCompleteError(v.stateRefLabel, v.stateRefCode)" @blur="v.stateRefLabel.$touch()"
                  color="grey-9" v-model.trim="v.$model.stateRefLabel" float-label="State (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <q-autocomplete separator @search="partnerStateSearch" :debounce="10" :min-characters="1"
                    @selected="(obj) => partnerStateSelected(obj, index)" />
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].stateRefCode
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v.stateRefCode.$anyError || v.stateRefLabel.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.contactMobile.$anyError" @blur="v.contactMobile.$touch()" color="grey-9" type="tel"
                  v-model.trim="v.$model.contactMobile" float-label="Mobile*" placeholder="Mobile*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].contactMobile
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.contactMobile.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Accepts only digits
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp; Should be
                    10 digits
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.contactEmail.$anyError" @blur="v.contactEmail.$touch()" color="grey-9" type="email"
                  v-model.trim="v.$model.contactEmail" float-label="Email*" placeholder="Email*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].contactEmail
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.contactEmail.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid emal address
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('partners')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="positive float-right" @click="addMorePartnersSet()" class="q-ma-xs" icon="add"
                label="Add More" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
