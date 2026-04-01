"use client";

interface ScrewProps {
    corner?: "tl" | "tr" | "bl" | "br";
    size?: "sm" | "md" | "lg";
    rotation?: number;
    className?: string;
}

export function Screw({ corner, size = "md", rotation, className = "" }: ScrewProps) {


    const sizeClasses = {
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
        lg: "w-3 h-3",
    };

    const slotSizes = {
        sm: "w-1",
        md: "w-1.5",
        lg: "w-2",
    };

    const cornerClasses = {
        tl: "absolute top-1 left-1",
        tr: "absolute top-1 right-1",
        bl: "absolute bottom-1 left-1",
        br: "absolute bottom-1 right-1",
    };

    const defaultRotations = {
        tl: 45,
        tr: -20,
        bl: 12,
        br: 85,
    };

    const appliedRotation = rotation !== undefined
        ? rotation
        : (corner ? defaultRotations[corner] : 0);

    return (
        <div
            className={`
                rounded-full bg-(--bg-void) border border-(--border-muted-color) flex items-center justify-center 
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] 
                ${corner ? cornerClasses[corner] : ""} 
                ${sizeClasses[size]} 
                ${className}
            `}
        >
            <div
                className={`h-px bg-(--text-ghost) ${slotSizes[size]}`}
                style={{ transform: `rotate(${appliedRotation}deg)` }}
            />
        </div>
    );
}