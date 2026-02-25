import { boot } from 'quasar/wrappers'
import { api } from './axios'

export default boot(({ app }) => {
  const wrapResponse = (res) => {
    res.body = res.data;
    return res;
  };

  const wrapError = (err) => {
    if (err.response) {
      err.body = err.response.data;
    }
    throw err;
  };

  const httpWrapper = {
    get: (url, config) => api.get(url, config).then(wrapResponse).catch(wrapError),
    post: (url, data, config) => api.post(url, data, config).then(wrapResponse).catch(wrapError),
    put: (url, data, config) => api.put(url, data, config).then(wrapResponse).catch(wrapError),
    delete: (url, config) => api.delete(url, config).then(wrapResponse).catch(wrapError),
    patch: (url, data, config) => api.patch(url, data, config).then(wrapResponse).catch(wrapError),
  }

  app.config.globalProperties.$http = httpWrapper
})
