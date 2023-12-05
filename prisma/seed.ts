import { PrismaClient } from '@prisma/client';
import { BcryptDecorator } from '../src/auth/crypt/bcrypt.decorator';
import { john, paul, carla } from '../src/users/personas';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const johnPrisma = await prisma.user.upsert({
    where: { email: john.email },
    update: {},
    create: { ...john, password: await BcryptDecorator.hash(john.password) },
  });
  const paulPrisma = await prisma.user.upsert({
    where: { email: paul.email },
    update: {},
    create: { ...paul, password: await BcryptDecorator.hash(paul.password) },
  });
  const carlaPrisma = await prisma.user.upsert({
    where: { email: carla.email },
    update: {},
    create: { ...carla, password: await BcryptDecorator.hash(carla.password) },
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
