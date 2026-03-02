<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-purple-9 col">Pincodes</div>
        <div class="col-auto">
          <q-btn
            unelevated
            no-caps
            label="Add New Pincode"
            color="purple-9"
            icon="add"
            @click="fnshowCreatePincodes"
          />
        </div>
      </div>

      <q-table
        flat
        bordered
        :rows="getAllPincodes"
        :columns="columns"
        :filter="filter"
        v-model:pagination="serverPagination"
        row-key="id"
        :loading="loading"
        @request="searchRequest"
        color="purple-9"
      >
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            clearable
            color="purple-9"
            v-model="filter"
            placeholder="Search Pincode"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              dense
              unelevated
              no-caps
              label="Modify"
              icon="edit"
              color="primary"
              size="sm"
              @click="fnShowEditPincode(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modals -->
    <addPincode
      v-if="propShowCreatePincodes"
      :propShowCreatePincodes="propShowCreatePincodes"
      @emitfnshowAddPincodes="fnshowCreatePincodes"
    />

    <editPincode
      v-if="propShowEditPincodes"
      :propShowEditPincodes="propShowEditPincodes"
      :propRowDetails="propRowDetails"
      @emitfnshowEditPincodes="fnShowEditPincode"
    />
  </q-page>
</template>

<script>
import addPincode from "../../components/super_admin/addPincode.vue";
import editPincode from "../../components/super_admin/editPincode.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PincodeManagement",
  components: {
    addPincode,
    editPincode
  },
  data() {
    return {
      propShowCreatePincodes: false,
      propShowEditPincodes: false,
      propRowDetails: null,
      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10,
        rowsPerPage: 10
      },
      filter: "",
      columns: [
        { name: "pincode", label: "Pincode", align: "left", field: "pincode", sortable: true },
        { name: "stateName", label: "State", align: "left", field: "stateName", sortable: true },
        { name: "cityName", label: "City", align: "left", field: "cityName", sortable: true },
        { name: "action", label: "Action", align: "center" }
      ]
    };
  },
  created() {
    this.ajaxLoadData();
  },
  computed: {
    ...mapGetters("pincodes", ["getAllPincodes"])
  },
  methods: {
    ...mapActions("pincodes", ["FETCH_ALL_PINCODES"]),

    async ajaxLoadData() {
      this.loading = true;
      this.$q.loading.show({ message: "Please Wait" });
      try {
        await this.FETCH_ALL_PINCODES();
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: error.body?.message || "Please Try Again Later !",
          icon: "warning"
        });
      } finally {
        this.$q.loading.hide();
        this.loading = false;
      }
    },

    fnshowCreatePincodes() {
      this.propShowCreatePincodes = !this.propShowCreatePincodes;
      if (!this.propShowCreatePincodes) this.ajaxLoadData();
    },

    fnShowEditPincode(rowDetails) {
      this.propShowEditPincodes = !this.propShowEditPincodes;
      if (rowDetails) this.propRowDetails = rowDetails;
      if (!this.propShowEditPincodes) this.ajaxLoadData();
    },

    searchRequest({ pagination, filter }) {
      this.loading = true;
      this.FETCH_ALL_PINCODES(filter)
        .then(() => {
          this.serverPagination = pagination;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
