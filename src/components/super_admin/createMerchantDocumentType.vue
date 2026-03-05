<template>
  <div>
    <q-dialog
      v-model="propToggleModal"
      @hide="toggleModal"
      @escape-key="toggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <div class="q-pa-md column group">
          <div class="text-h6 text-weight-regular q-py-md">Add Merchant Document Type</div>
          <div>
            <q-select
              color="grey-9"
              @blur="v$.formData.url.merchantType.$touch"
              :error="v$.formData.url.merchantType.$error"
              v-model="formData.url.merchantType"
              :options="activeMerchantType"
              label="Select merchant type"
              placeholder="Merchant type"
              emit-value
              map-options
            />
          </div>
          <div>
            <q-input
              v-model="formData.params.documentType"
              @blur="v$.formData.params.documentType.$touch"
              :error="v$.formData.params.documentType.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Merchant Document Type"
              placeholder="Merchant Document Type"
              @keyup.enter="submitMerchantDcoumentTypeData()"
            />
          </div>
          <div>
            <q-input
              v-model="formData.params.marsDocumentId"
              @blur="v$.formData.params.marsDocumentId.$touch"
              :error="v$.formData.params.marsDocumentId.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              type="number"
              label="Mars Agreement Id"
              placeholder="Mars Agreement Id"
              @keyup.enter="submitMerchantDcoumentTypeData()"
            />
          </div>
          <div class="q-mt-md">
            <p>Does it contain sub documents?</p>
            <q-radio
              @update:model-value="getViewTypeValue"
              v-model="formData.params.viewType"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Yes"
              :val="0"
            />
            <q-radio
              @update:model-value="getViewTypeValue"
              v-model="formData.params.viewType"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="No"
              :val="1"
            />
          </div>
          <div class="q-mt-md">
            <p>Whether document mandatory during lead generation?</p>
            <q-radio
              v-model="formData.params.required"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Yes"
              :val="1"
            />
            <q-radio
              v-model="formData.params.required"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="No"
              :val="0"
            />
          </div>
          <div class="row q-mt-md justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="toggleModal()"
            >Cancel</q-btn>
            <q-btn
              @click="submitMerchantDcoumentTypeData()"
              color="purple-9"
              label="Save"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  integer,
  required,
  maxValue,
  minValue
} from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  props: ["propShowCreateMerchantDocumentTypes", "propActiveMerchantTypes"],
  setup() {
      return { v$: useVuelidate() };
  },
  data() {
    return {
      propToggleModal: this.propShowCreateMerchantDocumentTypes,
      activeMerchantType: this.propActiveMerchantTypes,
      formData: {
        url: {
          merchantType: null,
          hasSubDoc: 0
        },
        params: {
          documentType: "",
          parentID: 0,
          viewType: 0,
          marsDocumentId: null,
          required: 1
        }
      }
    };
  },
  validations() {
    return {
      formData: {
        url: {
          merchantType: {
            required
          }
        },
        params: {
          marsDocumentId: {
            required,
            integer,
            minValue: minValue(0),
            maxValue: maxValue(999)
          },
          documentType: {
            required
          }
        }
      }
    }
  },
  methods: {
    ...mapActions("merchantDocumentTypes", ["ADD_NEW_MERCHANT_DOCUMENT_TYPE"]),
    toggleModal() {
      this.$emit("emitfnshowMerchantDocumentTypes");
    },
    getViewTypeValue(val) {
      this.formData.url.hasSubDoc = val ? 0 : 1;
    },
    submitMerchantDcoumentTypeData() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
          this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          message: "Please Wait",
          spinnerColor: "purple-9",
        });
        this.ADD_NEW_MERCHANT_DOCUMENT_TYPE(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnshowMerchantDocumentTypes", "refresh");
            this.$q.notify({
              color: "positive",
              message: "Merchant type successfully created!",
              icon: "thumb_up"
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>
