export const EVENTS_LIST = {
  SIGNATURE_SAVE_BTN_CLICKED: "signatureSaveBtnClicked",
};

export const USER_DATA_PROPS = {
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
  phone: "phone",
  dob: "dob",
  legalBusinessName: "legal_business_name",
  dba: "dba",
  federalTaxId: "federal_tax_id",
  legalEntityType: "legal_entity_type",
  businessStartDate: "business_start_date",
  industryType: "industry_type",
  numOfEmployees: "num_of_employees",
  averageMonthlyPayroll: "average_monthly_payroll",
  annualBusinessRevenue: "annual_business_revenue",
  lastMonthAccountDeposit: "last_month_account_deposit",
  ficoScore: "fico_score",
  loanIntrestedIn: "loan_intrested_in",
  amountRequested: "amount_requested",
  timeFrame: "time_frame",
  mailingAddress: "mailing_address",
  mailingAddressTwo: "mailing_address_two",
  mailingCity: "mailing_city",
  mailingState: "mailing_state",
  mailingZip: "mailing_zip",
  primaryOwnerFirstName: "primary_owner_first_name",
  primaryOwnerLastName: "primary_owner_last_name",
  primaryOwnerEmail: "primary_owner_email",
  primaryOwnerPhone: "primary_owner_phone",
  primaryOwnerDob: "primary_owner_dob",
  primaryOwnerSsn: "primary_owner_ssn",
  primaryOwnerAddress: "primary_owner_address",
  primaryOwnerAddressTwo: "primary_owner_address_two",
  primaryOwnerCity: "primary_owner_city",
  primaryOwnerState: "primary_owner_state",
  primaryOwnerZip: "primary_owner_zip",
  primaryOwnerOwnership: "primary_owner_ownership",
};

export const INPUT_FORM_SEARCHEABLE_PROPS = {
  first_name: "First Name:",
  last_name: "Last Name:",
  email: "Email:",
  phone: "Phone:",
  dob: "DOB:",
  legal_business_name: "Business Legal Name:",
  dba: "DBA:",
  federal_tax_id: "Federal Tax ID:",
  legal_entity_type: "Legal Entity Type:",
  business_start_date: "Business Start Date:",
  industry_type: "Industry Type:",
  num_of_employees: "Number of employees:",
  average_monthly_payroll: "Average monthly payroll:",
  annual_business_revenue: "Annual Business Revenue:",
  last_month_account_deposit: "Last Month Account Deposit:",
  fico_score: "FICO score:",
  loan_intrested_in: "Loan Interested in:",
  amount_requested: "Amount Requested:",
  time_frame: "Time Frame:",
  mailing_address: "Mailing Address:",
  mailing_address_two: "Mailing Address Line 2:",
  mailing_city: "City:",
  mailing_state: "State:",
  mailing_zip: "ZIP:",
  primary_owner_first_name: "Primary Owner s First Name:",
  primary_owner_last_name: "Primary Owner s Last Name:",
  primary_owner_email: "Email:",
  primary_owner_phone: "Mobile Phone Number:",
  primary_owner_dob: "Date of Birth:",
  primary_owner_ssn: "Social Security Number:",
  primary_owner_address: "Address:",
  primary_owner_address_two: "Address Line 2:",
  primary_owner_city: "City:",
  primary_owner_state: "State:",
  primary_owner_zip: "ZIP:",
  primary_owner_ownership: "% Ownership:",
};

export const DUPLICATE_NAMES = {
  [INPUT_FORM_SEARCHEABLE_PROPS.primary_owner_email]: [
    "Tax ID: DBA: Email:",
    "Phone Number: Email: Date of Birth: Social Security Number: % Ownership: Primary Owner Information Business Addres",
  ],
  [INPUT_FORM_SEARCHEABLE_PROPS.primary_owner_city]: [
    "Address Line 2: City: State: ZIP: Time Frame: Industry Type: Federal Tax ID: DBA: Email:",
    "Line 2: ZIP: City: Primary Owner s First Name: Primary Owner s Last Name: Mobile Phone Number: Email: Date of Birt",
  ],
  [INPUT_FORM_SEARCHEABLE_PROPS.primary_owner_state]: [
    "Line 2: City: State: ZIP: Time Frame: Industry Type: Federal Tax ID: DBA: Email:",
    "Mailing Address: State: Mailing Address Line 2: ZIP: City: Primary Owner s First Name: Primary Owner s Last Name: M",
  ],
  [INPUT_FORM_SEARCHEABLE_PROPS.primary_owner_zip]: [
    "2: City: State: ZIP: Time Frame: Industry Type: Federal Tax ID: DBA: Email:",
    "Address Line 2: ZIP: City: Primary Owner s First Name: Primary Owner s Last Name: Mobile Phone Number: Email: Date",
  ],
  [INPUT_FORM_SEARCHEABLE_PROPS.primary_owner_address]: [
    "Address & Location Address: Address Line 2: City: State: ZIP: Time Frame: Industry Type: Federal Tax ID: DBA: ",
    "Mailing Address: State: Mailing Address Line 2: ZIP: City: Primary Owner s First Name: Primary Owner s Last Name: M",
  ],
  [INPUT_FORM_SEARCHEABLE_PROPS.primary_owner_address_two]: [
    "State: Mailing Address Line 2: ZIP: City: Primary Owner s First Name: Primary Owner s Last Name: Mobile Phone Numbe",
    "Location Address: Address Line 2: City: State: ZIP: Time Frame: Industry Type: Federal Tax ID: DBA: Email:",
  ],
};

