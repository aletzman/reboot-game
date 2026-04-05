"use client";

import { Volume2, VolumeX, Music, Zap } from "lucide-react";
import { useAudioStore } from "@/store/audio.store";
import { useEffect, useState } from "react";
import { Screw } from "./Screw";

export function AudioControls() {
    const { isMuted, setIsMuted, musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useAudioStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-[240px] h-[32px] bg-(--bg-deep) border border-white/5 rounded-sm animate-pulse opacity-40" />;

    return (
        <div className="flex items-center gap-4 bg-[#0a0c10] border border-white/10 px-3 h-[32px] rounded-xs shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative group/audio">
            {/* Detalles del chasis */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[4px_4px]" />

            {/* ─── SECCIÓN MUTE (Interruptor Físico) ─── */}
            <div className={`flex items-center pr-3 border-r border-white/10 h-5 my-auto transition-opacity duration-300 ${isMuted ? 'opacity-80' : 'opacity-100'}`}>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? "SISTEMA SILENCIADO" : "SILENCIAR SISTEMA"}
                    className={`
                        w-8 h-5 rounded-xs transition-all duration-75 flex items-center justify-center cursor-pointer relative overflow-hidden group/mute
                        border border-white/10
                        /* FÍSICA DEL BOTÓN: Hundido si está muteado, sobresaliente si no */
                        ${isMuted
                            ? 'bg-[#150505] border-t-black border-b-white/5 shadow-[inset_0_2px_6px_rgba(0,0,0,1)] translate-y'
                            : 'bg-[#1a1c20] border-t-white/10 border-b-2 border-b-black shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:bg-[#252830]'}
                    `}
                >
                    {/* Icono */}
                    {isMuted ? (
                        <VolumeX size={12} className="text-(--red) drop-shadow-[0_0_5px_var(--red)] relative z-10" />
                    ) : (
                        <Volume2 size={12} className="text-(--text-muted)/80 group-hover/mute:text-(--text-muted) relative z-10 transition-colors" />
                    )}

                    {/* LED indicador integrado en el botón */}
                    <div className={`absolute top-1 right-1 w-[2px] h-[2px] rounded-full transition-all
                        ${isMuted ? 'bg-(--red) shadow-[0_0_6px_var(--red)]' : 'bg-(--green-light) '}`}
                    />
                </button>
            </div>

            {/* ─── CANALES DE AUDIO ─── */}
            <div className="flex items-center gap-6">
                {/* BGM Canal */}
                <div className="flex items-center gap-2 group/bgm" title="CANAL: MÚSICA">
                    <div className="flex flex-col items-center">
                        <Music size={11} className={isMuted ? 'text-white/5' : 'text-(--green-muted) drop-shadow-[0_0_3px_rgba(126,213,38,0.2)]'} />
                        <span className="text-[10px] font-mono font-black text-(--text-muted)/80 uppercase">MUS</span>
                    </div>
                    <div className="relative flex items-center w-20 h-5">
                        <div className="absolute inset-x-0 h-1.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)] border border-white/5 pointer-events-none" />

                        <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                            disabled={isMuted}
                            className={`
                                relative w-full h-full appearance-none bg-transparent cursor-pointer z-10
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-[10px]
                                [&::-webkit-slider-thumb]:h-[18px]
                                [&::-webkit-slider-thumb]:rounded-[1px]
                                [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/10
                                [&::-webkit-slider-thumb]:border-b-2 [&::-webkit-slider-thumb]:border-b-black
                                [&::-webkit-slider-thumb]:shadow-[0_4px_6px_rgba(0,0,0,0.8)]
                                
                                /* 1. LOS DOS FONDOS (La línea y el metal) */
                                [&::-webkit-slider-thumb]:bg-[linear-gradient(to_right,transparent_40%,var(--led)_40%,var(--led)_60%,transparent_60%),linear-gradient(to_bottom,#3a3a3a_0%,#1a1a1a_100%)]

                                /* 2. EL TRUCO: La línea al 70% de alto, el metal al 100% */
                                [&::-webkit-slider-thumb]:bg-size-[100%_70%,100%_100%]

                                /* 3. CENTRAMOS AMBOS FONDOS Y EVITAMOS QUE SE REPITAN */
                                [&::-webkit-slider-thumb]:bg-center
                                [&::-webkit-slider-thumb]:bg-no-repeat
                                ${isMuted ? 'pointer-events-none grayscale' : 'opacity-100 group-hover/bgm:brightness-110 active:brightness-125'}
                            `}
                            style={{ '--led': isMuted ? 'transparent' : 'var(--green-light)' } as any}
                        />
                    </div>
                </div>

                {/* SFX Canal */}
                <div className="flex items-center gap-2 group/sfx" title="CANAL: EFECTOS">
                    <div className="flex flex-col items-center">
                        <Zap size={11} className={isMuted ? 'text-white/5' : 'text-(--cyan) drop-shadow-[0_0_3px_rgba(25,200,212,0.2)]'} />
                        <span className="text-[10px] font-mono font-black text-(--text-muted)/80 uppercase">SFX</span>
                    </div>
                    <div className="relative flex items-center w-20 h-5">
                        <div className="absolute inset-x-0 h-1.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)] border border-white/5 pointer-events-none" />

                        <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={sfxVolume}
                            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                            disabled={isMuted}
                            className={`
                                relative w-full h-full appearance-none bg-transparent cursor-pointer z-10
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-[10px]
                                [&::-webkit-slider-thumb]:h-[18px]
                                [&::-webkit-slider-thumb]:rounded-[1px]
                                [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/10
                                [&::-webkit-slider-thumb]:border-b-2 [&::-webkit-slider-thumb]:border-b-black
                                [&::-webkit-slider-thumb]:shadow-[0_4px_6px_rgba(0,0,0,0.8)]
                                
                        /* 1. LOS DOS FONDOS (La línea y el metal) */
                        [&::-webkit-slider-thumb]:bg-[linear-gradient(to_right,transparent_40%,var(--led)_40%,var(--led)_60%,transparent_60%),linear-gradient(to_bottom,#3a3a3a_0%,#1a1a1a_100%)]

                        /* 2. EL TRUCO: La línea al 70% de alto, el metal al 100% */
                        [&::-webkit-slider-thumb]:bg-size-[100%_70%,100%_100%]

                        /* 3. CENTRAMOS AMBOS FONDOS Y EVITAMOS QUE SE REPITAN */
                        [&::-webkit-slider-thumb]:bg-center
                        [&::-webkit-slider-thumb]:bg-no-repeat
                                
                                ${isMuted ? 'pointer-events-none grayscale' : 'group-hover/sfx:brightness-110 active:brightness-125'}
                            `}
                            style={{ '--led': isMuted ? 'transparent' : 'var(--cyan)' } as any}
                        />
                    </div>
                </div>
            </div>

            {/* Decoración de hardware */}
            <div className="ml-auto hidden sm:flex items-center opacity-100 border-l border-(--border-color)/80 pl-2 h-4">
                <Screw size="sm" rotation={-45} />
            </div>

        </div>
    );
}