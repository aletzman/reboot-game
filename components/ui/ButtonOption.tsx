"use client";
interface ButtonOptionProps {
    text?: string;
    onClick: () => void;
    icon?: React.ReactNode;
    color?: "red" | "green" | "blue" | "yellow";
}

export function ButtonOption({ text, onClick, icon, color }: ButtonOptionProps) {
    const colorMap = {
        red: "hover:text-(--red)",
        green: "hover:text-(--green-light)",
        blue: "hover:text-(--blue)",
        yellow: "hover:text-(--yellow)",
    };
    return (
        <button className={`text-xs font-medium font-mono text-(--text-muted) ${colorMap[color || "green"]} flex items-center gap-2 cursor-pointer transition-colors duration-200`} onClick={onClick}>{icon}{text}</button>
    );
}