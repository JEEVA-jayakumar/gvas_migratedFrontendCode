<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- START >> Setup MDR details -->
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div class="text-subtitle2 q-mb-sm">
          Select the Lead Bank to add List of Banks to implement QR
        </div>
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center q-col-gutter-md">
              <div class="col">
                <q-select
                  color="grey-9"
                  v-model="formData.leadSource"
                  :options="dropDown.leadSourceOptions"
                  label="Select Lead bank"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-auto">
                <q-btn
                  :disabled="!formData.leadSource"
                  no-caps
                  @click="fnAddLeadSource()"
                  color="purple-9"
                  label="Add Lead Source"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-mt-xl text-center text-subtitle2">
      List of Bank to implement QR Code
    </div>

    <div class="q-mt-md">
      <q-table
        flat
        bordered
        table-class="customTableClass"
        :rows="getActiveandDeactiveLeadSource"
        :columns="columns"
        v-model:pagination="paginationControl"
        row-key="id"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                no-caps
                no-wrap
                label="Delete"
                icon="far fa-minus-square"
                size="sm"
                @click="fnDownload(props.row.id)"
                flat
                class="text-negative"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "ImplementQRLeadSources",
  data() {
    return {
      paginationControl: {
        rowsPerPage: 5
      },
      formData: {
        leadSource: null
      },
      dropDown: {
        leadSourceOptions: []
      },
      columns: [
        { name: "sourceName", required: true, label: "QR Bank", align: "center", field: row => row.sourceName, sortable: true },
        { name: "action", required: true, label: "", align: "left", field: "action" }
      ]
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    ...mapGetters("ACTIVE_DEACTIVE_LEAD_SOURCE", ["getDeactiveLeadSource", "getActiveandDeactiveLeadSource"]),
    ...mapGetters("QRList", ["getAllQRList"])
  },
  methods: {
    ...mapActions("ACTIVE_DEACTIVE_LEAD_SOURCE", ["LEAD_SOURCE_DEACTIVE_LIST", "EDIT_LEAD_SOURCE", "LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1", "DELETE_LEAD_SOURCE"]),
    ...mapActions("QRList", ["FETCH_QR_LIST"]),
    ajaxLoadDataForDeviceTypeTable() {
      this.LEAD_SOURCE_DEACTIVE_LIST().then(() => {
        this.dropDown.leadSourceOptions = _.map(this.getDeactiveLeadSource, item => ({
          value: item.id,
          label: item.sourceName
        }));
      });
    },
    fnAddLeadSource() {
      let requestParams = {
        lead: {
          leadId: this.formData.leadSource
        }
      };
      this.$q.loading.show({ message: "Adding..." });
      this.EDIT_LEAD_SOURCE(requestParams).then(response => {
        this.LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1();
        this.$q.notify({
          color: "positive",
          message: response.data.message,
          icon: "thumb_up"
        });
        this.formData.leadSource = null;
        this.LEAD_SOURCE_DEACTIVE_LIST();
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    fnDownload(id) {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete QR Bank?",
        ok: "Continue",
        cancel: "Cancel",
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({ message: "Please Wait" });
        this.DELETE_LEAD_SOURCE(id).then(() => {
          this.fetch();
          this.$q.notify({
            color: "positive",
            message: "Successfully Deleted",
            icon: "thumb_up"
          });
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.notify({ color: "negative", message: "Please try again!" });
          this.$q.loading.hide();
        });
      });
    },
    fetch() {
      this.LEAD_SOURCE_ACTIVE_DEACTIVE_LIST1();
      this.LEAD_SOURCE_DEACTIVE_LIST();
      this.ajaxLoadDataForDeviceTypeTable();
      this.FETCH_QR_LIST();
    }
  }
};
</script>
