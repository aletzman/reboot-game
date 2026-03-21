"use client";
import { CirclePower, Settings } from "lucide-react";
import ButtonOption from "./ButtonOption";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-2 bg-(--bg-surface) w-full">
            <h1 className="text-sm font-medium font-mono text-(--green-light)">SURVIVAL_TERMINAL_V1.0</h1>
            <nav>
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
            </nav>
            <div className="flex items-center gap-2">
                <ButtonOption onClick={() => { }} icon={<Settings className="size-5" />} color="blue" />
                <ButtonOption onClick={() => { }} icon={<CirclePower className="size-5" />} color="red" />
            </div>
        </header>
    );
}