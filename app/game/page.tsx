"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSave, isActUnlocked } from '@/lib/gameState'
import { ActSummary } from '@/types/game'
import levelsData from '@/data/levels.json'
import { ActCard } from '@/components/map/ActCard'
import { Header } from '@/components/ui/Header'
import CRTOverlay from '@/components/ui/CRTOverlay'

export default function GameMapPage() {
  const router = useRouter()
  const [acts, setActs] = useState<ActSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateActs = () => {
      const actMap = new Map<number, ActSummary>()
      const saveData = getSave()

      levelsData.levels.forEach((level: any) => {
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
      setLoading(false)
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
    <div className="flex-1 flex flex-col min-h-screen bg-(--bg-void) relative overflow-hidden">
      <div className="absolute inset-0 bg-(--bg-deep) opacity-50 z-0 select-none pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--green-base) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      <main className="flex-1 container mx-auto px-8 py-12 relative z-10">
        <header className="mb-12 border-l-4 border-(--green-base) pl-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-(--green-light) animate-pulse" />
            <span className="text-[12px] font-mono text-(--green-muted) tracking-widest uppercase font-bold">Protocolo de Red</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic">MAPA_DE_SECTORES</h1>
          <p className="text-(--text-muted) max-w-2xl mt-4 font-mono leading-relaxed">
            Explora los sectores fragmentados. Cada nodo representa una secuencia de restauración crítica.
            Desbloquea nuevos perímetros recuperando la integridad del código.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
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

      <div className="fixed bottom-0 inset-x-0 py-2 px-8 bg-(--bg-surface) border-t border-(--bg-hover) flex justify-between items-center z-20 pointer-events-none">
        <div className="flex gap-6 items-center">
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">FRAG_LINK::ESTABLE</span>
          <div className="w-px h-12 bg-(--bg-hover) hidden md:block" />
        </div>
        <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">SISTEMA: OPERACIONAL</span>
      </div>
    </div>
  )
}
