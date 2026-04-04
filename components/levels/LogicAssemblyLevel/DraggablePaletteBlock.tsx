import { useDraggable } from '@dnd-kit/react'
import { Cpu, Lock } from 'lucide-react'
import { BlockDef } from './types'
import { MODULES_REGISTERS } from './constants';
import { Screw } from '@/components/ui/Screw';

export function DraggablePaletteBlock({ def, disabled, maxReached, onClick }: { def: BlockDef, disabled: boolean, maxReached: boolean, onClick: () => void }) {
    const { ref, isDragging } = useDraggable({
        id: `palette-${def.type}`,
        data: { type: def.type, isNew: true },
        disabled: disabled || maxReached
    })

    const isDisabled = disabled || maxReached;

    return (
        <button
            ref={ref}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                group relative flex items-center min-h-[46px] w-full text-left transition-all duration-150
                cursor-grab overflow-hidden touch-none select-none rounded-[3px] overflow-x-hidden
                border-t border-l border-b border-r-[3px] border-[#050608] 
                ${isDragging ? 'opacity-50 scale-95 shadow-none' : ''} 
                ${isDisabled
                    ? 'cursor-not-allowed opacity-60 grayscale bg-[#0A0C0F] border-t-[#050608] border-l-[#050608] border-b-[#1A1D24] border-r-[#1A1D24]' // Se invierte el bisel, parece un hueco
                    : 'block-item opacity-85 hover:opacity-100 hover:-translate-x-px   active:scale-[0.98] active:shadow-none active:translate-y-0 active:translate-x-0'
                }
            `}
        >
            {/* 1. INDICADOR DE COLOR (Resina incrustada) */}
            <div
                className={`w-[5px] absolute left-0 top-0 bottom-0 border-r border-[#050608] transition-all 
                    ${isDisabled ? 'grayscale opacity-20' : 'shadow-[inset_-1px_0_3px_rgba(0,0,0,0.4)]'}`
                }
                style={{ backgroundColor: def.border }}
            />

            {/* 2. PLACA DE AGARRE EN MINIATURA (Adiós GripVertical genérico) */}
            <div className={` absolute left-0 top-0 bottom-0
                w-6 ml-[5px] h-full 
                border-r border-[#363D4C] bg-(--surface-2) 
                flex flex-col items-center justify-center gap-[3px] py-1 
                ${isDisabled ? 'opacity-30' : ''}
            `}>
                <div className="w-1 h-1 rounded-full bg-(--text-muted)/60" />
                <div className="flex flex-col gap-1 opacity-20">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-4 h-px bg-(--text-muted)" />
                    ))}
                </div>
                <div className="w-1 h-1 rounded-full bg-(--text-muted)/60 shadow-[0_0_5px_rgba(255,255,255,0.1)]" />

            </div>

            {/* 3. CONTENIDO DEL BLOQUE (Desplazado para hacer espacio a la placa) */}
            <div className="flex flex-col flex-1 pointer-events-none  relative z-10 label-panel ml-[34px] max-w-[70px]  rounded-xs">
                <span
                    className="uppercase label-text text-[11px]"
                    style={{ color: isDisabled ? '#4A5568' : def.border }}
                >
                    {def.label}
                </span>
                <span className="font-mono text-[10px] text-(--text-muted) font-bold">
                    <span className="opacity-80">ID:</span> {MODULES_REGISTERS[def.type]}
                </span>
            </div>

            {/* 4. ÍCONOS DE ESTADO (Módulos de Hardware LED) */}
            <div className="absolute right-0 pr-3 transition-opacity pointer-events-none flex items-center justify-center z-10">
                {isDisabled ? (
                    // Estado Candado: Pantalla hundida con luz roja de emergencia
                    <div className="bg-[#050608] p-1 rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,1)] border-b border-r border-[#2D3340]">
                        <Lock size={12} className="text-[#B34054] opacity-80" />
                    </div>
                ) : (
                    // Estado CPU: Un LED verde se enciende al pasar el mouse
                    <div className="bg-[#050608] px-0.5 py-0.5 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,1)] border-b border-r border-[#363D4C] flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-all duration-300">



                        {/* EL DIODO LED FÍSICO */}
                        <div
                            className="w-1.5 h-1.5 rounded-full transition-all duration-300 
        /* ESTADO APAGADO (Verde pantano oscuro, sombra hacia adentro simulando el cristal) */
        bg-[#1A331A] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] 
        
        /* ESTADO ENCENDIDO (Fósforo brillante + Resplandor + Reflejo de luz en el cristal) */
        group-hover:bg-[#33FF33] 
        group-hover:shadow-[0_0_8px_rgba(51,255,51,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                        />

                    </div>
                )}
            </div>

            {/* 5. EFECTO: CINTA DE PELIGRO (Si está agotado) */}
            {isDisabled && (
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#fff_4px,#fff_8px)] pointer-events-none" />
            )}
        </button>
    )
}