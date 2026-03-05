<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      @hide="toggleModal"
      @escape-key="toggleModal"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Prefix</div>
            </div>
          </div>
          <div class="q-pa-md">
            <q-card flat bordered style="width: 100%">
              <q-card-section>
                <div class="column q-gutter-md">
                  <q-select
                    color="grey-9"
                    v-model="formData.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select lead source"
                    placeholder="Lead source"
                    emit-value
                    map-options
                    @blur="v$.formData.leadSource.$touch"
                    :error="v$.formData.leadSource.$error"
                  />
                  <div>
                    <q-input
                      color="grey-9"
                      v-model="formData.prefix"
                      @blur="v$.formData.prefix.$touch"
                      :error="v$.formData.prefix.$error"
                      label="Enter prefix* (3 digits)"
                      placeholder="Enter prefix* (3 digits)"
                    />
                    <div
                      class="text-negative q-py-xs group text-caption"
                      v-if="v$.formData.prefix.$error"
                    >
                      <div v-if="v$.formData.prefix.required.$invalid">
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                      <div
                        v-else-if="
                          v$.formData.prefix.minLength.$invalid ||
                          v$.formData.prefix.maxLength.$invalid
                        "
                      >
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be 3 digits
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="toggleModal"
              label="Cancel"
            />
            <q-btn @click="submitCreatePrefix" color="purple-9" label="Save" />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShowAddPrefix"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModalLocal: this.propShowAddPrefix,
      dropDown: {
        leadSourceOptions: [],
      },
      formData: {
        leadSource: null,
        prefix: "",
        baseMidLength: 15,
        baseTidLength: 8,
      },
    };
  },
  computed: {
    toggleModal: {
      get() {
        return this.propShowAddPrefix;
      },
      set() {
        this.$emit("emitfnshowaddPrefix");
      },
    },
    ...mapGetters("leadSource", ["getActiveLeadSource"]),
  },
  validations() {
    return {
      formData: {
        leadSource: { required },
        prefix: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(3),
        },
      },
    };
  },
  created() {
    this.ajaxLoadData();
  },
  methods: {
    ...mapActions("leadSource", ["LEAD_SOURCE_ACTIVE_LIST"]),
    ...mapActions("Prefix", ["ADD_NEW_PREFIX"]),
    ajaxLoadData() {
      this.LEAD_SOURCE_ACTIVE_LIST().then(() => {
        this.dropDown.leadSourceOptions = _.map(
          this.getActiveLeadSource,
          (item) => ({
            value: item,
            label: item.sourceName,
          })
        );
      });
    },
    submitCreatePrefix() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        this.ADD_NEW_PREFIX(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$emit("emitfnshowaddPrefix", "refresh");
            this.$q.notify({
              color: "positive",
              message: "prefix successfully created!",
              icon: "thumb_up",
            });
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
