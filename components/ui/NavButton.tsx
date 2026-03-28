import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    href?: string;
    icon?: LucideIcon | React.ElementType;
    iconPosition?: "left" | "right";
    colorTheme?: "green" | "amber" | "purple" | "cyan";
}

export function NavButton({
    children,
    href,
    icon: Icon,
    iconPosition = "left",
    colorTheme = "green",
    className = "",
    disabled,
    ...props
}: NavButtonProps) {
    const isLink = !!href;
    
    // Map de colores temáticos para dar soporte a las diferentes secciones (Objects = amber, Cards = green, etc.)
    const themeHoverColors: Record<string, string> = {
        green: "hover:text-(--green-light) hover:border-(--green-base)/50",
        amber: "hover:text-(--amber) hover:border-(--amber)/50",
        purple: "hover:text-(--purple) hover:border-(--purple)/50",
        cyan: "hover:text-(--cyan) hover:border-(--cyan)/50",
    }
    
    const baseClasses = `group inline-flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-(--text-muted) bg-[#0a0f14] px-4 py-2 border border-[#1a2636] rounded-xs shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none' : themeHoverColors[colorTheme] || themeHoverColors.green} ${className}`;

    const renderContent = () => (
        <>
            {Icon && iconPosition === "left" && (
                <Icon size={16} className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
            )}
            <span className="mt-[2px] block">{children}</span>
            {Icon && iconPosition === "right" && (
                <Icon size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            )}
        </>
    );

    if (isLink) {
        return (
            <Link href={href!} className={baseClasses} {...(props as any)}>
                {renderContent()}
            </Link>
        );
    }

    return (
        <button className={baseClasses} disabled={disabled} {...props}>
            {renderContent()}
        </button>
    );
}
