import { boot } from 'quasar/wrappers'
import { useVuelidate } from '@vuelidate/core'

export default boot(({ app }) => {
  app.mixin({
    beforeCreate() {
      // Fallback for options API code
      if (this.$options.validations) {
        if (!this.$v) this.$v = useVuelidate(this.$options.validations, this)
        if (!this.v$) this.v$ = this.$v
      }
    }
  })
})
