<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewSubTaskType"
      @escape-key="emitfnShowAddNewSubTaskType"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Sub Task Types</div>
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
                label="Enter Sub Task Name"
                placeholder="Enter Sub Task Name"
                @keyup.enter="fnfinalsubmitAddSubTaskType()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewSubTaskType()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddSubTaskType()"
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
  props: ["propShowAddSubTaskType"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddSubTaskType,
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
    ...mapActions("serviceRequest", ["POST_SUB_TASK_TYPES"]),
    emitfnShowAddNewSubTaskType() {
      this.$emit("emitfnShowAddNewSubTaskType");
    },
    fnfinalsubmitAddSubTaskType() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        this.POST_SUB_TASK_TYPES(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnShowAddNewSubTaskType", "refresh");
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
