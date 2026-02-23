<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">
        Add MDR details
      </div>

      <!-- LEFT SIDE FORM -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-list>

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
                    size="sm"
                    icon="add"
                    color="purple-9" @click="fnManageLeadSource"
                  />
                </q-item-section>
              </q-item>

              <!-- Device -->
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    color="grey-9" v-model="formData.device"
                    :options="dropDown.deviceOptions"
                    label="Select device"
                    emit-value
                    map-options
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    size="sm"
                    icon="add"
                    color="purple-9" @click="fnManageDevice"
                  />
                </q-item-section>
              </q-item>

              <!-- Mars Device -->
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    color="grey-9" v-model="formData.marsDevice"
                    :options="dropDown.marsDeviceOptions"
                    label="Mars Device Model"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <!-- Merchant Type -->
              <q-item>
                <q-item-section>
                  <q-select
                    dense
                    outlined
                    color="grey-9" v-model="formData.merchantType"
                    :options="dropDown.merchantTypesOptions"
                    label="Select merchant category type"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <!-- MDR Fields -->
              <q-item v-for="field in mdrFields" :key="field.model">
                <q-item-section>
                  <q-input
                    dense
                    outlined
                    type="number"
                    color="grey-9" v-model="formData[field.model]"
                    :label="field.label"
                  />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

          <q-card-actions vertical align="end">
            <q-btn
              label="Submit"
              color="purple-9" @click="fnsubmit"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- RIGHT SIDE EMPTY (TABLE PLACEHOLDER) -->
      <div class="col-md-7 col-sm-8 col-xs-12"></div>

      <!-- MODALS -->
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      />

      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      />

      <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="fnManageMerchantType"
      />

    </div>
  </q-page>
</template>

<script>
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "MDRdetails",

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
        { model: "debitLessthanAmount", label: "Debit <= 2000 %" },
        { model: "debitGreaterthanAmount", label: "Debit > 2000 %" },
        { model: "stdCC", label: "Std CC %" },
        { model: "premiumCC", label: "Premium CC %" },
        { model: "corpCC", label: "Corp Pre CC %" },
        { model: "intlCC", label: "Intl Pre CC %" },
        { model: "superPremiumlCC", label: "Super Pre CC %" }
      ]
    };
  },

  created() {
    this.loadInitialData();
  },

  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
    ...mapGetters("merchantCategory", ["getActiveMerchantCategory"])
  },

  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("merchantCategory", ["MERCHANT_CATEGORY_ACTIVE_LIST"]),
    ...mapActions("MdrPlan", ["MDR_PLAN"]),

    async loadInitialData() {
      try {
        this.dropDown.deviceOptions = [];
        this.dropDown.leadSourceOptions = [];
        this.dropDown.marsDeviceOptions = [];
        this.dropDown.merchantTypesOptions = [];

        await this.FETCH_DEVICES_DATA();
        this.dropDown.deviceOptions = this.getAllDevicesInfo.map(item => ({
          label: item.deviceName,
          value: item.id
        }));

        await this.LEAD_SOURCE_ACTIVE_LIST();
        this.dropDown.leadSourceOptions = this.getActiveLeadSource.map(item => ({
          label: item.sourceName,
          value: item.id
        }));

        await this.MERCHANT_CATEGORY_ACTIVE_LIST();
        this.dropDown.merchantTypesOptions = this.getActiveMerchantCategory.map(item => ({
          label: item.merchantCategoryName,
          value: item.id
        }));

        await this.FETCH_MARS_DEVICE_MODEL();
        this.getMarsDeviceModel.forEach(group => {
          group.forEach(device => {
            this.dropDown.marsDeviceOptions.push({
              label: device.name,
              value: device.code
            });
          });
        });

      } catch (error) {
        console.error(error);
      }
    },

    async fnsubmit() {
      const requestParams = {
        url: {
          leadSource: this.formData.leadSource,
          device: this.formData.device,
          merchantType: this.formData.merchantType
        },
        params: {
          debitLessthanAmount: this.formData.debitLessthanAmount,
          debitGreaterthanAmount: this.formData.debitGreaterthanAmount,
          stdCC: this.formData.stdCC,
          premiumCC: this.formData.premiumCC,
          corpCC: this.formData.corpCC,
          intlCC: this.formData.intlCC,
          superPremiumlCC: this.formData.superPremiumlCC
        }
      };

      try {
        const response = await this.MDR_PLAN(requestParams);

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

        this.resetForm();
      }
    },

    resetForm() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = null;
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

<style>
</style>
