'use client'

import React from 'react'
import Link from 'next/link'
import { Activity, ChevronLeft } from 'lucide-react'
import type { Level, LevelState } from '@/types/game'
import { Screw } from '../ui/Screw'
import { motion } from 'motion/react'

interface LevelHeaderProps {
    level: Level
    status: LevelState['status']
    isRunning: boolean
    children?: React.ReactNode
}

export function LevelHeader({ level, status, isRunning, children }: LevelHeaderProps) {
    const statusColor = status === 'success' ? 'var(--green-base)' : status === 'failed' ? 'var(--red)' : isRunning ? 'var(--amber)' : 'var(--text-primary)';

    return (
        <div className="flex flex-col md:flex-row items-stretch border-b border-(--border-color) bg-(--bg-void) relative z-20 ">


            {/* ─── COMPARTIMENTO 01: RETORNO (Hundido) ─── */}
            <Link
                href={`/game/${level.act}`}
                className="group/act flex flex-row items-center justify-center gap-1 py-2 px-1 border-b md:border-b-0 md:border-r border-(--border-color) min-w-[90px] bg-(--bg-deep) hover:bg-(--bg-elevated) active:bg-black transition-all relative overflow-hidden"
                title={`Volver a ${level.actName}`}
            >
                {/* Textura de agarre metálico (Grip) */}
                <div className="absolute inset-[4px] opacity-[0.15] bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)] pointer-events-none group-hover/act:opacity-30 transition-opacity" />

                {/* Bisel interno para dar profundidad de botón físico presionado */}
                <div className="absolute inset-[4px] border-t border-l border-b border-r border-white/5 rounded-bl-sm rounded-tl-sm shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] pointer-events-none" />

                <ChevronLeft size={22} className="text-(--text-muted) group-hover/act:text-(--amber) group-hover/act:-translate-x-1 transition-all relative z-10" />
                <div className="flex flex-col items-center justify-center relative z-10 mt-1">
                    <span className="text-[11px] font-mono font-black text-(--text-ghost) tracking-widest uppercase">RETORNO</span>
                    <span className="text-md font-mono font-black text-(--text-muted) leading-none group-hover/act:text-white mt-0.5">
                        {level.act.toString().padStart(2, '0')}
                    </span>
                </div>
            </Link>

            {/* ─── COMPARTIMENTO 02: PLACA DE IDENTIFICACIÓN (Efecto Fresado) ─── */}
            <div className="relative flex-1 flex flex-col justify-center px-8 py-3 border-b md:border-b-0 md:border-r border-(--border-color) bg-(--bg-surface) overflow-hidden">

                {/* ESTRUCTURA DE PANEL (EL BISEL - Identidad SectionHeader) */}
                <div className="absolute inset-[4px] border border-black/60 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_0_rgba(255,255,255,0.02)] pointer-events-none" />

                {/* Tornillos de anclaje */}
                <Screw corner="tl" size="sm" className="opacity-60" />
                <Screw corner="tr" size="sm" className="opacity-60" />
                <Screw corner="bl" size="sm" className="opacity-60" />
                <Screw corner="br" size="sm" className="opacity-60" />

                {/* ID Troquelado */}
                <span className="absolute top-1 right-2 text-6xl font-black font-mono text-(--text-ghost)/25 pointer-events-none select-none ">
                    {level.id}
                </span>

                <div className="relative z-10 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        {/* Indicador LED de Acto */}
                        <div className="w-1 h-3 bg-(--green-base) shadow-[0_0_10px_var(--green-base)] rounded-sm opacity-60" />
                        <span className="text-[10px] font-mono text-(--text-muted) uppercase tracking-[0.3em] font-bold">
                            {level.actName}
                        </span>
                    </div>
                    <h1 id="level-title" className="text-2xl md:text-[30px] font-(family-name:font-title) font-black text-white leading-none uppercase tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                        {level.title}
                    </h1>
                </div>
            </div>

            {/* ─── COMPARTIMENTO 03: TELEMETRÍA (Monitor CRT) ─── */}
            {children && <div className="flex items-center justify-between md:justify-end h-18 min-w-fit md:min-w-[320px] bg-(--bg-deep) relative gap-6">


                {/* Acciones del Header */}
                {children && (
                    <div className="flex items-center justify-center shrink-0 border-l border-(--border-color) w-full h-full">
                        {children}
                    </div>
                )}
            </div>}

        </div>
    )
}