import prisma from "@/lib/prisma";

export type RankItem = {
  position: number;
  name: string;
  points: number;
};

export async function getAllTimeRanking(limit = 50): Promise<RankItem[]> {
  const users = await prisma.user.findMany({
    orderBy: { points: "desc" },
    take: limit,
    select: {
      name: true,
      points: true,
    },
  });

  return users.map((user, index) => ({
    position: index + 1,
    name: user.name,
    points: user.points,
  }));
}
