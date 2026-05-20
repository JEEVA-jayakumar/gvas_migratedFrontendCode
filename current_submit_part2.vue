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
 deviceType: this.propLeadDeatils?.device?.deviceName,
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
 if (this.propLeadDeatils?.leadStatus == "102") {
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

 if (this.propLeadDeatils?.mAtmOnboardingPlan != null) {
 if (
 this.propLeadDeatils?.mAtmOnboardingPlan?.leadSource
 .sourceName == "ATM" &&
 this.propLeadDeatils?.mAtmOnboardingPlan?.planName ==
 "Kannor ATM Plan"
 ) {
 finalRequest.merchant.mdrPlan.incentive.fixed =
 finalRequest.merchant.mdrPlan.incentive.fixed;
 finalRequest.merchant.mdrPlan.incentive.percentage =
 finalRequest.merchant.mdrPlan.incentive.percentage;
 finalRequest.merchant.mdrPlan.incentive.minimum =
 finalRequest.merchant.mdrPlan.incentive.minimum;
 finalRequest.merchant.mdrPlan.incentive.minimumTxnValue =
 finalRequest.merchant.mdrPlan.incentive.minimumTxnValue;
 } else {
 finalRequest.merchant.mdrPlan.incentive.percentage =
 finalRequest.merchant.mdrPlan.incentive.percentage == 0
 ? null
 : finalRequest.merchant.mdrPlan.incentive.percentage;
 finalRequest.merchant.mdrPlan.incentive.fixed =
 finalRequest.merchant.mdrPlan.incentive.fixed == 0
 ? null
 : finalRequest.merchant.mdrPlan.incentive.fixed;
 finalRequest.merchant.mdrPlan.incentive.minimum =
 finalRequest.merchant.mdrPlan.incentive.minimum == 0
 ? null
 : finalRequest.merchant.mdrPlan.incentive.minimum;
 finalRequest.merchant.mdrPlan.incentive.minimumTxnValue =
 finalRequest.merchant.mdrPlan.incentive.minimumTxnValue == 0
 ? null
 : finalRequest.merchant.mdrPlan.incentive.minimumTxnValue;
 }
 } else {
 finalRequest.merchant.mdrPlan.incentive.percentage =
 finalRequest.merchant.mdrPlan.incentive.percentage == 0
 ? null
 : finalRequest.merchant.mdrPlan.incentive.percentage;
 finalRequest.merchant.mdrPlan.incentive.fixed =
 finalRequest.merchant.mdrPlan.incentive.fixed == 0
 ? null
