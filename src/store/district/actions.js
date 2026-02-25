import api from "../api.js";

export const FETCH_ALL_DISTRICT = ({
  commit,
  rootState
}, request) => {
  return api
    .get(
      rootState.GlobalVariables.STATE_LOCAL_API +
      "getdistrict/" + request)
    .then(response => {
      let allDistick = [];
      response.data.district.map(function (value, key) {
        allDistick.push({
          label: value.district,
          value: value.district,
        });
      });
      commit("SET_ALL_DISTRICT", allDistick)
    });
};
