<template>
  <div>
    <q-dialog
      minimized
      v-model="toggleModel"
      @hide="emitfnshowEditDeviceTypes"
      persistent
      class="customModalOverlay"
      :content-css="{padding:'30px',minWidth:'30vw'}"
    >
<q-card style="min-width: 350px;">

      <form>
        <div class="text-h6 text-weight-regular q-py-md bottom-border">
          <q-icon name="border_color" size="25px" color="purple-9"/>Modify Device
        </div>

        <div class="column-inline q-py-md gutter-sm items-center">
          <div>
            <q-input
              v-model="formData.deviceName"
              @blur="$v.formData.deviceName.$touch"
              :error="$v.formData.deviceName.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Device Type"
              placeholder="Device Type"
            />
          </div>
          <div>
            <div class="row">
              <div class="col">
                <q-color
                  clearable
                  v-model="formData.colorCode"
                  @blur="$v.formData.colorCode.$touch"
                  :error="$v.formData.colorCode.$error"
                  popover
                  label="Choose a role color"
                  color="grey-9"
                  @update:model-value="createDuplicateResult"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  round
                  :style="'background:'+formData.colorCode"
                  @click="undoColorChange(formData.colorCodeDuplicate)"
                />
              </div>
            </div>
          </div>
          <div>
            <q-input
              v-model="formData.serialNumberLength"
              type="number"
              @blur="$v.formData.serialNumberLength.$touch"
              :error="$v.formData.serialNumberLength.$error"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Serial Number Length"
              placeholder="Serial Number Length"
            />
          </div>
          <div class="group" align="side">
            <q-btn
              outline
              align="side"
              icon="block"
              class="text-weight-regular text-grey-8"
              color="grey-6"
              @click="emitfnshowEditDeviceTypes()"
              label="Cancel"
            />
            <q-btn
              align="side"
              icon="check"
              @click="fnfinalsubmitDeviceType(formData)"
              color="purple-9"
              label="save"
            />
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
  props: ["propShowEditDeviceTypes", "propRowDetails"],
  data() {
    return {
      toggleModel: this.propShowEditDeviceTypes,
      formData: {
        id: this.propRowDetails.id,
        deviceName: this.propRowDetails.deviceName,
        colorCode: this.propRowDetails.colorCode,
        colorCodeDuplicate: this.propRowDetails.colorCode,
        serialNumberLength: this.propRowDetails.serialNumberLength
      }
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
      serialNumberLength: {
        required,
        // Restricting device serial number length
        maxValue: maxValue(50)
      }
    }
  },
  computed: {
    $v() { return this.v$; }
  },
  methods: {
    ...mapActions("SA_Devices", ["UPDATE_DEVICE_DATA", "FETCH_DEVICES_DATA"]),
    emitfnshowEditDeviceTypes() {
      this.$emit("emitfnshowDeviceTypes");
      this.$emit("emitfnForDeviceTypeTable");
    },
    createDuplicateResult(item) {
      if (item != null) {
        this.formData.colorCodeDuplicate = item;
      }
    },
    undoColorChange(item) {
      this.formData.colorCode = item;
    },
    fnfinalsubmitDeviceType(formData) {
      this.$v.formData.$touch();
      if (this.$v.formData.$error) {
        this.$q.notify("Please review fields again.");
      } else {
        this.$q.loading.show();
        this.UPDATE_DEVICE_DATA(formData)
          .then(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up"
            });
            this.FETCH_DEVICES_DATA();
            this.emitfnshowEditDeviceTypes();
            location.reload();
          }).catch(() => {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "bottom",
              message: error.data?.message == null ? "Please Try Again Later !" : error.data?.message,
              icon: "thumb_down"
            });
          });
      }
    }
  }
};
</script>
