"use client"

import Link from 'next/link'
import { motion } from 'motion/react'
import { NavButton } from '@/components/ui/NavButton'
import { WrenchIcon, CpuIcon, DatabaseIcon, BoxIcon, ChevronLeftIcon } from 'lucide-react'

export default function CollectionHubClient() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-var(--header-height))] bg-(--bg-void) relative overflow-y-auto font-sans custom-scrollbar">
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

      <main className="flex-1 container mx-auto px-8 pb-12 pt-6 relative z-10 flex flex-col">
        <header className="mb-14 relative flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <NavButton href="/game" icon={ChevronLeftIcon}>
              VOLVER AL MAPA
            </NavButton>
          </div>

          <div className="w-full bg-linear-to-r from-[#0c1218] to-transparent border-l-4 border-(--green-base) p-6 rounded-r-md flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden shadow-xl">
            {/* Fondo simulando rejilla técnica sutil */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_3px)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_right,rgba(45,120,0,0.05),transparent_70%)] pointer-events-none" />

            {/* Decoración tech */}
            <div className="absolute top-0 left-0 w-8 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />
            <div className="absolute bottom-0 left-0 w-16 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse shadow-[0_0_8px_var(--green-base)]" />
                <span className="text-[10px] text-(--green-muted) uppercase font-black tracking-[0.4em] leading-none text-nowrap">
                  SYS.ARCHIVE // TERMINAL CENTRAL
                </span>
              </div>

              <div className="flex items-end gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-(family-name:--font-title) tracking-tighter text-white uppercase leading-none drop-shadow-md">
                  ARCHIVO<span className="text-(--green-light)">.</span>DB
                </h1>
                <div className="hidden lg:flex flex-col gap-0.5 opacity-20 mb-1">
                  <div className="w-16 h-1 bg-white" />
                  <div className="w-12 h-[2px] bg-white" />
                  <div className="flex gap-1 h-3 mt-0.5">
                    <div className="w-1 h-full bg-white" />
                    <div className="w-3 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-(--green-base)" />
                  </div>
                </div>
              </div>
              <p className="text-(--text-muted) max-w-xl font-mono text-[10px] leading-relaxed uppercase tracking-widest mt-2 opacity-80">
                Índice de fragmentos recuperados del proyecto <span className="text-white">GÉNESIS</span>.<br />
                Integridad de la base de datos: <span className="text-(--green-light) animate-pulse">SINCRO_ACTIVA</span>
              </p>
            </div>

            <div className="relative z-10 hidden md:flex flex-col items-end gap-2 bg-[#080c11] border border-[#1a2636] p-4 rounded-xs shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] min-w-[200px]">
              <div className="flex items-center gap-3 opacity-60">
                <DatabaseIcon className="w-8 h-8 text-(--green-light) animate-pulse" strokeWidth={1} />
                <div className="flex flex-col">
                  <span className="text-[8px] text-(--green-light) font-mono tracking-widest uppercase">CONNECTION_SECURE</span>
                  <span className="text-[14px] text-white font-mono tracking-widest uppercase font-black">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </header>

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

      {/* Retro HUD elements */}
      <div className="fixed top-1/2 -right-4 border border-(--bg-hover) bg-(--bg-surface) p-2 rotate-90 z-20 pointer-events-none flex gap-4 pr-6">
        <span className="text-[8px] font-mono text-(--text-ghost) uppercase tracking-widest">Buffer_Cache::OK</span>
        <span className="text-[8px] font-mono text-(--text-ghost) uppercase tracking-widest">Signal::99%</span>
      </div>

      {/* Footer info bar */}
      <div className="fixed bottom-0 inset-x-0 py-2 px-8 bg-(--bg-surface) border-t border-(--bg-hover) flex justify-between items-center z-20 pointer-events-none">
        <div className="flex gap-6 items-center">
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">SISTEMA: OPERACIONAL</span>
          <div className="w-px h-12 bg-(--bg-hover) hidden md:block" />
          <span className="text-[9px] font-mono text-(--green-muted) uppercase tracking-[0.2em] animate-pulse">MODO::ALMACENAMIENTO_EXTERNO</span>
        </div>
        <div className="flex gap-4">
          <div className="w-1 h-1 bg-(--green-light) rounded-full animate-ping" />
          <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-[0.2em]">REF::GEN_ARCH_2026</span>
        </div>
      </div>
    </div>
  )
}
