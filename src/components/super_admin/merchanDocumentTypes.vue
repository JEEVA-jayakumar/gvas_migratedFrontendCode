<template>
  <q-dialog
    v-model="toggleModal"
    @hide="emitModalClose"
    @escape-key="emitModalClose"
    persistent
    position="right"
    class="customModalOverlay"
  >
    <q-card style="min-width: 50vw; min-height: 100vh">
      <div class="q-pa-md">
        <div class="row items-center border-bottom q-pb-md">
          <div class="col-10">
            <div class="row items-center">
              <div class="col-12">
                <div class="text-h6 text-weight-regular">Manage merchant document types</div>
              </div>
              <div class="col-12 q-mt-sm">
                <q-select
                  color="grey-9"
                  placeholder="Merchant type"
                  :options="activeMerchantType"
                  v-model="formData.merchantType"
                  label="Select merchant type"
                  @update:model-value="onMerchantTypeChange"
                  @blur="v$.formData.merchantType.$touch"
                  :error="v$.formData.merchantType.$error"
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>
          <div class="col-2" align="right">
            <q-btn flat round color="dark" size="sm" icon="clear" @click="emitModalClose" />
          </div>
        </div>

        <q-tabs color="grey-9" v-model="currentListTabulation" align="left" class="q-mt-md">
          <q-tab label="Active List" name="tab-1" />
          <q-tab label="De-Actived List" name="tab-2" />
        </q-tabs>

        <q-tab-panels v-model="currentListTabulation" animated keep-alive>
          <q-tab-panel name="tab-1" class="no-padding q-mt-md">
            <q-table
              :rows="merchantDocumentTypesList"
              table-class="customSATableClass"
              :columns="merchantActiveDocumentcolumns"
              :filter="filterSearch"
              v-model:pagination="paginationControl"
              :filter-method="myCustomSearchFilter"
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
                      @click="fnShowEditMerchantDocumentTypes(props.row)"
                      flat
                      class="text-light-blue q-mr-sm"
                    ></q-btn>
                    <q-btn
                      dense
                      no-caps
                      no-wrap
                      label="Disable"
                      icon="far fa-minus-square"
                      size="sm"
                      @click="fnDeleteMerchantDocumentType(props.row)"
                      flat
                      class="text-negative"
                    ></q-btn>
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
                    @click="fnshowCreateMerchantDocumentType()"
                  />
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2" class="no-padding q-mt-md">
            <q-table
              :rows="merchantDocumentTypesDeactivatedList"
              table-class="customSATableClass"
              :columns="merchantDeactiveDocumentcolumns"
              :filter="deActivatedSearch"
              v-model:pagination="paginationControl"
              :filter-method="myCustomSearchFilter"
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
                      @click="fnEnableMerchantDocumentType(props.row)"
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

    <showCreateMerchantDocumentType
      v-if="propShowCreateMerchantDocumentTypes"
      :propShowCreateMerchantDocumentTypes="propShowCreateMerchantDocumentTypes"
      :propActiveMerchantTypes="activeMerchantType"
      @emitfnshowMerchantDocumentTypes="fnshowCreateMerchantDocumentType"
    />

    <showEditMerchantDocumentType
      v-if="showEditMerchantDocumentTypes"
      :propShowEditMerchantDocumentTypes="showEditMerchantDocumentTypes"
      :propActiveMerchantTypes="activeMerchantType"
      :propCurrentMerchantType="formData.merchantType"
      :propRowDetails="propRowDetails"
      @emitfnshowMerchantDocumentTypes="refreshMerchantDocumentTypeList"
    />
  </q-dialog>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import showCreateMerchantDocumentType from "./createMerchantDocumentType.vue";
