<template>
  <div>
    <q-dialog
      class="customModalOverlay"
      v-model="toggleModel"
      persistent
    >
      <q-card style="padding:30px; min-width: 30vw">
        <q-card-section>
          <div class="q-py-sm q-title bottom-border">Add New Configurations</div>
        </q-card-section>
        <q-card-section>
          <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
          <q-card style="width:100%" flat>
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select lead source"
                    placeholder="Lead source"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    no-caps
                    size="md"
                    @click="fnManageLeadSource"
                    color="purple-9"
                    icon="add"
                    class="no-margin"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.vas"
                    :options="dropDown.vasOptions"
                    label="Select VAS"
                    placeholder="Select VAS"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    no-caps
                    size="md"
                    @click="fnManageTxnType"
                    color="purple-9"
                    icon="add"
                    class="no-margin"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    color="grey-9"
                    v-model="formData.masterHost"
                    :options="dropDown.hostOptions"
                    label="Select Host"
                    placeholder="Select Host"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    no-caps
                    size="md"
                    @click="fnManageHost"
                    color="purple-9"
                    icon="add"
                    class="no-margin"
                  />
                </q-item-section>
              </q-item>
                <q-item>
              <q-item-section>
                <q-select
                  color="grey-9"
                  v-model="formData.institution"
                  :options="dropDown.marsinstitutionOptions"
                  label="Select Mars Instance"
                  placeholder="Select Mars Instance"
                  emit-value
                  map-options
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  dense
                  no-caps
                  size="md"
                  @click="fnManageInstance"
                  color="purple-9"
                  icon="add"
                  class="no-margin"
                />
              </q-item-section>
            </q-item>
            </q-card-section>
            <q-card-actions vertical align="right">
             <q-btn label="submit" @click="fnsubmit(formData)" color="purple-9" />
            </q-card-actions>
          </q-card>
        </div>
        </q-card-section>
        <q-card-actions align="right">
           <q-btn flat label="Close" color="primary" @click="emitModalClose" />
        </q-card-actions>
      </q-card>
    </q-dialog>

        <!--START: Show lead source -->
        <showLeadSourceModalComponent
          v-if="showLeadSourceModal"
          :propToggleModal="showLeadSourceModal"
          @emitToggleModal="fnManageLeadSource"
        ></showLeadSourceModalComponent>
        <!--END: Show lead source -->

      <!--START: Show plan details -->
      <showMarsInstanceModalComponent
        v-if="showPlanDetailModal"
        :propToggleModal="showPlanDetailModal"
        @emitToggleModal="fnManageInstance"
      ></showMarsInstanceModalComponent>
      <!--END: Show plan details-->

      <!--START: Show TXN Type details -->
      <showTxnTypeModalComponent
        v-if="showTxnDetailModal"
        :propToggleModal="showTxnDetailModal"
        @emitToggleModal="fnManageTxnType"
      ></showTxnTypeModalComponent>
      <!--END: Show TXN Type details-->

      <!--START: Show TID GROUP details -->
      <showTIDGroupModalComponent
        v-if="showTIDGroupDetailModal"
        :propToggleModal="showTIDGroupDetailModal"
        @emitToggleModal="fnManageTIDGroup"
      ></showTIDGroupModalComponent>
      <!--END: Show TID GROUP details-->

        <!--START: Show host details -->
        <showHostDetailModalComponent
          v-if="showHostDetailModal"
          :propToggleModal="showHostDetailModal"
          @emitToggleModal="fnManageHost"
        ></showHostDetailModalComponent>
        <!--END: Show host details-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showHostDetailModalComponent from "../../components/super_admin/showHostDetailModalComponent.vue";
import showTxnTypeModalComponent from "../../components/super_admin/showTxnTypeModalComponent.vue";
import showMarsInstanceModalComponent from "../../components/super_admin/showMarsInstanceModalComponent.vue";
import showTIDGroupModalComponent from "../../components/super_admin/showTIDGroupModalComponent.vue";
import _ from "lodash";

