<template>
  <q-page>
    <!-- content -->
    <div>
      <q-table
        :rows="getAllPincodes"
        table-class="customSATableClass"
        :columns="columns"
        :filter="filter"
        v-model:pagination="serverPagination"
        row-key="id"
        :loading="loading"
        @request="searchRequest"
        color="grey-9"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                no-caps
                no-wrap
                label="Modify"
                icon="far fa-plus-square"
                size="md"
                @click="fnShowEditPincode(props.row)"
                flat
                class="text-light-blue"
              ></q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:top>
          <!--START: table title -->
          <div class="col-md-6 q-title q-mt-lg text-weight-regular">Pincodes</div>

          <div class="col-md-6 q-my-md" align="side">
            <q-btn
              no-caps
              no-wrap
              label="Add New Regions"
              class="q-mt-lg text-weight-regular"
              color="purple-9"
              icon="far fa-plus-square"
              size="md"
              @click="fnshowCreatePincodes()"
            />
          </div>
          <!--END: table title -->

          <!--START: table filter,search -->
          <div class="col-md-5">
            <q-input
              clearable
              color="grey-9"
              v-model="filter"
              placeholder="Type.."
              label="Search by name"
              class="q-mr-lg"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <!--END: table filter,search -->
        </template>
      </q-table>

      <!--START: Show create Pincode -->
      <addPincode
        v-if="propShowCreatePincodes"
        :propShowCreatePincodes="propShowCreatePincodes"
        @emitfnshowAddPincodes="fnshowCreatePincodes"
      ></addPincode>
      <!--END: Show create Pincode -->

      <!--START: Show edit Pincode -->
      <editPincode
        v-if="propShowEditPincodes"
        :propShowEditPincodes="propShowEditPincodes"
        :propRowDetails="propRowDetails"
        @emitfnshowEditPincodes="fnShowEditPincode"
      ></editPincode>
      <!--END: Show edit Pincode -->
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
  name: "Subregions",
  components: {
    addPincode,
    editPincode
  },
  data() {
    return {
      propShowCreatePincodes: false,
      propShowEditPincodes: false,
      propRowDetails: "",

      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },

      filter: "",
      columns: [
        { name: "pincode", required: true, label: "Pincode", align: "", field: "pincode", sortable: false },
        { name: "stateName", required: true, label: "State", align: "", field: "stateName", sortable: false },
        { name: "cityName", required: true, label: "City", align: "", field: "cityName", sortable: false },
        { name: "action", required: true, label: "", align: "", field: "action", sortable: false }
      ]
    };
  },

  created() {
    this.ajaxLoadDataForPermissionTable();
  },

  computed: {
    ...mapGetters("pincodes", ["getAllPincodes"])
  },

  methods: {
    ...mapActions("pincodes", ["FETCH_ALL_PINCODES"]),

    ajaxLoadDataForPermissionTable() {
      this.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9"
      });
      this.FETCH_ALL_PINCODES()
        .then(response => {
          this.$q.loading.hide();
        }).catch(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.body?.message || "Please Try Again Later !",
            icon: "thumb_down"
          });
        });
    },
    fnshowCreatePincodes() {
      this.propShowCreatePincodes = !this.propShowCreatePincodes;
    },

    fnShowEditPincode(rowDetails) {
      this.propShowEditPincodes = !this.propShowEditPincodes;
      if (rowDetails != undefined) {
        this.propRowDetails = rowDetails;
      }
    },

    searchRequest(props) {
      const { pagination, filter } = props;
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
