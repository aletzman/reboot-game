"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getSave, deleteSave } from "@/lib/gameState";
import { getLevels } from "@/services/levelsService";

export default function HeroButton() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [hasSave, setHasSave] = useState(false);
    const [saveInfo, setSaveInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 2300);

        // detectar save existente
        const save = getSave();
        if (save) {
            setHasSave(true);
            setSaveInfo(save.currentLevelId ?? null);
        }

        return () => clearTimeout(timer);
    }, []);

    async function handleContinue() {
        if (isLoading) return;

        const save = getSave();
        let lastLevelId = save?.currentLevelId ?? "P-00";

        setIsLoading(true);
        try {
            const levels = await getLevels();

            // Si el nivel guardado ya está completado, ir al siguiente nivel
            if (save && save.progress[lastLevelId]?.completed) {
                const currentIndex = levels.findIndex((l) => l.id === lastLevelId);
                if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
                    lastLevelId = levels[currentIndex + 1].id;
                }
            }

            // Buscar el nivel para obtener su acto
            const targetLevel = levels.find(l => l.id === lastLevelId) || levels[0];
            const actId = targetLevel.act ?? 0;

            router.push(`/game/${actId}/level/${lastLevelId}`);
        } catch (err) {
            console.error("Error redirecting to level:", err);
            // Fallback en caso de error: ir al nivel P-00 en acto 0
            router.push("/game/0/level/P-00");
        } finally {
            setIsLoading(false);
        }
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
            {/* Botón Primario: Siempre al mapa (o despertar si no hay save) */}
            <button
                onClick={() => router.push("/game")}
                className="btn-glow group relative flex items-center gap-3 px-10 py-4 bg-(--green-base) text-(--bg-deep) text-lg font-bold font-mono rounded-xs transition-all duration-300 ease-in-out hover:bg-(--green-light) hover:scale-105 active:scale-95 cursor-pointer"
            >
                <span className="relative z-10 tracking-wider">
                    {hasSave ? "ENTRAR AL JUEGO" : "DESPERTAR"}
                </span>
                <ChevronRight className={`relative z-10 size-5 transition-transform duration-300 group-hover:translate-x-1`} />
            </button>

            {/* Texto debajo del botón */}
            <p className="text-center text-[10px] font-mono text-(--text-ghost) tracking-widest mt-1">
                {hasSave && saveInfo
                    ? `// PARTIDA GUARDADA — ${saveInfo.toUpperCase()}`
                    : "PRESS TO INITIALIZE PROTOCOL"}
            </p>

            {/* Botón secundario — continuar partida si ya tiene save */}
            {hasSave && (
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={handleContinue}
                        disabled={isLoading}
                        className="text-[10px] font-mono text-(--green-muted) hover:text-(--green-light) transition-colors tracking-widest flex items-center gap-1"
                    >
                        [ {isLoading ? "CARGANDO..." : "continuar partida"} ]
                    </button>
                    <button
                        onClick={() => {
                            if (confirm("¿Estás seguro de que quieres borrar tu progreso? Esta acción no se puede deshacer.")) {
                                deleteSave();
                                window.location.reload();
                            }
                        }}
                        className="text-[10px] font-mono text-(--red)/50 hover:text-(--red) transition-colors tracking-widest"
                    >
                        [ reset ]
                    </button>
                </div>
            )}
        </div>
    );
}