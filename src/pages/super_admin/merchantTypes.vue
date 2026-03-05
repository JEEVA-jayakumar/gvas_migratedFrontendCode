<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Manage Document Types</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-12 col-sm-12 col-xs-12 q-pa-sm group">
        <div class="row q-col-gutter-x-sm q-col-gutter-y-sm">
          <div class="col-3">
            <q-select
              color="grey-9"
              v-model="formData.merchantType"
              :options="activeMerchantType"
              label="Select merchant type"
              placeholder="Merchant type"
              emit-value
              map-options
              :error="v$.formData.merchantType.$error"
              @update:model-value="merchantDocumentTypeActiveList"
            />
          </div>
          <div class="col-auto self-center">
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
          <div class="col-3">
            <q-select
              color="grey-9"
              v-model="formData.parentIDtemp"
              :options="activeDocumentMerchantType"
              @update:model-value="mapParentIdToSubDocument"
              label="Merchant Document Type"
              placeholder="Merchant Document Type"
            />
          </div>
          <div class="col-auto self-center">
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
          <div class="col-3">
            <q-input
              color="grey-9"
              v-model="formData.subDocumentType"
              :error="v$.formData.subDocumentType.$error"
              label="Merchant Sub Document Type"
              placeholder="Merchant Sub Document Type"
            />
          </div>
          <div class="col-auto">
            <q-input
              type="number"
              color="grey-9"
              v-model="formData.marsDocumentId"
              label="Mars document Id"
              placeholder="Mars document Id"
            />
          </div>
        </div>
        <div class="row q-py-md">
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
      <!-- START >> Setup fee and recurring fee -->
      <!-- START >> Table >> rental charge details -->
      <div class="col-md-12 col-sm-12 col-xs-12">
        <q-tabs v-model="tab" color="grey-9" class="shadow-1">
          <q-tab
            color="dark"
            label="Active List"
            name="tab-1"
            @update:model-value="fetchActiveMerchantTypes"
          />
          <q-tab
            color="dark"
            label="De-Actived List"
            name="tab-2"
            @update:model-value="fetchDeActiveMerchantTypes"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="tab-1" class="no-padding">
            <q-table
              table-class="customSATableClass"
              :rows="activatedTableData"
              :columns="activatedColumns"
              :filter="filterSearch"
              v-model:pagination="pagination"
              row-key="id"
              color="grey-9"
            >
              <template v-slot:body-cell-subDocumentType="props">
                <q-td :props="props">
                  {{ props.row.subDocumentType || "NA" }}
                </q-td>
              </template>
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
              <template v-slot:top>
                <!--START: table filter,search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search by merchant type, document type, sub document type"
                    class="q-mr-lg q-py-sm"
                  />
                </div>
                <!--END: table filter,search -->
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="tab-2" class="no-padding">
            <q-table
              table-class="customSATableClass"
              :rows="deActivatedTableData"
              :columns="deActivatedColumns"
              :filter="filterSearch"
              v-model:pagination="pagination"
              row-key="id"
              color="grey-9"
            >
              <template v-slot:top>
                <!--START: table filter,search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search by merchant type, document type, sub document type"
                    class="q-mr-lg q-py-sm"
                  />
                </div>
                <!--END: table filter,search -->
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- Modals -->
    <merchantTypes
      v-if="toggleMerchantTypes"
      :propToggleModal="toggleMerchantTypes"
      @emitToggleModal="toggleMerchantTypes = false; fetchActiveMerchantTypesOptions()"
    />

    <merchanDocumentTypes
      v-if="toggleMerchantdocumentTypes"
      :propToggleModal="toggleMerchantdocumentTypes"
      :propMerchantType="formData.merchantType"
      @emitToggleModal="toggleMerchantdocumentTypes = false; merchantDocumentTypeActiveList()"
    />

    <showEditMerchantSubDocumentType
      v-if="toggleMerchantSubdocumentTypes"
      :propToggleMerchantSubdocumentTypes="toggleMerchantSubdocumentTypes"
      :propActiveMerchantTypes="activeMerchantType"
      :propActiveDocumentMerchantType="activeDocumentMerchantType"
      :propRowDetails="propRowDetails"
      @emitfnshowMerchantSubDocumentTypes="toggleMerchantSubdocumentTypes = false; fetchActiveMerchantTypes()"
    />
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
  name: "MerchantDocumentManagement",
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
      activatedTableData: [],
      deActivatedTableData: [],
      toggleMerchantTypes: false,
      toggleMerchantdocumentTypes: false,
      filterSearch: "",
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      formData: {
        merchantType: null,
        subDocumentType: null,
        parentIDtemp: null,
        id: null,
        documentType: "",
        marsDocumentId: 0,
        viewType: 0,
        required: true,
        params: {
          parentId: null
        }
      },
      activatedColumns: [
        { name: "merchantTypeName", label: "Merchant Type", align: "left", field: "merchantTypeName", sortable: false },
        { name: "documentType", label: "Document Type", align: "left", field: "documentType", sortable: false },
        { name: "subDocumentType", label: "Sub Document Type", align: "left", field: "subDocumentType", sortable: false },
        { name: "marsDocumentId", label: "Mars Document Id", align: "left", field: "marsDocumentId", sortable: false },
        { name: "action", label: "", align: "left", field: "action", sortable: false }
      ],
      deActivatedColumns: [
        { name: "merchantTypeName", label: "Merchant Type", align: "left", field: "merchantTypeName", sortable: false },
        { name: "documentType", label: "Document Type", align: "left", field: "documentType", sortable: false }
      ]
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
    ...mapGetters("merchantTypes", ["getActiveMerchantTypes", "getDeActivatedMerchantTypes"]),
    ...mapGetters("merchantDocumentTypes", ["getActiveMerchantDocumentTypes", "getDeActivatedMerchantDocumentTypes"])
  },
  methods: {
    ...mapActions("merchantTypes", ["MERCHANT_TYPE_ACTIVE_LIST", "MERCHANT_TYPE_DEACTIVED_LIST"]),
    ...mapActions("merchantDocumentTypes", ["MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST", "MERCHANT_DOCUMENT_TYPE_DEACTIVED_LIST", "ADD_NEW_MERCHANT_DOCUMENT_TYPE", "DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE"]),

    async fetchActiveMerchantTypesOptions() {
      this.activeMerchantType = [];
      await this.MERCHANT_TYPE_ACTIVE_LIST();
      this.activeMerchantType = this.getActiveMerchantTypes.map(item => ({
        value: item.id, label: item.merchantTypeName
      }));
    },

    async fetchActiveMerchantTypes() {
      this.$q.loading.show();
      this.activatedTableData = [];
      await this.MERCHANT_TYPE_ACTIVE_LIST();
      this.getActiveMerchantTypes.forEach(item => {
        item.merchantDocumentType.forEach(sub => {
          this.activatedTableData.push({ ...sub, merchantTypeName: item.merchantTypeName, merchantTypeId: item.id });
        });
      });
      this.$q.loading.hide();
    },

    async fetchDeActiveMerchantTypes() {
      this.$q.loading.show();
      this.deActivatedTableData = [];
      await this.MERCHANT_TYPE_DEACTIVED_LIST();
      this.getDeActivatedMerchantTypes.forEach(item => {
        item.merchantDocumentType.forEach(sub => {
          this.deActivatedTableData.push({ ...sub, merchantTypeName: item.merchantTypeName });
        });
      });
      this.$q.loading.hide();
    },

    async submitMerchantSubDocumentType() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      this.$q.loading.show({ message: "Saving..." });
      let payload = {
        url: {
          id: this.formData.id,
          merchantType: this.formData.merchantType,
          hasSubDoc: 0
        },
        params: {
          documentType: this.formData.documentType,
          subDocumentType: this.formData.subDocumentType,
          parentID: this.formData.id || 0,
          viewType: 0,
          marsDocumentId: this.formData.marsDocumentId,
          required: true
        }
      };

      this.ADD_NEW_MERCHANT_DOCUMENT_TYPE(payload)
        .onOk(() => {
          this.$q.notify({ color: "positive", message: "Saved successfully" });
          this.fetchActiveMerchantTypes();
          this.formData.subDocumentType = "";
        })
        .finally(() => this.$q.loading.hide());
    },

    fnDeleteDocumentType(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete merchant type?",
        ok: "Continue", cancel: "Cancel"
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" });
        this.DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE(row.id).onOk(() => {
          this.fetchActiveMerchantTypes();
          this.$q.notify({ color: "negative", position: "bottom", message: `Merchant type: ${row.documentType} has been deactivated`, icon: "thumb_up" });
          this.$q.loading.hide();
        });
      });
    },

    merchantDocumentTypeActiveList() {
      this.MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST({
        merchantTypeId: this.formData.merchantType,
        parentId: 0
      }).onOk(() => {
        this.activeDocumentMerchantType = this.getActiveMerchantDocumentTypes.map(v => ({
          label: v.documentType, value: v
        }));
        this.fetchActiveMerchantTypes(this.formData.merchantType);
      });
    },

    mapParentIdToSubDocument(val) {
      this.formData.params.parentId = val.parentID;
      this.formData.id = val.id;
      this.formData.documentType = val.documentType;
    },

    editMerchantSubDocumentType(row) {
      if (row) {
        this.propRowDetails = row;
        this.toggleMerchantSubdocumentTypes = true;
      } else {
        this.fetchActiveMerchantTypes();
        this.toggleMerchantSubdocumentTypes = false;
      }
    },

    fnManagemerchantTypes() {
      this.toggleMerchantTypes = !this.toggleMerchantTypes;
    },
    fnManagemerchanDocumentTypes() {
      this.toggleMerchantdocumentTypes = !this.toggleMerchantdocumentTypes;
    }
  }
};
</script>
