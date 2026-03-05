<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewCsSubIssue"
      @escape-key="emitfnShowAddNewCsSubIssue"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add CS Sub Issue</div>
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
                label="Enter CS Sub Issue"
                placeholder="Enter CS Sub Issue"
                @keyup.enter="fnfinalsubmitAddCsSubIssue()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewCsSubIssue()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddCsSubIssue()"
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
  props: ["propShowAddCsSubIssue"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddCsSubIssue,
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
    ...mapActions("serviceRequest", ["POST_CS_SUB_ISSUE"]),
    emitfnShowAddNewCsSubIssue() {
      this.$emit("emitfnShowAddNewCsSubIssue");
    },
    fnfinalsubmitAddCsSubIssue() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        this.POST_CS_SUB_ISSUE(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnShowAddNewCsSubIssue", "refresh");
            this.$q.notify({
              color: "positive",
              message: "Sub Task Added Successfully",
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
