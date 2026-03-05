<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowServiceSubTaskDetails"
      @escape-key="emitfnshowServiceSubTaskDetails"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Sub Task</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                disable
                v-model="formData.id"
                :error="v$.formData.id.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Service Request Id"
                placeholder="Service Request Id"
              />
            </div>
            <div class="col-md-12 full-width q-mt-md">
              <q-input
                disable
                v-model="service_req_data"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Service Request"
                placeholder="Service Request"
              />
            </div>
            <div class="col-md-12 full-width q-mt-md">
              <q-select
                v-model="formData.issue_reason"
                :error="v$.formData.issue_reason.$error"
                label="Select Subtask"
                color="grey-9"
                :options="subtaskDetails"
                emit-value
                map-options
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnshowServiceSubTaskDetails()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitEditedSpareParts()"
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

export default {
  props: ["propShowServiceSubTaskDetails", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowServiceSubTaskDetails,
      subtaskDetails: [],
      service_req_data: JSON.stringify(this.propRowDetails.service_req_data),
      formData: {
        id: this.propRowDetails.id,
        issue_reason: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        id: { required },
        issue_reason: { required },
      },
    };
  },
  computed: {
    ...mapGetters("serviceRequest", ["getsubTaskDetails"]),
  },
  created() {
    this.fnsubTaskLoader();
  },
  methods: {
    ...mapActions("sparePartsGetTypes", ["EDIT_SPARE_PARTS_TYPES"]),
    ...mapActions("serviceRequest", ["FETCH_SUB_TASK_DATAS"]),
    fnsubTaskLoader() {
      this.FETCH_SUB_TASK_DATAS()
        .then(() => {
          this.subtaskDetails = this.getsubTaskDetails.map((value) => ({
            label: value.issue_reason,
            value: value.id,
          }));
        })
        .catch(() => {
          this.subtaskDetails = [];
        });
    },
    emitfnshowServiceSubTaskDetails() {
      this.$emit("emitfnshowServiceSubTaskDetails");
    },
    fnfinalsubmitEditedSpareParts() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        let param = {
          id: this.formData.id,
          issue_reason: this.formData.issue_reason,
        };
        this.EDIT_SPARE_PARTS_TYPES(param)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.emitfnshowServiceSubTaskDetails();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
