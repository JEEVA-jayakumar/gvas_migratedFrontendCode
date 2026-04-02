<template>
  <q-page>
      <div
        class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >Bijlipay Additional Terminals</div>
      
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5,10,15,20]"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-mid="props">
          <q-td :props="props">
            <span class="label text-primary"># {{props.row.mid}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadNumber="props">
          <q-td
            :props="props"
            class="cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            <span class="label text-primary"># {{props.row.leadInformation.leadNumber}}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-leadAddress="props">
          <q-td :props="props">
            {{props.row.leadInformation == null? 'NA':props.row.leadInformation.leadAddress}}
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              push
              class="q-mx-sm"
              color="positive"
              size="sm"
              @click="additionalTid(props.row)"
              label="Additional TID"
            />
          </q-td>
        </template>
        <template v-slot:top>
          <div class="col-5">
            <q-input
              clearable
              v-model="filter"
              color="grey-9"
              placeholder="Type.."
              label="Search Using MID"
              class="q-mr-lg q-py-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import generalLeadInformation from '../../components/generalLeadInformation.vue';

export default {
  name: 'getadditionalTid',
  components: {
    generalLeadInformation
  },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      paginationControl: {
        rowsNumber: 10,
        page: 1,
        sortBy: 'mid',
        descending: false,
        rowsPerPage: 10
      },
      tableData: [],
      filter: '',
      columns: [
        {
          name: 'mid',
          required: true,
          label: 'MID',
          align: 'left',
          field: 'mid',
          sortable: true
        },
        {
          name: 'leadNumber',
          required: true,
          label: 'Lead Id',
          align: 'left',
          field: row => row.leadInformation?.leadNumber,
          sortable: false
        },
        {
          name: 'leadAddress',
          required: true,
          label: 'Merchant Address',
          align: 'center',
          field: row => row.leadInformation?.leadAddress,
          sortable: false
        },
        {
          name: 'action',
          required: true,
          label: '',
          align: 'center',
          field: 'action',
          sortable: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters('additionalTid', ['getadditionalTid']),
  },
  mounted () {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions('additionalTid', ['FETCH_ADDITIONAL_TID_DATAS', 'ADDITIONAL_TID_VERIFY_DATA']),
    ajaxLoadAllLeadInfo ({ pagination, filter }) {
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });
      this.FETCH_ADDITIONAL_TID_DATAS({ pagination, filter })
        .then(res => {
          this.paginationControl = pagination;
          this.paginationControl.rowsNumber = this.getadditionalTid.totalElements;
          this.paginationControl.page = this.getadditionalTid.number + 1;
          this.tableData = this.getadditionalTid.content;
          if (this.getadditionalTid.sort != null) {
            this.paginationControl.sortBy = this.getadditionalTid.sort[0].property;
            this.paginationControl.descending = !this.getadditionalTid.sort[0].ascending;
          }
          this.$q.loading.hide();
        })
        .catch(() => {
          this.$q.loading.hide();
        });
    },
    additionalTid (reqData) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to Move Additional Tid?',
        ok: 'Continue',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Processing ..'
        })
        this.ADDITIONAL_TID_VERIFY_DATA(reqData).then(() => {
          this.$q.loading.hide();
          this.$router.push({name: "additionalTidform", params: {data: reqData}})
        }).catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: 'negative',
            message: error.data?.message || 'Error',
            icon: 'error'
          })
        });
      })
    },
    toggleLeadInformation (leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails != undefined) {
        this.addtnLeadInformation = leadDetails;
      }
    },
  } 
};
</script>
