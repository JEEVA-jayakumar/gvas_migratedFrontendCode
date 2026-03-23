<template>
  <div class="q-pa-md">
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-12 q-title text-weight-regular text-grey-9">
        Assigned To So
      </div>
    </div>

    <div class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-md-4">
        <q-select filter clearable v-model="formData.allocate_so" label="Select SO" color="grey-9" :options="regionBasedSo" />
      </div>

      <div class="col-12">
        <div class="text-subtitle2 q-mb-sm">Spare Parts Type*</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-4" v-for="menu in sparePartsTypes" :key="menu.value.id">
            <q-checkbox :model-value="isSpareSelected(menu.value.id)" @update:model-value="val => toggleSpareSelection(val, menu.value)" :label="menu.label" />
            <q-input v-if="isSpareSelected(menu.value.id)" type="number" dense label="Count" :model-value="getSpareCount(menu.value.id)" @update:model-value="val => updateSpareCount(val, menu.value)" class="q-ml-md" style="max-width: 100px" />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <q-input disable v-model="formData.pod_number" label="Pod Number" color="grey-9" />
      </div>

      <div class="col-12 col-md-4">
        <q-input disable v-model="formData.total_count" label="Total Count" color="grey-9" />
      </div>

      <div class="col-12 flex justify-center q-mt-lg">
        <q-btn label="Submit" color="purple-9" :disable="formData.total_count === 0 || !formData.allocate_so" @click="fnSubmitBankDetails" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "sparePartsAssignedToSoDetails",
  data() {
    return {
      regionBasedSo: [],
      sparePartsTypes: [],
      formData: {
        allocate_region: "",
        allocate_reseller: null,
        total_count: 0,
        allocate_so: null,
        pod_number: "SO" + new Date().getTime(),
        sparePartsSets: []
      }
    };
  },
  computed: {
    ...mapGetters("InventoryCentral", ["getRegionBasedSO"]),
    ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"]),
  },
  created() {
    this.fnSparePartsTypes();
    this.regionBasedSoLoad();
  },
  methods: {
    ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
    ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES"]),
    ...mapActions("sparePartsInventory", ["UPDATE_SPARE_PARTS_INVENTORY_DATAS"]),

    fnSparePartsTypes() {
      this.FETCH_SPARE_PARTS_GET_TYPES().then(() => {
        this.sparePartsTypes = this.getsparePartsGetTypes.map(item => ({ value: item, label: item.spare_parts_types }));
      });
    },
    regionBasedSoLoad() {
      const regionId = JSON.parse(localStorage.getItem('u_i')).region.id;
      this.FETCH_REGION_BASED_SO(regionId).then(() => {
        this.regionBasedSo = this.getRegionBasedSO.map(v => ({ label: `${v.name} | ${v.employeeID}`, value: JSON.stringify(v) }));
      });
    },
    isSpareSelected(id) { return this.formData.sparePartsSets.some(s => s.spareParts.id === id); },
    getSpareCount(id) {
      const item = this.formData.sparePartsSets.find(s => s.spareParts.id === id);
      return item ? item.count : 0;
    },
    toggleSpareSelection(selected, spare) {
      if (selected) this.formData.sparePartsSets.push({ count: 0, spareParts: { id: spare.id } });
      else {
        this.formData.sparePartsSets = this.formData.sparePartsSets.filter(s => s.spareParts.id !== spare.id);
        this.calculateTotal();
      }
    },
    updateSpareCount(val, spare) {
      const item = this.formData.sparePartsSets.find(s => s.spareParts.id === spare.id);
      if (item) { item.count = parseInt(val) || 0; this.calculateTotal(); }
    },
    calculateTotal() { this.formData.total_count = this.formData.sparePartsSets.reduce((sum, s) => sum + s.count, 0); },
    fnSubmitBankDetails() {
      const payload = { ...this.formData, allocate_so: JSON.parse(this.formData.allocate_so), allocate_region: JSON.parse(localStorage.getItem('u_i')).region };
      this.$q.loading.show();
      this.UPDATE_SPARE_PARTS_INVENTORY_DATAS(payload).then(() => {
        this.$q.loading.hide();
        this.$q.notify({ color: "positive", message: "Successfully updated!", icon: "thumb_up" });
        this.$router.push("/sat/inventory/allocation");
      }).catch(err => {
        this.$q.loading.hide();
        this.$q.notify({ color: "negative", message: err.body?.message || "Please Try Again Later !", icon: "thumb_down" });
      });
    }
  }
};
</script>