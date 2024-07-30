// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { STATE_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding state table...');
  const country = await prisma.country.findFirst({
    where: {
      iso_code: 'IND',
    },
  });
  for (const state of STATE_ARR) {
    await prisma.state.upsert({
      where: {
        country_id_state_name: {
          country_id: country.id,
          state_name: state.state_name,
        },
      },
      update: {},
      create: {
        country_id: country.id,
        state_name: state.state_name,
        short_code: state.short_code,
        is_active: state.is_active,
      },
    });
  }
  console.log('State table seeded successfully');
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
