"use client";

import { CirclePower, Settings, User, Star } from "lucide-react";
import { ButtonOption } from "./ButtonOption";
import { AudioControls } from "./AudioControls";
import { BackgroundAudio } from "./BackgroundAudio";
import { getSave, getTotalStars } from "@/lib/gameState";
import { useEffect, useState } from "react";
import Link from "next/link";

interface HeaderProps {
    viewMenu?: boolean;
    showStats?: boolean;
}

export function Header({ viewMenu, showStats }: HeaderProps) {
    const [stats, setStats] = useState<{ name: string; stars: number } | null>(null);

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
        <header className="flex items-center justify-between p-2 px-4 bg-(--bg-surface) w-full relative z-10 border-b border-(--bg-hover)">
            <BackgroundAudio src="/sounds/intro.mp3" />

            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-2 h-2 rounded-full bg-(--green-light) group-hover:animate-ping" />
                    <h1 className="text-sm font-bold font-mono text-(--green-light) tracking-tighter">REBOOT_SYS_V1.0</h1>
                </Link>

                {viewMenu && (
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-6">
                            <li>
                                <Link href="/game" className="text-[10px] font-bold font-mono text-(--text-muted) hover:text-(--green-light) transition-colors tracking-widest uppercase">MAPA_SISTEMA</Link>
                            </li>
                            <li>
                                <Link href="/game/collection" className="text-[10px] font-bold font-mono text-(--text-muted) hover:text-(--green-light) transition-colors tracking-widest uppercase">COLECCIÓN</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-[10px] font-bold font-mono text-(--text-muted) hover:text-(--green-light) transition-colors tracking-widest uppercase">BIO_DATA</Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>

            <div className="flex items-center gap-6">
                {showStats && stats && (
                    <div className="hidden sm:flex items-center gap-4 px-3 py-1 bg-(--bg-void) border border-(--bg-hover) rounded-sm">
                        <div className="flex items-center gap-2">
                            <User size={12} className="text-(--green-muted)" />
                            <span className="text-[10px] font-mono text-(--text-primary) uppercase">{stats.name}</span>
                        </div>
                        <div className="w-px h-3 bg-(--bg-hover)" />
                        <div className="flex items-center gap-2">
                            <Star size={12} className="text-(--amber) fill-(--amber)" />
                            <span className="text-[10px] font-mono text-(--amber)">{stats.stars}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <AudioControls />

                    {viewMenu && (
                        <div className="flex items-center gap-2">
                            <ButtonOption onClick={() => { }} icon={<Settings className="size-4" />} color="blue" />
                            <ButtonOption onClick={() => { }} icon={<CirclePower className="size-4" />} color="red" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}