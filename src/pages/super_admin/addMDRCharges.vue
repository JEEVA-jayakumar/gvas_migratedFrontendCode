<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section class="bg-purple-9 text-white">
            <div class="text-h6">Existing MDR Details</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="fnsubmit(formData)" class="q-gutter-md">
              <!-- Selection Row -->
              <div class="row items-center no-wrap">
                <q-select
                  outlined
                  dense
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select lead source"
                  class="full-width"
                  emit-value
                  map-options
                />
                <q-btn round @click="fnManageLeadSource" size="sm" icon="add" color="purple-9" class="q-ml-sm" />
              </div>

              <div class="row items-center no-wrap">
                <q-select
                  outlined
                  dense
                  v-model="formData.device"
                  :options="dropDown.deviceOptions"
                  label="Select device"
                  class="full-width"
                  emit-value
                  map-options
                />
                <q-btn round @click="fnManageDevice" size="sm" icon="add" color="purple-9" class="q-ml-sm" />
              </div>

              <q-select
                outlined
                dense
                v-model="formData.marsDevice"
                :options="dropDown.marsDeviceOptions"
                label="Mars Device Model"
                emit-value
                map-options
              />

              <q-select
                outlined
                dense
                v-model="formData.merchantType"
                :options="dropDown.merchantTypesOptions"
                label="Select merchant category type"
                emit-value
                map-options
                @update:model-value="fnCategoryBasedMdr(formData)"
              />

              <!-- MDR Fields Grid -->
              <div class="text-subtitle2 q-mt-md q-mb-sm text-purple-9">Rates (%)</div>
              <div class="row q-col-gutter-sm">
                <div v-for="field in mdrFields" :key="field.model" class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    type="number"
                    step="0.01"
                    v-model="formData[field.model]"
                    :label="field.label"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn unelevated label="Submit" color="purple-9" type="submit" class="q-px-lg" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modals (matched with legacy behavior) -->
    <showLeadSourceModalComponent
      v-if="showLeadSourceModal"
      :propToggleModal="showLeadSourceModal"
      @emitToggleModal="showLeadSourceModal = false"
    />
    <showDeviceDetailModalComponent
      v-if="showDeviceDetailModal"
      :propToggleModal="showDeviceDetailModal"
      @emitToggleModal="showDeviceDetailModal = false"
    />
    <showMerchantModalComponent
      v-if="showMerchantModal"
      :propToggleModal="showMerchantModal"
      @emitToggleModal="showMerchantModal = false"
    />
  </q-page>
</template>

<script>
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AddMDRCharges",
  components: {
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showMerchantModalComponent
  },
  data() {
    return {
      showLeadSourceModal: false,
      showDeviceDetailModal: false,
      showMerchantModal: false,
      formData: {
        leadSource: null,
        device: null,
        marsDevice: null,
        merchantType: null,
        debitLessthanAmount: null,
        debitGreaterthanAmount: null,
        stdCC: null,
        premiumCC: null,
        corpCC: null,
        intlCC: null,
        superPremiumlCC: null
      },
      dropDown: {
        deviceOptions: [],
        leadSourceOptions: [],
        marsDeviceOptions: [],
        merchantTypesOptions: []
      },
      mdrFields: [
        { model: "debitLessthanAmount", label: "Debit <= 2000" },
        { model: "debitGreaterthanAmount", label: "Debit > 2000" },
        { model: "stdCC", label: "Std CC" },
        { model: "premiumCC", label: "Premium CC" },
        { model: "corpCC", label: "Corp Pre CC" },
        { model: "intlCC", label: "Intl Pre CC" },
        { model: "superPremiumlCC", label: "Super Pre CC" }
      ]
    };
  },

  created() {
    this.loadInitialData();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("merchantCategory", ["getActiveMerchantCategory"]),
    ...mapGetters("CategoryBasedMdr", ["categoryBasedMdr"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("merchantCategory", ["MERCHANT_CATEGORY_ACTIVE_LIST"]),
    ...mapActions("MdrPlan", ["MDR_PLAN"]),
    ...mapActions("CategoryBasedMdr", ["CATEGORY_BASED_MDR_PLAN"]),

    async loadInitialData() {
      this.$q.loading.show({ message: "Loading data..." });
      try {
        await Promise.all([
          this.FETCH_DEVICES_DATA(),
          this.LEAD_SOURCE_ACTIVE_LIST(),
          this.MERCHANT_CATEGORY_ACTIVE_LIST(),
          this.FETCH_MARS_DEVICE_MODEL()
        ]);

        this.dropDown.deviceOptions = this.getAllDevicesInfo.map(i => ({ label: i.deviceName, value: i.id }));
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(i => ({ label: i.sourceName, value: i.id }));
        this.dropDown.merchantTypesOptions = this.getActiveMerchantCategory.map(i => ({ label: i.merchantCategoryName, value: i.id }));

        this.dropDown.marsDeviceOptions = [];
        this.getMarsDeviceModel.forEach(group => {
          group.forEach(device => {
            this.dropDown.marsDeviceOptions.push({ label: device.name, value: device.code });
          });
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    async fnsubmit(request) {
      const requestParams = {
        url: {
          leadSource: request.leadSource,
          device: request.device,
          merchantType: request.merchantType
        },
        params: {
          debitLessthanAmount: request.debitLessthanAmount,
          debitGreaterthanAmount: request.debitGreaterthanAmount,
          stdCC: request.stdCC,
          premiumCC: request.premiumCC,
          corpCC: request.corpCC,
          intlCC: request.intlCC,
          superPremiumlCC: request.superPremiumlCC
        }
      };

      this.$q.loading.show({ message: "Submitting..." });
      try {
        const response = await this.MDR_PLAN(requestParams);
        this.$q.notify({
          color: "positive",
          position: "bottom",
          message: response.data?.message || "Successfully created!",
          icon: "thumb_up"
        });
        this.resetForm();
      } catch (error) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          icon: "warning",
          message: error.data?.message || "Please try again later!"
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    resetForm() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = "";
      });
    },

    fnCategoryBasedMdr(request) {
      let formData = {
        leadSource: request.leadSource,
        device: request.device,
        merchantType: request.merchantType
      };
      this.CATEGORY_BASED_MDR_PLAN(formData).then(response => {
        if (response.status == 200) {
          this.formData.debitLessthanAmount = this.categoryBasedMdr.debitLessthanAmount;
          this.formData.debitGreaterthanAmount = this.categoryBasedMdr.debitGreaterthanAmount;
          this.formData.stdCC = this.categoryBasedMdr.stdCC;
          this.formData.premiumCC = this.categoryBasedMdr.premiumCC;
          this.formData.corpCC = this.categoryBasedMdr.corpCC;
          this.formData.intlCC = this.categoryBasedMdr.intlCC;
          this.formData.superPremiumlCC = this.categoryBasedMdr.superPremiumlCC;
        } else {
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: "Invalid MDR details",
            icon: "clear"
          });
          this.formData.debitLessthanAmount = "";
          this.formData.debitGreaterthanAmount = "";
          this.formData.stdCC = "";
          this.formData.premiumCC = "";
          this.formData.corpCC = "";
          this.formData.intlCC = "";
          this.formData.superPremiumlCC = "";
        }
      });
    },

    fnManageLeadSource() {
      this.showLeadSourceModal = !this.showLeadSourceModal;
    },
    fnManageDevice() {
      this.showDeviceDetailModal = !this.showDeviceDetailModal;
    },
    fnManageMerchantType() {
      this.showMerchantModal = !this.showMerchantModal;
    }
  }
};
</script>
