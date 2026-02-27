import { api } from '../../boot/axios';
import { date } from "quasar";

/***********
Common function to convert response as BLOB
*************/
function COMMON_FILE_DOWNLOAD(response) {
  return new Blob([response.data], {
    type: response.headers["content-type"] || response.headers["Content-Type"],
  });
}

/***********
Common function to handle file download with robust filename extraction
*************/
function DOWNLOAD_FILE(response, defaultFilename = "report.xls") {
  let blob = COMMON_FILE_DOWNLOAD(response);
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);

  let contentDisposition = response.headers["content-disposition"] || "";
  let filename = defaultFilename;
  let match = contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/);
  if (match) {
    filename = match[1] || match[2];
  }

  link.download = filename;
  link.click();
}

/* API call to fetch lead approval data */
export const REPORT_LEAD_APPROVAL_TRACKER = async ({ commit }, request) => {
  let url = "download/lead-approval-tracker";
  if (request != undefined) {
    url += "/" + date.formatDate(request.from, "x") + "/" + date.formatDate(request.to, "x");
  }
  return await api.get(url, { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "lead_approval_tracker.xls"));
};

/* API call to fetch sorucewise lead data */
export const REPORT_SOURCEWISE_LEAD_TRACKER = async ({ commit }, request) => {
  let url = "download/sourcewise-lead-tracker";
  if (request != undefined) {
    url += "?from=" + date.formatDate(request.from, "x") + "&to=" + date.formatDate(request.to, "x");
  }
  return await api.get(url, { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "sourcewise_lead_tracker.xls"));
};

/* API call to fetch source/region/device lead data */
export const REPORT_SOURCE_REGION_DEVICE = async ({ commit }, request) => {
  let url = "download/source-region-device";
  if (request != undefined) {
    url += "?/" + date.formatDate(request.from, "x") + "/" + date.formatDate(request.to, "x");
  }
  return await api.get(url, { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "source_region_device.xls"));
};

/* API call to fetch in active lead data */
export const REPORT_INACTIVE_MERCHANT = async ({ commit }, request) => {
  let url = "download/inactive-merchant";
  if (request != undefined) {
    url += "/" + date.formatDate(request.from, "x") + "/" + date.formatDate(request.to, "x");
  }
  return await api.get(url, { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "inactive_merchant.xls"));
};

/* API call to fetch proxy lead misselling data */
export const REPORT_PROXY_LEAD_MISSELLING = async ({ commit }, request) => {
  let url = "download/proxy-lead-misselling";
  if (request != undefined) {
    url += "/" + date.formatDate(request.from, "x") + "/" + date.formatDate(request.to, "x");
  }
  return await api.get(url, { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "proxy_lead_misselling.xls"));
};

/* API call to fetch fianance verified tracker data */
export const REPORT_FINANCE_APPROVED = async ({ commit }, request) => {
  return await api.get("finance-tracker-list-download", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "finance_approved_tracker.xls"));
};

export const REPORT_QR_FINANCE_APPROVED = async ({ commit }, request) => {
  return await api.get("finance-qr-tracker-list-download", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "finance_qr_approved_tracker.xls"));
};

export const POD_LIST_DOWNLOAD = async ({ commit }, request) => {
  return await api.get("download/pod-list", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "podlist.xls"));
};

export const AGGREGATOR_POD_LIST_DOWNLOAD = async ({ commit }, request) => {
  return await api.get("download/pod-list", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "aggregator_podlist.xls"));
};

export const INVENTORY_WITH_SO_LIST_DOWNLOAD = async ({ commit }, request) => {
  return await api.get("download/so-list", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "inventory_with_so_list.xls"));
};

export const AGGREGATOR_INVENTORY_WITH_SO_LIST_DOWNLOAD = async ({ commit }, request) => {
  return await api.get("download/so-list", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "aggregator_inventory_with_so_list.xls"));
};

export const QR_LIST_DOWNLOAD = async ({ commit }, request) => {
  return await api.post("download/qr-implementation-report", request.params, { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "QRLIST.xlsx"));
};

export const INVENTORY_WITH_RESELLER_LIST_ = async ({ commit }, request) => {
  return await api.get("download/reseller-list", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "inventory_with_reseller_list.xls"));
};

export const INVENTORY_WITH_CENTRAL = async ({ commit }, request) => {
  return await api.get("download/inventory-central", { responseType: "arraybuffer" })
    .then(response => DOWNLOAD_FILE(response, "inventory_central.xls"));
};
