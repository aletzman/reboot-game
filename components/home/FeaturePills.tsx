"use client";

import { useEffect, useState } from "react";
import { Code, Globe, Zap } from "lucide-react";
import { Screw } from "../ui/Screw";

const features = [
    {
        icon: Code,
        label: "DOMINA LA LÓGICA",
        sublabel: "SYS.OVERRIDE_SKILL",
    },
    {
        icon: Globe,
        label: "RECONSTRUYE LA RED",
        sublabel: "NET.WORLD_REBUILD",
    },
    {
        icon: Zap,
        label: "ACTIVA EL GÉNESIS",
        sublabel: "OP.PROJECT_GENESIS",
    },
];

export default function FeaturePills() {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const baseDelay = 1500; // Después del typing de la terminal
        const timers = features.map((_, i) =>
            setTimeout(() => setVisibleCount(i + 1), baseDelay + i * 200)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full max-w-3xl flex flex-col md:flex-row items-stretch justify-center gap-3">
            {features.map((feat, i) => {
                const Icon = feat.icon;
                const isVisible = i < visibleCount;
                return (
                    <div
                        key={i}
                        className="relative flex-1 flex items-center gap-3 p-3 bg-(--bg-deep) border border-(--border-muted-color) rounded-[2px] transition-all duration-700 ease-out group hover:border-(--border-color) hover:bg-(--bg-elevated) shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(12px)",
                            transitionDelay: `${i * 100}ms`,
                        }}
                    >
                        {/* Ícono de módulo */}
                        <div className="flex items-center justify-center w-10 h-10 border border-(--border-muted-color) bg-black group-hover:border-(--green-base) transition-colors duration-300 rounded-[1px] shadow-[inset_0_0_5px_rgba(0,0,0,1)] shrink-0">
                            <Icon className="size-4 text-(--text-ghost) group-hover:text-(--green-light) transition-colors duration-300 drop-shadow-[0_0_2px_currentColor]" />
                        </div>

                        {/* Textos Tácticos */}
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-black font-mono text-(--text-muted) group-hover:text-white transition-colors duration-300 tracking-wider truncate">
                                {feat.label}
                            </span>
                            <span className="text-[8px] font-mono text-(--text-muted)/85 group-hover:text-(--green-muted) transition-colors tracking-[0.2em] truncate mt-0.5">
                                {feat.sublabel}
                            </span>
                        </div>
                        <Screw corner="br" size="sm" />
                        <Screw corner="tl" size="sm" />
                        <Screw corner="tr" size="sm" />
                        <Screw corner="bl" size="sm" />
                    </div>
                );
            })}
        </div>
    );
}