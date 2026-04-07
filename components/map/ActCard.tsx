import Link from 'next/link'
import { ActSummary } from '@/types/game'
import { LockIcon, ServerIcon, CheckCircle2Icon, ShieldAlertIcon, ChevronRightIcon, CpuIcon, ActivityIcon } from 'lucide-react'
import { Screw } from '@/components/ui/Screw'

interface ActCardProps extends ActSummary {
  isLocked: boolean
  onClick?: () => void
}

export function ActCard({
  number,
  name,
  levelIds,
  completed,
  totalStars,
  maxStars: maxStarsProp,
  isLocked,
  onClick
}: ActCardProps) {
  const maxStars = maxStarsProp
  const completionPercentage = Math.round(((totalStars) / maxStars) * 100) || 0

  // Contenedor principal: El "Socket" (cavidad oscura)
  const baseStyles = "relative flex flex-col h-full bg-[#030405] transition-all font-mono group rounded-md p-[2px] border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)]"

  const lockedStyles = isLocked
    ? "opacity-60 cursor-not-allowed grayscale pointer-events-none"
    : "cursor-pointer"

  const glowColor = completed ? 'var(--green-base)' : 'var(--amber)'
  const themeColor = completed ? '(--green-base)' : isLocked ? '(--text-ghost)' : '(--amber)'
  const themeLight = completed ? '(--green-light)' : isLocked ? '(--text-ghost)' : '(--amber)'

  const content = (
    // La tarjeta en sí: El "Plunger" (módulo que se hunde al clickear)
    <article className={`relative flex flex-col h-full rounded-sm overflow-hidden bg-[linear-gradient(180deg,#161b22,#0a0d11)] transition-all duration-300 ease-out z-10 border-2
      ${isLocked
        ? 'border-[#1a2026] shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
        : `border-[#1c2229] group-hover:border-${themeColor}/60 shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:shadow-[0_8px_24px_rgba(${completed ? '126,213,38' : '239,159,39'},0.25)] group-hover:-translate-y-[2px] group-active:translate-y-px group-active:shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:bg-[linear-gradient(180deg,#1d242d,#0e1217)]`
      }
    `}>

      {/* ─── HEADER: METALLIC SUPERIOR ─── */}
      <header className="relative flex items-center justify-between px-3 h-[42px] border-b border-black bg-[linear-gradient(90deg,#0a0d11,#161C23,#0a0d11)] z-20 shadow-[0_4px_6px_rgba(0,0,0,0.6)]">

        {/* 1. ESTRUCTURA DE PANEL (EL BISEL) */}
        <div className="absolute inset-[4px] border border-black/60 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] pointer-events-none" />

        {/* 2. TEXTURA DE FIBRA / CARBONO */}
        <div className="absolute left-[4px] right-[4px] top-[4px] bottom-[4px] rounded-sm opacity-[0.08] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[4px_4px] pointer-events-none" />

        {/* Luz Glow Line superior */}
        {!isLocked && (
          <div className="absolute top-0 inset-x-0 h-[2px] transition-all duration-300 opacity-60 group-hover:opacity-100"
            style={{ backgroundColor: glowColor, boxShadow: `0 0 10px ${glowColor}` }} />
        )}

        <div className="flex items-center gap-2 ml-1 relative z-10">
          <div className="opacity-40"><Screw size="sm" /></div>
          <div className={`w-1.5 h-3.5 rounded-[1px] shadow-[0_0_8px_currentColor] transition-colors duration-500
            ${isLocked ? 'bg-red-900 text-red-900' : completed ? 'bg-(--green-base) text-(--green-base)' : 'bg-(--amber) text-(--amber) animate-pulse'}
          `} />
          <span className="text-[11px] font-black tracking-widest text-[#E6EDF3] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            SEC_{number < 10 ? `0${number}` : number}
          </span>
        </div>

        <div className="flex items-center gap-3 mr-1 relative z-10">
          <span className="text-[9px] text-(--text-muted)/45 hidden md:inline font-bold drop-shadow-md">0x{number}A{levelIds.length}</span>
          <div className={`p-1 rounded-sm border border-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] bg-[#05070a]`}>
            {isLocked ? (
              <LockIcon className="w-3.5 h-3.5 text-(--text-ghost)" />
            ) : (
              <ServerIcon className={`w-3.5 h-3.5 transition-colors ${completed ? 'text-(--green-base) drop-shadow-[0_0_4px_var(--green-base)]' : 'text-(--amber) drop-shadow-[0_0_4px_var(--amber)]'}`} />
            )}
          </div>
          <div className="opacity-40"><Screw size="sm" /></div>
        </div>
      </header>

      {/* ─── PANTALLA PRINCIPAL: INSET CRT DISPLAY ─── */}
      <div className={`flex-1 p-5 relative flex flex-col z-10 ${isLocked ? 'bg-[#020304]' : 'bg-[#0C1117]'} shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] overflow-hidden`}>

        {/* Grid pattern / scanlines industriales */}
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)] pointer-events-none z-0" />

        <div className="relative flex-1 flex flex-col z-10 h-full">
          {/* Título de Zona */}
          <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
              ${isLocked ? 'text-(--text-ghost)' : 'text-(--text-primary) transition-colors'}`}>
            {name || 'ZONA_DESCONOCIDA'}
          </h3>

          <div className="mt-2 text-[10px] uppercase tracking-widest flex items-center gap-1.5 opacity-80">
            {completed ? <CheckCircle2Icon className={`w-3 h-3 text-${themeColor}`} /> : isLocked ? <ShieldAlertIcon className="w-3 h-3 text-(--text-ghost)" /> : <ActivityIcon className={`w-3 h-3 text-${themeColor}`} />}
            <span className={`text-${themeColor} font-extrabold`}>
              {completed ? 'SISTEMA SEGURO' : isLocked ? 'BLOQUEO DE RED' : 'ESCANEANDO...'}
            </span>
          </div>

          <div className="mt-auto space-y-4 pt-6">

            {/* ─── BARRA DE PROGRESO ─── */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.2em] text-[#8B949E] px-0.5">
                <span>INTEGRIDAD_SECTOR</span>
                <span className={`text-${themeLight} drop-shadow-md`}>
                  {completionPercentage}%
                </span>
              </div>

              {/* Riel métrico ultra-profundo */}
              <div className="flex gap-[3px] h-4 p-[3px] bg-[#020203] rounded-sm border-t border-(--bg-void)/50  border-b shadow-[inset_0_4px_10px_rgba(0,0,0,1),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
                {Array.from({ length: 15 }).map((_, i) => {
                  const filled = (i / 15) * 100 < completionPercentage;
                  return (
                    <div
                      key={i}
                      className={`flex-1 transition-all duration-500 rounded-[1px] relative overflow-hidden
                        ${filled
                          ? `bg-${themeColor} shadow-[0_0_8px_var(--${completed ? 'green-base' : 'amber'})] group-hover:shadow-[0_0_12px_var(--${completed ? 'green-light' : 'amber'})] border border-black/40`
                          : 'bg-[#0d1218] border border-black/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]'
                        }
                      `}
                    >
                      {/* Pequeño reflejo cristalino en cada LED */}
                      {filled && <div className="absolute top-0 left-0 right-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,transparent_100%)] pointer-events-none" />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ─── TELEMETRÍA (Display Técnico Profundo) ─── */}
            <div className="grid grid-cols-2 gap-3 h-[56px]">

              {/* Display Panel - Nodos */}
              <div className="relative bg-[#020304] border border-(--bg-void) border-b-[#1c2229] rounded-[3px] p-2.5 flex flex-col justify-center shadow-[inset_0_6px_12px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
                {/* Reflejo de pantalla CRT */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none" />

                <span className="text-[10px] text-(--text-muted)/70 font-bold uppercase tracking-widest leading-none mb-1">RUTAS_SECTOR</span>
                <span className={`text-lg font-black leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] ${isLocked ? 'text-(--text-ghost)' : 'text-[#E6EDF3]'}`}>
                  {levelIds.length}
                </span>
              </div>

              {/* Display Panel - PWR */}
              <div className={`relative bg-[#020304] border border-(--bg-void) border-b-[#1c2229] rounded-[3px] p-2.5 flex flex-col justify-center shadow-[inset_0_6px_12px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] overflow-hidden transition-colors duration-500
                    ${!isLocked && `group-hover:shadow-[inset_0_2px_12px_rgba(0,0,0,1),0_0_6px_var(--${completed ? 'green-base' : 'amber'})_inset]`}
                `}>
                {/* Reflejo de pantalla CRT */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none" />

                <span className="text-[10px] text-(--text-muted)/70 font-bold uppercase tracking-widest leading-none mb-1">EFICIENCIA</span>
                <span className={`text-lg font-black leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] text-${themeLight}`}>
                  {totalStars}<span className="text-[10px] text-[#3D444D] ml-0.5">/{maxStars}</span>
                </span>
              </div>
            </div>
          </div>
        </div >
      </div >

      {/* ─── CAPA 4: FOOTER ESTATUS ─── */}
      < footer className={`px-4 h-[46px] flex items-center justify-between border-t border-black bg-[linear-gradient(180deg,#12161A_0%,#090B0D_100%)] z-20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.02)] relative
        ${!isLocked && completed ? 'group-hover:bg-[#161a20]' : ''}
      `}>
        {!isLocked ? (
          <>
            <div className="flex flex-col mt-0.5">
              <span className="text-[9px] text-(--text-muted)/85 uppercase tracking-widest font-black leading-none mb-1">ESTADO DEL SUB-SISTEMA</span>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] text-${themeLight}`}>
                {completed ? 'ESTABILIZADO' : 'EXPLORACIÓN REQUERIDA'}
              </span>
            </div>

            {/* Tag Digital Plano (Integrado, no parece un botón falso) */}
            <div className={`flex items-center justify-center gap-1.5 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_currentColor] text-${themeLight}`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-${themeLight} animate-pulse`} />
              <span className={`text-[9px] font-black tracking-widest uppercase`}>
                {completed ? 'LOGS' : 'ENTER'}
              </span>
              <ChevronRightIcon strokeWidth={3} className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform`} />
            </div>
          </>
        ) : (
          <div className="flex w-full items-center justify-center opacity-60">
            <span className="text-[10px] text-[#3D444D] font-black uppercase tracking-[0.3em] drop-shadow-md">SECTOR_BLOQUEADO</span>
          </div>
        )}
      </footer >
    </article >
  )

  if (isLocked) {
    return (
      <div className={baseStyles}>
        {content}
      </div>
    )
  }

  return (
    <Link href={`/game/${number}`} className={baseStyles} onClick={onClick}>
      {content}
    </Link>
  )
}