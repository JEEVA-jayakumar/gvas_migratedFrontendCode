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
            <div class="text-h6 text-weight-regular">Manage lead source</div>
          </div>
          <div class="col-auto" align="right">
            <q-btn flat round color="dark" size="sm" icon="clear" @click="emitModalClose" />
          </div>
        </div>

        <q-tabs v-model="tab" color="grey-9" align="left" class="q-mt-md">
          <q-tab label="Active List" name="tab-1" />
          <q-tab label="De-Actived List" name="tab-2" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="tab-1" class="no-padding q-mt-md">
            <q-table
              :rows="getActiveLeadSource"
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
                      @click="leadSourceEdit(props.row)"
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
                      @click="leadSourceDisable(props.row.id)"
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
                      @click="leadSourceCreate()"
                    />
                  </div>
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2" class="no-padding q-mt-md">
            <q-table
              :rows="deActiveLeadSourceList"
              table-class="customSATableClass"
              :columns="deActivatedColumns"
              :filter="deActivatedFilterSearch"
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
                      label="Enable"
                      icon="far fa-check-square"
                      size="sm"
                      @click="fnEnableLeadSource(props.row)"
                      flat
                      class="text-positive"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:top="props">
                <div class="col-12">
                  <q-input
                    clearable
                    dense
                    color="grey-9"
                    v-model="deActivatedFilterSearch"
                    placeholder="Type.."
                    label="Search by name"
                  />
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>

    <showCreateLeadSource
      v-if="propShowCreateLeadSource"
      :propShowCreateLeadSource="propShowCreateLeadSource"
      @emitfnshowLeadSources="leadSourceCreate"
    />
    <showEditLeadSource
      v-if="propShowEditLeadSource"
      :propShowEditLeadSources="propShowEditLeadSource"
      :propRowDetails="propRowDetails"
      @emitfnshowLeadSources="refreshLeadSourceList"
    />
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showCreateLeadSource from "./createLeadSource.vue";
import showEditLeadSource from "./editLeadSource.vue";

export default {
  props: ["propToggleModal"],
  components: {
    showCreateLeadSource,
    showEditLeadSource
  },
  data() {
    return {
      tab: 'tab-1',
      toggleModal: this.propToggleModal,
      propShowCreateLeadSource: false,
      propShowEditLeadSource: false,
      propRowDetails: "",
      activeFilterSearch: "",
      deActivatedFilterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      deActiveLeadSourceList: [],
      activatedColumns: [
        { name: "sourceName", required: true, label: "Lead source", align: "left", field: "sourceName", sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      deActivatedColumns: [
        { name: "sourceName", required: true, label: "Lead source", align: "left", field: "sourceName", sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ]
    };
  },
  created() {
    this.leadSourceActiveList();
  },
  watch: {
    tab(val) {
        if (val === 'tab-1') this.leadSourceActiveList();
        else this.leadSourceDeActiveList();
    }
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource", "getDeActivatedLeadSource"])
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST", "LEAD_SOURCE_DEACTIVED_LIST", "UPDATE_LEAD_SOURCE_AND_SET_ACTIVE", "DELETE_LEAD_SOURCE_AND_SET_ACTIVE"]),
    leadSourceActiveList() {
      this.$q.loading.show({ message: "Please Wait" });
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    leadSourceDeActiveList() {
      this.$q.loading.show({ message: "Please Wait" });
      this.LEAD_SOURCE_DEACTIVED_LIST().then(() => {
        this.deActiveLeadSourceList = this.getDeActivatedLeadSource;
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    leadSourceCreate(token) {
      this.propShowCreateLeadSource = !this.propShowCreateLeadSource;
      if (token == "refresh") {
        this.leadSourceActiveList();
      }
    },
    leadSourceEdit(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditLeadSource = true;
    },
    refreshLeadSourceList() {
      this.propShowEditLeadSource = false;
      this.leadSourceActiveList();
    },
    leadSourceDisable(id) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to disable lead source?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_LEAD_SOURCE_AND_SET_ACTIVE(id).then(() => {
          this.leadSourceActiveList();
          this.$q.notify({ color: "negative", message: "Lead source deactivated" });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "warning", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    },
    fnEnableLeadSource(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to enable lead source?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.UPDATE_LEAD_SOURCE_AND_SET_ACTIVE(rowDetails).then(() => {
          this.leadSourceDeActiveList();
          this.$q.notify({ color: "positive", message: `Lead source: ${rowDetails.sourceName} has been enabled` });
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
