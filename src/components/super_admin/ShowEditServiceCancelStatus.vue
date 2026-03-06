<template>
<div>
  <q-dialog
   minimized
        v-model="toggleModel"
        @hide="emitShowEditServiceCancelStatus"
        @escape-key="emitShowEditServiceCancelStatus"
        class="customModalOverlay"
        :content-css="{ padding: '30px', minWidth: '30vw' }"
  >
<q-card style="min-width: 350px;">

<form>
  <div class="row gutter-sm q-py-sm items-center">
    <div class="col-md-12">
      <div class="text-h6 text-weight-regular">
        Modify Cancel Status Info
      </div>
    </div>

  </div>
  <div class="row gutter-sm q-py-sm items-center">
    <div class="col-md-12">
      <q-input v-model="formData.name" :error="$v.formData.name.$error" class="text-weight-regular text-grey-8"
        color="grey-9" label="Service Status Name" placeholder="Service Status Name" />
    </div>
  </div>
  <div class="row gutter-sm q-py-sm items-center">
    <div class="col-md-12 group" align="right">
      <q-btn flat align="right" class="bg-white text-weight-regular text-grey-8"
        @click="emitShowEditServiceCancelStatus()">Cancel</q-btn>
      <q-btn align="right" @click="fnfinalsubmitEditedServiceCancelStatus(formData)" color="purple-9">Save</q-btn>
    </div>
  </div>
</form>

</q-card>
</q-dialog>
</div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from '@vuelidate/validators'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['propShowEditServiceCancelStatus', 'propRowDetails5'],
  data () {
    return {
      toggleModel: this.propShowEditServiceCancelStatus,
      formData: {
        name: this.propRowDetails5.name
      }
    }
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations: {
    formData: {

      name: {
        required
      }
    }
  },
  computed: {
    $v() { return this.v$; }
  },
  methods: {
    ...mapActions('serviceRequestCancelled', ['EDIT_SERVICE_CANCEL_STATUS_TYPES']),
    emitShowEditServiceCancelStatus () {
      this.$emit('emitShowEditServiceCancelStatus')
    },
    fnfinalsubmitEditedServiceCancelStatus(formData) {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) {
        this.$q.notify('Please review fields again.')
      } else {
        this.$q.loading.show()
        let param = {
          id: JSON.stringify(this.propRowDetails5.id),
          request: this.formData
        }
        this.EDIT_SERVICE_CANCEL_STATUS_TYPES(param)
          .then(() => {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully updated!',
              icon: 'thumb_up'
            })
            this.emitShowEditServiceCancelStatus()
          }).catch(() => {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message:
                error.data?.message == null
                  ? 'Please Try Again Later !'
                  : error.data?.message,
              icon: 'thumb_down'
            })
          })
      }
    }
  }
}
</script>
