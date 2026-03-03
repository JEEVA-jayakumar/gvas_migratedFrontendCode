<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">Manage Document Types</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-12 col-sm-12 col-xs-12 q-pa-sm group">
        <div class="row q-col-gutter-sm items-end">
          <div class="col-md-3 col-sm-12">
            <q-select
              color="grey-9"
              v-model="formData.merchantType"
              :options="activeMerchantType"
              label="Select merchant type"
              placeholder="Merchant type"
              :error="v$.formData.merchantType.$error"
              emit-value
              map-options
              @update:model-value="merchantDocumentTypeActiveList"
            />
          </div>
          <div class="col-auto q-pb-md">
            <q-btn
              round
              dense
              no-caps
              size="md"
              @click="fnManagemerchantTypes"
              color="purple-9"
              icon="add"
              class="no-margin"
            />
          </div>
          <div class="col-md-3 col-sm-12">
            <q-select
              color="grey-9"
              v-model="formData.parentIDtemp"
              :options="activeDocumentMerchantType"
              @update:model-value="mapParentIdToSubDocument"
              label="Merchant Document Type"
              placeholder="Merchant Document Type"
            />
          </div>
          <div class="col-auto q-pb-md">
            <q-btn
              round
              dense
              no-caps
              size="md"
              @click="fnManagemerchanDocumentTypes"
              color="purple-9"
              icon="add"
              class="no-margin"
            />
          </div>
          <div class="col-md-3 col-sm-12">
            <q-input
              color="grey-9"
              v-model="formData.subDocumentType"
              :error="v$.formData.subDocumentType.$error"
              label="Merchant Sub Document Type"
              placeholder="Merchant Sub Document Type"
            />
          </div>
          <div class="col-auto q-pb-md">
            <q-input
              type="number"
              color="grey-9"
              v-model="formData.marsDocumentId"
              label="Mars document Id"
              placeholder="Mars document Id"
            />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            <q-btn
              label="Submit"
              color="purple-9"
              @click="submitMerchantSubDocumentType(formData)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- START >> Table >> rental charge details -->
      <div class="col-md-12 col-sm-12 col-xs-12">
        <q-tabs v-model="tab" color="grey-9" align="left">
          <q-tab
            @click="fetchActiveMerchantTypes"
            label="Active List"
            name="tab-1"
          />
          <q-tab
            @click="fetchDeActiveMerchantTypes"
            label="De-Actived List"
            name="tab-2"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="tab-1" class="no-padding">
            <q-table
              table-class="customTableClass"
              :rows="activatedTableData"
              :columns="activatedColumns"
              :filter="filterSearch"
              v-model:pagination="pagination"
              row-key="id"
              color="grey-9"
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
                      @click="editMerchantSubDocumentType(props.row)"
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
                      @click="fnDeleteDocumentType(props.row)"
                      flat
                      class="text-negative"
                    ></q-btn>
                  </div>
                </q-td>
              </template>
              <template v-slot:top="props">
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search by merchant type, document type, sub document type"
                    class="q-mr-lg q-py-sm"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="tab-2" class="no-padding">
            <q-table
              table-class="customTableClass"
              :rows="deActivatedTableData"
              :columns="deActivatedColumns"
              :filter="filterSearch"
              v-model:pagination="pagination"
              row-key="id"
              color="grey-9"
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
                      flat
                      class="text-negative"
                    ></q-btn>
                  </div>
                </q-td>
              </template>
              <template v-slot:top="props">
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search by merchant type, document type, sub document type"
                    class="q-mr-lg q-py-sm"
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
      </div>
      <!-- END >> Table >> MDR details -->
      <!--START: Show lead source -->
      <merchantTypes
        v-if="toggleMerchantTypes"
        :propToggleModal="toggleMerchantTypes"
        @emitToggleModal="fnManagemerchantTypes"
      ></merchantTypes>
      <merchanDocumentTypes
        v-if="toggleMerchantdocumentTypes"
        :propToggleModal="toggleMerchantdocumentTypes"
        :propMerchantType="formData.merchantType"
        @emitToggleModal="fnManagemerchanDocumentTypes"
      ></merchanDocumentTypes>
      <!--END: Show lead source -->
      <!--START: Show create MerchantSubDocumentTypes -->
      <showEditMerchantSubDocumentType
        v-if="toggleMerchantSubdocumentTypes"
        :propToggleMerchantSubdocumentTypes="toggleMerchantSubdocumentTypes"
        :propActiveMerchantTypes="activeMerchantType"
        :propActiveDocumentMerchantType="activeDocumentMerchantType"
        :propRowDetails="propRowDetails"
        @emitfnshowMerchantSubDocumentTypes="editMerchantSubDocumentType"
      ></showEditMerchantSubDocumentType>
      <!--END: Show create MerchantSubDocumentTypes -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import _ from "lodash";

