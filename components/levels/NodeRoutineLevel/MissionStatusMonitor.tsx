'use client'

import React from 'react'

type MissionState = "idle" | "playing" | "success" | "failed" | "reviewing"

export function MissionStatusMonitor({ status }: { status: MissionState }) {

    const config = {
        idle: { etiqueta: "EN_ESPERA", bg: "bg-white/5", texto: "text-(--text-ghost)", progreso: 0 },
        playing: { etiqueta: "EN_CURSO", bg: "bg-(--green-darkest)/40", texto: "text-(--green-light)", progreso: 100 },
        success: { etiqueta: "COMPLETADA", bg: "bg-(--cyan)/20", texto: "text-(--cyan)", progreso: 100 },
        failed: { etiqueta: "FALLIDA", bg: "bg-red-950/40", texto: "text-red-500", progreso: 100 },
        reviewing: { etiqueta: "REVISIÓN", bg: "bg-(--amber)/20", texto: "text-(--amber)", progreso: 100 }
    }

    const activo = config[status]

    return (
        <div className={`relative h-16 border border-white/10 ${activo.bg} flex items-center px-4 overflow-hidden`}>

            {/* Barra de progreso de fondo (muy sutil) */}
            <div
                className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-1000 ${activo.texto.replace('text', 'bg')}`}
                style={{ width: `${activo.progreso}%` }}
            />

            {/* Indicador lateral de color sólido */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${activo.texto.replace('text', 'bg')}`} />

            <div className="flex flex-col z-10">
                <div className="flex items-baseline gap-3">
                    <h2 className={`text-2xl font-black tracking-tighter ${activo.texto}`}>
                        {activo.etiqueta}
                    </h2>
                    {status === 'playing' && (
                        <span className="flex gap-1 mb-1">
                            <div className="w-1 h-1 bg-(--green-light) animate-[pulse_0.4s_infinite]" />
                            <div className="w-1 h-1 bg-(--green-light) animate-[pulse_0.4s_infinite_0.1s]" />
                            <div className="w-1 h-1 bg-(--green-light) animate-[pulse_0.4s_infinite_0.2s]" />
                        </span>
                    )}
                </div>
            </div>

            {/* Información de registro en la esquina derecha */}
            <div className="ml-auto text-right z-10">
                <span className="block text-[10px] font-black opacity-40">VER. 2157.04</span>
            </div>
        </div>
    )
}