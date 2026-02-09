"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function awardTutorialBadge() {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" }
    }

    try {
        const badgeName = "Tutorial Master"

        // 1. Ensure Badge exists
        const badge = await prisma.badge.upsert({
            where: { name: badgeName },
            update: {},
            create: {
                name: badgeName,
                nameEn: "Tutorial Master",
                description: "Completed the introductory tour.",
                category: "beginner",
                iconName: "GraduationCap",
                condition: "Complete the onboarding tour.",
                rarity: "common"
            }
        })

        // 2. Award Badge to User
        await prisma.userBadge.create({
            data: {
                userId: session.user.id,
                badgeId: badge.id
            }
        })

        // 3. (Optional) Update User stats or XP if needed
        // await prisma.user.update(...)

        revalidatePath("/profile")
        return { success: true, badge }
    } catch (error) {
        // Ignore unique constraint error if badge already awarded
        if ((error as any).code === 'P2002') {
            return { success: true, message: "Badge already awarded" }
        }
        console.error("Failed to award badge:", error)
        return { success: false, error: "Failed to award badge" }
    }
}
