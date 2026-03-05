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
            <div class="text-h6 text-weight-regular">Manage merchant type</div>
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
              :rows="activeMerchantTypeList"
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
                      @click="merchantTypeEdit(props.row)"
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
                      @click="merchantTypeDisable(props.row.id)"
                      flat
                      class="text-negative"
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
                    v-model="activeFilterSearch"
                    placeholder="Type.."
                    label="Search by name, short name"
                  />
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="tab-2" class="no-padding q-mt-md">
            <q-table
              :rows="deActiveMerchantTypeList"
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

    <showCreateMerchantType
      v-if="propShowCreateMerchantType"
      :propShowCreateMerchantType="propShowCreateMerchantType"
      @emitfnshowMerchantTypes="merchantTypeCreate"
    />
    <showEditMerchantType
      v-if="propShowEditMerchantType"
      :propShowEditMerchantTypes="propShowEditMerchantType"
      :propRowDetails="propRowDetails"
      @emitfnshowMerchantTypes="refreshMerchantTypeList"
    />
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import showCreateMerchantType from "./createMerchantType.vue";
import showEditMerchantType from "./editMerchantType.vue";

export default {
  props: ["propToggleModal"],
  components: {
    showCreateMerchantType,
    showEditMerchantType
  },
  data() {
    return {
      tab: 'tab-1',
      toggleModal: this.propToggleModal,
      propShowCreateMerchantType: false,
      propShowEditMerchantType: false,
      propRowDetails: "",
      activeMerchantTypeList: [],
      deActiveMerchantTypeList: [],
      activeFilterSearch: "",
      deActivatedFilterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      activatedColumns: [
        { name: "merchantTypeName", required: true, label: "Merchant type", align: "left", field: "merchantTypeName", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      deActivatedColumns: [
        { name: "merchantTypeName", required: true, label: "Merchant type", align: "left", field: "merchantTypeName", sortable: false },
        { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ]
    };
  },
  created() {
    this.merchantTypeActiveList();
  },
  watch: {
    tab(val) {
        if (val === 'tab-1') this.merchantTypeActiveList();
        else this.merchantTypeDeActiveList();
    }
  },
  computed: {
    ...mapGetters("merchantTypes", ["getActiveMerchantTypes", "getDeActivatedMerchantTypes"])
  },
  methods: {
    ...mapActions("merchantTypes", [
      "MERCHANT_TYPE_ACTIVE_LIST",
      "MERCHANT_TYPE_DEACTIVED_LIST",
      "UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE",
      "DELETE_MERCHANT_TYPE_AND_SET_ACTIVE"
    ]),
    emitModalClose() {
      this.$emit("emitToggleModal");
    },
    merchantTypeActiveList() {
      this.$q.loading.show({ message: "Please Wait" });
      this.MERCHANT_TYPE_ACTIVE_LIST().then(() => {
        this.activeMerchantTypeList = this.getActiveMerchantTypes;
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    merchantTypeDeActiveList() {
      this.$q.loading.show({ message: "Please Wait" });
      this.MERCHANT_TYPE_DEACTIVED_LIST().then(() => {
        this.deActiveMerchantTypeList = this.getDeActivatedMerchantTypes;
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    merchantTypeCreate(token) {
      this.propShowCreateMerchantType = !this.propShowCreateMerchantType;
      if (token == "refresh") {
        this.merchantTypeActiveList();
      }
    },
    merchantTypeEdit(rowDetails) {
      this.propRowDetails = rowDetails;
      this.propShowEditMerchantType = true;
    },
    refreshMerchantTypeList() {
      this.propShowEditMerchantType = false;
      this.merchantTypeActiveList();
    },
    merchantTypeDisable(id) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to disable Merchant type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_MERCHANT_TYPE_AND_SET_ACTIVE(id).then(() => {
          this.merchantTypeActiveList();
          this.$q.notify({ color: "negative", message: "Merchant type deactivated" });
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
        message: "Are you sure want to enable Merchant type?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.UPDATE_MERCHANT_TYPE_AND_SET_ACTIVE(rowDetails).then(() => {
          this.merchantTypeDeActiveList();
          this.$q.notify({ color: "positive", message: `Merchant type: ${rowDetails.merchantTypeName} has been enabled` });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "warning", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    }
  }
};
</script>
