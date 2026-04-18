"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getSave, isActUnlocked } from '@/lib/gameState'
import { isDemoModeActive } from '@/lib/store/useDemoStore'
import { ActSummary, Level, ActNumber } from '@/types/game'
import { ActCard } from '@/components/map/ActCard'
import { SectorHeader } from '@/components/map/SectorHeader'

import { Loading } from '@/components/ui/Loading'
import { ContainerHeader } from '../ui/ContainerHeader'

interface GameMapClientProps {
  levels: Level[]
}

export default function GameMapClient({ levels }: GameMapClientProps) {
  const [acts, setActs] = useState<ActSummary[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const generateActs = () => {
      try {
        const actMap = new Map<number, ActSummary>()
        const saveData = getSave()
        const progress = saveData?.progress

        levels.forEach((level) => {
          if (!actMap.has(level.act)) {
            actMap.set(level.act, {
              number: level.act as ActNumber,
              name: level.actName,
              levelIds: [],
              reviewLevelId: null,
              completed: false,
              totalStars: 0,
              maxStars: 0
            })
          }

          const act = actMap.get(level.act)!
          act.levelIds.push(level.id)
          if (level.isReview) act.reviewLevelId = level.id

          // Add stars if we have a save
          const levelProgress = progress?.[level.id]
          if (levelProgress) {
            act.totalStars += levelProgress.stars
          }
          act.maxStars += (level.maxStars || 3)
        })

        // Update completion status for each act
        actMap.forEach((act, index) => {
          if (isDemoModeActive() && act.number <= 4) {
            act.completed = true
            // En demo, solo se cuentan las estrellas de los primeros 4 niveles
            const levelsAvailable = index === 0 ? 2 : 4
            act.totalStars = levelsAvailable * 3 // 4 niveles * 3 estrellas
          } else {
            act.completed = act.levelIds.every(id => progress?.[id]?.completed ?? false)
          }
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
  }, [levels, pathname])

  if (loading) {
    return <Loading message="CARGANDO_MAPA_SISTEMA..." icon="network" />
  }


  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) ">
      <main className="flex-1 container mx-auto px-8 pb-12 pt-0 relative z-10">
        <SectorHeader
          actId="00"
          actName="MAPA DE SECTORES"
          idLabel="SYS"
          tag="ST_NETWORK_ACTIVE"
          subtitle="EXPLORA LOS SECTORES FRAGMENTADOS"
          backHref="/"
          backLabel="HOME" variant='blue'
        >
          <ContainerHeader className="hidden md:flex flex-col items-center justify-center gap-2 ml-px p-5 bg-(--bg-deep)">
            <div className="flex items-center gap-3 opacity-60">
              <div className="flex flex-col">
                <span className="text-[7px] text-(--green-light) font-mono tracking-widest uppercase">INTERFACE_LINK</span>
                <span className="text-[12px] text-white font-mono tracking-widest uppercase font-black text-right">EN LÍNEA</span>
              </div>
              <div className="w-6 h-6 rounded-full border border-(--green-base) flex items-center justify-center relative">
                <div className="w-3 h-3 rounded-full bg-(--green-light) animate-ping opacity-50 absolute" />
                <div className="w-2 h-2 rounded-full bg-(--green-light)" />
              </div>
            </div>
          </ContainerHeader>
        </SectorHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {acts.map((act) => {
            const unlocked = isActUnlocked(act.number, levels)
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
    </div>
  )
}
