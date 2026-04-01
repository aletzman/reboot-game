import { useDraggable } from '@dnd-kit/react'
import { GripVertical, Cpu, Lock } from 'lucide-react'
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
                group relative flex items-center p-3 text-left transition-all duration-200
                cursor-grab overflow-hidden touch-none select-none rounded-[2px] not-[]:
                bg-(--bg-elevated) border border-(--border-muted-color) 
                shadow-[0_3px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.03)] 
                ${isDragging ? 'opacity-30 scale-95 shadow-none' : 'active:scale-[0.98] active:shadow-none'}
                ${isDisabled
                    ? 'cursor-not-allowed opacity-60 grayscale-40'
                    : 'hover:bg-(--bg-hover) hover:border-(--border-muted-color) hover:shadow-[0_5px_15px_rgba(0,0,0,0.8)]'
                }
            `}
            style={{
                // Franja izquierda de color, simulando pintura industrial
                borderLeftWidth: '4px',
                borderLeftStyle: 'solid',
                borderLeftColor: def.border
            }}
        >
            {/* Textura de "Agarre" (Drag Handle) */}
            <div className={`flex items-center justify-center mr-3 transition-colors duration-200 
                ${isDisabled ? 'text-(--text-ghost) opacity-20' : 'text-(--text-muted) opacity-50 group-hover:text-white group-hover:opacity-90'}
            `}>
                <GripVertical size={14} />
            </div>

            {/* Contenido del Bloque */}
            <div className="flex flex-col flex-1 pointer-events-none">
                <span className="font-mono text-[11px] font-black tracking-[0.2em] uppercase transition-colors"
                    style={{ color: isDisabled ? 'var(--text-ghost)' : def.border }}>
                    {def.label}
                </span>
                <span className="font-mono text-[8px] text-(--text-ghost) mt-0.5 uppercase tracking-widest font-bold">
                    MOD::{def.type}
                </span>
            </div>

            {/* Ícono de Estado (CPU si está activo, Candado si está agotado) */}
            <div className="ml-2 transition-opacity pointer-events-none">
                {isDisabled
                    ? <Lock size={14} className="text-(--red-muted) opacity-60" />
                    : <Cpu size={16} className="text-(--text-ghost) opacity-30 group-hover:opacity-60" />
                }
            </div>

            {/* EFECTOS ESPECIALES (Superpuestos con position absolute) */}

            {/* Brillo táctico superior (Se ilumina sutilmente al pasar el mouse) */}
            {!isDisabled && (
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}

            {/* Patrón de "Módulo Agotado" (Líneas diagonales estilo cinta de peligro) */}
            {isDisabled && (
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,var(--text-muted)_4px,var(--text-muted)_8px)] pointer-events-none" />
            )}
        </button>
    )
}