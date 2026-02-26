<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      class="q-mt-lg capitalize"
      @hide="emitToggleRemarks"

    >
      <q-card style="min-width: 40vw; padding: 10px;">
        <q-card-section>
          <div class="row items-center bottom-border q-py-sm">
            <div class="col text-h6">Call Logs</div>
            <div class="col-auto">
              <q-btn
                round
                size="sm"
                @click="emitToggleRemarks"
                outline
                color="dark"
                icon="clear"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <form>
            <div class="column group">
              <div class="row q-col-gutter-md">
                <div class="col-sm-4">
                  <q-input
                    v-model="displayDate"
                    label="From Date"
                    color="purple-9"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="displayDate" mask="YYYY-MM-DD HH:mm">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="displayDate" mask="YYYY-MM-DD HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-sm-8">
                  <q-input
                    filled
                    v-model="callRemarks"
                    label="Enter your text"
                    placeholder="Enter remarks"
                    type="textarea"
                    rows="5"
                    maxlength="500"
                    counter
                    class="textarea-box"
                  />
                </div>
              </div>
              <div
                class="row q-gutter-sm q-mt-md justify-end"
              >
                <q-btn
                  @click="reset"
                  color="purple-9"
                  icon="refresh"
                  label="Reset"
                />
                <q-btn
                  @click="fnsubmit"
                  color="purple-9"
                  icon="save"
                  label="Save"
                />
              </div>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "phonepeCallLogs",
  props: [
    "callInfo",
    "propToggleCallLogsPop",
    "propToggleCallLogs",
    "ActionBarInfo"
  ],

  data() {
    return {
      toggleModal: this.propToggleCallLogsPop,
      displayDate: "",
      callRemarks: "",
      formData: {
        serviceTicketId: this.callInfo.subTicketsList[0].id,
        inputDate: null,
        remarks: ""
      }
    };
  },

  computed: {
    ...mapGetters("phonePeCrm", ["getupdateRemarks"]),
  },

  watch: {
    displayDate(newVal) {
      if (newVal) {
        this.formData.inputDate = new Date(newVal).getTime();
      } else {
        this.formData.inputDate = null;
      }
    },
    callRemarks(newVal) {
      this.formData.remarks = newVal;
    }
  },

  methods: {
    ...mapActions("phonePeCrm", ["UPDATE_CALL_LOG_CRM_REMARKS"]),

    fnsubmit() {
      if (!this.formData.inputDate || !this.formData.remarks) {
          this.$q.notify({
              color: "warning",
              message: "Please fill all fields"
          });
          return;
      }
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Data submitting.."
      });

      this.UPDATE_CALL_LOG_CRM_REMARKS(this.formData)
        .then(() => {
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Remarks updated successfully",
            icon: "thumb_up"
          });
          this.$q.loading.hide();
          this.emitToggleRemarks();
        })
        .catch(error => {
          console.error("Update call log error:", error);
          const message = (error.body && error.body.message) ? error.body.message : "Please Try Again Later !";
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: message,
            icon: "thumb_down"
          });
          this.$q.loading.hide();
        });
    },

    emitToggleRemarks() {
      this.$emit("closeCallLogs");
    },

    reset() {
      this.displayDate = "";
      this.callRemarks = "";
    }
  }
};
</script>

<style scoped>
.textarea-box {
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
