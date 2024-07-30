// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { COUNTRY_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding country table...');
  for (const country of COUNTRY_ARR) {
    await prisma.country.upsert({
      where: { iso_code:"IND" },
      update: {},
      create: {
        country_name: country.country_name,
        iso_code: country.iso_code,
        currency_code: country.currency_code,
        mobile_code: country.mobile_code,
        is_active: country.is_active,
      },
    });
  }
  console.log('country table seeded successfully');
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
