"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-custom"
import { Sparkles, BarChart2 } from "lucide-react"

interface MobileContentSwitcherProps {
    mainContent: React.ReactNode
    sidebarContent: React.ReactNode
}

export function MobileContentSwitcher({ mainContent, sidebarContent }: MobileContentSwitcherProps) {
    return (
        <>
            {/* Desktop View: Simple Grid */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_340px] gap-8">
                <main>{mainContent}</main>
                <aside>{sidebarContent}</aside>
            </div>

            {/* Mobile View: Tabs */}
            <div className="lg:hidden">
                <Tabs defaultValue="feed" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-6 bg-white/5 p-1 rounded-xl">
                        <TabsTrigger
                            value="feed"
                            className="rounded-lg gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                        >
                            <Sparkles className="w-4 h-4" />
                            Latest Entries
                        </TabsTrigger>
                        <TabsTrigger
                            value="sidebar"
                            className="rounded-lg gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                        >
                            <BarChart2 className="w-4 h-4" />
                            Trends & Missions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="feed" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
                        {mainContent}
                    </TabsContent>

                    <TabsContent value="sidebar" className="mt-0 animate-in fade-in-50 slide-in-from-right-2 duration-300">
                        {sidebarContent}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
