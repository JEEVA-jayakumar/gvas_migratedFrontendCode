<template>
  <q-page padding>
    <q-tabs
      v-model="inventoryOptionSelected"
      class="bg-white text-grey-7 shadow-1"
      active-color="purple-9"
      indicator-color="purple-9"
      align="left"
    >
      <q-tab name="serviceRequest" label="Service Request" />
      <q-tab name="issueTypes" label="Issue Types" />
      <q-tab name="serviceStatus" label="Service Status" />
      <q-tab name="cancelled" label="Cancelled" />
      <q-tab name="serviceResolutionRemarks" label="Service Resolution Remarks" />
      <q-tab name="issueMapping" label="Issue Mapping" />
      <q-tab name="csSubIssue" label="CS Sub Issue" />
    </q-tabs>

    <q-tab-panels v-model="inventoryOptionSelected" animated keep-alive class="bg-transparent">
      <q-tab-panel name="serviceRequest" class="no-padding q-mt-md">
        <serviceRequest />
      </q-tab-panel>
      <q-tab-panel name="issueTypes" class="no-padding q-mt-md">
        <issueTypes />
      </q-tab-panel>
      <q-tab-panel name="serviceStatus" class="no-padding q-mt-md">
        <serviceStatus />
      </q-tab-panel>
      <q-tab-panel name="cancelled" class="no-padding q-mt-md">
        <cancelled />
      </q-tab-panel>
      <q-tab-panel name="serviceResolutionRemarks" class="no-padding q-mt-md">
        <serviceResolutionRemarks />
      </q-tab-panel>
      <q-tab-panel name="issueMapping" class="no-padding q-mt-md">
        <issueMapping />
      </q-tab-panel>
      <q-tab-panel name="csSubIssue" class="no-padding q-mt-md">
        <csSubIssue />
      </q-tab-panel>
    </q-tab-panels>
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

export default {
  name: "ServiceRequestManagement",
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
  }
};
</script>
