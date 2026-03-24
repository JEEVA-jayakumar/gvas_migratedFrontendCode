<template>
  <q-page>
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">Merchant Tracker - Transaction Level</div>

    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="id"
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="rowClick(props.row)" class="cursor-pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'tid'">
              <span class="label text-primary"># {{ col.value }}</span>
            </template>
            <template v-else-if="col.name === 'mid'">
              <span class="label text-primary"># {{ col.value }}</span>
            </template>
            <template v-else>
              {{ col.value }}
            </template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top>
            <div class="col-5">
              <q-input
                dense
                clearable
                v-model="filter"
                color="grey-9"
                placeholder="Type.."
                label="Search by MID, TID, Merchant Name, MCC,UTR Number, Device Type"
                class="q-mr-lg q-py-sm"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                dense
                type="date"
                v-model="filter_values"
                placeholder="Select Date"
                class="q-mr-lg q-py-sm"
                label="Filter By"
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

    <showMerchantTransactionLevelDetails 
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />
    </div>
  </q-page>
</template>

<script>
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";

export default {
  name: "merchantTransactionLevel",
  components: {
    showMerchantTransactionLevelDetails
  },
  data() {
    return {
      paginationControl: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0
      },
      valueToggleMerchantTransaction: false,
      filter: "",
      filter_values: "",
      columns: [
        { name: "date", required: true, label: "Date", align: "left", field: "date", sortable: true },
        { name: "tid", required: true, label: "TID", align: "center", field: "tid", sortable: true },
        { name: "rrn", required: true, label: "RRN", align: "left", field: "rrn", sortable: true },
        { name: "mid", required: true, label: "MID", align: "left", field: "mid", sortable: true },
        { name: "merchant_name", required: true, label: "Merchant Name", align: "left", field: "merchant_name", sortable: true },
        { name: "location", required: true, label: "Location", align: "left", field: "location", sortable: true },
        { name: "device_type", required: true, label: "Device Type", align: "center", field: "device_type", sortable: true },
        { name: "mcc", required: true, label: "MCC", align: "center", field: "mcc", sortable: true },
        { name: "transaction_type", required: true, label: "Transaction Type", align: "center", field: "transaction_type", sortable: true },
        { name: "transaction_amount", required: true, label: "Transaction Amount (INR)", align: "center", field: "transaction_amount", sortable: true },
        { name: "mdr", required: true, label: "MDR (INR)", align: "center", field: "mdr", sortable: true },
        { name: "gst", required: true, label: "GST (INR)", align: "center", field: "gst", sortable: true },
        { name: "source", required: true, label: "Source", align: "left", field: "source", sortable: true }
      ],
      tableData: [
        {
          id: 1,
          date: "20 Apr, 2018",
          tid: 554845,
          rrn: 4845,
          mid: 554845,
          merchant_name: "Bombay Fries",
          location: "Tamilnadu",
          device_type: "mPOS",
          mcc: 18245,
          transaction_type: "Debit",
          transaction_amount: 500,
          mdr: 5,
          gst: 2,
          source: "Bank"
        }
      ]
    };
  },
  methods: {
    rowClick(rowValues) {
      this.valueToggleMerchantTransaction = !this.valueToggleMerchantTransaction;
    },
    downloadExcel() {
       this.$q.notify("Excel download requested (Stub)");
    }
  }
};
</script>

<style>
</style>
