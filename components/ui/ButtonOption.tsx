"use client";
interface ButtonOptionProps {
    text?: string;
    onClick: () => void;
    icon?: React.ReactNode;
    color?: "red" | "green" | "blue" | "yellow";
}

export default function ButtonOption({ text, onClick, icon, color }: ButtonOptionProps) {
    const colorMap = {
        red: "text-(--error-color)",
        green: "text-(--success-color)",
        blue: "text-(--info-color)",
        yellow: "text-(--warning-color)",
    };
    return (
        <button className={`text-xs font-medium font-mono text-(--muted) hover:${colorMap[color || "green"]} flex items-center gap-2 cursor-pointer transition-colors duration-200`} onClick={onClick}>{icon}{text}</button>
    );
}