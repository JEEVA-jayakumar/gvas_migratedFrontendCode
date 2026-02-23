<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
    >
      <q-card style="padding:30px; min-width:30vw;">
        <div class="column">

          <!-- Title -->
          <div class="q-py-sm text-h6 bottom-border">
            Add New Configurations
          </div>

          <div class="q-py-sm">
            <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
              <q-card flat>

                <q-separator />

                <q-card-section>

                  <!-- Lead Source -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        dense
                        outlined
                        color="grey-9" v-model="formData.leadSource"
                        :options="dropDown.leadSourceOptions"
                        label="Select lead source"
                        emit-value
                        map-options
                      />
                    </q-item-section>

                    <q-item-section side>
                      <q-btn
                        round
                        dense
                        size="md"
                        icon="add"
                        color="purple-9" @click="fnManageLeadSource"
                      />
                    </q-item-section>
                  </q-item>

                  <!-- VAS -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        dense
                        outlined
                        color="grey-9" v-model="formData.vas"
                        :options="dropDown.vasOptions"
                        label="Select VAS"
                        emit-value
                        map-options
                      />
                    </q-item-section>

                    <q-item-section side>
                      <q-btn
                        round
                        dense
                        size="md"
                        icon="add"
                        color="purple-9" @click="fnManageTxnType"
                      />
                    </q-item-section>
                  </q-item>

                  <!-- Host -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        dense
                        outlined
                        color="grey-9" v-model="formData.masterHost"
                        :options="dropDown.hostOptions"
                        label="Select Host"
                        emit-value
                        map-options
                      />
                    </q-item-section>

                    <q-item-section side>
                      <q-btn
                        round
                        dense
                        size="md"
                        icon="add"
                        color="purple-9" @click="fnManageHost"
                      />
                    </q-item-section>
                  </q-item>

                  <!-- Mars Instance -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        dense
                        outlined
                        color="grey-9" v-model="formData.institution"
                        :options="dropDown.marsinstitutionOptions"
                        label="Select Mars Instance"
                        emit-value
                        map-options
                      />
                    </q-item-section>

                    <q-item-section side>
                      <q-btn
                        round
                        dense
                        size="md"
                        icon="add"
                        color="purple-9" @click="fnManageInstance"
                      />
                    </q-item-section>
                  </q-item>

                </q-card-section>

                <q-card-actions vertical align="end">
                  <q-btn
                    label="Submit"
                    color="purple-9" @click="fnsubmit"
                  />
                </q-card-actions>

              </q-card>
            </div>
          </div>

        </div>
      </q-card>
    </q-dialog>

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

  </div>
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
    this.loadInitialData();
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
    ...mapActions("MarsInstance", ["GET_MARS_INSTITUTION_DETAILS"]),
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ...mapActions("lsVasHostInstance", ["CREATE_LS_VAS_HOST_INSTANCE_DETAILS"]),

    async loadInitialData() {
      try {
        this.dropDown.hostOptions = [];
        this.dropDown.leadSourceOptions = [];
        this.dropDown.vasOptions = [];
        this.dropDown.marsinstitutionOptions = [];

        await this.GET_HOST_DETAILS();
        this.dropDown.hostOptions = this.getAllHostDetails.map(item => ({
          label: item.name,
          value: item
        }));

        await this.LEAD_SOURCE_ACTIVE_LIST();
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          label: item.sourceName,
          value: item
        }));

        await this.GET_ALL_VAS_DETAILS();
        this.dropDown.vasOptions = this.getAllVasDetails.map(item => ({
          label: item.name,
          value: item
        }));

        await this.GET_MARS_INSTITUTION_DETAILS();
        this.dropDown.marsinstitutionOptions =
          this.getMarsInstanceDetails.map(item => ({
            label: item.institutionName,
            value: item
          }));

      } catch (error) {
        console.error(error);
      }
    },

    async fnsubmit() {
      this.$q.loading.show({
        spinnerColor: "purple-9",
        message: "Processing..."
      });

      try {
        const response =
          await this.CREATE_LS_VAS_HOST_INSTANCE_DETAILS(this.formData);

        this.$q.notify({
          color: "positive",
          position: "bottom",
          message: response.data.message,
          icon: "thumb_up"
        });

        this.resetForm();

      } catch (error) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: error?.data?.message || "Something went wrong",
          icon: "warning"
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    resetForm() {
      this.formData = {
        leadSource: null,
        vas: null,
        masterHost: null,
        institution: null
      };
    },

    fnManageLeadSource() {
      this.showLeadSourceModal = !this.showLeadSourceModal;
    },

    fnManageHost() {
      this.showHostDetailModal = !this.showHostDetailModal;
    },

    fnManageInstance() {
      this.showPlanDetailModal = !this.showPlanDetailModal;
    },

    fnManageTIDGroup() {
      this.showTIDGroupDetailModal = !this.showTIDGroupDetailModal;
    },

    fnManageTxnType() {
      this.showTxnDetailModal = !this.showTxnDetailModal;
    }
  }
};
</script>

<style scoped>
label {
  padding: 10px;
  display: table;
}
input[type="file"] {
  display: none;
}
</style>
