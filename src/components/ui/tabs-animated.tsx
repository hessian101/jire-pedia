"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "relative inline-flex h-12 items-center justify-center rounded-xl bg-white/5 p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
        activeTabClassName?: string
    }
>(({ className, children, value, ...props }, ref) => {
    return (
        <TabsPrimitive.Trigger
            ref={ref}
            value={value}
            className={cn(
                "relative z-10 flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-400 data-[state=active]:text-white",
                className
            )}
            {...props}
        >
            {/* Background Tab Indicator */}
            {props["data-state"] === "active" && (
                <motion.div
                    layoutId="active-tab"
                    className={cn(
                        "absolute inset-0 z-[-1] rounded-lg bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]",
                        props.activeTabClassName
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {children}
        </TabsPrimitive.Trigger>
    )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
