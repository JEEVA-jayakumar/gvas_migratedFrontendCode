<template>
    <q-page>
        <!-- content -->
        <div>

            <q-tabs
                v-model="tab"
                class="shadow-1"
                active-bg-color="grey-1"
                active-color="dark"
                indicator-color="transparent"
                align=""
            >
                <q-tab name="active" label="Active Aggregators" />
                <q-tab name="deactive" label="Deactive Aggregators" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated class="bg-transparent">
                <q-tab-panel name="active" class="no-padding">
                    <q-table
                        :rows="activeTableData"
                        table-class="customSATableClass"
                        :columns="columns"
                        :filter="filterSearch"
                        v-model:pagination="paginationControl"
                        :filter-method="myCustomSearchFilter"
                        row-key="id"
                        color="grey-9"
                    >
                        <template v-slot:body-cell-action="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <q-btn  no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                                        @click="fnShowEditAggregator(props.row)" flat class="text-light-blue"></q-btn>
                                    <q-btn  no-caps no-wrap label="Disable" icon="far fa-minus-square" size="md"
                                        @click="fnDeleteAggregators(props.row)" flat class="text-negative"></q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:top>
                            <div class="col-6">
                                <q-input
                                    clearable
                                    color="grey-9"
                                    v-model="filterSearch"
                                    placeholder="Type.."
                                    class="q-mr-lg"
                                >
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-6" align="right">
                                <q-btn no-caps class="text-weight-regular" label="Add New Aggregators"
                                    @click="fnShowAddNewAggregators()" color="purple-9" size="md" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="deactive" class="no-padding">
                    <q-table
                        :rows="deActiveTableData"
                        table-class="customSATableClass"
                        :columns="columns1"
                        :filter="filterSearch"
                        v-model:pagination="paginationControl"
                        :filter-method="myCustomSearchFilter"
                        row-key="id"
                        color="grey-9"
                    >
                        <template v-slot:body-cell-action1="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <q-btn  no-caps no-wrap label="Active" icon="far fa-plus-square" size="md"
                                        @click="fnActivate(props.row)" flat class="text-positive"></q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:top>
                            <div class="col-6">
                                <q-input
                                    clearable
                                    color="grey-9"
                                    v-model="filterSearch"
                                    placeholder="Type.."
                                    class="q-mr-lg"
                                >
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>
            </q-tab-panels>

            <!-- Modals -->
            <showEditAggregator
                v-if="propShowEditAggregator"
                :propShowEditAggregator="propShowEditAggregator"
                :propRowDetails="propRowDetails"
                @emitfnShowEditAggregator="fnShowEditAggregator"
            />

            <ShowAddNewAggregators
                v-if="propShowAddNewAggregators"
                :propShowAddNewAggregators="propShowAddNewAggregators"
                @emitfnShowAddNewAggregators="fnShowAddNewAggregators"
            />

        </div>
    </q-page>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import showEditAggregator from "../../components/super_admin/showEditAggregator.vue";
import ShowAddNewAggregators from "../../components/super_admin/ShowAddNewAggregators.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  setup() { return { v$: useVuelidate() } },
    name: "AggregatorsPage",
    components: {
        showEditAggregator,
        ShowAddNewAggregators,
    },
    data() {
        return {
            tab: 'active',
            propShowEditAggregator: false,
            propShowAddNewAggregators: false,
            propRowDetails: "",
            filterSearch: "",
            paginationControl: {
                rowsPerPage: 10
            },
            columns: [
                {
                    name: "name",
                    required: true,
                    label: "Aggregator",
                    align: "left",
                    field: "name",
                    sortable: false
                },
                {
                    name: "action",
                    required: true,
                    label: "",
                    align: "left",
                    field: "action",
                    sortable: false
                }
            ],
            columns1: [
                {
                    name: "name",
                    required: true,
                    label: "Aggregator",
                    align: "left",
                    field: "name",
                    sortable: false
                },
                {
                    name: "action1",
                    required: true,
                    label: "",
                    align: "left",
                    field: "action1",
                    sortable: false
                }
            ],
            activeTableData: [],
            deActiveTableData: [],
        };
    },

    created() {
        this.ajaxLoadDataForRegionTable();
    },

    computed: {
        ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList"])
    },

    methods: {
        ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "DELETE_CREATED_AGGREGATORS", "EDIT_CREATED_AGGREGATORS"]),

        ajaxLoadDataForRegionTable() {
            this.$q.loading.show({
                delay: 0,
                spinnerColor: 'purple-9',
                message: 'Fetching data ..'
            });
            this.GET_CREATED_AGGREGATORS_LIST()
                .then(response => {
                    this.activeTableData = this.getCreatedAggregatorList.filter(service => service.active == true);
                    this.deActiveTableData = this.getCreatedAggregatorList.filter(service => service.active == false);
                    this.$q.loading.hide();
                })
                .catch((error) => {
                    this.$q.loading.hide();
                    this.$q.notify({
                        color: "negative",
                        position: "bottom",
                        message: error.body?.message || "Please Try Again Later !",
                        icon: "thumb_down",
                    });
                });
        },

        fnActivate(request) {
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure want to active?",
                ok: "Continue",
                cancel: "Cancel"
            }).onOk(() => {
                this.$q.loading.show({
                    delay: 100,
                    message: "Please Wait",
                    spinnerColor: "purple-9"
                });
                let payload = { ...request, active: true };
                this.EDIT_CREATED_AGGREGATORS(payload)
                    .then(response => {
                        this.ajaxLoadDataForRegionTable();
                        this.$q.notify({
                            color: "positive",
                            position: "bottom",
                            message: "Successfully Activated",
                            icon: "thumb_up"
                        });
                    })
                    .finally(() => {
                        this.$q.loading.hide();
                    });
            });
        },

        fnDeleteAggregators(rowDetails) {
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure want to delete aggregator?",
                ok: "Continue",
                cancel: "Cancel"
            }).onOk(() => {
                this.$q.loading.show({
                    delay: 100,
                    message: "Please Wait",
                    spinnerColor: "purple-9"
                });
                this.DELETE_CREATED_AGGREGATORS(rowDetails)
                    .then(response => {
                        this.ajaxLoadDataForRegionTable();
                        this.$q.notify({
                            color: "positive",
                            position: "bottom",
                            message: "Successfully removed",
                            icon: "thumb_up"
                        });
                    })
                    .finally(() => {
                        this.$q.loading.hide();
                    });
            });
        },

        fnShowAddNewAggregators() {
            this.propShowAddNewAggregators = !this.propShowAddNewAggregators;
            if (this.propShowAddNewAggregators == false) {
                this.ajaxLoadDataForRegionTable();
            }
        },

        fnShowEditAggregator(rowDetails) {
            this.propShowEditAggregator = !this.propShowEditAggregator;
            this.propRowDetails = rowDetails;
            if (this.propShowEditAggregator == false) {
                this.ajaxLoadDataForRegionTable();
            }
        },

        myCustomSearchFilter(rows, terms, cols, cellValue) {
            const lowerTerms = terms ? terms.toLowerCase() : "";
            return rows.filter(row =>
                cols.some(col => (cellValue(col, row) + "").toLowerCase().includes(lowerTerms))
            );
        }
    }
};
</script>
