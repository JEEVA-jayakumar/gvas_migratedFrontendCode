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
