<template>
  <div class="q-pa-md">
    <q-card flat bordered class="max-width-600 mx-auto">
      <q-card-section class="bg-purple-9 text-white">
        <div class="text-h6">MARS API SYNC - {{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="text-subtitle2 q-mb-sm text-grey-7">Authorization Token</div>
        <q-input
          v-model="token"
          type="textarea"
          outlined
          readonly
          bg-color="grey-1"
          rows="5"
          color="purple-9"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg">
        <q-btn
          unelevated
          color="purple-9"
          label="Synchronize Now"
          icon="sync"
          :loading="loading"
          @click="handleSync"
          padding="10px 40px"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "MarsApiSyncBase",
  props: {
    title: { type: String, required: true },
    syncAction: { type: Function, required: true }
  },
  data() {
    return {
      token: "Token " + localStorage.getItem("auth_token"),
      loading: false
    };
  },
  methods: {
    async handleSync() {
      this.loading = true;
      this.$q.loading.show({ message: `Synchronizing ${this.title}...` });
      try {
        await this.syncAction(this.token);
        this.$q.notify({
          color: "positive",
          message: `${this.title} synchronization successful!`,
          icon: "check_circle"
        });
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: error.body?.message || `Failed to sync ${this.title}. Please try again.`,
          icon: "error"
        });
      } finally {
        this.$q.loading.hide();
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.max-width-600 {
  max-width: 600px;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