export const USER_DATA_ELE_POSTION = {
  // [INPUT_FORM_SEARCHEABLE_PROPS.full_name]: {
  //   x: 21,
  //   y: 220,
  //   width: 136,
  // },
  [USER_DATA_PROPS.firstName]: {
    x: 100,
    y: 240,
    width: 317,
  },
  [USER_DATA_PROPS.lastName]: {
    x: 100,
    y: 273,
    width: 317,
  },
  [USER_DATA_PROPS.dob]: {
    x: 63,
    y: 304,
    width: 149,
  },
  [USER_DATA_PROPS.email]: {
    x: 380,
    y: 240,
    width: 273,
  },
  [USER_DATA_PROPS.phone]: {
    x: 386,
    y: 273,
    width: 153,
  },
  [USER_DATA_PROPS.legalBusinessName]: {
    x: 160,
    y: 384,
    width: 230,
  },
  [USER_DATA_PROPS.dba]: {
    x: 66,
    y: 418,
    width: 230,
  },
  [USER_DATA_PROPS.federalTaxId]: {
    x: 117,
    y: 450,
    width: 186,
  },
  [USER_DATA_PROPS.businessStartDate]: {
    x: 463,
    y: 387,
    width: 186,
  },
  [USER_DATA_PROPS.industryType]: {
    x: 430,
    y: 419,
    width: 195,
  },
  [USER_DATA_PROPS.legalEntityType]: {
    x: 449,
    y: 453,
    width: 205,
  },
  [USER_DATA_PROPS.annualBusinessRevenue]: {
    x: 184,
    y: 534,
    width: 215,
  },
  [USER_DATA_PROPS.lastMonthAccountDeposit]: {
    x: 199,
    y: 565,
    width: 182,
  },
  [USER_DATA_PROPS.ficoScore]: {
    x: 100,
    y: 598,
    width: 182,
  },
  [USER_DATA_PROPS.loanIntrestedIn]: {
    x: 454,
    y: 533,
    width: 222,
  },
  [USER_DATA_PROPS.amountRequested]: {
    x: 459,
    y: 565,
    width: 222,
  },
  [USER_DATA_PROPS.timeFrame]: {
    x: 418,
    y: 598,
    width: 222,
  },
  [USER_DATA_PROPS.mailingAddress]: {
    x: 129,
    y: 680,
    width: 278,
  },
  [USER_DATA_PROPS.mailingAddressTwo]: {
    x: 166,
    y: 711,
    width: 232,
  },
  [USER_DATA_PROPS.mailingCity]: {
    x: 60,
    y: 744,
    width: 260,
  },
  [USER_DATA_PROPS.mailingState]: {
    x: 380,
    y: 680,
    width: 240,
  },
  [USER_DATA_PROPS.mailingZip]: {
    x: 369,
    y: 712,
    width: 240,
  },
  [USER_DATA_PROPS.primaryOwnerFirstName]: {
    x: 197,
    y: 826,
    width: 200,
  },
  [USER_DATA_PROPS.primaryOwnerLastName]: {
    x: 193,
    y: 858,
    width: 200,
  },
  [USER_DATA_PROPS.primaryOwnerDob]: {
    x: 110,
    y: 890,
    width: 140,
  },
  [USER_DATA_PROPS.primaryOwnerSsn]: {
    x: 170,
    y: 922,
    width: 144,
  },
  [USER_DATA_PROPS.primaryOwnerOwnership]: {
    x: 111,
    y: 954,
    width: 130,
  },
  [USER_DATA_PROPS.primaryOwnerPhone]: {
    x: 163,
    y: 986,
    width: 167,
  },
  [USER_DATA_PROPS.primaryOwnerEmail]: {
    x: 380,
    y: 825,
    width: 224,
  },
  [USER_DATA_PROPS.primaryOwnerAddress]: {
    x: 396,
    y: 858,
    width: 230,
  },
  [USER_DATA_PROPS.primaryOwnerAddressTwo]: {
    x: 435,
    y: 886,
    width: 240,
  },
  [USER_DATA_PROPS.primaryOwnerCity]: {
    x: 373,
    y: 922,
    width: 188,
  },
  [USER_DATA_PROPS.primaryOwnerState]: {
    x: 380,
    y: 953,
    width: 190,
  },
  [USER_DATA_PROPS.primaryOwnerZip]: {
    x: 369,
    y: 986,
    width: 105,
  },
};


