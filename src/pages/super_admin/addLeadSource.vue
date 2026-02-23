<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    position="right"
    class="customModalOverlay"
  >
    <q-card
      style="min-width:40vw;min-height:100vh;padding:25px;padding-top:60px"
    >
      <!-- Header -->
      <div class="row items-center bottom-border q-py-sm fit">
        <div class="col">
          <div class="text-h6 text-weight-regular">
            Manage lead sources
          </div>
        </div>
        <div class="col" align="right">
          <q-btn
            outline
            round
            color="dark" size="sm"
            icon="clear"
            @click="emitModalClose"
          />
        </div>
      </div>

      <!-- Tabs -->
      <q-tabs
        v-model="tab"
        color="grey-9" class="active-color="primary"
        indicator-color="primary" class=">
        <q-tab
          name="tab-1"
          label="Active List"
          @click="leadSourceActiveList"
        />
        <q-tab
          name="tab-2"
          label="De-Actived List"
          @click="leadSourceDeActiveList"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>

        <!-- Active List -->
        <q-tab-panel name="tab-1">
          <q-table
            :rows="getActiveLeadSource"
            :columns="activatedColumns"
            row-key="id"
            :filter="activeFilterSearch"
            table-class="customSATableClass"
            color="grey-9" class=">

            <!-- Top Slot -->
            <template v-slot:top>
              <div class="row fit">
                <div class="col-8">
                  <q-input
                    dense
                    outlined
                    clearable
                    v-model="activeFilterSearch"
                    placeholder="Type.."
                    label="Search lead source"
                    color="grey-9" class="/>
                </div>

                <div class="col-4 text-right">
                  <q-btn
                    no-caps
                    label="Add New"
                    color="purple-9" class="icon="far fa-plus-square"
                    @click="leadSourceCreate()"
                  />
                </div>
              </div>
            </template>

            <!-- Action Column -->
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap">
                  <q-btn
                    dense
                    flat
                    no-caps
                    label="Modify"
                    icon="far fa-plus-square"
                    class="text-light-blue"
                    @click="leadSourceEdit(props.row)"
                  />

                  <q-btn
                    dense
                    flat
                    no-caps
                    label="Disable"
                    icon="far fa-minus-square"
                    class="text-negative"
                    @click="leadSourceDisable(props.row.id)"
                  />
                </div>
              </q-td>
            </template>

          </q-table>
        </q-tab-panel>

        <!-- Deactivated List -->
        <q-tab-panel name="tab-2">
          <q-table
            :rows="getDeActivatedLeadSource"
            :columns="deActivatedColumns"
            row-key="id"
            :filter="deActivatedFilterSearch"
            v-model:pagination="paginationControl"
            table-class="customSATableClass"
            color="grey-9" class=">

            <!-- Top Slot -->
            <template v-slot:top>
              <div class="row fit">
                <div class="col">
                  <q-input
                    dense
                    outlined
                    clearable
                    v-model="deActivatedFilterSearch"
                    placeholder="Type.."
                    label="Search by name"
                    class="q-mr-lg"
                  />
                </div>
              </div>
            </template>

            <!-- Action Column -->
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  flat
                  no-caps
                  label="Enable"
                  icon="far fa-check-square"
                  class="text-positive"
                  @click="fnEnableLeadSource(props.row)"
                />
              </q-td>
            </template>

          </q-table>
        </q-tab-panel>

      </q-tab-panels>

      <!-- Create Lead Source -->
      <showCreateLeadSource
        v-if="propShowCreateLeadSource"
        :propShowCreateLeadSource="propShowCreateLeadSource"
        @emitfnshowLeadSources="leadSourceCreate"
      />

      <!-- Edit Lead Source -->
      <showEditLeadSource
        v-if="propShowEditLeadSource"
        :propShowEditLeadSources="propShowEditLeadSource"
        :propRowDetails="propRowDetails"
        @emitfnshowLeadSources="refreshLeadSourceList"
      />

    </q-card>
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
        {
          name: "sourceName",
          label: "Lead source",
          align: "left",
          field: "sourceName"
        },
        {
          name: "action",
          label: "",
          align: "left",
          field: "action"
        }
      ],

      deActivatedColumns: [
        {
          name: "sourceName",
          label: "Lead source",
          align: "left",
          field: "sourceName"
        },
        {
          name: "action",
          label: "",
          align: "left",
          field: "action"
        }
      ]
    };
  },

  created() {
    this.LEAD_SOURCE_ACTIVE_LIST();
  },

  computed: {
    ...mapGetters("leadSource", [
      "getActiveLeadSource",
      "getDeActivatedLeadSource"
    ])
  },

  methods: {
    ...mapActions("leadSource", [
      "LEAD_SOURCE_ACTIVE_LIST",
      "LEAD_SOURCE_DEACTIVED_LIST",
      "UPDATE_LEAD_SOURCE_AND_SET_ACTIVE",
      "DELETE_LEAD_SOURCE_AND_SET_ACTIVE"
    ]),

    leadSourceActiveList() {
      this.LEAD_SOURCE_ACTIVE_LIST();
    },

    leadSourceDeActiveList() {
      this.LEAD_SOURCE_DEACTIVED_LIST();
    },

    leadSourceCreate(token) {
      this.propShowCreateLeadSource = !this.propShowCreateLeadSource;
      if (token === "refresh") {
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
          message: "Please Wait",
          spinnerColor: "purple-9"
        });

        this.DELETE_LEAD_SOURCE_AND_SET_ACTIVE(id)
          .then(() => {
            this.leadSourceActiveList();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: "Lead source deactivated"
            });
          })
          .catch(() => {
            this.$q.notify({
              color: "warning",
              position: "bottom",
              message: "Please try again!"
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
          message: "Please Wait",
          spinnerColor: "purple-9"
        });

        this.UPDATE_LEAD_SOURCE_AND_SET_ACTIVE(rowDetails)
          .then(() => {
            this.leadSourceDeActiveList();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: `Lead source: ${rowDetails.sourceName} has been enabled`
            });
          })
          .catch(() => {
            this.$q.notify({
              color: "warning",
              position: "bottom",
              message: "Please try again!"
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

<style>
</style>
