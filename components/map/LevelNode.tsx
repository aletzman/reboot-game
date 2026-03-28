import React from 'react'
import Link from 'next/link'
import { LevelType } from '@/types/game'

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
      case 'puzzle-sort': return '⇕'
      case 'puzzle-fill': return '▤'
      case 'puzzle-bug': return '⚲'
      case 'puzzle-match': return '⇄'
      default: return '●'
    }
  }

  const baseStyles = "absolute flex flex-col items-center justify-center transition-all duration-300 group"
  
  // Industrial Cyberdeck Node style
  const nodeStyles = `
    relative flex items-center justify-center font-mono text-xl w-16 h-16 transform transition-all duration-500
    ${isLocked 
      ? 'rotate-45 border border-[#1a2636] bg-[#080c11] text-[#1a2636] cursor-not-allowed opacity-60' 
      : completed 
        ? 'rotate-45 border-2 border-(--green-base) bg-(--green-darkest) text-(--green-light) shadow-[0_0_20px_rgba(85,226,0,0.3)] hover:scale-110 hover:shadow-[0_0_30px_rgba(85,226,0,0.5)]' 
        : 'rotate-45 border-2 border-[#12b0bb] bg-[#0c1218] text-white hover:border-(--green-light) hover:bg-[#1a2636] hover:scale-110 shadow-[0_0_15px_rgba(18,176,187,0.2)]'
    }
    ${isReview ? 'scale-125' : ''}
  `

  const content = (
    <div className="relative flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
      
      {/* Decorative hardware side connectors */}
      <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-1.5 ${completed ? 'bg-(--green-base)' : 'bg-[#1a2636]'}`} />
      <div className={`absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-1.5 ${completed ? 'bg-(--green-base)' : 'bg-[#1a2636]'}`} />

      {/* Main Node Frame */}
      <div className={nodeStyles}>
        {/* Core background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)` }}
        />
        
        {/* Undo rotation for inner content so text/icon is straight */}
        <div className={`-rotate-45 flex flex-col items-center justify-center w-full h-full relative z-10`}>
          <span className={`leading-none drop-shadow-[0_0_8px_currentColor] text-2xl font-black ${!completed && !isLocked ? 'text-[#12b0bb]' : ''}`}>
            {getIcon()}
          </span>
        </div>
      </div>
      
      {/* Decorative Core Glow */}
      {completed && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-(--green-light) rounded-full shadow-[0_0_12px_var(--green-light)] animate-pulse pointer-events-none z-20" />}

      {/* Industrial Stars Badge */}
      {!isLocked && (
        <div className="absolute -top-7 z-20 bg-[#0a0f14] border border-[#1a2636] px-2 py-1 flex gap-1.5 transform -skew-x-12 shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-2 h-3 skew-x-12 transition-all duration-300 ${s <= stars ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)]' : 'bg-[#1a2636]'}`} 
            />
          ))}
        </div>
      )}
    </div>
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
        <div className="flex flex-col items-center outline-none">
          {content}
        </div>
      ) : (
        <Link href={`/game/${actId}/level/${id}`} className="flex flex-col items-center outline-none cursor-pointer">
          {content}
        </Link>
      )}
    </div>
  )
}
