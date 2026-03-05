<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowEditIssueMapping"
      @escape-key="emitfnshowEditIssueMapping"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">
                Modify Issue Mapping Info
              </div>
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
                label="Issue Mapping"
                placeholder="Issue Mapping"
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
              @click="emitfnshowEditIssueMapping()"
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

    <showServiceSubTaskDetails
      v-if="propShowServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="propShowServiceSubTaskDetails"
      :propRowDetails2="propRowDetails2"
      @emitfnshowServiceSubTaskDetails="fnShowSubTaskDetails"
    />
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
import showServiceSubTaskDetails from "../../components/super_admin/showServiceSubTaskDetails.vue";

export default {
  components: {
    showServiceSubTaskDetails,
  },
  props: ["propShowEditIssueMapping", "propRowDetails2"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowEditIssueMapping,
      csSubIssueType: [],
      selectedItem: [],
      propShowServiceSubTaskDetails: false,
      formData: {
        name: this.propRowDetails2.name,
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
      "EDIT_ISSUE_MAPPING",
      "FETCH_ACTIVE_CS_SUB_ISSUE_DATAS",
    ]),
    emitfnshowEditIssueMapping() {
      this.$emit("emitfnshowEditIssueMapping");
    },
    getcsSubIssueTypes() {
      this.FETCH_ACTIVE_CS_SUB_ISSUE_DATAS().then(() => {
        this.csSubIssueType = _.map(this.getcsActiveSubIssueDetails, (item) => item);
      });
    },
    fnShowSubTaskDetails(rowDetails) {
      this.propShowServiceSubTaskDetails = !this.propShowServiceSubTaskDetails;
      this.propRowDetails2 = rowDetails;
    },
    fnfinalsubmitIssueMapping() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        let list = this.selectedItem.map((item) => ({ id: item.id }));
        let param = {
          id: this.propRowDetails2.id,
          request: {
            name: this.formData.name,
            csSubIssue: list,
          },
        };
        this.EDIT_ISSUE_MAPPING(param)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.emitfnshowEditIssueMapping();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
