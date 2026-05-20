          <q-step error-icon="warning" name="eight" title="KYC" subtitle="Details">
            <div class="row items-center">
              <div class="col-12 bottom-border q-py-md" v-for="(key, index) in Object.keys(
                  propLeadDeatils.leadDocuments
                )" :key="index">
                <div class="row group items-center">
                  <div class="col-auto">
                    <span>{{ propLeadDeatils.revParameters }}</span>
                  </div>
                  <div class="col-auto">
                    <span class="text-purple-9 text-weight-bold border-1 q-pa-sm">{{ index + 1 }}</span>
                  </div>
                  <div class="col-10" v-for="(item, subIndex) in propLeadDeatils.leadDocuments[
                      key
                    ]" :key="subIndex">
                    <div class="row">
                      <div class="col-4 q-body-1">Document</div>
                      <div class="col-8 q-body-1 text-weight-bold text-negative" v-if="item.documentType == ''">
                        NA
                      </div>
                      <div class="col-8 q-body-1" v-else>
                        {{ item.documentType }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 q-body-1">Sub document</div>
                      <div class="col-8 q-body-1 text-weight-bold text-negative" v-if="item.subDocumentType == ''">
                        NA
                      </div>
                      <div class="col-8 q-body-1 text-weight-bold text-positive" v-else>
                        {{ item.subDocumentType }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12" v-show="item.uploadedDocuments.length > 0">
                        <div class="q-caption" v-for="(
                            document, documentIndex
                          ) in item.uploadedDocuments" :key="documentIndex">
                          {{ document.fileName }}
                        </div>
                      </div>
                      <div class="q-caption" v-show="item.uploadedDocuments.length == 0">
                        <div class="text-weight-bold text-negative">
                          No document available
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row group q-py-md items-center">
              <div class="col-6">
                <q-input color="grey-9" v-model.trim="merchant.remarks" float-label="Remarks" placeholder="Remarks" />
              </div>
              <div class="col-6">
                <p class="q-ma-0">Hold payment?</p>
                <q-radio color="grey-9" v-model.trim="holdPayment" :val="1" label="Yes" />
                <q-radio color="grey-9" v-model.trim="holdPayment" :val="0" label="No" />
              </div>
            </div>
            <q-stepper-navigation>
              <!-- <q-btn  /> -->
              <q-btn v-if="this.leadSourceApp.multiTidEnabled != true" color="primary" class="q-ma-xs" icon="check"
                @click="finalFormSubmit()" label="Submit" />
              <q-btn v-if="this.leadSourceApp.multiTidEnabled == true" color="primary" class="q-ma-xs" icon="check"
                @click="OpenMultiTidToggle()" label="Create Base TID" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
        <multiTidComponents v-if="propTogglemultiTidComponentDetails"
          :multiTidComponentDetails="addtnmultiTidComponentDetails" :propTogglemultiTidComponentDetails="
            propTogglemultiTidComponentDetails
          " />
      </div>
    </div>
  </div>
</template>

<script>
  import Vuelidate from "vuelidate";
  import { easing } from "quasar";
  import { LocalStorage } from "quasar";
  import multiTidComponents from "./multiTidComponents.vue";
  global.jQuery = require("jquery");
  var $ = global.jQuery;
  window.$ = $;

  import {
    required,
    requiredIf,
    alphaNum,
    integer,
    numeric,
    minLength,
    maxLength,
    email,
    maxValue,
    minValue,
    decimal,
  } from "vuelidate/lib/validators";
  Vue.use(Vuelidate);
  import { date } from "quasar";
  import moment from "moment";
  import { ref } from "vue";
  import { mapGetters, mapActions } from "vuex";
  import { uid, filter } from "quasar";
  import Vue from "vue";

  import viewLeadDocumentsDataEntryComponent from "./viewLeadDocumentsDataEntryComponent.vue";
  import MarsErrorResponse from "../MarsErrorResponseHandler.vue";
