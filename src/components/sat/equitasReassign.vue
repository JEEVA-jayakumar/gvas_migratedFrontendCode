<template>
  <q-dialog persistent v-model="toggleModel">
    <q-card style="min-width: 400px">
      <q-card-section class="q-title q-pa-md text-weight-regular bottom-border">
        RE-Assign
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-select filter clearable color="grey-9" v-model="formData.so" :options="assignToOptions"
              label="Select SO*" emit-value map-options />
          </div>
          <div class="col-12">
            <q-select color="grey-9" v-model="formData.Reassign" :options="ReasonListOptions"
              label="Select Reason List*" emit-value map-options />
          </div>
          <div v-if="formData.Reassign == 'Other reason'" class="col-12">
            <q-input type="textarea" placeholder="Reason Type.." color="grey-9" v-model="formData.reason" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="end" class="q-pa-md">
        <q-btn flat class="text-grey-8" label="Cancel" @click="emitfnshowUpdateOpenedExternal" />
        <q-btn label="Submit" color="purple-9" @click="fnEDITREOPEN(formData)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "equitasReassign",
  props: ["propShowReassign", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowReassign,
      assignToOptions: [],
      ReasonListOptions: [],
      formData: { so: "", Reassign: "", reason: "" }
    };
  },
  created() {
    this.implementationExecutiveList();
    this.ReassignReasonList();
  },
  computed: {
    ...mapGetters("ImplementationExecutive", ["getImplementationExecutiveList"]),
    ...mapGetters("reassignReasonList", ["getreassignReasonList"])
  },
  methods: {
    ...mapActions("ImplementationExecutive", ["IMPLEMENTATION_EXECUTIVE_LIST"]),
    ...mapActions("reassignReasonList", ["REASSIGN_REASON_LIST"]),
    ...mapActions("DeviceReplacement", ["EQUITAS_SOUNDBOX_REASSIGNED_REASON_TYPE_DETAILS"]),
    emitfnshowUpdateOpenedExternal() {
      this.$emit("emitfnshowUpdateOpenedExternal");
    },
    fnEDITREOPEN(request) {
      this.$q.dialog({ title: "Confirm", message: "Are you sure want to reAssign the lead?", ok: "Continue", cancel: "Cancel" }).onOk(() => {
        this.$q.loading.show({ message: "Processing .." });
        let param = {
          userId: request.so,
          marsDeviceIds: {
            marsDeviceIds: [this.propRowDetails.id],
            remarks: this.formData.reason,
            reason: this.formData.Reassign
          }
        };
        this.EQUITAS_SOUNDBOX_REASSIGNED_REASON_TYPE_DETAILS(param).then(() => {
          this.$emit("emitfnshowUpdateOpenedExternal");
          this.$q.loading.hide();
          this.$q.notify({ color: "positive", message: "Updated Successfully", icon: "thumb_up" });
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({ color: "negative", message: error.body?.message || "Please Try Again Later !", icon: "thumb_down" });
        });
      });
    },
    implementationExecutiveList() {
      this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
        this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: `${v.name} | ${v.employeeID} | ${v.email}`, value: v.id }));
      });
    },
    ReassignReasonList() {
      this.REASSIGN_REASON_LIST().then(() => {
        this.ReasonListOptions = this.getreassignReasonList.map(v => ({ label: v.name, value: v.name }));
      });
    }
  }
};
</script>