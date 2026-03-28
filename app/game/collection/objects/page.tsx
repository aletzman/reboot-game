"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { WrenchIcon, ChevronLeftIcon, InboxIcon, ArchiveIcon, KeyIcon, LightbulbIcon, XIcon, ScanIcon, DatabaseIcon } from 'lucide-react'
import { getObjects } from '@/lib/gameState'
import { ObjectScanner } from '@/components/collection/ObjectScanner'
import { Header } from '@/components/ui/Header'
import { NavButton } from '@/components/ui/NavButton'

// Let's re-verify the data import path.
// Earlier I checked and it was in /home/alejandro/Proyectos/NextJS/reboot-game/data/objects.json

interface GameObject {
  id: string
  name: string
  icon: string
  obtainedIn: string
  description: string
  lore: string
  type: 'lore' | 'key' | 'hint' | 'final'
  required: boolean
  usedIn: string[]
  effect: string
  inventoryNote: string
}

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

import objectsDataFromFile from '@/data/objects.json'

export default function ObjectsArchivePage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [selectedObject, setSelectedObject] = useState<GameObject | null>(null)

  useEffect(() => {
    setUnlockedIds(getObjects())
  }, [])

  const objects = objectsDataFromFile.objects as GameObject[]

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-47px)] bg-(--bg-void) relative overflow-y-auto font-sans custom-scrollbar">

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
                    className={`flex-1 h-5 skew-x-[-15deg] transition-all duration-500 ${i < (unlockedIds.length / objects.length * 6) ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)] brightness-150' : 'bg-[#1a2636]'}`}
                  />
                ))}
              </div>
              <div className="font-mono text-[9px] text-(--amber) uppercase tracking-widest flex items-center justify-between w-full mt-2 border-t border-[#1a2636] pt-3 opacity-90">
                <span>OBJETOS_DETECTADOS</span>
                <span className="text-white font-bold text-[10px] tracking-[0.2em]">{unlockedIds.length} <span className="text-[#1a2636] px-1">/</span> {objects.length}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-32">
          {objects.map((obj, idx) => {
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

      {/* Modal / Detail View - Object Inspection Upgrade */}
      <AnimatePresence>
        {selectedObject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedObject(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 20 }}
              className="relative w-full max-w-6xl bg-(--bg-surface) border border-[#1a1f26] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Deep Object Scan */}
              <div className="w-full md:w-5/12 p-12 bg-linear-to-b from-[#0c1015] to-[#040608] border-b md:border-b-0 md:border-r border-[#1a1f26] flex flex-col items-center justify-center relative min-h-[500px]">
                {/* Technical Scanlines/Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, var(--amber) 2px, var(--amber) 4px)` }} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(239, 159, 39, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 159, 39, 0.1) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                <div className="relative z-10 w-full flex flex-col items-center">
                  {/* Floating Object Visual */}
                  <ObjectScanner
                    type={selectedObject.type}
                    id={selectedObject.id}
                    isUnlocked={true}
                    className="w-[300px] h-[300px] mb-12 shadow-[0_0_50px_rgba(239,159,39,0.1)]"
                  />

                  {/* Technical Metadata boxes */}
                  <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-black/50 border border-[#1a1f26] p-3">
                      <span className="text-[7px] font-mono text-(--text-ghost) uppercase block mb-1">SCAN_COORD_X</span>
                      <span className="text-xs font-mono text-(--amber) uppercase">#AR-{Math.floor(Math.random() * 9999)}</span>
                    </div>
                    <div className="bg-black/50 border border-[#1a1f26] p-3">
                      <span className="text-[7px] font-mono text-(--text-ghost) uppercase block mb-1">DATA_DENSITY</span>
                      <span className="text-xs font-mono text-(--amber) uppercase">98.4%</span>
                    </div>
                    <div className="bg-black/50 border border-[#1a1f26] p-3">
                      <span className="text-[7px] font-mono text-(--text-ghost) uppercase block mb-1">MATERIAL_LOG</span>
                      <span className="text-xs font-mono text-white uppercase">REFORZADO</span>
                    </div>
                    <div className="bg-black/50 border border-[#1a1f26] p-3">
                      <span className="text-[7px] font-mono text-(--text-ghost) uppercase block mb-1">INTEGRITY_CHECK</span>
                      <span className="text-xs font-mono text-(--green-muted) uppercase">PASS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Technical Data */}
              <div className="flex-1 p-12 bg-linear-to-br from-[#090C10] to-[#010101]">
                {/* Header technical row */}
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#1a1f26]">
                  <div
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em]"
                    style={{ backgroundColor: typeColors[selectedObject.type], color: 'black' }}
                  >
                    {selectedObject.type} {selectedObject.required && ':: CRÍTICO'}
                  </div>

                  <button
                    onClick={() => setSelectedObject(null)}
                    className="text-(--text-ghost) hover:text-(--amber) transition-all flex items-center gap-2 group/close"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-widest group-hover:mr-2 transition-all">TERMINAR_REGISTRO</span>
                    <XIcon size={20} strokeWidth={1} />
                  </button>
                </div>

                <div className="mb-12">
                  <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">{selectedObject.name}</h2>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 bottom-0 w-1 bg-(--amber) opacity-20" />
                    <p className="text-(--text-primary) font-mono leading-relaxed text-xl">
                      {selectedObject.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  {/* Lore Box - Styled as a terminal log */}
                  <div className="bg-[#0c1015] border border-[#1a1f26] p-10 relative group/lore overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                      <ScanIcon size={120} className="text-(--amber)" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <DatabaseIcon size={14} className="text-(--amber)" />
                      <h4 className="text-[10px] font-mono text-(--amber) uppercase tracking-[0.4em] font-black">LOG_DE_MEMORIA_DANIADA</h4>
                    </div>
                    <p className="text-(--text-muted) italic font-sans leading-relaxed text-sm relative z-10 pl-6 border-l border-[#1a3810]">
                      "{selectedObject.lore}"
                    </p>
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-(--bg-elevated) p-8 border-l-2 border-(--amber) hover:bg-(--bg-hover) transition-colors">
                      <h4 className="text-[11px] font-mono text-(--amber) uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-3 bg-current" /> EFECTO_DEL_HALLAZGO
                      </h4>
                      <p className="text-(--text-muted) text-xs font-mono leading-relaxed opacity-80">
                        {selectedObject.effect}
                      </p>
                    </div>
                    <div className="bg-(--bg-elevated) p-8 border-l-2 border-[#1a3810] hover:bg-(--bg-hover) transition-colors">
                      <h4 className="text-[11px] font-mono text-(--text-muted) uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-3 bg-current" /> PROTOCOLO_DE_USO
                      </h4>
                      <p className="text-(--text-muted) text-xs font-mono leading-relaxed opacity-80">
                        {selectedObject.inventoryNote}
                      </p>
                    </div>
                  </div>

                  {/* Connections Row */}
                  {selectedObject.usedIn.length > 0 && (
                    <div className="pt-8 border-t border-[#1a1f26] flex items-center gap-6">
                      <h4 className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.4em] shrink-0">TERMINALES_VINCULADAS:</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedObject.usedIn.map(levelId => (
                          <div key={levelId} className="px-4 py-1.5 bg-(--bg-hover) text-(--amber) text-opacity-70 font-mono text-[10px] border border-(--bg-hover) flex items-center gap-2">
                            <div className="w-1 h-1 bg-(--amber) rounded-full shadow-[0_0_5px_var(--amber)]" />
                            <span>ID::{levelId}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer HUD elements */}
      <div className="fixed bottom-0 inset-x-0 py-2 px-8 bg-(--bg-surface) border-t border-(--bg-hover) flex justify-between items-center z-20 pointer-events-none">
        <div className="flex gap-6 items-center">
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">ITEM_BUFFER::SYNCED</span>
          <div className="w-px h-12 bg-(--bg-hover) hidden md:block" />
          <span className="text-[9px] font-mono text-(--amber) uppercase tracking-[0.2em] font-black opacity-60 animate-pulse">ALMACENAMIENTO_EXTERIOR</span>
        </div>
        <div className="flex gap-4">
          <div className="w-1 h-1 bg-(--amber) rounded-full animate-ping" />
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">HW_ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}
