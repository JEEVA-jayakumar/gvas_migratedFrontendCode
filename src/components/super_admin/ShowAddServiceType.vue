<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewServiceType"
      @escape-key="emitfnShowAddNewServiceType"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Service Types</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.serviceReqType.name"
                @blur="v$.formData.serviceReqType.name.$touch"
                :error="v$.formData.serviceReqType.name.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Enter Service Type Name"
                placeholder="Enter Service Type Name"
                @keyup.enter="fnfinalsubmitAddSpareParts()"
              />
            </div>
          </div>

          <div class="row q-pa-md">
            <div class="col-6">
              <p class="text-weight-bold">Service Req Issue Type*</p>
              <div class="column q-gutter-sm">
                <div
                  v-for="menu in serviceReqIssueTypeSetsPro"
                  :key="menu.id"
                  class="row items-center"
                >
                  <q-checkbox
                    v-model="selectedIssues"
                    :val="menu"
                    :label="menu.name"
                    color="purple-9"
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <p class="text-weight-bold">Service Status*</p>
              <div class="column q-gutter-sm">
                <div
                  v-for="menu in serviceRequestStatus"
                  :key="menu.id"
                  class="row items-center"
                >
                  <q-checkbox
                    v-model="selectedStatuses"
                    :val="menu"
                    :label="menu.name"
                    color="purple-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewServiceType()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddSpareParts()"
              color="purple-9"
              label="Save"
            />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShowAddServiceType"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddServiceType,
      serviceReqIssueTypeSetsPro: [],
      serviceRequestStatus: [],
      selectedIssues: [],
      selectedStatuses: [],
      formData: {
        serviceReqType: {
          name: "",
        },
      },
    };
  },
  validations() {
    return {
      formData: {
        serviceReqType: {
          name: { required },
        },
      },
    };
  },
  computed: {
    ...mapGetters("serviceRequest", ["getserviceRequestIssueTypes"]),
    ...mapGetters("ServiceRequestStatus", ["getserviceRequestStatusDetails"]),
  },
  created() {
    this.getIssueTypes();
    this.getStatusTypes();
  },
  methods: {
    ...mapActions("serviceRequest", [
      "UPDATE_SERVICE_REQUEST_TYPES",
      "GET_SERVICE_ISSUE_TYPES",
    ]),
    ...mapActions("ServiceRequestStatus", [
      "FETCH_SERVICE_REQUEST_STATUS_DETAILS",
    ]),
    emitfnShowAddNewServiceType() {
      this.$emit("emitfnShowAddNewServiceType");
    },
    getIssueTypes() {
      this.GET_SERVICE_ISSUE_TYPES().then(() => {
        this.serviceReqIssueTypeSetsPro = _.map(
          this.getserviceRequestIssueTypes,
          (item) => item
        );
      });
    },
    getStatusTypes() {
      this.FETCH_SERVICE_REQUEST_STATUS_DETAILS().then(() => {
        this.serviceRequestStatus = _.map(
          this.getserviceRequestStatusDetails,
          (item) => item
        );
      });
    },
    fnfinalsubmitAddSpareParts() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        let payload = {
          serviceReqType: this.formData.serviceReqType,
          serviceReqIssueTypeSets: this.selectedIssues.map((item) => ({
            serviceReqIssueType: item,
          })),
          serviceRequestStatusSets: this.selectedStatuses.map((item) => ({
            serviceRequestStatus: item,
          })),
        };
        this.UPDATE_SERVICE_REQUEST_TYPES(payload)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnShowAddNewServiceType", "refresh");
            this.$q.notify({
              color: "positive",
              message: "Added Successfully",
              icon: "thumb_up",
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Error",
            });
          });
      }
    },
  },
};
</script>
