// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { TAX_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  //Creating Tax
  console.log('Seeding tax table...');
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
  console.log('Tax table seeded successfully');
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
