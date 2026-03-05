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
            <div class="text-h6 text-weight-regular">Manage Host</div>
          </div>
          <div class="col-auto" align="right">
            <q-btn flat round color="dark" size="sm" icon="clear" @click="emitModalClose" />
          </div>
        </div>

        <q-tabs v-model="tab" color="grey-9" align="left" class="q-mt-md">
          <q-tab label="Host List" name="tab-1" />
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
                      @click="hostEdit(props.row)"
                      flat
                      class="text-light-blue q-mr-sm"
                    />
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Disable"
                      icon="far fa-minus-square"
                      size="sm"
                      @click="hostDisable(props.row.id)"
                      flat
                      class="text-negative"
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
                      label="Search host"
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
                      @click="hostCreate()"
                    />
                  </div>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>

    <showCreateHost
      v-if="propShowCreateHost"
      :propShowCreateHost="propShowCreateHost"
      @emitfnshowHost="hostCreate"
    />
    <showEditHost
      v-if="propShowEditHost"
      :propShowEditHost="propShowEditHost"
      :propRowDetails="propRowDetails"
      @emitfnshowHost="refreshLeadSourceList"
    />
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showEditHost from "./editHost.vue";
import showCreateHost from "./createHost.vue";

export default {
  props: ["propToggleModal"],
  components: {
    showCreateHost,
    showEditHost
  },
  data() {
    return {
      tab: 'tab-1',
      toggleModal: this.propToggleModal,
      propShowCreateHost: false,
      propShowEditHost: false,
      propRowDetails: "",
      activeFilterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      tableData: [],
      activatedColumns: [
        { name: "name", required: true, label: "Name", align: "left", field: "name", sortable: true },
        { name: "action", required: true, label: "", align: "left", sortable: false }
      ]
    };
  },
  created() {
    this.ajaxLoadAllLeadInfo();
  },
  computed: {
    ...mapGetters("Host", ["getAllHostDetails"]),
  },
  methods: {
    ...mapActions("Host", ["GET_HOST_DETAILS", "DELETE_HOST"]),
    ajaxLoadAllLeadInfo() {
      this.$q.loading.show({ message: "Fetching data .." });
      this.GET_HOST_DETAILS()
        .then(() => {
          this.tableData = this.getAllHostDetails;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    leadSourceActiveList() {
      this.ajaxLoadAllLeadInfo();
    },
    hostCreate(token) {
      this.propShowCreateHost = !this.propShowCreateHost;
      if (token == "refresh") {
        this.leadSourceActiveList();
      }
    },
    hostEdit(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditHost = true;
    },
    refreshLeadSourceList() {
      this.propShowEditHost = false;
      this.leadSourceActiveList();
    },
    hostDisable(id) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to disable Host?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_HOST(id).then(() => {
          this.leadSourceActiveList();
          this.$q.notify({ color: "negative", message: "Host deactivated" });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "warning", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    },
    emitModalClose() {
      this.$emit("emitToggleModal");
    }
  }
};
</script>
