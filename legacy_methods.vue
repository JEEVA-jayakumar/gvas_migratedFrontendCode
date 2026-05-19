        let self = this;
        let vasArr = [];
        let data = new Object();
        if (this.propLeadDeatils.leadSource.multiTidEnabled == true) {
          let params1 = {
            leadSource: this.propLeadDeatils.leadSource.id,
            device: this.propLeadDeatils.device.id,
          };
          self.GET_LS_AND_DEVICE_BASED_VAS_DETAILS(params1).then((response) => {
            //  if (response.status == 200) {
            self.getLsDeviceBasedVasDetails.vasList.map(function (value, key) {
              vasArr.push({
                label: value.name,
                value: JSON.stringify(value),
              });
            });
            this.vasBasedOnInstance = vasArr;
          });
        } else {
          self.FETCH_INSTANCE(params).then((response) => {
            if (response.status == 200) {
              self.getInstance.map(function (value, key) {
                vasArr.push({
                  label: value.vas.name,
                  value: value.vas.name,
                });
              });

              // this.vasBasedOnInstance = vasArr.map((opt) => ({
              //   ...opt,
              //   disable: this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS' && opt.value !== 'UPI QR'
              // }));
              // this.$nextTick(() => {
              //   const upiExists = this.vasBasedOnInstance.some(opt => opt.value === 'UPI QR');
              //   if (upiExists) {
              //     this.tmpVasMapping = ['UPI QR'];
              //     this.vasKey++; // ✅ Force re-render
              //     console.log('✅ Auto-selected VAS:', this.tmpVasMapping);
              //   }
              // });
              if (this.propLeadDeatils.leadSource.sourceName === "LS_TOHANDS") {
                this.vasBasedOnInstance = vasArr;
                this.vasBasedOnInstance = vasArr.map((opt) => ({
                  ...opt,
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
              //   // Disable all except UPI QR
              //   vasArr.forEach(option => {
              //     option.disable = option.value !== 'UPI QR';
              //   });

              //   this.vasBasedOnInstance = vasArr;

              //   // ✅ Important: Apply selection after options render
              //   this.$nextTick(() => {
              //     const upiExists = this.vasBasedOnInstance.some(opt => opt.value === 'UPI QR');
              //     if (upiExists) {
              //       this.tmpVasMapping = ['UPI QR']; // this must match the value field
              //       console.log('Auto-selected VAS:', this.tmpVasMapping);
              //     } else {
              //       console.warn('UPI QR not found in VAS list.');
              //     }
              //   });

              // } else {
              //   // Normal flow without disabling
              //   this.vasBasedOnInstance = vasArr;
              // }
              // if (this.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS') {
              //   vasArr.forEach(option => {
              //     option.disable = option.value !== 'UPI QR';
              //   });

              //   this.vasBasedOnInstance = vasArr;

              //   // 🛠️ Use $nextTick to ensure UI is updated before assigning selection
              //   this.$nextTick(() => {
              //     // Double check if 'UPI QR' is actually present in the options
              //     const isUpiPresent = vasArr.some(opt => opt.value === 'UPI QR');
              //     if (isUpiPresent) {
              //       this.tmpVasMapping = ['UPI QR'];
              //     } else {
              //       console.warn('UPI QR not found in options');
              //     }
              //   });
              // } else {
              //   this.vasBasedOnInstance = vasArr;
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

        //  });
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
          })
          .then(() => {
            this.$q.loading.show({
              delay: 0, // ms
              spinnerColor: "purple-9",
              message: "Processing ..",
            });

            this.MOVE_BACK_DOCUMENT_VERIFICATION_STAGE(formData).then(() => {
              this.$router.push("/sat/lead/validation/" + this.$route.params.id);
              this.$q.loading.hide();
            });
          })
          .catch((error) => {
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
          let obj = response.body.data.marsDeviceModel;
          this.terminalModelSet = [];
          this.terminalModelSet.push({
            label: obj.name,
            value: obj.code,
          });
          this.merchant.paymentDetails.terminalModeCode = obj.code;
        });
      },
