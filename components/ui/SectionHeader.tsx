interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <header className="h-[71.5px] p-4 border-t border-(--border-color) border-b bg-(--bg-surface) flex items-center justify-between relative z-10 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">

            {/* =========================================
                TORNILLOS INDUSTRIALES (4 Esquinas)
                ========================================= */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-(--bg-void) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-px h-[3px] bg-(--border-color) rotate-45" />
            </div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-(--bg-void) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-px h-[3px] bg-(--border-color) -rotate-12" />
            </div>

            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-(--bg-void) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-px h-[3px] bg-(--border-color) rotate-90" />
            </div>
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-(--bg-void) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-px h-[3px] bg-(--border-color) rotate-45" />
            </div>

            {/* =========================================
                ÁREA DE TÍTULO (Grabado táctico)
                ========================================= */}
            <div className="flex items-center gap-3 ml-2 mt-0.5">
                {/* Barra de acento física */}
                <div className="w-1 h-6 bg-(--green-base) shadow-[0_0_8px_var(--green-base)] border-r border-black" />

                <div className="flex flex-col">
                    <span className="font-mono text-[13px] text-white tracking-[0.2em] uppercase font-black drop-shadow-[0_2px_2px_rgba(0,0,0,1)] leading-none">
                        {title}
                    </span>
                    {/* Sub-texto / "Decal" de inmersión */}
                    <span className="font-mono text-[8px] text-(--text-primary) opacity-60 tracking-[0.3em] uppercase mt-1 font-bold">
                        {subtitle}
                    </span>
                </div>
            </div>

        </header>
    )
}