"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Play } from "lucide-react";
import { getSave, deleteSave } from "@/lib/gameState";
import { getLevels } from "@/services/levelsService";
import { CommandButton } from "../ui/CommandButton";

export default function HeroButton() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [hasSave, setHasSave] = useState(false);
    const [saveInfo, setSaveInfo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 2300);

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

            if (save && save.progress[lastLevelId]?.completed) {
                const currentIndex = levels.findIndex((l) => l.id === lastLevelId);
                if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
                    lastLevelId = levels[currentIndex + 1].id;
                }
            }

            const targetLevel = levels.find(l => l.id === lastLevelId) || levels[0];
            const actId = targetLevel.act ?? 0;

            router.push(`/game/${actId}/level/${lastLevelId}`);
        } catch (err) {
            console.error("Error redirecting to level:", err);
            router.push("/game/0/level/P-00");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="transition-all duration-1000 ease-out flex flex-col items-center gap-4 w-full"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible
                    ? "translateY(0) scale(1)"
                    : "translateY(15px) scale(0.98)",
            }}
        >
            {/* ─── BOTÓN PRINCIPAL (Limpio y Directo) ─── */}
            <button
                onClick={() => router.push("/game")}
                className="group flex items-center justify-center gap-3 px-10 py-2.5 bg-(--green-base) hover:bg-(--green-light) text-[#050608] transition-all duration-300 active:scale-95 cursor-pointer rounded-sm shadow-[0_0_15px_rgba(85,226,0,0.2)] hover:shadow-[0_0_25px_rgba(85,226,0,0.4)]"
            >
                <Play size={18} className="fill-current opacity-90" />
                <span className="font-mono text-lg font-black tracking-widest uppercase mt-0.5">
                    {hasSave ? "CONTINUAR PARTIDA" : "NUEVA PARTIDA"}
                </span>
                <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5 opacity-90" strokeWidth={3} />
            </button>

            {/* ─── SECCIÓN INFERIOR (Light y minimalista) ─── */}
            {hasSave ? (
                <div className="flex flex-col items-center gap-2 mt-2">
                    {/* Info de guardado clara */}
                    <p className="text-xs font-sans text-(--text-muted) flex items-center gap-2">
                        Progreso guardado: <span className="text-(--green-light) font-semibold">Sector {saveInfo}</span>
                    </p>

                    {/* Acciones secundarias sin cajas ni fondos */}
                    <div className="flex items-center gap-4 mt-1">
                        <CommandButton
                            onClick={handleContinue}
                            disabled={isLoading}
                            size="xs"
                        >
                            {isLoading ? "Cargando..." : "Cargar nivel actual"}
                        </CommandButton>

                        <span className="text-(--border-color) text-[10px]">|</span>

                        <CommandButton
                            variant="danger"
                            size="xs"
                            onClick={() => {
                                if (confirm("¿Estás seguro de que quieres borrar tu progreso? Esta acción no se puede deshacer.")) {
                                    deleteSave();
                                    window.location.reload();
                                }
                            }}
                        >
                            Borrar partida
                        </CommandButton>
                    </div>
                </div>
            ) : (
                <p className="text-xs font-mono text-(--text-ghost) tracking-widest mt-2 opacity-60">
                    SISTEMA LISTO PARA INICIAR
                </p>
            )}
        </div>
    );
}