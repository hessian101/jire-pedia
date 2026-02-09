"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs-custom"
import { TrendingWords } from "@/components/home/trending-words"
import { OngoingMissions } from "@/components/home/ongoing-missions"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function HomeTabs() {
    const [activeTab, setActiveTab] = useState("trending")

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6 bg-white/5 p-1 rounded-xl relative">
                <TabsTrigger
                    value="trending"
                    className={cn(
                        "relative z-10 rounded-lg transition-colors duration-200",
                        activeTab === "trending" ? "text-cyan-400" : "text-gray-400 hover:text-gray-200",
                        // Remove default data-[state=active] styles that allow background color conflict
                        "data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    )}
                >
                    {activeTab === "trending" && (
                        <motion.div
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-cyan-500/20 rounded-lg z-[-1] shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 font-medium tracking-wide">Trending</span>
                </TabsTrigger>

                <TabsTrigger
                    value="missions"
                    className={cn(
                        "relative z-10 rounded-lg transition-colors duration-200",
                        activeTab === "missions" ? "text-purple-400" : "text-gray-400 hover:text-gray-200",
                        "data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    )}
                >
                    {activeTab === "missions" && (
                        <motion.div
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-purple-500/20 rounded-lg z-[-1] shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 font-medium tracking-wide">Missions</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <TrendingWords />
            </TabsContent>

            <TabsContent value="missions" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <OngoingMissions />
            </TabsContent>
        </Tabs>
    )
}
