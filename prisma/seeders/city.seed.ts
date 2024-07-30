// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { CITY_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const stateData = await prisma.state.findFirst({
    where: { state_name: 'Maharashtra' },
  });
  console.log('Seeding city table...');
  for (const city of CITY_ARR) {
    await prisma.city.upsert({
      where: {
        state_id_city_name: {
          state_id: stateData.id,
          city_name: city.city_name,
        },
      },
      update: {},
      create: {
        city_name: city.city_name,
        state_id: stateData.id,
        is_active: city.is_active,
      },
    });
  }
  console.log('city table seeded successfully');
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
