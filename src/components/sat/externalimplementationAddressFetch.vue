<template>
  <div>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">Enter Latitude & Longitude</div>
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width:150%">
          <q-card-section>
            <q-list no-border>
              <q-item>
                <q-item-section>
                  <q-input color="grey-9" v-model="v$.formData.Address.$model" :error="v$.formData.Address.$error" label="Address" />
                  <div class="q-mt-sm">
                    <q-btn label="Search Address" @click="fnAddress" color="purple-9" />
                  </div>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input color="grey-9" disable v-model="v$.formData.latitude.$model" :error="v$.formData.latitude.$error" label="Enter Latitude" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input color="grey-9" disable v-model="v$.formData.longitude.$model" :error="v$.formData.longitude.$error" label="Enter Longitude" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="end">
            <q-btn label="submit" @click="fnsubmit" color="purple-9" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapActions } from "vuex";

export default {
  name: "externalimplementationAddressFetch",
  setup() { return { v$: useVuelidate() }; },
  data() {
    return {
      propRowDetails: {},
      formData: { Address: "", latitude: "", longitude: "" }
    };
  },
  validations() {
    return { formData: { Address: { required }, latitude: { required }, longitude: { required } } };
  },
  beforeMount() {
    this.propRowDetails = this.$route.params.data;
    if (this.propRowDetails?.data?.data?.second[0]?.Failed) {
      this.formData.Address = this.propRowDetails.data.data.second[0].Failed.deviceAddress;
    }
  },
  methods: {
    ...mapActions("lat_long", ["Latitude_Longitude", "Lat_Long"]),
    async fnAddress() {
      if (!this.formData.Address) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Please fill Address fields" });
        return;
      }
      this.$q.loading.show({ message: "Validating..." });
      try {
        const res = await this.Lat_Long({ id: this.propRowDetails.data.data.second[0].Failed.tid, request: { deviceAddress: this.formData.Address } });
        this.formData.latitude = res.data.data.first;
        this.formData.longitude = res.data.data.second;
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Created" });
      } catch (err) {
        this.$q.notify({ color: "amber-9", position: "bottom", message: err.body?.message || "Please Try Again Later !" });
      } finally { this.$q.loading.hide(); }
    },
    async fnsubmit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        this.$q.notify({ color: "negative", position: "bottom", message: "Please fill all mandatory fields" });
        return;
      }
      this.$q.loading.show({ message: "Validating..." });
      try {
        await this.Latitude_Longitude({ id: this.propRowDetails.data.data.second[0].Failed.tid, deviceAddress: this.formData.Address, latitude: this.formData.latitude, longitude: this.formData.longitude });
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Created" });
        this.$router.push('/sat/implementation/queue');
      } catch (err) {
        this.$q.notify({ color: "amber-9", position: "bottom", message: err.body?.message || "Please Try Again Later !" });
      } finally { this.$q.loading.hide(); }
    }
  }
};
</script>