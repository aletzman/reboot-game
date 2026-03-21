"use client";

import { useEffect, useState } from "react";

interface TerminalTypingProps {
    lines: {
        text: string;
        highlight?: boolean;
    }[];
    speed?: number;
    delayBetweenLines?: number;
}

export default function TerminalTyping({ lines, speed = 35, delayBetweenLines = 600 }: TerminalTypingProps) {
    const [visibleLines, setVisibleLines] = useState<number>(0);
    const [currentText, setCurrentText] = useState<string>("");
    const [isTypingDone, setIsTypingDone] = useState(false);

    useEffect(() => {
        if (visibleLines >= lines.length) {
            setIsTypingDone(true);
            return;
        }

        const fullText = lines[visibleLines].text;
        let charIndex = 0;

        const typingInterval = setInterval(() => {
            charIndex++;
            setCurrentText(fullText.slice(0, charIndex));
            if (charIndex >= fullText.length) {
                clearInterval(typingInterval);
                setTimeout(() => {
                    setVisibleLines((prev) => prev + 1);
                    setCurrentText("");
                }, delayBetweenLines);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [visibleLines, lines, speed, delayBetweenLines]);

    return (
        <div className="flex flex-col gap-1 bg-(--bg-deep) p-4 font-mono text-sm">
            {/* Líneas ya completadas (sin la última cuando typing está completo) */}
            {lines.slice(0, isTypingDone ? lines.length - 1 : visibleLines).map((line, i) => (
                <p
                    key={i}
                    className={`${line.highlight ? "text-(--green-light) font-semibold" : "text-(--text-muted)"} transition-opacity duration-300`}
                >
                    <span className="text-(--green-muted) mr-2">&gt;</span>
                    {line.text}
                </p>
            ))}

            {/* Línea que se está escribiendo */}
            {!isTypingDone && visibleLines < lines.length && (
                <p className={`${lines[visibleLines].highlight ? "text-(--green-light) font-semibold" : "text-(--text-muted)"}`}>
                    <span className="text-(--green-muted) mr-2">&gt;</span>
                    {currentText}
                    <span className="inline-block w-2 h-4 bg-(--green-light) ml-0.5 animate-cursor align-middle" />
                </p>
            )}

            {/* Última línea con cursor final parpadeante */}
            {isTypingDone && (
                <p className="text-(--green-light) font-semibold">
                    <span className="text-(--green-muted) mr-2">&gt;</span>
                    {lines[lines.length - 1]?.text}
                    <span className="inline-block w-2 h-4 bg-(--green-light) ml-0.5 animate-cursor align-middle" />
                </p>
            )}
        </div>
    );
}
