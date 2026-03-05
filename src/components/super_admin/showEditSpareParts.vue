<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      @hide="emitfnshowEditSpareParts"
      @escape-key="emitfnshowEditSpareParts"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw">
        <form>
          <div class="row q-pa-md items-center border-bottom">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Modify Spare Parts Info</div>
            </div>
          </div>
          <div class="row q-pa-md items-center">
            <div class="col-md-12 full-width">
              <q-input
                disable
                v-model="formData.id"
                :error="v$.formData.id.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Spare Parts Id"
                placeholder="Spare Parts Id"
              />
            </div>
            <div class="col-md-12 full-width q-mt-md">
              <q-input
                v-model="formData.spare_parts_types"
                @blur="v$.formData.spare_parts_types.$touch"
                :error="v$.formData.spare_parts_types.$error"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                label="Enter Spare Parts Name"
                placeholder="Enter Spare Parts Name"
                @keyup.enter="fnfinalsubmitEditedSpareParts()"
              />
            </div>
          </div>
          <div class="row q-pa-md items-center justify-end">
            <q-btn
              flat
              class="bg-white text-weight-regular text-grey-8 q-mr-sm"
              @click="emitfnshowEditSpareParts()"
              label="Cancel"
            />
            <q-btn
              @click="fnfinalsubmitEditedSpareParts()"
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
  props: ["propShowEditSpareParts", "propRowDetails"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      toggleModel: this.propShowEditSpareParts,
      formData: {
        id: this.propRowDetails.id,
        spare_parts_types: this.propRowDetails.spare_parts_types,
      },
    };
  },
  validations() {
    return {
      formData: {
        id: { required },
        spare_parts_types: { required },
      },
    };
  },
  methods: {
    ...mapActions("sparePartsGetTypes", ["EDIT_SPARE_PARTS_TYPES"]),
    emitfnshowEditSpareParts() {
      this.$emit("emitfnshowEditSpareParts");
    },
    fnfinalsubmitEditedSpareParts() {
      this.v$.formData.$touch();
      if (this.v$.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show({ message: "Saving..." });
        let param = {
          id: this.formData.id,
          spare_parts_types: this.formData.spare_parts_types,
        };
        this.EDIT_SPARE_PARTS_TYPES(param)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            this.emitfnshowEditSpareParts();
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
