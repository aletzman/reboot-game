import { TextLine, LINE_COLORS, LINE_PREFIX } from './types'

export function CompletedLine({ line, idx, isLast, isTypingDone }: {
    line: TextLine
    idx: number
    isLast: boolean
    isTypingDone: boolean
}) {
    if (line.text === '') return <div className="h-4" />


    return (
        <div
            className="flex items-baseline gap-3 py-[3px] group"
            style={{ animationDelay: `${idx * 30}ms` }}
        >
            {/* Número de línea */}
            <span
                className="select-none shrink-0 w-7 text-right text-[11px] leading-none"
                style={{ color: 'var(--text-ghost)', fontVariantNumeric: 'tabular-nums' }}
            >
                {String(idx + 1).padStart(2, '0')}
            </span>

            {/* Separador vertical */}
            <span className="shrink-0 w-px self-stretch" style={{ background: 'var(--bg-hover)' }} />

            {/* Prefijo de color */}
            <span
                className="shrink-0 text-[13px] leading-none select-none"
                style={{ color: LINE_COLORS[line.color], opacity: 0.7 }}
            >
                {LINE_PREFIX[line.color]}
            </span>

            {/* Texto */}
            <span
                className="leading-relaxed"
                style={{ color: LINE_COLORS[line.color], fontFamily: 'var(--font-mono)', fontSize: '15px' }}
            >
                {line.text}
                {isLast && isTypingDone && (
                    <span
                        className="inline-block w-[9px] h-[15px] align-middle ml-[6px] animate-cursor"
                        style={{ background: 'var(--green-light)', opacity: 0.9 }}
                    />
                )}
            </span>
        </div>
    )
}
