<template>
  <q-page>
    <div>
      <div>
        <q-table
          table-class="customTableClass"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          v-model:pagination="paginationControl"
          row-key="id"
          @request="ajaxLoadAllLeadInfo"
        >
          <template v-slot:body-cell-created_at="props">
            <q-td v-if="props.row" :props="props">{{
              props.row.created_at == null ? "NA" :
                $moment(props.row.created_at).format("Do MMM Y")
            }}</q-td>
          </template>
          <template v-slot:body-cell-updated_at="props">
            <q-td v-if="props.row" :props="props">{{
              props.row.updated_at == null ? "NA" :
                $moment(props.row.updated_at).format("Do MMM Y")
            }}</q-td>
          </template>
          <template v-slot:top>
            <div class="col-md-5">
              <q-input
                dense
                clearable
                v-model="filter"
                color="grey-9"
                placeholder="Type.."
                label="Pod Number, Device Type"
                class="q-mr-lg q-py-sm"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-md-5">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm float-right"
                size="md"
                @click="downloadAggregatorsInventoryWithSoList"
              />
            </div>
          </template>
        </q-table>
      </div>

      <DownloadAggregatorsInventoryWithSoList
        v-if="propInventoryWithSo"
        :propInventoryWithSo="propInventoryWithSo"
        @emitfnshowInventoryWithSo="downloadAggregatorsInventoryWithSoList"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DownloadAggregatorsInventoryWithSoList from "../../components/inventory/DownloadAggregatorsInventoryWithSoList.vue";

export default {
  name: "AggregatorInventoryWithSo",
  components: {
    DownloadAggregatorsInventoryWithSoList
  },
  data() {
    return {
      propInventoryWithSo: false,
      paginationControl: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0
      },
      tableData: [],
      filter: "",
      columns: [
        {
          name: "soname",
          required: true,
          label: "So Name",
          align: "center",
          field: row => row.name + " | " + row.soEmpId,
          sortable: true
        },
        {
          name: "pod_number",
          label: "podNumber",
          field: "pod_number",
          align: "center",
          sortable: true
        },
        {
          name: "serial_number",
          label: "serialNumber",
          field: "serial_number",
          align: "center",
          sortable: true
        },
        {
          name: "device_name",
          required: true,
          label: "Device Type",
          align: "center",
          field: "device_name",
          sortable: true
        },
        {
          name: "created_at",
          required: true,
          label: "Create Date",
          align: "center",
          field: row => row.created_at
        },
        {
          name: "updated_at",
          required: true,
          label: "Receive Date",
          align: "center",
          field: row => row.updated_at
        },
        {
          name: "region_name",
          required: true,
          label: "BPRegion",
          align: "center",
          field: "region_name",
          sortable: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters("InventoryWithSo", ["getAllAggregatorsInventoryWithSo"]),
  },
  created() {
    this.AggregatorsValues();
  },
  methods: {
    ...mapActions("InventoryWithSo", ["FETCH_AGGREGATORS_INVENTORY_WITH_SO"]),
    downloadAggregatorsInventoryWithSoList() {
      this.propInventoryWithSo = !this.propInventoryWithSo;
    },
    ajaxLoadAllLeadInfo() {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      this.FETCH_AGGREGATORS_INVENTORY_WITH_SO()
        .then(res => {
          this.tableData = this.getAllAggregatorsInventoryWithSo;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    AggregatorsValues() {
      this.ajaxLoadAllLeadInfo();
    }
  }
};
</script>

<style>
</style>
