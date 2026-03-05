<template>
  <q-page padding>
    <div class="text-h6 q-px-lg q-py-md text-weight-regular border-bottom text-grey-9">
      Select the batch to download QR String
    </div>
    <q-table
      table-class="customTableClass"
      :rows="getAllQRList"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="id"
      :filter-method="myCustomSearchFilter"
      flat
      bordered
    >
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ $moment(props.row.createDate).format("Do MMM Y") }}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="row no-wrap no-padding">
            <q-btn
              dense
              no-caps
              no-wrap
              icon="download"
              label="Download QR String"
              size="sm"
              flat
              @click="fnDownload(props.row.id)"
              class="text-light-blue"
            />
          </div>
        </q-td>
      </template>

      <template v-slot:top-right>
        <q-input
          clearable
          dense
          v-model.trim="filter"
          color="grey-9"
          placeholder="Search by Batch no/ QR API source"
          style="width: 300px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DownloadQRcodes",
  data() {
    return {
      paginationControl: {
        rowsPerPage: 10
      },
      filter: "",
      columns: [
        {
          name: "id",
          label: "Batch No",
          field: row => "BatchNo_000" + row.id,
          align: "center",
          sortable: true
        },
        {
          name: "createDate",
          required: true,
          label: "Creation Date",
          align: "center",
          field: "createDate",
          sortable: true
        },
        {
          name: "qrCount",
          required: true,
          label: "No of QR Requested",
          align: "center",
          field: "qrCount",
          sortable: true
        },
        {
          name: "sourceName",
          required: true,
          label: "QR Bank Selected",
          align: "center",
          field: row => row.apiInstance?.apiInstanceName || 'NA',
          sortable: true
        },
        {
          name: "action",
          required: true,
          label: "",
          align: "left",
          sortable: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters("QRList", ["getAllQRList"])
  },
  created() {
    this.FETCH_QR_LIST();
  },
  methods: {
    ...mapActions("QRList", ["FETCH_QR_LIST"]),
    ...mapActions("reports", ["QR_LIST_DOWNLOAD"]),

    fnDownload(id) {
      this.$q.loading.show({ message: "Downloading..." });
      let requestparams = {
        params: {
          items: [id]
        }
      };
      this.QR_LIST_DOWNLOAD(requestparams)
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            message: "Success, file has been downloaded",
            icon: "check"
          });
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            message: error.data?.message || "Please try again",
            icon: "thumb_down"
          });
        });
    },
    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(
          col =>
            (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
        )
      );
    }
  }
};
</script>
