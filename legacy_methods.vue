      populateCustom() {
        let param =
          this.merchant.customIncentiveRates[0].mechantFixed +
          this.merchant.customIncentiveRates[0].sharingFixed;
        this.merchant.customIncentiveRates[0].add = param;
      },
