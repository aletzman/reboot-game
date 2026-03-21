"use client";

import { useEffect, useRef, useState } from "react";

export function BackgroundAudio({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Función que intenta reproducir el audio
        const playAudio = () => {
            audio.play().catch(error => console.log("Audio bloqueado:", error));
            setHasInteracted(true);
        };

        // Escuchamos el primer clic, toque o tecla en toda la página
        const handleInteraction = () => {
            if (!hasInteracted) {
                playAudio();
            }
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        window.addEventListener("touchstart", handleInteraction);

        // Limpiamos los eventos cuando el componente se desmonta o el audio ya arrancó
        if (hasInteracted) {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
        }

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
        };
    }, [hasInteracted]);

    return (
        <audio
            ref={audioRef}
            src={src}
            loop
            preload="auto"
            className="hidden"
        />
    );
}
