import { ChevronLeftIcon } from 'lucide-react'
import { NavButton } from '@/components/ui/NavButton'

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
  children?: React.ReactNode // Aquí irán las estadísticas dinámicas
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
      base: 'var(--green-base)',
      light: 'var(--green-light)',
      darkest: 'var(--green-darkest)',
      muted: 'var(--green-muted)'
    },
    amber: {
      base: 'var(--amber)',
      light: 'var(--amber)',
      darkest: '#1f1500',
      muted: 'var(--amber)'
    },
    purple: {
      base: 'var(--purple)',
      light: 'var(--purple)',
      darkest: '#0f0b1a',
      muted: 'var(--purple)'
    },
    red: {
      base: 'var(--red)',
      light: 'var(--red)',
      darkest: '#1a0f0f',
      muted: 'var(--red)'
    },
    blue: {
      base: 'var(--cyan)',
      light: 'var(--cyan)',
      darkest: '#0f0b1a',
      muted: 'var(--cyan)'
    }

  }[variant]

  return (
    <div className="sticky top-0 pt-2 z-50 flex flex-col gap-2.5 mb-4 w-full animate-in fade-in slide-in-from-top-1 duration-500 ease-out bg-(--bg-void)">
      {/* Top Navigation Row - Server Rendered */}
      {showBreadcrumbs && (
        <div className="flex items-center justify-between w-full pb-2 border-b border-[#1a2636]/30">
          <NavButton href={backHref} icon={ChevronLeftIcon} >
            {backLabel}
          </NavButton>

          <div className="flex items-center gap-4 font-mono text-[9px] text-(--text-muted)/40">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: themeColors.base, boxShadow: `0 0 4px ${themeColors.base}` }} />
              <span className="tracking-widest uppercase">ST_ACT: ONLINE</span>
            </div>
            <div className="w-px h-2 bg-[#1a2636]" />
            <span className="tracking-widest uppercase">NODE: 0x{actId.padStart(4, '0')}</span>
          </div>
        </div>
      )}

      {/* Main Bar Shell */}
      <div className="relative">
        <div className="absolute -inset-0.5 opacity-20 transition-opacity" style={{ background: `linear-gradient(to right, ${themeColors.base}33, transparent, transparent)` }} />

        <header className="relative w-full bg-[#080c11]/80 border border-[#1a2636]/60 rounded-xs overflow-hidden flex flex-col md:flex-row items-stretch">
          {/* Subtle Scanline Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,1)_3px)]" />

          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, ${themeColors.base}99, ${themeColors.base}1a, transparent)` }} />
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: themeColors.base, boxShadow: `0 0 15px ${themeColors.base}` }} />

          {/* Tactical Corner Accents */}
          <div className="absolute top-0 left-1 w-2 h-2 border-t border-l border-(--text-muted)/30" />
          <div className="absolute bottom-0 left-1 w-2 h-2 border-b border-l border-(--text-muted)/30" />

          {/* Title Area - SERVER RENDERED */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-center gap-0.5 min-w-0 relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5 px-2 py-1 border border-white/5 rounded-xs" style={{ backgroundColor: themeColors.darkest }}>
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: themeColors.light, boxShadow: `0 0 5px ${themeColors.light}` }} />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase leading-none" style={{ color: themeColors.light }}>
                  {idLabel}_{actId.padStart(2, '0')}
                </span>
              </div>
              <span className="text-[8px] text-(--text-ghost) font-mono uppercase tracking-[0.2em]">{tag}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white uppercase leading-none truncate pr-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {actName}
            </h1>

            {/* Minimal context line */}
            <div className="flex items-center gap-2 mt-1 opacity-40">
              <div className="h-px w-8 bg-(--text-muted)/30" />
              <span className="text-[7px] font-mono text-(--text-muted) tracking-[0.3em] uppercase">{subtitle}</span>
            </div>
          </div>

          {/* Slot para estadísticas - CLIENT RENDERED */}
          <div className="flex shrink-0">
            {children}
          </div>

          {/* Decorative scanner line */}
          <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, ${themeColors.base}4d, transparent, transparent)` }} />
        </header>

        {/* Minimal Bottom Label */}
        <div className="mt-2 flex justify-between items-center px-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#1a2636]" />
            <div className="w-1 h-1 bg-[#1a2636]" />
            <div className="w-4 h-1 bg-[#1a2636]" />
          </div>
          <span className="text-[7px] font-mono text-(--text-muted)/30 tracking-[0.4em] uppercase">
            REBOOT_OS // {idLabel.toUpperCase()}_INTERFACE_V1.0
          </span>
        </div>
      </div>
    </div>
  )
}
