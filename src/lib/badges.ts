import { prisma } from "@/lib/prisma"

export type BadgeCondition =
  | "first_play"
  | "3_day_streak"
  | "10_attempts"
  | "50_success"
  | "10_hard_success"
  | "100_success"
  | "10_likes_given"
  | "10_comments"
  | "50_likes_received"
  | "5_improvements_approved"
  | "30_day_streak"
  | "30_daily_challenges"
  | "all_categories"
  | "level_50"

// バッジ条件をチェックして自動付与
export async function checkAndAwardBadges(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        attempts: {
          where: { success: true },
        },
        likes: true,
        comments: true,
        improvements: {
          where: { status: "approved" },
        },
        userChallenges: {
          where: { completed: true },
        },
      },
    })

    if (!user) return []

    const earnedBadgeIds = user.badges.map((ub) => ub.badgeId)
    const newlyEarnedBadges: any[] = []

    // 全バッジを取得
    const allBadges = await prisma.badge.findMany()

    for (const badge of allBadges) {
      // 既に獲得済みならスキップ
      if (earnedBadgeIds.includes(badge.id)) continue

      let shouldAward = false

      // バッジ条件をチェック
      switch (badge.condition) {
        case "初回プレイ完了":
          shouldAward = user.attempts.length >= 1
          break

        case "3日連続ログイン":
          shouldAward = user.streak >= 3
          break

        case "10回プレイ":
          shouldAward = user.attempts.length >= 10
          break

        case "50回成功":
          shouldAward = user.attempts.length >= 50
          break

        case "HARD 10回成功":
          const hardSuccess = user.attempts.filter(
            (a) => a.difficulty === "HARD"
          ).length
          shouldAward = hardSuccess >= 10
          break

        case "100回成功":
          shouldAward = user.attempts.length >= 100
          break

        case "10回いいね":
          shouldAward = user.likes.length >= 10
          break

        case "10回コメント":
          shouldAward = user.comments.length >= 10
          break

        case "50いいね獲得":
          const totalLikesReceived = await prisma.like.count({
            where: {
              entry: {
                userId: user.id,
              },
            },
          })
          shouldAward = totalLikesReceived >= 50
          break

        case "5回改善採用":
          shouldAward = user.improvements.length >= 5
          break

        case "30日連続ログイン":
          shouldAward = user.streak >= 30
          break

        case "30回デイリー完了":
          shouldAward = user.userChallenges.length >= 30
          break

        case "全カテゴリー成功":
          const categories = await prisma.attempt.findMany({
            where: {
              userId: user.id,
              success: true,
            },
            distinct: ["termId"],
            include: {
              term: {
                select: {
                  category: true,
                },
              },
            },
          })
          const uniqueCategories = new Set(
            categories.map((c) => c.term.category)
          )
          shouldAward = uniqueCategories.size >= 3 // 理科、社会、数学
          break

        case "レベル50":
          shouldAward = user.level >= 50
          break
      }

      // バッジを付与
      if (shouldAward) {
        const userBadge = await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: badge.id,
          },
          include: {
            badge: true,
          },
        })

        newlyEarnedBadges.push(userBadge.badge)

        // 通知を作成
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: "badge_earned",
            title: "バッジを獲得しました！",
            message: `「${badge.name}」バッジを獲得しました！`,
            link: "/profile",
          },
        })
      }
    }

    return newlyEarnedBadges
  } catch (error) {
    console.error("Badge check error:", error)
    return []
  }
}

// ストリーク（連続ログイン）を更新
export async function updateStreak(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return

    const now = new Date()
    const lastActive = user.lastActiveAt

    let newStreak = user.streak
    let newLongestStreak = user.longestStreak

    if (!lastActive) {
      // 初回ログイン
      newStreak = 1
    } else {
      const lastActiveDate = new Date(lastActive)
      const daysDiff = Math.floor(
        (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff === 0) {
        // 同じ日内のログイン - ストリークは維持
        return
      } else if (daysDiff === 1) {
        // 連続ログイン
        newStreak += 1
      } else {
        // ストリーク途切れ
        newStreak = 1
      }
    }

    // 最長ストリークを更新
    if (newStreak > newLongestStreak) {
      newLongestStreak = newStreak
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveAt: now,
      },
    })

    // ストリーク更新後にバッジチェック
    await checkAndAwardBadges(userId)
  } catch (error) {
    console.error("Streak update error:", error)
  }
}
