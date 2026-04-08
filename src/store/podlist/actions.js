
import api from "../api.js";
export const FETCH_POD_LIST = ({
    commit
  }, request) => {
    let page = request && request.pagination ? request.pagination.page : 1;
    let size = request && request.pagination ? request.pagination.rowsPerPage : 10;
    let search = request && request.filter ? request.filter : "";
    let sortBy = request && request.pagination ? request.pagination.sortBy : "id";
    let sorting = request && request.pagination && request.pagination.descending ? 'asc' : 'desc';

    return api
      .get(
        'pod-list?page=' +
        page +
        '&size=' +
        size +
        "&search=" +
        search +
        "&sort=" +
        sortBy +
        "&" +
        sortBy +
        ".dir=" +
        sorting
      )
      .then(response => {
        // START=> COMMIT with data received'
        commit('SET_ALL_POD_LIST', response.data.data);
        // END=> COMMIT with data received'
      });
  };

// export const FETCH_POD_LIST = ({
//     commit
// }, request) => {
//     return api.get("pod").then(response => {
//         commit("SET_ALL_POD_LIST", response.data.data);
//     });

// }