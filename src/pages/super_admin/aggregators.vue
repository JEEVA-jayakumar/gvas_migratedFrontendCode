<template>
    <q-page>
        <!-- content -->
        <div>
            <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" align="left" @update:model-value="changeTabs">
                <q-tab color="dark" name="active" label="Active Aggregators" />
                <q-tab color="dark" name="deactive" label="Deactive Aggregators" />
            </q-tabs>

            <q-tab-panels v-model="selectedTab" animated keep-alive>
                <q-tab-panel name="active" class="no-padding">
                    <q-table :rows="activeTableData" table-class="customSATableClass" :columns="columns"
                        :filter="filterSearch" v-model:pagination="paginationControl"
                        :filter-method="myCustomSearchFilter" row-key="id" color="grey-9">
                        <template v-slot:body-cell-action="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <q-btn dense no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                                        @click="fnShowEditAggregator(props.row)" flat class="text-light-blue"></q-btn>
                                    <q-btn dense no-caps no-wrap label="Disable" icon="far fa-minus-square" size="md"
                                        @click="fnDeleteAggregators(props.row)" flat class="text-negative"></q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:top>
                            <div class="col-6">
                                <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.."
                                    class="q-mr-lg" />
                            </div>
                            <div class="col-6" align="right">
                                <q-btn no-caps class="text-weight-regular" label="Add New Aggregators"
                                    @click="fnShowAddNewAggregators()" color="purple-9" size="md" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>

                <q-tab-panel name="deactive" class="no-padding">
                    <q-table :rows="deActiveTableData" table-class="customSATableClass" :columns="columns1"
                        :filter="filterSearch" v-model:pagination="paginationControl"
                        :filter-method="myCustomSearchFilter" row-key="id" color="grey-9">
                        <template v-slot:body-cell-action1="props">
                            <q-td :props="props">
                                <div class="row no-wrap no-padding">
                                    <q-btn dense no-caps no-wrap label="Active" icon="far fa-plus-square" size="md"
                                        @click="fnActivate(props.row)" flat class="text-positive"></q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template v-slot:top>
                            <div class="col-6">
                                <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.."
                                    class="q-mr-lg" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>
            </q-tab-panels>

            <showEditAggregator v-if="propShowEditAggregator" :propShowEditAggregator="propShowEditAggregator"
                :propRowDetails="propRowDetails" @emitfnShowEditAggregator="fnShowEditAggregator" />

            <ShowAddNewAggregators v-if="propShowAddNewAggregators"
                :propShowAddNewAggregators="propShowAddNewAggregators" :propRowDetails="propRowDetails"
                @emitfnShowAddNewAggregators="fnShowAddNewAggregators" />
        </div>
    </q-page>
</template>

<script>
import showEditAggregator from "../../components/super_admin/showEditAggregator.vue";
import ShowAddNewAggregators from "../../components/super_admin/ShowAddNewAggregators.vue";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "Aggregators",
    components: {
        showEditAggregator,
        ShowAddNewAggregators,
    },
    data() {
        return {
            propShowEditAggregator: false,
            propShowAddNewAggregators: false,
            propRowDetails: "",
            filterSearch: "",
            selectedTab: "active",
            paginationControl: {
                rowsPerPage: 10
            },
            columns: [
                { name: "name", required: true, label: "Aggregator", align: "left", field: "name", sortable: false },
                { name: "action", required: true, label: "", align: "left", field: "action", sortable: false }
            ],
            columns1: [
                { name: "name", required: true, label: "Aggregator", align: "left", field: "name", sortable: false },
                { name: "action1", required: true, label: "", align: "left", field: "action1", sortable: false }
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

        changeTabs(tab) {
            this.ajaxLoadDataForRegionTable();
        },

        ajaxLoadDataForRegionTable() {
            this.$q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
            this.GET_CREATED_AGGREGATORS_LIST()
                .then(() => {
                    this.activeTableData = this.getCreatedAggregatorList.filter(service => service.active == true);
                    this.deActiveTableData = this.getCreatedAggregatorList.filter(service => service.active == false);
                    this.$q.loading.hide();
                })
                .catch((error) => {
                    this.$q.loading.hide();
                    this.$q.notify({
                        color: "negative",
                        position: "bottom",
                        message: error.data?.message || "Please Try Again Later !",
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
                this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
                this.EDIT_CREATED_AGGREGATORS(request)
                    .then(() => {
                        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Activated", icon: "thumb_up" });
                        this.ajaxLoadDataForRegionTable();
                    })
                    .catch(() => {
                        this.$q.notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" });
                    }).finally(() => { this.$q.loading.hide(); });
            });
        },
        fnDeleteAggregators(rowDetails) {
            this.$q.dialog({
                title: "Confirm",
                message: "Are you sure want to delete region?",
                ok: "Continue",
                cancel: "Cancel"
            }).onOk(() => {
                this.$q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });
                this.DELETE_CREATED_AGGREGATORS(rowDetails)
                    .then(() => {
                        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully removed", icon: "thumb_up" });
                        this.ajaxLoadDataForRegionTable();
                    })
                    .catch(() => {
                        this.$q.notify({ color: "negative", position: "bottom", message: "Please try again!", icon: "thumb_down" });
                    }).finally(() => { this.$q.loading.hide(); });
            });
        },
        fnShowAddNewAggregators(rowDetails) {
            this.propShowAddNewAggregators = !this.propShowAddNewAggregators;
            this.propRowDetails = rowDetails;
            if (!this.propShowAddNewAggregators) this.ajaxLoadDataForRegionTable();
        },
        fnShowEditAggregator(rowDetails, token) {
            this.propShowEditAggregator = !this.propShowEditAggregator;
            this.propRowDetails = rowDetails;
            if (!this.propShowEditAggregator || token == "refresh") {
                this.ajaxLoadDataForRegionTable();
            }
        },
        myCustomSearchFilter(rows, terms, cols, cellValue) {
            const lowerTerms = terms ? terms.toLowerCase() : "";
            return rows.filter(row =>
                cols.some(
                    col =>
                        (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
                )
            );
        }
    }
};
</script>
