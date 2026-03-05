<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowCancelStatus"
      @escape-key="emitfnShowCancelStatus"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Service</div>
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
                label="Enter Status"
                placeholder="Enter Status"
                @keyup.enter="fnfinalsubmitAddCancelStatus()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowCancelStatus()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddCancelStatus()"
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
import { mapActions } from "vuex";

export default {
  props: ["propShowCancelStatus"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowCancelStatus,
      formData: {
        name: "",
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
    ...mapActions("serviceRequestCancelled", ["POST_CANCEL_STATUS_TYPES"]),
    emitfnShowCancelStatus() {
      this.$emit("emitfnShowCancelStatus");
    },
    fnfinalsubmitAddCancelStatus() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        this.POST_CANCEL_STATUS_TYPES(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnShowCancelStatus", "refresh");
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
