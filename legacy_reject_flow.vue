    fnToggleRejectLeadComp(leadInfo) {
      this.$q.loading.show({
        delay: 0, // ms
        spinnerColor: "purple-9",
        message: "Validating .."
      });
      if (
        this.getShortLeadInfo.documentUploadedType ==
        this.$DOCUMENT_UPLOAEDED_TYPE_HANDOVER_SAT
      ) {
        this.toggleLeadRejectModal = !this.toggleLeadRejectModal;
        this.$q.loading.hide();
      } else {
        this.VERIFY_REJECT_LEAD_DOCUMENTS({ id: this.$route.params.id })
          .then(response => {
            this.$q.loading.show({
              delay: 0, // ms
              spinnerColor: "purple-9",
              message: "Processing .."
            });
            this.toggleLeadRejectModal = !this.toggleLeadRejectModal;
            this.$q.loading.hide();
          })
          .catch(error => {
            let arrayMessage = "";
            _.map(error.data.data, oo => {
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
            this.$q.loading.hide();
          });
      }
    },

    //Function to get approved by user for payment information
    fnGetVerifiedPerson() {
      let sortedArr = _.orderBy(
        this.getShortLeadInfo.leadVerificationStatus,
        ["id"],
