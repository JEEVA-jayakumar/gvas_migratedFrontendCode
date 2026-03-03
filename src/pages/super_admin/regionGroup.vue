<template>
    <q-page>
        <!-- content -->
        <div>

            <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" align="left">
                <q-tab color="dark" name="active" label="Active RegionsGroups" />
            </q-tabs>
            <q-tab-panels v-model="selectedTab" animated keep-alive>
                <q-tab-panel name="active" class="no-padding">
                    <q-table 
                    :rows="activeTableData"
                     table-class="customSATableClass" 
                     :columns="columns"
                        :filter="filterSearch" v-model:pagination="paginationControl"
                        :filter-method="myCustomSearchFilter" 
                        row-key="id"
                        color="grey-9">

                        <template v-slot:body-cell-regionGroup="props">
                          <q-td :props="props">
                            {{ props.row.regionName == null ? "NA" : props.row.regionName }}
                          </q-td>
                        </template>

                        <template v-slot:body-cell-action="props">
                          <q-td :props="props">
                            <div class="row no-wrap no-padding">
                                <q-btn dense no-caps no-wrap label="Modify" icon="far fa-plus-square" size="md"
                                    @click="fnShowEditRegionsGroup(props.row)" flat class="text-light-blue"></q-btn>
                            </div>
                          </q-td>
                        </template>

                        <template v-slot:top>
                            <!--START: table filter,search -->
                            <div class="col-6">
                                <q-input clearable color="grey-9" v-model="filterSearch" placeholder="Type.."
                                    class="q-mr-lg" label="Search">
                                    <template v-slot:append>
                                      <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                            <!--END: table filter,search -->
                            <div class="col-6" align="right">
                                <q-btn no-caps class="text-weight-regular" label="Add New RegionGroup"
                                    @click="fnShowAddNewRegionsGroups()" color="purple-9" size="md" />
                            </div>
                        </template>
                    </q-table>
                </q-tab-panel>
            </q-tab-panels>

            <!--START: Show edit Regions -->
            <showEditRegionGroup v-if="propShowEditRegionsGroup" :propShowEditRegionsGroup="propShowEditRegionsGroup"
                :propRowDetails="propRowDetails" @emitfnshowRegionsGroup="fnShowEditRegionsGroup" />
            <!--END: Show edit Regions -->

            <!--START regiongroup-->
            <ShowAddNewRegionGroup v-if="propShowAddNewRegionsGroup"
                :propShowAddNewRegionsGroup="propShowAddNewRegionsGroup" :propRowDetails="propRowDetails"
                @emitfnShowAddNewRegionsGroups="fnShowAddNewRegionsGroups" />
            <!--END regiongroup-->

        </div>
    </q-page>
</template>

<script>
import showEditRegionGroup from "../../components/super_admin/showEditRegionGroup.vue";
import ShowAddNewRegionGroup from "../../components/super_admin/ShowAddNewRegionGroup.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "RegionGroupManagement",
    components: {
        showEditRegionGroup,
        ShowAddNewRegionGroup,
    },
    data() {
        return {
            selectedTab: 'active',
            propShowEditRegionsGroup: false,
            propShowAddNewRegionsGroup: false,
            propRowDetails: "",
            filterSearch: "",
            paginationControl: {
                rowsPerPage: 10
            },
            columns: [
                {
                    name: "regionGroup",
                    required: true,
                    label: "Region group",
                    align: "left",
                    field: row => row.regionName,
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
            activeTableData: [],
        };
    },

    created() {
        this.ajaxLoadDataForRegionTable();
    },

    computed: {
        ...mapGetters("regionGroupDatas", ["getAllRegionGroupData"])
    },

    methods: {
        ...mapActions("regionGroupDatas", ["FETCH_REGION_GROUP_DATAS", "DELETE_REGION_GROUP_DATAS", "ACTIVE_REGION_GROUP_DATAS"]),
        ajaxLoadDataForRegionTable() {
            this.$q.loading.show({ message: "Please Wait" });
            this.FETCH_REGION_GROUP_DATAS()
                .then(() => {
                    this.activeTableData = this.getAllRegionGroupData.filter(service => service.active == true);
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
        fnShowAddNewRegionsGroups(rowDetails) {
            this.propRowDetails = rowDetails;
            this.propShowAddNewRegionsGroup = !this.propShowAddNewRegionsGroup;
            if (!this.propShowAddNewRegionsGroup) this.ajaxLoadDataForRegionTable();
        },
        fnShowEditRegionsGroup(rowDetails) {
            this.propRowDetails = rowDetails;
            this.propShowEditRegionsGroup = !this.propShowEditRegionsGroup;
            if (!this.propShowEditRegionsGroup) this.ajaxLoadDataForRegionTable();
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

<style>
</style>
