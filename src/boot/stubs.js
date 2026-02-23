import { boot } from 'quasar/wrappers'
import { h, resolveComponent } from 'vue'

export default boot(({ app }) => {
  app.config.globalProperties.$barcodeScanner = {
    destroy: () => {},
    init: () => {},
  }

  // q-autocomplete stub/shim
  app.component('q-autocomplete', {
    props: ['debounce', 'minCharacters'],
    emits: ['search', 'selected'],
    render() {
      return null // It was always used inside q-input which is not where it should be in Q2
    },
    created() {
      console.warn('q-autocomplete is deprecated. Please use q-select with use-input instead.')
    }
  })
})
