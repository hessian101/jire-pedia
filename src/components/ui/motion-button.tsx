"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Create a motion component from the Button or wrap it
// Since Button is likely a forwardRef component, wrapping it might be tricky with motion() directly if it's not a simple HTML element.
// A safer approach is to use motion.button and apply the button styles, OR wrap the Button in a motion.div if functionality allows.
// However, to keep accessibility and Button props, let's try motion.create(Button) if Button accepts ref.
// If Button is a complex component, we might just use a span wrapper or motion.button with the same classes.
// The shadcn Button usually renders a <button>.

// Let's use a motion.button spread with button styling for maximum compatibility with animation props
// But we want to reuse the `variant` and `size` props from our UI library.

type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
    ({ className, variant, size, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    // We need to import buttonVariants to use them here if we want to use motion.button
                    // Or we can just use the Button component and wrap it.
                    // Let's try wrapping for now.
                )}
                {...props}
            >
                {children}
            </motion.button>
        )
    }
)
// MotionButton.displayName = "MotionButton"

// Actually, simpler approach:
// Just export a component that returns <Button> wrapped in <motion.div> or uses <motion.button> with the same class names.

import { buttonVariants } from "@/components/ui/button"

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
