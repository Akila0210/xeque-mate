import prisma from "@/lib/prisma"

export const getAchievements = async () => {
    const achievements = await prisma.achievement.findMany();

    return achievements;
}