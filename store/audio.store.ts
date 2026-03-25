import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AudioState {
    isMuted: boolean;
    setIsMuted: (isMuted: boolean) => void;
    musicVolume: number;
    setMusicVolume: (volume: number) => void;
    sfxVolume: number;
    setSfxVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            isMuted: false,
            setIsMuted: (isMuted) => set({ isMuted }),
            musicVolume: 0.05,
            setMusicVolume: (musicVolume) => set({ musicVolume }),
            sfxVolume: 0.4,
            setSfxVolume: (sfxVolume) => set({ sfxVolume }),
        }),
        {
            name: "reboot_audio_settings", // Llave en localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
