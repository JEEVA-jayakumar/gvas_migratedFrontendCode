<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      @hide="emitfnShowAddNewAggregatorsDevice"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="q-pa-md border-bottom">
            <div class="text-h6 text-weight-regular row items-center">
              <q-icon name="add_box" size="25px" color="purple-9" class="q-mr-sm" />
              Add Aggregator Device
            </div>
          </div>
          <div class="q-pa-md">
            <div class="column q-gutter-md">
              <q-input
                v-model="formData.deviceName"
                @blur="v$.formData.deviceName.$touch"
                :error="v$.formData.deviceName.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Device Type"
                placeholder="Device Type"
              />
              <q-select
                color="grey-9"
                v-model="formData.aggregator"
                :options="dropDown.aggregatorOptions"
                @blur="v$.formData.aggregator.$touch"
                :error="v$.formData.aggregator.$error"
                label="Select Aggregator List"
                emit-value
                map-options
              />
              <div class="row items-center q-gutter-md">
                <div class="col">
                  <q-input
                    v-model="formData.colorCode"
                    label="Choose a role color"
                    readonly
                  >
                    <template v-slot:append>
                      <q-icon name="colorize" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-color v-model="formData.colorCode" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    size="sm"
                    :style="'background:' + formData.colorCode"
                  />
                </div>
              </div>
              <q-input
                v-model="formData.serialNumberLength"
                type="number"
                @blur="v$.formData.serialNumberLength.$touch"
                :error="v$.formData.serialNumberLength.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Serial Number Length"
                placeholder="Serial Number Length"
              />
            </div>
          </div>
          <div class="q-pa-md row justify-end items-center">
            <q-btn
              flat
              class="text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewAggregatorsDevice()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitDeviceType()"
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
import { required, maxValue } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

export default {
  props: ["propShowAddNewAggregatorsDevice"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModal: this.propShowAddNewAggregatorsDevice,
      formData: {
        deviceName: "",
        colorCode: "#000000",
        aggregator: null,
        serialNumberLength: null,
      },
      dropDown: {
        aggregatorOptions: [],
      },
    };
  },
  validations() {
    return {
      formData: {
        deviceName: { required },
        colorCode: { required },
        aggregator: { required },
        serialNumberLength: { required, maxValue: maxValue(50) },
      },
    };
  },
  created() {
    this.ajaxAggregatordeviceList();
  },
  computed: {
    ...mapGetters("superAdminAggregators", ["getActiveCreatedAggregatorList"]),
  },
  methods: {
    ...mapActions("superAdminAggregatorsDevice", ["CREATE_AGGREGATORS_DEVICE"]),
    ...mapActions("superAdminAggregators", [
      "GET_ACTIVE_CREATED_AGGREGATORS_LIST",
    ]),
    emitfnShowAddNewAggregatorsDevice() {
      this.$emit("emitfnShowAddNewAggregatorsDevice");
    },
    ajaxAggregatordeviceList() {
      this.GET_ACTIVE_CREATED_AGGREGATORS_LIST().then(() => {
        this.dropDown.aggregatorOptions = _.map(
          this.getActiveCreatedAggregatorList,
          (item) => ({
            value: item,
            label: item.name,
          })
        );
      });
    },
    fnfinalsubmitDeviceType() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        this.CREATE_AGGREGATORS_DEVICE(this.formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Device successfully added",
              icon: "thumb_up",
            });
            this.emitfnShowAddNewAggregatorsDevice();
            location.reload();
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              message: error.data?.message || "Error",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>
