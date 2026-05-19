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
