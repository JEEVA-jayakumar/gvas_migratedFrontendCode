fnApproveLeadData(leadInfo) {
      let formData = {
        leadInformation: {
          fieldName: "Full Lead Information",
          reason: ""
        },
        leadId: leadInfo.id,
        defaultUrlValue:
          this.getShortLeadInfo.leadStatus == this.$LEAD_STATUS_REFER_BACK
            ? this.$SAT_LEAD_VALIDATION_PROCEED_TO_DATA_ENTRY_WITH_REFERBACK
            : this.$SAT_LEAD_VALIDATION_APPROVE
      };
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure want to proceed to data entry?",
          ok: "Continue",
          cancel: "Cancel"
        })
        .then(() => {
          this.$q.loading.show({
            delay: 0, // ms
            spinnerColor: "purple-9",
            message: "Validating .."
          });
          this.VERIFY_LEAD_DOCUMENTS({ id: this.$route.params.id, params: [] })
            .then(response => {
              this.$q.loading.show({
                delay: 0, // ms
                spinnerColor: "purple-9",
                message: "Processing .."
              });
              this.VERIFY_LEAD_DATA(formData).then(response => {
                this.$q.loading.hide();
                this.$router.push(
                  "/sat/lead/validation/" +
                    this.$route.params.id +
                    "/data/entry/"
                );
              });
            })
            .catch(error => {
              if (error.data.data.toBeVerifiedDocuments.length > 0) {
                let arrayMessage = "";
                _.map(error.data.data.toBeVerifiedDocuments, oo => {
                  arrayMessage += `${oo}, `;
                });
                this.$q.notify({
                  color: "amber-9",
                  position: "bottom-left",
                  message: `${error.data.message}`,
                  detail: arrayMessage,
                  timeout: 8000,
                  icon: "warning",
                  actions: [
                    {
                      icon: "clear", // optional
                      noDismiss: false // optional, v0.15.11+
                    }
                  ]
                });
              } else {
                this.$delete(error.data.data, "toBeVerifiedDocuments");
                for (var key in error.data.data) {
                  let arrayMessage = "";
                  _.map(error.data.data[key], oo => {
                    arrayMessage += `${oo}, `;
                  });
                  this.$q.notify({
                    color: "amber-9",
                    position: "bottom-left",
                    message: `${error.data.message} for key`,
                    detail: arrayMessage,
                    timeout: 8000,
                    icon: "warning",
                    actions: [
                      {
                        icon: "clear", // optional
                        noDismiss: false // optional, v0.15.11+
                      }
                    ]
                  });
                }
              }
              this.$q.loading.hide();
            });
        });
    }