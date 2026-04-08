import { ElementType, ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { LucideIcon } from "lucide-react";

type TheoryButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
type TheoryButtonVariant = 'solid' | 'ghost' | 'outline' | 'text';
type TheoryButtonSize = 'sm' | 'md' | 'lg';

interface TheoryButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
    color?: TheoryButtonColor;
    variant?: TheoryButtonVariant;
    size?: TheoryButtonSize;
    icon?: LucideIcon | ElementType;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    children?: ReactNode;
}


export function TheoryButton({
    color = 'primary',
    variant = 'solid',
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
    const colorConfig: Record<TheoryButtonColor, { bg: string, text: string, onBg: string, border: string, shadow: string, sweep: string }> = {
        primary: {
            bg: 'bg-(--purple)',
            text: 'text-(--purple)',
            onBg: 'text-(--bg-deep)',
            border: 'border-(--purple)',
            sweep: 'bg-(--bg-deep)/10',
            shadow: 'rgba(127, 119, 221, 0.4)'
        },
        secondary: {
            bg: 'bg-(--bg-hover)',
            text: 'text-(--text-muted)',
            onBg: 'text-(--text-primary)',
            border: 'border-(--bg-hover)',
            sweep: 'bg-white/5',
            shadow: 'rgba(0, 0, 0, 0.2)'
        },
        danger: {
            bg: 'bg-(--red)',
            text: 'text-(--red)',
            onBg: 'text-(--text-primary)',
            border: 'border-(--red)',
            sweep: 'bg-black/10',
            shadow: 'rgba(226, 75, 74, 0.4)'
        },
        success: {
            bg: 'bg-(--green-light)',
            text: 'text-(--green-light)',
            onBg: 'text-(--green-darkest)',
            border: 'border-(--green-light)',
            sweep: 'bg-black/10',
            shadow: 'rgba(126, 213, 38, 0.4)'
        },
        warning: {
            bg: 'bg-(--amber)',
            text: 'text-(--amber)',
            onBg: 'text-(--bg-void)',
            border: 'border-(--amber)',
            sweep: 'bg-black/10',
            shadow: 'rgba(239, 159, 39, 0.4)'
        },
        info: {
            bg: 'bg-(--cyan)',
            text: 'text-(--cyan)',
            onBg: 'text-(--bg-void)',
            border: 'border-(--cyan)',
            sweep: 'bg-black/10',
            shadow: 'rgba(25, 200, 212, 0.4)'
        }
    };

    const config = colorConfig[color];

    const variantClasses = {
        solid: `${config.bg} ${config.onBg} ${config.border} hover:brightness-110`,
        outline: `bg-transparent ${config.text} ${config.border} ${config.bg.replace('bg-', 'hover:bg-')}/10`,
        ghost: `${config.bg}/5 ${config.text} border-transparent ${config.bg.replace('bg-', 'hover:bg-')}/15`,
        text: `bg-transparent ${config.text} border-transparent px-2 ${config.bg.replace('bg-', 'hover:bg-')}/10`
    }[variant];

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
                filter: 'brightness(1.1) contrast(1.1)',
                transition: { duration: 0.2 }
            } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98, filter: 'brightness(0.9)' } : {}}
            className={`
                relative group flex items-center justify-center font-mono font-bold uppercase tracking-widest transition-all duration-200
                border rounded-xs overflow-hidden
                ${sizeClasses[size]}
                ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${variantStylesToClasses(variantClasses)}
                ${variant === 'solid' ? 'shadow-[0_4px_15px_-5px_var(--accent-color)]' : ''}
                ${className}
            `}
            style={{
                "--accent-color": config.shadow,
            } as any}
            disabled={disabled || isLoading}
            {...props}
        >

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

// Helper to keep the JSX cleaner
function variantStylesToClasses(classes: string) {
    return classes;
}