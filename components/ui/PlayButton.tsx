import { Play, Power, Activity } from "lucide-react";

interface PlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    lengthProgram: number;
    isInteractionDisabled: boolean;
    feedback: 'idle' | 'correct' | 'wrong';
    isExecuting: boolean;
}

export function PlayButton({ onClick, lengthProgram, isInteractionDisabled, feedback, isExecuting, ...props }: PlayButtonProps) {
    const isProgramEmpty = lengthProgram === 0;
    const isDisabled = isProgramEmpty || isInteractionDisabled;

    const getBtnState = () => {
        if (isExecuting) return 'executing';
        if (feedback === 'correct') return 'correct';
        if (feedback === 'wrong') return 'wrong';
        if (isDisabled) return 'disabled';
        return 'ready';
    };

    const state = getBtnState();

    // Sistema de estilos para un CTA (Call to Action) muy evidente y "clickeable"
    const stateStyles = {
        disabled: {
            bg: 'bg-(--bg-surface)',
            shadow: 'shadow-[0_6px_0_0_#0a0b0d,0_8px_10px_rgba(0,0,0,0.5)]',
            text: 'text-(--text-ghost)',
            border: 'border-(--border-color)',
            iconBg: 'bg-(--bg-void) border border-(--border-muted-color) text-(--text-ghost)',
            led: 'bg-(--text-ghost)',
            sideLight: 'bg-(--text-ghost)/20'
        },
        ready: {
            bg: 'bg-(--green-dark)',
            shadow: 'shadow-[0_6px_0_0_#0b2300,0_10px_25px_rgba(45,120,0,0.4)] hover:shadow-[0_6px_0_0_#0b2300,0_15px_30px_rgba(126,213,38,0.3)]',
            text: 'text-(--green-light) [text-shadow:0_0_10px_var(--green-base)]',
            border: 'border-(--green-base)',
            iconBg: 'bg-[var(--green-light)] text-[var(--green-dark)] shadow-[0_0_15px_var(--green-base)]',
            led: 'bg-[var(--green-light)] shadow-[0_0_8px_var(--green-light)]',
            sideLight: 'bg-(--green-light) shadow-[0_0_10px_var(--green-base)]'
        },
        executing: {
            bg: 'bg-[#3d270b]',
            shadow: 'shadow-[0_6px_0_0_#1a1003,0_10px_20px_rgba(239,159,39,0.3)]',
            text: 'text-(--amber) [text-shadow:0_0_15px_var(--amber)]',
            border: 'border-(--amber)',
            iconBg: 'bg-[var(--amber)] text-[#3d270b] shadow-[0_0_15px_var(--amber)]',
            led: 'bg-[var(--amber)] shadow-[0_0_8px_var(--amber)]',
            sideLight: 'bg-(--amber) shadow-[0_0_10px_var(--amber)]'
        },
        correct: {
            bg: 'bg-[var(--green-base)]',
            shadow: 'shadow-[0_6px_0_0_#0b2300,0_10px_20px_rgba(45,120,0,0.4)]',
            text: 'text-[var(--bg-void)]',
            border: 'border-(--green-light)',
            iconBg: 'bg-[var(--bg-void)] text-[var(--green-light)]',
            led: 'bg-[var(--bg-void)]',
            sideLight: 'bg-(--green-light)'
        },
        wrong: {
            bg: 'bg-(--red-dark)',
            shadow: 'shadow-[0_6px_0_0_#2b0707,0_10px_20px_rgba(226,75,74,0.4)]',
            text: 'text-(--red-light)',
            border: 'border-(--red)',
            iconBg: 'bg-[var(--red-light)] text-[var(--red-dark)]',
            led: 'bg-[var(--red-light)] shadow-[0_0_8px_var(--red-light)]',
            sideLight: 'bg-(--red-light) shadow-[0_0_10px_var(--red-light)]'
        }
    };

    const currentStyle = stateStyles[state];

    const getStatusText = () => {
        if (state === 'executing') return 'Ejecutando...';
        if (state === 'correct') return 'Sincronizado';
        if (state === 'wrong') return 'Fallo Crítico';
        if (state === 'disabled') return isProgramEmpty ? 'Sistema Offline' : 'En Espera...';
        return 'INICIAR SECUENCIA';
    };

    return (
        <div className="w-full h-[76px] relative group p-1.5 bg-[#080b0e] rounded-lg border border-[#1a222c] shadow-[0_4px_0_0_#030507]">
            {/* 1. Base del Socket (el agujero donde entra el botón) */}
            <div className="absolute inset-1.5 rounded-md bg-(--bg-void) shadow-[inset_0_5px_10px_rgba(0,0,0,0.9)]" />

            {/* 2. EL BOTÓN FÍSICO CTA */}
            <button
                onClick={onClick}
                disabled={isDisabled}
                className={`
                    relative w-full h-[60px] flex items-center justify-between px-5 
                    transition-all duration-150 overflow-hidden
                    rounded-md border-2 ${currentStyle.border}
                    ${isDisabled ? 'opacity-60 grayscale translate-y-[2px]' : 'cursor-pointer active:translate-y-[6px] hover:translate-y-px'}
                    
                    /* CTA BACKGROUND and BIG SHADOW */
                    ${currentStyle.bg}
                    ${currentStyle.shadow}
                    active:shadow-[0_0px_0_0_transparent]
                `}
                {...props}
            >
                {/* RAYAS DE PELIGRO (Solo en CTA Ready) para darle el look de "Púlsame" */}
                {state === 'ready' && (
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_15px,rgba(0,0,0,0.3)_15px,rgba(0,0,0,0.3)_30px)]" />
                )}

                {/* TEXTURAS INTERNAS (Brillo superior tipo plástico/metal) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.3] bg-[linear-gradient(rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.3)_100%)]" />

                {/* 3. LUZ DE ESTADO LATERAL (PESTAÑA) */}
                <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-1/2 rounded-r-full transition-all duration-300 ${currentStyle.sideLight}`}
                />

                {/* 4. CONTENIDO: INSTRUMENTACIÓN */}
                <div className="flex flex-col items-start gap-0 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center w-3 h-3">
                            {state === 'ready' && (
                                <div className="absolute inset-0 animate-ping rounded-full opacity-60 bg-(--green-light)" />
                            )}
                            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentStyle.led}`} />
                        </div>
                        <span className={`font-mono text-[9px] font-bold uppercase tracking-widest opacity-80 ${currentStyle.text}`}>
                            IO_{state === 'disabled' ? 'STBY' : 'LINKED'}
                        </span>
                    </div>

                    <span
                        className={`font-mono text-sm md:text-xl font-black uppercase tracking-[0.15em] transition-all duration-300 ${currentStyle.text}`}
                    >
                        {getStatusText()}
                    </span>
                </div>

                {/* 5. ICONO DEL GATILLO (ACTION BLOCK) - Alto contraste */}
                <div className={`
                    relative w-11 h-11 flex items-center justify-center rounded-sm transition-all duration-300
                    ${currentStyle.iconBg}
                `}>
                    {state === 'executing' ? (
                        <Activity size={22} className="animate-[pulse_1s_infinite]" />
                    ) : state === 'correct' ? (
                        <Power size={22} />
                    ) : (
                        <Play size={22} fill="currentColor" className={state !== 'disabled' ? "ml-1" : ""} />
                    )}
                </div>
            </button>
        </div>
    );
}