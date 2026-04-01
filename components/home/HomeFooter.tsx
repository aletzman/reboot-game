"use client";

import { Activity, ShieldCheck, Cpu } from "lucide-react";

export default function HomeFooter() {
    return (
        <footer className="w-full absolute bottom-0 z-50 flex items-center justify-between px-4 py-1.5 bg-(--bg-void) border-t border-(--border-color) shadow-[0_-4px_20px_rgba(0,0,0,0.8)] select-none">

            {/* Textura sutil para que no sea negro plano */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.01)_2px,rgba(255,255,255,0.01)_4px)] pointer-events-none" />

            {/* ─── IZQUIERDA: Estado del Sistema y Latencia ─── */}
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-(--green-base) rounded-full shadow-[0_0_5px_var(--green-base)]" />
                        <div className="absolute w-2.5 h-2.5 border border-(--green-base)/50 rounded-full animate-ping" />
                    </div>
                    <span className="text-[9px] font-mono font-black text-(--green-light) tracking-widest uppercase mt-0.5">
                        SYS_ONLINE
                    </span>
                </div>

                {/* Ping (Se oculta en móviles muy pequeños para ahorrar espacio) */}
                <div className="hidden sm:flex items-center gap-1.5 border-l border-(--border-muted-color) pl-3 md:pl-4">
                    <Activity size={10} className="text-(--text-ghost)" />
                    <span className="text-[8px] font-mono text-(--text-muted) tracking-widest mt-0.5">
                        PING: 12ms
                    </span>
                </div>
            </div>

            {/* ─── CENTRO: Hash / Identificador (Solo Desktop) ─── */}
            <div className="hidden md:flex items-center justify-center relative z-10 opacity-30">
                <span className="text-[7px] font-mono text-(--text-ghost) tracking-[0.3em] uppercase">
                    NET_NODE: 0x8F9A2B_SEC_00
                </span>
            </div>

            {/* ─── DERECHA: Hardware y Encriptación ─── */}
            <div className="flex items-center gap-3 md:gap-4 relative z-10">

                {/* Temperatura del núcleo (Solo en pantallas medianas+) */}
                <div className="hidden sm:flex items-center gap-1.5 pr-3 md:pr-4 border-r border-(--border-muted-color)">
                    <Cpu size={10} className="text-(--text-ghost)" />
                    <span className="text-[8px] font-mono text-(--text-muted) tracking-widest mt-0.5">
                        TEMP: 34°C
                    </span>
                </div>

                {/* Protocolo de Seguridad (Siempre visible) */}
                <div className="flex items-center gap-1.5" title="Protocolo de Seguridad: AES-256-GCM">
                    <ShieldCheck size={10} className="text-(--cyan) opacity-80" />
                    <span className="text-[9px] font-mono font-black text-(--cyan) tracking-widest mt-0.5">
                        AES-256
                    </span>
                </div>
            </div>
        </footer>
    );
}