import { boot } from 'quasar/wrappers'
import VueBarcodeScanner from 'vue3-barcode-scanner'

export default boot(({ app }) => {
  app.use(VueBarcodeScanner)
})
