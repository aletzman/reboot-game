'use client'

import React from 'react'

interface TacticalHeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    color?: 'red' | 'cyan' | 'amber' | 'green' | 'purple' | 'blue';
    icon?: React.ReactNode;
}

export function TacticalHeaderButton({
    children,
    color = 'cyan',
    icon,
    className = '',
    ...props
}: TacticalHeaderButtonProps) {
    const colorMap = {
        red: 'var(--red)',
        cyan: 'var(--cyan)',
        amber: 'var(--amber)',
        green: 'var(--green-light)',
        purple: 'var(--purple)',
        blue: 'var(--blue)',
    }

    const accent = colorMap[color]

    return (
        <button
            className={`
                group relative
                h-5 px-3
                flex items-center gap-1.5
                bg-(--bg-void) border border-(--border-color)
                hover:border-(--border-color)
                active:scale-98
                transition-all duration-75
                uppercase font-mono text-[9px] font-black tracking-widest
                overflow-hidden cursor-pointer
                ${className}
            `}
            style={{ color: accent, '--accent': accent } as any}
            {...props}
        >
            {/* Indicador de estado pequeño */}
            <div
                className="w-1 h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accent, boxShadow: `0 0 4px ${accent}` }}
            />

            <span className="relative z-10 leading-none pt-px">
                {children}
            </span>

            {icon && <span className="opacity-70 group-hover:opacity-100">{icon}</span>}

            {/* Brillo industrial */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-white/5 to-transparent opacity-50" />

            {/* Glow al hover */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: accent }}
            />
        </button>
    )
}
