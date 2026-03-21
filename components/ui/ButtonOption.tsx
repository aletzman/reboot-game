"use client";
interface ButtonOptionProps {
    text?: string;
    onClick: () => void;
    icon?: React.ReactNode;
    color?: "red" | "green" | "blue" | "yellow";
}

export default function ButtonOption({ text, onClick, icon, color }: ButtonOptionProps) {
    const colorMap = {
        red: "text-(--red)",
        green: "text-(--green-light)",
        blue: "text-(--blue)",
        yellow: "text-(--yellow)",
    };
    return (
        <button className={`text-xs font-medium font-mono text-(--text-muted) hover:${colorMap[color || "green"]} flex items-center gap-2 cursor-pointer transition-colors duration-200`} onClick={onClick}>{icon}{text}</button>
    );
}