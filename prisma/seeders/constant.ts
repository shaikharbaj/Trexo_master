import { TaxType, TaxValueType } from "@prisma/client";

export const PACKAGE_GROUP_ARR = [
  {
    package_number: "10010101011",
    package_name: "New Year Package",
    package_type: "Timeline Based",
    valid_on: "Website",
    show_price_breakdown: true,
    show_price_inclusive_of_tax: true,
    test_package: true,
    live_visibility: false,
    is_active: true,
  },
];

export const PACKAGE_PLAN_ARR = [
  {
    plan_name: "Standard Plan",
    description: "This is Standard Plan",
    plan_type: "General",
    timeline_type: "Months",
    timeline: "3",
    selling_price: 10000,
    discounted_price: 100,
    discounted_valid_till: new Date("2024-07-19T00:00:00Z"),
    auto_renewal: true,
    renewal_plan_type: "Months",
    renewal_amount: 10000,
    is_popular: false,
  },
  {
    plan_name: "Premium Plan",
    plan_description: "This is Premium Plan",
    plan_type: "General",
    timeline_type: "Months",
    timeline: "3",
    selling_price: 10000,
    discounted_price: 100,
    discount_valid_till: new Date("2024-07-19T00:00:00Z"),
    auto_renewal: true,
    renewal_plan_type: "Months",
    renewal_amount: 10000,
    is_popular: false,
  },
  {
    plan_name: "Enterprise Plan",
    plan_description: "This is Enterprise Plan",
    plan_type: "General",
    timeline_type: "Months",
    timeline: "12",
    selling_price: 30000,
    discounted_price: 1500,
    discount_valid_till: new Date("2024-07-19T00:00:00Z"),
    auto_renewal: true,
    renewal_plan_type: "Months",
    renewal_amount: 30000,
    is_popular: false,
  },
];

export const TAX_ARR = [
  {
    tax_name: "Government Tax",
    description: "This is Goverment Tax",
    tax_type: TaxType.Tax,
    value_type: TaxValueType.Fixed,
    tax_value: "100",
    is_active: true,
  },
];

export const COUNTRY_ARR = [
  {
    country_name: "India",
    iso_code: "IND",
    mobile_code: 91,
    currency_code: "INR",
    is_active: true,
  },
];

export const STATE_ARR = [
  {
    state_name: "Maharashtra",
    short_code: "MH",
    is_active: true,
  },
];

export const CITY_ARR = [
  {
    city_name: "Pune",
    is_active: true,
  },
];


export const BRAND_ARR = [
  {
    brand_name: 'BMW',
    is_active: true,
  },
];


export const DIVISION_ARR = [
  {
    slug: "example-slug",
    division_name: "Example Division",
    is_active: true
  }
]







