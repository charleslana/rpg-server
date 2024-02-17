import { Character, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const characters = [
    {
      name: 'Fire Knight',
      characterClass: 'melee',
      description:
        'Fire Knight é um guerreiro destemido, envolto em chamas ardentes que ele manipula habilmente como uma extensão de seu próprio ser. Ele é conhecido por sua força imparável e coragem inabalável no campo de batalha. Com sua armadura resistente e espada flamejante, ele atravessa as linhas inimigas, deixando um rastro de destruição por onde passa. Sua habilidade em controlar o fogo não só causa danos devastadores aos inimigos, mas também inspira seus aliados a lutar com fervor renovado.',
    },
    {
      name: 'Ranger',
      characterClass: 'ranged',
      description:
        'Ranger é uma mestra do arco e flecha, habilidosa em se mover silenciosamente pelos confins da natureza. Ela é uma exploradora hábil, conhecida por sua destreza em caçar presas e rastrear inimigos através de florestas densas e terrenos acidentados. Com sua agilidade e precisão mortal, a Ranger é capaz de atingir alvos distantes com uma precisão impressionante, deixando seus oponentes em desvantagem antes mesmo de se aproximarem.',
    },
    {
      name: 'Mage',
      characterClass: 'ranged',
      description:
        'Mage é um estudioso dedicado das artes arcanas, cujo domínio sobre os elementos da natureza transcende os limites da compreensão comum. Ela é capaz de conjurar e manipular energia mágica para lançar feitiços devastadores sobre seus inimigos ou conceder bênçãos curativas aos seus aliados. Com seu conhecimento enciclopédico de grimórios antigos e rituais arcanos, a Mage é uma força a ser reconhecida no campo de batalha, capaz de desencadear poderes elementares que desafiam a própria realidade.',
    },
  ] as Character[];

  for (const character of characters) {
    await prisma.character.create({
      data: character,
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
