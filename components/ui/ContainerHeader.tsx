interface ContainerHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function ContainerHeader({ children, className }: ContainerHeaderProps) {
    return (
        <div className={`relative  bg-(--bg-deep) ${className}`}>
            {/* Textura de agarre metálico (Grip) */}
            <div className="absolute inset-[6px] opacity-[0.15] bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] pointer-events-none group-hover/act:opacity-30 transition-opacity" />

            {/* Bisel interno para dar profundidad de botón físico presionado */}
            <div className="absolute inset-[6px] border-t border-l border-b border-r border-white/5 rounded-bl-sm rounded-tl-sm shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] pointer-events-none" />
            {children}
        </div>
    )
}