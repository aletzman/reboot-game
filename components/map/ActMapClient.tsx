"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getActSummary, getLevelProgress, canAccessLevel } from '@/lib/gameState'
import { ActSummary, ActNumber, Level } from '@/types/game'
import levelsData from '@/data/levels.json'
import { LevelNode } from '@/components/map/LevelNode'
import { ChevronLeft, Terminal, Activity, Shield, Cpu, Database } from 'lucide-react'

// Constants for layout
const NODE_SPACING_Y = 240
const CANVAS_WIDTH = 1200

interface ActMapClientProps {
  actId: string
}

export default function ActMapClient({ actId }: ActMapClientProps) {
  const router = useRouter()
  const [act, setAct] = useState<ActSummary | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / (window.innerWidth || 1), y: e.clientY / (window.innerHeight || 1) })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
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

  const getLevelPosition = (index: number) => {
    const amplitude = 300
    const x = CANVAS_WIDTH / 2 + Math.sin(index * 1.5) * amplitude
    const y = 200 + (index * NODE_SPACING_Y)
    return { x, y }
  }

  const actProgress = (act.totalStars / (levels.length * 3 || 1)) * 100

  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) relative overflow-hidden font-mono text-(--text-primary)">


      {/* 3D PARALLAX DEEP BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#060809] via-[#010101] to-black" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, var(--green-darkest) 0%, transparent 60%)`,
          }}
        />

        <div className="absolute inset-0 opacity-[0.05]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-(--green-light) rounded-full blur-[1px] animate-pulse"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
                width: '2px',
                height: '2px',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 opacity-[0.03] transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `linear-gradient(var(--green-base) 1px, transparent 1px), linear-gradient(90deg, var(--green-base) 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -20}px) perspective(1000px) rotateX(15deg) scale(1.2)`,
          }}
        />
      </div>

      {/* PREMIUM TOP HUD */}
      <div className="relative z-30 flex flex-col pointer-events-none">
        <div className="flex items-start justify-between px-12 py-8 bg-black/80 pointer-events-auto">
          <div className="flex items-start gap-10">
            <button
              onClick={() => router.push('/game')}
              className="flex flex-col items-center gap-1 group transition-all"
            >
              <div className="p-3 bg-black/40 border border-(--bg-hover) rounded-sm group-hover:border-(--green-base) group-hover:bg-(--green-darkest)/40 shadow-xl transition-all">
                <ChevronLeft size={20} className="group-hover:text-(--green-light) group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[8px] font-black tracking-[0.4em] opacity-40 group-hover:opacity-100 uppercase transition-opacity">ESCAPE</span>
            </button>

            <div className="flex flex-col border-l border-(--bg-hover) pl-8 h-12 justify-center">
              <div className="flex items-center gap-4 text-[9px] text-(--green-muted) tracking-[0.5em] font-black italic mb-1 uppercase">
                <Activity size={10} className="animate-pulse" /> SECTOR_LINK::0{act.number}
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {act.name}
                <div className="h-4 w-px bg-(--green-base) opacity-20 -rotate-12" />
                <span className="text-sm font-normal not-italic lowercase text-(--green-muted) tracking-normal opacity-40 translate-y-2">v4.0.2</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-16 mr-4">
            <div className="flex flex-col items-end group">
              <span className="text-[9px] text-(--text-ghost) font-black tracking-[0.3em] uppercase mb-2">FRAGMENTOS_RECOPILADOS</span>
              <div className="flex items-end gap-3 px-6 py-2 bg-black/40 border-r-2 border-(--amber) relative transform -skew-x-12">
                <span className="text-3xl font-black text-(--amber) italic leading-none transform skew-x-12">{act.totalStars}</span>
                <span className="text-[10px] text-(--text-ghost) font-bold mb-1 transform skew-x-12 tracking-widest">/ {levels.length * 3} ★</span>
                <div className="absolute inset-y-0 right-0 w-4 bg-linear-to-r from-transparent to-(--amber)/10 blur-sm" />
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-4 items-center">
                <div className="text-right">
                  <span className="text-[8px] text-(--green-muted) font-black tracking-widest block font-mono">SINCRONÍA_SISTEMA</span>
                  <span className="text-lg font-black text-(--green-light) italic leading-none">{Math.round(actProgress)}%</span>
                </div>
                <div className="w-1.5 h-10 bg-black/60 rounded-full p-px border border-(--bg-hover)">
                  <div
                    className="w-full bg-linear-to-b from-(--green-light) to-(--green-muted) rounded-full shadow-[0_0_10px_var(--green-base)] transition-all duration-1000"
                    style={{ height: `${actProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-12 px-14 py-2 bg-black/20 border-y border-(--bg-hover)/30 text-[8px] text-(--green-muted)/40 font-bold tracking-[0.3em] italic uppercase">
          <span className="animate-pulse">SISTEMA_OPERATIVO: ESTABLE</span>
          <span>RED_NODAL: ACTIVA</span>
          <span>FRAG_ASSISTANT: LISTO</span>
          <span>LATENCIA_SECTOR: 24ms</span>
          <div className="ml-auto flex gap-4 opacity-100 text-(--green-muted)">
            <Terminal size={10} />
            <Activity size={10} />
            <Shield size={10} />
          </div>
        </div>
      </div>

      <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden" ref={containerRef}>
        <div className="w-full relative mx-auto" style={{ width: `${CANVAS_WIDTH}px`, minHeight: '100%' }}>

          <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none select-none">
            {[...Array(Math.min(levels.length, 5))].map((_, i) => (
              <div key={i} style={{ position: 'absolute', top: `${i * NODE_SPACING_Y * 2 + 100}px`, left: '10%' }}>
                <Database size={160} className="text-(--green-base) opacity-30 rotate-12" />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 top-0 z-10 pointer-events-none" style={{ height: `${levels.length * NODE_SPACING_Y + 500}px` }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${levels.length * NODE_SPACING_Y + 500}`} className="drop-shadow-[0_0_20px_rgba(85,226,0,0.2)]">
              <defs>
                <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {levels.map((level, i) => {
                if (i === levels.length - 1) return null
                const start = getLevelPosition(i)
                const end = getLevelPosition(i + 1)
                const midY = (start.y + end.y) / 2

                const startProg = getLevelProgress(level.id)
                const isUnlocked = startProg?.completed || canAccessLevel(levels[i + 1].id).allowed

                return (
                  <g key={`path-${i}`}>
                    <path
                      d={`M ${start.x} ${start.y} Q ${CANVAS_WIDTH / 2} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke="black"
                      strokeWidth="24"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${start.x} ${start.y} Q ${CANVAS_WIDTH / 2} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke={isUnlocked ? 'rgba(85,226,0,0.1)' : 'rgba(255,255,255,0.02)'}
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${start.x} ${start.y} Q ${CANVAS_WIDTH / 2} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke={isUnlocked ? 'var(--green-base)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth="3"
                      strokeDasharray={isUnlocked ? "" : "12, 10"}
                      filter={isUnlocked ? "url(#pathGlow)" : ""}
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="relative z-20">
            {levels.map((level, index) => {
              const prog = getLevelProgress(level.id)
              const access = canAccessLevel(level.id)
              const { x, y } = getLevelPosition(index)

              return (
                <div
                  key={level.id}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 40
                  }}
                  className="group hover:z-50"
                >
                  <div className="absolute -inset-12 bg-radial-at-center from-(--green-darkest)/40 to-transparent rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />

                  <div className="absolute -top-16 left-full ml-4 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <div className="bg-black/90 border-l-2 border-(--green-base) px-4 py-2 transform -skew-x-12">
                      <div className="transform skew-x-12">
                        <div className="text-[10px] font-black italic text-white uppercase">{level.type}::PROTO</div>
                        <div className="text-[8px] text-(--green-muted) uppercase tracking-widest">{level.id}</div>
                      </div>
                    </div>
                  </div>

                  <LevelNode
                    actId={act.number}
                    id={level.id}
                    title={level.title}
                    type={level.type}
                    stars={prog?.stars ?? 0}
                    completed={prog?.completed ?? false}
                    isLocked={!access.allowed}
                    isReview={level.isReview}
                    x={0}
                    y={0}
                  />

                  {prog?.completed && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-(--green-base)/20 animate-ping pointer-events-none" />
                  )}

                  <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-(--green-light) transition-colors">
                      {level.title}
                    </div>
                  </div>
                </div>
              )
            })}
            <div style={{ height: `${levels.length * NODE_SPACING_Y + 300}px` }} />
          </div>
        </div>
      </main>

      {/* ULTRA-HD FOOTER BAR */}
      <div className="relative z-30 bg-black/90 border-t-2 border-(--bg-hover) px-12 py-5 flex items-center justify-between font-mono">
        <div className="flex gap-12 items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Cpu size={24} className="text-(--green-muted) animate-pulse shadow-[0_0_15px_var(--green-base)]" />
              <div className="absolute inset-0 border border-(--green-base) opacity-20 transform rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white tracking-widest italic">NÚCLEO::RED_V4</span>
              <span className="text-[7px] text-(--green-muted) font-bold uppercase tracking-[0.4em]">Procesando geolocalización...</span>
            </div>
          </div>

          <div className="flex gap-8 border-l border-(--bg-hover) pl-8 opacity-40">
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-(--text-muted) tracking-widest uppercase">MEM_SYNC</span>
              <span className="text-[9px] font-black text-white">0.428ms</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 text-(--purple) font-black text-[9px] uppercase italic tracking-[0.3em]">
              <Shield size={14} className="animate-pulse" /> FRAG_OS::SECURED_LAYER
            </div>
            <div className="w-40 h-1 bg-black/60 rounded-full overflow-hidden">
              <div className="h-full w-[88%] bg-(--purple) shadow-[0_0_8px_var(--purple)]" />
            </div>
          </div>

          <div className="px-6 py-2 bg-linear-to-r from-(--green-darkest) to-[#0d1f00] border border-(--green-base) rounded-sm shadow-[0_0_15px_rgba(85,226,0,0.1)]">
            <span className="text-[9px] font-black text-(--green-light) tracking-[0.5em] uppercase animate-pulse italic">ESTADO: OPTIMIZADO</span>
          </div>
        </div>
      </div>
    </div>
  )
}
