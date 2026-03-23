<template>
  <div class="q-pa-none">
    <internalServiceRequestPopup v-if="propToggleServiceRequest" :ServiceRequest="addtnServiceRequest"
      :propToggleServiceRequestPop="propToggleServiceRequest" @closeServiceRequest="toggleServiceRequest" />

    <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
      <div class="row items-center gutter-y-sm">
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
          <span class="q-display-2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
        </div>
        <div class="col-md-3 col-sm-6 col-xs-6">
          <div class="text-weight-bold">Request Mode</div>
          <q-radio v-for="(item, index) in requestOptions" :key="index" color="grey-9"
            v-model="formData.serviceRequestMode" :val="item.value" :label="item.label" />
        </div>
        <div v-if="formData.serviceRequestMode == 'SO'" class="col-md-3 col-sm-6 col-xs-6">
          <q-select filter clearable v-model="formData.assignTo.id" separator color="grey-9" :options="assignToOptions"
            placeholder="Assign To" emit-value map-options />
        </div>
        <div class="col-md-3 col-sm-6 col-xs-6 text-right">
          <q-btn no-caps :disabled="formData.marsDeviceIdsCooked.length == 0 || (formData.serviceRequestMode == 'SO' && !formData.assignTo.id)"
            label="Assign" class="common-dark-blue" @click="assignImplementationUser" />
        </div>
      </div>
    </q-card>

    <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToUnassignedTab">
      <q-tab color="dark" name="unAssigned" label="Unassigned" />
      <q-tab color="dark" name="assigned" label="Assigned" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="unAssigned" class="no-padding">
        <q-table :rows="tableData3" :columns="columnDataUnassigned" table-class="customTableClass"
          :filter="filterSearch1" selection="multiple" v-model:selected="formData.marsDeviceIdsCooked"
          v-model:pagination="paginationControl1" row-key="id" :loading="tableAjaxLoading1"
          :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo1">
          <template v-slot:body-cell-serviceReqTicketId="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleServiceRequest(props.row)">
              <span class="label text-primary"># {{ props.row.serviceReqTicketId }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-createdDate="props">
            <q-td :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:body-cell-updatedDate="props">
            <q-td :props="props">{{ $moment(props.row.updatedDate).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch1" placeholder="Type.."
                label="Search By ServiceReqTicketId, TID .." class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="assigned" class="no-padding">
        <q-table :rows="tableData1" :columns="columnDataAssigned" table-class="customTableClass"
          :filter="filterSearch" v-model:pagination="paginationControl" row-key="id" :loading="tableAjaxLoading"
          :rows-per-page-options="[5, 10, 15, 20]" color="dark" @request="ajaxLoadAllLeadInfo">
          <template v-slot:body-cell-createdDate="props">
            <q-td :props="props">{{ $moment(props.row.createdDate).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:body-cell-updatedDate="props">
            <q-td :props="props">{{ $moment(props.row.updatedDate).format("Do MMM Y") }}</q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.." label="Search .."
                class="q-mr-lg q-py-sm" />
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import internalServiceRequestPopup from '../../components/sat/internalServiceRequestPopup.vue';

export default {
  name: 'reOpenExternal',
  components: { internalServiceRequestPopup },
  data() {
    return {
      propToggleServiceRequest: false,
      addtnServiceRequest: null,
      filterSearch: '',
      filterSearch1: '',
      selectedTab: 'assigned',
      assignToOptions: [],
      tableData1: [],
      tableData3: [],
      requestOptions: [{ label: 'SO', value: 'SO' }],
      formData: {
        marsDeviceIdsCooked: [],
        serviceRequestMode: 'SO',
        assignTo: { id: '' },
      },
      paginationControl: { sortBy: 'createdDate', descending: false, page: 1, rowsPerPage: 10 },
      paginationControl1: { sortBy: 'createdDate', descending: false, page: 1, rowsPerPage: 10 },
      tableAjaxLoading: false,
      tableAjaxLoading1: false,
      columnDataAssigned: [
        { name: 'serviceReqTicketId', label: 'ServiceReqTicketId', align: 'left', field: 'serviceReqTicketId' },
        { name: 'tid', label: 'TID', align: 'left', field: 'tid' },
        { name: 'mid', label: 'MID', align: 'left', field: 'mid' },
        { name: 'createdDate', label: 'CreatedDate', align: 'left', field: 'createdDate', sortable: true },
        { name: 'updatedDate', label: 'UpdatedDate', align: 'left', field: 'updatedDate' },
        { name: 'meName', label: 'ME Name', align: 'left', field: 'meName' },
        { name: 'bpRegion', label: 'BpRegion', align: 'left', field: row => row.bpRegion?.regionAreaName },
        { name: 'assignedTo', label: 'AssignedTo', align: 'left', field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : 'NA' },
        { name: 'crmRemark', label: 'CRM Remark', align: 'left', field: 'crmRemark' },
        { name: 'deviceType', label: 'DeviceType', align: 'left', field: 'deviceType' },
        { name: 'serviceRequestSubTicketStatus', label: 'ServiceReqIssueStatus', align: 'left', field: 'serviceRequestSubTicketStatus' },
        { name: 'serviceRequestMode', label: 'RequestMode', align: 'left', field: 'serviceRequestMode' },
        { name: 'serviceRequestTicketStatus', label: 'TicketStatus', align: 'left', field: 'serviceRequestTicketStatus' }
      ],
      columnDataUnassigned: [
        { name: 'serviceReqTicketId', label: 'ServiceReqTicketId', align: 'left', field: 'serviceReqTicketId' },
        { name: 'tid', label: 'TID', align: 'left', field: 'tid' },
        { name: 'mid', label: 'MID', align: 'left', field: 'mid' },
        { name: 'createdDate', label: 'CreatedDate', align: 'left', field: 'createdDate', sortable: true },
        { name: 'updatedDate', label: 'UpdatedDate', align: 'left', field: 'updatedDate' },
        { name: 'meName', label: 'ME Name', align: 'left', field: 'meName' },
        { name: 'bpRegion', label: 'BpRegion', align: 'left', field: row => row.bpRegion?.regionAreaName },
        { name: 'assignedTo', label: 'AssignedTo', align: 'left', field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : 'NA' },
        { name: 'crmRemark', label: 'CRM Remark', align: 'left', field: 'crmRemark' },
        { name: 'deviceType', label: 'DeviceType', align: 'left', field: 'deviceType' },
        { name: 'serviceRequestSubTicketStatus', label: 'ServiceReqIssueStatus', align: 'left', field: 'serviceRequestSubTicketStatus' },
        { name: 'serviceRequestMode', label: 'RequestMode', align: 'left', field: 'serviceRequestMode' },
        { name: 'serviceRequestTicketStatus', label: 'TicketStatus', align: 'left', field: 'serviceRequestTicketStatus' }
      ]
    };
  },
  computed: {
    ...mapGetters('ImplementationExecutive', ['getImplementationExecutiveList']),
    ...mapGetters('serviceRequestPhonepeSat', ['getserviceRequestReopenTicket', 'getphonepeAssignedReopenTicket']),
  },
  created() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: '' });
    this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: '' });
  },
  methods: {
    ...mapActions('serviceRequestPhonepeSat', ['PHONEPE_REOPENED_UNASSIGED_TO_ASSIGNED_STATE', 'FETCH_PHONEPE_REOPENED_ASSIGNED_TICKET', 'FETCH_PHONEPE_REOPEN_TICKET']),
    ...mapActions('ImplementationExecutive', ['IMPLEMENTATION_EXECUTIVE_LIST']),
    ajaxLoadAllLeadInfo1({ pagination, filter }) {
      this.tableAjaxLoading1 = true;
      this.FETCH_PHONEPE_REOPEN_TICKET({ pagination, filter }).then(() => {
        this.IMPLEMENTATION_EXECUTIVE_LIST().then(() => {
          this.assignToOptions = this.getImplementationExecutiveList.map(v => ({ label: v.name, value: v.id }));
        });
        this.paginationControl1 = pagination;
        this.paginationControl1.rowsNumber = this.getserviceRequestReopenTicket.totalElements;
        this.tableData3 = (this.getserviceRequestReopenTicket.content || []).filter(s => s.source === true);
        this.tableAjaxLoading1 = false;
      }).catch(() => { this.tableAjaxLoading1 = false; });
    },
    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.tableAjaxLoading = true;
      this.FETCH_PHONEPE_REOPENED_ASSIGNED_TICKET({ pagination, filter }).then(() => {
        this.paginationControl = pagination;
        this.paginationControl.rowsNumber = this.getphonepeAssignedReopenTicket.totalElements;
        this.tableData1 = (this.getphonepeAssignedReopenTicket.content || []).filter(s => s.source === true);
        this.tableAjaxLoading = false;
      }).catch(() => { this.tableAjaxLoading = false; });
    },
    goToUnassignedTab(tab) {
      if (tab === 'unAssigned') this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: '' });
      else this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: '' });
    },
    assignImplementationUser() {
      if (this.formData.marsDeviceIdsCooked.length === 0 || !this.formData.assignTo.id) return;
      this.$q.loading.show({ message: 'Assigning...' });
      const request = this.formData.marsDeviceIdsCooked.map(v => ({ ...v, serviceRequestMode: this.formData.serviceRequestMode }));
      this.PHONEPE_REOPENED_UNASSIGED_TO_ASSIGNED_STATE({ request, userId: this.formData.assignTo.id }).then((res) => {
        if (res.status == 200) {
          this.formData.marsDeviceIdsCooked = [];
          this.$q.notify({ color: 'positive', message: 'Successfully assigned!', icon: 'thumb_up' });
          this.ajaxLoadAllLeadInfo1({ pagination: this.paginationControl1, filter: '' });
        }
        this.$q.loading.hide();
      }).catch(() => this.$q.loading.hide());
    },
    toggleServiceRequest(details) {
      this.propToggleServiceRequest = !this.propToggleServiceRequest;
      if (details) this.addtnServiceRequest = details;
    }
  }
};
</script>