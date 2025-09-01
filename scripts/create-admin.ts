import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@ingomatours.com';
  const password = 'admin123'; // Using a simple password for testing

  try {
    const hashedPassword = await hash(password, 12);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin already exists, updating password...');
    }

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated successfully:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Use this email and password to login:');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
