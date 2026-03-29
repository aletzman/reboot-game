"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getActSummary, getLevelProgress, canAccessLevel } from '@/lib/gameState'
import { ActSummary, ActNumber, Level } from '@/types/game'
import levelsData from '@/data/levels.json'
import { NavButton } from '@/components/ui/NavButton'
import { ChevronLeftIcon, ChevronRightIcon, LockIcon, CheckCircle2Icon, CpuIcon, PlayIcon } from 'lucide-react'

interface ActMapClientProps {
  actId: string
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

export default function ActMapClient({ actId }: ActMapClientProps) {
  const router = useRouter()
  const [act, setAct] = useState<ActSummary | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const actNum = parseInt(actId as string) as ActNumber
    if (isNaN(actNum)) {
      router.push('/game')
      return
    }

    const summary = getActSummary(actNum)
    setAct(summary)

    const actLevels = (levelsData.levels as any[]).filter(l => l.act === actNum)
    setLevels(actLevels)

    setLoading(false)
  }, [actId, router])

  if (loading || !act) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-6">
          <div className="text-(--green-light) text-2xl animate-pulse font-bold tracking-[0.5em]">BOOT_SEQ...</div>
          <div className="w-64 h-1 bg-(--bg-hover) rounded-full overflow-hidden">
            <div className="h-full bg-(--green-light) animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const actProgress = Math.round((act.totalStars / (levels.length * 3 || 1)) * 100)

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-var(--header-height))] bg-(--bg-void) relative overflow-y-auto font-sans custom-scrollbar">

      {/* Background */}
      <div className="absolute inset-0 bg-(--bg-deep) opacity-50 z-0 select-none pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--green-base) 1.5px, transparent 1.5px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--green-base) to-transparent opacity-20"
          style={{ top: '15%' }}
        />
      </div>

      <main className="flex-1 container mx-auto px-8 pb-12 pt-6 relative z-10 flex flex-col">

        {/* Header */}
        <header className="mb-10 relative flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <NavButton href="/game" icon={ChevronLeftIcon}>
              MAPA_SECTORES
            </NavButton>
          </div>

          <div className="w-full bg-linear-to-r from-[#0c1218] to-transparent border-l-4 border-(--green-base) p-6 rounded-r-md flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_3px)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_right,rgba(45,120,0,0.05),transparent_70%)] pointer-events-none" />

            <div className="absolute top-0 left-0 w-8 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />
            <div className="absolute bottom-0 left-0 w-16 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse shadow-[0_0_8px_var(--green-base)]" />
                <span className="text-[10px] text-(--green-muted) uppercase font-black tracking-[0.4em] leading-none text-nowrap">
                  SYS.NETWORK // SECTOR_0{act.number}
                </span>
              </div>

              <div className="flex items-end gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-(family-name:--font-title) tracking-tighter text-white uppercase leading-none drop-shadow-md">
                  {act.name}
                </h1>
                <div className="hidden lg:flex flex-col gap-0.5 opacity-20 mb-1">
                  <div className="w-16 h-1 bg-white" />
                  <div className="w-12 h-[2px] bg-white" />
                  <div className="flex gap-1 h-3 mt-0.5">
                    <div className="w-1 h-full bg-white" />
                    <div className="w-3 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-(--green-base)" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats panel */}
            <div className="relative z-10 flex gap-4">
              <div className="bg-[#080c11] border border-[#1a2636] p-4 rounded-xs shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] min-w-[130px]">
                <span className="text-[8px] text-(--text-ghost) font-mono tracking-widest uppercase block mb-2">RENDIMIENTO</span>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-mono font-black text-(--amber) leading-none">{act.totalStars}</span>
                  <span className="text-[10px] font-mono text-[#1a2636] mb-0.5">/ {levels.length * 3}</span>
                </div>
              </div>
              <div className="bg-[#080c11] border border-[#1a2636] p-4 rounded-xs shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] min-w-[130px]">
                <span className="text-[8px] text-(--text-ghost) font-mono tracking-widest uppercase block mb-2">INTEGRIDAD</span>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-mono font-black leading-none ${actProgress === 100 ? 'text-(--green-light)' : 'text-white'}`}>{actProgress}%</span>
                </div>
                <div className="flex gap-[2px] mt-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 ${(i / 10) * 100 < actProgress ? 'bg-(--green-base) shadow-[0_0_4px_var(--green-base)]' : 'bg-[#1a2636]'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Level List */}
        <div className="flex flex-col gap-3 pb-20">
          {levels.map((level, index) => {
            const prog = getLevelProgress(level.id)
            const access = canAccessLevel(level.id)
            const isLocked = !access.allowed
            const isCompleted = prog?.completed ?? false
            const stars = prog?.stars ?? 0
            const typeLabel = level.isReview ? 'REVISIÓN' : (typeLabels[level.type] || level.type.toUpperCase())

            const card = (
              <div
                className={`group relative flex items-stretch bg-(--bg-surface) border transition-all duration-300 overflow-hidden shadow-lg
                  ${isLocked
                    ? 'border-[#1a2636] opacity-50 cursor-not-allowed grayscale'
                    : isCompleted
                      ? 'border-(--green-base)/40 hover:border-(--green-base) hover:-translate-y-0.5'
                      : 'border-[#1a2636] hover:border-(--cyan) hover:-translate-y-0.5'}
                `}
              >
                {/* Left Index Strip */}
                <div className={`w-14 shrink-0 flex flex-col items-center justify-center border-r gap-1 font-mono
                  ${isLocked
                    ? 'bg-[#080c11] border-[#1a2636] text-[#1a2636]'
                    : isCompleted
                      ? 'bg-(--green-darkest) border-(--green-base)/30 text-(--green-light)'
                      : 'bg-[#0c1218] border-[#1a2636] text-(--cyan)'}
                `}>
                  <span className="text-[9px] tracking-widest font-bold opacity-60">{String(index + 1).padStart(2, '0')}</span>
                  {isCompleted && <CheckCircle2Icon className="w-4 h-4 text-(--green-light)" />}
                  {isLocked && <LockIcon className="w-3.5 h-3.5 text-[#1a2636]" />}
                  {!isLocked && !isCompleted && <PlayIcon className="w-3.5 h-3.5 fill-current" />}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 px-6">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-base font-black font-(family-name:--font-title) uppercase leading-none truncate
                        ${isLocked ? 'text-(--text-ghost)' : 'text-white group-hover:text-(--green-light) transition-colors'}
                      `}>
                        {level.title}
                      </h3>
                      {level.isReview && (
                        <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest bg-(--purple)/20 text-(--purple) border border-(--purple)/30">
                          REVIEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-mono uppercase tracking-widest ${isLocked ? 'text-[#1a2636]' : 'text-(--text-muted)'}`}>
                        TIPO::{typeLabel}
                      </span>
                      <span className="text-[9px] font-mono text-[#1a2636]">|</span>
                      <span className={`text-[9px] font-mono uppercase tracking-widest ${isLocked ? 'text-[#1a2636]' : 'text-(--text-ghost)'}`}>
                        ID::{level.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    {/* Stars */}
                    {!isLocked && (
                      <div className="flex gap-[3px]">
                        {[1, 2, 3].map((s) => (
                          <div
                            key={s}
                            className={`w-3 h-5 skew-x-[-15deg] transition-all duration-300 ${s <= stars ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)]' : 'bg-[#1a2636]'}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Action indicator */}
                    {!isLocked && (
                      <ChevronRightIcon className={`w-5 h-5 transition-all duration-300 ${isCompleted ? 'text-(--green-base) group-hover:text-(--green-light)' : 'text-(--text-ghost) group-hover:text-(--cyan)'} group-hover:translate-x-1`} />
                    )}
                  </div>
                </div>

                {/* Active level left accent */}
                {!isLocked && !isCompleted && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-(--cyan) shadow-[0_0_10px_var(--cyan)]" />
                )}
                {isCompleted && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-(--green-base) shadow-[0_0_8px_var(--green-base)]" />
                )}
              </div>
            )

            if (isLocked) {
              return <div key={level.id}>{card}</div>
            }

            return (
              <Link key={level.id} href={`/game/${act.number}/level/${level.id}`} className="outline-none">
                {card}
              </Link>
            )
          })}
        </div>
      </main>

      {/* Footer HUD */}
      <div className="fixed bottom-0 inset-x-0 py-2 px-8 bg-(--bg-surface) border-t border-(--bg-hover) flex justify-between items-center z-20 pointer-events-none">
        <div className="flex gap-6 items-center">
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">FRAG_LINK::ESTABLE</span>
          <div className="w-px h-12 bg-(--bg-hover) hidden md:block" />
          <span className="text-[9px] font-mono text-(--green-muted) uppercase tracking-[0.2em] animate-pulse">MODO::NAVEGACIÓN_SECTOR</span>
        </div>
        <div className="flex gap-4">
          <div className="w-1 h-1 bg-(--green-light) rounded-full animate-ping" />
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">SISTEMA: OPERACIONAL</span>
        </div>
      </div>
    </div>
  )
}
