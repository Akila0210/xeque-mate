import { PrismaClient } from "../app/generated/prisma2/client"
const prisma = new PrismaClient();

const achievements = [
  {
    title: "Primeiro Torneio",
    icon: "Trophy",
    description: "Participe do seu primeiro torneio na plataforma.",
  },
  {
    title: "Competidor Frequente",
    icon: "Flag",
    description: "Participe de 5 torneios na plataforma.",
  },
  {
    title: "Começo da Jornada",
    icon: "Calendar",
    description: "Entre na plataforma durante 3 dias seguidos.",
  },
  {
    title: "Dedicado",
    icon: "CalendarCheck",
    description: "Entre na plataforma durante 7 dias seguidos.",
  },
  {
    title: "Primeira Vitória",
    icon: "Medal",
    description: "Vença sua primeira partida de torneio.",
  },
  {
    title: "Campeão de Rodada",
    icon: "Sword",
    description: "Vença 10 partidas de torneio.",
  },
  {
    title: "Campeão Estreante",
    icon: "Crown",
    description: "Ganhe seu primeiro torneio completo.",
  },
  {
    title: "Lenda dos Torneios",
    icon: "Shield",
    description: "Ganhe 5 torneios completos.",
  },
];

async function main() {
  await prisma.achievement.createMany({
    data: achievements,
    skipDuplicates: true,
  });

  console.log("Conquistas criadas com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
