"use client"

import { useState, useEffect } from 'react'
import { getSave, isActUnlocked } from '@/lib/gameState'
import { ActSummary } from '@/types/game'
import { getLevels } from '@/services/levelsService'
import { ActCard } from '@/components/map/ActCard'

export default function GameMapPage() {
  const [acts, setActs] = useState<ActSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateActs = async () => {
      try {
        const actMap = new Map<number, ActSummary>()
        const saveData = getSave()
        const levels = await getLevels()

        levels.forEach((level: any) => {
        if (!actMap.has(level.act)) {
          actMap.set(level.act, {
            number: level.act,
            name: level.actName || `Sector ${level.act}`,
            levelIds: [],
            reviewLevelId: null,
            completed: false,
            totalStars: 0
          })
        }

        const act = actMap.get(level.act)!
        act.levelIds.push(level.id)
        if (level.isReview) act.reviewLevelId = level.id

        // Add stars if we have a save
        if (saveData?.progress[level.id]) {
          act.totalStars += saveData.progress[level.id].stars
        }
      })

      // Update completion status for each act
      actMap.forEach(act => {
        act.completed = act.levelIds.every(id => saveData?.progress[id]?.completed)
      })

        const sortedActs = Array.from(actMap.values()).sort((a, b) => a.number - b.number)
        setActs(sortedActs)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    generateActs()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 bg-(--bg-deep) flex items-center justify-center font-mono text-(--green-light)">
        <div className="animate-pulse">CARGANDO_MAPA_SISTEMA...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-var(--header-height))] bg-(--bg-void) relative overflow-y-auto font-sans custom-scrollbar">

      <main className="flex-1 container mx-auto px-8 pb-12 pt-6 relative z-10">
        <header className="mb-14 relative flex flex-col gap-6">
          <div className="w-full  border-l-4 border-(--green-base) p-6 rounded-r-md flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden shadow-xl">
            {/* Fondo simulando rejilla técnica sutil */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_3px)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_right,rgba(45,120,0,0.05),transparent_70%)] pointer-events-none" />

            {/* Decoración tech */}
            <div className="absolute top-0 left-0 w-8 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />
            <div className="absolute bottom-0 left-0 w-16 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse shadow-[0_0_8px_var(--green-base)]" />
                <span className="text-[10px] text-(--green-muted) uppercase font-black tracking-[0.4em] leading-none text-nowrap">
                  SYS.NETWORK //  RED GLOBAL
                </span>
              </div>

              <div className="flex items-end gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-(family-name:--font-title) tracking-tighter text-white uppercase leading-none drop-shadow-md">
                  MAPA DE SECTORES
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
              <p className="text-(--text-muted) max-w-xl font-mono text-[10px] leading-relaxed uppercase tracking-widest mt-2 opacity-80">
                Explora los sectores fragmentados. Cada nodo representa una secuencia de restauración crítica. <br />
                Integridad de la red: <span className="text-(--green-light) animate-pulse">SINCRO_ACTIVA</span>
              </p>
            </div>

            <div className="relative z-10 hidden md:flex flex-col items-end gap-2 bg-[#080c11] border border-[#1a2636] p-4 rounded-xs shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] min-w-[200px]">
              <div className="flex items-center gap-3 opacity-60">
                <div className="flex flex-col">
                  <span className="text-[8px] text-(--green-light) font-mono tracking-widest uppercase">CONNECTION_SECURE</span>
                  <span className="text-[14px] text-white font-mono tracking-widest uppercase font-black text-right">EN LÍNEA</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-(--green-base) flex items-center justify-center relative">
                  <div className="w-4 h-4 rounded-full bg-(--green-light) animate-ping opacity-50 absolute" />
                  <div className="w-3 h-3 rounded-full bg-(--green-light)" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {acts.map((act) => {
            const unlocked = isActUnlocked(act.number)
            return (
              <ActCard
                key={act.number}
                {...act}
                isLocked={!unlocked}
              />
            )
          })}
        </div>
      </main>

      {/* Retro HUD elements */}
      <div className="fixed top-1/2 -right-4 border border-(--bg-hover) bg-(--bg-surface) p-2 rotate-90 z-20 pointer-events-none flex gap-4 pr-6">
        <span className="text-[8px] font-mono text-(--text-ghost) uppercase tracking-widest">Buffer_Cache::OK</span>
        <span className="text-[8px] font-mono text-(--text-ghost) uppercase tracking-widest">Signal::99%</span>
      </div>

      <div className="fixed bottom-0 inset-x-0 py-2 px-8 bg-(--bg-surface) border-t border-(--bg-hover) flex justify-between items-center z-20 pointer-events-none">
        <div className="flex gap-6 items-center">
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">FRAG_LINK::ESTABLE</span>
          <div className="w-px h-12 bg-(--bg-hover) hidden md:block" />
          <span className="text-[9px] font-mono text-(--green-muted) uppercase tracking-[0.2em] animate-pulse">MODO::NAVEGACIÓN_GLOBAL</span>
        </div>
        <div className="flex gap-4">
          <div className="w-1 h-1 bg-(--green-light) rounded-full animate-ping" />
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">SISTEMA: OPERACIONAL</span>
        </div>
      </div>
    </div>
  )
}
