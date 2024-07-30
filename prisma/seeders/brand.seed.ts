// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { BRAND_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding brand table...')

    for (const brand of BRAND_ARR) {
        // await prisma.brand.upsert({
        //     where: {
        //         brand_name: brand.brand_name
        //     },
        //     update: {},
        //     create: {
        //         brand_name: brand.brand_name,
        //         is_active: brand.is_active
        //     }
        // })
    }
    console.log('Brand seeded successfully');
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
