import React from 'react'
import Link from 'next/link'
import { ActSummary } from '@/types/game'
import { LockIcon, ServerIcon, CheckCircle2Icon, ShieldAlertIcon, ChevronRightIcon, CpuIcon } from 'lucide-react'

interface ActCardProps extends ActSummary {
  isLocked: boolean
  onClick?: () => void
}

export function ActCard({
  number,
  name,
  levelIds,
  reviewLevelId,
  completed,
  totalStars,
  maxStars: maxStarsProp,
  isLocked,
  onClick
}: ActCardProps) {
  const maxStars = maxStarsProp // Use the one from GameMapClient instead of calculating it locally
  const completionPercentage = Math.round((totalStars / maxStars) * 100) || 0

  const baseStyles = "relative flex flex-col h-full bg-(--bg-surface) border border-[#1a2636] group transition-all duration-500 overflow-hidden shadow-2xl"
  const lockedStyles = isLocked
    ? "opacity-60 cursor-not-allowed grayscale"
    : "hover:border-(--green-base) hover:-translate-y-2 cursor-pointer outline-none"

  const content = (
    <>
      {/* Header Decoration */}
      <div className="h-10 border-b border-[#1a1f26] bg-[#0c1015] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${isLocked ? 'bg-(--text-ghost) text-(--text-ghost)' : completed ? 'bg-(--green-light) text-(--green-light) animate-pulse' : 'bg-(--amber) text-(--amber) animate-pulse'}`} />
          <span className="text-xs font-mono text-(--text-muted) uppercase tracking-widest">
            SECTOR_{number < 10 ? `0${number}` : number}
          </span>
        </div>
        {isLocked ? (
          <LockIcon className="w-3 h-3 text-(--text-ghost)" />
        ) : (
          <ServerIcon className="w-3 h-3 text-(--text-ghost)" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 relative flex flex-col min-h-[220px]">
        {/* Decorative Grid Overlay - Warped */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--bg-hover) 1px, transparent 1px), linear-gradient(90deg, var(--bg-hover) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex-1 pr-4">
            <h3 className={`text-2xl font-black font-(family-name:--font-title) uppercase leading-none ${isLocked ? 'text-(--text-muted)' : 'text-white group-hover:text-(--green-light) transition-colors'}`}>
              {name || 'Sistema Desconocido'}
            </h3>
            <div className="flex items-center gap-2 mt-3">
              {completed && <CheckCircle2Icon className="w-3 h-3 text-(--green-light)" />}
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isLocked ? 'text-(--text-ghost)' : 'text-(--green-muted)'}`}>
                {completed ? 'Sincronización Total.' : isLocked ? 'Acceso Restringido' : 'Conexión Establecida'}
              </span>
            </div>
          </div>
          {isLocked && <ShieldAlertIcon className="w-8 h-8 shrink-0 text-(--text-ghost) opacity-20" />}
          {!isLocked && <CpuIcon className="w-8 h-8 shrink-0 text-(--green-base) opacity-10 group-hover:opacity-30 group-hover:rotate-180 transition-all duration-1000" />}
        </div>

        <div className="mt-auto space-y-6 relative z-10">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className={isLocked ? 'text-(--text-ghost)' : 'text-(--text-muted)'}>INTEGRIDAD_RED</span>
              <span className={completed ? 'text-(--green-light) font-bold' : isLocked ? 'text-(--text-ghost)' : 'text-white font-bold'}>{completionPercentage}%</span>
            </div>
            {/* Industrial segmented progress bar */}
            <div className="flex gap-[2px] h-3 p-0.5 bg-[#0a0f14] border border-[#1a1f26]">
              {Array.from({ length: 15 }).map((_, i) => {
                const filled = (i / 15) * 100 < completionPercentage;
                return (
                  <div
                    key={i}
                    className={`flex-1 ${filled ? (completed ? 'bg-(--green-light) shadow-[0_0_5px_var(--green-light)]' : 'bg-(--green-base)') : 'bg-[#1a2636]'}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Stats Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0c1015] border border-[#1a1f26] flex items-center justify-between p-3 shrink-0">
              <span className="text-[11px] font-mono text-(--text-muted)/80 uppercase tracking-widest">Nodos</span>
              <span className={`font-mono text-sm font-bold ${isLocked ? 'text-(--text-ghost)' : 'text-white'}`}>{levelIds.length}</span>
            </div>
            <div className={`bg-[#0c1015] border ${isLocked ? 'border-[#1a1f26]' : 'border-(--amber)/30 shadow-[0_0_10px_rgba(239,159,39,0.05)]'} flex items-center justify-between p-3 shrink-0`}>
              <span className="text-[11px] font-mono text-(--text-muted)/80 uppercase tracking-widest">Rendimiento</span>
              <div className="flex items-center gap-1">
                <span className={`font-mono text-sm font-bold ${isLocked ? 'text-(--text-ghost)' : 'text-(--amber)'}`}>{totalStars}/{maxStars}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      {!isLocked && (
        <>
          <div className="absolute top-10 left-0 w-1 h-8 bg-(--green-base) opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-10 right-0 w-1 h-8 bg-(--green-base) opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}

      {/* Footer Area */}
      {!isLocked && (
        <div className="p-4 bg-[#0a0f14] border-t border-[#1a1f26] flex items-center justify-between group-hover:bg-(--green-darkest)/50 transition-colors">
          <span className="text-[10px] font-mono text-(--green-light) uppercase tracking-[0.4em] font-bold">INICIAR_SECUENCIA</span>
          <ChevronRightIcon className="w-4 h-4 text-(--green-light) group-hover:translate-x-1 transition-transform" />
        </div>
      )}
      {isLocked && (
        <div className="p-4 bg-[#0a0f14] border-t border-[#1a1f26] flex items-center justify-center">
          <span className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-[0.4em] font-bold">ACCESO_DENEGADO</span>
        </div>
      )}
    </>
  )

  if (isLocked) {
    return (
      <div className={`${baseStyles} ${lockedStyles}`}>
        {content}
      </div>
    )
  }

  return (
    <Link href={`/game/${number}`} className={`${baseStyles} ${lockedStyles}`} onClick={onClick}>
      {content}
    </Link>
  )
}
