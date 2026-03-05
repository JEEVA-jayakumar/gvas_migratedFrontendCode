<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Add New Hierarchy</div>
      <!-- START >> Setup MDR details -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-list class="no-border">

              <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="text"
                    v-model="formData.hierarchy"
                     @blur="v$.formData.hierarchy.$touch"
                     :error="v$.formData.hierarchy.$error"
                    label="Enter New Hierarchy"
                    placeholder="Add New Hierarchy"
                  />

                </q-item-section>
              </q-item>
                <q-item>
                <q-item-section>
                  <q-input
                    color="grey-9"
                    type="text"
                    v-model="formData.hierarchyCode"
                    @blur="v$.formData.hierarchyCode.$touch"
                    :error="v$.formData.hierarchyCode.$error"
                    label="Enter New Hierarchy Code"
                    placeholder="Add New Hierarchy Code"
                  />

                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="side">
            <q-btn label="submit" @click="fnAddHierarchy(formData)" color="purple-9" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AddNewHierarchy",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        hierarchy: "",
        hierarchyCode: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        hierarchy: { required },
        hierarchyCode: { required }
      }
    };
  },
  computed: {
    ...mapGetters("SA_Devices", ["getAllDevicesInfo","getMarsDeviceModel"]),
  },
  methods: {
    ...mapActions("SA_Devices", ["FETCH_DEVICES_DATA","FETCH_MARS_DEVICE_MODEL"]),
    ...mapActions("AddHierarchy",["SAVE_HIERARCHY"]),

    async fnAddHierarchy(request){
      const isValid = await this.v$.$validate();
      if(!isValid){
          this.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info"
        });
      }else {
          this.$q.loading.show({
            delay: 0,
            spinnerColor: "purple-9",
            message: "Validating..."
          });
          this.SAVE_HIERARCHY(request)
          .then((response) => {
              this.$q.loading.hide();
              this.$q.notify({
                color: "positive",
                position: "bottom",
                message: "Successfully Created",
                icon: "thumb_up",
              });
              this.$router.push("/super/admin/hierarchy");
          })
          .catch((error) => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "warning",
              color: "amber-9",
              position: "bottom",
              message: error.data?.message || error.body?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
