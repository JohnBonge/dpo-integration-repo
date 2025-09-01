import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('xyVqak-xavhud-2dagna', 12);

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@ingomatours.com' },
    update: {},
    create: {
      email: 'admin@ingomatours.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated');
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
