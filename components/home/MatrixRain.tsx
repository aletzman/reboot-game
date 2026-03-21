"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const chars = "01{}[]<>/*=+-;:.fnreturnifelseconstletvar";
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100);

        const draw = () => {
            ctx.fillStyle = "rgba(1, 1, 1, 0.06)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Gradiente de opacidad: más brillante al frente del "drop"
                const brightness = Math.random();
                if (brightness > 0.95) {
                    ctx.fillStyle = "rgba(85, 226, 0, 0.6)"; // green-light bright
                } else if (brightness > 0.8) {
                    ctx.fillStyle = "rgba(85, 226, 0, 0.25)";
                } else {
                    ctx.fillStyle = "rgba(45, 120, 0, 0.15)"; // green-base dim
                }

                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += 0.5;
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-2 pointer-events-none opacity-40"
            style={{ contain: "strict" }}
        />
    );
}
