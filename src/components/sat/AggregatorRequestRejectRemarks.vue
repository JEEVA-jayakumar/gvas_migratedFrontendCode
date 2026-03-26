<template>
  <div>
    <q-dialog
      :model-value="showRejectModal"
      @hide="emitToggleLost"
      @escape-key="emitToggleLost"
      persistent
    >
      <q-card style="min-width: 350px" class="q-pa-md">
        <q-card-section>
          <div align="center" class="text-weight-light text-grey-8 q-mb-md">
            <div class="text-h5"><b>Reason</b></div>
          </div>
          <div align="left" class="text-weight-light text-grey-8 q-mb-md">
            Add your Reason and then submit...
          </div>

          <div class="gutter-xs">
            <q-input
              type="textarea"
              placeholder="Type.."
              @blur="v$.remarks.$touch"
              :error="v$.remarks.$error"
              class="q-my-md"
              color="grey-9"
              align="left"
              v-model="remarks"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey-9"
            @click="emitToggleLost"
          />
          <q-btn
            label="Submit"
            color="positive"
            @click="rejectSelfAssign(formData.data)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["showRejectModal", "propsRejectDeviceComponent"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      remarks: "",
      formData: {
        data: this.propsRejectDeviceComponent
      }
    };
  },
  validations: {
    remarks: {
      required
    }
  },
  methods: {
    ...mapActions("VerifyDevice", ["REJECT_SELF_ASSIGNMENT"]),
    emitToggleLost() {
      this.$emit("closeLostModel");
    },
    rejectSelfAssign(reqData) {
      this.v$.remarks.$touch();
      if (this.v$.remarks.$error) {
        this.$q.notify({
          color: "negative",
          message: "Please enter reason."
        });
        return;
      }

      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to Reject?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing .."
        });

        let param = {
          selfAssignmentId: reqData.id,
          remarks: this.remarks
        };

        this.REJECT_SELF_ASSIGNMENT(param)
          .then(() => {
            this.$emit("closeLostModel");
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Rejected!",
              icon: "thumb_up"
            });
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      });
    }
  }
};
</script>
