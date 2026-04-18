<template>
  <q-page class="bg-slate-50 q-pa-lg">
    <div class="premium-card shadow-1 bg-white border-radius-16 overflow-hidden">
      <!-- Premium Page Header -->
      <div class="q-pa-lg border-bottom bg-white">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-overline text-purple-9 text-weight-bold">SAT Module</div>
            <h1 class="text-h5 text-weight-bold text-slate-900 q-ma-none">Merchant Transaction Tracker</h1>
          </div>
          <div class="flex gap-sm">
             <q-btn
              unelevated
              color="purple-9"
              icon="file_download"
              label="Export Analytics"
              class="premium-btn"
              @click="downloadExcel"
            />
          </div>
        </div>

        <!-- Sticky Persistent Filter Bar -->
        <div class="row q-col-gutter-md items-center">
          <div class="col-md-5 col-sm-12">
            <q-input
              dense
              clearable
              v-model="filter"
              outlined
              placeholder="Search by MID, TID, Merchant Name..."
              class="premium-search"
              bg-color="slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="slate-400" />
              </template>
            </q-input>
          </div>
          <div class="col-md-3 col-sm-6">
            <q-input
              dense
              outlined
              v-model="filter_values"
              label="Transaction Date"
              type="date"
              class="premium-input"
              bg-color="slate-50"
              stack-label
            >
              <template v-slot:prepend>
                <q-icon name="event" color="slate-400" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Premium Table -->
      <q-table
          flat
          class="premium-table sticky-header-table"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="id"
          :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:body-cell-tid="props">
          <q-td :props="props">
            <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold">
              # {{props.row.tid}}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-mid="props">
          <q-td :props="props">
            <div class="text-slate-600 font-medium">{{props.row.mid}}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-transaction_amount="props">
          <q-td :props="props">
            <div class="text-weight-bold text-slate-900">₹{{props.row.transaction_amount}}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-net_amount="props">
          <q-td :props="props">
            <div class="text-weight-bold text-green-7">₹{{props.row.net_amount}}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-on_boarded_date="props">
          <q-td :props="props">
            <div class="text-slate-500">{{ props.row.on_boarded_date }}</div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width q-pa-xl text-center text-slate-400">
             <q-icon name="insights" size="64px" class="opacity-20 q-mb-md" />
             <div class="text-h6 opacity-50">No transaction records found</div>
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
        { name: "on_boarded_date", label: "Boarded Date", align: "left", field: "on_boarded_date", sortable: true },
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", label: "Merchant Name", align: "left", field: "merchant_name", sortable: true },
        { name: "location", label: "Location", align: "left", field: "location", sortable: true },
        { name: "device_type", label: "Device", align: "left", field: "device_type", sortable: true },
        { name: "transaction_amount", label: "Amount", align: "right", field: "transaction_amount", sortable: true },
        { name: "net_amount", label: "Net Payout", align: "right", field: "net_amount", sortable: true },
        { name: "utr", label: "UTR Reference", align: "center", field: "utr", sortable: true },
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
          net_amount: 493,
          utr: "6546AF6322",
          settlement_date: "20 Apr, 2018",
        }
      ]
    };
  },
  methods: {
    downloadExcel() {
       this.$q.notify({ color: "purple-9", message: "Preparing Excel export...", icon: "downloading" });
    }
  }
};
</script>

<style lang="scss" scoped>
.premium-container { border: 1px solid #e2e8f0; }
.border-bottom { border-bottom: 1px solid #f1f5f9; }
.premium-btn { border-radius: 10px !important; font-weight: 600; }
.premium-search {
  ::v-deep(.q-field__control) {
    border-radius: 10px !important;
    &:hover { background: #fff !important; }
  }
}
.premium-table {
  ::v-deep(.q-table__top) { display: none; }
  ::v-deep(thead tr th) {
    background: #f8fafc;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.7rem;
    padding: 16px !important;
  }
}
.border-radius-16 { border-radius: 16px; }
.bg-purple-1 { background-color: #faf5ff; }
.opacity-20 { opacity: 0.2; }
.opacity-50 { opacity: 0.5; }
</style>
