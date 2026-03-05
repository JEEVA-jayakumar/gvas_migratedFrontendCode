<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center q-mb-lg">
          <div class="col-md-6">
            <q-chip color="primary" text-color="white">
              Batch number : BatchNo_000{{ getAllQRList1.batchCount }}
            </q-chip>
          </div>
        </div>

        <div class="row q-col-gutter-md items-center q-mb-md">
          <div class="col-md-3">
            <div class="text-subtitle2">Select QR Bank</div>
          </div>
          <div class="col-md-6">
            <q-select
              outlined
              dense
              label="Select QR API"
              v-model="formdata.leadSource"
              :options="dropDown.leadSourceOptions"
              color="purple-9"
              emit-value
              map-options
            />
          </div>
        </div>

        <div class="row q-col-gutter-md items-center q-mb-md">
          <div class="col-md-3">
            <div class="text-subtitle2">Enter numbers of QR Ref numbers to be created</div>
          </div>
          <div class="col-md-6">
            <q-input
              outlined
              dense
              type="number"
              label="Enter numbers of QR count"
              v-model.number="formdata.count"
              color="purple-9"
              @keydown="fnOnlyNumbers"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-lg">
          <q-btn
            :disabled="submitDisabled"
            color="light-blue"
            unelevated
            label="Create QR"
            @click="fnsubmit"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "CreateQRSticker",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formdata: {
        leadSource: null,
        count: null
      },
      dropDown: {
        leadSourceOptions: []
      }
    };
  },
  validations() {
    return {
      formdata: {
        leadSource: { required },
        count: { required }
      }
    };
  },
  computed: {
    ...mapGetters("QRList", ["getAllQRList1"]),
    ...mapGetters("ACTIVE_DEACTIVE_LEAD_SOURCE", ["getActiveandDeactiveLeadSource"]),
    submitDisabled() {
      return !this.formdata.leadSource || !this.formdata.count;
    }
  },
  created() {
    this.ajaxLoadData();
    this.FETCH_QR_LIST1();
  },
  methods: {
    ...mapActions("createQRCode", ["CREATE_QR_CODE"]),
    ...mapActions("ACTIVE_DEACTIVE_LEAD_SOURCE", ["LEAD_SOURCE_ACTIVE_DEACTIVE_LIST"]),
    ...mapActions("QRList", ["FETCH_QR_LIST1"]),

    ajaxLoadData() {
      this.LEAD_SOURCE_ACTIVE_DEACTIVE_LIST().then(() => {
        this.dropDown.leadSourceOptions = _.map(this.getActiveandDeactiveLeadSource, item => ({
          value: item.instance_id,
          label: item.apiInstanceName
        }));
      });
    },
    fnOnlyNumbers(event) {
        if (event.keyCode !== 8 && event.keyCode !== 46 && isNaN(Number(event.key))) {
            event.preventDefault();
        }
    },
    fnsubmit() {
      this.v$.$touch();
      if (this.v$.$error) return;

      this.$q.loading.show({ message: "Please Wait" });
      const requestParams = {
        url: {
          leadSource: this.formdata.leadSource,
          count: this.formdata.count
        }
      };

      this.CREATE_QR_CODE(requestParams)
        .then(response => {
          this.FETCH_QR_LIST1();
          this.$q.notify({
            color: "positive",
            message: response.data.message || "QR Created Successfully",
            icon: "thumb_up"
          });
          this.formdata.leadSource = null;
          this.formdata.count = null;
          this.v$.$reset();
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.data?.message || "Error creating QR"
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
};
</script>
