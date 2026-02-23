import { boot } from 'quasar/wrappers'
import moment from 'moment'

export default boot(({ app }) => {
  app.config.globalProperties.$moment = moment
  app.config.globalProperties.$moment_format = (date, format) => {
    if (!date) return ''
    return moment(date).format(format)
  }
})
