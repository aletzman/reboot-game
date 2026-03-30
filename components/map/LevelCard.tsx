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

  const cardContent = (
    <div
      className={`group relative flex items-stretch bg-(--bg-surface) border transition-all duration-500 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]
        ${isLocked
          ? 'border-[#1a2636] opacity-60 cursor-not-allowed'
          : isCompleted
            ? 'border-(--green-base)/30 hover:border-(--green-light) hover:shadow-[0_0_20px_rgba(85,226,0,0.15)]'
            : 'border-[#1a2636] hover:border-(--cyan) hover:shadow-[0_0_20px_rgba(18,176,187,0.15)]'}
      `}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/assets/textures/grid-subtle.png')] bg-repeat" />

      {/* Scanline Effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />

      {/* Left Index Strip - Industrial look */}
      <div className={`w-16 shrink-0 flex flex-col items-center justify-center border-r gap-2 font-mono relative overflow-hidden
        ${isLocked
          ? 'bg-[#080c11] border-[#1a2636] text-[#1a2636]'
          : isCompleted
            ? 'bg-(--green-darkest) border-(--green-base)/30 text-(--green-light)'
            : 'bg-[#0c1218] border-[#1a2636] text-(--cyan)'}
      `}>
        {/* Glow effect for completed/next */}
        {!isLocked && (
          <div className={`absolute inset-0 opacity-10 blur-xl ${isCompleted ? 'bg-(--green-light)' : 'bg-(--cyan)'}`} />
        )}

        <span className="text-[12px] tracking-[0.3em] font-black relative z-10">{String(index + 1).padStart(2, '0')}</span>
        <div className="h-4 w-px bg-current opacity-20 relative z-10" />
        {isCompleted ? (
          <CheckCircle2Icon className="w-5 h-5 text-(--green-light) relative z-10 animate-in zoom-in-50 duration-500" />
        ) : isLocked ? (
          <LockIcon className="w-4 h-4 text-[#1a2636] relative z-10" />
        ) : (
          <PlayIcon className="w-4 h-4 text-(--cyan) fill-current relative z-10 group-hover:scale-110 transition-transform" />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 px-8 relative z-10">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className={`text-xl font-black font-(family-name:--font-title) uppercase tracking-tight leading-none truncate
              ${isLocked ? 'text-(--text-ghost)' : 'text-white group-hover:text-(--green-light) transition-colors duration-300'}
            `}>
              {level.title}
            </h3>
            {level.isReview && (
              <div className="relative group/tag">
                <div className="absolute inset-0 bg-(--purple) blur-sm opacity-20 group-hover/tag:opacity-40 transition-opacity" />
                <span className="relative px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest bg-(--purple)/10 text-(--purple) border border-(--purple)/40">
                  CRITICAL_NODE
                </span>
              </div>
            )}
            {level.optional && !level.isReview && (
              <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest bg-(--amber)/5 text-(--amber)/60 border border-(--amber)/20">
                OPTIONAL_DATA
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-y-1 gap-x-4">
            <div className="flex items-center gap-1.5">
              <CpuIcon className={`w-3 h-3 ${isLocked ? 'text-[#1a2636]' : 'text-(--text-muted)'}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isLocked ? 'text-[#1a2636]' : 'text-(--text-muted)'}`}>
                PROTOCOLO_{typeLabel}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#1a2636]" />
            <div className="flex items-center gap-1.5">
              <FileCode2Icon className={`w-3 h-3 ${isLocked ? 'text-[#1a2636]' : 'text-(--text-ghost)'}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isLocked ? 'text-[#1a2636]' : 'text-(--text-ghost)'}`}>
                HASH::{level.id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10 shrink-0 self-end md:self-center">
          {/* Performance indicator (Stars) */}
          {!isLocked && (
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] font-mono text-(--text-muted)/70 font-semibold uppercase tracking-widest">EFICIENCIA DE EJECUCIÓN</span>
              <div className="flex gap-[4px]">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="relative group/star">
                    {s <= stars && (
                      <div className="absolute inset-0 bg-(--amber) blur-md opacity-30 group-hover/star:opacity-60 transition-opacity" />
                    )}
                    <div
                      className={`w-4 h-6 skew-x-[-20deg] border transition-all duration-500
                        ${s <= stars
                          ? 'bg-(--amber) border-(--amber) shadow-[0_0_10px_var(--amber)]'
                          : 'bg-[#0c1218] border-[#1a1f26]'}
                      `}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action indicator */}
          <div className="relative">
            {!isLocked && (
              <>
                <div className={`absolute inset-0 blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isCompleted ? 'bg-(--green-light)' : 'bg-(--cyan)'}`} />
                <div className={`p-2 border rounded-xs transition-all duration-300
                  ${isCompleted
                    ? 'border-(--green-base)/20 text-(--green-base) group-hover:border-(--green-light) group-hover:text-(--green-light)'
                    : 'border-[#1a1f26] text-(--text-ghost) group-hover:border-(--cyan) group-hover:text-(--cyan)'}
                  group-hover:translate-x-1 group-hover:rotate-3
                `}>
                  <ChevronRightIcon className="w-5 h-5" />
                </div>
              </>
            )}
            {isLocked && <LockIcon className="w-5 h-5 text-[#1a2636]" />}
          </div>
        </div>
      </div>

      {/* Visual Glitch/Decoration */}
      {!isLocked && !isCompleted && (
        <div className="absolute top-0 right-0 w-32 h-px bg-linear-to-l from-(--cyan) to-transparent opacity-40 animate-pulse" />
      )}
      {isCompleted && (
        <div className="absolute top-0 right-0 w-32 h-px bg-linear-to-l from-(--green-light) to-transparent opacity-40" />
      )}

      {/* Hover Background Accent */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-1 transition-opacity duration-500 pointer-events-none
        ${isCompleted ? 'bg-[radial-gradient(circle_at_20%_50%,rgba(85,226,0,0.03),transparent_70%)]' : 'bg-[radial-gradient(circle_at_20%_50%,rgba(18,176,187,0.03),transparent_70%)]'}
      `} />
    </div>
  )

  if (isLocked) {
    return (
      <div className="block cursor-not-allowed">
        {cardContent}
      </div>
    )
  }

  return (
    <Link href={`/game/${actNumber}/level/${level.id}`} className="block outline-none">
      {cardContent}
    </Link>
  )
}
export function LevelCardSkeleton() {
  return (
    <div className="flex items-stretch bg-(--bg-surface) border border-[#1a2636] h-32 animate-pulse rounded-xs overflow-hidden opacity-40">
      <div className="w-16 shrink-0 bg-[#080c11] border-r border-[#1a2636]" />
      <div className="flex-1 p-6 px-8 flex flex-col justify-center gap-4">
        <div className="h-6 w-48 bg-[#1a2636] rounded-xs" />
        <div className="flex gap-4">
          <div className="h-3 w-32 bg-[#1a2636] rounded-xs" />
          <div className="h-3 w-24 bg-[#1a2636] rounded-xs" />
        </div>
      </div>
      <div className="w-32 shrink-0 p-6 flex items-center justify-center">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-4 h-6 skew-x-[-20deg] bg-[#1a2636] rounded-px" />
          ))}
        </div>
      </div>
    </div>
  )
}
