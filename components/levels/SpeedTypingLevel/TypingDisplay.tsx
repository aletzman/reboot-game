'use client'

import { SpeedTypingState } from '@/types/game'
import { getLineColor, getCharColor } from './utils'

interface TypingDisplayProps {
    typingState: SpeedTypingState
}

export function TypingDisplay({ typingState }: TypingDisplayProps) {
    const { lines, currentLineIndex } = typingState

    return (
        <div className="bg-(--bg-surface) border border-(--bg-hover) rounded-xs p-5 font-mono text-sm leading-loose relative">
            {lines.map((line, lineIdx) => {
                const isActive = lineIdx === currentLineIndex
                return (
                    <div
                        key={lineIdx}
                        className={`flex items-center gap-4 transition-all duration-300 relative group px-2 rounded-xs ${
                            isActive 
                            ? 'bg-(--green-base)/5 scale-[1.01] z-10 shadow-[0_0_20px_rgba(85,226,0,0.05)]' 
                            : 'opacity-60'
                        }`}
                    >
                        {/* Indicador de línea activa lateral */}
                        {isActive && (
                            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-(--green-light) shadow-[0_0_10px_var(--green-light)] animate-pulse" />
                        )}

                        {/* Número de línea */}
                        <span className={`text-[11px] min-w-[2ch] text-right select-none transition-colors ${
                            isActive ? 'text-(--green-light) font-bold' : 'text-(--text-ghost)'
                        }`}>
                            {lineIdx + 1}
                        </span>

                        {/* Indicador de estado */}
                        <span
                            className={`text-[10px] min-w-[14px] flex items-center justify-center ${
                                line.correct === true ? 'text-(--green-light)' :
                                line.correct === false ? 'text-(--red)' :
                                isActive ? 'text-(--green-base) animate-pulse' : 'text-transparent'
                            }`}
                        >
                            {line.correct === true ? '✓' : line.correct === false ? '✗' : isActive ? '▶' : ''}
                        </span>

                        {/* Texto con coloreado por carácter */}
                        <span 
                            className={`transition-all duration-200 ${isActive ? 'translate-x-1' : ''}`}
                            style={{ color: getLineColor(line, lineIdx, currentLineIndex) }}
                        >
                            {isActive ? (
                                line.text.split('').map((char, charIdx) => (
                                    <span
                                        key={charIdx}
                                        className="relative"
                                        style={{
                                            color: getCharColor(char, charIdx, lineIdx, currentLineIndex, line.typed),
                                            transition: 'color .1s',
                                        }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))
                            ) : (
                                <span className="opacity-80">
                                    {line.text || '\u00A0'}
                                </span>
                            )}
                            
                            {/* Cursor en la línea activa */}
                            {isActive && (
                                <span className="inline-block w-1.5 h-4 bg-(--green-light) align-middle ml-1 shadow-[0_0_8px_var(--green-light)] animate-[cursorBlink_0.8s_step-end_infinite]" />
                            )}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
