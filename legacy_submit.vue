      //   // });
      //     }else{
      //       return false;
      //     }
      //   },
      finalFormSubmit(request) {
        this.$v.merchant.$touch();
        if (this.$v.merchant.$error) {
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
            message: "Validating ..",
          });
          const finalRequest = { action: 2, merchant: self.merchant };

          finalRequest.merchant.leadId = self.$route.params.id;
          finalRequest.merchant.holdPayment = finalRequest.holdPayment;
          let a = {
            ...finalRequest.merchant.mdrPlan,
          };
          // finalRequest.merchant.mdrPlan = { ...a, diners: this.formdata};
          finalRequest.merchant.mdrPlan = {
            ...a,
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
            dob: moment(finalRequest.merchant.partnerInformation[0].dob).format(
              "DD/MM/YYYY"
            ),
            contactPhone: finalRequest.merchant.companyInformation.contactMobile,
            dbaName: finalRequest.merchant.companyInformation.dbaName,
            establishYear: moment(
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
                message: "Saved.. Sending data to mars",
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
                if (
                  finalRequest.merchant.salesInformation.institutionCode ==
                  "104" &&
                  this.propLeadDeatils.device.id == "31"
                ) {
                  // alert("AXIS INSTANCE AND ME31 DEVICE CALLING")
                  finalRequest.merchant.paymentDetails.terminalModeCode = "34";
                }
                // finalRequest.merchant.paymentDetails.numberOfTerminals = 1;
                let size = finalRequest.merchant.partnerInformation.length;
                for (var i = 0; i < size; i++) {
                  finalRequest.merchant.partnerInformation[i].dob =
                    this.commonDateFormatDOB1(
                      finalRequest.merchant.partnerInformation[i].dob
                    );
                }

                self
                  .MARS_DATA_SUBMIT_EXTERNAL({
                    params: finalRequest,
                    leadStatus: this.propLeadDeatils.leadStatus,
                    refNumber: this.propLeadDeatils.merchantRefCode,
                  })

                  .then((response) => {
                    let feed_paramaters;
                    if (response.status == 204) {
                      feed_paramaters = {
                        applicationNumber: this.propLeadDeatils.applicationNumber,
                        merchantRefCode: this.propLeadDeatils.merchantRefCode,
                      };
                    } else {
                      feed_paramaters = response.body;
                    }
                    self.$q.loading.show({
                      delay: 0, // ms
                      spinnerColor: "purple-9",
                      message: "Great.. All set to go",
                    });

                    if (self.leadSourceApp.multiTidEnabled == true) {
                      let param = {
                        merchantRefCode: feed_paramaters.merchantRefCode,
                        marsDeviceId: request.id,
                      };
                      self
                        .SUBMIT_SUB_TID_MERCHANT_REF_CODE_DETAILS(param)
                        .then((response) => {
                          self.$q.notify({
                            color: "positive",
                            position: "bottom",
                            message: "Successfully submitted to MARS",
                            icon: "thumb_up",
                          });
                          self.$q.loading.hide();
                        });
                      self.updateLeadStatus({
                        leadId: self.$route.params.id,
                        status: 104,
                      });
                    }
                    self
                      .MARS_DATA_EXTERNAL_SUBMIT_RESPONSE({
                        request: feed_paramaters,
                        leadId: self.$route.params.id,
                      })
                      .then((response) => {
                        self.$q.notify({
                          color: "positive",
                          position: "bottom",
                          message: "Successfully submitted to MARS",
                          icon: "thumb_up",
                        });
                        if (self.leadSourceApp.multiTidEnabled == false)
                          self.$router.push("/sat/lead/validation");
                        self.$q.loading.hide();
                      });
                  })
                  .catch((error) => {
                    this.merchant.companyInformation.constitutionName =
                      this.propLeadDeatils.merchantType.merchantTypeName;
                    this.$set(
                      finalRequest.merchant.salesInformation,
                      "applicationDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.salesInformation.applicationDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.salesInformation,
                      "aggreementDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.salesInformation.aggreementDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.salesInformation,
                      "loanDisbursementDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.salesInformation
                          .loanDisbursementDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.salesInformation,
                      "tenureStartDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.salesInformation.tenureStartDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.companyInformation,
                      "establishYear",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.companyInformation.establishYear
                      )
                    );

                    this.$set(
                      finalRequest.merchant.bankInformation.collectionDetails,
                      "chequeDepositedDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.bankInformation.collectionDetails,
                      "collectedDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.bankInformation.collectionDetails
                          .collectedDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.bankInformation.collectionDetails,
                      "chequeDate",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.bankInformation.collectionDetails
                          .chequeDate
                      )
                    );

                    this.$set(
                      finalRequest.merchant.businessInformation,
                      "memberSince",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.businessInformation.memberSince
                      )
                    );
                    this.$set(
                      finalRequest.merchant.businessInformation,
                      "lastTurnoverYear",
                      this.commonDateFormatInvalidMARSformat(
                        finalRequest.merchant.businessInformation.lastTurnoverYear
                      )
                    );

                    if (error.data.hasOwnProperty("errorDetails")) {
                      let OThis = this;
                      _.map(error.data.errorDetails, (actual) => {
                        let splitted = actual.field.split("/");
                        if (splitted[1].slice(0, 18) == "partnerInformation") {
                          let findPartnersErrorIndex = actual.field
                            .split("partnerInformation")[1]
                            .slice(1, 2);
                          let computeSplitted = splitted[splitted.length - 1];
                          let fieldErrorFound = eval(`
          OThis.$v.viewBinding.partnersArr.$each.$iter[
            ${findPartnersErrorIndex}
          ].${computeSplitted}`);
                          fieldErrorFound.$model = "";
                          OThis.error.tab.partnerInformation = true;

                          let generateErrorMessage = eval(`
          OThis.error.field.merchant.partnerInformation[
            ${findPartnersErrorIndex}
          ]`);
                          generateErrorMessage.alert = true;
                          generateErrorMessage.issue = actual.issue;
                          generateErrorMessage.value = actual.value;
                        } else {
                          let splittingErrorField = `OThis.$v.${splitted.join(
                            "."
                          )}`;
                          let fieldErrorFound = eval(splittingErrorField);
                          fieldErrorFound.$model = "";
                          OThis.$set(OThis.error.tab, splitted[1], true);

                          let generateErrorMessage = eval(
                            `OThis.error.field.${splitted.join(".")}`
                          );
                          generateErrorMessage.alert = true;
                          generateErrorMessage.issue = actual.issue;
                          generateErrorMessage.value = actual.value;
                        }
                      });
                      this.$q.notify({
                        color: "negative",
                        position: "bottom",
                        message: `${error.data.message}`,
                        icon: "thumb_down",
                      });
                    } else {
                      this.$q.notify({
                        color: "negative",
                        position: "bottom",
                        message: `${error.data.message}`,
                        icon: "thumb_down",
                      });
                    }
                    self.$q.loading.hide();
                  });
              } else {
                self
                  .MARS_CHECK_STATUS_API(finalRequest)
                  .then(response => {
                    let feed_paramaters = {
                      applicationNumber: response.body.applicationNumber,
                      merchantRefCode: response.body.merchantRefCode,
                      merchantId: null,
                      terminalId: null,
                      remarks: null,
                      agrName: null,
                      vpa: null
                    };
                    self
                      .MARS_DATA_EXTERNAL_SUBMIT_RESPONSE({
                        request: feed_paramaters,
                        leadId: self.$route.params.id
                      })
                      .then(response => {
                        self.$q.notify({
                          color: "positive",
                          position: "bottom",
                          message: "Successfully submitted to MARS",
                          icon: "thumb_up"
                        });
                        if (self.leadSourceApp.multiTidEnabled == false)
                          self.$router.push("/sat/lead/validation");
                        self.$q.loading.hide();
                      });
                  })
                  .catch(error => {
                    self.$q.loading.hide();
                    if (
                      error.body.name == "INVALID APPLICATION NUMBER" &&
                      error.status == 404
                    ) {
                      self.$q.loading.show({
                        delay: 0, // ms
                        spinnerColor: "purple-9",
                        message: "Saved.. Sending data to mars"
                      });
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
                            finalRequest.merchant.mdrPlan.incentive.percentage ==
                              0
                              ? null
                              : finalRequest.merchant.mdrPlan.incentive
                                .percentage;
                          finalRequest.merchant.mdrPlan.incentive.fixed =
                            finalRequest.merchant.mdrPlan.incentive.fixed == 0
                              ? null
                              : finalRequest.merchant.mdrPlan.incentive.fixed;
                          finalRequest.merchant.mdrPlan.incentive.minimum =
                            finalRequest.merchant.mdrPlan.incentive.minimum == 0
                              ? null
                              : finalRequest.merchant.mdrPlan.incentive.minimum;
                          finalRequest.merchant.mdrPlan.incentive.minimumTxnValue =
                            finalRequest.merchant.mdrPlan.incentive
                              .minimumTxnValue == 0
                              ? null
                              : finalRequest.merchant.mdrPlan.incentive
                                .minimumTxnValue;
                        }
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
                          finalRequest.merchant.mdrPlan.incentive
                            .minimumTxnValue == 0
                            ? null
                            : finalRequest.merchant.mdrPlan.incentive
                              .minimumTxnValue;
                      }
                      if (
                        finalRequest.merchant.salesInformation.institutionCode ==
                        "104" &&
                        this.propLeadDeatils.device.id == "31"
                      ) {
                        // alert("AXIS INSTANCE AND ME31 DEVICE CALLING")
                        finalRequest.merchant.paymentDetails.terminalModeCode =
                          "34";
                      }
                      // finalRequest.merchant.paymentDetails.numberOfTerminals = 1;
                      let size = finalRequest.merchant.partnerInformation.length;
                      for (var i = 0; i < size; i++) {
                        finalRequest.merchant.partnerInformation[
                          i
                        ].dob = this.commonDateFormatDOB1(
                          finalRequest.merchant.partnerInformation[i].dob
                        );
                      }

                      self
                        .MARS_DATA_SUBMIT_EXTERNAL({
                          params: finalRequest,
                          leadStatus: this.propLeadDeatils.leadStatus,
                          refNumber: this.propLeadDeatils.merchantRefCode
                        })

                        .then(response => {
                          let feed_paramaters;
                          if (response.status == 204) {
                            feed_paramaters = {
                              applicationNumber: this.propLeadDeatils
                                .applicationNumber,
                              merchantRefCode: this.propLeadDeatils
                                .merchantRefCode
                            };
                          } else {
                            feed_paramaters = response.body;
                          }
                          self.$q.loading.show({
                            delay: 0, // ms
                            spinnerColor: "purple-9",
                            message: "Great.. All set to go"
                          });

                          if (self.leadSourceApp.multiTidEnabled == true) {
                            let param = {
                              merchantRefCode: feed_paramaters.merchantRefCode,
                              marsDeviceId: request.id
                            };
                            self
                              .SUBMIT_SUB_TID_MERCHANT_REF_CODE_DETAILS(param)
                              .then(response => {
                                self.$q.notify({
                                  color: "positive",
                                  position: "bottom",
                                  message: "Successfully submitted to MARS",
                                  icon: "thumb_up"
                                });
                                self.$q.loading.hide();
                              });
                            self.updateLeadStatus({
                              leadId: self.$route.params.id,
                              status: 104
                            });
                          }
                          self
                            .MARS_DATA_EXTERNAL_SUBMIT_RESPONSE({
                              request: feed_paramaters,
                              leadId: self.$route.params.id
                            })
                            .then(response => {
                              self.$q.notify({
                                color: "positive",
                                position: "bottom",
                                message: "Successfully submitted to MARS",
                                icon: "thumb_up"
                              });
                              if (self.leadSourceApp.multiTidEnabled == false)
                                self.$router.push("/sat/lead/validation");
                              self.$q.loading.hide();
                            });
                        })
                        .catch(error => {
                          this.merchant.companyInformation.constitutionName = this.propLeadDeatils.merchantType.merchantTypeName;
                          this.$set(
                            finalRequest.merchant.salesInformation,
                            "applicationDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.salesInformation
                                .applicationDate
                            )
                          );

                          this.$set(
                            finalRequest.merchant.salesInformation,
                            "aggreementDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.salesInformation
                                .aggreementDate
                            )
                          );

                          this.$set(
                            finalRequest.merchant.salesInformation,
                            "loanDisbursementDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.salesInformation
                                .loanDisbursementDate
                            )
                          );

                          this.$set(
                            finalRequest.merchant.salesInformation,
                            "tenureStartDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.salesInformation
                                .tenureStartDate
                            )
                          );

                          this.$set(
                            finalRequest.merchant.companyInformation,
                            "establishYear",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.companyInformation
                                .establishYear
                            )
                          );

                          this.$set(
                            finalRequest.merchant.bankInformation
                              .collectionDetails,
                            "chequeDepositedDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.bankInformation
                                .collectionDetails.chequeDepositedDate
                            )
                          );

                          this.$set(
                            finalRequest.merchant.bankInformation
                              .collectionDetails,
                            "collectedDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.bankInformation
                                .collectionDetails.collectedDate
                            )
                          );

                          this.$set(
                            finalRequest.merchant.bankInformation
                              .collectionDetails,
                            "chequeDate",
                            this.commonDateFormatInvalidMARSformat(
                              finalRequest.merchant.bankInformation
                                .collectionDetails.chequeDate
                            )
                          );

                          this.$set(
