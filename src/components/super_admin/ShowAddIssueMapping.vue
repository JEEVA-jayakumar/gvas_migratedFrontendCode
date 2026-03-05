<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewIssueMapping"
      @escape-key="emitfnShowAddNewIssueMapping"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Issue Mapping</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.name"
                @blur="v$.formData.name.$touch"
                :error="v$.formData.name.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Enter Issue Mapping Name"
                placeholder="Enter Issue Mapping Name"
                @keyup.enter="fnfinalsubmitIssueMapping()"
              />
            </div>
          </div>

          <div class="q-pa-md">
            <p class="text-weight-bold">CS Sub Issue*</p>
            <div class="column q-gutter-sm">
              <div
                v-for="menu in csSubIssueType"
                :key="menu.id"
                class="row items-center"
              >
                <q-checkbox
                  v-model="selectedItem"
                  :val="menu"
                  :label="menu.name"
                  color="purple-9"
                />
              </div>
            </div>
          </div>

          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewIssueMapping()"
              label="Cancel"
            />
            <q-btn
              :disable="selectedItem.length === 0"
              @click="fnfinalsubmitIssueMapping()"
              color="purple-9"
              label="Save"
            />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShowAddIssueMapping", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddIssueMapping,
      csSubIssueType: [],
      selectedItem: [],
      formData: {
        name: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        name: { required },
      },
    };
  },
  computed: {
    ...mapGetters("serviceRequest", ["getcsActiveSubIssueDetails"]),
  },
  created() {
    this.getcsSubIssueTypes();
  },
  methods: {
    ...mapActions("serviceRequest", [
      "UPDATE_ISSUE_MAPPING",
      "FETCH_ACTIVE_CS_SUB_ISSUE_DATAS",
    ]),
    emitfnShowAddNewIssueMapping() {
      this.$emit("emitfnShowAddNewIssueMapping");
    },
    getcsSubIssueTypes() {
      this.FETCH_ACTIVE_CS_SUB_ISSUE_DATAS().then(() => {
        this.csSubIssueType = _.map(this.getcsActiveSubIssueDetails, (item) => item);
      });
    },
    fnfinalsubmitIssueMapping() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        let list = this.selectedItem.map((item) => ({ id: item.id }));
        let param = {
          name: this.formData.name,
          csSubIssue: list,
        };
        this.UPDATE_ISSUE_MAPPING(param)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnShowAddNewIssueMapping", "refresh");
            this.$q.notify({
              color: "positive",
              message: "Added Successfully",
              icon: "thumb_up",
            });
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Error",
            });
          });
      }
    },
  },
};
</script>
