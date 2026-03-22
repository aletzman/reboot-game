"use client";
import { CirclePower, Settings } from "lucide-react";
import { ButtonOption } from "./ButtonOption";
import { AudioControls } from "./AudioControls";
import { BackgroundAudio } from "./BackgroundAudio";

interface HeaderProps {
    viewMenu?: boolean
}

export function Header({ viewMenu }: HeaderProps) {
    return (
        <header className="flex items-center justify-between p-2 bg-(--bg-surface) w-full relative z-10 border-b border-(--border-muted-color)">
            <BackgroundAudio src="/sounds/intro.mp3" />

            <div className="flex items-center gap-6">
                <h1 className="text-sm font-medium font-mono text-(--green-light)">REBOOT_SYS_V1.0</h1>
                {viewMenu && <nav>
                    <ul className="flex items-center gap-2">
                        <li>
                            <a href="#" className="text-xs font-medium font-mono text-(--text-muted) hover:text-(--green-light)">SYSTEM_MAP</a>
                        </li>
                        <li>
                            <a href="#" className="text-xs font-medium font-mono text-(--text-muted) hover:text-(--green-light)">INVENTORY</a>
                        </li>
                        <li>
                            <a href="#" className="text-xs font-medium font-mono text-(--text-muted) hover:text-(--green-light)">BIO_DATA</a>
                        </li>
                    </ul>
                </nav>}
            </div>

            <div className="flex items-center gap-4">
                <AudioControls />

                {viewMenu && <div className="flex items-center gap-2">
                    <ButtonOption onClick={() => { }} icon={<Settings className="size-5" />} color="blue" />
                    <ButtonOption onClick={() => { }} icon={<CirclePower className="size-5" />} color="red" />
                </div>}
            </div>
        </header>
    );
}