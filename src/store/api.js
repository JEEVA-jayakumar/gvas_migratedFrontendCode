import { url } from '@vuelidate/validators';
import { api } from '../boot/axios';

function withAuthHeader(requestUrl, config = {}) {
  const cfg = config ? { ...config } : {};
  cfg.headers = cfg.headers ? { ...cfg.headers } : {};

  const token = localStorage.getItem("auth_token");
  const isAuthEndpoint =
    typeof requestUrl === "string" &&
    (requestUrl.includes("authorization/login") ||
      requestUrl.includes("authorization/password"));

  if (!isAuthEndpoint && token && !cfg.headers.Authorization) {
    cfg.headers.Authorization = "Token " + token;
  }

  return cfg;
}

export default {
  get(url, request, config) {
    return api
      .get(url, {
        ...withAuthHeader(url, config),
        params: request
      }).then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  post(url, request, config) {
    return api
      .post(url, request, withAuthHeader(url, config))
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  put(url, request, config) {
    return api
      .put(url, request, withAuthHeader(url, config))
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  patch(url, request, config) {
    return api
      .patch(url, request, withAuthHeader(url, config))
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  delete(url, request, config) {
    return api
      .delete(url, {
        ...withAuthHeader(url, config),
        data: request
      }).then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  }
};
