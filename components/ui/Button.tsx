"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Screw } from "./Screw";

export type ButtonVariant = "green" | "cyan" | "amber" | "red" | "blue" | "outline" | "ghost" | "text" | "solid" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    typeButton?: "button" | "link";
    href?: string;
    showSweep?: boolean;
    showStripes?: boolean;
    icon?: LucideIcon | React.ElementType;
    iconPosition?: "left" | "right";
    isScanning?: boolean;
}

export function Button({
    children,
    variant = "green",
    size = "md",
    typeButton = "button",
    href,
    showSweep,
    showStripes,
    icon: Icon,
    iconPosition = "left",
    isScanning,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const isLink = typeButton === "link";
    const isBig = size === "lg" || size === "xl";
    const padding = isBig ? "p-[6px]" : "p-[3.5px]";

    // Definición de colores base por variante
    const accents: Record<string, string> = {
        solid: "var(--green-light)",
        danger: "var(--red-light)",
        green: "var(--green-light)",
        cyan: "var(--cyan)",
        red: "var(--red-light)",
        amber: "var(--amber)",
        blue: "var(--blue)",
        outline: "var(--green-light)",
        ghost: "var(--text-ghost)",
        text: "var(--text-ghost)",
    };

    const accentColor = accents[variant] || accents.green;

    // Estilos del "Socket" (el chasis contenedor)
    const socketClasses = `
        relative inline-flex ${padding} bg-[#080b0e] rounded-md border border-[#1a222c] 
         group ${className}
        ${disabled ? 'pointer-events-none' : ''}
    `;

    // Estilos del "Plunger" (la parte móvil física)
    const sizeClasses: Record<string, string> = {
        xs: "h-[32px] px-3 py-1.5 text-[clamp(8px,12cqw,10px)]",
        sm: "h-[38px] px-4 py-2 text-[clamp(10px,11cqw,12px)]",
        md: "h-[46px] px-6 py-2.5 text-[clamp(12px,10cqw,15px)]",
        lg: "h-[54px] px-8 py-3 text-[clamp(14px,9cqw,16px)]",
        xl: "h-[64px] px-10 py-4 text-[clamp(16px,8cqw,26px)]",
    };

    const baseShadow = "shadow-[0_4px_0_0_#05070a,0_6px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]";
    const hoverShadow = "hover:shadow-[0_4px_0_0_#05070a,0_12px_24px_rgba(0,0,0,0.4)]";

    const variantStyles: Record<string, string> = {
        solid: `
            bg-color-mix(in_srgb,var(--green-base)_15%,#000)
            border-(--green-base)/35 text-(--green-light)
            ${baseShadow} ${hoverShadow}
            hover:border-(--green-light)/60 hover:shadow-[0_6px_0_0_#0b2300,0_15px_30px_rgba(126,213,38,0.3)]
            hover:brightness-125
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        danger: `
            bg-[color-mix(in_srgb,var(--red)_60%,transparent_100%)]
            border-(--red)/35 text-(--red-light)
            ${baseShadow} ${hoverShadow}
            hover:border-(--red)/60 hover:shadow-[0_6px_0_0_#23000033,0_15px_30px_rgba(220,53,69,0.3)]
            hover:brightness-125
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        green: `
            bg-(--green-dark)
            border-(--green-base)/35 text-(--green-light)
            ${baseShadow} ${hoverShadow}
            hover:border-(--green-light)/50 hover:shadow-[0_6px_0_0_#0b230033,0_15px_30px_rgba(126,213,38,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_6px_0_0_#0b2300,0_15px_30px_rgba(126,213,38,0.3)]
            disabled:scale-98 disabled:shadow-[0_6px_0_0_#0b2300,0_15px_30px_rgba(126,213,38,0.3)] cursor-not-allowed
        `,
        cyan: `
            bg-[color-mix(in_srgb,var(--cyan)_60%,transparent_100%)]
            border-(--cyan)/35 text-(--cyan)
            ${baseShadow} ${hoverShadow}
            hover:border-(--cyan)/60 hover:shadow-[0_6px_0_0_#00232333,0_15px_30px_rgba(16,185,129,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        red: `
            bg-[color-mix(in_srgb,var(--red)_60%,transparent_100%)]
            border-(--red)/35 text-(--red-light) 
            hover:border-(--red)/60 hover:shadow-[0_6px_0_0_#23000033,0_15px_30px_rgba(220,53,69,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        amber: `
            bg-[color-mix(in_srgb,var(--amber)_60%,transparent_100%)]
            border-(--amber)/35 text-(--amber)
            ${baseShadow} ${hoverShadow}
            hover:border-(--amber)/50 hover:shadow-[0_6px_0_0_#231b0033,0_15px_30px_rgba(255,193,7,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        blue: `
            bg-[color-mix(in_srgb,var(--blue)_60%,transparent_100%)]
            border-(--blue)/35 text-(--blue)
            ${baseShadow} ${hoverShadow}
            hover:border-(--blue)/60 hover:shadow-[0_6px_0_0_#001a2333,0_15px_30px_rgba(59,130,246,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        outline: `
            bg-transparent border border-(--accent)/30 text-(--accent)
            shadow-[0_2px_0_0_#05070a]
            hover:bg-(--accent)/10 hover:border-(--accent)/60
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
        ${isBig ? 'border-2' : 'border-2'} overflow-hidden leading-none
    `;

    const iconSizeMap = {
        xs: 12,
        sm: 14,
        md: 18,
        lg: 20,
        xl: 22,
    };
    const iconSize = iconSizeMap[size as keyof typeof iconSizeMap] || 18;

    const renderContent = () => (
        <>
            {/* RAYAS DE PELIGRO (Look de PlayButton) */}
            {/* RAYAS DE PELIGRO (Solo en CTA Ready) para darle el look de "Púlsame" */}

            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_15px,rgba(0,0,0,0.3)_15px,rgba(0,0,0,0.3)_30px)]" />


            {/* TEXTURAS INTERNAS (Brillo superior tipo plástico/metal) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.3] bg-[linear-gradient(rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_100%)]" />


            {/* Brillo industrial superior */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.25] bg-[linear-gradient(rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_100%)]" />

            <span className={`relative z-10 flex items-center w-full ${Icon ? "justify-center" : "justify-center"} gap-2`}>
                {Icon && iconPosition === "left" && <span className='flex items-center justify-center pl-1.5'><Icon size={iconSize} className="shrink-0" /></span>}
                <span className="pt-[2px]">{children}</span>
                {Icon && iconPosition === "right" && <span className='flex items-center justify-center pr-1'><Icon size={iconSize} className="shrink-0" /></span>}
            </span>
        </>
    );

    const commonProps = {
        className: `${plungerBase} ${variantStyles[variant] || variantStyles.green} ${sizeClasses[size] || sizeClasses.md}`,
        style: { '--accent': accentColor } as React.CSSProperties,
        ...props,
    };

    return (
        <div className={socketClasses}>
            {/* El "Void" para profundidad */}
            <div className={`absolute ${isBig ? 'inset-[6px]' : 'inset-[3.5px]'} rounded-[8px] bg-(--bg-void) pointer-events-none`} />

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