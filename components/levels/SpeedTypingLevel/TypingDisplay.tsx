'use client'

import { SpeedTypingState } from '@/types/game'
import { getLineColor, getCharColor } from './utils'

interface TypingDisplayProps {
    typingState: SpeedTypingState
}

export function TypingDisplay({ typingState }: TypingDisplayProps) {
    const { lines, currentLineIndex } = typingState

    return (
        <div className="bg-(--bg-surface) border border-(--bg-hover) rounded-lg p-5 font-mono text-sm leading-loose">
            {lines.map((line, lineIdx) => (
                <div
                    key={lineIdx}
                    className={`flex items-center gap-4 transition-opacity ${
                        lineIdx > currentLineIndex + 2 ? 'opacity-30' : 'opacity-100'
                    }`}
                >
                    {/* Número de línea */}
                    <span className="text-(--text-ghost) text-[11px] min-w-[1.5ch] text-right select-none">
                        {lineIdx + 1}
                    </span>

                    {/* Indicador de estado */}
                    <span 
                        className={`text-[10px] min-w-[12px] ${
                            line.correct === true ? 'text-(--green-light)' :
                            line.correct === false ? 'text-(--red)' :
                            lineIdx === currentLineIndex ? 'text-(--green-base)' : 'text-transparent'
                        }`}
                    >
                        {line.correct === true ? '✓' : line.correct === false ? '✗' : lineIdx === currentLineIndex ? '▶' : ''}
                    </span>

                    {/* Texto con coloreado por carácter */}
                    <span style={{ color: getLineColor(line, lineIdx, currentLineIndex) }}>
                        {lineIdx === currentLineIndex ? (
                            line.text.split('').map((char, charIdx) => (
                                <span
                                    key={charIdx}
                                    style={{
                                        color: getCharColor(char, charIdx, lineIdx, currentLineIndex, line.typed),
                                        transition: 'color .1s',
                                    }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))
                        ) : (
                            line.text || '\u00A0'
                        )}
                        {/* Cursor en la línea activa */}
                        {lineIdx === currentLineIndex && (
                            <span className="inline-block w-0.5 h-4 bg-(--green-light) align-middle ml-px animate-[cursorBlink_0.8s_step-end_infinite]" />
                        )}
                    </span>
                </div>
            ))}
        </div>
    )
}
