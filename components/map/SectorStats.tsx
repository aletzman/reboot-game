"use client"

import { Activity, Zap } from 'lucide-react'
import { ContainerHeader } from '../ui/ContainerHeader'

interface SectorStatsProps {
  totalStars: number
  maxStars: number
  integrity: number
  isLoading?: boolean
}

export function SectorStats({ totalStars, maxStars, integrity, isLoading }: SectorStatsProps) {
  return (
    <ContainerHeader className={`flex shrink-0 border-t md:border-t-0 md:border-l border-[#1a2636]/60 transition-opacity duration-700 ${isLoading ? 'opacity-40 animate-pulse' : 'opacity-100 animate-in fade-in'}`}>
      {/* Rendimiento */}
      <div className="px-6 py-4 flex flex-col justify-center min-w-[140px] relative group/stat border-r border-[#1a2636]/40 md:border-r-0">
        <div className="absolute inset-0 bg-(--amber)/5 opacity-0 transition-opacity" />
        <div className="flex items-center gap-2 mb-1.5 opacity-60">
          <Activity size={10} className="text-(--amber)" />
          <span className="text-[9px] font-mono text-(--text-muted) tracking-widest uppercase">RENDIMIENTO</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-mono font-black text-(--amber) drop-shadow-[0_0_8px_rgba(239,159,39,0.2)]">
            {totalStars}
          </span>
          <span className="text-[10px] font-mono text-(--text-muted)/40">/ {maxStars}</span>
        </div>
      </div>

      {/* Integridad */}
      <div className="px-6 py-4 flex flex-col justify-center min-w-[180px] relative group/stat border-l border-[#1a2636]/40">
        <div className="absolute inset-0 bg-(--green-base)/5 opacity-0 transition-opacity" />
        <div className="flex items-center gap-2 mb-1.5 opacity-60">
          <Zap size={10} className="text-(--green-light)" />
          <span className="text-[9px] font-mono text-(--text-muted) tracking-widest uppercase">INTEGRIDAD</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-2xl font-mono font-black ${integrity === 100 ? 'text-(--green-light)' : 'text-white'}`}>
            {integrity}%
          </span>
          <span className="text-[8px] font-mono text-(--text-muted)/40 uppercase tracking-tighter">DATA_STABLE</span>
        </div>
        {/* Micro Progress Bar */}
        <div className="flex gap-0.5 w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 relative overflow-hidden bg-[#1a2636]/50`}
            >
              <div
                className={`absolute inset-0 transition-all duration-700 ${(i / 10) * 100 < integrity
                  ? 'bg-(--green-base)'
                  : 'bg-transparent'
                  }`}
                style={{ transitionDelay: `${i * 30}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    </ContainerHeader>
  )
}
