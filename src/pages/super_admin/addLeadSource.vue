<template>
  <q-dialog
    minimized
    position="right"
    v-model="toggleModal"
    no-backdrop-dismiss
    @escape-key="emitModalClose"
    class="customModalOverlay"
    :content-css="{padding:'25px',paddingTop:'60px',minWidth:'40vw',minHeight:'100vh'}"
  >
    <q-card class="column full-height" style="padding:25px;padding-top:60px;min-width:40vw;min-height:100vh">
    <div class="row items-center bottom-border q-py-sm fit">
      <div class="col">
        <div class="text-subtitle1 text-weight-regular">Manage lead sources</div>
      </div>
      <div class="col" align="right">
        <q-btn outline round color="dark" size="sm" icon="clear" @click="emitModalClose"/>
      </div>
    </div>
    <q-tabs v-model="tab" color="grey-9">
      <q-tab @click="leadSourceActiveList" label="Active List" name="tab-1"/>
      <q-tab @click="leadSourceDeActiveList" label="De-Actived List" name="tab-2"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="tab-1" class="no-padding">
        <q-table
          :rows="getActiveLeadSource"
          table-class="customSATableClass"
          :columns="activatedColumns"
          :filter="activeFilterSearch"
          row-key="id"
          color="grey-9"
          flat
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
                  size="md"
                  @click="leadSourceEdit(props.row)"
                  flat
                  class="text-light-blue"
                ></q-btn>
                <q-btn
                  dense
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
            <div class="row full-width items-center q-col-gutter-sm">
                <div class="col-8">
                <q-input
                    clearable
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
      <q-tab-panel name="tab-2" class="no-padding">
        <q-table
          :rows="deActiveLeadSourceList"
          table-class="customSATableClass"
          :columns="deActivatedColumns"
          :filter="deActivatedFilterSearch"
          v-model:pagination="paginationControl"
          row-key="id"
          color="grey-9"
          flat
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
                  size="md"
                  @click="fnEnableLeadSource(props.row)"
                  flat
                  class="text-positive"
                ></q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:top>
            <div class="row full-width items-center">
                <div class="col">
                <q-input
                    clearable
                    color="grey-9"
                    v-model="deActivatedFilterSearch"
                    placeholder="Type.."
                    label="Search by name"
                    class="q-mr-lg"
                />
                </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
    </q-card>
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
      activeLeadSourceList: [],
      deActiveLeadSourceList: [],
      activeFilterSearch: "",
      deActivatedFilterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      activatedColumns: [
        { name: "sourceName", required: true, label: "Lead source", align: "left", field: "sourceName", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      deActivatedColumns: [
        { name: "sourceName", required: true, label: "Lead source", align: "left", field: "sourceName", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
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
    ...mapActions("leadSource", [
      "LEAD_SOURCE_ACTIVE_LIST",
      "LEAD_SOURCE_DEACTIVED_LIST",
      "UPDATE_LEAD_SOURCE_AND_SET_ACTIVE",
      "DELETE_LEAD_SOURCE_AND_SET_ACTIVE"
    ]),
    leadSourceActiveList() {
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        this.activeLeadSourceList = this.getActiveLeadSource;
      });
    },
    leadSourceDeActiveList() {
      this.LEAD_SOURCE_DEACTIVED_LIST().then(() => {
        this.deActiveLeadSourceList = this.getDeActivatedLeadSource;
      });
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
      this.propShowEditLeadSource = !this.propShowEditLeadSource;
      this.leadSourceActiveList();
    },
    leadSourceDisable(rowDetails) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to disable lead source?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
          this.DELETE_LEAD_SOURCE_AND_SET_ACTIVE(rowDetails)
            .then(response => {
              this.leadSourceActiveList();
              this.$q.notify({ color: "negative", position: "bottom", message: "Lead source deactivated", icon: "thumb_up" });
            })
            .catch(() => {
              this.$q.notify({ color: "warning", position: "bottom", message: "Please try again!", icon: "thumb_down" });
            }).finally(() => { this.$q.loading.hide(); });
        });
    },
    fnEnableLeadSource(rowDetails) {
      this.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to enable lead source?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
          this.UPDATE_LEAD_SOURCE_AND_SET_ACTIVE(rowDetails)
            .then(response => {
              this.leadSourceDeActiveList();
              this.$q.notify({ color: "positive", position: "bottom", message: `Lead source: ${rowDetails.sourceName} has been enabled`, icon: "thumb_up" });
            })
            .catch(() => {
              this.$q.notify({ color: "warning", position: "bottom", message: "Please try again!", icon: "thumb_down" });
            }).finally(() => { this.$q.loading.hide(); });
        });
    },
    emitModalClose() {
      this.$emit("emitToggleModal");
    }
  }
};
</script>
