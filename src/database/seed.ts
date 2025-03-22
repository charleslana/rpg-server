import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await createTitles();
}

async function createTitles() {
  const titles = [
    { name: 'Cavaleiro da Noite' },
    { name: 'Guardião da Aurora' },
    { name: 'Mestre dos Elementos' },
  ];

  try {
    await prisma.title.createMany({
      data: titles,
      skipDuplicates: true,
    });
    console.log('Titles seeded successfully');
  } catch (e) {
    console.error('Error seeding titles:', e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
