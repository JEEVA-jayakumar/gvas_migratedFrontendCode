<template>
  <q-dialog persistent v-model="toggleModel" @hide="emitfnshowUpdateDemapping(false)">
    <q-card style="min-width: 400px">
      <q-card-section class="q-title text-weight-regular bottom-border q-pa-md">
        Serial Number Remarks
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-input type="textarea" placeholder="Reason Type.." v-model="v$.formData.reason.$model"
          :error="v$.formData.reason.$error" filled autogrow color="grey-9" />
      </q-card-section>
      <q-card-actions align="end" class="q-pa-md">
        <q-btn flat label="Cancel" color="grey-8" @click="emitfnshowUpdateDemapping(false)" />
        <q-btn label="Submit" color="purple-9" @click="fnReasonRemarks" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "demappingRemarks",
  props: ["propShowUpdateDemapping", "propRowDetails"],
  setup() { return { v$: useVuelidate() }; },
  data() {
    return {
      toggleModel: this.propShowUpdateDemapping,
      formData: { reason: "" }
    };
  },
  validations() { return { formData: { reason: { required } } }; },
  methods: {
    ...mapActions("deMapping", ["REMARKS_REASON_DETAILS"]),
    emitfnshowUpdateDemapping(val) { this.$emit("emitfnshowUpdateDemapping", val); },
    async fnReasonRemarks() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        this.$q.notify({ color: "negative", message: "Please enter remarks" });
        return;
      }
      this.$q.loading.show({ message: "Please Wait" });
      const param = { remarks: this.formData.reason, deviceId: this.propRowDetails };
      this.REMARKS_REASON_DETAILS(param).then(() => {
        this.$emit("emitfnshowUpdateDemapping");
        this.$q.notify({ color: "positive", message: "De-Mapped Successfully", icon: "thumb_up" });
        this.$q.loading.hide();
      }).catch(error => {
        this.$q.notify({ color: "negative", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        this.$q.loading.hide();
      });
    }
  }
};
</script>