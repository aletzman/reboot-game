"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeftIcon, InboxIcon, KeyIcon, LightbulbIcon, ArchiveIcon } from 'lucide-react'
import { getObjects as getUnlockedIds } from '@/lib/gameState'
import { ObjectScanner } from '@/components/collection/ObjectScanner'
import { ObjectDetailModal } from '@/components/collection/ObjectDetailModal'
import { NavButton } from '@/components/ui/NavButton'
import type { GameObject } from '@/types/game'

const typeIcons: Record<string, any> = {
  lore: InboxIcon,
  key: KeyIcon,
  hint: LightbulbIcon,
  final: ArchiveIcon
}

const typeColors: Record<string, string> = {
  lore: 'var(--blue)',
  key: 'var(--amber)',
  hint: 'var(--green-muted)',
  final: 'var(--purple)'
}

interface ObjectsArchiveClientProps {
  initialObjects: GameObject[]
}

export default function ObjectsArchiveClient({ initialObjects }: ObjectsArchiveClientProps) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [selectedObject, setSelectedObject] = useState<GameObject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUnlockedIds(getUnlockedIds())
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 bg-(--bg-void) flex items-center justify-center font-mono h-[calc(100vh-var(--header-height))]">
        <div className="text-(--amber) animate-pulse font-bold tracking-[0.5em]">CARGANDO ARTEFACTOS...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-var(--header-height))] bg-(--bg-void) relative overflow-y-auto font-sans custom-scrollbar">

      {/* Industrial Background with Warped Grid */}
      <div className="absolute inset-0 bg-(--bg-deep) opacity-50 z-0 select-none pointer-events-none overflow-hidden">
        <div
          className="absolute inset-x-0 bottom-[-50%] h-[150%] opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--amber) 1px, transparent 1px), linear-gradient(90deg, var(--amber) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2)'
          }}
        />
        <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-black/80 to-transparent" />
      </div>

      <main className="flex-1 container mx-auto px-8 pb-12 pt-6 relative z-10 flex flex-col">
        <header className="mb-14 relative flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <NavButton href="/game/collection" icon={ChevronLeftIcon} colorTheme="amber">
              TERMINAL_CENTRAL
            </NavButton>
          </div>

          <div className="w-full bg-linear-to-r from-[#0c1218] to-transparent border-l-4 border-(--amber) p-6 rounded-r-md flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden shadow-xl">
            {/* Fondo simulando rejilla técnica sutil */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_3px)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_right,rgba(239,159,39,0.05),transparent_70%)] pointer-events-none" />

            {/* Decoración tech */}
            <div className="absolute top-0 left-0 w-8 h-px bg-(--amber) shadow-[0_0_5px_var(--amber)]" />
            <div className="absolute bottom-0 left-0 w-16 h-px bg-(--amber) shadow-[0_0_5px_var(--amber)]" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-2 h-2 rounded-full bg-(--amber) animate-pulse shadow-[0_0_8px_var(--amber)]" />
                <span className="text-[10px] text-(--amber) uppercase font-black tracking-[0.4em] leading-none text-nowrap opacity-80">
                  SYS.ARCHIVE // INVENTARIO FÍSICO
                </span>
              </div>

              <div className="flex items-end gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-(family-name:--font-title)  text-white uppercase leading-none drop-shadow-md">
                  ARTEFACTOS RECUPERADOS
                </h1>
                <div className="hidden lg:flex flex-col gap-0.5 opacity-20 mb-1">
                  <div className="w-16 h-1 bg-white" />
                  <div className="w-12 h-[2px] bg-white" />
                  <div className="flex gap-1 h-3 mt-0.5">
                    <div className="w-1 h-full bg-white" />
                    <div className="w-3 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-(--amber)" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-end gap-2 bg-[#080c11] border border-[#1a2636] p-4 rounded-xs shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] min-w-[200px] md:min-w-[260px]">
              <div className="flex gap-[3px] w-full justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-5 skew-x-[-15deg] transition-all duration-500 ${i < (unlockedIds.length / initialObjects.length * 6) ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)] brightness-150' : 'bg-[#1a2636]'}`}
                  />
                ))}
              </div>
              <div className="font-mono text-[9px] text-(--amber) uppercase tracking-widest flex items-center justify-between w-full mt-2 border-t border-[#1a2636] pt-3 opacity-90">
                <span>OBJETOS_DETECTADOS</span>
                <span className="text-white font-bold text-[10px] tracking-[0.2em]">{unlockedIds.length} <span className="text-[#1a2636] px-1">/</span> {initialObjects.length}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-32">
          {initialObjects.map((obj, idx) => {
            const isUnlocked = unlockedIds.includes(obj.id)
            const color = typeColors[obj.type] || 'var(--amber)'

            return (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                onClick={() => isUnlocked && setSelectedObject(obj)}
                className={`
                  relative cursor-pointer transition-all duration-300
                `}
              >
                <ObjectScanner
                  type={obj.type}
                  id={obj.id}
                  isUnlocked={isUnlocked}
                  className="aspect-square bg-(--bg-elevated) shadow-2xl"
                />

                {/* Sub-label under scanner */}
                {isUnlocked && (
                  <div className="mt-4 px-2">
                    <h3 className="text-xs font-black uppercase text-white tracking-widest mb-1 truncate group-hover:text-(--amber) transition-colors">{obj.name}</h3>
                    <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-mono text-(--text-muted) uppercase">TIPO::{obj.type}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ color: color }} />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>
      <ObjectDetailModal 
        selectedObject={selectedObject} 
        onClose={() => setSelectedObject(null)} 
      />
    </div>
  )
}
