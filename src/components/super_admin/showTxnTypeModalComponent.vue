<template>
  <q-dialog
    v-model="toggleModal"
    @hide="emitModalClose"
    @escape-key="emitModalClose"
    persistent
    position="right"
    class="customModalOverlay"
  >
    <q-card style="min-width: 40vw; min-height: 100vh">
      <div class="q-pa-md">
        <div class="row items-center border-bottom q-pb-md fit">
          <div class="col">
            <div class="text-h6 text-weight-regular">Manage VAS</div>
          </div>
          <div class="col-auto" align="right">
            <q-btn flat round color="dark" size="sm" icon="clear" @click="emitModalClose" />
          </div>
        </div>

        <q-tabs v-model="tab" color="grey-9" align="left" class="q-mt-md">
          <q-tab label="Active Vas List" name="tab-1" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="tab-1" class="no-padding q-mt-md">
            <q-table
              :rows="tableData"
              table-class="customSATableClass"
              :columns="activatedColumns"
              :filter="activeFilterSearch"
              v-model:pagination="paginationControl"
              row-key="id"
              color="grey-9"
              flat
              bordered
            >
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="row no-wrap no-padding">
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Modify"
                      icon="far fa-plus-square"
                      size="sm"
                      @click="vasEdit(props.row)"
                      flat
                      class="text-light-blue"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:top="props">
                <div class="row full-width items-center q-col-gutter-sm">
                  <div class="col-8">
                    <q-input
                      clearable
                      dense
                      color="grey-9"
                      v-model="activeFilterSearch"
                      placeholder="Type.."
                      label="Search lead source"
                    />
                  </div>
                  <div class="col-4" align="right">
                    <q-btn
                      no-caps
                      no-wrap
                      dense
                      label="Add New"
                      class="text-weight-regular"
                      color="purple-9"
                      icon="far fa-plus-square"
                      @click="vasCreate()"
                    />
                  </div>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>

    <showVasCreate
      v-if="propShowVasCreate"
      :propShowVasCreate="propShowVasCreate"
      @emitfnshowVas="vasCreate"
    />
    <showEditVas
      v-if="propShowEditVas"
      :propShowEditVas="propShowEditVas"
      :propRowDetails="propRowDetails"
      @emitfnshowVas="refreshvasEdit"
    />
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showEditVas from "./vasEdit.vue";
import showVasCreate from "./vasCreate.vue";

export default {
  props: ["propToggleModal"],
  components: {
    showEditVas,
    showVasCreate
  },
  data() {
    return {
      tab: 'tab-1',
      toggleModal: this.propToggleModal,
      propShowVasCreate: false,
      propShowEditVas: false,
      propRowDetails: "",
      activeFilterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      tableData: [],
      activatedColumns: [
        { name: "name", required: true, label: "name", align: "left", field: "name", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ]
    };
  },
  created() {
    this.ajaxLoadAllLeadInfo();
  },
  computed: {
    ...mapGetters("vasCreation", ["getAllVasDetails"])
  },
  methods: {
    ...mapActions("vasCreation", ["GET_ALL_VAS_DETAILS"]),
    ajaxLoadAllLeadInfo() {
      this.$q.loading.show({ message: "Fetching data .." });
      this.GET_ALL_VAS_DETAILS()
        .then(() => {
          this.tableData = this.getAllVasDetails;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    leadSourceActiveList() {
      this.ajaxLoadAllLeadInfo();
    },
    vasCreate(token) {
      this.propShowVasCreate = !this.propShowVasCreate;
      if (token == "refresh") {
        this.leadSourceActiveList();
      }
    },
    vasEdit(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditVas = true;
    },
    refreshvasEdit() {
      this.propShowEditVas = false;
      this.leadSourceActiveList();
    },
    emitModalClose() {
      this.$emit("emitToggleModal");
    }
  }
};
</script>
