"use client";

import { useEffect, useState } from "react";

export default function SystemBootBar() {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("INITIALIZING...");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const stages = [
            { at: 10, text: "SCANNING NETWORK..." },
            { at: 25, text: "LOADING KERNEL MODULES..." },
            { at: 40, text: "DECRYPTING BROADCAST..." },
            { at: 60, text: "VERIFYING SURVIVOR DNA..." },
            { at: 80, text: "LOADING MISSION DATA..." },
            { at: 95, text: "SYSTEM READY" },
        ];

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    return 100;
                }
                const next = prev + Math.random() * 3 + 0.5;
                const capped = Math.min(next, 100);

                // Actualizar texto de estado
                for (let i = stages.length - 1; i >= 0; i--) {
                    if (capped >= stages[i].at) {
                        setStatusText(stages[i].text);
                        break;
                    }
                }

                return capped;
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-md flex flex-col gap-1.5 mt-4 mb-8">
            {/* Barra de progreso */}
            <div className="w-full h-1 bg-(--bg-elevated) overflow-hidden relative">
                <div
                    className="h-full transition-all duration-100 ease-linear"
                    style={{
                        width: `${progress}%`,
                        background: isComplete
                            ? "var(--green-light)"
                            : "linear-gradient(90deg, var(--green-dark), var(--green-base), var(--green-light))",
                        boxShadow: isComplete ? "0 0 8px var(--green-light)" : "0 0 4px var(--green-base)",
                    }}
                />
            </div>
            {/* Status text */}
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-(--green-muted) tracking-wider">
                    {statusText}
                </span>
                <span className="text-[9px] font-mono text-(--text-ghost) tabular-nums">
                    {Math.floor(progress)}%
                </span>
            </div>
        </div>
    );
}
