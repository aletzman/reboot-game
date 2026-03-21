"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function HeroButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 5500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="transition-all duration-1000 ease-out"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            }}
        >
            <Link
                href="/game"
                className="btn-glow group relative flex items-center gap-3 px-10 py-4 bg-(--green-base) text-(--bg-deep) text-lg font-bold font-mono rounded-xs transition-all duration-300 ease-in-out hover:bg-(--green-light) hover:scale-105 active:scale-95 cursor-pointer"
            >
                <span className="relative z-10 tracking-wider">DESPERTAR</span>
                <ChevronRight className="relative z-10 size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Texto debajo del botón */}
            <p className="text-center text-[10px] font-mono text-(--text-ghost) mt-3 tracking-widest">
                PRESS TO INITIALIZE PROTOCOL
            </p>
        </div>
    );
}
