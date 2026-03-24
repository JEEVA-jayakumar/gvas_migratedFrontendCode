<template>
  <q-page>
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">Merchant Tracker - TID</div>
        <q-table
            table-class="customTableClass"
            :rows="tableData"
            :columns="columns"
            :filter="filter"
            v-model:pagination="paginationControl"
            row-key="id"
        >
          <template v-slot:body-cell-tid="props">
            <q-td :props="props">
                <span class="label text-primary"># {{props.row.tid}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-mid="props">
            <q-td :props="props">
                <span class="label text-primary"># {{props.row.mid}}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-transaction_amount="props">
            <q-td :props="props">
              Rs. {{props.row.transaction_amount}}
            </q-td>
          </template>
          <template v-slot:body-cell-gst="props">
            <q-td :props="props">
              Rs. {{props.row.gst}}
            </q-td>
          </template>
          <template v-slot:body-cell-net_amount="props">
            <q-td :props="props">
              Rs. {{props.row.net_amount}}
            </q-td>
          </template>
          <template v-slot:body-cell-mdr="props">
            <q-td :props="props">
              Rs. {{props.row.mdr}}
            </q-td>
          </template>

          <template v-slot:top>
                <div class="col-md-5">
                    <q-input
                      dense
                      clearable
                      v-model="filter"
                      color="grey-9"
                      placeholder="Type.."
                      label= "Search by MID, TID, Merchant Name, MCC,UTR Number, Device Type"
                      class="q-mr-lg q-py-sm"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                </div>
                <div class="col-md-3">
                  <q-input
                    dense
                    v-model="filter_values"
                    label="Date Filter"
                    type="date"
                    class="q-mr-lg q-py-sm"
                    color="grey-9"
                  />
                </div>
                <div class="col-md-4">
                  <q-btn
                    outline
                    color="grey-9"
                    label="Download as Excel"
                    class="q-mr-lg q-py-sm float-right"
                    size="md"
                    @click="downloadExcel"
                  />
                </div>
          </template>
        </q-table>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "merchantTracker",
  data() {
    return {
      paginationControl: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0
      },
      filter: "",
      filter_values: "",
      columns: [
        { name: "on_boarded_date", required: true, label: "On Boarded Date", align: "left", field: "on_boarded_date", sortable: true },
        { name: "tid", required: true, label: "TID", align: "center", field: "tid", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", required: true, label: "Merchant Name", align: "left", field: "merchant_name", sortable: true },
        { name: "location", required: true, label: "Location", align: "left", field: "location", sortable: true },
        { name: "device_type", required: true, label: "Device Type", align: "left", field: "device_type", sortable: true },
        { name: "mcc", required: true, label: "MCC", align: "left", field: "mcc", sortable: true },
        { name: "transaction_amount", required: true, label: "Transaction Amount", align: "center", field: "transaction_amount", sortable: true },
        { name: "count", required: true, label: "Count", align: "center", field: "count", sortable: true },
        { name: "mdr", required: true, label: "MDR (INR)", align: "center", field: "mdr", sortable: true },
        { name: "gst", required: true, label: "GST (INR)", align: "center", field: "gst", sortable: true },
        { name: "net_amount", required: true, label: "Net Amount (INR)", align: "center", field: "net_amount", sortable: true },
        { name: "utr", required: true, label: "UTR", align: "center", field: "utr", sortable: true },
        { name: "settlement_date", required: true, label: "Settlement Date", align: "center", field: "settlement_date", sortable: true },
      ],
      tableData: [
        {
          id: 1,
          on_boarded_date: "20 Apr, 2018",
          tid: 554845,
          mid: "554845",
          merchant_name: "Bombay Fries",
          location: "Tamilnadu",
          device_type: "mPOS",
          mcc: "18245",
          transaction_amount: 500,
          count: 100,
          mdr: 5,
          gst: 2,
          net_amount: 2,
          utr: "6546AF6322",
          settlement_date: "20 Apr, 2018",
        }
      ]
    };
  },
  methods: {
    downloadExcel() {
       this.$q.notify("Excel download requested (Stub)");
    }
  }
};
</script>

<style>
</style>
