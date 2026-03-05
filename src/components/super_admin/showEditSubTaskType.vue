<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowEditSubTaskType"
      @escape-key="emitfnshowEditSubTaskType"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">
                Modify Service Request Info
              </div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.name"
                @blur="v$.formData.name.$touch"
                :error="v$.formData.name.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Service Sub Task Name"
                placeholder="Service Sub Task Name"
                @keyup.enter="fnfinalsubmitEditedSpareParts()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnshowEditSubTaskType()"
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

    <showServiceSubTaskDetails
      v-if="propShowServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="propShowServiceSubTaskDetails"
      :propRowDetails="propRowDetails"
      @emitfnshowServiceSubTaskDetails="fnShowSubTaskDetails"
    />
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";
import showServiceSubTaskDetails from "./showServiceSubTaskDetails.vue";

export default {
  components: {
    showServiceSubTaskDetails,
  },
  props: ["propShowEditSubTaskType", "propRowDetails1"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowEditSubTaskType,
      propShowServiceSubTaskDetails: false,
      propRowDetails: null,
      formData: {
        name: this.propRowDetails1.name,
      },
    };
  },
  validations() {
    return {
      formData: {
        name: { required },
      },
    };
  },
  methods: {
    ...mapActions("serviceRequest", ["EDIT_SUB_TASK_TYPES"]),
    emitfnshowEditSubTaskType() {
      this.$emit("emitfnshowEditSubTaskType");
    },
    fnShowSubTaskDetails(rowDetails) {
      this.propShowServiceSubTaskDetails = !this.propShowServiceSubTaskDetails;
      this.propRowDetails = rowDetails;
    },
    fnfinalsubmitEditedSpareParts() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        let param = {
          id: this.propRowDetails1.id,
          request: this.formData,
        };
        this.EDIT_SUB_TASK_TYPES(param)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.emitfnshowEditSubTaskType();
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