import showEditMerchantDocumentType from "./editMerchantDocumentType.vue";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propToggleModal", "propactiveMerchantDocumentTypes", "propMerchantType"],
  components: {
    showCreateMerchantDocumentType,
    showEditMerchantDocumentType
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      currentListTabulation: "tab-1",
      activeMerchantType: [],
      toggleModal: this.propToggleModal,
      propShowCreateMerchantDocumentTypes: false,
      showEditMerchantDocumentTypes: false,
      propRowDetails: "",
      formData: {
        merchantType: this.propMerchantType
      },
      filterSearch: "",
      deActivatedSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      merchantActiveDocumentcolumns: [
        { name: "documentType", required: true, label: "Merchant Document Type", align: "left", field: "documentType", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      merchantDeactiveDocumentcolumns: [
        { name: "documentType", required: true, label: "Merchant Document Type", align: "left", field: "documentType", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      merchantDocumentTypesList: [],
      merchantDocumentTypesDeactivatedList: []
    };
  },
  validations() {
    return {
      formData: {
        merchantType: { required }
      }
    };
  },
  computed: {
    ...mapGetters("merchantTypes", ["getActiveMerchantTypes"]),
    ...mapGetters("merchantDocumentTypes", ["getActiveMerchantDocumentTypes", "getDeActivatedMerchantDocumentTypes"])
  },
  created() {
    this.fetchMerchantDocumentTypeList();
  },
  watch: {
    currentListTabulation(val) {
        if (val === 'tab-1') this.fetchMerchantDocumentTypeActivatedList();
        else this.fetchMerchantDocumentTypeDeActivatedList();
    }
  },
  methods: {
    ...mapActions("merchantTypes", ["MERCHANT_TYPE_ACTIVE_LIST"]),
    ...mapActions("merchantDocumentTypes", [
      "MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST",
      "MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST",
      "UPDATE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE",
      "DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE"
    ]),
    emitModalClose() {
      this.$emit("emitToggleModal");
    },
    onMerchantTypeChange() {
        if (this.currentListTabulation === 'tab-1') this.fetchMerchantDocumentTypeActivatedList();
        else this.fetchMerchantDocumentTypeDeActivatedList();
    },
    fetchMerchantDocumentTypeList() {
      this.MERCHANT_TYPE_ACTIVE_LIST().then(() => {
        this.activeMerchantType = _.map(this.getActiveMerchantTypes, item => ({
          value: item.id,
          label: item.merchantTypeName
        }));
        this.fetchMerchantDocumentTypeActivatedList();
      });
    },
    fetchMerchantDocumentTypeActivatedList() {
      this.v$.formData.$touch();
      if (!this.v$.formData.$error) {
        this.$q.loading.show({ message: "Please Wait" });
        this.MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST({
          merchantTypeId: this.formData.merchantType,
          parentId: 0
        }).then(() => {
          this.merchantDocumentTypesList = _.uniqBy(this.getActiveMerchantDocumentTypes, "documentType");
          this.$q.loading.hide();
        }).catch(() => {
           this.$q.loading.hide();
        });
      }
    },
    fetchMerchantDocumentTypeDeActivatedList() {
      this.v$.formData.$touch();
      if (!this.v$.formData.$error) {
        this.$q.loading.show({ message: "Please Wait" });
        this.MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST({
          merchantTypeId: this.formData.merchantType,
          parentId: 0
        }).then(() => {
          this.merchantDocumentTypesDeactivatedList = this.getDeActivatedMerchantDocumentTypes;
          this.$q.loading.hide();
        }).catch(() => {
           this.$q.loading.hide();
        });
      }
    },
    fnshowCreateMerchantDocumentType(token) {
      this.propShowCreateMerchantDocumentTypes = !this.propShowCreateMerchantDocumentTypes;
      if (token == "refresh") {
        this.fetchMerchantDocumentTypeActivatedList();
      }
    },
    fnShowEditMerchantDocumentTypes(rowDetails) {
      this.propRowDetails = rowDetails;
      this.showEditMerchantDocumentTypes = true;
    },
    refreshMerchantDocumentTypeList() {
      this.showEditMerchantDocumentTypes = false;
      this.fetchMerchantDocumentTypeActivatedList();
    },
    fnDeleteMerchantDocumentType(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete merchant type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE(rowDetails.id).then(() => {
          this.fetchMerchantDocumentTypeActivatedList();
          this.$q.notify({ color: "negative", message: `Merchant type: ${rowDetails.documentType} has been deactivated` });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "warning", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    },
    fnEnableMerchantDocumentType(rowDetails) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to enable merchant type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.UPDATE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE({
          merchantType: this.formData.merchantType,
          hasSubDoc: rowDetails.viewType,
          id: rowDetails.id,
          params: rowDetails,
          parentId: rowDetails.parentID
        }).then(() => {
          this.fetchMerchantDocumentTypeDeActivatedList();
          this.$q.notify({ color: "positive", message: `Merchant type: ${rowDetails.documentType} has been activated` });
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
