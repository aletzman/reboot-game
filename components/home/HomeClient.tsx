"use client";

import dynamic from "next/dynamic";

// Client components con animaciones
const MatrixRain = dynamic(() => import("@/components/home/MatrixRain"), { ssr: false });
const TerminalTyping = dynamic(() => import("@/components/home/TerminalTyping"), { ssr: false });
const DecryptText = dynamic(() => import("@/components/home/DecryptText"), { ssr: false });
const FeaturePills = dynamic(() => import("@/components/home/FeaturePills"), { ssr: false });
const SystemBootBar = dynamic(() => import("@/components/home/SystemBootBar"), { ssr: false });
const HeroButton = dynamic(() => import("@/components/home/HeroButton"), { ssr: false });

import Image from "next/image";
import Logo from "@/components/ui/Logo";
import { BackgroundAudio } from "@/components/ui/BackgroundAudio";

export default function HomeClient() {
    return (
        <>
            <BackgroundAudio src="/sounds/intro.mp3" />

            {/* Background layers */}
            <MatrixRain />
            <Image
                src="/images/background-init.webp"
                alt="Background"
                fill
                loading="eager"
                className="absolute inset-0 -z-1 opacity-5 object-cover"
            />

            {/* Logo con animación de entrada */}
            <div className="animate-fade-in-up mt-12 mb-4" style={{ animationDelay: "0.2s" }}>
                <Logo width={120} height={80} />
            </div>

            {/* Barra de boot del sistema */}
            <SystemBootBar />

            {/* Título principal con glitch */}
            <h1
                className="text-7xl sm:text-8xl font-bold font-(family-name:--font-title) text-(--green-light) glitch text-flicker"
                data-text="REBOOT_"
            >
                REBOOT_
            </h1>

            {/* Subtítulo con efecto de desencriptar */}
            <div className="mt-3 h-6">
                <DecryptText
                    text="EL MUNDO SE APAGÓ. TÚ LO VUELVES A ENCENDER."
                    className="text-sm font-medium font-mono text-(--cyan) text-balance max-w-md text-center"
                    speed={40}
                    delay={1200}
                />
            </div>

            {/* Separador con glow */}
            <div className="separator-glow w-full max-w-md mt-6 mb-8" />

            {/* Terminal de la historia con typing */}
            <div className="flex flex-col w-full max-w-md border border-(--border-muted-color) overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                {/* Barra de título de la terminal */}
                <div className="flex items-center justify-between px-3 py-2 bg-(--bg-elevated) border-b border-(--border-muted-color)">
                    <div className="flex items-center gap-2">
                        <span className="inline-block size-1.5 rounded-full bg-(--green-base) animate-pulse" />
                        <span className="text-[10px] font-mono text-(--green-muted)">[LOG://broadcast.sys]</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-(--red)/60">● REC</span>
                        <span className="text-[10px] font-mono text-(--text-ghost)">■ ENCRYPTED</span>
                    </div>
                </div>

                {/* Contenido de la terminal con typewriter */}
                <TerminalTyping
                    lines={[
                        { text: "Las máquinas se rebelaron." },
                        { text: "La humanidad desapareció en 11 minutos." },
                        { text: "Tú eres lo que queda.", highlight: true },
                    ]}
                    speed={30}
                    delayBetweenLines={500}
                />
            </div>

            {/* Separador con glow */}
            <div className="separator-glow w-full max-w-2xl mt-12 mb-8" />

            {/* Features con animación secuencial */}
            <FeaturePills />

            {/* Separador con glow */}
            <div className="separator-glow w-full max-w-md mt-10 mb-10" />

            {/* Botón CTA con glow */}
            <HeroButton />
        </>
    );
}
