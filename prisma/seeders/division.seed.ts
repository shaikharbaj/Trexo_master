// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { DIVISION_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
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