export default {
  name: "AddMultiTidConfiguration",
  props: ["propShowAddNewConfigurarions"],
  components: {
      showLeadSourceModalComponent,
      showHostDetailModalComponent,
      showMarsInstanceModalComponent,
      showTIDGroupModalComponent,
      showTxnTypeModalComponent
  },
    data() {
      return {
        showLeadSourceModal: false,
        showHostDetailModal: false,
        showPlanDetailModal: false,
        showTxnDetailModal: false,
        showTIDGroupDetailModal: false,
        activeLeadSourceList: [],
        activeDeviceList: [],
        toggleModel: this.propShowAddNewConfigurarions,

        formData: {
          leadSource: "",
          vas: "",
          masterHost:"",
          institution:"",
        },
        dropDown: {
          hostOptions: [],
          leadSourceOptions: [],
          vasOptions: [],
          marsinstitutionOptions: []
        }
      };
    },
    created() {
      this.ajaxLoadDataForDeviceTypeTable();
    },
    computed: {
      ...mapGetters("SA_Devices", ["getAllDevicesInfo","getMarsDeviceModel"]),
      ...mapGetters("leadSource", ["getActiveLeadSource"]),
      ...mapGetters("merchantTypes", ["getActiveMerchantTypes"]),
      ...mapGetters("plan", ["getActivePlan"]),
      ...mapGetters("categoryBasedRental", ["categoryBasedRental"]),
      ...mapGetters("Host", ["getAllHostDetails"]),
      ...mapGetters("MarsInstance", ["getMarsInstanceDetails"]),
      ...mapGetters("vasCreation", ["getAllVasDetails"])
    },
    methods: {
      ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA","FETCH_MARS_DEVICE_MODEL"]),
      ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
      ...mapActions("plan", ["PLAN_ACTIVE_LIST"]),
      ...mapActions("Host", ["GET_HOST_DETAILS"]),
      ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
      ...mapActions("MarsInstance", ["GET_MARS_INSTITUTION_DETAILS"]),
      ...mapActions("lsVasHostInstance", ["CREATE_LS_VAS_HOST_INSTANCE_DETAILS"]),

      ajaxLoadDataForDeviceTypeTable() {
        let self = this;
        self.GET_HOST_DETAILS()
          .then(() => {
            self.dropDown.hostOptions = _.map(self.getAllHostDetails, item => {
              return { value: item, label: item.name };
            });
          });
        self.LEAD_SOURCE_ACTIVE_LIST().then(() => {
          self.dropDown.leadSourceOptions = _.map(self.getActiveLeadSource, item => {
            return { value: item, label: item.sourceName };
          });
        });
        self.GET_ALL_VAS_DETAILS().then(() => {
          self.dropDown.vasOptions = _.map(self.getAllVasDetails, item => {
            return { value: item, label: item.name };
          });
        });
        self.GET_MARS_INSTITUTION_DETAILS().then(() => {
          self.dropDown.marsinstitutionOptions = _.map(self.getMarsInstanceDetails, item => {
            return { value: item, label: item.institutionName };
          });
        });
      },
      fnsubmit(request) {
           this.CREATE_LS_VAS_HOST_INSTANCE_DETAILS(request)
          .then(response => {
            this.$q.notify({
              color: "positive",
              position: "bottom",
              icon: "thumb_up",
              message: response.data.message
            });
            this.resetForm();
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "bottom",
              icon: "thumb_down",
              message: error.data?.message || "Something went wrong"
            });
            this.resetForm();
          });
      },
      resetForm() {
        var self = this;
        Object.keys(this.formData).forEach(function(key, index) {
          self.formData[key] = "";
        });
      },
      fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; },
      fnManageHost() { this.showHostDetailModal = !this.showHostDetailModal; },
      fnManageInstance() { this.showPlanDetailModal = !this.showPlanDetailModal; },
      fnManageTIDGroup() { this.showTIDGroupDetailModal = !this.showTIDGroupDetailModal; },
      fnManageTxnType() { this.showTxnDetailModal = !this.showTxnDetailModal; },
      emitModalClose() {
          this.$emit("emitfnshowAddConfiguration");
      }
    }
};
</script>
<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
