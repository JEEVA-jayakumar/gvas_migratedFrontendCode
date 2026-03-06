<template>
  <q-page>
    <!-- content -->
    <div>
      <q-table :rows="getAllPincodes" table-class="customSATableClass" :columns="columns" :filter="filter" v-model:pagination="serverPagination" row-key="name" :loading="loading" @request="searchRequest" color="grey-9">
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <q-btn  no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md" @click="fnShowEditPincode(props.row)" flat class="text-light-blue">
              </q-btn>
              <!-- <q-btn   no-caps no-wrap label="Disable" icon="far fa-minus-square" size="md" @click="fnDisablePermission(props.row.id)" flat class="text-negative">
              </q-btn> -->
            </div>
          </q-td>
        </template>

        <template v-slot:top>
          <!--START: table title -->
          <div class="col-md-6 q-title q-mt-lg text-weight-regular">Pincodes</div>

          <div class="col-md-6 q-my-md" align="right">
            <q-btn no-caps no-wrap label="Add New Pincode" class="q-mt-lg text-weight-regular" color="purple-9"  icon="far fa-plus-square" size="md" @click="fnshowCreatePincodes()"/>
          </div>
          <!--END: table title -->

          <!--START: table filter,search -->
          <div class="col-md-5">
            <q-input
            clearable
            color="grey-9"
            v-model="filter"
            placeholder="Type.."
            class="q-mr-lg"
            />
          </div>
          <!--END: table filter,search -->
        </template>

      </q-table>

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
    </div>
  </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import addPincode from "../../components/super_admin/addPincode.vue";
import editPincode from "../../components/super_admin/editPincode.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  setup() { return { v$: useVuelidate() } },
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
