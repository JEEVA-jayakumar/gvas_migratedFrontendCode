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
        <div class="row items-center border-bottom q-pb-md">
          <div class="col">
            <div class="text-h6 text-weight-regular">Manage merchant types</div>
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
              :rows="merchantTypesList"
              table-class="customSATableClass"
              :columns="columns"
              :filter="filterSearch"
              v-model:pagination="paginationControl"
              :filter-method="myCustomSearchFilter"
              row-key="id"
              color="grey-9"
              flat
              bordered
            >
              <template v-slot:body-cell-action="props">
                <q-td :props="props" align="right">
                  <div class="row no-wrap justify-end">
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Modify"
                      icon="far fa-plus-square"
                      size="sm"
                      @click="fnShowEditMerchantTypes(props.row)"
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
                      @click="fnDeleteMerchantType(props.row)"
                      flat
                      class="text-negative"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:top="props">
                <div class="col-8">
                  <q-input
                    clearable
                    dense
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search merchant type"
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
                    @click="fnshowCreateMerchantType()"
                  />
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2" class="no-padding q-mt-md">
            <q-table
              :rows="merchantTypesDeactivatedList"
              table-class="customSATableClass"
              :columns="columns"
              :filter="deActivatedSearch"
              v-model:pagination="paginationControl"
              :filter-method="myCustomSearchFilter"
              row-key="id"
              color="grey-9"
              flat
              bordered
            >
              <template v-slot:body-cell-action="props">
                <q-td :props="props" align="right">
                  <div class="row no-wrap justify-end">
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Enable"
                      icon="far fa-check-square"
                      size="sm"
                      @click="fnEnableMerchantType(props.row)"
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
                    v-model="deActivatedSearch"
                    placeholder="Type.."
                    label="Search merchant type"
                  />
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>

    <showCreateMerchantType
      v-if="propShowCreateMerchantTypes"
      :propShowCreateMerchantTypes="propShowCreateMerchantTypes"
      @emitfnshowMerchantTypes="fnshowCreateMerchantType"
    />
    <showEditMerchantType
      v-if="showEditMerchantTypes"
      :propShowEditMerchantTypes="showEditMerchantTypes"
      :propRowDetails="propRowDetails"
      @emitfnshowMerchantTypes="refreshMerchantTypeList"
    />
  </q-dialog>
</template>

<script>
import showCreateMerchantType from "./createMerchantTypes.vue";
import showEditMerchantType from "./editMerchantTypes.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["propToggleModal", "propactiveMerchantTypes"],
  components: {
    showCreateMerchantType,
    showEditMerchantType
  },
  data() {
    return {
      tab: 'tab-1',
      merchantTypesList: [],
      merchantTypesDeactivatedList: [],
      toggleModal: this.propToggleModal,
      propShowCreateMerchantTypes: false,
      showEditMerchantTypes: false,
      propRowDetails: "",
      filterSearch: "",
      deActivatedSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      columns: [
        { name: "merchantTypeName", required: true, label: "Merchant Type", align: "left", field: "merchantTypeName", sortable: true },
        { name: "action", required: true, label: "", align: "right", field: "", sortable: false }
      ]
    };
  },
  watch: {
    tab(val) {
      if (val === 'tab-1') this.fetchMerchantTypeList();
      else this.fetchMerchantTypeDeActivatedList();
    }
  },
  computed: {
    ...mapGetters("merchantTypes", ["getActiveMerchantTypes", "getDeActivatedMerchantTypes"])
  },
  created() {
    this.fetchMerchantTypeList();
  },
  methods: {
    ...mapActions("merchantTypes", [
      "DELETE_MERCHANT_TYPE_AND_SET_ACTIVE",
      "MERCHANT_TYPE_ACTIVE_LIST",
      "MERCHANT_TYPE_DEACTIVED_LIST",
      "UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE"
    ]),
    emitModalClose() {
      this.$emit("emitToggleModal");
    },
    fetchMerchantTypeList() {
      this.$q.loading.show({ message: "Please Wait" });
      this.MERCHANT_TYPE_ACTIVE_LIST().then(() => {
        this.merchantTypesList = this.getActiveMerchantTypes;
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    fetchMerchantTypeDeActivatedList() {
      this.$q.loading.show({ message: "Please Wait" });
      this.MERCHANT_TYPE_DEACTIVED_LIST().then(() => {
        this.merchantTypesDeactivatedList = this.getDeActivatedMerchantTypes;
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    fnshowCreateMerchantType(token) {
      this.propShowCreateMerchantTypes = !this.propShowCreateMerchantTypes;
      if (token == "refresh") {
        this.fetchMerchantTypeList();
      }
    },
    fnShowEditMerchantTypes(rowDetails) {
      this.propRowDetails = rowDetails;
      this.showEditMerchantTypes = true;
    },
    refreshMerchantTypeList() {
      this.showEditMerchantTypes = false;
      this.fetchMerchantTypeList();
    },
    fnDeleteMerchantType(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete merchant type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_MERCHANT_TYPE_AND_SET_ACTIVE(rowDetails.id).then(() => {
          this.fetchMerchantTypeList();
          this.$q.notify({ color: "negative", message: `Merchant type: ${rowDetails.merchantTypeName} has been deactivated` });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "warning", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    },
    fnEnableMerchantType(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to enable merchant type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE(rowDetails).then(() => {
          this.fetchMerchantTypeDeActivatedList();
          this.$q.notify({ color: "positive", message: `Merchant type: ${rowDetails.merchantTypeName} has been activated` });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "warning", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    },
    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row => cols.some(col => (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1));
    }
  }
};
</script>
