import { ChevronLeft, ChevronLeftIcon } from 'lucide-react'
import { NavButton } from '@/components/ui/NavButton'
import { Screw } from '@/components/ui/Screw' // <-- Adding Screw
import Link from 'next/link'

interface SectorHeaderProps {
  actId: string
  actName: string
  idLabel?: string
  tag?: string
  subtitle?: string
  showBreadcrumbs?: boolean
  backHref?: string
  backLabel?: string
  variant?: 'green' | 'amber' | 'purple' | 'red' | 'blue'
  children?: React.ReactNode
}

export function SectorHeader({
  actId,
  actName,
  idLabel = "SECTOR",
  tag = "PATH_READY",
  subtitle = "SYSTEM_INITIALIZED",
  showBreadcrumbs = true,
  backHref = "/game",
  backLabel = "MAPA_SECTORES",
  variant = 'green',
  children
}: SectorHeaderProps) {
  const themeColors = {
    green: {
      base: '(--green-base)',
      light: '(--green-light)',
      darkest: '(--green-darkest)',
      muted: '(--green-muted)'
    },
    amber: {
      base: '(--amber)',
      light: '(--amber)',
      darkest: '#1f1500',
      muted: '(--amber)'
    },
    purple: {
      base: '(--purple)',
      light: '(--purple)',
      darkest: '#0f0b1a',
      muted: '(--purple)'
    },
    red: {
      base: '(--red)',
      light: '(--red)',
      darkest: '#1a0f0f',
      muted: '(--red)'
    },
    cyan: {
      base: '(--cyan)',
      light: '(--cyan)',
      darkest: '#0f0b1a',
      muted: '(--cyan)'
    },
    blue: {
      base: '(--blue)',
      light: '(--blue)',
      darkest: '#0f0b1a',
      muted: '(--blue)'
    }

  }[variant]

  return (
    <div className="sticky top-0 pt-2 z-50 flex flex-col gap-2 mb-4 w-full animate-in fade-in slide-in-from-top-1 duration-500 ease-out bg-(--bg-void)">

      {/* CHASIS EXTERIOR INTEGRADO (Abarca Navigation + Header) */}
      <div className="relative w-full rounded-sm flex flex-row  border border-(--border-color)/50 ">

        {/* Módulo de Navegación (Hardware Switch) */}
        <Link
          href={backHref}
          className="group/act flex flex-col justify-between py-2 px-1.5 mr-px min-w-[125px] bg-(--bg-deep) hover:bg-(--bg-elevated) active:bg-black transition-all relative shrink-0 cursor-pointer"
          title={`Volver a ${backLabel}`}
        >
          {/* Textura de agarre metálico (Grip) */}
          <div className="absolute inset-[6px] opacity-[0.15] bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] pointer-events-none group-hover/act:opacity-30 transition-opacity" />

          {/* Bisel interno para dar profundidad de botón físico presionado */}
          <div className="absolute inset-[6px] border-t border-l border-b border-r border-white/5 rounded-bl-sm rounded-tl-sm shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] pointer-events-none" />

          {/* === NUEVO ORDEN DE CONTENIDO === */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between gap-1.5 mt-1 px-1.5">

            {/* 1. ZONA SUPERIOR: Indicadores Técnicos */}
            <div className="w-full flex items-center justify-between">
              <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/act:bg-(--amber) group-hover/act:shadow-[0_0_8px_var(--amber)] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
              <span className="text-[7px] font-mono font-black text-(--text-muted)/60 group-hover/act:text-(--amber)/80 transition-colors tracking-[0.2em] uppercase">
                EXIT_HATCH
              </span>
            </div>

            {/* 2. ZONA CENTRAL: Acción (Compuerta Integral del Sector) */}
            <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden border-y border-(--bg-void) bg-[#030405] cursor-pointer group-active/act:bg-(--bg-void) transition-colors">

              {/* Bisel/Marco exterior oscuro que hace que toda la zona se vea muy hundida físicamente */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_5px_8px_rgba(0,0,0,0.9),inset_0_-5px_8px_rgba(0,0,0,0.9),inset_3px_0_10px_rgba(0,0,0,0.8),inset_-3px_0_10px_rgba(0,0,0,0.8)] z-30" />

              {/* Glow interno (Revelado en el centro al abrirse la puerta) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
                <div className="w-2 h-full bg-[color-mix(in_srgb,var(--amber)_60%,transparent)] shadow-[0_0_15px_var(--amber)] opacity-0 group-hover/act:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Panel Izquierdo de acero ranurado */}
              <div className="absolute left-0 top-0 bottom-0 w-[50%] bg-[#12161A] group-hover/act:bg-[#161b22] border-r border-black shadow-[2px_0_8px_rgba(0,0,0,0.9)] group-hover/act:-translate-x-[4px] group-active/act:-translate-x-[8px] transition-all duration-300 ease-out z-10 overflow-hidden">
                {/* Textura de placas */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
                {/* Brillo interno del panel */}
                <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] pointer-events-none bg-[linear-gradient(90deg,rgba(0,0,0,0.4)_0%,transparent_100%)]" />
                {/* Mitad Izquierda del Chevron dibujada en la puerta */}
                <ChevronLeft size={70} strokeWidth={2.5} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-[#8B949E] opacity-20 group-hover/act:opacity-60 group-hover/act:text-white transition-colors duration-150 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] pointer-events-none" />
              </div>

              {/* Panel Derecho de acero ranurado */}
              <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-[#12161A] group-hover/act:bg-[#161b22] border-l border-black shadow-[-2px_0_8px_rgba(0,0,0,0.9)] group-hover/act:translate-x-[4px] group-active/act:translate-x-[8px] transition-all duration-300 ease-out z-10 overflow-hidden">
                {/* Textura de placas */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
                {/* Brillo interno del panel */}
                <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] pointer-events-none bg-[linear-gradient(-90deg,rgba(0,0,0,0.4)_0%,transparent_100%)]" />
                {/* Mitad Derecha del Chevron dibujada en la puerta */}
                <ChevronLeft size={70} strokeWidth={2.5} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[#8B949E] opacity-20 group-hover/act:opacity-60 group-hover/act:text-white transition-colors duration-150 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] pointer-events-none" />
              </div>
            </div>

            {/* 3. ZONA INFERIOR: Etiqueta Humana */}
            <div className="w-full flex justify-center mb-1 mt-0.5">
              <span className="text-[11px] font-mono font-black text-(--text-muted) leading-none group-hover/act:text-white uppercase tracking-widest text-center">
                {backLabel}
              </span>
            </div>

          </div>

          {/* Franja de conexión física con el monitor CRT */}
          <div className="absolute -right-[4px] top-0 bottom-0 w-[3px] bg-(--border-color) group-hover/act:bg-(--amber) transition-colors" />
        </Link>
        {/* Módulo Principal CRT */}
        <header className="relative flex-1 flex flex-col md:flex-row w-full  border-black bg-[linear-gradient(45deg,var(--bg-surface),var(--bg-elevated),var(--bg-surface))] overflow-hidden min-h-[90px]">

          {/* 1. ESTRUCTURA DE PANEL (EL BISEL) */}
          <div className="absolute inset-[6px] border border-black/60 rounded-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] pointer-events-none" />

          {/* 2. TEXTURA DE FIBRA / CARBONO */}
          <div className="absolute left-[6px] right-[6px] top-[6px] bottom-[6px] rounded-sm opacity-[0.08] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[4px_4px] pointer-events-none" />

          {/* 3. LUZ DE ESTADO SECUNDARIA */}
          {/*<div className={`absolute left-0 top-1/2 -translate-y-1/2 h-25 w-[6px] bg-${themeColors.base} shadow-[0_0_10px_${themeColors.base}] rounded-r-full opacity-100`} />
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-25 w-[6px] bg-${themeColors.base} shadow-[0_0_10px_${themeColors.base}] rounded-l-full opacity-100`} />*/}

          {/* Title Area */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-center gap-1 min-w-0 relative z-10 ml-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 border border-white/10 rounded-xs shadow-inner" style={{ backgroundColor: themeColors.darkest }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColors.light, boxShadow: `0 0 8px ${themeColors.light}` }} />
                <span className="text-[11px] font-black tracking-[0.2em] uppercase leading-none" style={{ color: themeColors.light }}>
                  {idLabel}_{actId.padStart(2, '0')}
                </span>
              </div>
              <span className="text-[9px] text-(--text-ghost) font-mono uppercase font-black tracking-[0.3em]">{tag}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black font-mono tracking-tighter text-(--text-primary) uppercase leading-none truncate pr-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              {actName}
            </h1>

            {/* Minimal context line */}
            <div className="flex items-center gap-3 mt-1opacity-60">
              <div className="h-0.5 w-12 bg-(--border-muted-color)" />
              <span className="text-[10px] font-mono font-bold text-(--text-muted) tracking-[0.4em] uppercase">{subtitle}</span>
            </div>
          </div>


          {/* Tornillos Exteriores del Chasis Integro */}
          <div className="absolute top-px left-px pointer-events-none z-20"><Screw size="sm" /></div>
          <div className="absolute top-px right-px pointer-events-none z-20"><Screw size="sm" /></div>
          <div className="absolute bottom-px left-px pointer-events-none z-20"><Screw size="sm" /></div>
          <div className="absolute bottom-px right-px pointer-events-none z-20"><Screw size="sm" /></div>

        </header>

        {/* Slot para estadísticas */}
        <div className="flex shrink-0 relative z-10">
          {children}
        </div>

      </div>

      {/* Minimal Bottom Hardware Label */}
      <div className="flex justify-between items-center px-3 mb-1">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-(--border-color) rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
          <div className="w-1.5 h-1.5 bg-(--border-color) rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
          <div className="w-6 h-1.5 bg-(--border-color) rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>
        <span className="text-[8px] font-mono text-(--text-muted)/50 font-bold tracking-[0.5em] uppercase">
          REBOOT_OS // {idLabel.toUpperCase()}_INTERFACE_V3.0
        </span>
      </div>
    </div>
  )
}
