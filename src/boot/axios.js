import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://qaapp.bijlipay.co.in:8085/api/',
  // Token-based auth; cookies are not required (and can complicate CORS in dev).
  withCredentials: false
})

export default boot(({ app, router }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$http = api

  api.interceptors.request.use(config => {
    // NOTE:
    // - "Access-Control-Allow-*" are response headers; sending them in requests can
    //   cause unexpected backend behavior.
    // - Some endpoints (login/password) must NOT receive app-specific headers.
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    config.headers["Accept"] = "application/json, text/plain, */*";
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    if (
      !config.url.includes("authorization/login") &&
      !config.url.includes("authorization/password")
    ) {
      const nii = localStorage.getItem("aa_t");
      if (nii) {
        config.headers["NII"] = nii;
      } else {
        delete config.headers["NII"];
      }

      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers["Authorization"] = "Token " + token;
      }
    } else {
      delete config.headers["Authorization"];
      delete config.headers["NII"];
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  api.interceptors.response.use(r => {
    r.body = r.data;
    return r;
  }, e => {
    if (e.response) {
      e.body = e.response.data;
      if (e.response.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("u_i");
        router.push({ name: "login" });
      }
    }
    return Promise.reject(e);
  });
})

export { axios, api }
