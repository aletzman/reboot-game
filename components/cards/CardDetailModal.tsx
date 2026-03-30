import { DataCartridge } from '@/components/cards/DataCartridge'
import type { Card } from '@/types/game'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { NetworkIcon } from 'lucide-react'
import { CloseButton } from '../ui/CloseButton'

interface CardDetailModalProps {
  selectedCard: Card | null
  onClose: () => void
}

export function CardDetailModal({ selectedCard, onClose }: CardDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'logic' | 'human'>('logic')
  const [isReading, setIsReading] = useState(true)

  useEffect(() => {
    setIsReading(true)
    const timer = setTimeout(() => {
      setIsReading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [selectedCard])

  if (!selectedCard) return null

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8 bg-black/95"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-7xl h-full max-h-[85vh] bg-[#05070a] border border-[#1a202c] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] rounded-md"
      >
        {/* PANEL IZQUIERDO: BAHÍA DE HARDWARE (Dock Físico) */}
        <div className="w-full h-[50%] md:h-full md:w-[40%] bg-[#020304] relative border-b md:border-b-0 md:border-r-2 border-[#1a202c] flex flex-col items-center justify-end overflow-hidden pb-4 z-20 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.8)]">

          <div className="absolute top-6 left-6 font-mono text-[10px] text-white/30 uppercase tracking-[0.4em] z-10 flex items-center gap-2">
            <NetworkIcon className="w-4 h-4 text-(--green-base)" />
            BAHÍA_LECTURA::RBT-B22
          </div>

          {/* DOCKED CARTRIDGE & SLOT */}
          <div className="relative z-20 flex flex-col items-center justify-end h-full pt-16 mt-8">
            <div className="relative z-10 flex justify-center mt-auto pb-16">

              {/* La Tarjeta en sí */}
              <div className="relative group perspective-[1500px]">
                <DataCartridge
                  card={selectedCard}
                  isPowered={!isReading}
                  detailed={true}
                  viewTransitionId={`cartridge-${selectedCard.id}`}
                  className="w-[260px] h-[360px] md:w-[350px] md:h-[520px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] relative z-1"
                />
              </div>

              {/* El Slot (La Ranura Física) */}
              <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 15, delay: 0.5 }}
                className="absolute z-9999 -bottom-4 left-1/2 -translate-x-1/2 w-[340px] md:w-[420px] h-36 bg-[#080a0c] border-t-2 border-x-2 border-[#1a202c] shadow-[0_-20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col items-center justify-start pt-4 rounded-t-xl overflow-hidden"
              >
                {/* Metal Plate Detail */}
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-white/5 to-transparent" />

                {/* Labels and Screws */}
                <div className="w-full px-6 flex justify-between items-center mb-3 opacity-30">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
                  <span className="text-[8px] font-mono tracking-[0.5em] text-white">RECEPTOR_CRITICO_V4</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
                </div>

                {/* The actual insertion gap */}
                <div className="w-[92%] h-7 bg-[#010101] shadow-[inset_0_10px_20px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] rounded-sm border-t border-white/5 relative flex items-center justify-center overflow-hidden">
                  {/* Glow behind the card */}
                  <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${isReading ? 'bg-(--amber)' : 'bg-(--green-base)'}`} />

                  {/* Connection Pins/Teeth */}
                  <div className="absolute inset-x-0 bottom-0 h-[2px] flex justify-between px-4">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="w-px h-full bg-white/10" />
                    ))}
                  </div>

                  {/* Data Stream / Connection Animation inside slot */}
                  <div className="w-[60%] h-1 flex justify-between items-center gap-1.5">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          opacity: isReading ? [0.2, 1, 0.2] : 0.6,
                          scaleY: isReading ? [1, 1.5, 1] : 1
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                        className={`flex-1 h-full rounded-full transition-colors ${isReading ? 'bg-(--amber)' : 'bg-(--green-base)'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Status Panel */}
                <div className="flex w-full px-10 justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/30 tracking-tighter uppercase mb-0.5">ESTADO_ENLACE</span>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            scale: isReading ? [1, 1.2, 1] : 1,
                            opacity: isReading ? [1, 0.5, 1] : 1
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className={`w-2 h-2 rounded-full ${isReading ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)]' : 'bg-(--green-light) shadow-[0_0_8px_var(--green-light)]'}`}
                        />
                        <span className={`text-[10px] font-mono font-bold tracking-widest ${isReading ? 'text-(--amber)' : 'text-(--green-light)'}`}>
                          {isReading ? 'SINCRO...' : 'ESTABLE'}
                        </span>
                      </div>
                    </div>

                    <div className="h-6 w-px bg-white/5 mx-1" />

                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/30 tracking-tighter uppercase mb-0.5">VELOCIDAD_BUS</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {isReading ? '4.2 TB/s' : 'IDLE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[7px] text-white/30 tracking-tighter uppercase mb-0.5">SECTOR_DOCK</span>
                    <span className="text-[10px] font-mono text-white/60 uppercase">B-22_AUX</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: HERRAMIENTA DE DIAGNÓSTICO A BAJO NIVEL (BIOS/HEX) */}
        <div className="flex-1 bg-[#020202] relative flex flex-col z-10 font-mono text-sm md:text-base uppercase selection:bg-(--green-base) selection:text-black overflow-hidden border-l-2 border-[#111]">

          {/* Malla de Fósforo y Viñetado de Monitor Viejo */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,1)_100%),linear-gradient(rgba(0,255,0,0.05)_50%,transparent_50%)] bg-size-[100%_100%,100%_4px] z-40" />


          {/* BIOS HEADER */}
          <header className="p-5 md:p-6 shrink-0 bg-[#050505] border-b-2 border-[#1a1a1a]">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 md:gap-0 border-b border-white/5 pb-3 mb-3">
              <span className="text-(--green-base) font-bold tracking-[0.2em] animate-pulse flex items-center gap-3">
                <span className="w-2 h-4 bg-(--green-base) shadow-[0_0_8px_var(--green-base)] inline-block" />
                FRAG_SYS_DIAGNOSTIC_TOOL
              </span>

              <CloseButton onClick={onClose} />
            </div>

            <div className="flex gap-6 text-[9px] md:text-[10px] text-(--green-muted)/60 tracking-[0.2em]">
              <span className="flex gap-2"><span className="text-white/20">MEM:</span> 640K_OK</span>
              <span className="flex gap-2"><span className="text-white/20">SEC:</span> BOOT_0</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 z-20 relative text-xs md:text-sm">
            <AnimatePresence mode="wait">
              {isReading ? (
                // LECTURA HEXADECIMAL
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-(--green-base) flex flex-col gap-1 font-mono text-[10px] sm:text-xs pt-4"
                >
                  <div className="mb-4 bg-(--green-base) text-black inline-block px-2 py-1 w-fit font-bold tracking-[0.2em]">
                    LEYENDO VOLCADO DE MEMORIA...
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-4 opacity-70">
                    <div className="flex flex-col text-(--green-muted)/50 select-none">
                      {[...Array(12)].map((_, i) => (
                        <span key={i}>{(0x1000 + (i * 16)).toString(16).toUpperCase().padStart(8, '0')}</span>
                      ))}
                    </div>
                    <div className="flex flex-col tracking-widest">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          {Array.from({ length: 8 }, () => Math.random().toString(16).substring(2, 4).toUpperCase()).join(' ')}
                          <span className="ml-4 text-(--green-muted)/30">
                            {Array.from({ length: 8 }, () => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('')}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-4">
                    {">"} FIRMA DETECTADA. RECONSTRUYENDO... <span className="animate-ping">█</span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6 pt-4"
                >
                  {/* TABLA DE METADATOS */}
                  <div className="border border-(--green-base)/30 p-1 bg-black/50">
                    <div className="grid grid-cols-3 gap-1 text-[10px] md:text-xs tracking-widest text-(--green-base)">
                      <div className="border border-(--green-base)/20 p-2 bg-(--green-base)/5">
                        <span className="block text-(--green-muted)/40 mb-1">ID_BLOQUE</span>
                        <span className="font-bold text-white truncate">{selectedCard.id}</span>
                      </div>
                      <div className="border border-(--green-base)/20 p-2 bg-(--green-base)/5">
                        <span className="block text-(--green-muted)/40 mb-1">CATEGORÍA</span>
                        <span className="font-bold text-white">{selectedCard.rarity || 'LÓGICA'}</span>
                      </div>
                      <div className="border border-(--green-base)/20 p-2 bg-(--green-base)/5">
                        <span className="block text-(--green-muted)/40 mb-1">ESTADO</span>
                        <span className={selectedCard.rarity === 'legendary' ? 'text-amber-500 font-bold' : 'text-white font-bold'}>
                          {selectedCard.rarity === 'legendary' ? 'INTRUSIVO' : 'ESTABLE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TÍTULO Y CONCEPTO*/}
                  <div className="flex flex-col gap-1 mb-2 border-l-4 border-(--cyan) pl-4 py-1">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                      {selectedCard.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-(--cyan) text-xs md:text-sm font-bold tracking-widest uppercase">
                        {selectedCard.concept}
                      </span>
                    </div>
                  </div>


                  {/* SELECTORES DE PÁGINA */}
                  <div className="flex gap-1 text-xs font-bold tracking-[0.2em] border-b border-(--green-base)/30 pb-1 mt-2">
                    <button
                      onClick={() => setActiveTab('logic')}
                      className={`px-4 py-1 flex gap-2 cursor-pointer ${activeTab === 'logic' ? 'bg-(--green-base) text-black' : 'text-(--green-base)/40 hover:text-(--green-base) hover:bg-(--green-base)/10'}`}
                    >
                      <span>1.</span> DEFINICIÓN TÉCNICA
                    </button>
                    <button
                      onClick={() => setActiveTab('human')}
                      className={`px-4 py-1 flex gap-2 cursor-pointer ${activeTab === 'human' ? 'bg-amber-500 text-black' : 'text-amber-500/40 hover:text-amber-500 hover:bg-amber-500/10'}`}
                    >
                      <span>2.</span> ANALOGÍA HUMANA
                    </button>
                  </div>

                  {/* SALIDA DE DATOS PRINCIPAL */}
                  <div className="min-h-[80px] border-l-2 border-(--green-base)/30 pl-4 py-2">
                    {activeTab === 'logic' ? (
                      <div className="text-(--green-base) leading-relaxed">
                        <span className="text-(--green-base)/40 mr-2 select-none">{">"}</span>
                        {selectedCard.description}
                      </div>
                    ) : (
                      <div className="text-amber-500/90 leading-relaxed normal-case tracking-normal">
                        <span className="text-amber-500/40 mr-2 select-none uppercase font-black not-italic">{">"}</span>
                        "{selectedCard.humanExplanation}"
                      </div>
                    )}
                  </div>

                  {/* BLOQUE DE CÓDIGO EJECUTABLE */}
                  {selectedCard.codeExample && (
                    <div className="border-2 border-(--cyan)/30 bg-[#000508] mt-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 text-[8px] text-(--cyan)/30 p-1 font-mono leading-none pointer-events-none">
                        +--+<br />|JS|<br />+--+
                      </div>

                      <div className="bg-(--cyan)/15 text-(--cyan) text-[10px] tracking-[0.3em] px-3 py-1.5 flex items-center justify-between border-b border-(--cyan)/30 font-black">
                        <span>// SINTAXIS_EJECUTABLE</span>
                        <span className="opacity-50">[R/W]</span>
                      </div>

                      <pre className="p-4 text-(--cyan) overflow-x-auto text-xs md:text-sm leading-loose normal-case tracking-normal">
                        <code className="block">
                          {selectedCard.codeExample.split('\n').map((line, i) => (
                            <span key={i} className="block hover:bg-(--cyan)/10 px-2 transition-colors">
                              <span className="text-(--cyan)/30 select-none inline-block w-6 text-right mr-3 border-r border-(--cyan)/20 pr-2">
                                {i + 1}
                              </span>
                              {line || ' '}
                            </span>
                          ))}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* INYECCIÓN DE SISTEMA FRAG */}
                  {selectedCard.tip && (
                    <div className="border-2 border-(--purple) bg-[#0a000a] mt-4 p-1">
                      <div className="bg-(--purple) text-black font-black text-xs md:text-sm tracking-[0.2em] px-3 py-1 flex items-center justify-between">
                        <span>ANOTACIÓN_FRAG_OS</span>
                        <span>[ TIP_01 ]</span>
                      </div>
                      <div className="p-4 text-(--purple) flex gap-3 text-xs md:text-sm normal-case tracking-normal leading-relaxed">
                        <div className="select-none font-black text-lg mt-0.5">{">"}</div>
                        <p>{selectedCard.tip}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-(--green-base)/20 text-center tracking-[0.5em] mt-8 mb-2">
                    --- FIN_DE_TRANSMISIÓN ---
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER DE TELEMETRÍA*/}
          <footer className="h-10 shrink-0 bg-[#050505] border-t-2 border-[#1a1a1a] flex items-center justify-between px-6 font-mono text-[9px] md:text-[10px] tracking-[0.2em] z-30 uppercase text-(--green-muted)/60">
            <div className="flex items-center gap-4 h-full">
              {/* Indicador de conexión LED */}
              <div className="flex items-center gap-2 h-full px-4 border-x border-[#1a1a1a] bg-[#0a0a0a]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-white">LINK_ACTIVO</span>
              </div>
              <span>PRT://RBT-B22</span>
            </div>

            <div className="flex items-center gap-4 h-full">
              <span className="opacity-40 hidden sm:inline">I/O_SYNC_STABLE</span>
              <div className="h-full px-4 border-l border-[#1a1a1a] flex items-center bg-(--green-base)/10 text-(--green-base)">
                <span>MEM: 100%</span>
              </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  )
}