<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    position="side"
    class="customModalOverlay"
  >
    <q-card
      style="min-width:40vw;min-height:100vh;padding:25px;padding-top:60px"
    >
      <div class="row items-center bottom-border q-py-sm fit">
        <div class="col">
          <div class="q-title text-weight-regular">Manage lead sources</div>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose"/>
        </div>
      </div>
      <q-tabs
        v-model="tab"
        active-bg-color="grey-1"
        active-color="dark"
        indicator-color="transparent"
        align=""
      >
        <q-tab name="tab-1" label="Active List" @click="leadSourceActiveList" />
        <q-tab name="tab-2" label="De-Actived List" @click="leadSourceDeActiveList" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="tab-1" class="no-padding">
          <q-table
            :rows="getActiveLeadSource"
            table-class="customSATableClass"
            :columns="activatedColumns"
            :filter="activeFilterSearch"
            row-key="id"
            color="grey-9"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn

                    no-caps
                    no-wrap
                    label="Modify"
                    icon="far fa-plus-square"
                    size="md"
                    @click="leadSourceEdit(props.row)"
                    flat
                    class="text-light-blue"
                  ></q-btn>
                  <q-btn

                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="md"
                    @click="leadSourceDisable(props.row.id)"
                    flat
                    class="text-negative"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col-8">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="activeFilterSearch"
                  placeholder="Type.."
                  label="Search lead source"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-4" align="right">
                <q-btn
                  no-caps
                  no-wrap
                  label="Add New"
                  class="text-weight-regular"
                  color="purple-9"
                  icon="far fa-plus-square"
                  @click="leadSourceCreate()"
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2" class="no-padding">
          <q-table
            :rows="getDeActivatedLeadSource"
            table-class="customSATableClass"
            :columns="deActivatedColumns"
            :filter="deActivatedFilterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            color="grey-9"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn

                    no-caps
                    no-wrap
                    label="Enable"
                    icon="far fa-check-square"
                    size="md"
                    @click="fnEnableLeadSource(props.row)"
                    flat
                    class="text-positive"
                  ></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:top>
              <div class="col">
                <q-input
                  clearable
                  color="grey-9"
                  v-model="deActivatedFilterSearch"
                  placeholder="Type.."
                  label="Search by name"
                  class="q-mr-lg"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Modals -->
      <showCreateLeadSource
        v-if="propShowCreateLeadSource"
        :propShowCreateLeadSource="propShowCreateLeadSource"
        @emitfnshowLeadSources="leadSourceCreate"
      ></showCreateLeadSource>
      <showEditLeadSource
        v-if="propShowEditLeadSource"
        :propShowEditLeadSources="propShowEditLeadSource"
        :propRowDetails="propRowDetails"
        @emitfnshowLeadSources="refreshLeadSourceList"
      ></showEditLeadSource>
    </q-card>
  </q-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";
import showCreateLeadSource from "./createLeadSource.vue";
import showEditLeadSource from "./editLeadSource.vue";

export default {
  setup() { return { v$: useVuelidate() } },
  name: "AddLeadSource",
  props: ["propToggleModal"],
  components: {
    showCreateLeadSource,
    showEditLeadSource
  },
  data() {
    return {
      tab: "tab-1",
      toggleModal: this.propToggleModal,
      propShowCreateLeadSource: false,
      propShowEditLeadSource: false,
      propRowDetails: "",
      activeFilterSearch: "",
      deActivatedFilterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      activatedColumns: [
        { name: "sourceName", label: "Lead source", align: "left", field: "sourceName", sortable: false },
        { name: "action", label: "", align: "left", field: "action", sortable: false }
      ],
      deActivatedColumns: [
        { name: "sourceName", label: "Lead source", align: "left", field: "sourceName", sortable: false },
        { name: "action", label: "", align: "left", field: "action", sortable: false }
      ]
    };
  },
  created() {
    this.LEAD_SOURCE_ACTIVE_LIST();
  },
  computed: {
    ...mapGetters("leadSource", ["getActiveLeadSource", "getDeActivatedLeadSource"])
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST", "LEAD_SOURCE_DEACTIVED_LIST", "UPDATE_LEAD_SOURCE_AND_SET_ACTIVE", "DELETE_LEAD_SOURCE_AND_SET_ACTIVE"]),

    leadSourceActiveList() {
      this.LEAD_SOURCE_ACTIVE_LIST();
    },
    leadSourceDeActiveList() {
      this.LEAD_SOURCE_DEACTIVED_LIST();
    },
    leadSourceCreate(token) {
      this.propShowCreateLeadSource = !this.propShowCreateLeadSource;
      if (token == "refresh") {
        this.leadSourceActiveList();
      }
    },
    leadSourceEdit(rowDetails) {
      this.propShowEditLeadSource = !this.propShowEditLeadSource;
      this.propRowDetails = rowDetails;
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
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        });
        this.DELETE_LEAD_SOURCE_AND_SET_ACTIVE(id)
          .then(response => {
            this.leadSourceActiveList();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Lead source deactivated",
              icon: "thumb_up"
            });
          }).catch(() => {
            this.$q.notify({
              color: "warning",
              position: "bottom",
              message: "Please try again!",
              icon: "thumb_down"
            });
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      });
    },
    fnEnableLeadSource(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to enable lead source?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9"
        });
        this.UPDATE_LEAD_SOURCE_AND_SET_ACTIVE(rowDetails)
          .then(response => {
            this.leadSourceDeActiveList();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: `Lead source: ${rowDetails.sourceName} has been enabled`,
              icon: "thumb_up"
            });
          }).catch(() => {
            this.$q.notify({
              color: "warning",
              position: "bottom",
              message: "Please try again!",
              icon: "thumb_down"
            });
          })
          .finally(() => {
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

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
