import { useDraggable } from '@dnd-kit/react'
import { Cpu, Lock } from 'lucide-react'
import { BlockDef } from './types'

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
                cursor-grab overflow-hidden touch-none select-none rounded-[2px]
                
                /* BISELADO ASIMÉTRICO (Igual que el cartucho principal) */
                border-t border-l border-b-2 border-r-[3px] border-[#050608]
                
                ${isDragging ? 'opacity-50 scale-95 shadow-none' : ''}
                
                /* ESTADOS FÍSICOS: Reposo, Hover y Agotado */
                ${isDisabled
                    ? 'cursor-not-allowed opacity-60 grayscale bg-[#0A0C0F] shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] border-t-[#050608] border-l-[#050608] border-b-[#1A1D24] border-r-[#1A1D24]' // Se invierte el bisel, parece un hueco
                    : 'bg-[#1A1D24] shadow-[3px_3px_0_rgba(0,0,0,0.6)] hover:bg-[#1F242D] hover:-translate-y-px hover:-translate-x-px hover:shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:scale-[0.98] active:shadow-none active:translate-y-0 active:translate-x-0'
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
            <div className={`
                w-6 ml-[5px] h-full absolute left-0 top-0 bottom-0
                border-r border-[#363D4C] bg-[#12141A] 
                flex flex-col items-center justify-center gap-[3px] py-1 
                ${isDisabled ? 'opacity-30' : ''}
            `}>
                {/* Estrías físicas en lugar del ícono */}
                <div className="h-[2px] w-3.5 bg-[#050608] border-b border-[#363D4C]" />
                <div className="h-[2px] w-3.5 bg-[#050608] border-b border-[#363D4C]" />
                <div className="h-[2px] w-3.5 bg-[#050608] border-b border-[#363D4C]" />
            </div>

            {/* 3. CONTENIDO DEL BLOQUE (Desplazado para hacer espacio a la placa) */}
            <div className="flex flex-col flex-1 pl-[42px] py-2 pointer-events-none relative z-10">
                <span
                    className="font-black tracking-[0.15em] text-[11px] uppercase leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)] transition-colors"
                    style={{ color: isDisabled ? '#4A5568' : def.border }}
                >
                    {def.label}
                </span>
                <span className="font-mono text-[8px] text-(--text-muted) mt-1 uppercase font-bold opacity-60 tracking-widest">
                    MOD::{def.type}
                </span>
            </div>

            {/* 4. ÍCONOS DE ESTADO (Módulos de Hardware LED) */}
            <div className="pr-3 transition-opacity pointer-events-none flex items-center justify-center z-10">
                {isDisabled ? (
                    // Estado Candado: Pantalla hundida con luz roja de emergencia
                    <div className="bg-[#050608] p-1 rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,1)] border-b border-r border-[#2D3340]">
                        <Lock size={12} className="text-[#B34054] opacity-80" />
                    </div>
                ) : (
                    // Estado CPU: Se enciende en verde al pasar el mouse
                    <div className="bg-[#050608] p-1 rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,1)] border-b border-r border-[#363D4C] opacity-50 group-hover:opacity-100 transition-all duration-300">
                        <Cpu size={12} className="text-[#363D4C] group-hover:text-(--green-base) drop-shadow-[0_0_0_transparent] group-hover:drop-shadow-[0_0_3px_rgba(85,226,0,0.8)]" />
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