import { prisma } from "@/lib/prisma"
import { FeedContainer } from "@/components/feed/feed-container"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function FeedPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Fetch initial terms with their entries
  const terms = await prisma.term.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      entries: {
        take: 3,
        include: {
          user: {
            select: {
              name: true,
              level: true,
              rank: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: [
          { isCrown: "desc" },
          { confidence: "desc" },
        ],
      },
      _count: {
        select: {
          attempts: true,
          entries: true,
        },
      },
    },
  })

  return <FeedContainer initialTerms={terms as any} />
}
