"use client"

import Link from 'next/link'
import { ZapIcon } from 'lucide-react'
import { Screw } from '@/components/ui/Screw' // Reusing Screw component for industrial hardware feel

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
  const accentColor = isEmpty ? 'var(--text-ghost)' : (isGreen ? 'var(--green-base)' : 'var(--amber)')
  const accentLight = isEmpty ? 'var(--text-ghost)' : (isGreen ? 'var(--green-light)' : 'var(--amber)')

  const CardWrapper = isEmpty ? 'div' : Link
  const wrapperProps = isEmpty ? {} : { href }

  // Contenedor principal: El "Socket" (cavidad oscura que contiene los rieles y el módulo)
  const baseStyles = "relative flex h-full bg-[#030405] transition-all font-mono group rounded-md border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)] overflow-hidden"
  
  const lockedStyles = isEmpty
    ? "opacity-60 cursor-not-allowed grayscale pointer-events-none"
    : "cursor-pointer"

  return (
    <CardWrapper {...(wrapperProps as any)} className={`${baseStyles} ${lockedStyles}`}>
      
      {/* ─── RACK RAIL - IZQUIERDO ─── */}
      <div className="w-8 shrink-0 border-r border-[#010101] bg-[linear-gradient(90deg,#07090D,#141922,#07090D)] flex flex-col items-center py-6 gap-[1.35rem] shadow-[inset_-3px_0_6px_rgba(0,0,0,0.8),inset_1px_0_1px_rgba(255,255,255,0.03)] z-20 relative">
         <div className="absolute inset-y-0 left-0 w-full opacity-[0.05] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[4px_4px] pointer-events-none" />
         
         {/* Agujeros del Rack (Square Cage Nut Holes) */}
         {[...Array(9)].map((_, i) => (
           <div key={`l-${i}`} className="relative w-[14px] h-[14px] rounded-[2px] bg-[#020202] border-t-black border-b-white/10 flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,1)]">
             <div className="w-2 h-2 rounded-[1px] bg-[#010101]" />
           </div>
         ))}
      </div>

      {/* ─── ZONA DEL PLUNGER (Módulo Extraíble) ─── */}
      <div className="flex-1 flex flex-col p-[2px] bg-[#030405] relative z-10 shadow-[0_0_15px_rgba(0,0,0,1)]">
        <article className={`relative flex flex-col h-full min-h-[460px] rounded-[1px] overflow-hidden bg-[linear-gradient(180deg,#161b22,#0a0d11)] transition-all duration-300 ease-out z-10 border-2
          ${isEmpty
            ? 'border-[#1a2026] shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
            : `border-[#1c2229] group-hover:border-${isGreen ? '(--green-base)' : '(--amber)'}/60 shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:shadow-[0_8px_24px_rgba(${isGreen ? '126,213,38' : '239,159,39'},0.25)] group-hover:-translate-y-[2px] group-active:translate-y-px group-active:shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:bg-[linear-gradient(180deg,#1d242d,#0e1217)]`
          }
        `}>

        {/* ─── HEADER: METALLIC SUPERIOR ─── */}
        <header className="relative flex items-center justify-between px-3 h-[42px] border-b border-black bg-[linear-gradient(90deg,#0a0d11,#161C23,#0a0d11)] z-20 shadow-[0_4px_6px_rgba(0,0,0,0.6)]">

          {/* ESTRUCTURA DE PANEL (EL BISEL) */}
          <div className="absolute inset-[4px] border border-black/60 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] pointer-events-none" />

          {/* TEXTURA DE CARBONO */}
          <div className="absolute left-[4px] right-[4px] top-[4px] bottom-[4px] rounded-sm opacity-[0.08] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[4px_4px] pointer-events-none" />

          {/* Luz Glow Line superior */}
          {!isEmpty && (
            <div className="absolute top-0 inset-x-0 h-[2px] transition-all duration-300 opacity-60 group-hover:opacity-100"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
          )}

          <div className="flex items-center gap-2 ml-1 relative z-10">
            <div className="opacity-40"><Screw size="sm" /></div>
            <div className={`w-1.5 h-3.5 rounded-[1px] shadow-[0_0_8px_currentColor] transition-colors duration-500
              ${isEmpty ? 'bg-red-900 text-red-900' : isGreen ? 'bg-(--green-base) text-(--green-base)' : 'bg-(--amber) text-(--amber) animate-pulse'}
            `} />
            <span className="text-[11px] font-black tracking-widest leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-[#E6EDF3]">
              {tag}
            </span>
          </div>

          <div className="flex items-center gap-3 mr-1 relative z-10">
            <span className="text-[9px] text-(--text-muted)/45 hidden md:inline font-bold drop-shadow-md">{id}</span>
            <div className={`p-1 rounded-sm border border-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] bg-[#05070a]`}>
              <Icon className={`w-3.5 h-3.5 transition-colors ${!isEmpty ? (isGreen ? 'text-(--green-base) drop-shadow-[0_0_4px_var(--green-base)]' : 'text-(--amber) drop-shadow-[0_0_4px_var(--amber)]') : 'text-(--text-ghost)'}`} />
            </div>
            <div className="opacity-40"><Screw size="sm" /></div>
          </div>
        </header>

        {/* ─── PANTALLA PRINCIPAL: INSET CRT DISPLAY ─── */}
        <div className={`flex-1 relative flex flex-col z-10 ${isEmpty ? 'bg-[#020304]' : 'bg-[#0C1117]'} shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] overflow-hidden`}>
          {/* Grid pattern / scanlines industriales */}
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)] pointer-events-none z-0" />

          {/* VISUAL CHAMBER - Upper section */}
          <div className="relative h-[180px] w-full flex items-center justify-center p-6 border-b border-[#05070a] bg-black/40 overflow-hidden shadow-[inset_0_20px_50px_black] z-10">
            {/* Scanline Effect inside the chamber */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_3px)] h-[200%]" />
            </div>

            {/* Dynamic Visual Content */}
            <div className={`relative z-20 w-full h-full flex items-center justify-center transition-opacity duration-700 ${isEmpty ? 'opacity-10' : 'opacity-100'}`}>
              {visualContent}
              {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-[1em] rotate-90 whitespace-nowrap">VACÍO</div>
                </div>
              )}
            </div>

            {/* VENTS Inside Visual Chamber */}
            <div className={`absolute left-0 inset-y-0 w-2 flex flex-col justify-center gap-1.5 opacity-20 ${!isEmpty && 'group-hover:opacity-40'} transition-opacity`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-black/80 border-r border-white/5" />
              ))}
            </div>
          </div>

          {/* LOWER SECCTION: INFO & DESC */}
          <div className="flex-1 p-5 relative z-10 flex flex-col">
            <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
              ${isEmpty ? 'text-(--text-ghost)' : 'text-[#E6EDF3] transition-colors'}`}>
              {isEmpty ? 'VACÍO' : title}
            </h3>

            <div className="mt-2 text-[10px] uppercase tracking-widest flex items-center gap-1.5 opacity-80">
              <span className="text-(--text-muted) font-extrabold">{subtitle}</span>
            </div>

            <p className={`mt-4 text-(--text-muted) font-mono text-[11px] leading-relaxed uppercase tracking-wider transition-opacity max-w-sm drop-shadow-md ${isEmpty ? 'opacity-40' : 'opacity-80 group-hover:opacity-100'}`}>
              {isEmpty ? 'ESPACIO DISPONIBLE PARA ASIGNACIÓN DE HARDWARE.' : description}
            </p>

            {/* STATUS LIGHTS OR BAR */}
            <div className="mt-auto space-y-4 pt-6">
              {/* Decorative elements representing status/telemetry */}
              <div className="flex justify-between items-center bg-[#020304] border border-[#1c2229] rounded-[3px] p-2.5 shadow-[inset_0_6px_12px_rgba(0,0,0,1)]">
                <span className="text-[9px] text-(--text-muted)/70 font-bold uppercase tracking-widest leading-none">
                  ESTADO_DEL_BLOQUE
                </span>

                <div className="flex items-center gap-2 flex-none">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isEmpty ? 'text-[#3D444D]' : 'text-white/80'}`}>
                    {isEmpty ? 'OFFLINE' : 'MOUNTED'}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isEmpty ? 'bg-red-900/40' : 'animate-pulse'}`} style={{ backgroundColor: isEmpty ? undefined : accentLight }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CAPA 4: FOOTER ESTATUS ─── */}
        <footer className={`px-4 h-[46px] flex items-center justify-between border-t border-black bg-[linear-gradient(180deg,#12161A_0%,#090B0D_100%)] z-20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.02)] relative
          ${!isEmpty ? 'group-hover:bg-[#161a20]' : ''}
        `}>
          {!isEmpty ? (
            <>
              <div className="flex flex-col mt-0.5">
                <span className="text-[9px] text-(--text-muted)/85 uppercase tracking-widest font-black leading-none mb-1">PROTOCOLO</span>
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]`} style={{ color: accentLight }}>
                  ACCESO AUTORIZADO
                </span>
              </div>

              {/* Tag Digital Plano (Integrado) */}
              <div className="flex items-center justify-center gap-1.5 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_currentColor]" style={{ color: accentLight }}>
                <span className={`text-[9px] font-black tracking-widest uppercase`}>
                  ENTRAR
                </span>
                <ZapIcon className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform`} strokeWidth={3} />
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-center opacity-60">
              <span className="text-[10px] text-[#3D444D] font-black uppercase tracking-[0.3em] drop-shadow-md">MODULO_BLOQUEADO</span>
            </div>
          )}
        </footer>
        </article>
      </div>

      {/* ─── RACK RAIL - DERECHO ─── */}
      <div className="w-8 shrink-0 border-l border-[#010101] bg-[linear-gradient(90deg,#07090D,#141922,#07090D)] flex flex-col items-center py-6 gap-[1.35rem] shadow-[inset_3px_0_6px_rgba(0,0,0,0.8),inset_-1px_0_1px_rgba(255,255,255,0.03)] z-20 relative">
         <div className="absolute inset-y-0 right-0 w-full opacity-[0.05] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[4px_4px] pointer-events-none" />
         
         {[...Array(9)].map((_, i) => (
           <div key={`r-${i}`} className="relative w-[14px] h-[14px] rounded-[2px] bg-[#020202] border-t-black border-b-white/10 flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,1)]">
             <div className="w-2 h-2 rounded-[1px] bg-[#010101]" />
           </div>
         ))}
      </div>
    </CardWrapper>
  )
}
