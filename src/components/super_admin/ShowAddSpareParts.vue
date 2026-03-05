<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnShowAddNewSpareParts"
      @escape-key="emitfnShowAddNewSpareParts"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Add Spare Types</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                v-model="formData.spare_parts_types"
                @blur="v$.formData.spare_parts_types.$touch"
                :error="v$.formData.spare_parts_types.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Enter Spare Parts Name"
                placeholder="Enter Spare Parts Name"
                @keyup.enter="fnfinalsubmitAddSpareParts()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnShowAddNewSpareParts()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitAddSpareParts()"
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
import { mapActions } from "vuex";

export default {
  props: ["propShowAddSpareParts", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowAddSpareParts,
      formData: {
        spare_parts_types: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        spare_parts_types: { required },
      },
    };
  },
  methods: {
    ...mapActions("sparePartsGetTypes", ["UPDATE_SPARE_PARTS_TYPES"]),
    emitfnShowAddNewSpareParts() {
      this.$emit("emitfnShowAddNewSpareParts");
    },
    fnfinalsubmitAddSpareParts() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Please Wait" });
        this.UPDATE_SPARE_PARTS_TYPES(this.formData)
          .then(() => {
            this.$q.notify({
              color: "positive",
              message: "Spares Added Successfully",
              icon: "thumb_up",
            });
            this.emitfnShowAddNewSpareParts();
            this.$q.loading.hide();
            this.$router.push("/super/admin/sparePartsTypes");
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
