"use client"

import { motion } from 'motion/react'
import { WrenchIcon, CpuIcon, DatabaseIcon } from 'lucide-react'
import { SectorHeader } from '@/components/map/SectorHeader'
import { HubCard } from './HubCard'

export default function CollectionHubClient() {
  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) relative font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-(--bg-deep) opacity-50 z-0 select-none pointer-events-none overflow-hidden">
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
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <main className="flex-1 container mx-auto px-8 relative z-10 flex flex-col">
        <SectorHeader
          actId="DB"
          actName="ALMACÉN"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1 items-stretch max-w-7xl mx-auto w-full pb-20 mt-8">

          {/* Section: Cards - "Knowledge Modules" */}
          <HubCard
            href="/game/collection/cards"
            title="MODULOS DE DATOS"
            subtitle="Software Registry"
            description="MANUALES TÉCNICOS, ESTRUCTURAS DE CONTROL Y ALGORITMOS DE RESTAURACIÓN DE LA BASE DE DATOS PRINCIPAL."
            tag="RACK_01"
            id="DAT_REC"
            color="green"
            icon={CpuIcon}
            visualContent={
              <div className="relative flex items-center justify-center">
                {/* Orbital Rings */}
                <div className="absolute w-[280px] h-[280px] border border-(--green-base)/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[220px] h-[220px] border border-dashed border-(--green-base)/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute w-[160px] h-[160px] border border-(--green-base)/40 rounded-full" />

                {/* Main Icon with Glow */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1],
                    filter: ['drop-shadow(0 0 10px rgba(85,226,0,0.2))', 'drop-shadow(0 0 25px rgba(85,226,0,0.4))', 'drop-shadow(0 0 10px rgba(85,226,0,0.2))']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative z-10 w-32 h-32 text-(--green-light)"
                >
                  <CpuIcon strokeWidth={0.5} className="w-full h-full" />
                </motion.div>

                {/* Vertical Data Stream */}
                <div className="absolute h-96 w-px bg-linear-to-b from-transparent via-(--green-base) to-transparent opacity-20" />

                {/* Floating Bits */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-(--green-light) rounded-full shadow-[0_0_5px_var(--green-light)]"
                    animate={{
                      y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                      x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                  />
                ))}
              </div>
            }
          />

          {/* Section: Objects - "Found Artifacts" */}
          <HubCard
            href="/game/collection/objects"
            title="ARTEFACTOS RECUPERADOS"
            subtitle="Hardware Analysis"
            description="HERRAMIENTAS, CREDENCIALES Y FRAGMENTOS ARQUITECTÓNICOS RECUPERADOS DE LOS SECTORES EXTERNOS."
            tag="RACK_02"
            id="OBJ_REC"
            color="amber"
            icon={WrenchIcon}
            visualContent={
              <div className="relative flex items-center justify-center">
                {/* Heavy Industrial Grid */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(var(--bg-hover) 2px, transparent 2px), linear-gradient(90deg, var(--bg-hover) 2px, transparent 2px)`,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(600px) rotateX(45deg) scale(2)'
                  }}
                />

                {/* Magnetic Containment Field */}
                <div className="absolute w-[260px] h-[180px] border-2 border-dashed border-(--amber)/20 rounded-[40px] animate-pulse" />

                {/* Main Icon with Industrial Glow */}
                <motion.div
                  animate={{
                    rotate: [0, 2, -2, 0],
                    y: [0, -4, 0],
                    filter: ['drop-shadow(0 0 5px rgba(239,159,39,0.1))', 'drop-shadow(0 0 20px rgba(239,159,39,0.3))', 'drop-shadow(0 0 5px rgba(239,159,39,0.1))']
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="relative z-10 w-32 h-32 text-(--amber)"
                >
                  <WrenchIcon strokeWidth={0.5} className="w-full h-full" />
                </motion.div>

                {/* Mechanical Support Arms (Visual decoration) */}
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-white/5 opacity-40 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-white/5 opacity-40 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform" />

                {/* Vertical Scanning Beam */}
                <motion.div
                  className="absolute inset-x-0 h-[2px] bg-(--amber) shadow-[0_0_15px_var(--amber)] z-20 pointer-events-none opacity-0 group-hover:opacity-40"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
            }
          />

          {/* Section: Empty Rack Slot */}
          <HubCard
            href="#"
            title="VACÍO"
            subtitle="Unknown Archive"
            description="SIN REGISTROS."
            tag="RACK_03"
            id="NULL_PTR"
            color="green"
            icon={DatabaseIcon}
            isEmpty={true}
            visualContent={
              <div className="relative w-24 h-24 border border-white/5 opacity-20" />
            }
          />

        </div>
      </main>
    </div>
  )
}
