import { boot } from 'quasar/wrappers'
import VuePdfEmbed from 'vue-pdf-embed'

export default boot(({ app }) => {
  app.component('VuePdfEmbed', VuePdfEmbed)
})