import merchantTypes from "../../components/super_admin/merchantTypes.vue";
import merchanDocumentTypes from "../../components/super_admin/merchanDocumentTypes.vue";
import showEditMerchantSubDocumentType from "../../components/super_admin/editMerchantSubDocumentType.vue";

export default {
  name: "MerchantTypesManagement",
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    merchantTypes,
    merchanDocumentTypes,
    showEditMerchantSubDocumentType
  },
  data() {
    return {
      tab: 'tab-1',
      activeMerchantType: [],
      activeDocumentMerchantType: [],
      toggleMerchantSubdocumentTypes: false,
      propRowDetails: "",

      activeMerchantDocumentTypeList: [],
      deActiveMerchantDocumentTypeList: [],

      formData: {
        merchantType: null,
        subDocumentType: null,
        parentIDtemp: null,
        viewType: 0,
        marsDocumentId: 0,
        required: true,
        params: {
          parentId: null
        }
      },
      activeFilterSearch: "",
      deActivatedFilterSearch: "",
      toggleMerchantTypes: false,
      toggleMerchantdocumentTypes: false,

      filterSearch: "",

      activatedColumns: [
        {
          name: "merchantTypeName",
          required: true,
          label: "Merchant Type",
          align: "left",
          field: "merchantTypeName",
          sortable: false
        },
        {
          name: "documentType",
          required: true,
          label: "Document Type",
          align: "left",
          field: "documentType",
          sortable: false
        },
        {
          name: "subDocumentType",
          required: true,
          label: "Sub Document Type",
          align: "left",
          field: row => {
            return row.subDocumentType || "NA";
          },
          sortable: false
        },
        {
          name: "marsDocumentId",
          required: true,
          label: "Mars Document Id",
          align: "left",
          field: "marsDocumentId",
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
      ],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      activatedTableData: [],
      deActivatedColumns: [
        {
          name: "merchantTypeName",
          required: true,
          label: "Merchant Type",
          align: "left",
          field: "merchantTypeName",
          sortable: false
        },
        {
          name: "documentType",
          required: true,
          label: "Document Type",
          align: "left",
          field: "documentType",
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
      ],
      deActivatedTableData: []
    };
  },
  validations() {
    return {
      formData: {
        merchantType: { required },
        subDocumentType: { required }
      }
    };
  },

  created() {
    this.fetchActiveMerchantTypesOptions();
    this.fetchActiveMerchantTypes();
  },

  computed: {
    ...mapGetters("merchantTypes", [
      "getActiveMerchantTypes",
      "getDeActivatedMerchantTypes"
    ]),
    ...mapGetters("merchantDocumentTypes", [
      "getActiveMerchantDocumentTypes",
      "getDeActivatedMerchantDocumentTypes"
    ])
  },

  methods: {
    ...mapActions("merchantTypes", [
      "MERCHANT_TYPE_ACTIVE_LIST",
      "MERCHANT_TYPE_DEACTIVED_LIST"
    ]),
    ...mapActions("merchantDocumentTypes", [
      "MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST",
      "MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST",
      "ADD_NEW_MERCHANT_DOCUMENT_TYPE",
      "UPDATE_MERCHANT_DOCUMENT_TYPE",
      "UPDATE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE",
      "DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE"
    ]),

    fnDeleteDocumentType(rowDetails) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to delete merchant type?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .onOk(() => {
          this.$q.loading.show({
            delay: 100,
            message: "Please Wait",
            spinnerColor: "purple-9",
            customClass: "shadow-none"
          });
          this.DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE(rowDetails.id)
            .then(response => {
              this.$q.notify({
                color: "negative",
                position: "bottom",
                message: `Merchant type: ${
                  rowDetails.documentType
                } has been deactivated`,
                icon: "thumb_up"
              });
              this.fetchActiveMerchantTypes();
            })
            .catch(error => {
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
        })
        .onCancel(() => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: "No changes made!",
            icon: "thumb_down"
          });
        });
    },

    fetchActiveMerchantTypesOptions(value) {
      let self = this;
      this.activeMerchantType = [];
      this.MERCHANT_TYPE_ACTIVE_LIST().then(() => {
        return _.map(this.getActiveMerchantTypes, item => {
          self.activeMerchantType.push({
            value: item.id,
            label: item.merchantTypeName
          });
        });
      });
    },
    fetchActiveMerchantTypes() {
      let self = this;
      this.activatedTableData = [];
      this.$q.loading.show();
      this.MERCHANT_TYPE_ACTIVE_LIST().then(() => {
        _.map(this.getActiveMerchantTypes, item => {
          _.map(item.merchantDocumentType, subItem => {
            subItem.merchantTypeName = item.merchantTypeName;
            subItem.merchantTypeId = item.id;
            self.activatedTableData.push(subItem);
          });
        });
        this.$q.loading.hide();
      });
    },
    fetchDeActiveMerchantTypes() {
      let self = this;
      this.deActivatedTableData = [];
      this.$q.loading.show();
      this.MERCHANT_TYPE_DEACTIVED_LIST().then(() => {
        _.map(this.getDeActivatedMerchantTypes, item => {
          _.map(item.merchantDocumentType, subItem => {
            subItem.merchantTypeName = item.merchantTypeName;
            self.deActivatedTableData.push(subItem);
          });
        });
        this.$q.loading.hide();
      });
    },
    async submitMerchantSubDocumentType(formData) {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        return;
      }
      formData.hasSubDoc = this.formData.viewType ? false : true;
      let requestParams = {
        url: {
          id: formData.id,
          merchantType: formData.merchantType,
          hasSubDoc: formData.hasSubDoc
        },
        params: {
          documentType: formData.documentType,
          subDocumentType: formData.subDocumentType || "",
          parentID: formData.subDocumentType == "" ? 0 : formData.id,
          viewType: 0,
          marsDocumentId: formData.marsDocumentId,
          required: true
        }
      };
      this.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });
      this.ADD_NEW_MERCHANT_DOCUMENT_TYPE(requestParams)
        .then(() => {
          this.formData.marsDocumentId = 0;
          this.formData.subDocumentType = null;
          this.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Merchant sub document type successfully updated!",
            icon: "thumb_up"
          });
          this.fetchActiveMerchantTypes();
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.data?.message || "Please Try Again Later !",
            icon: "thumb_down"
          });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    fnManagemerchantTypes() {
      this.toggleMerchantTypes = !this.toggleMerchantTypes;
      if (!this.toggleMerchantTypes) this.fetchActiveMerchantTypesOptions();
    },
    fnManagemerchanDocumentTypes() {
      this.toggleMerchantdocumentTypes = !this.toggleMerchantdocumentTypes;
      if (!this.toggleMerchantdocumentTypes) this.merchantDocumentTypeActiveList();
    },
    editMerchantSubDocumentType(itemDetails) {
      this.toggleMerchantSubdocumentTypes = !this.toggleMerchantSubdocumentTypes;
      if (itemDetails != undefined) {
        this.propRowDetails = itemDetails;
      } else {
        this.fetchActiveMerchantTypes();
      }
    },

    merchantDocumentTypeActiveList() {
      this.MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST({
        merchantTypeId: this.formData.merchantType,
        parentId: 0
      })
        .then(() => {
          this.activeDocumentMerchantType = [];
          return _.map(this.getActiveMerchantDocumentTypes, value => {
            this.activeDocumentMerchantType.push({
              label: value.documentType,
              value: value
            });
          });
        })
        .then(() => {
          this.fetchActiveMerchantTypes();
        });
    },
    mapParentIdToSubDocument(value) {
      this.formData.params.parentId = value.parentID;
      this.formData.id = value.id;
      this.formData.documentType = value.documentType;
    }
  }
};
</script>

<style>
</style>
