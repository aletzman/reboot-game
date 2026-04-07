"use client"

import React from 'react'
import Link from 'next/link'
import { Level, LevelProgress, LevelAccessResult } from '@/types/game'
import { LockIcon, CheckCircle2Icon, PlayIcon, ChevronRightIcon, CpuIcon, FileCode2Icon, ZapIcon } from 'lucide-react'

interface LevelCardProps {
  level: Level
  index: number
  progress: LevelProgress | null
  access: LevelAccessResult
  actNumber: number
}

const typeLabels: Record<string, string> = {
  noderoutine: 'RUTA_NODO',
  logicassembly: 'ENSAMBLE_LÓGICO',
  codeeditor: 'EDITOR_JS',
  speedtyping: 'VELOCIDAD',
  cinematic: 'CINEMÁTICA',
  'puzzle-sort': 'PUZZLE_ORDEN',
  'puzzle-fill': 'PUZZLE_RELLENO',
  'puzzle-bug': 'PUZZLE_BUG',
  'puzzle-match': 'PUZZLE_PAR',
  review: 'REVISIÓN',
}

export function LevelCard({ level, index, progress, access, actNumber }: LevelCardProps) {
  const isLocked = !access.allowed
  const isCompleted = progress?.completed ?? false
  const stars = progress?.stars ?? 0
  const typeLabel = level.isReview ? 'REVISIÓN_CRÍTICA' : (typeLabels[level.type] || level.type.toUpperCase())

  // Paletas de color contextuales
  const themeColor = isCompleted ? '(--green-base)' : isLocked ? '(--text-ghost)' : '(--cyan)'
  const themeLight = isCompleted ? '(--green-light)' : isLocked ? '(--text-ghost)' : '(--cyan)'

  // Contenedor principal: El "Socket" (cavidad oscura)
  const baseStyles = "block relative w-full bg-[#030405] transition-all font-mono group rounded-md p-[6px] border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)]"

  const lockedStyles = isLocked
    ? "opacity-60 cursor-not-allowed grayscale pointer-events-none"
    : "cursor-pointer outline-none"

  const cardContent = (
    // La tarjeta en sí: El "Plunger" (módulo que se hunde al clickear)
    <div className={`relative flex items-stretch h-full rounded-sm overflow-hidden bg-[linear-gradient(180deg,#161b22,#0a0d11)] transition-all duration-200 ease-out z-10 border-2
      ${isLocked
        ? 'border-[#1a2026] shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
        : `border-[#1c2229] group-hover:border-${themeColor}/40 shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:shadow-[0_6px_16px_rgba(${isCompleted ? '126,213,38' : '18,176,187'},0.15)] group-active:translate-y-[3px] group-active:shadow-[0_0px_0px_transparent]`
      }
    `}>

      {/* ─── PANTALLA PRINCIPAL PROFUNDA: INSET CRT DISPLAY ─── */}
      <div className="absolute inset-0 left-16 flex z-0 pointer-events-none">
        <div className={`w-full h-full p-5 relative flex flex-col z-10 ${isLocked ? 'bg-[#020304]' : 'bg-[#0C1117]'} shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] overflow-hidden`}>
          {/* Reflejo CRT tipo Glass */}
          {!isLocked && <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none z-0" />}
          {/* Grid pattern / scanlines industriales */}
          <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)] pointer-events-none z-0" />
        </div>
      </div>

      {/* ─── HEADER LATERAL: METALLIC STRIP ─── */}
      <div className={`w-16 shrink-0 relative flex flex-col items-center justify-center border-r-2 border-black z-20 shadow-[2px_0_8px_rgba(0,0,0,0.6)]
        ${isLocked ? 'bg-[#0a0d11]' : isCompleted ? 'bg-[linear-gradient(180deg,#0a1a05,#050d02)]' : 'bg-[linear-gradient(180deg,#051012,#020708)]'}
      `}>
        {/* Glow effect lateral (Señal de poder) */}
        {!isLocked && (
          <div className={`absolute top-0 bottom-0 left-0 w-[3px] bg-${themeColor} opacity-60 shadow-[0_0_12px_var(--${isCompleted ? 'green-base' : 'cyan'})] group-hover:opacity-100 transition-opacity`} />
        )}

        {/* Texturas industriales */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />

        <span className={`text-[16px] tracking-widest font-black relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${isLocked ? 'text-[#3D444D]' : `text-${themeLight}`}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="h-6 w-0.5 bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)] my-1.5 relative z-10" />
        {isCompleted ? (
          <CheckCircle2Icon className={`w-5 h-5 text-${themeLight} relative z-10 drop-shadow-[0_0_8px_currentColor]`} />
        ) : isLocked ? (
          <div className="p-1 rounded-sm border border-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] bg-[#05070a] relative z-10">
            <LockIcon className="w-3.5 h-3.5 text-[#3D444D]" />
          </div>
        ) : (
          <PlayIcon className={`w-4 h-4 text-${themeLight} fill-current relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_6px_currentColor]`} />
        )}
      </div>

      {/* Main Content Area sobre el display CRT */}
      <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 px-6 relative z-10">

        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className={`text-xl font-black font-(family-name:--font-title) uppercase tracking-tight leading-none truncate drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
              ${isLocked ? 'text-[#8B949E]' : `text-[#E6EDF3] group-hover:text-${themeLight} transition-colors duration-300`}
            `}>
              {level.title}
            </h3>
            {level.isReview && (
              <div className="relative group/tag ml-2">
                <div className="absolute inset-0 bg-(--purple) blur-sm opacity-20 group-hover/tag:opacity-40 transition-opacity" />
                <span className="relative px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest bg-(--purple)/10 text-(--purple) border border-(--purple)/40 shadow-inner">
                  CRITICAL_NODE
                </span>
              </div>
            )}
            {level.optional && !level.isReview && (
              <span className="ml-2 px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest bg-(--amber)/5 text-(--amber)/80 border border-(--amber)/20">
                OPT_DATA
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-y-1 gap-x-4 mt-1 opacity-80">
            <div className="flex items-center gap-1.5">
              <CpuIcon className={`w-3.5 h-3.5 ${isLocked ? 'text-[#3D444D]' : 'text-(--text-muted)'}`} />
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.15em] ${isLocked ? 'text-[#3D444D]' : 'text-(--text-muted)'}`}>
                TIPO: {typeLabel}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a2636] shadow-inner" />
            <div className="flex items-center gap-1.5">
              <FileCode2Icon className={`w-3.5 h-3.5 ${isLocked ? 'text-(--text-ghost)' : 'text-(--text-muted)'}`} />
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.15em] ${isLocked ? 'text-(--text-ghost)' : 'text-(--text-muted)'}`}>
                HASH::{level.id.substring(level.id.length - 8)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 shrink-0 self-end md:self-center mt-2 md:mt-0">

          {/* Performance indicator (Baterías / Power Cells Industriales) */}
          {!isLocked && (
            <div className="flex flex-col items-end gap-1.5 transition-all">
              <span className={`text-[8px] font-bold text-[#8B949E] tracking-[0.2em] uppercase font-mono`}>PWR_CELLS</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => {
                  const isActive = n <= stars;
                  return (
                    <div key={n} className={`relative w-4 h-6 border-y border-x border-(--border-color) bg-[#020304] rounded-xs flex flex-col justify-end p-[2px] shadow-[inset_0_4px_8px_rgba(0,0,0,1)]`}>
                      {/* Contacto metálico superior */}
                      <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-[2px] bg-[#2d3641] shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />

                      {/* Celda LED */}
                      <div
                        className={`w-full transition-colors duration-700 rounded-[1px] relative overflow-hidden
                          ${isActive
                            ? `h-full bg-${themeColor} border border-black/40 shadow-[0_0_8px_var(--${isCompleted ? 'green-base' : 'cyan'})]`
                            : 'h-1 bg-[#0a0d11] border border-black/80'
                          }
                        `}
                      >
                        {/* Pequeño reflejo LED dentro de cristal */}
                        {isActive && <div className="absolute top-0 left-0 right-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,transparent_100%)] pointer-events-none" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action indicator - Integrated Screen Button */}
          <div className="relative">
            {!isLocked ? (
              <div className={`w-10 h-10 border bg-[#05070a] shadow-[inset_0_4px_8px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)] rounded-[3px] flex items-center justify-center transition-all duration-300
                  ${isCompleted
                  ? 'border-[#1c2229] text-(--green-base) group-hover:border-(--green-light) group-hover:text-(--green-light) group-hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_12px_rgba(85,226,0,0.4)_inset]'
                  : 'border-[#1c2229] text-(--cyan) group-hover:border-(--cyan) group-hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_12px_rgba(18,176,187,0.4)_inset]'}
                  group-hover:translate-x-1
                `}>
                <ChevronRightIcon strokeWidth={3} className="w-5 h-5 drop-shadow-[0_0_4px_currentColor]" />
              </div>
            ) : (
              <div className="w-10 h-10 border border-[#1a2026] bg-[#05070a] shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] rounded-[3px] grayscale opacity-60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3D444D]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (isLocked) {
    return (
      <div className={baseStyles}>
        {cardContent}
      </div>
    )
  }

  return (
    <Link href={`/game/${actNumber}/level/${level.id}`} className={baseStyles} onClick={() => { }}>
      {cardContent}
    </Link>
  )
}

export function LevelCardSkeleton() {
  return (
    <div className="block relative w-full bg-[#030405] font-mono rounded-md p-[6px] border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)]">
      <div className="relative flex items-stretch h-[104px] rounded-sm overflow-hidden bg-[linear-gradient(180deg,#161b22,#0a0d11)] border-2 border-[#1c2229] opacity-40">
        <div className="w-16 shrink-0 bg-[linear-gradient(180deg,#051012,#020708)] border-r-2 border-black shadow-[2px_0_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-md bg-[#1a2636] animate-pulse" />
        </div>
        <div className="flex-1 p-5 px-6 flex flex-col justify-center gap-4 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] bg-[#0C1117]">
          <div className="h-6 w-48 bg-[#1a2636] rounded-xs animate-pulse" />
          <div className="flex gap-4 animate-pulse">
            <div className="h-3 w-32 bg-[#1a2636] rounded-xs" />
            <div className="h-3 w-24 bg-[#1a2636] rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}
