import React from 'react'
import Link from 'next/link'
import { LevelType } from '@/types/game'
import { Star } from 'lucide-react'

interface LevelNodeProps {
  id: string
  actId: number
  title: string
  type: LevelType
  stars: 0 | 1 | 2 | 3
  completed: boolean
  isLocked: boolean
  x: number | string // pos horizontal
  y: number | string // pos vertical
  isReview?: boolean
}

export function LevelNode({
  id,
  actId,
  title,
  type,
  stars,
  completed,
  isLocked,
  x,
  y,
  isReview = false
}: LevelNodeProps) {
  const getIcon = () => {
    if (isReview) return '◈'
    switch (type) {
      case 'noderoutine': return '⎔'
      case 'logicassembly': return '⊞'
      case 'codeeditor': return 'JS'
      case 'speedtyping': return '⌨'
      case 'cinematic': return '▶'
      default: return '●'
    }
  }

  const baseStyles = "absolute flex flex-col items-center justify-center transition-all duration-300 group"
  const nodeStyles = `
    w-12 h-12 rounded-full flex items-center justify-center border-2 font-mono text-lg
    ${isLocked 
      ? 'bg-(--bg-void) border-(--bg-hover) text-(--text-ghost) cursor-not-allowed' 
      : completed 
        ? 'bg-(--green-darkest) border-(--green-base) text-(--green-light) shadow-[0_0_15px_rgba(85,226,0,0.2)]' 
        : 'bg-(--bg-surface) border-(--text-ghost) text-(--text-muted) hover:border-(--green-base) hover:text-(--green-light)'
    }
    ${isReview ? 'rotate-45' : ''}
  `

  const content = (
    <>
      <div className={nodeStyles}>
        <span className={isReview ? '-rotate-45' : ''}>{getIcon()}</span>
      </div>
      
      {/* Tooltip/Title */}
      <div className="absolute top-14 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        <div className="bg-(--bg-elevated) border border-(--bg-hover) px-3 py-1 rounded text-[10px] uppercase tracking-widest text-(--text-primary)">
          {title}
        </div>
      </div>

      {/* Stars */}
      {!isLocked && (
        <div className="absolute -top-6 flex gap-0.5">
          {[1, 2, 3].map((s) => (
            <Star 
              key={s} 
              size={10} 
              className={s <= stars ? "fill-(--amber) text-(--amber)" : "text-(--text-ghost)"} 
            />
          ))}
        </div>
      )}
    </>
  )

  return (
    <div 
      className={baseStyles} 
      style={{ 
        left: typeof x === 'number' ? `${x}%` : x, 
        top: typeof y === 'number' ? `${y}%` : y, 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      {isLocked ? (
        <div className="flex flex-col items-center">
          {content}
        </div>
      ) : (
        <Link href={`/game/${actId}/level/${id}`} className="flex flex-col items-center">
          {content}
        </Link>
      )}
    </div>
  )
}
