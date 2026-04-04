import { LogicAssemblyBlock } from "@/types/game";
import { RefreshCcw } from "lucide-react";

interface StopButtonProps {
    isInteractionDisabled: boolean;
    program: LogicAssemblyBlock[];
    setProgram: (program: LogicAssemblyBlock[]) => void;
}
export function StopButton({ isInteractionDisabled, program, setProgram }: StopButtonProps) {
    const isDisabled = isInteractionDisabled || program.length === 0;

    return (
        <div className="w-[76px] h-[76px] shrink-0 relative group p-1.5 bg-[#080b0e] rounded-lg border border-[#1a222c] shadow-[0_4px_0_0_#030507]">
            {/* 1. Base del Socket */}
            <div className="absolute inset-1.5 rounded-md bg-(--bg-void) shadow-[inset_0_5px_10px_rgba(0,0,0,0.9)]" />

            {/* 2. EL BOTÓN FÍSICO */}
            <button
                onClick={() => !isInteractionDisabled && setProgram([])}
                disabled={isDisabled}
                className={`
                    relative w-full h-[60px] flex flex-col items-center justify-center
                    transition-all duration-150 overflow-hidden
                    rounded-md border-2
                    ${isDisabled
                        ? 'bg-(--bg-surface) border-(--border-color) opacity-60 grayscale translate-y-[2px] shadow-[0_6px_0_0_#0a0b0d,0_8px_10px_rgba(0,0,0,0.5)]'
                        : 'bg-[linear-gradient(180deg,#9c1619_0%,#54090b_100%)] border-(--red) cursor-pointer shadow-[0_6px_0_0_#2b0203,0_10px_20px_rgba(156,22,25,0.4)] hover:shadow-[0_6px_0_0_#2b0203,0_15px_30px_rgba(226,75,74,0.3)] hover:translate-y-px active:translate-y-[6px] active:shadow-[0_0px_0_0_transparent]'}
                `}
            >
                {/* RAYAS DE PELIGRO */}
                {!isDisabled && (
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.3)_10px,rgba(0,0,0,0.3)_20px)]" />
                )}

                {/* TEXTURAS INTERNAS */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.3] bg-[linear-gradient(rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_100%)]" />

                {/* ICONO CENTRAL */}
                <RefreshCcw
                    size={16}
                    className={`relative z-10 transition-transform duration-500 group-hover:-rotate-180
                        ${isDisabled ? 'text-(--text-ghost)' : 'text-(--red-light) drop-shadow-[0_0_8px_var(--red)]'}
                    `}
                />

                {/* TEXTO INFERIOR */}
                <span className={`mt-1 font-mono text-[10px] font-bold uppercase tracking-widest relative z-10 ${isDisabled ? 'text-(--text-ghost)' : 'text-(--red-light) drop-shadow-[0_0_5px_var(--red)]'}`}>
                    BORRAR
                </span>
            </button>
        </div>
    )
}