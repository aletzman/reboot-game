"use client";

import { useEffect, useRef, useState } from "react";

interface DecryptTextProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
}

const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>{}[]=/\\|";

export default function DecryptText({ text, className = "", speed = 50, delay = 1500 }: DecryptTextProps) {
    const [displayText, setDisplayText] = useState<string>("");
    const [started, setStarted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const startTimeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) {
            // Antes de iniciar, mostrar caracteres aleatorios la misma longitud
            setDisplayText(
                text.split("").map((c) => (c === " " ? " " : glitchChars[Math.floor(Math.random() * glitchChars.length)])).join("")
            );
            return;
        }

        let resolvedCount = 0;
        const length = text.length;

        intervalRef.current = setInterval(() => {
            resolvedCount++;
            const result = text.split("").map((char, i) => {
                if (char === " ") return " ";
                if (i < resolvedCount) return char;
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }).join("");

            setDisplayText(result);

            if (resolvedCount >= length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        }, speed);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [started, text, speed]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
}
