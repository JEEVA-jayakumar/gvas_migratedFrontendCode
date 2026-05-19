 finalFormSubmit(request) {
 this.v$.merchant?.$touch();
 if (this.v$.merchant?.$error) {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Please fill all mandatory fields",
 icon: "info",
 });
 } else {
 let self = this;
 self.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Validating .",
 });
 const finalRequest = { action: 2, merchant: self.merchant };

 finalRequest.merchant.leadId = self.$route.params.id;
 finalRequest.merchant.holdPayment = finalRequest.holdPayment;
 let a = { ...finalRequest.merchant.mdrPlan,
 };
 // finalRequest.merchant.mdrPlan = { ...a, diners: this.formdata};
 finalRequest.merchant.mdrPlan = { ...a,
 diners: this.merchant.mdrPlan.diners,
 };
 finalRequest.merchant.businessInformation.currentPosName =
 finalRequest.merchant.businessInformation.currentPosName == "N"
 ? ""
 : finalRequest.merchant.businessInformation.currentPosName;
 finalRequest.merchant.companyInformation.constitutionName =
 finalRequest.merchant.companyInformation.constitutionName == "61"
 ? "60"
 : finalRequest.merchant.companyInformation.constitutionName;
 (finalRequest.merchant.paymentDetails.emiStartDate =
 this.commonDateFormatDOB1(
 finalRequest.merchant.paymentDetails.emiStartDate
 )),
 (finalRequest.merchant.revParameters.notificationRecipient =
 finalRequest.merchant.revParameters.notificationRecipient == "N"
 ? null
 : finalRequest.merchant.revParameters.notificationRecipient);
 finalRequest.merchant.revParameters.dQR =
 finalRequest.merchant.salesInformation.institutionCode == "109"
 ? "1"
 : 0;

 let equitasData = {
 contactEmail: finalRequest.merchant.companyInformation.contactName,
 contactMobile: finalRequest.merchant.companyInformation.contactMobile,
 contactName: finalRequest.merchant.companyInformation.contactName,
 dob: this.$moment(finalRequest.merchant.partnerInformation[0].dob).format(
 "DD/MM/YYYY"
 ),
 contactPhone: finalRequest.merchant.companyInformation.contactMobile,
 dbaName: finalRequest.merchant.companyInformation.dbaName,
 establishYear: this.$moment(
 finalRequest.merchant.companyInformation.establishYear
 ).format("DD/MM/YYYY"),
 legalName: finalRequest.merchant.companyInformation.legalName,
 mcc: finalRequest.merchant.companyInformation.mcc,
 pan: finalRequest.merchant.companyInformation.pan,
 registeredCityRefCode:
 finalRequest.merchant.companyInformation.registeredCityRefCode,
 registeredStateRefCode:
 finalRequest.merchant.companyInformation.registeredStateRefCode,
 applicationNumber:
 finalRequest.merchant.salesInformation.applicationNumber,
 planID: "",
 registeredAddress:
 finalRequest.merchant.companyInformation.registeredAddress,
 registeredCityName:
 finalRequest.merchant.companyInformation.registeredCityName,
 registeredStateName:
 finalRequest.merchant.companyInformation.registeredStateName,
 registeredPin: finalRequest.merchant.companyInformation.registeredPin,
 weekdayStartHour:
 finalRequest.merchant.businessInformation.weekdayStartHour,
 weekdayEndHour:
 finalRequest.merchant.businessInformation.weekdayEndHour,
 weekendStartHour:
 finalRequest.merchant.businessInformation.weekendStartHour,
 weekendEndHour:
 finalRequest.merchant.businessInformation.weekendEndHour,
 lastTurnOverYear:
 finalRequest.merchant.businessInformation.lastTurnoverYear == null
 ? ""
 : finalRequest.merchant.businessInformation.lastTurnoverYear,
 lastTurnOverAmount:
 finalRequest.merchant.businessInformation.lastTurnoverAmount,
 expectedCardBusiness:
 finalRequest.merchant.businessInformation.expectedCardBusiness,
 averageBillAmount:
 finalRequest.merchant.businessInformation.averageBillAmount,
 businessIncome:
 finalRequest.merchant.businessInformation.businessIncome,
 averageCountTxnPerDay: "",
 declaredAnnualIncome: "",
 declaredAnnualLimit: "",
 minimumTransaction: "",
 maximumTransaction: "",
 cashAtPosEnabled:
 finalRequest.merchant.revParameters.cashAtPosEnabled,
 preAuth: finalRequest.merchant.revParameters.preAuth,
 tipEnabled: finalRequest.merchant.revParameters.tipEnabled,
 tipPercentage: finalRequest.merchant.paymentDetails.tipPercentage,
 settlementType: finalRequest.merchant.revParameters.settlementType,
 txnEmiAllowed: finalRequest.merchant.revParameters.txnEmiAllowed,
 sodexoEnabled: finalRequest.merchant.revParameters.sodexoEnabled,
 amexEnabled: finalRequest.merchant.revParameters.amexEnabled,
 upiChargeslipEnabled:
 finalRequest.merchant.revParameters.upichargeslipEnabled,
 upiFlag: finalRequest.merchant.revParameters.upiFlag,
 cardAcceptance: finalRequest.merchant.paymentDetails.cardAcceptance,
 deviceType: this.propLeadDeatils.device.deviceName,
 smallMerchant: finalRequest.merchant.salesInformation.categoryType,
 gstNumber: finalRequest.merchant.businessInformation.gstId,
 };

 if (
 finalRequest.merchant.salesInformation.leadFrom ==
 "LS_EQUITAS SMALL FINANCE BANK LIMITED"
 ) {
 self
 .EQUITAS_FRM_DATA(equitasData)
 .then((response) => { })
 .catch(() => {
 self.$q.loading.hide();
 });
 }
 self
 .MARS_DATA_SUBMIT_INTERNAL(finalRequest)
 .then((response) => {
 self.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Saved. Sending data to mars",
 });
 let key = this.merchant.salesInformation.institutionCode;
 this.$q.localStorage.set("aa_t", key);
 if (this.propLeadDeatils.leadStatus == "102") {
 // let key = this.merchant.salesInformation.institutionCode;
 // this.$q.localStorage.set("aa_t", key);
 delete this.merchant.customIncentiveRates[0].add;
 delete this.merchant.customIncentiveRates[1].add;
 delete this.merchant.customIncentiveRates[2].add;
 delete this.merchant.customIncentiveRates[3].add;
 delete this.merchant.customIncentiveRates[4].add;
 delete finalRequest.merchant.leadId;
 delete finalRequest.action;
 delete finalRequest.merchant.revParamAndLeadInfo;
 delete finalRequest.merchant.holdPayment;
 delete finalRequest.merchant.SharingDiscountFee;

 if (this.propLeadDeatils.mAtmOnboardingPlan != null) {
 if (
 this.propLeadDeatils.mAtmOnboardingPlan.leadSource
 .sourceName == "ATM" &&
 this.propLeadDeatils.mAtmOnboardingPlan.planName ==
