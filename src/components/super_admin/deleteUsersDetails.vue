<template>
  <q-dialog
    v-model="toggleModal"
    maximized
    persistent
    class="customModalOverlay"
  >
    <q-card>
      <!--START: table title -->
      <div class="row items-center q-px-lg q-py-md text-weight-regular border-bottom text-grey-9">
        <div class="col text-h6">Action Sheet</div>
        <div class="col-auto">
          <q-btn size="sm" round @click="emitToggleRemarks" outline color="dark" icon="clear"/>
        </div>
      </div>
      <!--END: table title -->
      <div class="q-pa-md">
        <q-table
          title="Lead Validation"
          table-class="customTableClass"
          class="q-py-none"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="user.id"
          flat
          bordered
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="group">
              <q-btn
                v-if="props.row.leadsCount == 0 && props.row.referencesCount == 0"
                no-caps
                color="negative"
                icon="clear"
                label="Disable"
                size="sm"
              />
              <q-btn
                v-if="props.row.referencesCount > 0"
                no-caps
                color="positive"
                icon="refresh"
                @click="toggleReAssignReferencesModal(props.row)"
                label="Re-assign refs"
                size="sm"
                class="q-mr-xs"
              />
              <q-btn
                v-if="props.row.leadsCount > 0"
                no-caps
                color="positive"
                icon="refresh"
                @click="toggleReAssignLeadsModal(props.row)"
                label="Re-assign leads"
                size="sm"
              />
            </q-td>
          </template>
          <!-- END: table body modification -->
          <template v-slot:top-right>
            <q-input
              clearable
              dense
              color="grey-9"
              v-model="filter"
              placeholder="Type.."
              label="Search by user name, email, phone"
              style="width: 300px"
            />
          </template>
        </q-table>
      </div>

      <reAssignLeads
        v-if="reAssignLeadsModal"
        :propRowDetails="rowLeadsDetails"
        :propToggleModal="reAssignLeadsModal"
        @closeLeadsList="toggleReAssignLeadsModal()"
      />
      <reAssignReferences
        v-if="reAssignReferencesModal"
        :propRowDetails="rowReferencesDetails"
        :propToggleModal="reAssignReferencesModal"
        @closeReferencesList="toggleReAssignReferencesModal()"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import reAssignLeads from "./reAssignLeads.vue";
import reAssignReferences from "./reAssignReferences.vue";

export default {
  name: "leadValidation",
  props: ["propDeteledUsers", "propToggleModal"],
  components: {
    reAssignLeads,
    reAssignReferences
  },
  data() {
    return {
      filter: "",
      rowLeadsDetails: [],
      rowReferencesDetails: [],
      tableData: this.propDeteledUsers,
      toggleModal: this.propToggleModal,
      reAssignLeadsModal: false,
      reAssignReferencesModal: false,
      paginationControl: {
        rowsPerPage: 6,
        page: 1
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.user.name,
          sortable: false
        },
        {
          name: "employeeID",
          required: true,
          label: "Employee ID",
          align: "left",
          field: row => row.user.employeeID,
          sortable: false
        },
        {
          name: "email",
          required: true,
          label: "Email",
          align: "center",
          field: row => row.user.email,
          sortable: true
        },
        {
          name: "contactNumber",
          required: true,
          label: "Phone",
          align: "left",
          field: row => row.user.contactNumber,
          sortable: false
        },
        {
          name: "userAddress",
          required: true,
          label: "Address",
          align: "left",
          field: row => row.user.userAddress,
          sortable: false
        },
        {
          name: "city",
          required: true,
          label: "City",
          align: "left",
          field: row => row.user.city,
          sortable: false
        },
        {
          name: "state",
          required: true,
          label: "State",
          align: "left",
          field: row => row.user.state,
          sortable: false
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          field: "action",
          sortable: false
        }
      ]
    };
  },
  methods: {
    toggleReAssignLeadsModal(details) {
      this.reAssignLeadsModal = !this.reAssignLeadsModal;
      if (details != undefined) {
        this.rowLeadsDetails = details;
      }
    },
    toggleReAssignReferencesModal(details) {
      this.reAssignReferencesModal = !this.reAssignReferencesModal;
      if (details != undefined) {
        this.rowReferencesDetails = details;
      }
    },
    emitToggleRemarks() {
      this.$emit("emitToggleDeleteUsersModal");
    }
  }
};
</script>
