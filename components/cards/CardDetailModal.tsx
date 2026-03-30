"use client"

import { ViewTransition } from 'react'
import { DataCartridge } from '@/components/cards/DataCartridge'
import type { Card } from '@/types/game'
import { useState, useEffect, useMemo, memo } from 'react'
import { NetworkIcon } from 'lucide-react'
import { CloseButton } from '../ui/CloseButton'
import { AnimatePresence, motion } from 'motion/react'

interface CardDetailModalProps {
  selectedCard: Card | null
  onClose: () => void
}

const BiosHeader = memo(({ onClose }: { onClose: () => void }) => (
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
))
BiosHeader.displayName = 'BiosHeader'

const HexReader = memo(() => {
  const hexLines = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      addr: (0x1000 + (i * 16)).toString(16).toUpperCase().padStart(8, '0'),
      data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(' '),
      ascii: Array.from({ length: 8 }, () => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('')
    })), [])

  return (
    <div className="text-(--green-base) flex flex-col gap-1 font-mono text-[10px] sm:text-xs pt-4 animate-[fade-in-up_0.5s_ease-out_forwards]">
      <div className="mb-4 bg-(--green-base) text-black inline-block px-2 py-1 w-fit font-bold tracking-[0.2em]">
        LEYENDO VOLCADO DE MEMORIA...
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-4 opacity-70">
        <div className="flex flex-col text-(--green-muted)/50 select-none">
          {hexLines.map((line, i) => <span key={i}>{line.addr}</span>)}
        </div>
        <div className="flex flex-col tracking-widest">
          {hexLines.map((line, i) => (
            <div key={i} className="animate-[fade-in-up_0.3s_ease-out_both]" style={{ animationDelay: `${i * 50}ms` }}>
              {line.data}
              <span className="ml-4 text-(--green-muted)/30">{line.ascii}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 animate-[fade-in-up_0.3s_ease-out_both]" style={{ animationDelay: '700ms' }}>
        {">"} FIRMA DETECTADA. RECONSTRUYENDO... <span className="animate-ping">█</span>
      </div>
    </div>
  )
})
HexReader.displayName = 'HexReader'

export function CardDetailModal({ selectedCard, onClose }: CardDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'logic' | 'human'>('logic')
  const [isReading, setIsReading] = useState(true)

  useEffect(() => {
    if (selectedCard) {
      setIsReading(true)
      setActiveTab('logic')
      const timer = setTimeout(() => setIsReading(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [selectedCard])

  if (!selectedCard) return null

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8 bg-black/95 animate-[fade-in-up_0.25s_ease-out_forwards]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-7xl h-full max-h-[85vh] bg-[#05070a] border border-[#1a202c] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] rounded-md"
      >
        {/* ═══════════ PANEL IZQUIERDO: BAHÍA DE HARDWARE ═══════════ */}
        <div className="w-full h-[50%] md:h-full md:w-[40%] bg-[#020304] relative border-b md:border-b-0 md:border-r-2 border-[#1a202c] flex flex-col items-center justify-end overflow-hidden pb-4 z-20 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.8)]">

          <div className="absolute top-6 left-6 font-mono text-[10px] text-white/30 uppercase tracking-[0.4em] z-10 flex items-center gap-2">
            <NetworkIcon className="w-4 h-4 text-(--green-base)" />
            BAHÍA_LECTURA::RBT-B22
          </div>

          <div className="relative z-20 flex flex-col items-center justify-end h-full pt-16 mt-8">
            <div className="relative z-10 flex justify-center mt-auto pb-16">
              {/* ViewTransition: Same name as rack → React morphs the element */}
              <ViewTransition name={`cartridge-${selectedCard.id}`}>
                <div className="relative group perspective-[1500px]">
                  <DataCartridge
                    card={selectedCard}
                    isPowered={!isReading}
                    detailed={true}
                    className="w-[260px] h-[360px] md:w-[350px] md:h-[520px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] relative z-1"
                  />
                </div>
              </ViewTransition>

              {/* El Slot (La Ranura Física - CON ANIMACIÓN DE LECTURA CONTINUA) */}
              <div className="absolute z-9999 -bottom-4 left-1/2 -translate-x-1/2 w-[340px] md:w-[420px] h-40 bg-[#0a0d10] border-t-[6px] border-x-4 border-[#151b24] shadow-[0_-30px_60px_rgba(0,0,0,1)] flex flex-col items-center justify-start pt-4 rounded-t-sm overflow-hidden animate-[slide-up_0.5s_ease-out_0.3s_both]">

                {/* Bisel superior metálico */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-white/10" />

                {/* Tornillos Industriales y Chapa */}
                <div className="w-full px-6 flex justify-between items-center mb-4 opacity-60">
                  <div className="w-3 h-3 rounded-full bg-[#05070a] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_1px_0_rgba(255,255,255,0.05)] border border-[#1a202c] flex items-center justify-center">
                    <div className="w-full h-px bg-[#1a202c] rotate-45" />
                  </div>

                  <div className="border border-white/10 px-4 py-0.5 bg-black/60 shadow-[inset_0_0_5px_rgba(0,0,0,1)] flex items-center gap-2">
                    <span className="text-[8px] font-mono font-black tracking-[0.4em] text-white/40 uppercase">
                      BAHÍA_RECEPTORA_0x44
                    </span>
                  </div>

                  <div className="w-3 h-3 rounded-full bg-[#05070a] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_1px_0_rgba(255,255,255,0.05)] border border-[#1a202c] flex items-center justify-center">
                    <div className="w-full h-px bg-[#1a202c] -rotate-45" />
                  </div>
                </div>

                {/* LA RANURA PROFUNDA (El hueco donde entra el cartucho) */}
                <div className="w-[88%] h-8 bg-black shadow-[inset_0_15px_20px_rgba(0,0,0,1),0_2px_0_rgba(255,255,255,0.05)] rounded-sm border-t border-[#05070a] relative flex items-center justify-center overflow-hidden">

                  <div className="absolute top-0 inset-x-0 h-4 bg-linear-to-b from-black to-transparent z-20" />

                  {/* Resplandor de fondo que palpita suavemente */}
                  <div className={`absolute bottom-0 inset-x-0 h-5 blur-md transition-colors duration-500 z-0 ${isReading ? 'bg-(--amber)/40 animate-pulse' : 'bg-(--green-base)/20'}`} />

                  {/* Pines de conexión (Con flujo de datos continuo) */}
                  <div className="w-[85%] h-full flex justify-between items-end pb-0.5 gap-[2px] z-10">
                    {[...Array(20)].map((_, i) => {
                      // Creamos un patrón de onda matemática para el delay y la duración
                      const delay = (i % 4) * 0.2;
                      const duration = 1.5 + (i % 3) * 0.5;

                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-[1px] transition-colors border-t border-x
                              ${isReading
                              ? 'h-4/5 bg-amber-500 border-amber-300 shadow-[0_0_8px_var(--amber)]'
                              // Cuando NO está leyendo agresivamente, se queda en verde con un flujo sutil
                              : 'h-2/3 bg-(--green-base)/70 border-(--green-base) shadow-[0_0_4px_var(--green-base)]'
                            }`}
                          // Esta animación CSS inline hace que los pines "respiren" independientemente unos de otros
                          style={{ animation: `pulse ${duration}s cubic-bezier(0.4, 0, 0.6, 1) infinite ${delay}s` }}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Cinta de advertencia industrial */}
                <div className="w-full h-1 mt-5 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#eab308_10px,#eab308_20px)] border-y border-white/5" />

                {/* PANEL INFERIOR DE INDICADORES (Mecánico) */}
                <div className="flex w-full px-6 justify-between items-center bg-[#06080b] flex-1 border-t border-[#1a202c]/50 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">

                  <div className="flex items-center gap-5">

                    {/* CLUSTER DE LEDs FÍSICOS */}
                    <div className="flex gap-3 bg-[#020304] p-1.5 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] border border-[#1a202c]">

                      {/* PWR (Power) - LED Rojo fijo */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_5px_red,inset_0_0_2px_white]" />
                        <span className="text-[5px] text-white/30 font-bold font-mono">PWR</span>
                      </div>

                      {/* LNK (Link) - LED Verde o Ámbar */}
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full transition-colors ${isReading ? 'bg-(--amber) shadow-[0_0_8px_var(--amber),inset_0_0_2px_white]' : 'bg-(--green-light) shadow-[0_0_8px_var(--green-light),inset_0_0_2px_white]'}`} />
                        <span className="text-[5px] text-white/30 font-bold font-mono">LNK</span>
                      </div>

                      {/* ACT (Activity) - LED que parpadea rápido simulando lectura de disco */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${isReading ? 'bg-(--amber)' : 'bg-(--cyan)'} shadow-[0_0_8px_currentColor,inset_0_0_2px_white]`}
                          // Parpadeo errático súper rápido (0.2s)
                          style={{ animation: 'pulse 0.2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate' }}
                        />
                        <span className="text-[5px] text-white/30 font-bold font-mono">ACT</span>
                      </div>

                    </div>

                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/30 tracking-widest uppercase mb-0.5 font-bold">ESTADO_ENLACE</span>
                      <span className={`text-[11px] font-mono font-black tracking-[0.2em] uppercase ${isReading ? 'text-(--amber)' : 'text-(--green-light)'}`}>
                        {isReading ? 'DESCIFRANDO...' : 'TRANSMITIENDO'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end border-l border-[#1a202c] pl-4 h-full justify-center">
                    <span className="text-[7px] text-white/30 tracking-widest uppercase mb-0.5 font-bold">SECTOR_DOCK</span>
                    <span className="text-[11px] font-mono font-black text-white/50 tracking-widest">P-B22</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ PANEL DERECHO: TERMINAL UNIX / BIOS ═══════════ */}
        <div className="flex-1 bg-[#020202] relative flex flex-col z-10 font-mono text-sm md:text-base uppercase selection:bg-(--green-base) selection:text-black overflow-hidden border-l-2 border-[#111]">

          {/* Malla de Fósforo y Viñetado de Monitor Viejo */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,1)_100%),linear-gradient(rgba(0,255,0,0.05)_50%,transparent_50%)] bg-size[100%_100%,100%_4px] z-40" />

          {/* HEADER UNIX CON BOTÓN DE CERRAR */}
          <header className="p-4 md:p-6 shrink-0 bg-[#050505] border-b border-[#1a1a1a] flex justify-between items-center z-30">
            <div className="flex items-center gap-3">
              <span className="text-(--green-base) font-bold tracking-[0.2em] text-xs md:text-sm flex items-center gap-2 normal-case">
                <span className="w-2 h-4 bg-(--green-base) inline-block shadow-[0_0_8px_var(--green-base)]" />
                /dev/tty1
              </span>
            </div>
            {/* BOTÓN DE DESCONEXIÓN (SIGKILL) */}
            <button
              onClick={onClose}
              className="group flex items-center gap-2 bg-red-950/30 border border-red-900/80 px-4 py-1.5 text-red-500 hover:bg-red-900 hover:text-white transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:shadow-[0_0_8px_white] animate-pulse" />
              <span className="font-black tracking-widest text-[10px] md:text-xs">SIGKILL [X]</span>
            </button>
          </header>

          {/* CONTENIDO PRINCIPAL SCROLLABLE */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 z-20 relative text-xs md:text-sm font-mono text-(--green-base)">
            <AnimatePresence mode="wait">
              {isReading ? (
                <motion.div
                  key="reading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <HexReader />
                </motion.div>
              ) : (
                <motion.div
                  key="console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6 pt-4"
                >

                  {/* SIMULACIÓN DE COMANDO Y METADATOS */}
                  <div className="flex flex-col gap-2">
                    <div className="text-white/60 font-bold normal-case">
                      <span className="text-(--green-light)">root@frag-os</span>:<span className="text-(--cyan)">/sys/dock</span># ./read_cartridge.sh --port B22
                    </div>
                    <div className="pl-2 border-l-2 border-(--green-base)/30 py-1 flex flex-col gap-1 ml-2 text-[10px] md:text-xs">
                      <div className="flex"><span className="w-24 text-(--green-base)/50">ID_BLOQUE</span> <span className="text-white">[{selectedCard.id}]</span></div>
                      <div className="flex"><span className="w-24 text-(--green-base)/50">CATEGORÍA</span> <span className="text-white">[{selectedCard.rarity || 'LÓGICA'}]</span></div>
                      <div className="flex"><span className="w-24 text-(--green-base)/50">ESTADO</span> <span className={selectedCard.rarity === 'legendary' ? 'text-amber-500 font-bold' : 'text-(--green-light) font-bold'}>[{selectedCard.rarity === 'legendary' ? 'INTRUSIVO' : 'ESTABLE'}]</span></div>
                    </div>
                  </div>

                  {/* TÍTULO Y CONCEPTO */}
                  <div className="flex flex-col gap-1">
                    <div className="text-(--green-base)/30">========================================================</div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none my-2">
                      {selectedCard.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-(--cyan) text-xs md:text-sm font-bold tracking-widest uppercase">
                        &gt; CONCEPTO_RAÍZ: {selectedCard.concept}
                      </span>
                    </div>
                    <div className="text-(--green-base)/30">========================================================</div>
                  </div>

                  {/* SELECTORES DE PÁGINA */}
                  <div className="flex gap-4 text-xs font-bold tracking-[0.2em] mt-2">
                    <button
                      onClick={() => setActiveTab('logic')}
                      className={`px-3 py-1.5 cursor-pointer transition-colors border ${activeTab === 'logic' ? 'bg-(--green-base) text-black border-(--green-base)' : 'text-(--green-base) border-(--green-base)/30 hover:bg-(--green-base)/10'}`}
                    >
                      [1] DEF_TECNICA
                    </button>
                    <button
                      onClick={() => setActiveTab('human')}
                      className={`px-3 py-1.5 cursor-pointer transition-colors border ${activeTab === 'human' ? 'bg-amber-500 text-black border-amber-500' : 'text-amber-500 border-amber-500/30 hover:bg-amber-500/10'}`}
                    >
                      [2] ANALOGIA_HUMANA
                    </button>
                  </div>

                  {/* SALIDA DE DATOS PRINCIPAL */}
                  <div className="min-h-[80px] pl-2 mt-2">
                    {activeTab === 'logic' ? (
                      <div className="text-(--green-base) leading-relaxed normal-case">
                        <span className="text-(--green-base)/40 mr-3 select-none font-black">$</span>
                        {selectedCard.description}
                      </div>
                    ) : (
                      <div className="text-amber-500/90 leading-relaxed normal-case tracking-normal">
                        <span className="text-amber-500/40 mr-3 select-none font-black">$</span>
                        {selectedCard.humanExplanation}
                      </div>
                    )}
                  </div>

                  {/* BLOQUE DE CÓDIGO EJECUTABLE */}
                  {selectedCard.codeExample && (
                    <div className="border border-white/20 bg-black mt-4 relative font-mono">
                      <div className="bg-white/10 text-white/80 text-[10px] px-3 py-1 flex items-center justify-between border-b border-white/20 uppercase">
                        <span>GNU nano 6.2</span>
                        <span className="text-(--cyan) normal-case">/tmp/cartridge_exec.js</span>
                        <span className="text-white/40">Modificado</span>
                      </div>

                      <pre className="p-4 text-(--cyan) overflow-x-auto text-xs md:text-sm leading-loose normal-case tracking-normal">
                        <code className="block">
                          {selectedCard.codeExample.split('\n').map((line, i) => (
                            <span key={i} className="block hover:bg-white/5 px-2 transition-colors">
                              {line || ' '}
                            </span>
                          ))}
                        </code>
                      </pre>

                      <div className="bg-white/10 text-white/60 text-[10px] px-3 py-1.5 flex items-center justify-start gap-6 border-t border-white/20 normal-case">
                        <span><b className="text-white">^G</b> Ayuda</span>
                        <span><b className="text-white">^O</b> Guardar</span>
                        <span><b className="text-white">^W</b> Buscar</span>
                        <span><b className="text-white">^X</b> Salir</span>
                      </div>
                    </div>
                  )}

                  {/* INYECCIÓN DE SISTEMA FRAG */}
                  {selectedCard.tip && (
                    <div className="mt-6 flex flex-col gap-1">
                      <div className="text-(--purple) text-[10px] md:text-xs font-bold tracking-widest normal-case">
                        Broadcast message from root@frag-os (tty1):
                      </div>
                      <div className="border-l-2 border-(--purple) bg-(--purple)/5 p-4 text-(--purple) text-xs md:text-sm normal-case tracking-normal leading-relaxed">
                        <div className="font-bold uppercase tracking-[0.3em] mb-2 text-[10px] opacity-70">
                          --- [ TIP_01 : LEY_LÓGICA ] ---
                        </div>
                        {selectedCard.tip}
                      </div>
                    </div>
                  )}

                  {/* Prompt parpadeante al final */}
                  <div className="text-(--green-base)/60 text-left tracking-widest mt-8 mb-2 flex items-center gap-2 normal-case">
                    <span>root@frag-os:<span className="text-(--cyan)">/sys/dock</span>#</span>
                    <span className="w-2 h-4 bg-(--green-base) animate-pulse inline-block" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER DE TELEMETRÍA */}
          <footer className="h-10 shrink-0 bg-[#050505] border-t border-[#1a1a1a] flex items-center justify-between px-6 font-mono text-[9px] md:text-[10px] tracking-[0.2em] z-30 uppercase text-(--green-muted)/60">
            <div className="flex items-center gap-4 h-full">
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
      </div>
    </div>
  )
}