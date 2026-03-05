<template>
  <div>
    <q-dialog   minimized
        v-model="toggleModel"
        @hide="emitfnShowCancelStatus"
        @escape-key="emitfnShowCancelStatus"
        class="customModalOverlay"
        :content-css="{ padding: '30px', minWidth: '30vw' }">
<q-card style="min-width: 350px;">

       <form>
        <div class="row gutter-sm q-py-sm items-center">
        <div  class="col-md-12">
         <div class="text-h6 text-weight-regular"> Add Service</div>
        </div>
        <div class="col-md-12">
         <q-input
          v-model="formData.name"
          :error="$v.formData.name.$error"
         class="text-weight-regular text-grey-8"
         color="grey-9"
         label="Enter Status"
         placeholder="Enter Status"
        />
        </div>
        </div>
        <div class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12 group" align="side">
            <q-btn flat align="side" class="bg-white text-weight-regular text-grey-8"
              @click="emitfnShowCancelStatus()">Cancel</q-btn>
              <q-btn align="side" @click="fnfinalsubmitAddCancelStatus(formData)" color="purple-9">Save</q-btn>
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
  props: ['propShowCancelStatus', 'propRowDetails3'],
  data () {
    return {
      toggleModel: this.propShowCancelStatus,
      formData: {
        name: ''
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
    ...mapActions('serviceRequestCancelled', ['POST_CANCEL_STATUS_TYPES']),

    emitfnShowCancelStatus () {
      this.$emit('emitfnShowCancelStatus')
    },

    fnfinalsubmitAddCancelStatus (formData) {
      console.log('SUBMIT Sub Task RESPONSE', JSON.stringify(formData))
      // this.$v.formData.$touch();
      if (this.$v.formData.$error) {
        this.$q.notify('Please review fields again.')
      } else {
        this.$q.loading.show({
          delay: 100, // ms
          message: 'Please Wait',
          spinnerColor: 'purple-9',
          customClass: 'shadow-none'
        })
        console.log('SUBMIT RESPONSE', JSON.stringify(formData))
        this.POST_CANCEL_STATUS_TYPES(formData)
          .then(() => {
            this.$q.loading.hide()
            this.$emit('emitfnShowCancelStatus', 'refresh')
            this.$q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Added Successfully',
              icon: 'thumb_up'
            })
          }).catch(() => {
            this.$q.loading.hide()
            this.$q.notify({
              type: 'warning',
              color: 'amber-9',
              position: 'bottom',
              message: error.data.message
            })
          })
      }
    }
  }
}
</script>
