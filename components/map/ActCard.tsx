import Link from 'next/link'
import { ActSummary } from '@/types/game'
import { LockIcon, ServerIcon, CheckCircle2Icon, ShieldAlertIcon, ChevronRightIcon, CpuIcon, ActivityIcon } from 'lucide-react'

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
  const completionPercentage = Math.round((totalStars / maxStars) * 100) || 0

  // Contenedor principal
  const baseStyles = "relative flex flex-col h-full bg-(--bg-elevated) transition-all duration-500 overflow-hidden font-mono group rounded-sm"

  const lockedStyles = isLocked
    ? "opacity-90 cursor-not-allowed border border-(--border-muted-color) grayscale shadow-none"
    : `cursor-pointer border border-(--border-color)/50 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:border-(--text-muted)/50 ${completed ? 'hover:border-(--green-base)' : 'hover:border-(--amber)'}`

  const content = (
    <>
      {/* Luz de acento superior */}
      {!isLocked && (
        <div className={`absolute top-0 inset-x-0 h-[2px] transition-all duration-500 opacity-50 group-hover:opacity-100
          ${completed ? 'bg-(--green-base) shadow-[0_0_15px_rgba(45,120,0,0.8)]' : 'bg-(--amber) shadow-[0_0_15px_rgba(239,159,39,0.8)]'}
        `} />
      )}

      {/* ─── CAPA 2: HEADER ─── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-(--border-muted-color) bg-(--bg-hover)/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-3 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-500
            ${isLocked ? 'bg-red-900 text-red-900' : completed ? 'bg-(--green-base) text-(--green-base)' : 'bg-(--amber) text-(--amber) animate-pulse'}
          `} />
          <div className="flex flex-col">
            <span className="text-xs font-black text-(--text-primary) leading-none">
              SEC_{number < 10 ? `0${number}` : number}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[8px] text-(--text-ghost) hidden md:inline">0x{number}A{levelIds.length}F</span>
          {isLocked ? (
            <LockIcon className="w-4 h-4 text-(--text-ghost)" />
          ) : (
            <ServerIcon className={`w-4 h-4 transition-colors ${completed ? 'text-(--green-base)' : 'text-(--amber)'}`} />
          )}
        </div>
      </div>

      {/* ─── CAPA 3: PANTALLA PRINCIPAL ─── */}
      <div className="flex-1 p-5 relative flex flex-col z-10 bg-(--bg-surface) shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)]">

        {!isLocked && (
          <div className={`absolute top-4 right-4 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none
                ${completed ? 'text-(--green-base)' : 'text-(--amber)'}
            `}>
            <CpuIcon size={80} />
          </div>
        )}

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex-1 pr-4">
            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight
              ${isLocked ? 'text-(--text-ghost)' : 'text-(--text-primary) group-hover:text-white transition-colors'}`}>
              {name || 'ZONA_DESCONOCIDA'}
            </h3>

            <div className={`inline-flex items-center gap-1.5 px-2 py-1 mt-2 rounded-sm border
              ${isLocked ? 'border-(--border-muted-color) bg-(--bg-elevated) text-(--text-ghost)'
                : completed ? 'border-(--green-base)/30 bg-(--green-base)/10 text-(--green-base)'
                  : 'border-(--amber)/30 bg-(--amber)/10 text-(--amber)'}
            `}>
              {completed ? <CheckCircle2Icon className="w-3 h-3" /> : isLocked ? <ShieldAlertIcon className="w-3 h-3" /> : <ActivityIcon className="w-3 h-3" />}
              <span className="text-[9px] font-bold uppercase tracking-widest">
                {completed ? 'SISTEMA SEGURO' : isLocked ? 'BLOQUEO DE RED' : 'ESCANEANDO...'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-5 relative z-10">

          {/* ─── BARRA DE PROGRESO (Corregida y visible) ─── */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-(--text-muted)">
              <span>Integridad_Core</span>
              <span className={isLocked ? 'text-(--text-ghost)' : completed ? 'text-(--green-base)' : 'text-(--amber)'}>
                {completionPercentage}%
              </span>
            </div>

            <div className="flex gap-[2px] h-3.5 p-[2px] bg-(--bg-deep) border border-(--border-muted-color) rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
              {Array.from({ length: 15 }).map((_, i) => {
                const filled = (i / 15) * 100 < completionPercentage;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-[1px] transition-colors duration-500
                        ${filled
                        ? (completed ? 'bg-(--green-base) shadow-[0_0_5px_rgba(45,120,0,0.5)]' : 'bg-(--amber) shadow-[0_0_5px_rgba(239,159,39,0.5)]')
                        : 'bg-(--bg-hover)'
                      }
                    `}
                  />
                )
              })}
            </div>
          </div>

          {/* ─── TELEMETRÍA (Recuadros vitaminados y tecnológicos) ─── */}
          <div className="grid grid-cols-2 gap-3">

            {/* Caja Nodos */}
            <div className="relative bg-(--bg-elevated) border border-(--border-muted-color) rounded-sm p-2.5 flex flex-col overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-(--border-muted-color)" />
              <span className="absolute top-1 right-1.5 text-[7px] text-(--text-ghost) font-mono">0xN</span>
              <span className="text-[10px] text-(--text-muted) uppercase tracking-widest mb-0.5 ml-1.5">NODOS</span>
              <span className={`text-sm md:text-base font-black ml-1.5 leading-none ${isLocked ? 'text-(--text-ghost)' : 'text-(--text-primary)'}`}>
                {levelIds.length} <span className="text-[10px] text-(--text-muted) font-normal">RUTAS</span>
              </span>
            </div>

            {/* Caja PWR */}
            <div className={`relative bg-(--bg-elevated) border rounded-sm p-2.5 flex flex-col overflow-hidden transition-colors duration-500
                ${isLocked ? 'border-(--border-muted-color)' : completed ? 'border-(--green-base)/30 bg-(--green-base)/5' : 'border-(--amber)/30 bg-(--amber)/5 group-hover:border-(--amber)/50'}
            `}>
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-500
                ${isLocked ? 'bg-(--border-muted-color)' : completed ? 'bg-(--green-base)' : 'bg-(--amber)'}
              `} />
              <span className="absolute top-1 right-1.5 text-[7px] text-(--text-ghost) font-mono">0xP</span>
              <span className="text-[10px] text-(--text-muted) uppercase tracking-widest mb-0.5 ml-1.5">EFICIENCIA</span>
              <span className={`text-sm md:text-base font-black ml-1.5 leading-none ${isLocked ? 'text-(--text-ghost)' : completed ? 'text-(--green-base)' : 'text-(--amber)'}`}>
                {totalStars}<span className="text-(--text-muted) text-xs">/{maxStars}</span>
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ─── CAPA 4: FOOTER (Botón táctico rectangular) ─── */}
      {!isLocked ? (
        <div className={`p-3 md:p-4 bg-(--bg-hover)/50 border-t border-(--border-muted-color) flex items-center justify-between transition-colors duration-500
            ${completed ? 'group-hover:bg-(--green-base)/10' : 'group-hover:bg-(--amber)/5'}
        `}>
          <div className="flex flex-col">
            <span className="text-[8px] text-(--text-muted) uppercase tracking-widest mb-0.5">ACCIÓN REQUERIDA</span>
            <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]
                ${completed ? 'text-(--green-base)' : 'text-(--text-primary)'}
             `}>
              {completed ? 'REVISAR ARCHIVOS' : 'INICIAR COMPILACIÓN'}
            </span>
          </div>

          {/* Botón rectangular en lugar de redondo */}
          <div className={`px-3 py-1.5 rounded-sm border flex items-center justify-center transition-all duration-300 group-hover:scale-105
            ${completed ? 'border-(--green-base) bg-(--green-base)/10' : 'border-(--amber) bg-(--amber)/10'}
          `}>
            <span className={`text-[9px] font-black tracking-widest mr-1 ${completed ? 'text-(--green-base)' : 'text-(--amber)'}`}>
              {completed ? 'LOGS' : 'EXEC'}
            </span>
            <ChevronRightIcon className={`w-3.5 h-3.5 ${completed ? 'text-(--green-base)' : 'text-(--amber)'}`} />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-(--bg-surface) border-t border-(--border-muted-color) flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] text-(--text-ghost) uppercase tracking-widest mb-0.5">ESTADO ACTUAL</span>
            <span className="text-[11px] text-(--text-ghost) font-black uppercase tracking-[0.2em]">SISTEMA BLOQUEADO</span>
          </div>
        </div>
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