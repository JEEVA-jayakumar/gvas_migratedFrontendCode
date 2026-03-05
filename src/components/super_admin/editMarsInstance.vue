<template>
  <div>
    <q-dialog
      v-model="propToggleModal"
      @hide="toggleModal"
      @escape-key="toggleModal"
      class="customModalOverlay"
      persistent
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Edit Mars Instance</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.institutionName"
                @blur="v$.formData.institutionName.$touch"
                :error="v$.formData.institutionName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Institution Name"
                placeholder="Institution Name"
                @keyup.enter="submitMarsInstanceData()"
              />
            </div>
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.institutionRRCode"
                @blur="v$.formData.institutionRRCode.$touch"
                :error="v$.formData.institutionRRCode.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Institution RR Code"
                placeholder="Institution RR Code"
                @keyup.enter="submitMarsInstanceData()"
              />
            </div>
            <div class="col-md-12 full-width">
              <q-input
                disable
                v-model="formData.institutionCode"
                @blur="v$.formData.institutionCode.$touch"
                :error="v$.formData.institutionCode.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Institution Code"
                placeholder="Institution Code"
                @keyup.enter="submitMarsInstanceData()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="toggleModal"
              >Cancel</q-btn
            >
            <q-btn
              color="purple-9"
              label="Save"
              @click="submitMarsInstanceData()"
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
  props: ["propShowEditMarsInstance", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      propToggleModal: this.propShowEditMarsInstance,
      formData: {
        institutionName: this.propRowDetails.institutionName,
        institutionRRCode: this.propRowDetails.institutionRRCode,
        institutionCode: this.propRowDetails.institutionCode,
        id: this.propRowDetails.id,
        institutionActive: 1,
      },
    };
  },
  validations() {
    return {
      formData: {
        institutionName: { required },
        institutionCode: { required },
        institutionRRCode: { required },
      },
    };
  },
  methods: {
    ...mapActions("MarsInstance", ["UPDATE_INSTANCE"]),
    toggleModal() {
      this.$emit("emitfnshowMarsInstance");
    },
    submitMarsInstanceData() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
          this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({
          message: "Please Wait",
          spinnerColor: "purple-9",
        });
        this.UPDATE_INSTANCE(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnshowMarsInstance", "refresh");
            this.$q.notify({
              color: "positive",
              message: "Instance successfully updated!",
              icon: "thumb_up",
            });
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
