"use client"

import { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'motion/react'
import { InboxIcon, KeyIcon, LightbulbIcon, ArchiveIcon } from 'lucide-react'
import { hasObject, getObjects as getUnlockedIds } from '@/lib/gameState'
import { isDemoModeActive } from '@/lib/store/useDemoStore'
import { ObjectScanner } from '@/components/collection/ObjectScanner'
import { ObjectDetailModal } from '@/components/collection/ObjectDetailModal'
import { SectorHeader } from '@/components/map/SectorHeader'
import type { GameObject } from '@/types/game'

import { Loading } from '@/components/ui/Loading'

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

const ObjectsArchiveClient = ({ initialObjects }: ObjectsArchiveClientProps) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [selectedObject, setSelectedObject] = useState<GameObject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = getUnlockedIds()
    // Si estamos en modo demo, simulamos que todos los objetos están desbloqueados
    if (isDemoModeActive()) {
      setUnlockedIds(initialObjects.map(o => o.id))
    } else {
      setUnlockedIds(ids)
    }
    setLoading(false)
  }, [initialObjects])

  const handleSelect = useCallback((obj: GameObject) => {
    setSelectedObject(obj)
  }, [])

  if (loading) {
    return <Loading message="CARGANDO ARTEFACTOS..." variant="amber" icon="archive" />
  }

  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) relative font-sans">

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

      <main className="flex-1 container mx-auto px-8 pb-12 relative z-10 flex flex-col">
        <SectorHeader
          actId="02"
          actName="OBJETOS"
          idLabel="RACK"
          tag="INVENTARIO_FISICO"
          subtitle="ANÁLISIS DE HARDWARE // RESIDUOS DEL REFUGIO"
          variant="amber"
          backHref="/game/collection"
          backLabel="ALMACÉN"
        >
          <div className="hidden md:flex flex-col items-end justify-center gap-2 border-l border-[#1a2636]/60 p-5 md:p-6 bg-[#0c1218]/40 min-w-[260px]">
            <div className="flex gap-[3px] w-full justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 skew-x-[-15deg] transition-all duration-500 ${i < (unlockedIds.length / initialObjects.length * 6) ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)] brightness-150' : 'bg-[#1a2636]'}`}
                />
              ))}
            </div>
            <div className="font-mono text-[8px] text-(--amber) uppercase tracking-widest flex items-center justify-between w-full mt-1.5 opacity-60">
              <span>DETECTADOS</span>
              <span className="text-white font-bold text-[9px] tracking-[0.2em]">{unlockedIds.length} <span className="text-[#1a2636] px-1">/</span> {initialObjects.length}</span>
            </div>
          </div>
        </SectorHeader>

        {/* THE OBJECT RACK (Physical Storage Grid) */}
        <div className="relative mt-8">
          {/* Vertical Rack Rails (Background) */}
          <div className="absolute inset-y-0 left-[-20px] w-4 py-10 opacity-20 hidden lg:flex lg:flex-col lg:justify-between">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full border-2 border-white/40 flex items-center justify-center">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 right-[-20px] w-4 py-10 opacity-20 hidden lg:flex lg:flex-col lg:justify-between">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full border-2 border-white/40 flex items-center justify-center">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-10 gap-y-12 pb-32 relative z-10">
            {initialObjects.map((obj, idx) => {
              const isUnlocked = hasObject(obj.id)
              const color = typeColors[obj.type] || 'var(--amber)'

              return (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => isUnlocked && handleSelect(obj)}
                  className="flex flex-col group"
                >
                  {/* The Caddy Hardware */}
                  <ObjectScanner
                    type={obj.type}
                    id={obj.id}
                    icon={obj.icon}
                    isUnlocked={isUnlocked}
                    className={`aspect-square cursor-pointer transition-transform duration-300 ${isUnlocked ? 'hover:-translate-y-2' : ''}`}
                  />

                  {/* Identification & Type Slot (Below the caddy) */}
                  <div className={`mt-3 px-3 py-1.5 border-l-2 transition-all duration-300 ${isUnlocked ? 'border-(--amber) bg-white/5' : 'border-white/5 bg-black/20 opacity-40'}`}>
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className={`text-[10px] font-black uppercase tracking-[0.15em] truncate ${isUnlocked ? 'text-white' : 'text-(--text-ghost)'}`}>
                        {isUnlocked ? obj.name : 'Unknown Artifact'}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] font-mono text-(--text-muted) uppercase tracking-widest">UNIT_{obj.type}</span>
                      {isUnlocked && <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ color: color }} />}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Background horizontal shelves */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
            <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to bottom, transparent, transparent 159px, white 160px)', backgroundSize: '100% 160px' }} />
          </div>
        </div>
      </main>
      <ObjectDetailModal
        selectedObject={selectedObject}
        onClose={() => setSelectedObject(null)}
      />
    </div>
  )
}

export default memo(ObjectsArchiveClient)
