
import React from "react";

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "command" | "action" | "ghost" | "danger";
    active?: boolean;
    icon?: React.ReactNode;
    accentColor?: string;   // color CSS var, ej: "var(--amber)"
}


export function GameButton({
    children,
    variant = "command",
    active = false,
    icon,
    accentColor,
    className = "",
    disabled,
    ...props
}: GameButtonProps) {
    const base = "relative inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[.1em] rounded-xs transition-all duration-200 cursor-pointer select-none group";

    const variants: Record<string, string> = {
        command: `
            text-[12px] px-3 py-[10px] font-semibold
            bg-(--bg-elevated) border border-(--bg-hover)
            text-(--accent-base)/85
            hover:text-(--green-light) hover:border-(--green-base)/50
            hover:shadow-[0_0_15px_rgba(85,226,0,0.1)]
            active:scale-[0.96]
            before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-(--bg-hover) before:transition-colors
            hover:before:bg-(--accent-base)/80
        `,
        action: `
            text-[12px] px-6 py-3
            bg-(--green-darkest) border border-(--green-base)
            text-(--green-light)   font-semibold
            shadow-[0_0_20px_rgba(85,226,0,0.15)]
            hover:bg-(--green-dark) hover:shadow-[0_0_30px_rgba(85,226,0,0.3)]
            active:scale-[0.98]
            clip-path-notch
        `,
        ghost: `
            text-[11px] px-4 py-2
            bg-transparent border border-(--bg-hover)
            text-(--text-ghost)
            hover:border-(--text-muted) hover:text-(--text-primary)
            active:scale-[0.96]
        `,
        danger: `
            text-[11px] px-3 py-[6px]
            bg-(--bg-elevated) border border-red-900/30
            text-red-500/70
            hover:border-(--red) hover:text-(--red)
            hover:shadow-[0_0_15px_rgba(226,75,74,0.15)]
            active:scale-[0.96]
        `,
    };


    const activeStyles = active && !accentColor
        ? `border-(--green-light)! bg-(--green-darkest)! text-(--green-light)! shadow-[0_0_15px_rgba(85,226,0,0.4)]! before:bg-(--green-light)!`
        : "";

    const activeStylesWithAccent = active && accentColor
        ? "scale-[1.02] z-10 brightness-125"
        : "";

    const accentClasses = accentColor
        ? (active
            ? "border-(--accent-base)! text-(--accent-base)! before:bg-(--accent-base)!"
            : "border-(--text-primary)/15! hover:border-(--accent-border-hover)! hover:text-(--accent-base)!"
        )
        : "";

    const disabledStyles = disabled
        ? "opacity-30 cursor-not-allowed! grayscale hover:bg-(--bg-elevated)! pointer-events-none! hover:border-(--bg-hover)! hover:shadow-none! hover:text-(--text-ghost)! active:scale-100!"
        : "";

    const dynamicStyle = accentColor ? {
        '--accent-base': accentColor,
        '--accent-border': `color-mix(in srgb, ${accentColor} 30%, transparent)`,
        '--accent-border-hover': `color-mix(in srgb, ${accentColor} 40%, transparent)`,
        '--accent-bg-active': `color-mix(in srgb, ${accentColor} 10%, transparent)`,
        backgroundColor: active ? 'var(--accent-bg-active)' : undefined,
        boxShadow: active ? `0 0 20px color-mix(in srgb, ${accentColor} 30%, transparent)` : undefined,
    } as React.CSSProperties : undefined;

    return (
        <button
            className={`${base} ${variants[variant]} ${activeStyles} ${activeStylesWithAccent} ${accentClasses} ${disabledStyles} ${className}`}
            disabled={disabled}
            style={dynamicStyle}
            {...props}
        >
            {/* Pequeño indicador LED superior derecho */}
            {variant === 'command' && (
                <div className={`absolute top-1.5 right-1.5 w-1 h-1 rounded-full transition-all duration-300 ${active
                    ? 'bg-(--green-light) shadow-[0_0_5px_var(--green-light)]'
                    : 'bg-(--bg-hover) group-hover:bg-(--text-ghost)'
                    }`} style={accentColor ? { backgroundColor: active ? accentColor : undefined, boxShadow: active ? `0 0 5px ${accentColor}` : undefined } : {}} />
            )}

            {icon && <span className="text-[14px] leading-none shrink-0 flex items-center justify-center">{icon}</span>}
            {children && <span className="leading-none">{children}</span>}

            {/* Efecto de 'brillo' industrial al pasar por encima */}
            <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/2 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
        </button>
    );
}
