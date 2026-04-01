"use client";

import { CirclePower, Settings, User, Star, ShieldAlert } from "lucide-react";
import { ButtonOption } from "./ButtonOption";
import { AudioControls } from "./AudioControls";
import { BackgroundAudio } from "./BackgroundAudio";
import { AuthButton } from "./AuthButton";
import { getSave, getTotalStars } from "@/lib/gameState";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDemoStore } from "@/lib/store/useDemoStore";

interface HeaderProps {
    viewMenu?: boolean;
    showStats?: boolean;
}

export function Header({ viewMenu, showStats }: HeaderProps) {
    const [stats, setStats] = useState<{ name: string; stars: number } | null>(null);
    const { demoMode, toggleDemoMode: _toggleDemoMode } = useDemoStore();

    const toggleDemoMode = () => {
        _toggleDemoMode();
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }

    useEffect(() => {
        if (showStats) {
            const save = getSave();
            if (save) {
                setStats({
                    name: save.player.name,
                    stars: getTotalStars()
                });
            }
        }
    }, [showStats]);

    return (
        <header className="fixed top-0 left-0 flex items-center justify-between h-(--header-height) px-4 bg-[#0a0c0f] border-b border-(--border-color) w-full z-9999 shadow-[0_4px_20px_rgba(0,0,0,0.8)] select-none">
            {/* ─── CINTA DE PELIGRO SUPERIOR (Slim) ─── */}
            <div className="absolute top-0 left-0 w-full h-0.75 bg-[repeating-linear-gradient(45deg,var(--amber),var(--amber)_8px,#000_8px,#000_16px)] opacity-40 z-30" />

            {/* Textura sutil de panel de hardware */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.02] pointer-events-none" />

            <BackgroundAudio src="/sounds/intro.mp3" />

            {/* ─── SECCIÓN IZQUIERDA: Marca y Navegación ─── */}
            <div className="flex items-center gap-4 relative z-10 h-full">

                {/* Logo de Sistema */}
                <Link href="/" className="flex items-center gap-3 group mr-2">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-3 h-3 border border-(--green-light)/30 rounded-full animate-[ping_3s_linear_infinite]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-(--green-light) shadow-[0_0_8px_var(--green-light)]" />
                    </div>
                    <h1 className="text-xs md:text-sm font-black font-mono text-white tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] flex items-baseline">
                        REBOOT<span className="text-(--green-base)">_SYS</span><span className="hidden sm:inline text-(--text-ghost) text-[9px] ml-1 tracking-tighter">V1.0</span>
                    </h1>
                </Link>

                <div className="w-px h-1/2 bg-(--border-color)" />

                {/* Botón Override (Demo Mode) */}
                <button
                    onClick={toggleDemoMode}
                    className={`group relative flex items-center gap-2 cursor-pointer px-3 py-1 border transition-all duration-300 overflow-hidden rounded-sm ${demoMode
                        ? "bg-(--amber) border-(--amber) text-black shadow-[0_0_15px_rgba(239,159,39,0.2)]"
                        : "bg-black/40 border-(--border-color) text-(--text-ghost) hover:border-(--amber)/50 hover:text-(--amber)"
                        }`}
                    title="OVERRIDE: Bypass de seguridad activado"
                >
                    {/* Cinta de peligro si está activo */}
                    {demoMode && <div className="absolute inset-0 opacity-[0.15] bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#000_4px,#000_8px)] pointer-events-none" />}

                    {demoMode ? (
                        <ShieldAlert size={12} className="relative z-10 animate-pulse" />
                    ) : (
                        <div className="w-1 h-1 rounded-full bg-(--text-ghost) relative z-10" />
                    )}

                    <span className="text-[12px] font-mono font-semibold not-first: uppercase relative z-10 hidden sm:block">
                        {demoMode ? "DEMO_MODE_ON" : "DEMO_MODE_OFF"}
                    </span>
                </button>

                {/* Navegación Táctica */}
                {viewMenu && (
                    <nav className="hidden lg:block ml-4 h-full">
                        <ul className="flex items-center gap-1 h-full">
                            {[
                                { name: 'MAPA_SISTEMA', href: '/game' },
                                { name: 'COLECCIÓN', href: '/game/collection' },
                                { name: 'BIO_DATA', href: '#' }
                            ].map(item => (
                                <li key={item.name} className="h-full">
                                    <Link
                                        href={item.href}
                                        className="h-full flex items-center px-4 text-[10px] font-bold font-mono text-(--text-ghost) hover:text-(--green-light) hover:bg-(--green-base)/10 transition-all tracking-[0.2em] uppercase border-b-2 border-transparent hover:border-(--green-light)"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>

            {/* ─── SECCIÓN DERECHA: Telemetría y Controles ─── */}
            <div className="flex items-center gap-4 relative z-10 h-full">

                {/* ID del Operador (Display LCD) */}
                {showStats && stats && (
                    <div className="hidden md:flex items-center bg-[#050608] border border-(--border-color) shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] px-3 py-1 gap-4 mr-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] text-(--text-ghost) uppercase tracking-widest font-bold">OP::</span>
                            <span className="text-[10px] font-mono text-(--green-muted) font-black uppercase drop-shadow-[0_0_2px_currentColor]">{stats.name}</span>
                        </div>
                        <div className="w-px h-3 bg-(--border-color)" />
                        <div className="flex items-center gap-1.5" title="Fragmentos Recuperados">
                            <Star size={10} className="text-(--amber) fill-(--amber) drop-shadow-[0_0_5px_var(--amber)]" />
                            <span className="text-[11px] font-mono font-black text-(--amber) tabular-nums">{stats.stars}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {/* Controles del sistema integrados */}
                    <div className="flex items-center rounded-sm shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] p-0.5">
                        <AudioControls />
                        <div className="w-px h-4 bg-(--border-color) mx-1" />
                        <AuthButton />
                    </div>

                    {/* Botones de acción crítica */}
                    {viewMenu && (
                        <div className="flex items-center gap-2 pl-2 border-l border-(--border-color)">
                            <ButtonOption onClick={() => { }} icon={<Settings className="size-4" />} color="blue" />
                            <ButtonOption onClick={() => { }} icon={<CirclePower className="size-4" />} color="red" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}