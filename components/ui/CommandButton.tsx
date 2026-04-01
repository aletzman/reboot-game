"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CommandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "danger" | "success" | "warning" | "info" | "ghost";
    size?: "xs" | "sm" | "md" | "lg";
    typeButton?: "button" | "link";
    href?: string;
    icon?: LucideIcon | React.ElementType;
    iconPosition?: "left" | "right";
}

export function CommandButton({
    children,
    size = "sm",
    typeButton = "button",
    href,
    icon: Icon,
    iconPosition = "left",
    className = "",
    disabled,
    variant = "ghost",
    ...props
}: CommandButtonProps) {

    // 1. Clases Base (Cambiado a font-mono y ajustes de transición)
    const baseClasses = "relative group inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer overflow-hidden leading-none select-none";

    // 2. Tamaños Reales (Sin scale, puro padding y text-size)
    const sizes = {
        xs: "px-3 py-1.5 text-[9px]",
        sm: "px-4 py-2 text-[10px]",
        md: "px-6 py-2.5 text-[12px]",
        lg: "px-8 py-3 text-[14px]",
    };

    const iconSizes = {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
    };

    const disabledClasses = disabled ? "opacity-30 cursor-not-allowed grayscale pointer-events-none" : "";

    // 3. Paleta Táctica (Colores de borde, texto y hover)
    const variants = {
        danger: "border-x border-(--red)/50 text-(--red) hover:bg-(--red)/10 hover:border-(--red) hover:shadow-[0_0_10px_rgba(226,75,74,0.2)]",
        success: "border-x border-(--green-base)/50 text-(--green-light) hover:bg-(--green-base)/10 hover:border-(--green-base) hover:shadow-[0_0_10px_rgba(85,226,0,0.2)]",
        warning: "border-x border-(--amber)/50 text-(--amber) hover:bg-(--amber)/10 hover:border-(--amber) hover:shadow-[0_0_10px_rgba(239,159,39,0.2)]",
        info: "border-x border-(--cyan)/50 text-(--cyan) hover:bg-(--cyan)/10 hover:border-(--cyan) hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]",
        ghost: "border-x border-(--border-muted-color) text-(--text-ghost) hover:text-(--text-primary) hover:bg-white/5 hover:border-(--border-color)",
    };

    const combinedClasses = `${baseClasses} ${sizes[size]} ${variants[variant]} ${disabledClasses} ${className}`;

    // 4. Colores para las esquinas dinámicas
    const bgClasses = {
        danger: "bg-(--red)",
        success: "bg-(--green-base)",
        warning: "bg-(--amber)",
        info: "bg-(--cyan)",
        ghost: "bg-(--border-color)",
    };

    // 5. Esquinas animadas (¡El toque maestro!)
    const renderLines = () => (
        <>
            <div className={`absolute top-0 left-0 w-1.5 h-px transition-all duration-300 group-hover:w-3 ${bgClasses[variant]}`} />
            <div className={`absolute bottom-0 left-0 w-1.5 h-px transition-all duration-300 group-hover:w-3 ${bgClasses[variant]}`} />
            <div className={`absolute top-0 right-0 w-1.5 h-px transition-all duration-300 group-hover:w-3 ${bgClasses[variant]}`} />
            <div className={`absolute bottom-0 right-0 w-1.5 h-px transition-all duration-300 group-hover:w-3 ${bgClasses[variant]}`} />
        </>
    );

    const renderContent = () => (
        <span className="relative z-10 flex items-center justify-center gap-2 w-full text-center mt-[2px]">
            {Icon && iconPosition === "left" && <Icon size={iconSizes[size]} className="shrink-0 transition-transform group-hover:scale-110" />}
            <span className="font-bold drop-shadow-sm">{children}</span>
            {Icon && iconPosition === "right" && <Icon size={iconSizes[size]} className="shrink-0 transition-transform group-hover:scale-110" />}
        </span>
    );

    return (
        <>
            {typeButton === "link" ? (
                <Link href={href || "#"} className={combinedClasses} {...(props as any)}>
                    {renderLines()}
                    {renderContent()}
                </Link>
            ) : (
                <button className={combinedClasses} disabled={disabled} {...props}>
                    {renderLines()}
                    {renderContent()}
                </button>
            )}
        </>
    );
}