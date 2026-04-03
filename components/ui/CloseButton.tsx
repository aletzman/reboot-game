"use client"

import { XIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface CloseButtonProps {
    onClick: (e?: React.MouseEvent) => void
    size?: 'xs' | 'sm' | 'md' | 'lg'
    className?: string
    disabled?: boolean
    variant?: "dark" | "light"
}

/**
 * CloseButton — REBOOT
 * A unified industrial-style close button for ALL contexts.
 * Square, thematic, and designed to blend into headers while popping on hover.
 */
export function CloseButton({
    onClick,
    size = 'md',
    className = "",
    variant = "dark",
    disabled = false
}: CloseButtonProps) {
    // Square Size mapping
    const sizeClasses = {
        xs: 'w-5 h-5',
        sm: 'w-6 h-6',
        md: 'w-8 h-8 md:w-9 md:h-9',
        lg: 'w-11 h-11 md:w-12 md:h-12'
    };

    const iconSizes = {
        xs: 10,
        sm: 12,
        md: 16,
        lg: 20
    };

    const variantClasses = {
        light: "text-(--bg-surface) group-hover/close:text-[#ff0000] transition-colors",
        dark: "text-(--text-muted) group-hover/close:text-(--red) transition-colors",
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
            className={`
                group/close relative flex items-center justify-center aspect-square
                bg-transparent transition-all duration-300 cursor-pointer  hover:bg-red-500/10
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${className}
            `}
            aria-label="Close"
            disabled={disabled}
        >

            {/* Visual Hardware Notches — Standardized Corner Markers */}
            <div className="absolute top-px left-0 w-2 h-2 border-t border-l border-(--border-color) group-hover/close:border-(--red)/40 transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-(--border-color) group-hover/close:border-(--red)/40 transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-(--border-color) group-hover/close:border-(--red)/40 transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-(--border-color) group-hover/close:border-(--red)/40 transition-colors" />



            <div className="relative flex items-center justify-center w-full h-full">
                <motion.div
                    whileHover={{ rotate: 90, scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="relative p-1 cursor-pointer"
                >
                    <XIcon
                        size={iconSizes[size]}
                        className={`transition-colors ${variant === 'light' ? 'group-hover/close:text-(--red-dark)' : 'group-hover/close:text-(--red)'}`}
                        strokeWidth={size === 'sm' ? 2 : 3}
                    />
                </motion.div>
            </div>

            {/* Click Feedback Ripple */}
            <motion.div
                className="absolute inset-0 bg-(--red)/10 opacity-0 pointer-events-none"
                whileTap={{ opacity: 1 }}
            />
        </button>
    )
}
