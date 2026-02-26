<template>
  <q-page>
    <!-- content -->
    <div class="q-pa-md">
      <div class="text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"> CRM Global Ticket Search</div>
      <div class="row q-col-gutter-md q-pt-md items-end">
        <div class="col-12 col-md-4">
          <q-input
            filled
            color="purple-9"
            clearable
            v-model="formData.searchTerm"
            placeholder="Search By Ticket ID..."
            @clear="handleClear"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            class="full-width"
            size="md"
            color="purple-9"
            @click="globalSearchSubmit"
            :disable="!formData.searchTerm"
            label="Submit"
          />
        </div>
      </div>
    </div>

    <div v-if="!tableData"
      class="row justify-center items-center q-pa-xl" style="min-height: 40vh;" >
      <div class="text-center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="text-subtitle1 text-bold text-grey-9"> No Data Available </div>
      </div>
    </div>

    <div v-else class="q-pa-md">
      <div class="row q-col-gutter-md">
        <!-- Merchant Details Card -->
        <div class="col-12 col-md-6">
          <q-card class="round-borders shadow-2">
            <q-card-section class="bg-purple-9 text-white">
              <div class="text-subtitle1 text-bold">Merchant Details</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="column q-gutter-y-sm">
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.merchantDetails.meName.label }}</div>
                  <div class="col-8 text-wrap text-primary">{{ tableData.meName }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.merchantDetails.leadId.label }}</div>
                  <div class="col-8 text-wrap text-primary"># {{ tableData.leadId }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.merchantDetails.region.label }}</div>
                  <div class="col-8 text-wrap text-primary">{{ tableData.bpRegion ? tableData.bpRegion.regionAreaName : 'NA' }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.merchantDetails.contactNumber.label }}</div>
                  <div class="col-8 text-wrap text-primary">{{ tableData.contactNumber }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Ticket Status Card -->
        <div class="col-12 col-md-6">
          <q-card class="round-borders shadow-2">
            <q-card-section class="bg-purple-9 text-white">
              <div class="text-subtitle1 text-bold">Ticket Status</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="column q-gutter-y-sm">
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.ticketStatus.ticketNumber.label }}</div>
                  <div class="col-8 text-wrap text-primary">{{ tableData.serviceReqTicketId }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.ticketStatus.ticketStatus.label }}</div>
                  <div class="col-8 text-wrap text-primary">
                    {{ (tableData.subTicketsList && tableData.subTicketsList.length > 0 && tableData.subTicketsList[0].serviceRequestSubTicketStatus) ? tableData.subTicketsList[0].serviceRequestSubTicketStatus.name : 'NA' }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.ticketStatus.createdDate.label }}</div>
                  <div class="col-8 text-wrap text-primary">{{ $moment(tableData.createdDate).format("Do MMM Y") }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.ticketStatus.updatedDate.label }}</div>
                  <div class="col-8 text-wrap text-primary">{{ $moment(tableData.updatedDate).format("Do MMM Y") }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.ticketStatus.serviceResolutionRemarks.label }}</div>
                  <div class="col-8 text-wrap text-primary">
                    {{ (tableData.subTicketsList && tableData.subTicketsList.length > 0 && tableData.subTicketsList[0].serviceResolutionRemarks) ? tableData.subTicketsList[0].serviceResolutionRemarks.name : "NA" }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-weight-medium">{{ fieldKeys.ticketStatus.resolutionRemark.label }}</div>
                  <div class="col-8 text-wrap text-primary">
                    {{ (tableData.subTicketsList && tableData.subTicketsList.length > 0) ? tableData.subTicketsList[0].resolutionRemark || "NA" : "NA" }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "globalSearchFilterValues",

  data() {
    return {
      tableData: "",
      fieldKeys: {
        merchantDetails: {
          meName: { label: "Merchant Name" },
          leadId: { label: "Lead Number" },
          region: { label: "Region" },
          contactNumber: { label: "Mobile Number" }
        },
        ticketStatus: {
          ticketNumber: { label: "Ticket Number" },
          ticketStatus: { label: "Ticket Status" },
          createdDate: { label: "Created Date" },
          updatedDate: { label: "Updated Date" },
          serviceResolutionRemarks: { label: "Service Resolution Remarks" },
          resolutionRemark: { label: "Resolution Remarks" }
        }
      },
      formData: {
        searchTerm: ""
      },
    };
  },

  computed: {
    ...mapGetters("crmGlobalSearchTicketId", ["getcrmGlobalSearchTicketId"])
  },

  methods: {
    ...mapActions("crmGlobalSearchTicketId", ["FETCH_CRM_GLOBAL_SEARCH_DATAS"]),
    globalSearchSubmit() {
      this.$q.loading.show({
          spinnerColor: 'purple-9',
          message: 'Searching..'
      });
      let params = {
        searchTerm: this.formData.searchTerm
      };
      this.FETCH_CRM_GLOBAL_SEARCH_DATAS(params)
        .then(() => {
          this.tableData = this.getcrmGlobalSearchTicketId;
          this.$q.loading.hide();
          if (!this.tableData) {
              this.$q.notify({ color: 'warning', message: 'No data found for this Ticket ID' });
          }
        })
        .catch((error) => {
          this.$q.loading.hide();
          const message = (error.body && error.body.message) ? error.body.message : "Search failed";
          this.$q.notify({ color: 'negative', message: message });
        });
    },
    handleClear() {
      this.tableData = "";
    }
  }
};
</script>
<style scoped>
.text-wrap {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.bg-purple-9 {
  background-color: #61116a !important;
}
</style>
