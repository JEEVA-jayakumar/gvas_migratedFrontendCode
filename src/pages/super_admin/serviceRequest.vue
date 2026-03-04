<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="inventoryOptionSelected"
            active-color="dark"
            indicator-color="dark"
            class="shadow-1"
            align="left"
          >
            <q-tab name="serviceRequest" label="Service Request" />
            <q-tab name="issueTypes" label="Issue Types" />
            <q-tab name="serviceStatus" label="Service Status" />
            <q-tab name="cancelled" label="cancelled" />
            <q-tab name="serviceResolutionRemarks" label="Service Resolution Remarks" />
            <q-tab name="issueMapping" label="Issue Mapping" />
            <q-tab name="csSubIssue" label="CS Sub Issue" />
          </q-tabs>

          <q-tab-panels v-model="inventoryOptionSelected" animated class="bg-transparent">
            <q-tab-panel name="serviceRequest" class="no-padding">
              <serviceRequest/>
            </q-tab-panel>
            <q-tab-panel name="issueTypes" class="no-padding">
              <issueTypes/>
            </q-tab-panel>
            <q-tab-panel name="serviceStatus" class="no-padding">
              <serviceStatus/>
            </q-tab-panel>
            <q-tab-panel name="cancelled" class="no-padding">
              <cancelled/>
            </q-tab-panel>
            <q-tab-panel name="serviceResolutionRemarks" class="no-padding">
              <serviceResolutionRemarks/>
            </q-tab-panel>
            <q-tab-panel name="issueMapping" class="no-padding">
              <issueMapping/>
            </q-tab-panel>
            <q-tab-panel name="csSubIssue" class="no-padding">
              <csSubIssue/>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import serviceRequest from "../../components/super_admin/serviceRequest.vue";
import issueTypes from "../../components/super_admin/issueTypes.vue";
import serviceStatus from "../../components/super_admin/serviceStatus.vue";
import cancelled from "../../components/super_admin/cancelled.vue";
import serviceResolutionRemarks from "../../components/super_admin/serviceResolutionRemarks.vue";
import issueMapping from "../../components/super_admin/issueMapping.vue";
import csSubIssue from "../../components/super_admin/csSubIssue.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "ServiceRequestPage",

  components: {
    serviceRequest,
    issueTypes,
    serviceStatus,
    cancelled,
    serviceResolutionRemarks,
    issueMapping,
    csSubIssue
  },

  data() {
    return {
      inventoryOptionSelected: "serviceRequest"
    };
  },

  computed: {
    ...mapGetters("SAT_RegionalInventoryAllocation", [
      "getAllRegionalInventoryDeviceDetailsWithCount",
      "getCurrentPODNumber",
      "getCurrentDeviceId",
      "getAllInventorywithsoDeviceDetailsWithCount"
    ]),
    ...mapGetters("InventoryWithSo", ["getAllInventoryWithSo"])
  },

  created() {
    this.fnAjaxFetchAllDeviceDetailsWithCount();
  },

  methods: {
    ...mapActions("SAT_RegionalInventoryAllocation", [
      "FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT",
      "FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE",
      "FETCH_INVENTORY_WITH_SO_DEVICE_DETAIL_WITH_COUNT"
    ]),
    ...mapActions("InventoryWithSo", ["FETCH_INVENTORY_WITH_SO"]),
    fnAjaxFetchAllDeviceDetailsWithCount() {
      const userInfo = JSON.parse(localStorage.getItem("u_i"));
      if (userInfo && userInfo.region) {
        this.toggleAjaxLoadFilter = true;
        this.FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT(userInfo.region.id)
          .then(() => {
            let requestParams = {
              region: userInfo.region.id,
              action: this.$REGIONAL_INVENTORY_FILTER_ACTION_DEVICE
            };
            this.FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE(requestParams);
            this.toggleAjaxLoadFilter = false;
          })
          .catch(error => {
            this.toggleAjaxLoadFilter = false;
          });
      }
    }
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
