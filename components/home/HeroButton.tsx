"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getSave } from "@/lib/gameState";
import { getLevels } from "@/services/levelsService";

export default function HeroButton() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [hasSave, setHasSave] = useState(false);
    const [saveInfo, setSaveInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 5500);

        // detectar save existente
        const save = getSave();
        if (save) {
            setHasSave(true);
            setSaveInfo(save.currentLevelId ?? null);
        }

        return () => clearTimeout(timer);
    }, []);

    async function handleClick() {
        if (isLoading) return;
        
        const save = getSave();
        if (!save) {
            router.push("/level/P-00");
            return;
        }
        
        let lastLevel = save.currentLevelId ?? "P-00";

        // Si el nivel guardado ya está completado, ir al siguiente nivel
        if (save.progress[lastLevel]?.completed) {
            setIsLoading(true);
            try {
                const levels = await getLevels();
                const currentIndex = levels.findIndex((l) => l.id === lastLevel);
                if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
                    lastLevel = levels[currentIndex + 1].id;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        router.push(`/level/${lastLevel}`);
    }

    return (
        <div
            className="transition-all duration-1000 ease-out flex flex-col items-center gap-2"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible
                    ? "translateY(0) scale(1)"
                    : "translateY(20px) scale(0.95)",
            }}
        >
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="btn-glow group relative flex items-center gap-3 px-10 py-4 bg-(--green-base) text-(--bg-deep) text-lg font-bold font-mono rounded-xs transition-all duration-300 ease-in-out hover:bg-(--green-light) hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="relative z-10 tracking-wider">
                    {isLoading ? "CARGANDO..." : hasSave ? "CONTINUAR" : "DESPERTAR"}
                </span>
                <ChevronRight className={`relative z-10 size-5 transition-transform duration-300 ${!isLoading && 'group-hover:translate-x-1'}`} />
            </button>

            {/* Texto debajo del botón */}
            <p className="text-center text-[10px] font-mono text-(--text-ghost) tracking-widest">
                {hasSave && saveInfo
                    ? `// PARTIDA GUARDADA — ${saveInfo.toUpperCase()}`
                    : "PRESS TO INITIALIZE PROTOCOL"}
            </p>

            {/* Botón secundario — nueva partida si ya tiene save */}
            {hasSave && (
                <button
                    onClick={() => {
                        localStorage.removeItem("reboot_save");
                        router.push("/level/P-00");
                    }}
                    className="text-[10px] font-mono text-(--text-ghost) hover:text-(--text-muted) transition-colors mt-1 tracking-widest"
                >
                    [ nueva partida ]
                </button>
            )}
        </div>
    );
}