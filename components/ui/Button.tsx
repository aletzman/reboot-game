"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Screw } from "./Screw";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "outline" | "solid" | "ghost" | "text" | "danger" | "cyan" | "amber";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    typeButton?: "button" | "link";
    href?: string;
    showSweep?: boolean;
    icon?: LucideIcon | React.ElementType;
    iconPosition?: "left" | "right";
}

export function Button({
    children,
    variant = "solid",
    size = "md",
    typeButton = "button",
    href,
    showSweep,
    icon: Icon,
    iconPosition = "left",
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const isLink = typeButton === "link";
    const isBig = size === "lg" || size === "xl";
    const padding = isBig ? "p-[6px]" : "p-[3.5px]";

    // Definición de colores base por variante
    const accents = {
        solid: "var(--green-light)",
        cyan: "var(--cyan)",
        danger: "var(--red-light)",
        amber: "var(--amber)",
        outline: "var(--green-light)",
        ghost: "var(--text-ghost)",
        text: "var(--text-ghost)",
    };

    const accentColor = accents[variant] || accents.solid;

    // Estilos del "Socket" (el chasis contenedor)
    const socketClasses = `
        relative inline-flex ${padding} bg-[#080b0e] rounded-md border border-[#1a222c] 
        shadow-[0_2px_0_0_#030507] group @container ${className}
        ${disabled ? 'opacity-80 grayscale pointer-events-none' : ''}
    `;

    // Estilos del "Plunger" (la parte móvil física)
    const sizeClasses = {
        xs: "h-[32px] px-3 py-1.5 text-[clamp(8px,12cqw,10px)]",
        sm: "h-[38px] px-4 py-2 text-[clamp(10px,11cqw,12px)]",
        md: "h-[46px] px-6 py-2.5 text-[clamp(12px,10cqw,15px)]",
        lg: "h-[54px] px-8 py-3 text-[clamp(14px,9cqw,16px)]",
        xl: "h-[64px] px-10 py-4 text-[clamp(16px,8cqw,26px)]",
    };

    const variantStyles = {
        solid: `
            bg-color-mix(in_srgb,var(--accent)_15%,#000)
            border-(--accent)/35 text-(--accent)
            shadow-[0_4px_0_0_#05070a,0_6px_8px_color-mix(in_srgb,var(--accent)_15%,transparent),inset_0_1px_1px_rgba(255,255,255,0.1)]
            hover:border-color-mix(in_srgb,var(--accent)_50%,white)
            hover:shadow-[0_4px_0_0_#05070a,0_12px_24px_color-mix(in_srgb,var(--accent)_20%,transparent)]
            hover:brightness-125
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        cyan: `
            bg-color-mix(in_srgb,var(--cyan)_15%,#000)
            border-(--cyan)/35 text-(--cyan)
            shadow-[0_4px_0_0_#05070a,0_6px_8px_rgba(25,200,212,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)]
            hover:border-color-mix(in_srgb,var(--cyan)_50%,white)
            hover:shadow-[0_4px_0_0_#05070a,0_12px_24px_rgba(25,200,212,0.25)]
            hover:brightness-125
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        danger: `
            bg-color-mix(in_srgb,var(--red)_15%,#000)
            border-(--red)/35 text-(--red-light)
            shadow-[0_4px_0_0_#2b0203,0_6px_8px_rgba(226,75,74,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)]
            hover:border-color-mix(in_srgb,var(--red)_50%,white)
            hover:shadow-[0_4px_0_0_#2b0203,0_12px_24px_rgba(226,75,74,0.25)]
            hover:brightness-125
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        amber: `
            bg-(--amber)/25
            border-(--amber)/35 text-(--amber)
            shadow-[0_4px_0_0_#1a1003,0_6px_8px_rgba(239,159,39,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)]
            hover:border-color-mix(in_srgb,var(--amber)_50%,white)
            hover:shadow-[0_4px_0_0_#1a1003,0_8px_18px_rgba(239,159,39,0.25)]
            hover:brightness-125
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        outline: `
            bg-transparent border border-(--accent)/30 text-(--accent)
            shadow-[0_2px_0_0_#05070a]
            hover:bg-(--accent)/5 hover:border-(--accent)/60
            active:scale-98 active:shadow-none
        `,
        ghost: `
            bg-transparent border border-transparent text-(--text-ghost)
            hover:bg-(--bg-hover)/40 hover:text-(--text-primary)
            active:scale-98 active:shadow-none
        `,
        text: `
            bg-transparent border border-transparent text-(--text-ghost)
            hover:text-(--text-muted) px-2! shadow-none!
        `,
    };

    const plungerBase = `
        relative w-full h-full flex items-center justify-center gap-2 
        font-mono font-black uppercase tracking-[0.1em] rounded-[6px] 
        transition-all duration-100 cursor-pointer select-none
        ${isBig ? 'border-2' : 'border'} overflow-hidden leading-none
    `;

    const iconSize = {
        xs: 12,
        sm: 14,
        md: 18,
        lg: 20,
        xl: 22,
    }[size];

    const renderContent = () => (
        <>
            {/* Brillo industrial superior (Plano, no curvo) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.25] bg-[linear-gradient(rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_100%)]" />

            {/* Luz de estado lateral (Solo en variantes industriales) */}
            {(variant !== 'ghost' && variant !== 'text' && variant !== 'outline') && (
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-full transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:scale-y-110"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                />
            )}

            {/* Sweep Animation */}
            {((showSweep ?? variant === 'solid') && !disabled) && (
                <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(90deg,transparent,white,transparent)] bg-size-[200%_100%] animate-[sweep-glow_3s_ease-in-out_infinite]" />
            )}

            <span className={`relative z-10 flex items-center w-full ${Icon ? "justify-between" : "justify-center"} gap-2 drop-shadow-sm`}>
                {Icon && iconPosition === "left" && <Icon size={iconSize} className="shrink-0" />}
                <span className="pt-[2px]">{children}</span>
                {Icon && iconPosition === "right" && <Icon size={iconSize} className="shrink-0" />}
            </span>
        </>
    );

    const commonProps = {
        className: `${plungerBase} ${variantStyles[variant] || variantStyles.solid} ${sizeClasses[size]}`,
        style: { '--accent': accentColor } as React.CSSProperties,
        ...props,
    };

    return (
        <div className={socketClasses}>
            {/* El "Void" para profundidad */}
            <div className={`absolute ${isBig ? 'inset-[6px]' : 'inset-[3.5px]'} rounded-[8px] bg-(--bg-void) shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)] pointer-events-none`} />

            {/* Tornillos para tamaños grandes */}
            {isBig && (
                <>
                    <Screw size="sm" corner="tl" className="opacity-30" />
                    <Screw size="sm" corner="tr" className="opacity-30" />
                    <Screw size="sm" corner="bl" className="opacity-30" />
                    <Screw size="sm" corner="br" className="opacity-30" />
                </>
            )}

            {isLink ? (
                <Link href={href || "#"} {...(commonProps as any)}>
                    {renderContent()}
                </Link>
            ) : (
                <button disabled={disabled} {...commonProps}>
                    {renderContent()}
                </button>
            )}
        </div>
    );
}