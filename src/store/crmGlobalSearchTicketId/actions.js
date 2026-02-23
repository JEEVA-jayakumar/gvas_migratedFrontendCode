
import api from "../api.js";

export const FETCH_CRM_GLOBAL_SEARCH_DATAS = ({ commit }, request) => {
  return api
    .get("crm-request/searchTicket/"+ request.searchTerm)
    .then(response => {
      console.log("API Response : ", response.data.data);
      commit("API_RESPONSE_LOG", response);
      commit("SET_FETCH_CRM_GLOBAL_SEARCH_DATAS", response.data.data);
    //   return response;
    });
};
export const someAction = state => {};
