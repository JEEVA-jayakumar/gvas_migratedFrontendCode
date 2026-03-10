<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Add New Hierarchy</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-main>
            <q-list no-border>
              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="text"
                    v-model="formData.hierarchy"
                    @blur="v$.formData.hierarchy.$touch"
                    :error="v$.formData.hierarchy.$error"
                    label="Enter New Hierarchy"
                    placeholder="Add New Hierarchy"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="text"
                    v-model="formData.hierarchyCode"
                    @blur="v$.formData.hierarchyCode.$touch"
                    :error="v$.formData.hierarchyCode.$error"
                    label="Enter New Hierarchy Code"
                    placeholder="Add New Hierarchy Code"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-main>

          <q-card-actions vertical align="end">
            <q-btn label="submit" @click="fnAddHierarchy(formData)" color="purple-9" />
            <!-- <q-btn label="submit" @click="fnsubmit(formData)" color="purple-9" /> -->
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup MDR details -->

      <!-- START >> Table >> MDR details -->
      <!-- END >> Table >> MDR details -->

      <!--START: Show lead source -->
      <!-- <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="fnManageLeadSource"
      ></showLeadSourceModalComponent> -->
      <!--END: Show lead source -->

      <!--START: Show device details -->
      <!-- <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="fnManageDevice"
      ></showDeviceDetailModalComponent> -->
      <!--END: Show device details-->

      <!--START: Show merchant type -->
      <!-- <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="fnManageMerchantType"
      ></showMerchantModalComponent> -->
      <!--END: Show merchant type -->
    </div>
  </q-page>
</template>

<script>
import { required } from "@vuelidate/validators";
/* START >> Modal components Lead source, device, merchant type */
import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";
/* END >> Modal components Lead source, device, merchant type */

import { mapGetters, mapActions } from "vuex";

export default {
  name: "MDRdetails",
  components: {
    // showLeadSourceModalComponent,
    // showDeviceDetailModalComponent,
    // showMerchantModalComponent
  },
  data() {
    return {
      formData: {
        hierarchy: "",
        hierarchyCode: "",
      },
      // showLeadSourceModal: false,
      // showDeviceDetailModal: false,
      // showMerchantModal: false,
    };
  },
  validations: {
    formData: {
      hierarchy: { required },
      hierarchyCode: { required }
    }
  },
  error: {
    formData: {
      hierarchy: { alert: false, issue: "", value: "" },
      hierarchyCode: { alert: false, issue: "", value: "" }
    }
  },
  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo", "getMarsDeviceModel"]),
  },
  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA", "FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("AddHierarchy", ["SAVE_HIERARCHY"]),

    fnsubmit(request) {
      let requestParams = {
        url: {
          leadSource: request.leadSource,
          device: request.device,
          marsDevice: request.marsDevice,
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

      this.MDR_PLAN(requestParams)
        .then(response => {
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: response.data.message,
            icon: "thumb_up"
          });
          Object.keys(this.formData).forEach(key => this.formData[key] = "");
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: "positive",
            position: "bottom",
            icon: "thumb_up",
            message: error.data.message
          });
          Object.keys(this.formData).forEach(key => this.formData[key] = "");
        });
    },

    fnAddHierarchy(request) {
      console.log("Hierarchy request:", JSON.stringify(request));

      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info"
        });
      } else {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Validating..."
        });

        this.SAVE_HIERARCHY(request)
          .then(response => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Created",
              icon: "thumb_up"
            });
            this.$router.push("/super/admin/hierarchy");
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "warning",
              color: "amber-9",
              position: "bottom",
              message: error.body?.message ?? "Please Try Again Later !",
              icon: "thumb_down"
            });
          });
      }
    },
  }
};
</script>

<style>
</style>
