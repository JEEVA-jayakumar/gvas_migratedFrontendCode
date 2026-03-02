<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 text-purple-9 q-mb-md">Manage Document Types</div>

      <q-form @submit="submitMerchantSubDocumentType(formData)" class="q-gutter-md">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-3">
            <q-select
              outlined
              dense
              v-model="formData.merchantType"
              :options="activeMerchantType"
              label="Select merchant type"
              emit-value
              map-options
              @update:model-value="merchantDocumentTypeActiveList"
              :error="v$.formData.merchantType.$error"
            />
          </div>
          <div class="col-auto">
            <q-btn round dense color="purple-9" icon="add" @click="toggleMerchantTypes = true" />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              outlined
              dense
              v-model="formData.parentIDtemp"
              :options="activeDocumentMerchantType"
              label="Merchant Document Type"
              @update:model-value="mapParentIdToSubDocument"
            />
          </div>
          <div class="col-auto">
            <q-btn round dense color="purple-9" icon="add" @click="toggleMerchantdocumentTypes = true" />
          </div>

          <div class="col-12 col-md-3">
            <q-input
              outlined
              dense
              v-model.trim="formData.subDocumentType"
              label="Merchant Sub Document Type"
              :error="v$.formData.subDocumentType.$error"
            />
          </div>
          <div class="col-12 col-md-1">
            <q-input
              outlined
              dense
              type="number"
              v-model="formData.marsDocumentId"
              label="Mars ID"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn unelevated label="Submit" color="purple-9" type="submit" />
        </div>
      </q-form>
    </q-card>

    <div class="q-mt-lg">
      <q-tabs
        v-model="tab"
        class="bg-white text-grey-7 shadow-1"
        active-color="purple-9"
        indicator-color="purple-9"
        align="left"
      >
        <q-tab name="tab-1" label="Active List" @click="fetchActiveMerchantTypes()" />
        <q-tab name="tab-2" label="De-activated List" @click="fetchDeActiveMerchantTypes()" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated keep-alive class="bg-transparent">
        <q-tab-panel name="tab-1" class="no-padding q-mt-md">
          <q-table
            flat
            bordered
            :rows="activatedTableData"
            :columns="activatedColumns"
            row-key="id"
            color="purple-9"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <q-btn dense unelevated no-caps label="Modify" icon="edit" color="primary" @click="editMerchantSubDocumentType(props.row)" />
                <q-btn dense unelevated no-caps label="Disable" icon="block" color="negative" @click="fnDeleteDocumentType(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2" class="no-padding q-mt-md">
          <q-table
            flat
            bordered
            :rows="deActivatedTableData"
            :columns="deActivatedColumns"
            row-key="id"
            color="purple-9"
          />
        </q-tab-panel>
      </q-tab-panels>
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
      propRowDetails: null,
      activatedTableData: [],
      deActivatedTableData: [],
      toggleMerchantTypes: false,
      toggleMerchantdocumentTypes: false,
      formData: {
        merchantType: null,
        subDocumentType: "",
        parentIDtemp: null,
        id: null,
        documentType: "",
        marsDocumentId: 0
      },
      activatedColumns: [
        { name: "merchantTypeName", label: "Merchant Type", align: "left", field: "merchantTypeName" },
        { name: "documentType", label: "Document Type", align: "left", field: "documentType" },
        { name: "subDocumentType", label: "Sub Document Type", align: "left", field: row => row.subDocumentType || "NA" },
        { name: "marsDocumentId", label: "Mars ID", align: "left", field: "marsDocumentId" },
        { name: "action", label: "Actions", align: "center" }
      ],
      deActivatedColumns: [
        { name: "merchantTypeName", label: "Merchant Type", align: "left", field: "merchantTypeName" },
        { name: "documentType", label: "Document Type", align: "left", field: "documentType" }
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
        .then(() => {
          this.$q.notify({ color: "positive", message: "Saved successfully" });
          this.fetchActiveMerchantTypes();
          this.formData.subDocumentType = "";
        })
        .finally(() => this.$q.loading.hide());
    },

    fnDeleteDocumentType(row) {
      this.$q.dialog({
        title: "Confirm",
        message: "Deactivate this document type?",
        ok: "Deactivate", cancel: "Cancel", persistent: true
      }).onOk(() => {
        this.$q.loading.show();
        this.DELETE_MERCHANT_DOCUMENT_TYPE_AND_SET_ACTIVE(row.id).then(() => {
          this.fetchActiveMerchantTypes();
          this.$q.loading.hide();
        });
      });
    },

    merchantDocumentTypeActiveList() {
      this.MERCHANT_DOCUMENT_TYPE_ACTIVE_LIST({
        merchantTypeId: this.formData.merchantType,
        parentId: 0
      }).then(() => {
        this.activeDocumentMerchantType = this.getActiveMerchantDocumentTypes.map(v => ({
          label: v.documentType, value: v
        }));
      });
    },

    mapParentIdToSubDocument(val) {
      this.formData.id = val.id;
      this.formData.documentType = val.documentType;
    },

    editMerchantSubDocumentType(row) {
      this.propRowDetails = row;
      this.toggleMerchantSubdocumentTypes = true;
    }
  }
};
</script>
