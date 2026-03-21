"use client";

import { Volume2, VolumeX, Music, Zap } from "lucide-react";
import { useAudioStore } from "@/store/audio.store";
import { useEffect, useState } from "react";

export function AudioControls() {
    const { isMuted, setIsMuted, musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useAudioStore();
    const [mounted, setMounted] = useState(false);

    // Evitar errores de hidratación de zustand persist
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-[280px] h-[36px]" />; // Skeleton placeholder

    return (
        <div className="flex items-center gap-4 bg-(--bg-elevated) border border-(--border-muted-color) px-3 py-1.5 rounded-xs">
            {/* Botón de mute principal */}
            <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-(--green-muted) hover:text-(--green-light) transition-colors cursor-pointer"
                title={isMuted ? "Activar Audio" : "Silenciar Audio"}
            >
                {isMuted ? <VolumeX className="size-4 text-(--red)" /> : <Volume2 className="size-4" />}
            </button>

            {/* Separador */}
            <div className="w-px h-4 bg-(--border-muted-color)" />

            {/* Control BGM (Música) */}
            <div className="flex items-center gap-2 group" title="Volumen de Música">
                <Music className={`size-3 ${isMuted ? 'text-(--text-ghost)' : 'text-(--green-muted) group-hover:text-(--green-light)'} transition-colors`} />
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    disabled={isMuted}
                    className="w-16 h-1 bg-(--bg-deep) rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: "var(--green-light)", opacity: isMuted ? 0.3 : 1 }}
                />
            </div>
            
            {/* Control SFX (Efectos) */}
            <div className="flex items-center gap-2 group" title="Volumen de SFX">
                <Zap className={`size-3 ${isMuted ? 'text-(--text-ghost)' : 'text-(--cyan) opacity-70 group-hover:opacity-100'} transition-colors`} />
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    disabled={isMuted}
                    className="w-16 h-1 bg-(--bg-deep) rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: "var(--cyan)", opacity: isMuted ? 0.3 : 1 }}
                />
            </div>
        </div>
    );
}
