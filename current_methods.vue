 });
 });

 // this.vasBasedOnInstance = vasArr.map((opt) => ({
 // .opt,
 // disable: this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS' && opt.value !== 'UPI QR'
 // }));
 // this.$nextTick(() => {
 // const upiExists = this.vasBasedOnInstance.some(opt => opt.value === 'UPI QR');
 // if (upiExists) {
 // this.tmpVasMapping = ['UPI QR'];
 // this.vasKey++; // ✅ Force re-render
 // console.log('✅ Auto-selected VAS:', this.tmpVasMapping);
 // }
 // });
 if (this.propLeadDeatils.leadSource.sourceName === "LS_TOHANDS") {
 this.vasBasedOnInstance = vasArr;
 this.vasBasedOnInstance = vasArr.map((opt) => ({ ...opt,
 disable:
 this.propLeadDeatils.leadSource.sourceName === "LS_TOHANDS" &&
 opt.value !== "UPI QR",
 }));
 this.$nextTick(() => {
 const upiExists = this.vasBasedOnInstance.some(
 (opt) => opt.value === "UPI QR"
 );
 if (upiExists) {
 this.tmpVasMapping = ["UPI QR"];
 this.vasKey++; // ✅ Force re-render
 console.log("✅ Auto-selected VAS:", this.tmpVasMapping);
 }
 });
 } else {
 this.vasBasedOnInstance = vasArr;
 }
 // if (this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS') {
 // // Disable all except UPI QR
 // vasArr.forEach(option => {
 // option.disable = option.value !== 'UPI QR';
 // });

 // this.vasBasedOnInstance = vasArr;

 // // ✅ Important: Apply selection after options render
 // this.$nextTick(() => {
 // const upiExists = this.vasBasedOnInstance.some(opt => opt.value === 'UPI QR');
 // if (upiExists) {
 // this.tmpVasMapping = ['UPI QR']; // this must match the value field
 // console.log('Auto-selected VAS:', this.tmpVasMapping);
 // } else {
 // console.warn('UPI QR not found in VAS list.');
 // }
 // });

 // } else {
 // // Normal flow without disabling
 // this.vasBasedOnInstance = vasArr;
 // }
 // if (this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS') {
 // vasArr.forEach(option => {
 // option.disable = option.value !== 'UPI QR';
 // });

 // this.vasBasedOnInstance = vasArr;

 // // 🛠️ Use $nextTick to ensure UI is updated before assigning selection
 // this.$nextTick(() => {
 // // Double check if 'UPI QR' is actually present in the options
 // const isUpiPresent = vasArr.some(opt => opt.value === 'UPI QR');
 // if (isUpiPresent) {
 // this.tmpVasMapping = ['UPI QR'];
 // } else {
 // console.warn('UPI QR not found in options');
 // }
 // });
 // } else {
 // this.vasBasedOnInstance = vasArr;
 // }
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom-left",
 message: "Invalid",
 icon: "clear",
 });
 this.merchant.revParamAndLeadInfo.vasInstanceMapping = "";
 }
 });
 }

 // });
 },
 fetchAllZone() {
 this.FETCH_ALL_ZONE();
 },
 fetchAllDistrict() {
 this.FETCH_ALL_DISTRICT();
 },
 // appLoadData(){
 // this.FETCH_APP_VAS_DATA();
 // },

 goBackToDocumentVerificationStage() {
 let formData = {
 leadId: this.$route.params.id,
 defaultUrlValue:
 this.getShortLeadInfo.leadStatus ==
 this.$LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING
 ? this.$SAT_LEAD_VALIDATION_PROCEED_TO_DATA_ENTRY_WITH_REFERBACK
 : this.$SAT_LEAD_VALIDATION_APPROVE,
 };

 this.$q
 .dialog({
 title: "Confirm",
 message:
 "Are you sure want to proceed to document verification stage?",
 ok: "Continue",
 cancel: "Cancel",
 }).onOk(() => {
 this.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Processing .",
 });

 this.MOVE_BACK_DOCUMENT_VERIFICATION_STAGE(formData).then(() => {
 this.$router.push("/sat/lead/validation/" + this.$route.params.id);
 this.$q.loading.hide();
 });
 }).onCancel((error) => {
 this.$q.loading.hide();
 });
 },

 fetchMarsDeviceDetails() {
 /* API call to fetch device model */
 let param = {
 leadSource: this.getShortLeadInfo.leadSource.id,
 device: this.getShortLeadInfo.device.id,
 plan: this.getShortLeadInfo.plan.id,
 };
 this.DEVICE_MODEL_FROM_MARS(param).then((response) => {
 let obj = response.data.data.marsDeviceModel;
 this.terminalModelSet = [];
 this.terminalModelSet.push({
 label: obj.name,
 value: obj.code,
 });
 this.merchant.paymentDetails.terminalModeCode = obj.code;
 });
 },

 fetchAllDropdownValuesFromMARSapi(institutionCode) {
      if (institutionCode) {
        localStorage.setItem("aa_t", institutionCode);
      }
 this.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Setting data .",
 });
 let self = this;
 /* API call to fetch regions */
 self
 .REGION_FROM_MARS(institutionCode)
 .then(() => {
 self.regionOptions = [];
 return self.regionsFromMars.items.map((oo) => {
 self.regionOptions.push({ label: oo.name, value: oo.code });
 });
 }).then(() => {
 /* API call to fetch sharing partner */
 return self.LEAD_FROM_FROM_MARS(institutionCode).then((response) => {
 self.leadFromOptions = [];
 if (
 JSON.parse(localStorage.getItem("u_i")).region.regionAreaName ==
 "VARANEEK"
 ) {
 self.leadFromInfoFromMars.items.map((oo) => {
 if (oo.name == "VARANEEK") {
