// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import {
  COUNTRY_ARR,
  STATE_ARR,
  CITY_ARR,
  PACKAGE_GROUP_ARR,
  PACKAGE_PLAN_ARR,
  TAX_ARR,
  BRAND_ARR,
  DIVISION_ARR,
} from "./constant";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

  console.log("Seeding tax table...");
  for (const tax of TAX_ARR) {
    await prisma.tax.upsert({
      where: { id: 1 },
      update: {},
      create: {
        tax_name: tax.tax_name,
        description: tax.description,
        tax_type: tax.tax_type,
        value_type: tax.value_type,
        tax_value: tax.tax_value,
        is_active: tax.is_active,
      },
    });
  }
  console.log("Tax table seeded successfully");
  //Creating country
  const countries = [];
  console.log("Seeding Country table...");
  for (const country of COUNTRY_ARR) {
    const newCountry = await prisma.country.upsert({
      where: {
        iso_code: "IND",
      },
      update: {},
      create: {
        country_name: country.country_name,
        iso_code: country.iso_code,
        currency_code: country.currency_code,
        mobile_code: country.mobile_code,
        is_active: country.is_active,
      },
    });
    countries.push(newCountry);
  }
  console.log("country seeded successfully");

  console.log("Seeding State table...");
  //Creating state
  const states = [];
  for (const state of STATE_ARR) {
    const newState = await prisma.state.upsert({
      where: {
        country_id_state_name: {
          country_id: countries[0]?.id,
          state_name: state.state_name,
        },
      },
      update: {},
      create: {
        country_id: countries[0]?.id,
        short_code: state.short_code,
        state_name: state.state_name,
        is_active: state.is_active,
      },
    });
    states.push(newState);
  }
  console.log("state table seeded successfully");

  console.log("Seeding city table...");
  const cities = [];
  for (const city of CITY_ARR) {
    const newCity = await prisma.city.upsert({
      where: {
        state_id_city_name: {
          state_id: states[0]?.id,
          city_name: city.city_name,
        },
      },
      update: {},
      create: {
        city_name: city.city_name,
        state_id: states[0].id,
        is_active: city.is_active,
      },
    });
    cities.push(newCity);
  }
  console.log("city table seeded successfully");

  console.log('Seeding brand table...')

  for (const brand of BRAND_ARR) {
    // await prisma.brand.upsert({
    //   where: {
    //     brand_name: brand.brand_name
    //   },
    //   update: {},
    //   create: {
    //     brand_name: brand.brand_name,
    //     is_active: brand.is_active
    //   }
    // })
  }
  console.log('Brand seeded successfully');


  console.log('Seeding division table...')

  for (const division of DIVISION_ARR) {
    await prisma.division.upsert({
      where: {
        slug: division.slug
      },
      update: {},
      create: {
        slug: division.slug,
        division_name: division.division_name,
        is_active: division.is_active
      }
    })
  }
  console.log('Division seeded successfully');

}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
