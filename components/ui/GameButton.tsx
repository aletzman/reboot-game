
import React from "react";
import { Screw } from "./Screw";

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
    // Definimos el color base del acento
    const baseAccent = accentColor || "var(--green-light)";

    // Contenedor principal: El "Socket" (el marco hundido en el chasis)
    // p-[3px] o p-[6px] para acomodar tornillos si es grande
    const isAction = variant === 'action';
    const padding = isAction ? 'p-[6px]' : 'p-[3.5px]';
    const socketBase = `relative ${padding} bg-(--bg-void) rounded-md border border-[#1a222c] shadow-[0_1px_0_0_#030507] group @container ${className}`;

    // Estilos del "Plunger" (el botón físico que se hunde)
    const plungerBase = `
        relative w-full h-full flex items-center justify-center gap-2 
        font-mono uppercase tracking-[.1em] rounded-[4px] 
        transition-all duration-100 cursor-pointer select-none
        border overflow-hidden
    `;

    const variantStyles: Record<string, string> = {
        command: `
            text-[clamp(9px,18cqw,12px)] px-2 py-[8px] font-black
            bg-(--bg-surface)
            border-(--accent-color)/40
            text-(--accent-color)
            shadow-[0_4px_0_0_#05070a,inset_0_1px_1px_rgba(255,255,255,0.05)]
            hover:border-(--accent-color)/70
            hover:bg-(--bg-surface)
            hover:shadow-[0_3px_0_0_#041416,0_8px_18px_color-mix(in_srgb,var(--accent-color)_15%,transparent)]
            hover:brightness-110
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        action: `
            text-[clamp(11px,14cqw,15px)] px-6 py-3 font-black
            bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-color)_40%,black)_0%,color-mix(in_srgb,var(--accent-color)_15%,black)_100%)]
            border-color-mix(in_srgb,var(--accent-color)_60%,black)/60
            text-color-mix(in_srgb,var(--accent-color)_80%,white)
            shadow-[0_4.5px_0_0_color-mix(in_srgb,var(--accent-color)_20%,black),0_10px_20px_color-mix(in_srgb,var(--accent-color)_30%,transparent)]
            hover:shadow-[0_4.5px_0_0_color-mix(in_srgb,var(--accent-color)_20%,black),0_15px_30px_color-mix(in_srgb,var(--accent-color)_40%,transparent)]
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
        `,
        ghost: `
            text-[clamp(9px,12cqw,11px)] px-4 py-2
            bg-transparent border border-(--bg-hover)/20
            text-(--text-ghost)
            shadow-[0_1px_0_0_#05070a]
            hover:border-(--text-muted)/40 hover:text-(--text-primary)
            active:translate-y-[1px]
        `,
        danger: `
            text-[clamp(10px,12cqw,11px)] px-3 py-[6px] font-bold
            bg-[linear-gradient(180deg,#9c1619_0%,#54090b_100%)]
            border-(--red)/50
            text-(--red-light)
            shadow-[0_3.5px_0_0_#2b0203,0_6px_15px_rgba(156,22,25,0.3)]
            hover:border-(--red)/70 hover:text-(--red)
            active:translate-y-[3.5px] active:shadow-[0_0px_0_0_transparent]
        `,
    };

    const activeStyles = active
        ? "translate-y-[4px] shadow-[0_0_20px_color-mix(in_srgb,var(--accent-color)_40%,transparent)]! border-(--accent-color) text-(--bg-void) bg-(--accent-color)/40! brightness-110"
        : "";

    const disabledStyles = disabled
        ? `${!active ? "opacity-80 grayscale text-(--text-primary) translate-y-0!" : ""} cursor-not-allowed! hover:shadow-none! pointer-events-none!`
        : "";

    const dynamicStyle = {
        '--accent-color': baseAccent,
    } as React.CSSProperties;

    return (
        <div className={socketBase} style={dynamicStyle}>
            {/* El "Void" o cavidad interior (Efecto de profundidad extrema) */}
            <div className={`absolute inset-[${isAction ? '6px' : '3.5px'}] rounded-[4px] bg-(--bg-void) shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)] pointer-events-none`} />

            {/*tornillos de chasis (Solo si es action) */}
            {isAction && (
                <>
                    <Screw size="sm" corner="tl" className="opacity-40" />
                    <Screw size="sm" corner="tr" className="opacity-40" />
                    <Screw size="sm" corner="bl" className="opacity-40" />
                    <Screw size="sm" corner="br" className="opacity-40" />
                </>
            )}

            <button
                className={`${plungerBase} ${variantStyles[variant]} ${activeStyles} ${disabledStyles}`}
                disabled={disabled}
                {...props}
            >
                {/* RAYAS DE PELIGRO (Solo en Action) */}
                {variant === 'action' && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,1)_10px,rgba(255,255,255,1)_20px)]" />
                )}


                {/* Luz de estado lateral (Pestaña táctica) */}
                {(variant === 'command' || variant === 'action') && (
                    <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full transition-all duration-300 opacity-65 ${active ? 'opacity-100 scale-y-110' : 'group-hover:opacity-80 scale-y-100'}`}
                        style={{ backgroundColor: baseAccent, boxShadow: `0 0 ${active ? '8px' : '4px'} ${baseAccent}` }}
                    />
                )}

                {/* LED de instrumentación superior derecho */}
                {/*variant === 'command' && (
                    <div className="absolute top-[2px] right-[2px] flex flex-col items-center gap-[2px]">
                        <div
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active
                                ? 'shadow-[0_0_8px_var(--accent-color)]'
                                : 'bg-(--bg-void) border border-(--bg-hover)'
                                }`}
                            style={{ backgroundColor: active ? baseAccent : undefined }}
                        />
                        <div className="w-[10px] h-px bg-(--bg-hover)/40" />
                    </div>
                )*/}

                {icon && <span className="text-[14px] leading-none shrink-0 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110">{icon}</span>}
                {children && <span className="leading-none relative z-10 font-black drop-shadow-sm">{children}</span>}


            </button>
        </div>
    );
}
