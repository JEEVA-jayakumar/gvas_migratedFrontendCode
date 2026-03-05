<template>
  <q-dialog
    :model-value="propToggleModal"
    @update:model-value="emitModalClose"
    @hide="emitModalClose"
    @escape-key="emitModalClose"
    persistent
    position="right"
    class="customModalOverlay"
  >
    <q-card style="min-width: 40vw; min-height: 100vh">
      <div class="q-pa-md">
        <div class="row items-center border-bottom q-pb-md">
          <div class="col">
            <div class="text-h6 text-weight-regular">Manage plan</div>
          </div>
          <div class="col-auto" align="right">
            <q-btn flat round color="dark" size="sm" icon="clear" @click="emitModalClose" />
          </div>
        </div>

        <q-card flat bordered class="q-mt-md">
          <q-card-section class="q-pa-md">
            <div class="column group">
              <div>
                <q-input
                  v-model="formData.planName"
                  @blur="v$.formData.planName.$touch"
                  :error="v$.formData.planName.$error"
                  class="text-weight-regular text-grey-8"
                  color="grey-9"
                  label="Plan"
                  placeholder="Plan"
                />
              </div>
              <div class="row justify-end q-mt-md">
                <q-btn
                  v-if="makeUpdateElementActive"
                  @click="fnFinalUpdate(formData)"
                  color="purple-9"
                  label="Update"
                />
                <q-btn v-else @click="fnFinalCreate(formData)" color="purple-9" label="Save" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="q-mt-md">
          <q-table
            :rows="tableData"
            table-class="customSATableClass"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter"
            row-key="id"
            color="grey-9"
            flat
            bordered
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
                    size="sm"
                    @click="fnFinalCreate()"
                    flat
                    class="text-light-blue"
                  />
                </div>
              </q-td>
            </template>
              <template v-slot:top="props">
                <div class="col-12">
                  <q-input
                    clearable
                    dense
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search by name, short name"
                  />
                </div>
              </template>
          </q-table>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["propToggleModal"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      makeUpdateElementActive: false,
      formData: {
        planName: "",
        planCode: 1
      },
      filterSearch: "",
      paginationControl: {
        rowsPerPage: 5
      },
      columns: [
          { name: "planName", required: true, label: "Plan Name", align: "left", field: "planName", sortable: true },
          { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
      ],
      tableData: []
    };
  },
  validations() {
    return {
      formData: {
        planName: { required },
        planCode: { required }
      }
    };
  },
  computed: {
    ...mapGetters("plan", ["getActivePlan"])
  },
  created() {
    this.getPlan();
  },
  methods: {
    ...mapActions("plan", ["ADD_NEW_PLAN", "PLAN_ACTIVE_LIST"]),
    getPlan() {
      this.$q.loading.show({ message: "Loading..." });
      this.PLAN_ACTIVE_LIST().then(() => {
        this.tableData = this.getActivePlan;
        this.$q.loading.hide();
      }).catch(() => { this.$q.loading.hide(); });
    },
    emitModalClose() {
      this.$emit("emitToggleModal");
    },
    fnFinalCreate() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
          this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        this.ADD_NEW_PLAN(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Plan successfully added",
              icon: "thumb_up"
            });
            this.emitModalClose();
            location.reload();
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Error",
              icon: "thumb_down"
            });
          });
      }
    },
    fnFinalUpdate() {},
    myCustomSearchFilter(rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter(row =>
        cols.some(col => (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1)
      );
    }
  }
};
</script>
