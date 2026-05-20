
 import viewLeadDocumentsDataEntryComponent from "./viewLeadDocumentsDataEntryComponent.vue";
 import MarsErrorResponse from "../MarsErrorResponseHandler.vue";

 import { helpers, forEach } from "@vuelidate/validators";
 const today = new Date();
 const { startOfDate, addToDate, subtractFromDate } = date;
 const panCard = helpers.regex(
 "panCard",
 /^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/
 );

 const gstn = helpers.regex(
 "gstn",
 // /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9]{1})+$/
 /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
 );

 // 4 alphabets, 5 numbers, 1 number
 const tanValidate = helpers.regex("tanValidate", /[A-Za-z]{4}\d{5}[A-Za-z]{1}/);
 const timeValidate = helpers.regex(
 "timeValidate",
 /^(?:\d|[01]\d|2[0-3])\.[0-5]\d$/
 );

 // const alphaNumericValidate = helpers.regex(
 // "alphaNumericValidate",
 // /^[a-zA-Z ]*$/
 // );
 // const alphaNumericValidate = helpers.regex(
 // "alphaNumericValidate",
 // /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/
 // );
 const alphaNumericValidate = helpers.regex(
 "alphaNumericValidate",
 /^(?:[A-Za-z0-9]+)(?:[A-Za-z0-9 ]*)$/
 );
 const alphaNumericSpecialValidate = helpers.regex(
 "alphaNumericSpecialValidate",
 /^[ A-Za-z0-9_@.*#/!%^()&+-,"]*$/
 );
 // const alpha = helpers.regex(
 // "Only letters and spaces are allowed",
 // /^[a-zA-Z\s]*$/
 // );
 const alpha = helpers.regex("alphaNumericSpecialValidate", /^[A-Za-z0-9\s]*$/);

 export default {
 setup() {
 return { v$: useVuelidate() };
 },
 name: "leadDataEntry",
 components: {
 MarsErrorResponse,
 viewLeadDocumentsDataEntryComponent,
 multiTidComponents,
 },
 props: ["propLeadDeatils"],
 data() {
 return {
 step: "first",
 propTogglemultiTidComponentDetails: false,
 subTidListConfs: {},
 today,
 // selectedSecond: [
 // vasBasedOnInstance : {}
 // ],
 past: subtractFromDate(today, { days: 76500 }),
 future: addToDate(today, { days: 0 }),
 check: "",
 showPartnerstab: false,
 vasDisableFlag: false,
 showAxistab: false,
 ifscErrFlag: false,
 // vasDisable: false,
 salesInformationError: false,
 companyInformationError: false,
 revParametersError: false,
 businessInformationError: false,
 partnerInformationError: false,
 paymentDetailsError: false,
 ptCitySelected: false,
 companyRegisteredCitySelected: false,
 companyRegisteredStateSelected: false,
 mccOptions: [],
 cityOptionsFiltered: [],
 stateOptionsFiltered: [],
 residentCityOptionsFiltered: [],
 residentStateOptionsFiltered: [],
 partnerCityOptions: [],
 partnerStateOptions: [],
 bankCityOptionsFiltered: [],
 bankStateOptionsFiltered: [],
 iorStateOptions: [],
 axisBankPincodeOptions: [],

 bankInformationError: false,
 file: "",
 subventionBankFeeData: "",
 originalBankFeeData: 0,
 baseTidFlag: true,
 SubTidField: false,
 genSubTidFlag: false,
 // VasTerminalType:"",
 viewBinding: {},
 incentive1: {},
 plan: [],
 //start >> Actual dropdown options values
 dob: {
 from: null,
 to: null,
 },
 baseAndSubTidList: [],
 listAllSubTidDetails: [],
 disabledListAllSubTidDetails: [],
 addtnmultiTidComponentDetails: {
 merchant: {},
 propLeadDeatils: {},
 leadId: "",
 diners: {},
 holdPayment: 0,
 },
 columns: [
 {
 name: "tid",
 required: true,
 label: "Tid",
 align: "left",
 field: (row) => {
 return row.tid == null ? "NA" : row.tid;
 },
 sortable: true,
 },
 {
 name: "mid",
 required: true,
 label: "Mid",
 align: "left",
 field: (row) => {
 return row.mid == null ? "NA" : row.mid;
 },
 sortable: true,
 },
 {
 name: "baseTid",
 required: true,
 label: "BaseTid",
 align: "left",
 field: "baseTid",
 sortable: true,
 },
 {
 name: "institutionCode",
 required: true,
 label: "Institution Code",
 align: "left",
 field: "institutionCode",
 sortable: true,
 },
 //subTid
 {
 name: "subTid",
 required: true,
 label: "SubTid",
 align: "left",
 field: "subTid",
 sortable: true,
 },
 //tidIdentifier
 {
 name: "tidIdentifier",
 required: true,
 label: "Tid Identifier",
 align: "left",
 field: "tidIdentifier",
 sortable: true,
 },
 {
 name: "action",
 required: true,
 label: "",
 align: "center",
 field: "action",
 sortable: true,
 },
 ],
 institutionCodeOptions: [
 {
 label: "IOB GPRS",
 value: 101,
 },
 {
 label: "Axis Bank",
 value: 104,
 },
 {
 label: "Corp Bank",
 value: 103,
 },
 {
 label: "Federal",
 value: 102,
 },
 {
 label: "MPOS",
 value: 107,
 },
 ],
 bijlipaySwitchOptions: [
 {
 label: "Yes",
 value: true,
 },
 {
 label: "No",
 value: false,
 },
 ],
 smsFlagOptions: [
 {
 label: "Yes",
 value: "Y",
 },
 {
 label: "No",
 value: "N",
 },
 ],
 applicationTypeOptions: [
 {
 label: "Digital",
 value: "D",
 },
 {
 label: "Non Digital",
 value: "N",
 },
 ],
 categoryTypeOptions: [
 {
 label: "Small",
 value: "S",
 },
 {
 label: "Other",
 value: "O",
 },
 ],
 cardAcceptanceOptions: [
 {
 label: "International + Domestic Credit/Debit Card",
 value: "0",
 },
 {
 label: "Domestic Credit/Debit Cards",
 value: "1",
 },
 {
 label: "Domestic Debit Cards",
 value: "3",
 },
 ],
 terminalTypeOptions: [
 {
 label: "POS",
 value: "POS",
 },
 {
 label: "MPOS ",
 value: "MPOS",
 },
 {
 label: "PG",
 value: "PG",
 },
 ],
 merchantOptions: [
 {
 label: "Individual",
 value: "90",
 },
 {
 label: "Proprietor",
 value: "80",
 },
 {
 label: "Pvt Ltd",
 value: "70",
 },
 {
 label: "Public Ltd",
 value: "60",
 },
 {
 label: "Partnership",
 value: "61",
 },
 {
 label: "Trust",
 value: "50",
 },
 {
 label: "Government",
 value: "30",
 },
 {
 label: "Society",
 value: "40",
 },
 ],

 merchantTypeOptions: [
 {
 label: "POS Merchant",
 value: "P",
 },
 {
 label: "HERMES Merchant",
 value: "H",
 },
 // {
 // label: "Pagement Gateway",
 // value: "G"
 // }
 ],
 BusinessHourToOptions: [
 {
 label: "00.00",
 value: "00.00",
 },
 {
 label: "00.30",
 value: "00.30",
 },
 {
 label: "01.00",
 value: "01.00",
 },
 {
 label: "01.30",
 value: "01.30",
 },
 {
 label: "02.00",
 value: "02.00",
 },
 {
 label: "02.30",
 value: "02.30",
 },
 {
 label: "03.00",
 value: "03.00",
 },
 {
 label: "03.30",
 value: "03.30",
 },
 {
 label: "04.00",
 value: "04.00",
 },
 {
 label: "04.30",
 value: "04.30",
 },
 {
 label: "05.00",
 value: "05.00",
 },
 {
 label: "05.30",
 value: "05.30",
 },
 {
 label: "06.00",
 value: "06.00",
 },
 {
 label: "06.30",
 value: "06.30",
 },
 {
 label: "07.00",
 value: "07.00",
 },
 {
 label: "07.30",
 value: "07.30",
 },
 {
 label: "08.00",
 value: "08.00",
 },
 {
 label: "08.30",
 value: "08.30",
 },
 {
 label: "09.00",
 value: "09.00",
 },
 {
 label: "09.30",
 value: "09.30",
 },
 {
 label: "10.00",
 value: "10.00",
 },
 {
 label: "10.30",
 value: "10.30",
 },
 {
 label: "11.00",
 value: "11.00",
 },
 {
 label: "11.30",
 value: "11.30",
 },
 {
 label: "12.00 ",
 value: "12.00",
 },
 {
 label: "12.30",
 value: "12.30",
 },
 {
 label: "13.00 ",
 value: "13.00",
 },
 {
 label: "13.30",
 value: "13.30",
 },
 {
 label: "14.00 ",
 value: "14.00",
 },
 {
 label: "14.30",
 value: "14.30",
 },
 {
 label: "15.00 ",
 value: "15.00",
 },
 {
 label: "15.30",
 value: "15.30",
 },
 {
 label: "16.00 ",
 value: "16.00",
 },
 {
 label: "16.30",
 value: "16.30",
 },
 {
 label: "17.00 ",
 value: "17.00",
 },
 {
 label: "17.30",
 value: "17.30",
 },
 {
 label: "18.00 ",
 value: "18.00",
 },
 {
 label: "18.30",
 value: "18.30",
 },
 {
 label: "19.00 ",
 value: "19.00",
 },
 {
 label: "19.30",
 value: "19.30",
 },
 {
 label: "20.00 ",
 value: "20.00",
 },
 {
 label: "20.30",
 value: "20.30",
 },

 {
 label: "21.00 ",
 value: "21.00",
 },
 {
 label: "21.30",
 value: "21.30",
 },
 {
 label: "22.00 ",
 value: "22.00",
 },
 {
 label: "22.30",
 value: "22.30",
 },
 {
 label: "23.00 ",
 value: "23.00",
 },
 {
 label: "23.30",
 value: "23.30",
 },
 ],
 BusinessHourFromOptions: [
 {
 label: "00.00",
 value: "00.00",
 },
 {
 label: "00.30",
 value: "00.30",
 },
 {
 label: "01.00",
 value: "01.00",
 },
 {
 label: "01.30",
 value: "01.30",
 },
 {
 label: "02.00",
 value: "02.00",
 },
 {
 label: "02.30",
 value: "02.30",
 },
 {
 label: "03.00",
 value: "03.00",
 },
 {
 label: "03.30",
 value: "03.30",
 },
 {
 label: "04.00",
 value: "04.00",
 },
 {
 label: "04.30",
 value: "04.30",
 },
 {
 label: "05.00",
 value: "05.00",
 },
 {
 label: "05.30",
 value: "05.30",
 },
 {
 label: "06.00",
 value: "06.00",
 },
 {
 label: "06.30",
 value: "06.30",
 },
 {
 label: "07.00",
 value: "07.00",
 },
 {
 label: "07.30",
 value: "07.30",
 },
 {
 label: "08.00",
 value: "08.00",
 },
 {
 label: "08.30",
 value: "08.30",
 },
 {
 label: "09.00",
 value: "09.00",
 },
 {
 label: "09.30",
 value: "09.30",
 },
 {
 label: "10.00",
 value: "10.00",
 },
 {
 label: "10.30",
 value: "10.30",
 },
 {
 label: "11.00",
 value: "11.00",
 },
 {
 label: "11.30",
 value: "11.30",
 },
 {
 label: "12.00 ",
 value: "12.00",
 },
 {
 label: "12.30",
 value: "12.30",
 },
 {
 label: "13.00 ",
 value: "13.00",
 },
 {
 label: "13.30",
 value: "13.30",
 },
 {
 label: "14.00 ",
 value: "14.00",
 },
 {
 label: "14.30",
 value: "14.30",
 },
 {
 label: "15.00 ",
 value: "15.00",
 },
 {
 label: "15.30",
 value: "15.30",
 },
 {
 label: "16.00 ",
 value: "16.00",
 },
 {
 label: "16.30",
 value: "16.30",
 },
 {
 label: "17.00 ",
 value: "17.00",
 },
 {
 label: "17.30",
 value: "17.30",
 },
 {
 label: "18.00 ",
 value: "18.00",
 },
 {
 label: "18.30",
 value: "18.30",
 },
 {
 label: "19.00 ",
 value: "19.00",
 },
 {
 label: "19.30",
 value: "19.30",
 },
 {
 label: "20.00 ",
 value: "20.00",
 },
 {
 label: "20.30",
 value: "20.30",
 },

 {
 label: "21.00 ",
 value: "21.00",
 },
 {
 label: "21.30",
 value: "21.30",
 },
 {
 label: "22.00 ",
 value: "22.00",
 },
 {
 label: "22.30",
 value: "22.30",
 },
 {
 label: "23.00 ",
 value: "23.00",
 },
 {
 label: "23.30",
 value: "23.30",
 },
 ],
 merchantTypeCodeOptions: [
 {
 label: "Stand Alone",
 value: "S",
 },
 {
 label: "Integrated",
 value: "I",
 },
 ],
 currentPosOptions: [
 {
 label: "YES",
 value: "Y",
 },
 {
 label: "NO",
 value: "N",
 },
 ],

 businessTypeOptions: [
 {
 label: "Rented",
 value: "R",
 },
 {
 label: "Owned",
 value: "O",
 },
 {
 label: "Leased",
 value: "L",
 },
 ],
 // acquiringBankOptions: [
 // {
 // label: "IOB",
 // value: 101
 // },
 // {
 // label: "AU",
 // value: 102
 // },
 // {
 // label: "EQUITAS",
 // value: 103
 // }
 // ],
 autoormanualOptions: [
 {
 label: "Auto Settlement",
 value: "A",
 },
 {
 label: "Manual Settlement",
 value: "M",
 },
 ],

 // mcccodeOptions: [
 // {
 // label: "Restricted MCC",
 // value: "100",
 // },
 // {
 // label: "High Risk MCC",
 // value: "90",
 // },
 // {
 // label: "Medium Risk MCC",
 // value: "60",
 // },
 // {
 // label: "Low Risk MCC",
 // value: "30",
 // },

 // ],

 statezoneOptions: [
 {
 label: "East Zone",
 value: "90",
 },
 {
 label: "West Zone",
 value: "80",
 },
 {
 label: "North Zone",
 value: "70",
 },
 {
 label: "South Zone",
 value: "60",
 },
 ],
 tipFaclityOptions: [
 {
 label: "Yes",
 value: "Y",
 },
 {
 label: "No",
 value: "N",
 },
 ],
 saleFlagOptions: [
 {
 label: "Yes",
 value: "1",
 },
 {
 label: "No",
 value: "0",
 },
 ],
 edcOptions: [
 {
 label: "Yes",
 value: "EDC01",
 },
 {
 label: "No",
 value: "N",
 },
 ],
 internationalCardAcceptanceOptions: [
 {
 label: "Yes",
 value: "Y",
 },
 {
 label: "No",
 value: "N",
 },
 ],
 // preauthFacilityOptions: [
 // {
 // label: "Yes",
 // value: "Y"
 // },
 // {
 // label: "No",
 // value: "N"
 // }
 // ],
 creditCardBlockOptions: [
 {
 label: "Yes",
 value: "Y",
 },
 {
 label: "No",
 value: "N",
 },
 ],
 constitutionOptions: [
 {
 label: "Individuals",
 value: "IN",
 },
 {
 label: " Partnership/LLP",
 value: "PL",
 },
 {
 label: "Sole Proprietorship",
 value: "SP",
 },
 {
 label: "Public/Pvt.Ltd",
 value: "PB",
 },
 {
 label: "Trust",
 value: "TR",
 },
 {
 label: "Society",
 value: "SO",
 },
 {
 label: "Other",
 value: "OT",
 },
 ],
 deviceOwnedByOptions: [
 // {
 // label: "Bijlipay",
 // value: "B"
 // },
 // {
 // label: "Merchant",
 // value: "M"
 // }
 {
 label: "Service Provide(Bijlipay)",
 value: "S",
 },
 {
 label: "BANK",
 value: "B",
 },
 {
 label: "Merchant",
 value: "M",
 },
 ],
 // cashAtPosEnabledOptions: [
 // {
 // label: "Yes",
 // value: "Y"
 // },
 // {
 // label: "No",
 // value: "N"
 // }
 // ],
 omcEnabledOptions: [
 {
 label: "Yes",
 value: "Y",
 },
 {
 label: "No",
 value: "N",
 },
 ],
 rentalTypeOptions: [
 {
 label: "Advanced",
 value: "A",
 },
 {
 label: "Regular",
 value: "R",
 },
 {
 label: "EMI",
 value: "E",
 },
 ],
 iaSalutationOptions: [
 {
 label: "MR",
 value: "Mr",
 },
 {
 label: "MRS",
 value: "Mrs",
 },
 {
 label: "Ms",
 value: "Ms",
 },
 ],
 iaGenderOptions: [
 {
 label: "Male",
 value: "M",
 },
 {
 label: "FeMale",
 value: "F",
 },
 {
 label: "Transgender",
 value: "T",
 },
 ],
 od1SalutationOptions: [
 {
 label: "MR",
 value: "Mr",
 },
 {
 label: "MRS",
 value: "Mrs",
 },
 {
 label: "MS",
 value: "Ms",
 },
 ],
 od1GenderOptions: [
 {
 label: "Male",
 value: "M",
 },
 {
 label: "FeMale",
 value: "F",
 },
 {
 label: "Transgender",
 value: "T",
 },
 ],
 od2SalutationOptions: [
 {
 label: "MR",
 value: "Mr",
 },
 {
 label: "MRS",
 value: "Mrs",
 },
 {
 label: "MS",
 value: "Ms",
 },
 ],
 od2GenderOptions: [
 {
 label: "Male",
 value: "M",
 },
 {
 label: "FeMale",
 value: "F",
 },
 {
 label: "Transgender",
 value: "T",
 },
 ],

 d1SalutionOptions: [
 {
 label: "MR",
 value: "Mr",
 },
 {
 label: "MR",
 value: "Mr",
 },
 ],
 states: [
 {
 label: "TamilNadu",
 value: "tamilnadu",
 },
 {
 label: "Karnataka",
 value: "karnataka",
 },
 {
 label: "Andhrapradesh",
 value: "andhrapradesf",
 },
 ],
 city: [
 {
 label: "chennai",
 value: "chennai",
 },
 {
 label: "vellore",
 value: "vellore",
 },
 {
 label: "madurai",
 value: "madurai",
 },
 ],
 fillingTypes: [
 {
 label: "Society",
 value: "society",
 },
 {
 label: "Partnership",
 value: "Partnership",
 },
 {
 label: "LLP",
 value: "LLP",
 },
 {
 label: "Trust",
 value: "Trust",
 },
 {
 label: "Govt",
 value: "Govt",
 },
 {
 label: "Individual",
 value: "Individual",
 },
 {
 label: "Sole",
 value: "Sole",
 },
 {
 label: "Public",
 value: "Public",
 },
 {
 label: "Private",
 value: "Private",
 },
 ],
 subCategory: [
 {
 label: "100-hospital",
 value: "100",
 },
 {
 label: "101-Schools",
 value: "101",
 },
 {
 label: "102-Educations",
 value: "102",
 },
 ],
 categoryCode: [
 {
 label: "1",
 value: "1",
 },
 {
 label: "2",
 value: "2",
 },
 {
 label: "3",
 value: "3",
 },
 ],

 rentalModeOptions: [
 {
 label: "Standing instructions",
 value: "S",
 },
 {
 label: "Normal",
 value: "N",
 },
 {
 label: "Nabad",
 value: "B",
 },
 {
 label: "Invoice for EPRS",
 value: "I",
 },
 {
 label: "Equitas Rental",
 value: "E",
 },
 {
 label: "Big merchant",
 value: "M",
 },
 {
 label: "Invoice to Trade",
 value: "IT",
 },
 {
 label: "Rental Fee Waiver",
 value: "RW",
 },
 {
 label: "Advance Rental",
 value: "AR",
 },
 {
 label: "Settlement",
 value: "SE",
 },
 {
 label: "Exibition",
 value: "EX",
 },
 {
 label: "Clix",
 value: "CX",
 },
 {
 label: "Subvention",
 value: "SB",
 },
 {
 label: "EMI Rental",
 value: "EM",
 },
 {
 label: "BPCL",
 value: "BP",
 },
 {
 label: "Demo Device",
 value: "DD",
 },
 {
 label: "Invoice to Bank",
 value: "IB",
 },
 {
 label: "Finetree Finance LTD",
 value: "FF",
 },
 {
 label: "Deactivated",
 value: "DT",
 },
 {
 label: "APAC FINANCIAL SERVICES PVT LTD",
 value: "AP",
 },
 {
 label: "NEO GROWTH",
 value: "NG",
 },
 {
 label: "Capital Float",
 value: "CF",
 },
 {
 label: "KBL Rent Settlement",
 value: "KS",
 },
 {
 label: "KBL Rent Invoice to Bank",
 value: "KI",
 },
 ],
 advanceRentModeOptions: [
 {
 label: "Card",
 value: "Card",
 },
 {
 label: "Cheque",
 value: "Cheque",
 },
 {
 label: "NEFT",
 value: "NEFT",
 },
 {
 label: "IMPS",
 value: "IMPS",
 },
 {
 label: "Cash",
 value: "Cash",
 },
 ],
 accountTypeOptions: [
 {
 label: "Saving account",
 value: "S",
 },
 {
 label: "Current account",
 value: "C",
 },
 {
 label: "Overdraft account",
 value: "O",
 },
 {
 label: "Cash credit account",
 value: "R",
 },
 ],

 feeTypeOptions: [
 {
 label: "NEFT",
 value: "N",
 },
 {
 label: "Settlement",
 value: "S",
 },
 {
 label: "None",
 value: "X",
 },
 ],
 paymnentModeOptions: [
 {
 label: "Direct credit",
 value: "D",
 },
 {
 label: "NEFT",
 value: "N",
 },
 // {
 // label: "IMPS",
 // value: "I"
 // }
 ],
 regionOptions: [],
 leadFromOptions: [],
 allDistrict: [],
 tccOptions: [],
 salesPersonOptions: [],
 sharingPartnerOptions: [],
 cityOptions: [],
 stateOptions: [],
 mccSearchSet: [],
 terminalModelSet: [],
 ifscSet: [],
 vasSet: [],
 action: "",
 rentalPlanSet: [],
 mdrSearchSet: [],
 bankListSet: [],
 networkProviderListSet: [],
 serviceProviderListSet: [],
 // VasTerminalType:[],

 //end >> Actual dropdown options values

 holdPayment: 0,

 formdata: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 formdata1: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 // leadDataEntryRemarks: "",
 soSelectedVas: "",
 vasBasedOnInstance: [],
 tmpVasMapping: [],
 leadSourceApp: {},
 // multiTidEnabled: "",
 deviceTypeApp: {},
 salesCode: "",
 salesPerson: "",
 salesPersonName: "",
 devicePrice: "",
 ChequeDatas: "",
 revParamAndLeadInfo: {
 bijlipaySwitch: true,
 vasInstanceMapping: "",
 },
 merchant: {
 device: "",
 revParameters: {
 cashAtPosEnabled: "N",
 tipEnabled: "N",
 saleFlag: "1",
 notificationRecipient: "N",
 // saleEnabled:"",
 preAuth: "N",
 settlementType: "A",

 txnEmiAllowed: "0",
 sodexoEnabled: "0",
 amexEnabled: "0",
 bqrEnabled: "0",
 upichargeslipEnabled: "0",
 linkpaymentFlag: "0",
 matmAllowed: "N",
 upiFlag: "0",
 },
 salesInformation: {
 // leadSourceApp:null,
 // deviceTypeApp:null,

 institutionCode: 101,
 applicationType: "D",
 applicationNumber: "",
 applicationDate: "",
 aggreementDate: "",
 merchantType: "P",
 categoryType: "O",
 region: "",
 salesPersonName: "",
 // salesPersonCode: "",

 // soName:"",
 // regionName:"",
 leadFrom: "",
 // leadSourceName:"",
 // installationBranchCode: "",
 // iaDistrict: "",
 // iaLocation: "",
 // raDistrict: "",
 // od1District: "",
 // od2District: "",
 // lorState: "",
 // iaSalutation: "",
 // iaGender: "",
 // od1Salutation: "",
 // od1Gender: "",
 // od2Salutation: "",
 // od2Gender: "",

 sharingModelCode: "N",
 sharingPartnerCode: "",
 dailyFixedAmount: "",
 loanDisbursementPercentage: "",
 loanDisbursementAmount: "",
 loanDisbursementDate: "",
 tenureMonth: "",
 tenureDay: "",
 tenureStartDate: "",
 rentPercentage: 2,
 rentFixed: "",
 },
 additionalInfo: {
 installationBranchCode: "",
 iaLocation: "",
 iaDistrict: "",
 branchZone: "",
 raDistrict: "",
 od1District: "",
 od2District: "",
 lorState: "",
 iaSalutation: "",
 iaGender: "",
 od1Salutation: "",
 od1Gender: "",
 od2Salutation: "",
 od2Gender: "",
 // ownerFirstName: "",
 // ownerLastName: "",
 // ownerDOB: this.commonDateFormatDOB(this.propLeadDeatils?.ownerDOB),
 state: "",
 city: "",
 fillingType: "",
 category: "",
 subCategory: "",
 ownerDOB: "",
 pin: "",
 city: "",
 },
 companyInformation: {
 legalName: "",
 dbaName: "",
 smsFlag: "",
 registeredAddress: "",
 registeredPin: "",
 registeredCityRefCode: "",
 registeredStateRefCode: "",
 constitution: "",
 // constitutionName:JSON.stringify(this.propLeadDeatils?.merchantType?.merchantTypeName),
 constitutionName: "",
 constitutionDescription: "",
 establishYear: "",
 registerNumber: "",
 pan: "",
 tin: "",
 tan: "",
 businessNature: "",
 businessType: "R",
 // acquiringBank: "",
 mcc: "",
 // intlCardAcceptance: "N",
 // settlementType: "A",
 // tipEnabled: "N",
 // preAuth: "N",
 // creditCardBlock: "N",
 residentialAddress: "",
 residentialPin: "",
 statezone: "",
 cityzone: "",
 // mcccode:"",
 residentialCityRefCode: "",
 residentialStateRefCode: "",
 contactName: "",
 contactMobile: "",
 contactAlternateMobile: "",
 contactPhone: "",
 contactEmail: "",
 // statementType: "P",
 statementType: "E",
 statementFrequency: "D",
 statementEmail: "",
 },
 businessInformation: {
 weekdayStartHour: "",
 weekdayEndHour: "",
 weekendStartHour: "",
 weekendEndHour: "",
 //BusinessHour:"",
 lastTurnoverYear: null,
 maximumMonthlyUsage: "",
 merchantTypeCode: "",
 // currentPos:"",
 lastTurnoverAmount: "",
 expectedCardBusiness: "",
 averageBillAmount: "",
 gstId: null,
 currentPosName: "",
 debitCardMdr: "",
 creditCardMdr: "",
 memberSince: "",
 // member:"",
 businessIncome: "",
 },
 partnerInformation: [
 {
 name: "",
 address: "",
 pan: "",
 pin: "",
 stateRefCode: "",
 cityRefCode: "",
 contactMobile: "",
 contactEmail: "",
 dob: "",
 },
 ],
 customIncentiveRates: [
 {
 minValue: 200,
 maxValue: 999,
 mechantFixed: 0.5,
 merchantPercent: 0,
 sharingFixed: 0,
 sharingPercent: 0,
 add: 0,
 },
 {
 minValue: 1000,
 maxValue: 1999,
 mechantFixed: 2,
 merchantPercent: 0,
 sharingFixed: 1,
 sharingPercent: 0,
 add: 0,
 },
 {
 minValue: 2000,
 maxValue: 2999,
 mechantFixed: 5,
 merchantPercent: 0,
 sharingFixed: 1,
 sharingPercent: 0,
 add: 0,
 },
 {
 minValue: 3000,
 maxValue: 3499,
 mechantFixed: 9.5,
 merchantPercent: 0,
 sharingFixed: 1,
 sharingPercent: 0,
 add: 0,
 },
 {
 minValue: 3500,
 maxValue: 10000,
 mechantFixed: 5,
 merchantPercent: 0,
 sharingFixed: 2,
 sharingPercent: 0,
 add: 0,
 },
 ],
 paymentDetails: {
 deviceOwnedBy: "S",
 installationFee: "",
 terminalModeCode: "",
 terminalType: "POS",
 cardAcceptance: "1",
 numberOfTerminals: 1,
 emiStartDate: "",
 // cashAtPosEnabled: "Y",
 omcEnabled: false,
 intlCardAcceptance: "N",
 // settlementType: "A",
 // preAuth: "N",
 creditCardBlock: "N",
 tipPercentage: "20",
 rentalPlanCode: 1,
 // amountCollected:"",
 recurringFees: "",
 bankFee: "",
 serviceProvider: 1,
 networkPreferred: 1,
 rentalMode: "S",
 rentalType: "A",
 advanceRentCollected: "",
 advanceRentMode: "NEFT",
 noOfMonthRentPaidInAdvance: "",
 gracePeriod: 0,
 totalEmiAmount: "",
 emiTenure: "",
 otherCharges: "",
 totalAmountPaid: "",
 },
 bankInformation: {
 bankDetails: {
 ifsc: "",
 micr: "",
 bankName: "",
 branchName: "",
 branchCode: "",
 branchZone: "",
 bankCityRefCode: "",
 bankStateRefCode: "",
 paymentMode: "D",
 accountType: "",
 accountdetails: "",
 accountNumber: "",
 bankStatementAttached: "Y",
 cancelChequeAttached: "Y",
 feeType: "N",
 settlementOrNeftFee: "",
 },
 collectionDetails: {
 collectedDate: "",
 swipeAmount: "",
 swipeTerminal: "",
 chequeAmount: "",
 chequeDate: "",
 chequeDepositedDate: "",
 chequeNumber: "",
 upiLink: "",
 acquirerBank: "",
 },
 },
 kyc: {
 documents: [],
 },
 remarks: "",
 // QRcode: "Y",
 mdrPlan: {
 code: 1,
 domesticDebitUpTo2000: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 99999,
 },
 incentive: {
 percentage: 0.0,
 minimum: 0.0,
 minimumTxnValue: 0,
 },
 domesticDebitAbove2000: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 99999,
 },

 standardOrClassic: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 premiumOrPlatinum: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 superPremiumOrSignature: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 commercialOrCorporate: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 internationalDebitCard: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 internationalCreditCard: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 onus: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 mVisa: {
 fixed: 0.0,
 percentage: 3,
 minimum: 0.0,
 },
 upiUpto2000: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 diners: {
 fixed: 0.0,
 percentage: 0,
 minimum: 0.0,
 },
 amexDomestic: {
 fixed: 0.0,
 percentage: 0,
 minimum: 0.0,
 },
 amexInternational: {
 fixed: 0.0,
 percentage: 0,
 minimum: 0.0,
 },
 upiAbove2000: {
 fixed: 0.0,
 percentage: 0,
 minimum: 0.0,
 },
 upiCreditUpto2000: {
 fixed: 0.0,
 percentage: 0,
 minimum: 0.0,
 },
 upiCreditAbove2000: {
 fixed: 0.0,
 percentage: 0,
 minimum: 0.0,
 },
 masterPass: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 cashAtPos: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 convenientFee: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 },
 SharingDiscountFee: {
 domesticDebitUpTo2000: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 domesticDebitAbove2000: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 upiUpto2000: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 standardOrClassic: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 premiumOrPlatinum: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 superPremiumOrSignature: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 commercialOrCorporate: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 internationalDebitCard: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 internationalCreditCard: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 onus: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 mVisa: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 diners: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 amexDomestic: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 amexInternational: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },

 upiAbove2000: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 upiCreditUpto2000: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 upiCreditAbove2000: {
 fixed: 0.0,
 percentage: 0.0,
 minimum: 0.0,
 },
 masterPass: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 cashAtPos: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 convenientFee: {
 fixed: 0,
 percentage: 0,
 minimum: 0,
 },
 },
 },
 error: {
 tab: {
 salesInformation: false,
 companyInformation: false,
 partnerInformation: false,
 businessInformation: false,
 paymentDetails: false,
 revParameters: false,
 // multiTid: false,
 // subTid: false,
 mdrPlan: false,
 SharingDiscountFee: false,
 bankInformation: false,
 },
 field: {
 revParamAndLeadInfo: {
 bijlipaySwitch: {
 alert: false,
 issue: "",
 value: "",
 },
 // edcEnabled: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 },
 merchant: {
 salesInformation: {
 institutionCode: {
 alert: false,
 issue: "",
 value: "",
 },
 applicationType: {
 alert: false,
 issue: "",
 value: "",
 },
 applicationNumber: {
 alert: false,
 issue: "",
 value: "",
 },
 applicationDate: {
 alert: false,
 issue: "",
 value: "",
 },
 aggreementDate: {
 alert: false,
 issue: "",
 value: "",
 },
 merchantType: {
 alert: false,
 issue: "",
 value: "",
 },
 categoryType: {
 alert: false,
 issue: "",
 value: "",
 },
 region: {
 alert: false,
 issue: "",
 value: "",
 },
 salesPersonName: {
 alert: false,
 issue: "",
 value: "",
 },
 leadFrom: {
 alert: false,
 issue: "",
 value: "",
 },
 // installationBranchCode: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaDistrict: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaLocation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // raDistrict: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od1District: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od2District: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // lorState: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaSalutation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaGender: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od1Salutation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od1Gender: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od2Salutation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od2Gender: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 sharingModelCode: {
 alert: false,
 issue: "",
 value: "",
 },
 sharingPartnerCode: {
 alert: false,
 issue: "",
 value: "",
 },
 dailyFixedAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 loanDisbursementPercentage: {
 alert: false,
 issue: "",
 value: "",
 },
 loanDisbursementAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 loanDisbursementDate: {
 alert: false,
 issue: "",
 value: "",
 },
 tenureMonth: {
 alert: false,
 issue: "",
 value: "",
 },
 tenureDay: {
 alert: false,
 issue: "",
 value: "",
 },
 tenureStartDate: {
 alert: false,
 issue: "",
 value: "",
 },
 rentPercentage: {
 alert: false,
 issue: "",
 value: "",
 },
 rentFixed: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 // additionalInfo: {
 // installationBranchCode: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaLocation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaDistrict: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // branchZone: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // raDistrict: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od1District: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od2District: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // lorState: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaSalutation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // iaGender: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od1Salutation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od1Gender: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od2Salutation: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // od2Gender: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // state:{
 // alert:false,
 // issue:"",
 // value:""
 // },
 // city:{
 // alert:false,
 // issue:"",
 // value:""
 // },
 // fillingType:{
 // alert:false,
 // issue:"",
 // value:""
 // },
 // category:{
 // alert:false,
 // issue:"",
 // value:""
 // },
 // subCategory:{
 // alert:false,
 // issue:"",
 // value:""
 // },
 // ownerDOB:{
 // alert:false,
 // issue:"",
 // value:""
 // }
 // },
 companyInformation: {
 legalName: {
 alert: false,
 issue: "",
 value: "",
 },
 smsFlag: {
 alert: false,
 issue: "",
 value: "",
 },
 dbaName: {
 alert: false,
 issue: "",
 value: "",
 },
 statezone: {
 alert: false,
 issue: "",
 value: "",
 },
 cityzone: {
 alert: false,
 issue: "",
 value: "",
 },
 // mcccode:{
 // alert: false,
 // issue: "",
 // value: "",
 // },

 registeredAddress: {
 alert: false,
 issue: "",
 value: "",
 },
 registeredPin: {
 alert: false,
 issue: "",
 value: "",
 },
 registeredCityRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 registeredStateRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 constitution: {
 alert: false,
 issue: "",
 value: "",
 },
 constitutionName: {
 alert: false,
 issue: "",
 value: "",
 },
 constitutionDescription: {
 alert: false,
 issue: "",
 value: "",
 },
 establishYear: {
 alert: false,
 issue: "",
 value: "",
 },
 registerNumber: {
 alert: false,
 issue: "",
 value: "",
 },
 pan: {
 alert: false,
 issue: "",
 value: "",
 },
 tin: {
 alert: false,
 issue: "",
 value: "",
 },
 tan: {
 alert: false,
 issue: "",
 value: "",
 },
 businessNature: {
 alert: false,
 issue: "",
 value: "",
 },
 businessType: {
 alert: false,
 issue: "",
 value: "",
 },
 // acquiringBank: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 mcc: {
 alert: false,
 issue: "",
 value: "",
 },
 // internationalCardAcceptance: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // autoormanual: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // tipFacility: {
 // alert: false,
 // issue: "",
 // value: ""
 // },

 // preauthFacility: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // creditCardBlock: {
 // alert: false,
 // issue: "",
 // value: ""
 // },

 residentialAddress: {
 alert: false,
 issue: "",
 value: "",
 },
 residentialPin: {
 alert: false,
 issue: "",
 value: "",
 },
 residentialCityRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 residentialStateRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 contactName: {
 alert: false,
 issue: "",
 value: "",
 },
 contactMobile: {
 alert: false,
 issue: "",
 value: "",
 },
 contactAlternateMobile: {
 alert: false,
 issue: "",
 value: "",
 },
 contactPhone: {
 alert: false,
 issue: "",
 value: "",
 },
 contactEmail: {
 alert: false,
 issue: "",
 value: "",
 },
 statementType: {
 alert: false,
 issue: "",
 value: "",
 },
 statementFrequency: {
 alert: false,
 issue: "",
 value: "",
 },
 statementEmail: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 revParameters: {
 bijlipaySwitch: {
 alert: false,
 issue: "",
 value: "",
 },
 cashAtPosEnabled: {
 alert: false,
 issue: "",
 value: "",
 },
 preAuth: {
 alert: false,
 issue: "",
 value: "",
 },
 settlementType: {
 alert: false,
 issue: "",
 value: "",
 },
 tipEnabled: {
 alert: false,
 issue: "",
 value: "",
 },
 notificationRecipient: {
 alert: false,
 issue: "",
 value: "",
 },
 saleFlag: {
 alert: false,
 issue: "",
 value: "",
 },
 // saleEnabled:{
 // alert: false,
 // issue: "",
 // value: "",
 // },
 // basedInstance:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // txnEmiAllowed:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // sodexoEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // amexEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // intlCardACardAcceptance:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // bqrEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // upiFlag:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // linkpaymentFlag:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // matmEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // upichargeslipEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 },
 businessInformation: {
 weekdayStartHour: {
 alert: false,
 issue: "",
 value: "",
 },
 weekdayEndHour: {
 alert: false,
 issue: "",
 value: "",
 },
 // BusinessHour:{
 // alert: false,
 // issue: "",
 // value: "",

 // },
 weekendStartHour: {
 alert: false,
 issue: "",
 value: "",
 },
 weekendEndHour: {
 alert: false,
 issue: "",
 value: "",
 },
 lastTurnoverYear: {
 alert: false,
 issue: "",
 value: "",
 },
 maximumMonthlyUsage: {
 alert: false,
 issue: "",
 value: "",
 },
 merchantTypeCode: {
 alert: false,
 issue: "",
 value: "",
 },
 // currentPos:{
 // alert: false,
 // issue: "",
 // value: "",
 // },
 lastTurnoverAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 expectedCardBusiness: {
 alert: false,
 issue: "",
 value: "",
 },
 averageBillAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 gstId: {
 alert: false,
 issue: "",
 value: "",
 },
 currentPosName: {
 alert: false,
 issue: "",
 value: "",
 },
 debitCardMdr: {
 alert: false,
 issue: "",
 value: "",
 },
 creditCardMdr: {
 alert: false,
 issue: "",
 value: "",
 },
 memberSince: {
 alert: false,
 issue: "",
 value: "",
 },
 // member:{
 // alert: false,
 // issue: "",
 // value: "",
 // },
 businessIncome: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 partnerInformation: [
 {
 name: {
 alert: false,
 issue: "",
 value: "",
 },
 dob: {
 alert: false,
 issue: "",
 value: "",
 },
 address: {
 alert: false,
 issue: "",
 value: "",
 },
 pan: {
 alert: false,
 issue: "",
 value: "",
 },
 pin: {
 alert: false,
 issue: "",
 value: "",
 },
 stateRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 cityRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 contactMobile: {
 alert: false,
 issue: "",
 value: "",
 },
 contactEmail: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 ],
 paymentDetails: {
 deviceOwnedBy: {
 alert: false,
 issue: "",
 value: "",
 },
 emiStartDate: {
 alert: false,
 issue: "",
 value: "",
 },
 installationFee: {
 alert: false,
 issue: "",
 value: "",
 },
 terminalModeCode: {
 alert: false,
 issue: "",
 value: "",
 },
 terminalType: {
 alert: false,
 issue: "",
 value: "",
 },

 numberOfTerminals: {
 alert: false,
 issue: "",
 value: "",
 },
 // cashAtPosEnabled: {
 // alert: false,
 // issue: "",
 // value: "",
 // },
 omcEnabled: {
 alert: false,
 issue: "",
 value: "",
 },
 intlCardAcceptance: {
 alert: false,
 issue: "",
 value: "",
 },
 // settlementType: {
 // alert: false,
 // issue: "",
 // value: "",
 // },
 // tipEnabled: {
 // alert: false,
 // issue: "",
 // value: "",
 // },
 // preAuth: {
 // alert: false,
 // issue: "",
 // value: "",
 // },
 creditCardBlock: {
 alert: false,
 issue: "",
 value: "",
 },

 rentalPlanCode: {
 alert: false,
 issue: "",
 value: "",
 },
 serviceProvider: {
 alert: false,
 issue: "",
 value: "",
 },
 networkPreferred: {
 alert: false,
 issue: "",
 value: "",
 },
 rentalMode: {
 alert: false,
 issue: "",
 value: "",
 },
 rentalType: {
 alert: false,
 issue: "",
 value: "",
 },
 advanceRentCollected: {
 alert: false,
 issue: "",
 value: "",
 },
 advanceRentMode: {
 alert: false,
 issue: "",
 value: "",
 },
 noOfMonthRentPaidInAdvance: {
 alert: false,
 issue: "",
 value: "",
 },
 gracePeriod: {
 alert: false,
 issue: "",
 value: "",
 },
 totalEmiAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 emiTenure: {
 alert: false,
 issue: "",
 value: "",
 },
 otherCharges: {
 alert: false,
 issue: "",
 value: "",
 },
 totalAmountPaid: {
 alert: false,
 issue: "",
 value: "",
 },
 // txnEmiAllowed:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // sodexoEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // amexEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // intlCardACardAcceptance:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // bqrEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // upiFlag:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // linkpaymentFlag:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // matmEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // upichargeslipEnabled:{
 // alert:false,
 // issue:"",
 // value:"",
 // },
 // city: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // states: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // fillingTypes: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // category:{
 // alert:false,
 // issue:"",
 // value:""
 // },
 // subCategory: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 },
 bankInformation: {
 bankDetails: {
 ifsc: {
 alert: false,
 issue: "",
 value: "",
 },
 micr: {
 alert: false,
 issue: "",
 value: "",
 },
 bankName: {
 alert: false,
 issue: "",
 value: "",
 },
 branchName: {
 alert: false,
 issue: "",
 value: "",
 },
 // branchCode: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // branchZone: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 bankCityRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 bankStateRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 paymentMode: {
 alert: false,
 issue: "",
 value: "",
 },
 accountType: {
 alert: false,
 issue: "",
 value: "",
 },
 accountdetails: {
 alert: false,
 issue: "",
 value: "",
 },
 accountNumber: {
 alert: false,
 issue: "",
 value: "",
 },
 bankStatementAttached: {
 alert: false,
 issue: "",
 value: "",
 },
 cancelChequeAttached: {
 alert: false,
 issue: "",
 value: "",
 },
 feeType: {
 alert: false,
 issue: "",
 value: "",
 },
 settlementOrNeftFee: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 collectionDetails: {
 collectedDate: {
 alert: false,
 issue: "",
 value: "",
 },
 swipeAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 swipeTerminal: {
 alert: false,
 issue: "",
 value: "",
 },
 chequeAmount: {
 alert: false,
 issue: "",
 value: "",
 },
 chequeDate: {
 alert: false,
 issue: "",
 value: "",
 },
 chequeDepositedDate: {
 alert: false,
 issue: "",
 value: "",
 },
 chequeNumber: {
 alert: false,
 issue: "",
 value: "",
 },
 upiLink: {
 alert: false,
 issue: "",
 value: "",
 },
 acquirerBank: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 },
 mdrPlan: {
 domesticDebitUpTo2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 // incentive: {
 // percentage: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // minimum: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // minimumTxnValue: {
 // alert: false,
 // issue: "",
 // value: ""
 // },

 // },
 domesticDebitAbove2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiUpto2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 standardOrClassic: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 premiumOrPlatinum: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 superPremiumOrSignature: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 commercialOrCorporate: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 internationalDebitCard: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 internationalCreditCard: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 onus: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 mVisa: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 diners: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 amexDomestic: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 amexInternational: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiAbove2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiCreditUpto2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiCreditAbove2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 masterPass: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 cashAtPos: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },

 convenientFee: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 },
 SharingDiscountFee: {
 domesticDebitUpTo2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 domesticDebitAbove2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiUpto2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 standardOrClassic: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 premiumOrPlatinum: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 superPremiumOrSignature: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 commercialOrCorporate: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 internationalDebitCard: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 internationalCreditCard: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 onus: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 mVisa: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 diners: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 amexDomestic: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 amexInternational: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiAbove2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiCreditUpto2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 upiCreditAbove2000: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 masterPass: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 cashAtPos: {
 fixed: {
 alert: false,
 issue: "",
 value: "",
 },
 percentage: {
 alert: false,
 issue: "",
 value: "",
 },
 minimum: {
 alert: false,
 issue: "",
 value: "",
 },
 },
 },
 },
 },
 },
 model: true,
 toggleChequeImageResult: false,
 toggleDocPanResult: false,
 toggleDocAadharResult: false,
 checked: false,
 thumbnailsHorizontal: false,

 populatedDocumentUrl: false,
 showDocumentPreview: true,
 showOpenPaymentChequeInfo: false,
 };
 },

 computed: {
 ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
 // ...mapGetters("SatLeadValidation", ["getShortLeadInfo"]),
 ...mapGetters("SatLeadValidation", [
 "getShortLeadInfo",
 "getDeviceVerificationStatus",
 ]),
 ...mapGetters("VasCheck", ["getInstance"]),
 ...mapGetters("leadSourceVasDeviceConfig", ["getLsDeviceBasedVasDetails"]),
 ...mapGetters("AllZone", ["getAllZone"]),
 ...mapGetters("IA_LOCATION", ["getiaLocation"]),
 ...mapGetters("District", ["getAllDistrict"]),
 ...mapGetters("BranchName", ["getAllBranchName"]),
 ...mapGetters("StateName", ["getiorState"]),
 ...mapGetters("GlobalVariables", ["GLOBAL_FILE_FETCH_URL"]),
 ...mapGetters("mars_regions", ["regionsFromMars"]),
 ...mapGetters("mars_leadFrom", ["leadFromInfoFromMars"]),
 ...mapGetters("MccBasedLeadSource", ["getmccBasedLeadsource"]),
 ...mapGetters("mars_salesPerson", ["salesPersonFromMars"]),
 ...mapGetters("mars_sharingPartner", ["sharingPartnerFromMars"]),
 ...mapGetters("sharingModeBasedOnSharingPartnerCode", [
 "sharingPartnerCode",
 ]),
 ...mapGetters("mars_city", ["cityFromMars"]),
 ...mapGetters("mars_state", ["stateFromMars"]),
 ...mapGetters("mars_mcc", ["mccFromMars"]),
 ...mapGetters("mars_deviceModel", ["deviceModelFromMars"]),
 ...mapGetters("mars_rentalPlans", ["rentalPlanFromMars"]),
 ...mapGetters("mars_ifsc", ["ifscFromMars"]),
 ...mapGetters("mars_mdrPlans", ["mdrPlanFromMars"]),
 ...mapGetters("mars_bankList", ["bankListFromMars"]),
 ...mapGetters("mars_serviceProvider", ["serviceProviderFromMars"]),
 ...mapGetters("mars_networkProvider", ["networkProviderFromMars"]),
 ...mapGetters("mars_dataSubmit", ["marsSavedDataFromInternal"]),
 ...mapGetters("MPOST_FILLINGTYPES", ["getAllFillingTypes"]),
 ...mapGetters("MPOS_STATE", ["getMposState"]),
 ...mapGetters("MPOS_CITY", ["getMposCity"]),
 ...mapGetters("MPOS_CATEGORY", ["getMposCategory"]),
 ...mapGetters("MPOS_SUBCATEGORY", ["getMposSubCategory"]),
 ...mapGetters("InstitutionCode", ["getinstitutionCode"]),
 ...mapGetters("AxisBankPincode", ["getAxisBankPincode"]),
 ...mapGetters("PincodeBasedDistrict", ["getPincodeBasedDistrict"]),
 ...mapGetters("StateBasedDistrict", ["getPincodeDistrict"]),
 ...mapGetters("CityBasedLocation", ["getCityBasedLocation"]),
 ...mapGetters("applicationNumberFromAPI", ["getApplicationNumber"]),

 //Validation functions
 // T => Transaction value model
 getAxisBank() {
 return this.merchant.salesInformation.leadFrom == "OPEN MARKET"
 ;
 },
 getMpos() {
 return this.merchant.paymentDetails.terminalType == "MPOS" ;
 },

 getTransctionValueModel() {
 return this.merchant.salesInformation.sharingModelCode == "T"
 ;
 },
 // M => MDR/cash@pos/rent
 getCashAtPos() {
 return this.merchant.salesInformation.sharingModelCode == "M"
 ;
 },
 // M => MDR/cash@pos/rent
 // getPartnersVisiblity() {
 // return this.$PARTNERS_TAB_ENABLED_ITEMS.includes(
 // this.merchant.companyInformation.constitution
 // )
 // ? true
 // : false;
 // },
 // R=> rental type /= Rental
 getRentalTypeVisibilityForRental() {
 return this.merchant.paymentDetails.rentalType == "R" ;
 },
 // A=> rental type /= Advanced
 getRentalTypeVisibilityForAdvanced() {
 return this.merchant.paymentDetails.rentalType == "A" ;
 },
 getRentalTypeVisibilityForEmi() {
 return this.merchant.paymentDetails.rentalType == "E" ;
 },
 // A=> rental type /= Advanced
 getfeeTypeForSettlementVisibility() {
 return this.merchant.bankInformation.bankDetails.feeType == "N" ||
 this.merchant.bankInformation.bankDetails.feeType == "S"
 ;
 },
 showOnlyIfSharingModelIsEnabled() {
 // N => No sharing
 return this.merchant.salesInformation.sharingModelCode != "N"
 ;
 },
 chequeNumberValidation() {
 return this.propLeadDeatils?.paymentOption == 2 ? 6 : 25;
 },
 bankInfoSwipePayment() {
 return this.propLeadDeatils?.paymentOption == 3 ;
 },
 bankInfoChequePayment() {
 return this.propLeadDeatils?.paymentOption == 2 ;
 },
 bankInfoUpiLink() {
 return this.propLeadDeatils?.paymentOption == 4 ;
 },
 getStatementType() {
 return this.merchant.companyInformation.statementType == "E"
 ;
 },
 getmpose() {
 return this.merchant.businessInformation.currentPosName == "Y"
 ;
 },
 getPartnersVisiblity() {
 return this.$PARTNERS_TAB_ENABLED_ITEMS.includes(
 this.merchant.companyInformation.constitution
 )
 ? true
 : false;
 },
 getInstitutionBank() {
 return (this.propLeadDeatils?.device?.deviceName === "Q161_PRO_DQR" || this.propLeadDeatils?.device?.deviceName == "Q161_PRO_SQR")
 ? false
 : true;
 },
 //////////////////////////////////////////////////////
 },

 validations: {
 revParamAndLeadInfo: {
 bijlipaySwitch: {
 required,
 },
 },
 // terminalModel: {
 // required
 // },
 merchant: {
 salesInformation: {
 institutionCode: {
 required: requiredIf(function () {
 return this.getInstitutionBank === true;
 }),
 },
 applicationType: {
 required,
 },
 applicationNumber: {
 required,
 alphaNum,
 },
 applicationDate: {
 required,
 },
 aggreementDate: {
 required,
 },
 salesPersonName: {
 required,
 },
 region: {
 required,
 },
 merchantType: {
 required,
 },
 categoryType: {
 required,
 },

 // leadFrom: {
 // required
 // },
 leadFrom: {
 required: requiredIf(function () {
 return this.getAxisBank === true;
 }),
 },
 // installationBranchCode: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaDistrict: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaLocation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // raDistrict: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1District: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od2District: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // lorState: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaSalutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaGender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Salutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Gender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Salutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od2Gender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od2Salutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Gender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },

 sharingPartnerCode: {
 required: requiredIf(function () {
 return (
 this.getTransctionValueModel === true ||
 this.getCashAtPos === true
 );
 }),
 },
 dailyFixedAmount: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(99999.99),
 minLength: minLength(1),
 maxLength: maxLength(7),
 },
 loanDisbursementPercentage: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(100),
 },
 loanDisbursementAmount: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(99999999.99),
 maxLength: maxLength(10),
 minLength: minLength(2),
 },
 loanDisbursementDate: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 },
 tenureMonth: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 integer,
 minValue: minValue(0),
 },
 tenureDay: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 integer,
 minValue: minValue(0),
 },
 tenureStartDate: {
 required: requiredIf(function () {
 return this.getTransctionValueModel === true;
 }),
 },
 rentPercentage: {
 required: requiredIf(function () {
 return this.getCashAtPos === true;
 }),
 maxValue: maxValue(100),
 decimal,
 minValue: minValue(0),
 },
 rentFixed: {
 required: requiredIf(function () {
 return this.getCashAtPos === true;
 }),
 decimal,
 minValue: minValue(0),
 },
 },
 // additionalInfo: {
 // installationBranchCode: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaLocation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaDistrict: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // branchZone: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // raDistrict: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1District: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od2District: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },

 // ownerDOB:{
 // required
 // },
 // lorState: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaSalutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // iaGender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Salutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Gender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Salutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od2Gender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od2Salutation: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // od1Gender: {
 // required: requiredIf(function() {
 // return this.getAxisBank === true;
 // })
 // },
 // state:{
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })
 // },
 // city:{
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })

 // },
 // fillingType:{
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })

 // },
 // category:{
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })
 // },
 // subCategory:{
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })

 // }
 // },
 companyInformation: {
 legalName: {
 required,
 minLength: minLength(0),
 maxLength: maxLength(60),
 alpha,
 // alphaNumericSpecialValidate
 },
 dbaName: {
 required,
 minLength: minLength(0),
 maxLength: maxLength(60),
 alphaNumericSpecialValidate,
 },
 smsFlag: {
 required,
 },

 registeredAddress: {
 required,
 minLength: minLength(1),
 maxLength: maxLength(120),
 },
 registeredPin: {
 required,
 minLength: minLength(6),
 maxLength: maxLength(6),
 },
 registeredCityRefCode: {
 required,
 integer,
 },
 registeredCityName: {
 required,
 },
 registeredStateRefCode: {
 required,
 integer,
 },
 registeredStateName: {
 required,
 },
 statezone: {
 required,
 },
 cityzone: {
 required: false,
 alpha,
 },
 // mcccode:{
 // required,
 // },
 constitution: {
 required,
 },
 establishYear: {
 required,
 },
 constitutionName: {
 required,
 },
 registerNumber: {
 required,
 alphaNum,
 minLength: minLength(1),
 maxLength: maxLength(20),
 },

 mccname: {
 required,
 },
 mcc: {
 required,
 },
 // internationalCardAcceptance: {
 // required
 // },
 // autoormanual: {
 // required
 // },
 // tipFacility: {
 // required
 // },
 // preauthFacility: {
 // required
 // },
 // creditCardBlock: {
 // required
 // },
 // acquiringBank: {
 // required
 // },
 residentialAddress: {
 required,
 minLength: minLength(1),
 maxLength: maxLength(120),
 },
 residentialPin: {
 required,
 integer,
 minLength: minLength(6),
 maxLength: maxLength(6),
 },
 residentCityName: {
 required,
 },
 residentialCityRefCode: {
 required,
 integer,
 },
 residentStateName: {
 required,
 },
 residentialStateRefCode: {
 required,
 integer,
 },
 pan: {
 required,
 panCard,
 maxLength: maxLength(10),
 minLength: minLength(10),
 },
 tin: {
 required: false,
 integer,
 minLength: minLength(9),
 maxLength: maxLength(12),
 },
 tan: {
 required: false,
 maxLength: maxLength(10),
 minLength: minLength(10),
 tanValidate,
 },
 contactName: {
 required,
 minLength: minLength(0),
 maxLength: maxLength(30),
 alphaNumericValidate,
 },
 contactMobile: {
 numeric,
 required,
 minLength: minLength(10),
 maxLength: maxLength(10),
 },
 contactAlternateMobile: {
 numeric,
 minLength: minLength(10),
 maxLength: maxLength(10),
 },
 contactPhone: {
 numeric,
 required,
 minLength: minLength(12),
 maxLength: maxLength(12),
 },
 contactEmail: {
 required,
 email,
 },
 statementEmail: {
 required,
 // requiredIf(function() {
 // return this.getStatementType === true;
 // }),
 email,
 },
 statementType: {
 required,
 },
 statementFrequency: {
 required,
 },
 },
 businessInformation: {
 gstId: {
 // required,
 gstn,
 minLength: minLength(15),
 maxLength: maxLength(15),
 },
 weekendEndHour: {
 // timeValidate,
 required,
 },
 weekendStartHour: {
 // timeValidate,
 required,
 },
 weekdayEndHour: {
 // timeValidate,
 required,
 },
 weekdayStartHour: {
 // timeValidate,
 required,
 },
 // BusinessHour:{
 // required,
 // },
 memberSince: {
 // Removing the validation as per client request
 required,
 },
 // member:{
 // required,
 // },
 currentPosName: {
 required,
 },
 // debitCardMdr: {
 // decimal,
 // minValue: minValue(0),
 // maxValue: maxValue(99.99)
 // },
 debitCardMdr: {
 required: requiredIf(function () {
 return this.getmpose === true;
 }),
 minValue: minValue(0),
 maxValue: maxValue(99.99),
 },
 creditCardMdr: {
 required: requiredIf(function () {
 return this.getmpose === true;
 }),
 minValue: minValue(0),
 maxValue: maxValue(99.99),
 },
 expectedCardBusiness: {
 decimal,
 required,
 minValue: minValue(0),
 maxValue: maxValue(9999999999.99),
 },
 averageBillAmount: {
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(9999999999.99),
 },
 lastTurnoverAmount: {
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(9999999999.99),
 },
 lastTurnoverYear: {
 required: false,
 },
 maximumMonthlyUsage: {
 decimal,
 required,
 minValue: minValue(0),
 maxValue: maxValue(9999999999.99),
 },
 merchantTypeCode: {
 required,
 },
 // currentPos:{
 // required,
 // },
 },
 paymentDetails: {
 installationFee: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForRental === true;
 }),
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(999999.99),
 minLength: minLength(1),
 maxLength: maxLength(12),
 },
 rentalPlanCode: {
 required,
 },
 emiStartDate: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForEmi === true;
 }),
 },
 // txnEmiAllowed:{
 // // required,
 // },
 // sodexoEnabled:{
 // // required,
 // },
 // amexEnabled:{
 // // required,
 // },
 // intlCardACardAcceptance:{
 // // required,
 // },
 // bqrEnabled:{
 // // required,
 // },
 // upiFlag:{
 // // required,
 // },
 // linkpaymentFlag:{
 // // required,
 // },
 // matmEnabled:{
 // // required,
 // },
 // upichargeslipEnabled:{
 // // required,
 // },
 serviceProvider: {
 required: true,
 },
 networkPreferred: {
 required: true,
 },
 terminalModeCode: {
 required,
 },
 terminalType: {
 required: requiredIf(function () {
 return this.getMpos === true;
 }),
 },

 // devicePrice: {
 // decimal,
 // minValue: minValue(0),
 // maxValue: maxValue(999999.99),
 // minLength: minLength(1),
 // maxLength: maxLength(8),
 // },
 otherCharges: {
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(999999),
 minLength: minLength(1),
 maxLength: maxLength(8),
 },
 totalAmountPaid: {
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(999999),
 minLength: minLength(1),
 maxLength: maxLength(12),
 },
 // city: {
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })
 // },
 // states: {
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })
 // },
 // fillingTypes: {
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })
 // },
 // category: {
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })
 // },
 // subCategory:{
 // required: requiredIf(function() {
 // return this.getMpos === true;
 // })

 // },

 numberOfTerminals: {
 numeric,
 minValue: minValue(1),
 maxValue: maxValue(100),
 },
 deviceOwnedBy: {
 required,
 },
 // cashAtPosEnabled: {
 // required,
 // },
 omcEnabled: {
 required,
 },
 intlCardAcceptance: {
 required,
 },
 // settlementType: {
 // required,
 // },
 // tipEnabled: {
 // required,
 // },
 // preAuth: {
 // required,
 // },
 creditCardBlock: {
 required,
 },
 rentalType: {
 required,
 },
 advanceRentCollected: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForAdvanced === true;
 }),
 decimal,
 minValue: minValue(0),
 maxValue: maxValue(999999),
 minLength: minLength(1),
 maxLength: maxLength(8),
 },
 advanceRentMode: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForAdvanced === true;
 }),
 },
 noOfMonthRentPaidInAdvance: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForAdvanced === true;
 }),
 minValue: minValue(0),
 maxValue: maxValue(999999),
 minLength: minLength(1),
 maxLength: maxLength(8),
 },
 gracePeriod: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForRental === true;
 }),
 minValue: minValue(0),
 maxValue: maxValue(999999),
 minLength: minLength(1),
 maxLength: maxLength(8),
 },
 totalEmiAmount: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForEmi === true;
 }),
 },
 emiTenure: {
 required: requiredIf(function () {
 return this.getRentalTypeVisibilityForEmi === true;
 }),
 },
 },
 revParameters: {
 // basedInstance:{
 // required,
 // },
 // matmEnabled:{
 // required,
 // },
 // bijlipaySwitch:{
 // required,
 // },
 cashAtPosEnabled: {
 required,
 },
 settlementType: {
 required,
 },
 preAuth: {
 required,
 },
 tipEnabled: {
 required,
 },
 notificationRecipient: {
 required,
 },
 saleFlag: {
 required,
 },
 // saleEnabled:{
 // required,
 // },
 // basedInstance:{
 // required,
 // },
 // txnEmiAllowed:{
 // // required,
 // },
 // sodexoEnabled:{
 // // required,
 // },
 // amexEnabled:{
 // // required,
 // },
 // intlCardACardAcceptance:{
 // // required,
 // },
 // bqrEnabled:{
 // // required,
 // },
 // upiFlag:{
 // // required,
 // },
 // linkpaymentFlag:{
 // // required,
 // },
 // matmEnabled:{
 // // required,
 // },
 // upichargeslipEnabled:{
 // // required,
 // },
 },
 bankInformation: {
 bankDetails: {
 ifsc: {
 required,
 alphaNum,
 maxLength: maxLength(11),
 },
 micr: {
 required,
 numeric,
 minLength: minLength(9),
 maxLength: maxLength(9),
 },
 branchName: {
 required,
 },
 // branchCode: {
 // required
 // },
 // branchZone: {
 // required
 // },
 bankName: {
 required,
 },
 bankCityName: {
 required,
 },
 bankCityRefCode: {
 required,
 numeric,
 },
 accountNumber: {
 required,
 alphaNum,
 minLength: minLength(6),
 maxLength: maxLength(19),
 },
 bankStateName: {
 required,
 },
 bankStateRefCode: {
 required,
 numeric,
 },
 paymentMode: {
 required,
 },
 accountType: {
 required,
 },
 accountdetails: {
 required,
 },
 settlementOrNeftFee: {
 required: requiredIf(function () {
 return this.getfeeTypeForSettlementVisibility === true;
 }),
 integer,
 maxValue: maxValue(999),
 minValue: minValue(0),
 },
 },
 collectionDetails: {
 collectedDate: {
 required: requiredIf(function () {
 return this.bankInfoSwipePayment === true;
 }),
 },
 swipeAmount: {
 decimal,
 required: requiredIf(function () {
 return this.bankInfoSwipePayment === true;
 }),
 minValue: minValue(0),
 },
 swipeTerminal: {
 required: requiredIf(function () {
 return this.bankInfoSwipePayment === true;
 }),
 },
 chequeAmount: {
 decimal,
 required: requiredIf(function () {
 return this.bankInfoChequePayment === true;
 }),
 minValue: minValue(0),
 },
 chequeNumber: {
 alphaNum,
 // required,
 required: requiredIf(function () {
 return this.bankInfoChequePayment === true;
 }),
 minLength: minLength(6),
 maxLength: maxLength(25),
 },
 upiLink: {
 required,
 required: requiredIf(function () {
 return this.bankInfoUpiLink === true;
 }),
 },
 chequeDate: {
 required: requiredIf(function () {
 return this.bankInfoChequePayment === true;
 }),
 },
 chequeDepositedDate: {
 required: requiredIf(function () {
 return this.bankInfoChequePayment === true;
 }),
 },
 },
 },
 kyc: {
 documents: [],
 },
 mdrPlan: {
 domesticDebitUpTo2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 // required
 },
 percentage: {
 minValue: minValue(0),
 // required,
 maxValue: maxValue(100),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 // required
 },
 },
 // incentive: {
 // percentage: {
 // minValue: minValue(0),
 // required,
 // maxValue: maxValue(100)
 // },
 // minimum: {
 // minValue: minValue(0),
 // required,
 // maxValue: maxValue(100)
 // },
 // minimumTxnValue: {
 // minValue: minValue(0),
 // required,
 // maxValue: maxValue(100)
 // },

 // },
 domesticDebitAbove2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 // required
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 // required
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 // required
 },
 },
 upiUpto2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 // required
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 // required
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 // required
 },
 },
 standardOrClassic: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 premiumOrPlatinum: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 superPremiumOrSignature: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 commercialOrCorporate: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 internationalDebitCard: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 internationalCreditCard: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 onus: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 mVisa: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 diners: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 amexDomestic: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 amexInternational: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 upiAbove2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 // required
 },
 percentage: {
 minValue: minValue(0),
 // required,
 maxValue: maxValue(100),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 // required
 },
 },
 upiCreditUpto2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 // required
 },
 percentage: {
 minValue: minValue(0),
 // required,
 maxValue: maxValue(100),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 // required
 },
 },
 upiCreditAbove2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 // required
 },
 percentage: {
 minValue: minValue(0),
 // required,
 maxValue: maxValue(100),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 // required
 },
 },

 masterPass: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 cashAtPos: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required,
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required,
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required,
 },
 },
 },

 SharingDiscountFee: {
 domesticDebitUpTo2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 maxValue: maxValue(100),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 domesticDebitAbove2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 upiUpto2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 standardOrClassic: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 premiumOrPlatinum: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 superPremiumOrSignature: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 commercialOrCorporate: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 internationalDebitCard: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 internationalCreditCard: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 onus: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 mVisa: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 diners: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 amexDomestic: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 amexInternational: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 upiAbove2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 upiCreditUpto2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 upiCreditAbove2000: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 masterPass: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 cashAtPos: {
 fixed: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 percentage: {
 minValue: minValue(0),
 maxValue: maxValue(100),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 minimum: {
 minValue: minValue(0),
 decimal,
 required: requiredIf(function () {
 return this.showOnlyIfSharingModelIsEnabled === true;
 }),
 },
 },
 },
 },
 viewBinding: {
 partnersArr: {
 required: requiredIf(function () {
 return this.getPartnersVisiblity;
 }),
 $each: helpers.forEach({
 name: {
 required,
 minLength: minLength(1),
 maxLength: maxLength(120),
 alphaNumericValidate,
 },
 dob: {
 required,
 },
 address: {
 minLength: minLength(1),
 maxLength: maxLength(120),
 required,
 },
 pan: {
 required,
 panCard,
 maxLength: maxLength(10),
 minLength: minLength(10),
 },
 pin: {
 required,
 integer,
 minLength: minLength(6),
 maxLength: maxLength(7),
 },
 stateRefCode: {
 required,
 integer,
 },
 stateRefLabel: {
 required,
 },
 cityRefCode: {
 required,
 integer,
 },
 cityRefLabel: {
 required,
 },
 contactMobile: {
 required,
 integer,
 minLength: minLength(10),
 maxLength: maxLength(10),
 },
 contactEmail: {
 required,
 email,
 },
 }),
 },
 },
 },

 beforeMount() {
 if (!this.propLeadDeatils || !this.propLeadDeatils?.leadSource || !this.propLeadDeatils?.device) {
 console.warn('showMarsForm: propLeadDeatils or leadSource is missing');
 return;
 }
 // >>View binding
 this.viewBinding = {
 sharingModelCode: [
 {
 label: "No sharing",
 value: "N",
 },
 {
 label: "Transaction value model",
 value: "T",
 },
 {
 label: "MDR/cash@pos/rent",
 value: "M",
 },
 ],
 accountdetails: [
 {
 label: "YES",
 value: "60",
 },
 {
 label: "NO",
 value: "90",
 },
 ],
 member: [
 {
 label: "1-3 years",
 value: "90",
 },
 {
 label: " 3-5 years",
 value: "70",
 },
 {
 label: " > 5 years",
 value: "50",
 },
 ],
 od1_gender: [
 {
 label: "Male",
 value: "M",
 },
 {
 label: "Female",
 value: "F",
 },
 {
 label: "Transgender",
 value: "T",
 },
 ],
 od2_gender: [
 {
 label: "Male",
 value: "M",
 },
 {
 label: "Female",
 value: "F",
 },
 {
 label: "Transgender",
 value: "T",
 },
 ],
 statementType: [
 {
 label: "E-Statement",
 value: "E",
 },
 // {
 // label: "Paper statement",
 // value: "P"
 // }
 ],
 statementFrequency: [
 {
 label: "Daily",
 value: "D",
 },
 {
 label: "Monthly",
 value: "M",
 },
 {
 label: "Quaterly",
 value: "Q",
 },
 {
 label: "Half yearly",
 value: "H",
 },
 {
 label: "Yearly",
 value: "Y",
 },
 {
 label: "None",
 value: "N",
 },
 ],
 partnersArr: [
 {
 name: "",
 address: "",
 pan: "",
 pin: null,
 cityRefCode: "",
 cityRefLabel: "",
 stateRefCode: "",
 stateRefLabel: "",
 contactMobile: "",
 contactEmail: "",
 },
 ],
 };
 //// View binding
 this.varaneekInstance();
 /* Populating values from FOS */
 // this.tmpVasMapping = this.VasSelected();
 // this.leadId = $route.propLeadDeatils?.id;

 if (this.propLeadDeatils?.leadSource?.sourceName === "LS_TOHANDS") {
 console.log("LEAD SOURCE INSIDE TO HANDS")
 let leadid = this.propLeadDeatils?.id;
 this.applicationNumberFromToHands(leadid);
 }
 else {
 this.merchant.salesInformation.applicationNumber = new Date().getTime();
 // let leadid1 = this.propLeadDeatils?.id;
 console.log("LEAD SOURCE INSIDE THIS")
 // console.log("LEAD ID",leadid1)
 }
 // this.merchant.salesInformation.applicationNumber = new Date().getTime();
 console.log("PROPS DETAILS------------>", this.propLeadDeatils);

 this.subventionBankFeeData = this.propLeadDeatils?.bankFee;
 this.merchant.companyInformation.constitution =
 this.propLeadDeatils?.merchantType?.marsMappingId;

 this.merchant.companyInformation.dbaName = this.propLeadDeatils?.leadName;
 // console.log("PROPS DETAILS------------>", this.propLeadDeatils);
 console.log(
 "this.getShortLeadInfo.vasInstanceMapping --->",
 this.getShortLeadInfo?.vasInstanceMapping
 );
      if (Array.isArray(this.getShortLeadInfo?.vasInstanceMapping)) {
        this.soSelectedVas = this.getShortLeadInfo.vasInstanceMapping.join(",");
      } else {
        this.soSelectedVas = (this.getShortLeadInfo?.vasInstanceMapping || "")
          .replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }
 this.revParamAndLeadInfo.bijlipaySwitch =
 this.propLeadDeatils?.bijlipaySwitch;
 this.merchant.companyInformation.contactMobile =
 this.propLeadDeatils?.contactNumber;
 this.merchant.companyInformation.contactName =
 this.propLeadDeatils?.contactName;
 this.merchant.companyInformation.registeredAddress =
 this.propLeadDeatils?.leadAddress;
 this.merchant.companyInformation.registeredPin =
 this.propLeadDeatils?.pincode;
 this.merchant.companyInformation.contactName =
 this.propLeadDeatils?.contactName;
 this.merchant.companyInformation.contactMobile =
 this.propLeadDeatils?.contactNumber;
 this.merchant.paymentDetails.numberOfTerminals =
 this.propLeadDeatils?.deviceCount;
 this.merchant.salesInformation.categoryType = (this.soSelectedVas || "").includes(
 "Small merchant"
 )
 ? "S"
 : "O";
 //recurring fees is plan based amount selected by wip lead
 this.merchant.paymentDetails.recurringFees =
 this.propLeadDeatils?.recurringFees;
 this.propLeadDeatils?.recurringFees;
 this.bankFee = (this.propLeadDeatils?.recurringFees || 0) / 1.18;
 // this.propLeadDeatils?.recurringFees * 0.18;
 const PercentageReduceData = this.bankFee;
 this.originalBankFeeData = PercentageReduceData;
 this.bankFee = this.originalBankFeeData;
 // if(this.merchant.paymentDetails.rentalMode == 'SB'){
 console.log("INSIDE PercentageReduceData ", this.bankFee);
 // this.subventionBankFeeData = this.propLeadDeatils?.bankFee
 // // this.bankFee = this.bankFee - this.subventionBankFee()
 // // console.log("Result",this.bankFee)
 // }
 if (this.propLeadDeatils?.device && (this.propLeadDeatils?.device?.deviceName === "Q161_PRO_DQR" || this.propLeadDeatils?.device?.deviceName === "Q161_PRO_SQR")) {
 this.merchant.salesInformation.institutionCode = 104
 }

      this.fetchAllDropdownValuesFromMARSapi(
        this.merchant.salesInformation.institutionCode
      );

 if (this.propLeadDeatils?.leadSource?.sourceName == "LS_TOHANDS") {
 this.merchant.salesInformation.institutionCode = 104;

 this.merchant.bankInformation.bankDetails.accountType = "C";
 }
 else {
 this.merchant.bankInformation.bankDetails.accountType = "S";
 }
 // setup fee amount
 this.devicePrice = this.propLeadDeatils?.setupFees;
 this.leadSourceApp = this.propLeadDeatils?.leadSource || {};
 // this.multiTidEnabled = this.this.propLeadDeatils?.leadSource?.multiTidEnabled;
 this.deviceTypeApp = this.propLeadDeatils?.device || {};
 this.salesPerson = this.propLeadDeatils?.createdBy?.name;
 this.salesCode = this.propLeadDeatils?.createdBy?.employeeID;
 this.merchant.salesInformation.salesPersonName =
 (this.salesPerson || "") + "-" + (this.salesCode || "");
 this.salesPersonName = (this.salesPerson || "") + "-" + (this.salesCode || "");
 this.merchant.mdrPlan.domesticDebitUpTo2000.percentage =
 this.getShortLeadInfo?.debitLessthanAmount;
 this.merchant.mdrPlan.domesticDebitAbove2000.percentage =
 this.getShortLeadInfo?.debitGreaterthanAmount;
 this.merchant.mdrPlan.upiUpto2000.percentage =
 this.getShortLeadInfo?.upiDebitCardUpTo2000;
 this.merchant.mdrPlan.upiAbove2000.percentage =
 this.getShortLeadInfo?.upiDebitCardAbove2000;
 this.merchant.mdrPlan.upiCreditUpto2000.percentage =
 this.getShortLeadInfo?.upiPrepaidCreditCardsUpTo2000;
 this.merchant.mdrPlan.upiCreditAbove2000.percentage =
 this.getShortLeadInfo?.upiPrepaidCreditCardsAbove2000;

 if (Array.isArray(this.getShortLeadInfo?.vasInstanceMapping)) {


   this.plan = this.getShortLeadInfo.vasInstanceMapping.join(",");


 } else {


   this.plan = (this.getShortLeadInfo?.vasInstanceMapping || "")
 .replaceAll('"', "")
 .replace("[", "")
 .replace("]", "");


 }

 // this.merchant.mdrPlan.incentive.percentage= this.incentive.includes(this.incentivePercentage);

 /* Populating values from FOS */
 this.fetchAndCookDocuments();
 if (Array.isArray(this.getShortLeadInfo?.vasInstanceMapping)) {

   this.plan = this.getShortLeadInfo.vasInstanceMapping.join(",");

 } else {

   this.plan = (this.getShortLeadInfo?.vasInstanceMapping || "")
 .replaceAll('"', "")
 .replace("[", "")
 .replace("]", "");

 }

 // this.tmpVasMapping = this.propLeadDeatils?.vasInstanceMapping
 // .replaceAll('"', "")
 // .replace("[", "")
 // .replace("]", "");
 this.incentive1 = this.getShortLeadInfo?.mAtmOnboardingPlan;
 this.merchant.mdrPlan.incentive.percentage =
 this.incentive1?.incentivePercentage;
 this.merchant.mdrPlan.incentive.minimum = this.incentive1?.maxIncPerTxn;
 // this.merchant.mdrPlan.incentive.minimumTxnValue = this.incentive1.minTxnVal;
 this.merchant.mdrPlan.incentive.minimumTxnValue = this.incentive1?.minTxnVal;

 this.merchant.mdrPlan.amexDomestic.percentage =
 this.getShortLeadInfo?.amexDomestic;
 this.merchant.mdrPlan.amexInternational.percentage =
 this.getShortLeadInfo?.amexInternational;

 this.merchant.bankInformation.collectionDetails.upiLink =
 this.propLeadDeatils?.paymentOption == 4
 ? this.propLeadDeatils?.referenceNumber
 : this.merchant.bankInformation.collectionDetails.upiLink == "";

 this.merchant.mdrPlan.standardOrClassic.percentage =
 this.getShortLeadInfo?.stdCC;
 this.merchant.mdrPlan.premiumOrPlatinum.percentage =
 this.getShortLeadInfo?.premiumCC;
 this.merchant.mdrPlan.superPremiumOrSignature.percentage =
 this.getShortLeadInfo?.superPremiumlCC;
 this.merchant.mdrPlan.commercialOrCorporate.percentage =
 this.getShortLeadInfo?.corpCC;
 this.merchant.mdrPlan.internationalCreditCard.percentage =
 this.getShortLeadInfo?.intlCC;
 },
 watch: {
 "merchant.businessInformation.currentPosName": function (newVal) {
 this.v$.$touch();
 },
 tmpVasMapping(val) {
 if (
 this.propLeadDeatils?.leadSource?.sourceName === "LS_TOHANDS" &&
 !val.includes("UPI QR")
 ) {
 this.tmpVasMapping = ["UPI QR"];
 }
 },
 },
 mounted() {
 // this.loadPreData();
 //LEAD_STATUS_MARS_SUB_TID_PENDING 104
 //LEAD_STATUS_BASE_TID_PENDING 103
 //this.genSubTidFlag == true
 this.merchant.leadId = this.$route.params.id;
 // if (this.propLeadDeatils?.leadStatus == 104 || this.propLeadDeatils?.leadStatus == 103) {
 // this.OpenMultiTidToggle();
 // }
 },
 created() {
 this.fetchAllZone();
 this.fetchAllDistrict();
 this.sharemodebasedonSharingMode();
 this.mpos();
 this.fetchInstutionCode();
 },

 methods: {
 ...mapActions("SatLeadValidation", [
 "MOVE_BACK_DOCUMENT_VERIFICATION_STAGE",
 ]),
 // ...mapActions("SatLeadValidation", ["FETCH_SHORT_LEAD_DATA"]),
 ...mapActions("leadInformationVasMapping", [
 "LEAD_INFORMATION_VAS_MAPPING_DERTAILS",
 "SAVEING_THE_LEAD_STATUS_DETAILS",
 "GET_LEAD_INFORMATION_VAS_MAPPING_DERTAILS",
 "CREATE_BASE_TID",
 "GET_BASE_TID_LIST",
 "GET_SUB_TID_LIST",
 "CREATE_SUB_TIDS_LIST",
 ]),
 ...mapActions("VasCheck", ["FETCH_INSTANCE"]),
 ...mapActions("leadSourceVasDeviceConfig", [
 "GET_LS_VAS_DEVICE_CONFIG_DETAILS",
 "GET_LS_AND_DEVICE_BASED_VAS_DETAILS",
 ]),
 ...mapActions("AllZone", ["FETCH_ALL_ZONE"]),
 ...mapActions("IA_LOCATION", ["FETCH_IA_LOCATION"]),
 ...mapActions("District", ["FETCH_ALL_DISTRICT"]),
 ...mapActions("BranchName", ["FECTCH_ALL_BRANCH"]),
 ...mapActions("StateName", ["FETCH_IOR_STATE"]),
 ...mapActions("mars_regions", ["REGION_FROM_MARS"]),
 ...mapActions("mars_leadFrom", ["LEAD_FROM_FROM_MARS"]),
 ...mapActions("MccBasedLeadSource", ["FECTCH_MCC_BASED_LEADSOURCE"]),
 ...mapActions("mars_salesPerson", ["SALES_PERSON_FROM_MARS"]),
 ...mapActions("mars_sharingPartner", ["SHARING_PARTNER_FROM_MARS"]),
 ...mapActions("sharingModeBasedOnSharingPartnerCode", [
 "FETCH_SHARING_MODEL_BASED_SHARING_PARTNER_CODE",
 ]),
 ...mapActions("mars_city", ["CITY_FROM_MARS"]),
 ...mapActions("mars_state", ["STATE_FROM_MARS"]),
 ...mapActions("mars_mcc", ["MCC_FROM_MARS"]),
 ...mapActions("mars_deviceModel", ["DEVICE_MODEL_FROM_MARS"]),
 ...mapActions("mars_rentalPlans", ["RENTAL_PLAN_FROM_MARS"]),
 ...mapActions("mars_ifsc", ["IFSC_FROM_MARS"]),
 ...mapActions("mars_mdrPlans", ["MDR_PLAN_FROM_MARS"]),
 ...mapActions("mars_bankList", ["BANK_LIST_FROM_MARS"]),
 ...mapActions("mars_networkProvider", ["NETWORK_PROVIDER"]),
 ...mapActions("mars_serviceProvider", ["SERVICE_PROVIDER"]),
 ...mapActions("mars_dataSubmit", [
 "MARS_DATA_SUBMIT_INTERNAL",
 "MARS_CHECK_STATUS_API",
 "EQUITAS_FRM_DATA",
 "MARS_DATA_SUBMIT_EXTERNAL",
 "SAT_TO_MARS_LEADDETAILS_SHARING_TO_HITACHI",
 "MARS_DATA_EXTERNAL_SUBMIT_RESPONSE",
 "SUBMIT_SUB_TID_MERCHANT_REF_CODE_DETAILS",
 "FETCH_SAVED_DATA_FROM_OWN_DB",
 ]),
 ...mapActions("MPOST_FILLINGTYPES", ["FETCH_ALL_FILLING_TYPES"]),
 ...mapActions("MPOS_STATE", ["FETCH_ALL_MPOS_STATE"]),
 ...mapActions("MPOS_CITY", ["FETCH_ALL_MPOS_CITY"]),
 ...mapActions("MPOS_CATEGORY", ["FETCH_ALL_MPOS_CATEGORY"]),
 ...mapActions("MPOS_SUBCATEGORY", ["FETCH_ALL_MPOS_SUBCATEGORY"]),
 ...mapActions("InstitutionCode", ["INSTITUTIONCODE_FROM_FROM_MARS"]),
 ...mapActions("AxisBankPincode", ["FETCH_AXIS_BANK_PINCODE_LOCATION"]),
 ...mapActions("PincodeBasedDistrict", [
 "FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT",
 ]),
 ...mapActions("StateBasedDistrict", ["FETCH_AXIS_BANK_PINCODE_DISTRICT"]),
 ...mapActions("CityBasedLocation", ["FETCH_AXIS_BANK_CITY_LOCATION"]),
 ...mapActions("applicationNumberFromAPI", ["FETCH_APPLICATION_NUMBER"]),
 //Loading base tids if any

 // subventionBankFee(){
 // console.log("SUBTRACT",data)
 // return this.subventionBankFeeData
 // },
 // handleInput(){
 // if(this.subventionBankFeeData == null){
 // this.bankFee = this.originalBankFeeData
 // }else{
 // const inputValue = this.subventionBankFeeData
 // this.bankFee = this.originalBankFeeData - inputValue;
 // }

 // },

 handleInput() {
 const value = this.subventionBankFeeData;

 if (!value || isNaN(value)) {
 this.bankFee = this.originalBankFeeData;
 } else {
 this.bankFee = this.originalBankFeeData - parseFloat(value);
 }
 },
 handleInputrentalMode() {
 if (this.merchant.paymentDetails.rentalMode == "IB") {
 this.bankFee = this.propLeadDeatils?.recurringFees / 1.18;
 // this.propLeadDeatils?.recurringFees * 0.18;
 console.log("RENTAL MODE", this.subventionBankFeeData);
 } else if (this.merchant.paymentDetails.rentalMode == "SB") {
 if (this.subventionBankFeeData > 0) {
 const inputValue = this.subventionBankFeeData;
 this.bankFee = this.originalBankFeeData - inputValue;
 }
 }
 },
 loadSubTidList() {
 this.GET_BASE_TID_LIST(this.merchant)
 .then((response) => {
 if (response.status == 200) {
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: response.data.message,
 icon: "thumb_up",
 });
 this.baseAndSubTidList = [];
 let res = response.data.data;
 res.baseTids.map((bTids) => {
 this.baseAndSubTidList.push({
 baseTidList: bTids,
 subTidConfsList: res.subTidConfs,
 });
 });
 this.baseTidFlag = false;
 this.SubTidField = true;
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Something went wrong!",
 icon: "clear",
 });
 }
 })
 .catch((error) => {
 this.baseTidFlag = true;
 this.SubTidField = false;
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message:
 error.data != null
 ? error.data.message
 : "Base TID creation failed!",
 icon: "clear",
 });
 this.$q.loading.hide();
 });
 },
 // Creating base tids and load sub tid confs
 OpenMultiTidToggle() {
 this.propTogglemultiTidComponentDetails =
 !this.propTogglemultiTidComponentDetails;
 // addtnmultiTidComponentDetails
 if (this.merchant != undefined && this.propLeadDeatils != undefined) {
 this.addtnmultiTidComponentDetails.merchant = this.merchant;
 this.addtnmultiTidComponentDetails.propLeadDeatils =
 this.propLeadDeatils;
 this.addtnmultiTidComponentDetails.holdPayment = this.holdPayment;
 this.addtnmultiTidComponentDetails.leadId = this.$route.params.id;
 this.addtnmultiTidComponentDetails.diners = this.formdata;
 }
 },
 fnCreateOrGetBaseTid() {
 this.CREATE_BASE_TID(this.merchant)
 .then((response) => {
 if (response.status == 200) {
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: response.message,
 icon: "thumb_up",
 });
 this.baseTidFlag = false;
 this.SubTidField = true;
 this.loadSubTidList();
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Something went wrong!",
 icon: "clear",
 });
 }
 this.updateLeadStatus({ leadId: this.$route.params.id, status: 103 });
 })
 .catch((error) => {
 this.baseTidFlag = true;
 this.SubTidField = false;
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message:
 error.data != null
 ? error.data.message
 : "Base TID creation failed!",
 icon: "clear",
 });
 this.$q.loading.hide();
 });
 },
 // To create sub tids or load sub tids
 getSubTidConfOrCreateSubTids() {
 //load sub tids if created already
 this.GET_SUB_TID_LIST(this.merchant)
 .then((response) => {
 if (response.status == 200) {
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: response.data.message,
 icon: "thumb_up",
 });
 let res = response.data.data;
 let res1 = response.data.data.submittedToMars;
 this.disabledListAllSubTidDetails = res1;
 this.listAllSubTidDetails = res;
 this.genSubTidFlag = true;
 this.SubTidField = false;
 this.baseTidFlag = false;
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Something went wrong!",
 icon: "clear",
 });
 }
 })
 .catch((error) => {
 if (error.status == 404) {
 // create sub tids
 this.CREATE_SUB_TIDS_LIST(this.merchant)
 .then((response) => {
 if (response.status == 200) {
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: response.data.message,
 icon: "thumb_up",
 });
 let res = response.data.data;
 this.listAllSubTidDetails = res;
 this.genSubTidFlag = true;
 this.SubTidField = false;
 this.baseTidFlag = false;
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Something went wrong!",
 icon: "clear",
 });
 }
 })
 .catch((error) => {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message:
 error.data != null
 ? error.data.message
 : "Sub TID creation failed!",
 icon: "clear",
 });
 this.$q.loading.hide();
 });
 }
 this.genSubTidFlag = false;
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message:
 error.data != null
 ? error.data.message
 : "Sub TID generation failed!",
 icon: "clear",
 });
 this.$q.loading.hide();
 });
 },

 updateLeadStatus(request) {
 this.SAVEING_THE_LEAD_STATUS_DETAILS(request)
 .then((response) => {
 if (response.status == 200) {
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: response.message,
 icon: "thumb_up",
 });
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Something went wrong!",
 icon: "clear",
 });
 }
 })
 .catch((error) => {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message:
 error.data != null
 ? error.data.message
 : "Lead Information status update failed!",
 icon: "clear",
 });
 this.$q.loading.hide();
 });
 },
 toggleChequeImage() {
 this.toggleChequeImageResult = !this.toggleChequeImageResult;
 },
 fnDocumentUrl(documentUrl) {
 this.populatedDocumentUrl = documentUrl;
 this.showDocumentPreview = !this.showDocumentPreview;
 },
 populateCustom() {
 let param =
 this.merchant.customIncentiveRates[0].mechantFixed +
 this.merchant.customIncentiveRates[0].sharingFixed;
 this.merchant.customIncentiveRates[0].add = param;
 },
 populateCustom1() {
 let param1 =
 this.merchant.customIncentiveRates[1].mechantFixed +
 this.merchant.customIncentiveRates[1].sharingFixed;
 this.merchant.customIncentiveRates[1].add = param1;
 },
 populateCustom2() {
 let param2 =
 this.merchant.customIncentiveRates[2].mechantFixed +
 this.merchant.customIncentiveRates[2].sharingFixed;
 this.merchant.customIncentiveRates[2].add = param2;
 },
 populateCustom3() {
 let param3 =
 this.merchant.customIncentiveRates[3].mechantFixed +
 this.merchant.customIncentiveRates[3].sharingFixed;
 this.merchant.customIncentiveRates[3].add = param3;
 },
 populateCustom4() {
 let param4 =
 this.merchant.customIncentiveRates[4].mechantFixed +
 this.merchant.customIncentiveRates[4].sharingFixed;
 this.merchant.customIncentiveRates[4].add = param4;
 },
 // fnVerificationDocumentUploadSingleUpload() {
 // // return
 // this.file = this.$refs.file.file;
 // },

 /* IFSC bank search result */
 populateBankDetails() {
 let self = this;
 let ifscArr = [];
 self
 .IFSC_FROM_MARS(this.merchant.bankInformation.bankDetails.ifsc)
 .then((response) => {
 if (response.status == 200) {
 this.merchant.bankInformation.bankDetails.bankName =
 self.ifscFromMars.bankName;
 this.merchant.bankInformation.bankDetails.branchName =
 self.ifscFromMars.branchName;
 this.merchant.bankInformation.bankDetails.micr =
 self.ifscFromMars.MICR;
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom-left",
 message: "Invalid IFSC code",
 icon: "clear",
 });
 this.merchant.bankInformation.bankDetails.ifsc = "";
 this.merchant.bankInformation.bankDetails.bankName = "";
 this.merchant.bankInformation.bankDetails.branchName = "";
 this.merchant.bankInformation.bankDetails.micr = "";
 }
 });
 },
 /* IFSC bank search result */

 /* MCC search result */
 partnerCitySearchFilter(terms, update, abort) {
 update(() => {
 this.partnerCityOptions = this.COMMON_FILTER_FUNCTION(this.cityOptions, terms);
 });
 },
 partnerCitySelected(item, index) {
 this.ptCitySelected = true;
 this.v$.viewBinding.partnersArr.$each[index].cityRefCode.$model =
 item.value;
 this.v$.viewBinding.partnersArr.$each[index].cityRefLabel.$model =
 item.label;
 },
 partnerClearCity() {
 if (!this.ptCitySelected) this.cityRefLabel = "";
 },
 /* MCC search result */
 partnerStateSearchFilter(terms, update, abort) {
 update(() => {
 this.partnerStateOptions = this.COMMON_FILTER_FUNCTION(this.stateOptions, terms);
 });
 },
 partnerStateSelected(item, index) {
 this.v$.viewBinding.partnersArr.$each[index].stateRefCode.$model =
 item.value;
 this.v$.viewBinding.partnersArr.$each[index].stateRefLabel.$model =
 item.label;
 },
 /* MCC search result */

 /* MCC search result */
 mccSearch(terms, update, abort) {
 update(() => {
 this.mccOptions = this.COMMON_FILTER_FUNCTION(this.mccSearchSet, terms);
 });
 },
 // selectLead() {
 // if (this.merchant.salesInformation.leadFrom == "OPEN MARKET") {
 // //for UAT
 // this.merchant.salesInformation.institutionCode = 104;
 // // for production
 // // this.merchant.mdrPlan.code = 6;
 // } else {
 // // for UAT
 // this.merchant.salesInformation.institutionCode = 101;
 // // for production
 // // this.merchant.mdrPlan.code = 7;
 // }
 // },
 mccSelected(item) {
 this.merchant.companyInformation.mccname = item.label;
 this.merchant.companyInformation.mcc = item.value;
 // let formData = {
 // mcc_code: this.merchant.companyInformation.mcc,
 // leadsource: this.merchant.salesInformation.leadFrom
 // };
 // this.FECTCH_MCC_BASED_LEADSOURCE(formData).then(response => {
 // this.$q.notify({
 // color: "positive",
 // position: "bottom",
 // message: response.data.code,
 // icon: "thumb_up"
 // });
 // this.$q.localStorage.set("aa_t", response.data.code);
 // this.merchant.salesInformation.institutionCode = response.data.code;
 // });
 if (
 this.merchant.companyInformation.mcc == "5812" ||
 this.merchant.companyInformation.mcc == "5813" ||
 this.merchant.companyInformation.mcc == "5814" ||
 this.merchant.companyInformation.mcc == "7011"
 // || this.merchant.companyInformation.mcc == "5541" ||
 // this.merchant.companyInformation.mcc == "5542"
 ) {
 this.merchant.revParameters.settlementType = "M";
 this.merchant.revParameters.tipEnabled = "Y";
 // if(this.merchant.revParameters.saleEnabled == 'CASH@POS')
 // this.merchant.paymentDetails.omcEnabled = true;
 if (this.merchant.companyInformation.mcc == "5541")
 this.merchant.paymentDetails.omcEnabled = true;
 else this.merchant.paymentDetails.omcEnabled = false;
 this.revParamAndLeadInfo.bijlipaySwitch = true;
 } else {
 this.merchant.revParameters.settlementType = "A";
 this.merchant.revParameters.tipEnabled = "N";
 this.merchant.paymentDetails.omcEnabled = false;
 this.revParamAndLeadInfo.bijlipaySwitch = true;
 }
 },
 sharemodebasedonSharingMode() {
 this.FETCH_SHARING_MODEL_BASED_SHARING_PARTNER_CODE(
 this.merchant.salesInformation.sharingModelCode
 );
 },
 mpos() {
 this.FETCH_ALL_FILLING_TYPES();
 this.FETCH_ALL_MPOS_STATE();
 this.FETCH_ALL_MPOS_CATEGORY();
 },
 // terminalBased() {
 // if (this.merchant.paymentDetails.terminalType == "MPOS") {
 // this.merchant.salesInformation.institutionCode = 107;
 // } else {
 // let formData = {
 // mcc_code: this.merchant.companyInformation.mcc,
 // leadsource: this.merchant.salesInformation.leadFrom,
 // deviceType: this.merchant.paymentDetails.terminalModeCode
 // };
 // this.FECTCH_MCC_BASED_LEADSOURCE(formData).then(response => {
 // // this.$q.notify({
 // // color: "positive",
 // // position: "bottom",
 // // message: response.data.code,
 // // icon: "thumb_up"
 // // });
 // this.$q.localStorage.set("aa_t", response.data.code);
 // this.merchant.salesInformation.institutionCode = response.data.code;
 // });
 // }
 // },
 fetchInstutionCode() {
 this.INSTITUTIONCODE_FROM_FROM_MARS();
 },
 previewFiles() {
 this.files = this.$refs.myFiles.files;
 },
 // mccbasedSelect() {
 // let formData = {
 // mcc_code: this.merchant.companyInformation.mcc,
 // leadsource: this.merchant.salesInformation.leadFrom,
 // deviceType: this.merchant.paymentDetails.terminalModeCode
 // };
 // this.FECTCH_MCC_BASED_LEADSOURCE(formData).then(response => {
 // // this.$q.notify({
 // // color: "positive",
 // // position: "bottom",
 // // message: response.data.code,
 // // icon: "thumb_up"
 // // });
 // this.$q.localStorage.set("aa_t", response.data.code);
 // this.merchant.salesInformation.institutionCode = response.data.code;
 // });
 // },

 leadbasedonMerchant() {
 let formData = {
 mcc_code: this.merchant.companyInformation.mcc,
 leadsource: this.merchant.salesInformation.leadFrom,
 };
 this.FECTCH_MCC_BASED_LEADSOURCE(formData);
 },
 // mccbasedLeadSource(){
 // let formData1 = {
 // mcc_code: this.merchant.companyInformation.mcc,
 // leadsource:this.merchant.salesInformation.leadFrom
 // }

 // this.FECTCH_MCC_BASED_LEADSOURCE(this.formData1);
 // },
 /* MCC search result */

 /* City search result */
 residentCitySearch(terms, update, abort) {
 update(() => {
 this.cityOptionsFiltered = this.COMMON_FILTER_FUNCTION(this.cityOptions, terms);
 });
 },
 residentCitySearchFilter(terms, update, abort) {
 update(() => {
 this.residentCityOptionsFiltered = this.COMMON_FILTER_FUNCTION(this.cityOptions, terms);
 });
 },
 residentCitySelected(item) {
 if (item && item.label) {
 this.merchant.companyInformation.residentCityName = item.label;
 this.merchant.companyInformation.residentialCityRefCode = item.value;
 } else if (item && typeof item === 'string') {
 const found = this.cityOptions.find(o => o.label === item || o.value === item);
 if (found) {
 this.merchant.companyInformation.residentCityName = found.label;
 this.merchant.companyInformation.residentialCityRefCode = found.value;
 }
 }
 },
 /* City search result */

 /* State search result */
 residentStateSearch(terms, update, abort) {
 update(() => {
 this.stateOptionsFiltered = this.COMMON_FILTER_FUNCTION(this.stateOptions, terms);
 });
 },
 residentStateSearchFilter(terms, update, abort) {
 update(() => {
 this.residentStateOptionsFiltered = this.COMMON_FILTER_FUNCTION(this.stateOptions, terms);
 });
 },
 residentStateSelected(item) {
 if (item && item.label) {
 this.merchant.companyInformation.residentStateName = item.label;
 this.merchant.companyInformation.residentialStateRefCode = item.value;
 } else if (item && typeof item === 'string') {
 const found = this.stateOptions.find(o => o.label === item || o.value === item);
 if (found) {
 this.merchant.companyInformation.residentStateName = found.label;
 this.merchant.companyInformation.residentialStateRefCode = found.value;
 }
 }
 },
 /* State search result */

 /* Registered City search result */
 registeredCitySelected(item) {
 this.companyRegisteredCitySelected = true;
 this.merchant.companyInformation.registeredCityName = item.label;
 this.merchant.companyInformation.registeredCityRefCode = item.value;
 },
 /* Registered City search result */
 fnClrRegisteredCity() {
 if (!this.companyRegisteredCitySelected)
 this.merchant.companyInformation.registeredCityName = "";
 },
 fninputTyping(event, type) {
 if (typeof event !== "string") return;
 let flag = event.split("");
 switch (type) {
 case 1:
 this.companyRegisteredCitySelected = false;
 break;
 case 2:
 this.companyRegisteredStateSelected = false;
 break;
 }
 if (this.cityOptions.length <= 0 || this.stateOptions.length <= 0) {
 this.fetchmarsCity(
 this.merchant.companyInformation.registeredCityName,
 this.merchant.companyInformation.registeredStateName
 );
 }
 },

 /* Registered State search result */
 registeredStateSelected(item) {
 this.companyRegisteredStateSelected = true;
 this.merchant.companyInformation.registeredStateName = item.label;
 this.merchant.companyInformation.registeredStateRefCode = item.value;
 },
 /* Registered State search result */
 fnClrRegisteredState() {
 if (!this.companyRegisteredStateSelected)
 this.merchant.companyInformation.registeredStateName = "";
 },

 /* Registered City search result */
 bankCitySearchFilter(terms, update, abort) {
 update(() => {
 this.bankCityOptionsFiltered = this.COMMON_FILTER_FUNCTION(this.cityOptions, terms);
 });
 },
 bankCitySelected(item) {
 if (item && item.label) {
 this.merchant.bankInformation.bankDetails.bankCityName = item.label;
 this.merchant.bankInformation.bankDetails.bankCityRefCode = item.value;
 } else if (item && typeof item === 'string') {
 const found = this.cityOptions.find(o => o.label === item || o.value === item);
 if (found) {
 this.merchant.bankInformation.bankDetails.bankCityName = found.label;
 this.merchant.bankInformation.bankDetails.bankCityRefCode = found.value;
 }
 }
 },
 /* Registered City search result */

 /* Registered State search result */
 bankStateSearchFilter(terms, update, abort) {
 update(() => {
 this.bankStateOptionsFiltered = this.COMMON_FILTER_FUNCTION(this.stateOptions, terms);
 });
 },
 bankStateSelected(item) {
 if (item && item.label) {
 this.merchant.bankInformation.bankDetails.bankStateName = item.label;
 this.merchant.bankInformation.bankDetails.bankStateRefCode = item.value;
 } else if (item && typeof item === 'string') {
 const found = this.stateOptions.find(o => o.label === item || o.value === item);
 if (found) {
 this.merchant.bankInformation.bankDetails.bankStateName = found.label;
 this.merchant.bankInformation.bankDetails.bankStateRefCode = found.value;
 }
 }
 },
 /* Registered State search result */

 COMMON_FILTER_FUNCTION(arraySet, terms) {
 return _.filter(arraySet, function (oo) {
 return (
 oo.label.toLowerCase().includes(terms.toLowerCase()) ||
 oo.value.toString().includes(terms.toString())
 );
 });
 },

 selectCurrentType() {
 this.merchant.paymentDetails.gracePeriod = "";
 this.merchant.paymentDetails.advanceRentCollected = "";
 this.merchant.paymentDetails.noOfMonthRentPaidInAdvance = "";
 },

 addMorePartnersSet() {
 let partnerObj = {
 name: "",
 address: "",
 pan: "",
 pin: "",
 cityRefCode: "",
 cityRefLabel: "",
 stateRefCode: "",
 stateRefLabel: "",
 contactMobile: "",
 contactEmail: "",
 };
 let errorObj = {
 name: {
 alert: false,
 issue: "",
 value: "",
 },
 address: {
 alert: false,
 issue: "",
 value: "",
 },
 pan: {
 alert: false,
 issue: "",
 value: "",
 },
 pin: {
 alert: false,
 issue: "",
 value: "",
 },
 stateRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 cityRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 contactMobile: {
 alert: false,
 issue: "",
 value: "",
 },
 contactEmail: {
 alert: false,
 issue: "",
 value: "",
 },
 };
 this.error.field.merchant.partnerInformation.push(errorObj);
 this.viewBinding.partnersArr.push(partnerObj);
 },
 removePartnerFromArr(item, index) {
 this.viewBinding.partnersArr.splice(index, 1);
 },
 previousClicked() {
 if (this.$refs.stepper.step == "eight") {
 this.getlsVasMappingController();
 }
 this.$refs.stepper.previous();
 },
 validatebeforeNavigate(step) {
 if (step == "salesInformation") {
 this.v$.merchant?.salesInformation?.$touch();
 if (this.v$.merchant?.salesInformation?.$error) {
 this.$q.notify("Please review sales information fields again.");
 } else {
 // // TODO 1 => IOB
 // // else 2 => AB
 // if (this.merchant.salesInformation.institutionCode == 3) {
 // // TODO S => Small
 // // else O => others
 // if (this.merchant.salesInformation.categoryType == "S") {
 // this.merchant.mdrPlan.code = 44;
 // } else {
 // this.merchant.mdrPlan.code = 45;
 // }
 // } else {
 // // TODO S => Small
 // // else O => others
 // if (this.merchant.salesInformation.categoryType == "S") {
 // this.merchant.mdrPlan.code = 40;
 // } else {
 // this.merchant.mdrPlan.code = 41;
 // }
 // }
 // 3 => GPRS
 if (this.merchant.salesInformation.categoryType == "O") {
 //for UAT
 this.merchant.mdrPlan.code = 9;
 // for production
 // this.merchant.mdrPlan.code = 6;
 } else {
 // for UAT
 this.merchant.mdrPlan.code = 8;
 // for production
 // this.merchant.mdrPlan.code = 7;
 }
 this.error.salesInformation = false;
 this.saveCurrentChanges();
 this.$refs.stepper.next();
 }
 } else if (step == "companyInformation") {
 this.v$.merchant?.companyInformation?.$touch();
 if (this.v$.merchant?.companyInformation?.$error) {
 this.$q.notify("Please review company information fields again.");
 } else {
 this.error.companyInformation = false;
 this.saveCurrentChanges();
 this.$refs.stepper.next();
 }
 } else if (step == "partners") {
 this.v$.viewBinding?.partnersArr?.$touch();
 if (this.v$.viewBinding?.partnersArr?.$error) {
 this.$q.notify("Please review partners fields again.");
 } else {
 this.error.partnerInformation = false;
 this.saveCurrentChanges();
 this.$refs.stepper.next();
 }
    } else if (step == "businessInformation") {
      this.v$.merchant?.businessInformation?.$touch();
      if (this.v$.merchant?.businessInformation?.$error) {
        this.$q.notify("Please review business information fields again.");
      } else if (this.v$.merchant.businessInformation.gstId.$model == null) {
        this.$q
          .dialog({
            title: "Confirm",
            message: "Are you sure GSTID is not available?",
            ok: "Yes",
            cancel: "No",
          })
          .onOk(() => {
            this.saveCurrentChanges();
            this.fetchMarsDeviceDetails();
            this.$refs.stepper.next();
          })
          .onCancel(() => {});
      } else {
        this.saveCurrentChanges();
        this.fetchMarsDeviceDetails();
        this.$refs.stepper.next();
      }
 } else if (step == "mdr") {
 this.v$.merchant?.mdrPlan?.$touch();
 if (this.v$.merchant?.mdrPlan?.$error) {
 this.$q.notify("Please review MDR plan fields fields again.");
 this.error.mdrPlan = false;
 } else if (this.v$.merchant?.SharingDiscountFee?.$error) {
 this.$q.notify("Please review sharing discount fee fields again.");
 this.error.sharingDiscountFee = false;
 } else {
 this.formdata.fixed = this.merchant.mdrPlan.diners.fixed;
 this.formdata.percentage = this.merchant.mdrPlan.diners.percentage;
 this.formdata.minimum = this.merchant.mdrPlan.diners.minimum;
 // this.merchant.SharingDiscountFee.diners.fixed = this.merchant.SharingDiscountFee.mVisa.fixed;
 // this.merchant.SharingDiscountFee.diners.percentage = this.merchant.SharingDiscountFee.mVisa.percentage;
 // this.merchant.SharingDiscountFee.diners.minimum = this.merchant.SharingDiscountFee.mVisa.minimum;
            this.merchant.SharingDiscountFee.diners.fixed =
              this.merchant.mdrPlan.diners.fixed;
            this.merchant.SharingDiscountFee.diners.percentage =
              this.merchant.mdrPlan.diners.percentage;
            this.merchant.SharingDiscountFee.diners.minimum =
              this.merchant.mdrPlan.diners.minimum;
 // if(this.plan == 'mATM'){
 // this.merchant.incentive.percentage = this.merchant.incentive.percentage;
 // this.merchant.incentive.minimum = this.merchant.incentive.minimum;
 // this.merchant.incentive.minimumTxnValue = this.merchant.incentive.minimumTxnValue;
 // }
 // incentive: {
 // percentage: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // minimum: {
 // alert: false,
 // issue: "",
 // value: ""
 // },
 // minimumTxnValue: {
 // alert: false,
 // issue: "",
 // value: ""
 // },

 // },
 this.saveCurrentChanges();
 this.$refs.stepper.next();
 }
 } else if (step == "paymentDetails") {
 this.v$.merchant?.paymentDetails?.$touch();
 if (this.v$.merchant?.paymentDetails?.$error) {
 this.$q.notify("Please review payment details fields again.");
 } else if (this.merchant.customIncentiveRates[0].add > 0.5) {
 this.$q.notify(
 "200 to 999 Please customeIncentive less then or equal to 0.5."
 );
 } else if (this.merchant.customIncentiveRates[1].add > 3) {
 this.$q.notify(
 "1000 to 1999 Please customeIncentive less then equal to 3."
 );
 } else if (this.merchant.customIncentiveRates[2].add > 6) {
 this.$q.notify(
 "2000 to 2999 Please customeIncentive less then equal to 6."
 );
 } else if (this.merchant.customIncentiveRates[3].add > 10.5) {
 this.$q.notify(
 "3000 to 3499 Please customeIncentive less then equal to 10.5."
 );
 } else if (this.merchant.customIncentiveRates[4].add > 7) {
 this.$q.notify(
 "3500 to 10000 Please customeIncentive less then equal to 7."
 );
 } else if (
 this.subventionBankFeeData >
 this.propLeadDeatils?.recurringFees / 1.18
 ) {
 this.$q.notify("Bank Rental should be lesser than rental amount");
 } else if (
 this.merchant.paymentDetails.rentalMode === "SB" &&
 (this.subventionBankFeeData === "" ||
 this.subventionBankFeeData == null ||
 this.subventionBankFeeData == undefined)
 ) {
 this.$q.notify("Bank rental shouldn't be empty");
 } else if (
 this.merchant.paymentDetails.rentalMode === "SB" &&
 /[^0-9]/.test(this.subventionBankFeeData)
 ) {
 this.$q.notify(
 "Invalid input: only numbers are allowed in Bank Rental "
 );
 } else {
 this.error.paymentDetails = false;
 if (this.merchant.paymentDetails.rentalMode == "IB") {
 this.merchant.paymentDetails.bankFee = this.bankFee;
 } else if (this.merchant.paymentDetails.rentalMode == "SB") {
 this.merchant.paymentDetails.bankFee = this.subventionBankFeeData;
 } else {
 delete this.merchant.paymentDetails.bankFee;
 }

 this.saveCurrentChanges();
 //GOTO

 this.VasSelected();
 this.$refs.stepper.next();
 }
 } else if (step == "revParameters") {
 this.v$.merchant?.revParameters?.$touch();
 if (this.v$.merchant?.revParameters?.$error) {
 this.$q.notify("Please review Rev fields again.");
 this.error.revParameters = false;
 } else {
 this.error.revParameters = false;
 this.v$.revParamAndLeadInfo.vasInstanceMapping = JSON.stringify(
 this.tmpVasMapping
 );
 if (this.leadSourceApp.multiTidEnabled == true) {
 this.lsVasMappingController();
 }
 this.saveCurrentChanges();
 this.$refs.stepper.next();
 }
 } else if (step == "bank") {
 this.v$.merchant?.bankInformation?.$touch();
 if (this.v$.merchant?.bankInformation?.$error) {
 this.$q.notify("Please review bank information fields again.");
 } else {
 this.error.bankInformation = false;
 this.saveCurrentChanges();
 if (this.leadSourceApp.multiTidEnabled == true) {
 this.getlsVasMappingController();
 }
 this.vasAutoSelected();
 this.$refs.stepper.next();
 }
 } else if (step == "kyc") {
 this.v$.merchant?.kyc?.$touch();
 if (this.v$.merchant?.kyc?.$error) {
 this.$q.notify("Please review bank information fields again.");
 } else {
 this.error.kyc = false;
 this.saveCurrentChanges();
 this.loadSubTidList();
 this.$refs.stepper.next();
 }
 } else {
 }
 },
 handleVasChange(newVal) {
 let updated = [ ...newVal];

 const has = val => updated.includes(val);
 const had = val => this.tmpVasMapping.includes(val); // previously selected

 // === Case 1: Unselecting EMI     remove Bank EMI + Brand EMI
 if (had("EMI") && !has("EMI")) {
 updated = updated.filter(v => v !== "Bank EMI" && v !== "Brand EMI");
 }

 // === Case 2: Selecting EMI     ensure Bank EMI is selected
 if (has("EMI") && !has("Bank EMI")) {
 updated.push("Bank EMI");
 }

 // === Case 3: Selecting Bank EMI     ensure EMI is selected
 if (has("Bank EMI") && !has("EMI")) {
 updated.push("EMI");
 }

 // === Case 4: Selecting Brand EMI     ensure EMI is selected (not Bank EMI)
 if (has("Brand EMI") && !has("EMI")) {
 updated.push("EMI");
 }

 this.tmpVasMapping = [ ...new Set(updated)];
 },
 VasSelected() {
 let params = {
 device: this.merchant.paymentDetails.terminalModeCode,
 code: this.merchant.salesInformation.institutionCode,
 };
 let self = this;
 let vasArr = [];
 let data = new Object();
 if (this.propLeadDeatils?.leadSource?.multiTidEnabled == true) {
 let params1 = {
 leadSource: this.propLeadDeatils?.leadSource?.id,
 device: this.propLeadDeatils?.device?.id,
 };
 self.GET_LS_AND_DEVICE_BASED_VAS_DETAILS(params1).then((response) => {
 // if (response.status == 200) {
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
 // .opt,
 // disable: this.propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS' && opt.value !== 'UPI QR'
 // }));
 // this.$nextTick(() => {
 // const upiExists = this.vasBasedOnInstance.some(opt => opt.value === 'UPI QR');
 // if (upiExists) {
 // this.tmpVasMapping = ['UPI QR'];
 // this.vasKey++; //     Force re-render
 // console.log('    Auto-selected VAS:', this.tmpVasMapping);
 // }
 // });
 if (this.propLeadDeatils?.leadSource?.sourceName === "LS_TOHANDS") {
 this.vasBasedOnInstance = vasArr;
 this.vasBasedOnInstance = vasArr.map((opt) => ({ ...opt,
 disable:
 this.propLeadDeatils?.leadSource?.sourceName === "LS_TOHANDS" &&
 opt.value !== "UPI QR",
 }));
 this.$nextTick(() => {
 const upiExists = this.vasBasedOnInstance.some(
 (opt) => opt.value === "UPI QR"
 );
 if (upiExists) {
 this.tmpVasMapping = ["UPI QR"];
 this.vasKey++; //     Force re-render
 console.log("    Auto-selected VAS:", this.tmpVasMapping);
 }
 });
 } else {
 this.vasBasedOnInstance = vasArr;
 }
 // if (this.propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS') {
 // // Disable all except UPI QR
 // vasArr.forEach(option => {
 // option.disable = option.value !== 'UPI QR';
 // });

 // this.vasBasedOnInstance = vasArr;

 // //     Important: Apply selection after options render
 // this.$nextTick(() => {
 // const upiExists = this.vasBasedOnInstance.some(opt => opt.value === 'UPI QR');
 // if (upiExists) {
 // this.tmpVasMapping = ['UPI QR']; // this must match the value field
 // console.log('Auto-selected VAS:', this.tmpVasMapping);
 // } else {
 // console.warn('UPI QR not found in VAS list.');
 // }
 // });

 // } else {
 // // Normal flow without disabling
 // this.vasBasedOnInstance = vasArr;
 // }
 // if (this.propLeadDeatils?.leadSource?.sourceName === 'LS_TOHANDS') {
 // vasArr.forEach(option => {
 // option.disable = option.value !== 'UPI QR';
 // });

 // this.vasBasedOnInstance = vasArr;

 // //         Use $nextTick to ensure UI is updated before assigning selection
 // this.$nextTick(() => {
 // // Double check if 'UPI QR' is actually present in the options
 // const isUpiPresent = vasArr.some(opt => opt.value === 'UPI QR');
 // if (isUpiPresent) {
 // this.tmpVasMapping = ['UPI QR'];
 // } else {
 // console.warn('UPI QR not found in options');
 // }
 // });
 // } else {
 // this.vasBasedOnInstance = vasArr;
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

 // });
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
 }).onOk(() => {
 this.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Processing .",
 });

 this.MOVE_BACK_DOCUMENT_VERIFICATION_STAGE(formData).then(() => {
 this.$router.push("/sat/lead/validation/" + this.$route.params.id);
 this.$q.loading.hide();
 });
 }).onCancel((error) => {
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
 let obj = response.data.data.marsDeviceModel;
 this.terminalModelSet = [];
 this.terminalModelSet.push({
 label: obj.name,
 value: obj.code,
 });
 this.merchant.paymentDetails.terminalModeCode = obj.code;
 });
 },

 fetchAllDropdownValuesFromMARSapi(institutionCode) {
      if (institutionCode) {
        localStorage.setItem("aa_t", institutionCode);
      }
 this.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Setting data .",
 });
 let self = this;
 /* API call to fetch regions */
 self
 .REGION_FROM_MARS(institutionCode)
 .then(() => {
 self.regionOptions = [];
 return self.regionsFromMars.items.map((oo) => {
 self.regionOptions.push({ label: oo.name, value: oo.code });
 });
 }).then(() => {
 /* API call to fetch sharing partner */
 return self.LEAD_FROM_FROM_MARS(institutionCode).then((response) => {
 self.leadFromOptions = [];
 if (
 JSON.parse(localStorage.getItem("u_i")).region.regionAreaName ==
 "VARANEEK"
 ) {
 self.leadFromInfoFromMars.items.map((oo) => {
 if (oo.name == "VARANEEK") {
 self.leadFromOptions.push({ label: oo.name, value: oo.name });
 }
 });
 } else {
 self.leadFromInfoFromMars.items.map((oo) => {
 self.leadFromOptions.push({ label: oo.name, value: oo.name });
 });
 }
 self.merchant.salesInformation.leadFrom =
 this.propLeadDeatils?.leadSource?.sourceName;
 });
 }).then(() => {
 /* API call to fetch sales person */
 return self
 .SALES_PERSON_FROM_MARS(institutionCode)
 .then((response) => {
 self.salesPersonOptions = [
 {
 label: this.salesPerson + "-" + this.salesCode,
 value: this.salesPerson + "-" + this.salesCode,
 },
 ];
 self.salesPersonFromMars.items.map((oo) => {
 self.salesPersonOptions.push({
 label: oo.name + " - " + oo.empCode,
 value: oo.name + " - " + oo.empCode,
 });
 });

 // self.salesPersonOptions = salesPerson;
 });
 }).then(() => {
 /* API call to fetch city */
 return self.CITY_FROM_MARS().then((response) => {
 self.cityOptions = [];
 self.cityFromMars.items.map((oo) => {
 self.cityOptions.push({ label: oo.name, value: oo.code });
 });
 // self.cityOptions = city;
 });
 }).then(() => {
 /* API call to fetch state */
 return self.STATE_FROM_MARS().then((response) => {
 self.stateOptions = [];
 self.stateFromMars.items.map((oo) => {
 self.stateOptions.push({ label: oo.name, value: oo.code });
 });
 // self.stateOptions = stateArr;
 });
 }).then(() => {
 /* API call to fetch state */
 return self.MCC_FROM_MARS().then((response) => {
 self.mccSearchSet = [];
 self.mccFromMars.items.map((oo) => {
 self.mccSearchSet.push({
 label: oo.code + "-" + oo.name,
 value: oo.code,
 });
 // if(oo.code == "5812" || oo.code == "5813" || oo.code == "5814" ||oo.code == "7011" || oo.code == "5541" || oo.code == "5529"
 // ) {
 // this.merchant.companyInformation.autoormanual == "A";
 // this.merchant.companyInformation.tipFacility == "Y";
 // } else if(oo.code == "") {
 // this.merchant.companyInformation.autoormanual == "M";
 // this.merchant.companyInformation.tipFacility == "N";
 // }
 });
 // self.mccSearchSet = mccSubArr;
 });
 }).then(() => {
 /* API call to fetch rental plan */
 return self
 .RENTAL_PLAN_FROM_MARS(institutionCode)
 .then((response) => {
 self.rentalPlanSet = [];
 self.rentalPlanFromMars.items.map((oo) => {
 self.rentalPlanSet.push({ label: oo.name, value: oo.code });
 });
 // self.rentalPlanSet = rentalPlan;
 });
 }).then(() => {
 /* API call to fetch bank list */
 return self.BANK_LIST_FROM_MARS(institutionCode).then((response) => {
 // let bankList = [];
 self.bankListFromMars.bankNames.map((oo) => {
 self.bankListSet.push({ label: oo, value: oo });
 });
 // self.bankListSet = bankList;
 });
 return true;
 }).then(() => {
 /* API call to fetch bank list */
 return self.NETWORK_PROVIDER(institutionCode).then((response) => {
 // let bankList = [];
 self.networkProviderFromMars.items.map((oo) => {
 self.networkProviderListSet.push({
 label: oo.name,
 value: oo.code,
 });
 });
 // self.networkProviderListSet = bankList;
 });
 return true;
 }).then(() => {
 /* API call to fetch bank list */
 return self.SERVICE_PROVIDER(institutionCode).then((response) => {
 // let bankList = [];
 self.serviceProviderFromMars.items.map((oo) => {
 self.serviceProviderListSet.push({
 label: oo.name,
 value: oo.code,
 });
 });
 // self.bankListSet = bankList;
 });
 return true;
 }).then(() => {
 if (
 this.propLeadDeatils?.marsFormSubmitAction == 1 ||
 this.propLeadDeatils?.marsFormSubmitAction == 2
 ) {
 return this.FETCH_SAVED_DATA_FROM_OWN_DB({
 leadId: this.$route.params.id,
 }).then(() => {


            let additionalInfoParsed = {};
            try {
              additionalInfoParsed = JSON.parse(this.marsSavedDataFromInternal.additionalInfo || "{}");
            } catch (e) {
              console.error("Error parsing additionalInfo", e);
            }

            if (!this.merchant.additionalInfo) this.merchant.additionalInfo = {};
            this.merchant.additionalInfo.branchZone = additionalInfoParsed.branchZone || "";
            this.fnFetchZone();
            this.merchant.additionalInfo.iaDistrict = additionalInfoParsed.iaDistrict || "";
            this.fnFetchBranchName();
            this.merchant.additionalInfo.raDistrict = additionalInfoParsed.raDistrict || "";
            this.merchant.additionalInfo.od1District = additionalInfoParsed.od1District || "";
            this.merchant.additionalInfo.od2District = additionalInfoParsed.od2District || "";
            this.merchant.additionalInfo.installationBranchCode = additionalInfoParsed.installationBranchCode || "";
            this.merchant.additionalInfo.lorState = additionalInfoParsed.lorState || "";
            this.merchant.additionalInfo.pin = additionalInfoParsed.pin || "";
            this.pincodeBasedDistrict();
            this.merchant.additionalInfo.state = additionalInfoParsed.state || "";
            this.pincodeandDistrictBasedCity();
            this.merchant.additionalInfo.city = additionalInfoParsed.city || "";
            this.citybasedlocation();
            this.merchant.additionalInfo.iaLocation = additionalInfoParsed.iaLocation || "";
            this.merchant.additionalInfo.iaSalutation = additionalInfoParsed.iaSalutation || "";
            this.merchant.additionalInfo.iaGender = additionalInfoParsed.iaGender || "";
            this.merchant.additionalInfo.od1Salutation = additionalInfoParsed.od1Salutation || "";
            this.merchant.additionalInfo.od1Gender = additionalInfoParsed.od1Gender || "";
            this.merchant.additionalInfo.od2Salutation = additionalInfoParsed.od2Salutation || "";
            this.merchant.additionalInfo.od2Gender = additionalInfoParsed.od2Gender || "";
 //Date formatting for MARS
 return (this.marsSavedDataFromInternal.salesInformation["applicationDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.salesInformation
 .applicationDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.salesInformation["aggreementDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.salesInformation
 .aggreementDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.salesInformation["loanDisbursementDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.salesInformation
 .loanDisbursementDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.salesInformation["tenureStartDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.salesInformation
 .tenureStartDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.companyInformation["establishYear"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.companyInformation
 .establishYear
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.bankInformation
 .collectionDetails["chequeDepositedDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.bankInformation
 .collectionDetails.chequeDepositedDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.bankInformation
 .collectionDetails["collectedDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.bankInformation
 .collectionDetails.collectedDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.bankInformation
 .collectionDetails["chequeDate"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.bankInformation
 .collectionDetails.chequeDate
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.businessInformation["memberSince"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.businessInformation
 .memberSince
 ));
 }).then(() => {
 return (this.marsSavedDataFromInternal.businessInformation["lastTurnoverYear"] = this.commonDateFormat(
 this.marsSavedDataFromInternal.businessInformation
 .lastTurnoverYear
 ));
 }).then(() => {
 delete this.marsSavedDataFromInternal.salesInformation
 .salesPersonCode;
 if (!this.merchant) this.merchant = {};
            if (!this.merchant.salesInformation) this.merchant.salesInformation = {};
            if (this.marsSavedDataFromInternal.salesInformation) {
              this.merchant.salesInformation = _.merge({}, this.merchant.salesInformation, this.marsSavedDataFromInternal.salesInformation);
              if (this.merchant.salesInformation.institutionCode) {
                localStorage.setItem("aa_t", this.merchant.salesInformation.institutionCode);
              }
            }
 if (this.merchant.paymentDetails.rentalMode == "SB") {
 if (
 this.marsSavedDataFromInternal &&
 this.marsSavedDataFromInternal.paymentDetails &&
 "bankFee" in this.marsSavedDataFromInternal.paymentDetails
 ) {
 this.subventionBankFeeData =
 this.marsSavedDataFromInternal.paymentDetails.bankFee;
 this.bankFee = this.bankFee - this.subventionBankFeeData;
 }
 }

 console.log("INSIDE PercentageReduceData ", this.bankFee);

 // this.merchant.salesInformation.salesPersonName = this.merchant.salesInformation.salesPersonName;
 // this.merchant.salesInformation.salesPersonName = this.salesPerson + "-" + this.salesCode,
 if (
 this.merchant.salesInformation.salesPersonName !=
 this.salesPerson + "-" + this.salesCode
 ) {
 this.merchant.salesInformation.salesPersonName =
 this.merchant.salesInformation.salesPersonName;
 } else {
 this.merchant.salesInformation.salesPersonName =
 this.salesPerson + "-" + this.salesCode;
 }

 if (this.marsSavedDataFromInternal.companyInformation) { this.merchant.companyInformation = _.merge({}, this.merchant.companyInformation, this.marsSavedDataFromInternal.companyInformation); }
 if (this.marsSavedDataFromInternal.businessInformation) { this.merchant.businessInformation = _.merge({}, this.merchant.businessInformation, this.marsSavedDataFromInternal.businessInformation); }
 this.viewBinding.partnersArr =
 this.marsSavedDataFromInternal.partnerInformation;
 let errorThis = this;
 let errorObj = {
 name: {
 alert: false,
 issue: "",
 value: "",
 },
 address: {
 alert: false,
 issue: "",
 value: "",
 },
 pan: {
 alert: false,
 issue: "",
 value: "",
 },
 pin: {
 alert: false,
 issue: "",
 value: "",
 },
 stateRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 cityRefCode: {
 alert: false,
 issue: "",
 value: "",
 },
 contactMobile: {
 alert: false,
 issue: "",
 value: "",
 },
 contactEmail: {
 alert: false,
 issue: "",
 value: "",
 },
 };
 errorThis.error.field.merchant.partnerInformation = [];
 this.viewBinding.partnersArr.map(() => {
 errorThis.error.field.merchant.partnerInformation.push(
 errorObj
 );
 });
 if (this.marsSavedDataFromInternal.paymentDetails) { this.merchant.paymentDetails = _.merge({}, this.merchant.paymentDetails, this.marsSavedDataFromInternal.paymentDetails); }
 if (this.marsSavedDataFromInternal.bankInformation) { this.merchant.bankInformation = _.merge({}, this.merchant.bankInformation, this.marsSavedDataFromInternal.bankInformation); }
 if (this.marsSavedDataFromInternal.mdrPlan) { this.merchant.mdrPlan = _.merge({}, this.merchant.mdrPlan, this.marsSavedDataFromInternal.mdrPlan); }
 if (this.marsSavedDataFromInternal.SharingDiscountFee != null) {
 this.merchant.SharingDiscountFee =
 this.marsSavedDataFromInternal.sharingDiscountFee;
 }
 this.merchant.companyInformation.constitution =
 this.propLeadDeatils?.merchantType?.marsMappingId;
 });
 } else {
 return true;
 }
 }).then(() => {
 this.merchant.paymentDetails.cashAtPosEnabled = this.propLeadDeatils
 .posEnable
 ? "Y"
 : "N";
 this.$q.loading.hide();
 })
 .catch(() => {
 this.$q.loading.hide();
 });
 },

 varaneekInstance() {
 if (
 this.propLeadDeatils?.leadSource?.id == 81 &&
 this.propLeadDeatils?.device?.id == 6
 ) {
 this.merchant.salesInformation.institutionCode = 106;
 }
 if (
 this.propLeadDeatils?.leadSource?.id == 81 &&
 this.propLeadDeatils?.device?.id == 6 &&
 this.propLeadDeatils?.merchantCategory?.merchantCategoryName == "Retail"
 ) {
 this.merchant.salesInformation.institutionCode = 104;
 }
 },
 // Restructure documents as per mars requirement
 fetchAndCookDocuments() {
 let self = this;
 if (this.propLeadDeatils?.merchantType) {
 self.merchant.kyc.documents.push({
 documentName: "Agreement",
 documentType: this.propLeadDeatils?.merchantType?.marsAgreementId,
 documentImage: [
 this.GLOBAL_FILE_FETCH_URL +
 "/" +
 this.propLeadDeatils?.applicationFile,
 ],
 });
 }

 if (this.propLeadDeatils?.leadDocuments) {
 Object.keys(this.propLeadDeatils?.leadDocuments).forEach(function (
 key,
 index
 ) {
 _.map(self.propLeadDeatils?.leadDocuments[key], function (oo) {
 if (oo.uploadedDocuments && oo.uploadedDocuments.length > 0) {
 let assumeArr = [];
 _.map(oo.uploadedDocuments, function (doc) {
 assumeArr.push(self.GLOBAL_FILE_FETCH_URL + "/" + doc.fileName);
 });
 self.merchant.kyc.documents.push({
 documentName: oo.subDocumentType,
 documentType: oo.marsDocumentId,
 documentImage: assumeArr,
 });
 }
 });
 });
 }
 },
 lsVasMappingController() {
 if (this.tmpVasMapping.length > 0) {
 let params = {
 leadInformation: {
 id: this.propLeadDeatils?.id,
 },
 vasList: this.tmpVasMapping.map((vas) => JSON.parse(vas)),
 };

 let nameOfVas = this.tmpVasMapping.map((vas) => JSON.parse(vas).name);
 this.tmpVasMapping = nameOfVas;

 this.LEAD_INFORMATION_VAS_MAPPING_DERTAILS(params)
 .then((response) => {
 this.$q.loading.hide();
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: "Vas Mapping Successfully Created",
 icon: "thumb_up",
 });
 })
 .catch(() => {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Please try again",
 icon: "thumb_down",
 });
 this.$q.loading.hide();
 });
 } else {
 this.getlsVasMappingController();
 }
 },
 getlsVasMappingController() {
 let params = {
 id: this.propLeadDeatils?.id,
 };
 this.GET_LEAD_INFORMATION_VAS_MAPPING_DERTAILS(params)
 .then((response) => {
 this.$q.loading.hide();
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: "Vas Mapping Successfully Created",
 icon: "thumb_up",
 });
 let nameOfVas = response.data.data.map((leadInfoVas) =>
 JSON.stringify(leadInfoVas.vas)
 );
 this.tmpVasMapping = nameOfVas;
 return true;
 })
 .catch(() => {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Please try again",
 icon: "thumb_down",
 });
 this.$q.loading.hide();
 return false;
 });
 },

 saveCurrentChanges() {
 this.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Saving data .",
 });
 let a = { ...this.merchant.mdrPlan,
 };
 this.merchant.mdrPlan = { ...a, diners: this.formdata };

 let revParams = this.merchant.revParameters;
 delete this.merchant.revParameters;

 if (this.tmpVasMapping.length > 0) {
 this.revParamAndLeadInfo.vasInstanceMapping = JSON.stringify(
 this.tmpVasMapping
 );

 revParams.cashAtPosEnabled =
 this.tmpVasMapping.includes("CASH@POS") == true ? "Y" : "N";
 revParams.preAuth =
 this.tmpVasMapping.includes("PREAUTH") == true ? "Y" : "N";
 revParams.txnEmiAllowed =
 this.tmpVasMapping.includes("EMI") == true ? "1" : "0";
 revParams.sodexoEnabled =
 this.tmpVasMapping.includes("SODEXO") == true ? "1" : "0";
 revParams.amexEnabled =
 this.tmpVasMapping.includes("AMEX") == true ? "1" : "0";
 revParams.bqrEnabled =
 this.tmpVasMapping.includes("QR") == true ? "1" : "0";
 revParams.upichargeslipEnabled =
 this.tmpVasMapping.includes("UPI_CHARGESLIP") == true ? "1" : "0";
 revParams.linkpaymentFlag =
 this.tmpVasMapping.includes("Link based Payment") == true ? "1" : "0";
 revParams.matmAllowed =
 this.tmpVasMapping.includes("mATM") == true ? "Y" : "N";
 revParams.upiFlag =
 this.tmpVasMapping.includes("UPI QR") == true ? "1" : "0";
 }

 this.merchant["leadId"] = this.$route.params.id;
 this.merchant["partnerInformation"] = this.viewBinding.partnersArr;
 this.merchant["revParamAndLeadInfo"] = this.revParamAndLeadInfo;
 this.MARS_DATA_SUBMIT_INTERNAL({ merchant: this.merchant, action: 1 }).then((response) => {
 this.$q.loading.hide();
 this.$q.notify({
 color: "positive",
 position: "bottom",
 message: "Saved successfully",
 icon: "thumb_up",
 });
 })
 .catch(() => {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: "Please try again",
 icon: "thumb_down",
 });
 this.$q.loading.hide();
 });
 this.merchant.revParameters = revParams;
 },
 vasAutoSelected() {
 let vasAuto = [];
 _.map(this.getLsDeviceBasedVasDetails.vasList, function (oo) {
 vasAuto.push(JSON.stringify(oo));
 });
 var size = vasAuto.length;
 var items = vasAuto.slice(0, size).map((i) => {
 return i;
 });
 this.tmpVasMapping = items;
 if (this.propLeadDeatils?.device && this.propLeadDeatils?.device?.deviceName === "Q161_PRO_DQR") {
 const upiOption = this.vasBasedOnInstance.find(opt => opt.label === "UPI QR");
 this.vasDisableFlag = true
 if (upiOption) {
 this.tmpVasMapping = [upiOption.value]; // Must be array for checkbox
 console.log("DEVICE TYPE=================>>>>>>>>>", this.selectedVas)
 }
 } else {
 this.tmpVasMapping = [];
 this.vasDisableFlag = false
 }
 console.log("VASMAPPING", this.tmpVasMapping)
 // this.fnVasDisable(items);
 },
 // fnVasDisable(items) {
 // if(items<3){
 // return items >3 ;
 // // return true;
 // // var size = 3;
 // // var items = this.tmpVasMapping.slice(0, size).map(i => {
 // // return items
 // // });
 // }else{
 // return false;
 // }
 // },
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
 this.propLeadDeatils?.device?.id == "31"
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
 leadStatus: this.propLeadDeatils?.leadStatus,
 refNumber: this.propLeadDeatils?.merchantRefCode,
 }).then((response) => {
 let feed_paramaters;
 if (response.status == 204) {
 feed_paramaters = {
 applicationNumber: this.propLeadDeatils?.applicationNumber,
 merchantRefCode: this.propLeadDeatils?.merchantRefCode,
 };
 } else {
 feed_paramaters = response.data;
 }
 self.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Great. All set to go",
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
 }).then((response) => {
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
 this.propLeadDeatils?.merchantType?.merchantTypeName;
 finalRequest.merchant.salesInformation["applicationDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation.applicationDate
 );

 finalRequest.merchant.salesInformation["aggreementDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation.aggreementDate
 );

 finalRequest.merchant.salesInformation["loanDisbursementDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation
 .loanDisbursementDate
 );

 finalRequest.merchant.salesInformation["tenureStartDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation.tenureStartDate
 );

 finalRequest.merchant.companyInformation["establishYear"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.companyInformation.establishYear
 );

 finalRequest.merchant.bankInformation.collectionDetails["chequeDepositedDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.bankInformation.collectionDetails
 .chequeDepositedDate
 );

 finalRequest.merchant.bankInformation.collectionDetails["collectedDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.bankInformation.collectionDetails
 .collectedDate
 );

 finalRequest.merchant.bankInformation.collectionDetails["chequeDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.bankInformation.collectionDetails
 .chequeDate
 );

 finalRequest.merchant.businessInformation["memberSince"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.businessInformation.memberSince
 );
 finalRequest.merchant.businessInformation["lastTurnoverYear"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.businessInformation.lastTurnoverYear
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
 OThis.v$.viewBinding?.partnersArr?.$each[
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
 let splittingErrorField = `OThis.v$.${splitted.join(
 "."
 )}`;
 let fieldErrorFound = eval(splittingErrorField);
 fieldErrorFound.$model = "";
 OThis.error.tab[splitted[1]] = true;

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
 applicationNumber: response.data.applicationNumber,
 merchantRefCode: response.data.merchantRefCode,
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
 }).then(response => {
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
 error.data.name == "INVALID APPLICATION NUMBER" &&
 error.status == 404
 ) {
 self.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Saved. Sending data to mars"
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
 this.propLeadDeatils?.device?.id == "31"
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
 leadStatus: this.propLeadDeatils?.leadStatus,
 refNumber: this.propLeadDeatils?.merchantRefCode
 }).then(response => {
 let feed_paramaters;
 if (response.status == 204) {
 feed_paramaters = {
 applicationNumber: this.propLeadDeatils
 .applicationNumber,
 merchantRefCode: this.propLeadDeatils
 .merchantRefCode
 };
 } else {
 feed_paramaters = response.data;
 }
 self.$q.loading.show({
 delay: 0, // ms
 spinnerColor: "purple-9",
 message: "Great. All set to go"
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
 }).then(response => {
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
 this.merchant.companyInformation.constitutionName = this.propLeadDeatils?.merchantType?.merchantTypeName;
 finalRequest.merchant.salesInformation["applicationDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation
 .applicationDate
 );

 finalRequest.merchant.salesInformation["aggreementDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation
 .aggreementDate
 );

 finalRequest.merchant.salesInformation["loanDisbursementDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation
 .loanDisbursementDate
 );

 finalRequest.merchant.salesInformation["tenureStartDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.salesInformation
 .tenureStartDate
 );

 finalRequest.merchant.companyInformation["establishYear"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.companyInformation
 .establishYear
 );

 finalRequest.merchant.bankInformation
 .collectionDetails["chequeDepositedDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.bankInformation
 .collectionDetails.chequeDepositedDate
 );

 finalRequest.merchant.bankInformation
 .collectionDetails["collectedDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.bankInformation
 .collectionDetails.collectedDate
 );

 finalRequest.merchant.bankInformation
 .collectionDetails["chequeDate"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.bankInformation
 .collectionDetails.chequeDate
 );

 finalRequest.merchant.businessInformation["memberSince"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.businessInformation
 .memberSince
 );
 finalRequest.merchant.businessInformation["lastTurnoverYear"] = this.commonDateFormatInvalidMARSformat(
 finalRequest.merchant.businessInformation
 .lastTurnoverYear
 );

 if (error.data.hasOwnProperty("errorDetails")) {
 let OThis = this;
 _.map(error.data.errorDetails, actual => {
 let splitted = actual.field.split("/");
 if (
 splitted[1].slice(0, 18) == "partnerInformation"
 ) {
 let findPartnersErrorIndex = actual.field
 .split("partnerInformation")[1]
 .slice(1, 2);
 let computeSplitted =
 splitted[splitted.length - 1];
 let fieldErrorFound = eval(`
 OThis.v$.viewBinding?.partnersArr?.$each[
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
 let splittingErrorField = `OThis.v$.${splitted.join(
 "."
 )}`;
 let fieldErrorFound = eval(splittingErrorField);
 fieldErrorFound.$model = "";
 OThis.error.tab[splitted[1]] = true;

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
 icon: "thumb_down"
 });
 } else {
 this.$q.notify({
 color: "negative",
 position: "bottom",
 message: `${error.data.message}`,
 icon: "thumb_down"
 });
 }
 self.$q.loading.hide();
 });
 } else {
 }
 });
 }
 })
 .catch(() => {
 self.$q.loading.hide();
 });
 }
 },

 commonDateFormatDOB1(selectedDate) {
 if (
 selectedDate == "" ||
 selectedDate == null ||
 selectedDate == "Invalid date"
 ) {
 return null;
 } else {
 return this.$moment(selectedDate).format("DD/MM/YYYY");

 // if(selectedDate instanceof number){
 // return moment(selectedDate).format("DD/MM/YYYY");
 // }
 // else{
 // return selectedDate;
 // }
 }
 },

 //Common function for data format
 commonDateFormat(selectedDate) {
 if (
 selectedDate == "" ||
 selectedDate == null ||
 selectedDate == "Invalid date"
 ) {
 return null;
 } else {
 return this.$moment(selectedDate).format("YYYY-MM-DD");
 }
 },
 //Common function for data format
 commonDateFormatInvalidMARSformat(selectedDate) {
 if (
 selectedDate == "" ||
 selectedDate == null ||
 selectedDate == "Invalid date"
 ) {
 return null;
 } else {
 return this.$moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD");
 }
 },
 commonDateFormatDOB(selectedDate) {
 if (
 selectedDate == "" ||
 selectedDate == null ||
 selectedDate == "Invalid date"
 ) {
 return null;
 } else {
 return this.$moment(selectedDate).format("DD-MM-YYYY");
 }
 },

 marsRequiredFormattingofGST(val) {
 if (val == "") {
 this.merchant.businessInformation.gstId = null;
 } else {
 this.merchant.businessInformation.gstId = val;
 }
 },
 autoCompleteError(val1, val2) {
 val1.$touch();
 val2.$touch();
 if (val1.$anyError || val2.$anyError) {
 return true;
 } else {
 return false;
 }
 },
 fnClearZone() {
 this.merchant.additionalInfo.branchZone = "";
 },
 fnMposStatebasedCity() {
 this.FETCH_ALL_MPOS_CITY(this.merchant.additionalInfo.state);
 },
 categoryBasedSubCategory() {
 this.FETCH_ALL_MPOS_SUBCATEGORY(this.merchant.additionalInfo.category);
 },
 fnFetchZone() {
        if (!this.merchant || !this.merchant.additionalInfo) return;
 // this.FETCH_ALL_DISTRICT(this.merchant.salesInformation.iaLocation).then(() => {

 // let assumeArr = [];
 // this.getAllDistrict.district.map(function(value) {
 // assumeArr.push({ label: value.district, value: value.district });
 // });
 // this.allDistrict = assumeArr;

 // });

 this.FETCH_ALL_DISTRICT(this.merchant.additionalInfo.branchZone);
 },
 fnFetchBranchName() {
        if (!this.merchant || !this.merchant.additionalInfo) return;
 this.FECTCH_ALL_BRANCH(this.merchant.additionalInfo.iaDistrict);
 this.merchant.additionalInfo.raDistrict =
 this.merchant.additionalInfo.iaDistrict;
 this.merchant.additionalInfo.od1District =
 this.merchant.additionalInfo.iaDistrict;
 this.merchant.additionalInfo.od2District =
 this.merchant.additionalInfo.iaDistrict;
 // this.merchant.additionalInfo.lorState = this.merchant.additionalInfo.iaDistrict;
 },
 fnClearBranchName() {
 this.merchant.additionalInfo.installationBranchCode = "";
 },
 searchIaLocation(request, done) {
 this.FETCH_IA_LOCATION(request);
 done(this.getiaLocation);
 },
 searchIorState(request, update, abort) {
 if (request.length < 3) {
 abort();
 return;
 }
 this.FETCH_IOR_STATE(request).then(() => {
 update(() => {
 this.iorStateOptions = this.getiorState;
 });
 });
 },
 searchAxisBankPincode(request, update, abort) {
 if (request.length < 3) {
 abort();
 return;
 }
 this.FETCH_AXIS_BANK_PINCODE_LOCATION(request).then(() => {
 update(() => {
 this.axisBankPincodeOptions = this.getAxisBankPincode;
 });
 });
 },
 pincodeBasedDistrict() {
        if (!this.merchant || !this.merchant.additionalInfo) return;
 this.FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT(
 this.merchant.additionalInfo.pin
 );
 },
 pincodeandDistrictBasedCity() {
        if (!this.merchant || !this.merchant.additionalInfo) return;
 this.FETCH_AXIS_BANK_PINCODE_DISTRICT(
 this.merchant.additionalInfo.pin +
 "/" +
 this.merchant.additionalInfo.state
 );
 },
 citybasedlocation() {
        if (!this.merchant || !this.merchant.additionalInfo) return;
 this.FETCH_AXIS_BANK_CITY_LOCATION(this.merchant.additionalInfo.city);
 },
 applicationNumberFromToHands(leadid) {
 this.FETCH_APPLICATION_NUMBER(leadid)
 .then(() => {

 console.log("TWO HANDS APP NUM", this.getApplicationNumber.applicationNumber)

 this.merchant.salesInformation.applicationNumber = this.getApplicationNumber.applicationNumber;
 })
 .catch((error) => {
 console.error("Error fetching application number:", error);
 });
 },
 },
 };
</script>

<style scoped>
 .payment_verification_table i {
 transition: none !important;
 }

 .customTableClass .q-table tbody tr td {
 word-break: break-all;
 transition: none !important;
 }

 /* .q-table tbody td {
 word-wrap: break-word !important;
} */
 .border-1 {
 border: 1px solid #e5e5e5;
 }

 .q-custom-class {
 min-height: 270px;
 }

 .custom-z-index {
 z-index: 2;
 }

 table {
 border-collapse: collapse;
 width: 100%;
 }

 th,
 td {
 text-align: left;
 padding: 16px;
 }

 .readonly-select {
 pointer-events: none;
 opacity: 1 !important;
 cursor: not-allowed !important;
 }
</style>
