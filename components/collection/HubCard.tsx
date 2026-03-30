"use client"

import Link from 'next/link'
import { motion } from 'motion/react'
import { ZapIcon } from 'lucide-react'

/**
 * HubCard Component
 * A reusable container for the high-fidelity industrial selection cards
 */
interface HubCardProps {
  href: string
  title: string
  subtitle: string
  description: string
  tag: string
  id: string
  color: 'green' | 'amber'
  icon: any
  visualContent: React.ReactNode
  isEmpty?: boolean
}

export function HubCard({ href, title, subtitle, description, tag, id, color, icon: Icon, visualContent, isEmpty = false }: HubCardProps) {
  const isGreen = color === 'green'
  const accentColor = isEmpty ? 'var(--text-ghost)' : (isGreen ? 'var(--green-light)' : 'var(--amber)')
  const accentMuted = isGreen ? 'var(--green-dark)' : '#4a3a10'

  const CardWrapper = isEmpty ? 'div' : Link
  const wrapperProps = isEmpty ? {} : { href }

  return (
    <CardWrapper {...(wrapperProps as any)} className={`h-full ${isEmpty ? 'cursor-not-allowed' : 'group'}`}>
      <div
        className={`relative h-full min-h-[500px] flex flex-col bg-(--bg-surface) border-r-4 border-l-4 transition-all duration-500 overflow-hidden shadow-2xl ${isEmpty
          ? 'opacity-40 grayscale border-[#0d1117]'
          : 'border-[#1a2636] group-hover:border-(--bg-hover)'
          }`}
        style={{ perspective: '1200px' }}
      >
        {/* RACK RAILS - LEFT */}
        <div className="absolute left-0 inset-y-0 w-6 bg-[#0d1117] border-r border-white/5 flex flex-col items-center py-4 gap-12 z-40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-black shadow-[inset_0_1px_2px_black] border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/5" />
            </div>
          ))}
        </div>

        {/* RACK RAILS - RIGHT */}
        <div className="absolute right-0 inset-y-0 w-6 bg-[#0d1117] border-l border-white/5 flex flex-col items-center py-4 gap-12 z-40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-black shadow-[inset_0_1px_2px_black] border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/5" />
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col ml-6 mr-6 relative">
          {/* CABINET TOP HEADER */}
          <div className="h-12 border-b border-[#1a1f26] bg-[#0c1015] flex items-center justify-between px-6 relative z-20">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-4 skew-x-[-15deg] transition-all duration-500 ${isEmpty
                ? 'bg-(--text-ghost)'
                : (isGreen ? 'bg-(--green-light) shadow-[0_0_8px_var(--green-light)]' : 'bg-(--amber) shadow-[0_0_8px_var(--amber)]')
                }`} />
              <div className="flex flex-col">
                <span className={`text-xs font-mono font-black uppercase tracking-widest ${isEmpty ? 'text-(--text-ghost)' : 'text-white/90'}`}>{tag}</span>
                <span className="text-[9px] font-mono text-(--text-muted) uppercase tracking-tighter">{id}</span>
              </div>
            </div>
            <Icon className={`w-3.5 h-3.5 transition-colors ${isEmpty ? 'text-black/40' : 'text-(--text-ghost) group-hover:text-white'}`} strokeWidth={1.5} />
          </div>

          {/* MAIN VISUAL CHAMBER - Recessed Effect */}
          <div className={`h-[160px] flex-none relative overflow-hidden flex items-center justify-center p-6 border-b border-[#1a1f26] ${isEmpty ? 'bg-black/80' : 'bg-black/60 shadow-[inset_0_20px_50px_black]'}`}>
            {/* Background Technical Noise */}
            {!isEmpty && (
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, ${accentColor} 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />
            )}

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_3px)] h-[200%]" />
            </div>

            {/* Dynamic Visual Content */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center transition-opacity duration-700 ${isEmpty ? 'opacity-10' : 'opacity-100'}`}>
              {visualContent}
              {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-[1em] rotate-90 whitespace-nowrap">EMPTY_SLOT</div>
                </div>
              )}
            </div>

            {/* INTERNAL VENTS (Lateral) */}
            <div className={`absolute left-0 inset-y-0 w-2 flex flex-col justify-center gap-1.5 opacity-20 ${!isEmpty && 'group-hover:opacity-40'} transition-opacity`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-black/80 border-r border-white/5" />
              ))}
            </div>
          </div>

          {/* INFO MODULE */}
          <div className="p-6 px-5 relative z-20 flex-1 bg-linear-to-b from-transparent to-black/40 flex flex-col justify-start">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className={`text-xl font-black tracking-widest uppercase mb-1 ${isEmpty ? 'text-white/20' : 'text-white'}`}>
                  {isEmpty ? 'VACÍO' : title}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-px w-6 bg-white/10" />
                  <span className={`text-[9px] font-mono uppercase tracking-[0.4em] transition-colors`} style={{ color: isEmpty ? 'var(--text-ghost)' : accentColor }}>
                    {isEmpty ? 'RACK_UNIT_AVAILABLE' : subtitle}
                  </span>
                </div>
              </div>

              <p className={`text-(--text-muted) font-mono text-[10px] leading-relaxed uppercase tracking-wider transition-opacity max-w-sm ${isEmpty ? 'opacity-20' : 'opacity-60 group-hover:opacity-100'}`}>
                {isEmpty ? 'SISTEMA DE ALMACENAMIENTO DISPONIBLE. ASIGNACIÓN DE HARDWARE PENDIENTE.' : description}
              </p>
            </div>

            {/* STATUS LIGHTS */}
            <div className="absolute bottom-5 right-8 flex gap-1.5">
              <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isEmpty ? 'bg-red-900/40' : 'animate-pulse'}`} style={{ backgroundColor: isEmpty ? undefined : accentColor }} />
              <div className="w-1 h-1 rounded-full bg-white/5" />
              <div className="w-1 h-1 rounded-full bg-white/5" />
            </div>
          </div>

          {/* ACTION PANEL (Footer) */}
          <div className="h-14 border-t border-[#1a1f26] bg-[#0c1015] flex items-center justify-between px-8 relative overflow-hidden transition-colors group-hover:bg-black/80">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-(--text-ghost) uppercase tracking-widest">UNIT_STATUS</span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isEmpty ? 'text-red-900/60' : 'text-white/80'}`}>
                  {isEmpty ? 'OFFLINE' : 'MOUNTED'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] transition-transform ${!isEmpty && 'group-hover:translate-x-[-8px]'}`} style={{ color: accentColor }}>
                {isEmpty ? 'LOCKED' : 'ACCESS'}
              </span>
              <ZapIcon className={`w-4 h-4 transition-all duration-300 ${!isEmpty && 'group-hover:scale-120'}`} style={{ color: accentColor }} />
            </div>

            {/* Hover Glow Background */}
            {!isEmpty && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{ backgroundColor: accentColor }} />
            )}
          </div>

          {/* MECHANICAL HANDLE (Bottom) */}
          <div className="h-4 bg-[#0d1117] border-t border-white/5 flex items-center justify-center gap-1.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-1 rounded-full bg-black border-t border-white/5" />
            ))}
          </div>
        </div>

        {/* PHYSICAL CORNER BRACKETS */}
        <div className="absolute top-0 left-6 w-8 h-8 pointer-events-none z-30 opacity-20">
          <div className="absolute top-4 left-4 w-4 h-px bg-white" />
          <div className="absolute top-4 left-4 h-4 w-px bg-white" />
        </div>
        <div className="absolute bottom-0 right-6 w-8 h-8 pointer-events-none z-30 rotate-180 opacity-20">
          <div className="absolute top-4 left-4 w-4 h-px bg-white" />
          <div className="absolute top-4 left-4 h-4 w-px bg-white" />
        </div>
      </div>
    </CardWrapper>
  )
}
