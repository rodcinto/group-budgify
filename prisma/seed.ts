import { PrismaClient } from '@prisma/client';
import { john, paul, carla } from '../src/users/personas';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const johnPrisma = await prisma.user.upsert({
    where: { email: john.email },
    update: {},
    create: john,
  });
  const paulPrisma = await prisma.user.upsert({
    where: { email: paul.email },
    update: {},
    create: paul,
  });
  const carlaPrisma = await prisma.user.upsert({
    where: { email: carla.email },
    update: {},
    create: carla,
  });
  console.log({ johnPrisma, paulPrisma, carlaPrisma });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
