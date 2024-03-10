import { encrypt } from '../../src/utils/crypt';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 30);
  const users = [
    {
      email: 'email@email.com',
      password: encrypt('123456'),
      name: 'User1',
    },
    {
      email: 'email2@email.com',
      password: encrypt('123456'),
      name: 'User2',
      bannedTime: currentDate,
    },
    {
      email: 'email3@email.com',
      password: encrypt('123456'),
      name: 'User3',
    },
  ] as User[];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await prisma.user.create({
      data: {
        ...user,
        roles: {
          create: {
            name: i === 0 ? 'admin' : 'user',
          },
        },
      },
    });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
