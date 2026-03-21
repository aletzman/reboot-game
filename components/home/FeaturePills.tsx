"use client";

import { useEffect, useState } from "react";
import { Code, Globe, Zap } from "lucide-react";

const features = [
    {
        icon: Code,
        label: "Aprende a programar",
        sublabel: "SKILL_ACQUISITION",
    },
    {
        icon: Globe,
        label: "Reconstruye el mundo",
        sublabel: "WORLD_REBUILD",
    },
    {
        icon: Zap,
        label: "Activa el proyecto génesis",
        sublabel: "PROJECT_GENESIS",
    },
];

export default function FeaturePills() {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const baseDelay = 4000; // después del typing de la terminal
        const timers = features.map((_, i) =>
            setTimeout(() => setVisibleCount(i + 1), baseDelay + i * 400)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {features.map((feat, i) => {
                const Icon = feat.icon;
                const isVisible = i < visibleCount;
                return (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 border border-(--border-muted-color) bg-(--bg-elevated)/50 backdrop-blur-sm transition-all duration-700 ease-out group hover:border-(--green-dark) hover:bg-(--bg-hover)"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(12px)",
                            transitionDelay: `${i * 100}ms`,
                        }}
                    >
                        <div className="flex items-center justify-center w-8 h-8 border border-(--green-dark) bg-(--green-darkest) group-hover:border-(--green-base) transition-colors duration-300">
                            <Icon className="size-4 text-(--green-base) group-hover:text-(--green-light) transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium font-mono text-(--text-muted) group-hover:text-(--text-primary) transition-colors duration-300">{feat.label}</span>
                            <span className="text-[9px] font-mono text-(--text-ghost) tracking-widest">{feat.sublabel}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
