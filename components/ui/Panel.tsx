import { getBorderClasses } from "@/lib/helpers";
import { BorderType } from "@/types/infrastructure";

interface PanelProps {
    id?: string;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    typePanel: 'aside' | 'main' | 'footer';
    border?: BorderType;
}

export function Panel({
    id,
    title,
    subtitle,
    children,
    className = "",
    typePanel,
    border = 'all'
}: PanelProps) {

    // 1. Lógica de mapeo de bordes
    const borders = getBorderClasses(border)

    const panelStyles = {
        aside: {
            container: "bg-[linear-gradient(180deg,#161A1F_0%,#090B0D_100%)] border-(--border-color) shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]",
            texture: "opacity-[0.35] bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[size:3px_100%]",
            glow: "hidden"
        },
        main: {
            container: "bg-(--bg-void) border-(--border-color) shadow-[inset_0_2px_30px_rgba(0,0,0,0.9)]",
            texture: "bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-size-[6px_6px]",
            glow: "bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.04)_0%,transparent_80%)]"
        },
        footer: {
            container: "bg-(--bg-deep) border-(--border-color)", // El borde se controla por la prop ahora
            texture: "opacity-[0.05] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-[size:3px_3px]",
            glow: "hidden"
        }
    };

    const currentStyle = panelStyles[typePanel];
    const Tag = typePanel === 'main' ? 'div' : typePanel;

    return (
        <Tag id={id} className={`relative 
                        ${currentStyle.container} 
                        ${borders} 
                        ${className}`}>

            {/* Capa de Textura Dinámica */}
            <div className={`absolute inset-0 pointer-events-none z-0 ${currentStyle.texture}`} />

            {/* Capa de Iluminación/Glow Dinámica */}
            <div className={`absolute inset-0 pointer-events-none z-0 ${currentStyle.glow}`} />

            {/* Bisel Interno (Solo se muestra si hay bordes activos para no verse raro) */}
            {border !== 'none' && (
                <div className="absolute inset-px border border-black/40 rounded-sm pointer-events-none z-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]" />
            )}

            <div className="relative z-10 flex flex-col gap-3 h-full">
                {(title || subtitle) && (
                    <header className="flex flex-col mb-1 shrink-0">
                        {subtitle && (
                            <span className="text-[7px] font-black text-(--amber) tracking-[0.3em] uppercase opacity-70">
                                {subtitle}
                            </span>
                        )}
                        {title && (
                            <span className="text-[10px] font-bold text-white/80 font-mono tracking-wider uppercase">
                                {title}
                            </span>
                        )}
                    </header>
                )}

                <div className="flex-1">
                    {children}
                </div>
            </div>
        </Tag>
    );
}