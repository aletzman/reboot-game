import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "outline" | "solid" | "ghost" | "text";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    typeButton?: "button" | "link";
    href?: string;
    showSweep?: boolean;
}

export function Button({ 
    children, 
    variant = "solid", 
    size = "md", 
    typeButton = "button", 
    href, 
    showSweep,
    className = "",
    ...props 
}: ButtonProps) {
    const defaultSweep = variant === "solid";
    const sweepEnabled = showSweep ?? defaultSweep;

    const baseClasses = "relative group inline-flex items-center justify-center gap-2 rounded-[2px] font-semibold font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer overflow-hidden isolate";

    const variants = {
        outline: "bg-transparent border border-(--green-base) text-(--green-light) hover:bg-(--green-darkest) shadow-[0_0_15px_rgba(85,226,0,0.05)] hover:shadow-[0_0_25px_rgba(85,226,0,0.15)]",
        solid: "bg-(--green-dark) border border-(--green-base) text-(--green-light) shadow-[0_0_20px_rgba(85,226,0,0.15)] hover:bg-(--green-base) hover:shadow-[0_0_30px_rgba(85,226,0,0.35)]",
        ghost: "bg-transparent border border-transparent text-(--text-primary) hover:text-(--green-light) hover:bg-(--bg-hover)",
        text: "bg-transparent border border-transparent text-(--text-ghost) hover:text-(--text-muted) !px-0 shadow-none hover:shadow-none bg-none hover:bg-transparent",
    };

    const sizes = {
        xs: "px-3 py-1.5 text-[10px]",
        sm: "px-4 py-2 text-[11px]",
        md: "px-6 py-2.5 text-[13px]",
        lg: "px-8 py-3 text-[14px]",
        xl: "px-10 py-4 text-[16px]",
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    const renderSweep = () => (
        sweepEnabled && (
            <span
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(85,226,0,0.12), transparent)',
                    animation: 'sweep-glow 2.5s ease-in-out infinite',
                }}
            />
        )
    );

    if (typeButton === "link") {
        return (
            <Link href={href || "#"} className={combinedClasses} {...(props as any)}>
                {renderSweep()}
                <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            </Link>
        );
    }

    return (
        <button className={combinedClasses} {...props}>
            {renderSweep()}
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </button>
    );
}