import { boot } from 'quasar/wrappers'
import JsonExcel from 'vue-json-excel3'

export default boot(({ app }) => {
  app.component('downloadExcel', JsonExcel)
})
