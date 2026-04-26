import re

filepath = 'src/components/sat/showMarsFormComponent.vue'
with open(filepath, 'r') as f:
    content = f.read()

# Replace this.v$.merchant.SharingDiscountFee.$error with this.v$.merchant.SharingDiscountFee.$anyError
content = content.replace('this.v$.merchant.SharingDiscountFee.$error', 'this.v$.merchant.SharingDiscountFee.$anyError')
content = content.replace('this.v$.merchant.mdrPlan.$error', 'this.v$.merchant.mdrPlan.$anyError')
content = content.replace('this.v$.merchant.salesInformation.$error', 'this.v$.merchant.salesInformation.$anyError')
content = content.replace('this.v$.merchant.companyInformation.$error', 'this.v$.merchant.companyInformation.$anyError')
content = content.replace('this.v$.viewBinding.partnersArr.$error', 'this.v$.viewBinding.partnersArr.$anyError')
content = content.replace('this.v$.merchant.businessInformation.$error', 'this.v$.merchant.businessInformation.$anyError')
content = content.replace('this.v$.merchant.paymentDetails.$error', 'this.v$.merchant.paymentDetails.$anyError')
content = content.replace('this.v$.merchant.revParameters.$error', 'this.v$.merchant.revParameters.$anyError')
content = content.replace('this.v$.merchant.bankInformation.$error', 'this.v$.merchant.bankInformation.$anyError')

with open(filepath, 'w') as f:
    f.write(content)
