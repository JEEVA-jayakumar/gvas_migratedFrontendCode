<template>
  <q-dialog v-model="toggleModel" persistent class="customModalOverlay">
    <q-card style="min-width: 40vw; padding: 20px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-purple-9">Add New Configurations</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="$emit('emitToggleModal')" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="column q-gutter-y-md">
          <!-- Lead Source -->
          <div class="row items-center q-col-gutter-sm">
            <div class="col">
              <q-select
                outlined
                dense
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                label="Select lead source"
                color="purple-9"
              />
            </div>
            <div class="col-auto">
              <q-btn
                round
                dense
                unelevated
                color="purple-9"
                icon="add"
                @click="fnManageLeadSource"
              />
            </div>
          </div>

          <!-- VAS -->
          <div class="row items-center q-col-gutter-sm">
            <div class="col">
              <q-select
                outlined
                dense
                v-model="formData.vas"
                :options="dropDown.vasOptions"
                label="Select VAS"
                color="purple-9"
              />
            </div>
            <div class="col-auto">
              <q-btn
                round
                dense
                unelevated
                color="purple-9"
                icon="add"
                @click="fnManageTxnType"
              />
            </div>
          </div>

          <!-- Host -->
          <div class="row items-center q-col-gutter-sm">
            <div class="col">
              <q-select
                outlined
                dense
                v-model="formData.masterHost"
                :options="dropDown.hostOptions"
                label="Select Host"
                color="purple-9"
              />
            </div>
            <div class="col-auto">
              <q-btn
                round
                dense
                unelevated
                color="purple-9"
                icon="add"
                @click="fnManageHost"
              />
            </div>
          </div>

          <!-- Mars Instance -->
          <div class="row items-center q-col-gutter-sm">
            <div class="col">
              <q-select
                outlined
                dense
                v-model="formData.institution"
                :options="dropDown.marsinstitutionOptions"
                label="Select Mars Instance"
                color="purple-9"
              />
            </div>
            <div class="col-auto">
              <q-btn
                round
                dense
                unelevated
                color="purple-9"
                icon="add"
                @click="fnManageInstance"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn unelevated label="Submit" color="purple-9" @click="fnsubmit" />
      </q-card-actions>
    </q-card>

    <!-- Child Modals -->
    <showLeadSourceModalComponent
      v-if="showLeadSourceModal"
      :propToggleModal="showLeadSourceModal"
      @emitToggleModal="fnManageLeadSource"
    />
    <showMarsInstanceModalComponent
      v-if="showPlanDetailModal"
      :propToggleModal="showPlanDetailModal"
      @emitToggleModal="fnManageInstance"
    />
    <showTxnTypeModalComponent
      v-if="showTxnDetailModal"
      :propToggleModal="showTxnDetailModal"
      @emitToggleModal="fnManageTxnType"
    />
    <showTIDGroupModalComponent
      v-if="showTIDGroupDetailModal"
      :propToggleModal="showTIDGroupDetailModal"
      @emitToggleModal="fnManageTIDGroup"
    />
    <showHostDetailModalComponent
      v-if="showHostDetailModal"
      :propToggleModal="showHostDetailModal"
      @emitToggleModal="fnManageHost"
    />
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showHostDetailModalComponent from "../../components/super_admin/showHostDetailModalComponent.vue";
import showTxnTypeModalComponent from "../../components/super_admin/showTxnTypeModalComponent.vue";
import showMarsInstanceModalComponent from "../../components/super_admin/showMarsInstanceModalComponent.vue";
import showTIDGroupModalComponent from "../../components/super_admin/showTIDGroupModalComponent.vue";

export default {
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
      toggleModel: this.propShowAddNewConfigurarions,
      showLeadSourceModal: false,
      showHostDetailModal: false,
      showPlanDetailModal: false,
      showTxnDetailModal: false,
      showTIDGroupDetailModal: false,
      formData: {
        leadSource: null,
        vas: null,
        masterHost: null,
        institution: null
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
    this.ajaxLoadData();
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("Host", ["getAllHostDetails"]),
    ...mapGetters("MarsInstance", ["getMarsInstanceDetails"]),
    ...mapGetters("vasCreation", ["getAllVasDetails"])
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("Host", ["GET_HOST_DETAILS"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("MarsInstance", ["GET_MARS_INSTITUTION_DETAILS"]),
    ...mapActions("lsVasHostInstance", ["CREATE_LS_VAS_HOST_INSTANCE_DETAILS"]),

    async ajaxLoadData() {
      this.$q.loading.show();
      try {
        await Promise.all([
          this.GET_HOST_DETAILS(),
          this.LEAD_SOURCE_ACTIVE_LIST(),
          this.GET_ALL_VAS_DETAILS(),
          this.GET_MARS_INSTITUTION_DETAILS()
        ]);

        this.dropDown.hostOptions = this.getAllHostDetails.map(item => ({
          label: item.name, value: item
        }));
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          label: item.sourceName, value: item
        }));
        this.dropDown.vasOptions = this.getAllVasDetails.map(item => ({
          label: item.name, value: item
        }));
        this.dropDown.marsinstitutionOptions = this.getMarsInstanceDetails.map(item => ({
          label: item.institutionName, value: item
        }));
      } catch (e) {
        console.error(e);
      } finally {
        this.$q.loading.hide();
      }
    },

    fnsubmit() {
      if (!this.formData.leadSource || !this.formData.vas || !this.formData.masterHost || !this.formData.institution) {
        this.$q.notify({ color: "warning", message: "Please fill all fields" });
        return;
      }
      this.$q.loading.show();
      const payload = {
        leadSource: this.formData.leadSource.value,
        vas: this.formData.vas.value,
        masterHost: this.formData.masterHost.value,
        institution: this.formData.institution.value
      };
      this.CREATE_LS_VAS_HOST_INSTANCE_DETAILS(payload)
        .then(response => {
          this.$q.notify({ color: "positive", message: response.data.message });
          this.formData = { leadSource: null, vas: null, masterHost: null, institution: null };
        })
        .catch(error => {
          this.$q.notify({ color: "negative", message: error.data.message });
        })
        .finally(() => this.$q.loading.hide());
    },

    fnManageLeadSource() { this.showLeadSourceModal = !this.showLeadSourceModal; },
    fnManageHost() { this.showHostDetailModal = !this.showHostDetailModal; },
    fnManageInstance() { this.showPlanDetailModal = !this.showPlanDetailModal; },
    fnManageTIDGroup() { this.showTIDGroupDetailModal = !this.showTIDGroupDetailModal; },
    fnManageTxnType() { this.showTxnDetailModal = !this.showTxnDetailModal; }
  }
};
</script>
