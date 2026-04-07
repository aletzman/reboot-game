import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    children: React.ReactNode;
    href?: string;
    icon?: LucideIcon | React.ElementType;
    iconPosition?: "left" | "right";
    colorTheme?: "green" | "amber" | "purple" | "cyan" | "blue";
    isActive?: boolean;
    tag?: string;
}

export function NavButton({
    children,
    href,
    icon: Icon,
    iconPosition = "left",
    colorTheme = "green",
    isActive = false,
    tag,
    className = "",
    disabled,
    ...props
}: NavButtonProps) {
    const isLink = !!href;



    const baseShadow = "shadow-[0_4px_0_0_#05070a,0_6px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]";
    const hoverShadow = "group-hover:shadow-[0_6px_0_0_#05070a,0_12px_24px_rgba(0,0,0,0.4)]";

    const accentColor: Record<string, string> = {
        green: "bg-(--green-light)",
        amber: "bg-(--amber)",
        purple: "bg-(--purple)",
        cyan: "bg-(--cyan)",
        blue: "bg-(--blue)",
        red: "bg-(--red)",
    };

    const shadowColor: Record<string, string> = {
        green: "shadow-[0_6px_0_0_#0b230033,0_15px_30px_rgba(126,213,38,0.3)]",
        cyan: "shadow-[0_6px_0_0_#00232333,0_15px_30px_rgba(16,185,129,0.3)]",
        red: "shadow-[0_6px_0_0_#23000033,0_15px_30px_rgba(220,53,69,0.3)]",
        amber: "shadow-[0_6px_0_0_#231b0033,0_15px_30px_rgba(255,193,7,0.3)]",
        blue: "shadow-[0_6px_0_0_#001a2333,0_15px_30px_rgba(59,130,246,0.3)]",
        purple: "shadow-[0_6px_0_0_#1a002333,0_15px_30px_rgba(147,51,234,0.3)]",
    };



    const themeStyles: Record<string, string> = {
        green: `
            bg-(--green-dark)
            border-(--green-base)/35 text-(--green-light)
            ${baseShadow} ${hoverShadow}
            hover:border-(--green-light)/50 hover:shadow-[0_6px_0_0_#0b230033,0_15px_30px_rgba(126,213,38,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_6px_0_0_#0b2300,0_15px_30px_rgba(126,213,38,0.3)]
            disabled:scale-98 disabled:shadow-[0_6px_0_0_#0b2300,0_15px_30px_rgba(126,213,38,0.3)]  
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
        purple: `
            bg-[color-mix(in_srgb,var(--purple)_60%,transparent_100%)]
            border-(--purple)/80 text-(--purple)
            ${baseShadow} ${hoverShadow}
            hover:border-(--purple)/60 hover:shadow-[0_6px_0_0_#1a002333,0_15px_30px_rgba(147,51,234,0.3)]
            hover:brightness-105
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
    };


    const renderContent = () => (
        <div className="group relative flex flex-col items-center justify-center w-full h-full outline-none">
            {/* Glow Ambiental Inferior */}
            <div
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-1/2 opacity-0 transition-opacity duration-300 blur-lg pointer-events-none rounded-full
                    ${isActive ? 'opacity-70' : 'group-hover:opacity-25'}
                `}
            />
            {/* Void depth */}
            <div className="absolute inset-[3.5px] rounded-[8px] bg-(--bg-void) pointer-events-none" />

            {/* Plunger (Comportamiento Button.tsx) */}
            <div className={`relative w-full h-full rounded-[6px] border-2 ${themeStyles[colorTheme]} transition-all duration-100 flex flex-col items-center justify-center overflow-hidden
                ${isActive
                    ? `scale-97 brightness-125 pointer-events-none ${shadowColor[colorTheme]}`
                    : `scale-100 brightness-50 opacity-85`}
            `}
            >

                {/* RAYAS DE PELIGRO */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_15px,rgba(0,0,0,0.3)_15px,rgba(0,0,0,0.3)_30px)]" />

                {/* Brillo industrial superior */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.3] bg-[linear-gradient(rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_100%)]" />

                {/* Luz de estado lateral */}
                <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-full transition-all duration-300 
                        ${isActive ? `opacity-100 scale-y-100 ${accentColor[colorTheme]}` : `${accentColor[colorTheme]} opacity-60 group-hover:opacity-100 group-hover:scale-y-110`}
                    `}
                />

                <div className={`relative z-20 flex flex-col items-center pt-1 transition-all duration-200 ${isActive ? 'scale-90' : 'group-hover:scale-100'}`}>
                    {Icon && (
                        <div className={`transition-all duration-300`}
                        >
                            <Icon size={20} />
                        </div>
                    )}

                    <span className={`hidden sm:block text-[11px] font-mono font-black tracking-wider mt-1 transition-colors duration-300
                        text-(--text-primary)
                    `}>
                        {children}
                    </span>
                </div>
            </div>
        </div>
    );

    const socketClasses = `
        relative inline-flex h-[52px] w-[54px] sm:w-[94px] p-[3.5px] bg-[#080b0e] rounded-md border border-[#1a222c] 
        group ${className}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
    `;

    if (isLink) {
        return (
            <Link href={href!} className={socketClasses} {...(props as any)}>
                {renderContent()}
            </Link>
        );
    }

    return (
        <button className={socketClasses} disabled={disabled} {...(props as any)}>
            {renderContent()}
        </button>
    );
}
