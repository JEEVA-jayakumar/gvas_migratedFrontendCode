import { getAggregatorId } from "../../util/safeStorage";
import api from "../api.js";
export const AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST = ({ commit }, request) => {
  if(getAggregatorId()=='3')
  {
  console.log("requested datas:----------------:Unassigned-----"+JSON.stringify(request.pagination))
  let sorting = request.pagination.descending ? "asc" : "desc";
  let sortBy = request.pagination.sortBy == null ? "createdAt" : request.pagination.sortBy 
  return api
    .get( 
       "aggregator-inventory/agg-DeviceReplacement-queue-lst/"+getAggregatorId()+"/assigned"+"?page=" +
      request.pagination.page + "&size=" + request.pagination.rowsPerPage + "&searchterm=" + request.filter 
      + "&sort=" + sortBy + "&" + sortBy + ".dir=" + sorting
    )
    .then(response => {
      // START=> COMMIT with data received'
      commit("SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", response.data.data);
      // END=> COMMIT with data received'
    });
  }
  else{
    console.log("requested datas:----------------:Unassigned-----"+JSON.stringify(request.pagination))
    let sorting = request.pagination.descending ? "asc" : "desc";
    let sortBy = request.pagination.sortBy == null ? "createdAt" : request.pagination.sortBy 
    return api
      .get( 
         "aggregator-inventory/agg-DeviceReplacement-queue-list/"+getAggregatorId()+"/assigned"+"?page=" +
        request.pagination.page + "&size=" + request.pagination.rowsPerPage + "&searchterm=" + request.filter 
        + "&sort=" + sortBy + "&" + sortBy + ".dir=" + sorting
      )
      .then(response => {
        // START=> COMMIT with data received'
        commit("SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", response.data.data);
        // END=> COMMIT with data received'
      });
    }
}

export const AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST = ({ commit }, request) => {

      if(getAggregatorId()=='3')
      {
        let sorting = request.pagination.descending ? "asc" : "desc";
        console.log("requested datas:----------------:Unassigned-----"+JSON.stringify(request))
          return api
          .get(
             "aggregator-inventory/agg-DeviceReplacement-queue-lst/"+getAggregatorId()+"?page=" +
            request.pagination.page +
            "&size=" +
            request.pagination.rowsPerPage +
            "&searchterm=" +
            request.filter 
            +
          "&sort=" +
          request.pagination.sortBy +
          "&" +
          request.pagination.sortBy +
          ".dir=" +
          sorting 
           
          )
          .then(response => {
            // START=> COMMIT with data received'
            commit("SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", response.data.data);
            // END=> COMMIT with data received'
          });
    }
    else{
      let sorting = request.pagination.descending ? "asc" : "desc";
        console.log("requested datas:----------------:Unassigned-----"+JSON.stringify(request))
      return api
          .get(
             "aggregator-inventory/agg-DeviceReplacement-queue-list/"+getAggregatorId()+"?page=" +
            request.pagination.page +
            "&size=" +
            request.pagination.rowsPerPage +
            "&searchterm=" +
            request.filter 
            +
          "&sort=" +
          request.pagination.sortBy +
          "&" +
          request.pagination.sortBy +
          ".dir=" +
          sorting 
           
          )
          .then(response => {
            // START=> COMMIT with data received'
            commit("SET_AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", response.data.data);
            // END=> COMMIT with data received'
          });
    }
};

export const AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_SUBMIT = ({ commit }, request) => {
    return api.put(
        "DeviceReplacement-assigned-to/" + request.userId,
        request
    );
};
