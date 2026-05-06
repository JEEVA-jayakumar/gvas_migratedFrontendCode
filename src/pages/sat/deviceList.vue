<template>
  <q-page>
    <div>
      <!--START: table title -->
      <div
        class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Merchant Tracker - TID</div>
      <!--END: table title -->
      <!--START: table data -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter" v-model:pagination="paginationControl"
        row-key="name"
      >
        <template v-slot:body-cell-tid="props">
          <q-td v-if="props.row" :props="props">
            <span class="label text-primary"># {{props.row.tid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-mid="props">
          <q-td v-if="props.row" :props="props">
            <span class="label text-primary"># {{props.row.mid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-transaction_amount="props">
          <q-td v-if="props.row" :props="props">Rs. {{props.row.transaction_amount}}</q-td>
        </template>
        <template v-slot:body-cell-gst="props">
          <q-td v-if="props.row" :props="props">Rs. {{props.row.gst}}</q-td>
        </template>
        <template v-slot:body-cell-net_amount="props">
          <q-td v-if="props.row" :props="props">Rs. {{props.row.net_amount}}</q-td>
        </template>
        <template v-slot:body-cell-mdr="props">
          <q-td v-if="props.row" :props="props">Rs. {{props.row.mdr}}</q-td>
        </template>

        <template v-slot:top="props">
          <!--START: table fullscreen mode -->
          <!-- <div class="col-md-4" align="right">
                  <q-btn
                    class="q-mx-xs q-py-xs text-weight-light"
                    flat
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                  />
                </div>-->
          <!--END: table fullscreen mode -->

          <!--START: table search -->
          <div class="col-md-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="SO Name,Region,DeviceType"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <!--END: table search -->
          <!--START: table search -->
          <div class="col-md-5">
            <q-select map-options emit-value
              v-model="filter_values"
              label="So Name"
              class="q-mr-lg q-py-sm"
              :options="data"
            />
          </div>
          <!--END: table search -->
        </template>
      </q-table>

      <!--END: table data -->
    </div>
  </q-page>
</template>

<script>
import downloadExcel from "vue-json-excel";

export default {
  name: "deviceList",
  components: {
    downloadExcel
  },
  data() {
    return {
      filter_values: "",
      filter: "",
      paginationControl: {
        rowsPerPage: 10
      },
      data: [
        {
          label: "John Doe",
          value: "John Doe"
        },
        {
          label: "Mithu",
          value: "Mithu"
        }
      ],
      columns: [
        {
          name: "tid",
          required: true,
          label: "TID",
          align: "left",
          field: "tid",
          sortable: true
        },
        {
          name: "mid",
          required: true,
          label: "MID",
          align: "left",
          field: "mid",
          sortable: true
        },
        {
          name: "transaction_amount",
          required: true,
          label: "Trxn Amt",
          align: "left",
          field: "transaction_amount",
          sortable: true
        },
        {
          name: "gst",
          required: true,
          label: "GST",
          align: "left",
          field: "gst",
          sortable: true
        },
        {
          name: "mdr",
          required: true,
          label: "MDR",
          align: "left",
          field: "mdr",
          sortable: true
        },
        {
          name: "net_amount",
          required: true,
          label: "Net Amt",
          align: "left",
          field: "net_amount",
          sortable: true
        },
        {
          name: "payout_id",
          required: true,
          label: "Payout ID",
          align: "left",
          field: "payout_id",
          sortable: true
        },
        {
          name: "payout_date",
          required: true,
          label: "Payout Date",
          align: "left",
          field: "payout_date",
          sortable: true
        }
      ],
      tableData: [
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        }
      ],
      json_fields: {
        TID: "tid",
        MID: "mid",
        "Trxn Amt": "transaction_amount",
        GST: "gst",
        MDR: "mdr",
        "Net Amt": "net_amount",
        "Payout ID": "payout_id",
        "Payout Date": "payout_date"
      },
      json_data: [
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        },
        {
          tid: 3366525,
          mid: 5565545,
          transaction_amount: 500,
          gst: 18,
          mdr: 10,
          net_amount: 472,
          payout_id: 33233,
          payout_date: "10-12-2018"
        }
      ],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8"
          }
        ]
      ]
    };
  }
};
</script>

<style>
</style>
