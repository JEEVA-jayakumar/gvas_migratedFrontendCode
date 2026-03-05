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
        <div class="col text-h6">References Details</div>
        <div class="col-auto">
          <q-btn size="sm" round @click="emitToggleRemarks" outline color="dark" icon="clear"/>
        </div>
      </div>
      <!--END: table title -->
      <div class="row q-pa-md">
        <div class="col-3 border-right">
          <q-list padding>
            <q-item-label header>Hierarchy List</q-item-label>
            <q-item
              v-for="(item, index) in propRowDetails.hierarchyList"
              :key="index"
              clickable
              :active="activeIndex == index"
              active-class="bg-purple-9 text-white"
              @click="populateReferencesList(item,index)"
            >
                <q-item-section>
                    {{item.hierarchy.hierarchy}}
                </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-9">
          <!--START: table lead validation -->
          <q-table
            table-class="customTableClass"
            class="q-py-none"
            :rows="tableData"
            :columns="columns"
            selection="multiple"
            v-model:selected="formData.selectedReferencesToReAssign"
            v-model:filter="filter"
            v-model:pagination="paginationControl"
            row-key="id"
            flat
            bordered
          >
            <template v-slot:top="props">
              <div class="row full-width items-center q-col-gutter-sm">
                <div class="col-12 col-lg-5">
                  <q-input
                    clearable
                    dense
                    color="grey-9"
                    v-model="filter"
                    placeholder="Type.."
                    label="Search by SO name, Merchant Name, Lead ID"
                  />
                </div>
                <div class="col-12 col-lg-5">
                  <q-select
                    dense
                    v-model="formData.userId"
                    label="Choose a user from below"
                    :options="[]"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12 col-lg-2" align="middle">
                  <q-btn icon="check" color="positive" label="Assign" dense />
                </div>
              </div>
            </template>
          </q-table>
          <!--END: table lead validation -->
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "reAssignReferences",
  props: ["propRowDetails", "propToggleModal"],
  data() {
    return {
      toggleModal: this.propToggleModal,
      filter: "",
      paginationControl: {
        rowsPerPage: 6,
        page: 1
      },
      formData: {
        selectedReferencesToReAssign: [],
        userId: null
      },
      columns: [
        { name: "employeeID", required: true, label: "Employee ID", align: "left", field: "employeeID", sortable: true },
        { name: "name", required: true, label: "Name", align: "left", field: "name", sortable: true },
        { name: "email", required: true, label: "Email", align: "center", field: "email", sortable: true },
        { name: "contactNumber", required: true, label: "Contact number", align: "left", field: "contactNumber", sortable: true },
        { name: "userAddress", required: true, label: "Address", align: "left", field: "userAddress", sortable: true },
        { name: "city", required: true, label: "City", align: "left", field: "city", sortable: true },
        { name: "state", required: true, label: "State", align: "left", field: "state", sortable: true },
        { name: "pincode", required: true, label: "Pincode", align: "left", field: "pincode", sortable: true }
      ],
      tableData: [],
      activeIndex: null
    };
  },
  methods: {
    populateReferencesList(details, index) {
      this.activeIndex = index;
      this.tableData = details.references;
    },
    emitToggleRemarks() {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to leave this page?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$emit("closeReferencesList");
      });
    }
  }
};
</script>
