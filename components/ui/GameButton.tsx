// ============================================================
// REBOOT — components/ui/GameButton.tsx
// Botón compacto para interfaces de niveles de juego.
// Misma identidad visual que Button.tsx pero optimizado
// para paletas de comandos, secuencias y controles in-game.
// ============================================================

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



    const base = "relative inline-flex items-center gap-4 font-mono uppercase tracking-[.08em] transition-all duration-200 cursor-pointer overflow-hidden select-none";
    const hoverColor = `hover:bg-(--bg-hover)`;

    const variants: Record<string, string> = {
        command: `
            rounded-[4px] text-[11px] px-3 py-[7px]
            bg-(--bg-elevated) border border-(--bg-hover)
            text-(--green-light)
            ${hoverColor}
            hover:shadow-[0_0_10px_rgba(85,226,0,0.08)]
            active:scale-[0.97]
        `,
        action: `
            rounded-[2px] text-[12px] px-5 py-[10px]
            bg-(--green-dark) border border-(--green-base)
            text-(--green-light)
            shadow-[0_0_15px_rgba(85,226,0,0.1)]
            hover:bg-(--green-base) hover:text-(--bg-void)
            hover:shadow-[0_0_25px_rgba(85,226,0,0.25)]
            active:scale-[0.97]
        `,
        ghost: `
            rounded-[2px] text-[11px] px-4 py-[8px]
            bg-transparent border border-(--bg-hover)
            text-(--text-muted)
            hover:border-(--text-ghost) hover:text-(--text-primary)
            active:scale-[0.97]
        `,
        danger: `
            rounded-[2px] text-[11px] px-3 py-[7px]
            bg-(--bg-elevated) border border-(--bg-hover)
            text-(--text-ghost)
            hover:border-(--red) hover:text-(--red)
            hover:shadow-[0_0_10px_rgba(226,75,74,0.08)]
            active:scale-[0.97]
        `,
    };

    const activeStyles = active && !accentColor
        ? "border-(--green-light)! bg-(--green-dark)! text-(--green-light)! shadow-[0_0_12px_rgba(85,226,0,0.3)]!"
        : "";

    const activeStylesWithAccent = active && accentColor
        ? "scale-[1.02] z-10" // Pequeño efecto 3D/Z al activarse
        : "";

    const accentClasses = accentColor 
        ? (active 
            ? "border-[var(--accent-base)]!" 
            : "border-[var(--accent-border)]! hover:border-[var(--accent-border-hover)]!"
          )
        : "";

    const disabledStyles = disabled
        ? "opacity-40 cursor-not-allowed! hover:bg-(--bg-elevated)! hover:border-(--bg-hover)! hover:shadow-none! hover:text-(--text-ghost)! active:scale-100!"
        : "";

    const dynamicStyle = accentColor ? {
        color: accentColor,
        '--accent-base': accentColor,
        '--accent-border': `color-mix(in srgb, ${accentColor} 20%, transparent)`,
        '--accent-border-hover': `color-mix(in srgb, ${accentColor} 70%, transparent)`,
        '--accent-bg-active': `color-mix(in srgb, ${accentColor} 15%, transparent)`,
        backgroundColor: active ? 'var(--accent-bg-active)' : undefined,
        boxShadow: active ? `inset 0 0 10px color-mix(in srgb, ${accentColor} 20%, transparent), 0 0 15px color-mix(in srgb, ${accentColor} 40%, transparent)` : undefined,
        textShadow: active ? `0 0 8px color-mix(in srgb, ${accentColor} 60%, transparent)` : undefined,
        '--_accent': accentColor
    } as React.CSSProperties : undefined;

    return (
        <button
            className={`${base} ${variants[variant]} ${activeStyles} ${activeStylesWithAccent} ${accentClasses} ${disabledStyles} ${className}`}
            disabled={disabled}
            style={dynamicStyle}
            {...props}
        >
            {icon && <span className="text-[14px] leading-none">{icon}</span>}
            {children}
        </button>
    );
}
