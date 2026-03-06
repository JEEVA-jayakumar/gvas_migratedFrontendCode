<template>
    <div>
        <q-dialog v-model="toggleModal" @hide="emitfnShowAddNewAggregatorsDevice" persistent
            class="customModalOverlay" :content-css="{ padding: '30px', minWidth: '30vw' }">
<q-card style="min-width: 350px;">

            <form>
                <div class="text-h6 text-weight-regular q-py-md bottom-border items-center">
                    <q-icon name="add_box" size="25px" color="purple-9" />Add Aggregator Device
                </div>
                <div class="column-inline q-py-md gutter-sm items-center">
                    <div>
                        <q-input v-model="formData.deviceName" @blur="$v.formData.deviceName.$touch"
                            :error="$v.formData.deviceName.$error" class="text-weight-regular text-grey-8"
                            color="grey-9" label="Device Type" placeholder="Device Type" />
                    </div>
                    <div>
                        <q-select color="grey-9" v-model="formData.aggregator" :options="dropDown.aggregatorOptions"
                            @blur="$v.formData.aggregator.$touch" :error="$v.formData.aggregator.$error"
                            label="Select Aggregator List" />
                    </div>
                    <div>
                        <div class="row">
                            <div class="col">
                                <q-color v-model="formData.colorCode" @blur="$v.formData.colorCode.$touch"
                                    :error="$v.formData.colorCode.$error" popover label="Choose a role color"
                                    color="grey-9" />
                            </div>
                            <div class="col-auto">
                                <q-btn round :style="'background:' + formData.colorCode" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <q-input v-model="formData.serialNumberLength" type="number"
                            @blur="$v.formData.serialNumberLength.$touch" :error="$v.formData.serialNumberLength.$error"
                            class="text-weight-regular text-grey-8" color="grey-9" label="Serial Number Length"
                            placeholder="Serial Number Length" />
                    </div>
                    <div class="group" align="right">
                        <q-btn outline align="right" icon="block" class="text-weight-regular text-grey-8" color="grey-6"
                            @click="emitfnShowAddNewAggregatorsDevice()" label="Cancel" />
                        <q-btn align="right" icon="check" @click="fnfinalsubmitDeviceType(formData)" color="purple-9"
                            label="save" />
                    </div>
                </div>
            </form>

</q-card>
</q-dialog>
    </div>
</template>
  
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxValue } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  setup() { return { v$: useVuelidate() } },
    props: ["propShowAddNewAggregatorsDevice"],
    data() {
        return {
            toggleModal: this.propShowAddNewAggregatorsDevice,
            formData: {
                deviceName: "",
                colorCode: "",
                aggregator: ""
            },
            dropDown: {
                aggregatorOptions: []
            },
        };
    },

    validations: {
        formData: {
            deviceName: {
                required
            },
            colorCode: {
                required
            },
            aggregator: {
                required
            },
            serialNumberLength: {
                required,
                // Restricting device serial number length
                maxValue: maxValue(50)
            }
        }
    },
    created() {
        this.ajaxAggregatordeviceList();
    },
    computed: {
    $v() { return this.v$; },
        ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"])
    },
    methods: {
        ...mapActions("SA_Devices", [
            "FEED_DEVICE_TYPE_DATA",
            "FETCH_DEVICES_DATA"
        ]),
        ...mapActions("superAdminAggregatorsDevice", ["CREATE_AGGREGATORS_DEVICE"]),
        ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
        emitfnShowAddNewAggregatorsDevice() {
            this.$emit("emitfnShowAddNewAggregatorsDevice");
        },
        ajaxAggregatordeviceList() {
            let self = this;
            self.GET_ACTIVE_CREATED_AGGREGATORS_LIST()
                .then(() => {
                    return _.map(self.getActiveCreatedAggregatorList, item => {
                        self.dropDown.aggregatorOptions.push({
                            value: item,
                            label: item.name
                        });
                    });
                })
        },
        fnfinalsubmitDeviceType(requestParams) {
            this.$v.formData.$touch();
            if (this.$v.formData.$error) {
                this.$q.notify("Please review fields again.");
            } else {
                this.$q.loading.show();
                this.CREATE_AGGREGATORS_DEVICE(requestParams)
                    .then(response => {
                        this.$q.loading.hide();
                        this.$q.notify({
                            color: "positive",
                            position: "bottom",
                            message: "Device successfully added",
                            icon: "thumb_up"
                        });
                        //   this.FETCH_DEVICES_DATA();
                        this.emitfnShowAddNewAggregatorsDevice("emitfnShowAddNewAggregatorsDevice");
                        location.reload();
                    }).catch(() => {
                        this.$q.loading.hide();
                        this.$q.notify({
                            color: "negative",
                            position: "bottom",
                            message: error.data.message,
                            icon: "thumb_down"
                        });
                    });
            }
        }
    }
};
</script>
  