import { ElementType, ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { LucideIcon } from "lucide-react";

type TheoryButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
type TheoryButtonSize = 'sm' | 'md' | 'lg';

interface TheoryButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
    variant?: TheoryButtonVariant;
    size?: TheoryButtonSize;
    icon?: LucideIcon | ElementType;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    children?: ReactNode;
}


export function TheoryButton({
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    isLoading,
    children,
    className = '',
    disabled,
    ...props
}: TheoryButtonProps) {
    // Colors configuration (using variables from AGENTS.md)
    const variantConfig: Record<TheoryButtonVariant, { base: string, text: string, shadow: string }> = {
        primary: {
            base: 'bg-(--purple)',
            text: 'text-(--bg-deep)',
            shadow: 'rgba(127, 119, 221, 0.4)'
        },
        secondary: {
            base: 'bg-(--bg-hover)',
            text: 'text-(--text-muted)',
            shadow: 'rgba(0, 0, 0, 0.2)'
        },
        danger: {
            base: 'bg-(--red)',
            text: 'text-(--text-primary)',
            shadow: 'rgba(226, 75, 74, 0.4)'
        },
        success: {
            base: 'bg-(--green-light)/90',
            text: 'text-(--green-darkest)',
            shadow: 'rgba(126, 213, 38, 0.4)'
        },
        warning: {
            base: 'bg-(--amber)',
            text: 'text-(--bg-void)',
            shadow: 'rgba(239, 159, 39, 0.4)'
        },
        info: {
            base: 'bg-(--cyan)',
            text: 'text-(--bg-void)',
            shadow: 'rgba(25, 200, 212, 0.4)'
        }
    };

    const config = variantConfig[variant];

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-[10px] gap-1.5',
        md: 'px-5 py-2.5 text-[12px] gap-2',
        lg: 'px-8 py-3.5 text-[14px] gap-3'
    };

    const iconSize = {
        sm: 12,
        md: 16,
        lg: 18
    }[size];

    return (
        <motion.button
            whileHover={!disabled && !isLoading ? {
                x: 4,
                filter: 'brightness(1.1) contrast(1.1)',
                transition: { type: 'spring', stiffness: 400, damping: 10 }
            } : {}}
            whileTap={!disabled && !isLoading ? { x: 1, filter: 'brightness(0.9)' } : {}}
            className={`
                relative group flex items-center justify-center font-mono font-bold uppercase tracking-widest transition-all duration-200
                border rounded-xs overflow-hidden
                ${sizeClasses[size]}
                ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
                ${variant === 'secondary' ? 'bg-(--bg-hover)' : config.base}
                border-(--bg-hover)
                ${variant === 'secondary' ? 'text-(--text-primary)' : config.text}
                shadow-[0_4px_15px_-5px_var(--accent-color)]
            `}
            style={{
                "--accent-color": config.base,
            } as any}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Digital Scanline Effect (Only on Hover) */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/40 to-transparent h-4 -top-4 group-hover:animate-[scanline_2s_linear_infinite]" />
            </div>

            {/* Left accent bar that expands on hover */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 transition-all duration-200 ${config.text}`}
            />

            {/* Content orientation */}
            <div className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        {Icon && iconPosition === 'left' && (
                            <Icon size={iconSize} className="opacity-80 transition-transform group-hover:translate-x-0.5" />
                        )}
                        <span className="pt-px">{children}</span>
                        {Icon && iconPosition === 'right' && (
                            <Icon size={iconSize} className="opacity-80 transition-transform group-hover:-translate-x-0.5" />
                        )}
                    </>
                )}
            </div>
        </motion.button>
    );
}