"use client"

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { useRouter } from "next/navigation"
import { awardTutorialBadge } from "@/actions/badge-actions"

export function OnboardingTour() {
    const router = useRouter()

    useEffect(() => {
        // Check if tour has already been seen
        const hasSeenTour = localStorage.getItem("hasSeenOnboarding")
        if (hasSeenTour) return

        const driverObj = driver({
            showProgress: true,
            animate: true,
            doneBtnText: "わかった！",
            nextBtnText: "次へ",
            prevBtnText: "戻る",
            steps: [
                {
                    element: ".group\\/btn", // Target the "Start Challenge" button
                    popover: {
                        title: "ようこそ Jire-pedia へ！",
                        description: "ここは、あなたが「言葉」を説明し、AIに当ててもらうゲームです。",
                        side: "top",
                        align: 'center'
                    }
                },
                {
                    element: ".dictionary-link", // Target the Dictionary link
                    popover: {
                        title: "辞書で学ぼう",
                        description: "他のプレイヤーがどう説明したか、辞書で確認してみましょう。",
                        side: "bottom",
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: "準備はいいですか？",
                        description: "さあ、デイリーチャレンジに挑戦して、あなたの説明力を試しましょう！",
                    }
                }
            ],
            onDestroyed: async () => {
                localStorage.setItem("hasSeenOnboarding", "true")
                // Award the badge
                await awardTutorialBadge()
            }
        })

        // Slight delay to ensure elements are rendered
        const timer = setTimeout(() => {
            driverObj.drive()
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return null // This component doesn't render anything visible itself
}