export const USER_DATA_ELE_POSTION_NO_BASIC = {
  [USER_DATA_PROPS.legalBusinessName]: {
    x: 173,
    y: 239,
    width: 230,
  },
  [USER_DATA_PROPS.dba]: {
    x: 75,
    y: 270,
    width: 230,
  },
  [USER_DATA_PROPS.federalTaxId]: {
    x: 130,
    y: 302,
    width: 195,
  },
  [USER_DATA_PROPS.businessStartDate]: {
    x: 475,
    y: 240,
    width: 186,
  },
  [USER_DATA_PROPS.industryType]: {
    x: 442,
    y: 270,
    width: 195,
  },
  [USER_DATA_PROPS.numOfEmployees]: {
    x: 489,
    y: 301,
    width: 195,
  },
  [USER_DATA_PROPS.averageMonthlyPayroll]: {
    x: 501,
    y: 333,
    width: 195,
  },
  [USER_DATA_PROPS.legalEntityType]: {
    x: 462,
    y: 304,
    width: 205,
  },
  [USER_DATA_PROPS.annualBusinessRevenue]: {
    x: 195,
    y: 388,
    width: 215,
  },
  [USER_DATA_PROPS.lastMonthAccountDeposit]: {
    x: 213,
    y: 412,
    width: 182,
  },
  [USER_DATA_PROPS.ficoScore]: {
    x: 113,
    y: 452,
    width: 182,
  },
  [USER_DATA_PROPS.loanIntrestedIn]: {
    x: 465,
    y: 387,
    width: 222,
  },
  [USER_DATA_PROPS.amountRequested]: {
    x: 473,
    y: 422,
    width: 222,
  },
  [USER_DATA_PROPS.timeFrame]: {
    x: 431,
    y: 452,
    width: 222,
  },
  [USER_DATA_PROPS.mailingAddress]: {
    x: 142,
    y: 534,
    width: 278,
  },
  [USER_DATA_PROPS.mailingAddressTwo]: {
    x: 180,
    y: 566,
    width: 232,
  },
  [USER_DATA_PROPS.mailingCity]: {
    x: 72,
    y: 597,
    width: 260,
  },
  [USER_DATA_PROPS.mailingState]: {
    x: 393,
    y: 535,
    width: 240,
  },
  [USER_DATA_PROPS.mailingZip]: {
    x: 380,
    y: 565,
    width: 240,
  },
  [USER_DATA_PROPS.primaryOwnerFirstName]: {
    x: 211,
    y: 680,
    width: 200,
  },
  [USER_DATA_PROPS.primaryOwnerLastName]: {
    x: 210,
    y: 711,
    width: 200,
  },
  [USER_DATA_PROPS.primaryOwnerDob]: {
    x: 122,
    y: 741,
    width: 140,
  },
  [USER_DATA_PROPS.primaryOwnerSsn]: {
    x: 182,
    y: 776,
    width: 144,
  },
  [USER_DATA_PROPS.primaryOwnerOwnership]: {
    x: 124,
    y: 807,
    width: 130,
  },
  [USER_DATA_PROPS.primaryOwnerPhone]: {
    x: 177,
    y: 839,
    width: 167,
  },
  [USER_DATA_PROPS.primaryOwnerEmail]: {
    x: 393,
    y: 680,
    width: 224,
  },
  [USER_DATA_PROPS.primaryOwnerAddress]: {
    x: 410,
    y: 711,
    width: 230,
  },
  [USER_DATA_PROPS.primaryOwnerAddressTwo]: {
    x: 448,
    y: 741,
    width: 240,
  },
  [USER_DATA_PROPS.primaryOwnerCity]: {
    x: 389,
    y: 776,
    width: 188,
  },
  [USER_DATA_PROPS.primaryOwnerState]: {
    x: 394,
    y: 807,
    width: 190,
  },
  [USER_DATA_PROPS.primaryOwnerZip]: {
    x: 382,
    y: 839,
    width: 105,
  },
};