"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Motion component created from Button
import { buttonVariants } from "@/components/ui/button"

type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">

const MotionButtonComponent = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        )
    }
)
MotionButtonComponent.displayName = "MotionButton"

export { MotionButtonComponent as MotionButton }
