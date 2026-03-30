"use client"

import Link from 'next/link'
import { motion } from 'motion/react'
import { NavButton } from '@/components/ui/NavButton'
import { WrenchIcon, CpuIcon, DatabaseIcon, BoxIcon, ChevronLeftIcon } from 'lucide-react'
import { SectorHeader } from '@/components/map/SectorHeader'

export default function CollectionHubClient() {
  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) relative font-sans ">
      {/* Background patterns - Cyberdeck style */}
      <div className="absolute inset-0 bg-(--bg-deep) opacity-50 z-0 select-none pointer-events-none">
        <div
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--green-base) to-transparent opacity-20"
          style={{ top: '20%' }}
        />
        <div
          className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-(--green-base) to-transparent opacity-10"
          style={{ left: '10%' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--green-base) 1.5px, transparent 1.5px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <main className="flex-1 container mx-auto px-8 relative z-10 flex flex-col">
        <SectorHeader
          actId="DB"
          actName="ARCHIVO"
          idLabel="SYS"
          tag="ARCHIVE_ACCESS"
          subtitle="ÍNDICE DE FRAGMENTOS RECUPERADOS // PROYECTO GÉNESIS"
        >
          <div className="hidden md:flex flex-col items-center justify-center gap-2 border-l border-[#1a2636]/60 p-5 md:p-6 bg-[#0c1218]/40">
            <div className="flex items-center gap-3 opacity-60">
              <DatabaseIcon className="w-6 h-6 text-(--green-light) animate-pulse" strokeWidth={1} />
              <div className="flex flex-col">
                <span className="text-[7px] text-(--green-light) font-mono tracking-widest uppercase">DB_INTEGRITY</span>
                <span className="text-[12px] text-white font-mono tracking-widest uppercase font-black">SINCRO_ACTIVA</span>
              </div>
            </div>
          </div>
        </SectorHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 flex-1 items-stretch max-w-6xl mx-auto w-full pb-20">

          {/* Section: Cards - "Knowledge Modules" */}
          <Link href="/game/collection/cards" className="group">
            <motion.div
              whileHover={{ scale: 1.01, y: -8 }}
              className="relative h-full min-h-[450px] bg-(--bg-surface) border border-[#1a2636] group-hover:border-(--green-base) transition-all duration-500 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Card Header Decoration */}
              <div className="h-12 border-b border-[#1a1f26] bg-[#0c1015] flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-(--green-light) shadow-[0_0_8px_var(--green-light)]" />
                  <span className="text-[9px] font-mono text-(--text-muted) uppercase tracking-widest">Modulo_01 :: CONOCIMIENTO</span>
                </div>
                <DatabaseIcon className="w-3 h-3 text-(--text-ghost)" />
              </div>

              {/* Main Visual */}
              <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
                {/* Decorative Circle Grid */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <div className="w-80 h-80 border border-(--green-base) rounded-full animate-[spin_30s_linear_infinite]" />
                  <div className="absolute w-60 h-60 border border-dashed border-(--green-base) rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                </div>

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 mx-auto mb-10 text-(--green-light) group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(85,226,0,0.3)]"
                  >
                    <CpuIcon strokeWidth={0.5} className="w-full h-full" />
                  </motion.div>

                  <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic group-hover:text-(--green-light) transition-colors">
                    NÚCLEOS_LÓGICOS
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="h-px w-4 bg-(--green-base)" />
                    <span className="text-[10px] font-mono text-(--green-muted) uppercase tracking-[0.3em]">Software Registry</span>
                    <span className="h-px w-4 bg-(--green-base)" />
                  </div>
                  <p className="text-(--text-muted) font-mono text-[11px] leading-relaxed max-w-xs mx-auto uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    Manuales técnicos, estructuras de control y algoritmos de restauración.
                  </p>
                </div>

                {/* Corners */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-(--green-base) opacity-40" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-(--green-base) opacity-40" />
              </div>

              {/* Footer Button Simulation */}
              <div className="p-6 bg-[#0c1015] border-t border-[#1a1f26] group-hover:bg-(--green-darkest) transition-colors flex justify-center">
                <span className="text-[10px] font-mono text-(--green-light) font-bold uppercase tracking-[0.5em]">ACCEDER_ARCHIVOS</span>
              </div>
            </motion.div>
          </Link>

          {/* Section: Objects - "Found Artifacts" */}
          <Link href="/game/collection/objects" className="group">
            <motion.div
              whileHover={{ scale: 1.01, y: -8 }}
              className="relative h-full min-h-[450px] bg-(--bg-surface) border border-[#1a2636] group-hover:border-(--amber) transition-all duration-500 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Card Header Decoration */}
              <div className="h-12 border-b border-[#1a1f26] bg-[#0c1015] flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-(--amber) shadow-[0_0_8px_var(--amber)]" />
                  <span className="text-[9px] font-mono text-(--text-muted) uppercase tracking-widest">Modulo_02 :: ARTEFACTOS</span>
                </div>
                <BoxIcon className="w-3 h-3 text-(--text-ghost)" />
              </div>

              {/* Main Visual */}
              <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
                {/* Decorative Grid Overlay - Warped */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(var(--bg-hover) 1px, transparent 1px), linear-gradient(90deg, var(--bg-hover) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    transform: 'perspective(500px) rotateX(20deg) translateY(100px) scale(2)'
                  }}
                />

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      y: [0, -8, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 mx-auto mb-10 text-(--amber) group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(239,159,39,0.3)]"
                  >
                    <WrenchIcon strokeWidth={0.5} className="w-full h-full" />
                  </motion.div>

                  <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic group-hover:text-(--amber) transition-colors">
                    RESTOS_FÍSICOS
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="h-px w-4 bg-[#4a3a10]" />
                    <span className="text-[10px] font-mono text-(--text-muted) uppercase tracking-[0.3em]">Hardware Analysis</span>
                    <span className="h-px w-4 bg-[#4a3a10]" />
                  </div>
                  <p className="text-(--text-muted) font-mono text-[11px] leading-relaxed max-w-xs mx-auto uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    Herramientas, credenciales y fragmentos arquitectónicos del refugio.
                  </p>
                </div>

                {/* Corners */}
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-(--amber) opacity-40" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-(--amber) opacity-40" />
              </div>

              {/* Footer Button Simulation */}
              <div className="p-6 bg-[#0c1015] border-t border-[#1a1f26] group-hover:bg-[#1f1500] transition-colors flex justify-center">
                <span className="text-[10px] font-mono text-(--amber) font-bold uppercase tracking-[0.5em]">CARGAR_INVENTARIO</span>
              </div>
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  )
}
