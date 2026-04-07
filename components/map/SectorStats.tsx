"use client"

import { Activity, Zap } from 'lucide-react'
import { ContainerHeader } from '../ui/ContainerHeader'
import { Screw } from '@/components/ui/Screw'

interface SectorStatsProps {
  totalStars: number
  maxStars: number
  integrity: number
  isLoading?: boolean
}

export function SectorStats({ totalStars, maxStars, integrity, isLoading }: SectorStatsProps) {
  return (
    <ContainerHeader className={`relative flex shrink-0 items-center gap-px p-2.5 border-t md:border-t-0 md:border-l border-black/80 bg-linear-to-b from-[#1e252b] to-[#14191e] shadow-lg transition-opacity duration-700 ${isLoading ? 'opacity-40 animate-pulse' : 'opacity-100 animate-in fade-in'}`}>


      {/* Tornillos del chasis */}
      <div className="absolute left-1 top-1 opacity-20"><Screw size="sm" /></div>
      <div className="absolute left-1 bottom-1 opacity-20"><Screw size="sm" /></div>

      {/* ─── PANTALLA 1: RENDIMIENTO ─── */}
      <div className="relative flex flex-col justify-between h-full px-4 pt-2.75 pb-4 bg-[#030406] rounded-[2px] border border-black/90 shadow-[inset_0_0_15px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] overflow-hidden group">

        {/* Reflejo del cristal superior */}
        <div className="absolute top-0 inset-x-0 h-1/3 bg-linear-to-b from-white/4to-transparent pointer-events-none z-10" />
        {/* Scanlines de la pantalla */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] z-0" />


        <div className="flex items-center gap-1.5 mb-1">
          <Activity size={10} className="text-(--amber) drop-shadow-[0_0_5px_var(--amber)]" />
          <span className="text-[9px] font-mono font-bold text-(--amber) opacity-80 tracking-widest uppercase">
            Rendimiento
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-mono font-black text-(--amber) drop-shadow-[0_0_10px_var(--amber)] leading-none tracking-tight">
            {totalStars}
          </span>
          <span className="text-xs font-mono font-black text-(--amber) opacity-40">
            /{maxStars}
          </span>
        </div>

      </div>

      {/* ─── PANTALLA 2: INTEGRIDAD ─── */}
      <div className="relative flex flex-col justify-between px-4 py-2.5 min-w-[160px] h-full bg-[#030406] rounded-[2px] border border-black/90 shadow-[inset_0_0_15px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] overflow-hidden group">

        {/* Reflejo del cristal superior */}
        <div className="absolute top-0 inset-x-0 h-1/3 bg-linear-to-b from-white/4 to-transparent pointer-events-none z-10" />
        {/* Scanlines de la pantalla */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] z-0" />

        <div className="relative z-20 flex flex-col h-full justify-between gap-2">

          {/* Header de la pantalla */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-(--green-light) drop-shadow-[0_0_5px_var(--green-light)]" />
              <span className="text-[9px] font-mono font-bold text-(--green-light) opacity-80 tracking-widest uppercase">
                Integridad
              </span>
            </div>
            <span className={`text-[8px] font-mono font-black uppercase tracking-tighter animate-pulse
              ${integrity === 100 ? 'text-(--green-base)' : 'text-zinc-600'}`}>
              {integrity === 100 ? 'SYS_OPT' : 'STABLE'}
            </span>
          </div>

          {/* Porcentaje y Barra (Display LED) */}
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-2xl font-mono font-black leading-none tracking-tight
                ${integrity === 100 ? 'text-(--green-base) drop-shadow-[0_0_10px_var(--green-base)]' : 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}>
                {integrity}%
              </span>
            </div>

            {/* Micro barra LED dentro de la pantalla */}
            <div className="flex gap-[2px] h-[4px] w-full bg-black rounded-sm overflow-hidden p-px">
              {Array.from({ length: 10 }).map((_, i) => {
                const active = (i / 10) * 100 < integrity;
                return (
                  <div
                    key={i}
                    className={`h-full flex-1 rounded-sm transition-all duration-700
                      ${active
                        ? 'bg-(--green-base) shadow-[0_0_5px_var(--green-base)] opacity-100'
                        : 'bg-zinc-900 opacity-50'
                      }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  />
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </ContainerHeader>
  )
}