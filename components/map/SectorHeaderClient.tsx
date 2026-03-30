"use client"

import { useState, useEffect } from 'react'
import { getActSummary } from '@/lib/gameState'
import { ActSummary, ActNumber, Level } from '@/types/game'
import { SectorStats } from './SectorStats'

interface Props {
  actId: string
  levels: Level[]
}

export default function ({ actId, levels }: Props) {
  const [act, setAct] = useState<ActSummary | null>(null)

  useEffect(() => {
    const actNum = parseInt(actId) as ActNumber
    const summary = getActSummary(actNum, levels)
    setAct(summary)
  }, [actId, levels])

  if (!act) {
    return (
      <SectorStats
        totalStars={0}
        maxStars={0}
        integrity={0}
        isLoading={true}
      />
    )
  }

  const actProgress = Math.round((act.totalStars / (act.maxStars || 1)) * 100)

  return (
    <SectorStats
      totalStars={act.totalStars}
      maxStars={act.maxStars}
      integrity={actProgress}
    />
  )
}
