"use client";

import { Volume2, VolumeX, Music, Zap } from "lucide-react";
import { useAudioStore } from "@/store/audio.store";
import { useEffect, useState } from "react";

export function AudioControls() {
    const { isMuted, setIsMuted, musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useAudioStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-[220px] h-[32px] bg-(--bg-surface) border border-(--border-muted-color) rounded-sm animate-pulse" />;

    return (
        <div className="flex items-center gap-3 bg-(--bg-surface) border border-(--border-muted-color) px-3 py-1.5 rounded-sm h-[32px]">
            {/* Mute */}
            <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-(--text-muted) hover:text-(--white) transition-colors cursor-pointer shrink-0"
            >
                {isMuted ? <VolumeX size={16} className="text-(--red)" /> : <Volume2 size={16} />}
            </button>

            <div className="w-px h-4 bg-(--border-color)" />

            {/* BGM */}
            <div className="flex items-center gap-2" title="Música">
                <Music size={12} className={isMuted ? 'text-(--text-ghost)' : 'text-(--green-muted)'} />
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    disabled={isMuted}
                    className="w-16 h-1 bg-(--bg-hover) rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "var(--green-light)", opacity: isMuted ? 0.3 : 1 }}
                />
            </div>

            {/* SFX */}
            <div className="flex items-center gap-2" title="Efectos">
                <Zap size={12} className={isMuted ? 'text-(--text-ghost)' : 'text-(--cyan)'} />
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    disabled={isMuted}
                    className="w-16 h-1 bg-(--bg-hover) rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "var(--cyan)", opacity: isMuted ? 0.3 : 1 }}
                />
            </div>
        </div>
    );
}