import { useState } from "react";
import { CONNECTION_COLORS } from "../types";

interface MatchItemProps {
    id: string;
    text: string;
    isSelected?: boolean;
    isConnected?: boolean;
    isConnectedTo?: boolean;
    isCorrect?: boolean;
    isWrong?: boolean;
    isRight?: boolean;
    isHinted?: boolean;
    selectedLeft?: boolean;
    relationColor?: string | null;
    onClick: () => void;
}

export function MatchItem(props: MatchItemProps) {
    const { id, text, isSelected, isConnected, isCorrect, isWrong, onClick, isRight, selectedLeft, isConnectedTo, relationColor, isHinted } = props;
    const [isHovered, setIsHovered] = useState(false);

    // Estado consolidado para las funciones de ayuda
    const itemState = { ...props, isHovered };

    return (
        <div
            id={id}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={getItemClasses(itemState)}
        >
            {/* Capas de Feedback Visual */}
            {isHinted && <div className="absolute inset-0 bg-(--purple)/10 animate-pulse pointer-events-none" />}
            {isSelected && <div className="absolute inset-0 bg-(--bg-hover) opacity-10 animate-pulse pointer-events-none" />}

            <span className={`relative z-10 w-full text-[13px] font-sans tracking-tight ${isRight ? 'text-right pr-8' : 'pl-8'}`}>
                {text}
            </span>

            {/* El LED de hardware (Punto de conexión) */}
            <HardwareLed colors={getLedColors(itemState)} isRight={isRight} />

            {/* Detalles Estéticos Estilo Hardware */}
            <div className="absolute inset-[4px] border border-black/40 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] pointer-events-none" />
            <div className="absolute inset-[4px] rounded-sm opacity-[0.05] bg-[linear-gradient(45deg,transparent_45%,#fff_50%,transparent_55%)] bg-size-[3px_3px] pointer-events-none" />
        </div>
    );
}

// --- LÓGICA DE ESTILOS (Tailwind) ---
const getItemClasses = (state: any) => {
    const { isCorrect, isSelected, isHinted, isWrong, isConnected, isConnectedTo, isRight, selectedLeft } = state;

    const base = "group rounded-sm px-4 py-3 flex items-center justify-between gap-3 transition-all duration-200 select-none border relative overflow-hidden h-12";

    // Cursor y Opacidad según contexto
    const interactive = (isRight && !selectedLeft && !isConnectedTo)
        ? 'cursor-default opacity-40'
        : 'cursor-pointer active:scale-[0.98]';

    // Temas de Color
    let theme = 'border-[#1a1f26] bg-(--bg-deep) text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-primary)';

    if (isCorrect) theme = 'bg-(--green-darkest)/50 border-(--green-base) text-(--green-light) shadow-[0_0_15px_rgba(45,120,0,0.1)]';
    else if (isWrong) theme = 'bg-red-950/30 border-(--red) text-(--red)';
    else if (isSelected) theme = 'bg-(--bg-elevated) border-(--text-primary)/30 text-(--text-primary) shadow-[0_0_10px_rgba(255,255,255,0.05)]';
    else if (isHinted) theme = 'bg-(--purple)/10 border-(--purple) text-(--purple)';
    else if (isConnected || isConnectedTo) theme = 'bg-(--bg-elevated) border-(--bg-hover) text-(--text-primary)';
    else if (isRight && selectedLeft) theme = 'bg-(--bg-hover) border-(--green-muted)/30 text-(--text-primary) animate-pulse';

    return `${base} ${interactive} ${theme}`;
};

// --- LÓGICA DEL LED (Coordinación de colores) ---
const getLedColors = (state: any) => {
    const { isCorrect, isWrong, isConnected, isConnectedTo, isSelected, isHovered, relationColor } = state;

    if (isCorrect) return { color: '#22c55e', pulse: true };
    if (isWrong) return { color: '#ef4444', pulse: true };

    // Si está conectado, usa el color de la línea
    if (isConnected || isConnectedTo) return { color: relationColor || '#fff', pulse: false };

    // Si el usuario tiene algo seleccionado y pasa el mouse sobre un posible objetivo
    if (isHovered) return { color: '#ffffff', pulse: false };

    if (isSelected) return { color: '#ffffff', pulse: true };

    return { color: '#27272a', pulse: false }; // Apagado (Zinc-800)
};

function HardwareLed({ colors, isRight }: { colors: { color: string; pulse: boolean }, isRight?: boolean }) {
    const isOff = colors.color === '#27272a';

    return (
        <div id="led" className={`absolute top-1/2 -translate-y-1/2 z-30 ${isRight ? 'left-3' : 'right-3'}`}>
            {/* Carcasa del LED */}
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center border border-white/5 shadow-inner">
                {/* Lente del LED */}
                <div
                    style={{
                        backgroundColor: colors.color,
                        boxShadow: isOff ? 'none' : `0 0 8px ${colors.color}aa, 0 0 2px ${colors.color}`
                    }}
                    className={`
                        w-2 h-2 rounded-full transition-all duration-300 relative
                        ${colors.pulse ? 'animate-pulse' : ''}
                        ${isOff ? 'opacity-30' : 'opacity-100'}
                    `}
                >
                    {/* Reflejo de cristal */}
                    {!isOff && (
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/60 rounded-full" />
                    )}
                </div>
            </div>
        </div>
    );
}