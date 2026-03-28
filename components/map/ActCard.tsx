import React from 'react'
import Link from 'next/link'
import { ActSummary, ActNumber } from '@/types/game'
import { Star, ShieldAlert, CheckCircle2 } from 'lucide-react'

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
  isLocked,
  onClick
}: ActCardProps) {
  const maxStars = levelIds.length * 3 + (reviewLevelId ? 3 : 0)
  const completionPercentage = Math.round((totalStars / maxStars) * 100) || 0

  const baseStyles = "relative flex flex-col p-6 rounded-[4px] border border-(--bg-hover) bg-(--bg-elevated) transition-all duration-300 group overflow-hidden"
  const lockedStyles = isLocked 
    ? "opacity-60 cursor-not-allowed grayscale-[0.8]" 
    : "hover:border-(--green-base) hover:shadow-[0_0_30px_rgba(85,226,0,0.1)] cursor-pointer"

  const content = (
    <>
      {/* Background Glow */}
      {!isLocked && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-(--green-base) opacity-[0.03] blur-[60px] group-hover:opacity-[0.08] transition-opacity" />
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-(--green-light) font-mono text-sm tracking-widest uppercase">Sector-{number < 10 ? `0${number}` : number}</span>
            {completed && <CheckCircle2 size={12} className="text-(--green-light)" />}
          </div>
          <h3 className={`text-xl font-bold tracking-tight ${isLocked ? 'text-(--text-muted)' : 'text-(--text-primary)'}`}>
            {name || 'Sistema Desconocido'}
          </h3>
        </div>
        {isLocked && <ShieldAlert size={20} className="text-(--red) opacity-50" />}
      </div>

      <div className="mt-auto space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-(--text-muted) uppercase tracking-wider">
            <span>Sincronización</span>
            <span className={completed ? 'text-(--green-light)' : 'text-(--text-primary)'}>{completionPercentage}%</span>
          </div>
          <div className="h-1 bg-(--bg-void) rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${completed ? 'bg-(--green-light)' : 'bg-(--green-base)'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
          <span className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-widest">Niveles</span>
            <span className="text-lg font-mono text-(--text-primary)">{levelIds.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-widest">Estrellas</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-mono text-(--amber)">{totalStars}</span>
              <Star size={12} className="text-(--amber) fill-(--amber) opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Hover Reveal Effect */}
      {!isLocked && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-(--green-light) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
